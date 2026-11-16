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

	"itu-scraper/internal/term"
)

// --- hoca sayfaları ve dizini ---
//
// Sayfa sırası (yukarıdan aşağı): başlık + branşlar + kısa özet, "Bu dönem"
// şubeleri, not dağılımı (ders genel dağılımıyla karşılaştırmalı), hocametre,
// dönem × ders haritası (tam kayıt tablosu <details> içinde), aynı dersleri
// veren diğer hocalar.

var esc = template.HTMLEscapeString

// prepareInstructorExtras, hoca/ders sayfalarının ortak yan verisini hazırlar:
// hocametre eşleşmeleri, aktif dönem şubeleri (hoca adına göre) ve
// ders -> hoca -> dönem dizini. Yalnızca TR üretiminde çağrılır.
func (b *Builder) prepareInstructorExtras() error {
	hm, err := loadHocametre(filepath.Join(b.root, "data", "hocametre.json"))
	if err != nil {
		// Paralel üretilen yan veri: bozuksa sayfalar panelsiz çıkar, üretim durmaz.
		fmt.Fprintf(os.Stderr, "· uyarı: hocametre atlandı: %v\n", err)
		hm = nil
	}
	b.hm = hm
	b.hmMatch = map[string]*hmEntry{}
	if hm != nil {
		for slug, hi := range b.instructorProfiles {
			e := hm.match(hi.Name)
			if e == nil {
				for _, alias := range hi.Aliases {
					if e = hm.match(alias); e != nil {
						break
					}
				}
			}
			if e.hasData() {
				b.hmMatch[slug] = e
			}
		}
	}

	b.courseInstrs = map[string]map[string]map[string]bool{}
	for slug, hi := range b.instructorProfiles {
		for _, r := range hi.Rows {
			if r.Code == "" || r.Term == "" {
				continue
			}
			bySlug := b.courseInstrs[r.Code]
			if bySlug == nil {
				bySlug = map[string]map[string]bool{}
				b.courseInstrs[r.Code] = bySlug
			}
			if bySlug[slug] == nil {
				bySlug[slug] = map[string]bool{}
			}
			bySlug[slug][r.Term] = true
		}
	}

	b.currentSects = map[string][]sectRow{}
	if b.index.CurrentSlug == "" {
		return nil
	}
	var rows [][]json.RawMessage
	if err := readJSON(filepath.Join(b.root, "data", "terms", b.index.CurrentSlug, "search.json"), &rows); err != nil {
		return nil // aktif dönem dökümü yoksa "Bu dönem" kartı geçmişe düşer
	}
	for _, r := range rows {
		if len(r) < 8 {
			continue
		}
		var s sectRow
		var cp, en float64
		json.Unmarshal(r[0], &s.CRN)
		json.Unmarshal(r[1], &s.Code)
		json.Unmarshal(r[2], &s.Name)
		json.Unmarshal(r[3], &s.Branch)
		json.Unmarshal(r[4], &s.Instructor)
		json.Unmarshal(r[5], &s.When)
		json.Unmarshal(r[6], &cp)
		json.Unmarshal(r[7], &en)
		s.Capacity, s.Enrolled = int(cp), int(en)
		if len(r) > 11 {
			json.Unmarshal(r[11], &s.Room)
		}
		for _, name := range splitInstructorNames(s.Instructor) {
			key := foldName(name)
			b.currentSects[key] = append(b.currentSects[key], s)
		}
	}
	return nil
}

// splitInstructorNames, "A , / B" gibi çok hocalı alanı kişilere ayırır;
// yer tutucuları ("-", "--", "***") atar.
func splitInstructorNames(field string) []string {
	var out []string
	for _, part := range strings.FieldsFunc(field, func(r rune) bool { return r == ',' || r == '/' }) {
		part = strings.TrimSpace(part)
		if isPlaceholderInstructor(part) {
			continue
		}
		out = append(out, part)
	}
	return out
}

func isPlaceholderInstructor(name string) bool {
	compact := strings.Trim(strings.TrimSpace(name), "-*—·. ")
	return compact == ""
}

// --- dönem yardımcıları ---

// termShort: "2023-2024 Bahar Dönemi" -> "2023-2024 Bahar".
func termShort(slug string, labels map[string]string) string {
	label := labels[slug]
	if label == "" {
		label = slug
	}
	return strings.TrimSuffix(label, " Dönemi")
}

