package main

// docs/build.json: yayın damgası. live-smoke workflow'u test ettiği commit'teki
// damgayı okur ve https://itu-ders.com/build.json aynı değeri dönene kadar
// bekler; böylece Cloudflare Pages'in o commit'i yayına aldığını tek bir
// asset'in ?v= değerine bakmadan anlar (?v= artık dosya başına; CSS ya da
// veri değişikliğinde app.js?v= aynı kalabilir).
//
// Damga, çıktı kökündeki her dosyanın yolu ve içeriğinden (build.json hariç)
// üretilen bir SHA-256 özetidir. Git'e, saate ya da makineye bağlı değildir:
// aynı docs/ ağacı her yerde aynı damgayı verir, CI drift denetimi bozulmaz.
// Yayına giden herhangi bir dosya (veri dahil) değişince damga da değişir.

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
)

const (
	buildStampFile = "build.json"
	buildStampLen  = 24
)

type buildStamp struct {
	Build string `json:"build"`
	Files int    `json:"files"`
}

// computeBuildStamp, root altındaki yayın dosyalarının özetini döner.
func computeBuildStamp(root string) (buildStamp, error) {
	var rels []string
	err := filepath.WalkDir(root, func(p string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		name := d.Name()
		if p != root && strings.HasPrefix(name, ".") {
			// Editör/işletim sistemi artığı; git'e girmez, yayına da gitmez.
			if d.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if d.IsDir() || name == "Thumbs.db" {
			return nil
		}
		rel, err := filepath.Rel(root, p)
		if err != nil {
			return err
		}
		rel = filepath.ToSlash(rel)
		if rel == buildStampFile {
			return nil
		}
		rels = append(rels, rel)
		return nil
	})
	if err != nil {
		return buildStamp{}, err
	}
	// WalkDir sözlük sırasıyla yürür; özetler paralel hesaplanıp aynı sırayla birleştirilir.
	sums := make([][sha256.Size]byte, len(rels))
	jobs := make(chan int)
	errs := make(chan error, 1)
	var wg sync.WaitGroup
	for range max(2, runtime.NumCPU()) {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range jobs {
				s, err := hashFile(filepath.Join(root, filepath.FromSlash(rels[i])))
				if err != nil {
					select {
					case errs <- fmt.Errorf("%s: %w", rels[i], err):
					default:
					}
					continue
				}
				sums[i] = s
			}
		}()
	}
	for i := range rels {
		jobs <- i
	}
	close(jobs)
	wg.Wait()
	select {
	case err := <-errs:
		return buildStamp{}, err
	default:
	}
	h := sha256.New()
	for i, rel := range rels {
		h.Write([]byte(rel))
		h.Write([]byte{0})
		h.Write(sums[i][:])
	}
	return buildStamp{Build: hex.EncodeToString(h.Sum(nil))[:buildStampLen], Files: len(rels)}, nil
}

func hashFile(path string) ([sha256.Size]byte, error) {
	var out [sha256.Size]byte
	f, err := os.Open(path)
	if err != nil {
		return out, err
	}
	defer f.Close()
	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return out, err
	}
	copy(out[:], h.Sum(nil))
	return out, nil
}

// writeBuildStamp, root/build.json'u yazar. Tüm üretim adımlarından sonra
// çağrılmalıdır (tam üretim ve -assets-only).
func writeBuildStamp(root string) (buildStamp, error) {
	s, err := computeBuildStamp(root)
	if err != nil {
		return s, err
	}
	b, err := json.MarshalIndent(s, "", " ")
	if err != nil {
		return s, err
	}
	return s, os.WriteFile(filepath.Join(root, buildStampFile), append(b, '\n'), 0o644)
}
