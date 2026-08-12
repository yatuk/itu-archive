package grades

import (
	"os"
	"testing"
)

func readFixture(t *testing.T, name string) []byte {
	t.Helper()
	b, err := os.ReadFile("testdata/" + name)
	if err != nil {
		t.Fatal(err)
	}
	return b
}

func TestParse(t *testing.T) {
	es, ok, err := Parse(readFixture(t, "notdagilimi_BLG_102.html"), "url", "BLG 102E")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if !ok || len(es) == 0 {
		t.Fatal("içerik beklenirdi")
	}
	e := es[0]
	if e.Code != "BLG 102E" {
		t.Errorf("code: %q", e.Code)
	}
	if e.Total != 239 {
		t.Errorf("total: %d, want 239", e.Total)
	}
	if e.Grades["AA"] != 25 {
		t.Errorf("AA: %d, want 25", e.Grades["AA"])
	}
	if e.Grades["VF"] != 42 {
		t.Errorf("VF: %d, want 42", e.Grades["VF"])
	}
	if e.Term == "" {
		t.Error("term boş")
	}
	if e.SourceURL != "url" {
		t.Errorf("sourceUrl: %q", e.SourceURL)
	}
}

func TestParseEmptyBody(t *testing.T) {
	// Veri yoksa (204/boş gövde) içerik değildir — hata değil, ok=false.
	es, ok, err := Parse([]byte(""), "url", "BLG 102")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if ok || len(es) != 0 {
		t.Fatal("boş gövde içerik sayılmamalı")
	}
}

func TestParseBelowThresholdSkipped(t *testing.T) {
	// Etik sınır: <10 kişilik sınıf kaydedilmez (kişi ifşası).
	body := `<script>const ALL_DATA = [{"DonemKodu":"X","YilAdi":"2025-2026","DonemTipAdi":"Bahar Dönemi",
		"ToplamAciklananOgrenci":8,"Dagilim":[{"HarfNotu":"AA","Sayi":8,"Yuzde":100}]}];</script>`
	es, ok, err := Parse([]byte(body), "url", "BLG 102")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if ok || len(es) != 0 {
		t.Fatal("8 kişilik dağılım kaydedilmemeli")
	}
}

func TestParseMultipleTermsAndCodes(t *testing.T) {
	// yil=2025 yalnızca 2024-2025 dönemini döndürür — kod doğru taşınmalı.
	es, _, err := Parse(readFixture(t, "notdagilimi_BLG_102_2025.html"), "url", "BLG 102")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if len(es) != 1 {
		t.Fatalf("dönem sayısı: %d, want 1", len(es))
	}
	if es[0].Total != 190 {
		t.Errorf("total: %d, want 190", es[0].Total)
	}
	if es[0].Grades["CB+"] != 31 {
		t.Errorf("CB+: %d, want 31", es[0].Grades["CB+"])
	}
}

func TestGroupsFromCodes(t *testing.T) {
	gs := GroupsFromCodes([]string{"BLG 102E", "BLG 102", "FIZ 101", "MAT 101E", "no-num"})
	if len(gs) != 3 {
		t.Fatalf("grup sayısı: %d, want 3", len(gs))
	}
	if gs[0].Branch != "BLG" || gs[0].DersNo != "102" {
		t.Errorf("ilk grup: %+v", gs[0])
	}
	if len(gs[0].Codes) != 2 {
		t.Errorf("BLG grubunun kodları: %v", gs[0].Codes)
	}
}
