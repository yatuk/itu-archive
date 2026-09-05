package site

// Rehber sayfaları: /ders-kaydi-nasil-yapilir/, /ders-programi-nasil-hazirlanir/
// ve /terimler-sozlugu/.
//
// Bu üç sayfa writeLandingPage'in düz paragraf listesiyle üretilemez: içerik
// adım kartları, akış şeması, sistem kutuları, uyarı kutuları ve örnek arayüz
// çizimlerinden oluşur. writeDirectoryPage gibi kendi üretim fonksiyonlarını
// kullanır, canonical/hreflang/JSON-LD iskeletini yine writePage'den alır.
//
// landingPages girdileri (başlık, açıklama, birincil/ikincil bağlantılar,
// sitemap kaydı) olduğu gibi korunur; yalnızca gövde üretimi buraya taşınır.

import (
	"fmt"
	"html/template"
	"path/filepath"
	"strings"
)

// Rehber sayfalarının içerik tarihi landing metinlerinden bağımsız ilerler:
// bu üç sayfa kendi üretim fonksiyonuna taşındığında yeniden yazıldı.
const guideContentUpdated = "2026-09-05"

// --- ortak yapı taşları ---

// guideCallout, gövde metninden ayrılmış tek amaçlı kutu. warn=false bilgi
// (cyan), warn=true uyarı (amber) rengini kullanır.
type guideCallout struct {
	warn bool
	text string // elle yazılan güvenilir HTML
}

// guideStep, numaralı adım kartı. figures alanı kartın içine gömülen örnek
// görselleri taşır (ayrı bir bölüme sürüklenmez).
type guideStep struct {
	title    string
	paras    []string
	callouts []guideCallout
	figures  []string
}

// guideSystem, sistem şemasındaki tek kutu (ÖBS, SİS, Ninova, BİDB).
type guideSystem struct {
	name  string // HTML (sözlük bağlantısı içerebilir)
	badge string // "Adım 1" / "Steps 2-3"
	desc  string
}

type guideQA struct{ q, a string }

const guideIconInfo = `<svg class="guide-callout-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">` +
	`<circle cx="10" cy="10" r="8.4"/><path d="M10 9v5"/><path d="M10 5.8v.2"/></svg>`

const guideIconWarn = `<svg class="guide-callout-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">` +
	`<path d="M10 2.6 18.6 17H1.4z"/><path d="M10 8v3.6"/><path d="M10 14.2v.2"/></svg>`

const guideIconOK = `<svg class="guide-state-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">` +
	`<circle cx="10" cy="10" r="8.4"/><path d="m6 10.3 2.8 2.7L14 7.6"/></svg>`

func renderGuideCallouts(cs []guideCallout) string {
	var sb strings.Builder
	for _, c := range cs {
		cls, icon := "guide-note", guideIconInfo
		if c.warn {
			cls, icon = "guide-warn", guideIconWarn
		}
		sb.WriteString(`<div class="` + cls + `">` + icon + `<p>` + c.text + `</p></div>`)
	}
	return sb.String()
}

func renderGuideSteps(steps []guideStep) string {
	var sb strings.Builder
	sb.WriteString(`<ol class="guide-steps">`)
	for i, s := range steps {
		fmt.Fprintf(&sb, `<li class="guide-step"><span class="guide-step-num" aria-hidden="true">%d</span><h3>%s</h3>`,
			i+1, s.title)
		for _, p := range s.paras {
			sb.WriteString(`<p>` + p + `</p>`)
		}
		sb.WriteString(renderGuideCallouts(s.callouts))
		for _, f := range s.figures {
			sb.WriteString(f)
		}
		sb.WriteString(`</li>`)
	}
	sb.WriteString(`</ol>`)
	return sb.String()
}

