package site

// Ders sayfasının veriden türeyen ek bölümleri: üstte tek cümlelik veri özeti,
// OBS ders kataloğu (tanım, öğrenme çıktıları, haftalık konular, kaynaklar,
// kredi/AKTS/dil), önşartlar ve bu dersi önşart olarak isteyen dersler, dersin
// yer aldığı müfredatlar ve benzer dersler.
//
// Kural: her metin veriden gelir. Verisi boş olan bölüm hiç basılmaz (boş
// başlık yok). Bağlantılar yalnızca bu üretimde gerçekten yazılan ders
// sayfalarına (b.courses) verilir; program bağlantıları /bolumler/ ile aynı
// uygulama görünümüne (?prog=KOD#dersplanim) gider.
//
// Sınıf adları "seo-" ile başlar (cmd/site/csssplit.go: yalnız statik sayfa
// kovası).

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"itu-scraper/internal/term"
)

const (
	similarMax       = 8 // "Benzer dersler" en çok bu kadar bağlantı
	similarSameName  = 3 // aynı adlı (başka dil/branş) derslerden en çok
	reversePrereqMax = 40
	curriculaMax     = 20
)

// catalogEntry, docs/data/catalog/<BRANŞ>.json içindeki tek ders.
type catalogEntry struct {
	Code     string `json:"code"`
	Name     string `json:"name"`
	NameEn   string `json:"nameEn"`
	Language string `json:"language"`
	Credits  struct {
		Theory   float64 `json:"theory"`
		Practice float64 `json:"practice"`
		Lab      float64 `json:"lab"`
		Local    float64 `json:"local"`
		Ects     float64 `json:"ects"`
	} `json:"credits"`
	Description  string   `json:"description"`
	Outcomes     []string `json:"outcomes"`
	WeeklyTopics []string `json:"weeklyTopics"`
	WeeklyPlan   []struct {
		Week  json.Number `json:"week"`
		Topic string      `json:"topic"`
	} `json:"weeklyPlan"`
	Textbooks []string `json:"textbooks"`
	SourceURL string   `json:"sourceUrl"`
}

type prereqInfo struct {
	Requirement string
	ClassReq    string
}

// currRef, bir dersin bir programın müfredatındaki yeri.
type currRef struct {
	ProgCode  string
	ProgName  string
	Level     string
	Semesters []string
	Elective  bool // en az bir yarıyılda seçmeli grup seçeneği olarak geçiyor
	Required  bool // en az bir yarıyılda doğrudan (zorunlu) ders olarak geçiyor
}

// courseExtras, ders sayfası ek bölümlerinin veri kaynakları.
type courseExtras struct {
	catalog   map[string]*catalogEntry
	prereq    map[string]prereqInfo
	reverse   map[string][]string
	curricula map[string][]currRef
	nameIndex map[string][]string // katlanmış ders adı -> kodlar (sıralı)
	byBranch  map[string][]string // branş -> kodlar (sıralı)
	sinceYear string              // arşivin ilk akademik yılının başı ("2016")
}

