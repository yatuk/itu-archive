package site

import (
	"fmt"
	"html/template"
	"math"
	"sort"
	"strings"
)

// instructorGradeProfile, bir hocanın TEK BAŞINA verdiği ders+dönem
// kayıtlarındaki resmî not dağılımlarını birleştirir. Aynı dersi aynı
// dönemde başka hoca(lar) da verdiyse (b.codeTermInstrCount[key] != 1) o
// kayıt, notları hangi hocaya ait olduğu belirsiz kalacağı için dahil
// edilmez.
type instructorGradeProfile struct {
	Counts         map[string]int
	Total          int
	Records        int // kaç farklı (kod, dönem) kaydı katkı verdi
	CandidatePairs int // hocanın arşivdeki benzersiz (kod, dönem) kaydı (TR/E eşi tek sayılır)
	SharedExcluded int // aynı ders+dönemde birden fazla hoca olduğu için dışlanan
	MissingGrades  int // tek hocalı olsa da resmî not dağılımı bulunmayan
	Courses        []instructorGradeCourse
	// Compare, hocanın en çok verdiği (iki tarafta da not verisi olan) dersin
	// diğer hocaların tek başına verdiği dönemlerle karşılaştırması. Yoksa nil.
	Compare *gradeCompare
}

type instructorGradeCourse struct {
	Code    string
	Alt     string // TR/E eşi aynı dağılımı paylaşıyorsa ör. "MAK 4901E"
	Name    string
	Counts  map[string]int
	Total   int
	Records int
	Terms   []string
}

// label: "MAK 4901" ya da eşiyle birlikte "MAK 4901 / 4901E".
func (c instructorGradeCourse) label() string {
	if c.Alt == "" {
		return c.Code
	}
	alt := c.Alt
	if i := strings.IndexByte(alt, ' '); i > 0 && strings.HasPrefix(c.Code, alt[:i+1]) {
		alt = alt[i+1:]
	}
	return c.Code + " / " + alt
}

type gradeCompare struct {
	Code, Name             string
	Self                   map[string]int
	SelfTotal              int
	Other                  map[string]int
	OtherTotal, OtherCount int // OtherCount: katkı veren diğer hoca sayısı
}

// baseCode, İngilizce "E" ekini atar: "MAK 4901E" -> "MAK 4901".
func baseCode(code string) string {
	if strings.HasSuffix(code, "E") {
		return strings.TrimSuffix(code, "E")
	}
	return code
}

