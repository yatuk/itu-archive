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
	Code                string // "tr" veya "en"
	SiteTitle           string
	SiteTagline         string
	NavDersler          string
	NavGecmis           string
	NavOnsart           string
	NavSinavlar         string
	NavTakvim           string
	NavProgram          string
	NavHakkinda         string
	CrumbHome           string
	SkipToContent       string // klavye kullanıcısı için ilk odak bağlantısı
	FootScanned         string
	FootLive            string
	FootSitemap         string
	TermSuffix          string // "ders programı ve arşivi" / "course schedule and archive"
	TermLeadFmt         string // "İTÜ %s: %d ders, %d şube, %d branş."
	TermLiveBadge       string // "aktif dönem · canlı veri" / "active term · live data"
	TermBranchHeading   string // "Bu dönemde açılan branşlar"
	TermSearchCTA       string // "bu dönemi canlı ara" / "search this term live"
	TermDataCSV         string // "CSV"
	TermDataJSON        string // "JSON (arama indeksi)"
	TermDataPrefix      string // "Tüm veri:" / "All data:"
	StatSections        string // "şube"
	StatCourses         string // "ders"
	StatBranches        string // "branş"
	StatScanned         string // "son tarama"
	BranchTitleFmt      string // "%s branşı dersleri ve dönem dökümü"
	BranchLeadFmt       string // "İTÜ %s branşının tüm dönemlerdeki arşivi: %d ders kodu, %d dönem, %d şube."
	BranchH1Fmt         string // "%s branşı"
	BranchSearchCTA     string // "bu branşı canlı ara"
	BranchCodeHeading   string // "Ders kodları" / "Course codes"
	BranchTermHeading   string // "Dönem dökümü"
	BranchTermCol       string // "Dönem"
	BranchSecCol        string // "Şube"
	CourseTitleFmt      string // "%s: ..."
	CourseLeadFmt       string // "%s (%s): İTÜ'de %d dönemde..."
	CourseSearchCTA     string
	CourseStatTerms     string // "toplam dönem"
	CourseSectHead      string // "Son dönem şubeleri"
	CourseSectCRN       string
	CourseSectInstr     string
	CourseSectTime      string
	CourseSectCap       string
	CourseHistHead      string // "Dönem geçmişi"
	CourseHistTerm      string // "Dönem"
	CourseHistInstr     string // "Öğretim Üyesi"
	CourseHistCap       string // "Kont"
	CourseHistEnr       string // "Yazılan"
	CourseQuotaHead     string // "Kontenjan doluluk geçmişi"
	InstrTitleFmt       string // "%s: verdiği dersler"
	InstrLeadFmt        string
	InstrDescriptionFmt string
	InstrStatTerms      string // "toplam dönem"
	InstrStatRecords    string // "ders kaydı"
	InstrStatCourses    string // "farklı ders"
	InstrStatLatest     string // "son kayıt"
	InstrFrequentHead   string // "En sık verdiği dersler"
	InstrBranchesHead   string // "İlgili branşlar"
	InstrHistoryHead    string // "Dönemlere göre ders geçmişi"
	InstrDataNote       string // veri kaynağı / resmî profil uyarısı
	InstrTableHead      string // "Verdiği dersler"
	InstrColCourse      string // "Ders"
	InstrColName        string // "Adı"
	InstrColTerm        string // "Dönem"
	InstrColCap         string // "Kont"
	InstrColEnr         string // "Yazılan"
}

var langTR = lang{
	Code:        "tr",
	SiteTitle:   "İTÜ Ders Arşivi",
	SiteTagline: "obs.itu.edu.tr ve takvim.sis.itu.edu.tr üzerinden otomatik toplanan açık veri. Hangi dönemde hangi dersin açıldığı, kim verdiği, kaç kişi yazıldığı: kalıcı olarak.",
	NavDersler:  "dersler", NavGecmis: "geçmiş", NavOnsart: "önşart", NavSinavlar: "sınavlar", NavTakvim: "takvim", NavProgram: "program", NavHakkinda: "hakkında",
	CrumbHome: "Ders Arşivi", SkipToContent: "İçeriğe atla",
	FootScanned: "son tarama", FootLive: "canlı site", FootSitemap: "sitemap",
	TermSuffix:    "ders programı ve arşivi",
	TermLeadFmt:   "İTÜ %s: %d ders, %d şube, %d branş.",
	TermLiveBadge: "aktif dönem · canlı veri", TermBranchHeading: "Bu dönemde açılan branşlar",
	TermSearchCTA: "bu dönemi canlı ara", TermDataCSV: "CSV", TermDataJSON: "JSON (arama indeksi)", TermDataPrefix: "Tüm veri:",
	StatSections: "şube", StatCourses: "ders", StatBranches: "branş", StatScanned: "son tarama",
	BranchTitleFmt: "%s branşı dersleri ve dönem dökümü", BranchLeadFmt: "İTÜ %s branşının tüm dönemlerdeki arşivi: %d ders kodu, %d dönem, %d şube.",
	BranchH1Fmt: "%s branşı", BranchSearchCTA: "bu branşı canlı ara", BranchCodeHeading: "Ders kodları", BranchTermHeading: "Dönem dökümü",
	BranchTermCol: "Dönem", BranchSecCol: "Şube",
	CourseTitleFmt:  "%s: %s",
	CourseLeadFmt:   "%s (%s): İTÜ'de %d dönemde açılmış bir ders. Geçmiş şubeleri, öğretim üyeleri ve son dönem programı.",
	CourseSearchCTA: "bu dersi canlı ara", CourseStatTerms: "toplam dönem",
	CourseSectHead: "Son dönem şubeleri", CourseSectCRN: "CRN", CourseSectInstr: "Öğretim Üyesi", CourseSectTime: "Zaman", CourseSectCap: "Kont/Yazılan",
	CourseHistHead: "Dönem geçmişi", CourseHistTerm: "Dönem", CourseHistInstr: "Öğretim Üyesi", CourseHistCap: "Kont", CourseHistEnr: "Yazılan",
	CourseQuotaHead:     "Kontenjan doluluk geçmişi",
	InstrTitleFmt:       "%s: İTÜ'de Verdiği Dersler",
	InstrLeadFmt:        "%s için İTÜ Ders Arşivi'nde %d döneme ait %d ders kaydı bulunuyor. %d farklı ders; son kayıt %s.",
	InstrDescriptionFmt: "%s: İTÜ’de verdiği dersler, açtığı dönemler ve geçmiş kontenjan bilgileri. Arşivde %d dönem ve %d farklı ders; son kayıt %s.",
	InstrStatTerms:      "toplam dönem", InstrStatRecords: "ders kaydı", InstrStatCourses: "farklı ders", InstrStatLatest: "son kayıt",
	InstrFrequentHead: "En sık verdiği dersler", InstrHistoryHead: "Dönemlere göre ders geçmişi",
	InstrBranchesHead: "İlgili branşlar",
	InstrDataNote:     "Bu sayfa resmî personel profili değildir; İTÜ ders programı kayıtlarını özetler.",
	InstrTableHead:    "Tüm ders kayıtları",
	InstrColCourse:    "Ders", InstrColName: "Adı", InstrColTerm: "Dönem", InstrColCap: "Kont", InstrColEnr: "Yazılan",
}

var langEN = lang{
	Code:        "en",
	SiteTitle:   "İTÜ Course Archive",
	SiteTagline: "Open data automatically collected from obs.itu.edu.tr. Which courses opened in which term, who taught them, how many enrolled: permanently archived.",
	NavDersler:  "courses", NavGecmis: "history", NavOnsart: "prereqs", NavSinavlar: "exams", NavTakvim: "calendar", NavProgram: "schedule", NavHakkinda: "about",
	CrumbHome: "Course Archive", SkipToContent: "Skip to content",
	FootScanned: "last scrape", FootLive: "live site", FootSitemap: "sitemap",
	TermSuffix:    "course schedule and archive",
	TermLeadFmt:   "İTÜ %s: %d courses, %d sections, %d branches.",
	TermLiveBadge: "active term · live data", TermBranchHeading: "Branches open this term",
	TermSearchCTA: "search this term live", TermDataCSV: "CSV", TermDataJSON: "JSON (search index)", TermDataPrefix: "All data:",
	StatSections: "sections", StatCourses: "courses", StatBranches: "branches", StatScanned: "last scraped",
	BranchTitleFmt: "%s branch courses and term breakdown", BranchLeadFmt: "İTÜ %s branch archive across all terms: %d course codes, %d terms, %d sections.",
	BranchH1Fmt: "%s branch", BranchSearchCTA: "search this branch live", BranchCodeHeading: "Course codes", BranchTermHeading: "Term breakdown",
	BranchTermCol: "Term", BranchSecCol: "Sections",
	CourseTitleFmt:  "%s: %s",
	CourseLeadFmt:   "%s (%s): offered in %d terms at İTÜ. Historical sections, instructors, and latest schedule.",
	CourseSearchCTA: "search this course live", CourseStatTerms: "total terms",
	CourseSectHead: "Latest term sections", CourseSectCRN: "CRN", CourseSectInstr: "Instructor", CourseSectTime: "Time", CourseSectCap: "Cap/Enr",
	CourseHistHead: "Term history", CourseHistTerm: "Term", CourseHistInstr: "Instructor", CourseHistCap: "Cap", CourseHistEnr: "Enr",
	CourseQuotaHead:     "Enrollment history",
	InstrTitleFmt:       "%s: Courses Taught at İTÜ",
	InstrLeadFmt:        "%s has %d terms and %d course records in the İTÜ Course Archive, across %d distinct courses; latest record %s.",
	InstrDescriptionFmt: "Courses taught by %s at İTÜ, including terms and historical enrollment. %d terms and %d distinct courses; latest record %s.",
	InstrStatTerms:      "total terms", InstrStatRecords: "course records", InstrStatCourses: "distinct courses", InstrStatLatest: "latest record",
	InstrFrequentHead: "Most frequently taught courses", InstrHistoryHead: "Course history by term",
	InstrBranchesHead: "Related branches",
	InstrDataNote:     "This is not an official staff profile; it summarizes İTÜ course schedule records.",
	InstrTableHead:    "All course records",
	InstrColCourse:    "Course", InstrColName: "Name", InstrColTerm: "Term", InstrColCap: "Cap", InstrColEnr: "Enr",
}

