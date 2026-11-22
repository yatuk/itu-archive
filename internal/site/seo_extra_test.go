package site

import (
	"sort"
	"strings"
	"testing"
	"unicode/utf8"
)

func TestSplitCombinedSlugMapsOnlyRealCombinations(t *testing.T) {
	known := map[string]bool{"ismail-toroz": true, "recep-kaya": true, "gurbuz-gunes": true, "celale-kirkin-gozukirmizi": true, "ahmet-yilmaz": true}
	sorted := make([]string, 0, len(known))
	for k := range known {
		sorted = append(sorted, k)
	}
	sort.Strings(sorted)
	prefixOf := func(p string) bool {
		for _, s := range sorted {
			if strings.HasPrefix(s, p) {
				return true
			}
		}
		return false
	}
	cases := map[string]string{
		"ismail-toroz-recep-kaya":                "ismail-toroz",
		"gurbuz-gunes-celale-kirkin-gozukirmizi": "gurbuz-gunes",
		"gurbuz-gunes-celale-kirkin-goz":         "gurbuz-gunes", // 80 karakter kesmesi
		"ahmet-yilmaz-kaya":                      "",             // tek kişi olabilir; tahmin yok
		"ismail-toroz":                           "",
		"bilinmeyen-kisi-recep-kaya":             "",
	}
	for old, want := range cases {
		if got := splitCombinedSlug(old, known, prefixOf); got != want {
			t.Errorf("%s -> %q, beklenen %q", old, got, want)
		}
	}
}

func TestLegacyHocaSlugsSkipComments(t *testing.T) {
	for _, s := range legacyHocaSlugs() {
		if strings.HasPrefix(s, "#") || strings.ContainsAny(s, " /") {
			t.Fatalf("geçersiz eski slug: %q", s)
		}
	}
}

func TestTurkishFormatting(t *testing.T) {
	if got := trNum(1240); got != "1.240" {
		t.Errorf("trNum = %q", got)
	}
	if got := trNum(1234567); got != "1.234.567" {
		t.Errorf("trNum = %q", got)
	}
	for in, want := range map[[2]string]string{
		{"2027-01-26", "2027-01-27"}: "26–27 Ocak 2027",
		{"2026-12-01", "2026-12-01"}: "1 Aralık 2026",
		{"2027-01-27", "2027-02-27"}: "27 Ocak–27 Şubat 2027",
		{"2026-12-28", "2027-01-03"}: "28 Aralık 2026–3 Ocak 2027",
	} {
		if got := trDateRange(in[0], in[1]); got != want {
			t.Errorf("trDateRange(%v) = %q, beklenen %q", in, got, want)
		}
	}
}

func TestFullTitleDropsBrandWhenTooLong(t *testing.T) {
	if got := fullTitle("İTÜ önşart haritası", "İTÜ Ders Arşivi"); got != "İTÜ önşart haritası | İTÜ Ders Arşivi" {
		t.Errorf("kısa başlık soneki almalı: %q", got)
	}
	long := "MAK 219 Mukavemet I · İTÜ not dağılımı, hocalar ve şubeler"
	if got := fullTitle(long, "İTÜ Ders Arşivi"); got != long {
		t.Errorf("uzun başlık soneksiz kalmalı: %q", got)
	}
	for _, l := range []lang{langTR, langEN} {
		for _, link := range l.FootTools {
			if strings.Contains(link.Label, "—") || utf8.RuneCountInString(link.Label) == 0 {
				t.Errorf("bağlantı etiketi uygun değil: %q", link.Label)
			}
		}
	}
}

func TestCourseRedirectRulesSkipLiveAndUnknownBranch(t *testing.T) {
	b := &Builder{
		courses: map[string]*histCourse{"KBM 502": {}},
		aggs:    map[string]*branchAgg{"KBM": {}, "ROT": {}},
	}
	got := map[string]string{}
	for _, r := range b.courseRedirectRules() {
		got[r[0]] = r[1]
	}
	if got["/ders/kbm-696e/"] != "/brans/KBM/" || got["/ders/rot-501e/"] != "/brans/ROT/" {
		t.Fatalf("eski ders branşa gitmeli: %v", got)
	}
	for from := range got {
		if from == "/ders/"+courseSlug("KBM 502")+"/" {
			t.Fatalf("canlı ders için kural yazılmamalı: %s", from)
		}
		if b.aggs[strings.ToUpper(strings.SplitN(strings.TrimPrefix(from, "/ders/"), "-", 2)[0])] == nil {
			t.Fatalf("branşı olmayan kural: %s", from)
		}
	}
}
