package notes

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"itu-scraper/internal/model"
)

func validNote() model.Note {
	return model.Note{
		ID: "blg-102e-01", Code: "BLG 102E", Branch: "BLG",
		Title: "Vize özeti", URL: "https://drive.google.com/file/d/abc/view",
		Host: "drive.google.com", Kind: "ozet", License: "CC-BY",
		AddedAt: "2026-08-16T10:00:00Z",
	}
}

func TestNormalizeCode(t *testing.T) {
	cases := map[string]string{
		"blg 102e":  "BLG 102E",
		"BLG102E":   "BLG 102E",
		"  mat 101": "MAT 101",
		"blg  102e": "BLG 102E",
		"":          "",
	}
	for in, want := range cases {
		if got := NormalizeCode(in); got != want {
			t.Errorf("NormalizeCode(%q) = %q, beklenen %q", in, got, want)
		}
	}
}

// Türkçe yerelinde "i" büyütülünce "I" olur ve kod eşleşmez; ders kodları
// ASCII kuralıyla büyütülmeli.
func TestNormalizeCodeTurkishI(t *testing.T) {
	if got := NormalizeCode("ins 101"); got != "İNS 101" {
		t.Errorf("i -> İ bekleniyordu, got %q", got)
	}
}

func TestCodeSlug(t *testing.T) {
	cases := map[string]string{
		"BLG 102E": "blg-102e",
		"MAT 101":  "mat-101",
		"STD YET":  "std-yet",
	}
	for in, want := range cases {
		if got := CodeSlug(in); got != want {
			t.Errorf("CodeSlug(%q) = %q, beklenen %q", in, got, want)
		}
	}
}

func TestValidateAcceptsGoodNote(t *testing.T) {
	if err := Validate(validNote(), nil); err != nil {
		t.Fatalf("geçerli kayıt reddedildi: %v", err)
	}
}

func TestValidateRejects(t *testing.T) {
	tests := []struct {
		name   string
		mutate func(*model.Note)
	}{
		{"kod biçimi", func(n *model.Note) { n.Code = "BLG102E" }},
		{"boş başlık", func(n *model.Note) { n.Title = "  " }},
		{"http bağlantı", func(n *model.Note) { n.URL = "http://drive.google.com/x" }},
		{"bozuk bağlantı", func(n *model.Note) { n.URL = "drive.google.com/x" }},
		{"tür", func(n *model.Note) { n.Kind = "kitap" }},
		{"lisans yok", func(n *model.Note) { n.License = "" }},
		{"lisans geçersiz", func(n *model.Note) { n.License = "telifli" }},
		{"dil", func(n *model.Note) { n.Language = "de" }},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			n := validNote()
			tc.mutate(&n)
			if err := Validate(n, nil); err == nil {
				t.Fatalf("%s: hata bekleniyordu", tc.name)
			}
		})
	}
}

// Lisans beyanı olmadan kayıt yazılamaz — telif ayrımının veri modelindeki
// karşılığı bu, kaybolursa özellik korsan deposuna dönüşür.
func TestValidateLicenseIsMandatory(t *testing.T) {
	n := validNote()
	n.License = ""
	if err := Validate(n, nil); err == nil {
		t.Fatal("lisanssız kayıt kabul edildi")
	}
}

func TestValidateUnknownCourse(t *testing.T) {
	known := map[string]struct{}{"MAT 101": {}}
	if err := Validate(validNote(), known); err == nil {
		t.Fatal("arşivde olmayan ders kodu kabul edildi")
	}
	n := validNote()
	n.Code = "MAT 101"
	if err := Validate(n, known); err != nil {
		t.Fatalf("bilinen ders reddedildi: %v", err)
	}
}

func TestHostOf(t *testing.T) {
	cases := map[string]string{
		"https://drive.google.com/file/d/x": "drive.google.com",
		"https://WWW.Notion.so/abc":         "notion.so",
		"bozuk":                             "",
	}
	for in, want := range cases {
		if got := HostOf(in); got != want {
			t.Errorf("HostOf(%q) = %q, beklenen %q", in, got, want)
		}
	}
}

