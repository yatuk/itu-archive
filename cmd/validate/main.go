// Command validate, docs/data altındaki üretilmiş veriyi bütünlük açısından
// denetler. Workflow'a eklenebilir: hatalar varsa sıfırdan farklı kodla çıkar
// ve kazıyıcının sessizce bozuk veri yazmasını önler.
//
//	go run ./cmd/validate            # tüm ayrıntı
//	go run ./cmd/validate -quiet     # yalnızca özet (CI için)
//	go run ./cmd/validate -out docs
package main

import (
	"flag"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"

	"itu-scraper/internal/validate"
)

func main() {
	out := flag.String("out", "docs", "veri kök dizini")
	quiet := flag.Bool("quiet", false, "yalnızca özet bas (uyarı kategori sayaçları + örnekler)")
	skipSite := flag.Bool("skip-site", false, "üretilen SEO sayfalarının denetimini atla (yalnızca veri bütünlüğü)")
	flag.Parse()

	res := validate.All(*out, *skipSite)

	if *quiet {
		printQuiet(res)
	} else {
		for _, w := range res.Warnings {
			fmt.Fprintf(os.Stderr, "· uyarı: %s\n", w)
		}
		for _, e := range res.Errors {
			fmt.Fprintf(os.Stderr, "· hata: %s\n", e)
		}
	}

	logf("%d hata, %d uyarı", len(res.Errors), len(res.Warnings))
	if len(res.Errors) > 0 {
		os.Exit(1)
	}
}

// warnCategories, uyarıları kategorize eder ki 50 bin satır yerine kategori
// sayaçları basılabilsin. Kalıplar uyarı metninin ilk kelimelerine dayanır.
var warnCategories = []struct {
	re   *regexp.Regexp
	name string
}{
	{regexp.MustCompile(`yazılan \(\d+\) kontenjandan`), "kontenjan aşımı"},
	{regexp.MustCompile(`oturum dizileri farklı uzunlukta`), "oturum dizisi tutarsızlığı"},
	{regexp.MustCompile(`kod .+ ile başlamıyor`), "kod/branş uyuşmazlığı"},
	{regexp.MustCompile(`dolma süresi negatif`), "quota (negatif dolma süresi)"},
	{regexp.MustCompile(`hiç dönem içermiyor`), "müfredat (boş program)"},
}

func categoryOf(msg string) string {
	for _, c := range warnCategories {
		if c.re.MatchString(msg) {
			return c.name
		}
	}
	return "diğer"
}

func printQuiet(res *validate.Result) {
	fmt.Fprintf(os.Stderr, "hata: %d", len(res.Errors))
	if len(res.Errors) > 0 {
		fmt.Fprintln(os.Stderr, " — ilk örnekler:")
		for _, e := range res.Errors[:min(10, len(res.Errors))] {
			fmt.Fprintf(os.Stderr, "  · %s\n", e)
		}
	} else {
		fmt.Fprintln(os.Stderr)
	}

	byCat := map[string]int{}
	for _, w := range res.Warnings {
		byCat[categoryOf(w)]++
	}
	cats := make([]string, 0, len(byCat))
	for c := range byCat {
		cats = append(cats, c)
	}
	sort.Slice(cats, func(i, j int) bool { return byCat[cats[i]] > byCat[cats[j]] })
	parts := make([]string, 0, len(cats))
	for _, c := range cats {
		parts = append(parts, c+": "+strconv.Itoa(byCat[c]))
	}
	fmt.Fprintf(os.Stderr, "uyarı: %d (%s)\n", len(res.Warnings), joinWith(parts, ", "))
}

func joinWith(parts []string, sep string) string {
	out := ""
	for i, p := range parts {
		if i > 0 {
			out += sep
		}
		out += p
	}
	return out
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
