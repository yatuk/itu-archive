package site

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// gradeFileRow, docs/data/grades/<branş>.json içindeki tek bir kayıt: bir
// ders kodunun tek bir dönemdeki resmî not dağılımı (OBS Not Dağılımı).
type gradeFileRow struct {
	Code   string         `json:"code"`
	Term   string         `json:"term"` // görünen etiket, ör. "2023-2024 Güz Dönemi"
	Donem  string         `json:"donem"`
	Total  int            `json:"total"`
	Grades map[string]int `json:"grades"`
}

// gradeLetterOrder, İTÜ not ölçeğinin en iyiden en kötüye sırası
// (bkz. assets-src/core/grades.js, tek kaynak orasıdır, burada yalnızca
// görüntüleme sırası için aynısı tutulur).
var gradeLetterOrder = []string{
	"AA", "BA+", "BA", "BB+", "BB", "CB+", "CB", "CC+", "CC",
	"DC+", "DC", "DD+", "DD", "FF", "VF",
}

// loadGradesIndex, docs/data/grades/*.json dosyalarının tamamını okuyup
// kod -> dönem etiketi -> not dağılımı haritasına indirger.
func (b *Builder) loadGradesIndex() error {
	b.gradesIndex = map[string]map[string]gradeFileRow{}
	dir := filepath.Join(b.root, "data", "grades")
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("data/grades okunamadı: %w", err)
	}
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") || e.Name() == "index.json" {
			continue // index.json bir manifesto (branş -> dönem sayısı), not dağılımı satırı değil
		}
		raw, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			return fmt.Errorf("data/grades/%s okunamadı: %w", e.Name(), err)
		}
		var rows []gradeFileRow
		if err := json.Unmarshal(raw, &rows); err != nil {
			return fmt.Errorf("data/grades/%s çözümlenemedi: %w", e.Name(), err)
		}
		for _, r := range rows {
			if r.Code == "" || r.Term == "" {
				continue
			}
			byTerm := b.gradesIndex[r.Code]
			if byTerm == nil {
				byTerm = map[string]gradeFileRow{}
				b.gradesIndex[r.Code] = byTerm
			}
			byTerm[r.Term] = r
		}
	}
	return nil
}

// instructorGradeProfile, bir hocanın TEK BAŞINA verdiği ders+dönem
// kayıtlarındaki resmî not dağılımlarını birleştirir. Aynı dersi aynı
// dönemde başka hoca(lar) da verdiyse (b.codeTermInstrCount[key] != 1) o
// kayıt, notları hangi hocaya ait olduğu belirsiz kalacağı için dahil
// edilmez.
type instructorGradeProfile struct {
	Counts         map[string]int
	Total          int
	Records        int // kaç farklı (kod, dönem) kaydı katkı verdi
	CandidatePairs int // hocanın arşivdeki benzersiz (kod, dönem) kaydı
	SharedExcluded int // aynı ders+dönemde birden fazla hoca olduğu için dışlanan
	MissingGrades  int // tek hocalı olsa da resmî not dağılımı bulunmayan
	Courses        []instructorGradeCourse
}

type instructorGradeCourse struct {
	Code    string
	Counts  map[string]int
	Total   int
	Records int
	Terms   []string
}