// loadCourseExtras, katalog, önşart ve müfredat verisini okur. Eksik dosya
// hata değildir (bölüm basılmaz); bozuk dosya hatadır.
func (b *Builder) loadCourseExtras() error {
	ex := &courseExtras{
		catalog:   map[string]*catalogEntry{},
		prereq:    map[string]prereqInfo{},
		reverse:   map[string][]string{},
		curricula: map[string][]currRef{},
	}
	b.extras = ex

	// Katalog.
	catDir := filepath.Join(b.root, "data", "catalog")
	if entries, err := os.ReadDir(catDir); err == nil {
		for _, e := range entries {
			if e.IsDir() || e.Name() == "index.json" || !strings.HasSuffix(e.Name(), ".json") {
				continue
			}
			var m map[string]*catalogEntry
			if err := readJSON(filepath.Join(catDir, e.Name()), &m); err != nil {
				return fmt.Errorf("catalog/%s: %w", e.Name(), err)
			}
			for code, c := range m {
				if c != nil {
					ex.catalog[code] = c
				}
			}
		}
	} else if !os.IsNotExist(err) {
		return fmt.Errorf("catalog okunamadı: %w", err)
	}

	// Önşart grafiği ve ters liste.
	var graph struct {
		Nodes []struct {
			Code        string `json:"code"`
			Requirement string `json:"requirement"`
			ClassReq    string `json:"classReq"`
		} `json:"nodes"`
	}
	if err := readJSONOptional(filepath.Join(b.root, "data", "prereq", "graph.json"), &graph); err != nil {
		return err
	}
	for _, n := range graph.Nodes {
		if n.Code == "" {
			continue
		}
		ex.prereq[n.Code] = prereqInfo{Requirement: strings.TrimSpace(n.Requirement), ClassReq: strings.TrimSpace(n.ClassReq)}
	}
	var rev map[string]json.RawMessage
	if err := readJSONOptional(filepath.Join(b.root, "data", "prereq", "reverse.json"), &rev); err != nil {
		return err
	}
	for code, raw := range rev {
		var list []string
		if json.Unmarshal(raw, &list) != nil {
			continue // şema/provenance alanları
		}
		ex.reverse[code] = list
	}

	// Müfredatlar.
	if err := ex.loadCurricula(filepath.Join(b.root, "data", "curriculum")); err != nil {
		return err
	}

	// Benzer dersler için ad ve branş dizinleri (yalnız sayfası olan dersler).
	ex.nameIndex = map[string][]string{}
	ex.byBranch = map[string][]string{}
	codes := make([]string, 0, len(b.courses))
	for code := range b.courses {
		codes = append(codes, code)
	}
	sort.Strings(codes)
	for _, code := range codes {
		seen := map[string]bool{}
		names := []string{b.courses[code].Name}
		if c := ex.catalog[code]; c != nil {
			names = append(names, c.Name, c.NameEn)
		}
		for _, n := range names {
			k := foldCourseName(n)
			if k == "" || seen[k] {
				continue
			}
			seen[k] = true
			ex.nameIndex[k] = append(ex.nameIndex[k], code)
		}
		if br, _, _, ok := splitCourseCode(code); ok {
			ex.byBranch[br] = append(ex.byBranch[br], code)
		}
	}

	// Arşivin başlangıç yılı (özet cümlesi için).
	first := ""
	for _, t := range b.index.Terms {
		if t.Missing {
			continue
		}
		if first == "" || term.SortKey(t.Slug) < term.SortKey(first) {
			first = t.Slug
		}
	}
	if len(first) >= 4 {
		ex.sinceYear = first[:4]
	}
	return nil
}

func readJSONOptional(path string, v any) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil
	}
	if err := readJSON(path, v); err != nil {
		return fmt.Errorf("%s: %w", path, err)
	}
	return nil
}

