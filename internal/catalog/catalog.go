// Package catalog, OBS'nin ders katalog formundan ders bazlı katalog verisini
// çeker: kredi (T+U+L / yerel / AKTS), dil, ders tanımı, öğrenme çıktıları,
// haftalık konular ve kaynak kitaplar.
//
// Kaynak, OBS "Ders Bilgileri" akışının parçası:
//
//	DersKatalog/DersKatalogBilgiBransDersKodu?bransKodu=<KOD>&dersNo=<NO>
//
// `dersNo`, kataloğun anahtarlandığı temel numaradır (İngilizce/TR çiftleri
// tek sayfada birleşir: "BLG102-BLG102E" tek sayfadadır). Sayfa, yıl geçmişi
// verisinden türetilen (bransKodu, tabanDersNo) çiftleriyle adreslenir.
//
// Kırılma politikası: form sayfasındaki çekirdek alanlar (ad, dil, kredi,
// tanım) yoksa hata döneriz — sessizce boş içerik yazılmaz. Katalogu olmayan
// dersin sayfası (yalnızca çerçeve) ise içerik değildir; çağıran atlar.
package catalog

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"itu-scraper/internal/fetch"
)

const katalogURL = "https://obs.itu.edu.tr/public/DersKatalog/DersKatalogBilgiBransDersKodu"

// dersBilgiURL, ders başına "Ders Denklikleri" bölümünü getiren arama ucudur
// (Faz 3.5). DersBilgi sayfası içeriği XHR ile bu uçtan gelir; katalog formu
// sayfasında denklik verisi yoktur.
const dersBilgiURL = "https://obs.itu.edu.tr/public/DersBilgi/DersBilgiSearch"

// Credits, resmî kredi paketi. Local ve ECTS ondalıklı olabilir ("4,5").
type Credits struct {
	Theory   int     `json:"theory"`   // Teo
	Practice int     `json:"practice"` // Uyg
	Lab      int     `json:"lab"`      // Lab
	Local    float64 `json:"local"`    // Kredi (yerel)
	ECTS     float64 `json:"ects"`     // AKTS
}

// WeeklyTopic, 14 haftalık ders planının tek satırı (Faz 3.5 — hafta/konu/çıktı).
type WeeklyTopic struct {
	Week     int    `json:"week"`
	Topic    string `json:"topic"`
	Outcomes string `json:"outcomes,omitempty"`
}

// Entry, tek bir dersin katalog kaydı.
type Entry struct {
	Code         string        `json:"code"`
	Name         string        `json:"name"`
	NameEn       string        `json:"nameEn,omitempty"` // İngilizce ad (varsa)
	Language     string        `json:"language"`
	Credits      Credits       `json:"credits"`
	Description  string        `json:"description"`
	Outcomes     []string      `json:"outcomes"`
	WeeklyTopics []string      `json:"weeklyTopics,omitempty"`
	WeeklyPlan   []WeeklyTopic `json:"weeklyPlan,omitempty"`
	Equivalents  []string      `json:"equivalents,omitempty"`
	Textbooks    []string      `json:"textbooks,omitempty"`
	SourceURL    string        `json:"sourceUrl"`
	// FetchedAt kaldırıldı (Faz 3, 4.7): her kayıttaki zaman damgası içerik
	// değişmese bile diff üretiyordu. Koşu zamanı status.json'da.
}

var (
	rowRe   = regexp.MustCompile(`(?is)<tr[^>]*>(.*?)</tr>`)
	cellRe  = regexp.MustCompile(`(?is)<(?:td|th)[^>]*>(.*?)</(?:td|th)>`)
	liRe    = regexp.MustCompile(`(?is)<li[^>]*>(.*?)</li>`)
	tagRe   = regexp.MustCompile(`(?is)<[^>]*>`)
	spaceRe = regexp.MustCompile(`\s+`)
	codeRe  = regexp.MustCompile(`^[A-ZÇĞİÖŞÜ]{2,5}\s*\d{2,4}`)
	nameRe  = regexp.MustCompile(`(?i)Dersin Adı\s*:\s*(.*?)\s+Course Name`)
	// İngilizce ad: "Course Name:" sonrası, bir sonraki alan etiketine kadar.
	nameEnRe = regexp.MustCompile(`(?i)Course Name\s*:\s*(.*?)(?:\s+Bölüm\s*/\s*Program|\s+Kod)`)
	langRe  = regexp.MustCompile(`(?i)Dersin Dili[^:]*:\s*(.*?)\s+Kod\s*\(?Code\)?`)
	descRe  = regexp.MustCompile(`(?i)Dersin Tanımı\s*\(Course Description\)\s*(.*?)\s+Dersin Amacı`)
	outcRe  = regexp.MustCompile(`(?is)Course Learning Outcomes[^<]*</th>\s*<td[^>]*>(.*?)</td>`)
	konuRe  = regexp.MustCompile(`>Konular</th>`)
	bookRe  = regexp.MustCompile(`(?is)Ders Kitabı\s*</th>\s*<td[^>]*>(.*?)</td>`)
	brRe    = regexp.MustCompile(`(?i)<br\s*/?>`)
	planEnd = regexp.MustCompile(`(?i)>COURSE PLAN<|Ders Kitabı`)
	// "Ders Denklikleri" başlık hücresinden sonra gelen içerik hücresi.
	eqRe = regexp.MustCompile(`(?is)Ders Denklikleri</td>.*?<tr[^>]*>\s*<td[^>]*>(.*?)</td>`)
)

