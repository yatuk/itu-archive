package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPatchIndexAssetsReplacesExistingVersions(t *testing.T) {
	dir := t.TempDir()
	index := `<link rel="stylesheet" href="assets/style.css?v=old-css">` +
		`<script type="module" src="assets/app.js?v=old-js"></script>`
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte(index), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := patchIndexAssets(dir, "new1234"); err != nil {
		t.Fatal(err)
	}
	b, err := os.ReadFile(filepath.Join(dir, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	got := string(b)
	for _, want := range []string{
		`href="assets/style.css?v=new1234"`,
		`src="assets/app.js?v=new1234"`,
	} {
		if !strings.Contains(got, want) {
			t.Fatalf("güncel asset sürümü yok: %s\n%s", want, got)
		}
	}
	if strings.Contains(got, "old-") {
		t.Fatalf("eski asset sürümü kaldı: %s", got)
	}
}

func TestReplaceAssetVersionAddsMissingVersion(t *testing.T) {
	got := replaceAssetVersion(`href="assets/style.css"`, `href="assets/style.css`, "abc1234")
	if want := `href="assets/style.css?v=abc1234"`; got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}

func TestHomepageUsesCurrentSocialCard(t *testing.T) {
	root := filepath.Join("..", "..", "docs")
	body, err := os.ReadFile(filepath.Join(root, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	html := string(body)
	for _, want := range []string{
		`property="og:image" content="https://itu-ders.com/social-card-v2.png"`,
		`name="twitter:image" content="https://itu-ders.com/social-card-v2.png"`,
		`property="og:image:width" content="1731"`,
		`property="og:image:height" content="909"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("ana sayfada sosyal kart metası eksik: %s", want)
		}
	}
	if strings.Contains(html, "glitch_effect.gif") {
		t.Fatal("ana sayfa hâlâ eski glitch görselini paylaşıyor")
	}
	info, err := os.Stat(filepath.Join(root, "social-card-v2.png"))
	if err != nil {
		t.Fatalf("sosyal kart dosyası bulunamadı: %v", err)
	}
	if info.Size() == 0 {
		t.Fatal("sosyal kart dosyası boş")
	}
}

func TestDataWorkflowsRegenerateAndCommitSite(t *testing.T) {
	root := filepath.Join("..", "..", ".github", "workflows")
	for _, name := range []string{
		"scrape-full.yml", "scrape-light.yml", "quota.yml", "catalog.yml",
		"curriculum.yml", "grades.yml", "definitions.yml",
	} {
		body, err := os.ReadFile(filepath.Join(root, name))
		if err != nil {
			t.Fatalf("%s okunamadı: %v", name, err)
		}
		text := string(body)
		for _, required := range []string{"go run ./cmd/site", "git add docs"} {
			if !strings.Contains(text, required) {
				t.Errorf("%s veri ve SEO çıktısını aynı commit'e almıyor; %q eksik", name, required)
			}
		}
	}
}

func TestQualityWorkflowOwnsSingleSiteDriftCheck(t *testing.T) {
	root := filepath.Join("..", "..", ".github", "workflows")
	quality, err := os.ReadFile(filepath.Join(root, "test.yml"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(quality), "git diff --exit-code -- docs") {
		t.Fatal("test.yml deterministik site drift denetimini içermiyor")
	}
	if _, err := os.Stat(filepath.Join(root, "site.yml")); !os.IsNotExist(err) {
		t.Fatalf("site.yml yinelenen kalite işini yeniden oluşturuyor: %v", err)
	}
}