// guideFlowSVG, sürecin tamamını tek bakışta gösteren şeridi üretir. Aynı
// diziden iki çizim çıkar: geniş ekranda yatay, dar ekranda dikey olan CSS ile
// gösterilir (display:none olan çizim erişilebilirlik ağacından da düşer).
func guideFlowSVG(labels []string, aria string) string {
	const (
		hStep = 160
		vStep = 72
		r     = 19
	)
	var h, v strings.Builder
	fmt.Fprintf(&h, `<svg class="guide-flow-h" viewBox="0 0 %d 92" role="img" aria-label="%s">`,
		len(labels)*hStep, template.HTMLEscapeString(aria))
	for i, label := range labels {
		cx := hStep/2 + i*hStep
		if i > 0 {
			prev := cx - hStep
			fmt.Fprintf(&h, `<path class="guide-flow-link" d="M%d 34H%d"/>`, prev+r+9, cx-r-15)
			fmt.Fprintf(&h, `<path class="guide-flow-arrow" d="m%d 29 5 5-5 5"/>`, cx-r-14)
		}
		fmt.Fprintf(&h, `<circle class="guide-flow-node" cx="%d" cy="34" r="%d"/>`, cx, r)
		fmt.Fprintf(&h, `<text class="guide-flow-num" x="%d" y="40" text-anchor="middle">%d</text>`, cx, i+1)
		fmt.Fprintf(&h, `<text class="guide-flow-lbl" x="%d" y="78" text-anchor="middle">%s</text>`,
			cx, template.HTMLEscapeString(label))
	}
	h.WriteString(`</svg>`)

	fmt.Fprintf(&v, `<svg class="guide-flow-v" viewBox="0 0 260 %d" role="img" aria-label="%s">`,
		len(labels)*vStep, template.HTMLEscapeString(aria))
	for i, label := range labels {
		cy := vStep/2 + i*vStep
		if i > 0 {
			prev := cy - vStep
			fmt.Fprintf(&v, `<path class="guide-flow-link" d="M30 %dV%d"/>`, prev+r+9, cy-r-15)
			fmt.Fprintf(&v, `<path class="guide-flow-arrow" d="m25 %d 5 5 5-5"/>`, cy-r-14)
		}
		fmt.Fprintf(&v, `<circle class="guide-flow-node" cx="30" cy="%d" r="%d"/>`, cy, r)
		fmt.Fprintf(&v, `<text class="guide-flow-num" x="30" y="%d" text-anchor="middle">%d</text>`, cy+6, i+1)
		fmt.Fprintf(&v, `<text class="guide-flow-lbl" x="66" y="%d">%s</text>`, cy+5, template.HTMLEscapeString(label))
	}
	v.WriteString(`</svg>`)

	return `<div class="guide-flow">` + h.String() + v.String() + `</div>`
}

func renderGuideSystems(head string, systems []guideSystem) string {
	var sb strings.Builder
	sb.WriteString(`<section class="guide-section"><h2>` + template.HTMLEscapeString(head) + `</h2><ul class="guide-systems">`)
	for _, s := range systems {
		fmt.Fprintf(&sb, `<li class="guide-system"><span class="guide-system-badge">%s</span><h3>%s</h3><p>%s</p></li>`,
			template.HTMLEscapeString(s.badge), s.name, s.desc)
	}
	sb.WriteString(`</ul></section>`)
	return sb.String()
}

func renderGuideFAQ(head string, items []guideQA) string {
	var sb strings.Builder
	sb.WriteString(`<section class="guide-section"><h2>` + template.HTMLEscapeString(head) + `</h2><div class="guide-faq">`)
	for _, it := range items {
		fmt.Fprintf(&sb, `<div class="guide-faq-item"><h3>%s</h3><p>%s</p></div>`, it.q, it.a)
	}
	sb.WriteString(`</div></section>`)
	return sb.String()
}

// --- örnek görseller ---
// Üçü de gerçek ekran görüntüsü değil, sitenin kendi CSS token'larıyla çizilen
// örnek arayüzlerdir; her biri köşesindeki etiketle bunu açıkça söyler.

func guideFigure(body, caption string) string {
	return `<figure class="guide-figure"><div class="guide-figure-inner">` + body +
		`</div><figcaption>` + caption + `</figcaption></figure>`
}

