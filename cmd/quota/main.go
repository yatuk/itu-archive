// Command quota, aktif dönemin kontenjan doluluğundan tek bir ölçüm alır ve
// zaman serisine ekler.
//
// Ders programı taramasından ayrı bir komut olmasının sebebi frekans farkı:
// ders programı günde bir kez yeterli, kontenjan ise kayıt haftasında yarım
// saatte bir anlamlı. Ayrıca değişen hiçbir şey yoksa dosyaya dokunmuyor,
// böylece sakin dönemlerde boş commit birikmiyor.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
	"itu-scraper/internal/obs"
	"itu-scraper/internal/quota"
	"itu-scraper/internal/store"
	"itu-scraper/internal/term"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	workers := flag.Int("workers", 8, "eşzamanlı istek sayısı")
	rps := flag.Float64("rps", 6, "saniyedeki istek üst sınırı")
	flag.Parse()

	if err := run(*out, *workers, *rps); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	oc := obs.New(f)

	label, err := oc.ActiveTerm(ctx, "LS")
	if err != nil {
		return err
	}
	slug := term.Slug(label)

	branches, err := oc.AllBranches(ctx)
	if err != nil {
		return err
	}

	byBranch, failed, err := oc.ScrapeAll(ctx, branches, workers, nil)
	if err != nil {
		return err
	}
	if len(failed) > 0 {
		// Kontenjan ölçümü best-effort'tur: birkaç branş hatalıysa ölçümü
		// boşa düşürme; uyarı yaz, başarılı branşlarla devam et.
		fmt.Fprintf(os.Stderr, "· UYARI: %d/%d branş hatalı, ölçüm bunlarsız yazılıyor\n", len(failed), len(branches))
	}
	var sections []model.Section
	for _, secs := range byBranch {
		sections = append(sections, secs...)
	}
	if len(sections) == 0 {
		return fmt.Errorf("hiç şube okunamadı, ölçüm yazılmadı")
	}

	path := quota.Path(out, slug)
	written, snap, err := quota.Append(path, sections, time.Now())
	if err != nil {
		return err
	}
	if !written {
		logf("%s: %d şube okundu, değişen yok, dosyaya dokunulmadı", slug, len(sections))
		return nil
	}
	logf("%s: %d şube okundu, %d kontenjan / %d doluluk değişikliği yazıldı",
		slug, len(sections), len(snap.Cap), len(snap.Enr))

	// Site ham JSONL'i indirmesin diye türetilmiş özeti de tazeliyoruz.
	sum, err := quota.Summarize(path, label, slug)
	if err != nil {
		return err
	}
	if err := store.New(out).WriteJSON(sum, "data", "quota", slug+".json"); err != nil {
		return err
	}

	full := 0
	for _, c := range sum.Courses {
		if c.FilledAt != "" {
			full++
		}
	}
	logf("özet: %d ölçüm, %d şubeden %d tanesi dolmuş", sum.Snapshots, len(sum.Courses), full)
	return nil
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
