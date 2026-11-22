// Command legacy-slugs, depo geçmişinde bir zamanlar yayımlanmış tüm
// /hoca/<slug>/ ve /ders/<slug>/ sayfalarını (TR ve eski /en/ kopyaları)
// git geçmişinden çıkarır ve internal/site altındaki iki listeye yazar:
//
//	internal/site/legacy_hoca_slugs.txt
//	internal/site/legacy_course_slugs.txt
//
// cmd/site bu listelerden docs/_redirects kurallarını üretir; bugün sayfası
// olan slug'lar için kural yazılmaz, bu yüzden listede canlı slug'ların da
// bulunması zararsızdır (ileride silinirlerse kendiliğinden yönlendirilir).
// Var olan satırlar korunur: liste yalnızca büyür, sığ (shallow) bir klonda
// kısmi geçmiş yüzünden küçülmez. Sığ klonda çalışmayı reddeder.
//
//	go run ./cmd/legacy-slugs
package main

import (
	"bufio"
	"bytes"
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

var pageRe = regexp.MustCompile(`^docs/(?:en/)?(hoca|ders)/([^/]+)/index\.html$`)

func main() {
	dir := flag.String("dir", "internal/site", "liste dosyalarının dizini")
	flag.Parse()

	if out, err := exec.Command("git", "rev-parse", "--is-shallow-repository").Output(); err != nil {
		log.Fatalf("git rev-parse: %v", err)
	} else if strings.TrimSpace(string(out)) == "true" {
		log.Fatal("sığ klon: tam geçmiş gerekli (git fetch --unshallow)")
	}
	// --no-renames: büyük commit'lerde rename tespiti atlanınca eklenen
	// dosyalar R olarak görünmez, hepsi A sayılır.
	cmd := exec.Command("git", "log", "--no-renames", "--diff-filter=A", "--format=", "--name-only", "HEAD", "--",
		"docs/hoca/*/index.html", "docs/en/hoca/*/index.html", "docs/ders/*/index.html", "docs/en/ders/*/index.html")
	cmd.Stderr = os.Stderr
	out, err := cmd.Output()
	if err != nil {
		log.Fatalf("git log: %v", err)
	}
	found := map[string]map[string]bool{"hoca": {}, "ders": {}}
	sc := bufio.NewScanner(bytes.NewReader(out))
	for sc.Scan() {
		if m := pageRe.FindStringSubmatch(strings.TrimSpace(sc.Text())); m != nil {
			found[m[1]][m[2]] = true
		}
	}
	if err := sc.Err(); err != nil {
		log.Fatal(err)
	}
	files := []struct{ kind, name, header string }{
		{"hoca", "legacy_hoca_slugs.txt", hocaHeader},
		{"ders", "legacy_course_slugs.txt", courseHeader},
	}
	for _, f := range files {
		path := filepath.Join(*dir, f.name)
		set := found[f.kind]
		before := 0
		if old, err := os.ReadFile(path); err == nil {
			for _, s := range strings.Split(string(old), "\n") {
				if s = strings.TrimSpace(s); s != "" && !strings.HasPrefix(s, "#") {
					set[s] = true
					before++
				}
			}
		}
		slugs := make([]string, 0, len(set))
		for s := range set {
			slugs = append(slugs, s)
		}
		sort.Strings(slugs)
		var sb strings.Builder
		sb.WriteString(f.header)
		for _, s := range slugs {
			sb.WriteString(s)
			sb.WriteByte('\n')
		}
		if err := os.WriteFile(path, []byte(sb.String()), 0o644); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s: %d slug (önce %d)\n", path, len(slugs), before)
	}
}

const hocaHeader = `# cmd/legacy-slugs tarafından üretilir (go run ./cmd/legacy-slugs); elle düzenleme.
# Depo geçmişinde bir zamanlar yayımlanmış tüm /hoca/<slug>/ ve /en/hoca/<slug>/ sayfaları.
# Bugün sayfası olanlar için kural yazılmaz; kalanlar redirects.go içinde bölünür,
# yeniden adlandırma olarak eşlenir ya da /hoca/ dizinine gönderilir.
`

const courseHeader = `# cmd/legacy-slugs tarafından üretilir (go run ./cmd/legacy-slugs); elle düzenleme.
# Depo geçmişinde bir zamanlar yayımlanmış tüm /ders/<slug>/ ve /en/ders/<slug>/ sayfaları.
# Bugün sayfası olanlar için kural yazılmaz; kalanlar branş sayfasına (yoksa /bolumler/) gider.
`
