// Package curriculum, OBS'nin public ders planı sayfalarından her programın
// güncel müfredatını (dönem dönem zorunlu/seçmeli dersler) çeker.
//
// Akış üç aşamalı:
//
//	GenelTanimlamalar/ProgramKodlariList?programSeviyeTipiId=<id> -> program kodları ("BLG_LS", "BLG_HBY_YL")
//	DersPlan/DersPlanlariList?programKodu=X&planTipiKodu=<tip> -> o programın plan sürümleri (yıllara göre)
//	DersPlan/DersPlanDetay/<id>                                  -> son sürümün ders tablosu
//	DersPlan/_DersGrupSearch?grupId=<id>                          -> bir seçmeli slotun alternatif ders listesi
//
// Seviyeler OBS'de farklı parametrelerle geliyor:
//
//	1 = Önlisans (_OL)     planTipiKodu=on-lisans, dönem sütunları (lisans gibi)
//	2 = Lisans (_LS)       planTipiKodu=lisans
//	3 = Yüksek Lisans (_YL) planTipiKodu=yuksek-lisans, TEK düz tablo (dönem yok)
//	4 = Doktora (_DR)      planTipiKodu=doktora, TEK düz tablo (dönem yok)
//
// Lisans ve önlisans planları "1. Yarıyıl" başlıklı tablolara bölünmüş; yüksek
// lisans ve doktora ise dönem ayrımı olmayan tek bir düz liste — o programlar
// tek dönemli olarak saklanıyor.
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
	"strconv"
	"strings"
	"sync"

	"itu-scraper/internal/fetch"
)

const (
	programListURL = "https://obs.itu.edu.tr/public/GenelTanimlamalar/ProgramKodlariList"
	planListURL    = "https://obs.itu.edu.tr/public/DersPlan/DersPlanlariList"
	planDetailURL  = "https://obs.itu.edu.tr/public/DersPlan/DersPlanDetay"
	groupSearchURL = "https://obs.itu.edu.tr/public/DersPlan/_DersGrupSearch"
)

// Level, bir program seviyesinin OBS parametreleri. Seviye tipi ID'leri
// ProgramKodlariList'e, plan tipi kodları DersPlanlariList'e veriliyor.
type Level struct {
	Name      string // "OL", "LS", "YL", "DR"
	SeviyeID  int    // programSeviyeTipiId
	PlanTipi  string // planTipiKodu
	Suffix    string // program kodu soneki
	Flat      bool   // dönem tabloları yerine tek düz tablo (lisansüstü)
}

// Levels, desteklenen program seviyeleri. İkinci öğretim (ID 5) dahil değil:
// kodları yüksek lisansla (_YL) çakışıp aynı dosyayı ezebilir.
var Levels = []Level{
	{Name: "OL", SeviyeID: 1, PlanTipi: "on-lisans", Suffix: "_OL"},
	{Name: "LS", SeviyeID: 2, PlanTipi: "lisans", Suffix: "_LS"},
	{Name: "YL", SeviyeID: 3, PlanTipi: "yuksek-lisans", Suffix: "_YL", Flat: true},
	{Name: "DR", SeviyeID: 4, PlanTipi: "doktora", Suffix: "_DR", Flat: true},
}

func levelOf(name string) Level {
	for _, lv := range Levels {
		if lv.Name == name {
			return lv
		}
	}
	return Levels[1] // varsayılan: lisans
}

type Program struct {
	Code    string // "BLG_LS"
	Name    string
	Faculty string
	Level   string // "OL" | "LS" | "YL" | "DR"
}

// Course (Faz: Ders Planım) — plan satırındaki tüm kolonlar. Alan eklemeli,
// geriye uyumlu: eski {code,name} kayıtları yine okunur.
type Course struct {
	Code     string  `json:"code"`
	Name     string  `json:"name"`
	Language string  `json:"language,omitempty"` // ders dili
	Required string  `json:"required,omitempty"` // "Z" zorunlu | "S" seçmeli
	Credits  float64 `json:"credits,omitempty"`  // Kredi (Türkçe virgül → sayı)
	Ects     float64 `json:"ects,omitempty"`     // AKTS
	Theory   int     `json:"theory,omitempty"`   // Teo.
	Tutorial int     `json:"tutorial,omitempty"` // Uyg.
	Lab      int     `json:"lab,omitempty"`      // Lab.
	Type     string  `json:"type,omitempty"`     // TB/TM/MT/ITB/EC
}

