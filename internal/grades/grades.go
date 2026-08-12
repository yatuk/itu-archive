// Package grades, OBS'nin ders not dağılımı formundan harf notu dağılımını çeker.
//
//	/public/DersNotDagilimi/NotDagilimiSearch?bransKodu=<KOD>&dersNo=<NO>&yil=<YIL>
//
// Endpoint GET ile döner ve gövdeye `const ALL_DATA = [...]` JSON'unu gömer;
// her kayıt bir dönemdir: { DonemKodu, YilAdi, DonemTipAdi, ToplamAciklananOgrenci,
// Dagilim: [{ HarfNotu, Sayi, Yuzde }] }. `yil`, bir akademik yılı seçer ve
// o yılın verisi olan tüm dönemleri döndürür; veri yoksa 204 (boş gövde).
//
// Etik sınır: notu açıklanan öğrenci sayısı < 10 olan dönemler kaydedilmez —
// küçük sınıfta toplu dağılımdan tekil öğrenci çıkarımı mümkün olur.
package grades

import (
	"context"
	"encoding/json"
	"fmt"
	"html"
	"regexp"
	"strings"
	"sync"

	"itu-scraper/internal/catalog"
	"itu-scraper/internal/fetch"
)

const searchURL = "https://obs.itu.edu.tr/public/DersNotDagilimi/NotDagilimiSearch"

// Entry, tek bir dönemin harf notu dağılımı. Code, o dönemin ders kodudur
// (TR/EN çiftleri aynı istekten gelir; her kod için kopyalanır).
type Entry struct {
	Code      string         `json:"code"`
	Term      string         `json:"term"`   // "2025-2026 Bahar Dönemi"
	Donem     string         `json:"donem"`  // "202620"
	Total     int            `json:"total"`  // notu açıklanan öğrenci sayısı
	Grades    map[string]int `json:"grades"` // harf notu → kişi sayısı (AA, BA+, …, VF)
	SourceURL string         `json:"sourceUrl"`
}

var allDataRe = regexp.MustCompile(`(?s)const\s+ALL_DATA\s*=\s*(\[.*?\]);`)

// parsedDonem, sayfadaki ALL_DATA içindeki tek dönem kaydı.
type parsedDonem struct {
	DonemKodu              string        `json:"DonemKodu"`
	YilAdi                 string        `json:"YilAdi"`
	DonemTipAdi            string        `json:"DonemTipAdi"`
	ToplamAciklananOgrenci int           `json:"ToplamAciklananOgrenci"`
	Dagilim                []parsedGrade `json:"Dagilim"`
}

type parsedGrade struct {
	HarfNotu string  `json:"HarfNotu"`
	Sayi     int     `json:"Sayi"`
	Yuzde    float64 `json:"Yuzde"`
}

// Parse, NotDagilimiSearch gövdesini çözer. İçerik yoksa (204/boş) ok=false.
func Parse(body []byte, sourceURL, code string) ([]Entry, bool, error) {
	text := fetch.DecodeMixed(body)
	m := allDataRe.FindStringSubmatch(text)
	if m == nil {
		return nil, false, nil // bu ders/yıl için dağılım yok
	}
	var donemler []parsedDonem
	if err := json.Unmarshal([]byte(m[1]), &donemler); err != nil {
		return nil, false, fmt.Errorf("ALL_DATA çözümlenemedi: %v", err)
	}
	var out []Entry
	for _, d := range donemler {
		// Etik sınır: <10 kişilik sınıfta toplu dağılım kişiyi ele verir.
		if d.ToplamAciklananOgrenci < 10 {
			continue
		}
		grades := map[string]int{}
		for _, g := range d.Dagilim {
			if g.Sayi > 0 && g.HarfNotu != "" {
				grades[g.HarfNotu] = g.Sayi
			}
		}
		if len(grades) == 0 {
			continue
		}
		out = append(out, Entry{
			Code:      code,
			Term:      strings.TrimSpace(html.UnescapeString(d.YilAdi + " " + d.DonemTipAdi)),
			Donem:     d.DonemKodu,
			Total:     d.ToplamAciklananOgrenci,
			Grades:    grades,
			SourceURL: sourceURL,
		})
	}
	return out, len(out) > 0, nil
}

// Client, not dağılımı formunu çeken istemci.
type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

// Grades, bir (bransKodu, dersNo, yil) için dağılımları çeker. Veri yoksa
// ok=false (hata değil — birçok dersin bu yıl dağılımı yayınlanmamıştır).
func (c *Client) Grades(ctx context.Context, branch, dersNo, yil string) ([]Entry, bool, error) {
	url := fmt.Sprintf("%s?bransKodu=%s&dersNo=%s&yil=%s", searchURL, branch, dersNo, yil)
	body, err := c.f.Bytes(ctx, url)
	if err != nil {
		return nil, false, err
	}
	return Parse(body, url, branch+" "+dersNo)
}

// ScrapeAll, tüm (brans, dersNo) gruplarını verilen yıllar için eşzamanlı çeker.
// Katalogtaki TR/EN çiftleri aynı dağılımı paylaşır — her grup kodu için
// aynı dağılımlar kopyalanır. Verisi olmayan grup sessizce atlanır (warn).
func (c *Client) ScrapeAll(ctx context.Context, groups []Group, years []string, workers int, warn func(string, ...any)) map[string][]Entry {
	type result struct {
		group   Group
		entries []Entry
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
				var all []Entry
				for _, y := range years {
					es, ok, err := c.Grades(ctx, g.Branch, g.DersNo, y)
					if err != nil {
						results <- result{g, nil, err}
						break
					}
					if ok {
						all = append(all, es...)
					}
				}
				if len(all) == 0 {
					continue // bu dersin hiçbir yılda dağılımı yok
				}
				results <- result{g, all, nil}
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

	byBranch := map[string][]Entry{}
	for r := range results {
		if r.err != nil {
			if warn != nil {
				warn("  %s %s: %v", r.group.Branch, r.group.DersNo, r.err)
			}
			continue
		}
		for _, code := range r.group.Codes {
			for _, e := range r.entries {
				cp := e
				cp.Code = code
				byBranch[r.group.Branch] = append(byBranch[r.group.Branch], cp)
			}
		}
	}
	return byBranch
}

// Group, dağılımı çekilecek (bransKodu, dersNo) grubu ve o gruptaki ders kodları.
type Group struct {
	Branch string
	DersNo string
	Codes  []string
}

// GroupsFromCodes, yıl geçmişindeki ders kodlarından benzersiz (brans, taban)
// grupları türetir — katalogla aynı kural (E/L soneki atılır, TR/EN çiftleri
// aynı sayfadan gelir). catalog.GroupsFromCodes'i yeniden kullanır.
func GroupsFromCodes(codes []string) []Group {
	g := catalog.GroupsFromCodes(codes)
	out := make([]Group, len(g))
	for i, cg := range g {
		out[i] = Group{Branch: cg.Branch, DersNo: cg.DersNo, Codes: cg.Codes}
	}
	return out
}
