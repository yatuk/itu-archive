package site

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"itu-scraper/internal/model"
)

func writeFixture(t *testing.T, root, rel, body string) {
	t.Helper()
	p := filepath.Join(root, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

// courseExtrasFixture: küçük bir katalog, önşart ve müfredat verisi.
func courseExtrasFixture(t *testing.T) *Builder {
	t.Helper()
	root := t.TempDir()
	writeFixture(t, root, "data/catalog/FIZ.json", `{
 "FIZ 101": {"code":"FIZ 101","name":"Fizik I","nameEn":"Physics I","language":"Türkçe",
  "credits":{"theory":3,"practice":0,"lab":0,"local":3,"ects":4.5},
  "description":"Mekanik ve hareket.","outcomes":["Kuvveti açıklar.","-"],
  "weeklyPlan":[{"week":1,"topic":"Vektörler"},{"week":2,"topic":"-"},{"week":3,"topic":"Newton yasaları"}],
  "textbooks":["-","Halliday, Fizik"],"sourceUrl":"https://obs.itu.edu.tr/public/DersKatalog/x"},
 "FIZ 421": {"code":"FIZ 421","name":"İleri Fizik Proje Laboratuarı","nameEn":"İleri Fizik Proje Laboratuarı","language":"",
  "credits":{"theory":0,"practice":0,"lab":0,"local":0,"ects":0},
  "description":"","outcomes":null,"textbooks":["-"],"sourceUrl":""}
}`)
	writeFixture(t, root, "data/catalog/index.json", `{"courses":2}`)
	writeFixture(t, root, "data/prereq/graph.json", `{"nodes":[
 {"code":"FIZ 102","requirement":"( FIZ 101 MIN. DD Veya FIZ 101E MIN. DD ) Veya XYZ 999 MIN. DD","classReq":"60,00"},
 {"code":"FIZ 101"}]}`)
	writeFixture(t, root, "data/prereq/reverse.json", `{"schemaVersion":1,"FIZ 101":["FIZ 102","ABC 300","-"]}`)
	writeFixture(t, root, "data/curriculum/FIZ_LS.json", `{"programCode":"FIZ_LS","programName":"Fizik Mühendisliği Lisans","level":"LS",
 "semesters":[{"title":"1. Yarıyıl","items":[{"course":{"code":"FIZ 101","required":"Z"}}]},
  {"title":"7. Yarıyıl","items":[{"elective":{"title":"Seçmeli","options":[{"code":"FIZ 421"}]}}]}]}`)
	writeFixture(t, root, "data/curriculum/index.json", `[]`)

	b := New(root, "tr", "test")
	b.index = model.SiteIndex{Terms: []model.TermRef{{Slug: "2016-2017-guz"}, {Slug: "2025-2026-bahar"}}}
	b.courses = map[string]*histCourse{
		"FIZ 101":  {Name: "Fizik I", Terms: []string{"2025-2026-bahar", "2024-2025-guz"}, Rows: []histCourseRow{{Term: "2025-2026-bahar", Enrolled: 40}, {Term: "2025-2026-bahar", Enrolled: 35}, {Term: "2024-2025-guz", Enrolled: 10}}},
		"FIZ 101E": {Name: "Physics I", Terms: []string{"2025-2026-bahar"}},
		"FIZ 102":  {Name: "Fizik II", Terms: []string{"2025-2026-bahar"}},
		"FIZ 104":  {Name: "Fizik II Lab", Terms: []string{"2025-2026-bahar"}},
		"FIZ 421":  {Name: "İleri Fizik Proje Laboratuarı", Terms: []string{"2022-2023-bahar"}, Rows: []histCourseRow{{Term: "2022-2023-bahar", Enrolled: 1}}},
		"FIZ 499":  {Name: "Bitirme", Terms: []string{"2022-2023-bahar"}},
	}
	b.courseSects = map[string][]sectRow{}
	if err := b.loadCourseExtras(); err != nil {
		t.Fatal(err)
	}
	return b
}

func TestCourseSummaryIsFactual(t *testing.T) {
	b := courseExtrasFixture(t)
	labels := map[string]string{"2025-2026-bahar": "2025-2026 Bahar Dönemi", "2024-2025-guz": "2024-2025 Güz Dönemi", "2022-2023-bahar": "2022-2023 Bahar Dönemi"}
	got := b.courseSummary("FIZ 101", b.courses["FIZ 101"], labels)
	want := "FIZ 101, 2016'dan bu yana 2 dönem açıldı (2025-2026 Bahar ve 2024-2025 Güz); son dönemde 2 şube, 75 öğrenci."
	if got != want {
		t.Errorf("özet:\n got %q\nwant %q", got, want)
	}
	got = b.courseSummary("FIZ 421", b.courses["FIZ 421"], labels)
	want = "FIZ 421, 2016'dan bu yana 1 dönem açıldı (2022-2023 Bahar); 1 şube, 1 öğrenci."
	if got != want {
		t.Errorf("tek dönem özeti:\n got %q\nwant %q", got, want)
	}
	if strings.Contains(got, "—") {
		t.Error("özet uzun tire içermemeli")
	}
}

func TestYearAblativeTR(t *testing.T) {
	for in, want := range map[string]string{"2016": "2016'dan", "2020": "2020'den", "2013": "2013'ten", "2019": "2019'dan", "2000": "2000'den", "2040": "2040'tan"} {
		if got := yearAblativeTR(in); got != want {
			t.Errorf("yearAblativeTR(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestCourseCatalogSectionSkipsPlaceholders(t *testing.T) {
	b := courseExtrasFixture(t)
	html := b.renderCourseCatalog("FIZ 101", "Fizik I")
	for _, want := range []string{"<h2 id=\"icerik-baslik\">Ders içeriği</h2>", "Mekanik ve hareket.", "Kuvveti açıklar.", "Haftalık konular (2 hafta)", "<b>3. hafta</b><span>Newton yasaları</span>", "Halliday, Fizik", "İngilizce adı: Physics I", "obs.itu.edu.tr"} {
		if !strings.Contains(html, want) {
			t.Errorf("katalog bölümünde %q yok:\n%s", want, html)
		}
	}
	if strings.Contains(html, "<li>-</li>") {
		t.Error("yer tutucu '-' basılmamalı")
	}
	// Verisi boş katalog kaydı: başlık bile basılmaz.
	if got := b.renderCourseCatalog("FIZ 421", "İleri Fizik Proje Laboratuarı"); got != "" {
		t.Errorf("boş katalog bölümü basılmamalı: %q", got)
	}
	stats := b.catalogStatsHTML("FIZ 101")
	for _, want := range []string{"<dt>kredi</dt><dd>3</dd>", "<dt>AKTS</dt><dd>4,5</dd>", "<dd>3+0+0</dd>", "<dd>Türkçe</dd>"} {
		if !strings.Contains(stats, want) {
			t.Errorf("katalog istatistiğinde %q yok: %s", want, stats)
		}
	}
	if got := b.catalogStatsHTML("FIZ 421"); got != "" {
		t.Errorf("sıfır kredi/boş dil basılmamalı: %q", got)
	}
}

func TestCoursePrereqsLinkOnlyExistingPages(t *testing.T) {
	b := courseExtrasFixture(t)
	html := b.renderCoursePrereqs("FIZ 102")
	for _, want := range []string{"<h2>Önşartlar</h2>", `<a href="/ders/fiz-101/"><code>FIZ 101</code></a>`, `<a href="/ders/fiz-101e/"><code>FIZ 101E</code></a>`, "<code>XYZ 999</code> MIN. DD", "OBS sınıf şartı: 60,00"} {
		if !strings.Contains(html, want) {
			t.Errorf("önşart bölümünde %q yok:\n%s", want, html)
		}
	}
	if strings.Contains(html, "/ders/xyz-999/") {
		t.Error("sayfası olmayan ders bağlanmamalı")
	}
	rev := b.renderCoursePrereqs("FIZ 101")
	if strings.Contains(rev, "<h2>Önşartlar</h2>") {
		t.Error("önşartı olmayan derste Önşartlar başlığı basılmamalı")
	}
	for _, want := range []string{"Bu dersi önşart olarak isteyen dersler", "2 ders", "<code>ABC 300</code>", `/ders/fiz-102/`} {
		if !strings.Contains(rev, want) {
			t.Errorf("ters önşartta %q yok:\n%s", want, rev)
		}
	}
	if got := b.renderCoursePrereqs("FIZ 499"); got != "" {
		t.Errorf("verisi olmayan ders boş dönmeli: %q", got)
	}
}

func TestCourseCurriculaAndSimilar(t *testing.T) {
	b := courseExtrasFixture(t)
	cur := b.renderCourseCurricula("FIZ 421")
	for _, want := range []string{"Yer aldığı müfredatlar", `href="/?prog=FIZ_LS#dersplanim" rel="nofollow"`, "Fizik Mühendisliği Lisans", "7. Yarıyıl, seçmeli"} {
		if !strings.Contains(cur, want) {
			t.Errorf("müfredat bölümünde %q yok:\n%s", want, cur)
		}
	}
	if got := b.renderCourseCurricula("FIZ 499"); got != "" {
		t.Errorf("müfredatta olmayan ders boş dönmeli: %q", got)
	}

	sim := b.similarCourses("FIZ 101")
	if len(sim) == 0 || sim[0] != "FIZ 101E" {
		t.Fatalf("aynı adlı ders (FIZ 101E) ilk sırada olmalı: %v", sim)
	}
	for _, c := range sim {
		if c == "FIZ 101" || c == "FIZ 421" || c == "FIZ 499" {
			t.Errorf("kendisi ya da iki düzey uzaktaki ders benzer sayılmamalı: %v", sim)
		}
	}
	if again := b.similarCourses("FIZ 101"); strings.Join(again, ",") != strings.Join(sim, ",") {
		t.Error("benzer dersler deterministik olmalı")
	}
	html := b.renderSimilarCourses("FIZ 101")
	if !strings.Contains(html, `<a href="/ders/fiz-101e/">FIZ 101E</a> <span>Physics I</span>`) {
		t.Errorf("benzer ders bağlantısı yok:\n%s", html)
	}
}
