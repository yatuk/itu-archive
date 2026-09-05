package site

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"unicode/utf8"
)

func TestInstructorSlugAndIndexability(t *testing.T) {
	if got := instructorSlug("Hür Bersam Sidal"); got != "hur-bersam-sidal" {
		t.Fatalf("slug = %q", got)
	}
	for _, name := range []string{"", "***", "--", "TBA", "Bilinmiyor"} {
		if isIndexableInstructorName(name) {
			t.Errorf("placeholder indexable olmamalı: %q", name)
		}
	}
	if !isIndexableInstructorName("Büşra Kartal") {
		t.Fatal("gerçek tek dönemlik isim korunmalı")
	}
}

func TestPrepareInstructorProfilesMergesOnlySameSlugDeterministically(t *testing.T) {
	b := &Builder{instructors: map[string]*histInstr{
		"Hür bersam Sidal": {
			Name: "Hür bersam Sidal",
			Rows: []instrRow{{Term: "2024-2025-guz", Code: "BLG 101", Name: "Programlama"}},
		},
		"Hür Bersam Sidal": {
			Name: "Hür Bersam Sidal",
			Rows: []instrRow{
				{Term: "2025-2026-bahar", Code: "BLG 102", Name: "Programlama II"},
				{Term: "2024-2025-guz", Code: "BLG 101", Name: "Programlama"},
			},
		},
		"Hür B. Sidal": {
			Name: "Hür B. Sidal",
			Rows: []instrRow{{Term: "2025-2026-bahar", Code: "BLG 103", Name: "Başka Ders"}},
		},
	}}

	slugs := b.prepareInstructorProfiles()
	if slugs["Hür Bersam Sidal"] != "hur-bersam-sidal" {
		t.Fatalf("alias slug eşleşmedi: %#v", slugs)
	}
	profile := b.instructorProfiles["hur-bersam-sidal"]
	if profile == nil {
		t.Fatal("canonical profil yok")
	}
	if profile.Name != "Hür Bersam Sidal" {
		t.Fatalf("display name deterministik değil: %q", profile.Name)
	}
	if got := len(profile.Rows); got != 2 {
		t.Fatalf("mükerrer satırlar temizlenmedi: %d", got)
	}
	if profile.Terms != 2 {
		t.Fatalf("dönem sayısı = %d", profile.Terms)
	}
	if b.instructorProfiles["hur-b-sidal"] == nil {
		t.Fatal("farklı slug otomatik birleştirilmemeli")
	}
}

func TestFrequentCoursesCountsDistinctTerms(t *testing.T) {
	rows := []instrRow{
		{Term: "2025-2026-bahar", Code: "BLG 102", Name: "Programlama"},
		{Term: "2025-2026-bahar", Code: "BLG 102", Name: "Programlama"},
		{Term: "2024-2025-bahar", Code: "BLG 102", Name: "Programlama"},
		{Term: "2025-2026-guz", Code: "BLG 101", Name: "Giriş"},
	}
	got := frequentCourses(rows, 5)
	if len(got) != 2 || got[0].Code != "BLG 102" || got[0].Terms != 2 {
		t.Fatalf("beklenmeyen sıralama/sayım: %#v", got)
	}
}

func TestInstructorBranchesAreUniqueAndSorted(t *testing.T) {
	got := instructorBranches([]instrRow{{Code: "BLG 102E"}, {Code: "MAT 271E"}, {Code: "BLG 223E"}, {Code: ""}})
	if strings.Join(got, ",") != "BLG,MAT" {
		t.Fatalf("branş bağlantıları = %#v", got)
	}
}

func TestLocalizedTermLabel(t *testing.T) {
	if got := localizedTermLabel("2025-2026-bahar", "2025-2026 Bahar Dönemi", "en"); got != "2025-2026 Spring Term" {
		t.Fatalf("EN dönem etiketi = %q", got)
	}
	if got := localizedTermLabel("2025-2026-bahar", "2025-2026 Bahar Dönemi", "tr"); got != "2025-2026 Bahar Dönemi" {
		t.Fatalf("TR dönem etiketi değişmemeli: %q", got)
	}
}

