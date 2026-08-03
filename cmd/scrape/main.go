// Command scrape, İTÜ ders programını ve akademik takvimi çekip docs/ altına
// GitHub Pages'in servis edeceği statik JSON/CSV dosyaları yazar.
//
//	go run ./cmd/scrape              # aktif dönem + akademik takvim
//	go run ./cmd/scrape -backfill    # ek olarak tarihsel arşivi içeri al
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
	"strconv"
	"strings"
	"sync/atomic"
	"syscall"
	"time"

	"itu-scraper/internal/archive"
	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
	"itu-scraper/internal/obs"
	"itu-scraper/internal/store"
	"itu-scraper/internal/takvim"
	"itu-scraper/internal/term"
)

func termSlug(label string) string { return term.Slug(label) }
func sortKey(slug string) string   { return term.SortKey(slug) }

func main() {
	var (
		out          = flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
		workers      = flag.Int("workers", 8, "eşzamanlı istek sayısı")
		rps          = flag.Float64("rps", 6, "saniyedeki istek üst sınırı")
		backfill     = flag.Bool("backfill", false, "tarihsel arşivi içeri al")
		skipCourses  = flag.Bool("skip-courses", false, "ders programını atla")
		skipCalendar = flag.Bool("skip-calendar", false, "akademik takvimi atla")
	)
	flag.Parse()

	if err := run(*out, *workers, *rps, *backfill, *skipCourses, *skipCalendar); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, backfill, skipCourses, skipCalendar bool) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	started := time.Now()
	f := fetch.New(rps, workers)
	st := store.New(out)

	var currentSlug string

	if !skipCourses {
		slug, err := scrapeCourses(ctx, f, st, workers)
		if err != nil {
			return err
		}
		currentSlug = slug
	}

	if !skipCalendar {
		if err := scrapeCalendar(ctx, f, st); err != nil {
			return err
		}
	}

	if backfill {
		if err := runBackfill(ctx, f, st, currentSlug); err != nil {
			return err
		}
	}

	if err := writeIndex(out, st); err != nil {
		return err
	}

	logf("bitti (%s)", time.Since(started).Round(time.Second))
	return nil
}

func scrapeCourses(ctx context.Context, f *fetch.Client, st *store.Store, workers int) (string, error) {
	oc := obs.New(f)

	label, err := oc.ActiveTerm(ctx, "LS")
	if err != nil {
		return "", err
	}
	slug := termSlug(label)
	logf("aktif dönem: %s (%s)", label, slug)

	branches, err := oc.AllBranches(ctx)
	if err != nil {
		return "", err
	}
	logf("%d branş kodu bulundu", len(branches))

	var done int64
	byBranch, err := oc.ScrapeAll(ctx, branches, workers, func(br obs.Branch, n int) {
		if d := atomic.AddInt64(&done, 1); d%50 == 0 || int(d) == len(branches) {
			logf("  %d/%d branş", d, len(branches))
		}
	})
	if err != nil {
		return "", err
	}

	var sections []model.Section
	for _, secs := range byBranch {
		sections = append(sections, secs...)
	}
	if len(sections) == 0 {
		return "", fmt.Errorf("hiç ders bulunamadı — OBS uçları değişmiş olabilir")
	}
	sort.Slice(sections, func(i, j int) bool { return sections[i].CRN < sections[j].CRN })

	if err := st.Clean(slug); err != nil {
		return "", err
	}
	meta, err := st.WriteTerm(label, slug, time.Now().UTC().Format(time.RFC3339), "obs", sections)
	if err != nil {
		return "", err
	}
	logf("%s: %d şube, %d ders, %d branş yazıldı", slug, meta.Sections, meta.Courses, len(meta.Branches))
	return slug, nil
}

func scrapeCalendar(ctx context.Context, f *fetch.Client, st *store.Store) error {
	tc := takvim.New(f)
	years, err := tc.Years(ctx)
	if err != nil {
		return err
	}
	logf("%d akademik yıl takvimi çekiliyor", len(years))
	for _, y := range years {
		cal, err := tc.Fetch(ctx, y)
		if err != nil {
			return err
		}
		if err := st.WriteJSON(cal, "data", "calendar", y.ID+".json"); err != nil {
			return err
		}
		logf("  takvim %s: %d satır", cal.Year, len(cal.Events))
	}
	return nil
}

func runBackfill(ctx context.Context, f *fetch.Client, st *store.Store, currentSlug string) error {
	// Ders taraması atlandıysa aktif dönemi yine de öğrenmemiz gerekiyor:
	// aksi halde arşiv sürümü canlı dönemin zengin kaydının üzerine yazar.
	if currentSlug == "" {
		label, err := obs.New(f).ActiveTerm(ctx, "LS")
		if err != nil {
			return fmt.Errorf("aktif dönem belirlenemedi, arşiv canlı veriyi ezebilir: %w", err)
		}
		currentSlug = termSlug(label)
	}

	// Arşivde seviye bilgisi yok; branş kodundan seviyeyi bugünkü OBS listesiyle
	// tahmin ediyoruz. Kusursuz değil (kapanmış branşlar boş kalır) ama filtreleri
	// çalışır kılmaya yetiyor.
	levels := map[string]string{}
	if brs, err := obs.New(f).AllBranches(ctx); err == nil {
		for _, br := range brs {
			if _, seen := levels[br.Code]; !seen {
				levels[br.Code] = br.Level
			}
		}
	}

	snaps, err := archive.Fetch(ctx, f, levels, logf)
	if err != nil {
		return err
	}
	stamp := time.Now().UTC().Format(time.RFC3339)
	for _, sn := range snaps {
		if sn.Slug == currentSlug {
			logf("%s: canlı scrape ile aynı dönem, arşiv sürümü atlandı", sn.Slug)
			continue
		}
		if err := st.Clean(sn.Slug); err != nil {
			return err
		}
		meta, err := st.WriteTerm(sn.Label, sn.Slug, stamp, "archive:"+archive.Source, sn.Sections)
		if err != nil {
			return err
		}
		logf("%s: %d şube arşivden yazıldı", sn.Slug, meta.Sections)
	}
	return nil
}