var trMonths = []string{
	"", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
	"Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
}

// Builder, docs kökünden veriyi okuyup sayfaları yazar.
type Builder struct {
	root               string // dataRoot — verinin okunduğu kök (her zaman docs/)
	outRoot            string // sayfaların yazıldığı kök (docs/ veya docs/en/)
	l                  lang
	version            string // asset önbellek kırma: ?v=<kısa commit> (P2-16)
	index              model.SiteIndex
	aggs               map[string]*branchAgg
	courses            map[string]*histCourse
	courseSects        map[string][]sectRow
	instructors        map[string]*histInstr
	instructorProfiles map[string]*histInstr // canonical slug -> merged deterministic profile
	quotaSeries        map[string][]quotaPoint
}

type branchAgg struct {
	codes        map[string]struct{}
	termSections map[string]int
	levels       map[string]struct{}
	total        int
}

// histCourse, history/courses/<branch>.json'dan gelen tek bir ders.
type histCourse struct {
	Name  string          `json:"name"`
	Terms []string        `json:"-"`
	Rows  []histCourseRow `json:"-"`
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
	Name    string
	Aliases []string
	Rows    []instrRow
	Terms   int
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

func New(dataRoot, langCode, version string) *Builder {
	l := langTR
	outRoot := dataRoot
	if langCode == "en" {
		outRoot = filepath.Join(dataRoot, "en")
		l = langEN
	}
	return &Builder{root: dataRoot, outRoot: outRoot, l: l, version: version}
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
		instrSlugs = b.prepareInstructorProfiles()
	} else {
		b.instructors = map[string]*histInstr{}
		b.instructorProfiles = map[string]*histInstr{}
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
		termLabels[t.Slug] = localizedTermLabel(t.Slug, t.Label, b.l.Code)
	}

	// Ders sayfaları (önce — branş sayfaları bunlara link verir).
	// EN'de üretilmez (Cloudflare 20k dosya limiti); EN branş sayfaları TR
	// ders sayfalarına link verir.
	courseSlugs := make(map[string]string) // code -> slug
	for code := range b.courses {
		courseSlugs[code] = courseSlug(code)
	}
	if b.l.Code != "en" {
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
	}

	// Hoca sayfaları (yalnızca TR — Cloudflare 20k dosya limiti).
	if b.l.Code != "en" {
		instrSlugList := make([]string, 0, len(b.instructorProfiles))
		keepInstructorSlugs := make(map[string]bool, len(b.instructorProfiles))
		for slug := range b.instructorProfiles {
			instrSlugList = append(instrSlugList, slug)
			keepInstructorSlugs[slug] = true
		}
		sort.Strings(instrSlugList)
		for _, slug := range instrSlugList {
			if err := b.writeInstructorPage(slug, instrSlugs, courseSlugs, termLabels); err != nil {
				return err
			}
		}
		if err := pruneGeneratedPageDirs(filepath.Join(b.outRoot, "hoca"), keepInstructorSlugs); err != nil {
			return err
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
	} else {
		// İniş sayfaları ("İTÜ ders planı", "GANO hesaplama" vb.) — yalnızca TR.
		for _, p := range landingPages {
			if err := b.writeLandingPage(p); err != nil {
				return err
			}
		}
	}

	if err := b.writeSitemap(terms, brCodes, courseSlugs, instrSlugs); err != nil {
		return err
	}
	if b.l.Code == "tr" {
		return writeDiscoveryFiles(b.root)
	}
	return nil
}

// pruneGeneratedPageDirs yalnızca tekil üretilmiş sayfa klasörlerini temizler;
// veri setinden kaldırılmış placeholder/bozuk hoca URL'lerinin yayında kalmasını
// önler. Kök dizin veya beklenmeyen dosyalar silinmez.
func pruneGeneratedPageDirs(dir string, keep map[string]bool) error {
	entries, err := os.ReadDir(dir)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if !entry.IsDir() || keep[entry.Name()] {
			continue
		}
		if err := os.RemoveAll(filepath.Join(dir, entry.Name())); err != nil {
			return err
		}
	}
	return nil
}

func (b *Builder) writeTermPage(tr termRow) error {
	prefix := ""
	if b.l.Code == "en" {
		prefix = "/en"
	}
	var bls []branchLink
	for _, br := range tr.meta.Branches {
		bls = append(bls, branchLink{
			Code:     br.Code,
			Levels:   strings.Join(br.Levels, ", "),
			Sections: br.Sections,
			URL:      fmt.Sprintf("%s/brans/%s/", prefix, br.Code),
		})
	}

	canonical := fmt.Sprintf("%s%s/dersler/%s/", baseURL, prefix, tr.tref.Slug)
	termLabel := localizedTermLabel(tr.tref.Slug, tr.tref.Label, b.l.Code)
	title := termLabel + " " + b.l.TermSuffix
	lead := fmt.Sprintf(b.l.TermLeadFmt, termLabel, tr.meta.Courses, tr.meta.Sections, len(tr.meta.Branches))

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":    "https://schema.org",
			"@type":       "WebPage",
			"url":         canonical,
			"name":        title,
			"description": lead,
			"inLanguage":  b.l.Code,
		},
	})

	content := template.HTML(buildContent(
		fmt.Sprintf(`<nav class="crumb"><a href="/">%s</a> › <span>%s</span></nav>`, template.HTMLEscapeString(b.l.CrumbHome), template.HTMLEscapeString(termLabel)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(termLabel)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		fmt.Sprintf(`<p class="cta"><a class="btn" href="/?term=%s">%s</a></p>`, tr.tref.Slug, b.l.TermSearchCTA),
		buildStats(b.statsFromMeta(tr.meta)),
		b.liveBadge(tr.meta.Live),
		`<h2>`+b.l.TermBranchHeading+`</h2>`,
		buildBranchLinks(bls, b.l.StatSections),
		fmt.Sprintf(`<p class="data-link">%s <a href="/data/terms/%s/all.csv">%s</a> · <a href="/data/terms/%s/search.json">%s</a></p>`,
			b.l.TermDataPrefix, tr.tref.Slug, b.l.TermDataCSV, tr.tref.Slug, b.l.TermDataJSON),
	))

	return b.writePage(filepath.Join(b.outRoot, "dersler", tr.tref.Slug, "index.html"),
		title, lead, canonical, fmtDate(tr.tref.ScrapedAt), content, jsonld, true)
}

