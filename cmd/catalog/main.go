// Command catalog, ders katalog verisini (kredi, AKTS, dil, tanım, çıktılar,
// haftalık konular, kaynak kitaplar) OBS katalog formundan çekip
// docs/data/catalog/<BRANŞ>.json altına yazar.
//
// Ayrı komut olmasının sebebi: içerik nadiren değişir, günlük scrape'e
// karıştırmak yerine haftada bir koşar (catalog.yml). Kapsam yıl geçmişindeki
// ders kodlarından türetilir; İngilizce/Türkçe çiftleri aynı katalog sayfasında
// birleştiği için kodlar (bransKodu, tabanDersNo) gruplarına indirgenir.
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

	"itu-scraper/internal/catalog"
	"itu-scraper/internal/fetch"
	"itu-scraper/internal/store"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	workers := flag.Int("workers", 8, "eşzamanlı istek sayısı")
	rps := flag.Float64("rps", 6, "saniyedeki istek üst sınırı")
	limit := flag.Int("limit", 0, "yalnızca ilk N grubu çek (test için)")
	equivs := flag.Bool("equivalents", false, "yalnızca denklik geçişi: mevcut katalog dosyalarına DersBilgi'den denklik kodlarını ekle (ayrı, aylık)")
	flag.Parse()

	if *equivs {
		if err := runEquivalents(*out, *workers, *rps, *limit); err != nil {
			log.Fatalf("hata: %v", err)
		}
		return
	}
	if err := run(*out, *workers, *rps, *limit); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, limit int) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	cc := catalog.New(f)
	st := store.New(out)

	// Yıl geçmişindeki ders kodları kapsamı belirler.
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
	groups := catalog.GroupsFromCodes(codes)
	if limit > 0 && limit < len(groups) {
		groups = groups[:limit]
	}
	logf("%d kod → %d (brans, taban) grubu", len(codes), len(groups))

	byBranch := cc.ScrapeAll(ctx, groups, workers, func(format string, args ...any) {
		logf(format, args...)
	})
	var contentCount int64
	for _, m := range byBranch {
		contentCount += int64(len(m))
	}
	logf("%d/%d grupta katalog içeriği var", contentCount, len(groups))

	fetchedAt := time.Now().UTC().Format(time.RFC3339)
	branches := make([]string, 0, len(byBranch))
	for b := range byBranch {
		branches = append(branches, b)
	}
	sort.Strings(branches)

	index := make([]map[string]any, 0, len(branches))
	for _, b := range branches {
		entries := byBranch[b]
		// Per-entry FetchedAt kaldırıldı (Faz 3, 4.7) — içerik değişmese bile
		// diff üretiyordu; koşu zamanı catalog/index.json generatedAt'inde.
		if err := st.WriteJSON(entries, "data", "catalog", b+".json"); err != nil {
			return err
		}
		index = append(index, map[string]any{"branch": b, "courses": len(entries)})
	}
	if err := st.WriteJSON(map[string]any{
		"generatedAt": fetchedAt,
		"groups":      len(groups),
		"withContent": contentCount,
		"branches":    index,
	}, "data", "catalog", "index.json"); err != nil {
		return err
	}
	logf("bitti (%d branş dosyası)", len(branches))
	return nil
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}

// runEquivalents, mevcut katalog dosyalarına DersBilgi arama ucuyla denklik
// kodlarını ekler. Ayrı ve yavaş bir geçiştir (OBS DersBilgiSearch'i throttle
// eder) — içerik nadiren değiştiği için aylık koşar; haftalık catalog.yml
// katalog formunu (weeklyPlan dahil) bu geçişten bağımsız doldurur.
func runEquivalents(out string, workers int, rps float64, limit int) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

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
	groups := catalog.GroupsFromCodes(codes)
	if limit > 0 && limit < len(groups) {
		groups = groups[:limit]
	}

	// Mevcut katalog dosyalarını yükle.
	f := fetch.New(rps, workers)
	cc := catalog.New(f)
	st := store.New(out)
	byBranch := map[string]map[string]*catalog.Entry{}
	dir := filepath.Join(out, "data", "catalog")
	dirEntries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("catalog dizini okunamadı: %v", err)
	}
	for _, e := range dirEntries {
		if !strings.HasSuffix(e.Name(), ".json") || e.Name() == "index.json" {
			continue
		}
		branch := strings.TrimSuffix(e.Name(), ".json")
		var m map[string]catalog.Entry
		raw, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			return err
		}
		if err := json.Unmarshal(raw, &m); err != nil {
			return fmt.Errorf("%s çözümlenemedi: %v", e.Name(), err)
		}
		pm := map[string]*catalog.Entry{}
		for k, v := range m {
			vv := v
			pm[k] = &vv
		}
		byBranch[branch] = pm
	}

	// Her grup için denklik çek ve o gruptaki kodlara ekle.
	updated := 0
	byCode := map[string]*catalog.Entry{}
	for _, m := range byBranch {
		for k, e := range m {
			byCode[k] = e
		}
	}
	for i, g := range groups {
		eqs, eerr := cc.Equivalents(ctx, g.Branch, g.DersNo)
		if eerr != nil || len(eqs) == 0 {
			continue
		}
		for _, code := range g.Codes {
			if e, ok := byCode[code]; ok {
				e.Equivalents = eqs
				updated++
			}
		}
		if i%250 == 0 {
			logf("denklik: %d/%d grup", i, len(groups))
		}
	}
	logf("denklik güncellenen kayıt: %d", updated)

	// Değişen branş dosyalarını yaz (yalnız denklik eklenenleri).
	written := 0
	for branch, m := range byBranch {
		dirty := false
		for _, e := range m {
			if len(e.Equivalents) > 0 {
				dirty = true
				break
			}
		}
		if !dirty {
			continue
		}
		if err := st.WriteJSON(m, "data", "catalog", branch+".json"); err != nil {
			return err
		}
		written++
	}
	logf("denklik yazılan branş dosyası: %d", written)
	return nil
}
