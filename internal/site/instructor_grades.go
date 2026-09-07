package site

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"strings"
)

// gradeFileRow, docs/data/grades/<branş>.json içindeki tek bir kayıt: bir
// ders kodunun tek bir dönemdeki resmî not dağılımı (OBS Not Dağılımı).
type gradeFileRow struct {
	Code   string         `json:"code"`
	Term   string         `json:"term"` // görünen etiket, ör. "2023-2024 Güz Dönemi"
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
	Counts  map[string]int
	Total   int
	Records int // kaç farklı (kod, dönem) kaydı katkı verdi
}

func (b *Builder) instructorGradeProfile(hi *histInstr, termLabels map[string]string) instructorGradeProfile {
	gp := instructorGradeProfile{Counts: map[string]int{}}
	seenPairs := map[string]bool{}
	for _, row := range hi.Rows {
		key := row.Code + "\x00" + row.Term
		if seenPairs[key] {
			continue
		}
		seenPairs[key] = true
		if b.codeTermInstrCount[key] != 1 {
			continue
		}
		label := termLabels[row.Term]
		if label == "" {
			continue
		}
		rec, ok := b.gradesIndex[row.Code][label]
		if !ok || rec.Total == 0 {
			continue
		}
		for letter, n := range rec.Grades {
			gp.Counts[letter] += n
		}
		gp.Total += rec.Total
		gp.Records++
	}
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

	return `<h2>` + l.InstrGradesHead + `</h2>` +
		`<div class="seo-grade-bars">` + bars.String() + `</div>` +
		`<p class="seo-grade-summary">` + template.HTMLEscapeString(summary) + `</p>` +
		`<p class="seo-data-note">` + template.HTMLEscapeString(l.InstrGradesNote) + `</p>`
}
