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