func (ex *courseExtras) loadCurricula(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("curriculum okunamadı: %w", err)
	}
	type item struct {
		Course *struct {
			Code     string `json:"code"`
			Required string `json:"required"`
		} `json:"course"`
		Elective *struct {
			Options []struct {
				Code string `json:"code"`
			} `json:"options"`
		} `json:"elective"`
	}
	type program struct {
		ProgramCode string `json:"programCode"`
		ProgramName string `json:"programName"`
		Level       string `json:"level"`
		Semesters   []struct {
			Title string `json:"title"`
			Items []item `json:"items"`
		} `json:"semesters"`
	}
	refs := map[string]map[string]*currRef{} // ders -> program -> ref
	for _, e := range entries {
		if e.IsDir() || e.Name() == "index.json" || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		data, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			return err
		}
		var progs []program
		if strings.HasPrefix(strings.TrimSpace(string(data)), "[") {
			err = json.Unmarshal(data, &progs)
		} else {
			var p program
			err = json.Unmarshal(data, &p)
			progs = []program{p}
		}
		if err != nil {
			return fmt.Errorf("curriculum/%s: %w", e.Name(), err)
		}
		for _, p := range progs {
			if p.ProgramCode == "" || strings.TrimSpace(p.ProgramName) == "" {
				continue
			}
			add := func(code, sem string, elective bool) {
				code = strings.TrimSpace(code)
				if code == "" {
					return
				}
				m := refs[code]
				if m == nil {
					m = map[string]*currRef{}
					refs[code] = m
				}
				r := m[p.ProgramCode]
				if r == nil {
					r = &currRef{ProgCode: p.ProgramCode, ProgName: strings.TrimSpace(p.ProgramName), Level: p.Level}
					m[p.ProgramCode] = r
				}
				if sem = strings.TrimSpace(sem); sem != "" && !containsString(r.Semesters, sem) {
					r.Semesters = append(r.Semesters, sem)
				}
				if elective {
					r.Elective = true
				} else {
					r.Required = true
				}
			}
			for _, s := range p.Semesters {
				for _, it := range s.Items {
					if it.Course != nil {
						add(it.Course.Code, s.Title, it.Course.Required != "Z")
					}
					if it.Elective != nil {
						for _, o := range it.Elective.Options {
							add(o.Code, s.Title, true)
						}
					}
				}
			}
		}
	}
	levelRank := map[string]int{"OL": 0, "LS": 1, "YL": 2, "DR": 3}
	for code, m := range refs {
		list := make([]currRef, 0, len(m))
		for _, r := range m {
			list = append(list, *r)
		}
		sort.Slice(list, func(i, j int) bool {
			li, lj := levelRank[list[i].Level], levelRank[list[j].Level]
			if li != lj {
				return li < lj
			}
			ki, kj := trCollateKey(list[i].ProgName), trCollateKey(list[j].ProgName)
			if ki != kj {
				return ki < kj
			}
			return list[i].ProgCode < list[j].ProgCode
		})
		ex.curricula[code] = list
	}
	return nil
}

func containsString(list []string, s string) bool {
	for _, x := range list {
		if x == s {
			return true
		}
	}
	return false
}

// foldCourseName, ad eşleştirmesi için küçük harf, tek boşluk.
func foldCourseName(s string) string {
	return strings.Join(strings.Fields(strings.ToLower(strings.TrimSpace(s))), " ")
}

// splitCourseCode: "UCK 435E" -> ("UCK", 435, "E", true).
func splitCourseCode(code string) (branch string, num int, suffix string, ok bool) {
	i := strings.IndexByte(code, ' ')
	if i <= 0 {
		return "", 0, "", false
	}
	branch, rest := code[:i], strings.TrimSpace(code[i+1:])
	j := 0
	for j < len(rest) && rest[j] >= '0' && rest[j] <= '9' {
		j++
	}
	if j == 0 {
		return "", 0, "", false
	}
	n, err := strconv.Atoi(rest[:j])
	if err != nil {
		return "", 0, "", false
	}
	return branch, n, rest[j:], true
}

// isPlaceholderText, katalogdaki "-", "YOK" gibi boş yer tutucular.
func isPlaceholderText(s string) bool {
	t := strings.ToLower(strings.TrimSpace(s))
	switch t {
	case "", "yok", "yoktur", "none", "n/a", "na", "-", "--", "---", ".", "...", "–", "—":
		return true
	}
	for _, r := range t {
		if (r >= 'a' && r <= 'z') || r > 127 || (r >= '0' && r <= '9') {
			return false
		}
	}
	return true
}

func cleanList(in []string) []string {
	var out []string
	seen := map[string]bool{}
	for _, s := range in {
		s = strings.Join(strings.Fields(s), " ")
		if isPlaceholderText(s) || seen[s] {
			continue
		}
		seen[s] = true
		out = append(out, s)
	}
	return out
}

// trDecimal: 7.5 -> "7,5", 3 -> "3".
func trDecimal(f float64) string {
	return strings.Replace(strconv.FormatFloat(f, 'f', -1, 64), ".", ",", 1)
}