// ablativeTR, özel ada kesme işaretiyle ayrılma eki ekler: "2025-2026 Bahar"
// → "2025-2026 Bahar'dan", "Güz" → "Güz'den" (ünlü uyumu ve ünsüz benzeşmesi).
func ablativeTR(word string) string {
	vowel := 'e'
	for _, r := range strings.ToLower(word) {
		switch r {
		case 'a', 'ı', 'o', 'u':
			vowel = 'a'
		case 'e', 'i', 'ö', 'ü':
			vowel = 'e'
		}
	}
	cons := "d"
	if rs := []rune(strings.ToLower(word)); len(rs) > 0 && strings.ContainsRune("çfhkpsşt", rs[len(rs)-1]) {
		cons = "t"
	}
	return word + "'" + cons + string(vowel) + "n"
}

func seasonLetter(slug string) string {
	switch {
	case strings.HasSuffix(slug, "-guz"):
		return "G"
	case strings.HasSuffix(slug, "-bahar"):
		return "B"
	case strings.HasSuffix(slug, "-yaz"):
		return "Y"
	}
	return "?"
}

// yearShort: "2023-2024-guz" -> "23-24".
func yearShort(slug string) string {
	parts := strings.SplitN(slug, "-", 3)
	if len(parts) < 2 || len(parts[0]) < 4 || len(parts[1]) < 4 {
		return slug
	}
	return parts[0][2:] + "-" + parts[1][2:]
}

func yearKey(slug string) string {
	parts := strings.SplitN(slug, "-", 3)
	if len(parts) < 2 {
		return slug
	}
	return parts[0] + "-" + parts[1]
}

// chronoTerms, dizindeki dönemleri eskiden yeniye sıralar (eksik dönemler dahil).
func (b *Builder) chronoTerms() []string {
	var out []string
	for _, t := range b.index.Terms {
		out = append(out, t.Slug)
	}
	sort.Slice(out, func(i, j int) bool { return term.SortKey(out[i]) < term.SortKey(out[j]) })
	return out
}

func (b *Builder) missingTerms() map[string]bool {
	m := map[string]bool{}
	for _, t := range b.index.Terms {
		if t.Missing {
			m[t.Slug] = true
		}
	}
	return m
}

// --- şube/kontenjan yardımcıları ---

// whenLines: "Salı 08:30/12:29 | Perşembe 15:30/17:29" -> satırlar.
func whenLines(when string) []string {
	var out []string
	for _, part := range strings.Split(when, "|") {
		part = strings.TrimSpace(part)
		if part == "" || strings.Trim(part, "-/ ") == "" {
			continue
		}
		out = append(out, strings.Replace(part, "/", "–", 1))
	}
	return out
}

// quotaHTML, DESIGN.md kontenjan kuralı: tek sayısal temsil; kritik durumda
// kalan yer, tam doluda "dolu" (kırmızı yalnızca burada).
func quotaHTML(enr, capacity int) string {
	if capacity <= 0 {
		return `<span class="fill is-unknown">kontenjan yok</span>`
	}
	left := capacity - enr
	switch {
	case left <= 0:
		return fmt.Sprintf(`<span class="fill is-full">%d / %d<span class="q-state">dolu</span></span>`, enr, capacity)
	case left <= 3 || float64(left) <= float64(capacity)*0.1:
		return fmt.Sprintf(`<span class="fill is-tight">%d / %d<span class="q-state">%d yer</span></span>`, enr, capacity, left)
	}
	return fmt.Sprintf(`<span class="fill">%d / %d</span>`, enr, capacity)
}

// --- sayfa ---