func guideTag(text string) string {
	return `<span class="guide-mock-tag">` + template.HTMLEscapeString(text) + `</span>`
}

// guideCRNTable, ders programı tablosundan tek satırlık bir kesit çizer; CRN
// hücresi vurgu renkli çerçeveyle işaretlenir, altındaki ok açıklamaya bağlar.
func guideCRNTable(tag string, heads [4]string, cells [4]string, annot string) string {
	var sb strings.Builder
	sb.WriteString(`<div class="guide-mock guide-mock-table">`)
	sb.WriteString(`<div class="guide-mock-bar"><span class="guide-mock-title">` +
		template.HTMLEscapeString(heads[0]) + `</span>` + guideTag(tag) + `</div>`)
	sb.WriteString(`<div class="seo-tablewrap"><table class="seo-table guide-mini-table"><thead><tr>`)
	for _, h := range heads {
		sb.WriteString(`<th>` + template.HTMLEscapeString(h) + `</th>`)
	}
	sb.WriteString(`</tr></thead><tbody><tr>`)
	for i, c := range cells {
		if i == len(cells)-1 {
			sb.WriteString(`<td><span class="guide-crn-mark">` + template.HTMLEscapeString(c) + `</span></td>`)
			continue
		}
		sb.WriteString(`<td>` + template.HTMLEscapeString(c) + `</td>`)
	}
	sb.WriteString(`</tr></tbody></table></div>`)
	sb.WriteString(`<div class="guide-annot"><p class="guide-annot-text">` + annot + `</p>` +
		`<svg class="guide-annot-arrow" viewBox="0 0 120 44" aria-hidden="true" focusable="false">` +
		`<path d="M112 2v22q0 10-10 10H16"/><path d="m22 28-6 6 6 6"/></svg></div>`)
	sb.WriteString(`</div>`)
	return sb.String()
}

// guideRegisterMock, CRN girişi ve ekleme butonu olan kayıt ekranı örneği.
func guideRegisterMock(tag, barTitle, crnLabel, crn, button string) string {
	return `<div class="guide-mock">` +
		`<div class="guide-mock-bar"><span class="guide-mock-title">` + template.HTMLEscapeString(barTitle) + `</span>` + guideTag(tag) + `</div>` +
		`<div class="guide-mock-form">` +
		`<span class="guide-mock-label">` + template.HTMLEscapeString(crnLabel) + `</span>` +
		`<span class="guide-mock-input">` + template.HTMLEscapeString(crn) + `<i class="guide-mock-caret" aria-hidden="true"></i></span>` +
		`<span class="btn-primary guide-mock-btn">` + template.HTMLEscapeString(button) + `</span>` +
		`</div></div>`
}

// guideStateMock, kayıt denemesinin iki olası sonucunu yan yana gösterir.
func guideStateMock(tag, barTitle, okText, errText string) string {
	return `<div class="guide-mock guide-mock-states">` +
		`<div class="guide-mock-bar"><span class="guide-mock-title">` + template.HTMLEscapeString(barTitle) + `</span>` + guideTag(tag) + `</div>` +
		`<div class="guide-state-row">` +
		`<div class="guide-state guide-state-ok">` + guideIconOK + `<p>` + okText + `</p></div>` +
		`<div class="guide-state guide-state-err">` + guideIconWarn + `<p>` + errText + `</p></div>` +
		`</div></div>`
}

// --- sayfa iskeleti ---

func (b *Builder) guideRelated(p landingPage, head string) string {
	en := b.l.Code == "en"
	secondary := p.secondary
	if en {
		secondary = p.secondaryEN
	}
	if len(secondary) == 0 {
		return ""
	}
	var sb strings.Builder
	sb.WriteString(`<section class="guide-section"><h2>` + template.HTMLEscapeString(head) + `</h2><ul class="seo-action-list">`)
	for _, action := range secondary {
		fmt.Fprintf(&sb, `<li><a href="%s"><strong>%s</strong>`,
			template.HTMLEscapeString(action.href), template.HTMLEscapeString(action.label))
		detail := action.detail
		if detail == "" && !en {
			detail = landingActionDetails[action.href]
		}
		if detail != "" {
			fmt.Fprintf(&sb, `<span>%s</span>`, template.HTMLEscapeString(detail))
		}
		sb.WriteString(`</a></li>`)
	}
	sb.WriteString(`</ul></section>`)
	return sb.String()
}