type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

// Catalog, bir (bransKodu, dersNo) için katalog formunu çeker ve çözer.
// Sayfa içeriksizse (katalog formu yok — eski/kaldırılmış ders) içerik
// değildir: ok=false döner, hata dönmez. Form var ama çekirdek alanlar
// eksikse hata döner (yapı değişikliği).
func (c *Client) Catalog(ctx context.Context, branch, dersNo string) (e *Entry, ok bool, err error) {
	url := fmt.Sprintf("%s?bransKodu=%s&dersNo=%s", katalogURL, branch, dersNo)
	body, err := c.f.Text(ctx, url)
	if err != nil {
		return nil, false, err
	}
	if !strings.Contains(body, "DERS KATALOG") {
		return nil, false, nil // katalog formu yok
	}
	e, err = Parse([]byte(body), url, branch, dersNo)
	if err != nil {
		return nil, false, err
	}
	return e, true, nil
}

// Equivalents, DersBilgi arama ucuyla bir dersin denk ders kodlarını çeker
// (ör. BLG 102E → BIL 105, CEN 102). DersBilgi sayfası XHR ile bu uçtan dolar.
// Denklik best-effort'tur: OBS throttle'ında takılan istek kısa sürede vazgeçer,
// 45sn'lik ana timeout'u boşa yemez.
func (c *Client) Equivalents(ctx context.Context, branch, dersNo string) ([]string, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	url := fmt.Sprintf("%s?bransKodu=%s&dersNo=%s", dersBilgiURL, branch, dersNo)
	body, err := c.f.Text(ctx, url)
	if err != nil {
		return nil, err
	}
	return parseEquivalents([]byte(body)), nil
}

// Parse, katalog formu sayfasını çözer. body ham baytlardır — karışık
// ISO-8859-9/UTF-8 kodlaması fetch.DecodeMixed ile çözülür.
func Parse(body []byte, sourceURL, branch, dersNo string) (*Entry, error) {
	text := fetch.DecodeMixed(body)
	if !strings.Contains(text, "DERS KATALOG") {
		return nil, fmt.Errorf("katalog formu bulunamadı")
	}
	clean := cleanHTML(text)

	e := &Entry{
		Code:      branch + " " + dersNo,
		SourceURL: sourceURL,
	}
	e.Name = grab(clean, nameRe)
	e.NameEn = grab(clean, nameEnRe)
	e.Language = grab(clean, langRe)
	e.Description = grab(clean, descRe)
	e.Credits = parseCredits(text)
	e.Outcomes = parseOutcomes(text)
	e.WeeklyTopics, e.WeeklyPlan = parseWeekly(text)
	e.Textbooks = parseBooks(text)

	// Ad veya dil eksikse sayfa yapısı değişmiş demektir — sessizce boş yazma.
	if e.Name == "" || e.Language == "" {
		return nil, fmt.Errorf("çekirdek alanlar eksik (ad=%q dil=%q) — sayfa yapısı değişmiş olabilir",
			e.Name, e.Language)
	}
	// Dönen sayfadaki kod, istenen koda uygun olmalı — yanlış dersin içeriğini
	// sessizce yazma (Faz 3.4). TR/EN çiftleri tek sayfada ("BLG102-BLG102E");
	// istenen taban (branş + sayısal dersNo) çiftlerden birinin öneki olmalı.
	if !pageCodeMatches(text, branch, dersNo) {
		return nil, fmt.Errorf("sayfa kodu istenen kodla uyuşmuyor (branş=%s dersNo=%s) — sayfa yapısı değişmiş olabilir",
			branch, dersNo)
	}
	// Tanım bazı derslerde kaynakta gerçekten boştur (ör. bitirme çalışması) —
	// bu yapı hatası değil. Form tamamen boşsa yapı değişmiş olabilir.
	if e.Description == "" && len(e.Outcomes) == 0 && len(e.WeeklyTopics) == 0 &&
		len(e.Textbooks) == 0 && e.Credits == (Credits{}) {
		return nil, fmt.Errorf("form tamamen boş — sayfa yapısı değişmiş olabilir")
	}
	return e, nil
}

