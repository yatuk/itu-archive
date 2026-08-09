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
	root    string
	index   model.SiteIndex
	aggs    map[string]*branchAgg
	courses map[string]*histCourse // code -> tarihsel kurs kaydı
	// courseSects: kursun son dönemindeki CRN satırları (search.json'dan).
	courseSects map[string][]sectRow // code -> CRN satırları
}

type branchAgg struct {
	codes        map[string]struct{}
	termSections map[string]int
	levels       map[string]struct{}
	total        int
}

// histCourse, history/courses/<branch>.json'dan gelen tek bir ders.
type histCourse struct {
	Name  string              `json:"name"`
	Terms []string            `json:"-"`
	Rows  []histCourseRow     `json:"-"`
}

type histCourseRow struct {
	Term       string
	Instructor string
	Capacity   int
	Enrolled   int
	Days       string
}

// sectRow, search.json'dan gelen hafif CRN satırı.
type sectRow struct {
	CRN        string
	Code       string
	Name       string
	Branch     string
	Instructor string
	When       string
	Capacity   int
	Enrolled   int
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
	// Eski çıktıyı temizle.
	_ = os.RemoveAll(filepath.Join(b.root, "dersler"))
	_ = os.RemoveAll(filepath.Join(b.root, "brans"))
	_ = os.RemoveAll(filepath.Join(b.root, "ders"))

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

	// Kurs geçmişini ve son dönem şubelerini yükle.
	if err := b.loadCourseData(terms); err != nil {
		return err
	}

	// Ders sayfaları (önce — branş sayfaları bunlara link verir).
	courseSlugs := make(map[string]string) // code -> slug
	for code := range b.courses {
		courseSlugs[code] = courseSlug(code)
	}
	sortedCodes := make([]string, 0, len(b.courses))
	for code := range b.courses {
		sortedCodes = append(sortedCodes, code)
	}
	sort.Strings(sortedCodes)
	for _, code := range sortedCodes {
		if err := b.writeCoursePage(code, courseSlugs[code]); err != nil {
			return err
		}
	}

	for _, tr := range terms {
		if err := b.writeTermPage(tr); err != nil {
			return err
		}
	}

	brCodes := sortedKeys(b.aggs)
	termLabels := map[string]string{}
	for _, tr := range terms {
		if tr.tref.Label != "" {
			termLabels[tr.tref.Slug] = tr.tref.Label
		}
	}
	for _, code := range brCodes {
		if err := b.writeBranchPage(code, termLabels, courseSlugs); err != nil {
			return err
		}
	}

	return b.writeSitemap(terms, brCodes, courseSlugs)
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

func (b *Builder) writeBranchPage(code string, termLabels map[string]string, courseSlugs map[string]string) error {
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
		if slug, ok := courseSlugs[c]; ok {
			codeSpans = append(codeSpans, fmt.Sprintf(`<a href="/ders/%s/"><code>%s</code></a>`, slug, template.HTMLEscapeString(c)))
		} else {
			codeSpans = append(codeSpans, fmt.Sprintf(`<code>%s</code>`, template.HTMLEscapeString(c)))
		}
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

func (b *Builder) writeSitemap(terms []termRow, brCodes []string, courseSlugs map[string]string) error {
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
	for _, c := range brCodes {
		sitemapURL(&out, fmt.Sprintf("%s/brans/%s/", baseURL, c), rootDate, "monthly", "0.6")
	}
	// Ders sayfaları.
	cslugList := make([]string, 0, len(courseSlugs))
	for _, s := range courseSlugs { cslugList = append(cslugList, s) }
	sort.Strings(cslugList)
	for _, s := range cslugList {
		sitemapURL(&out, fmt.Sprintf("%s/ders/%s/", baseURL, s), rootDate, "monthly", "0.8")
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

// --- ders sayfaları ---

// courseSlug, bir ders kodunu URL güvenli biçime normalleştirir.
// "BLG 101E" -> "blg-101e"
func courseSlug(code string) string {
	s := strings.ToLower(code)
	var b strings.Builder
	lastDash := false
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
			lastDash = false
		} else if !lastDash && b.Len() > 0 {
			b.WriteByte('-')
			lastDash = true
		}
	}
	return strings.Trim(b.String(), "-")
}

// loadCourseData, ders geçmişini okur ve her ders için son dönem şubelerini
// search.json'dan çıkarır.
func (b *Builder) loadCourseData(terms []termRow) error {
	b.courses = map[string]*histCourse{}
	b.courseSects = map[string][]sectRow{}

	// Tüm branş tarih dosyalarını oku.
	histDir := filepath.Join(b.root, "data", "history", "courses")
	entries, err := os.ReadDir(histDir)
	if err != nil {
		return fmt.Errorf("history/courses okunamadı: %w", err)
	}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		var raw map[string]json.RawMessage
		if err := readJSON(filepath.Join(histDir, e.Name()), &raw); err != nil {
			return fmt.Errorf("%s: %w", e.Name(), err)
		}
		for code, r := range raw {
			var hc histCourse
			if err := json.Unmarshal(r, &hc); err != nil {
				return fmt.Errorf("%s/%s: %w", e.Name(), code, err)
			}
			// terms haricinde rows'ları da çöz.
			var full struct {
				Name string          `json:"name"`
				Terms []string       `json:"terms"`
				Rows  [][]any        `json:"rows"`
			}
			if err := json.Unmarshal(r, &full); err != nil {
				return fmt.Errorf("%s/%s rows: %w", e.Name(), code, err)
			}
			hc.Name = full.Name
			hc.Terms = full.Terms
			for _, row := range full.Rows {
				if len(row) >= 5 {
					hr := histCourseRow{}
					if s, ok := row[0].(string); ok { hr.Term = s }
					if s, ok := row[1].(string); ok { hr.Instructor = s }
					switch v := row[2].(type) { case float64: hr.Capacity = int(v) }
					switch v := row[3].(type) { case float64: hr.Enrolled = int(v) }
					if s, ok := row[4].(string); ok { hr.Days = s }
					hc.Rows = append(hc.Rows, hr)
				}
			}
			b.courses[code] = &hc
		}
	}

	// Her ders için search.json'daki son dönemi bul, grup yap.
	want := map[string][]string{} // slug -> [codes...]
	for code, hc := range b.courses {
		// En güncel dönemi bul (terms sıralı, son eleman en yeni).
		slug := ""
		if len(hc.Terms) > 0 {
			slug = hc.Terms[len(hc.Terms)-1]
		}
		if slug == "" {
			// Dönem listesi tarih dosyasında bozuk; ders sayfası şube tablosuz olacak.
			continue
		}
		want[slug] = append(want[slug], code)
	}

	// Her slug için search.json'dan CRN satırlarını oku.
	for slug, codes := range want {
		var rows [][]json.RawMessage
		p := filepath.Join(b.root, "data", "terms", slug, "search.json")
		if _, err := os.Stat(p); os.IsNotExist(err) {
			continue
		}
		if err := readJSON(p, &rows); err != nil {
			continue
		}
		codeSet := map[string]bool{}
		for _, c := range codes { codeSet[c] = true }
		for _, r := range rows {
			if len(r) < 8 {
				continue
			}
			var code, crn, name, branch, instr, when string
			json.Unmarshal(r[0], &crn)
			json.Unmarshal(r[1], &code)
			json.Unmarshal(r[2], &name)
			json.Unmarshal(r[3], &branch)
			json.Unmarshal(r[4], &instr)
			json.Unmarshal(r[5], &when)
			if !codeSet[code] {
				continue
			}
			var cap, enr float64
			json.Unmarshal(r[6], &cap)
			json.Unmarshal(r[7], &enr)
			b.courseSects[code] = append(b.courseSects[code], sectRow{
				CRN: crn, Code: code, Name: name, Branch: branch,
				Instructor: instr, When: when, Capacity: int(cap), Enrolled: int(enr),
			})
		}
	}

	return nil
}

// writeCoursePage, tek bir ders için sayfa üretir.
func (b *Builder) writeCoursePage(code, slug string) error {
	hc := b.courses[code]
	if hc == nil {
		return fmt.Errorf("ders bulunamadı: %s", code)
	}

	canonical := fmt.Sprintf("%s/ders/%s/", baseURL, slug)
	title := code + " — " + hc.Name
	branch := code
	if idx := strings.IndexByte(code, ' '); idx > 0 {
		branch = code[:idx]
	}
	desc := fmt.Sprintf("%s (%s) — İTÜ'de %d dönemde açılmış bir ders. Geçmiş şubeleri, öğretim üyeleri ve son dönem programı.",
		code, hc.Name, len(hc.Terms))

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":    "https://schema.org",
			"@type":       "Course",
			"url":         canonical,
			"name":        code,
			"description": hc.Name,
			"inLanguage":  "tr-TR",
			"provider":    map[string]string{"@type": "CollegeOrUniversity", "name": "İstanbul Teknik Üniversitesi"},
		},
	})

	// Son dönem şube tablosu.
	var sectHTML string
	if sects, ok := b.courseSects[code]; ok && len(sects) > 0 {
		var rows []string
		for _, s := range sects {
			rows = append(rows, fmt.Sprintf(
				`<tr><td>%s</td><td>%s</td><td>%s</td><td>%d/%d</td></tr>`,
				template.HTMLEscapeString(s.CRN),
				template.HTMLEscapeString(s.Instructor),
				template.HTMLEscapeString(s.When),
				s.Capacity, s.Enrolled,
			))
		}
		sectHTML = `<h2>Son dönem şubeleri</h2>` +
			`<table class="seo-table"><thead><tr><th>CRN</th><th>Öğretim Üyesi</th><th>Zaman</th><th>Kont/Yazılan</th></tr></thead><tbody>` +
			strings.Join(rows, "") + `</tbody></table>`
	}

	// Dönem geçmişi.
	var histRows []string
	for _, r := range hc.Rows {
		label := r.Term
		if lbl, ok := termLabelsFor(b.index); ok {
			if v, ok2 := lbl[r.Term]; ok2 {
				label = v
			}
		}
		histRows = append(histRows, fmt.Sprintf(
			`<tr><td><a href="/dersler/%s/">%s</a></td><td>%s</td><td>%d</td><td>%d</td></tr>`,
			template.HTMLEscapeString(r.Term),
			template.HTMLEscapeString(label),
			template.HTMLEscapeString(r.Instructor),
			r.Capacity, r.Enrolled,
		))
	}

	content := template.HTML(buildContent(
		fmt.Sprintf(`<nav class="crumb"><a href="/">Ders Arşivi</a> › <a href="/brans/%s/">%s</a> › <span>%s</span></nav>`,
			template.HTMLEscapeString(branch), template.HTMLEscapeString(branch), template.HTMLEscapeString(code)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(code)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(hc.Name)),
		fmt.Sprintf(`<p class="cta"><a class="btn" href="/?term=%s&code=%s">bu dersi canlı ara</a></p>`,
			b.index.CurrentSlug, template.HTMLEscapeString(code)),
		`<dl class="seo-stats">`+
			fmt.Sprintf(`<div><dt>toplam dönem</dt><dd>%d</dd></div>`, len(hc.Terms))+
			`</dl>`,
		sectHTML,
		`<h2>Dönem geçmişi</h2>`,
		`<table class="seo-table"><thead><tr><th>Dönem</th><th>Öğretim Üyesi</th><th>Kont</th><th>Yazılan</th></tr></thead><tbody>`+
			strings.Join(histRows, "")+`</tbody></table>`,
	))

	return b.writePage(filepath.Join(b.root, "ders", slug, "index.html"),
		title, desc, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
}

// termLabelsFor, sitemap index'indeki termin referanslarından slug->label haritası döndürür.
func termLabelsFor(ix model.SiteIndex) (map[string]string, bool) {
	out := map[string]string{}
	for _, t := range ix.Terms {
		out[t.Slug] = t.Label
	}
	return out, len(out) > 0
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