// yearAblativeTR: "2016" -> "2016'dan", "2020" -> "2020'den".
func yearAblativeTR(year string) string {
	n, err := strconv.Atoi(year)
	if err != nil || n <= 0 {
		return ""
	}
	// Okunuşun son kelimesine göre ünlü uyumu ve sertleşme.
	lastWord := map[int]string{1: "bir", 2: "iki", 3: "üç", 4: "dört", 5: "beş", 6: "altı", 7: "yedi", 8: "sekiz", 9: "dokuz"}
	tens := map[int]string{1: "on", 2: "yirmi", 3: "otuz", 4: "kırk", 5: "elli", 6: "altmış", 7: "yetmiş", 8: "seksen", 9: "doksan"}
	w := ""
	switch {
	case n%10 != 0:
		w = lastWord[n%10]
	case n%100 != 0:
		w = tens[(n/10)%10]
	case n%1000 != 0:
		w = "yüz"
	default:
		w = "bin"
	}
	suf := ablativeTR(w)
	return year + suf[len(w):]
}

// courseSummary, sayfanın üstündeki tek cümlelik veri özeti.
func (b *Builder) courseSummary(code string, hc *histCourse, termLabels map[string]string) string {
	set := map[string]bool{}
	for _, t := range hc.Terms {
		if t != "" {
			set[t] = true
		}
	}
	for _, r := range hc.Rows {
		if r.Term != "" {
			set[r.Term] = true
		}
	}
	if len(set) == 0 {
		return ""
	}
	terms := make([]string, 0, len(set))
	for t := range set {
		terms = append(terms, t)
	}
	sort.Slice(terms, func(i, j int) bool { return term.SortKey(terms[i]) > term.SortKey(terms[j]) })
	label := func(slug string) string {
		if l := termLabels[slug]; l != "" {
			return shortTermLabel(l)
		}
		return slug
	}
	latest := terms[0]

	sections, students := 0, 0
	if sects := b.courseSects[code]; len(sects) > 0 && b.courseSectsTerm(hc) == latest {
		sections = len(sects)
		for _, s := range sects {
			students += s.Enrolled
		}
	} else {
		for _, r := range hc.Rows {
			if r.Term == latest {
				sections++
				students += r.Enrolled
			}
		}
	}

	var sb strings.Builder
	sb.WriteString(code)
	sb.WriteString(", ")
	if since := yearAblativeTR(b.extrasSinceYear()); since != "" {
		sb.WriteString(since + " bu yana ")
	}
	n := len(terms)
	counts := ""
	if sections > 0 {
		counts = fmt.Sprintf("%d şube", sections)
		if students > 0 {
			counts += ", " + trNum(students) + " öğrenci"
		}
	}
	switch {
	case n == 1:
		fmt.Fprintf(&sb, "1 dönem açıldı (%s)", label(latest))
		if counts != "" {
			sb.WriteString("; " + counts)
		}
	case n <= 3:
		labels := make([]string, n)
		for i, t := range terms {
			labels[i] = label(t)
		}
		fmt.Fprintf(&sb, "%d dönem açıldı (%s)", n, joinTR(labels))
		if counts != "" {
			sb.WriteString("; son dönemde " + counts)
		}
	default:
		fmt.Fprintf(&sb, "%d dönem açıldı, son olarak %s", n, label(latest))
		if counts != "" {
			sb.WriteString("; o dönem " + counts)
		}
	}
	sb.WriteString(".")
	return sb.String()
}

// courseSectsTerm, b.courseSects'in okunduğu dönem (loadCourseData ile aynı seçim).
func (b *Builder) courseSectsTerm(hc *histCourse) string {
	slug := ""
	for _, t := range hc.Terms {
		if slug == "" || term.SortKey(t) > term.SortKey(slug) {
			slug = t
		}
	}
	return slug
}

func (b *Builder) extrasSinceYear() string {
	if b.extras == nil {
		return ""
	}
	return b.extras.sinceYear
}

func (b *Builder) catalogFor(code string) *catalogEntry {
	if b.extras == nil {
		return nil
	}
	return b.extras.catalog[code]
}

