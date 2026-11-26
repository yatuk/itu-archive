package site

// /akademik-takvim/ iniş sayfasının veriden üretilen bölümleri: "Sıradaki
// tarihler" özeti, takvim verisinden cevaplanan sık sorular ve arama sonucunda
// görünen başlık/açıklama. Hepsi derleme anında, takvim verisinin tarama
// tarihine göre hesaplanır (bkz. landing_dynamic.go); aynı veri aynı çıktıyı
// verir. Sayfadaki her cümle takvim dosyasındaki bir olaydan türer.

import (
	"fmt"
	"strings"
	"unicode/utf8"

	"itu-scraper/internal/model"
)

// calEntry, takvimden seçilmiş tek bir tarih aralığı.
type calEntry struct {
	Label      string // "Güz finalleri", "Bahar dönemi başlangıcı"
	Season     string // "Güz", "Bahar", "Yaz" ya da boş
	Start, End string
}

func (e calEntry) dates() string { return trDateRange(e.Start, e.End) }

// calSummary, sayfanın özet ve SSS bölümlerinin ham verisi.
type calSummary struct {
	Year    string
	Scraped string
	// Upcoming, tarama tarihinden sonra bitmeyen en yakın üç önemli olay
	// (final dönemi hariç; o ayrıca gösterilir).
	Upcoming []calEntry
	Finals   *calEntry // yaklaşan yarıyıl sonu sınavları
	Exam     *calEntry // yaklaşan sınav programı ilanı
	Start    *calEntry // yaklaşan dönem başlangıcı
	AddDrop  *calEntry // ders ekleme-bırakma
	Withdraw *calEntry // dersten tümüyle çekilme
	Register *calEntry // WEB ders kaydı (aralık birleşik)
}

type summaryKind struct {
	match, label string // label "%s" taşıyorsa mevsim adıyla dolar
	seasonal     bool
	merges       bool
	slot         func(s *calSummary) **calEntry // doldurulacak özel alan
}

var summaryKinds = []summaryKind{
	{match: "Sınav Programının İlanı", label: "%s sınav programı ilanı", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.Exam }},
	{match: "Sınav Programlarının İlanı", label: "%s sınav programı ilanı", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.Exam }},
	{match: "Yarıyılı Sonu Sınavları", label: "%s finalleri", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.Finals }},
	{match: "Öğrencilerin WEB Ders Kaydı", label: "%s ders kaydı", seasonal: true, merges: true, slot: func(s *calSummary) **calEntry { return &s.Register }},
	{match: "Yarıyılı Başlangıcı", label: "%s dönemi başlangıcı", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.Start }},
	{match: "Birisini Bırakıp Bir Başka Derse Yazılma", label: "%s ders ekleme-bırakma", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.AddDrop }},
	{match: "Bir Dersten Tümüyle Çekilme", label: "%s dersten çekilme", seasonal: true, slot: func(s *calSummary) **calEntry { return &s.Withdraw }},
	{match: "Ara Tatil", label: "Ara tatil"},
}

// buildCalendarSummary, tarih sırasındaki olaylardan özeti kurar. Tarama
// tarihinden önce biten olaylar atlanır; veri yoksa ilgili alan nil kalır.
func buildCalendarSummary(year, scraped string, events []model.CalendarEvent) calSummary {
	sum := calSummary{Year: year, Scraped: scraped}
	seasonAfter := func(date string) string {
		for _, e := range events {
			if e.Start >= date && strings.Contains(e.Title, "Yarıyılı Başlangıcı") {
				return calSeason(e.Title)
			}
		}
		return ""
	}
	byKey := map[string]*calEntry{}
	var order []*calEntry
	for _, e := range events {
		if e.Start == "" || e.End < scraped {
			continue
		}
		for _, k := range summaryKinds {
			if !strings.Contains(e.Title, k.match) {
				continue
			}
			season := ""
			if k.seasonal {
				if season = calSeason(e.Title); season == "" {
					season = seasonAfter(e.Start)
				}
				if season == "" {
					break
				}
			}
			label := k.label
			if k.seasonal {
				label = fmt.Sprintf(k.label, season)
			}
			key := label
			if it := byKey[key]; it != nil {
				if k.merges && e.End > it.End {
					it.End = e.End
				}
				break
			}
			it := &calEntry{Label: label, Season: season, Start: e.Start, End: e.End}
			byKey[key] = it
			order = append(order, it)
			if k.slot != nil {
				if p := k.slot(&sum); *p == nil {
					*p = it
				}
			}
			break
		}
	}
	for _, it := range order {
		if sum.Finals != nil && it == sum.Finals {
			continue
		}
		if len(sum.Upcoming) < 3 {
			sum.Upcoming = append(sum.Upcoming, *it)
		}
	}
	return sum
}

