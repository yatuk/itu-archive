// Package site, arşiv verisinden arama motorlarına yönelik statik sayfalar
// üretir: her dönem ve her branş için birer HTML sayfası + sitemap.
//
// Çıktı tamamen deterministiktir (zaman damgaları veriden türetilir), böylece
// CI'da üretim "commit ile aynı mı" diye denetlenebilir ve scrape botu sürekli
// sahte commit üretmez.
package site

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"itu-scraper/internal/model"
	"itu-scraper/internal/term"
)

const baseURL = "https://itu-ders.com"

var trMonths = []string{
	"", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
	"Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
}

// Builder, docs kökünden veriyi okuyup sayfaları yazar.
type Builder struct {
	root  string
	index model.SiteIndex
	// agg'de branch bazlı birikim: hangi dönemde kaç şube, hangi kodlar var.
	aggs map[string]*branchAgg
}

type branchAgg struct {
	codes  map[string]struct{} // o branşta görülen tüm ders kodları
	termSections map[string]int // slug -> o dönemdeki şube sayısı
	levels map[string]struct{}
	total  int
}

// branchLink, bir dönem sayfasındaki branş listesi öğesi.
type branchLink struct {
	Code     string
	Levels   string
	Sections int
	URL      string
}

// termRow, işlenen tek bir dönem (index referansı + meta).
type termRow struct {
	tref model.TermRef
	meta model.TermMeta
}

func New(root string) *Builder { return &Builder{root: root} }

// Generate, dizinde biriken geçmiş sayfaları da temizleyen ana üreticidir.
// root altında dersler/ ve brans/ klasörlerini silip yeniden oluşturur.
func (b *Builder) Generate() error {
	// Eski çıktıyı temizle (silinebilecek dosyaları atla: silme hatası kritik değil).
	_ = os.RemoveAll(filepath.Join(b.root, "dersler"))
	_ = os.RemoveAll(filepath.Join(b.root, "brans"))

	if err := readJSON(filepath.Join(b.root, "data", "index.json"), &b.index); err != nil {
		return fmt.Errorf("index okunamadı: %w", err)
	}

	var terms []termRow
	for _, t := range b.index.Terms {
		if t.Missing {
			continue
		}
		var m model.TermMeta
		if err := readJSON(filepath.Join(b.root, "data", "terms", t.Slug, "meta.json"), &m); err != nil {
			return fmt.Errorf("%s meta okunamadı: %w", t.Slug, err)
		}
		terms = append(terms, termRow{tref: t, meta: m})
	}

	// branch birikimi: meta.json'dan şube sayıları
	b.aggs = map[string]*branchAgg{}
	for _, tr := range terms {
		for _, br := range tr.meta.Branches {
			a := b.aggs[br.Code]
			if a == nil {
				a = &branchAgg{
					codes:        map[string]struct{}{},
					termSections: map[string]int{},
					levels:       map[string]struct{}{},
				}
				b.aggs[br.Code] = a
			}
			a.termSections[tr.tref.Slug] = br.Sections
			a.total += br.Sections
			for _, lv := range br.Levels {
				a.levels[lv] = struct{}{}
			}
		}
	}

	// search.json'dan ders kodlarını topla
	for _, tr := range terms {
		var rows [][]json.RawMessage
		if err := readJSON(filepath.Join(b.root, "data", "terms", tr.tref.Slug, "search.json"), &rows); err != nil {
			return fmt.Errorf("%s search okunamadı: %w", tr.tref.Slug, err)
		}
		for _, r := range rows {
			if len(r) < 4 {
				continue
			}
			var branch, code string
			json.Unmarshal(r[3], &branch)
			json.Unmarshal(r[1], &code)
			if a := b.aggs[branch]; a != nil && code != "" {
				a.codes[code] = struct{}{}
			}
		}
	}

	for _, tr := range terms {
		if err := b.writeTermPage(tr); err != nil {
			return err
		}
	}

	codes := sortedKeys(b.aggs)
	termLabels := map[string]string{}
	for _, tr := range terms {
		if _, ok := b.aggs[""]; ok {
			// boş branş atla (search.json'da branşsız satır)
		}
		if tr.tref.Label != "" {
			termLabels[tr.tref.Slug] = tr.tref.Label
		}
	}
	for _, code := range codes {
		if err := b.writeBranchPage(code, termLabels); err != nil {
			return err
		}
	}

	return b.writeSitemap(terms, codes)
}