func (b *Builder) writeInstructorPage(slug string, courseSlugs map[string]string, termLabels map[string]string) error {
	hi := b.instructorProfiles[slug]
	if hi == nil {
		return fmt.Errorf("hoca bulunamadı: %s", slug)
	}
	sort.Slice(hi.Rows, func(i, j int) bool {
		if hi.Rows[i].Term != hi.Rows[j].Term {
			return term.SortKey(hi.Rows[i].Term) > term.SortKey(hi.Rows[j].Term)
		}
		return hi.Rows[i].Code < hi.Rows[j].Code
	})
	latestSlug, firstSlug := "", ""
	if len(hi.Rows) > 0 {
		latestSlug = hi.Rows[0].Term
		firstSlug = hi.Rows[len(hi.Rows)-1].Term
	}
	latestLabel := "·"
	if latestSlug != "" {
		latestLabel = termLabels[latestSlug]
		if latestLabel == "" {
			latestLabel = latestSlug
		}
	}
	courseCount := distinctCodes(hi.Rows)
	canonical := fmt.Sprintf("%s/hoca/%s/", baseURL, slug)
	title := fmt.Sprintf(b.l.InstrTitleFmt, hi.Name)
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
				map[string]any{"@type": "ListItem", "position": 2, "name": "Hocalar", "item": baseURL + "/hoca/"},
				map[string]any{"@type": "ListItem", "position": 3, "name": hi.Name, "item": canonical},
			},
		},
	})

	codeLink := func(code, cls string) string {
		if cs, ok := courseSlugs[code]; ok {
			return fmt.Sprintf(`<a class="%s" href="/ders/%s/" translate="no">%s</a>`, cls, cs, esc(code))
		}
		return fmt.Sprintf(`<span class="%s" translate="no">%s</span>`, cls, esc(code))
	}

	// --- hero: ad, olgular, branşlar, tek satır özet + "Bu dönem" kartı
	freq := frequentCourses(hi.Rows, 0)
	var head strings.Builder
	fmt.Fprintf(&head, `<nav class="crumb ip-crumb" aria-label="Breadcrumb"><a href="/">%s</a><span aria-hidden="true">›</span><a href="/hoca/">Hocalar</a><span aria-hidden="true">›</span><span>%s</span></nav>`,
		esc(b.l.CrumbHome), esc(hi.Name))
	head.WriteString(`<div class="ip-hero"><div class="ip-hero-main">`)
	fmt.Fprintf(&head, `<h1>%s</h1>`, esc(hi.Name))
	since := ""
	if parts := strings.SplitN(firstSlug, "-", 2); len(parts) == 2 && len(parts[0]) == 4 && hi.Terms > 1 {
		since = fmt.Sprintf(`<span>%s beri</span>`, esc(ablativeTR(termShort(firstSlug, termLabels))))
	}
	fmt.Fprintf(&head, `<p class="ip-facts"><span><b class="num">%d</b> dönem</span><span><b class="num">%d</b> farklı ders</span><span><b class="num">%d</b> şube kaydı</span>%s</p>`,
		hi.Terms, courseCount, len(hi.Rows), since)
	if branches := instructorBranches(hi.Rows); len(branches) > 0 {
		head.WriteString(`<ul class="ip-chips" aria-label="Branşlar">`)
		for _, br := range branches {
			fmt.Fprintf(&head, `<li><a class="ip-chip" href="/brans/%s/" translate="no">%s</a></li>`, esc(br), esc(br))
		}
		head.WriteString(`</ul>`)
	}
	fmt.Fprintf(&head, `<p class="ip-lede">%s</p>`, esc(instructorLede(freq, hi.Terms, latestSlug, termLabels)))
	head.WriteString(`</div>`)
	head.WriteString(b.renderNowCard(hi, codeLink, termLabels))
	head.WriteString(`</div>`)

	gp := b.instructorGradeProfile(hi, termLabels)
	gp.Compare = b.pairedCompare(slug, hi, termLabels)

	content := template.HTML(buildContent(
		head.String(),
		renderInstructorGrades(b.l, gp),
		b.hm.renderPanel(b.hmMatch[slug], b.l.Code),
		b.renderTermGrid(hi, codeLink, termLabels),
		b.renderPeers(slug, freq),
		`<p class="seo-data-note">`+esc(b.l.InstrDataNote)+`</p>`,
	))

	return b.writePage(filepath.Join(b.outRoot, "hoca", slug, "index.html"),
		title, description, canonical, fmtDate(b.index.ScrapedAt), content, jsonld, false)
}

// instructorLede, olgu satırını tekrar etmeyen tek cümlelik özet.
func instructorLede(freq []frequentCourse, terms int, latest string, termLabels map[string]string) string {
	if len(freq) == 0 {
		return ""
	}
	if terms <= 1 {
		return fmt.Sprintf("Arşivde yalnızca %s dönemine ait kaydı var.", termShort(latest, termLabels))
	}
	names := []string{}
	seen := map[string]bool{}
	for _, fc := range freq {
		if len(names) == 2 {
			break
		}
		if fc.Name == "" || seen[fc.Name] {
			continue
		}
		seen[fc.Name] = true
		names = append(names, fc.Name)
	}
	s := "En çok " + strings.Join(names, " ve ") + " veriyor"
	if len(names) == 1 {
		s = "En çok " + names[0] + " dersini veriyor"
	}
	return s + fmt.Sprintf("; son kaydı %s.", termShort(latest, termLabels))
}

// sectionsFor, aktif dönemde hocanın şubeleri (ad ve takma adlarıyla).
func (b *Builder) sectionsFor(hi *histInstr) []sectRow {
	seen := map[string]bool{}
	var out []sectRow
	for _, name := range append([]string{hi.Name}, hi.Aliases...) {
		for _, s := range b.currentSects[foldName(name)] {
			if seen[s.CRN] {
				continue
			}
			seen[s.CRN] = true
			out = append(out, s)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Code != out[j].Code {
			return out[i].Code < out[j].Code
		}
		return out[i].CRN < out[j].CRN
	})
	return out
}

