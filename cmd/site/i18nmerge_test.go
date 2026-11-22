package main

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

// Derlenen en.js, eski `en[k] || tr[k] || k` düşüşünü taşımalı: boş ya da
// eksik İngilizce anahtar Türkçe değeri alır, dolu olan kendi değerini korur.
func TestMergeI18nFallbackFillsEmptyAndMissingKeys(t *testing.T) {
	tr := "// tr\nexport default {\n  a: 'A tr',\n  b: 'B tr',\n  // yorum\n  c: \"C \\\"tr\\\"\",\n  d: 'D tr',\n  e: '',\n};\n"
	en := "export default {\n  a: 'A en',\n  b: '',\n\n  e: '',\n  x: 'only en',\n};\n"
	out, err := mergeI18nFallback([]byte(tr), []byte(en))
	if err != nil {
		t.Fatal(err)
	}
	got, err := parseI18nDict("out", out)
	if err != nil {
		t.Fatalf("birleşik sözlük yeniden okunamadı: %v\n%s", err, out)
	}
	want := map[string]string{
		"a": "'A en'",     // dolu İngilizce korunur
		"b": "'B tr'",     // boş İngilizce Türkçeye düşer
		"c": `"C \"tr\""`, // eksik anahtar kaçışlarıyla aynen eklenir
		"d": "'D tr'",     // eksik anahtar eklenir
		"e": "''",         // iki dilde de boş: t() anahtarı döndürür, eskisi gibi
		"x": "'only en'",  // yalnız İngilizcede olan kalır
	}
	if len(got.byKey) != len(want) {
		t.Fatalf("anahtar sayısı %d, beklenen %d\n%s", len(got.byKey), len(want), out)
	}
	for k, lit := range want {
		i, ok := got.byKey[k]
		if !ok || got.entries[i].literal != lit {
			t.Fatalf("%s = %v, beklenen %s\n%s", k, got.entries, lit, out)
		}
	}
}

// Son yazan kazanır (JS nesne değişmezi gibi); tanınmayan satır sessizce
// atlanmaz, derleme hata verir.
func TestParseI18nDictRules(t *testing.T) {
	d, err := parseI18nDict("x", []byte("export default {\n  a: 'one',\n  a: '',\n};\n"))
	if err != nil {
		t.Fatal(err)
	}
	if d.entries[d.byKey["a"]].literal != "''" {
		t.Fatal("yinelenen anahtarda son girdi geçerli olmalı")
	}
	for name, src := range map[string]string{
		"çok satırlı":        "export default {\n  a: 'x' +\n    'y',\n};\n",
		"şablon metni":       "export default {\n  a: `x`,\n};\n",
		"virgülsüz":          "export default {\n  a: 'x'\n};\n",
		"kapanışsız":         "export default {\n  a: 'x',\n",
		"başka dışa aktarım": "export const a = {\n  a: 'x',\n};\n",
	} {
		if _, err := parseI18nDict(name, []byte(src)); err == nil {
			t.Fatalf("%s sözlüğü reddedilmeliydi", name)
		}
	}
}

// Gerçek kaynak sözlükler: ikisi de okunur, her Türkçe anahtar İngilizcede
// yazılıdır. Boş bırakılan İngilizce anahtarlar bilinçli düşüştür ve burada
// adıyla listelenir; yeni bir boş anahtar bu listeye eklenmeden geçmez.
func TestSourceI18nDictionariesParity(t *testing.T) {
	src := filepath.Join("..", "..", "assets-src")
	read := func(rel string) *i18nDict {
		b, err := os.ReadFile(filepath.Join(src, filepath.FromSlash(rel)))
		if err != nil {
			t.Fatal(err)
		}
		d, err := parseI18nDict(rel, b)
		if err != nil {
			t.Fatal(err)
		}
		return d
	}
	tr, en := read(i18nBaseDict), read(i18nFallbackDict)
	intentional := map[string]bool{}
	for key := range tr.byKey {
		i, ok := en.byKey[key]
		if !ok {
			t.Errorf("%s İngilizce sözlükte yok", key)
			continue
		}
		if emptyLiteral(en.entries[i].literal) && !intentional[key] {
			t.Errorf("%s İngilizcede boş; bilinçli düşüşse intentional listesine ekle", key)
		}
	}
	for key := range intentional {
		if i, ok := en.byKey[key]; !ok || !emptyLiteral(en.entries[i].literal) {
			t.Errorf("%s artık boş değil; intentional listesinden çıkar", key)
		}
	}
	for key := range en.byKey {
		if _, ok := tr.byKey[key]; !ok {
			t.Errorf("%s yalnız İngilizce sözlükte var", key)
		}
	}
}

