// Command site, arşiv verisinden (docs/data/) arama motorluğuna yönelik statik
// HTML sayfaları ve sitemap üretir. Her push'ta ve scrape sonrası çalıştırılır;
// çıktı deterministiktir — CI'da drift denetimi yapılabilir.
//
//	go run ./cmd/site            # varsayılan kök: docs
//	go run ./cmd/site -out docs
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"itu-scraper/internal/site"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
	flag.Parse()

	root, err := filepath.Abs(*out)
	if err != nil {
		log.Fatal(err)
	}
	b := site.New(root)
	if err := b.Generate(); err != nil {
		fmt.Fprintf(os.Stderr, "· hata: %v\n", err)
		os.Exit(1)
	}
}
