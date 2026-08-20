package main

import (
	"testing"

	"itu-scraper/internal/grades"
)

func TestMergeGradesDataPreservesFailedGroupsAndHistory(t *testing.T) {
	previous := map[string][]grades.Entry{
		"BLG": {
			{Code: "BLG 102E", Donem: "202520", Total: 100},
			{Code: "BLG 102E", Donem: "202420", Total: 90},
		},
		"MAT": {{Code: "MAT 101", Donem: "202520", Total: 80}},
	}
	fresh := map[string][]grades.Entry{
		"BLG": {{Code: "BLG 102E", Donem: "202520", Total: 120}},
	}

	merged, retained := mergeGradesData(previous, fresh)
	if retained != 2 {
		t.Fatalf("iki eski kayıt korunmalı, %d", retained)
	}
	if len(merged["BLG"]) != 2 || len(merged["MAT"]) != 1 {
		t.Fatalf("tarihsel veya başarısız branş kayboldu: %+v", merged)
	}
	for _, entry := range merged["BLG"] {
		if entry.Donem == "202520" && entry.Total != 120 {
			t.Fatalf("taze not dağılımı eski kaydın üzerine yazılmadı: %+v", entry)
		}
	}
}
