package site

import (
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"testing"
)

// Go ölçeği, tek kaynak olan assets-src/core/grades.js GRADE_POINTS ile aynı
// sırada ve aynı değerlerde olmalı.
func TestGanoGradeScaleMatchesGradesJS(t *testing.T) {
	src, err := os.ReadFile(filepath.Join("..", "..", "assets-src", "core", "grades.js"))
	if err != nil {
		t.Fatal(err)
	}
	m := regexp.MustCompile(`(?s)GRADE_POINTS\s*=\s*\{(.*?)\};`).FindSubmatch(src)
	if m == nil {
		t.Fatal("grades.js içinde GRADE_POINTS bulunamadı")
	}
	pairs := regexp.MustCompile(`'?([A-Z]{2}\+?)'?\s*:\s*([0-9.]+)`).FindAllSubmatch(m[1], -1)
	if len(pairs) != 15 || len(ganoGradeScale) != 15 {
		t.Fatalf("15 not bekleniyordu: grades.js=%d go=%d", len(pairs), len(ganoGradeScale))
	}
	for i, p := range pairs {
		v, err := strconv.ParseFloat(string(p[2]), 64)
		if err != nil {
			t.Fatal(err)
		}
		g := ganoGradeScale[i]
		if g.Letter != string(p[1]) || g.Points != v {
			t.Errorf("sıra %d: go=%s %.2f, grades.js=%s %.2f", i, g.Letter, g.Points, p[1], v)
		}
	}
}

func TestGanoMath(t *testing.T) {
	p, c := ganoTerm([]ganoRow{{"A", 4, "AA"}, {"B", 3, "CC"}})
	if got := ganoFmt2(ganoCombine(p, c, -1, 0)); got != "3.14" {
		t.Errorf("AA 4 + CC 3 = %s, 3.14 bekleniyordu", got)
	}
	if got := ganoFmt2(ganoCombine(p, c, 3.00, 30)); got != "3.03" {
		t.Errorf("önceki 3.00/30 kr ile = %s, 3.03 bekleniyordu", got)
	}
	// FF ve VF 0 puanla kredisiyle paydaya girer.
	p, c = ganoTerm([]ganoRow{{"A", 4, "AA"}, {"B", 3, "FF"}})
	if got := ganoFmt2(ganoCombine(p, c, -1, 0)); got != "2.29" || c != 7 {
		t.Errorf("AA 4 + FF 3 = %s (%v kr), 2.29 / 7 bekleniyordu", got, c)
	}
	// Kredisiz veya tanınmayan satır sayılmaz.
	if p, c := ganoTerm([]ganoRow{{"A", 0, "AA"}, {"B", 3, "XX"}}); p != 0 || c != 0 {
		t.Errorf("boş satırlar sayılmamalı: %v %v", p, c)
	}
}

func TestGanoCalcHTML(t *testing.T) {
	for _, tc := range []struct {
		en   bool
		want []string
	}{
		{false, []string{"Dönem ortalaması (YANO)", "Yeni GANO", ">örnek<", "Örnek dönem: MAT 103E 4 kredi BA, FIZ 101E 3 kredi BB+, KIM 101E 3 kredi CB, TUR 101 2 kredi AA, ING 101 3 kredi BA",
			"Transkriptinle hesapla: Müfredat ve GPA sekmesi", "Örneği temizle", "Önceki GANO", "Tamamlanan kredi"}},
		{true, []string{"Term GPA", "New CGPA", ">example<", "Example term: MAT 103E 4 credits BA", "Clear example", "Previous CGPA"}},
	} {
		h := ganoCalcHTML(tc.en, "j1", "c1")
		want := append(tc.want,
			`id="lpg-yano" aria-labelledby="lpg-yano-l">3.32</output>`,
			`id="lpg-gano" aria-labelledby="lpg-gano-l">3.32</output>`,
			`<b>49.75</b>`, `<b>15</b>`,
			`<div><dt>BA+</dt><dd>3.75</dd></div>`, `<div class="lpg-zero"><dt>FF</dt><dd>0.00</dd></div>`, `<div class="lpg-zero"><dt>VF</dt><dd>0.00</dd></div>`,
			`href="/#dersplanim" rel="nofollow"`,
			`src="/assets/landing/gano-calc.js?v=j1"`, `href="/assets/landing/gano-calc.css?v=c1"`,
			`value="MAT 103E"`, `<option value="BB+" selected>BB+</option>`)
		for _, w := range want {
			if !strings.Contains(h, w) {
				t.Errorf("en=%v: HTML %q içermiyor", tc.en, w)
			}
		}
		if strings.Contains(h, "—") {
			t.Errorf("en=%v: kullanıcı metninde em-dash var", tc.en)
		}
		if n := strings.Count(h, "<dt>"); n != 15 {
			t.Errorf("en=%v: not tablosunda %d satır, 15 bekleniyordu", tc.en, n)
		}
		if n := strings.Count(h, "<tr><td"); n != len(ganoExampleRows) {
			t.Errorf("en=%v: %d örnek satır, %d bekleniyordu", tc.en, n, len(ganoExampleRows))
		}
		if n := strings.Count(h, "<option "); n != 15*len(ganoExampleRows) {
			t.Errorf("en=%v: %d seçenek, her satırda 15 not bekleniyordu", tc.en, n)
		}
		for _, c := range regexp.MustCompile(`class="([^"]+)"`).FindAllStringSubmatch(h, -1) {
			for _, cls := range strings.Fields(c[1]) {
				if !strings.HasPrefix(cls, "lpg") && cls != "sr-only" {
					t.Errorf("en=%v: lpg- öneki olmayan sınıf %q", tc.en, cls)
				}
			}
		}
	}
	if (&Builder{}).landingGanoBody("ders-plani", false) != "" {
		t.Error("hesaplayıcı yalnız gano-hesaplama sayfasına girmeli")
	}
}