// gradeFingerprint, dağılımı karşılaştırılabilir bir anahtara indirger.
func gradeFingerprint(total int, grades map[string]int) string {
	keys := make([]string, 0, len(grades))
	for k := range grades {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	var b strings.Builder
	fmt.Fprintf(&b, "%d", total)
	for _, k := range keys {
		fmt.Fprintf(&b, "|%s=%d", k, grades[k])
	}
	return b.String()
}

func (b *Builder) instructorGradeProfile(hi *histInstr, termLabels map[string]string) instructorGradeProfile {
	gp := instructorGradeProfile{Counts: map[string]int{}}
	names := map[string]string{}
	for _, row := range hi.Rows {
		if names[row.Code] == "" && row.Name != "" {
			names[row.Code] = row.Name
		}
	}
	// Deterministik sıra: TR kodu (E'siz) E'li eşinden önce gelsin ki eş
	// kaydı her zaman TR satırına katlansın.
	rows := append([]instrRow(nil), hi.Rows...)
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Term != rows[j].Term {
			return rows[i].Term < rows[j].Term
		}
		return rows[i].Code < rows[j].Code
	})
	seenPairs := map[string]bool{}
	byCourse := map[string]*instructorGradeCourse{}
	// OBS, TR ve İngilizce (E) eş kodlara aynı dönemde aynı dağılımı yazabiliyor
	// (birleşik sınıf). Aynı (taban kod, dönem, dağılım) ikinci kez sayılmaz.
	dupOwner := map[string]string{} // taban\x00dönem\x00parmakizi -> sahibi olan kod
	for _, row := range rows {
		key := row.Code + "\x00" + row.Term
		if seenPairs[key] {
			continue
		}
		seenPairs[key] = true
		gp.CandidatePairs++
		if b.codeTermInstrCount[key] != 1 {
			gp.SharedExcluded++
			continue
		}
		label := termLabels[row.Term]
		if label == "" {
			gp.MissingGrades++
			continue
		}
		rec, ok := b.gradesIndex[row.Code][label]
		if !ok || rec.Total == 0 {
			gp.MissingGrades++
			continue
		}
		dk := baseCode(row.Code) + "\x00" + row.Term + "\x00" + gradeFingerprint(rec.Total, rec.Grades)
		if owner, dup := dupOwner[dk]; dup && owner != row.Code {
			gp.CandidatePairs-- // eş kayıt: tek bir ders-dönem
			if c := byCourse[owner]; c != nil && c.Alt == "" {
				c.Alt = row.Code
			}
			continue
		}
		dupOwner[dk] = row.Code
		course := byCourse[row.Code]
		if course == nil {
			course = &instructorGradeCourse{Code: row.Code, Name: names[row.Code], Counts: map[string]int{}}
			byCourse[row.Code] = course
		}
		for letter, n := range rec.Grades {
			gp.Counts[letter] += n
			course.Counts[letter] += n
		}
		gp.Total += rec.Total
		gp.Records++
		course.Total += rec.Total
		course.Records++
		course.Terms = append(course.Terms, label)
	}
	for _, course := range byCourse {
		sort.Sort(sort.Reverse(sort.StringSlice(course.Terms)))
		gp.Courses = append(gp.Courses, *course)
	}
	sort.Slice(gp.Courses, func(i, j int) bool {
		if gp.Courses[i].Total != gp.Courses[j].Total {
			return gp.Courses[i].Total > gp.Courses[j].Total
		}
		return gp.Courses[i].Code < gp.Courses[j].Code
	})
	return gp
}

// courseOverallGrades, bir dersin arşivdeki tüm dönemlerinin (tüm hocalar)
// not dağılımını toplar.
func (b *Builder) courseOverallGrades(code string) (map[string]int, int, int) {
	counts := map[string]int{}
	total, terms := 0, 0
	for _, rec := range b.gradesIndex[code] {
		if rec.Total <= 0 {
			continue
		}
		terms++
		total += rec.Total
		for letter, n := range rec.Grades {
			counts[letter] += n
		}
	}
	return counts, total, terms
}

// soloGrades, bir hocanın bir dersi tek başına verdiği dönemlerin toplamı.
func (b *Builder) soloGrades(code string, terms map[string]bool, termLabels map[string]string) (map[string]int, int, int) {
	counts := map[string]int{}
	total, records := 0, 0
	for t := range terms {
		if b.codeTermInstrCount[code+"\x00"+t] != 1 {
			continue
		}
		rec, ok := b.gradesIndex[code][termLabels[t]]
		if !ok || rec.Total == 0 {
			continue
		}
		for l, n := range rec.Grades {
			counts[l] += n
		}
		total += rec.Total
		records++
	}
	return counts, total, records
}

// pairedCompare, hocanın en çok dönem verdiği ve iki tarafta da not verisi
// olan dersi seçer: bu hocanın tek başına dönemleri vs diğer hocaların tek
// başına dönemleri.
func (b *Builder) pairedCompare(slug string, hi *histInstr, termLabels map[string]string) *gradeCompare {
	for _, fc := range frequentCourses(hi.Rows, 0) {
		self, selfTotal, _ := b.soloGrades(fc.Code, b.courseInstrs[fc.Code][slug], termLabels)
		if selfTotal == 0 {
			continue
		}
		other := map[string]int{}
		otherTotal, otherCount := 0, 0
		for peer, terms := range b.courseInstrs[fc.Code] {
			if peer == slug {
				continue
			}
			c, t, _ := b.soloGrades(fc.Code, terms, termLabels)
			if t == 0 {
				continue
			}
			otherCount++
			otherTotal += t
			for l, n := range c {
				other[l] += n
			}
		}
		if otherTotal == 0 {
			continue
		}
		return &gradeCompare{Code: fc.Code, Name: fc.Name, Self: self, SelfTotal: selfTotal, Other: other, OtherTotal: otherTotal, OtherCount: otherCount}
	}
	return nil
}

