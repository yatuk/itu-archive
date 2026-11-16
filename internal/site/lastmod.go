package site

// Ders ve hoca sayfalarının sitemap <lastmod> değeri, sayfanın gerçekten
// değişip değişmediğine göre verilir:
//
//   - Önceki üretimdeki sayfanın içerik özeti (başlık + description + <main>)
//     bu üretimdekiyle aynıysa önceki lastmod korunur.
//   - Özet değiştiyse lastmod üretim tarihi olur (SITE_BUILD_DATE ortam
//     değişkeni verilmişse o, yoksa bugünün UTC tarihi).
//   - Önceki sürümü olmayan yeni sayfa veri tarihini (son dönem tarama
//     tarihi) alır.
//
// Özete footer'daki "son tarama" tarihi ve asset sürümü girmez; her taramada
// bütün sayfaların lastmod'u sahte biçimde ilerlemesin diye. İçerik değişmeyen
// ikinci üretim aynı çıktıyı verir, CI drift denetimi bozulmaz.

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"time"
)

var (
	hashTitleRe     = regexp.MustCompile(`(?s)<title>.*?</title>`)
	hashDescRe      = regexp.MustCompile(`<meta name="description" content="[^"]*">`)
	hashMainRe      = regexp.MustCompile(`(?s)<main\b.*?</main>`)
	hashCanonicalRe = regexp.MustCompile(`<link rel="canonical" href="([^"]+)">`)
	sitemapEntryRe  = regexp.MustCompile(`(?s)<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>`)
	sitemapLastRe   = regexp.MustCompile(`<lastmod>([^<]+)</lastmod>`)
)

// contentHash, sayfanın arama motorunun gördüğü içerik kısmının özetidir.
func contentHash(html []byte) string {
	h := sha256.New()
	h.Write(hashTitleRe.Find(html))
	h.Write(hashDescRe.Find(html))
	h.Write(hashMainRe.Find(html))
	return hex.EncodeToString(h.Sum(nil))[:16]
}

// renderPage, şablonu çalıştırır, içerik özetini kaydeder ve çıktıyı yazar.
func (b *Builder) renderPage(w io.Writer, _ string, d pageData) error {
	d.FullTitle = fullTitle(d.Title, b.l.SiteTitle)
	d.Path = canonicalPath(d.Canonical)
	var buf bytes.Buffer
	if err := pageTmpl.Execute(&buf, d); err != nil {
		return err
	}
	if b.pageHashes != nil {
		b.pageHashes[d.Canonical] = contentHash(buf.Bytes())
	}
	_, err := w.Write(buf.Bytes())
	return err
}

// loadPreviousPageState, eski ders/hoca sayfaları silinmeden önce içerik
// özetlerini ve eski sitemap lastmod değerlerini okur.
func (b *Builder) loadPreviousPageState() {
	b.pageHashes = map[string]string{}
	b.prevHashes = map[string]string{}
	b.prevLastmod = map[string]string{}
	for _, dir := range []string{"ders", "hoca"} {
		entries, err := os.ReadDir(filepath.Join(b.outRoot, dir))
		if err != nil {
			continue
		}
		for _, e := range entries {
			if !e.IsDir() {
				continue
			}
			raw, err := os.ReadFile(filepath.Join(b.outRoot, dir, e.Name(), "index.html"))
			if err != nil {
				continue
			}
			if m := hashCanonicalRe.FindSubmatch(raw); m != nil {
				b.prevHashes[string(m[1])] = contentHash(raw)
			}
		}
	}
	for _, name := range []string{"courses.xml", "instructors.xml"} {
		raw, err := os.ReadFile(filepath.Join(b.root, "sitemaps", name))
		if err != nil {
			continue
		}
		for _, m := range sitemapEntryRe.FindAllSubmatch(raw, -1) {
			b.prevLastmod[string(m[1])] = string(m[2])
		}
	}
}

func buildDate() string {
	if d := os.Getenv("SITE_BUILD_DATE"); d != "" {
		return d
	}
	return time.Now().UTC().Format("2006-01-02")
}

// pageLastmod, bir ders/hoca sayfasının sitemap tarihini verir; fallback
// önceki sürümü olmayan sayfanın veri tarihidir.
func (b *Builder) pageLastmod(canonical, fallback string) string {
	cur, ok := b.pageHashes[canonical]
	if !ok {
		return fallback
	}
	prev, had := b.prevHashes[canonical]
	if !had {
		return fallback
	}
	if prev == cur {
		if lm := b.prevLastmod[canonical]; lm != "" {
			return lm
		}
		return fallback
	}
	return buildDate()
}

// componentLastmod, bir alt sitemap'teki en yeni lastmod'u döner; sitemap
// index'teki tarih böylece gerçekten değişen bölüme göre ilerler.
func componentLastmod(path, fallback string) string {
	raw, err := os.ReadFile(path)
	if err != nil {
		return fallback
	}
	latest := ""
	for _, m := range sitemapLastRe.FindAllSubmatch(raw, -1) {
		if v := string(m[1]); v > latest {
			latest = v
		}
	}
	if latest == "" {
		return fallback
	}
	return latest
}