type Elective struct {
	Title   string    `json:"title"`
	GroupID string    `json:"groupId,omitempty"` // _DersGrupSearch?grupId=
	Credits string    `json:"credits,omitempty"` // aralık olabilir: "3 / 4"
	Ects    []float64 `json:"ects,omitempty"`    // aralık: "4 / 5 / 6" → [4,5,6]
	Options []Course  `json:"options"`
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
	ProgramCode  string     `json:"programCode"`
	ProgramName  string     `json:"programName"`
	Faculty      string     `json:"faculty"`
	Level        string     `json:"level"`
	PlanLabel    string     `json:"planLabel"`
	TotalCredits string     `json:"totalCredits,omitempty"` // sayfa altı "Toplam Kredi"
	TotalEcts    string     `json:"totalEcts,omitempty"`    // sayfa altı "Toplam AKTS"
	Semesters    []Semester `json:"semesters"`
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
	totalKrediRe = regexp.MustCompile(`(?i)Toplam\s+Kredi[^0-9]*([0-9.,]+)`)
	totalEctsRe  = regexp.MustCompile(`(?i)Toplam\s+AKTS[^0-9]*([0-9.,]+)`)
)

// Programs, tüm seviyelerdeki programların kodunu, seviyesini ve fakültesini
// döndürür. Seviye tipi ID'leri kararlı olmadığı için ("hangisi önlisans,
// hangisi lisans" sorusunun cevabı siteden sitede değişiyor) her seviyeyi ayrı
// çekip program kodundaki sonekle (_OL, _LS, ...) doğruluyoruz.
func (c *Client) Programs(ctx context.Context) ([]Program, error) {
	var out []Program
	for _, lv := range Levels {
		ps, err := c.programsForLevel(ctx, lv)
		if err != nil {
			return nil, err
		}
		out = append(out, ps...)
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("hiç program bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	return out, nil
}

func (c *Client) programsForLevel(ctx context.Context, lv Level) ([]Program, error) {
	body, err := c.f.Text(ctx, fmt.Sprintf("%s?programSeviyeTipiId=%d", programListURL, lv.SeviyeID))
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
		if code == "" || !strings.HasSuffix(code, lv.Suffix) {
			continue
		}
		out = append(out, Program{Code: code, Name: clean(cells[1][1]), Faculty: faculty, Level: lv.Name})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("seviye %s (%d) için program bulunamadı — sayfa yapısı değişmiş olabilir", lv.Name, lv.SeviyeID)
	}
	return out, nil
}

// LatestPlanID, bir programın en güncel müfredat sürümünün detay ID'sini bulur.
func (c *Client) LatestPlanID(ctx context.Context, programCode string, lv Level) (int, string, error) {
	url := fmt.Sprintf("%s?programKodu=%s&planTipiKodu=%s", planListURL, programCode, lv.PlanTipi)
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
	lv := levelOf(p.Level)
	planID, label, err := c.LatestPlanID(ctx, p.Code, lv)
	if err != nil {
		return nil, err
	}
	body, err := c.f.Text(ctx, fmt.Sprintf("%s/%d", planDetailURL, planID))
	if err != nil {
		return nil, err
	}
	if lv.Flat {
		return c.parseFlatPlan(ctx, body, p, label)
	}

	titles := h2Re.FindAllStringSubmatch(body, -1)
	tables := tableRe.FindAllStringSubmatch(body, -1)

	plan := &Plan{ProgramCode: p.Code, ProgramName: p.Name, Faculty: p.Faculty, Level: p.Level, PlanLabel: label}
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
				sem.Items = append(sem.Items, Item{Elective: &Elective{
					Title: v[1], GroupID: grp[1], Credits: at(v, 4), Ects: parseEctsRange(at(v, 5)), Options: opts,
				}})
				continue
			}
			sem.Items = append(sem.Items, Item{Course: parseCourse(v)})
		}
		if len(sem.Items) > 0 {
			plan.Semesters = append(plan.Semesters, sem)
		}
	}
	plan.TotalCredits, plan.TotalEcts = planTotals(body)
	return plan, nil
}

