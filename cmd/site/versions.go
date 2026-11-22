package main

import (
	"crypto/sha256"
	"fmt"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"sort"
	"strings"
	"sync"
)

// Asset sürümleri dosya başınadır: her CSS/JS dosyasının ?v= değeri yalnız
// kendi içeriğinden türetilir. Tek satırlık bir CSS değişikliği artık bütün
// JS modüllerinin önbelleğini kırmaz.
//
// JS modülleri birbirini ?v= taşıyan URL'lerle içe aktardığı için bir modülün
// sürümü, içe aktardığı dosyaların sürümlerini de kapsar (Merkle ağacı gibi):
// core/utils.js değişirse utils'i (doğrudan ya da dolaylı) içe aktaran her
// modülün metni yeni ?v= ile değişir, o modüllerin sürümü de değişir. Böylece
// eski app.js, yeni bir yardımcı modülü eski önbellek anahtarıyla istemez.
// Döngüsel importlarda (ör. course-detail → program → courses → course-detail)
// döngüdeki modüller tek bir güçlü bağlı bileşen olarak birlikte özetlenir ve
// aynı sürümü paylaşır.

const assetVersionLen = 12

// localJSImportRE, yerel ES modül import/export/dinamik import adreslerini
// yakalar. \s* (not \s+): küçültme `from "./x.js"` içindeki boşluğu kaldırıp
// `from"./x.js"` yapar (geçerli JS) — \s+ bunu eşleştiremediği için iç içe
// ES modül importlarının sürümü bir dönem hiç yamanmıyordu.
// 1: önek (from/import + tırnak), 2: göreli yol (sürüm parçası hariç).
var localJSImportRE = regexp.MustCompile(`((?:from\s*|import\s*\(\s*|import\s*)["'])(\.\.?/[^"'?\s]+\.js)(?:\?v=[^"']*)?`)

// localCSSRefRE, JS içindeki göreli CSS adreslerini (ör. tembel yüklenen sekme
// stilleri: new URL('../css/program.css', import.meta.url)) yakalar.
// 1: açılış tırnağı, 2: göreli yol, 3: kapanış tırnağı.
var localCSSRefRE = regexp.MustCompile(`(["'])(\.\.?/[^"'?\s]+\.css)(?:\?v=[^"']*)?(["'])`)

// htmlAssetRefRE, HTML'deki /assets/... ve assets/... CSS/JS bağlantılarını yakalar.
// 1: öznitelik + önek, 2: assets altındaki yol.
var htmlAssetRefRE = regexp.MustCompile(`((?:href|src)="/?assets/)([^"?\s]+\.(?:css|js))(?:\?v=[^"]*)?"`)

// assetRef, bir JS dosyasındaki tek bir yerel bağımlılık başvurusudur.
type assetRef struct {
	start, end int    // eşleşmenin bayt aralığı
	prefix     string // sürümden önce korunacak metin (önek + yol)
	suffix     string // sürümden sonra korunacak metin (CSS kapanış tırnağı)
	target     string // assets köküne göre hedef yol (slash'lı)
}

type assetFile struct {
	rel        string // assets köküne göre slash'lı yol
	path       string // diskteki yol
	raw        []byte
	normalized []byte // yerel başvurulardaki ?v= çıkarılmış içerik
	refs       []assetRef
	deps       []string // tekil, sıralı hedefler
}

// isRuntimeAsset, tarayıcıya giden CSS/JS dosyalarını seçer; Node'un doğrudan
// çalıştırdığı *.test.js dosyaları sürümlenmez.
func isRuntimeAsset(p string) bool {
	lower := strings.ToLower(p)
	if strings.HasSuffix(lower, ".test.js") {
		return false
	}
	return strings.HasSuffix(lower, ".js") || strings.HasSuffix(lower, ".css")
}

// scanJSRefs, bir JS dosyasındaki yerel JS importlarını ve CSS adreslerini
// bulur; normalize edilmiş (sürümsüz) içeriği ve bağımlılıkları döner.
func scanJSRefs(rel string, b []byte) (refs []assetRef, normalized []byte) {
	dir := path.Dir(rel)
	for _, m := range localJSImportRE.FindAllSubmatchIndex(b, -1) {
		spec := string(b[m[4]:m[5]])
		refs = append(refs, assetRef{
			start: m[0], end: m[1],
			prefix: string(b[m[2]:m[5]]),
			target: path.Join(dir, spec),
		})
	}
	for _, m := range localCSSRefRE.FindAllSubmatchIndex(b, -1) {
		spec := string(b[m[4]:m[5]])
		refs = append(refs, assetRef{
			start: m[0], end: m[1],
			prefix: string(b[m[2]:m[5]]),
			suffix: string(b[m[6]:m[7]]),
			target: path.Join(dir, spec),
		})
	}
	sort.Slice(refs, func(i, j int) bool { return refs[i].start < refs[j].start })
	// İki desen aynı metni yakalayamaz (biri .js, diğeri .css ile biter); yine de
	// çakışan aralık olursa ilkini tut.
	kept := refs[:0]
	last := -1
	for _, r := range refs {
		if r.start < last {
			continue
		}
		kept = append(kept, r)
		last = r.end
	}
	refs = kept
	return refs, rewriteRefs(b, refs, nil)
}