func (b *Builder) writeTermPage(tr termRow) error {
	var bls []branchLink
	for _, br := range tr.meta.Branches {
		bls = append(bls, branchLink{
			Code:     br.Code,
			Levels:   strings.Join(br.Levels, ", "),
			Sections: br.Sections,
			URL:      fmt.Sprintf("/brans/%s/", br.Code),
		})
	}

	canonical := fmt.Sprintf("%s/dersler/%s/", baseURL, tr.tref.Slug)
	title := tr.tref.Label + " ders programı ve arşivi"
	lead := fmt.Sprintf("İTÜ %s — %d ders, %d şube, %d branş.",
		tr.tref.Label, tr.meta.Courses, tr.meta.Sections, len(tr.meta.Branches))

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":        "https://schema.org",
			"@type":           "WebPage",
			"url":             canonical,
			"name":            title,
			"description":     lead,
			"inLanguage":      "tr-TR",
		},
	})

	content := template.HTML(buildContent(
		fmt.Sprintf(`<nav class="crumb"><a href="/">Ders Arşivi</a> › <span>%s</span></nav>`, template.HTMLEscapeString(tr.tref.Label)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(tr.tref.Label)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		fmt.Sprintf(`<p class="cta"><a class="btn" href="/?term=%s">bu dönemi canlı ara</a></p>`, tr.tref.Slug),
		buildStats(b.statsFromMeta(tr.meta)),
		trBadge(tr.meta.Live),
		`<h2>Bu dönemde açılan branşlar</h2>`,
		buildBranchLinks(bls),
		fmt.Sprintf(`<p class="data-link">Tüm veri: <a href="/data/terms/%s/all.csv">CSV</a> · <a href="/data/terms/%s/search.json">JSON (arama indeksi)</a></p>`,
			tr.tref.Slug, tr.tref.Slug),
	))

	return b.writePage(filepath.Join(b.root, "dersler", tr.tref.Slug, "index.html"),
		title, lead, canonical, fmtDate(tr.tref.ScrapedAt), content, jsonld)
}

