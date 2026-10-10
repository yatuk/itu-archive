// Command quota, aktif dönemin kontenjan doluluğundan tek bir ölçüm alır ve
// zaman serisine ekler.
//
// Ders programı taramasından ayrı bir komut olmasının sebebi frekans farkı:
// ders programı günde bir kez yeterli, kontenjan ise kayıt haftasında yarım
// saatte bir anlamlı. Ayrıca değişen hiçbir şey yoksa dosyaya dokunmuyor,
// böylece sakin dönemlerde boş commit birikmiyor.
//
// Ekle-bırak haftası bittikten sonra sayılar artık değişmez: bitişten sonraki
// ilk tam ölçüm kesin sayıları kaydeder (özete finalAt yazılır), sonraki
// koşular o dönem için ölçüm almaz. -force bunu yok sayar.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/freeze"
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
	force := flag.Bool("force", false, "ekle-bırak sonrası dondurmayı yok say, ölçüm al")
	flag.Parse()

	if err := run(*out, *workers, *rps, *force); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, force bool) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	f := fetch.New(rps, workers)
	oc := obs.New(f)

	label, err := oc.ActiveTerm(ctx, "LS")
	if err != nil {
		return err
	}
	slug := term.Slug(label)
	logf("kontenjan dönemi: %s (%s)", label, slug)

	now := time.Now()
	summaryPath := filepath.Join(out, "data", "quota", slug+".json")
	prevFinal := readFinalAt(summaryPath)
	addDropEnd, hasEnd := freeze.LoadAddDropEnd(out, slug)
	if !force && freeze.Frozen(now, addDropEnd, hasEnd, freeze.ParseTime(prevFinal)) {
		logf("%s donmuş (ekle-bırak %s'de bitti, kesin ölçüm %s) — ölçüm alınmadı",
			slug, freeze.Date(addDropEnd), prevFinal)
		return nil
	}

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
	complete := len(failed) == 0
	// Kısmi ölçüm kesin sayılmaz; eksik branşlar için bir sonraki koşu yine ölçer.
	finalAt := prevFinal
	if complete && hasEnd && !now.Before(addDropEnd) {
		finalAt = now.UTC().Format(time.RFC3339)
	}
	written, snap, err := quota.Append(path, sections, now, complete)
	if errors.Is(err, quota.ErrIncompleteInitial) {
		logf("%s: ilk ölçüm kısmi olduğu için güvenilir temel oluşana kadar atlandı", slug)
		return nil
	}
	if err != nil {
		return err
	}
	if !written && finalAt == prevFinal {
		logf("%s: %d şube okundu, değişen yok, dosyaya dokunulmadı", slug, len(sections))
		return nil
	}
	if written {
		logf("%s: %d şube okundu, %d kontenjan / %d doluluk değişikliği yazıldı",
			slug, len(sections), len(snap.Cap), len(snap.Enr))
	} else {
		// Sayılar değişmedi ama ekle-bırak sonrası kesin ölçüm alındı: yalnızca
		// özetin finalAt'i ilerler ki sonraki koşular dönemi donmuş görsün.
		logf("%s: %d şube okundu, değişen yok — kesin ölçüm olarak işaretlendi", slug, len(sections))
	}

	// Site ham JSONL'i indirmesin diye türetilmiş özeti de tazeliyoruz.
	sum, err := quota.Summarize(path, label, slug)
	if err != nil {
		return err
	}
	sum.FinalAt = finalAt
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

// readFinalAt, mevcut özetteki finalAt'i okur; dosya yoksa/bozuksa boş.
func readFinalAt(path string) string {
	b, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	var s struct {
		FinalAt string `json:"finalAt"`
	}
	_ = json.Unmarshal(b, &s)
	return s.FinalAt
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