// pageCodeMatches, kredi satırının ilk hücresindeki kodu istenen (branş, dersNo)
// ile karşılaştırır. Sayfadaki kod "BLG102-BLG102E" gibi bir çift olabilir; kabul
// için taban (branş + sayısal dersNo, boşluksuz) çiftin herhangi bir üyesinin
// öneki olmalı. Sayfada kod hücresi bulunamazsa (yapı değişikliği) false — Parse
// hata döner, içerik sessizce yazılmaz.
func pageCodeMatches(text, branch, dersNo string) bool {
	for _, row := range rowRe.FindAllStringSubmatch(text, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) < 6 {
			continue
		}
		first := cleanHTML(cells[0][1])
		if !codeRe.MatchString(first) {
			continue
		}
		base := strings.ToUpper(strings.TrimSpace(branch + strings.TrimSpace(dersNo)))
		for _, part := range strings.FieldsFunc(first, func(r rune) bool { return r == '-' || r == ' ' }) {
			if strings.HasPrefix(strings.ToUpper(part), base) {
				return true
			}
		}
		return false // kod hücresi var ama eşleşmiyor — yanlış ders
	}
	return false // kod hücresi yok — yapı değişmiş
}

// parseCredits, "Kod Kredi AKTS Teo Uyg Lab" satırından kredi paketini çözer.
func parseCredits(text string) Credits {
	var out Credits
	for _, row := range rowRe.FindAllStringSubmatch(text, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) < 6 {
			continue
		}
		if !codeRe.MatchString(cleanHTML(cells[0][1])) {
			continue
		}
		out.Local = num(cells[1][1])
		out.ECTS = num(cells[2][1])
		out.Theory = int(num(cells[3][1]))
		out.Practice = int(num(cells[4][1]))
		out.Lab = int(num(cells[5][1]))
		return out
	}
	return out
}

// parseOutcomes, "Course Learning Outcomes" etiketinin ardındaki <ol> listesini
// döndürür.
func parseOutcomes(text string) []string {
	m := outcRe.FindStringSubmatch(text)
	if m == nil {
		return nil
	}
	var out []string
	for _, li := range liRe.FindAllStringSubmatch(m[1], -1) {
		if v := cleanHTML(li[1]); v != "" {
			out = append(out, v)
		}
	}
	return out
}

// parseWeekly, Türkçe "Konular" plan tablosundaki hafta satırlarını çözer:
// hem geriye uyumlu "Hafta N — konu" dizesine (WeeklyTopics) hem yapılandırılmış
// WeeklyPlan'a (hafta/konu/çıktı) yazar. Tablo kolonları: Hafta | Konular | Çıktılar
// ("Dersin Öğrenme Çıktıları"). Plan tablosu yoksa boş döner (opsiyonel alan).
func parseWeekly(text string) (topics []string, plan []WeeklyTopic) {
	start := konuRe.FindStringIndex(text)
	if start == nil {
		return nil, nil
	}
	seg := text[start[0]:]
	if end := planEnd.FindStringIndex(seg); end != nil {
		seg = seg[:end[0]]
	}
	for _, row := range rowRe.FindAllStringSubmatch(seg, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) < 2 {
			continue
		}
		week := cleanHTML(cells[0][1])
		topic := cleanHTML(cells[1][1])
		if topic == "" {
			continue
		}
		if n, err := strconv.Atoi(week); err == nil {
			topics = append(topics, "Hafta "+week+" · "+topic)
			out := ""
			if len(cells) >= 3 {
				out = cleanHTML(cells[2][1])
				if out == "-" {
					out = ""
				}
			}
			plan = append(plan, WeeklyTopic{Week: n, Topic: topic, Outcomes: out})
		}
	}
	return topics, plan
}

// parseBooks, "Ders Kitabı" hücresindeki <br> ayrılmış kaynak kitapları döndürür.
func parseBooks(text string) []string {
	m := bookRe.FindStringSubmatch(text)
	if m == nil {
		return nil
	}
	var out []string
	for _, part := range brRe.Split(m[1], -1) {
		if v := cleanHTML(part); v != "" {
			out = append(out, v)
		}
	}
	return out
}

