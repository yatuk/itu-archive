package curriculum

import (
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"

	"itu-scraper/internal/fetch"
)

func TestParseValidity(t *testing.T) {
	cases := []struct {
		label, from, until string
	}{
		{"Bilgisayar Mühendisliği Lisans Programı (%100 İngilizce) (KKTC) 2021-2022 / Güz ile 2026-2027/ Güz Dönemleri Arası", "2021-2022 Güz", "2026-2027 Güz"},
		{"Bilgisayar Mühendisliği Lisans Programı (%100 İngilizce) (KKTC) 2026-2027/ Güz Dönemi Sonrası", "2026-2027 Güz", ""},
		{"X Lisans Programı 2017-2018 / Güz ile 2021-2022 / Güz Dönemleri Arası", "2017-2018 Güz", "2021-2022 Güz"},
		{"X Lisans Programı 2021-2022  / Güz ile 2024-2025  / Güz Dönemleri Arası", "2021-2022 Güz", "2024-2025 Güz"},
		{"X Lisans Programı 2022-2023 / Bahar Dönemi Sonrası", "2022-2023 Bahar", ""},
		{"X Lisans Programı 2022-2023 / Bahar ile 2026-2027 / Güz Dönemleri Arası", "2022-2023 Bahar", "2026-2027 Güz"},
		{"X Yüksek Lisans 2025-2026 Güz Dönemi Sonrası", "2025-2026 Güz", ""},
		{"X Programı (%100 İngilizce) 2024 - 2025 / Güz Dönemi Sonrası", "2024-2025 Güz", ""},
		{"X Lisans Programı 2026-2027 / Güz Dönemi Öncesi", "", "2026-2027 Güz"},
		{"X Lisans Programı 2018-2019 Dönemi Sonrası", "2018-2019 Güz", ""},
		{"Çevre Bilimleri ve Mühendisliği (PhD)", "", ""},
		{"", "", ""},
		// Ardışık olmayan yıl çifti dönem sayılmaz.
		{"Program 2010-2015 arası", "", ""},
	}
	for _, tc := range cases {
		from, until := ParseValidity(tc.label)
		if from != tc.from || until != tc.until {
			t.Errorf("ParseValidity(%q) = (%q, %q), beklenen (%q, %q)", tc.label, from, until, tc.from, tc.until)
		}
	}
}

func TestTermKeyOrder(t *testing.T) {
	order := []string{"2021-2022 Güz", "2021-2022 Bahar", "2021-2022 Yaz", "2022-2023 Güz"}
	for i := 1; i < len(order); i++ {
		if TermKey(order[i-1]) >= TermKey(order[i]) {
			t.Errorf("%s, %s'den önce gelmeli", order[i-1], order[i])
		}
	}
	if TermKey("dönem yok") != -1 {
		t.Error("çözülemeyen dönem -1 olmalı")
	}
}

func TestParsePlanListMarksLatest(t *testing.T) {
	raw, err := os.ReadFile(filepath.Join("testdata", "planlist_multi.html"))
	if err != nil {
		t.Fatal(err)
	}
	vs := parsePlanList(string(raw), "ORN_LS")
	if len(vs) != 3 {
		t.Fatalf("3 sürüm beklenir, %d", len(vs))
	}
	if !vs[2].Latest || vs[0].Latest || vs[1].Latest {
		t.Errorf("yalnız son satır güncel olmalı: %+v", vs)
	}
	if vs[1].PlanID != 200 || vs[1].ValidFrom != "2021-2022 Güz" || vs[1].ValidUntil != "2026-2027 Güz" {
		t.Errorf("ikinci sürüm: %+v", vs[1])
	}
	if vs[1].File != "data/curriculum/versions/ORN_LS-200.json" {
		t.Errorf("dosya yolu: %q", vs[1].File)
	}
}

// fixtureServer, testdata altındaki sentetik OBS sayfalarını sunar ve hangi
// yolların istendiğini kaydeder.
func fixtureServer(t *testing.T) (*httptest.Server, func() []string) {
	t.Helper()
	var mu sync.Mutex
	var hits []string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		hits = append(hits, r.URL.Path)
		mu.Unlock()
		var name string
		switch {
		case strings.HasSuffix(r.URL.Path, "/DersPlanlariList"):
			name = "planlist_multi.html"
		case strings.Contains(r.URL.Path, "/DersPlanDetay/"):
			name = "detail_" + filepath.Base(r.URL.Path) + ".html"
		case strings.HasSuffix(r.URL.Path, "/_DersGrupSearch"):
			name = "group_" + r.URL.Query().Get("grupId") + ".html"
		}
		raw, err := os.ReadFile(filepath.Join("testdata", name))
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write(raw)
	}))
	t.Cleanup(srv.Close)
	return srv, func() []string {
		mu.Lock()
		defer mu.Unlock()
		return append([]string(nil), hits...)
	}
}

