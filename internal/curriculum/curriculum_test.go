package curriculum

import (
	"reflect"
	"testing"
)

func TestParseCourseFields(t *testing.T) {
	// Kolonlar: kod, ad, dil, Z/S, kredi, AKTS, teo, uyg, lab, tür.
	v := []string{"FIZ 101", "Fizik I", "Türkçe", "Z", "3", "4,5", "3", "0", "0", "TB"}
	c := parseCourse(v)
	if c.Code != "FIZ 101" || c.Name != "Fizik I" || c.Language != "Türkçe" {
		t.Errorf("kimlik: %+v", c)
	}
	if c.Required != "Z" || c.Type != "TB" {
		t.Errorf("rozet: %+v", c)
	}
	if c.Credits != 3 || c.Ects != 4.5 || c.Theory != 3 || c.Tutorial != 0 || c.Lab != 0 {
		t.Errorf("sayılar (Türkçe virgül): %+v", c)
	}
	// Kısa satır (eski biçim) bozulmamalı.
	short := parseCourse([]string{"BLG 101E", "Intro"})
	if short.Credits != 0 || short.Type != "" {
		t.Errorf("kısa satır: %+v", short)
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
