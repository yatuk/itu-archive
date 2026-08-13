// Package final, OBS'nin public final sınav takvimini çeker.
//
// Ders programıyla aynı kalıpta çalışıyor, tek fark seviye parametresi yok:
//
//	/public/FinalTakvimi/FinalTakvimiByDersBransKodu          -> branş kodları sayfanın içinde
//	/public/FinalTakvimi/SearchFinalTakvimiByDersBransKodu?DersBransKoduId=38 -> 10 kolonluk tablo
//
// Sınav takvimi de yalnızca aktif dönem için yayınlanıyor, dönem geçince
// kayboluyor. Ders programıyla aynı sebeple arşivleniyor.
package final

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"sort"
	"strings"
	"sync"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
)

const (
	pageURL   = "https://obs.itu.edu.tr/public/FinalTakvimi/FinalTakvimiByDersBransKodu"
	searchURL = "https://obs.itu.edu.tr/public/FinalTakvimi/SearchFinalTakvimiByDersBransKodu"
)

// expectedColumns, sınav tablosundaki kolon sayısı.
const expectedColumns = 10

type Branch struct {
	ID   int
	Code string
}

type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

var (
	selectRe = regexp.MustCompile(`(?is)<select[^>]*id="DersBransKoduId".*?</select>`)
	optionRe = regexp.MustCompile(`(?is)<option value="(\d+)"[^>]*>(.*?)</option>`)
	rowRe    = regexp.MustCompile(`(?is)<tr[^>]*>(.*?)</tr>`)
	cellRe   = regexp.MustCompile(`(?is)<t[dh][^>]*>(.*?)</t[dh]>`)
	tagRe    = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe  = regexp.MustCompile(`\s+`)
)

// Branches, sınav takvimi sayfasındaki branş kodlarını okur. Ders programından
// ayrı bir liste; kodlar örtüşse de burada kendi sayfasından alıyoruz ki
// biri değişirse diğeri bozulmasın.
func (c *Client) Branches(ctx context.Context) ([]Branch, error) {
	body, err := c.f.Text(ctx, pageURL)
	if err != nil {
		return nil, err
	}
	sel := selectRe.FindString(body)
	if sel == "" {
		return nil, fmt.Errorf("sınav takviminde branş kodu listesi bulunamadı — sayfa değişmiş olabilir")
	}
	var out []Branch
	for _, m := range optionRe.FindAllStringSubmatch(sel, -1) {
		code := clean(m[2])
		if code == "" {
			continue
		}
		id := 0
		fmt.Sscanf(m[1], "%d", &id)
		out = append(out, Branch{ID: id, Code: code})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("sınav takviminde hiç branş kodu yok")
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Code < out[j].Code })
	return out, nil
}

// Exams, bir branşın sınavlarını çeker.
func (c *Client) Exams(ctx context.Context, br Branch) ([]model.Exam, error) {
	body, err := c.f.Text(ctx, fmt.Sprintf("%s?DersBransKoduId=%d", searchURL, br.ID))
	if err != nil {
		return nil, err
	}
	return parse(body, br.Code)
}

// ScrapeAll, tüm branşları eşzamanlı çeker. Per-branş hataları failed'da
// toplanır, diğerleri devam eder (Faz 2: kısmi başarı).
func (c *Client) ScrapeAll(ctx context.Context, branches []Branch, workers int) ([]model.Exam, []string, error) {
	type result struct {
		exams []model.Exam
		err   error
		code  string
	}
	jobs := make(chan Branch)
	results := make(chan result)
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for br := range jobs {
				ex, err := c.Exams(ctx, br)
				results <- result{ex, err, br.Code}
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

	var all []model.Exam
	var failed []string
	for r := range results {
		if r.err != nil {
			failed = append(failed, fmt.Sprintf("%s: %v", r.code, r.err))
			continue
		}
		all = append(all, r.exams...)
	}
	if ctx.Err() != nil {
		return nil, failed, ctx.Err()
	}
	sort.Slice(all, func(i, j int) bool {
		if all[i].CRN != all[j].CRN {
			return all[i].CRN < all[j].CRN
		}
		return all[i].Type < all[j].Type
	})
	return all, failed, nil
}

func parse(body, branch string) ([]model.Exam, error) {
	var out []model.Exam
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 0 {
			continue
		}
		if len(cells) != expectedColumns {
			return nil, fmt.Errorf("%s: beklenen %d kolon, gelen %d — sınav tablosu değişmiş olabilir",
				branch, expectedColumns, len(cells))
		}
		v := make([]string, len(cells))
		for i, c := range cells {
			v[i] = clean(c[1])
		}
		if v[0] == "CRN" || v[0] == "" {
			continue // başlık satırı
		}
		out = append(out, model.Exam{
			CRN:        v[0],
			Code:       strings.TrimSpace(v[1] + " " + v[2]),
			Branch:     branch,
			Name:       v[3],
			Instructor: v[4],
			Type:       v[5],
			Place:      v[6],
			Day:        v[7],
			Time:       v[8],
			Date:       v[9],
		})
	}
	return out, nil
}

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}
