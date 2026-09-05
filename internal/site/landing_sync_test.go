package site

import (
	"sort"
	"testing"

	"itu-scraper/internal/validate"
)

// TestLandingSlugsMatchValidate, internal/site'ın ürettiği slug listesiyle
// internal/validate'in beklediği listenin senkron kaldığını denetler. Bu iki
// liste elle senkron tutuluyor; biri güncellenip diğeri unutulursa validate
// "sitemap'te fazla URL" diye hatalı şekilde patlıyordu (daha önce yaşandı).
func TestLandingSlugsMatchValidate(t *testing.T) {
	got := append([]string(nil), LandingSlugs()...)
	want := append([]string(nil), validate.LandingSlugs...)
	sort.Strings(got)
	sort.Strings(want)

	if len(got) != len(want) {
		t.Fatalf("slug sayısı uyuşmuyor: site=%d validate=%d\nsite: %v\nvalidate: %v", len(got), len(want), got, want)
	}
	for i := range got {
		if got[i] != want[i] {
			t.Fatalf("slug listeleri uyuşmuyor (sıralı karşılaştırma):\nsite: %v\nvalidate: %v", got, want)
		}
	}
}