func (b *Builder) writeBranchPage(code string, termLabels map[string]string) error {
	a := b.aggs[code]
	canonical := fmt.Sprintf("%s/brans/%s/", baseURL, code)
	title := code + " branşı dersleri ve dönem dökümü"
	codeCount := len(a.codes)
	termCount := len(a.termSections)
	lead := fmt.Sprintf("İTÜ %s branşının tüm dönemlerdeki arşivi — %d ders kodu, %d dönem, %d şube.",
		code, codeCount, termCount, a.total)

	// En güncel dönem slug'ı
	var latestSlug string
	{
		type kv struct{ k, v string }
		var pairs []kv
		for s := range a.termSections {
			pairs = append(pairs, kv{k: s, v: term.SortKey(s)})
		}
		sort.Slice(pairs, func(i, j int) bool { return pairs[i].v > pairs[j].v })
		if len(pairs) > 0 {
			latestSlug = pairs[0].k
		}
	}
	if latestSlug == "" {
		latestSlug = b.index.CurrentSlug
	}

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":        "https://schema.org",
			"@type":           "WebPage",
			"url":             canonical,
			"name":            title,
			"description":     lead,
			"inLanguage":      "tr-TR",
		},
	})

	var termRows []string
	{
		var slugs []string
		for s := range a.termSections {
			slugs = append(slugs, s)
		}
		sort.Slice(slugs, func(i, j int) bool {
			return term.SortKey(slugs[i]) > term.SortKey(slugs[j])
		})
		for _, s := range slugs {
			label := termLabels[s]
			if label == "" {
				label = s
			}
			termRows = append(termRows, fmt.Sprintf(
				`<tr><td><a href="/dersler/%s/">%s</a></td><td>%d şube</td></tr>`,
				s, template.HTMLEscapeString(label), a.termSections[s],
			))
		}
	}

	var codeSpans []string
	srt := sortedKeys(a.codes)
	for _, c := range srt {
		codeSpans = append(codeSpans, fmt.Sprintf(`<code>%s</code>`, template.HTMLEscapeString(c)))
	}

	content := template.HTML(buildContent(
		fmt.Sprintf(`<nav class="crumb"><a href="/">Ders Arşivi</a> › <span>%s</span></nav>`, template.HTMLEscapeString(code)),
		fmt.Sprintf(`<h1>%s branşı</h1>`, template.HTMLEscapeString(code)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		fmt.Sprintf(`<p class="cta"><a class="btn" href="/?term=%s&branch=%s">bu branşı canlı ara</a></p>`,
			latestSlug, code),
		`<dl class="seo-stats">`+
			fmt.Sprintf(`<div><dt>ders kodu</dt><dd>%d</dd></div>`, codeCount)+
			fmt.Sprintf(`<div><dt>dönem</dt><dd>%d</dd></div>`, termCount)+
			fmt.Sprintf(`<div><dt>toplam şube</dt><dd>%d</dd></div>`, a.total)+
			`</dl>`,
		`<h2>Ders kodları</h2>`,
		fmt.Sprintf(`<p class="seo-codes">%s</p>`, strings.Join(codeSpans, " ")),
		`<h2>Dönem dökümü</h2>`,
		`<table class="seo-table"><thead><tr><th>Dönem</th><th>Şube</th></tr></thead><tbody>`+
			strings.Join(termRows, "")+
			`</tbody></table>`,
	))

	return b.writePage(filepath.Join(b.root, "brans", code, "index.html"),
		title, lead, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
}

func (b *Builder) writeSitemap(terms []termRow, codes []string) error {
	rootDate := dateOf(b.index.ScrapedAt)
	var out strings.Builder
	out.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	out.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")

	sitemapURL(&out, baseURL+"/", rootDate, "daily", "1.0")

	for _, tr := range terms {
		td := dateOf(tr.tref.ScrapedAt)
		if td == "" {
			td = rootDate
		}
		sitemapURL(&out, fmt.Sprintf("%s/dersler/%s/", baseURL, tr.tref.Slug), td, "monthly", "0.7")
	}
	for _, c := range codes {
		sitemapURL(&out, fmt.Sprintf("%s/brans/%s/", baseURL, c), rootDate, "monthly", "0.6")
	}

	out.WriteString("</urlset>\n")
	return os.WriteFile(filepath.Join(b.root, "sitemap.xml"), []byte(out.String()), 0o644)
}

func sitemapURL(w *strings.Builder, loc, lastmod, changefreq, priority string) {
	w.WriteString("  <url>\n")
	fmt.Fprintf(w, "    <loc>%s</loc>\n", escapeXML(loc))
	if lastmod != "" {
		fmt.Fprintf(w, "    <lastmod>%s</lastmod>\n", lastmod)
	}
	if changefreq != "" {
		fmt.Fprintf(w, "    <changefreq>%s</changefreq>\n", changefreq)
	}
	if priority != "" {
		fmt.Fprintf(w, "    <priority>%s</priority>\n", priority)
	}
	w.WriteString("  </url>\n")
}

func escapeXML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&apos;")
	return s
}

var pageTmpl = template.Must(template.New("page").Parse(`<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{.Title}} — İTÜ Ders Arşivi</title>
<meta name="description" content="{{.Description}}">
<link rel="canonical" href="{{.Canonical}}">
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" href="/logo.png" type="image/png">
{{.JSONLD}}
</head>
<body>
<div class="scanlines" aria-hidden="true"></div>
<header class="masthead">
 <div class="wrap">
  <div class="mast-top">
   <div class="brand">
    <span class="prompt">root@itu</span><span class="path">:~/arsiv</span><span class="caret">$</span>
    <h1><a href="/">DERS ARŞİVİ</a></h1>
   </div>
  </div>
  <p class="tagline">
   obs.itu.edu.tr ve takvim.sis.itu.edu.tr üzerinden otomatik toplanan açık veri.
   Hangi dönemde hangi dersin açıldığı, kim verdiği, kaç kişi yazıldığı — kalıcı olarak.
  </p>
 </div>
</header>
<nav class="tabs wrap" role="navigation" aria-label="Bölümler">
 <a href="/">dersler</a>
 <a href="/#gecmis">geçmiş</a>
 <a href="/#onsart">önşart</a>
 <a href="/#sinavlar">sınavlar</a>
 <a href="/#takvim">takvim</a>
 <a href="/#program">program</a>
 <a href="/#hakkinda">hakkında</a>
</nav>
<main class="wrap">
{{.Content}}
</main>
<footer class="wrap">
 <span>son tarama {{.Scraped}}</span> · <a href="/">canlı site</a> · <a href="/sitemap.xml">sitemap</a>
</footer>
</body>
</html>`))

