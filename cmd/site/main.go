// Command site, arşiv verisinden (docs/data/) arama motorluğuna yönelik statik
// HTML sayfaları ve sitemap üretir. Her push'ta ve scrape sonrası çalıştırılır;
// çıktı deterministiktir — CI'da drift denetimi yapılabilir.
//
//	go run ./cmd/site               # tr + en (varsayılan)
//	go run ./cmd/site -lang tr      # yalnızca Türkçe
//	go run ./cmd/site -lang en      # yalnızca İngilizce
//	go run ./cmd/site -out docs
//	go run ./cmd/site -assets-only  # yalnız assets-src → docs/assets + ?v= yamaları
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"itu-scraper/internal/site"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
	lang := flag.String("lang", "tr,en", "dil kodu (tr,en veya virgülle ayrılmış)")
	ver := flag.String("version", "", "tüm assetlere tek sürüm — boşsa her dosyanın sürümü kendi içeriğinden (ve importlarından) üretilir")
	assetsSrc := flag.String("assets-src", "assets-src", "elle yazılan CSS/JS kaynağı (küçültülüp -out/assets altına yazılır)")
	assetsOnly := flag.Bool("assets-only", false, "yalnız assets-src → <out>/assets adımını çalıştır, index.html ve üretilmiş HTML sayfalarındaki ?v= bağlantılarını yenile (veri/SEO sayfası üretimi yok)")
	flag.Parse()

	versions, err := buildAssets(*out, *assetsSrc, *ver)
	if err != nil {
		log.Fatal(err)
	}

	if *assetsOnly {
		// Tam üretimdeki sayfa şablonu aynı bağlantıları aynı sürümlerle yazar;
		// burada yalnız mevcut sayfalardaki ?v= değerleri yenilenir. Sonuç, tam
		// üretimin bu dosyalar için vereceği çıktıyla birebir aynıdır.
		n, err := patchAllHTMLPages(*out, versions)
		if err != nil {
			log.Fatalf("HTML asset sürümleri yenilenemedi: %v", err)
		}
		fmt.Printf("· assets-only: %d asset sürümlendi, %d HTML sayfası denetlendi\n", len(versions), n)
		return
	}

	root, err := filepath.Abs(*out)
	if err != nil {
		log.Fatal(err)
	}
	for _, l := range strings.Split(*lang, ",") {
		l = strings.TrimSpace(l)
		b := site.New(root, l, *ver)
		b.SetAssetVersions(versions)
		if err := b.Generate(); err != nil {
			fmt.Fprintf(os.Stderr, "· hata (%s): %v\n", l, err)
			os.Exit(1)
		}
	}
}

// buildAssets, assets-src'yi küçültüp <out>/assets'e yazar, uygulama CSS'ini
// sekme parçalarına böler, her dosyanın sürümünü üretip JS importlarına ve elle
// yazılan sayfalara (index.html, 404.html) işler. Tam üretim ve -assets-only
// aynı yolu kullanır.
func buildAssets(out, assetsSrc, override string) (map[string]string, error) {
	// docs/assets/*.js ve style.css üretilen çıktıdır — elle yazılan kaynak
	// assets-src/ altında. Sürüm hash'i ve import yamaları küçültülmüş içeriği
	// görmeli, o yüzden bu adım her şeyden önce çalışır.
	if _, err := os.Stat(assetsSrc); err == nil {
		if err := minifyAssets(assetsSrc, filepath.Join(out, "assets")); err != nil {
			return nil, fmt.Errorf("asset küçültme başarısız: %w", err)
		}
	}
	if err := splitAppCSS(filepath.Join(out, "assets")); err != nil {
		return nil, fmt.Errorf("uygulama CSS'i bölünemedi: %w", err)
	}
	// Asset önbellek kırma: git SHA kullanmak veri-only commitlerde gereksiz
	// cache kırıyordu; tek bir global içerik hash'i ise tek satırlık CSS
	// değişikliğinde bütün JS modüllerini yeniden indirtiyordu. Sürüm artık
	// dosya başına (JS'te importları da kapsayan Merkle özeti).
	if len(override) > assetVersionLen {
		override = override[:assetVersionLen]
	}
	versions, err := stampAssetVersions(out, override)
	if err != nil {
		return nil, fmt.Errorf("asset sürümleri üretilemedi: %w", err)
	}
	if err := patchHandWrittenPages(out, versions); err != nil {
		return nil, fmt.Errorf("index.html asset sürümü eklenemedi: %w", err)
	}
	return versions, nil
}
