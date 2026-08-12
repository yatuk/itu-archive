// Takvim tarih ayrıştırıcısı — docs/assets/core/utils.js parseTurkishDateRange ile
// aynı desenleri Go'da yansıtır: tek tarih + üç aralık biçimi. Scraper bu ayrıştırmayı
// kullanıp her etkinliğe makinece okunur ISO start/end yazar (bayat `remaining`
// etiketine güvenmeyen tarayıcı hesabı + .ics aktarımının ön koşulu).
package takvim

import (
	"bytes"
	"encoding/json"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// trMonths, Türkçe ay adı → Go month. Takvim sayfası DecodeMixed ile çözüldüğü
// için ay adları düzgün UTF-8'dir ("Ağustos", "Eylül", ...).
var trMonths = map[string]time.Month{
	"Ocak":    time.January,
	"Şubat":   time.February,
	"Mart":    time.March,
	"Nisan":   time.April,
	"Mayıs":   time.May,
	"Haziran": time.June,
	"Temmuz":  time.July,
	"Ağustos": time.August,
	"Eylül":   time.September,
	"Ekim":    time.October,
	"Kasım":   time.November,
	"Aralık":  time.December,
}

var (
	singleDateRe = regexp.MustCompile(`^(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$`)
	range1Re     = regexp.MustCompile(`^(\d{1,2})\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$`)                        // "24 - 26 Ağustos 2026"
	range2Re     = regexp.MustCompile(`^(\d{1,2})\s+([^\s\d]+)\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$`)           // "28 Ağustos - 01 Eylül 2023"
	range3Re     = regexp.MustCompile(`^(\d{1,2})\s+([^\s\d]+)\s+(\d{4})\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$`) // "29 Aralık 2025 - 02 Ocak 2026"
	timeTokenRe  = regexp.MustCompile(`\d{1,2}:\d{2}`)                                                             // saat dilimi ("10:00", "23:59") — tarihin parçası değil
)

// parseTRDate, "09 Temmuz 2026" → UTC gece yarısı. Çözümlenemezse false.
// Gün/ay/yıl round-trip doğrulaması yapar (time.Date taşan günü devreder —
// "32 Ocak"ı geri almak için d.Day() != day kontrolü).
func parseTRDate(s string) (time.Time, bool) {
	m := singleDateRe.FindStringSubmatch(strings.TrimSpace(s))
	if m == nil {
		return time.Time{}, false
	}
	month, ok := trMonths[m[2]]
	if !ok {
		return time.Time{}, false
	}
	day, _ := strconv.Atoi(m[1])
	year, _ := strconv.Atoi(m[3])
	d := time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
	if d.Day() != day || d.Month() != month {
		return time.Time{}, false
	}
	return d, true
}

// ParseTRRange, Türkçe takvim tarihini (tek tarih veya aralık) ISO start/end
// çiftine ("2006-01-02") çevirir. Çözümlenemezse ok=false.
//
// Kaynakta saat bilgisi tarihin içine gömülür: "28 Eylül 10:00 - 02 Ekim 2026
// 17:00" (yıl yalnızca ikinci tarihte), "30 Eylül 2026-15:30". Saatleri her
// yerde ayıklayıp tire aralığını normalleştirdikten sonra desen eşleşmesi yapılır.
func ParseTRRange(s string) (start, end string, ok bool) {
	s = strings.TrimSpace(s)
	if s == "" {
		return "", "", false
	}
	// "28 Eylül 10:00 - 02 Ekim 2026 17:00" → "28 Eylül  - 02 Ekim 2026 "
	s = timeTokenRe.ReplaceAllString(s, "")
	// "2026-15:30" → "2026 -" ; tire etrafındaki boşlukları tek biçime indir.
	s = strings.Join(strings.Fields(s), " ")
	s = strings.ReplaceAll(s, "-", " - ")
	s = strings.Join(strings.Fields(s), " ")
	s = strings.TrimSpace(strings.Trim(s, " -"))

	if d, ok := parseTRDate(s); ok {
		return iso(d), iso(d), true
	}
	if m := range1Re.FindStringSubmatch(s); m != nil {
		a, ok1 := parseTRDate(m[1] + " " + m[3] + " " + m[4])
		b, ok2 := parseTRDate(m[2] + " " + m[3] + " " + m[4])
		if ok1 && ok2 && !b.Before(a) {
			return iso(a), iso(b), true
		}
		return "", "", false
	}
	if m := range2Re.FindStringSubmatch(s); m != nil {
		a, ok1 := parseTRDate(m[1] + " " + m[2] + " " + m[5])
		b, ok2 := parseTRDate(m[3] + " " + m[4] + " " + m[5])
		if ok1 && ok2 && !b.Before(a) {
			return iso(a), iso(b), true
		}
		return "", "", false
	}
	if m := range3Re.FindStringSubmatch(s); m != nil {
		a, ok1 := parseTRDate(m[1] + " " + m[2] + " " + m[3])
		b, ok2 := parseTRDate(m[4] + " " + m[5] + " " + m[6])
		if ok1 && ok2 && !b.Before(a) {
			return iso(a), iso(b), true
		}
		return "", "", false
	}
	return "", "", false
}

func iso(d time.Time) string { return d.Format("2006-01-02") }

// AddISODates, bir takvim JSON'undaki her etkinliğe start/end ekleyerek geri döner.
// Mevcut `date` alanından hesaplar; OBS'a istek atmaz. Eski dosyaların backfill'i
// (start/end omitempty olduğundan geriye uyumlu). Çözümlenemeyen tarihlerde alan
// boş kalır — içerik kaybedilmez. Çözümlenemez JSON yapısal hatadır.
func AddISODates(in []byte) ([]byte, error) {
	var raw struct {
		Year      string `json:"year"`
		YearID    string `json:"yearId"`
		ScrapedAt string `json:"scrapedAt"`
		Events    []struct {
			Table     string `json:"table"`
			Title     string `json:"title"`
			Date      string `json:"date"`
			Remaining string `json:"remaining"`
			Start     string `json:"start,omitempty"`
			End       string `json:"end,omitempty"`
		} `json:"events"`
	}
	if err := json.Unmarshal(in, &raw); err != nil {
		return nil, err
	}
	changed := false
	for i := range raw.Events {
		ev := &raw.Events[i]
		if ev.Start == "" && ev.End == "" {
			start, end, ok := ParseTRRange(ev.Date)
			if ok {
				ev.Start, ev.End = start, end
				changed = true
			}
		}
	}
	if !changed {
		return in, nil
	}
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetIndent("", " ") // store.WriteJSON ile aynı biçim
	enc.SetEscapeHTML(false)
	if err := enc.Encode(raw); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
