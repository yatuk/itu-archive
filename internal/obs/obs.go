// Package obs, obs.itu.edu.tr/public/DersProgram sayfasının arkasındaki üç GET
// ucundan ders programını çeker.
//
// Uçlar resmi bir API değil, sayfanın jQuery'sinin çağırdığı MVC action'ları:
//
//	GetAktifDonemByProgramSeviye  -> {"aktifDonem":"2025-2026 Yaz Dönemi"}
//	SearchBransKoduByProgramSeviye -> [{"bransKoduId":38,"dersBransKodu":"BIL"}]
//	DersProgramSearch             -> 15 kolonluk HTML <table>
package obs

import (
	"context"
	"encoding/json"
	"fmt"
	"html"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
)

const base = "https://obs.itu.edu.tr/public/DersProgram"

// Levels, sayfadaki "Eğitiminizi Seçin" kutusundaki program seviye anahtarları.
var Levels = []string{"OL", "LS", "LU", "LUI"}

// expectedColumns, DersProgramSearch tablosundaki kolon sayısı. OBS tabloyu
// değiştirirse sessizce bozuk veri yazmaktansa hata verip workflow'u kırmızıya
// düşürmeyi tercih ediyoruz.
const expectedColumns = 15

type Branch struct {
	ID    int    `json:"bransKoduId"`
	Code  string `json:"dersBransKodu"`
	Level string `json:"-"`
}

type Client struct {
	f *fetch.Client
}

func New(f *fetch.Client) *Client { return &Client{f: f} }

// ActiveTerm, verilen seviye için aktif dönem etiketini döndürür ("2025-2026 Güz Dönemi").
func (c *Client) ActiveTerm(ctx context.Context, level string) (string, error) {
	b, err := c.f.Bytes(ctx, fmt.Sprintf("%s/GetAktifDonemByProgramSeviye?programSeviyeTipiAnahtari=%s", base, level))
	if err != nil {
		return "", err
	}
	var out struct {
		AktifDonem string `json:"aktifDonem"`
	}
	if err := json.Unmarshal(b, &out); err != nil {
		return "", fmt.Errorf("aktif dönem çözümlenemedi: %w", err)
	}
	if out.AktifDonem == "" {
		return "", fmt.Errorf("aktif dönem boş döndü (seviye %s)", level)
	}
	return out.AktifDonem, nil
}

// PageTerm, DersProgram sayfasındaki statik başlıktan (baslik1) dönem etiketini
// çıkarır. OBS geçiş dönemlerinde GetAktifDonem ile arama verisi tutarsız
// olabiliyor (ör. endpoint hâlâ eski dönemi raporlarken arama yeni dönemi
// döndürüyor). Sayfa başlığı OBS'nin gösterdiği gerçek güncel dönemdir.
func (c *Client) PageTerm(ctx context.Context) (string, error) {
	body, err := c.f.Text(ctx, base)
	if err != nil {
		return "", err
	}
	// <h1 id="baslik1" ...>2026-2027 Güz Dönemi Ders Programları</h1>
	m := baslik1Re.FindStringSubmatch(body)
	if len(m) < 2 {
		return "", fmt.Errorf("sayfa başlığından dönem bulunamadı — OBS sayfası değişmiş olabilir")
	}
	label := text(m[1])
	label = strings.TrimSuffix(label, "Ders Programları")
	label = strings.TrimSuffix(label, "Ders Programlari")
	return strings.TrimSpace(label), nil
}

// Branches, bir seviyedeki tüm ders branş kodlarını döndürür.
func (c *Client) Branches(ctx context.Context, level string) ([]Branch, error) {
	b, err := c.f.Bytes(ctx, fmt.Sprintf("%s/SearchBransKoduByProgramSeviye?programSeviyeTipiAnahtari=%s", base, level))
	if err != nil {
		return nil, err
	}
	var out []Branch
	if err := json.Unmarshal(b, &out); err != nil {
		return nil, fmt.Errorf("branş listesi çözümlenemedi (%s): %w", level, err)
	}
	for i := range out {
		out[i].Level = level
	}
	return out, nil
}

// Sections, tek bir branşın tüm şubelerini çeker.
func (c *Client) Sections(ctx context.Context, br Branch) ([]model.Section, error) {
	url := fmt.Sprintf("%s/DersProgramSearch?programSeviyeTipiAnahtari=%s&dersBransKoduId=%d", base, br.Level, br.ID)
	body, err := c.f.Text(ctx, url)
	if err != nil {
		return nil, err
	}
	return parseTable(body, br)
}

// AllBranches, dört seviyedeki branşları tek listede toplar.
func (c *Client) AllBranches(ctx context.Context) ([]Branch, error) {
	var all []Branch
	for _, lv := range Levels {
		brs, err := c.Branches(ctx, lv)
		if err != nil {
			return nil, err
		}
		all = append(all, brs...)
	}
	sort.Slice(all, func(i, j int) bool {
		if all[i].Level != all[j].Level {
			return all[i].Level < all[j].Level
		}
		return all[i].Code < all[j].Code
	})
	return all, nil
}