// parseFlatPlan, yüksek lisans ve doktora programlarının tek düz tablosunu
// tek bir "dönem"e indirger. Bu programlarda dönem ayrımı yok — ders listesi
// tek tabloda duruyor ve seçmeli gruplar yine "Dersler" satırlarıyla geliyor.
func (c *Client) parseFlatPlan(ctx context.Context, body string, p Program, label string) (*Plan, error) {
	// Sayfada yardımcı tablolar da olabiliyor; en çok satırlı olanı ana liste
	// sayıyoruz.
	tables := tableRe.FindAllStringSubmatch(body, -1)
	var best string
	bestRows := -1
	for _, t := range tables {
		if n := len(rowRe.FindAllStringSubmatch(t[1], -1)); n > bestRows {
			best, bestRows = t[1], n
		}
	}
	if best == "" {
		return nil, fmt.Errorf("%s: plan tablosu bulunamadı", p.Code)
	}

	sem := Semester{Title: p.Name}
	for _, row := range rowRe.FindAllStringSubmatch(best, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) < 2 {
			continue
		}
		v := make([]string, len(cells))
		for j, cc := range cells {
			v[j] = clean(cc[1])
		}
		first := v[0]
		if first == "" || first == "Ders Kodu" {
			continue
		}
		if first == "Dersler" {
			grp := grupIDRe.FindStringSubmatch(row[1])
			if grp == nil {
				continue
			}
			opts, err := c.group(ctx, grp[1])
			if err != nil {
				return nil, err
			}
			sem.Items = append(sem.Items, Item{Elective: &Elective{
				Title: v[1], GroupID: grp[1], Credits: at(v, 4), Ects: parseEctsRange(at(v, 5)), Options: opts,
			}})
			continue
		}
		sem.Items = append(sem.Items, Item{Course: parseCourse(v)})
	}

	plan := &Plan{ProgramCode: p.Code, ProgramName: p.Name, Faculty: p.Faculty, Level: p.Level, PlanLabel: label}
	if len(sem.Items) > 0 {
		plan.Semesters = append(plan.Semesters, sem)
	}
	plan.TotalCredits, plan.TotalEcts = planTotals(body)
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

// at, satır vektörünün i. elemanını döndürür (taşarsa boş).
func at(v []string, i int) string {
	if i < len(v) {
		return v[i]
	}
	return ""
}

// num, "4,5" gibi Türkçe ondalık virgülü sayıya çevirir; boşsa 0.
func num(s string) float64 {
	s = strings.ReplaceAll(strings.TrimSpace(s), ",", ".")
	if s == "" {
		return 0
	}
	f, _ := strconv.ParseFloat(s, 64)
	return f
}

// parseCourse, plan tablosu satırından Course üretir. Kolonlar: kod, ad, dil,
// Z/S, kredi, AKTS, teo, uyg, lab, tür (Faz: Ders Planım).
func parseCourse(v []string) *Course {
	return &Course{
		Code: at(v, 0), Name: at(v, 1), Language: at(v, 2), Required: at(v, 3),
		Credits: num(at(v, 4)), Ects: num(at(v, 5)),
		Theory: int(num(at(v, 6))), Tutorial: int(num(at(v, 7))), Lab: int(num(at(v, 8))),
		Type: at(v, 9),
	}
}

// planTotals, sayfa altındaki "Toplam Kredi / Toplam AKTS" değerlerini çözer.
func planTotals(body string) (string, string) {
	g := func(re *regexp.Regexp) string {
		if m := re.FindStringSubmatch(body); m != nil {
			return m[1]
		}
		return ""
	}
	return g(totalKrediRe), g(totalEctsRe)
}

// parseEctsRange, "4 / 5 / 6" aralığını sayı dizisine çevirir; tek değerse tek
// elemanlı dizi, boşsa nil.
func parseEctsRange(s string) []float64 {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	parts := strings.FieldsFunc(s, func(r rune) bool { return r == '/' || r == '-' })
	out := make([]float64, 0, len(parts))
	for _, p := range parts {
		out = append(out, num(p))
	}
	return out
}

// Count, verilen seviyedeki program sayısını döndürür.
func Count(programs []Program, level string) int {
	n := 0
	for _, p := range programs {
		if p.Level == level {
			n++
		}
	}
	return n
}