func (b *Builder) instructorGradeProfile(hi *histInstr, termLabels map[string]string) instructorGradeProfile {
	gp := instructorGradeProfile{Counts: map[string]int{}}
	seenPairs := map[string]bool{}
	byCourse := map[string]*instructorGradeCourse{}
	for _, row := range hi.Rows {
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
		course := byCourse[row.Code]
		if course == nil {
			course = &instructorGradeCourse{Code: row.Code, Counts: map[string]int{}}
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

// renderInstructorGrades, not dağılımı bölümünün HTML'ini üretir. Veri yoksa
// boş döner ki çağıran taraf bölümü tamamen atlayabilsin.
func renderInstructorGrades(l lang, gp instructorGradeProfile) string {
	if gp.Total == 0 {
		return ""
	}
	var bars strings.Builder
	for _, letter := range gradeLetterOrder {
		n := gp.Counts[letter]
		if n == 0 {
			continue
		}
		pct := n * 100 / gp.Total
		fillClass := "seo-grade-fill"
		if letter == "FF" || letter == "VF" {
			fillClass = "seo-grade-fill fail"
		}
		fmt.Fprintf(&bars,
			`<div class="seo-grade-row"><span class="seo-grade-label">%s</span>`+
				`<span class="seo-grade-track"><span class="%s" style="width:%d%%"></span></span>`+
				`<span class="seo-grade-pct">%%%d</span></div>`,
			template.HTMLEscapeString(letter), fillClass, pct, pct)
	}

	topPct := (gp.Counts["AA"] + gp.Counts["BA+"] + gp.Counts["BA"]) * 100 / gp.Total
	failPct := (gp.Counts["FF"] + gp.Counts["VF"]) * 100 / gp.Total
	summary := fmt.Sprintf(l.InstrGradesSummaryFmt, topPct, failPct, gp.Total)
	coverage := fmt.Sprintf(l.InstrGradesCoverageFmt, gp.Records, gp.CandidatePairs, len(gp.Courses), gp.SharedExcluded, gp.MissingGrades)

	var courseRows strings.Builder
	for _, course := range gp.Courses {
		courseTopPct := (course.Counts["AA"] + course.Counts["BA+"] + course.Counts["BA"]) * 100 / course.Total
		courseFailPct := (course.Counts["FF"] + course.Counts["VF"]) * 100 / course.Total
		fmt.Fprintf(&courseRows,
			`<tr><td><a href="/ders/%s/">%s</a></td><td>%s</td><td>%d</td><td>%%%d</td><td>%%%d</td></tr>`,
			courseSlug(course.Code), template.HTMLEscapeString(course.Code),
			template.HTMLEscapeString(strings.Join(course.Terms, ", ")), course.Total, courseTopPct, courseFailPct)
	}
	breakdown := `<details class="seo-grade-breakdown"><summary>` + template.HTMLEscapeString(l.InstrGradesDetails) + `</summary>` +
		`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>` + template.HTMLEscapeString(l.InstrColCourse) + `</th><th>` +
		template.HTMLEscapeString(l.InstrGradesColTerms) + `</th><th>` + template.HTMLEscapeString(l.InstrGradesColGrades) + `</th><th>AA/BA</th><th>FF/VF</th></tr></thead><tbody>` +
		courseRows.String() + `</tbody></table></div></details>`

	return `<h2>` + l.InstrGradesHead + `</h2>` +
		`<p class="seo-grade-context">` + template.HTMLEscapeString(l.InstrGradesHistorical) + `</p>` +
		`<div class="seo-grade-bars">` + bars.String() + `</div>` +
		`<p class="seo-grade-summary">` + template.HTMLEscapeString(summary) + `</p>` +
		`<p class="seo-grade-coverage">` + template.HTMLEscapeString(coverage) + `</p>` +
		breakdown +
		`<p class="seo-data-note">` + template.HTMLEscapeString(l.InstrGradesNote) + `</p>`
}

func renderCourseGrades(l lang, records map[string]gradeFileRow) string {
	rows := make([]gradeFileRow, 0, len(records))
	for _, record := range records {
		if record.Total > 0 {
			rows = append(rows, record)
		}
	}
	if len(rows) == 0 {
		return ""
	}
	sort.Slice(rows, func(i, j int) bool {
		if rows[i].Donem != rows[j].Donem {
			return rows[i].Donem > rows[j].Donem
		}
		return rows[i].Term > rows[j].Term
	})

	latest := rows[0]
	latestLabel := localizedGradeTerm(latest.Term, l.Code)
	latestTop, latestFail := gradeHeadlineRates(latest.Grades, latest.Total)
	var history strings.Builder
	for _, record := range rows {
		top, fail := gradeHeadlineRates(record.Grades, record.Total)
		fmt.Fprintf(&history,
			`<tr><td>%s</td><td>%d</td><td>%%%d</td><td>%%%d</td><td>%s</td></tr>`,
			template.HTMLEscapeString(localizedGradeTerm(record.Term, l.Code)), record.Total, top, fail,
			template.HTMLEscapeString(gradeMode(record.Grades)))
	}

	return `<h2>` + template.HTMLEscapeString(l.CourseGradesHead) + `</h2>` +
		`<p class="seo-grade-context">` + template.HTMLEscapeString(fmt.Sprintf(l.CourseGradesLatestFmt, latestLabel, latest.Total)) + `</p>` +
		`<div class="seo-grade-bars">` + gradeBarsHTML(latest.Grades, latest.Total) + `</div>` +
		`<p class="seo-grade-summary">` + template.HTMLEscapeString(fmt.Sprintf(l.CourseGradesSummaryFmt, latestTop, latestFail)) + `</p>` +
		`<details class="seo-grade-breakdown"><summary>` + template.HTMLEscapeString(fmt.Sprintf(l.CourseGradesHistoryFmt, len(rows))) + `</summary>` +
		`<div class="seo-tablewrap"><table class="seo-table"><thead><tr><th>` + template.HTMLEscapeString(l.CourseHistTerm) + `</th><th>` +
		template.HTMLEscapeString(l.CourseGradesColGrades) + `</th><th>AA/BA</th><th>FF/VF</th><th>` + template.HTMLEscapeString(l.CourseGradesColCommon) +
		`</th></tr></thead><tbody>` + history.String() + `</tbody></table></div></details>` +
		`<p class="seo-data-note">` + template.HTMLEscapeString(l.CourseGradesNote) + `</p>`
}

func gradeBarsHTML(counts map[string]int, total int) string {
	if total <= 0 {
		return ""
	}
	var bars strings.Builder
	for _, letter := range gradeLetterOrder {
		n := counts[letter]
		if n == 0 {
			continue
		}
		pct := n * 100 / total
		fillClass := "seo-grade-fill"
		if letter == "FF" || letter == "VF" {
			fillClass += " fail"
		}
		fmt.Fprintf(&bars, `<div class="seo-grade-row"><span class="seo-grade-label">%s</span><span class="seo-grade-track"><span class="%s" style="width:%d%%"></span></span><span class="seo-grade-pct">%%%d</span></div>`,
			template.HTMLEscapeString(letter), fillClass, pct, pct)
	}
	return bars.String()
}

func gradeHeadlineRates(counts map[string]int, total int) (int, int) {
	if total <= 0 {
		return 0, 0
	}
	return (counts["AA"] + counts["BA+"] + counts["BA"]) * 100 / total,
		(counts["FF"] + counts["VF"]) * 100 / total
}

func gradeMode(counts map[string]int) string {
	best, bestCount := "·", 0
	for _, letter := range gradeLetterOrder {
		if counts[letter] > bestCount {
			best, bestCount = letter, counts[letter]
		}
	}
	return best
}

func localizedGradeTerm(label, langCode string) string {
	if langCode != "en" {
		return label
	}
	return strings.NewReplacer(
		" Güz Dönemi", " Fall Term",
		" Bahar Dönemi", " Spring Term",
		" Yaz Dönemi", " Summer Term",
	).Replace(label)
}
