package definitions

import (
	"os"
	"testing"
)

func readFixture(t *testing.T, name string) string {
	t.Helper()
	b, err := os.ReadFile("testdata/" + name)
	if err != nil {
		t.Fatal(err)
	}
	return string(b)
}

func TestParseBuildings(t *testing.T) {
	bs, err := ParseBuildings(readFixture(t, "bina_kodlari.html"))
	if err != nil {
		t.Fatalf("ParseBuildings: %v", err)
	}
	if len(bs) < 50 {
		t.Fatalf("bina sayısı: %d, want ≥50", len(bs))
	}
	got := map[string]string{}
	for _, b := range bs {
		got[b.Code] = b.Name
	}
	if got["AYB"] == "" {
		t.Error("AYB yok")
	}
	if got["BBB"] != "Bilgisayar ve Bilişim Binası" && got["BBB"] == "" {
		t.Errorf("BBB adı: %q", got["BBB"])
	}
}

func TestParsePrograms(t *testing.T) {
	ps, err := ParsePrograms(readFixture(t, "program_lisans.html"), 2)
	if err != nil {
		t.Fatalf("ParsePrograms: %v", err)
	}
	if len(ps) < 50 {
		t.Fatalf("program sayısı: %d, want ≥50", len(ps))
	}
	for _, p := range ps {
		if p.Level != 2 {
			t.Errorf("seviye: %d, want 2", p.Level)
		}
		if p.Code == "" || p.Name == "" {
			t.Errorf("boş kayıt: %+v", p)
		}
	}
	// Lisans dosyası "BLG_LS" gibi lisans kodu içermeli (SAO_OL önlisans, seviye 1).
	found := false
	for _, p := range ps {
		if p.Code == "BLG_LS" {
			found = true
		}
	}
	if !found {
		t.Errorf("BLG_LS bulunamadı; örnekler: %v", ps[:min(3, len(ps))])
	}
}
