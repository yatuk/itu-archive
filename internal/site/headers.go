package site

// docs/_headers (Cloudflare Pages biçimi). Kurallar:
//
//   - Her yol: güvenlik başlıkları (HSTS, çerçeveleme yasağı, COOP, nosniff,
//     referrer politikası). CSP bilerek yok: satır içi betikler ve
//     stats.itu-ders.com çağrısı önce düzenlenmeli.
//   - /data/*: ham JSON/CSV dosyaları arama sonucunda görünmemeli
//     (X-Robots-Tag: noindex); uygulama bunları her açılışta okur, kısa önbellek.
//   - /assets/ altında ?v=<hash> ile sürümlenen CSS/JS (kök dosyalar, core/,
//     views/, react/): bir yıl, immutable. vendor/ (yazı tipleri, pdf.js)
//     sürüm sorgusu taşımaz; dosya adı aynı kalıp içerik değişebileceği için
//     bir hafta.
//
// Cloudflare Pages aynı isteğe uyan birden çok kuralın başlıklarını birleştirir
// (aynı ad virgülle eklenir). Bu yüzden Cache-Control yalnızca birbirine
// değmeyen yollara yazılır ve HTML için hiç yazılmaz (Pages varsayılanı:
// her istekte yeniden doğrula).

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

var securityHeaders = [][2]string{
	{"Strict-Transport-Security", "max-age=31536000; includeSubDomains"},
	{"X-Frame-Options", "DENY"},
	{"Cross-Origin-Opener-Policy", "same-origin"},
	{"X-Content-Type-Options", "nosniff"},
	{"Referrer-Policy", "strict-origin-when-cross-origin"},
}

const (
	immutableCache = "public, max-age=31536000, immutable"
	vendorCache    = "public, max-age=604800"
	dataCache      = "public, max-age=300"
)

// assetCachePaths, docs/assets altındaki sürümlenen yolları (kök dosyalar ve
// vendor dışındaki alt dizinler, "/*" ile) döner.
func assetCachePaths(assetsDir string) ([]string, error) {
	ents, err := os.ReadDir(assetsDir)
	if err != nil {
		return nil, err
	}
	var out []string
	for _, e := range ents {
		name := e.Name()
		switch {
		case e.IsDir() && name == "vendor":
			continue
		case e.IsDir():
			out = append(out, "/assets/"+name+"/*")
		case strings.HasSuffix(name, ".js") || strings.HasSuffix(name, ".css"):
			out = append(out, "/assets/"+name)
		}
	}
	sort.Strings(out)
	return out, nil
}

// renderHeaders, _headers içeriğini üretir.
func renderHeaders(assetPaths []string) string {
	var sb strings.Builder
	sb.WriteString("# cmd/site tarafından üretilir; elle düzenleme. Bkz. internal/site/headers.go.\n")
	sb.WriteString("/*\n")
	for _, h := range securityHeaders {
		fmt.Fprintf(&sb, "  %s: %s\n", h[0], h[1])
	}
	sb.WriteString("\n/data/*\n  X-Robots-Tag: noindex\n  Cache-Control: " + dataCache + "\n")
	for _, p := range assetPaths {
		fmt.Fprintf(&sb, "\n%s\n  Cache-Control: %s\n", p, immutableCache)
	}
	sb.WriteString("\n/assets/vendor/*\n  Cache-Control: " + vendorCache + "\n")
	return sb.String()
}

// writeHeadersFile, docs/_headers dosyasını yazar.
func (b *Builder) writeHeadersFile() error {
	paths, err := assetCachePaths(filepath.Join(b.root, "assets"))
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(b.root, "_headers"), []byte(renderHeaders(paths)), 0o644)
}
