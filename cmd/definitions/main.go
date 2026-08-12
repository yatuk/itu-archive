// Command definitions, OBS resmî tanım listelerini çeker:
//
//	docs/data/buildings.json — bina kodu → ad ("Bina: undeclared" sorununu çözer)
//	docs/data/programs.json  — resmî program kodları, seviye etiketli
//
// Her iki kaynak sunucu tarafı tablo olduğundan tek istek + parse yeterli;
// OBS'yi yormaz, günlük scrape'e karışmaz. Aylık çalıştırılır.
//
//	go run ./cmd/definitions
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sort"
	"syscall"
	"time"

	"itu-scraper/internal/definitions"
	"itu-scraper/internal/fetch"
	"itu-scraper/internal/store"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	flag.Parse()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(4, 2)
	def := definitions.New(f)
	st := store.New(*out)

	buildings, err := def.Buildings(ctx)
	if err != nil {
		log.Fatalf("bina kodları: %v", err)
	}
	if err := st.WriteJSON(buildings, "data", "buildings.json"); err != nil {
		log.Fatalf("buildings.json: %v", err)
	}
	logf("%d bina kodu", len(buildings))

	// Seviye kimlikleri: 1 önlisans, 2 lisans, 3 lisansüstü, 5 ikinci öğretim.
	programs, err := def.Programs(ctx, []int{1, 2, 3, 5})
	if err != nil {
		log.Fatalf("program kodları: %v", err)
	}
	sort.Slice(programs, func(i, j int) bool {
		if programs[i].Level != programs[j].Level {
			return programs[i].Level < programs[j].Level
		}
		return programs[i].Code < programs[j].Code
	})
	if err := st.WriteJSON(map[string]any{
		"generatedAt": time.Now().UTC().Format(time.RFC3339),
		"source":      store.Source,
		"programs":    programs,
	}, "data", "programs.json"); err != nil {
		log.Fatalf("programs.json: %v", err)
	}
	logf("%d program kodu (4 seviye)", len(programs))
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