// Kimlikler yeniden kullanılmaz: aradaki kayıt silinse bile yeni not en
// büyüğün üstünden devam eder (eski bağlantılar başka nota düşmesin).
func TestNextIDDoesNotReuse(t *testing.T) {
	list := []model.Note{
		{ID: "blg-102e-01", Code: "BLG 102E"},
		{ID: "blg-102e-03", Code: "BLG 102E"},
		{ID: "mat-101-01", Code: "MAT 101"},
	}
	if got := NextID("BLG 102E", list); got != "blg-102e-04" {
		t.Errorf("NextID = %q, beklenen blg-102e-04", got)
	}
	if got := NextID("FIZ 101", list); got != "fiz-101-01" {
		t.Errorf("ilk kayıt için NextID = %q, beklenen fiz-101-01", got)
	}
}

func TestDuplicate(t *testing.T) {
	list := []model.Note{validNote()}
	if !Duplicate(list, "BLG 102E", "https://drive.google.com/file/d/abc/view/") {
		t.Error("sondaki / farkına rağmen kopya sayılmalı")
	}
	if Duplicate(list, "MAT 101", "https://drive.google.com/file/d/abc/view") {
		t.Error("farklı ders kopya sayılmamalı")
	}
}

const issueBody = `### Ders kodu

blg 102e

### Başlık

2025 Güz vize özeti

### Bağlantı

https://drive.google.com/file/d/abc/view

### Tür

ozet · ders özeti

### Lisans

CC-BY · atıfla kullanılabilir

### Dönem

2025-2026-guz

### Öğretim üyesi

_No response_

### Dil

Türkçe

### Takma ad

anon42
`

func TestParseIssueBody(t *testing.T) {
	f := ParseIssueBody(issueBody)
	if f["ders kodu"] != "blg 102e" {
		t.Errorf("ders kodu = %q", f["ders kodu"])
	}
	if f["başlık"] != "2025 Güz vize özeti" {
		t.Errorf("başlık = %q", f["başlık"])
	}
	// Doldurulmamış opsiyonel alan boş dizeye düşmeli.
	if f["öğretim üyesi"] != "" {
		t.Errorf("_No response_ boşa düşmedi: %q", f["öğretim üyesi"])
	}
}

func TestParseIssueBodyCRLF(t *testing.T) {
	f := ParseIssueBody("### Ders kodu\r\n\r\nBLG 102E\r\n")
	if f["ders kodu"] != "BLG 102E" {
		t.Errorf("CRLF gövde ayrıştırılamadı: %q", f["ders kodu"])
	}
}

func TestFromIssue(t *testing.T) {
	n := FromIssue(ParseIssueBody(issueBody))
	if n.Code != "BLG 102E" {
		t.Errorf("Code = %q", n.Code)
	}
	if n.Branch != "BLG" {
		t.Errorf("Branch = %q", n.Branch)
	}
	if n.Kind != "ozet" {
		t.Errorf("Kind = %q (açıklamalı seçim ayrıştırılmalı)", n.Kind)
	}
	if n.License != "CC-BY" {
		t.Errorf("License = %q", n.License)
	}
	if n.Language != "tr" {
		t.Errorf("Language = %q (Türkçe -> tr)", n.Language)
	}
	if n.Host != "drive.google.com" {
		t.Errorf("Host = %q", n.Host)
	}
	if n.Instructor != "" {
		t.Errorf("boş alan taşındı: %q", n.Instructor)
	}
	if err := Validate(n, nil); err != nil {
		t.Fatalf("issue'dan gelen kayıt doğrulamayı geçmedi: %v", err)
	}
}

func TestSaveLoadRoundTrip(t *testing.T) {
	root := t.TempDir()
	in := []model.Note{
		{ID: "blg-102e-02", Code: "BLG 102E", Branch: "BLG", Title: "b", URL: "https://x.tr/2", Kind: "ozet", License: "CC0", AddedAt: "2026-01-01T00:00:00Z"},
		{ID: "blg-101e-01", Code: "BLG 101E", Branch: "BLG", Title: "a", URL: "https://x.tr/1", Kind: "ozet", License: "CC0", AddedAt: "2026-01-01T00:00:00Z"},
	}
	if err := SaveBranch(root, "BLG", in); err != nil {
		t.Fatal(err)
	}
	out, err := LoadBranch(root, "BLG")
	if err != nil {
		t.Fatal(err)
	}
	if len(out) != 2 {
		t.Fatalf("%d kayıt döndü", len(out))
	}
	// Kararlı sıra: ders koduna göre — diff okunabilir kalsın.
	if out[0].Code != "BLG 101E" {
		t.Errorf("sıra bozuk: ilk kayıt %q", out[0].Code)
	}
}