func useBase(t *testing.T, base string) {
	t.Helper()
	old := [...]string{programListURL, planListURL, planDetailURL, groupSearchURL}
	setBase(base)
	t.Cleanup(func() {
		programListURL, planListURL, planDetailURL, groupSearchURL = old[0], old[1], old[2], old[3]
	})
}

func TestPlanFetchesOlderVersions(t *testing.T) {
	srv, hits := fixtureServer(t)
	useBase(t, srv.URL)
	c := New(fetch.New(1000, 4))
	c.AllVersions = true
	c.MinVersionYear = 2015
	p := Program{Code: "ORN_LS", Name: "Örnek Mühendislik", Faculty: "Örnek Fakülte", Level: "LS"}

	plan, err := c.Plan(context.Background(), p)
	if err != nil {
		t.Fatal(err)
	}
	if plan.PlanID != 300 || plan.ValidFrom != "2026-2027 Güz" || plan.ValidUntil != "" {
		t.Errorf("güncel plan: id=%d from=%q until=%q", plan.PlanID, plan.ValidFrom, plan.ValidUntil)
	}
	// 2012-2013'te biten sürüm (100) MinVersionYear yüzünden çekilmez.
	if len(plan.Versions) != 2 || plan.Versions[0].PlanID != 200 || !plan.Versions[1].Latest {
		t.Fatalf("sürüm listesi: %+v", plan.Versions)
	}
	for _, h := range hits() {
		if strings.HasSuffix(h, "/DersPlanDetay/100") {
			t.Error("eski (aralık dışı) sürüm 100 çekilmemeliydi")
		}
	}
	if len(plan.Older) != 1 {
		t.Fatalf("bir eski sürüm beklenir, %d", len(plan.Older))
	}
	old := plan.Older[0]
	if old.PlanID != 200 || old.ValidFrom != "2021-2022 Güz" || old.ValidUntil != "2026-2027 Güz" || old.ProgramCode != "ORN_LS" {
		t.Errorf("eski sürüm kimliği: %+v", old)
	}
	if len(old.Semesters) != 2 {
		t.Fatalf("eski sürümde 2 yarıyıl beklenir, %d", len(old.Semesters))
	}
	var codes []string
	for _, it := range old.Semesters[0].Items {
		if it.Course != nil {
			codes = append(codes, it.Course.Code+"|"+it.Course.Name)
		}
	}
	joined := strings.Join(codes, ",")
	for _, want := range []string{"KIM 101E|General Chemistry I", "General Chemistry I Laboratory", "MAT 281E|Linear Algebra and Applicat."} {
		if !strings.Contains(joined, want) {
			t.Errorf("eski sürüm 1. yarıyılında %q yok: %s", want, joined)
		}
	}
	el := old.Semesters[1].Items[1].Elective
	// Numarasız "CIN <br/> Çince I" satırı branş joker'i olarak kalır.
	if el == nil || len(el.Options) != 3 || el.Options[0].Code != "ITB 211" || el.Options[2].Code != "CIN" || el.Options[2].Name != "Çince" {
		t.Errorf("seçmeli grup: %+v", el)
	}
	// Seçmeli grup sayfası iki sürümde ortak: bir kez çekilir.
	n := 0
	for _, h := range hits() {
		if strings.HasSuffix(h, "/_DersGrupSearch") {
			n++
		}
	}
	if n != 1 {
		t.Errorf("grup sayfası %d kez çekildi, 1 beklenir", n)
	}
}

func TestPlanLatestOnlyByDefault(t *testing.T) {
	srv, hits := fixtureServer(t)
	useBase(t, srv.URL)
	c := New(fetch.New(1000, 4))
	plan, err := c.Plan(context.Background(), Program{Code: "ORN_LS", Name: "Örnek", Level: "LS"})
	if err != nil {
		t.Fatal(err)
	}
	if plan.PlanID != 300 || len(plan.Versions) != 0 || len(plan.Older) != 0 {
		t.Errorf("varsayılan yalnız güncel sürüm: id=%d versions=%d older=%d", plan.PlanID, len(plan.Versions), len(plan.Older))
	}
	for _, h := range hits() {
		if strings.HasSuffix(h, "/DersPlanDetay/200") {
			t.Error("AllVersions kapalıyken eski sürüm çekildi")
		}
	}
}
