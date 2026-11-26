package site

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// lppFixtureRows, search.json biçiminde (crn, kod, ad, branş, hoca, gün/saat,
// kontenjan, yazılan, düzey, öğretim şekli, programlar, derslik) küçük bir dönem.
func lppFixtureRows() [][]any {
	face, web := "Fiziksel (Yüz yüze)", "Sanal (Çevrimiçi/Online)"
	return [][]any{
		{"10184", "MAT 103E", "Mathematics I", "MAT", "Zerrin Şentürk", "Pazartesi 08:30/11:29 | Salı 11:30/13:29", 95, 93, "LS", face, []string{}, "MED A16 | MED A16"},
		{"10195", "MAT 103E", "Mathematics I", "MAT", "Burhaneddin İzgi", "Pazartesi 08:30/11:29 | Çarşamba 11:30/13:29", 115, 111, "LS", face, []string{}, "MED A35 | MED A35"},
		{"10200", "MAT 103E", "Mathematics I", "MAT", "Bahri Güldoğan", "Salı 14:30/17:29 | Çarşamba 11:30/13:29", 105, 103, "LS", face, []string{}, "MED A15 | MED A15"},
		{"10232", "MAT 103E", "Mathematics I", "MAT", "Nalan Antar", "Salı 14:30/17:29 | Çarşamba 11:30/13:29", 140, 124, "LS", face, []string{}, "MED A14 | MED A14"},
		{"15176", "MAT 103E", "Mathematics I", "MAT", "Sabire Cömert", "Pazartesi 08:30/11:29 | Çarşamba 08:30/10:29", 80, 49, "LS", face, []string{}, "DZB -- | DZB --"},
		{"10451", "FIZ 101E", "Physics I", "FIZ", "Sevim İşçi Turutoğlu", "Pazartesi 14:30/17:29", 140, 140, "LS", face, []string{}, "MED A11"},
		{"10460", "FIZ 101E", "Physics I", "FIZ", "Nurcan Doğan Bingölbali", "Salı 08:30/11:29", 90, 67, "LS", face, []string{}, "MED A31"},
		{"10468", "FIZ 101E", "Physics I", "FIZ", "Yakup Hundur", "Çarşamba 08:30/11:29", 120, 106, "LS", face, []string{}, "MED A32"},
		{"10475", "FIZ 101E", "Physics I", "FIZ", "Gönül Eryürek", "Perşembe 14:30/17:29", 100, 87, "LS", face, []string{}, "MED A11"},
		{"10261", "KIM 101E", "General Chemistry I", "KIM", "Fuat Topuz", "Pazartesi 14:30/17:29", 55, 56, "LS", face, []string{}, "MED A15"},
		{"10266", "KIM 101E", "General Chemistry I", "KIM", "Argun Talat Gökçeören", "Salı 08:30/11:29", 90, 91, "LS", face, []string{}, "MED A14"},
		{"10269", "KIM 101E", "General Chemistry I", "KIM", "Seden Beyhan", "Çarşamba 08:30/11:29", 107, 107, "LS", face, []string{}, "MED A14"},
		{"10276", "KIM 101E", "General Chemistry I", "KIM", "Şennur Özçelik", "Cuma 08:30/11:29", 80, 80, "LS", face, []string{}, "MED A14"},
		{"15179", "KIM 101E", "General Chemistry I", "KIM", "Emrah Şık", "Perşembe 15:30/18:29", 100, 71, "LS", face, []string{}, "DZB --"},
		{"10001", "TUR 101", "Türk Dili I", "TUR", "Hasan Ulucutsoy", "Salı 11:30/13:29", 50, 51, "LS", web, []string{}, "MED --"},
		{"10003", "TUR 101", "Türk Dili I", "TUR", "İnci Pamuk", "Salı 11:30/13:29", 50, 47, "LS", web, []string{}, "MED --"},
		{"10005", "TUR 102", "Türk Dili II", "TUR", "Abdullah Esen", "Cuma 10:30/12:29", 40, 11, "LS", web, []string{}, "MED --"},
		{"99999", "ING 101", "English", "ING", "Biri", "Pazartesi 08:30/11:29", 30, 1, "LS", face, []string{}, "MED A1"},
	}
}

