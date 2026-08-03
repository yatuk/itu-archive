// Package fetch, İTÜ sunucularına karşı nazik davranan bir HTTP istemcisi sağlar:
// eş zamanlılık sınırı, denemeler arası exponential backoff ve karışık kodlama düzeltmesi.
package fetch

import (
	"context"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"golang.org/x/time/rate"
)

const userAgent = "itu-scraper/1.0 (+https://github.com/topics/itu; public schedule archiver)"

// Client, tüm scraper'ların paylaştığı istemci.
type Client struct {
	http    *http.Client
	limiter *rate.Limiter
	Retries int
}

// New, saniyede rps istek yapan bir istemci döndürür.
func New(rps float64, burst int) *Client {
	return &Client{
		http: &http.Client{
			Timeout: 45 * time.Second,
			Transport: &http.Transport{
				MaxIdleConnsPerHost: 16,
				IdleConnTimeout:     30 * time.Second,
			},
		},
		limiter: rate.NewLimiter(rate.Limit(rps), burst),
		Retries: 4,
	}
}

// Bytes, url'yi çeker ve ham gövdeyi döndürür. 5xx ve ağ hatalarında yeniden dener.
func (c *Client) Bytes(ctx context.Context, url string) ([]byte, error) {
	var lastErr error
	for attempt := 0; attempt <= c.Retries; attempt++ {
		if attempt > 0 {
			// 0.5s, 1s, 2s, 4s + jitter
			backoff := time.Duration(500<<uint(attempt-1)) * time.Millisecond
			jitter := time.Duration(rand.Int63n(int64(backoff / 2)))
			select {
			case <-time.After(backoff + jitter):
			case <-ctx.Done():
				return nil, ctx.Err()
			}
		}
		if err := c.limiter.Wait(ctx); err != nil {
			return nil, err
		}

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("User-Agent", userAgent)
		req.Header.Set("Accept-Language", "tr-TR,tr;q=0.9,en;q=0.8")
		req.Header.Set("Accept", "text/html,application/json,*/*")

		resp, err := c.http.Do(req)
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
		if resp.StatusCode >= 500 || resp.StatusCode == 429 {
			lastErr = fmt.Errorf("%s: HTTP %d", url, resp.StatusCode)
			continue
		}
		if resp.StatusCode != http.StatusOK {
			// 4xx'te yeniden denemenin anlamı yok.
			return nil, fmt.Errorf("%s: HTTP %d", url, resp.StatusCode)
		}
		return body, nil
	}
	return nil, fmt.Errorf("%s: %d deneme sonrası başarısız: %w", url, c.Retries+1, lastErr)
}

// Text, gövdeyi çeker ve DecodeMixed ile metne çevirir.
func (c *Client) Text(ctx context.Context, url string) (string, error) {
	b, err := c.Bytes(ctx, url)
	if err != nil {
		return "", err
	}
	return DecodeMixed(b), nil
}

// latin5 tablosu: ISO-8859-9'un 0xA0-0xFF aralığındaki Türkçe'ye özgü sapmaları.
// Geri kalanı Latin-1 ile aynı olduğundan rune(b) doğru sonucu verir.
var latin5 = map[byte]rune{
	0xD0: 'Ğ', 0xF0: 'ğ',
	0xDD: 'İ', 0xFD: 'ı',
	0xDE: 'Ş', 0xFE: 'ş',
}

// DecodeMixed, aynı belgede hem UTF-8 hem ISO-8859-9 baytları bulunan sayfaları çözer.
// takvim.sis.itu.edu.tr tam olarak bunu yapıyor: statik şablon Latin-5, veritabanından
// gelen metinler UTF-8. Tek bir kodlamayla okumak ya "Ã¼" ya da "E\xc5\x9fitim" üretiyor.
//
// Yöntem: her konumda önce geçerli ve makul (yazdırılabilir) bir çok baytlı UTF-8
// dizisi var mı bakılır; varsa o tüketilir, yoksa tek bayt Latin-5 olarak okunur.
func DecodeMixed(b []byte) string {
	var sb strings.Builder
	sb.Grow(len(b))
	for i := 0; i < len(b); {
		c := b[i]
		if c < utf8.RuneSelf {
			sb.WriteByte(c)
			i++
			continue
		}
		if r, size := utf8.DecodeRune(b[i:]); r != utf8.RuneError && size > 1 && plausible(r) {
			sb.WriteRune(r)
			i += size
			continue
		}
		if r, ok := latin5[c]; ok {
			sb.WriteRune(r)
		} else {
			sb.WriteRune(rune(c)) // Latin-1 ile örtüşen bölge
		}
		i++
	}
	return sb.String()
}

// plausible, bir rune'un gerçekten metin olma ihtimalini kontrol eder. Latin-5 bayt
// çiftlerinin tesadüfen geçerli UTF-8 oluşturmasını eler; bu durumlarda ikinci bayt
// neredeyse her zaman C1 kontrol karakterine denk gelir.
func plausible(r rune) bool {
	if r >= 0x80 && r <= 0x9F {
		return false
	}
	return unicode.IsGraphic(r)
}
