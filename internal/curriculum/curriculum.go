// Package curriculum, OBS'nin public ders planı sayfalarından her lisans
// programının güncel müfredatını (dönem dönem zorunlu/seçmeli dersler) çeker.
//
// Akış üç aşamalı:
//
//	GenelTanimlamalar/ProgramKodlariList?programSeviyeTipiId=2  -> program kodları ("BLG_LS")
//	DersPlan/DersPlanlariList?programKodu=BLG_LS&planTipiKodu=lisans -> o programın plan sürümleri (yıllara göre)
//	DersPlan/DersPlanDetay/<id>                                  -> son sürümün 8 dönemlik ders tablosu
//	DersPlan/_DersGrupSearch?grupId=<id>                          -> bir seçmeli slotun alternatif ders listesi
//
// Bir program birden çok plan sürümü listeler (örn. "2017-2018 Güz ile
// 2021-2022 Güz Dönemleri Arası"); son satır her zaman en güncel olanı, o
// yüzden yalnızca onu çekiyoruz — geçmiş müfredat sürümleri bu görselleştirme
// için gerekli değil.
package curriculum

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strings"
	"sync"

	"itu-scraper/internal/fetch"
)

const (
	programListURL = "https://obs.itu.edu.tr/public/GenelTanimlamalar/ProgramKodlariList?programSeviyeTipiId=2"
	planListURL    = "https://obs.itu.edu.tr/public/DersPlan/DersPlanlariList"
	planDetailURL  = "https://obs.itu.edu.tr/public/DersPlan/DersPlanDetay"
	groupSearchURL = "https://obs.itu.edu.tr/public/DersPlan/_DersGrupSearch"
)

type Program struct {
	Code    string // "BLG_LS"
	Name    string
	Faculty string
}

type Course struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

type Elective struct {
	Title   string   `json:"title"`
	Options []Course `json:"options"`
}

// Item, bir dönemdeki tek bir slot: ya sabit bir ders ya da bir seçmeli grup.
type Item struct {
	Course   *Course   `json:"course,omitempty"`
	Elective *Elective `json:"elective,omitempty"`
}

type Semester struct {
	Title string `json:"title"`
	Items []Item `json:"items"`
}

type Plan struct {
	ProgramCode string     `json:"programCode"`
	ProgramName string     `json:"programName"`
	Faculty     string     `json:"faculty"`
	PlanLabel   string     `json:"planLabel"`
	Semesters   []Semester `json:"semesters"`
}

type Client struct {
	f *fetch.Client

	mu     sync.Mutex
	groups map[string][]Course // grupId -> alternatifler, programlar arası paylaşılıyor
}

func New(f *fetch.Client) *Client {
	return &Client{f: f, groups: map[string][]Course{}}
}

var (
	rowRe    = regexp.MustCompile(`(?is)<tr>(.*?)</tr>`)
	cellRe   = regexp.MustCompile(`(?is)<td[^>]*>(.*?)</td>`)
	tagRe    = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe  = regexp.MustCompile(`\s+`)
	hrefRe   = regexp.MustCompile(`(?i)href="([^"]+)"`)
	h2Re     = regexp.MustCompile(`(?is)<h2[^>]*>(.*?)</h2>`)
	tableRe  = regexp.MustCompile(`(?is)<table[^>]*>(.*?)</table>`)
	grupIDRe = regexp.MustCompile(`grupId=(\d+)`)
	planIDRe = regexp.MustCompile(`DersPlanDetay/(\d+)`)
)

// Programs, tüm lisans programlarının kodunu ve fakültesini döndürür.
func (c *Client) Programs(ctx context.Context) ([]Program, error) {
	body, err := c.f.Text(ctx, programListURL)
	if err != nil {
		return nil, err
	}
	var out []Program
	faculty := ""
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 1 {
			faculty = clean(cells[0][1]) // fakülte başlık satırı
			continue
		}
		if len(cells) != 2 {
			continue
		}
		code := clean(cells[0][1])
		if code == "" || !strings.HasSuffix(code, "_LS") {
			continue // yalnızca lisans; ön/lisansüstü şimdilik kapsam dışı
		}
		out = append(out, Program{Code: code, Name: clean(cells[1][1]), Faculty: faculty})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("hiç lisans programı bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	return out, nil
}

// LatestPlanID, bir programın en güncel müfredat sürümünün detay ID'sini bulur.
func (c *Client) LatestPlanID(ctx context.Context, programCode string) (int, string, error) {
	url := fmt.Sprintf("%s?programKodu=%s&planTipiKodu=lisans", planListURL, programCode)
	body, err := c.f.Text(ctx, url)
	if err != nil {
		return 0, "", err
	}
	var lastID int
	var lastLabel string
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) != 2 {
			continue
		}
		href := hrefRe.FindStringSubmatch(cells[0][1])
		if href == nil {
			continue
		}
		m := planIDRe.FindStringSubmatch(href[1])
		if m == nil {
			continue
		}
		id := 0
		fmt.Sscanf(m[1], "%d", &id)
		if id > 0 {
			lastID = id
			lastLabel = clean(cells[1][1])
		}
	}
	if lastID == 0 {
		return 0, "", fmt.Errorf("%s: hiç plan sürümü bulunamadı", programCode)
	}
	return lastID, lastLabel, nil
}

