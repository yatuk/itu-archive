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
	only := flag.String("only", "", "yalnızca bu program kodlarını çek (virgülle, örn. CEN_LS,BLGE_LS)")
	allVersions := flag.Bool("all-versions", true, "eski plan sürümlerini de çek (data/curriculum/versions/)")
	minYear := flag.Int("min-version-year", 2015, "geçerliliği bu yılın Güz dönemine kadar biten eski sürümleri atla (0 = hepsi)")
	flag.Parse()

	if err := run(*out, *workers, *rps, *only, *allVersions, *minYear); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, only string, allVersions bool, minYear int) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	cc := curriculum.New(f)
	cc.AllVersions = allVersions
	cc.MinVersionYear = minYear
	st := store.New(out)

	programs, err := cc.Programs(ctx)
	if err != nil {
		return err
	}
	if only != "" {
		programs = filterPrograms(programs, only)
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
		// Sürüm arşivi: en güncel sürümün kopyası (sürüm listesi olmadan) ve
		// bu taramada çekilen eski sürümler data/curriculum/versions/ altında.
		for _, v := range archiveCopies(p) {
			name := fmt.Sprintf("%s-%d.json", v.ProgramCode, v.PlanID)
			if err := st.WriteJSON(v, "data", "curriculum", "versions", name); err != nil {
				return err
			}
		}
	}
	if err := st.WriteJSON(index, "data", "curriculum", "index.json"); err != nil {
		return err
	}
	// Arşiv önceki başarılı taramaları da korur: OBS bir sürümü listeden
	// kaldırsa bile dosyası ve dizin satırı kalır.
	versions, err := buildVersionIndex(filepath.Join(out, "data", "curriculum", "versions"), plans)
	if err != nil {
		return err
	}
	if err := st.WriteJSON(versions, "data", "curriculum", "versions", "index.json"); err != nil {
		return err
	}
	logf("bitti")
	return nil
}

// filterPrograms, virgülle ayrılmış kod listesine uyan programları bırakır.
func filterPrograms(programs []curriculum.Program, only string) []curriculum.Program {
	want := map[string]bool{}
	for _, code := range strings.Split(only, ",") {
		if code = strings.TrimSpace(code); code != "" {
			want[code] = true
		}
	}
	var out []curriculum.Program
	for _, p := range programs {
		if want[p.Code] {
			out = append(out, p)
		}
	}
	return out
}

// archiveCopies, bir programın versions/ altına yazılacak planlarını döndürür:
// en güncel sürüm (sürüm listesi çıkarılmış kopya) ve eski sürümler.
func archiveCopies(p *curriculum.Plan) []*curriculum.Plan {
	var out []*curriculum.Plan
	if p.PlanID > 0 {
		latest := *p
		latest.Versions = nil
		latest.Older = nil
		out = append(out, &latest)
	}
	for _, old := range p.Older {
		if old != nil && old.PlanID > 0 {
			out = append(out, old)
		}
	}
	return out
}

// versionEntry, versions/index.json satırı.
type versionEntry struct {
	ID         int    `json:"id"`
	Label      string `json:"label"`
	ValidFrom  string `json:"validFrom,omitempty"`
	ValidUntil string `json:"validUntil,omitempty"`
	Latest     bool   `json:"latest,omitempty"`
	File       string `json:"file"`
	SourceURL  string `json:"sourceUrl"`
}

// buildVersionIndex, versions/ dizinindeki tüm arşiv dosyalarından program →
// sürüm listesi dizinini kurar (en yeni ID önce). Latest, programın güncel
// <PROG>.json dosyasındaki planId'dir.
func buildVersionIndex(dir string, plans []*curriculum.Plan) (map[string][]versionEntry, error) {
	latestID := map[string]int{}
	for _, p := range plans {
		latestID[p.ProgramCode] = p.PlanID
	}
	versions := map[string][]versionEntry{}
	entries, err := os.ReadDir(dir)
	if err != nil && !os.IsNotExist(err) {
		return nil, err
	}
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") || entry.Name() == "index.json" {
			continue
		}
		raw, err := os.ReadFile(filepath.Join(dir, entry.Name()))
		if err != nil {
			continue
		}
		var archived curriculum.Plan
		if json.Unmarshal(raw, &archived) != nil || archived.ProgramCode == "" {
			continue
		}
		from, until := archived.ValidFrom, archived.ValidUntil
		if from == "" && until == "" {
			from, until = curriculum.ParseValidity(archived.PlanLabel)
		}
		versions[archived.ProgramCode] = append(versions[archived.ProgramCode], versionEntry{
			ID: archived.PlanID, Label: archived.PlanLabel, ValidFrom: from, ValidUntil: until,
			Latest: archived.PlanID == latestID[archived.ProgramCode],
			File:   "data/curriculum/versions/" + entry.Name(), SourceURL: archived.SourceURL,
		})
	}
	for code := range versions {
		sort.Slice(versions[code], func(i, j int) bool { return versions[code][i].ID > versions[code][j].ID })
	}
	return versions, nil
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
