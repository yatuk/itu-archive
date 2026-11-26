package validate

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// noindex sayfalar (ör. docs/status/index.html) arama motoru için değil —
// operasyonel durum sayfaları. SEO tamlık kuralları (description/canonical/
// tekil H1) bunlara uygulanmamalı; kendi robots meta'sıyla zaten kapsam
// dışı olduklarını bildiriyorlar. Yaşanmış hata: CI'da bu sayfa yüzünden
// "description yok"/"canonical yok" hatası veriyordu.
func TestCheckGeneratedSEOMetadataSkipsNoindex(t *testing.T) {
	root := t.TempDir()

	statusDir := filepath.Join(root, "status")
	if err := os.MkdirAll(statusDir, 0o755); err != nil {
		t.Fatal(err)
	}
	statusHTML := `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Durum</title>
</head>
<body><p>ölçüm sayfası, description/canonical yok</p></body>
</html>`
	if err := os.WriteFile(filepath.Join(statusDir, "index.html"), []byte(statusHTML), 0o644); err != nil {
		t.Fatal(err)
	}

	seoDir := filepath.Join(root, "ders", "blg-101e")
	if err := os.MkdirAll(seoDir, 0o755); err != nil {
		t.Fatal(err)
	}
	seoHTML := `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="robots" content="index, follow">
<title>BLG 101E</title>
<meta name="description" content="BLG 101E ders sayfası.">
<link rel="canonical" href="https://itu-ders.com/ders/blg-101e/">
</head>
<body><h1>BLG 101E</h1></body>
</html>`
	if err := os.WriteFile(filepath.Join(seoDir, "index.html"), []byte(seoHTML), 0o644); err != nil {
		t.Fatal(err)
	}

	r := &Result{}
	r.checkGeneratedSEOMetadata(root)

	for _, e := range r.Errors {
		t.Errorf("noindex sayfa SEO kontrolünden muaf olmalıydı, hata alındı: %s", e)
	}
}

// hreflang bir noindex sayfaya işaret ederse Google kümeyi geçersiz sayar.
// /en/brans/<KOD>/ noindex olduğundan TR /brans/<KOD>/ ona hreflang vermemeli;
// veren bir sayfa hata olarak yakalanmalı ve noindex URL kümesi dönmeli.
func TestCheckGeneratedSEOMetadataRejectsHreflangToNoindex(t *testing.T) {
	root := t.TempDir()
	write := func(rel, html string) {
		t.Helper()
		p := filepath.Join(root, filepath.FromSlash(rel), "index.html")
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, []byte(html), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	write("en/brans/ELK", `<!doctype html>
<html lang="en"><head>
<title>ELK courses</title>
<meta name="description" content="ELK courses.">
<link rel="canonical" href="https://itu-ders.com/en/brans/ELK/">
<meta name="robots" content="noindex, follow">
</head><body><h1>ELK</h1></body></html>`)
	write("brans/ELK", `<!doctype html>
<html lang="tr"><head>
<title>ELK dersleri</title>
<meta name="description" content="ELK dersleri.">
<link rel="canonical" href="https://itu-ders.com/brans/ELK/">
<link rel="alternate" hreflang="tr" href="https://itu-ders.com/brans/ELK/">
<link rel="alternate" hreflang="en" href="https://itu-ders.com/en/brans/ELK/">
<link rel="alternate" hreflang="x-default" href="https://itu-ders.com/brans/ELK/">
<meta name="robots" content="index, follow">
</head><body><h1>ELK</h1></body></html>`)

	r := &Result{}
	noindex := r.checkGeneratedSEOMetadata(root)
	if !noindex["https://itu-ders.com/en/brans/ELK/"] {
		t.Fatalf("noindex kümesi EN branş sayfasını içermeli: %v", noindex)
	}
	if len(r.Errors) != 1 || !strings.Contains(r.Errors[0], "noindex sayfaya işaret ediyor") {
		t.Fatalf("tek bir hreflang→noindex hatası bekleniyordu, alınan: %v", r.Errors)
	}
}
