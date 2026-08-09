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
	"path/filepath"
	"strings"

	"itu-scraper/internal/site"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
	lang := flag.String("lang", "tr,en", "dil kodu (tr,en veya virgülle ayrılmış)")
	flag.Parse()

	root, err := filepath.Abs(*out)
	if err != nil {
		log.Fatal(err)
	}
	for _, l := range strings.Split(*lang, ",") {
		l = strings.TrimSpace(l)
		b := site.New(root, l)
		if err := b.Generate(); err != nil {
			fmt.Fprintf(os.Stderr, "· hata (%s): %v\n", l, err)
			os.Exit(1)
		}
	}
}
