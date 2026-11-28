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
// Harf notu seçicisi assets-src/core/grade-picker.js ile aynı işaretlemedir
// (renk rampalı hap dizisi, role="radiogroup"). Stiller
// assets-src/landing/gano-calc.css içindedir; bütün sınıflar lpg- önekini
// taşır ve yalnız uygulamanın CSS değişkenlerini kullanır.

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

// ganoTone, hapın renk rampasındaki yeri: katsayı / 4, tam sayı yüzde
// (grade-picker.js gradeTone ile aynı yuvarlama).
func ganoTone(points float64) int { return int(math.Round(points / 4 * 100)) }

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
	Section, Caption, Example, Course, Credits, Grade, Remove string
	PhCourse, PhCredits, AddRow, ClearExample                 string
	PrevGPA, PrevCredits, PrevGPAPh, PrevCreditsPh, PrevHint  string
	TermLabel, NewLabel, PtsWord, CrWord, NoPrev, Note        string
	ExampleNote, GradesHead, AfterText, TranscriptLink        string
	RemoveRow, CourseN, GradeOf, CrDown, CrUp                 string
	TermCredits, TotalCredits, DeltaWord                      string
}

var ganoTR = ganoStrings{
	Section: "GANO hesaplayıcı", Caption: "Dönem dersleri, kredileri ve harf notları",
	Example: "örnek", Course: "Ders", Credits: "Kredi", Grade: "Harf notu", Remove: "Sil",
	PhCourse: "ders kodu", PhCredits: "kr", AddRow: "Ders ekle", ClearExample: "Örneği temizle",
	PrevGPA: "Önceki GANO", PrevCredits: "Tamamlanan kredi", PrevGPAPh: "ör. 2.85", PrevCreditsPh: "ör. 30",
	PrevHint:  "İsteğe bağlı. Önceki GANO ve tamamlanan krediyi girersen yeni GANO'yu ve farkı görürsün; boş bırakırsan yalnız bu dönem hesaplanır.",
	TermLabel: "Dönem ortalaması (YANO)", NewLabel: "Yeni GANO", PtsWord: "puan", CrWord: "kredi",
	NoPrev: "önceki GANO girilmedi; yalnız bu dönem",
	Note:   "FF ve VF 0 puanla kredisiyle birlikte ortalamaya katılır. Resmî GANO için OBS'e bak.",
	ExampleNote: "Örnek dönem: %s. Kendi derslerini yazınca sonuç anında değişir.",
	GradesHead:  "Harf notu katsayıları",
	AfterText:   "Transkriptini yapıştır veya PDF'ini yükle; dersler müfredatınla eşleşir, tekrar alınanlar ayrı gösterilir. Dosya yalnızca tarayıcında okunur.",
	TranscriptLink: "Transkriptinle hesapla: Müfredat ve GPA sekmesi",
	RemoveRow:      "Satırı sil", CourseN: "Harf notu", GradeOf: "%s harf notu",
	CrDown: "Krediyi azalt", CrUp: "Krediyi artır",
	TermCredits: "Bu dönem kredi", TotalCredits: "Toplam kredi", DeltaWord: "şu ana göre",
}