// rewriteRefs, başvuruları verilen sürümlerle (nil ise sürümsüz) yeniden yazar.
func rewriteRefs(b []byte, refs []assetRef, versions map[string]string) []byte {
	var out []byte
	prev := 0
	for _, r := range refs {
		out = append(out, b[prev:r.start]...)
		out = append(out, r.prefix...)
		if versions != nil {
			out = append(out, "?v="+versions[r.target]...)
		}
		out = append(out, r.suffix...)
		prev = r.end
	}
	return append(out, b[prev:]...)
}

// loadAssetGraph, assets kökündeki çalışma-zamanı dosyalarını ve yerel
// bağımlılıklarını okur.
func loadAssetGraph(assetsDir string) (map[string]*assetFile, error) {
	files := map[string]*assetFile{}
	err := filepath.WalkDir(assetsDir, func(p string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !isRuntimeAsset(p) {
			return nil
		}
		rel, err := filepath.Rel(assetsDir, p)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		b, err := os.ReadFile(p)
		if err != nil {
			return err
		}
		f := &assetFile{rel: rel, path: p, raw: b, normalized: b}
		if strings.EqualFold(path.Ext(rel), ".js") {
			f.refs, f.normalized = scanJSRefs(rel, b)
			seen := map[string]bool{}
			for _, r := range f.refs {
				if !seen[r.target] {
					seen[r.target] = true
					f.deps = append(f.deps, r.target)
				}
			}
			sort.Strings(f.deps)
		}
		files[rel] = f
		return nil
	})
	if err != nil {
		return nil, err
	}
	for _, f := range files {
		for _, dep := range f.deps {
			if _, ok := files[dep]; !ok {
				return nil, fmt.Errorf("%s, var olmayan bir asset'e başvuruyor: %s", f.rel, dep)
			}
		}
	}
	return files, nil
}

// computeAssetVersions, her dosyanın sürümünü kendi normalize içeriğinden ve
// bağımlılıklarının sürümlerinden üretir. Döngüler Tarjan SCC ile tek düğüme
// indirgenir; Tarjan bileşenleri bağımlılıklar önce gelecek sırada verir.
func computeAssetVersions(files map[string]*assetFile) map[string]string {
	names := make([]string, 0, len(files))
	for rel := range files {
		names = append(names, rel)
	}
	sort.Strings(names)

	index := map[string]int{}
	low := map[string]int{}
	onStack := map[string]bool{}
	var stack []string
	next := 0
	versions := map[string]string{}

	var strong func(v string)
	strong = func(v string) {
		index[v] = next
		low[v] = next
		next++
		stack = append(stack, v)
		onStack[v] = true
		for _, w := range files[v].deps {
			if _, seen := index[w]; !seen {
				strong(w)
				low[v] = min(low[v], low[w])
			} else if onStack[w] {
				low[v] = min(low[v], index[w])
			}
		}
		if low[v] != index[v] {
			return
		}
		var comp []string
		for {
			w := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			onStack[w] = false
			comp = append(comp, w)
			if w == v {
				break
			}
		}
		sort.Strings(comp)
		member := map[string]bool{}
		for _, m := range comp {
			member[m] = true
		}
		h := sha256.New()
		external := map[string]bool{}
		for _, m := range comp {
			h.Write([]byte(m))
			h.Write([]byte{0})
			h.Write(files[m].normalized)
			h.Write([]byte{0})
			for _, d := range files[m].deps {
				if !member[d] {
					external[d] = true
				}
			}
		}
		ext := make([]string, 0, len(external))
		for d := range external {
			ext = append(ext, d)
		}
		sort.Strings(ext)
		for _, d := range ext {
			h.Write([]byte("dep:" + d + "=" + versions[d]))
			h.Write([]byte{0})
		}
		ver := fmt.Sprintf("%x", h.Sum(nil))[:assetVersionLen]
		for _, m := range comp {
			versions[m] = ver
		}
	}
	for _, n := range names {
		if _, seen := index[n]; !seen {
			strong(n)
		}
	}
	return versions
}