func TestSitemapOmitsIgnoredPriorityAndChangefreq(t *testing.T) {
	xml := string(renderURLSet([]sitemapEntry{{Loc: baseURL + "/hoca/ornek/", Lastmod: "2026-08-20"}}))
	for _, forbidden := range []string{"<priority>", "<changefreq>"} {
		if strings.Contains(xml, forbidden) {
			t.Fatalf("sitemap %s içermemeli", forbidden)
		}
	}
	if !strings.Contains(xml, "<lastmod>2026-08-20</lastmod>") {
		t.Fatal("doğru lastmod kayboldu")
	}
}

func TestLandingPagesRouteSearchIntentToWorkingViews(t *testing.T) {
	want := map[string]string{
		"ders-plani":                     "/#dersplanim",
		"gano-hesaplama":                 "/#dersplanim",
		"not-ortalamasi":                 "/#dersplanim",
		"ders-programi":                  "/#dersler",
		"ders-programi-olustur":          "/#program",
		"kontenjan":                      "/#dersler",
		"ders-secimi":                    "/#program",
		"onsart-haritasi":                "/#onsart",
		"sinav-programi":                 "/#sinavlar",
		"akademik-takvim":                "/#takvim",
		"ders-arsivi":                    "/#gecmis",
		"ders-kaydi-nasil-yapilir":       "/akademik-takvim/",
		"ders-programi-nasil-hazirlanir": "/#program",
		"terimler-sozlugu":               "/#dersler",
	}
	seen := map[string]bool{}
	for _, page := range landingPages {
		if seen[page.slug] {
			t.Fatalf("yinelenen iniş sayfası slug'ı: %s", page.slug)
		}
		seen[page.slug] = true
		if got, ok := want[page.slug]; !ok {
			t.Errorf("beklenmeyen iniş sayfası: %s", page.slug)
		} else if page.primary.href != got {
			t.Errorf("%s yanlış araca gidiyor: got %q want %q", page.slug, page.primary.href, got)
		}
		if page.primary.label == "" || page.primary.detail == "" {
			t.Errorf("%s birincil araç çağrısı eksik", page.slug)
		}
		if page.title == "" || page.description == "" || page.h1 == "" {
			t.Errorf("%s arama niyeti metadatası eksik", page.slug)
		}
		for _, action := range page.secondary {
			if action.href == "" || action.label == "" {
				t.Errorf("%s boş ilgili araç bağlantısı içeriyor", page.slug)
			}
			if action.detail == "" && landingActionDetails[action.href] == "" {
				t.Errorf("%s içindeki %q bağlantısı açıklamasız", page.slug, action.label)
			}
		}
	}
	for slug := range want {
		if !seen[slug] {
			t.Errorf("aranan araç için iniş sayfası eksik: %s", slug)
		}
	}
}

func TestLandingPagesHaveAccurateStableSitemapDate(t *testing.T) {
	if landingContentUpdated != "2026-08-23" {
		t.Fatalf("landing içerik tarihi beklenmedik: %q", landingContentUpdated)
	}
	entries := make([]sitemapEntry, 0, len(landingPages))
	for _, page := range landingPages {
		entries = append(entries, sitemapEntry{
			Loc:     baseURL + "/" + page.slug + "/",
			Lastmod: landingContentUpdated,
		})
	}
	xml := string(renderURLSet(entries))
	if got := strings.Count(xml, "<lastmod>"+landingContentUpdated+"</lastmod>"); got != len(landingPages) {
		t.Fatalf("landing lastmod sayısı = %d, beklenen %d", got, len(landingPages))
	}
}

