package curriculum

import (
	"reflect"
	"testing"
)

func TestParseCourseFields(t *testing.T) {
	// Kolonlar: kod, ad, dil, Z/S, kredi, AKTS, teo, uyg, lab, tür.
	v := []string{"FIZ 101", "Fizik I", "Türkçe", "Z", "3", "4,5", "3", "0", "0", "TB"}
	cell := `<a href="https://obs.itu.edu.tr/public/DersBilgi?bransKodu=FIZ&amp;dersNo=101">FIZ 101</a>`
	c := parseCourse(v, cell)
	if c.Code != "FIZ 101" || c.Name != "Fizik I" || c.Language != "Türkçe" {
		t.Errorf("kimlik: %+v", c)
	}
	if c.Required != "Z" || c.Type != "TB" {
		t.Errorf("rozet: %+v", c)
	}
	if c.Credits != 3 || c.Ects != 4.5 || c.Theory != 3 || c.Tutorial != 0 || c.Lab != 0 {
		t.Errorf("sayılar (Türkçe virgül): %+v", c)
	}
	// Kısa satır (eski biçim) bozulmamalı; kod boş ham hücreden düşer.
	short := parseCourse([]string{"BLG 101E", "Intro"}, "")
	if short.Credits != 0 || short.Type != "" {
		t.Errorf("kısa satır: %+v", short)
	}
	if short.Code != "BLG 101E" {
		t.Errorf("kısa satır kodu: %q", short.Code)
	}
}

func TestCanonicalCode(t *testing.T) {
	cases := []struct {
		cell string
		want string
	}{
		// OBS çift kod basar: İngilizce + Türkçe ayrı bağlantılar.
		{`<a href="x?bransKodu=SAO&amp;dersNo=101">SAO 101E</a><br><a href="x?bransKodu=SAO&amp;dersNo=101">SAO 101</a>`, "SAO 101E"},
		// Sıralama ters olsa da E sonekli kanoniktir.
		{`<a href="x?bransKodu=SAO&amp;dersNo=103">SAO 103</a><br><a href="x?bransKodu=SAO&amp;dersNo=103">SAO 103E</a>`, "SAO 103E"},
		// Tek kod.
		{`<a href="x?bransKodu=TUR&amp;dersNo=121">TUR 121</a>`, "TUR 121"},
		// Bağlantı yok: temiz metnin ilk kod kalıbı.
		{`<td>BLG 102E BLG 102</td>`, "BLG 102E"},
		// Kod yok: boş.
		{`<td>Başlık</td>`, ""},
	}
	for _, tc := range cases {
		if got := canonicalCode(tc.cell); got != tc.want {
			t.Errorf("canonicalCode(%q) = %q, beklenen %q", tc.cell, got, tc.want)
		}
	}
}

func TestNormType(t *testing.T) {
	for _, s := range []string{"TB", "TM", "MT", "ITB", "EC"} {
		if got := normType(s); got != s {
			t.Errorf("normType(%q) = %q", s, got)
		}
	}
	// Z/S tür değildir — boş düşmeli.
	for _, s := range []string{"Z", "S", "", "z", "  "} {
		if got := normType(s); got != "" {
			t.Errorf("normType(%q) = %q, beklenen boş", s, got)
		}
	}
}

func TestFillPlanTotalsComputed(t *testing.T) {
	// Önlisans: sayfa altı AKTS 0,00 basıyor ama kalemlerde AKTS var →
	// kalemlerden toplanmalı ve "hesaplandı" işaretlenmeli.
	body := `<td>Toplam Kredi :</td><td>82,00</td><td>Toplam AKTS :</td><td>0,00</td>`
	plan := &Plan{Semesters: []Semester{{Items: []Item{
		{Course: &Course{Code: "SAO 101E", Credits: 4, Ects: 5}},
		{Course: &Course{Code: "TUR 121", Credits: 0, Ects: 2}},
	}}}}
	fillPlanTotals(plan, body)
	if plan.TotalCredits != "82,00" || plan.TotalCreditsComputed {
		t.Errorf("kredi: %q computed=%v", plan.TotalCredits, plan.TotalCreditsComputed)
	}
	if plan.TotalEcts != "7,00" || !plan.TotalEctsComputed {
		t.Errorf("AKTS: %q computed=%v", plan.TotalEcts, plan.TotalEctsComputed)
	}
}

func TestParseEctsRange(t *testing.T) {
	if got := parseEctsRange("4 / 5 / 6"); !reflect.DeepEqual(got, []float64{4, 5, 6}) {
		t.Errorf("aralık: %v", got)
	}
	if got := parseEctsRange("5"); !reflect.DeepEqual(got, []float64{5}) {
		t.Errorf("tek değer: %v", got)
	}
	if got := parseEctsRange(""); got != nil {
		t.Errorf("boş: %v", got)
	}
}

func TestPlanTotals(t *testing.T) {
	body := `<td>Toplam Kredi :</td><td>152,00</td><td>Toplam AKTS :</td><td>0,00</td>`
	k, e := planTotals(body)
	if k != "152,00" || e != "0,00" {
		t.Errorf("toplamlar: %q %q", k, e)
	}
	if k2, e2 := planTotals("<td>boş</td>"); k2 != "" || e2 != "" {
		t.Errorf("eksik toplam: %q %q", k2, e2)
	}
}
