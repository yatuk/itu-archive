package site

// İniş (araç/rehber) sayfalarının ortak düzeni.
//
// Sayfa kabuğu (uygulamanın başlığı, sekme satırı, tema düğmeleri) pageTmpl'de
// bütün statik sayfalar için ortaktır. Bu dosya kabuğun İÇİNDEKİ iniş düzenini
// kurar: kırıntı, h1 + giriş, uygulamaya giden birincil düğme, sayfaya özgü
// araç bloğu, aracın altında aynı düğmenin tekrarı, isteğe bağlı gövde
// bölümleri, <details> SSS, "İlgili araçlar" bağlantı satırı ve mobilde
// birincil düğme görünümden çıkınca beliren yapışkan alt çubuk.
//
// Bir sayfa üreticisi yalnız landingLayout alanlarını doldurur; görünüm
// (assets-src/style.css "iniş düzeni" bölümü, .lp-* sınıfları) ve davranış
// (assets-src/landing.js) ortaktır. Sayfaya özgü küçük betik
// landingLayout.Scripts ile eklenir (ör. "landing-calendar.js").

import (
	"fmt"
	"html/template"
	"strings"
)

// landingLayout, ortak iniş düzeninin sayfa başına parametreleri.
type landingLayout struct {
	H1    string        // sayfanın tek h1'i (düz metin)
	Crumb string        // kırıntıdaki son öğe; boşsa H1
	Lead  template.HTML // h1 altındaki giriş paragrafı (<b> içerebilir)
	CTA   landingAction // birincil uygulama düğmesi: href ("/#takvim") + label
	// CTANote, araç bloğu olmayan sayfalarda düğmenin altındaki kısa açıklama.
	CTANote string
	// Tool, sayfaya özgü araç bloğu (sunucuda üretilmiş, taranabilir HTML).
	// Boş değilse altına "Tamamı için uygulamaya geç" düğmesi tekrarlanır.
	Tool template.HTML
	// More, tekrar düğmesinin yanındaki cümle; boşsa dile göre varsayılan.
	More string
	// Body, aracın (ya da düğmenin) altındaki ek bölümler (h2'li section'lar).
	Body template.HTML
	// FAQ, düz metin soru/cevaplar; <details> olarak basılır (kaçış burada).
	FAQ []guideQA
	// Related, "İlgili araçlar" bağlantıları. Tool varken (ya da Compact)
	// tek satırlık bağlantı dizisi, yoksa açıklamalı liste olarak basılır.
	Related        []landingAction
	CompactRelated bool
}

// landingStrings, düzenin dile bağlı sabit metinleri.
type landingStrings struct {
	Crumb, More, MoreCTA, FAQ, Related, StickyLabel string
}

func (b *Builder) landingStrings() landingStrings {
	if b.l.Code == "en" {
		return landingStrings{
			Crumb: "Breadcrumb", More: "This page shows a preview. Filters, saving and the full data are in the app.",
			MoreCTA: "Continue in the app", FAQ: "Frequently asked questions", Related: "Related tools",
			StickyLabel: "Open in the app",
		}
	}
	return landingStrings{
		Crumb: "Breadcrumb", More: "Önizleme bu sayfada; filtreler, kaydetme ve tüm veriler uygulamada.",
		MoreCTA: "Tamamı için uygulamaya geç", FAQ: "Sık sorulan sorular", Related: "İlgili araçlar",
		StickyLabel: "Uygulamada aç",
	}
}

// landingScripts, ortak iniş düzenini kullanan her sayfanın yüklediği betik.
const landingScript = "landing.js"

// landingBodyClass, iniş düzenini kullanan sayfanın <body> sınıfı.
const landingBodyClass = "lp-page"

const lpArrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

// lpAppHref, uygulamaya giden bağlantının href (+ gerekiyorsa rel) özniteliği.
// Yalnız sorgu taşıyan kabuk URL'leri applinks.go kuralıyla rel="nofollow"
// alır; "/#takvim" gibi düz bağlantılar ana sayfanın kendisidir.
func lpAppHref(href string) string {
	if strings.HasPrefix(href, "/?") || strings.HasPrefix(href, "/en/?") {
		return appLinkAttrs(href)
	}
	return `href="` + template.HTMLEscapeString(href) + `"`
}

// lpCTA, birincil dolu düğme. top=true olan düğme mobil yapışkan çubuğun
// gözlediği ilk-ekran düğmesidir (data-lp-top).
func lpCTA(a landingAction, label string, top bool) string {
	cls := "lp-cta lp-cta-primary"
	attr := ""
	if top {
		cls += " lp-cta-top"
		attr = " data-lp-top"
	}
	return fmt.Sprintf(`<a class="%s" %s%s>%s %s</a>`, cls, lpAppHref(a.href), attr,
		template.HTMLEscapeString(label), lpArrow)
}