func TestPrioritySearchIntentsHaveOneCanonicalOwner(t *testing.T) {
	want := map[string]string{
		"İTÜ ders":                  "ders-programi",
		"İTÜ ders arşivi":           "ders-arsivi",
		"İTÜ geçmiş dersler":        "ders-arsivi",
		"İTÜ ortalama hesapla":      "gano-hesaplama",
		"İTÜ GPA hesapla":           "gano-hesaplama",
		"İTÜ GANO hesapla":          "gano-hesaplama",
		"İTÜ ders programı oluştur": "ders-programi-olustur",
	}
	owners := map[string][]string{}
	for _, page := range landingPages {
		for _, query := range page.queries {
			key := strings.ToLower(query)
			owners[key] = append(owners[key], page.slug)
		}
	}
	for query, slug := range want {
		got := owners[strings.ToLower(query)]
		if len(got) != 1 || got[0] != slug {
			t.Errorf("%q canonical sahibi = %#v, beklenen %q", query, got, slug)
		}
	}
}

func TestPriorityLandingMetadataAndCapabilitiesMeetQualityGate(t *testing.T) {
	priority := map[string]bool{
		"ders-plani": true, "gano-hesaplama": true, "ders-programi": true,
		"ders-programi-olustur": true, "ders-arsivi": true,
	}
	for _, page := range landingPages {
		if !priority[page.slug] {
			continue
		}
		fullTitle := page.title + " | " + langTR.SiteTitle
		if n := utf8.RuneCountInString(fullTitle); n < 30 || n > 60 {
			t.Errorf("%s title uzunluğu %d; 30-60 olmalı: %q", page.slug, n, fullTitle)
		}
		if n := utf8.RuneCountInString(page.description); n < 120 || n > 160 {
			t.Errorf("%s description uzunluğu %d; 120-160 olmalı", page.slug, n)
		}
		if len(page.features) < 3 {
			t.Errorf("%s veri destekli yetenek listesi eksik", page.slug)
		}
	}
}

func TestLandingTitlesAndDescriptionsAreUnique(t *testing.T) {
	titles := map[string]string{}
	descriptions := map[string]string{}
	for _, page := range landingPages {
		if other := titles[page.title]; other != "" {
			t.Errorf("%s ve %s aynı title'ı kullanıyor", other, page.slug)
		}
		titles[page.title] = page.slug
		if other := descriptions[page.description]; other != "" {
			t.Errorf("%s ve %s aynı description'ı kullanıyor", other, page.slug)
		}
		descriptions[page.description] = page.slug
	}
}

