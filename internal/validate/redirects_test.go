package validate

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeFile(t *testing.T, root, rel, body string) {
	t.Helper()
	p := filepath.Join(root, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestCheckRedirectsAllowsRefreshStubAndFlagsLivePages(t *testing.T) {
	root := t.TempDir()
	writeFile(t, root, "hoca/index.html", "x")
	writeFile(t, root, "hoca/canli/index.html", "canlı sayfa")
	writeFile(t, root, "en/glossary/index.html", "x")
	writeFile(t, root, "en/terimler-sozlugu/index.html", `<meta http-equiv="refresh" content="0; url=https://itu-ders.com/en/glossary/">`)
	writeFile(t, root, "_redirects", strings.Join([]string{
		"/en/terimler-sozlugu/ /en/glossary/ 301",
		"/hoca/eski/ /hoca/ 301",
		"/hoca/canli/ /hoca/ 301",
		"/hoca/zincir/ /hoca/eski/ 301",
		"/en/hoca/* /hoca/:splat 301",
	}, "\n"))
	r := &Result{}
	set := r.checkRedirects(root)
	joined := strings.Join(r.Errors, "\n")
	if strings.Contains(joined, "terimler-sozlugu") {
		t.Errorf("meta-refresh yedek sayfası hata sayılmamalı: %s", joined)
	}
	if !strings.Contains(joined, "/hoca/canli/ bugün yayınlanan") {
		t.Errorf("canlı sayfaya kural yakalanmalı: %s", joined)
	}
	if !strings.Contains(joined, "zincir") {
		t.Errorf("yönlendirme zinciri yakalanmalı: %s", joined)
	}
	for href, want := range map[string]bool{
		"/hoca/eski/":                       true,
		"https://itu-ders.com/hoca/eski/":   true,
		"/hoca/eski/?x=1#y":                 true,
		"/en/hoca/kim/":                     true,
		"/hoca/canli2/":                     false,
		"/hoca/":                            false,
		"https://example.com/hoca/eski/":    false,
		"https://itu-ders.com/en/glossary/": false,
	} {
		if got := set.hit(href); got != want {
			t.Errorf("hit(%s) = %v, beklenen %v", href, got, want)
		}
	}
}