type pageData struct {
	Title, Description, Canonical, Scraped string
	Content                                template.HTML
	JSONLD                                 template.HTML
}

func (b *Builder) writePage(path, title, desc, canonical, scraped string, content, jsonld template.HTML) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return pageTmpl.Execute(f, pageData{
		Title: title, Description: desc, Canonical: canonical,
		Scraped: scraped, Content: content, JSONLD: jsonld,
	})
}

// --- helpers ---

func (b *Builder) statsFromMeta(m model.TermMeta) []statEntry {
	return []statEntry{
		{"şube", strconv.Itoa(m.Sections)},
		{"ders", strconv.Itoa(m.Courses)},
		{"branş", strconv.Itoa(len(m.Branches))},
		{"son tarama", fmtDate(m.ScrapedAt)},
	}
}

type statEntry struct{ key, val string }

func buildStats(entries []statEntry) string {
	var b strings.Builder
	b.WriteString(`<dl class="seo-stats">`)
	for _, e := range entries {
		fmt.Fprintf(&b, `<div><dt>%s</dt><dd>%s</dd></div>`, template.HTMLEscapeString(e.key), template.HTMLEscapeString(e.val))
	}
	b.WriteString(`</dl>`)
	return b.String()
}

func trBadge(live bool) string {
	if !live {
		return ""
	}
	return `<span class="seo-badge">aktif dönem · canlı veri</span>`
}

func buildBranchLinks(bls []branchLink) string {
	var b strings.Builder
	b.WriteString(`<ul class="seo-branchlist">`)
	for _, bl := range bls {
		extra := fmt.Sprintf("%d şube", bl.Sections)
		if bl.Levels != "" {
			extra += " · " + bl.Levels
		}
		fmt.Fprintf(&b, `<li><a href="%s">%s</a> <span>%s</span></li>`,
			template.HTMLEscapeString(bl.URL),
			template.HTMLEscapeString(bl.Code),
			template.HTMLEscapeString(extra),
		)
	}
	b.WriteString(`</ul>`)
	// Faz 3'te kurs kodları da listeye gelecek; şimdilik boş.
	return b.String()
}

func buildContent(parts ...string) string {
	return strings.Join(parts, "\n")
}

func jsonldScript(v any) template.HTML {
	b, _ := json.Marshal(v)
	return template.HTML(`<script type="application/ld+json">` + string(b) + `</script>`)
}

// --- tarih yardımcıları ---

func fmtDate(iso string) string {
	if iso == "" {
		return "—"
	}
	t, err := time.Parse(time.RFC3339, iso)
	if err != nil {
		return iso
	}
	return fmt.Sprintf("%d %s %d", t.Day(), trMonths[int(t.Month())], t.Year())
}

func dateOf(iso string) string {
	if iso == "" {
		return ""
	}
	t, err := time.Parse(time.RFC3339, iso)
	if err != nil {
		return ""
	}
	return t.Format("2006-01-02")
}

// --- JSON yardımcıları ---

func readJSON(path string, v any) error {
	b, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, v)
}

// --- sıralı anahtar yardımcıları ---

func sortedKeys(m any) []string {
	switch m := m.(type) {
	case map[string]*branchAgg:
		out := make([]string, 0, len(m))
		for k := range m {
			out = append(out, k)
		}
		sort.Strings(out)
		return out
	case map[string]struct{}:
		out := make([]string, 0, len(m))
		for k := range m {
			out = append(out, k)
		}
		sort.Strings(out)
		return out
	}
	return nil
}
