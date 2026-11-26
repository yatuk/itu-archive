package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// Uygulama CSS'inin ilk boyama için bölünmesi.
//
// assets-src/style.css tek kaynak olarak kalır ve küçültülüp docs/assets/
// style.css'e eksiksiz yazılır (statik SEO sayfaları bu dosyayı kullanır).
// Uygulama (docs/index.html) ise yalnız kabuk + Dersler + paylaşılan
// bileşenleri taşıyan css/app.css ile açılır; sekmeye özgü kurallar
// css/<sekme>.css dosyalarına ayrılır ve sekme ilk açıldığında, görünüm
// gösterilmeden önce yüklenir (core/lazy-style.js). Yalnız statik sayfalarda
// kullanılan kurallar uygulama CSS'ine hiç girmez.
//
// Bölme seçici sahipliğine göre yapılır: sekmenin bir belirtecini (ör.
// #view-program, .p-) taşıyan seçici o sekmenin dosyasına gider, belirteci
// olmayan ya da iki sekmeye birden uyan seçici çekirdekte kalır. Karışık bir
// seçici listesi aynı gövdeyle kovalara bölünür (tarayıcıya özgü sözde öğe
// içeren listeler hariç).
// :not()/:is()/:where()/:has() argümanları sahiplik vermez (yalnız
// daraltırlar). Kurallar her dosyada kaynak sırasını korur; @media/@supports
// blokları parçalanıp her dosyada aynı koşulla yeniden sarılır. @font-face,
// @keyframes gibi diğer at-kuralları çekirdekte kalır. Sınıf adlarının sekme
// modülleri dışında kullanılmadığını csssplit_test.go denetler.

// cssBucket, bir sekme CSS parçasının sahiplik belirteçleri.
type cssBucket struct {
	name   string           // css/<name>.css
	app    bool             // false: yalnız statik sayfalar (style.css'te kalır, uygulamaya hiç gitmez)
	tokens []*regexp.Regexp // sadeleştirilmiş seçicide aranır
	shared []string         // belirteçle eşleşse de paylaşılan, çekirdekte kalan sınıflar
	// owners, bu kovanın sınıflarını DOM'a basmasına izin verilen kaynaklar:
	// repo köküne göre dosya yolları ve index.html bölgeleri ("index#view-x",
	// "index#detail"). Bunlar yalnız kova yüklendikten sonra çalışır/görünür.
	owners []string
}

func tokenRE(prefixes ...string) []*regexp.Regexp {
	var out []*regexp.Regexp
	for _, p := range prefixes {
		// Belirteç, sınıf/kimlik adının başında olmalı: ".p-" ".tt-p-x"i yakalamaz.
		out = append(out, regexp.MustCompile(regexp.QuoteMeta(p)+`[A-Za-z0-9_-]*`))
	}
	return out
}

const reactUI = "react-widgets/dersler-table/src/components/ui/"

