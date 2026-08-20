package main

import (
	"testing"

	"itu-scraper/internal/catalog"
)

func TestMergeCatalogDataPreservesFailedGroups(t *testing.T) {
	oldBLG := &catalog.Entry{Code: "BLG 102E", Name: "eski ama geçerli"}
	oldMAT := &catalog.Entry{Code: "MAT 101", Name: "korunacak"}
	previous := map[string]map[string]*catalog.Entry{
		"BLG": {"BLG 102E": oldBLG},
		"MAT": {"MAT 101": oldMAT},
	}
	freshBLG := &catalog.Entry{Code: "BLG 102E", Name: "yeni"}
	fresh := map[string]map[string]*catalog.Entry{
		"BLG": {"BLG 102E": freshBLG},
	}

	merged, retained := mergeCatalogData(previous, fresh)
	if got := merged["BLG"]["BLG 102E"].Name; got != "yeni" {
		t.Fatalf("taze kayıt eski kaydın üzerine yazılmadı: %q", got)
	}
	if got := merged["MAT"]["MAT 101"].Name; got != "korunacak" {
		t.Fatalf("çekilemeyen eski kayıt kayboldu: %q", got)
	}
	if retained != 1 {
		t.Fatalf("korunan kayıt sayısı 1 olmalı, %d", retained)
	}
	groups := []catalog.Group{
		{Branch: "BLG", DersNo: "102", Codes: []string{"BLG 102", "BLG 102E"}},
		{Branch: "MAT", DersNo: "101", Codes: []string{"MAT 101"}},
	}
	if got := countCatalogGroups(groups, merged); got != 2 {
		t.Fatalf("ders kodu değil katalog grubu sayılmalı; beklenen 2, gelen %d", got)
	}
}