// renderLanding, iniş düzeninin <main> içeriğini üretir.
func (b *Builder) renderLanding(l landingLayout) template.HTML {
	en := b.l.Code == "en"
	str := b.landingStrings()
	homeHref := "/"
	if en {
		homeHref = "/en/"
	}
	crumb := l.Crumb
	if crumb == "" {
		crumb = l.H1
	}
	var sb strings.Builder
	sb.WriteString(`<div class="lp-main">`)
	fmt.Fprintf(&sb, `<nav class="crumb lp-crumb" aria-label="%s"><a href="%s">%s</a><span aria-hidden="true">›</span><span>%s</span></nav>`,
		str.Crumb, homeHref, template.HTMLEscapeString(b.l.SiteTitle), template.HTMLEscapeString(crumb))
	sb.WriteString(`<div class="lp-lede"><h1>` + template.HTMLEscapeString(l.H1) + `</h1>`)
	if l.Lead != "" {
		sb.WriteString(`<p class="lead lp-lead">` + string(l.Lead) + `</p>`)
	}
	sb.WriteString(lpCTA(l.CTA, l.CTA.label, true))
	if l.Tool == "" && l.CTANote != "" {
		sb.WriteString(`<p class="lp-cta-note">` + template.HTMLEscapeString(l.CTANote) + `</p>`)
	}
	sb.WriteString(`</div>`)
	if l.Tool != "" {
		sb.WriteString(`<div class="lp-tool">` + string(l.Tool) + `</div>`)
		more := l.More
		if more == "" {
			more = str.More
		}
		fmt.Fprintf(&sb, `<div class="lp-more"><p>%s</p>%s</div>`, template.HTMLEscapeString(more), lpCTA(l.CTA, str.MoreCTA, false))
	}
	sb.WriteString(string(l.Body))
	if len(l.FAQ) > 0 {
		sb.WriteString(`<section class="lp-sec"><h2>` + template.HTMLEscapeString(str.FAQ) + `</h2><div class="lp-faq">`)
		for _, qa := range l.FAQ {
			fmt.Fprintf(&sb, `<details><summary>%s</summary><p>%s</p></details>`,
				template.HTMLEscapeString(qa.q), template.HTMLEscapeString(qa.a))
		}
		sb.WriteString(`</div></section>`)
	}
	if len(l.Related) > 0 {
		compact := l.CompactRelated || l.Tool != ""
		cls := "lp-related"
		if !compact {
			cls += " lp-related-detail"
		}
		sb.WriteString(`<section class="lp-sec"><h2>` + template.HTMLEscapeString(str.Related) + `</h2><ul class="` + cls + `">`)
		for _, a := range l.Related {
			fmt.Fprintf(&sb, `<li><a %s><strong>%s</strong>`, lpAppHref(a.href), template.HTMLEscapeString(a.label))
			if !compact {
				detail := a.detail
				if detail == "" && !en {
					detail = landingActionDetails[a.href]
				}
				if detail != "" {
					fmt.Fprintf(&sb, `<span>%s</span>`, template.HTMLEscapeString(detail))
				}
			}
			sb.WriteString(`</a></li>`)
		}
		sb.WriteString(`</ul></section>`)
	}
	// Mobil yapışkan çubuk: landing.js birincil düğme görünümden çıkınca açar.
	// JS yoksa hiç görünmez (hidden), klavye sırasına da girmez.
	fmt.Fprintf(&sb, `<div class="lp-sticky" data-lp-sticky hidden><a class="lp-cta lp-cta-primary" %s tabindex="-1">%s %s</a></div>`,
		lpAppHref(l.CTA.href), template.HTMLEscapeString(l.CTA.label), lpArrow)
	sb.WriteString(`</div>`)
	return template.HTML(sb.String())
}

// landingOpts, iniş düzeni kullanan sayfanın pageOpts'u: etkin sekme, gövde
// sınıfı, ortak betik ve sayfanın ek betikleri.
func landingOpts(tab string, scripts ...string) pageOpts {
	return pageOpts{Tab: tab, BodyClass: landingBodyClass, Scripts: append([]string{landingScript}, scripts...)}
}

// landingTool, bir iniş sayfasının veriden üretilen araç bloğu ve ona bağlı
// metinler. Sıfır değer: araç bloğu yok, sayfa elle yazılmış metinleriyle
// basılır.
type landingTool struct {
	H1      string        // boş değilse landingPage.h1 yerine
	Lead    template.HTML // boş değilse açıklama yerine giriş paragrafı
	Tool    template.HTML // landingLayout.Tool
	More    string        // landingLayout.More
	Scripts []string      // sayfaya özgü ek betikler (assets köküne göre)
	FAQ     []guideQA     // sayfada <details>, şemada FAQPage olarak
	Schema  []any         // ek JSON-LD düğümleri (ör. FAQPage)
}

// landingToolFor, sayfanın araç bloğunu üretir. Yeni bir araç sayfası buraya
// kendi case'ini ekler (TR ve EN aynı fonksiyondan; dil b.l.Code ile seçilir).
func (b *Builder) landingToolFor(p landingPage) landingTool {
	switch p.slug {
	case "akademik-takvim":
		if b.l.Code != "en" {
			return b.calendarTool()
		}
	case "ders-programi-olustur":
		return landingTool{Tool: template.HTML(b.programDemoHTML(b.l.Code == "en"))} // landing_program.go
	case "gano-hesaplama":
		return landingTool{Tool: template.HTML(b.landingGanoBody(p.slug, b.l.Code == "en"))} // landing_gano.go
	case "kontenjan":
		if b.l.Code == "en" {
			break
		}
		st, ok := b.kontenjanStats() // landing_kontenjan.go
		if !ok {
			break
		}
		link := func(code string) bool { return b.courses[code] != nil }
		return landingTool{Tool: template.HTML(st.bodyHTML(link)), FAQ: st.faq(), Schema: []any{st.faqSchema()}}
	}
	return landingTool{}
}