// appCSSBuckets: bir seçici birden çok kovaya uyuyorsa çekirdekte kalır.
// #view-<ad> kimliği diğer belirteçlerden önce gelir: o görünümün içindeki her
// şey, başka bir kovanın sınıfını taşısa bile o görünüme aittir. Kova adları
// assets-src/app.js'teki sekme → stil eşlemesiyle aynıdır.
var appCSSBuckets = []cssBucket{
	{name: "detail", app: true,
		tokens: tokenRE("#detail-", ".detail-", ".d-", ".cdr-", ".course-reader"),
		owners: []string{"assets-src/core/course-detail.js", reactUI + "course-detail-reader.tsx", "index#detail"}},
	{name: "dersplanim", app: true,
		tokens: tokenRE("#view-dersplanim", "#dp-", ".dp-", ".curriculum-", ".gpa-", ".transcript-"),
		owners: []string{"assets-src/views/dersplanim.js", "assets-src/core/transcript.js", "assets-src/core/planstore.js",
			"assets-src/core/planner.js", "assets-src/core/grades.js", "assets-src/core/backup.js", "assets-src/core/pdf-extract.js",
			reactUI + "curriculum-plan.tsx", reactUI + "gpa-summary.tsx", "index#view-dersplanim"}},
	{name: "onsart", app: true,
		tokens: tokenRE("#view-onsart", "#pg-", ".pg-"),
		owners: []string{"assets-src/prereq.js", reactUI + "prereq-detail.tsx", "index#view-onsart"}},
	{name: "program", app: true,
		tokens: tokenRE("#view-program", "#p-", ".p-", "#af-", ".af-"), shared: []string{".p-danger"},
		owners: []string{"assets-src/views/program.js", "assets-src/core/altfind.js",
			reactUI + "program-schedule.tsx", reactUI + "program-course-list.tsx", "index#view-program"}},
	{name: "takvim", app: true,
		tokens: tokenRE("#view-takvim", "#cal-", ".cal-"),
		owners: []string{"assets-src/views/calendar.js", reactUI + "calendar-timeline.tsx", "index#view-takvim"}},
	{name: "sinavlar", app: true,
		tokens: tokenRE("#view-sinavlar", ".xm-"),
		owners: []string{"assets-src/views/exams.js", reactUI + "exams-list.tsx", "index#view-sinavlar"}},
	{name: "gecmis", app: true,
		tokens: tokenRE("#view-gecmis", ".hist-"),
		owners: []string{"assets-src/views/history.js", reactUI + "history-search.tsx", reactUI + "history-detail.tsx", "index#view-gecmis"}},
	{name: "donemler", app: true,
		tokens: tokenRE("#view-donemler", "#term-", ".term-"),
		owners: []string{"assets-src/views/terms.js", reactUI + "terms-grid.tsx", "index#view-donemler"}},
	{name: "hakkinda", app: true,
		tokens: tokenRE("#view-hakkinda", "#ab-", ".ab-"),
		owners: []string{"assets-src/views/terms.js", "index#view-hakkinda"}},
	{name: "pages", app: false,
		tokens: tokenRE(".ip-", ".guide-", ".seo-", ".hub-", ".hx-", ".lp-"),
		owners: []string{"assets-src/static-page.js", "assets-src/landing.js", "assets-src/landing-calendar.js"}},
}

// appCSSCore, uygulamanın ilk boyamada yüklediği çekirdek dosya.
const appCSSCore = "app"

// cssNode, küçültülmüş CSS'in bir üst düzey öğesidir.
type cssNode struct {
	prelude  string    // seçici ya da at-kural başlığı
	body     string    // yaprak kuralın gövdesi (süslü parantez içi)
	children []cssNode // @media/@supports gibi grup at-kurallarının çocukları
	group    bool
	stmt     bool // ';' ile biten deyim (@charset, @import)
}

func (n cssNode) String() string {
	if n.stmt {
		return n.prelude + ";"
	}
	if n.group {
		var b strings.Builder
		b.WriteString(n.prelude + "{")
		for _, c := range n.children {
			b.WriteString(c.String())
		}
		b.WriteString("}")
		return b.String()
	}
	return n.prelude + "{" + n.body + "}"
}

// scanCSS, s içinde i'den başlayıp dizgi ve kaçışları atlayarak ilk stop
// karakterini (derinlik 0'da) arar; bulunamazsa len(s) döner.
func scanCSS(s string, i int, stops string) int {
	paren := 0
	for i < len(s) {
		c := s[i]
		switch {
		case c == '\\':
			i += 2
			continue
		case c == '"' || c == '\'':
			j := i + 1
			for j < len(s) && s[j] != c {
				if s[j] == '\\' {
					j++
				}
				j++
			}
			i = j + 1
			continue
		case c == '(':
			paren++
		case c == ')':
			if paren > 0 {
				paren--
			}
		case paren == 0 && strings.IndexByte(stops, c) >= 0:
			return i
		}
		i++
	}
	return len(s)
}

// matchBrace, s[open]=='{' için eşleşen '}' konumunu döner.
func matchBrace(s string, open int) (int, error) {
	depth := 0
	i := open
	for i < len(s) {
		j := scanCSS(s, i, "{}")
		if j >= len(s) {
			break
		}
		if s[j] == '{' {
			depth++
		} else {
			depth--
			if depth == 0 {
				return j, nil
			}
		}
		i = j + 1
	}
	return 0, fmt.Errorf("kapanmayan süslü parantez (konum %d)", open)
}

var groupAtRules = []string{"@media", "@supports", "@container", "@layer"}

