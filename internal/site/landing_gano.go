package site

import (
	"fmt"
	"html/template"
	"math"
	"strconv"
	"strings"
)

// /gano-hesaplama/ (ve /en/gpa-calculator/) sayfasının gövdesi: sayfanın
// içinde çalışan bir YANO/GANO hesaplayıcısı. HTML burada sunucu tarafında
// tam olarak üretilir (örnek dönem, sonuç sayıları ve not tablosu gerçek
// metin olarak taranabilir); assets-src/landing/gano-calc.js aynı işaretlemeyi
// etkileşimli yapar ve not katsayılarını assets-src/core/grades.js'ten alır.
// Stiller assets-src/landing/gano-calc.css içindedir; bütün sınıflar lpg-
// önekini taşır ve yalnız uygulamanın CSS değişkenlerini kullanır.

// ganoGrade, İTÜ harf notu ve katsayısı.
type ganoGrade struct {
	Letter string
	Points float64
}

// ganoGradeScale, assets-src/core/grades.js GRADE_POINTS ölçeğinin Go
// karşılığıdır (aynı sıra, aynı değerler). Tek kaynak grades.js'tir;
// TestGanoGradeScaleMatchesGradesJS ikisinin ayrışmasını yakalar.
var ganoGradeScale = []ganoGrade{
	{"AA", 4.00}, {"BA+", 3.75}, {"BA", 3.50}, {"BB+", 3.25}, {"BB", 3.00},
	{"CB+", 2.75}, {"CB", 2.50}, {"CC+", 2.25}, {"CC", 2.00},
	{"DC+", 1.75}, {"DC", 1.50}, {"DD+", 1.25}, {"DD", 1.00},
	{"FF", 0}, {"VF", 0},
}

func ganoPoints(letter string) (float64, bool) {
	for _, g := range ganoGradeScale {
		if g.Letter == letter {
			return g.Points, true
		}
	}
	return 0, false
}

// ganoRow, hesaplayıcıdaki bir ders satırı.
type ganoRow struct {
	Code    string
	Credits float64
	Grade   string
}

// ganoExampleRows, sayfa açıldığında dolu gelen ve "örnek" diye işaretlenen dönem.
var ganoExampleRows = []ganoRow{
	{"MAT 103E", 4, "BA"},
	{"FIZ 101E", 3, "BB+"},
	{"KIM 101E", 3, "CB"},
	{"TUR 101", 2, "AA"},
	{"ING 101", 3, "BA"},
}

// ganoTerm, satırların toplam puanını (Σ kredi × katsayı) ve kredisini verir.
// FF ve VF 0 puanla kredisiyle birlikte paydaya girer; kredisi 0 veya notu
// tanınmayan satır sayılmaz (gano-calc.js ile aynı kural).
func ganoTerm(rows []ganoRow) (points, credits float64) {
	for _, r := range rows {
		p, ok := ganoPoints(r.Grade)
		if !ok || !(r.Credits > 0) {
			continue
		}
		points += p * r.Credits
		credits += r.Credits
	}
	return points, credits
}

// ganoCombine, önceki GANO ve tamamlanan krediyle bu dönemi birleştirir.
// Önceki değerler geçersizse yalnız bu dönemin ortalaması döner.
func ganoCombine(points, credits, prevGPA, prevCredits float64) float64 {
	if prevGPA >= 0 && prevGPA <= 4 && prevCredits > 0 {
		return (prevGPA*prevCredits + points) / (prevCredits + credits)
	}
	if credits == 0 {
		return 0
	}
	return points / credits
}

// ganoFmt2, ortalamayı iki ondalıkla yazar (JS toFixed(2) ile aynı).
func ganoFmt2(v float64) string { return strconv.FormatFloat(v, 'f', 2, 64) }

// ganoFmtNum, puan/kredi gibi değerleri en çok iki ondalıkla, gereksiz sıfır
// olmadan yazar: 14, 9.75, 49.75.
func ganoFmtNum(v float64) string {
	return strconv.FormatFloat(math.Round(v*100)/100, 'f', -1, 64)
}