var ganoEN = ganoStrings{
	Section: "GPA calculator", Caption: "Term courses, credits and letter grades",
	Example: "example", Course: "Course", Credits: "Credits", Grade: "Letter grade", Remove: "Remove",
	PhCourse: "course code", PhCredits: "cr", AddRow: "Add course", ClearExample: "Clear example",
	PrevGPA: "Previous CGPA", PrevCredits: "Completed credits", PrevGPAPh: "e.g. 2.85", PrevCreditsPh: "e.g. 30",
	PrevHint:  "Optional. Enter your previous CGPA and completed credits to see the new CGPA and the change; leave empty to calculate this term only.",
	TermLabel: "Term GPA", NewLabel: "New CGPA", PtsWord: "points", CrWord: "credits",
	NoPrev: "no previous CGPA entered; this term only",
	Note:   "FF and VF count as 0 points and their credits stay in the average. Check OBS for your official CGPA.",
	ExampleNote: "Example term: %s. Type your own courses and the result updates instantly.",
	GradesHead:  "Letter grade coefficients",
	AfterText:   "Paste your transcript or upload its PDF; courses are matched to your curriculum and repeated courses are shown separately. The file is read only in your browser.",
	TranscriptLink: "Calculate from your transcript: Curriculum and GPA tab",
	RemoveRow:      "Remove row", CourseN: "Letter grade", GradeOf: "%s letter grade",
	CrDown: "Decrease credits", CrUp: "Increase credits",
	TermCredits: "Term credits", TotalCredits: "Total credits", DeltaWord: "vs current",
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
	fmt.Fprintf(&w, `<form class="lpg-calc" id="lpg-form" novalidate data-pts="%s" data-cr="%s" data-noprev="%s" data-course="%s" data-credits="%s" data-grade="%s" data-grade-of="%s" data-remove="%s" data-ph-course="%s" data-ph-cr="%s" data-cr-down="%s" data-cr-up="%s" data-delta="%s">`,
		esc(s.PtsWord), esc(s.CrWord), esc(s.NoPrev), esc(s.Course), esc(s.Credits), esc(s.CourseN), esc(s.GradeOf), esc(s.RemoveRow), esc(s.PhCourse), esc(s.PhCredits), esc(s.CrDown), esc(s.CrUp), esc(s.DeltaWord))

	// --- girdi kutusu: ders defteri (ad · kredi adımlayıcı · harf hapları · sil)
	w.WriteString(`<div class="lpg-box lpg-input">`)
	fmt.Fprintf(&w, `<p class="sr-only">%s</p>`, esc(s.Caption))
	fmt.Fprintf(&w, `<div class="lpg-head" aria-hidden="true"><span class="lpg-h-nm">%s <span class="lpg-ex" id="lpg-ex">%s</span></span><span class="lpg-h-cr">%s</span><span class="lpg-h-gr">%s</span></div>`,
		esc(s.Course), esc(s.Example), esc(s.Credits), esc(s.Grade))
	w.WriteString(`<div class="lpg-rows" id="lpg-rows">`)
	for i, r := range ganoExampleRows {
		writeGanoRow(&w, s, i+1, r)
	}
	w.WriteString(`</div>`)
	fmt.Fprintf(&w, `<button type="button" class="lpg-btn lpg-add" id="lpg-add"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>%s</button>`, esc(s.AddRow))

	var ex []string
	for _, r := range ganoExampleRows {
		ex = append(ex, fmt.Sprintf("%s %s %s %s", r.Code, ganoFmtNum(r.Credits), s.CrWord, r.Grade))
	}
	fmt.Fprintf(&w, `<p class="lpg-ex-note" id="lpg-ex-note">%s</p>`, esc(fmt.Sprintf(s.ExampleNote, strings.Join(ex, ", "))))

	fmt.Fprintf(&w, `<div class="lpg-foot"><button type="button" class="lpg-btn lpg-btn-link" id="lpg-clear">%s</button></div>`, esc(s.ClearExample))
	fmt.Fprintf(&w, `<div class="lpg-prev"><label for="lpg-prev-g">%s</label><label for="lpg-prev-c">%s</label><input id="lpg-prev-g" class="lpg-in lpg-num" inputmode="decimal" placeholder="%s" autocomplete="off"><input id="lpg-prev-c" class="lpg-in lpg-num" inputmode="numeric" placeholder="%s" autocomplete="off"><p class="lpg-hint">%s</p></div>`,
		esc(s.PrevGPA), esc(s.PrevCredits), esc(s.PrevGPAPh), esc(s.PrevCreditsPh), esc(s.PrevHint))
	w.WriteString(`</div>`)

	// --- sonuç kutusu: büyük canlı GANO, fark satırı, dönem özetleri
	sub := fmt.Sprintf(`<b>%s</b> %s ÷ <b>%s</b> %s`, ganoFmtNum(points), esc(s.PtsWord), ganoFmtNum(credits), esc(s.CrWord))
	w.WriteString(`<aside class="lpg-box lpg-result" aria-live="polite">`)
	fmt.Fprintf(&w, `<div class="lpg-hero"><p class="lpg-lbl" id="lpg-gano-l">%s</p><output class="lpg-big" id="lpg-gano" aria-labelledby="lpg-gano-l">%s</output><p class="lpg-delta" id="lpg-delta" hidden></p><p class="lpg-sub" id="lpg-gano-sub">%s</p></div>`,
		esc(s.NewLabel), ganoFmt2(yano), esc(s.NoPrev))
	w.WriteString(`<dl class="lpg-stats">`)
	fmt.Fprintf(&w, `<div><dt id="lpg-yano-l">%s</dt><dd><output id="lpg-yano" aria-labelledby="lpg-yano-l">%s</output></dd></div>`, esc(s.TermLabel), ganoFmt2(yano))
	fmt.Fprintf(&w, `<div><dt>%s</dt><dd id="lpg-tcr">%s</dd></div>`, esc(s.TermCredits), ganoFmtNum(credits))
	fmt.Fprintf(&w, `<div><dt>%s</dt><dd id="lpg-allcr">%s</dd></div>`, esc(s.TotalCredits), ganoFmtNum(credits))
	w.WriteString(`</dl>`)
	fmt.Fprintf(&w, `<p class="lpg-sub lpg-yano-sub" id="lpg-yano-sub">%s</p>`, sub)
	fmt.Fprintf(&w, `<p class="lpg-note">%s</p></aside>`, esc(s.Note))
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

// writeGanoPicker, harf notu seçicisini yazar; grade-picker.js
// gradePickerHTML ile bayt bayt aynı yapıdır (JS yeni satırları onunla kurar).
func writeGanoPicker(w *strings.Builder, label, value string) {
	esc := template.HTMLEscapeString
	focusAt := 0
	for i, g := range ganoGradeScale {
		if g.Letter == value {
			focusAt = i
		}
	}
	fmt.Fprintf(w, `<span class="lpg-gp" role="radiogroup" data-gp aria-label="%s">`, esc(label))
	for i, g := range ganoGradeScale {
		on, tab := "false", "-1"
		if g.Letter == value {
			on = "true"
		}
		if i == focusAt {
			tab = "0"
		}
		fmt.Fprintf(w, `<button type="button" class="lpg-gp-pill" role="radio" aria-checked="%s" tabindex="%s" data-grade="%s" style="--gp-w:%d%%">%s</button>`,
			on, tab, esc(g.Letter), ganoTone(g.Points), esc(g.Letter))
	}
	w.WriteString(`</span>`)
}

// writeGanoRow, tek bir ders satırını yazar. gano-calc.js yeni satırları
// aynı yapıda üretir.
func writeGanoRow(w *strings.Builder, s ganoStrings, id int, r ganoRow) {
	esc := template.HTMLEscapeString
	n := strconv.Itoa(id)
	cr := ""
	if r.Credits > 0 {
		cr = ganoFmtNum(r.Credits)
	}
	label := s.CourseN
	if r.Code != "" {
		label = fmt.Sprintf(s.GradeOf, r.Code)
	}
	fmt.Fprintf(w, `<div class="lpg-row"><div class="lpg-c-nm"><label class="sr-only" for="lpg-n%s">%s</label><input id="lpg-n%s" class="lpg-in lpg-nm" value="%s" placeholder="%s" autocomplete="off"></div>`,
		n, esc(s.Course), n, esc(r.Code), esc(s.PhCourse))
	fmt.Fprintf(w, `<div class="lpg-step"><button type="button" class="lpg-sb" data-d="-1" aria-label="%s" aria-controls="lpg-c%s">−</button><label class="sr-only" for="lpg-c%s">%s</label><input id="lpg-c%s" class="lpg-in lpg-num lpg-cr" inputmode="decimal" value="%s" placeholder="%s" autocomplete="off"><button type="button" class="lpg-sb" data-d="1" aria-label="%s" aria-controls="lpg-c%s">+</button></div>`,
		esc(s.CrDown), n, n, esc(s.Credits), n, esc(cr), esc(s.PhCredits), esc(s.CrUp), n)
	writeGanoPicker(w, label, r.Grade)
	fmt.Fprintf(w, `<button type="button" class="lpg-rm" aria-label="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`,
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