func (b *Builder) renderNowCard(hi *histInstr, codeLink func(string, string) string, termLabels map[string]string) string {
	cur := b.index.CurrentSlug
	curShort := termShort(cur, termLabels)
	sects := b.sectionsFor(hi)
	var out strings.Builder
	out.WriteString(`<aside class="ip-card ip-now" aria-labelledby="h-now">`)
	if len(sects) == 0 {
		fmt.Fprintf(&out, `<div class="ip-now-h"><h2 id="h-now" class="ip-k">Bu dönem · %s</h2></div>`, esc(curShort))
		last := ""
		if len(hi.Rows) > 0 {
			last = hi.Rows[0].Term
		}
		switch {
		case last == cur && cur != "":
			fmt.Fprintf(&out, `<p class="ip-now-empty">Bu dönem ders kaydı var ama şube ayrıntısı eşleşmedi. <a href="/?q=%s#dersler">Derslerde ara</a>.</p>`,
				template.URLQueryEscaper(hi.Name))
		case last != "":
			fmt.Fprintf(&out, `<p class="ip-now-empty">Bu dönem açılmış şubesi yok.</p><p class="ip-now-last">Son verdiği dönem <a href="/dersler/%s/">%s</a></p>`,
				esc(last), esc(termShort(last, termLabels)))
		}
		out.WriteString(`</aside>`)
		return out.String()
	}
	fmt.Fprintf(&out, `<div class="ip-now-h"><h2 id="h-now" class="ip-k">Bu dönem · %s</h2><span class="ip-k num">%d şube</span></div>`, esc(curShort), len(sects))
	for _, s := range sects {
		var meta []string
		meta = append(meta, `<span class="num">CRN `+esc(s.CRN)+`</span>`)
		for _, l := range whenLines(s.When) {
			if i := strings.IndexByte(l, ' '); i > 0 {
				meta = append(meta, esc(l[:i])+` <span class="num">`+esc(l[i+1:])+`</span>`)
			} else {
				meta = append(meta, esc(l))
			}
		}
		if room := strings.TrimSpace(s.Room); room != "" && !strings.HasSuffix(room, "--") {
			meta = append(meta, esc(room))
		}
		fmt.Fprintf(&out, `<div class="ip-sec"><p class="ip-sec-c">%s%s</p><p class="ip-sec-m">%s</p>%s`+
			`<a class="ip-add" href="/?q=%s#dersler">Derslerde aç →<span class="sr-only"> %s, CRN %s</span></a></div>`,
			codeLink(s.Code, "code"), esc(s.Name), strings.Join(meta, " · "), quotaHTML(s.Enrolled, s.Capacity),
			template.URLQueryEscaper(s.CRN), esc(s.Code), esc(s.CRN))
	}
	fmt.Fprintf(&out, `<p class="ip-fresh">Son ölçüm %s · kayıttan önce OBS'de doğrula</p>`, esc(fmtDate(b.index.ScrapedAt)))
	out.WriteString(`</aside>`)
	return out.String()
}

