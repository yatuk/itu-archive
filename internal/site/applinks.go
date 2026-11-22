package site

import (
	"html/template"
	"net/url"
	"strings"
)

// Uygulama kabuğuna (/) giden "canlı ara" derin bağlantıları.
//
// Kabuk, Dersler görünümünün durumunu history.replaceState ile URL'ye geri
// yazar (assets-src/views/courses.js saveState): aktif dönem URL'ye girmez,
// boşluk "+" olur, parametre sırası sabittir ve #dersler eklenir. Statik
// sayfalardaki bağlantı bu biçimden farklıysa (/?term=<aktif>&code=MUZ 111),
// Googlebot sayfayı açınca URL değişir ve Search Console bunu "Yönlendirmeli
// sayfa" sayar. appURL tam olarak kabuğun yazacağı URL'yi üretir; bağlantılar
// rel="nofollow" taşır, çünkü kabuğun canonical'ı / (veya statik ders/branş
// sayfası) ve bu URL'lerin ayrıca taranması gerekmez.

// appParamOrder, saveState içindeki parametre sırasıdır.
var appParamOrder = []string{"term", "q", "branch", "day", "time", "level", "method", "program", "code", "open", "sort", "sdir"}

// appURL, Dersler görünümü için kabuk URL'sini üretir. currentTerm'e eşit
// term yazılmaz (kabuk da yazmaz).
func appURL(currentTerm string, params map[string]string) string {
	var parts []string
	for _, k := range appParamOrder {
		v := strings.TrimSpace(params[k])
		if v == "" || (k == "term" && v == currentTerm) {
			continue
		}
		parts = append(parts, url.QueryEscape(k)+"="+url.QueryEscape(v))
	}
	if len(parts) == 0 {
		return "/#dersler"
	}
	return "/?" + strings.Join(parts, "&") + "#dersler"
}

// appLinkAttrs, href'i HTML özniteliği olarak kaçırır ve nofollow ekler.
func appLinkAttrs(href string) string {
	return `href="` + template.HTMLEscapeString(href) + `" rel="nofollow"`
}
