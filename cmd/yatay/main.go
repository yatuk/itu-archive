// Command yatay, İTÜ içi yatay geçiş taban/tavan sonuçlarını (2011-2012'den
// günümüze, sis.itu.edu.tr'nin kendi arşivinden) çeker.
//
//	docs/data/yatay/<term>.json — yıl başına tam sonuç
//	docs/data/yatay/index.json  — tüm yılların özeti (program listesi çıkarımı için)
//
// Sonuçlar yılda bir açıklanıyor ve geçmiş yıllar hiç değişmiyor; OBS'yi
// yormaz, günlük scrape'e karışmaz. Aylık çalıştırılır (bkz. .github/workflows/yatay.yml).
//
//	go run ./cmd/yatay
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sort"
	"syscall"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/store"
	"itu-scraper/internal/yatay"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	only := flag.String("only", "", "yalnızca bu akademik yılı çek (test için, örn. 2024-2025)")
	flag.Parse()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(3, 2) // sis.itu.edu.tr statik sayfalar — nazik hız yeterli
	c := yatay.New(f)
	st := store.New(*out)

	archivePrograms, err := loadArchivePrograms(st)
	if err != nil {
		// Eksikse eşleme atlanır, programCode boş kalır — scraper yine de
		// çalışsın (cmd/definitions henüz koşmamış olabilir).
		logf("uyarı: programs.json okunamadı, programCode eşlemesi atlanıyor: %v", err)
	}

	specs := yatay.Terms
	if *only != "" {
		specs = nil
		for _, s := range yatay.Terms {
			if s.Term == *only {
				specs = append(specs, s)
			}
		}
		if len(specs) == 0 {
			log.Fatalf("%s bilinen yıllar arasında yok", *only)
		}
	}

	index := make([]map[string]any, 0, len(specs))
	var fetched []*yatay.Term
	var failed []string
	for _, spec := range specs {
		term, err := c.Fetch(ctx, spec)
		if err != nil {
			logf("%s atlandı: %v", spec.Term, err)
			failed = append(failed, spec.Term)
			continue
		}
		if len(archivePrograms) > 0 {
			term.Results = yatay.MatchPrograms(term.Results, archivePrograms)
		}
		if err := st.WriteJSON(term, "data", "yatay", spec.Term+".json"); err != nil {
			log.Fatalf("%s yazılamadı: %v", spec.Term, err)
		}
		index = append(index, map[string]any{
			"term":   term.Term,
			"metric": term.Metric,
			"count":  len(term.Results),
			"file":   "data/yatay/" + spec.Term + ".json",
		})
		fetched = append(fetched, term)
		logf("%s: %d kayıt (%s)", term.Term, len(term.Results), term.Metric)
	}

	if len(index) == 0 {
		log.Fatalf("hiçbir yıl çekilemedi")
	}
	if err := st.WriteJSON(index, "data", "yatay", "index.json"); err != nil {
		log.Fatalf("index.json: %v", err)
	}

	// -only ile tek yıl çekilirken rollup'ı yeniden yazma: eksik yılların
	// rollup'ını sessizce siler. Yalnızca tam koşuda (tüm 15 yıl) üret.
	if *only == "" {
		rollups := yatay.BuildRollups(fetched)
		rollupIndex := make([]string, 0, len(rollups))
		for code, rollup := range rollups {
			if err := st.WriteJSON(rollup, "data", "yatay", "by-program", code+".json"); err != nil {
				log.Fatalf("by-program/%s.json: %v", code, err)
			}
			rollupIndex = append(rollupIndex, code)
		}
		sort.Strings(rollupIndex)
		if err := st.WriteJSON(rollupIndex, "data", "yatay", "by-program", "index.json"); err != nil {
			log.Fatalf("by-program/index.json: %v", err)
		}
		logf("%d program için rollup yazıldı", len(rollupIndex))
	}

	logf("bitti: %d/%d yıl", len(index), len(specs))
	if len(failed) > 0 {
		os.Exit(1)
	}
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}

// loadArchivePrograms, cmd/definitions'ın ürettiği docs/data/programs.json'u
// okur — yatay geçiş program adlarını arşiv koduna bağlamak için (bkz.
// internal/yatay/match.go).
func loadArchivePrograms(st *store.Store) ([]yatay.ArchiveProgram, error) {
	raw, err := os.ReadFile(st.Path("data", "programs.json"))
	if err != nil {
		return nil, err
	}
	var payload struct {
		Programs []yatay.ArchiveProgram `json:"programs"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}
	return payload.Programs, nil
}