func (b *Builder) calendarSummary() (calSummary, bool) {
	year, events, scraped, _ := b.currentCalendar()
	if year == "" {
		return calSummary{}, false
	}
	return buildCalendarSummary(year, scraped, events), true
}

// calendarTitle, "İTÜ Akademik Takvim 2026-2027 ve Final Takvimi".
func calendarTitle(year string) string {
	return "İTÜ Akademik Takvim " + year + " ve Final Takvimi"
}

// calendarDescription, açıklamayı en önemli tarihlerle kurar; sığmayan
// parçalar sondan atılır. Her sürüm "final takvimi" ifadesini taşır.
func calendarDescription(s calSummary) string {
	lead := "İTÜ akademik takvim " + s.Year + " ve final takvimi"
	var parts []string
	if s.Finals != nil {
		parts = append(parts, s.Finals.Label+" "+s.Finals.dates())
	}
	if s.Start != nil {
		parts = append(parts, s.Start.Label+" "+s.Start.dates())
	}
	if s.Register != nil {
		parts = append(parts, s.Register.Label+" "+s.Register.dates())
	}
	for n := len(parts); n > 0; n-- {
		d := lead + ": " + strings.Join(parts[:n], " · ") + "."
		if utf8.RuneCountInString(d) <= descMaxRunes {
			return appendIfFits(d, " Ekleme-bırakma ve kayıt tarihleri.")
		}
	}
	return lead + ": kayıt, ders ekleme-bırakma ve sınav tarihleri tek listede."
}

// faq, veriden cevaplanabilen soruları döner. Veride karşılığı olmayan soru
// üretilmez. Cevaplar düz metindir; sayfada ve FAQPage şemasında aynen geçer.
func (s calSummary) faq() []guideQA {
	var qa []guideQA
	if f := s.Finals; f != nil {
		a := fmt.Sprintf("%s yarıyılı sonu sınavları %s tarihleri arasındadır.", f.Season, f.dates())
		if s.Exam != nil && s.Exam.Season == f.Season {
			a += fmt.Sprintf(" Sınav programı %s tarihinde ilan edilir.", s.Exam.dates())
		}
		a += " Dersine göre gün ve saati Sınavlar sekmesinde ara."
		qa = append(qa, guideQA{q: "İTÜ finalleri ne zaman?", a: a})
	}
	if e := s.AddDrop; e != nil {
		a := fmt.Sprintf("%s yarıyılında ders planındaki bir dersi bırakıp başka derse yazılma %s tarihleri arasındadır.", e.Season, e.dates())
		if w := s.Withdraw; w != nil && w.Season == e.Season {
			a += fmt.Sprintf(" Bir dersten tümüyle çekilme (belgede T harfi) %s tarihleri arasındadır.", w.dates())
		}
		qa = append(qa, guideQA{q: "Ders ekleme-bırakma ne zaman?", a: a})
	}
	if e := s.Start; e != nil {
		a := fmt.Sprintf("%s yarıyılı %s tarihinde başlar.", e.Season, e.dates())
		qa = append(qa, guideQA{q: e.Season + " dönemi ne zaman başlıyor?", a: a})
	}
	if e := s.Register; e != nil {
		a := fmt.Sprintf("%s dönemi WEB ders kaydı %s tarihleri arasında yapılır. Kayıt, sınıf düzeyine göre ayrı gün ve saatlerde açılır; kendi saatini Takvim sekmesinde gör.", e.Season, e.dates())
		qa = append(qa, guideQA{q: "Ders kaydı ne zaman?", a: a})
	}
	return qa
}

// faqSchema, sayfadaki <details> SSS ile aynı soru listesinden (faq) FAQPage
// şemasını üretir; ikisi hiçbir zaman ayrışmaz.
func (s calSummary) faqSchema() map[string]any {
	qa := s.faq()
	if len(qa) == 0 {
		return nil
	}
	var ents []any
	for _, it := range qa {
		ents = append(ents, map[string]any{
			"@type": "Question", "name": it.q,
			"acceptedAnswer": map[string]any{"@type": "Answer", "text": it.a},
		})
	}
	return map[string]any{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ents}
}
