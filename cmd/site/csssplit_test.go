package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"testing"
)

func TestSplitCSSKeepsOrderAndWrapsMedia(t *testing.T) {
	buckets := []cssBucket{
		{name: "program", app: true, tokens: tokenRE("#view-program", ".p-"), shared: []string{".p-danger"}},
		{name: "pages", app: false, tokens: tokenRE(".seo-")},
	}
	in := `@font-face{font-family:x;src:url("a;b{.woff2"),url(vendor/f.woff2)}` +
		`:root{--a:1}` +
		`.p-a{color:red}` +
		`.tabs,.p-b{color:blue}` +
		`[data-theme=sade] #view-program .x{margin:0}` +
		`.p-danger{color:red}` +
		`.x:not(.p-a){color:green}` +
		`::-webkit-scrollbar,.p-e::-webkit-scrollbar{width:0}` +
		`.seo-hero{padding:0}` +
		`@media (max-width:600px){.p-c{top:0}.tabs{top:1px}.seo-x{top:2px}}` +
		`@keyframes k{0%{opacity:0}to{opacity:1}}` +
		`.p-d{content:"}"}`
	files, err := splitCSS(in, buckets)
	if err != nil {
		t.Fatal(err)
	}
	// Parçalar assets/css/ altında: göreli url()'ler bir üst dizine taşınır.
	wantCore := `@font-face{font-family:x;src:url("../a;b{.woff2"),url(../vendor/f.woff2)}` +
		`:root{--a:1}` +
		`.tabs{color:blue}` +
		`.p-danger{color:red}` +
		`.x:not(.p-a){color:green}` +
		`::-webkit-scrollbar,.p-e::-webkit-scrollbar{width:0}` +
		`@media (max-width:600px){.tabs{top:1px}}` +
		`@keyframes k{0%{opacity:0}to{opacity:1}}`
	// Karışık seçici listesi kovalara bölünür; sekme payı kaynak sırasında kalır.
	wantProgram := `.p-a{color:red}` +
		`.p-b{color:blue}` +
		`[data-theme=sade] #view-program .x{margin:0}` +
		`@media (max-width:600px){.p-c{top:0}}` +
		`.p-d{content:"}"}`
	if files["app"] != wantCore {
		t.Fatalf("çekirdek:\n got %s\nwant %s", files["app"], wantCore)
	}
	if files["program"] != wantProgram {
		t.Fatalf("program:\n got %s\nwant %s", files["program"], wantProgram)
	}
	if _, ok := files["pages"]; ok {
		t.Fatal("yalnız statik sayfa kovası uygulama dosyası üretmemeli")
	}
}

// Kova olmadan bölme girdiyi birebir geri üretmeli (ayrıştırıcı hiçbir kuralı
// kaybetmiyor, sırayı bozmuyor).
func TestSplitCSSRoundTripsRealStylesheet(t *testing.T) {
	full, err := os.ReadFile(filepath.Join("..", "..", "docs", "assets", "style.css"))
	if err != nil {
		t.Skip("docs/assets/style.css yok:", err)
	}
	files, err := splitCSS(string(full), nil)
	if err != nil {
		t.Fatal(err)
	}
	if files["app"] != rebaseCSSURLs(string(full)) {
		t.Fatal("ayrıştırıcı style.css'i birebir geri üretemedi")
	}
	parts, err := splitCSS(string(full), appCSSBuckets)
	if err != nil {
		t.Fatal(err)
	}
	var names []string
	total := 0
	for name, body := range parts {
		names = append(names, name)
		total += len(body)
		t.Logf("css/%s.css %d bayt", name, len(body))
	}
	sort.Strings(names)
	t.Logf("style.css %d bayt; uygulama parçaları (%s) toplamı %d bayt", len(full), strings.Join(names, ","), total)
	if len(parts["app"]) >= len(full) {
		t.Fatal("çekirdek CSS küçülmedi")
	}
}

// indexRegions, docs/index.html'i sekme bölgelerine ayırır: "index#view-x"
// (görünüm bölümü), "index#detail" (ders detay paneli) ve geri kalan "index#shell".
func indexRegions(html string) map[string]string {
	out := map[string]string{}
	starts := regexp.MustCompile(`<section id="view-([a-z]+)"`).FindAllStringSubmatchIndex(html, -1)
	mainEnd := strings.Index(html, "</main>")
	shell := html
	if len(starts) == 0 || mainEnd < 0 {
		out["index#shell"] = html
		return out
	}
	shell = html[:starts[0][0]]
	for i, m := range starts {
		end := mainEnd
		if i+1 < len(starts) {
			end = starts[i+1][0]
		}
		out["index#view-"+html[m[2]:m[3]]] = html[m[0]:end]
	}
	rest := html[mainEnd:]
	if ds := strings.Index(rest, `<div id="detail-panel"`); ds >= 0 {
		de := strings.Index(rest[ds:], "<footer")
		if de < 0 {
			de = len(rest) - ds
		}
		out["index#detail"] = rest[ds : ds+de]
		rest = rest[:ds] + rest[ds+de:]
	}
	out["index#shell"] = shell + rest
	return out
}