// histLetters, sütun grafiklerinde gösterilebilecek harfler (sıralı).
var histLetters = append(append([]string{}, gradeLetterOrder...), "BL", "BZ")

func pctOf(n, total int) float64 {
	if total <= 0 {
		return 0
	}
	return float64(n) / float64(total)
}

func pctLabel(frac float64) string {
	if frac <= 0 {
		return "0"
	}
	p := frac * 100
	if p < 1 {
		return "<1"
	}
	return fmt.Sprintf("%d", int(math.Round(p)))
}

func fmtCount(n int) string {
	s := fmt.Sprintf("%d", n)
	if n < 10000 {
		return s
	}
	var out []byte
	for i, c := range []byte(s) {
		if i > 0 && (len(s)-i)%3 == 0 {
			out = append(out, '.')
		}
		out = append(out, c)
	}
	return string(out)
}

// histTone: AA..BB vurgu, FF/VF amber, arası nötr. Kırmızı kullanılmaz.
func histTone(letter string) string {
	switch letter {
	case "AA", "BA+", "BA", "BB+", "BB":
		return "t-hi"
	case "FF", "VF":
		return "t-lo"
	}
	return "t-mid"
}

func topLowRates(counts map[string]int, total int) (float64, float64) {
	return pctOf(counts["AA"]+counts["BA+"]+counts["BA"], total), pctOf(counts["FF"]+counts["VF"], total)
}

// splitBarHTML, üç parçalı çubuk: AA/BA · diğer · FF/VF.
func splitBarHTML(counts map[string]int, total int, who string) string {
	top, low := topLowRates(counts, total)
	mid := math.Max(0, 1-top-low)
	return fmt.Sprintf(`<span class="ip-split" role="img" aria-label="%s: AA ya da BA %%%s, FF ya da VF %%%s, %d not">`+
		`<i class="s-top" style="width:%.1f%%"></i><i class="s-mid" style="width:%.1f%%"></i><i class="s-low" style="width:%.1f%%"></i></span>`,
		template.HTMLEscapeString(who), pctLabel(top), pctLabel(low), total, top*100, mid*100, low*100)
}

func splitLegendHTML(extra string) string {
	return `<p class="ip-legend"><span><i class="ip-sw s-top"></i>AA, BA</span><span><i class="ip-sw s-mid"></i>diğer</span><span><i class="ip-sw s-low"></i>FF, VF</span>` + extra + `</p>`
}

