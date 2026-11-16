// Command hocametre, notkutusu.com'un herkese açık JSON API'sinden hoca
// puanlarını ("hocametre") çekip toplulaştırır ve docs/data/hocametre.json'a
// yazar. Site sahibinin notkutusu yazarından izni vardır.
//
// Nazik davranır: istekler ardışık, sayfalar arası ≥1 sn, zaman aşımı var,
// 5xx/429'da kısa backoff'la yeniden dener. Okunan sayfa sayısı totalPages'ten
// azsa sıfırdan farklı kodla çıkar; kısmi veri asla yazılmaz. Yalnızca
// toplulaştırılmış değerler saklanır (e-posta, id, yorum, oy bazlı veri yok).
//
//	go run ./cmd/hocametre
//	go run ./cmd/hocametre -out /tmp/h.json
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"itu-scraper/internal/hocametre"
)

const (
	apiURL    = "https://mordor-api-production.notkutusu.com/instructors"
	pageSize  = 100
	pageDelay = 1200 * time.Millisecond
	userAgent = "itu-ders-archive/1.0 (hocametre aggregate fetcher)"
)

type page struct {
	TotalItems int                 `json:"totalItems"`
	Page       int                 `json:"page"`
	TotalPages int                 `json:"totalPages"`
	Items      []hocametre.APIItem `json:"items"`
}

func main() {
	out := flag.String("out", filepath.Join("docs", "data", "hocametre.json"), "çıktı dosyası")
	flag.Parse()
	if err := run(*out); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Minute)
	defer cancel()
	client := &http.Client{Timeout: 45 * time.Second}

	var items []hocametre.APIItem
	total, wantItems := 1, 0
	for n := 1; n <= total; n++ {
		if n > 1 {
			time.Sleep(pageDelay)
		}
		p, err := fetchPage(ctx, client, n)
		if err != nil {
			return fmt.Errorf("sayfa %d: %w", n, err)
		}
		if n == 1 {
			total, wantItems = p.TotalPages, p.TotalItems
		}
		items = append(items, p.Items...)
		log.Printf("sayfa %d/%d: %d profil", n, total, len(p.Items))
		if n == 1 && total < 1 {
			return fmt.Errorf("totalPages=%d geçersiz", total)
		}
	}
	if len(items) == 0 || len(items) < wantItems {
		return fmt.Errorf("eksik veri: %d profil okundu, %d bekleniyordu", len(items), wantItems)
	}

	ix := hocametre.NewIndex(time.Now(), hocametre.Aggregate(items))
	withVotes := 0
	for _, i := range ix.Instructors {
		if i.Votes > 0 {
			withVotes++
		}
	}

	b, err := marshal(ix)
	if err != nil {
		return err
	}
	// Yalnızca fetchedAt değiştiyse dosyaya dokunma (gereksiz git farkı olmasın).
	if old, err := hocametre.Load(out); err == nil {
		old.FetchedAt = ix.FetchedAt
		if ob, err := marshal(old); err == nil && bytes.Equal(ob, b) {
			log.Printf("değişiklik yok (%d hoca, %d oylu); dosya bırakıldı", len(ix.Instructors), withVotes)
			return nil
		}
	}
	if err := os.MkdirAll(filepath.Dir(out), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(out, b, 0o644); err != nil {
		return err
	}
	log.Printf("yazıldı: %s — %d hoca, %d oylu, %d bayt", out, len(ix.Instructors), withVotes, len(b))
	return nil
}

// marshal, 2 boşluk girintili, kararlı (map anahtarları sıralı) çıktı üretir.
func marshal(ix *hocametre.Index) ([]byte, error) {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(ix); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

// fetchPage, bir sayfayı çeker; 429/5xx ve ağ hatalarında 2 kez backoff'la dener.
func fetchPage(ctx context.Context, c *http.Client, n int) (*page, error) {
	url := fmt.Sprintf("%s?page=%d&size=%d&relations=faculty%%7CinstructorRatings", apiURL, n, pageSize)
	var lastErr error
	for attempt := 0; attempt <= 2; attempt++ {
		if attempt > 0 {
			select {
			case <-time.After(time.Duration(attempt*5) * time.Second):
			case <-ctx.Done():
				return nil, ctx.Err()
			}
		}
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("User-Agent", userAgent)
		req.Header.Set("Accept", "application/json")
		resp, err := c.Do(req)
		if err != nil {
			lastErr = err
			continue
		}
		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			lastErr = err
			continue
		}
		if resp.StatusCode == http.StatusTooManyRequests || resp.StatusCode >= 500 {
			lastErr = fmt.Errorf("HTTP %d", resp.StatusCode)
			continue
		}
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("HTTP %d", resp.StatusCode)
		}
		var p page
		if err := json.Unmarshal(body, &p); err != nil {
			return nil, fmt.Errorf("JSON çözümlenemedi: %w", err)
		}
		return &p, nil
	}
	return nil, lastErr
}
