package site

// /akademik-takvim/ araç bloğu: "Şimdi / Sırada" şeridi ve lisans takviminin
// bütün olaylarını ay ay gruplayan tablo. Tablo sunucuda eksiksiz üretilir
// (taranabilir metin, JS'siz tam liste); "bugün", geri sayımlar, geçmiş/süren
// durumu, tür süzgeçleri ve arama tarayıcıda assets-src/landing-calendar.js
// ile eklenir. Şerit sunucuda takvim verisinin tarama tarihine göre basılır,
// betik onu bugüne göre yeniden kurar.

import (
	"fmt"
	"html/template"
	"regexp"
	"sort"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"itu-scraper/internal/model"
)

var trMonthsShort = []string{"", "Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"}

// shortDateRange, "2027-01-02","2027-01-17" -> "2–17 Oca 2027" (tablo biçimi).
func shortDateRange(start, end string) string {
	s, err := time.Parse("2006-01-02", start)
	if err != nil {
		return start
	}
	e, err := time.Parse("2006-01-02", end)
	one := func(t time.Time) string { return fmt.Sprintf("%d %s %d", t.Day(), trMonthsShort[t.Month()], t.Year()) }
	if err != nil || !e.After(s) {
		return one(s)
	}
	switch {
	case s.Year() != e.Year():
		return one(s) + "–" + one(e)
	case s.Month() != e.Month():
		return fmt.Sprintf("%d %s–%d %s %d", s.Day(), trMonthsShort[s.Month()], e.Day(), trMonthsShort[e.Month()], e.Year())
	default:
		return fmt.Sprintf("%d–%d %s %d", s.Day(), e.Day(), trMonthsShort[s.Month()], s.Year())
	}
}

func trLower(s string) string { return strings.ToLowerSpecial(unicode.TurkishCase, s) }

// calKinds, olayın süzgeç türleri: kayit, sinav, donem (birden çok olabilir).
func calKinds(title string) []string {
	l := strings.TrimSpace(trLower(title))
	var k []string
	if strings.Contains(l, "kayıt") || strings.Contains(l, "kaydı") {
		k = append(k, "kayit")
	}
	if strings.Contains(l, "sınav") {
		k = append(k, "sinav")
	}
	if strings.Contains(l, "tatil") || strings.Contains(l, "başlangıc") || strings.HasSuffix(l, "yarıyılı sonu") || strings.Contains(l, "açılış") {
		k = append(k, "donem")
	}
	return k
}

var (
	calLinkRE   = regexp.MustCompile(`(?i)\s*\(\s*Link\s*\)\s*`)
	calParenRE  = regexp.MustCompile(`\s*\([^()]*\)`)
	calSpacesRE = regexp.MustCompile(`\s+`)
)

// calShortTitle, uzun resmî başlığı tablo satırına sığacak biçime indirir.
// Tam başlık satırın title özniteliğinde kalır.
func calShortTitle(t string) string {
	s := strings.TrimSpace(calSpacesRE.ReplaceAllString(calLinkRE.ReplaceAllString(t, " "), " "))
	if utf8.RuneCountInString(s) > 64 {
		for {
			next := calParenRE.ReplaceAllString(s, "")
			if next == s {
				break
			}
			s = next
		}
		s = strings.TrimSpace(strings.NewReplacer("(", "", ")", "").Replace(s))
	}
	if strings.HasSuffix(s, " Fakülteler Tarafından ÖİDB'ye Bildirilmesi") {
		s = strings.TrimSuffix(s, " Fakülteler Tarafından ÖİDB'ye Bildirilmesi") + ": fakültelerce ÖİDB'ye bildirim"
	}
	s = strings.TrimPrefix(s, "Fakülteler Tarafından ")
	s = strings.Replace(s, " Lisans Eğitim ve Öğretim Yönetmeliği'nin 14. Maddesine Göre Uygulanacak ", ": ", 1)
	if r := []rune(s); len(r) > 84 {
		cut := string(r[:80])
		if i := strings.LastIndex(cut, " "); i > 0 {
			cut = cut[:i]
		}
		s = strings.TrimRight(cut, ",/ ") + "…"
	}
	return s
}

var calKindLabels = map[string]string{"kayit": "kayıt", "sinav": "sınav", "donem": "dönem"}

type calRow struct {
	Title, Short, Start, End string
	Kinds                    []string
}

