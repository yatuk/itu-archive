// Command grades, ders not dağılımlarını (harf notu → kişi sayısı) OBS'nin
// DersNotDagilimi formundan çekip docs/data/grades/<BRANŞ>.json altına yazar.
//
// Kapsam yıl geçmişindeki ders kodlarından türetilir (katalog gibi, TR/EN
// çiftleri tek istekle çekilir). Her grup için verilen akademik yılların
// dağılımları toplanır. Veri < 10 kişilik sınıflar için kaydedilmez (etik sınır).
//
//	go run ./cmd/grades                      # son 3 yıl
//	go run ./cmd/grades -years 2026,2025      # belirtilen yıllar
//	go run ./cmd/grades -limit 10             # ilk 10 grup (test)
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
	"time"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/grades"
	"itu-scraper/internal/store"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	workers := flag.Int("workers", 8, "eşzamanlı istek sayısı")
	rps := flag.Float64("rps", 6, "saniyedeki istek üst sınırı")
	limit := flag.Int("limit", 0, "yalnızca ilk N grubu çek (test için)")
	years := flag.String("years", "", "virgülle ayrılmış akademik yıllar; boşsa son 3 yıl")
	flag.Parse()

	yl, err := resolveYears(*years)
	if err != nil {
		log.Fatalf("hata: %v", err)
	}
	if err := run(*out, *workers, *rps, *limit, yl); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

// resolveYears, istek edilen akademik yılları döndürür. Boşsa bugünün yılından
// geriye 3 yıl (ör. 2026-08 → 2026, 2025, 2024).
func resolveYears(s string) ([]string, error) {
	if s != "" {
		parts := strings.Split(s, ",")
		out := make([]string, 0, len(parts))
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}
			out = append(out, p)
		}
		if len(out) == 0 {
			return nil, fmt.Errorf("-years boş")
		}
		return out, nil
	}
	now := time.Now().Year()
	// Yaz dönemi bitince yeni akademik yıl başlar; Ağustos'ta hâlâ mevcut yıl
	// (2025-2026) verisi günceldir. Basit kural: son 3 takvim yılı.
	return []string{
		fmt.Sprint(now),
		fmt.Sprint(now - 1),
		fmt.Sprint(now - 2),
	}, nil
}

func run(out string, workers int, rps float64, limit int, yl []string) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	gc := grades.New(f)
	st := store.New(out)

	codesRaw, err := os.ReadFile(filepath.Join(out, "data", "history", "codes.json"))
	if err != nil {
		return fmt.Errorf("codes.json okunamadı: %v", err)
	}
	var rows [][]any
	if err := json.Unmarshal(codesRaw, &rows); err != nil {
		return err
	}
	codes := make([]string, 0, len(rows))
	for _, r := range rows {
		if len(r) > 0 {
			codes = append(codes, fmt.Sprint(r[0]))
		}
	}
	groups := grades.GroupsFromCodes(codes)
	if limit > 0 && limit < len(groups) {
		groups = groups[:limit]
	}
	logf("%d kod → %d (brans, taban) grubu, yıllar %s", len(codes), len(groups), strings.Join(yl, ","))

	fresh := gc.ScrapeAll(ctx, groups, yl, workers, func(format string, args ...any) {
		logf(format, args...)
	})
	previous, err := loadGradesData(filepath.Join(out, "data", "grades"))
	if err != nil {
		return err
	}
	byBranch, retained := mergeGradesData(previous, fresh)
	var count int
	for _, es := range byBranch {
		count += len(es)
	}
	logf("%d dönem dağılımı (%d branş dosyası, %d önceki başarılı kayıt korundu)", count, len(byBranch), retained)

	fetchedAt := time.Now().UTC().Format(time.RFC3339)
	branches := make([]string, 0, len(byBranch))
	for b := range byBranch {
		branches = append(branches, b)
	}
	sort.Strings(branches)

	index := make([]map[string]any, 0, len(branches))
	for _, b := range branches {
		es := byBranch[b]
		if err := st.WriteJSON(es, "data", "grades", b+".json"); err != nil {
			return err
		}
		index = append(index, map[string]any{"branch": b, "terms": len(es)})
	}
	if err := st.WriteJSON(map[string]any{
		"generatedAt":   fetchedAt,
		"years":         yl,
		"terms":         count,
		"retainedTerms": retained,
		"branches":      index,
	}, "data", "grades", "index.json"); err != nil {
		return err
	}
	logf("bitti")
	return nil
}

func loadGradesData(dir string) (map[string][]grades.Entry, error) {
	out := map[string][]grades.Entry{}
	entries, err := os.ReadDir(dir)
	if os.IsNotExist(err) {
		return out, nil
	}
	if err != nil {
		return nil, err
	}
	for _, file := range entries {
		if file.IsDir() || !strings.HasSuffix(file.Name(), ".json") || file.Name() == "index.json" {
			continue
		}
		branch := strings.TrimSuffix(file.Name(), ".json")
		raw, err := os.ReadFile(filepath.Join(dir, file.Name()))
		if err != nil {
			return nil, err
		}
		var values []grades.Entry
		if err := json.Unmarshal(raw, &values); err != nil {
			return nil, fmt.Errorf("%s okunamadı: %w", file.Name(), err)
		}
		out[branch] = values
	}
	return out, nil
}

func gradeKey(entry grades.Entry) string {
	term := entry.Donem
	if term == "" {
		term = entry.Term
	}
	return entry.Code + "\x00" + term
}

func mergeGradesData(previous, fresh map[string][]grades.Entry) (map[string][]grades.Entry, int) {
	allBranches := map[string]bool{}
	for branch := range previous {
		allBranches[branch] = true
	}
	for branch := range fresh {
		allBranches[branch] = true
	}
	merged := map[string][]grades.Entry{}
	retained := 0
	for branch := range allBranches {
		byKey := map[string]grades.Entry{}
		for _, entry := range previous[branch] {
			byKey[gradeKey(entry)] = entry
		}
		retained += len(byKey)
		for _, entry := range fresh[branch] {
			key := gradeKey(entry)
			if _, existed := byKey[key]; existed {
				retained--
			}
			byKey[key] = entry
		}
		values := make([]grades.Entry, 0, len(byKey))
		for _, entry := range byKey {
			values = append(values, entry)
		}
		sort.Slice(values, func(i, j int) bool {
			if values[i].Code != values[j].Code {
				return values[i].Code < values[j].Code
			}
			return gradeKey(values[i]) < gradeKey(values[j])
		})
		merged[branch] = values
	}
	return merged, retained
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