// Sözlükler sabit adresli dinamik importla yüklenir; cmd/site onlara kendi
// ?v= sürümünü işler ve i18n.js'in sürümü sözlüklerinkini kapsar.
func TestI18nDictionariesAreVersioned(t *testing.T) {
	runtime := `import{readLocalState as r}from"./core/persistence.js";const d=(l==="en"?await import("./i18n/en.js"):await import("./i18n/tr.js")).default;`
	dir := writeAssetTree(t, map[string]string{
		"i18n.js":             runtime,
		"core/persistence.js": `export const r=1;`,
		"i18n/tr.js":          `export default{a:"A"};`,
		"i18n/en.js":          `export default{a:"B"};`,
	})
	v1, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	got := readAsset(t, dir, "i18n.js")
	for _, rel := range []string{"i18n/tr.js", "i18n/en.js"} {
		want := `import("./` + rel + `?v=` + v1[rel] + `")`
		if v1[rel] == "" || !strings.Contains(got, want) {
			t.Fatalf("i18n.js içinde %s yok:\n%s", want, got)
		}
	}
	writeAsset(t, dir, "i18n/en.js", `export default{a:"C"};`)
	v2, err := stampAssetVersions(dir, "")
	if err != nil {
		t.Fatal(err)
	}
	if v2["i18n/en.js"] == v1["i18n/en.js"] || v2["i18n.js"] == v1["i18n.js"] {
		t.Fatal("en.js değişince hem kendi hem i18n.js sürümü değişmeli")
	}
	if v2["i18n/tr.js"] != v1["i18n/tr.js"] {
		t.Fatal("en.js değişikliği tr.js sürümünü kırmamalı")
	}
	page := `<link rel="modulepreload" href="assets/i18n/tr.js" data-lang="tr"><link rel="modulepreload" href="assets/i18n/en.js?v=old" data-lang="en">`
	patched := patchHTMLAssetRefs(page, v2)
	for _, rel := range []string{"i18n/tr.js", "i18n/en.js"} {
		if !strings.Contains(patched, `href="assets/`+rel+`?v=`+v2[rel]+`"`) {
			t.Fatalf("modulepreload %s sürümlenmedi: %s", rel, patched)
		}
	}
}

// Yayındaki ana sayfa, i18n.js'in istediği sözlük adresleriyle birebir aynı
// adresleri önceden yükler (aksi halde sözlük iki kez iner).
func TestHomepagePreloadsVersionedI18nDictionaries(t *testing.T) {
	root := filepath.Join("..", "..", "docs")
	html, err := os.ReadFile(filepath.Join(root, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	js, err := os.ReadFile(filepath.Join(root, "assets", "i18n.js"))
	if err != nil {
		t.Fatal(err)
	}
	for _, lang := range []string{"tr", "en"} {
		re := regexp.MustCompile(`import\("\./i18n/` + lang + `\.js\?v=([0-9a-f]+)"\)`)
		m := re.FindSubmatch(js)
		if m == nil {
			t.Fatalf("docs/assets/i18n.js sürümlü %s sözlüğünü içe aktarmıyor", lang)
		}
		want := `href="assets/i18n/` + lang + `.js?v=` + string(m[1]) + `" data-lang="` + lang + `"`
		if !strings.Contains(string(html), want) {
			t.Fatalf("index.html %s sözlüğünü aynı sürümle önceden yüklemiyor: %s", lang, want)
		}
	}
}
