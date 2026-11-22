package site

// docs/_redirects (Cloudflare Pages biçimi: "/eski/ /yeni/ 301").
//
// Eski hoca sayfaları ortak verilen derslerde hoca adlarını tek slug'ta
// birleştiriyordu (/hoca/ismail-toroz-recep-kaya/). Bu sayfalar artık
// üretilmiyor ve Search Console'da 404 olarak görünüyor. Burada her eski slug,
// bugünkü bireysel hoca slug'larına bölünebiliyorsa ilk hocanın sayfasına
// kalıcı olarak yönlendirilir. Bölünemeyen (ortak olmayan) eski slug'lar
// tahminle bir kişiye bağlanmaz; 404 kalır.
//
// Cloudflare Pages yönlendirmeyi, aynı yolda bir dosya olsa bile uygular;
// bu yüzden bugün sayfası üretilen bir slug için kural yazılmaz. Sınırlar:
// 2.000 statik ve 100 dinamik kural.

import (
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

//go:embed legacy_hoca_slugs.txt
var legacyHocaSlugsTxt string

//go:embed legacy_course_slugs.txt
var legacyCourseSlugsTxt string

const (
	maxStaticRedirects  = 2000
	maxDynamicRedirects = 100
)

// dynamicRedirects: İngilizce ders/hoca sayfaları dosya sınırı yüzünden
// kaldırıldı (docs/en/ders, docs/en/hoca hiç üretilmiyor); eski /en/ URL'leri
// Türkçe karşılığına gider.
var dynamicRedirects = [][2]string{
	{"/en/ders/*", "/ders/:splat"},
	{"/en/hoca/*", "/hoca/:splat"},
}

func legacyHocaSlugs() []string { return slugLines(legacyHocaSlugsTxt) }

func legacyCourseSlugs() []string { return slugLines(legacyCourseSlugsTxt) }

func slugLines(txt string) []string {
	var out []string
	for _, line := range strings.Split(txt, "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		out = append(out, line)
	}
	return out
}

// splitCombinedSlug, eski bir ortak-hoca slug'ını bugünkü hoca slug'larına
// böler. En az iki parça gerekir; her parça (2+ kelimelik) gerçek bir slug
// olmalı, yalnızca son parça 80 karakter kesmesi yüzünden bir slug'ın başı
// olabilir. Bölünemezse "" döner. Dönen değer ilk hocanın slug'ıdır.
func splitCombinedSlug(old string, known map[string]bool, prefixOf func(string) bool) string {
	toks := strings.Split(old, "-")
	memo := map[int][]string{}
	var seg func(i int) []string
	seg = func(i int) []string {
		if i == len(toks) {
			return []string{}
		}
		if v, ok := memo[i]; ok {
			return v
		}
		var res []string
		for j := len(toks); j >= i+2 && res == nil; j-- {
			s := strings.Join(toks[i:j], "-")
			if known[s] {
				if rest := seg(j); rest != nil {
					res = append([]string{s}, rest...)
				}
			}
		}
		if res == nil && i > 0 {
			if tail := strings.Join(toks[i:], "-"); prefixOf(tail) {
				res = []string{"~" + tail}
			}
		}
		memo[i] = res
		return res
	}
	parts := seg(0)
	if len(parts) < 2 {
		return ""
	}
	return parts[0]
}

// hocaRedirectRules, eski ortak-hoca slug'ları için statik kuralları üretir.
func (b *Builder) hocaRedirectRules() [][2]string {
	known := make(map[string]bool, len(b.instructorProfiles))
	sorted := make([]string, 0, len(b.instructorProfiles))
	for slug := range b.instructorProfiles {
		known[slug] = true
		sorted = append(sorted, slug)
	}
	sort.Strings(sorted)
	prefixOf := func(p string) bool {
		i := sort.SearchStrings(sorted, p)
		return i < len(sorted) && strings.HasPrefix(sorted[i], p)
	}
	var rules [][2]string
	for _, old := range legacyHocaSlugs() {
		if known[old] {
			continue // sayfa bugün yeniden üretiliyor
		}
		if target := splitCombinedSlug(old, known, prefixOf); target != "" {
			rules = append(rules, [2]string{"/hoca/" + old + "/", "/hoca/" + target + "/"})
		}
	}
	sort.Slice(rules, func(i, j int) bool { return rules[i][0] < rules[j][0] })
	return rules
}

// courseRedirectRules: verisi kalmayan eski ders sayfaları -> branş sayfası.
// Bugün sayfası üretilen veya branşı olmayan slug'lar için kural yazılmaz.
func (b *Builder) courseRedirectRules() [][2]string {
	live := make(map[string]bool, len(b.courses))
	for code := range b.courses {
		live[courseSlug(code)] = true
	}
	var rules [][2]string
	for _, old := range legacyCourseSlugs() {
		if live[old] {
			continue
		}
		branch := strings.ToUpper(strings.SplitN(old, "-", 2)[0])
		if b.aggs[branch] == nil {
			continue
		}
		rules = append(rules, [2]string{"/ders/" + old + "/", "/brans/" + branch + "/"})
	}
	sort.Slice(rules, func(i, j int) bool { return rules[i][0] < rules[j][0] })
	return rules
}

// writeRedirectsFile, docs/_redirects dosyasını yazar ve statik kural
// sayısını döner.
func (b *Builder) writeRedirectsFile() (int, error) {
	hoca := b.hocaRedirectRules()
	course := b.courseRedirectRules()
	static := append(append([][2]string{}, hoca...), course...)
	if len(static) > maxStaticRedirects {
		static = static[:maxStaticRedirects]
	}
	var sb strings.Builder
	sb.WriteString("# cmd/site tarafından üretilir; elle düzenleme. Bkz. internal/site/redirects.go.\n")
	sb.WriteString("# Eski ortak-hoca sayfaları -> ilk hocanın bugünkü sayfası.\n")
	for _, r := range static {
		fmt.Fprintf(&sb, "%s %s 301\n", r[0], r[1])
	}
	sb.WriteString("# Kaldırılan İngilizce ders/hoca sayfaları -> Türkçe karşılığı.\n")
	for _, r := range dynamicRedirects[:min(len(dynamicRedirects), maxDynamicRedirects)] {
		fmt.Fprintf(&sb, "%s %s 301\n", r[0], r[1])
	}
	return len(static), os.WriteFile(filepath.Join(b.root, "_redirects"), []byte(sb.String()), 0o644)
}