func calRows(events []model.CalendarEvent) []calRow {
	type idx struct {
		e model.CalendarEvent
		i int
	}
	var list []idx
	for i, e := range events {
		if e.Start == "" || strings.TrimSpace(e.Title) == "" {
			continue
		}
		if e.End == "" || e.End < e.Start {
			e.End = e.Start
		}
		list = append(list, idx{e, i})
	}
	sort.SliceStable(list, func(a, b int) bool {
		x, y := list[a].e, list[b].e
		if x.Start != y.Start {
			return x.Start < y.Start
		}
		if x.End != y.End {
			return x.End < y.End
		}
		return list[a].i < list[b].i
	})
	rows := make([]calRow, 0, len(list))
	for _, it := range list {
		t := strings.TrimSpace(calSpacesRE.ReplaceAllString(it.e.Title, " "))
		rows = append(rows, calRow{Title: t, Short: calShortTitle(t), Start: it.e.Start, End: it.e.End, Kinds: calKinds(t)})
	}
	return rows
}

// calTitleAttr, kısaltılmış satırlarda tam başlığı title özniteliğine koyar.
func calTitleAttr(r calRow) string {
	if r.Short == r.Title {
		return ""
	}
	return ` title="` + template.HTMLEscapeString(r.Title) + `"`
}

// calendarToolHTML, şerit + süzgeçler + tablo. asOf, sunucu yedeğinin "bugün"ü
// (takvim verisinin tarama tarihi); betik tarayıcıdaki bugünle yeniden kurar.
func calendarToolHTML(year, asOf, yearID string, rows []calRow) string {
	esc := template.HTMLEscapeString
	var sb strings.Builder

	// Şimdi / Sırada şeridi (tarama tarihine göre yedek).
	var ongoing, next []calRow
	for _, r := range rows {
		switch {
		case r.Start <= asOf && asOf <= r.End:
			ongoing = append(ongoing, r)
		case r.Start > asOf && len(next) < 4:
			next = append(next, r)
		}
	}
	sb.WriteString(`<section class="lp-box lp-cal-now" aria-label="Şimdi ve sırada" data-lp-cal-now>`)
	fmt.Fprintf(&sb, `<div><p class="lp-lbl"><span class="lp-pill lp-pill-now">Şimdi</span> <span data-lp-cal-today>%s taramasına göre</span></p><div data-lp-cal-ongoing>`,
		esc(trDateRange(asOf, "")))
	if len(ongoing) == 0 {
		sb.WriteString(`<div class="lp-cal-item"><span class="lp-cal-d">Süren etkinlik yok.</span></div>`)
	}
	for _, r := range ongoing {
		fmt.Fprintf(&sb, `<div class="lp-cal-item"><b%s>%s</b><span class="lp-cal-d">%s</span></div>`,
			calTitleAttr(r), esc(r.Short), esc(shortDateRange(r.Start, r.End)))
	}
	sb.WriteString(`</div></div><div><p class="lp-lbl">Sırada</p><ul class="lp-cal-next" data-lp-cal-next>`)
	for _, r := range next {
		fmt.Fprintf(&sb, `<li><span class="lp-cal-d">%s</span><span class="lp-cal-t"%s>%s</span></li>`,
			esc(shortDateRange(r.Start, r.End)), calTitleAttr(r), esc(r.Short))
	}
	sb.WriteString(`</ul></div></section>`)

	// Başlık, süzgeçler (JS gelince görünür) ve özet satırı.
	fmt.Fprintf(&sb, `<h2 class="lp-h2">Tüm tarihler <small>lisans · %d etkinlik</small></h2>`, len(rows))
	counts := map[string]int{}
	for _, r := range rows {
		for _, k := range r.Kinds {
			counts[k]++
		}
	}
	sb.WriteString(`<div class="lp-tools" data-lp-cal-tools hidden><div class="lp-chips" role="group" aria-label="Tür">`)
	for _, c := range [][2]string{{"all", "Hepsi"}, {"kayit", "Kayıt"}, {"sinav", "Sınav"}, {"donem", "Tatil ve dönem"}} {
		n := counts[c[0]]
		if c[0] == "all" {
			n = len(rows)
		}
		fmt.Fprintf(&sb, `<button type="button" class="lp-chip" data-k="%s" aria-pressed="%t">%s<span class="lp-n">%d</span></button>`,
			c[0], c[0] == "all", c[1], n)
	}
	sb.WriteString(`</div><label class="lp-search">` + lpSearchIcon + `<span class="sr-only">Takvimde ara</span><input type="search" data-lp-cal-q placeholder="ör. final, mazeret, ders kaydı" autocomplete="off"></label></div>`)
	fmt.Fprintf(&sb, `<p class="lp-meta" data-lp-cal-meta aria-live="polite">%d etkinlik · %s lisans takvimi, %s taraması</p>`,
		len(rows), esc(year), esc(trDateRange(asOf, "")))

	// Tablo: ay başlıkları + satırlar. data-s/data-e betiğin tek veri kaynağı.
	src := ""
	if yearID != "" {
		src = ` data-src="/data/calendar/lisans/` + esc(yearID) + `.json"`
	}
	fmt.Fprintf(&sb, `<div class="lp-box lp-tbl-wrap"><table class="lp-tbl lp-cal-tbl" data-lp-cal%s><thead><tr><th scope="col">Tarih</th><th scope="col">Etkinlik</th><th scope="col" class="lp-r lp-cal-st">Durum</th></tr></thead><tbody>`, src)
	monthCount := map[string]int{}
	for _, r := range rows {
		monthCount[r.Start[:7]]++
	}
	month := ""
	for _, r := range rows {
		if m := r.Start[:7]; m != month {
			month = m
			t, _ := time.Parse("2006-01", m)
			fmt.Fprintf(&sb, `<tr class="lp-cal-mo" data-m="%s"><td colspan="3">%s %d<span class="lp-cal-c">%d</span></td></tr>`,
				m, trMonths[t.Month()], t.Year(), monthCount[m])
		}
		var tags strings.Builder
		for _, k := range r.Kinds {
			tags.WriteString(`<span class="lp-k">` + calKindLabels[k] + `</span>`)
		}
		fmt.Fprintf(&sb, `<tr data-s="%s" data-e="%s" data-k="%s"><td class="lp-cal-dt">%s</td><td class="lp-cal-ev"%s>%s%s</td><td class="lp-cal-st"></td></tr>`,
			r.Start, r.End, strings.Join(r.Kinds, " "), esc(shortDateRange(r.Start, r.End)),
			calTitleAttr(r), esc(r.Short), tags.String())
	}
	sb.WriteString(`</tbody></table></div>`)
	return sb.String()
}

const lpSearchIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`

// calendarLead, h1 altındaki cümle: yaklaşan final dönemi ve dönem başlangıcı.
func calendarLead(s calSummary, n int) template.HTML {
	esc := template.HTMLEscapeString
	var parts []string
	if f := s.Finals; f != nil {
		when := "tarihinde"
		if f.End != "" && f.End != f.Start {
			when = "tarihleri arasında"
		}
		parts = append(parts, fmt.Sprintf("%s finalleri <b>%s</b> %s", esc(f.Season), esc(f.dates()), when))
	}
	if st := s.Start; st != nil {
		season := st.Season
		if len(parts) > 0 {
			season = trLower(season)
		}
		parts = append(parts, fmt.Sprintf("%s dönemi <b>%s</b> tarihinde başlıyor", esc(season), esc(st.dates())))
	}
	if len(parts) == 0 {
		return ""
	}
	return template.HTML(strings.Join(parts, ", ") +
		fmt.Sprintf(". Aşağıda %s lisans takviminin %d tarihi ay ay sıralı.", esc(s.Year), n))
}

// calendarTool, /akademik-takvim/ iniş sayfasının araç bloğu (yalnız TR).
func (b *Builder) calendarTool() landingTool {
	year, events, scraped, yearID := b.currentCalendar()
	if year == "" {
		return landingTool{}
	}
	sum := buildCalendarSummary(year, scraped, events)
	rows := calRows(events)
	t := landingTool{
		H1:      "İTÜ akademik takvim " + year,
		Lead:    calendarLead(sum, len(rows)),
		Tool:    template.HTML(calendarToolHTML(year, scraped, yearID, rows)),
		More:    "Lisansüstü ve hazırlık takvimleri, takvim türüne göre süzme ve etkinliği .ics olarak kişisel takvime ekleme uygulamada.",
		Scripts: []string{"landing-calendar.js"},
		FAQ:     sum.faq(),
	}
	if sc := sum.faqSchema(); sc != nil {
		t.Schema = append(t.Schema, sc)
	}
	return t
}
