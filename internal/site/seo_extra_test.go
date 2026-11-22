package site

import (
	"os"
	"path/filepath"
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
		got[r.from] = r.to
	}
	if got["/ders/kbm-696e/"] != "/brans/KBM/" || got["/ders/rot-501e/"] != "/brans/ROT/" {
		t.Fatalf("eski ders branşa gitmeli: %v", got)
	}
	// Branşı olmayan eski dersler (nuk-696e, nse-696e) 404 kalmaz, bölüm
	// dizinine gider.
	if got["/ders/nuk-696e/"] != "/bolumler/" || got["/ders/nse-696e/"] != "/bolumler/" {
		t.Fatalf("branşı olmayan eski ders /bolumler/'e gitmeli: nuk=%q nse=%q", got["/ders/nuk-696e/"], got["/ders/nse-696e/"])
	}
	for from, to := range got {
		if from == "/ders/"+courseSlug("KBM 502")+"/" {
			t.Fatalf("canlı ders için kural yazılmamalı: %s", from)
		}
		br := strings.ToUpper(strings.SplitN(strings.TrimPrefix(from, "/ders/"), "-", 2)[0])
		if want := "/brans/" + br + "/"; b.aggs[br] != nil && to != want {
			t.Fatalf("%s -> %s, beklenen %s", from, to, want)
		}
		if b.aggs[br] == nil && to != "/bolumler/" {
			t.Fatalf("branşı olmayan kural branşa gidiyor: %s -> %s", from, to)
		}
	}
}

func TestHocaTargetSplitsRenamesAndFallsBack(t *testing.T) {
	sorted := []string{"abdullah-fisne", "gunduz-okten", "handan-palak-erginsoy", "mehmet-ali", "mehmet-ali-kaya", "mehmet-ali-veli"}
	known := map[string]bool{}
	for _, s := range sorted {
		known[s] = true
	}
	cases := []struct {
		old, to string
		group   int
	}{
		{"gunduz-okten-abdullah-fisne", "/hoca/gunduz-okten/", redirHocaPerson},
		{"handan-palak", "/hoca/handan-palak-erginsoy/", redirHocaPerson},
		{"zana-eren", "/hoca/", redirHocaIndex},
		{"mehmet", "/hoca/", redirHocaIndex},     // birden fazla aday: tahmin yok
		{"handan-pal", "/hoca/", redirHocaIndex}, // kelime sınırı değil
	}
	for _, c := range cases {
		to, g := hocaTarget(c.old, known, sorted)
		if to != c.to || g != c.group {
			t.Errorf("%s -> %s (grup %d), beklenen %s (grup %d)", c.old, to, g, c.to, c.group)
		}
	}
}

func TestLegacySlugListsCoverReportedURLs(t *testing.T) {
	hoca := map[string]bool{}
	for _, s := range legacyHocaSlugs() {
		hoca[s] = true
	}
	for _, s := range []string{"gunduz-okten-abdullah-fisne", "handan-palak", "zana-eren", "erol-uzal", "recep-isci", "deniz-demirler", "ismail-toroz-recep-kaya"} {
		if !hoca[s] {
			t.Errorf("legacy_hoca_slugs.txt eksik: %s (go run ./cmd/legacy-slugs)", s)
		}
	}
	ders := map[string]bool{}
	for _, s := range legacyCourseSlugs() {
		ders[s] = true
	}
	for _, s := range []string{"nuk-696e", "nse-696e"} {
		if !ders[s] {
			t.Errorf("legacy_course_slugs.txt eksik: %s", s)
		}
	}
}

func TestPrioritizeRedirectsDropsLowestGroupFirst(t *testing.T) {
	var all []redirectRule
	all = append(all, redirectRule{"/hoca/z/", "/hoca/", redirHocaIndex}, redirectRule{"/hoca/y/", "/hoca/", redirHocaIndex})
	all = append(all, redirectRule{"/ders/b/", "/brans/B/", redirCourseBrans})
	all = append(all, redirectRule{"/hoca/a-b/", "/hoca/a/", redirHocaPerson})
	all = append(all, redirectRule{"/en/x/", "/en/y/", redirEnLanding})
	got, dropped := prioritizeRedirects(all, 4)
	if len(got) != 4 || dropped[redirHocaIndex] != 1 {
		t.Fatalf("4 kural kalmalı, 1 hoca-dizin kuralı düşmeli: %v %v", got, dropped)
	}
	if got[0].group != redirEnLanding || got[1].group != redirHocaPerson || got[3].from != "/hoca/y/" {
		t.Fatalf("öncelik/yol sırası bozuk: %v", got)
	}
	out := renderRedirects(got, dropped)
	if !strings.Contains(out, "yazılmayan: 1 kural") || !strings.Contains(out, "/en/ders/* /ders/:splat 301") {
		t.Fatalf("_redirects notu veya dinamik kural eksik:\n%s", out)
	}
}

