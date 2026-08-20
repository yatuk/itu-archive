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