// writeIndex, docs/data/terms altındaki tüm meta.json'ları tarayarak site
// indeksini yeniden kurar. Dizinden okumak önemli: günlük çalıştırmada yalnızca
// aktif dönem yenilenir, geçmiş dönemler indeksten düşmemeli.
func writeIndex(root string, st *store.Store) error {
	termsDir := filepath.Join(root, "data", "terms")
	entries, err := os.ReadDir(termsDir)
	if err != nil {
		return fmt.Errorf("dönem dizini okunamadı: %w", err)
	}

	var refs []model.TermRef
	var current model.TermRef
	var currentMeta model.TermMeta
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		b, err := os.ReadFile(filepath.Join(termsDir, e.Name(), "meta.json"))
		if err != nil {
			continue
		}
		var m model.TermMeta
		if err := json.Unmarshal(b, &m); err != nil {
			continue
		}
		refs = append(refs, model.TermRef{
			Slug: m.Slug, Label: m.Term, ScrapedAt: m.ScrapedAt,
			Source: m.Source, Sections: m.Sections,
		})
		if strings.HasPrefix(m.Source, "obs") {
			current = model.TermRef{Slug: m.Slug, Label: m.Term, ScrapedAt: m.ScrapedAt}
			currentMeta = m
		}
	}
	if len(refs) == 0 {
		return fmt.Errorf("indekslenecek dönem bulunamadı")
	}

	refs = append(refs, missingTerms(refs)...)
	sort.Slice(refs, func(i, j int) bool { return sortKey(refs[i].Slug) > sortKey(refs[j].Slug) })

	// Canlı taranmış dönem yoksa (yalnızca arşiv yazılmışsa) site yine de bir
	// dönemle açılsın: en güncelini seç.
	if current.Slug == "" {
		for _, r := range refs {
			if !r.Missing {
				current = r
				break
			}
		}
	}

	var cals []model.CalRef
	calDir := filepath.Join(root, "data", "calendar")
	if ents, err := os.ReadDir(calDir); err == nil {
		for _, e := range ents {
			b, err := os.ReadFile(filepath.Join(calDir, e.Name()))
			if err != nil {
				continue
			}
			var c model.Calendar
			if json.Unmarshal(b, &c) == nil {
				cals = append(cals, model.CalRef{YearID: c.YearID, Label: c.Year, Events: len(c.Events)})
			}
		}
	}
	sort.Slice(cals, func(i, j int) bool { return cals[i].Label > cals[j].Label })

	idx := model.SiteIndex{
		CurrentTerm: current.Label,
		CurrentSlug: current.Slug,
		ScrapedAt:   current.ScrapedAt,
		Terms:       refs,
		Calendars:   cals,
		Stats:       currentMeta.Stats,
	}
	if err := st.WriteJSON(idx, "data", "index.json"); err != nil {
		return err
	}
	logf("indeks: %d dönem, %d takvim yılı", len(refs), len(cals))
	return nil
}

// missingTerms, arşivdeki en eski ve en yeni dönem arasında verisi olmayan
// dönemleri bulur. Bunları sitede boş göstermek, sessizce yok saymaktan iyi:
// örneğin 2024-2025 Güz hiçbir kaynakta yok.
func missingTerms(have []model.TermRef) []model.TermRef {
	seen := map[string]bool{}
	minYear, maxYear := 9999, 0
	for _, r := range have {
		seen[r.Slug] = true
		if y, err := strconv.Atoi(strings.SplitN(r.Slug, "-", 2)[0]); err == nil {
			if y < minYear {
				minYear = y
			}
			if y > maxYear {
				maxYear = y
			}
		}
	}
	if maxYear == 0 {
		return nil
	}

	seasons := []struct{ slug, label string }{{"guz", "Güz"}, {"bahar", "Bahar"}, {"yaz", "Yaz"}}
	var out []model.TermRef
	for y := minYear; y <= maxYear; y++ {
		for _, s := range seasons {
			slug := fmt.Sprintf("%d-%d-%s", y, y+1, s.slug)
			if seen[slug] {
				continue
			}
			// Aralığın dışına taşan uçları ekleme.
			if sortKey(slug) < minKey(have) || sortKey(slug) > maxKey(have) {
				continue
			}
			out = append(out, model.TermRef{
				Slug:    slug,
				Label:   fmt.Sprintf("%d-%d %s Dönemi", y, y+1, s.label),
				Missing: true,
			})
		}
	}
	return out
}

func minKey(refs []model.TermRef) string {
	k := "9999"
	for _, r := range refs {
		if v := sortKey(r.Slug); v < k {
			k = v
		}
	}
	return k
}

func maxKey(refs []model.TermRef) string {
	k := ""
	for _, r := range refs {
		if v := sortKey(r.Slug); v > k {
			k = v
		}
	}
	return k
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