func (b *Builder) writeBranchPage(code string, termLabels map[string]string, courseSlugs map[string]string) error {
	a := b.aggs[code]
	prefix := ""
	if b.l.Code == "en" {
		prefix = "/en"
	}
	canonical := fmt.Sprintf("%s%s/brans/%s/", baseURL, prefix, code)
	title := fmt.Sprintf(b.l.BranchTitleFmt, code)
	codeCount := len(a.codes)
	termCount := len(a.termSections)
	lead := fmt.Sprintf(b.l.BranchLeadFmt,
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
			"@context":    "https://schema.org",
			"@type":       "WebPage",
			"url":         canonical,
			"name":        title,
			"description": lead,
			"inLanguage":  b.l.Code,
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
				`<tr><td><a href="/dersler/%s/">%s</a></td><td>%d %s</td></tr>`,
				s, template.HTMLEscapeString(label), a.termSections[s], b.l.StatSections,
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
		fmt.Sprintf(`<nav class="crumb"><a href="/">%s</a> › <span>%s</span></nav>`, template.HTMLEscapeString(b.l.CrumbHome), template.HTMLEscapeString(code)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(fmt.Sprintf(b.l.BranchH1Fmt, code))),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		fmt.Sprintf(`<p class="cta"><a class="btn" href="/?term=%s&branch=%s">%s</a></p>`,
			latestSlug, code, b.l.BranchSearchCTA),
		`<dl class="seo-stats">`+
			fmt.Sprintf(`<div><dt>%s</dt><dd>%d</dd></div>`, b.l.BranchCodeHeading, codeCount)+
			fmt.Sprintf(`<div><dt>%s</dt><dd>%d</dd></div>`, b.l.BranchTermCol, termCount)+
			fmt.Sprintf(`<div><dt>%s</dt><dd>%d</dd></div>`, b.l.StatSections, a.total)+
			`</dl>`,
		`<h2>`+b.l.BranchCodeHeading+`</h2>`,
		fmt.Sprintf(`<p class="seo-codes">%s</p>`, strings.Join(codeSpans, " ")),
		`<h2>`+b.l.BranchTermHeading+`</h2>`,
		`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>`+b.l.BranchTermCol+`</th><th>`+b.l.BranchSecCol+`</th></tr></thead><tbody>`+
			strings.Join(termRows, "")+
			`</tbody></table></div>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "brans", code, "index.html"),
		title, lead, canonical, fmtDate(b.index.ScrapedAt), content, jsonld, true)
}

func (b *Builder) writeSitemap(terms []termRow, brCodes []string, courseSlugs map[string]string, instrSlugs map[string]string) error {
	rootDate := dateOf(b.index.ScrapedAt)
	termDates := map[string]string{}
	for _, tr := range terms {
		td := dateOf(tr.tref.ScrapedAt)
		if td == "" {
			td = rootDate
		}
		termDates[tr.tref.Slug] = td
	}

	componentDir := filepath.Join(b.root, "sitemaps")
	if err := os.MkdirAll(componentDir, 0o755); err != nil {
		return err
	}

	// İngilizce sayfalar ayrı URL kümesi olarak tutulur; böylece Search
	// Console'da dil performansı bağımsız izlenebilir. Eski /en/sitemap.xml
	// adresi geriye uyumluluk için aynı içeriği sunmaya devam eder.
	if b.l.Code == "en" {
		entries := []sitemapEntry{{Loc: baseURL + "/en/", Lastmod: rootDate}}
		for _, tr := range terms {
			entries = append(entries, sitemapEntry{Loc: fmt.Sprintf("%s/en/dersler/%s/", baseURL, tr.tref.Slug), Lastmod: termDates[tr.tref.Slug]})
		}
		for _, code := range brCodes {
			entries = append(entries, sitemapEntry{Loc: fmt.Sprintf("%s/en/brans/%s/", baseURL, code), Lastmod: latestBranchDate(b.aggs[code], termDates, rootDate)})
		}
		data := renderURLSet(entries)
		if err := os.WriteFile(filepath.Join(b.outRoot, "sitemap.xml"), data, 0o644); err != nil {
			return err
		}
		if err := os.WriteFile(filepath.Join(componentDir, "en.xml"), data, 0o644); err != nil {
			return err
		}
		return writeRootSitemapIndex(b.root, rootDate)
	}

	pages := []sitemapEntry{{Loc: baseURL + "/", Lastmod: rootDate}}
	for _, p := range landingPages {
		pages = append(pages, sitemapEntry{
			Loc:     fmt.Sprintf("%s/%s/", baseURL, p.slug),
			Lastmod: landingContentUpdated,
		})
	}
	if err := writeSitemapComponent(componentDir, "pages.xml", pages); err != nil {
		return err
	}

	termEntries := make([]sitemapEntry, 0, len(terms))
	for _, tr := range terms {
		termEntries = append(termEntries, sitemapEntry{Loc: fmt.Sprintf("%s/dersler/%s/", baseURL, tr.tref.Slug), Lastmod: termDates[tr.tref.Slug]})
	}
	if err := writeSitemapComponent(componentDir, "terms.xml", termEntries); err != nil {
		return err
	}

	branchEntries := make([]sitemapEntry, 0, len(brCodes))
	for _, code := range brCodes {
		branchEntries = append(branchEntries, sitemapEntry{Loc: fmt.Sprintf("%s/brans/%s/", baseURL, code), Lastmod: latestBranchDate(b.aggs[code], termDates, rootDate)})
	}
	if err := writeSitemapComponent(componentDir, "branches.xml", branchEntries); err != nil {
		return err
	}

	codes := make([]string, 0, len(courseSlugs))
	for code := range courseSlugs {
		codes = append(codes, code)
	}
	sort.Strings(codes)
	courseEntries := make([]sitemapEntry, 0, len(codes))
	for _, code := range codes {
		courseEntries = append(courseEntries, sitemapEntry{
			Loc:     fmt.Sprintf("%s/ders/%s/", baseURL, courseSlugs[code]),
			Lastmod: latestCourseDate(b.courses[code], termDates, rootDate),
		})
	}
	if err := writeSitemapComponent(componentDir, "courses.xml", courseEntries); err != nil {
		return err
	}

	slugs := make([]string, 0, len(b.instructorProfiles))
	for slug := range b.instructorProfiles {
		slugs = append(slugs, slug)
	}
	sort.Strings(slugs)
	instructorEntries := make([]sitemapEntry, 0, len(slugs))
	for _, slug := range slugs {
		instructorEntries = append(instructorEntries, sitemapEntry{
			Loc:     fmt.Sprintf("%s/hoca/%s/", baseURL, slug),
			Lastmod: latestInstructorDate(b.instructorProfiles[slug], termDates, rootDate),
		})
	}
	if err := writeSitemapComponent(componentDir, "instructors.xml", instructorEntries); err != nil {
		return err
	}

	return writeRootSitemapIndex(b.root, rootDate)
}

type sitemapEntry struct {
	Loc     string
	Lastmod string
}

func renderURLSet(entries []sitemapEntry) []byte {
	var out strings.Builder
	out.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	out.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")
	for _, entry := range entries {
		sitemapURL(&out, entry.Loc, entry.Lastmod, "", "")
	}
	out.WriteString("</urlset>\n")
	return []byte(out.String())
}

func writeSitemapComponent(dir, name string, entries []sitemapEntry) error {
	return os.WriteFile(filepath.Join(dir, name), renderURLSet(entries), 0o644)
}

func writeRootSitemapIndex(root, fallbackDate string) error {
	type component struct {
		file string
		url  string
	}
	components := []component{
		{"pages.xml", baseURL + "/sitemaps/pages.xml"},
		{"terms.xml", baseURL + "/sitemaps/terms.xml"},
		{"branches.xml", baseURL + "/sitemaps/branches.xml"},
		{"courses.xml", baseURL + "/sitemaps/courses.xml"},
		{"instructors.xml", baseURL + "/sitemaps/instructors.xml"},
		{"en.xml", baseURL + "/sitemaps/en.xml"},
	}
	var out strings.Builder
	out.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	out.WriteString(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")
	for _, c := range components {
		if _, err := os.Stat(filepath.Join(root, "sitemaps", c.file)); err != nil {
			continue
		}
		out.WriteString("  <sitemap>\n")
		fmt.Fprintf(&out, "    <loc>%s</loc>\n", escapeXML(c.url))
		if fallbackDate != "" {
			fmt.Fprintf(&out, "    <lastmod>%s</lastmod>\n", fallbackDate)
		}
		out.WriteString("  </sitemap>\n")
	}
	out.WriteString("</sitemapindex>\n")
	return os.WriteFile(filepath.Join(root, "sitemap.xml"), []byte(out.String()), 0o644)
}

// writeDiscoveryFiles, tarayıcı ve yapay zekâ istemcilerine yalnızca
// canonical, kalıcı sayfaları bildirir. SPA hash rotaları sitemap'e
// sokulmaz; bunlara niyet sayfalarındaki doğrudan CTA'lar aracılık eder.
func writeDiscoveryFiles(root string) error {
	robots := "User-agent: *\nAllow: /\n\nSitemap: " + baseURL + "/sitemap.xml\n"
	if err := os.WriteFile(filepath.Join(root, "robots.txt"), []byte(robots), 0o644); err != nil {
		return err
	}
	llms := `# İTÜ Ders Arşivi

> İstanbul Teknik Üniversitesi dersleri için bağımsız, açık kaynaklı arşiv ve planlama araçları. Resmî kayıt kararları için OBS verisi esas alınmalıdır.

## Temel araçlar
- [Güncel ders programı](` + baseURL + `/ders-programi/): Açık şube, CRN, hoca, saat ve kontenjan araması.
- [Ders programı oluştur](` + baseURL + `/ders-programi-olustur/): Şubelerden haftalık program ve çakışma kontrolü.
- [GPA ve GANO hesapla](` + baseURL + `/gano-hesaplama/): Ders kredileri ve harf notlarıyla dönem/genel ortalama hesabı.
- [Ders planı](` + baseURL + `/ders-plani/): Program müfredatı, zorunlu/seçmeli dersler, kredi ve AKTS.
- [Önşart haritası](` + baseURL + `/onsart-haritasi/): Program dersleri arasındaki önşart bağlantıları.

## Arşiv
- [Geçmiş dönem dersleri](` + baseURL + `/ders-arsivi/): 2016'dan bugüne ders, şube, hoca, kontenjan ve not dağılımı geçmişi.
- [Dönem sayfaları](` + baseURL + `/sitemaps/terms.xml): Arşivlenen dönemlerin canonical URL listesi.
- [Ders sayfaları](` + baseURL + `/sitemaps/courses.xml): Ders kodu bazında geçmiş ve son dönem bilgileri.
- [Hoca sayfaları](` + baseURL + `/sitemaps/instructors.xml): Öğretim üyesi bazında verilen derslerin dönem geçmişi.

## Veri erişimi
- [Dönem ve veri dizini](` + baseURL + `/data/index.json)
- [XML sitemap index](` + baseURL + `/sitemap.xml)
`
	return os.WriteFile(filepath.Join(root, "llms.txt"), []byte(llms), 0o644)
}

func latestBranchDate(a *branchAgg, dates map[string]string, fallback string) string {
	if a == nil {
		return fallback
	}
	return latestTermDateFromSet(a.termSections, dates, fallback)
}

func latestCourseDate(course *histCourse, dates map[string]string, fallback string) string {
	if course == nil {
		return fallback
	}
	terms := map[string]int{}
	for _, row := range course.Rows {
		terms[row.Term] = 1
	}
	return latestTermDateFromSet(terms, dates, fallback)
}

func latestInstructorDate(profile *histInstr, dates map[string]string, fallback string) string {
	if profile == nil {
		return fallback
	}
	terms := map[string]int{}
	for _, row := range profile.Rows {
		terms[row.Term] = 1
	}
	return latestTermDateFromSet(terms, dates, fallback)
}

func latestTermDateFromSet[T any](terms map[string]T, dates map[string]string, fallback string) string {
	latestSlug := ""
	for slug := range terms {
		if latestSlug == "" || term.SortKey(slug) > term.SortKey(latestSlug) {
			latestSlug = slug
		}
	}
	if date := dates[latestSlug]; date != "" {
		return date
	}
	return fallback
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
<meta name="theme-color" content="#f4f6f4">
<script>(function(){try{var t=localStorage.getItem('itu-theme')==='dark'?'dark':'sade';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t==='dark'?'#0a0a0a':'#f4f6f4')}catch(e){}})()</script>
<title>{{.Title}} | {{.Lang.SiteTitle}}</title>
<meta name="description" content="{{.Description}}">
<link rel="canonical" href="{{.Canonical}}">
{{range .Alternates}}<link rel="alternate" hreflang="{{.Lang}}" href="{{.URL}}">
{{end}}
<meta name="robots" content="index, follow">
<link rel="stylesheet" href="/assets/style.css?v={{.AssetV}}">
<link rel="icon" href="/favicon.png" type="image/png">
{{.JSONLD}}
</head>
<body>
<a class="skip-link" href="#icerik">{{.Lang.SkipToContent}}</a>
<div class="scanlines" aria-hidden="true"></div>
<header class="masthead">
 <div class="wrap">
  <div class="mast-top">
   <div class="brand">
    <span class="prompt">root@itu</span><span class="path">:~/arsiv</span><span class="caret">$</span>
    <img class="brand-logo" src="/itü_ari.png" alt="" aria-hidden="true" width="32" height="31">
    <p class="brand-title" translate="no"><a href="/">{{.Lang.SiteTitle}}</a></p>
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
<main class="wrap" id="icerik">
{{.Content}}
</main>
<footer class="wrap">
 <span>{{.Lang.FootScanned}} {{.Scraped}}</span> · <a href="/">{{.Lang.FootLive}}</a> · <a href="/sitemap.xml">{{.Lang.FootSitemap}}</a>
</footer>
</body>
</html>`))

