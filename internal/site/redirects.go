package site

// docs/_redirects (Cloudflare Pages biçimi: "/eski/ /yeni/ 301").
//
// Kaynak listeler (legacy_hoca_slugs.txt, legacy_course_slugs.txt) depo
// geçmişinde bir zamanlar yayımlanmış tüm hoca/ders slug'larını içerir ve
// cmd/legacy-slugs ile git geçmişinden yeniden üretilir. Bugün sayfası olan
// slug için kural yazılmaz. Kalanlar:
//
//   - eski ortak-hoca slug'ı (/hoca/ismail-toroz-recep-kaya/) bugünkü bireysel
//     slug'lara bölünebiliyorsa ilk hocanın sayfasına,
//   - bugünkü tek bir slug'ın ön eki ise (handan-palak -> handan-palak-erginsoy)
//     o sayfaya,
//   - aksi halde (hocanın sayfası artık yok) /hoca/ dizinine,
//   - eski ders sayfaları branş sayfasına, branş da yoksa /bolumler/ dizinine
//
// kalıcı olarak yönlendirilir. Ayrıca İngilizce iniş sayfalarının eski
// (Türkçe slug'lı) adresleri yeni İngilizce slug'a gider.
//
// Cloudflare Pages yönlendirmeyi, aynı yolda bir dosya olsa bile uygular;
// bu yüzden bugün sayfası üretilen bir yol için kural yazılmaz ve dinamik
// kurallar canlı bir dizini gölgeleyemez. Sınırlar: 2.000 statik ve 100
// dinamik kural. Sınır aşılırsa düşük öncelikli gruplar (önce "/hoca/ dizinine"
// kuralları) kesilir ve dosyaya not düşülür.

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

// Yönlendirme grupları, öncelik sırasıyla. Sınır aşılırsa sondan kesilir.
const (
	redirEnLanding   = iota // eski İngilizce iniş slug'ı -> yeni slug
	redirHocaPerson         // ortak/yeniden adlandırılmış hoca -> bugünkü hoca
	redirCourseBrans        // eski ders -> branş sayfası
	redirCourseIndex        // eski ders, branşı da yok -> /bolumler/
	redirHocaIndex          // sayfası kalmayan hoca -> /hoca/
	redirGroups
)

var redirGroupNotes = [redirGroups]string{
	"Eski İngilizce iniş sayfası adresleri -> yeni İngilizce slug.",
	"Eski ortak-hoca veya yeniden adlandırılmış hoca sayfaları -> bugünkü hoca sayfası.",
	"Verisi kalmayan eski ders sayfaları -> branş sayfası.",
	"Branşı da kalmayan eski ders sayfaları -> bölüm dizini.",
	"Sayfası kalmayan hocalar -> hoca dizini.",
}

