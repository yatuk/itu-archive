package site

// Hub sayfaları: /hoca/ (bütün hoca sayfalarının dizini) ve /not-dagilimi/
// (not dağılımı verisi olan bütün ders sayfalarının dizini). İkisi de
// JavaScript olmadan düz bağlantı listesi olarak çalışır; JS varsa liste
// üstünde istemci taraflı bir süzgeç belirir. Yalnızca TR üretilir: hoca ve
// ders sayfalarının İngilizce karşılığı yok.

import (
	"fmt"
	"html/template"
	"path/filepath"
	"sort"
	"strings"
)

const (
	hocaIndexSlug = "hoca"
	gradesHubSlug = "not-dagilimi"
)

// hubFilterHTML, JS ile görünür olan arama kutusu ve boş sonuç notu. Liste
// öğeleri data-hub-item, gruplar data-hub-group taşır.
func hubFilterHTML(label, placeholder, emptyText string) string {
	return `<div class="hub-filter" hidden><label for="hub-q">` + template.HTMLEscapeString(label) + `</label>` +
		`<input id="hub-q" type="search" autocomplete="off" spellcheck="false" placeholder="` + template.HTMLEscapeString(placeholder) + `"></div>` +
		`<p class="hub-empty" id="hub-empty" hidden>` + template.HTMLEscapeString(emptyText) + `</p>`
}

// hubFilterScript, Türkçe harfleri ve boşlukları yok sayarak süzer
// ("mak219" -> "MAK 219", "gunes" -> "Güneş").
const hubFilterScript = `<script>(function(){var w=document.querySelector('.hub-filter'),q=document.getElementById('hub-q');if(!w||!q)return;w.hidden=false;` +
	`var items=[].slice.call(document.querySelectorAll('[data-hub-item]')),groups=[].slice.call(document.querySelectorAll('[data-hub-group]')),empty=document.getElementById('hub-empty');` +
	`function n(s){return s.toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'')}` +
	`items.forEach(function(li){li.k=n(li.textContent)});` +
	`q.addEventListener('input',function(){var v=n(q.value),c=0;items.forEach(function(li){var ok=!v||li.k.indexOf(v)>=0;li.hidden=!ok;if(ok)c++});` +
	`groups.forEach(function(g){g.hidden=!g.querySelector('[data-hub-item]:not([hidden])')});if(empty)empty.hidden=c>0})})();</script>`

func hubSchema(canonical, title, description, h1, dateModified string) template.HTML {
	return jsonldScript([]any{
		map[string]any{
			"@context": "https://schema.org", "@type": "CollectionPage", "@id": canonical + "#webpage",
			"url": canonical, "name": title, "description": description,
			"inLanguage": "tr-TR", "dateModified": dateModified,
		},
		map[string]any{
			"@context": "https://schema.org", "@type": "BreadcrumbList",
			"itemListElement": []any{
				map[string]any{"@type": "ListItem", "position": 1, "name": langTR.SiteTitle, "item": baseURL + "/"},
				map[string]any{"@type": "ListItem", "position": 2, "name": h1, "item": canonical},
			},
		},
	})
}

func hubCrumb(h1 string) string {
	return `<nav class="crumb" aria-label="Breadcrumb"><a href="/">` + template.HTMLEscapeString(langTR.SiteTitle) +
		`</a> › <span>` + template.HTMLEscapeString(h1) + `</span></nav>`
}

