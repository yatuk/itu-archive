// Command curriculum, tüm lisans programlarının güncel müfredatını çekip
// docs/data/curriculum altına yazar.
//
// Ayrı komut olmasının sebebi: bu veri kontenjan/ders programı gibi sık
// değişmiyor, dönemde belki bir kez OBS müfredat güncellediğinde tazelenmesi
// yeterli — her günkü scrape'e karıştırmak gereksiz yük.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync/atomic"
	"syscall"

	"itu-scraper/internal/curriculum"
	"itu-scraper/internal/fetch"
	"itu-scraper/internal/store"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	workers := flag.Int("workers", 6, "eşzamanlı istek sayısı")
	rps := flag.Float64("rps", 5, "saniyedeki istek üst sınırı")
	only := flag.String("only", "", "yalnızca bu program kodunu çek (test için, örn. BLG_LS)")
	flag.Parse()

	if err := run(*out, *workers, *rps, *only); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, only string) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	cc := curriculum.New(f)
	st := store.New(out)

	programs, err := cc.Programs(ctx)
	if err != nil {
		return err
	}
	if only != "" {
		var filtered []curriculum.Program
		for _, p := range programs {
			if p.Code == only {
				filtered = append(filtered, p)
			}
		}
		programs = filtered
	}
	logf("%d program bulundu", len(programs))

	var done int64
	plans, err := cc.ScrapeAll(ctx, programs, workers, func(format string, args ...any) {
		logf(format, args...)
	})
	if err != nil {
		return err
	}
	atomic.AddInt64(&done, int64(len(plans)))
	logf("%d/%d programın müfredatı çekildi", len(plans), len(programs))

	index := make([]map[string]string, 0, len(plans))
	for _, p := range plans {
		if err := st.WriteJSON(p, "data", "curriculum", p.ProgramCode+".json"); err != nil {
			return err
		}
		index = append(index, map[string]string{
			"code": p.ProgramCode, "name": p.ProgramName, "faculty": p.Faculty,
		})
	}
	if err := st.WriteJSON(index, "data", "curriculum", "index.json"); err != nil {
		return err
	}
	logf("bitti")
	return nil
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
