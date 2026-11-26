package site

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestStaticShellMatchesAppTabs(t *testing.T) {
	b := &Builder{l: langTR}
	sh := b.shell(baseURL+"/akademik-takvim/", nil, "takvim")
	var labels []string
	for _, n := range sh.Nav {
		if n.Sep {
			labels = append(labels, "|")
			continue
		}
		labels = append(labels, n.Label)
		if n.Current != (n.Label == "Akademik Takvim") {
			t.Errorf("etkin sekme yanlış: %+v", n)
		}
		if !strings.HasPrefix(n.URL, "/#") {
			t.Errorf("sekme uygulamaya gitmeli: %q", n.URL)
		}
	}
	want := "Dersler,Müfredat ve GPA,Önşart Haritası,Sınavlar,Akademik Takvim,Haftalık Program,|,Geçmiş,Dönemler,Hakkında"
	if got := strings.Join(labels, ","); got != want {
		t.Errorf("sekmeler = %s", got)
	}
	en := (&Builder{l: langEN}).shell(baseURL+"/en/gpa-calculator/", nil, "dersplanim")
	if en.Nav[1].URL != "/?lang=en#dersplanim" || !en.Nav[1].Current || en.Nav[1].Label != "Curriculum & GPA" {
		t.Errorf("EN sekme = %+v", en.Nav[1])
	}
	if got := tabForPath("/hoca/ali-veli/"); got != "gecmis" {
		t.Errorf("hoca sayfası sekmesi = %q", got)
	}
}

func TestLandingPageUsesSharedShell(t *testing.T) {
	root := t.TempDir()
	b := &Builder{root: root, outRoot: root, l: langTR, version: "test"}
	var target landingPage
	for _, p := range landingPages {
		if p.slug == "kontenjan" {
			target = p
		}
	}
	if err := b.writeLandingPage(target); err != nil {
		t.Fatal(err)
	}
	raw, err := os.ReadFile(filepath.Join(root, "kontenjan", "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	html := string(raw)
	for _, want := range []string{
		`<nav class="tabs app-tabs wrap"`,
		`<a href="/#dersler" aria-current="true">Dersler</a>`,
		`<span class="tabs-sep" aria-hidden="true"></span>`,
		`class="tab-secondary"`,
		`<span class="brand-title" translate="no">`,
		`localStorage.getItem('itu-theme')`,
		`<body class="seo-page lp-page">`,
		`<script src="/assets/landing.js?v=test" defer></script>`,
		`class="lp-cta lp-cta-primary lp-cta-top" href="/#dersler" data-lp-top>Kontenjanları uygulamada gör`,
		`<div class="lp-sticky" data-lp-sticky hidden>`,
		`<ul class="lp-related lp-related-detail">`,
	} {
		if !strings.Contains(html, want) {
			t.Errorf("iniş sayfası %q içermeli", want)
		}
	}
	if strings.Count(html, "<h1") != 1 {
		t.Error("sayfada tek h1 olmalı")
	}
	if strings.Contains(html, "—") {
		t.Error("em dash yasak")
	}
}

func TestLandingLayoutToolRepeatsCTAAndCompactsRelated(t *testing.T) {
	b := &Builder{l: langEN}
	h := string(b.renderLanding(landingLayout{
		H1: "ITU GPA calculator", CTA: landingAction{href: "/?lang=en#dersplanim", label: "Open the GPA calculator"},
		Tool: "<div>tool</div>", FAQ: []guideQA{{q: "Q <1>", a: "A"}},
		Related: []landingAction{{href: "/en/glossary/", label: "Glossary", detail: "hidden in compact row"}},
	}))
	for _, want := range []string{
		`<div class="lp-tool"><div>tool</div></div>`,
		`Continue in the app`,
		`href="/?lang=en#dersplanim" rel="nofollow"`,
		`<summary>Q &lt;1&gt;</summary>`,
		`<ul class="lp-related"><li><a href="/en/glossary/"><strong>Glossary</strong></a></li></ul>`,
		`<a href="/en/">`,
	} {
		if !strings.Contains(h, want) {
			t.Errorf("düzen %q içermeli:\n%s", want, h)
		}
	}
	if strings.Count(h, "lp-cta-primary") != 3 {
		t.Errorf("üst düğme, tekrar ve yapışkan çubuk bekleniyordu: %d", strings.Count(h, "lp-cta-primary"))
	}
}