// ganoStrings, sayfanın TR/EN metinleri.
type ganoStrings struct {
	Section, Caption, Example, Course, Credits, Grade, Points, Remove string
	PhCourse, PhCredits, AddRow, ClearExample                         string
	PrevGPA, PrevCredits, PrevGPAPh, PrevCreditsPh, PrevHint          string
	TermLabel, NewLabel, PtsWord, CrWord, NoPrev, Note                string
	ExampleNote, GradesHead, AfterText, TranscriptLink                string
	RemoveRow, CourseN                                                string
}

var ganoTR = ganoStrings{
	Section: "GANO hesaplayıcı", Caption: "Dönem dersleri, kredileri ve harf notları",
	Example: "örnek", Course: "Ders", Credits: "Kredi", Grade: "Harf", Points: "Puan", Remove: "Sil",
	PhCourse: "ders kodu", PhCredits: "kr", AddRow: "Ders ekle", ClearExample: "Örneği temizle",
	PrevGPA: "Önceki GANO", PrevCredits: "Tamamlanan kredi", PrevGPAPh: "ör. 2.85", PrevCreditsPh: "ör. 30",
	PrevHint:  "İsteğe bağlı. Boş bırakırsan yeni GANO yalnız bu dönemden hesaplanır.",
	TermLabel: "Dönem ortalaması (YANO)", NewLabel: "Yeni GANO", PtsWord: "puan", CrWord: "kredi",
	NoPrev: "önceki GANO girilmedi; yalnız bu dönem",
	Note:   "FF ve VF 0 puanla kredisiyle birlikte ortalamaya katılır. Resmî GANO için OBS'e bak.",
	ExampleNote: "Örnek dönem: %s. Kendi derslerini yazınca sonuç anında değişir.",
	GradesHead:  "Harf notu katsayıları",
	AfterText:   "Transkriptini yapıştır veya PDF'ini yükle; dersler müfredatınla eşleşir, tekrar alınanlar ayrı gösterilir. Dosya yalnızca tarayıcında okunur.",
	TranscriptLink: "Transkriptinle hesapla: Müfredat ve GPA sekmesi",
	RemoveRow:      "Satırı sil", CourseN: "Harf notu",
}

var ganoEN = ganoStrings{
	Section: "GPA calculator", Caption: "Term courses, credits and letter grades",
	Example: "example", Course: "Course", Credits: "Credits", Grade: "Grade", Points: "Points", Remove: "Remove",
	PhCourse: "course code", PhCredits: "cr", AddRow: "Add course", ClearExample: "Clear example",
	PrevGPA: "Previous CGPA", PrevCredits: "Completed credits", PrevGPAPh: "e.g. 2.85", PrevCreditsPh: "e.g. 30",
	PrevHint:  "Optional. Leave empty to calculate the new CGPA from this term only.",
	TermLabel: "Term GPA", NewLabel: "New CGPA", PtsWord: "points", CrWord: "credits",
	NoPrev: "no previous CGPA entered; this term only",
	Note:   "FF and VF count as 0 points and their credits stay in the average. Check OBS for your official CGPA.",
	ExampleNote: "Example term: %s. Type your own courses and the result updates instantly.",
	GradesHead:  "Letter grade coefficients",
	AfterText:   "Paste your transcript or upload its PDF; courses are matched to your curriculum and repeated courses are shown separately. The file is read only in your browser.",
	TranscriptLink: "Calculate from your transcript: Curriculum and GPA tab",
	RemoveRow:      "Remove row", CourseN: "Letter grade",
}

const ganoArrowSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

