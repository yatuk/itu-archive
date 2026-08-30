// Command site, arşiv verisinden (docs/data/) arama motorluğuna yönelik statik
// HTML sayfaları ve sitemap üretir. Her push'ta ve scrape sonrası çalıştırılır;
// çıktı deterministiktir — CI'da drift denetimi yapılabilir.
//
//	go run ./cmd/site               # tr + en (varsayılan)
//	go run ./cmd/site -lang tr      # yalnızca Türkçe
//	go run ./cmd/site -lang en      # yalnızca İngilizce
//	go run ./cmd/site -out docs
package main

import (
	"crypto/sha256"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"

	"itu-scraper/internal/site"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
	lang := flag.String("lang", "tr,en", "dil kodu (tr,en veya virgülle ayrılmış)")
	ver := flag.String("version", "", "asset sürümü — boşsa çalışma-zamanı CSS/JS içeriğinden üretilir")
	assetsSrc := flag.String("assets-src", "assets-src", "elle yazılan CSS/JS kaynağı (küçültülüp -out/assets altına yazılır)")
	flag.Parse()

	// docs/assets/*.js ve style.css artık üretilen çıktı — elle yazılan kaynak
	// assets-src/ altında. Sürüm hash'i ve import yamaları küçültülmüş içeriği
	// görmeli, o yüzden bu adım her şeyden önce çalışır.
	if _, err := os.Stat(*assetsSrc); err == nil {
		if err := minifyAssets(*assetsSrc, filepath.Join(*out, "assets")); err != nil {
			log.Fatalf("asset küçültme başarısız: %v", err)
		}
	}

	// Asset önbellek kırma: açık bir -version verilmediyse yayınlanan CSS ve
	// çalışma-zamanı JS dosyalarının normalize edilmiş içeriğinden üret. Git SHA
	// kullanmak veri-only commitlerde gereksiz cache kırıyor; yalnız index/app'i
	// sürümlemek ise iç içe ES modüllerini eski cache ile karıştırabiliyordu.
	version := *ver
	if version == "" {
		var err error
		version, err = contentAssetVersion(*out)
		if err != nil {
			log.Fatalf("asset sürümü üretilemedi: %v", err)
		}
	}
	if len(version) > 12 {
		version = version[:12]
	}
	if version != "" {
		if err := patchIndexAssets(*out, version); err != nil {
			log.Fatalf("index.html asset sürümü eklenemedi: %v", err)
		}
		if err := patchRuntimeAssetImports(*out, version); err != nil {
			log.Fatalf("JS modül sürümleri eklenemedi: %v", err)
		}
	}

	root, err := filepath.Abs(*out)
	if err != nil {
		log.Fatal(err)
	}
	for _, l := range strings.Split(*lang, ",") {
		l = strings.TrimSpace(l)
		b := site.New(root, l, version)
		if err := b.Generate(); err != nil {
			fmt.Fprintf(os.Stderr, "· hata (%s): %v\n", l, err)
			os.Exit(1)
		}
	}
}

// \s* (not \s+) sonrasında: küçültme "from "..."" içindeki boşluğu kaldırıp
// "from"..."" yapar (geçerli JS) — \s+ bunu eşleştiremediği için içe içe ES
// modül importlarının sürümü hiç yamanmıyordu (dersplanim.js?v=... deploy'lar
// arası hep aynı kalıyordu — kalıcı tarayıcı önbelleği riski).
var localJSVersionRE = regexp.MustCompile(`((?:from\s*|import\s*\(\s*|import\s*)["'](?:\.\.?/)[^"']+\.js)(?:\?v=[^"']*)?`)

// normalizedRuntimeJS, yalnız import URL'lerindeki sürüm parçasını çıkarır.
// Böylece sürümün kendisi içerik hash'ini her çalıştırmada değiştirmez.
func normalizedRuntimeJS(b []byte) []byte {
	return localJSVersionRE.ReplaceAllFunc(b, func(match []byte) []byte {
		parts := []byte(string(match))
		if i := strings.LastIndex(string(parts), "?v="); i >= 0 {
			return parts[:i]
		}
		return parts
	})
}

// contentAssetVersion, tarayıcıda çalışan CSS ve JS kaynaklarından kararlı bir
// yayın kimliği üretir. Test dosyaları ve veri dosyaları bu kimliği etkilemez.
func contentAssetVersion(root string) (string, error) {
	assets := filepath.Join(root, "assets")
	var files []string
	err := filepath.WalkDir(assets, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if ext != ".js" && ext != ".css" {
			return nil
		}
		if strings.HasSuffix(strings.ToLower(path), ".test.js") {
			return nil
		}
		files = append(files, path)
		return nil
	})
	if err != nil {
		return "", err
	}
	if len(files) == 0 {
		return "", fmt.Errorf("%s altında çalışma-zamanı asseti bulunamadı", assets)
	}
	sort.Strings(files)
	h := sha256.New()
	for _, path := range files {
		b, err := os.ReadFile(path)
		if err != nil {
			return "", err
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return "", err
		}
		h.Write([]byte(filepath.ToSlash(rel)))
		h.Write([]byte{0})
		if strings.EqualFold(filepath.Ext(path), ".js") {
			b = normalizedRuntimeJS(b)
		}
		h.Write(b)
		h.Write([]byte{0})
	}
	return fmt.Sprintf("%x", h.Sum(nil)[:6]), nil
}

// patchRuntimeAssetImports, giriş modülünden en derindeki yardımcıya kadar tüm
// yerel ES module importlarını aynı yayın kimliğine bağlar. Bu atomiklik,
// courses.js yeni iken core/programs.js'in eski cache'den gelmesi gibi üretim
// kırılmalarını engeller.
func patchRuntimeAssetImports(root, version string) error {
	assets := filepath.Join(root, "assets")
	return filepath.WalkDir(assets, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !strings.EqualFold(filepath.Ext(path), ".js") || strings.HasSuffix(strings.ToLower(path), ".test.js") {
			return nil
		}
		b, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		patched := localJSVersionRE.ReplaceAllFunc(b, func(match []byte) []byte {
			base := normalizedRuntimeJS(match)
			return append(append([]byte{}, base...), []byte("?v="+version)...)
		})
		if string(patched) == string(b) {
			return nil
		}
		return os.WriteFile(path, patched, 0o644)
	})
}

// patchIndexAssets, statik docs/index.html'deki asset bağlantılarına ?v= ekler —
// CSS/JS değiştiğinde tarayıcı zorunlu yeniden çeksin (deploy sonrası karışık
// durum). site.go SEO sayfalarındaki linkleri aynı sürümle üretir (tek kaynak).
func patchIndexAssets(root, version string) error {
	p := filepath.Join(root, "index.html")
	b, err := os.ReadFile(p)
	if err != nil {
		return err
	}
	s := string(b)
	s = replaceAssetVersion(s, `href="assets/style.css`, version)
	s = replaceAssetVersion(s, `src="assets/app.js`, version)
	return os.WriteFile(p, []byte(s), 0o644)
}

// replaceAssetVersion hem sürümsüz hem de daha önce sürümlenmiş bağlantıyı yeniler.
// Önceki uygulama yalnızca `style.css"` biçimini aradığı için bir kez ?v= eklendikten
// sonra sonraki deploy'larda ana sayfa sonsuza kadar eski CSS anahtarında kalıyordu.
func replaceAssetVersion(s, prefix, version string) string {
	re := regexp.MustCompile(regexp.QuoteMeta(prefix) + `(?:\?v=[^"\s]*)?"`)
	return re.ReplaceAllString(s, prefix+`?v=`+version+`"`)
}