// bucketSelectorReads, kova adını yalnız seçici olarak OKUYAN (öğe üretmeyen)
// bilinen başvurular: app.js'in #dp-sems / #pg-root sorguları ve arama kutusu
// iyileştirmesinin .pg-search'ü bulması öğeye sınıf basmaz.
var bucketSelectorReads = map[string]map[string]bool{
	"assets-src/app.js": {".dp-sems": true, ".pg-root": true, ".pg-search": true},
}

// Bir sekme CSS parçasına giden sınıf/kimlikler yalnız o sekme yüklendikten
// sonra çalışan modüllerce (ve o görünümün HTML'inde) basılmalı; aksi halde
// parça henüz yüklenmemişken o öğe stilsiz görünür. Kabuk, Dersler ve diğer
// sekmelerin modülleri bu adları kullanmamalı — kullanıyorsa ad, cssBucket.shared
// listesine eklenip çekirdekte bırakılmalı.
func TestAppCSSBucketClassesOnlyRenderedByOwners(t *testing.T) {
	root := filepath.Join("..", "..")
	full, err := os.ReadFile(filepath.Join(root, "docs", "assets", "style.css"))
	if err != nil {
		t.Skip("docs/assets/style.css yok:", err)
	}
	nodes, err := parseCSS(string(full))
	if err != nil {
		t.Fatal(err)
	}
	names := make([]map[string]bool, len(appCSSBuckets))
	for i := range names {
		names[i] = map[string]bool{}
	}
	var collect func([]cssNode)
	collect = func(ns []cssNode) {
		for _, n := range ns {
			if n.group {
				collect(n.children)
				continue
			}
			for _, part := range ruleParts(n, appCSSBuckets) {
				bi := part.bucket
				if bi < 0 {
					continue
				}
				for _, sel := range part.selectors {
					s := stripFunctionalPseudos(sel)
					for _, tok := range appCSSBuckets[bi].tokens {
						for _, m := range tok.FindAllString(s, -1) {
							names[bi][m] = true
						}
					}
				}
			}
		}
	}
	collect(nodes)

	units := map[string]string{}
	add := func(rel string) {
		b, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(rel)))
		if err != nil {
			t.Fatal(err)
		}
		units[rel] = string(b)
	}
	for _, pattern := range []string{"assets-src/*.js", "assets-src/*/*.js", reactUI + "*.tsx"} {
		matches, err := filepath.Glob(filepath.Join(root, filepath.FromSlash(pattern)))
		if err != nil {
			t.Fatal(err)
		}
		for _, m := range matches {
			rel, _ := filepath.Rel(root, m)
			add(filepath.ToSlash(rel))
		}
	}
	index, err := os.ReadFile(filepath.Join(root, "docs", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	for k, v := range indexRegions(string(index)) {
		units[k] = v
	}

	var problems []string
	for bi, b := range appCSSBuckets {
		owner := map[string]bool{}
		for _, o := range b.owners {
			owner[o] = true
			if _, ok := units[o]; !ok {
				t.Errorf("%s kovasının sahibi bulunamadı: %s", b.name, o)
			}
		}
		list := make([]string, 0, len(names[bi]))
		for n := range names[bi] {
			list = append(list, n)
		}
		sort.Strings(list)
		for unit, text := range units {
			if owner[unit] {
				continue
			}
			for _, n := range list {
				bare := regexp.QuoteMeta(n[1:])
				var re *regexp.Regexp
				if n[0] == '#' {
					if strings.HasPrefix(n, "#view-") {
						continue // görünüm bölümünün kendisi
					}
					re = regexp.MustCompile(`(?:\bid=\\?["']|\.id\s*=\s*["'])` + bare + `["'\\]`)
				} else {
					re = regexp.MustCompile(`(?:^|[^A-Za-z0-9_-])` + bare + `(?:$|[^A-Za-z0-9_-])`)
				}
				if re.MatchString(text) && !bucketSelectorReads[unit][n] {
					problems = append(problems, fmt.Sprintf("%s: %s (%s kovası)", unit, n, b.name))
				}
			}
			// Dinamik ad kurulumu: 'dp-' + x ya da `dp-${x}`.
			for _, tok := range b.tokens {
				prefix := strings.TrimPrefix(strings.TrimSuffix(tok.String(), `[A-Za-z0-9_-]*`), `\`)
				if !strings.HasSuffix(prefix, "-") || strings.HasPrefix(prefix, "#") {
					continue
				}
				bare := regexp.QuoteMeta(prefix[1:])
				dyn := regexp.MustCompile(`(?:^|[^A-Za-z0-9_-])` + bare + "(?:[\"'`]\\s*\\+|\\$\\{)")
				if dyn.MatchString(text) {
					problems = append(problems, fmt.Sprintf("%s: dinamik %s… sınıfı (%s kovası)", unit, prefix, b.name))
				}
			}
		}
	}
	sort.Strings(problems)
	for _, p := range problems {
		t.Error(p)
	}
}
