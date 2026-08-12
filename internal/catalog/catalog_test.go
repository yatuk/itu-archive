package catalog

import (
	"os"
	"strings"
	"testing"
)

func readFixture(t *testing.T, name string) []byte {
	t.Helper()
	b, err := os.ReadFile("testdata/" + name)
	if err != nil {
		t.Fatalf("fixture okunamadı: %v", err)
	}
	return b
}

func TestParseFiz101(t *testing.T) {
	e, err := Parse(readFixture(t, "katalog_FIZ_101.html"), "url", "FIZ", "101")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if e.Name != "Fizik I" {
		t.Errorf("ad: %q", e.Name)
	}
	if e.Language != "Türkçe/English" {
		t.Errorf("dil: %q", e.Language)
	}
	if e.Credits != (Credits{Theory: 3, Practice: 0, Lab: 0, Local: 3, ECTS: 4.5}) {
		t.Errorf("kredi: %+v", e.Credits)
	}
	if !strings.Contains(e.Description, "Fiziksel") {
		t.Errorf("tanım içeriği: %q", e.Description)
	}
	if len(e.Outcomes) < 5 {
		t.Errorf("çıktı sayısı: %d (%v)", len(e.Outcomes), e.Outcomes)
	}
	if len(e.WeeklyTopics) == 0 {
		t.Error("haftalık konular boş")
	}
	if len(e.Textbooks) == 0 {
		t.Error("kaynak kitaplar boş")
	}
}

func TestParseBlg102(t *testing.T) {
	e, err := Parse(readFixture(t, "katalog_BLG_102.html"), "url", "BLG", "102")
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if e.Name != "Programlamaya Giriş (C)" {
		t.Errorf("ad: %q", e.Name)
	}
	if e.Credits != (Credits{Theory: 3, Practice: 2, Lab: 0, Local: 4, ECTS: 8}) {
		t.Errorf("kredi: %+v", e.Credits)
	}
	if !strings.Contains(e.Description, "algoritmalar") {
		t.Errorf("tanım içeriği: %q", e.Description)
	}
	foundBook := false
	for _, b := range e.Textbooks {
		if strings.Contains(b, "Deitel") {
			foundBook = true
		}
	}
	if !foundBook {
		t.Errorf("kitaplarda Deitel yok: %v", e.Textbooks)
	}
}

func TestParseShellRejects(t *testing.T) {
	// Yalnızca çerçeve (katalog formu yok) içerik sayılmaz — hata döner.
	if _, err := Parse(readFixture(t, "katalog_shell.html"), "url", "ZZZ", "999"); err == nil {
		t.Error("çerçeve sayfa için hata beklenirdi")
	}
}

func TestParseCodeMismatchRejects(t *testing.T) {
	// Sayfadaki kod "BLG102-BLG102E" iken istenen FIZ 101 uyuşmaz — yanlış dersin
	// içeriği sessizce yazılmamalı (Faz 3.4).
	if _, err := Parse(readFixture(t, "katalog_BLG_102.html"), "url", "FIZ", "101"); err == nil {
		t.Error("uyuşmayan kod için hata beklenirdi")
	}
}

func TestGroupsFromCodes(t *testing.T) {
	groups := GroupsFromCodes([]string{"BLG 102E", "BLG 102", "FIZ 101", "no-num", "MAT 101E"})
	if len(groups) != 3 {
		t.Fatalf("grup sayısı: %d", len(groups))
	}
	// "no-num" sayısal olmadığı için atlanır; BLG 102E + BLG 102 tek grupta.
	got := map[string]int{}
	for _, g := range groups {
		got[g.Branch+"|"+g.DersNo] = len(g.Codes)
	}
	if got["BLG|102"] != 2 {
		t.Errorf("BLG 102 grubunda 2 kod beklenirdi: %v", got)
	}
	if got["FIZ|101"] != 1 || got["MAT|101"] != 1 {
		t.Errorf("grup kodları: %v", got)
	}
}