func parseCSS(s string) ([]cssNode, error) {
	var nodes []cssNode
	i := 0
	for {
		for i < len(s) && strings.ContainsRune(" \t\r\n", rune(s[i])) {
			i++
		}
		if i >= len(s) {
			return nodes, nil
		}
		j := scanCSS(s, i, "{;}")
		if j >= len(s) {
			return nil, fmt.Errorf("beklenmeyen CSS sonu (konum %d)", i)
		}
		if s[j] == '}' {
			return nil, fmt.Errorf("beklenmeyen '}' (konum %d)", j)
		}
		prelude := strings.TrimSpace(s[i:j])
		if s[j] == ';' {
			nodes = append(nodes, cssNode{prelude: prelude, stmt: true})
			i = j + 1
			continue
		}
		end, err := matchBrace(s, j)
		if err != nil {
			return nil, err
		}
		body := s[j+1 : end]
		n := cssNode{prelude: prelude, body: body}
		for _, at := range groupAtRules {
			if strings.HasPrefix(prelude, at) {
				kids, err := parseCSS(body)
				if err != nil {
					return nil, err
				}
				n.group, n.children, n.body = true, kids, ""
				break
			}
		}
		nodes = append(nodes, n)
		i = end + 1
	}
}

// splitSelectors, seçici listesini parantez dışındaki virgüllerden böler.
func splitSelectors(prelude string) []string {
	var out []string
	start := 0
	for {
		j := scanCSS(prelude, start, ",")
		out = append(out, strings.TrimSpace(prelude[start:j]))
		if j >= len(prelude) {
			return out
		}
		start = j + 1
	}
}

var functionalPseudoRE = regexp.MustCompile(`:(?:not|is|where|has)\(`)

// stripFunctionalPseudos, :not()/:is()/:where()/:has() argümanlarını çıkarır;
// bunların içindeki sınıflar eşleşen öğenin sahipliğini belirlemez.
func stripFunctionalPseudos(sel string) string {
	for {
		loc := functionalPseudoRE.FindStringIndex(sel)
		if loc == nil {
			return sel
		}
		open := loc[1] - 1
		depth := 0
		end := len(sel)
		for k := open; k < len(sel); k++ {
			if sel[k] == '(' {
				depth++
			} else if sel[k] == ')' {
				depth--
				if depth == 0 {
					end = k
					break
				}
			}
		}
		if end >= len(sel) {
			return sel[:loc[0]]
		}
		sel = sel[:loc[0]] + sel[end+1:]
	}
}

// selectorBucket, tek bir seçicinin ait olduğu kovanın indisini (-1: çekirdek) döner.
func selectorBucket(sel string, buckets []cssBucket) int {
	s := stripFunctionalPseudos(sel)
	// Görünüm kimliği her şeyden önce gelir.
	viewHit := -1
	for bi, b := range buckets {
		for _, t := range b.tokens {
			if strings.HasPrefix(t.String(), `#view-`) && t.MatchString(s) {
				if viewHit >= 0 && viewHit != bi {
					return -1
				}
				viewHit = bi
			}
		}
	}
	if viewHit >= 0 {
		return viewHit
	}
	hit := -1
	for bi, b := range buckets {
		for _, t := range b.tokens {
			for _, m := range t.FindAllString(s, -1) {
				if isSharedClass(m, b.shared) {
					return -1
				}
				if hit >= 0 && hit != bi {
					return -1
				}
				hit = bi
			}
		}
	}
	return hit
}

func isSharedClass(m string, shared []string) bool {
	for _, s := range shared {
		if m == s {
			return true
		}
	}
	return false
}

// partitionCSS, düğümleri kovalara dağıtır; dönen dilimin son öğesi çekirdektir.
func partitionCSS(nodes []cssNode, buckets []cssBucket) [][]cssNode {
	out := make([][]cssNode, len(buckets)+1)
	core := len(buckets)
	for _, n := range nodes {
		if n.group {
			parts := partitionCSS(n.children, buckets)
			for bi, kids := range parts {
				if len(kids) == 0 {
					continue
				}
				out[bi] = append(out[bi], cssNode{prelude: n.prelude, group: true, children: kids})
			}
			continue
		}
		parts := ruleParts(n, buckets)
		if len(parts) == 1 {
			b := parts[0].bucket
			if b < 0 {
				b = core
			}
			out[b] = append(out[b], n) // seçici listesi olduğu gibi kalır
			continue
		}
		for _, p := range parts {
			b := p.bucket
			if b < 0 {
				b = core
			}
			out[b] = append(out[b], cssNode{prelude: strings.Join(p.selectors, ","), body: n.body})
		}
	}
	return out
}