// renderTermGrid, dönem × ders haritası; tam şube listesi <details> içinde.
func (b *Builder) renderTermGrid(hi *histInstr, codeLink func(string, string) string, termLabels map[string]string) string {
	if len(hi.Rows) == 0 {
		return ""
	}
	type cell struct{ sections, cap, enr int }
	taught := map[string]map[string]*cell{}
	for _, r := range hi.Rows {
		if taught[r.Code] == nil {
			taught[r.Code] = map[string]*cell{}
		}
		c := taught[r.Code][r.Term]
		if c == nil {
			c = &cell{}
			taught[r.Code][r.Term] = c
		}
		c.sections++
		c.cap += r.Cap
		c.enr += r.Enr
	}
	freq := frequentCourses(hi.Rows, 0)
	const maxRows = 10
	rows := freq
	if len(rows) > maxRows {
		rows = rows[:maxRows]
	}
	minKey := ""
	for _, fc := range rows {
		for t := range taught[fc.Code] {
			if k := term.SortKey(t); minKey == "" || k < minKey {
				minKey = k
			}
		}
	}
	var cols []string
	for _, t := range b.chronoTerms() {
		if term.SortKey(t) >= minKey {
			cols = append(cols, t)
		}
	}
	missing := b.missingTerms()
	cur := b.index.CurrentSlug
	ystart := func(i int) bool { return i == 0 || yearKey(cols[i-1]) != yearKey(cols[i]) }

	var g strings.Builder
	g.WriteString(`<section class="ip-blk" aria-labelledby="h-ders">`)
	span := ""
	if len(cols) > 0 {
		span = yearKey(cols[0])[:4] + " · " + yearKey(cols[len(cols)-1])[5:]
	}
	fmt.Fprintf(&g, `<div class="ip-blk-h"><div><h2 id="h-ders">Verdiği dersler</h2><p class="ip-note">Her kare bir dönem. Çerçeveli kare: bu dönem.</p></div><span class="ip-k num">%s</span></div>`, esc(span))
	g.WriteString(`<div class="ip-grid-box"><div class="ip-grid-scroll" tabindex="0" role="region" aria-label="Dönem ve ders haritası, yatay kaydırılabilir">`)
	g.WriteString(`<table class="ip-tg"><thead><tr><th scope="col" rowspan="2" class="ip-tg-corner"><span class="sr-only">Ders</span></th>`)
	for i := 0; i < len(cols); {
		y := yearKey(cols[i])
		j := i
		for j < len(cols) && yearKey(cols[j]) == y {
			j++
		}
		fmt.Fprintf(&g, `<th scope="colgroup" colspan="%d" class="ip-yr">%s</th>`, j-i, esc(yearShort(cols[i])))
		i = j
	}
	g.WriteString(`</tr><tr>`)
	for i, t := range cols {
		cls := "ip-ss"
		if ystart(i) {
			cls += " is-ys"
		}
		fmt.Fprintf(&g, `<th scope="col" class="%s"><abbr title="%s">%s</abbr></th>`, cls, esc(termShort(t, termLabels)), seasonLetter(t))
	}
	g.WriteString(`</tr></thead><tbody>`)
	for _, fc := range rows {
		fmt.Fprintf(&g, `<tr><th scope="row">%s<span class="ip-nm">%s</span></th>`, codeLink(fc.Code, "code"), esc(fc.Name))
		for i, t := range cols {
			tdc := ""
			if ystart(i) {
				tdc = ` class="is-ys"`
			}
			c := taught[fc.Code][t]
			switch {
			case c != nil:
				cl := "ip-cell on"
				if t == cur {
					cl = "ip-cell cur"
				}
				tip := fmt.Sprintf("%s · %s · %d şube · %d / %d", fc.Code, termShort(t, termLabels), c.sections, c.enr, c.cap)
				fmt.Fprintf(&g, `<td%s><span class="%s" title="%s"><span class="sr-only">%s</span></span></td>`, tdc, cl, esc(tip), esc(termShort(t, termLabels)))
			case missing[t]:
				fmt.Fprintf(&g, `<td%s><span class="ip-cell miss" title="%s · veri yok"></span></td>`, tdc, esc(termShort(t, termLabels)))
			default:
				fmt.Fprintf(&g, `<td%s><span class="ip-cell"></span></td>`, tdc)
			}
		}
		g.WriteString(`</tr>`)
	}
	g.WriteString(`</tbody></table></div>`)

	more := fmt.Sprintf("%d şubenin tam listesi", len(hi.Rows))
	if extra := len(freq) - len(rows); extra > 0 {
		more = fmt.Sprintf("%d ders daha ve %d şubenin tam listesi", extra, len(hi.Rows))
	}
	fmt.Fprintf(&g, `<details class="ip-records"><summary>%s</summary>`, esc(more))
	g.WriteString(`<div class="ip-records-scroll"><table class="ip-records-table"><caption class="sr-only">` + esc(b.l.InstrTableHead) + `</caption><thead><tr>` +
		`<th scope="col">` + esc(b.l.InstrColTerm) + `</th><th scope="col">` + esc(b.l.InstrColCourse) + `</th><th scope="col">` + esc(b.l.InstrColName) +
		`</th><th scope="col" class="ta-r">Yazılan / Kont</th></tr></thead><tbody>`)
	prev := ""
	for _, r := range hi.Rows {
		termCell, cls := "", ""
		if r.Term != prev {
			termCell = fmt.Sprintf(`<a href="/dersler/%s/">%s</a>`, esc(r.Term), esc(termShort(r.Term, termLabels)))
			if prev != "" {
				cls = ` class="is-ts"`
			}
			prev = r.Term
		}
		fmt.Fprintf(&g, `<tr%s><td class="ip-rec-term">%s</td><td class="ip-rec-code">%s</td><td class="ip-rec-name">%s</td><td class="num ta-r">%d / %d</td></tr>`,
			cls, termCell, codeLink(r.Code, "code"), esc(r.Name), r.Enr, r.Cap)
	}
	g.WriteString(`</tbody></table></div></details></div></section>`)
	return g.String()
}

// peersOf, bir dersi veren diğer hocalar (dönem sayısına göre).
func (b *Builder) peersOf(code, self string) []string {
	var out []string
	for slug := range b.courseInstrs[code] {
		if slug != self {
			out = append(out, slug)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		a, c := len(b.courseInstrs[code][out[i]]), len(b.courseInstrs[code][out[j]])
		if a != c {
			return a > c
		}
		return trCollateKey(b.instructorProfiles[out[i]].Name) < trCollateKey(b.instructorProfiles[out[j]].Name)
	})
	return out
}