// catalogStatsHTML, mevcut seo-stats listesine eklenen kredi/AKTS/saat/dil.
func (b *Builder) catalogStatsHTML(code string) string {
	c := b.catalogFor(code)
	if c == nil {
		return ""
	}
	esc := template.HTMLEscapeString
	var sb strings.Builder
	cr := c.Credits
	if cr.Local > 0 {
		fmt.Fprintf(&sb, `<div><dt>kredi</dt><dd>%s</dd></div>`, trDecimal(cr.Local))
	}
	if cr.Ects > 0 {
		fmt.Fprintf(&sb, `<div><dt>AKTS</dt><dd>%s</dd></div>`, trDecimal(cr.Ects))
	}
	if cr.Theory+cr.Practice+cr.Lab > 0 {
		fmt.Fprintf(&sb, `<div><dt>teori+uyg.+lab</dt><dd>%s+%s+%s</dd></div>`, trDecimal(cr.Theory), trDecimal(cr.Practice), trDecimal(cr.Lab))
	}
	if l := strings.TrimSpace(c.Language); l != "" && !isPlaceholderText(l) {
		fmt.Fprintf(&sb, `<div><dt>katalog dili</dt><dd>%s</dd></div>`, esc(l))
	}
	return sb.String()
}

// renderCourseCatalog, "Ders içeriği" bölümü: tanım, öğrenme çıktıları,
// haftalık konular ve kaynaklar. Hepsi boşsa "".
func (b *Builder) renderCourseCatalog(code, histName string) string {
	c := b.catalogFor(code)
	if c == nil {
		return ""
	}
	esc := template.HTMLEscapeString
	var body strings.Builder

	// Ad farkları (katalogdaki Türkçe/İngilizce ad, sayfa başlığından farklıysa).
	var names []string
	hn := foldCourseName(histName)
	if n := strings.TrimSpace(c.Name); n != "" && foldCourseName(n) != hn {
		names = append(names, "Katalogdaki adı: "+n)
	}
	if n := strings.TrimSpace(c.NameEn); n != "" && foldCourseName(n) != hn && foldCourseName(n) != foldCourseName(c.Name) {
		names = append(names, "İngilizce adı: "+n)
	}
	hasNames := len(names) > 0
	for _, n := range names {
		fmt.Fprintf(&body, `<p class="seo-prose">%s.</p>`, esc(strings.TrimRight(n, ".")))
	}

	content := false
	for _, para := range strings.Split(c.Description, "\n") {
		para = strings.Join(strings.Fields(para), " ")
		if isPlaceholderText(para) {
			continue
		}
		fmt.Fprintf(&body, `<p class="seo-prose">%s</p>`, esc(para))
		content = true
	}
	if outs := cleanList(c.Outcomes); len(outs) > 0 {
		body.WriteString(`<h3>Öğrenme çıktıları</h3><ul class="seo-list">`)
		for _, o := range outs {
			fmt.Fprintf(&body, `<li>%s</li>`, esc(o))
		}
		body.WriteString(`</ul>`)
		content = true
	}
	type week struct{ n, topic string }
	var weeks []week
	for i, w := range c.WeeklyPlan {
		t := strings.Join(strings.Fields(w.Topic), " ")
		if isPlaceholderText(t) {
			continue
		}
		n := w.Week.String()
		if n == "" || n == "0" {
			n = strconv.Itoa(i + 1)
		}
		weeks = append(weeks, week{n, t})
	}
	if len(weeks) > 0 {
		fmt.Fprintf(&body, `<details class="seo-fold"><summary>Haftalık konular (%d hafta)</summary><ol class="seo-weeks">`, len(weeks))
		for _, w := range weeks {
			fmt.Fprintf(&body, `<li><b>%s. hafta</b><span>%s</span></li>`, esc(w.n), esc(w.topic))
		}
		body.WriteString(`</ol></details>`)
		content = true
	}
	if books := cleanList(c.Textbooks); len(books) > 0 {
		body.WriteString(`<h3>Kaynaklar</h3><ul class="seo-list">`)
		for _, bk := range books {
			fmt.Fprintf(&body, `<li>%s</li>`, esc(bk))
		}
		body.WriteString(`</ul>`)
		content = true
	}
	if !content && !hasNames {
		return ""
	}
	src := ""
	if strings.HasPrefix(c.SourceURL, "https://obs.itu.edu.tr/") {
		src = fmt.Sprintf(`<p class="ip-note">Kaynak: <a href="%s" rel="nofollow noopener">İTÜ OBS ders kataloğu</a>.</p>`, esc(c.SourceURL))
	}
	return `<section class="seo-sec" aria-labelledby="icerik-baslik"><h2 id="icerik-baslik">Ders içeriği</h2>` + body.String() + src + `</section>`
}