// parseEquivalents, DersBilgi arama yanıtındaki "Ders Denklikleri" hücresindeki
// denk ders kodlarını çözer ("BIL 105 ...", "CEN 102 ..." — <br> ile ayrılır;
// her satırın başındaki kod alınır, kalanı atılır). Bölüm yoksa boş döner.
func parseEquivalents(body []byte) []string {
	text := fetch.DecodeMixed(body)
	m := eqRe.FindStringSubmatch(text)
	if m == nil {
		return nil
	}
	var out []string
	for _, part := range brRe.Split(m[1], -1) {
		part = cleanHTML(part)
		if part == "" {
			continue
		}
		if code := codeRe.FindString(part); code != "" {
			out = append(out, strings.TrimSpace(code))
		}
	}
	return out
}

// ScrapeAll, verilen (bransKodu, dersNo, kodlar) gruplarını eşzamanlı çeker.
// İçeriksiz sayfa (ok=false) ya da tek ders hatası tüm taramayı düşürmez;
// warn'a yazılır, dönen sonuçta görünmez. İçerikli her grup için o gruptaki
// tüm kodlara (TR/EN çiftleri) aynı içerik yazılır.
func (c *Client) ScrapeAll(ctx context.Context, groups []Group, workers int, warn func(string, ...any)) map[string]map[string]*Entry {
	type result struct {
		group   Group
		entries map[string]*Entry // code -> entry (her kod için)
		err     error
	}
	jobs := make(chan Group)
	results := make(chan result)
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for g := range jobs {
				e, ok, err := c.Catalog(ctx, g.Branch, g.DersNo)
				if err != nil {
					results <- result{g, nil, err}
					continue
				}
				if !ok {
					results <- result{g, nil, nil} // katalog formu yok
					continue
				}
				entries := map[string]*Entry{}
				for _, code := range g.Codes {
					cp := *e
					cp.Code = code
					entries[code] = &cp
				}
				results <- result{g, entries, nil}
			}
		}()
	}
	go func() {
		defer close(jobs)
		for _, g := range groups {
			select {
			case jobs <- g:
			case <-ctx.Done():
				return
			}
		}
	}()
	go func() { wg.Wait(); close(results) }()

	byBranch := map[string]map[string]*Entry{}
	for r := range results {
		if r.err != nil {
			if warn != nil {
				warn("  %s %s: %v", r.group.Branch, r.group.DersNo, r.err)
			}
			continue
		}
		if r.entries == nil {
			continue // katalogu yok
		}
		for code, e := range r.entries {
			if byBranch[r.group.Branch] == nil {
				byBranch[r.group.Branch] = map[string]*Entry{}
			}
			byBranch[r.group.Branch][code] = e
		}
	}
	return byBranch
}

// Group, katalogu çekilecek bir (bransKodu, dersNo) grubu ve o gruba düşen
// orijinal ders kodları (TR/EN çiftleri aynı sayfadan gelir).
type Group struct {
	Branch string
	DersNo string
	Codes  []string
}

// GroupsFromCodes, yıl geçmişindeki ders kodlarından (ör. "BLG 102E") benzersiz
// (bransKodu, tabanDersNo) grupları türetir. Taban numarası, sonek (E/L) atılarak
// bulunur çünkü katalog sayfası İngilizce/Türkçe çiftini tek sayfada birleştirir.
// Çözümlenemeyen kodlar (sayısal olmayan numara) atlanır.
func GroupsFromCodes(codes []string) []Group {
	order := []string{}
	seen := map[string]int{} // "BRANŞ|taban" -> grup indeksi
	groups := []Group{}
	for _, code := range codes {
		parts := strings.Fields(code)
		if len(parts) < 2 {
			continue
		}
		m := regexp.MustCompile(`^(\d+)`).FindStringSubmatch(parts[1])
		if m == nil {
			continue
		}
		key := parts[0] + "|" + m[1]
		idx, ok := seen[key]
		if !ok {
			idx = len(groups)
			seen[key] = idx
			groups = append(groups, Group{Branch: parts[0], DersNo: m[1]})
			order = append(order, key)
		}
		groups[idx].Codes = append(groups[idx].Codes, code)
	}
	_ = order
	return groups
}

func grab(s string, re *regexp.Regexp) string {
	m := re.FindStringSubmatch(s)
	if m == nil {
		return ""
	}
	return strings.TrimSpace(m[1])
}

func num(s string) float64 {
	s = strings.TrimSpace(strings.ReplaceAll(s, ",", "."))
	v, _ := strconv.ParseFloat(s, 64)
	return v
}

func cleanHTML(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}
