package store

import (
	"testing"

	"itu-scraper/internal/model"
)

func TestDedupe(t *testing.T) {
	sec := func(crn, branch string) model.Section {
		return model.Section{CRN: crn, Branch: branch, Code: branch + " 101"}
	}
	in := []model.Section{
		sec("100", "BLG"),
		sec("100", "BLG"), // aynı branş + aynı CRN -> tekrarlanan
		sec("101", "BLG"),
		sec("100", "MAT"), // aynı CRN, farklı branş -> çapraz listelenmiş, korunur
		{CRN: "", Branch: "BLG"}, // boş CRN her zaman korunur
	}
	got := dedupe(in)
	if len(got) != 4 {
		t.Fatalf("dedupe: %d sonuç bekleniyordu, %d geldi", 4, len(got))
	}
	// İlk geçen korunur, tekrar elenir.
	if got[0].CRN != in[0].CRN || got[0].Branch != in[0].Branch {
		t.Errorf("ilk geçen kayıt korunmadı: %+v", got[0])
	}
	if got[1].CRN != "101" || got[1].Branch != "BLG" {
		t.Errorf("ikinci kayıt yanlış: %+v", got[1])
	}
	// Çapraz listelenen ders (aynı CRN farklı branş) kaybolmamalı.
	if got[2].Branch != "MAT" || got[2].CRN != "100" {
		t.Errorf("çapraz listelenen ders kayboldu: %+v", got[2])
	}
	// Boş CRN korunur.
	if got[3].CRN != "" {
		t.Errorf("boş CRN korunmalı: %+v", got[3])
	}
}

func TestDedupeStable(t *testing.T) {
	sec := func(crn, branch string) model.Section { return model.Section{CRN: crn, Branch: branch} }
	in := []model.Section{sec("1", "A"), sec("2", "A"), sec("1", "A"), sec("3", "B")}
	got := dedupe(in)
	want := []string{"1", "2", "3"}
	for i, s := range got {
		if s.CRN != want[i] {
			t.Fatalf("sıra bozuldu: %d. eleman %q, beklenen %q", i, s.CRN, want[i])
		}
	}
}