// ScrapeAll, tüm branşları eşzamanlı çeker. Per-branş hataları failed'da
// toplanır, diğer branşlar devam eder ve başarılı veri döner (Faz 2: kısmi
// başarı). ctx iptalinde (SIGTERM) fatal hata döner — yarım yazılmaz.
func (c *Client) ScrapeAll(ctx context.Context, branches []Branch, workers int, progress func(Branch, int)) (map[string][]model.Section, []string, error) {
	type result struct {
		br   Branch
		secs []model.Section
		err  error
	}

	jobs := make(chan Branch)
	results := make(chan result)
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for br := range jobs {
				secs, err := c.Sections(ctx, br)
				results <- result{br, secs, err}
			}
		}()
	}
	go func() {
		defer close(jobs)
		for _, br := range branches {
			select {
			case jobs <- br:
			case <-ctx.Done():
				return
			}
		}
	}()
	go func() { wg.Wait(); close(results) }()

	out := make(map[string][]model.Section, len(branches))
	var failed []string
	for r := range results {
		if r.err != nil {
			failed = append(failed, fmt.Sprintf("%s (%s): %v", r.br.Code, r.br.Level, r.err))
			continue
		}
		out[key(r.br)] = r.secs
		if progress != nil {
			progress(r.br, len(r.secs))
		}
	}
	if ctx.Err() != nil {
		return nil, failed, ctx.Err()
	}
	sort.Strings(failed)
	return out, failed, nil
}

func key(br Branch) string { return br.Level + "/" + br.Code }

var (
	rowRe     = regexp.MustCompile(`(?is)<tr[^>]*>(.*?)</tr>`)
	cellRe    = regexp.MustCompile(`(?is)<td[^>]*>(.*?)</td>`)
	brRe      = regexp.MustCompile(`(?i)<br\s*/?>`)
	tagRe     = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe   = regexp.MustCompile(`\s+`)
	tbodyRe   = regexp.MustCompile(`(?is)<tbody[^>]*>(.*?)</tbody>`)
	baslik1Re = regexp.MustCompile(`(?is)<h1[^>]*id="baslik1"[^>]*>(.*?)</h1>`)
)

func parseTable(body string, br Branch) ([]model.Section, error) {
	// Başlık satırını (thead) dışarıda bırakmak için tbody'yi izole et.
	scope := body
	if m := tbodyRe.FindStringSubmatch(body); m != nil {
		scope = m[1]
	}

	var sections []model.Section
	for _, row := range rowRe.FindAllStringSubmatch(scope, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 0 {
			continue
		}
		if len(cells) != expectedColumns {
			return nil, fmt.Errorf("%s: beklenen %d kolon, gelen %d — OBS tablo yapısı değişmiş olabilir",
				br.Code, expectedColumns, len(cells))
		}

		raw := make([]string, len(cells))
		for i, c := range cells {
			raw[i] = c[1]
		}

		sec := model.Section{
			CRN:        text(raw[0]),
			Code:       text(raw[1]),
			Branch:     br.Code,
			Level:      br.Level,
			Name:       text(raw[2]),
			Method:     text(raw[3]),
			Instructor: text(raw[4]),
			Buildings:  parts(raw[5]),
			Days:       parts(raw[6]),
			Times:      parts(raw[7]),
			Rooms:      parts(raw[8]),
			Capacity:   num(raw[9]),
			Enrolled:   num(raw[10]),
			Reserved:   text(raw[11]),
			Programs:   csv(raw[12]),
			Prereq:     text(raw[13]),
			ClassReq:   text(raw[14]),
		}
		if sec.CRN == "" {
			continue
		}
		sections = append(sections, sec)
	}

	sort.Slice(sections, func(i, j int) bool { return sections[i].CRN < sections[j].CRN })
	return sections, nil
}

// text, bir hücreyi düz metne indirger.
func text(cell string) string {
	s := brRe.ReplaceAllString(cell, " ")
	s = tagRe.ReplaceAllString(s, "")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}

// parts, çok oturumlu derslerde <br> ile birleştirilmiş hücreyi ayırır.
// Bu ayrım şart: düz metin alındığında "ÇarşambaÇarşamba" ya da "09:30/12:2913:30/17:29"
// gibi okunamaz değerler oluşuyor.
func parts(cell string) []string {
	var out []string
	for _, p := range brRe.Split(cell, -1) {
		v := text(p)
		if v == "" || v == "-" {
			continue
		}
		out = append(out, v)
	}
	if out == nil {
		return []string{}
	}
	return out
}

// csv, "IBM_LS, MTO_LS" biçimindeki program listesini ayırır. Virgül, noktalı
// virgül ve dik çizgi ayraç olarak kabul edilir (OBS yıllar içinde farklı ayraç
// kullanabilmiş).
func csv(cell string) []string {
	s := text(cell)
	if s == "" || s == "-" {
		return []string{}
	}
	var out []string
	for _, p := range strings.FieldsFunc(s, func(r rune) bool {
		return r == ',' || r == ';' || r == '|'
	}) {
		if v := strings.TrimSpace(p); v != "" {
			out = append(out, v)
		}
	}
	if out == nil {
		return []string{}
	}
	return out
}

func num(cell string) int {
	n, err := strconv.Atoi(strings.TrimSpace(text(cell)))
	if err != nil {
		return 0
	}
	return n
}
