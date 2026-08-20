// Command curriculum, tüm programların güncel müfredatını çekip
// docs/data/curriculum altına yazar. Lisansla birlikte önlisans (OL), yüksek
// lisans (YL) ve doktora (DR) programlarını da kapsar.
//
// Ayrı komut olmasının sebebi: bu veri kontenjan/ders programı gibi sık
// değişmiyor, dönemde belki bir kez OBS müfredat güncellediğinde tazelenmesi
// yeterli — her günkü scrape'e karıştırmak gereksiz yük.
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"sort"
	"strings"
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
		if len(programs) == 0 {
			return fmt.Errorf("%s programı bulunamadı", only)
		}
	}
	logf("%d program bulundu (%d önlisans, %d lisans, %d yüksek lisans, %d doktora)",
		len(programs),
		curriculum.Count(programs, "OL"), curriculum.Count(programs, "LS"),
		curriculum.Count(programs, "YL"), curriculum.Count(programs, "DR"))

	fresh, err := cc.ScrapeAll(ctx, programs, workers, func(format string, args ...any) {
		logf(format, args...)
	})
	if err != nil {
		return err
	}
	previous, err := loadCurriculumPlans(filepath.Join(out, "data", "curriculum"))
	if err != nil {
		return err
	}
	plans, retained := mergeCurriculumPlans(previous, fresh)
	logf("%d/%d program taze çekildi; %d önceki başarılı plan korundu", len(fresh), len(programs), retained)

	index := make([]map[string]string, 0, len(plans))
	for _, p := range plans {
		if err := st.WriteJSON(p, "data", "curriculum", p.ProgramCode+".json"); err != nil {
			return err
		}
		index = append(index, map[string]string{
			"code": p.ProgramCode, "name": p.ProgramName, "faculty": p.Faculty, "level": p.Level,
		})
	}
	if err := st.WriteJSON(index, "data", "curriculum", "index.json"); err != nil {
		return err
	}
	logf("bitti")
	return nil
}

func loadCurriculumPlans(dir string) ([]*curriculum.Plan, error) {
	entries, err := os.ReadDir(dir)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var plans []*curriculum.Plan
	for _, file := range entries {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") || file.Name() == "index.json" {
			continue
		}
		raw, err := os.ReadFile(filepath.Join(dir, file.Name()))
		if err != nil {
			return nil, err
		}
		var plan curriculum.Plan
		if err := json.Unmarshal(raw, &plan); err != nil {
			return nil, fmt.Errorf("%s okunamadı: %w", file.Name(), err)
		}
		if plan.ProgramCode != "" {
			copy := plan
			plans = append(plans, &copy)
		}
	}
	return plans, nil
}

func mergeCurriculumPlans(previous, fresh []*curriculum.Plan) ([]*curriculum.Plan, int) {
	byCode := map[string]*curriculum.Plan{}
	for _, plan := range previous {
		if plan != nil && plan.ProgramCode != "" {
			byCode[plan.ProgramCode] = plan
		}
	}
	retained := len(byCode)
	for _, plan := range fresh {
		if plan == nil || plan.ProgramCode == "" {
			continue
		}
		if _, existed := byCode[plan.ProgramCode]; existed {
			retained--
		}
		byCode[plan.ProgramCode] = plan
	}
	merged := make([]*curriculum.Plan, 0, len(byCode))
	for _, plan := range byCode {
		merged = append(merged, plan)
	}
	sort.Slice(merged, func(i, j int) bool { return merged[i].ProgramCode < merged[j].ProgramCode })
	return merged, retained
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