// stampAssetVersions, <root>/assets altındaki çalışma-zamanı dosyalarının
// sürümlerini üretir ve JS dosyalarındaki yerel başvuruları hedef dosyanın
// kendi sürümüyle yazar. override boş değilse her dosya o sürümü alır.
// Dönen harita assets köküne göre slash'lı yol → sürüm.
func stampAssetVersions(root, override string) (map[string]string, error) {
	assetsDir := filepath.Join(root, "assets")
	files, err := loadAssetGraph(assetsDir)
	if err != nil {
		return nil, err
	}
	if len(files) == 0 {
		return nil, fmt.Errorf("%s altında çalışma-zamanı asseti bulunamadı", assetsDir)
	}
	versions := computeAssetVersions(files)
	if override != "" {
		for rel := range versions {
			versions[rel] = override
		}
	}
	for _, f := range files {
		if len(f.refs) == 0 {
			continue
		}
		patched := rewriteRefs(f.raw, f.refs, versions)
		if string(patched) == string(f.raw) {
			continue
		}
		if err := os.WriteFile(f.path, patched, 0o644); err != nil {
			return nil, err
		}
	}
	return versions, nil
}

// patchHTMLAssetRefs, HTML'deki assets/... CSS/JS bağlantılarının ?v= değerini
// o dosyanın kendi sürümüyle yeniler (sürümsüz bağlantıya ekler). Haritada
// olmayan dosyalara dokunulmaz.
func patchHTMLAssetRefs(s string, versions map[string]string) string {
	return htmlAssetRefRE.ReplaceAllStringFunc(s, func(m string) string {
		sub := htmlAssetRefRE.FindStringSubmatch(m)
		ver, ok := versions[sub[2]]
		if !ok {
			return m
		}
		return sub[1] + sub[2] + "?v=" + ver + `"`
	})
}

// patchHTMLFile, tek bir HTML dosyasını yerinde yamar; içerik değişmezse yazmaz.
func patchHTMLFile(p string, versions map[string]string) error {
	b, err := os.ReadFile(p)
	if err != nil {
		return err
	}
	patched := patchHTMLAssetRefs(string(b), versions)
	if patched == string(b) {
		return nil
	}
	return os.WriteFile(p, []byte(patched), 0o644)
}

// handWrittenPages, üreticinin yazmadığı ama asset bağlantısı taşıyan sayfalar.
// Tam üretim ve -assets-only aynı yamayı uygular.
var handWrittenPages = []string{"index.html", "404.html"}

// patchHandWrittenPages, elle yazılan kök sayfalardaki asset sürümlerini yeniler.
func patchHandWrittenPages(root string, versions map[string]string) error {
	for _, name := range handWrittenPages {
		p := filepath.Join(root, name)
		if _, err := os.Stat(p); os.IsNotExist(err) {
			continue
		}
		if err := patchHTMLFile(p, versions); err != nil {
			return err
		}
	}
	return nil
}

// patchAllHTMLPages, -assets-only kipinde çıktı kökündeki tüm HTML sayfalarının
// (üretilmiş SEO sayfaları dahil) asset sürümlerini yeniler. Tam üretimde
// şablon aynı bağlantıyı aynı sürümle yazdığından iki yolun çıktısı birebir aynıdır.
func patchAllHTMLPages(root string, versions map[string]string) (int, error) {
	skip := map[string]bool{
		filepath.Join(root, "assets"): true,
		filepath.Join(root, "data"):   true,
	}
	var pages []string
	err := filepath.WalkDir(root, func(p string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			if skip[p] {
				return filepath.SkipDir
			}
			return nil
		}
		if strings.EqualFold(filepath.Ext(p), ".html") {
			pages = append(pages, p)
		}
		return nil
	})
	if err != nil {
		return 0, err
	}
	// ~11 bin sayfa: dosya G/Ç'si paralel yürütülür (sonuç sıradan bağımsızdır).
	jobs := make(chan string)
	errs := make(chan error, 1)
	var wg sync.WaitGroup
	for range max(2, runtime.NumCPU()) {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for p := range jobs {
				if err := patchHTMLFile(p, versions); err != nil {
					select {
					case errs <- fmt.Errorf("%s: %w", p, err):
					default:
					}
				}
			}
		}()
	}
	for _, p := range pages {
		jobs <- p
	}
	close(jobs)
	wg.Wait()
	select {
	case err := <-errs:
		return len(pages), err
	default:
	}
	return len(pages), nil
}
