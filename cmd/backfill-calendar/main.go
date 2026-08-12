// Command backfill-calendar, mevcut takvim verisine ISO start/end alanlarını ekler.
//
// Faz 0.2b: scraper artık scrape'te start/end yazıyor; bu komut OBS'a istek atmadan
// arşivdeki eski calendar/<yearId>.json dosyalarını aynı kurala taşır (tek tarih +
// üç aralık biçimi, kapanış saati soneki yok sayılır). Deterministik — çift çalıştırma
// değişiklik üretmez.
//
//	go run ./cmd/backfill-calendar        # docs altındaki calendar/*.json
//	go run ./cmd/backfill-calendar -out docs
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"itu-scraper/internal/takvim"
)

func main() {
	out := flag.String("out", "docs", "veri kök dizini")
	flag.Parse()

	dir := filepath.Join(*out, "data", "calendar")
	entries, err := os.ReadDir(dir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "takvim dizini okunamadı (%s): %v\n", dir, err)
		os.Exit(1)
	}

	changed, total := 0, 0
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		p := filepath.Join(dir, e.Name())
		in, err := os.ReadFile(p)
		if err != nil {
			fmt.Fprintf(os.Stderr, "· %s okunamadı: %v\n", e.Name(), err)
			os.Exit(1)
		}
		outBytes, err := takvim.AddISODates(in)
		if err != nil {
			fmt.Fprintf(os.Stderr, "· %s işlenemedi: %v\n", e.Name(), err)
			os.Exit(1)
		}
		total++
		if string(outBytes) != string(in) {
			if err := os.WriteFile(p, outBytes, 0o644); err != nil {
				fmt.Fprintf(os.Stderr, "· %s yazılamadı: %v\n", e.Name(), err)
				os.Exit(1)
			}
			changed++
		}
	}
	fmt.Printf("· %d/%d takvim dosyasına ISO start/end eklendi\n", changed, total)
}
