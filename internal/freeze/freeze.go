// Package freeze, canlı dönemin "donmuş" olup olmadığına karar verir.
//
// Ekle-bırak haftası bittikten sonra ders programı ve kontenjan sayıları artık
// değişmez. O tarihten sonra alınmış tek bir tam ölçüm kesin sayıları taşır;
// sonraki haftalık koşuların aynı veriyi yeniden çekmesi gereksizdir.
//
// Karar durumsuzdur: ayrı bir "donduruldu" bayrağı saklanmaz, her koşuda
// akademik takvim + son başarılı ölçüm zamanından yeniden türetilir.
package freeze

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// istanbul, sabit UTC+3. Türkiye 2016'dan beri yaz saati uygulamıyor; tzdata'ya
// bağımlı olmamak için (Windows, minimal CI imajı) sabit bölge kullanılıyor.
var istanbul = time.FixedZone("TRT", 3*60*60)

// Event, akademik takvim satırının karar için gereken alanları.
type Event struct {
	Title string `json:"title"`
	Start string `json:"start"` // YYYY-MM-DD
	End   string `json:"end"`   // YYYY-MM-DD
}

// Frozen: şimdi ekle-bırak bitişinden sonra VE son başarılı ölçüm de bitişten
// sonra alınmışsa true. Bitişten sonraki ilk koşu bu yüzden hâlâ tam çalışır.
// ok=false (takvim/etkinlik bulunamadı) ya da last sıfırsa donma yok.
func Frozen(now, addDropEnd time.Time, ok bool, last time.Time) bool {
	if !ok || addDropEnd.IsZero() || last.IsZero() {
		return false
	}
	return !now.Before(addDropEnd) && !last.Before(addDropEnd)
}

// AddDropEnd, dönemin ekle-bırak haftasının bittiği anı döner: bitiş gününü
// izleyen gece yarısı (Europe/Istanbul), yani bitiş günü tümüyle dahildir.
//
// Takvim tablosuna (Event.Table) güvenilmez: İTÜ, Bahar'ın ekle-bırak satırını
// da "Güz Dönemi" tablosu altında yayınlıyor. Eşleştirme tarihe göre yapılır.
func AddDropEnd(slug string, events []Event) (time.Time, bool) {
	y1, y2, season, ok := parseSlug(slug)
	if !ok {
		return time.Time{}, false
	}
	var best time.Time
	for _, e := range events {
		if !isAddDrop(e.Title) {
			continue
		}
		raw := e.End
		if raw == "" {
			raw = e.Start
		}
		d, err := time.ParseInLocation("2006-01-02", raw, istanbul)
		if err != nil || !inSeason(d, y1, y2, season) {
			continue
		}
		if d.After(best) {
			best = d
		}
	}
	if best.IsZero() {
		return time.Time{}, false
	}
	return best.AddDate(0, 0, 1), true
}

// LoadAddDropEnd, <root>/data/calendar/lisans altındaki takvimlerden dönemin
// akademik yılına ait olanı okuyup ekle-bırak bitişini döner. Herhangi bir
// okuma/çözümleme sorununda ok=false — çağıran dondurmaz, bugünkü gibi çalışır.
func LoadAddDropEnd(root, slug string) (time.Time, bool) {
	y1, y2, _, ok := parseSlug(slug)
	if !ok {
		return time.Time{}, false
	}
	dir := filepath.Join(root, "data", "calendar", "lisans")
	entries, err := os.ReadDir(dir)
	if err != nil {
		return time.Time{}, false
	}
	var events []Event
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		b, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			continue
		}
		var cal struct {
			Year   string  `json:"year"`
			Events []Event `json:"events"`
		}
		if json.Unmarshal(b, &cal) != nil || !yearMatches(cal.Year, y1, y2) {
			continue
		}
		events = append(events, cal.Events...)
	}
	return AddDropEnd(slug, events)
}

// ParseTime, RFC3339 damgayı çözer; boş/bozuksa sıfır zaman (→ donma yok).
func ParseTime(s string) time.Time {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return time.Time{}
	}
	return t
}

// Date, bitiş anını takvimdeki bitiş GÜNÜ olarak biçimler (YYYY-MM-DD).
func Date(addDropEnd time.Time) string {
	return addDropEnd.In(istanbul).AddDate(0, 0, -1).Format("2006-01-02")
}

func parseSlug(slug string) (y1, y2 int, season string, ok bool) {
	p := strings.SplitN(slug, "-", 3)
	if len(p) != 3 {
		return 0, 0, "", false
	}
	a, errA := strconv.Atoi(p[0])
	b, errB := strconv.Atoi(p[1])
	if errA != nil || errB != nil || b != a+1 {
		return 0, 0, "", false
	}
	switch p[2] {
	case "guz", "bahar", "yaz":
		return a, b, p[2], true
	}
	return 0, 0, "", false
}

// inSeason, bitiş tarihinin dönemin kendi kayıt penceresine düşüp düşmediği.
// Pencereler geniş ama ayrık: bir yılın iki ekle-bırak satırı karışmaz.
func inSeason(d time.Time, y1, y2 int, season string) bool {
	m := int(d.Month())
	switch season {
	case "guz":
		return d.Year() == y1 && m >= 9 && m <= 11
	case "bahar":
		return d.Year() == y2 && m >= 1 && m <= 4
	case "yaz":
		return d.Year() == y2 && m >= 6 && m <= 8
	}
	return false
}

// isAddDrop: "Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse
// Yazılma". Büyük/küçük harf ve Türkçe karakter farklarına dayanıklı eşleşme.
func isAddDrop(title string) bool {
	t := fold(title)
	return strings.Contains(t, "birakip") && strings.Contains(t, "derse yazilma")
}

func fold(s string) string {
	s = strings.NewReplacer(
		"İ", "i", "I", "i", "ı", "i", "Ş", "s", "ş", "s", "Ğ", "g", "ğ", "g",
		"Ü", "u", "ü", "u", "Ö", "o", "ö", "o", "Ç", "c", "ç", "c",
	).Replace(s)
	return strings.Join(strings.Fields(strings.ToLower(s)), " ")
}

// yearMatches: "2026-2027 Eğitim - Öğretim Yılı" etiketi y1-y2 yılına mı ait?
func yearMatches(label string, y1, y2 int) bool {
	var nums []int
	cur := ""
	flush := func() {
		if len(cur) == 4 {
			n, _ := strconv.Atoi(cur)
			nums = append(nums, n)
		}
		cur = ""
	}
	for _, r := range label {
		if r >= '0' && r <= '9' {
			cur += string(r)
			continue
		}
		flush()
	}
	flush()
	return len(nums) >= 2 && nums[0] == y1 && nums[1] == y2
}