type pageData struct {
	Title, Description, Canonical, Scraped string
	Alternates                             []alternateLink
	AssetV                                 string // asset önbellek kırma (?v=)
	Content                                template.HTML
	JSONLD                                 template.HTML
	Lang                                   lang
}

type alternateLink struct {
	Lang string
	URL  string
}

// writeIndexPage, dil bazlı statik ana sayfa üretir (/en/).
func (b *Builder) writeIndexPage(terms []termRow) error {
	prefix := ""
	if b.l.Code == "en" {
		prefix = "en/"
	}
	canonical := baseURL + "/" + prefix
	title := "Ders Arşivi"
	if b.l.Code == "en" {
		title = "Course Archive"
	}
	desc := b.l.SiteTagline

	var recent []string
	for i, tr := range terms {
		if i >= 10 {
			break
		}
		recent = append(recent, fmt.Sprintf(
			`<li><a href="/%sdersler/%s/">%s</a> · %d %s</li>`,
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
		title, desc, canonical, fmtDate(b.index.ScrapedAt), content, jsonld, true)
}

func (b *Builder) writePage(path, title, desc, canonical, scraped string, content, jsonld template.HTML, alt bool) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	// Her yerelleştirilmiş sayfa kendisini, karşı dil sürümünü ve varsayılan
	// Türkçe sürümü bildirir. Karşılıklılık Google'ın hreflang kümesini geçerli
	// kabul edebilmesi için gereklidir.
	var alternates []alternateLink
	if alt {
		trURL := canonical
		enURL := canonical
		if b.l.Code == "tr" {
			enURL = strings.Replace(canonical, baseURL, baseURL+"/en", 1)
		} else {
			trURL = strings.Replace(canonical, baseURL+"/en", baseURL, 1)
		}
		alternates = []alternateLink{
			{Lang: "tr", URL: trURL},
			{Lang: "en", URL: enURL},
			{Lang: "x-default", URL: trURL},
		}
	}
	return pageTmpl.Execute(f, pageData{
		Title: title, Description: desc, Canonical: canonical,
		Scraped: scraped, Content: content, JSONLD: jsonld,
		Alternates: alternates, AssetV: b.version, Lang: b.l,
	})
}

// --- iniş sayfaları (araç/bilgi sayfaları) ---
// "İTÜ ders planı", "GANO hesaplama" gibi Türkçe arama sorgularına karşılık gelen
// elle yazılmış içerik sayfaları. CTA ile SPA özelliğine (/#dersplanim vb.) bağlanır.
// Yalnızca TR üretilir (alt=false — hreflang yok). Bu tarih landing-page
// metni veya bilgi mimarisi gerçekten değiştiğinde elle ilerletilir; veri
// taraması her çalıştığında sahte bir lastmod üretmez.
const landingContentUpdated = "2026-08-23"

type landingPage struct {
	slug        string
	title       string
	description string
	h1          string
	body        []string // düz paragraf metinleri (<p> ile sarılır)
	primary     landingAction
	secondary   []landingAction
	queries     []string // Bu URL'nin sahip olduğu ana arama niyetleri; kanibalizasyon denetiminde kullanılır.
	features    []string // Yalnızca gerçekte var olan, WebApplication ve sayfa içeriğinde ortak kullanılan yetenekler.
}

type landingAction struct {
	href   string // SPA görünümü: /#dersplanim, /#program, ...
	label  string
	detail string
}

var landingActionDetails = map[string]string{
	"/#dersler":               "Açık şubeleri ders kodu, ad, CRN veya öğretim üyesiyle ara.",
	"/#gecmis":                "2016'dan bugüne açılan dersleri ve dersi veren hocaları bul.",
	"/#dersplanim":            "Müfredatını seç, harf notlarını gir ve kredi ağırlıklı ortalamanı gör.",
	"/#onsart":                "Programını seç; derslerin zorunlu ve alternatif önşart bağlantılarını izle.",
	"/#sinavlar":              "Yayımlanan final tarihlerini ara ve aynı saate gelen sınavları karşılaştır.",
	"/#takvim":                "Kayıt, ders, sınav ve tatil tarihlerini takvim türüne göre filtrele.",
	"/#donemler":              "Arşivlenen bütün Güz, Bahar ve Yaz dönemlerini tek listede gör.",
	"/#program":               "Şubeleri haftalık çizelgeye ekle; çakışmaları, kredi ve AKTS toplamını gör.",
	"/ders-plani/":            "Müfredatı, zorunlu ve seçmeli dersleri yarıyıl yarıyıl incele.",
	"/gano-hesaplama/":        "Harf notlarını ve kredilerini kullanarak dönem ortalaması ile GANO'nu hesapla.",
	"/not-ortalamasi/":        "Harf notu katsayılarını ve hangi notların ortalamaya katıldığını gör.",
	"/ders-programi/":         "Güncel dersleri, şubeleri, CRN'leri, saatleri ve kontenjanları ara.",
	"/ders-programi-olustur/": "Seçtiğin şubelerle haftalık program kur ve takvime aktar.",
	"/sinav-programi/":        "Final tarihlerini ara ve seçtiğin derslerin sınav çakışmalarını kontrol et.",
	"/kontenjan/":             "Şubelerin kontenjan, yazılan ve geçmiş doluluk bilgilerini incele.",
	"/onsart-haritasi/":       "Bölüm derslerinin birbirine hangi önşartlarla bağlandığını gör.",
	"/ders-secimi/":           "Ders aramadan OBS kaydına kadar izlenecek dört adımı birlikte gör.",
	"/akademik-takvim/":       "Kayıt, ders ve sınav tarihlerini tek kronolojik listede takip et.",
}

var landingPages = []landingPage{
	{
		slug: "ders-plani", title: "İTÜ Ders Planı ve Müfredat",
		description: "İTÜ ders planında bölüm müfredatını yarıyıl yarıyıl incele; zorunlu ve seçmeli dersleri, kredi ve AKTS toplamlarını birlikte gör.",
		h1:          "İTÜ ders planı ve müfredat planlama",
		queries:     []string{"İTÜ ders planı", "İTÜ müfredat"},
		features:    []string{"Programı yarıyıl bazında gösterir", "Zorunlu ve seçmeli dersleri ayırır", "Kredi ve AKTS toplamlarını hesaplar"},
		body: []string{
			"İTÜ Ders Arşivi'nde seçtiğin programın dönem dönem ders planını açabilir, derslerin bu dönem açık olup olmadığını görebilirsin. Ders Planım görünümü, derslere not girip GANO ve dönem ortalamalarını anında hesaplar.",
			"Planı aç, seçmeli slotlarda dersi seç, notlarını gir · hepsi tarayıcında saklanır, hiçbir veri sunucuya gitmez.",
		},
		primary:   landingAction{href: "/#dersplanim", label: "Ders Planım'ı aç", detail: "Programını seç; dönem derslerini, kredilerini ve açık şubeleri birlikte gör."},
		secondary: []landingAction{{href: "/gano-hesaplama/", label: "GPA / GANO hesapla"}, {href: "/ders-programi-olustur/", label: "Haftalık program oluştur"}, {href: "/onsart-haritasi/", label: "Önşart haritasını aç"}},
	},
	{
		slug: "gano-hesaplama", title: "İTÜ GPA ve GANO Hesaplama",
		description: "İTÜ GPA ve GANO hesaplama aracında ders kredilerini ve harf notlarını gir; dönem ortalamanı ve genel ağırlıklı not ortalamanı birlikte gör.",
		h1:          "İTÜ GPA ve GANO hesaplama",
		queries:     []string{"İTÜ ortalama hesapla", "İTÜ GPA hesapla", "İTÜ GANO hesapla"},
		features:    []string{"Harf notlarını kredi ağırlıklı hesaplar", "Dönem ortalaması ile GANO'yu ayrı gösterir", "OBS transkript metninden notları tarayıcıda aktarır"},
		body: []string{
			"GANO, İTÜ'nün 4.00 ölçeğindeki genel ağırlıklı not ortalamandır. Her harf notu bir katsayı taşır: AA 4.0, BA 3.5, BB 3.0, CB 2.5, CC 2.0, DC 1.5, DD 1.0; FF ve VF 0.0.",
			"Ders Planım görünümünde notlarını ders ders gir; GANO'n ve her yarıyılın ortalaması otomatik hesaplansın. Transfer kredin veya mevcut GANO'n varsa üstteki kutulara yaz.",
			"Bu bir transkript değildir · resmî GANO için öğrenci bilgi sistemine bak.",
		},
		primary:   landingAction{href: "/#dersplanim", label: "GPA / GANO hesaplayıcıyı aç", detail: "Bölümünü seçip ders notlarını gir; dönem ortalaması ve genel ortalama aynı yerde hesaplansın."},
		secondary: []landingAction{{href: "/ders-plani/", label: "Ders planını görüntüle"}, {href: "/not-ortalamasi/", label: "Harf notu katsayılarını gör"}},
	},
	{
		slug: "not-ortalamasi", title: "İTÜ not ortalaması ve harf notları",
		description: "İTÜ harf notu katsayıları ve not ortalaması: AA'dan FF'ye ölçek, muaf/geçti notları ve ortalamanın nasıl hesaplandığı.",
		h1:          "İTÜ not ortalaması ve harf notları",
		body: []string{
			"İTÜ'de dersler 4.00 ölçeğinde harf notuyla değerlendirilir: AA 4.0, BA 3.5, BB 3.0, CB 2.5, CC 2.0, DC 1.5, DD 1.0, FF 0.0. '+' işaretli notlar (BA+, BB+) ara katsayı taşır.",
			"Muaf (M), geçti (G), devamsız (VF) ve kredisi sayılmayan durumlar ortalamayı farklı etkiler. Ders Planım'da bu notları işaretleyip ortalamanı görebilirsin.",
		},
		primary:   landingAction{href: "/#dersplanim", label: "Notlarını gir ve ortalamanı hesapla", detail: "Harf notlarını gerçek ders planın üzerinde işaretle; kredi ağırlıklı sonucu anında gör."},
		secondary: []landingAction{{href: "/gano-hesaplama/", label: "GPA / GANO hesaplayıcıyı aç"}, {href: "/ders-plani/", label: "Ders planını görüntüle"}},
	},
	{
		slug: "ders-programi", title: "İTÜ Ders Programı ve Açık Dersler",
		description: "İTÜ ders programında bu dönem açık dersleri kod, ad, CRN veya hocayla ara; şube saatlerini, kontenjanı ve doluluk durumunu karşılaştır.",
		h1:          "İTÜ ders programı",
		queries:     []string{"İTÜ ders", "İTÜ ders programı", "İTÜ açık dersler"},
		features:    []string{"Ders kodu, ad, CRN ve hocayla arama yapar", "Şube gün ve saatlerini karşılaştırır", "Kontenjan ve yazılan öğrenci sayısını gösterir"},
		body: []string{
			"OBS'nin yayınladığı ders programını arşivden ara: ders kodu, ad, CRN veya öğretim üyesiyle filtrele; şubelerin gün/saatini, kontenjanını ve doluluk oranını gör.",
			"Kayıt haftasında kontenjan doluluğu yarım saatte bir tazelenir.",
		},
		primary:   landingAction{href: "/#dersler", label: "Güncel ders programını ara", detail: "Ders kodu, ad, CRN veya öğretim üyesiyle açık şubeleri doğrudan filtrele."},
		secondary: []landingAction{{href: "/ders-programi-olustur/", label: "Kişisel haftalık program oluştur"}, {href: "/sinav-programi/", label: "Sınav programını aç"}, {href: "/kontenjan/", label: "Kontenjan doluluğunu incele"}},
	},
	{
		slug: "ders-programi-olustur", title: "İTÜ Ders Programı Oluşturma Aracı",
		description: "İTÜ ders programı oluşturma aracıyla şube ve CRN ekle, haftalık çizelgedeki çakışmaları gör; programını görsel veya takvim olarak indir.",
		h1:          "İTÜ ders programı oluştur",
		queries:     []string{"İTÜ ders programı oluştur", "İTÜ program oluşturucu"},
		features:    []string{"Şube ve CRN'leri haftalık çizelgeye ekler", "Saat çakışmalarını işaretler", "Programı görsel ve .ics takvim dosyası olarak dışa aktarır"},
		body: []string{
			"Açık şubeleri ders kodu, ad veya CRN ile bulup haftalık çizelgene ekle. Aynı saate gelen dersler çakışma olarak işaretlenir.",
			"Hazırladığın programı görsel veya .ics takvim dosyası olarak indirebilir, seçtiğin CRN'leri OBS kayıt ekranı için kopyalayabilirsin.",
		},
		primary:   landingAction{href: "/#program", label: "Haftalık program oluşturmaya başla", detail: "Şubelerini ekle; gün/saat çakışmalarını ve toplam krediyi tek çizelgede gör."},
		secondary: []landingAction{{href: "/ders-programi/", label: "Açık dersleri ve CRN'leri ara"}, {href: "/sinav-programi/", label: "Final çakışmalarını kontrol et"}},
	},
	{
		slug: "kontenjan", title: "İTÜ ders kontenjanları ve doluluk",
		description: "İTÜ ders kontenjanları: şube başına kontenjan/yazılan sayısı, doluluk oranı ve dolma hızı geçmişi.",
		h1:          "İTÜ ders kontenjanları",
		body: []string{
			"Her şubenin kontenjanı, yazılan öğrenci sayısı ve doluluk yüzdesi tabloda görünür. Dolu ve kritik (≥%85) şubeler ayrı işaretlenir.",
			"Bir dersin geçmiş dönemlerde ne kadar hızlı dolduğunu detay sayfasında görebilirsin.",
		},
		primary:   landingAction{href: "/#dersler", label: "Güncel kontenjanları gör", detail: "Yalnızca kontenjanı olan şubeleri filtrele veya ders detayından doluluk geçmişini aç."},
		secondary: []landingAction{{href: "/ders-programi/", label: "Güncel dersleri ara"}, {href: "/ders-programi-olustur/", label: "Şubeyi programa ekle"}},
	},
	{
		slug: "ders-secimi", title: "İTÜ ders seçimi rehberi",
		description: "İTÜ ders seçimi: önşartları kontrol et, final çakışmasını gör, kontenjanı ve dolma hızını değerlendir, programını kur.",
		h1:          "İTÜ ders seçimi rehberi",
		body: []string{
			"1. Dersler'de kod, ad veya öğretim üyesiyle arama yap; uygun şubenin CRN'sini, saatini ve kalan kontenjanını kontrol et.",
			"2. Önşart Haritası'nda programını seç; almak istediğin dersin geriye doğru zorunlu ve alternatif önşartlarını incele.",
			"3. Program aracında şubeleri ekle. Haftalık çizelgede saat çakışmalarını, toplam kredi ve AKTS'yi gör; gerekirse şubeyi değiştir.",
			"4. Sınav takvimi yayımlandığında seçtiğin derslerin final saatlerini birlikte kontrol et. Kesin kayıttan önce bilgileri OBS'den doğrula.",
		},
		primary: landingAction{href: "/#program", label: "Ders programını oluştur", detail: "Açık şubeleri ekle; saat çakışmalarını ve toplam krediyi haftalık çizelgede gör."},
		secondary: []landingAction{
			{href: "/#dersler", label: "1. Açık dersleri ve kontenjanları ara", detail: "Ders kodu, ad, CRN veya hocayla ara; uygun şubeyi bul."},
			{href: "/#onsart", label: "2. Önşartları kontrol et", detail: "Program haritasında dersin geriye doğru bağlantılarını izle."},
			{href: "/#program", label: "3. Haftalık programını kur", detail: "Şubeleri ekle, ders çakışmalarını gider ve CRN listesini hazırla."},
			{href: "/#sinavlar", label: "4. Sınav çakışmalarını kontrol et", detail: "Takvim yayımlandığında finalleri aynı listede karşılaştır."},
			{href: "/ders-arsivi/", label: "Geçmiş dönem derslerini ara", detail: "Dersin daha önce hangi dönemlerde ve hangi hocalarla açıldığını incele."},
			{href: "/ders-plani/", label: "Müfredatını incele", detail: "Zorunlu ve seçmeli dersleri yarıyıl, kredi ve AKTS bilgileriyle gör."},
			{href: "/gano-hesaplama/", label: "GPA / GANO hesabını yap", detail: "Notlarını ders planına aktar; dönem ve genel ortalamanı birlikte hesapla."},
		},
	},
	{
		slug: "onsart-haritasi", title: "İTÜ önşart haritası",
		description: "İTÜ önşart haritası: bir programın dersleri arasındaki önşart ilişkilerini yarıyıl yarıyıl gör.",
		h1:          "İTÜ önşart haritası",
		body: []string{
			"Önşart haritası, bir programın derslerini yarıyıl sütunlarında ve önşart bağlantılarını ok olarak gösterir. Bir dersi alabilmek için hangi dersleri bitirmen gerektiğini gör.",
			"Program seçmek için Dersler'de arayarak başlayabilirsin.",
		},
		primary:   landingAction{href: "/#onsart", label: "Önşart haritasını aç", detail: "Fakülte ve programını seç; zorunlu, alternatif ve seçmeli bağlantıları dönem dönem gör."},
		secondary: []landingAction{{href: "/ders-plani/", label: "Ders planını aç"}, {href: "/ders-secimi/", label: "Ders seçimi adımlarını gör"}},
	},
	{
		slug: "sinav-programi", title: "İTÜ sınav programı ve final takvimi",
		description: "İTÜ sınav programı: derslerinin final tarihlerini ve saatlerini ara, seçili şubelerdeki sınav çakışmalarını kontrol et.",
		h1:          "İTÜ sınav programı ve final takvimi",
		body: []string{
			"Ders koduyla sınav tarihini ara veya programına eklediğin şubelerin finallerini birlikte görüntüle.",
			"Aynı gün ve saatte çakışan sınavlar açıkça işaretlenir. Kesin kayıt ve sınav bilgisi için resmî İTÜ duyurusunu doğrula.",
		},
		primary:   landingAction{href: "/#sinavlar", label: "Sınav programını aç", detail: "Derslerini ara; final tarihlerini, saatlerini ve çakışmaları tek listede gör."},
		secondary: []landingAction{{href: "/ders-programi-olustur/", label: "Haftalık programını aç"}, {href: "/akademik-takvim/", label: "Akademik takvimi gör"}},
	},
	{
		slug: "akademik-takvim", title: "İTÜ akademik takvim",
		description: "İTÜ akademik takvim: kayıt, ders, sınav, lisans, lisansüstü ve hazırlık takvimlerini tarih sırasıyla görüntüle.",
		h1:          "İTÜ akademik takvim",
		body: []string{
			"Kayıt, ders, sınav, lisans, lisansüstü ve hazırlık takvimlerindeki tarihleri tek görünümde filtrele.",
			"İstediğin etkinliği .ics olarak indirip kişisel takvimine ekleyebilirsin. Resmî değişiklikler için İTÜ akademik takvim kaynağını doğrula.",
		},
		primary:   landingAction{href: "/#takvim", label: "Akademik takvimi aç", detail: "Takvim türünü seç; yaklaşan kayıt, ders ve sınav tarihlerini sırayla gör."},
		secondary: []landingAction{{href: "/sinav-programi/", label: "Sınav programını aç"}, {href: "/ders-programi-olustur/", label: "Ders programını oluştur"}},
	},
	{
		slug: "ders-arsivi", title: "İTÜ Ders Arşivi ve Geçmiş Dersler",
		description: "İTÜ ders arşivinde 2016'dan bugüne açılan dersleri ara; geçmiş şubeleri, dersi veren hocaları, kontenjanı ve not dağılımını incele.",
		h1:          "İTÜ ders arşivi ve geçmiş dönem dersleri",
		queries:     []string{"İTÜ ders arşivi", "İTÜ geçmiş dersler", "İTÜ geçmiş dönem dersleri"},
		features:    []string{"2016'dan bugüne arşivlenen dönemlerde arama yapar", "Derslerin şube ve hoca geçmişini gösterir", "Kontenjan geçmişi ile not dağılımını bir arada sunar"},
		body: []string{
			"OBS yalnızca içinde bulunulan dönemi gösterir; dönem bitince veri kaybolur. Bu arşiv 2016'dan beri her dönemi sürüm kontrolüne alır.",
			"Geçmiş görünümünde bir dersin hangi dönemlerde, hangi hocayla ve kaç şube açıldığını ara; not dağılımı ve katalog bilgisini gör.",
		},
		primary:   landingAction{href: "/#gecmis", label: "Geçmiş dönemlerde ara", detail: "Ders kodu veya öğretim üyesiyle 2016'dan bugüne açılan şubeleri doğrudan ara."},
		secondary: []landingAction{{href: "/ders-programi/", label: "Güncel ders programını ara"}, {href: "/#donemler", label: "Tüm dönemleri listele"}, {href: "/kontenjan/", label: "Kontenjan geçmişini incele"}},
	},
}

func (b *Builder) writeLandingPage(p landingPage) error {
	if b.l.Code == "en" {
		return nil // iniş sayfaları yalnızca TR (EN karşılığı yok)
	}
	canonical := fmt.Sprintf("%s/%s/", baseURL, p.slug)
	var paras strings.Builder
	for _, t := range p.body {
		paras.WriteString("<p>" + template.HTMLEscapeString(t) + "</p>\n")
	}
	var related strings.Builder
	if len(p.secondary) > 0 {
		related.WriteString(`<h2>İlgili araçlar</h2><ul class="seo-action-list">`)
		for _, action := range p.secondary {
			fmt.Fprintf(&related, `<li><a href="%s"><strong>%s</strong>`,
				template.HTMLEscapeString(action.href), template.HTMLEscapeString(action.label))
			detail := action.detail
			if detail == "" {
				detail = landingActionDetails[action.href]
			}
			if detail != "" {
				fmt.Fprintf(&related, `<span>%s</span>`, template.HTMLEscapeString(detail))
			}
			related.WriteString(`</a></li>`)
		}
		related.WriteString(`</ul>`)
	}
	var capabilities strings.Builder
	if len(p.features) > 0 {
		capabilities.WriteString(`<h2>Bu sayfada ne yapabilirsin?</h2><ul>`)
		for _, feature := range p.features {
			capabilities.WriteString(`<li>` + template.HTMLEscapeString(feature) + `</li>`)
		}
		capabilities.WriteString(`</ul>`)
	}
	content := template.HTML(buildContent(
		`<nav class="crumb" aria-label="Breadcrumb"><a href="/">İTÜ Ders Arşivi</a> › <span>`+template.HTMLEscapeString(p.h1)+`</span></nav>`,
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(p.h1)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(p.description)),
		fmt.Sprintf(`<section class="seo-tool-launch" aria-label="Aracı aç"><div><strong>%s</strong><p>%s</p></div><a class="btn-primary" href="%s">%s</a></section>`,
			template.HTMLEscapeString(p.primary.label), template.HTMLEscapeString(p.primary.detail),
			template.HTMLEscapeString(p.primary.href), template.HTMLEscapeString(p.primary.label)),
		`<h2>Nasıl kullanılır?</h2>`,
		paras.String(),
		capabilities.String(),
		related.String(),
	))
	webPageSchema := map[string]any{
		"@context": "https://schema.org", "@type": "WebPage", "@id": canonical + "#webpage",
		"url": canonical, "name": p.title, "description": p.description,
		"inLanguage": "tr-TR", "dateModified": landingContentUpdated,
	}
	if len(p.features) > 0 {
		webPageSchema["mainEntity"] = map[string]any{"@id": canonical + "#application"}
	}
	schema := []any{
		webPageSchema,
		map[string]any{
			"@context": "https://schema.org", "@type": "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": "İTÜ Ders Arşivi", "item": baseURL + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": p.h1, "item": canonical},
			},
		},
	}
	if len(p.features) > 0 {
		schema = append(schema, map[string]any{
			"@context": "https://schema.org", "@type": "WebApplication", "@id": canonical + "#application",
			"url": canonical, "name": p.h1, "description": p.description,
			"applicationCategory": "EducationalApplication", "operatingSystem": "Any",
			"browserRequirements": "JavaScript destekleyen güncel bir web tarayıcısı",
			"inLanguage":          "tr-TR", "isAccessibleForFree": true, "featureList": p.features,
			"offers": map[string]any{"@type": "Offer", "price": 0, "priceCurrency": "TRY"},
		})
	}
	jsonld := jsonldScript(schema)
	return b.writePage(filepath.Join(b.outRoot, p.slug, "index.html"),
		p.title, p.description, canonical, landingContentUpdated, content, jsonld, false)
}