// renderPeers, en sık verdiği üç dersi veren diğer hocaların kartları; bu
// dönem bu derslerden birini verenler önce.
func (b *Builder) renderPeers(slug string, freq []frequentCourse) string {
	const maxCourses, maxCards = 3, 9
	type peer struct {
		slug  string
		per   []string // "MAK 219 · 6 dönem"
		terms int
		now   bool
	}
	var codes []string
	byPeer := map[string]*peer{}
	for _, fc := range freq {
		if len(codes) == maxCourses {
			break
		}
		peers := b.peersOf(fc.Code, slug)
		if len(peers) == 0 {
			continue
		}
		codes = append(codes, fc.Code)
		for _, p := range peers {
			pp := byPeer[p]
			if pp == nil {
				pp = &peer{slug: p}
				byPeer[p] = pp
			}
			n := len(b.courseInstrs[fc.Code][p])
			unit := ""
			if len(pp.per) == 0 {
				unit = " dönem"
			}
			pp.per = append(pp.per, fmt.Sprintf("%s · %d%s", fc.Code, n, unit))
			pp.terms += n
			if b.courseInstrs[fc.Code][p][b.index.CurrentSlug] {
				pp.now = true
			}
		}
	}
	if len(byPeer) == 0 {
		return ""
	}
	list := make([]*peer, 0, len(byPeer))
	for _, p := range byPeer {
		list = append(list, p)
	}
	sort.Slice(list, func(i, j int) bool {
		if list[i].now != list[j].now {
			return list[i].now
		}
		if list[i].terms != list[j].terms {
			return list[i].terms > list[j].terms
		}
		return trCollateKey(b.instructorProfiles[list[i].slug].Name) < trCollateKey(b.instructorProfiles[list[j].slug].Name)
	})
	if len(list) > maxCards {
		list = list[:maxCards]
	}
	var c strings.Builder
	c.WriteString(`<section class="ip-blk" aria-labelledby="h-peer">`)
	fmt.Fprintf(&c, `<div class="ip-blk-h"><div><h2 id="h-peer">Bu dersleri veren diğer hocalar</h2><p class="ip-note">%s derslerini verenler; bu dönem verenler önce.</p></div></div>`,
		esc(joinTR(codes)))
	c.WriteString(`<ul class="ip-peers">`)
	for _, p := range list {
		name := b.instructorProfiles[p.slug].Name
		rating := ""
		if e := b.hmMatch[p.slug]; e != nil && e.Overall != nil {
			rating = fmt.Sprintf(`<span class="ip-peer-r num" title="Hocametre genel puanı">%s · %d oy</span>`, fmtScore(*e.Overall, b.l.Code), e.Votes)
		}
		badge := ""
		if p.now {
			badge = `<span class="ip-badge">bu dönem veriyor</span>`
		}
		fmt.Fprintf(&c, `<li><a class="ip-card ip-peer" href="/hoca/%s/"><span class="ip-peer-n"><span>%s</span>%s</span><span class="ip-peer-m num">%s</span>%s</a></li>`,
			p.slug, esc(name), rating, esc(strings.Join(p.per, "  ")), badge)
	}
	c.WriteString(`</ul></section>`)
	return c.String()
}

func joinTR(items []string) string {
	switch len(items) {
	case 0:
		return ""
	case 1:
		return items[0]
	}
	return strings.Join(items[:len(items)-1], ", ") + " ve " + items[len(items)-1]
}

// --- /hoca/ dizini ---

