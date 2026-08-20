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
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"

	"itu-scraper/internal/site"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
	lang := flag.String("lang", "tr,en", "dil kodu (tr,en veya virgülle ayrılmış)")
	ver := flag.String("version", "", "asset sürümü (P2-16) — boşsa GITHUB_SHA'dan kısa sha")
	flag.Parse()

	// Asset önbellek kırma (P2-16): -version yoksa GITHUB_SHA, o da yoksa
	// git HEAD kısa sha'sı — böylece her commit'te sürüm değişir.
	version := *ver
	if version == "" {
		if sha := os.Getenv("GITHUB_SHA"); sha != "" {
			version = sha
		} else if out, err := exec.Command("git", "rev-parse", "--short=7", "HEAD").Output(); err == nil {
			version = strings.TrimSpace(string(out))
		}
	}
	if len(version) > 7 {
		version = version[:7]
	}
	if version != "" {
		if err := patchIndexAssets(*out, version); err != nil {
			fmt.Fprintf(os.Stderr, "· uyarı: index.html asset sürümü eklenemedi: %v\n", err)
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