// ganoCalcHTML, hesaplayıcı bölümünün tamamını üretir. jsV/cssV,
// landing/gano-calc.js ve landing/gano-calc.css dosyalarının ?v= sürümleridir.
func ganoCalcHTML(en bool, jsV, cssV string) string {
	s := ganoTR
	if en {
		s = ganoEN
	}
	esc := template.HTMLEscapeString
	var w strings.Builder

	points, credits := ganoTerm(ganoExampleRows)
	yano := ganoCombine(points, credits, -1, 0)

	fmt.Fprintf(&w, `<link rel="stylesheet" href="/assets/landing/gano-calc.css?v=%s">`, esc(cssV))
	fmt.Fprintf(&w, `<section class="lpg" aria-label="%s">`, esc(s.Section))
	fmt.Fprintf(&w, `<form class="lpg-calc" id="lpg-form" novalidate data-pts="%s" data-cr="%s" data-noprev="%s" data-course="%s" data-credits="%s" data-grade="%s" data-remove="%s" data-ph-course="%s" data-ph-cr="%s">`,
		esc(s.PtsWord), esc(s.CrWord), esc(s.NoPrev), esc(s.Course), esc(s.Credits), esc(s.CourseN), esc(s.RemoveRow), esc(s.PhCourse), esc(s.PhCredits))

	// --- girdi kutusu
	w.WriteString(`<div class="lpg-box lpg-input"><div class="lpg-tbl-wrap"><table class="lpg-tbl">`)
	fmt.Fprintf(&w, `<caption class="sr-only">%s</caption>`, esc(s.Caption))
	fmt.Fprintf(&w, `<thead><tr><th scope="col" class="lpg-c-nm">%s <span class="lpg-ex" id="lpg-ex">%s</span></th><th scope="col" class="lpg-c-cr">%s</th><th scope="col" class="lpg-c-gr">%s</th><th scope="col" class="lpg-c-pt">%s</th><th scope="col" class="lpg-c-rm"><span class="sr-only">%s</span></th></tr></thead>`,
		esc(s.Course), esc(s.Example), esc(s.Credits), esc(s.Grade), esc(s.Points), esc(s.Remove))
	w.WriteString(`<tbody id="lpg-rows">`)
	for i, r := range ganoExampleRows {
		writeGanoRow(&w, s, i+1, r)
	}
	w.WriteString(`</tbody></table></div>`)

	var ex []string
	for _, r := range ganoExampleRows {
		ex = append(ex, fmt.Sprintf("%s %s %s %s", r.Code, ganoFmtNum(r.Credits), s.CrWord, r.Grade))
	}
	fmt.Fprintf(&w, `<p class="lpg-ex-note" id="lpg-ex-note">%s</p>`, esc(fmt.Sprintf(s.ExampleNote, strings.Join(ex, ", "))))

	fmt.Fprintf(&w, `<div class="lpg-foot"><button type="button" class="lpg-btn" id="lpg-add"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>%s</button><button type="button" class="lpg-btn lpg-btn-link" id="lpg-clear">%s</button></div>`,
		esc(s.AddRow), esc(s.ClearExample))
	fmt.Fprintf(&w, `<div class="lpg-prev"><label for="lpg-prev-g">%s</label><label for="lpg-prev-c">%s</label><input id="lpg-prev-g" class="lpg-in lpg-num" inputmode="decimal" placeholder="%s" autocomplete="off"><input id="lpg-prev-c" class="lpg-in lpg-num" inputmode="numeric" placeholder="%s" autocomplete="off"><p class="lpg-hint">%s</p></div>`,
		esc(s.PrevGPA), esc(s.PrevCredits), esc(s.PrevGPAPh), esc(s.PrevCreditsPh), esc(s.PrevHint))
	w.WriteString(`</div>`)

	// --- sonuç kutusu
	sub := fmt.Sprintf(`<b>%s</b> %s ÷ <b>%s</b> %s`, ganoFmtNum(points), esc(s.PtsWord), ganoFmtNum(credits), esc(s.CrWord))
	w.WriteString(`<div class="lpg-box lpg-result" aria-live="polite">`)
	fmt.Fprintf(&w, `<div class="lpg-res-row"><p class="lpg-lbl" id="lpg-yano-l">%s</p><output class="lpg-big" id="lpg-yano" aria-labelledby="lpg-yano-l">%s</output><div class="lpg-scale" aria-hidden="true"><i id="lpg-yano-bar" style="width:%.1f%%"></i></div><p class="lpg-sub" id="lpg-yano-sub">%s</p></div>`,
		esc(s.TermLabel), ganoFmt2(yano), yano/4*100, sub)
	fmt.Fprintf(&w, `<div class="lpg-res-row"><p class="lpg-lbl" id="lpg-gano-l">%s</p><output class="lpg-big lpg-big-sm" id="lpg-gano" aria-labelledby="lpg-gano-l">%s</output><p class="lpg-sub" id="lpg-gano-sub">%s</p></div>`,
		esc(s.NewLabel), ganoFmt2(yano), esc(s.NoPrev))
	fmt.Fprintf(&w, `<p class="lpg-note">%s</p></div>`, esc(s.Note))
	w.WriteString(`</form>`)

	// --- not ölçeği
	fmt.Fprintf(&w, `<h2 id="lpg-grades-h">%s</h2><dl class="lpg-box lpg-grades" aria-labelledby="lpg-grades-h">`, esc(s.GradesHead))
	for _, g := range ganoGradeScale {
		cls := ""
		if g.Points == 0 {
			cls = ` class="lpg-zero"`
		}
		fmt.Fprintf(&w, `<div%s><dt>%s</dt><dd>%s</dd></div>`, cls, esc(g.Letter), ganoFmt2(g.Points))
	}
	w.WriteString(`</dl>`)

	fmt.Fprintf(&w, `<div class="lpg-after"><p>%s</p><a class="lpg-link" %s>%s %s</a></div>`,
		esc(s.AfterText), appLinkAttrs("/#dersplanim"), esc(s.TranscriptLink), ganoArrowSVG)
	w.WriteString(`</section>`)
	fmt.Fprintf(&w, `<script type="module" src="/assets/landing/gano-calc.js?v=%s"></script>`, esc(jsV))
	return w.String()
}