func (b *Builder) writeInstructorIndexPage() error {
	type entry struct {
		slug, name, key string
		branches        []string
		terms           int
		latest          string
	}
	var list []entry
	branchSet := map[string]bool{}
	for slug, hi := range b.instructorProfiles {
		e := entry{slug: slug, name: hi.Name, key: trCollateKey(hi.Name), branches: instructorBranches(hi.Rows), terms: hi.Terms}
		for _, r := range hi.Rows {
			if e.latest == "" || term.SortKey(r.Term) > term.SortKey(e.latest) {
				e.latest = r.Term
			}
		}
		for _, br := range e.branches {
			branchSet[br] = true
		}
		list = append(list, e)
	}
	sort.Slice(list, func(i, j int) bool {
		if list[i].key != list[j].key {
			return list[i].key < list[j].key
		}
		return list[i].slug < list[j].slug
	})

	letterOf := func(name string) string {
		for _, r := range name {
			s := string(r)
			if s == "i" {
				return "İ"
			}
			return strings.ToUpper(s)
		}
		return "#"
	}
	var groups []string
	byLetter := map[string][]entry{}
	for _, e := range list {
		l := letterOf(e.name)
		if _, ok := byLetter[l]; !ok {
			groups = append(groups, l)
		}
		byLetter[l] = append(byLetter[l], e)
	}
	anchor := func(l string) string {
		special := map[string]string{"Ç": "c2", "Ğ": "g2", "İ": "i2", "Ö": "o2", "Ş": "s2", "Ü": "u2"}
		if s, ok := special[l]; ok {
			return "harf-" + s
		}
		if s := courseSlug(l); s != "" {
			return "harf-" + s
		}
		return "harf-diger"
	}

	canonical := baseURL + "/hoca/"
	title := "İTÜ hocaları: verdikleri dersler ve not dağılımları"
	desc := fmt.Sprintf("İTÜ Ders Arşivi'nde ders kaydı bulunan %d öğretim üyesi. Ada veya branşa göre bul; her sayfada verdiği dersler, dönemler ve not dağılımı.", len(list))

	var c strings.Builder
	fmt.Fprintf(&c, `<nav class="crumb" aria-label="Breadcrumb"><a href="/">%s</a> › <span>Hocalar</span></nav>`, esc(b.l.CrumbHome))
	c.WriteString(`<header class="hx-head"><p class="ip-k">Dizin</p><h1>Hocalar</h1>`)
	fmt.Fprintf(&c, `<p class="lead">Arşivde ders kaydı bulunan <span class="num">%d</span> öğretim üyesi. Her sayfada bu dönemki şubeler, verdiği dersler, dönem haritası ve resmî not dağılımı var.</p></header>`, len(list))

	c.WriteString(`<div class="hx-tools" data-hx-tools hidden>`)
	c.WriteString(`<label class="hx-field hx-search"><span>Ad ara</span><input type="search" id="hx-q" autocomplete="off" spellcheck="false" placeholder="ör. yücel"></label>`)
	c.WriteString(`<label class="hx-field"><span>Branş</span><select id="hx-branch"><option value="">tümü</option>`)
	for _, br := range sortedKeys(func() map[string]struct{} {
		m := map[string]struct{}{}
		for k := range branchSet {
			m[k] = struct{}{}
		}
		return m
	}()) {
		fmt.Fprintf(&c, `<option value="%s">%s</option>`, esc(br), esc(br))
	}
	c.WriteString(`</select></label><p class="hx-count" id="hx-count" aria-live="polite"></p></div>`)

	c.WriteString(`<nav class="hx-az" aria-label="Harfe atla">`)
	for _, l := range groups {
		fmt.Fprintf(&c, `<a href="#%s">%s</a>`, anchor(l), esc(l))
	}
	c.WriteString(`</nav>`)

	for _, l := range groups {
		fmt.Fprintf(&c, `<section class="hx-group" id="%s" aria-labelledby="%s-b"><h2 id="%s-b" class="hx-letter">%s</h2><ul class="hx-list">`,
			anchor(l), anchor(l), anchor(l), esc(l))
		for _, e := range byLetter[l] {
			shown := e.branches
			more := ""
			if len(shown) > 3 {
				more = fmt.Sprintf(" +%d", len(shown)-3)
				shown = shown[:3]
			}
			meta := strings.Join(shown, " ") + more
			if meta != "" {
				meta += " · "
			}
			meta += strconv.Itoa(e.terms) + " dönem"
			fmt.Fprintf(&c, `<li data-k="%s" data-b="%s"><a href="/hoca/%s/">%s</a><span class="hx-meta">%s</span></li>`,
				esc(foldName(e.name)), esc(strings.Join(e.branches, " ")), e.slug, esc(e.name), esc(meta))
		}
		c.WriteString(`</ul></section>`)
	}
	c.WriteString(`<p class="hx-empty" id="hx-empty" hidden>Bu aramayla eşleşen hoca yok. Adın bir kısmını ya da başka bir branşı dene.</p>`)
	c.WriteString(`<p class="seo-data-note">Liste İTÜ ders programı kayıtlarından türetilir; resmî personel listesi değildir.</p>`)

	jsonld := jsonldScript([]any{
		map[string]any{
			"@context": "https://schema.org", "@type": "CollectionPage",
			"url": canonical, "name": title, "description": desc,
		},
		map[string]any{
			"@context": "https://schema.org", "@type": "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": b.l.CrumbHome, "item": baseURL + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": "Hocalar", "item": canonical},
			},
		},
	})
	return b.writePage(filepath.Join(b.outRoot, "hoca", "index.html"),
		title, desc, canonical, fmtDate(b.index.ScrapedAt), template.HTML(c.String()), jsonld, false)
}

// --- ders sayfası: hoca karşılaştırması ---