type redirectRule struct {
	from, to string
	group    int
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

// renamedSlug, eski slug'ın tek bir bugünkü slug'ın kelime sınırındaki ön eki
// olduğu durumu (soyadı eklenmesi: handan-palak -> handan-palak-erginsoy)
// bulur. Birden fazla aday varsa tahmin yapılmaz, "" döner. sorted, sıralı
// bugünkü slug listesidir.
func renamedSlug(old string, sorted []string) string {
	p := old + "-"
	i := sort.SearchStrings(sorted, p)
	if i >= len(sorted) || !strings.HasPrefix(sorted[i], p) {
		return ""
	}
	if i+1 < len(sorted) && strings.HasPrefix(sorted[i+1], p) {
		return ""
	}
	return sorted[i]
}

// hocaTarget, eski bir hoca slug'ının yönlendirme hedefini ve grubunu verir.
func hocaTarget(old string, known map[string]bool, sorted []string) (string, int) {
	prefixOf := func(p string) bool {
		i := sort.SearchStrings(sorted, p)
		return i < len(sorted) && strings.HasPrefix(sorted[i], p)
	}
	if t := splitCombinedSlug(old, known, prefixOf); t != "" {
		return "/hoca/" + t + "/", redirHocaPerson
	}
	if t := renamedSlug(old, sorted); t != "" {
		return "/hoca/" + t + "/", redirHocaPerson
	}
	return "/" + hocaIndexSlug + "/", redirHocaIndex
}

// hocaRedirectRules, bugün sayfası olmayan eski hoca slug'ları için kuralları
// üretir.
func (b *Builder) hocaRedirectRules() []redirectRule {
	known := make(map[string]bool, len(b.instructorProfiles))
	sorted := make([]string, 0, len(b.instructorProfiles))
	for slug := range b.instructorProfiles {
		known[slug] = true
		sorted = append(sorted, slug)
	}
	sort.Strings(sorted)
	var rules []redirectRule
	for _, old := range legacyHocaSlugs() {
		if known[old] {
			continue // sayfa bugün yeniden üretiliyor
		}
		to, g := hocaTarget(old, known, sorted)
		rules = append(rules, redirectRule{"/hoca/" + old + "/", to, g})
	}
	return rules
}

// courseRedirectRules: verisi kalmayan eski ders sayfaları -> branş sayfası;
// branş da yoksa bölüm dizini. Bugün sayfası üretilen slug için kural yazılmaz.
func (b *Builder) courseRedirectRules() []redirectRule {
	live := make(map[string]bool, len(b.courses))
	for code := range b.courses {
		live[courseSlug(code)] = true
	}
	var rules []redirectRule
	for _, old := range legacyCourseSlugs() {
		if live[old] {
			continue
		}
		branch := strings.ToUpper(strings.SplitN(old, "-", 2)[0])
		if b.aggs[branch] == nil {
			rules = append(rules, redirectRule{"/ders/" + old + "/", "/" + bolumlerSlug + "/", redirCourseIndex})
			continue
		}
		rules = append(rules, redirectRule{"/ders/" + old + "/", "/brans/" + branch + "/", redirCourseBrans})
	}
	return rules
}

// enLandingRedirectRules: İngilizce iniş sayfaları önce Türkçe slug'la
// (/en/gano-hesaplama/) yayımlanıyordu; bugün İngilizce slug'ları var. Eski
// adreste bir meta-refresh + noindex sayfası da üretilir (writeRedirectPage,
// sunucu yönlendirmesi olmayan barındırma için), Cloudflare'de gerçek 301 bu
// kuralla verilir ve o sayfa hiç sunulmaz.
func enLandingRedirectRules() []redirectRule {
	var rules []redirectRule
	for _, p := range landingPages {
		if p.titleEN == "" || p.slugEN == "" || p.slugEN == p.slug {
			continue
		}
		rules = append(rules, redirectRule{"/en/" + p.slug + "/", "/en/" + p.slugEN + "/", redirEnLanding})
	}
	rules = append(rules, redirectRule{"/en/" + bolumlerSlug + "/", "/en/" + bolumlerSlugEN + "/", redirEnLanding})
	return rules
}

// staticRedirectRules, tüm statik kuralları öncelik ve yol sırasıyla, sınıra
// göre kesilmiş olarak döner; ikinci değer gruba göre kesilen kural sayısıdır.
func (b *Builder) staticRedirectRules() ([]redirectRule, [redirGroups]int) {
	all := append(append(enLandingRedirectRules(), b.hocaRedirectRules()...), b.courseRedirectRules()...)
	return prioritizeRedirects(all, maxStaticRedirects)
}

// prioritizeRedirects, kuralları grup önceliği ve yol sırasına dizer, max'ı
// aşanları sondan (en düşük öncelikli gruptan) keser.
func prioritizeRedirects(all []redirectRule, max int) ([]redirectRule, [redirGroups]int) {
	sort.SliceStable(all, func(i, j int) bool {
		if all[i].group != all[j].group {
			return all[i].group < all[j].group
		}
		return all[i].from < all[j].from
	})
	var dropped [redirGroups]int
	if len(all) > max {
		for _, r := range all[max:] {
			dropped[r.group]++
		}
		all = all[:max]
	}
	return all, dropped
}

// checkDynamicRedirects, dinamik bir kuralın canlı bir sayfayı gölgelemediğini
// doğrular: kuralın ön ekine denk gelen dizinde hiç index.html olmamalı.
func checkDynamicRedirects(root string) error {
	for _, r := range dynamicRedirects {
		dir := filepath.Join(root, filepath.FromSlash(strings.Trim(strings.TrimSuffix(r[0], "*"), "/")))
		found := ""
		_ = filepath.WalkDir(dir, func(p string, d os.DirEntry, err error) error {
			if err == nil && !d.IsDir() && d.Name() == "index.html" {
				found = p
				return filepath.SkipAll
			}
			return nil
		})
		if found != "" {
			return fmt.Errorf("dinamik yönlendirme %s canlı bir sayfayı gölgeliyor: %s", r[0], found)
		}
	}
	return nil
}

// renderRedirects, _redirects dosyasının içeriğini üretir.
func renderRedirects(static []redirectRule, dropped [redirGroups]int) string {
	var sb strings.Builder
	sb.WriteString("# cmd/site tarafından üretilir; elle düzenleme. Bkz. internal/site/redirects.go.\n")
	group := -1
	for _, r := range static {
		if r.group != group {
			group = r.group
			sb.WriteString("# " + redirGroupNotes[group] + "\n")
		}
		fmt.Fprintf(&sb, "%s %s 301\n", r.from, r.to)
	}
	for g, n := range dropped {
		if n > 0 {
			fmt.Fprintf(&sb, "# Statik kural sınırı (%d) yüzünden yazılmayan: %d kural (%s)\n", maxStaticRedirects, n, redirGroupNotes[g])
		}
	}
	sb.WriteString("# Kaldırılan İngilizce ders/hoca sayfaları -> Türkçe karşılığı.\n")
	for _, r := range dynamicRedirects[:min(len(dynamicRedirects), maxDynamicRedirects)] {
		fmt.Fprintf(&sb, "%s %s 301\n", r[0], r[1])
	}
	return sb.String()
}

// writeRedirectsFile, docs/_redirects dosyasını yazar ve statik kural
// sayısını döner.
func (b *Builder) writeRedirectsFile() (int, error) {
	if err := checkDynamicRedirects(b.root); err != nil {
		return 0, err
	}
	static, dropped := b.staticRedirectRules()
	for g, n := range dropped {
		if n > 0 {
			fmt.Fprintf(os.Stderr, "· _redirects: sınır yüzünden %d kural yazılmadı (%s)\n", n, redirGroupNotes[g])
		}
	}
	return len(static), os.WriteFile(filepath.Join(b.root, "_redirects"), []byte(renderRedirects(static, dropped)), 0o644)
}