func TestDiscoveryFilesExposeCanonicalResources(t *testing.T) {
	root := t.TempDir()
	if err := writeDiscoveryFiles(root); err != nil {
		t.Fatal(err)
	}
	robots, err := os.ReadFile(filepath.Join(root, "robots.txt"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(robots), "Sitemap: "+baseURL+"/sitemap.xml") {
		t.Fatal("robots.txt canonical sitemap indexini bildirmiyor")
	}
	llms, err := os.ReadFile(filepath.Join(root, "llms.txt"))
	if err != nil {
		t.Fatal(err)
	}
	text := string(llms)
	for _, path := range []string{"/ders-programi/", "/ders-programi-olustur/", "/gano-hesaplama/", "/ders-arsivi/", "/sitemap.xml"} {
		if !strings.Contains(text, baseURL+path) {
			t.Errorf("llms.txt canonical kaynak eksik: %s", path)
		}
	}
	for _, forbidden := range []string{"FAQPage", "HowTo"} {
		if strings.Contains(text, forbidden) {
			t.Errorf("llms.txt kullanılmayan schema terimi içeriyor: %s", forbidden)
		}
	}
}

func TestPriorityLandingRendersCanonicalWebApplicationSchema(t *testing.T) {
	root := t.TempDir()
	b := &Builder{root: root, outRoot: root, l: langTR, version: "test"}
	var target landingPage
	for _, page := range landingPages {
		if page.slug == "ders-programi" {
			target = page
			break
		}
	}
	if err := b.writeLandingPage(target); err != nil {
		t.Fatal(err)
	}
	body, err := os.ReadFile(filepath.Join(root, target.slug, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	html := string(body)
	for _, want := range []string{
		`<link rel="canonical" href="` + baseURL + `/ders-programi/">`,
		`"@type":"WebApplication"`,
		`"applicationCategory":"EducationalApplication"`,
		`"isAccessibleForFree":true`,
		`"@type":"BreadcrumbList"`,
		`href="/#dersler"`,
	} {
		if !strings.Contains(html, want) {
			t.Errorf("landing çıktısı eksik: %s", want)
		}
	}
	if strings.Contains(html, `hreflang=`) {
		t.Fatal("Türkçe-only landing, var olmayan EN karşılığına hreflang vermemeli")
	}
	for _, forbidden := range []string{`"@type":"FAQPage"`, `"@type":"HowTo"`} {
		if strings.Contains(html, forbidden) {
			t.Errorf("kısıtlı/deprecated schema eklenmiş: %s", forbidden)
		}
	}
}

func TestBilingualLandingPagesLinkToEachOther(t *testing.T) {
	root := t.TempDir()
	var target landingPage
	for _, page := range landingPages {
		if page.slug == "gano-hesaplama" {
			target = page
			break
		}
	}
	if target.titleEN == "" {
		t.Fatal("gano-hesaplama artık bir EN karşılığına sahip olmalı")
	}

	trRoot := filepath.Join(root, "tr")
	bTR := &Builder{root: trRoot, outRoot: trRoot, l: langTR, version: "test"}
	if err := bTR.writeLandingPage(target); err != nil {
		t.Fatal(err)
	}
	trHTML, err := os.ReadFile(filepath.Join(trRoot, target.slug, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(trHTML), `hreflang="en" href="`+baseURL+`/en/gano-hesaplama/"`) {
		t.Error("TR sayfası EN karşılığına hreflang vermeli")
	}

	enRoot := filepath.Join(root, "en")
	bEN := &Builder{root: enRoot, outRoot: enRoot, l: langEN, version: "test"}
	if err := bEN.writeLandingPage(target); err != nil {
		t.Fatal(err)
	}
	enHTML, err := os.ReadFile(filepath.Join(enRoot, target.slug, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	html := string(enHTML)
	for _, want := range []string{
		`<link rel="canonical" href="` + baseURL + `/en/gano-hesaplama/">`,
		`hreflang="tr" href="` + baseURL + `/gano-hesaplama/"`,
		`"inLanguage":"en"`,
		"ITU GPA Calculator",
	} {
		if !strings.Contains(html, want) {
			t.Errorf("EN landing çıktısı eksik: %s", want)
		}
	}
	if strings.Contains(html, "İTÜ GPA ve GANO Hesaplama") {
		t.Error("EN sayfa TR başlığını sızdırmamalı")
	}
}

func TestCourseSelectionHubLinksToEveryPriorityIntentPage(t *testing.T) {
	want := map[string]bool{
		"/ders-arsivi/": false, "/ders-plani/": false, "/gano-hesaplama/": false,
		"/#dersler": false, "/#program": false, "/#onsart": false,
	}
	for _, page := range landingPages {
		if page.slug != "ders-secimi" {
			continue
		}
		if _, ok := want[page.primary.href]; ok {
			want[page.primary.href] = true
		}
		for _, action := range page.secondary {
			if _, ok := want[action.href]; ok {
				want[action.href] = true
			}
		}
	}
	for href, linked := range want {
		if !linked {
			t.Errorf("ders seçimi hub'ı hedefe bağlanmıyor: %s", href)
		}
	}
}

func TestLandingSitemapCandidatesAreUniqueCanonicalURLs(t *testing.T) {
	seen := map[string]bool{baseURL + "/": true}
	for _, page := range landingPages {
		loc := baseURL + "/" + page.slug + "/"
		if seen[loc] {
			t.Errorf("pages.xml adayı yineleniyor: %s", loc)
		}
		seen[loc] = true
		if strings.Contains(loc, "#") || strings.Contains(loc, "?") {
			t.Errorf("sitemap adayı canonical değil: %s", loc)
		}
	}
}

func TestSitemapIndexCoversEveryGeneratedPartitionOnce(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "sitemaps")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	parts := []string{"pages.xml", "terms.xml", "branches.xml", "courses.xml", "instructors.xml", "en.xml"}
	for _, name := range parts {
		if err := os.WriteFile(filepath.Join(dir, name), []byte("<urlset/>"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	if err := writeRootSitemapIndex(root, "2026-08-23"); err != nil {
		t.Fatal(err)
	}
	body, err := os.ReadFile(filepath.Join(root, "sitemap.xml"))
	if err != nil {
		t.Fatal(err)
	}
	xml := string(body)
	for _, name := range parts {
		url := baseURL + "/sitemaps/" + name
		if got := strings.Count(xml, "<loc>"+url+"</loc>"); got != 1 {
			t.Errorf("sitemap partition %s sayısı = %d", name, got)
		}
	}
	if got := strings.Count(xml, "<sitemap>"); got != len(parts) {
		t.Errorf("sitemap partition toplamı = %d, beklenen %d", got, len(parts))
	}
}

func TestLandingPageIntentsStayDistinct(t *testing.T) {
	bySlug := map[string]landingPage{}
	for _, page := range landingPages {
		bySlug[page.slug] = page
	}
	checks := map[string]string{
		"gano-hesaplama":        "GANO",
		"not-ortalamasi":        "harf not",
		"ders-programi":         "açık ders",
		"ders-programi-olustur": "oluşturma aracı",
		"ders-plani":            "müfredat",
	}
	for slug, phrase := range checks {
		page := bySlug[slug]
		haystack := strings.ToLower(page.title + " " + page.description + " " + page.h1)
		if !strings.Contains(haystack, strings.ToLower(phrase)) {
			t.Errorf("%s niyeti %q ifadesini taşımıyor", slug, phrase)
		}
	}
}

// TestFacultyDirectoryPageListsFacultiesAndSitemaps, /bolumler/ (ve
// /en/bolumler/) sayfasının docs/data/curriculum/*.json verisinden doğru
// şekilde üretildiğini, EN sayfanın TR'ye doğru hreflang verdiğini ve her iki
// sayfanın da kendi dilinin sitemap'ine eklendiğini doğrular.
func TestFacultyDirectoryPageListsFacultiesAndSitemaps(t *testing.T) {
	root := t.TempDir()
	curDir := filepath.Join(root, "data", "curriculum")
	if err := os.MkdirAll(curDir, 0o755); err != nil {
		t.Fatal(err)
	}
	writeCurriculum := func(name, code, progName, faculty, level string) {
		data := fmt.Sprintf(`{"programCode":%q,"programName":%q,"faculty":%q,"level":%q}`, code, progName, faculty, level)
		if err := os.WriteFile(filepath.Join(curDir, name), []byte(data), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	writeCurriculum("BLG_LS.json", "BLG_LS", "Bilgisayar Mühendisliği Lisans", "Bilgisayar ve Bilişim Fakültesi", "LS")
	writeCurriculum("BLG_HB_YL.json", "BLG_HB_YL", "Bilgisayar Mühendisliği Yüksek Lisans", "Bilgisayar ve Bilişim Fakültesi", "YL")
	// Bazı gerçek müfredat dosyaları tek nesne yerine tek elemanlı dizi olarak
	// yayınlanır; loadFacultyDirectory bunu da desteklemeli.
	if err := os.WriteFile(filepath.Join(curDir, "ARC_LS.json"),
		[]byte(`[{"programCode":"ARC_LS","programName":"Mimarlık Lisans","faculty":"Mimarlık Fakültesi","level":"LS"}]`), 0o644); err != nil {
		t.Fatal(err)
	}
	// index.json bir program dosyası değildir; atlanmalı.
	if err := os.WriteFile(filepath.Join(curDir, "index.json"), []byte(`[]`), 0o644); err != nil {
		t.Fatal(err)
	}

	faculties, err := loadFacultyDirectory(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(faculties) != 2 {
		t.Fatalf("2 fakülte bekleniyordu, %d geldi", len(faculties))
	}

	bTR := &Builder{root: root, outRoot: root, l: langTR, version: "test"}
	if err := bTR.writeDirectoryPage(faculties); err != nil {
		t.Fatal(err)
	}
	trBody, err := os.ReadFile(filepath.Join(root, "bolumler", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	trHTML := string(trBody)
	for _, want := range []string{
		"Bilgisayar ve Bilişim Fakültesi",
		"Mimarlık Fakültesi",
		`href="/?prog=BLG_LS#dersplanim"`,
		`href="/?prog=BLG_LS#onsart"`,
		`<link rel="canonical" href="` + baseURL + `/bolumler/">`,
		`hreflang="en" href="` + baseURL + `/en/bolumler/"`,
		`"@type":"BreadcrumbList"`,
	} {
		if !strings.Contains(trHTML, want) {
			t.Errorf("TR dizin sayfası eksik: %s", want)
		}
	}

	enRoot := filepath.Join(root, "en")
	bEN := &Builder{root: root, outRoot: enRoot, l: langEN, version: "test"}
	if err := bEN.writeDirectoryPage(faculties); err != nil {
		t.Fatal(err)
	}
	enBody, err := os.ReadFile(filepath.Join(enRoot, "bolumler", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	enHTML := string(enBody)
	for _, want := range []string{
		"Bilgisayar ve Bilişim Fakültesi", // gerçek fakülte/program adları çevrilmez
		"Faculty and program directory",
		`<link rel="canonical" href="` + baseURL + `/en/bolumler/">`,
		`hreflang="tr" href="` + baseURL + `/bolumler/"`,
	} {
		if !strings.Contains(enHTML, want) {
			t.Errorf("EN dizin sayfası eksik: %s", want)
		}
	}
	if strings.Contains(enHTML, "Fakülte ve program haritası") {
		t.Error("EN sayfa TR başlığını sızdırmamalı")
	}

	if err := bTR.writeSitemap(nil, nil, map[string]string{}, map[string]string{}); err != nil {
		t.Fatal(err)
	}
	pagesXML, err := os.ReadFile(filepath.Join(root, "sitemaps", "pages.xml"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(pagesXML), baseURL+"/bolumler/") {
		t.Error("TR sitemap /bolumler/ girdisini içermeli")
	}

	if err := bEN.writeSitemap(nil, nil, map[string]string{}, map[string]string{}); err != nil {
		t.Fatal(err)
	}
	enSitemap, err := os.ReadFile(filepath.Join(enRoot, "sitemap.xml"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(enSitemap), baseURL+"/en/bolumler/") {
		t.Error("EN sitemap /en/bolumler/ girdisini içermeli")
	}
}

// TestNewGuidePagesRenderBilingualAndSitemapped, ders-kaydi-nasil-yapilir,
// ders-programi-nasil-hazirlanir ve terimler-sozlugu sayfalarının: mevcut
// slug'larla çakışmadığını, her ikisinin de TR+EN üretildiğini, doğru
// hreflang çiftini taşıdığını ve her iki dilin sitemap'inde göründüğünü
// doğrular.
func TestNewGuidePagesRenderBilingualAndSitemapped(t *testing.T) {
	newSlugs := []string{"ders-kaydi-nasil-yapilir", "ders-programi-nasil-hazirlanir", "terimler-sozlugu"}
	existingSlugs := map[string]bool{
		"ders-plani": true, "gano-hesaplama": true, "not-ortalamasi": true,
		"ders-programi": true, "ders-programi-olustur": true, "kontenjan": true,
		"ders-secimi": true, "onsart-haritasi": true, "sinav-programi": true,
		"akademik-takvim": true, "ders-arsivi": true, "bolumler": true,
	}
	for _, slug := range newSlugs {
		if existingSlugs[slug] {
			t.Fatalf("yeni slug %q var olan bir sayfayla çakışıyor", slug)
		}
	}

	byNewSlug := map[string]landingPage{}
	for _, page := range landingPages {
		if page.slug == "ders-kaydi-nasil-yapilir" || page.slug == "ders-programi-nasil-hazirlanir" || page.slug == "terimler-sozlugu" {
			byNewSlug[page.slug] = page
		}
	}
	for _, slug := range newSlugs {
		page, ok := byNewSlug[slug]
		if !ok {
			t.Fatalf("beklenen yeni iniş sayfası eksik: %s", slug)
		}
		if page.titleEN == "" || page.descriptionEN == "" || page.h1EN == "" {
			t.Fatalf("%s için EN karşılığı eksik", slug)
		}

		root := t.TempDir()
		trRoot := filepath.Join(root, "tr")
		bTR := &Builder{root: trRoot, outRoot: trRoot, l: langTR, version: "test"}
		if err := bTR.writeLandingRoute(page); err != nil {
			t.Fatal(err)
		}
		trHTML, err := os.ReadFile(filepath.Join(trRoot, slug, "index.html"))
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(string(trHTML), `hreflang="en" href="`+baseURL+"/en/"+slug+`/"`) {
			t.Errorf("%s TR sayfası EN karşılığına hreflang vermeli", slug)
		}
		for _, forbidden := range []string{`"@type":"FAQPage"`, `"@type":"HowTo"`} {
			if strings.Contains(string(trHTML), forbidden) {
				t.Errorf("%s kısıtlı/deprecated schema içeriyor: %s", slug, forbidden)
			}
		}

		enRoot := filepath.Join(root, "en")
		bEN := &Builder{root: enRoot, outRoot: enRoot, l: langEN, version: "test"}
		if err := bEN.writeLandingRoute(page); err != nil {
			t.Fatal(err)
		}
		enHTML, err := os.ReadFile(filepath.Join(enRoot, slug, "index.html"))
		if err != nil {
			t.Fatal(err)
		}
		if !strings.Contains(string(enHTML), `hreflang="tr" href="`+baseURL+"/"+slug+`/"`) {
			t.Errorf("%s EN sayfası TR karşılığına hreflang vermeli", slug)
		}
		if !strings.Contains(string(enHTML), `<link rel="canonical" href="`+baseURL+"/en/"+slug+`/">`) {
			t.Errorf("%s EN canonical eksik", slug)
		}
		if strings.Contains(string(enHTML), page.title) {
			t.Errorf("%s EN sayfa TR başlığını sızdırmamalı", slug)
		}
	}

	// Sitemap: her yeni slug hem TR hem EN sitemap'inde görünmeli.
	root := t.TempDir()
	bTR := &Builder{root: root, outRoot: root, l: langTR, version: "test"}
	if err := bTR.writeSitemap(nil, nil, map[string]string{}, map[string]string{}); err != nil {
		t.Fatal(err)
	}
	pagesXML, err := os.ReadFile(filepath.Join(root, "sitemaps", "pages.xml"))
	if err != nil {
		t.Fatal(err)
	}
	for _, slug := range newSlugs {
		if !strings.Contains(string(pagesXML), baseURL+"/"+slug+"/") {
			t.Errorf("TR sitemap %s girdisini içermeli", slug)
		}
	}

	enRoot := filepath.Join(root, "en")
	if err := os.MkdirAll(enRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	bEN := &Builder{root: root, outRoot: enRoot, l: langEN, version: "test"}
	if err := bEN.writeSitemap(nil, nil, map[string]string{}, map[string]string{}); err != nil {
		t.Fatal(err)
	}
	enSitemap, err := os.ReadFile(filepath.Join(enRoot, "sitemap.xml"))
	if err != nil {
		t.Fatal(err)
	}
	for _, slug := range newSlugs {
		if !strings.Contains(string(enSitemap), baseURL+"/en/"+slug+"/") {
			t.Errorf("EN sitemap %s girdisini içermeli", slug)
		}
	}
}
