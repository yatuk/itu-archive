package catalog

import (
	"os"
	"testing"
)

// Tanım kaynakta gerçekten boş olan ders (bitirme çalışması): yapı hatası
// değil — ad/dil/kredi çözülür, kayıt yazılır.
func TestParseEmptyDescription(t *testing.T) {
	b, err := os.ReadFile("testdata/katalog_ELE_492.html")
	if err != nil {
		t.Fatalf("fixture: %v", err)
	}
	e, err := Parse(b, "url", "ELE", "492")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if e.Name == "" || e.Language == "" {
		t.Errorf("ad/dil boş: %q / %q", e.Name, e.Language)
	}
	if e.Description != "" {
		t.Errorf("bu dersin tanımı kaynakta boş olmalıydı: %q", e.Description)
	}
	if e.Credits.Local == 0 && e.Credits.ECTS == 0 {
		t.Errorf("kredi çözülmedi: %+v", e.Credits)
	}
}