func lppFixture(t *testing.T) map[string][]lppSection {
	t.Helper()
	raw, err := json.Marshal(lppFixtureRows())
	if err != nil {
		t.Fatal(err)
	}
	var rows [][]json.RawMessage
	if err := json.Unmarshal(raw, &rows); err != nil {
		t.Fatal(err)
	}
	return lppParseRows(rows)
}

func TestProgramDemoSelection(t *testing.T) {
	d, ok := buildProgramDemo(lppFixture(t), "2026-2027 Güz")
	if !ok {
		t.Fatal("örnek kurulamadı")
	}
	if len(d.Courses) != 4 {
		t.Fatalf("4 ders beklenirdi, %d", len(d.Courses))
	}
	wantDef := []string{"10232", "10451", "10276", "10003"}
	for i, c := range d.Courses {
		if c.Def != wantDef[i] {
			t.Errorf("%s varsayılanı %s, beklenen %s", c.Key, c.Def, wantDef[i])
		}
		if n := len(c.Secs); n < 3 || n > 4 {
			t.Errorf("%s için %d şube", c.Key, n)
		}
		for _, s := range c.Secs {
			if s.CRN == "15176" || s.CRN == "15179" {
				t.Errorf("Ayazağa dışı ya da 17:30 sonrası şube seçilmemeli: %s", s.CRN)
			}
		}
	}
	// Varsayılanlar çakışmaz.
	pick := []string{}
	for _, c := range d.Courses {
		pick = append(pick, c.Def)
	}
	if _, pairs := lppLayout(d.Courses, pick); len(pairs) != 0 {
		t.Fatalf("varsayılan programda çakışma var: %v", pairs)
	}
	// Örnek çakışma: KIM 101E 10261, FIZ 101E ile Pazartesi 14:30.
	if d.ClashIdx != 2 || d.ClashCRN != "10261" || d.ClashWith != 1 {
		t.Fatalf("örnek çakışma yanlış: %d %s %d", d.ClashIdx, d.ClashCRN, d.ClashWith)
	}
	pick[2] = "10261"
	blocks, pairs := lppLayout(d.Courses, pick)
	if len(pairs) != 1 {
		t.Fatalf("1 çakışma beklenirdi, %d", len(pairs))
	}
	for _, p := range pairs {
		for _, i := range p {
			if !blocks[i].clash || blocks[i].lanes != 2 {
				t.Errorf("çakışan blok yan yana iki şeride yerleşmeli: %+v", blocks[i])
			}
		}
	}
	if d.Courses[3].label() != "TUR 101 / 102" {
		t.Errorf("TUR etiketi: %q", d.Courses[3].label())
	}
}

func TestProgramDemoDeterministicAndFallback(t *testing.T) {
	a := renderProgramDemo(mustDemo(t, lppFixture(t)), false)
	b := renderProgramDemo(mustDemo(t, lppFixture(t)), false)
	if a != b {
		t.Fatal("aynı veri aynı çıktıyı vermeli")
	}
	// Tercih edilen varsayılan çakışırsa ilk çakışmasız kombinasyon seçilir.
	by := lppFixture(t)
	var kim []lppSection
	for _, s := range by["KIM 101E"] {
		if s.CRN != "10276" {
			kim = append(kim, s)
		}
	}
	by["KIM 101E"] = kim
	d := mustDemo(t, by)
	pick := []string{}
	for _, c := range d.Courses {
		pick = append(pick, c.Def)
	}
	if _, pairs := lppLayout(d.Courses, pick); len(pairs) != 0 {
		t.Fatalf("yedek varsayılan çakışmamalı: %v", pick)
	}
	// Veri yoksa örnek üretilmez.
	if _, ok := buildProgramDemo(map[string][]lppSection{}, "x"); ok {
		t.Fatal("boş veriyle örnek kurulmamalı")
	}
}

func mustDemo(t *testing.T, by map[string][]lppSection) lppDemo {
	t.Helper()
	d, ok := buildProgramDemo(by, "2026-2027 Güz")
	if !ok {
		t.Fatal("örnek kurulamadı")
	}
	return d
}

