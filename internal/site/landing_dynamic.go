package site

// Veriden türeyen iniş sayfası metadatası. /ders-programi/ başlığı aktif dönemi,
// /akademik-takvim/ başlığı akademik yılı ve açıklaması yaklaşan takvim
// olaylarını taşır (bkz. calendar_landing.go). "Yaklaşan" kavramı derleme anına değil takvim verisinin
// tarama tarihine göre hesaplanır; aynı veriyle her üretim aynı çıktıyı verir.

import (
	"fmt"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"itu-scraper/internal/model"
)

// landingMeta, TR iniş sayfası için (başlık, açıklama, lastmod) döner. Veri
// yoksa sayfanın elle yazılmış metinleri kullanılır.
func (b *Builder) landingMeta(p landingPage) (title, desc, lastmod string) {
	title, desc, lastmod = p.title, p.description, landingLastmod(p)
	switch p.slug {
	case "ders-programi":
		if b.index.CurrentSlug == "" || b.index.CurrentTerm == "" {
			return
		}
		var m model.TermMeta
		if err := readJSON(filepath.Join(b.root, "data", "terms", b.index.CurrentSlug, "meta.json"), &m); err != nil || m.Sections == 0 {
			return
		}
		label := shortTermLabel(b.index.CurrentTerm)
		title = "İTÜ Ders Programı " + label + " · açılan dersler ve kontenjan"
		desc = fmt.Sprintf("İTÜ %s ders programı: %s ders, %s şube. Açılan dersleri kod, ad, CRN veya hocayla ara; saatleri, kontenjanı ve doluluğu karşılaştır.",
			label, trNum(m.Courses), trNum(m.Sections))
		if d := dateOf(m.ScrapedAt); d != "" {
			lastmod = d
		}
	case "akademik-takvim":
		sum, ok := b.calendarSummary()
		if !ok {
			return
		}
		title = calendarTitle(sum.Year)
		desc = calendarDescription(sum)
		lastmod = sum.Scraped
	}
	return
}

// landingSitemapLastmod, sitemap'teki iniş sayfası tarihi.
func (b *Builder) landingSitemapLastmod(p landingPage) string {
	if b.l.Code == "en" {
		return landingLastmod(p)
	}
	_, _, lm := b.landingMeta(p)
	return lm
}

func calSeason(title string) string {
	for _, s := range []string{"Güz", "Bahar", "Yaz"} {
		if strings.HasPrefix(title, s+" Yarıyılı") || strings.HasPrefix(title, s+" Dönemi") {
			return s
		}
	}
	return ""
}

// currentCalendar, lisans takvimlerinden tarama tarihini kapsayan akademik
// yılı seçer ve (yıl etiketi, tarih sırasına dizilmiş olaylar, tarama tarihi)
// döner. Veri yoksa yıl boştur. yearID, seçilen dosyanın adıdır
// (data/calendar/lisans/<yearID>.json).
func (b *Builder) currentCalendar() (year string, events []model.CalendarEvent, scraped, yearID string) {
	type calFile struct {
		cal        model.Calendar
		start, end string
	}
	var files []calFile
	for _, ref := range b.index.Calendars {
		var c model.Calendar
		if err := readJSON(filepath.Join(b.root, "data", "calendar", "lisans", ref.YearID+".json"), &c); err != nil || len(c.Events) == 0 {
			continue
		}
		f := calFile{cal: c}
		for _, e := range c.Events {
			if f.start == "" || (e.Start != "" && e.Start < f.start) {
				f.start = e.Start
			}
			if e.End > f.end {
				f.end = e.End
			}
		}
		files = append(files, f)
		if d := dateOf(c.ScrapedAt); d > scraped {
			scraped = d
		}
	}
	if len(files) == 0 || scraped == "" {
		return "", nil, "", ""
	}
	// Tarama tarihini kapsayan akademik yıl; yoksa en yeni yıl.
	sort.Slice(files, func(i, j int) bool { return files[i].start > files[j].start })
	pick := files[0]
	for _, f := range files {
		if f.start <= scraped && scraped <= f.end {
			pick = f
			break
		}
	}
	year = strings.Fields(pick.cal.Year + " ")[0]
	if year == "" {
		return "", nil, "", ""
	}
	events = append([]model.CalendarEvent(nil), pick.cal.Events...)
	sort.SliceStable(events, func(i, j int) bool { return events[i].Start < events[j].Start })
	return year, events, scraped, pick.cal.YearID
}

// trDateRange, "2027-01-26","2027-01-27" -> "26–27 Ocak 2027".
func trDateRange(start, end string) string {
	s, err1 := time.Parse("2006-01-02", start)
	e, err2 := time.Parse("2006-01-02", end)
	if err1 != nil {
		return start
	}
	one := func(t time.Time) string { return fmt.Sprintf("%d %s %d", t.Day(), trMonths[int(t.Month())], t.Year()) }
	if err2 != nil || !e.After(s) {
		return one(s)
	}
	switch {
	case s.Year() == e.Year() && s.Month() == e.Month():
		return fmt.Sprintf("%d–%d %s %d", s.Day(), e.Day(), trMonths[int(e.Month())], e.Year())
	case s.Year() == e.Year():
		return fmt.Sprintf("%d %s–%d %s %d", s.Day(), trMonths[int(s.Month())], e.Day(), trMonths[int(e.Month())], e.Year())
	default:
		return one(s) + "–" + one(e)
	}
}
