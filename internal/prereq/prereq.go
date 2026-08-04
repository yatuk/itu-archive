// Package prereq, OBS'nin public önşart sayfasını çekip bir önşart grafiği kurar.
//
//	/public/GenelTanimlamalar/DersOnsartList         -> branş kodları sayfanın içinde
//	/public/GenelTanimlamalar/OnsartAra?DersBransKoduId=42 -> 4 kolonluk tablo
//
// Tablo, tek satırda birden çok hedef ders ("AKM 204 AKM 204E") ve serbest
// metin bir mantık ifadesi taşıyor:
//
//	"( MAT 102 MIN. DD Veya MAT 102E MIN. DD ) Veya ( MAT 104 MIN. DD Veya MAT 104E MIN. DD )"
//
// Görselleştirme AND/OR mantığını göstermiyor, sadece "hangi ders hangisine
// bağlı" ilişkisini gösteriyor; bu yüzden ifadeyi tam ayrıştırmak yerine
// içindeki ders kodlarını çıkarıp kenar olarak ekliyoruz. Ham metni de detay
// paneli için saklıyoruz.
package prereq

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
	pageURL   = "https://obs.itu.edu.tr/public/GenelTanimlamalar/DersOnsartList"
	searchURL = "https://obs.itu.edu.tr/public/GenelTanimlamalar/OnsartAra"
)

const expectedColumns = 4

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
	tdOpenRe = regexp.MustCompile(`(?i)<td[^>]*>`)
	tagRe    = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe  = regexp.MustCompile(`\s+`)
	// codeRe, "MAT 102E" gibi ders kodlarını serbest metinden çıkarır.
	codeRe = regexp.MustCompile(`\b([A-ZÇĞİÖŞÜ]{2,5})\s(\d{3}[A-Z]{0,2})\b`)
)

// splitCells, bir satırı <td> konumlarına göre böler. OBS'nin bu sayfasında
// "Ders Adı" hücresinin kapanış etiketi eksik — tarayıcı bunu bir sonraki
// <td> görünce otomatik kapatıyor, ama <td>...</td> eşleşmesiyle çalışan bir
// regex bunu bilmez ve iki hücreyi birleştirir. Eşleşen çiftler yerine <td
// başlangıçlarının konumuna göre bölmek, kapanış etiketi olsun olmasın doğru
// sonucu veriyor.
func splitCells(row string) []string {
	idxs := tdOpenRe.FindAllStringIndex(row, -1)
	if len(idxs) == 0 {
		return nil
	}
	cells := make([]string, len(idxs))
	for i, m := range idxs {
		end := len(row)
		if i+1 < len(idxs) {
			end = idxs[i+1][0]
		}
		cells[i] = clean(row[m[1]:end])
	}
	return cells
}

func (c *Client) Branches(ctx context.Context) ([]Branch, error) {
	body, err := c.f.Text(ctx, pageURL)
	if err != nil {
		return nil, err
	}
	sel := selectRe.FindString(body)
	if sel == "" {
		return nil, fmt.Errorf("önşart sayfasında branş kodu listesi bulunamadı — sayfa değişmiş olabilir")
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
		return nil, fmt.Errorf("önşart sayfasında hiç branş kodu yok")
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Code < out[j].Code })
	return out, nil
}

// Row, OnsartAra tablosundaki tek bir satır: bir veya daha fazla hedef ders
// koduna uygulanan tek bir önşart ifadesi.
type Row struct {
	Targets  []string // "AKM 204", "AKM 204E"
	Name     string   // "Akışkanlar Mekaniği"
	Text     string   // ham ifade, detay paneli için
	ClassReq string
	Required []string // ifadeden çıkarılan ders kodları
}

func (c *Client) Requirements(ctx context.Context, br Branch) ([]Row, error) {
	body, err := c.f.Text(ctx, fmt.Sprintf("%s?DersBransKoduId=%d", searchURL, br.ID))
	if err != nil {
		return nil, err
	}
	return parse(body, br.Code)
}