// --- helpers ---

func (b *Builder) statsFromMeta(m model.TermMeta) []statEntry {
	return []statEntry{
		{b.l.StatSections, strconv.Itoa(m.Sections)},
		{b.l.StatCourses, strconv.Itoa(m.Courses)},
		{b.l.StatBranches, strconv.Itoa(len(m.Branches))},
		{b.l.StatScanned, fmtDate(m.ScrapedAt)},
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

func (b *Builder) liveBadge(live bool) string {
	if !live {
		return ""
	}
	return `<span class="seo-badge">` + template.HTMLEscapeString(b.l.TermLiveBadge) + `</span>`
}

func buildBranchLinks(bls []branchLink, sectionLabel string) string {
	var b strings.Builder
	b.WriteString(`<ul class="seo-branchlist">`)
	for _, bl := range bls {
		extra := fmt.Sprintf("%d %s", bl.Sections, sectionLabel)
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

func localizedTermLabel(slug, fallback, langCode string) string {
	if langCode != "en" {
		return fallback
	}
	for suffix, season := range map[string]string{
		"-guz": "Fall Term", "-bahar": "Spring Term", "-yaz": "Summer Term",
	} {
		if strings.HasSuffix(slug, suffix) {
			return strings.TrimSuffix(slug, suffix) + " " + season
		}
	}
	return fallback
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
		return "·"
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
	if len(s) <= maxSlugLen {
		return s
	}
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
				Name  string  `json:"name"`
				Rows  [][]any `json:"rows"`
				Terms int     `json:"terms"`
			}
			if err := json.Unmarshal(r, &full); err != nil {
				return fmt.Errorf("%s/%s: %w", e.Name(), name, err)
			}
			hi := &histInstr{Name: full.Name, Terms: full.Terms}
			for _, row := range full.Rows {
				if len(row) >= 5 {
					ir := instrRow{}
					if s, ok := row[0].(string); ok {
						ir.Term = s
					}
					if s, ok := row[1].(string); ok {
						ir.Code = s
					}
					if s, ok := row[2].(string); ok {
						ir.Name = s
					}
					switch v := row[3].(type) {
					case float64:
						ir.Cap = int(v)
					}
					switch v := row[4].(type) {
					case float64:
						ir.Enr = int(v)
					}
					hi.Rows = append(hi.Rows, ir)
				}
			}
			// Aynı ad farklı bucket dosyalarında görülebilir. Önce ham ad
			// düzeyinde birleştir; slug çakışmaları aşağıda ayrıca ve
			// deterministik olarak ele alınır.
			if prev := b.instructors[name]; prev != nil {
				prev.Rows = append(prev.Rows, hi.Rows...)
				if hi.Terms > prev.Terms {
					prev.Terms = hi.Terms
				}
			} else {
				b.instructors[name] = hi
			}
		}
	}
	return nil
}

// isIndexableInstructorName yalnızca gerçek bir kişi adı olabilecek kayıtları
// statik profile taşır. Tek dönemlik gerçek kişiler özellikle korunur: Search
// Console verisi bu uzun kuyruk sayfalarının trafik getirdiğini gösteriyor.
func isIndexableInstructorName(name string) bool {
	name = strings.TrimSpace(name)
	if name == "" || instructorSlug(name) == "" {
		return false
	}
	compact := strings.ToLower(strings.NewReplacer(" ", "", ".", "", "-", "", "*", "").Replace(name))
	switch compact {
	case "", "--", "tba", "staff", "instructor", "bilinmiyor", "belirsiz":
		return false
	}
	return true
}

// prepareInstructorProfiles, aynı canonical slug'a düşen yazım/case
// varyasyonlarını tek profilde birleştirir. Bu bir kişi-tahmin sistemi değildir:
// yalnızca zaten aynı URL'ye çarpışan kayıtları deterministik hâle getirir.
// Farklı slug'lara düşen benzer adlar otomatik birleştirilmez.
func (b *Builder) prepareInstructorProfiles() map[string]string {
	type namedProfile struct {
		name string
		hi   *histInstr
	}
	groups := map[string][]namedProfile{}
	instrSlugs := map[string]string{}
	for name, hi := range b.instructors {
		if !isIndexableInstructorName(name) || hi == nil || len(hi.Rows) == 0 {
			continue
		}
		slug := instructorSlug(name)
		instrSlugs[name] = slug
		groups[slug] = append(groups[slug], namedProfile{name: strings.TrimSpace(name), hi: hi})
	}

	b.instructorProfiles = make(map[string]*histInstr, len(groups))
	for slug, variants := range groups {
		sort.Slice(variants, func(i, j int) bool {
			if len(variants[i].hi.Rows) != len(variants[j].hi.Rows) {
				return len(variants[i].hi.Rows) > len(variants[j].hi.Rows)
			}
			return variants[i].name < variants[j].name
		})
		profile := &histInstr{Name: variants[0].name}
		seenRows := map[instrRow]struct{}{}
		seenTerms := map[string]struct{}{}
		seenAliases := map[string]struct{}{}
		for _, v := range variants {
			if v.name != profile.Name {
				seenAliases[v.name] = struct{}{}
			}
			for _, row := range v.hi.Rows {
				if _, ok := seenRows[row]; ok {
					continue
				}
				seenRows[row] = struct{}{}
				profile.Rows = append(profile.Rows, row)
				if row.Term != "" {
					seenTerms[row.Term] = struct{}{}
				}
			}
		}
		for alias := range seenAliases {
			profile.Aliases = append(profile.Aliases, alias)
		}
		sort.Strings(profile.Aliases)
		profile.Terms = len(seenTerms)
		b.instructorProfiles[slug] = profile
	}
	return instrSlugs
}

// writeInstructorPage, tek bir hoca için sayfa üretir.
func (b *Builder) writeInstructorPage(slug string, instrSlugs map[string]string, courseSlugs map[string]string, termLabels map[string]string) error {
	hi := b.instructorProfiles[slug]
	if hi == nil {
		return fmt.Errorf("hoca bulunamadı: %s", slug)
	}

	// En güncel kayıt hem görünür özet hem de meta description için kullanılır.
	sort.Slice(hi.Rows, func(i, j int) bool {
		if hi.Rows[i].Term != hi.Rows[j].Term {
			return term.SortKey(hi.Rows[i].Term) > term.SortKey(hi.Rows[j].Term)
		}
		return hi.Rows[i].Code < hi.Rows[j].Code
	})
	latestSlug := ""
	latestLabel := "·"
	if len(hi.Rows) > 0 {
		latestSlug = hi.Rows[0].Term
		latestLabel = latestSlug
		if label := termLabels[latestSlug]; label != "" {
			latestLabel = label
		}
	}
	courseCount := distinctCodes(hi.Rows)
	canonical := fmt.Sprintf("%s/hoca/%s/", baseURL, slug)
	title := fmt.Sprintf(b.l.InstrTitleFmt, hi.Name)
	lead := fmt.Sprintf(b.l.InstrLeadFmt, hi.Name, hi.Terms, len(hi.Rows), courseCount, latestLabel)
	description := fmt.Sprintf(b.l.InstrDescriptionFmt, hi.Name, hi.Terms, courseCount, latestLabel)

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":         "https://schema.org",
			"@type":            "Person",
			"@id":              canonical + "#person",
			"url":              canonical,
			"name":             hi.Name,
			"mainEntityOfPage": canonical,
		},
		map[string]any{
			"@context": "https://schema.org",
			"@type":    "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": b.l.CrumbHome, "item": baseURL + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": hi.Name, "item": canonical},
			},
		},
	})

	// En sık verdiği dersler: şube sayısını değil, farklı dönem sayısını
	// gösterir; aynı dönem içindeki çoklu şubeler özeti şişirmez.
	var frequentRows []string
	for _, c := range frequentCourses(hi.Rows, 5) {
		codeHTML := template.HTMLEscapeString(c.Code)
		if cs, ok := courseSlugs[c.Code]; ok {
			codeHTML = fmt.Sprintf(`<a href="/ders/%s/">%s</a>`, cs, template.HTMLEscapeString(c.Code))
		}
		frequentRows = append(frequentRows, fmt.Sprintf(
			`<li><span>%s · %s</span><span>%d dönem</span></li>`,
			codeHTML, template.HTMLEscapeString(c.Name), c.Terms,
		))
	}
	frequentHTML := ""
	if len(frequentRows) > 0 {
		frequentHTML = `<h2>` + b.l.InstrFrequentHead + `</h2><ul class="seo-branchlist seo-instructor-courses">` +
			strings.Join(frequentRows, "") + `</ul>`
	}
	var branchLinks []string
	for _, branch := range instructorBranches(hi.Rows) {
		branchLinks = append(branchLinks, fmt.Sprintf(`<a href="/brans/%s/"><code>%s</code></a>`,
			template.HTMLEscapeString(branch), template.HTMLEscapeString(branch)))
	}
	branchesHTML := ""
	if len(branchLinks) > 0 {
		branchesHTML = `<h2>` + b.l.InstrBranchesHead + `</h2><p class="seo-codes">` + strings.Join(branchLinks, " ") + `</p>`
	}

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
		fmt.Sprintf(`<nav class="crumb" aria-label="Breadcrumb"><a href="/">%s</a> › <span>%s</span></nav>`, template.HTMLEscapeString(b.l.CrumbHome), template.HTMLEscapeString(hi.Name)),
		fmt.Sprintf(`<h1>%s</h1>`, template.HTMLEscapeString(hi.Name)),
		fmt.Sprintf(`<p class="lead">%s</p>`, template.HTMLEscapeString(lead)),
		`<dl class="seo-stats">`+
			fmt.Sprintf(`<div><dt>toplam dönem</dt><dd>%d</dd></div>`, hi.Terms)+
			fmt.Sprintf(`<div><dt>ders kaydı</dt><dd>%d</dd></div>`, len(hi.Rows))+
			fmt.Sprintf(`<div><dt>%s</dt><dd>%d</dd></div>`, b.l.InstrStatCourses, courseCount)+
			fmt.Sprintf(`<div><dt>%s</dt><dd><a href="/dersler/%s/">%s</a></dd></div>`, b.l.InstrStatLatest, template.HTMLEscapeString(latestSlug), template.HTMLEscapeString(latestLabel))+
			`</dl>`,
		frequentHTML,
		branchesHTML,
		`<h2>`+b.l.InstrHistoryHead+`</h2>`,
		`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>Ders</th><th>Adı</th><th>Dönem</th><th>Kont</th><th>Yazılan</th></tr></thead><tbody>`+
			strings.Join(rows, "")+`</tbody></table></div>`,
		`<p class="seo-data-note">`+template.HTMLEscapeString(b.l.InstrDataNote)+`</p>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "hoca", slug, "index.html"),
		title, description, canonical, fmtDate(b.index.ScrapedAt), content, jsonld, false)
}

func instructorBranches(rows []instrRow) []string {
	seen := map[string]struct{}{}
	for _, row := range rows {
		if i := strings.IndexByte(row.Code, ' '); i > 0 {
			seen[row.Code[:i]] = struct{}{}
		}
	}
	return sortedKeys(seen)
}

type frequentCourse struct {
	Code  string
	Name  string
	Terms int
}

func frequentCourses(rows []instrRow, limit int) []frequentCourse {
	type agg struct {
		name  string
		terms map[string]struct{}
	}
	byCode := map[string]*agg{}
	for _, row := range rows {
		if row.Code == "" {
			continue
		}
		a := byCode[row.Code]
		if a == nil {
			a = &agg{terms: map[string]struct{}{}}
			byCode[row.Code] = a
		}
		if a.name == "" && row.Name != "" {
			a.name = row.Name
		}
		if row.Term != "" {
			a.terms[row.Term] = struct{}{}
		}
	}
	out := make([]frequentCourse, 0, len(byCode))
	for code, a := range byCode {
		out = append(out, frequentCourse{Code: code, Name: a.name, Terms: len(a.terms)})
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Terms != out[j].Terms {
			return out[i].Terms > out[j].Terms
		}
		return out[i].Code < out[j].Code
	})
	if limit > 0 && len(out) > limit {
		out = out[:limit]
	}
	return out
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
				TS   string         `json:"ts"`
				Full bool           `json:"full,omitempty"`
				Cap  map[string]int `json:"cap,omitempty"`
				Enr  map[string]int `json:"enr,omitempty"`
				Gone []string       `json:"gone,omitempty"`
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
			for c := range snap.Enr {
				changed[c] = true
			}
			for c := range snap.Cap {
				changed[c] = true
			}
			if snap.Full {
				for c := range state {
					changed[c] = true
				}
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
		if vals[i] < min {
			min = vals[i]
		}
		if vals[i] > max {
			max = vals[i]
		}
	}
	if max <= min {
		max = min + 0.01
	}
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
				Name  string   `json:"name"`
				Terms []string `json:"terms"`
				Rows  [][]any  `json:"rows"`
			}
			if err := json.Unmarshal(r, &full); err != nil {
				return fmt.Errorf("%s/%s rows: %w", e.Name(), code, err)
			}
			hc.Name = full.Name
			hc.Terms = full.Terms
			for _, row := range full.Rows {
				if len(row) >= 5 {
					hr := histCourseRow{}
					if s, ok := row[0].(string); ok {
						hr.Term = s
					}
					if s, ok := row[1].(string); ok {
						hr.Instructor = s
					}
					switch v := row[2].(type) {
					case float64:
						hr.Capacity = int(v)
					}
					switch v := row[3].(type) {
					case float64:
						hr.Enrolled = int(v)
					}
					if s, ok := row[4].(string); ok {
						hr.Days = s
					}
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
		for _, c := range codes {
			codeSet[c] = true
		}
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
	title := code + ": " + hc.Name
	branch := code
	if idx := strings.IndexByte(code, ' '); idx > 0 {
		branch = code[:idx]
	}
	desc := fmt.Sprintf("%s (%s): İTÜ'de %d dönemde açılmış bir ders. Geçmiş şubeleri, öğretim üyeleri ve son dönem programı.",
		code, hc.Name, len(hc.Terms))

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context":    "https://schema.org",
			"@type":       "Course",
			"@id":         canonical + "#course",
			"url":         canonical,
			"name":        code + " " + hc.Name,
			"description": hc.Name,
			"inLanguage":  "tr-TR",
			"provider":    map[string]string{"@type": "CollegeOrUniversity", "name": "İstanbul Teknik Üniversitesi", "url": "https://www.itu.edu.tr/"},
		},
		map[string]any{
			"@context": "https://schema.org", "@type": "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": "İTÜ Ders Arşivi", "item": baseURL + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": branch, "item": baseURL + "/brans/" + branch + "/"},
				map[string]any{"@type": "ListItem", "position": 3, "name": code, "item": canonical},
			},
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
			`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>CRN</th><th>Öğretim Üyesi</th><th>Zaman</th><th>Kont/Yazılan</th></tr></thead><tbody>` +
			strings.Join(rows, "") + `</tbody></table></div>`
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
		`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>Dönem</th><th>Öğretim Üyesi</th><th>Kont</th><th>Yazılan</th></tr></thead><tbody>`+
			strings.Join(histRows, "")+`</tbody></table></div>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "ders", slug, "index.html"),
		title, desc, canonical, fmtDate(b.index.ScrapedAt), content, jsonld, false)
}

// instrLink, hoca adı için varsa hoca sayfasına bağlantı, yoksa düz metin döndürür.
func instrLink(name string, instrSlugs map[string]string) string {
	if name == "" || name == "***" {
		return "·"
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