func (b *Builder) guideLaunch(p landingPage, aria string) string {
	primary := p.primary
	if b.l.Code == "en" {
		primary = p.primaryEN
	}
	return fmt.Sprintf(`<section class="seo-tool-launch" aria-label="%s"><div><strong>%s</strong><p>%s</p></div><a class="btn-primary" href="%s">%s</a></section>`,
		template.HTMLEscapeString(aria), template.HTMLEscapeString(primary.label),
		template.HTMLEscapeString(primary.detail), template.HTMLEscapeString(primary.href),
		template.HTMLEscapeString(primary.label))
}

// writeGuideShell, rehber sayfalarının ortak kabuğu: kırıntı, h1, giriş
// cümlesi, gövde bölümleri ve ilgili araçlar listesi. writeLandingPage ile aynı
// canonical/hreflang/JSON-LD kurallarını uygular; kısıtlı FAQPage/HowTo
// şemaları burada da üretilmez.
func (b *Builder) writeGuideShell(p landingPage, h1, lead, relatedHead string, sections ...string) error {
	en := b.l.Code == "en"
	title, description := p.title, p.description
	urlPrefix, homeHref, inLang := baseURL, "/", "tr-TR"
	if en {
		title, description = p.titleEN, p.descriptionEN
		urlPrefix, homeHref, inLang = baseURL+"/en", "/en/", "en"
	}
	canonical := fmt.Sprintf("%s/%s/", urlPrefix, p.slug)

	parts := []string{
		`<nav class="crumb" aria-label="Breadcrumb"><a href="` + homeHref + `">` +
			template.HTMLEscapeString(b.l.SiteTitle) + `</a> › <span>` + template.HTMLEscapeString(h1) + `</span></nav>`,
		`<h1>` + template.HTMLEscapeString(h1) + `</h1>`,
		`<p class="guide-lead">` + lead + `</p>`,
	}
	parts = append(parts, sections...)
	if rel := b.guideRelated(p, relatedHead); rel != "" {
		parts = append(parts, rel)
	}
	content := template.HTML(buildContent(parts...))

	schema := []any{
		map[string]any{
			"@context": "https://schema.org", "@type": "WebPage", "@id": canonical + "#webpage",
			"url": canonical, "name": title, "description": description,
			"inLanguage": inLang, "dateModified": guideContentUpdated,
		},
		map[string]any{
			"@context": "https://schema.org", "@type": "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": b.l.SiteTitle, "item": urlPrefix + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": h1, "item": canonical},
			},
		},
	}
	return b.writePage(filepath.Join(b.outRoot, p.slug, "index.html"),
		title, description, canonical, guideContentUpdated, content, jsonldScript(schema), true)
}

// glossaryHref, sözlükteki bir terime dil doğru bağlantı üretir.
func (b *Builder) glossaryHref(anchor string) string {
	if b.l.Code == "en" {
		return "/en/terimler-sozlugu/#" + anchor
	}
	return "/terimler-sozlugu/#" + anchor
}

func (b *Builder) glossaryLink(anchor, label string) string {
	return `<a href="` + b.glossaryHref(anchor) + `">` + template.HTMLEscapeString(label) + `</a>`
}

// calendarHref, tarih geçen her yerin işaret ettiği akademik takvim sayfası.
// Rehberlerde hiçbir somut tarih yazılmaz; tarihler her dönem değişir.
func (b *Builder) calendarHref() string {
	if b.l.Code == "en" {
		return "/en/akademik-takvim/"
	}
	return "/akademik-takvim/"
}