// rulePart, bir kuralın aynı kovaya düşen seçicileri.
type rulePart struct {
	bucket    int // -1: çekirdek
	selectors []string
}

// vendorPseudoRE: tarayıcıya özgü sözde öğe/sınıflar. Bunları içeren bir
// seçici listesi, desteklemeyen tarayıcıda bütünüyle düşer; liste bölünürse
// bu davranış değişeceği için böyle kurallar bölünmeden çekirdekte kalır.
var vendorPseudoRE = regexp.MustCompile(`::?-[a-z]`)

// ruleParts, bir yaprak kuralın seçicilerini kovalara ayırır (ilk görülme
// sırasıyla). Karışık bir liste — ör. mobilde hem çekirdek hem sekme
// sınıflarına 44px dokunma hedefi veren tek kural — her kovaya kendi
// seçicileriyle bölünür; böylece sekme parçasındaki kural, tam style.css'teki
// gibi o sekmenin daha önceki kurallarından SONRA gelir.
func ruleParts(n cssNode, buckets []cssBucket) []rulePart {
	if n.stmt || strings.HasPrefix(n.prelude, "@") || vendorPseudoRE.MatchString(n.prelude) {
		return []rulePart{{bucket: -1, selectors: []string{n.prelude}}}
	}
	var parts []rulePart
	index := map[int]int{}
	for _, sel := range splitSelectors(n.prelude) {
		b := selectorBucket(sel, buckets)
		if i, ok := index[b]; ok {
			parts[i].selectors = append(parts[i].selectors, sel)
			continue
		}
		index[b] = len(parts)
		parts = append(parts, rulePart{bucket: b, selectors: []string{sel}})
	}
	return parts
}

func renderCSS(nodes []cssNode) string {
	var b strings.Builder
	for _, n := range nodes {
		b.WriteString(n.String())
	}
	return b.String()
}

// splitCSS, tam CSS'ten uygulama çekirdeğini ve sekme parçalarını üretir.
// Dönen harita dosya adı (uzantısız) → içerik; statik-sayfa kovaları dahil değildir.
func splitCSS(full string, buckets []cssBucket) (map[string]string, error) {
	nodes, err := parseCSS(full)
	if err != nil {
		return nil, err
	}
	parts := partitionCSS(nodes, buckets)
	files := map[string]string{appCSSCore: rebaseCSSURLs(renderCSS(parts[len(buckets)]))}
	for bi, b := range buckets {
		if !b.app {
			continue
		}
		files[b.name] = rebaseCSSURLs(renderCSS(parts[bi]))
	}
	return files, nil
}

var cssURLRE = regexp.MustCompile(`url\((\s*["']?)([^"')\s]+)`)

// rebaseCSSURLs, parçalar assets/css/ altında durduğu için assets köküne göre
// yazılmış göreli url()'leri (ör. vendor/fonts/...) bir üst dizine taşır.
// data:, mutlak, kök-göreli ve parça (#, %23) adreslere dokunulmaz.
func rebaseCSSURLs(css string) string {
	return cssURLRE.ReplaceAllStringFunc(css, func(m string) string {
		sub := cssURLRE.FindStringSubmatch(m)
		u := sub[2]
		if strings.Contains(u, ":") || strings.HasPrefix(u, "/") || strings.HasPrefix(u, "#") || strings.HasPrefix(u, "%") {
			return m
		}
		return "url(" + sub[1] + "../" + u
	})
}

// splitAppCSS, <assets>/style.css'i okuyup <assets>/css/*.css dosyalarını yazar.
func splitAppCSS(assetsDir string) error {
	full, err := os.ReadFile(filepath.Join(assetsDir, "style.css"))
	if err != nil {
		return err
	}
	files, err := splitCSS(string(full), appCSSBuckets)
	if err != nil {
		return err
	}
	dir := filepath.Join(assetsDir, "css")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	for name, content := range files {
		p := filepath.Join(dir, name+".css")
		if old, err := os.ReadFile(p); err == nil && string(old) == content {
			continue
		}
		if err := os.WriteFile(p, []byte(content), 0o644); err != nil {
			return err
		}
	}
	return nil
}
