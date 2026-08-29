package validate

import (
	"os"
	"path/filepath"
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