var courseCodeRe = regexp.MustCompile(`\b([A-Z]{2,4}) ([0-9]{3}[A-Z]{0,2})\b`)

// courseLinkHTML, sayfası olan ders kodunu bağlar, olmayanı düz yazar.
func (b *Builder) courseLinkHTML(code string) string {
	esc := template.HTMLEscapeString
	if _, ok := b.courses[code]; ok {
		return fmt.Sprintf(`<a href="/ders/%s/"><code>%s</code></a>`, courseSlug(code), esc(code))
	}
	return `<code>` + esc(code) + `</code>`
}

// linkCodesInText, ham önşart ifadesindeki ders kodlarını bağlar.
func (b *Builder) linkCodesInText(s string) string {
	var out strings.Builder
	last := 0
	for _, m := range courseCodeRe.FindAllStringIndex(s, -1) {
		out.WriteString(template.HTMLEscapeString(s[last:m[0]]))
		out.WriteString(b.courseLinkHTML(s[m[0]:m[1]]))
		last = m[1]
	}
	out.WriteString(template.HTMLEscapeString(s[last:]))
	return out.String()
}

// renderCoursePrereqs: önşart ifadesi + sınıf şartı, ve ters önşart listesi.
func (b *Builder) renderCoursePrereqs(code string) string {
	if b.extras == nil {
		return ""
	}
	var sb strings.Builder
	p := b.extras.prereq[code]
	if !isPlaceholderText(p.Requirement) || !isPlaceholderText(p.ClassReq) {
		sb.WriteString(`<h2>Önşartlar</h2>`)
		if !isPlaceholderText(p.Requirement) {
			fmt.Fprintf(&sb, `<p class="seo-prereq">%s</p>`, b.linkCodesInText(p.Requirement))
		}
		if !isPlaceholderText(p.ClassReq) {
			fmt.Fprintf(&sb, `<p class="ip-note">OBS sınıf şartı: %s</p>`, template.HTMLEscapeString(p.ClassReq))
		}
	}
	if rev := cleanList(b.extras.reverse[code]); len(rev) > 0 {
		sort.Strings(rev)
		fmt.Fprintf(&sb, `<h2>Bu dersi önşart olarak isteyen dersler</h2><p class="ip-note">%d ders bu dersi önşartında sayıyor.</p><p class="seo-codes">`, len(rev))
		shown := rev
		if len(shown) > reversePrereqMax {
			shown = shown[:reversePrereqMax]
		}
		for _, c := range shown {
			sb.WriteString(b.courseLinkHTML(c))
			sb.WriteString(" ")
		}
		if more := len(rev) - len(shown); more > 0 {
			fmt.Fprintf(&sb, `<span class="ip-muted">ve %d ders daha</span>`, more)
		}
		sb.WriteString(`</p>`)
	}
	return sb.String()
}

// renderCourseCurricula: dersin geçtiği program müfredatları.
func (b *Builder) renderCourseCurricula(code string) string {
	if b.extras == nil {
		return ""
	}
	refs := b.extras.curricula[code]
	if len(refs) == 0 {
		return ""
	}
	esc := template.HTMLEscapeString
	var sb strings.Builder
	fmt.Fprintf(&sb, `<h2>Yer aldığı müfredatlar</h2><p class="ip-note">%d programın ders planında geçiyor.</p><ul class="seo-linklist">`, len(refs))
	shown := refs
	if len(shown) > curriculaMax {
		shown = shown[:curriculaMax]
	}
	for _, r := range shown {
		var meta []string
		meta = append(meta, r.Semesters...)
		switch {
		case r.Required && r.Elective:
			meta = append(meta, "zorunlu ve seçmeli")
		case r.Elective:
			meta = append(meta, "seçmeli")
		default:
			meta = append(meta, "zorunlu")
		}
		fmt.Fprintf(&sb, `<li><a %s>%s</a> <span>%s</span></li>`,
			appLinkAttrs("/?prog="+r.ProgCode+"#dersplanim"), esc(r.ProgName), esc(strings.Join(meta, ", ")))
	}
	sb.WriteString(`</ul>`)
	if more := len(refs) - len(shown); more > 0 {
		fmt.Fprintf(&sb, `<p class="ip-note">ve %d program daha; tümü <a href="/bolumler/">bölüm dizininde</a>.</p>`, more)
	}
	return sb.String()
}

