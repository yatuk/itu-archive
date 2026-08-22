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

func TestPatchRuntimeAssetImportsUsesOneReleaseVersion(t *testing.T) {
	dir := t.TempDir()
	assets := filepath.Join(dir, "assets", "views")
	if err := os.MkdirAll(assets, 0o755); err != nil {
		t.Fatal(err)
	}
	source := `import { a } from '../core/a.js';
import { b } from "../core/b.js?v=old";
const c = import('../core/c.js?v=older');
import { remote } from 'https://cdn.example.com/remote.js';`
	path := filepath.Join(assets, "screen.js")
	if err := os.WriteFile(path, []byte(source), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := patchRuntimeAssetImports(dir, "release123"); err != nil {
		t.Fatal(err)
	}
	b, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	got := string(b)
	for _, want := range []string{
		`'../core/a.js?v=release123'`,
		`"../core/b.js?v=release123"`,
		`'../core/c.js?v=release123'`,
	} {
		if !strings.Contains(got, want) {
			t.Fatalf("tek yayın sürümü eksik: %s\n%s", want, got)
		}
	}
	if !strings.Contains(got, `'https://cdn.example.com/remote.js'`) {
		t.Fatalf("harici modül adresi değiştirilmemeliydi:\n%s", got)
	}
}

func TestContentAssetVersionIsStableAfterImportPatching(t *testing.T) {
	dir := t.TempDir()
	assets := filepath.Join(dir, "assets")
	if err := os.MkdirAll(filepath.Join(assets, "core"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(assets, "style.css"), []byte("body{color:black}"), 0o644); err != nil {
		t.Fatal(err)
	}
	app := filepath.Join(assets, "app.js")
	if err := os.WriteFile(app, []byte(`import './core/a.js?v=old';`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(assets, "core", "a.js"), []byte(`export const a = 1;`), 0o644); err != nil {
		t.Fatal(err)
	}

	before, err := contentAssetVersion(dir)
	if err != nil {
		t.Fatal(err)
	}
	if err := patchRuntimeAssetImports(dir, before); err != nil {
		t.Fatal(err)
	}
	after, err := contentAssetVersion(dir)
	if err != nil {
		t.Fatal(err)
	}
	if before != after {
		t.Fatalf("import sürümleme içerik hash'ini değiştirdi: %s != %s", before, after)
	}

	if err := os.WriteFile(filepath.Join(assets, "core", "a.js"), []byte(`export const a = 2;`), 0o644); err != nil {
		t.Fatal(err)
	}
	changed, err := contentAssetVersion(dir)
	if err != nil {
		t.Fatal(err)
	}
	if changed == before {
		t.Fatal("çalışma-zamanı içeriği değiştiği halde asset sürümü değişmedi")
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