func TestLoadBranchMissingFileIsNotError(t *testing.T) {
	list, err := LoadBranch(t.TempDir(), "YOK")
	if err != nil {
		t.Fatalf("dosya yokken hata döndü: %v", err)
	}
	if len(list) != 0 {
		t.Fatalf("boş liste bekleniyordu")
	}
}

func TestWriteIndex(t *testing.T) {
	root := t.TempDir()
	all := []model.Note{
		{Code: "BLG 102E", Branch: "BLG"},
		{Code: "BLG 102E", Branch: "BLG", Dead: true},
		{Code: "MAT 101", Branch: "MAT"},
	}
	if err := WriteIndex(root, all, time.Unix(0, 0)); err != nil {
		t.Fatal(err)
	}
	b, err := os.ReadFile(filepath.Join(Dir(root), "index.json"))
	if err != nil {
		t.Fatal(err)
	}
	var idx model.NotesIndex
	if err := json.Unmarshal(b, &idx); err != nil {
		t.Fatal(err)
	}
	if idx.Notes != 3 || idx.Branches != 2 || idx.Courses != 2 || idx.Dead != 1 {
		t.Errorf("özet yanlış: %+v", idx)
	}
}

// 404 ölü sayılır; geçici hata (5xx) kaydı BOZMAZ — yanlış "ölü" işareti,
// çalışan bir bağlantıyı gizlemekten daha kötü.
func TestCheckStatusHandling(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/ok":
			w.WriteHeader(http.StatusOK)
		case "/gone":
			w.WriteHeader(http.StatusNotFound)
		case "/flaky":
			w.WriteHeader(http.StatusInternalServerError)
		case "/nohead":
			if r.Method == http.MethodHead {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			w.WriteHeader(http.StatusOK)
		}
	}))
	defer srv.Close()

	cl := srv.Client()
	ctx := context.Background()
	if r := Check(ctx, cl, srv.URL+"/ok"); !r.Alive {
		t.Error("200 canlı olmalı")
	}
	if r := Check(ctx, cl, srv.URL+"/gone"); r.Alive {
		t.Error("404 ölü olmalı")
	}
	if r := Check(ctx, cl, srv.URL+"/flaky"); !r.Alive {
		t.Error("5xx ölü sayılmamalı (geçici hata)")
	}
	if r := Check(ctx, cl, srv.URL+"/nohead"); !r.Alive {
		t.Error("HEAD desteklemeyen sunucuda GET'e düşmeli")
	}
}

// Regresyon: "CC-BY-SA" değeri "CC-BY" ile de prefix eşleşir. Sırayla eşleşen
// bir uygulama katkıcının seçtiği ShareAlike şartını sessizce DÜŞÜRÜYORDU.
// Lisansı yanlış kaydetmek bu özellikteki en pahalı hata; en uzun eşleşme şart.
func TestNormalizeLicenseLongestMatch(t *testing.T) {
	cases := map[string]string{
		"CC-BY-SA · atıfla, aynı lisansla": "CC-BY-SA",
		"CC-BY · atıfla kullanılabilir":    "CC-BY",
		"CC0 · tamamen serbest":            "CC0",
		"cc-by-sa":                         "CC-BY-SA",
		"CC-BY-SA":                         "CC-BY-SA",
	}
	for in, want := range cases {
		if got := normalizeLicense(in); got != want {
			t.Errorf("normalizeLicense(%q) = %q, beklenen %q", in, got, want)
		}
	}
}

func TestFromIssueKeepsShareAlike(t *testing.T) {
	body := "### Ders kodu\n\nBLG 102E\n\n### Başlık\n\nx\n\n### Bağlantı\n\nhttps://x.tr/a\n\n" +
		"### Tür\n\nozet · ders özeti\n\n### Lisans\n\nCC-BY-SA · atıfla, aynı lisansla\n"
	n := FromIssue(ParseIssueBody(body))
	if n.License != "CC-BY-SA" {
		t.Fatalf("License = %q, beklenen CC-BY-SA (ShareAlike düşürülmemeli)", n.License)
	}
}

// Tür anahtarlarında da aynı tuzak olmasın (bugün biri diğerinin ön eki değil,
// ama liste büyüyünce sessizce bozulmasın diye kural burada sabitleniyor).
func TestNormalizeChoiceLongestMatch(t *testing.T) {
	for _, k := range model.NoteKinds {
		if got := normalizeChoice(k + " · açıklama"); got != k {
			t.Errorf("normalizeChoice(%q…) = %q, beklenen %q", k, got, k)
		}
	}
}
