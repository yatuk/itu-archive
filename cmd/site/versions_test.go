package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeAssetTree(t *testing.T, files map[string]string) string {
	t.Helper()
	dir := t.TempDir()
	for rel, body := range files {
		p := filepath.Join(dir, "assets", filepath.FromSlash(rel))
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	return dir
}

func readAsset(t *testing.T, dir, rel string) string {
	t.Helper()
	b, err := os.ReadFile(filepath.Join(dir, "assets", filepath.FromSlash(rel)))
	if err != nil {
		t.Fatal(err)
	}
	return string(b)
}

func writeAsset(t *testing.T, dir, rel, body string) {
	t.Helper()
	if err := os.WriteFile(filepath.Join(dir, "assets", filepath.FromSlash(rel)), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

// Her dosyanın sürümü kendi içeriğinden gelir; JS modülünün sürümü
// importlarının sürümünü de (dolaylı olarak) kapsar.
func TestAssetVersionsArePerFileMerkle(t *testing.T) {
	dir := writeAssetTree(t, map[string]string{
		"style.css":         "body{color:black}",
		"css/program.css":   ".p-x{color:red}",
		"app.js":            `import{a}from"./core/a.js?v=old";const s=new URL("./css/program.css",import.meta.url);`,
		"core/a.js":         `import{b}from"./b.js";export const a=b;`,
		"core/b.js":         `export const b=1;`,
		"other.js":          `export const o=1;`,
		"core/core.test.js": `import"./a.js";`,
	})
	v1, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := v1["core/core.test.js"]; ok {
		t.Fatal("test dosyası sürümlenmemeli")
	}
	seen := map[string]string{}
	for rel, v := range v1 {
		if len(v) != assetVersionLen {
			t.Fatalf("%s sürümü %d karakter olmalı: %q", rel, assetVersionLen, v)
		}
		if other, dup := seen[v]; dup {
			t.Fatalf("%s ve %s aynı sürümü aldı: %s", rel, other, v)
		}
		seen[v] = rel
	}
	app := readAsset(t, dir, "app.js")
	for _, want := range []string{
		`"./core/a.js?v=` + v1["core/a.js"] + `"`,
		`"./css/program.css?v=` + v1["css/program.css"] + `"`,
	} {
		if !strings.Contains(app, want) {
			t.Fatalf("app.js hedefin kendi sürümünü taşımıyor: %s\n%s", want, app)
		}
	}
	if a := readAsset(t, dir, "core/a.js"); !strings.Contains(a, `"./b.js?v=`+v1["core/b.js"]+`"`) {
		t.Fatalf("a.js, b.js sürümünü taşımıyor:\n%s", a)
	}

	// Yalnız CSS değişince yalnız o CSS ve onu adresleyen JS (app.js) değişir.
	writeAsset(t, dir, "style.css", "body{color:white}")
	v2, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	for rel := range v1 {
		changed := v1[rel] != v2[rel]
		if want := rel == "style.css"; changed != want {
			t.Fatalf("style.css değişikliğinde %s değişti=%v (beklenen %v)", rel, changed, want)
		}
	}

	// Derindeki bağımlılık değişince onu doğrudan/dolaylı içe aktaranlar değişir.
	writeAsset(t, dir, "core/b.js", `export const b=2;`)
	v3, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	for rel := range v2 {
		changed := v2[rel] != v3[rel]
		want := rel == "core/b.js" || rel == "core/a.js" || rel == "app.js"
		if changed != want {
			t.Fatalf("b.js değişikliğinde %s değişti=%v (beklenen %v)", rel, changed, want)
		}
	}

	// Değişiklik yokken yeniden çalıştırmak ne sürümü ne içeriği oynatır.
	before := readAsset(t, dir, "app.js")
	v4, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	for rel := range v3 {
		if v3[rel] != v4[rel] {
			t.Fatalf("ikinci çalıştırmada %s sürümü değişti", rel)
		}
	}
	if after := readAsset(t, dir, "app.js"); after != before {
		t.Fatalf("ikinci çalıştırma app.js içeriğini değiştirdi:\n%s\n%s", before, after)
	}
}

// Döngüsel importlar tek bileşen olarak özetlenir: döngüdeki herhangi bir
// modülün değişmesi hepsinin sürümünü değiştirir, dışarıdakileri değiştirmez.
func TestAssetVersionsHandleImportCycles(t *testing.T) {
	dir := writeAssetTree(t, map[string]string{
		"app.js":        `import"./views/x.js";`,
		"views/x.js":    `import"./y.js";export const x=1;`,
		"views/y.js":    `export const y=()=>import("./x.js");`,
		"views/solo.js": `export const s=1;`,
	})
	v1, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	if v1["views/x.js"] != v1["views/y.js"] {
		t.Fatalf("döngüdeki modüller aynı sürümü paylaşmalı: %v", v1)
	}
	writeAsset(t, dir, "views/y.js", `export const y=()=>import("./x.js");export const z=2;`)
	v2, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	for _, rel := range []string{"views/x.js", "views/y.js", "app.js"} {
		if v1[rel] == v2[rel] {
			t.Fatalf("döngü değişince %s sürümü değişmeliydi", rel)
		}
	}
	if v1["views/solo.js"] != v2["views/solo.js"] {
		t.Fatal("ilgisiz modülün sürümü değişmemeliydi")
	}
	if y := readAsset(t, dir, "views/y.js"); !strings.Contains(y, `import("./x.js?v=`+v2["views/x.js"]+`")`) {
		t.Fatalf("dinamik import sürümlenmedi:\n%s", y)
	}
}

func TestAssetVersionsRejectMissingImport(t *testing.T) {
	dir := writeAssetTree(t, map[string]string{"app.js": `import"./yok.js";`})
	if _, err := stampAssetVersions(dir, ""); err == nil || !strings.Contains(err.Error(), "yok.js") {
		t.Fatalf("eksik import hatası beklenirdi, alınan: %v", err)
	}
}

// -assets-only, üretilmiş sayfaların ?v= bağlantılarını şablonun yazacağı
// biçimde yeniler; haritada olmayan dosyalara dokunmaz.
func TestPatchHTMLAssetRefsMatchesTemplateOutput(t *testing.T) {
	versions := map[string]string{"style.css": "aaaaaaaaaaaa", "static-page.js": "bbbbbbbbbbbb", "css/app.css": "cccccccccccc"}
	in := `<link rel="stylesheet" href="/assets/style.css?v=old">` +
		`<script src="/assets/static-page.js?v=old" defer></script>` +
		`<link rel="stylesheet" href="assets/css/app.css">` +
		`<link rel="preload" href="assets/vendor/fonts/x.woff2" as="font">` +
		`<script src="/assets/unknown.js?v=keep"></script>`
	want := `<link rel="stylesheet" href="/assets/style.css?v=aaaaaaaaaaaa">` +
		`<script src="/assets/static-page.js?v=bbbbbbbbbbbb" defer></script>` +
		`<link rel="stylesheet" href="assets/css/app.css?v=cccccccccccc">` +
		`<link rel="preload" href="assets/vendor/fonts/x.woff2" as="font">` +
		`<script src="/assets/unknown.js?v=keep"></script>`
	if got := patchHTMLAssetRefs(in, versions); got != want {
		t.Fatalf("got  %s\nwant %s", got, want)
	}
}