func (b *Builder) renderCourseInstructorCompare(code string, termLabels map[string]string) string {
	bySlug := b.courseInstrs[code]
	if len(bySlug) == 0 {
		return ""
	}
	type row struct {
		slug    string
		terms   int
		last    string
		counts  map[string]int
		total   int
		records int
	}
	var rows []row
	for slug, terms := range bySlug {
		r := row{slug: slug, terms: len(terms)}
		for t := range terms {
			if r.last == "" || term.SortKey(t) > term.SortKey(r.last) {
				r.last = t
			}
		}
		r.counts, r.total, r.records = b.soloGrades(code, terms, termLabels)
		rows = append(rows, r)
	}
	sort.Slice(rows, func(i, j int) bool {
		if rows[i].last != rows[j].last {
			return term.SortKey(rows[i].last) > term.SortKey(rows[j].last)
		}
		if rows[i].terms != rows[j].terms {
			return rows[i].terms > rows[j].terms
		}
		return rows[i].slug < rows[j].slug
	})
	overall, overallTotal, overallTerms := b.courseOverallGrades(code)

	head := `<thead><tr><th scope="col">Hoca</th><th scope="col" class="ta-r">Dönem</th><th scope="col">Son dönem</th>` +
		`<th scope="col">Not dağılımı <span class="cc-th-note">tek başına verdiği dönemler</span></th><th scope="col">Hocametre</th></tr></thead>`
	rowHTML := func(r row) string {
		var s strings.Builder
		name := b.instructorProfiles[r.slug].Name
		fmt.Fprintf(&s, `<tr><th scope="row" data-label="Hoca"><a href="/hoca/%s/">%s</a></th>`, r.slug, esc(name))
		fmt.Fprintf(&s, `<td class="num ta-r cc-terms" data-label="Dönem">%d</td>`, r.terms)
		fmt.Fprintf(&s, `<td data-label="Son dönem" class="cc-last"><a href="/dersler/%s/">%s</a></td>`, esc(r.last), esc(termShort(r.last, termLabels)))
		if r.total > 0 {
			fmt.Fprintf(&s, `<td data-label="Not dağılımı" class="cc-grades"><span class="cc-gwrap">%s<span class="ip-nn num">%s</span></span></td>`,
				splitBarHTML(r.counts, r.total, name), fmtCount(r.total))
		} else {
			s.WriteString(`<td data-label="Not dağılımı" class="cc-grades"><span class="ip-muted">tek başına dönemde not verisi yok</span></td>`)
		}
		if e := b.hmMatch[r.slug]; e != nil && e.Overall != nil {
			cls, few := "cc-hm", ""
			if e.Votes < hmFewVotes {
				cls += " is-few"
				few = ` · az oy`
			}
			fmt.Fprintf(&s, `<td data-label="Hocametre" class="%s"><span class="num cc-hm-v">%s</span> <span class="cc-hm-votes num">%d oy%s</span></td>`,
				cls, fmtScore(*e.Overall, b.l.Code), e.Votes, few)
		} else {
			s.WriteString(`<td data-label="Hocametre" class="cc-hm"><span class="ip-muted">·</span></td>`)
		}
		s.WriteString(`</tr>`)
		return s.String()
	}

	var out strings.Builder
	out.WriteString(`<section class="ip-blk cc" id="hocalar" aria-labelledby="hocalar-baslik">`)
	fmt.Fprintf(&out, `<div class="ip-blk-h"><div><h2 id="hocalar-baslik">Hoca karşılaştırması</h2><p class="ip-note">Not dağılımı yalnızca hocanın dersi o dönem tek başına verdiği kayıtlardan hesaplanır; geçmiş kayıtların özetidir, hoca değerlendirmesi değildir.</p></div><span class="ip-k num">%d hoca</span></div>`, len(rows))
	out.WriteString(`<div class="ip-card">`)
	if overallTotal > 0 {
		fmt.Fprintf(&out, `<div class="cc-ref"><span class="cc-ref-l">Tüm hocalar <span class="ip-muted">· %d dönem</span></span><span class="cc-gwrap">%s<span class="ip-nn num">%s</span></span></div>`,
			overallTerms, splitBarHTML(overall, overallTotal, "Tüm hocalar"), fmtCount(overallTotal))
	}
	const shown = 10
	out.WriteString(`<div class="cc-scroll"><table class="cc-table">` + head + `<tbody>`)
	for i, r := range rows {
		if i < shown {
			out.WriteString(rowHTML(r))
		}
	}
	out.WriteString(`</tbody></table></div>`)
	if len(rows) > shown {
		fmt.Fprintf(&out, `<details class="ip-records cc-more"><summary>%d hoca daha</summary><div class="cc-scroll"><table class="cc-table">%s<tbody>`, len(rows)-shown, head)
		for _, r := range rows[shown:] {
			out.WriteString(rowHTML(r))
		}
		out.WriteString(`</tbody></table></div></details>`)
	}
	out.WriteString(`<div class="cc-foot">` + splitLegendHTML(`<span class="num">sağda: not sayısı · hocametre 5 üzerinden, notkutusu</span>`) + `</div>`)
	out.WriteString(`</div></section>`)
	return out.String()
}
