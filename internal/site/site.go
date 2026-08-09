// Package site, arşiv verisinden arama motorlarına yönelik statik sayfalar
// üretir: her dönem ve her branş için birer HTML sayfası + sitemap.
//
// Çıktı tamamen deterministiktir (zaman damgaları veriden türetilir), böylece
// CI'da üretim "commit ile aynı mı" diye denetlenebilir ve scrape botu sürekli
// sahte commit üretmez.
package site

import (
	"bufio"
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

// lang, sayfa şablonundaki tüm sabit metinlerin çevirisini taşır.
type lang struct {
	Code              string // "tr" veya "en"
	SiteTitle         string
	SiteTagline       string
	NavDersler        string
	NavGecmis         string
	NavOnsart         string
	NavSinavlar       string
	NavTakvim         string
	NavProgram        string
	NavHakkinda       string
	CrumbHome         string
	FootScanned       string
	FootLive          string
	FootSitemap       string
	TermSuffix        string // "ders programı ve arşivi" / "course schedule and archive"
	TermLeadFmt       string // "İTÜ %s — %d ders, %d şube, %d branş."
	TermLiveBadge     string // "aktif dönem · canlı veri" / "active term · live data"
	TermBranchHeading string // "Bu dönemde açılan branşlar"
	TermSearchCTA     string // "bu dönemi canlı ara" / "search this term live"
	TermDataCSV       string // "CSV"
	TermDataJSON      string // "JSON (arama indeksi)"
	TermDataPrefix    string // "Tüm veri:" / "All data:"
	StatSections      string // "şube"
	StatCourses       string // "ders"
	StatBranches      string // "branş"
	StatScanned       string // "son tarama"
	BranchTitleFmt    string // "%s branşı dersleri ve dönem dökümü"
	BranchLeadFmt     string // "İTÜ %s branşının tüm dönemlerdeki arşivi — %d ders kodu, %d dönem, %d şube."
	BranchH1Fmt       string // "%s branşı"
	BranchSearchCTA   string // "bu branşı canlı ara"
	BranchCodeHeading string // "Ders kodları" / "Course codes"
	BranchTermHeading string // "Dönem dökümü"
	BranchTermCol     string // "Dönem"
	BranchSecCol      string // "Şube"
	CourseTitleFmt    string // "%s — ..."
	CourseLeadFmt     string // "%s (%s) — İTÜ'de %d dönemde..."
	CourseSearchCTA   string
	CourseStatTerms   string // "toplam dönem"
	CourseSectHead    string // "Son dönem şubeleri"
	CourseSectCRN     string
	CourseSectInstr   string
	CourseSectTime    string
	CourseSectCap     string
	CourseHistHead    string // "Dönem geçmişi"
	CourseHistTerm    string // "Dönem"
	CourseHistInstr   string // "Öğretim Üyesi"
	CourseHistCap     string // "Kont"
	CourseHistEnr     string // "Yazılan"
	CourseQuotaHead   string // "Kontenjan doluluk geçmişi"
	InstrTitleFmt     string // "%s — verdiği dersler"
	InstrLeadFmt      string
	InstrStatTerms    string // "toplam dönem"
	InstrStatRecords  string // "ders kaydı"
	InstrTableHead    string // "Verdiği dersler"
	InstrColCourse    string // "Ders"
	InstrColName      string // "Adı"
	InstrColTerm      string // "Dönem"
	InstrColCap       string // "Kont"
	InstrColEnr       string // "Yazılan"
}

var langTR = lang{
	Code: "tr",
	SiteTitle: "İTÜ Ders Arşivi",
	SiteTagline: "obs.itu.edu.tr ve takvim.sis.itu.edu.tr üzerinden otomatik toplanan açık veri. Hangi dönemde hangi dersin açıldığı, kim verdiği, kaç kişi yazıldığı — kalıcı olarak.",
	NavDersler: "dersler", NavGecmis: "geçmiş", NavOnsart: "önşart", NavSinavlar: "sınavlar", NavTakvim: "takvim", NavProgram: "program", NavHakkinda: "hakkında",
	CrumbHome: "Ders Arşivi", FootScanned: "son tarama", FootLive: "canlı site", FootSitemap: "sitemap",
	TermSuffix: "ders programı ve arşivi",
	TermLeadFmt: "İTÜ %s — %d ders, %d şube, %d branş.",
	TermLiveBadge: "aktif dönem · canlı veri", TermBranchHeading: "Bu dönemde açılan branşlar",
	TermSearchCTA: "bu dönemi canlı ara", TermDataCSV: "CSV", TermDataJSON: "JSON (arama indeksi)", TermDataPrefix: "Tüm veri:",
	StatSections: "şube", StatCourses: "ders", StatBranches: "branş", StatScanned: "son tarama",
	BranchTitleFmt: "%s branşı dersleri ve dönem dökümü", BranchLeadFmt: "İTÜ %s branşının tüm dönemlerdeki arşivi — %d ders kodu, %d dönem, %d şube.",
	BranchH1Fmt: "%s branşı", BranchSearchCTA: "bu branşı canlı ara", BranchCodeHeading: "Ders kodları", BranchTermHeading: "Dönem dökümü",
	BranchTermCol: "Dönem", BranchSecCol: "Şube",
	CourseTitleFmt: "%s — %s",
	CourseLeadFmt: "%s (%s) — İTÜ'de %d dönemde açılmış bir ders. Geçmiş şubeleri, öğretim üyeleri ve son dönem programı.",
	CourseSearchCTA: "bu dersi canlı ara", CourseStatTerms: "toplam dönem",
	CourseSectHead: "Son dönem şubeleri", CourseSectCRN: "CRN", CourseSectInstr: "Öğretim Üyesi", CourseSectTime: "Zaman", CourseSectCap: "Kont/Yazılan",
	CourseHistHead: "Dönem geçmişi", CourseHistTerm: "Dönem", CourseHistInstr: "Öğretim Üyesi", CourseHistCap: "Kont", CourseHistEnr: "Yazılan",
	CourseQuotaHead: "Kontenjan doluluk geçmişi",
	InstrTitleFmt: "%s — verdiği dersler",
	InstrLeadFmt: "%s — İTÜ'de %d dönemde, %d farklı ders.",
	InstrStatTerms: "toplam dönem", InstrStatRecords: "ders kaydı", InstrTableHead: "Verdiği dersler",
	InstrColCourse: "Ders", InstrColName: "Adı", InstrColTerm: "Dönem", InstrColCap: "Kont", InstrColEnr: "Yazılan",
}

var langEN = lang{
	Code: "en",
	SiteTitle: "İTÜ Course Archive",
	SiteTagline: "Open data automatically collected from obs.itu.edu.tr. Which courses opened in which term, who taught them, how many enrolled — permanently archived.",
	NavDersler: "courses", NavGecmis: "history", NavOnsart: "prereqs", NavSinavlar: "exams", NavTakvim: "calendar", NavProgram: "schedule", NavHakkinda: "about",
	CrumbHome: "Course Archive", FootScanned: "last scrape", FootLive: "live site", FootSitemap: "sitemap",
	TermSuffix: "course schedule and archive",
	TermLeadFmt: "İTÜ %s — %d courses, %d sections, %d branches.",
	TermLiveBadge: "active term · live data", TermBranchHeading: "Branches open this term",
	TermSearchCTA: "search this term live", TermDataCSV: "CSV", TermDataJSON: "JSON (search index)", TermDataPrefix: "All data:",
	StatSections: "sections", StatCourses: "courses", StatBranches: "branches", StatScanned: "last scraped",
	BranchTitleFmt: "%s branch courses and term breakdown", BranchLeadFmt: "İTÜ %s branch archive across all terms — %d course codes, %d terms, %d sections.",
	BranchH1Fmt: "%s branch", BranchSearchCTA: "search this branch live", BranchCodeHeading: "Course codes", BranchTermHeading: "Term breakdown",
	BranchTermCol: "Term", BranchSecCol: "Sections",
	CourseTitleFmt: "%s — %s",
	CourseLeadFmt: "%s (%s) — offered in %d terms at İTÜ. Historical sections, instructors, and latest schedule.",
	CourseSearchCTA: "search this course live", CourseStatTerms: "total terms",
	CourseSectHead: "Latest term sections", CourseSectCRN: "CRN", CourseSectInstr: "Instructor", CourseSectTime: "Time", CourseSectCap: "Cap/Enr",
	CourseHistHead: "Term history", CourseHistTerm: "Term", CourseHistInstr: "Instructor", CourseHistCap: "Cap", CourseHistEnr: "Enr",
	CourseQuotaHead: "Enrollment history",
	InstrTitleFmt: "%s — courses taught",
	InstrLeadFmt: "%s — taught across %d terms, %d distinct courses at İTÜ.",
	InstrStatTerms: "total terms", InstrStatRecords: "course records", InstrTableHead: "Courses taught",
	InstrColCourse: "Course", InstrColName: "Name", InstrColTerm: "Term", InstrColCap: "Cap", InstrColEnr: "Enr",
}

var trMonths = []string{
	"", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
	"Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
}

// Builder, docs kökünden veriyi okuyup sayfaları yazar.
type Builder struct {
	root    string // dataRoot — verinin okunduğu kök (her zaman docs/)
	outRoot string // sayfaların yazıldığı kök (docs/ veya docs/en/)
	l       lang
	index   model.SiteIndex
	aggs    map[string]*branchAgg
	courses map[string]*histCourse
	courseSects map[string][]sectRow
	instructors map[string]*histInstr
	quotaSeries map[string][]quotaPoint
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

// quotaPoint, quota JSONL'den tekil bir veri noktası.
type quotaPoint struct {
	Ts  string
	Enr int
	Cap int
}

// histInstr, history/instructors/<bucket>.json'dan gelen tek bir hoca.
type histInstr struct {
	Name  string
	Rows  []instrRow
	Terms int
}

type instrRow struct {
	Term string
	Code string
	Name string
	Cap  int
	Enr  int
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

func New(dataRoot, langCode string) *Builder {
	l := langTR
	outRoot := dataRoot
	if langCode == "en" {
		outRoot = filepath.Join(dataRoot, "en")
		l = langEN
	}
	return &Builder{root: dataRoot, outRoot: outRoot, l: l}
}

// Generate, dizinde biriken geçmiş sayfaları da temizleyen ana üreticidir.
// root altında dersler/ ve brans/ klasörlerini silip yeniden oluşturur.
func (b *Builder) Generate() error {
	// Eski çıktıyı temizle.
	_ = os.RemoveAll(filepath.Join(b.outRoot, "dersler"))
	_ = os.RemoveAll(filepath.Join(b.outRoot, "brans"))
	_ = os.RemoveAll(filepath.Join(b.outRoot, "ders"))
	_ = os.RemoveAll(filepath.Join(b.outRoot, "hoca"))

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

	// Hoca geçmişi (EN'de atlanır — Cloudflare dosya limiti).
	instrSlugs := map[string]string{}
	if b.l.Code != "en" {
		if err := b.loadInstructors(); err != nil {
			return err
		}
		for name := range b.instructors {
			instrSlugs[name] = instructorSlug(name)
		}
	} else {
		b.instructors = map[string]*histInstr{}
	}
	// Kontenjan zaman serisi (grafikler için).
	b.loadQuotaSeries()

	// Kurs geçmişini ve son dönem şubelerini yükle.
	if err := b.loadCourseData(terms); err != nil {
		return err
	}

	// Dönem etiketi haritası (her slug → label).
	termLabels := map[string]string{}
	for _, t := range b.index.Terms {
		termLabels[t.Slug] = t.Label
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
		if err := b.writeCoursePage(code, courseSlugs[code], instrSlugs, termLabels); err != nil {
			return err
		}
	}

	// Hoca sayfaları (yalnızca TR — Cloudflare 20k dosya limiti).
	if b.l.Code != "en" {
		instrSlugList := make([]string, 0, len(b.instructors))
		for name := range b.instructors {
			instrSlugList = append(instrSlugList, instructorSlug(name))
		}
		sort.Strings(instrSlugList)
		for _, slug := range instrSlugList {
			if err := b.writeInstructorPage(slug, instrSlugs, courseSlugs, termLabels); err != nil {
				return err
			}
		}
	}

	for _, tr := range terms {
		if err := b.writeTermPage(tr); err != nil {
			return err
		}
	}

	brCodes := sortedKeys(b.aggs)
	for _, code := range brCodes {
		if err := b.writeBranchPage(code, termLabels, courseSlugs); err != nil {
			return err
		}
	}

	if b.l.Code == "en" {
		if err := b.writeIndexPage(terms); err != nil {
			return err
		}
	}

	return b.writeSitemap(terms, brCodes, courseSlugs, instrSlugs)
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

	return b.writePage(filepath.Join(b.outRoot, "dersler", tr.tref.Slug, "index.html"),
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

	return b.writePage(filepath.Join(b.outRoot, "brans", code, "index.html"),
		title, lead, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
}

func (b *Builder) writeSitemap(terms []termRow, brCodes []string, courseSlugs map[string]string, instrSlugs map[string]string) error {
	rootDate := dateOf(b.index.ScrapedAt)
	var out strings.Builder
	out.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	out.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")

	sitemapURL(&out, baseURL+"/", rootDate, "daily", "1.0")
	if b.l.Code == "en" {
		sitemapURL(&out, baseURL+"/en/", rootDate, "daily", "0.9")
	}

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
	// Hoca sayfaları (yalnızca TR).
	if b.l.Code != "en" {
		hslugList := make([]string, 0, len(instrSlugs))
		for _, s := range instrSlugs { hslugList = append(hslugList, s) }
		sort.Strings(hslugList)
		for _, s := range hslugList {
			sitemapURL(&out, fmt.Sprintf("%s/hoca/%s/", baseURL, s), rootDate, "monthly", "0.6")
		}
	}

	out.WriteString("</urlset>\n")
	return os.WriteFile(filepath.Join(b.outRoot, "sitemap.xml"), []byte(out.String()), 0o644)
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
<html lang="{{.Lang.Code}}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<script>(function(){try{var t=localStorage.getItem('itu-theme');if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme',matchMedia('(prefers-color-scheme:light)').matches?'light':'dark')}catch(e){}})()</script>
<title>{{.Title}} — {{.Lang.SiteTitle}}</title>
<meta name="description" content="{{.Description}}">
<link rel="canonical" href="{{.Canonical}}">
{{if .AltURL}}<link rel="alternate" hreflang="{{.AltLang}}" href="{{.AltURL}}">{{end}}
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" href="/favicon.png" type="image/png">
{{.JSONLD}}
</head>
<body>
<div class="scanlines" aria-hidden="true"></div>
<header class="masthead">
 <div class="wrap">
  <div class="mast-top">
   <div class="brand">
    <span class="prompt">root@itu</span><span class="path">:~/arsiv</span><span class="caret">$</span>
    <h1><a href="/">{{.Lang.SiteTitle}}</a></h1>
   </div>
  </div>
  <p class="tagline">{{.Lang.SiteTagline}}</p>
 </div>
</header>
<nav class="tabs wrap" role="navigation" aria-label="Bölümler">
 <a href="/">{{.Lang.NavDersler}}</a>
 <a href="/#gecmis">{{.Lang.NavGecmis}}</a>
 <a href="/#onsart">{{.Lang.NavOnsart}}</a>
 <a href="/#sinavlar">{{.Lang.NavSinavlar}}</a>
 <a href="/#takvim">{{.Lang.NavTakvim}}</a>
 <a href="/#program">{{.Lang.NavProgram}}</a>
 <a href="/#hakkinda">{{.Lang.NavHakkinda}}</a>
</nav>
<main class="wrap">
{{.Content}}
</main>
<footer class="wrap">
 <span>{{.Lang.FootScanned}} {{.Scraped}}</span> · <a href="/">{{.Lang.FootLive}}</a> · <a href="/sitemap.xml">{{.Lang.FootSitemap}}</a>
</footer>
</body>
</html>`))

type pageData struct {
	Title, Description, Canonical, Scraped string
	AltURL, AltLang                        string
	Content                                template.HTML
	JSONLD                                 template.HTML
	Lang                                   lang
}

// writeIndexPage, dil bazlı statik ana sayfa üretir (/en/).
func (b *Builder) writeIndexPage(terms []termRow) error {
	prefix := ""
	if b.l.Code == "en" {
		prefix = "en/"
	}
	canonical := baseURL + "/" + prefix
	title := b.l.SiteTitle
	desc := b.l.SiteTagline

	var recent []string
	for i, tr := range terms {
		if i >= 10 { break }
		recent = append(recent, fmt.Sprintf(
			`<li><a href="/%sdersler/%s/">%s</a> — %d %s</li>`,
			prefix, tr.tref.Slug, template.HTMLEscapeString(tr.tref.Label),
			tr.meta.Sections, b.l.StatSections,
		))
	}

	content := template.HTML(buildContent(
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(title)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(desc)),
		`<p class="cta"><a class="btn" href="/`+prefix+`">`+b.l.FootLive+`</a></p>`,
		`<h2>`+b.l.TermBranchHeading+`</h2>`,
		`<ul class="seo-branchlist">`+strings.Join(recent, "")+`</ul>`,
	))

	jsonld := jsonldScript([]any{map[string]any{
		"@context": "https://schema.org", "@type": "WebSite",
		"url": canonical, "name": title, "description": desc,
	}})

	return b.writePage(filepath.Join(b.outRoot, "index.html"),
		title, desc, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
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
	// hreflang alternatif URL'i
	altURL := ""
	altLang := ""
	if b.l.Code == "tr" {
		altURL = strings.Replace(canonical, baseURL, baseURL+"/en", 1)
		altLang = "en"
	} else {
		altURL = strings.Replace(canonical, baseURL+"/en", baseURL, 1)
		altLang = "tr"
	}
	return pageTmpl.Execute(f, pageData{
		Title: title, Description: desc, Canonical: canonical,
		Scraped: scraped, Content: content, JSONLD: jsonld,
		AltURL: altURL, AltLang: altLang, Lang: b.l,
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

// --- hoca sayfaları ---

// instructorSlug, bir hoca adını URL güvenli biçime normalleştirir.
// "Abdi Kükner" -> "abdi-kukner"
func instructorSlug(name string) string {
	s := strings.ToLower(name)
	s = strings.NewReplacer(
		"ü", "u", "ş", "s", "ç", "c", "ğ", "g", "ö", "o",
		"ı", "i", "İ", "i", "Ü", "u", "Ş", "s", "Ç", "c",
		"Ğ", "g", "Ö", "o", ".", "",
	).Replace(s)
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
	return trimSlug(strings.Trim(b.String(), "-"))
}

// cap max 80 karakter (Windows yolu sınırı).
const maxSlugLen = 80

func trimSlug(s string) string {
	if len(s) <= maxSlugLen { return s }
	return s[:maxSlugLen]
}

// loadInstructors, tüm hoca geçmişini okur.
func (b *Builder) loadInstructors() error {
	b.instructors = map[string]*histInstr{}
	dir := filepath.Join(b.root, "data", "history", "instructors")
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("history/instructors okunamadı: %w", err)
	}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		var raw map[string]json.RawMessage
		if err := readJSON(filepath.Join(dir, e.Name()), &raw); err != nil {
			return fmt.Errorf("%s: %w", e.Name(), err)
		}
		for name, r := range raw {
			var full struct {
				Name  string    `json:"name"`
				Rows  [][]any   `json:"rows"`
				Terms int       `json:"terms"`
			}
			if err := json.Unmarshal(r, &full); err != nil {
				return fmt.Errorf("%s/%s: %w", e.Name(), name, err)
			}
			hi := &histInstr{Name: full.Name, Terms: full.Terms}
			for _, row := range full.Rows {
				if len(row) >= 5 {
					ir := instrRow{}
					if s, ok := row[0].(string); ok { ir.Term = s }
					if s, ok := row[1].(string); ok { ir.Code = s }
					if s, ok := row[2].(string); ok { ir.Name = s }
					switch v := row[3].(type) { case float64: ir.Cap = int(v) }
					switch v := row[4].(type) { case float64: ir.Enr = int(v) }
					hi.Rows = append(hi.Rows, ir)
				}
			}
			b.instructors[name] = hi
		}
	}
	return nil
}

// writeInstructorPage, tek bir hoca için sayfa üretir.
func (b *Builder) writeInstructorPage(slug string, instrSlugs map[string]string, courseSlugs map[string]string, termLabels map[string]string) error {
	// slug → name araması (ters eşleme).
	var hi *histInstr
	for name, s := range instrSlugs {
		if s == slug {
			hi = b.instructors[name]
			break
		}
	}
	if hi == nil {
		return fmt.Errorf("hoca bulunamadı: %s", slug)
	}

	canonical := fmt.Sprintf("%s/hoca/%s/", baseURL, slug)
	title := hi.Name + " — verdiği dersler"
	lead := fmt.Sprintf("%s — İTÜ'de %d dönemde, %d farklı ders.", hi.Name, hi.Terms, distinctCodes(hi.Rows))

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":    "https://schema.org",
			"@type":       "Person",
			"url":         canonical,
			"name":        hi.Name,
			"affiliation": map[string]string{"@type": "CollegeOrUniversity", "name": "İstanbul Teknik Üniversitesi"},
		},
	})

	// Ders tablosu.
	sort.Slice(hi.Rows, func(i, j int) bool {
		if hi.Rows[i].Term != hi.Rows[j].Term {
			return term.SortKey(hi.Rows[i].Term) > term.SortKey(hi.Rows[j].Term)
		}
		return hi.Rows[i].Code < hi.Rows[j].Code
	})

	var rows []string
	for _, r := range hi.Rows {
		label := r.Term
		if l, ok := termLabels[r.Term]; ok {
			label = l
		}
		codeHTML := template.HTMLEscapeString(r.Code)
		if cs, ok := courseSlugs[r.Code]; ok {
			codeHTML = fmt.Sprintf(`<a href="/ders/%s/">%s</a>`, cs, template.HTMLEscapeString(r.Code))
		}
		rows = append(rows, fmt.Sprintf(
			`<tr><td>%s</td><td>%s</td><td><a href="/dersler/%s/">%s</a></td><td>%d</td><td>%d</td></tr>`,
			codeHTML,
			template.HTMLEscapeString(r.Name),
			template.HTMLEscapeString(r.Term),
			template.HTMLEscapeString(label),
			r.Cap, r.Enr,
		))
	}

	content := template.HTML(buildContent(
		fmt.Sprintf(`<nav class="crumb"><a href="/">Ders Arşivi</a> › <span>%s</span></nav>`, template.HTMLEscapeString(hi.Name)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(hi.Name)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		`<dl class="seo-stats">`+
			fmt.Sprintf(`<div><dt>toplam dönem</dt><dd>%d</dd></div>`, hi.Terms)+
			fmt.Sprintf(`<div><dt>ders kaydı</dt><dd>%d</dd></div>`, len(hi.Rows))+
			`</dl>`,
		`<h2>Verdiği dersler</h2>`,
		`<table class="seo-table"><thead><tr><th>Ders</th><th>Adı</th><th>Dönem</th><th>Kont</th><th>Yazılan</th></tr></thead><tbody>`+
			strings.Join(rows, "")+`</tbody></table>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "hoca", slug, "index.html"),
		title, lead, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
}

func distinctCodes(rows []instrRow) int {
	seen := map[string]struct{}{}
	for _, r := range rows {
		if r.Code != "" {
			seen[r.Code] = struct{}{}
		}
	}
	return len(seen)
}

// --- kontenjan zaman serisi ---

// loadQuotaSeries, mevcut quota JSONL dosyalarını okuyup per-CRN seri oluşturur.
// Hata durumunda sessizce atlar (veri seyrek, her dönemde yok).
func (b *Builder) loadQuotaSeries() {
	b.quotaSeries = map[string][]quotaPoint{}
	dir := filepath.Join(b.root, "data", "quota")
	entries, err := os.ReadDir(dir)
	if err != nil {
		return
	}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".jsonl") {
			continue
		}
		path := filepath.Join(dir, e.Name())
		f, err := os.Open(path)
		if err != nil {
			continue
		}
		defer f.Close()
		// replay: her satırı uygulayarak tam durumu takip et.
		state := map[string]quotaPoint{} // CRN -> son nokta
		scanner := bufio.NewScanner(f)
		scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
		for scanner.Scan() {
			line := scanner.Bytes()
			if len(line) == 0 {
				continue
			}
			var snap struct {
				TS   string           `json:"ts"`
				Full bool             `json:"full,omitempty"`
				Cap  map[string]int   `json:"cap,omitempty"`
				Enr  map[string]int   `json:"enr,omitempty"`
				Gone []string         `json:"gone,omitempty"`
			}
			if err := json.Unmarshal(line, &snap); err != nil {
				continue
			}
			if snap.Full {
				state = map[string]quotaPoint{}
			}
			for crn, c := range snap.Cap {
				p := state[crn]
				p.Cap = c
				state[crn] = p
			}
			for crn, e := range snap.Enr {
				p := state[crn]
				p.Enr = e
				state[crn] = p
			}
			for _, crn := range snap.Gone {
				delete(state, crn)
			}
			// bu snapshot'ta değişen CRN'leri seriye ekle.
			changed := map[string]bool{}
			for c := range snap.Enr { changed[c] = true }
			for c := range snap.Cap { changed[c] = true }
			if snap.Full {
				for c := range state { changed[c] = true }
			}
			for crn := range changed {
				p := state[crn]
				p.Ts = snap.TS
				b.quotaSeries[crn] = append(b.quotaSeries[crn], p)
			}
		}
	}
}

// quotaSparkline, bir CRN'in quota serisinden mini SVG çizgi grafiği üretir.
func quotaSparkline(points []quotaPoint) template.HTML {
	if len(points) < 2 {
		return ""
	}
	// Her noktanın doluluk yüzdesini çiz.
	vals := make([]float64, len(points))
	min, max := 1e9, -1e9
	for i, p := range points {
		if p.Cap > 0 {
			vals[i] = float64(p.Enr) / float64(p.Cap)
		}
		if vals[i] < min { min = vals[i] }
		if vals[i] > max { max = vals[i] }
	}
	if max <= min { max = min + 0.01 }
	rng := max - min
	// 60x20 SVG.
	w, h := 60, 20
	var path strings.Builder
	for i, v := range vals {
		x := float64(i) / float64(len(vals)-1) * float64(w)
		y := (1 - (v-min)/rng) * float64(h)
		if i == 0 {
			fmt.Fprintf(&path, "M%.1f %.1f", x, y)
		} else {
			fmt.Fprintf(&path, "L%.1f %.1f", x, y)
		}
	}
	doldu := vals[len(vals)-1] >= 0.999
	color := "var(--cyan)"
	if doldu {
		color = "var(--amber)"
	}
	svg := fmt.Sprintf(
		`<svg class="seo-spark" width="%d" height="%d" viewBox="0 0 %d %d" aria-hidden="true"><polyline fill="none" stroke="%s" stroke-width="1.5" points="%s"/></svg>`,
		w, h, w, h, color, path.String(),
	)
	return template.HTML(svg)
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
	return trimSlug(strings.Trim(b.String(), "-"))
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
func (b *Builder) writeCoursePage(code, slug string, instrSlugs map[string]string, termLabels map[string]string) error {
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
				instrLink(s.Instructor, instrSlugs),
				template.HTMLEscapeString(s.When),
				s.Capacity, s.Enrolled,
			))
		}
		sectHTML = `<h2>Son dönem şubeleri</h2>` +
			`<table class="seo-table"><thead><tr><th>CRN</th><th>Öğretim Üyesi</th><th>Zaman</th><th>Kont/Yazılan</th></tr></thead><tbody>` +
			strings.Join(rows, "") + `</tbody></table>`
	}

	// Kontenjan serisi (yalnızca veri varsa).
	var quotaHTML string
	if qSects, _ := b.courseSects[code]; len(qSects) > 0 {
		for _, s := range qSects {
			if pl := quotaSparkline(b.quotaSeries[s.CRN]); pl != "" {
				quotaHTML += fmt.Sprintf(`<span class="seo-spark-wrap">%s <code>%s</code> %d/%d</span>`,
					pl, s.CRN, s.Capacity, s.Enrolled)
			}
		}
	}
	if quotaHTML != "" {
		quotaHTML = `<h2>Kontenjan doluluk geçmişi</h2><p class="seo-spark-line">` + quotaHTML + `</p>`
	}

	// Dönem geçmişi.
	var histRows []string
	for _, r := range hc.Rows {
		label := r.Term
		if l, ok := termLabels[r.Term]; ok {
			label = l
		}
		histRows = append(histRows, fmt.Sprintf(
			`<tr><td><a href="/dersler/%s/">%s</a></td><td>%s</td><td>%d</td><td>%d</td></tr>`,
			template.HTMLEscapeString(r.Term),
			template.HTMLEscapeString(label),
			instrLink(r.Instructor, instrSlugs),
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
		quotaHTML,
		`<h2>Dönem geçmişi</h2>`,
		`<table class="seo-table"><thead><tr><th>Dönem</th><th>Öğretim Üyesi</th><th>Kont</th><th>Yazılan</th></tr></thead><tbody>`+
			strings.Join(histRows, "")+`</tbody></table>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "ders", slug, "index.html"),
		title, desc, canonical, fmtDate(b.index.ScrapedAt), content, jsonld)
}

// instrLink, hoca adı için varsa hoca sayfasına bağlantı, yoksa düz metin döndürür.
func instrLink(name string, instrSlugs map[string]string) string {
	if name == "" || name == "***" {
		return "—"
	}
	if slug, ok := instrSlugs[name]; ok {
		return fmt.Sprintf(`<a href="/hoca/%s/">%s</a>`, slug, template.HTMLEscapeString(name))
	}
	return template.HTMLEscapeString(name)
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