// writeGradesHubPage, /not-dagilimi/ sayfasını üretir: not dağılımı nedir,
// nasıl okunur ve verisi olan bütün derslerin bağlantıları.
func (b *Builder) writeGradesHubPage(courseSlugs map[string]string) error {
	type entry struct {
		code, name, slug string
		top              int
	}
	byBranch := map[string][]entry{}
	total, earliest := 0, gradeFileRow{}
	for code, records := range b.gradesIndex {
		slug, ok := courseSlugs[code]
		if !ok {
			continue
		}
		latest, ok := latestGradeRecord(records)
		if !ok {
			continue
		}
		for _, r := range records {
			if r.Total > 0 && (earliest.Donem == "" || r.Donem < earliest.Donem) {
				earliest = r
			}
		}
		top, _ := gradeHeadlineRates(latest.Grades, latest.Total)
		name := ""
		if hc := b.courses[code]; hc != nil {
			name = hc.Name
		}
		branch := code
		if i := strings.IndexByte(code, ' '); i > 0 {
			branch = code[:i]
		}
		byBranch[branch] = append(byBranch[branch], entry{code, name, slug, top})
		total++
	}
	branches := make([]string, 0, len(byBranch))
	for br := range byBranch {
		branches = append(branches, br)
	}
	sort.Strings(branches)

	canonical := baseURL + "/" + gradesHubSlug + "/"
	h1 := "İTÜ not dağılımı"
	title := "İTÜ Not Dağılımı · ders ders AA, BA ve FF oranları"
	description := fmt.Sprintf("İTÜ not dağılımı arşivi: %s dersin OBS'de açıklanan harf notu dağılımı. Ders kodu veya adıyla ara; AA/BA ve FF oranlarını dönem dönem karşılaştır.", trNum(total))
	since := shortTermLabel(earliest.Term)

	var list strings.Builder
	for _, br := range branches {
		entries := byBranch[br]
		sort.Slice(entries, func(i, j int) bool { return entries[i].code < entries[j].code })
		fmt.Fprintf(&list, `<section class="hub-group" data-hub-group><h3>%s</h3><ul class="hub-list">`, template.HTMLEscapeString(br))
		for _, e := range entries {
			fmt.Fprintf(&list, `<li data-hub-item><a href="/ders/%s/"><span class="code">%s</span> %s</a> <span class="hub-meta">AA/BA %%%d</span></li>`,
				template.HTMLEscapeString(e.slug), template.HTMLEscapeString(e.code), template.HTMLEscapeString(e.name), e.top)
		}
		list.WriteString(`</ul></section>`)
	}

	sinceText := ""
	if since != "" {
		sinceText = " " + since + " döneminden bu yana"
	}
	content := template.HTML(buildContent(
		hubCrumb(h1),
		`<h1>`+template.HTMLEscapeString(h1)+`</h1>`,
		`<p class="lead">`+template.HTMLEscapeString(description)+`</p>`,
		`<h2>Not dağılımı nedir?</h2>`,
		`<p>`+template.HTMLEscapeString("OBS her dönem sonunda, bir derste kaç öğrencinin hangi harf notunu aldığını ders ve dönem bazında yayımlar. Bu arşiv"+sinceText+" açıklanan dağılımları saklar ve her dersin kendi sayfasında dönem dönem gösterir.")+`</p>`,
		`<h2>Nasıl okunur?</h2>`,
		`<ul><li>AA/BA oranı, en yüksek iki notu (BA+ dahil) alanların payıdır. Listedeki oran dersin en son açıklanan dönemine aittir.</li>`+
			`<li>FF başarısız, VF devamsızlık nedeniyle başarısız notudur; ikisi ders sayfasında ayrıca gösterilir.</li>`+
			`<li>Dağılım şube değil ders bazındadır: aynı dönemde dersi birden fazla hoca verdiyse bütün şubelerin öğrencileri birlikte sayılır.</li>`+
			`<li>Bu veriler geçmiş kayıtların özetidir; başarı tahmini veya hoca değerlendirmesi değildir.</li></ul>`,
		`<h2>Ders listesi</h2>`,
		hubFilterHTML("Ders kodu veya adıyla ara", "ör. MAK 219 veya Mukavemet", "Bu aramayla eşleşen ders yok. Ders kodunu boşluksuz da yazabilirsin."),
		list.String(),
		`<h2>İlgili sayfalar</h2><ul class="seo-action-list">`+
			`<li><a href="/gano-hesaplama/"><strong>GPA / GANO hesaplama</strong><span>`+template.HTMLEscapeString(landingActionDetails["/gano-hesaplama/"])+`</span></a></li>`+
			`<li><a href="/not-ortalamasi/"><strong>Harf notu katsayıları</strong><span>`+template.HTMLEscapeString(landingActionDetails["/not-ortalamasi/"])+`</span></a></li>`+
			`<li><a href="/hoca/"><strong>Hocalar</strong><span>Hocanın tek başına verdiği derslerin not dağılımını hoca sayfasında gör.</span></a></li>`+
			`<li><a href="/ders-arsivi/"><strong>Geçmiş dönem ders arşivi</strong><span>`+template.HTMLEscapeString(landingActionDetails["/#gecmis"])+`</span></a></li>`+
			`</ul>`,
		`<p class="seo-data-note">Kaynak: OBS not dağılımı sayfaları. Resmî kayıt kararları için OBS esas alınmalıdır.</p>`,
		hubFilterScript,
	))
	return b.writePage(filepath.Join(b.outRoot, gradesHubSlug, "index.html"),
		title, description, canonical, fmtDate(b.index.ScrapedAt), content,
		hubSchema(canonical, title, description, h1, dateOf(b.index.ScrapedAt)), false)
}