// writeGanoRow, tek bir ders satırını yazar. gano-calc.js yeni satırları
// aynı yapıda üretir.
func writeGanoRow(w *strings.Builder, s ganoStrings, id int, r ganoRow) {
	esc := template.HTMLEscapeString
	n := strconv.Itoa(id)
	cr := ""
	pt := "·"
	if r.Credits > 0 {
		cr = ganoFmtNum(r.Credits)
		if p, ok := ganoPoints(r.Grade); ok {
			pt = ganoFmt2(p * r.Credits)
		}
	}
	fmt.Fprintf(w, `<tr><td class="lpg-c-nm"><label class="sr-only" for="lpg-n%s">%s</label><input id="lpg-n%s" class="lpg-in lpg-nm" value="%s" placeholder="%s" autocomplete="off"></td>`,
		n, esc(s.Course), n, esc(r.Code), esc(s.PhCourse))
	fmt.Fprintf(w, `<td class="lpg-c-cr"><label class="sr-only" for="lpg-c%s">%s</label><input id="lpg-c%s" class="lpg-in lpg-num lpg-cr" inputmode="decimal" value="%s" placeholder="%s" autocomplete="off"></td>`,
		n, esc(s.Credits), n, esc(cr), esc(s.PhCredits))
	fmt.Fprintf(w, `<td class="lpg-c-gr"><label class="sr-only" for="lpg-g%s">%s</label><select id="lpg-g%s" class="lpg-in lpg-gr">`, n, esc(s.CourseN), n)
	for _, g := range ganoGradeScale {
		sel := ""
		if g.Letter == r.Grade {
			sel = " selected"
		}
		fmt.Fprintf(w, `<option value="%s"%s>%s</option>`, esc(g.Letter), sel, esc(g.Letter))
	}
	w.WriteString(`</select></td>`)
	fmt.Fprintf(w, `<td class="lpg-c-pt lpg-pt">%s</td>`, pt)
	fmt.Fprintf(w, `<td class="lpg-c-rm"><button type="button" class="lpg-rm" aria-label="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></td></tr>`,
		esc(s.RemoveRow))
}

// landingGanoBody, writeLandingPage'in çağırdığı tek giriş noktasıdır:
// yalnız gano-hesaplama sayfası için hesaplayıcıyı döner, diğerleri için "".
func (b *Builder) landingGanoBody(slug string, en bool) string {
	if slug != "gano-hesaplama" {
		return ""
	}
	return ganoCalcHTML(en, b.assetVersion("landing/gano-calc.js"), b.assetVersion("landing/gano-calc.css"))
}