// Plan, bir programın en güncel müfredatını tam olarak çeker (seçmeli grupları
// dahil).
func (c *Client) Plan(ctx context.Context, p Program) (*Plan, error) {
	planID, label, err := c.LatestPlanID(ctx, p.Code)
	if err != nil {
		return nil, err
	}
	body, err := c.f.Text(ctx, fmt.Sprintf("%s/%d", planDetailURL, planID))
	if err != nil {
		return nil, err
	}

	titles := h2Re.FindAllStringSubmatch(body, -1)
	tables := tableRe.FindAllStringSubmatch(body, -1)

	plan := &Plan{ProgramCode: p.Code, ProgramName: p.Name, Faculty: p.Faculty, PlanLabel: label}
	// İlk h2 program adı başlığı, dönem başlıkları ondan sonra geliyor;
	// ilk tablo da genelde ders bilgisi kutusu değil doğrudan 1. dönem —
	// sayıyı eşleştirip taşarsa kırpıyoruz.
	titleOffset := 1
	n := len(tables)
	if len(titles)-titleOffset < n {
		n = len(titles) - titleOffset
	}
	for i := 0; i < n; i++ {
		title := clean(titles[i+titleOffset][1])
		if !strings.Contains(title, "Yarıyıl") && !strings.Contains(title, "Yıl") {
			break // "Akademik Takvim" gibi plan dışı başlıklara geldik
		}
		sem := Semester{Title: title}
		for _, row := range rowRe.FindAllStringSubmatch(tables[i][1], -1) {
			cells := cellRe.FindAllStringSubmatch(row[1], -1)
			if len(cells) < 2 {
				continue
			}
			v := make([]string, len(cells))
			for j, cc := range cells {
				v[j] = clean(cc[1])
			}
			if v[0] == "Ders Kodu" {
				continue
			}
			if v[0] == "Dersler" {
				grp := grupIDRe.FindStringSubmatch(row[1])
				if grp == nil {
					continue
				}
				opts, err := c.group(ctx, grp[1])
				if err != nil {
					return nil, err
				}
				sem.Items = append(sem.Items, Item{Elective: &Elective{Title: v[1], Options: opts}})
				continue
			}
			sem.Items = append(sem.Items, Item{Course: &Course{Code: v[0], Name: v[1]}})
		}
		if len(sem.Items) > 0 {
			plan.Semesters = append(plan.Semesters, sem)
		}
	}
	return plan, nil
}

// group, bir seçmeli slotun alternatiflerini çeker; aynı grup birden fazla
// programda geçebildiği için sonucu önbelleğe alıyoruz.
func (c *Client) group(ctx context.Context, id string) ([]Course, error) {
	c.mu.Lock()
	if opts, ok := c.groups[id]; ok {
		c.mu.Unlock()
		return opts, nil
	}
	c.mu.Unlock()

	body, err := c.f.Text(ctx, fmt.Sprintf("%s?grupId=%s", groupSearchURL, id))
	if err != nil {
		return nil, err
	}
	var opts []Course
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 0 {
			continue
		}
		first := clean(cells[0][1])
		if first == "" || first == "Ders" {
			continue
		}
		parts := strings.Fields(first)
		if len(parts) < 3 {
			continue // "BLG 337E Başlık..." biçiminde değilse atla
		}
		code := parts[0] + " " + parts[1]
		name := strings.TrimSpace(strings.Join(parts[2:], " "))
		opts = append(opts, Course{Code: code, Name: name})
	}

	c.mu.Lock()
	c.groups[id] = opts
	c.mu.Unlock()
	return opts, nil
}

// ScrapeAll, tüm programların müfredatını eşzamanlı çeker. Bu sayfaların
// yapısı OBS'nin diğer tablolarından daha az standart (5 yıllık programlar,
// hazırlık dönemleri, çift ana dal planları...); tek bir programın sayfası
// beklenmedik çıkarsa tüm taramayı düşürmek yerine o programı atlayıp
// loglamayı tercih ediyoruz.
func (c *Client) ScrapeAll(ctx context.Context, programs []Program, workers int, warn func(string, ...any)) ([]*Plan, error) {
	jobs := make(chan Program)
	type result struct {
		plan *Plan
		err  error
		code string
	}
	results := make(chan result)
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for p := range jobs {
				plan, err := c.Plan(ctx, p)
				results <- result{plan, err, p.Code}
			}
		}()
	}
	go func() {
		defer close(jobs)
		for _, p := range programs {
			select {
			case jobs <- p:
			case <-ctx.Done():
				return
			}
		}
	}()
	go func() { wg.Wait(); close(results) }()

	var plans []*Plan
	for r := range results {
		if r.err != nil {
			if warn != nil {
				warn("  %s atlandı: %v", r.code, r.err)
			}
			continue
		}
		if len(r.plan.Semesters) > 0 {
			plans = append(plans, r.plan)
		}
	}
	return plans, nil
}

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}
