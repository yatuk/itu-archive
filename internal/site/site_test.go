package site

import (
	"strings"
	"testing"
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
		"ders-plani":            "/#dersplanim",
		"gano-hesaplama":        "/#dersplanim",
		"not-ortalamasi":        "/#dersplanim",
		"ders-programi":         "/#dersler",
		"ders-programi-olustur": "/#program",
		"kontenjan":             "/#dersler",
		"ders-secimi":           "/#dersler",
		"onsart-haritasi":       "/#onsart",
		"sinav-programi":        "/#sinavlar",
		"akademik-takvim":       "/#takvim",
		"ders-arsivi":           "/#gecmis",
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
		}
	}
	for slug := range want {
		if !seen[slug] {
			t.Errorf("aranan araç için iniş sayfası eksik: %s", slug)
		}
	}
}

func TestLandingPagesHaveAccurateStableSitemapDate(t *testing.T) {
	if landingContentUpdated != "2026-08-22" {
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