func TestEnLandingRedirectRules(t *testing.T) {
	got := map[string]string{}
	for _, r := range enLandingRedirectRules() {
		got[r.from] = r.to
	}
	want := map[string]string{
		"/en/gano-hesaplama/":                 "/en/gpa-calculator/",
		"/en/ders-programi-olustur/":          "/en/schedule-builder/",
		"/en/ders-kaydi-nasil-yapilir/":       "/en/how-to-register-for-courses/",
		"/en/ders-programi-nasil-hazirlanir/": "/en/how-to-build-your-schedule/",
		"/en/terimler-sozlugu/":               "/en/glossary/",
		"/en/bolumler/":                       "/en/programs/",
	}
	for from, to := range want {
		if got[from] != to {
			t.Errorf("%s -> %q, beklenen %q", from, got[from], to)
		}
	}
}

func TestCheckDynamicRedirectsRefusesShadowing(t *testing.T) {
	root := t.TempDir()
	if err := checkDynamicRedirects(root); err != nil {
		t.Fatalf("boş kökte hata olmamalı: %v", err)
	}
	dir := filepath.Join(root, "en", "hoca", "x")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := checkDynamicRedirects(root); err == nil {
		t.Fatal("/en/hoca/* canlı sayfayı gölgeliyor, hata bekleniyordu")
	}
}

func TestAppURLMatchesShellReplaceState(t *testing.T) {
	cur := "2026-2027-guz"
	cases := []struct {
		params map[string]string
		want   string
	}{
		{map[string]string{"term": cur, "code": "MUZ 111"}, "/?code=MUZ+111#dersler"},
		{map[string]string{"term": "2025-2026-yaz", "code": "DAN 101"}, "/?term=2025-2026-yaz&code=DAN+101#dersler"},
		{map[string]string{"term": "2025-2026-bahar", "branch": "KOR"}, "/?term=2025-2026-bahar&branch=KOR#dersler"},
		{map[string]string{"term": cur, "branch": "KOR"}, "/?branch=KOR#dersler"},
		{map[string]string{"term": cur}, "/#dersler"},
		{map[string]string{"term": "2020-2021-guz"}, "/?term=2020-2021-guz#dersler"},
		{map[string]string{"q": "13724"}, "/?q=13724#dersler"},
		{map[string]string{"q": "Ayşe Öz"}, "/?q=Ay%C5%9Fe+%C3%96z#dersler"},
	}
	for _, c := range cases {
		if got := appURL(cur, c.params); got != c.want {
			t.Errorf("appURL(%v) = %q, beklenen %q", c.params, got, c.want)
		}
	}
	if got := appLinkAttrs("/?term=a&code=B+1#dersler"); got != `href="/?term=a&amp;code=B+1#dersler" rel="nofollow"` {
		t.Errorf("appLinkAttrs = %s", got)
	}
}

func TestRenderHeaders(t *testing.T) {
	root := t.TempDir()
	for _, p := range []string{"app.js", "style.css", "core/utils.js", "views/x.js", "vendor/fonts/a.woff2"} {
		full := filepath.Join(root, filepath.FromSlash(p))
		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(full, nil, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	paths, err := assetCachePaths(root)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Join(paths, ",") != "/assets/app.js,/assets/core/*,/assets/style.css,/assets/views/*" {
		t.Fatalf("immutable yollar: %v", paths)
	}
	out := renderHeaders(paths)
	blocks := map[string]string{}
	for _, blk := range strings.Split(out, "\n\n") {
		lines := strings.Split(strings.TrimSpace(blk), "\n")
		for len(lines) > 0 && strings.HasPrefix(lines[0], "#") {
			lines = lines[1:]
		}
		if len(lines) > 0 {
			blocks[lines[0]] = strings.Join(lines[1:], "\n")
		}
	}
	for _, h := range []string{"Strict-Transport-Security: max-age=31536000; includeSubDomains", "X-Frame-Options: DENY",
		"Cross-Origin-Opener-Policy: same-origin", "X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin"} {
		if !strings.Contains(blocks["/*"], h) {
			t.Errorf("/* bloğunda eksik: %s", h)
		}
	}
	if strings.Contains(blocks["/*"], "Cache-Control") || strings.Contains(out, "Content-Security-Policy") {
		t.Errorf("HTML'e Cache-Control veya CSP yazılmamalı:\n%s", out)
	}
	if !strings.Contains(blocks["/data/*"], "X-Robots-Tag: noindex") || !strings.Contains(blocks["/data/*"], "max-age=300") || strings.Contains(blocks["/data/*"], "immutable") {
		t.Errorf("/data/* bloğu: %q", blocks["/data/*"])
	}
	if !strings.Contains(blocks["/assets/core/*"], "immutable") || strings.Contains(blocks["/assets/vendor/*"], "immutable") {
		t.Errorf("assets önbelleği: core=%q vendor=%q", blocks["/assets/core/*"], blocks["/assets/vendor/*"])
	}
	// Cloudflare aynı adlı başlıkları birleştirir: bir yol en çok bir
	// Cache-Control kuralına uymalı. /assets/* gibi genel bir kural olmamalı.
	if _, ok := blocks["/assets/*"]; ok {
		t.Error("/assets/* vendor kuralıyla çakışır")
	}
}