// similarCourses, deterministik "benzer dersler": önce aynı adlı dersler
// (ör. FIZ 101 / FIZ 101E; aynı branş önce), sonra aynı branşta numarası en
// yakın, düzeyi en fazla bir basamak farklı dersler.
func (b *Builder) similarCourses(code string) []string {
	if b.extras == nil {
		return nil
	}
	hc := b.courses[code]
	if hc == nil {
		return nil
	}
	br, num, suf, ok := splitCourseCode(code)
	chosen := map[string]bool{code: true}
	var out []string

	var same []string
	names := []string{hc.Name}
	if c := b.extras.catalog[code]; c != nil {
		names = append(names, c.Name, c.NameEn)
	}
	for _, n := range names {
		for _, c := range b.extras.nameIndex[foldCourseName(n)] {
			if !chosen[c] {
				chosen[c] = true
				same = append(same, c)
			}
		}
	}
	sort.Slice(same, func(i, j int) bool {
		bi, ni, _, _ := splitCourseCode(same[i])
		bj, nj, _, _ := splitCourseCode(same[j])
		si, sj := bi == br && ni == num, bj == br && nj == num
		if si != sj {
			return si
		}
		if (bi == br) != (bj == br) {
			return bi == br
		}
		return same[i] < same[j]
	})
	if len(same) > similarSameName {
		for _, c := range same[similarSameName:] {
			delete(chosen, c)
		}
		same = same[:similarSameName]
	}
	out = append(out, same...)

	if ok {
		type cand struct {
			code      string
			diff      int
			sufChange bool
		}
		var cands []cand
		for _, c := range b.extras.byBranch[br] {
			if chosen[c] {
				continue
			}
			_, n, s, ok := splitCourseCode(c)
			if !ok {
				continue
			}
			lv := n/100 - num/100
			if lv < -1 || lv > 1 {
				continue
			}
			d := n - num
			if d < 0 {
				d = -d
			}
			cands = append(cands, cand{c, d, s != suf})
		}
		sort.Slice(cands, func(i, j int) bool {
			if cands[i].diff != cands[j].diff {
				return cands[i].diff < cands[j].diff
			}
			if cands[i].sufChange != cands[j].sufChange {
				return !cands[i].sufChange
			}
			return cands[i].code < cands[j].code
		})
		for _, c := range cands {
			if len(out) >= similarMax {
				break
			}
			out = append(out, c.code)
		}
	}
	if len(out) > similarMax {
		out = out[:similarMax]
	}
	return out
}

func (b *Builder) renderSimilarCourses(code string) string {
	list := b.similarCourses(code)
	if len(list) == 0 {
		return ""
	}
	esc := template.HTMLEscapeString
	var sb strings.Builder
	sb.WriteString(`<h2>Benzer dersler</h2><ul class="seo-linklist">`)
	for _, c := range list {
		name := ""
		if hc := b.courses[c]; hc != nil {
			name = strings.TrimSpace(hc.Name)
		}
		fmt.Fprintf(&sb, `<li><a href="/ders/%s/">%s</a>`, courseSlug(c), esc(c))
		if name != "" {
			fmt.Fprintf(&sb, ` <span>%s</span>`, esc(name))
		}
		sb.WriteString(`</li>`)
	}
	sb.WriteString(`</ul>`)
	return sb.String()
}