// renderInstructorGrades, not dağılımı bölümünün HTML'ini üretir. Veri yoksa
// boş döner ki çağıran taraf bölümü tamamen atlayabilsin.
func renderInstructorGrades(l lang, gp instructorGradeProfile) string {
	if gp.Total == 0 {
		return ""
	}
	esc := template.HTMLEscapeString
	var out strings.Builder
	out.WriteString(`<section class="ip-blk" aria-labelledby="h-not">`)
	fmt.Fprintf(&out, `<div class="ip-blk-h"><div><h2 id="h-not">%s</h2><p class="ip-note">Yalnızca tek başına verdiği ders-dönemlerin resmî OBS dağılımı. %s</p></div>`+
		`<span class="ip-k num">%s not · %d ders-dönem</span></div>`,
		esc(l.InstrGradesHead), esc(l.InstrGradesHistorical), fmtCount(gp.Total), gp.Records)
	out.WriteString(`<div class="ip-g2">`)

	// --- tüm dersler: harf sütunları
	type col struct {
		letter string
		v      float64
	}
	var cols []col
	maxv := 0.0
	for _, letter := range histLetters {
		if (letter == "BL" || letter == "BZ") && gp.Counts[letter] == 0 {
			continue
		}
		v := pctOf(gp.Counts[letter], gp.Total)
		cols = append(cols, col{letter, v})
		maxv = math.Max(maxv, v)
	}
	if maxv == 0 {
		maxv = 1
	}
	var bars, lbls, sr strings.Builder
	for _, c := range cols {
		val := ""
		if c.v > 0 {
			val = "%" + pctLabel(c.v)
		}
		fmt.Fprintf(&bars, `<div class="ip-col" title="%s: %%%s"><span class="ip-v num">%s</span><span class="ip-bar %s" style="height:%.1f%%"></span></div>`,
			c.letter, pctLabel(c.v), val, histTone(c.letter), c.v/maxv*100)
		fmt.Fprintf(&lbls, `<span>%s</span>`, c.letter)
		fmt.Fprintf(&sr, `<tr><th scope="row">%s</th><td>%%%s</td></tr>`, c.letter, pctLabel(c.v))
	}
	top, low := topLowRates(gp.Counts, gp.Total)
	out.WriteString(`<div class="ip-card ip-pad"><p class="ip-k">Tüm dersler</p>`)
	fmt.Fprintf(&out, `<div class="ip-hist" style="--cols:%d" aria-hidden="true">%s</div><div class="ip-lbls num" style="--cols:%d" aria-hidden="true">%s</div>`,
		len(cols), bars.String(), len(cols), lbls.String())
	fmt.Fprintf(&out, `<table class="sr-only"><caption>Tüm derslerde harf notu oranları</caption><tbody>%s</tbody></table>`, sr.String())
	fmt.Fprintf(&out, `<div class="ip-sum seo-grade-summary"><div><p class="ip-big num">%%%s</p><p class="ip-note">AA ya da BA</p></div>`+
		`<div><p class="ip-big num">%%%s</p><p class="ip-note">FF ya da VF</p></div></div>`, pctLabel(top), pctLabel(low))
	out.WriteString(`</div>`)

	// --- ders bazında
	out.WriteString(`<div class="ip-card ip-pad"><p class="ip-k">Ders bazında</p>`)
	writeCourse := func(c instructorGradeCourse) {
		fmt.Fprintf(&out, `<li class="ip-crs-r"><a class="code" href="/ders/%s/" translate="no">%s</a><span class="ip-nm">%s</span>%s<span class="ip-nn num">%s</span></li>`,
			courseSlug(c.Code), esc(c.label()), esc(c.Name), splitBarHTML(c.Counts, c.Total, c.label()), fmtCount(c.Total))
	}
	const shown = 7
	out.WriteString(`<ul class="ip-crs">`)
	for i, c := range gp.Courses {
		if i < shown {
			writeCourse(c)
		}
	}
	out.WriteString(`</ul>`)
	if len(gp.Courses) > shown {
		fmt.Fprintf(&out, `<details class="ip-more-crs"><summary>%d ders daha</summary><ul class="ip-crs">`, len(gp.Courses)-shown)
		for _, c := range gp.Courses[shown:] {
			writeCourse(c)
		}
		out.WriteString(`</ul></details>`)
	}
	out.WriteString(splitLegendHTML(`<span class="num">sağda: not sayısı</span>`))
	out.WriteString(`</div></div>`) // card, g2

	// --- karşılaştırma
	if cmp := gp.Compare; cmp != nil {
		var pairs, plbls, psr strings.Builder
		var keep []string
		pmax := 0.0
		for _, letter := range histLetters {
			a, o := pctOf(cmp.Self[letter], cmp.SelfTotal), pctOf(cmp.Other[letter], cmp.OtherTotal)
			if (letter == "BL" || letter == "BZ") && a == 0 && o == 0 {
				continue
			}
			keep = append(keep, letter)
			pmax = math.Max(pmax, math.Max(a, o))
		}
		if pmax == 0 {
			pmax = 1
		}
		for _, letter := range keep {
			a, o := pctOf(cmp.Self[letter], cmp.SelfTotal), pctOf(cmp.Other[letter], cmp.OtherTotal)
			fmt.Fprintf(&pairs, `<div class="ip-pair" title="%s: bu hoca %%%s · diğer hocalar %%%s"><span class="ip-bar t-self" style="height:%.1f%%"></span><span class="ip-bar t-other" style="height:%.1f%%"></span></div>`,
				letter, pctLabel(a), pctLabel(o), a/pmax*100, o/pmax*100)
			fmt.Fprintf(&plbls, `<span>%s</span>`, letter)
			fmt.Fprintf(&psr, `<tr><th scope="row">%s</th><td>%%%s</td><td>%%%s</td></tr>`, letter, pctLabel(a), pctLabel(o))
		}
		sTop, sLow := topLowRates(cmp.Self, cmp.SelfTotal)
		oTop, oLow := topLowRates(cmp.Other, cmp.OtherTotal)
		others := "diğer hocalar"
		if cmp.OtherCount == 1 {
			others = "diğer hoca"
		}
		out.WriteString(`<div class="ip-card ip-pad ip-cmp">`)
		fmt.Fprintf(&out, `<div class="ip-cmp-h"><div><p class="ip-k">Karşılaştırma · <span translate="no">%s</span> %s</p><p class="ip-note">Aynı dersin, başka hocaların tek başına verdiği dönemleriyle yan yana.</p></div>`,
			esc(cmp.Code), esc(cmp.Name))
		fmt.Fprintf(&out, `<p class="ip-legend"><span><i class="ip-sw t-self"></i>bu hoca · <span class="num">%s not</span></span><span><i class="ip-sw t-other"></i>%d %s · <span class="num">%s not</span></span></p></div>`,
			fmtCount(cmp.SelfTotal), cmp.OtherCount, others, fmtCount(cmp.OtherTotal))
		fmt.Fprintf(&out, `<div class="ip-pairs" style="--cols:%d" aria-hidden="true">%s</div><div class="ip-lbls num" style="--cols:%d" aria-hidden="true">%s</div>`,
			len(keep), pairs.String(), len(keep), plbls.String())
		fmt.Fprintf(&out, `<table class="sr-only"><caption>%s karşılaştırması</caption><thead><tr><th scope="col">Not</th><th scope="col">Bu hoca</th><th scope="col">Diğer hocalar</th></tr></thead><tbody>%s</tbody></table>`,
			esc(cmp.Code), psr.String())
		fmt.Fprintf(&out, `<div class="ip-sum"><div><p class="ip-big ip-big-s num">%%%s <small>/ %%%s</small></p><p class="ip-note">AA ya da BA · bu hoca / diğerleri</p></div>`+
			`<div><p class="ip-big ip-big-s num">%%%s <small>/ %%%s</small></p><p class="ip-note">FF ya da VF · bu hoca / diğerleri</p></div></div>`,
			pctLabel(sTop), pctLabel(oTop), pctLabel(sLow), pctLabel(oLow))
		out.WriteString(`</div>`)
	}

	// --- kapsam
	coverage := fmt.Sprintf(l.InstrGradesCoverageFmt, gp.Records, gp.CandidatePairs, len(gp.Courses), gp.SharedExcluded, gp.MissingGrades)
	var courseRows strings.Builder
	for _, course := range gp.Courses {
		t, f := topLowRates(course.Counts, course.Total)
		fmt.Fprintf(&courseRows,
			`<tr><td><a href="/ders/%s/"><span class="code" translate="no">%s</span></a></td><td class="ip-terms">%s</td><td class="num">%d</td><td class="num">%%%s</td><td class="num">%%%s</td></tr>`,
			courseSlug(course.Code), esc(course.label()),
			esc(strings.Join(course.Terms, ", ")), course.Total, pctLabel(t), pctLabel(f))
	}
	out.WriteString(`<details class="seo-grade-breakdown ip-coverage"><summary>` + esc(l.InstrGradesDetails) + `</summary>`)
	fmt.Fprintf(&out, `<p class="seo-grade-coverage">%s</p>`, esc(coverage))
	out.WriteString(`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>` + esc(l.InstrColCourse) + `</th><th>` +
		esc(l.InstrGradesColTerms) + `</th><th>` + esc(l.InstrGradesColGrades) + `</th><th>AA/BA</th><th>FF/VF</th></tr></thead><tbody>` +
		courseRows.String() + `</tbody></table></div>`)
	fmt.Fprintf(&out, `<p class="ip-fine">%s</p></details>`, esc(l.InstrGradesNote))
	out.WriteString(`</section>`)
	return out.String()
}