func (c *Client) ScrapeAll(ctx context.Context, branches []Branch, workers int) ([]Row, error) {
	type result struct {
		rows []Row
		err  error
		code string
	}
	jobs := make(chan Branch)
	results := make(chan result)
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for br := range jobs {
				rows, err := c.Requirements(ctx, br)
				results <- result{rows, err, br.Code}
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

	var all []Row
	var firstErr error
	for r := range results {
		if r.err != nil {
			if firstErr == nil {
				firstErr = fmt.Errorf("%s: %w", r.code, r.err)
			}
			continue
		}
		all = append(all, r.rows...)
	}
	if firstErr != nil {
		return nil, firstErr
	}
	return all, nil
}

func parse(body, branch string) ([]Row, error) {
	var out []Row
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		v := splitCells(row[1])
		if len(v) == 0 {
			continue
		}
		if len(v) != expectedColumns {
			return nil, fmt.Errorf("%s: beklenen %d kolon, gelen %d — önşart tablosu değişmiş olabilir",
				branch, expectedColumns, len(v))
		}
		if v[0] == "Ders Kodu" || v[0] == "" {
			continue // başlık satırı
		}

		targets := extractCodes(v[0])
		if len(targets) == 0 {
			continue
		}
		name := v[1]
		if i := strings.Index(name, "/"); i > 0 {
			name = strings.TrimSpace(name[:i]) // Türkçe/İngilizce başlıktan Türkçesini al
		}

		out = append(out, Row{
			Targets:  targets,
			Name:     name,
			Text:     v[2],
			ClassReq: v[3],
			Required: extractCodes(v[2]),
		})
	}
	return out, nil
}

// extractCodes, serbest metinden ders kodlarını çıkarır ve tekrarları eler.
func extractCodes(s string) []string {
	seen := map[string]bool{}
	var out []string
	for _, m := range codeRe.FindAllStringSubmatch(s, -1) {
		code := m[1] + " " + m[2]
		if !seen[code] {
			seen[code] = true
			out = append(out, code)
		}
	}
	return out
}

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}

// BuildGraph, satırları site tarafının çizeceği düğüm/kenar listesine çevirir.
// names, bilinen ders adlarını zenginleştirmek için kullanılır (örn. tarihsel
// indeksten); bir kod bu haritada yoksa Requirements'tan gelen ad kullanılır,
// o da yoksa boş kalır.
func BuildGraph(rows []Row, names map[string]string) *model.PrereqGraph {
	nodes := map[string]*model.PrereqNode{}
	edgeSeen := map[string]bool{}
	var edges []model.PrereqEdge

	ensure := func(code string) *model.PrereqNode {
		if n, ok := nodes[code]; ok {
			return n
		}
		branch := code
		if i := strings.IndexByte(code, ' '); i > 0 {
			branch = code[:i]
		}
		n := &model.PrereqNode{Code: code, Branch: branch, Name: names[code]}
		nodes[code] = n
		return n
	}

	for _, r := range rows {
		for _, target := range r.Targets {
			tn := ensure(target)
			if tn.Name == "" {
				tn.Name = r.Name
			}
			tn.Requirement = r.Text
			tn.ClassReq = r.ClassReq
			for _, req := range r.Required {
				if req == target {
					continue // kendi kendine kenar üretme
				}
				ensure(req)
				key := req + ">" + target
				if !edgeSeen[key] {
					edgeSeen[key] = true
					edges = append(edges, model.PrereqEdge{From: req, To: target})
				}
			}
		}
	}

	g := &model.PrereqGraph{}
	for _, n := range nodes {
		g.Nodes = append(g.Nodes, *n)
	}
	sort.Slice(g.Nodes, func(i, j int) bool { return g.Nodes[i].Code < g.Nodes[j].Code })
	sort.Slice(edges, func(i, j int) bool {
		if edges[i].From != edges[j].From {
			return edges[i].From < edges[j].From
		}
		return edges[i].To < edges[j].To
	})
	g.Edges = edges
	return g
}
