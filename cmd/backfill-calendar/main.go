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

	// Üst düzey <yearId>.json + tür alt dizinleri (calendar/<tür>/<yearId>.json).
	var files []string
	err := filepath.WalkDir(dir, func(p string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(d.Name(), ".json") {
			files = append(files, p)
		}
		return nil
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "takvim dizini okunamadı (%s): %v\n", dir, err)
		os.Exit(1)
	}

	changed, total := 0, 0
	for _, p := range files {
		in, err := os.ReadFile(p)
		if err != nil {
			fmt.Fprintf(os.Stderr, "· %s okunamadı: %v\n", p, err)
			os.Exit(1)
		}
		outBytes, err := takvim.AddISODates(in)
		if err != nil {
			fmt.Fprintf(os.Stderr, "· %s işlenemedi: %v\n", p, err)
			os.Exit(1)
		}
		total++
		if string(outBytes) != string(in) {
			if err := os.WriteFile(p, outBytes, 0o644); err != nil {
				fmt.Fprintf(os.Stderr, "· %s yazılamadı: %v\n", p, err)
				os.Exit(1)
			}
			changed++
		}
	}
	fmt.Printf("· %d/%d takvim dosyasına ISO start/end eklendi\n", changed, total)
}