func TestProgramDemoHTML(t *testing.T) {
	d := mustDemo(t, lppFixture(t))
	tr := renderProgramDemo(d, false)
	for _, want := range []string{
		`<option value="10232" selected>10232 · Sal 14:30, Çar 11:30 · 124/140</option>`,
		`10451 · Pzt 14:30 · 140/140 dolu`,
		`10005 · Cum 10:30 · 11/40 · TUR 102`,
		`Nalan Antar`, `16 yer`, `>dolu<`,
		`Çakışma yok.`, `lpp-status--ok`, `Dersleri ekle`, `Çakışmaları çöz`, `Dışa aktar`,
		`href="/#program"`, `Örnek çakışmayı göster`, `Varsayılana dön`,
		`KIM 101E şubesini 10261 (Pazartesi 14:30) yapar; FIZ 101E ile çakışır.`,
		`<b>MAT<span class="lpp-num"> 103E</span></b>`, `2026-2027 Güz şubeleriyle`, `<b>13</b> saat/hafta`, `CRN <b>10232 10451 10276 10003</b>`,
	} {
		if !strings.Contains(tr, want) {
			t.Errorf("TR çıktıda yok: %s", want)
		}
	}
	if strings.Contains(tr, "—") {
		t.Error("kullanıcı metninde em-dash olmamalı")
	}
	if strings.Contains(tr, `lpp-blk--clash"`) {
		t.Error("varsayılan çizelgede çakışma bloğu olmamalı")
	}
	en := renderProgramDemo(d, true)
	for _, want := range []string{`Mon 14:30`, `No conflicts.`, `Add courses`, `16 left`, `>full<`, `Show a sample conflict`, `hours/week`} {
		if !strings.Contains(en, want) {
			t.Errorf("EN çıktıda yok: %s", want)
		}
	}
	for _, bad := range []string{"Çakışma yok", "Dersleri ekle", "saat/hafta", "—"} {
		if strings.Contains(en, bad) {
			t.Errorf("EN çıktı TR/yasak metin sızdırıyor: %s", bad)
		}
	}
	// Status metni çakışmada beklenen biçimde.
	pick := []string{"10232", "10451", "10261", "10003"}
	blocks, pairs := lppLayout(d.Courses, pick)
	_, inner := lppStatusHTML(blocks, pairs, lppTextTR)
	if !strings.Contains(inner, "1 çakışma:</b> FIZ 101E (10451) ile KIM 101E (10261), Pazartesi 14:30–17:30") {
		t.Errorf("çakışma notu: %s", inner)
	}
}

func TestProgramDemoOnLandingPage(t *testing.T) {
	root := t.TempDir()
	slug := "2026-2027-guz"
	dir := filepath.Join(root, "data", "terms", slug)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	raw, _ := json.Marshal(lppFixtureRows())
	if err := os.WriteFile(filepath.Join(dir, "search.json"), raw, 0o644); err != nil {
		t.Fatal(err)
	}
	var page landingPage
	for _, p := range landingPages {
		if p.slug == "ders-programi-olustur" {
			page = p
		}
	}
	bTR := &Builder{root: root, outRoot: root, l: langTR, version: "test"}
	bTR.index.CurrentSlug, bTR.index.CurrentTerm = slug, "2026-2027 Güz Dönemi"
	if err := bTR.writeLandingRoute(page); err != nil {
		t.Fatal(err)
	}
	html, err := os.ReadFile(filepath.Join(root, "ders-programi-olustur", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(html), `id="lpp"`) || !strings.Contains(string(html), `href="/#program"`) {
		t.Fatal("TR sayfasında örnek veya /#program bağlantısı yok")
	}
	enRoot := filepath.Join(root, "en")
	bEN := &Builder{root: root, outRoot: enRoot, l: langEN, version: "test"}
	bEN.index = bTR.index
	if err := bEN.writeLandingRoute(page); err != nil {
		t.Fatal(err)
	}
	enHTML, err := os.ReadFile(filepath.Join(enRoot, "schedule-builder", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(enHTML), "2026-2027 Fall") || !strings.Contains(string(enHTML), "No conflicts.") {
		t.Fatal("EN sayfasında örnek İngilizce değil")
	}
}
