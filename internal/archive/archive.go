// Package archive, geçmiş dönemlerin ders programlarını itutakvimci.com'un
// yayınladığı birleşik CSV dökümlerinden okur.
//
// OBS geçmiş dönemleri sunmuyor — DersProgramSearch yalnızca aktif dönemi
// döndürüyor — bu yüzden 2016-2017'ye kadar geriye gitmenin tek yolu bu.
// Dönem başına tek dosya var, dolayısıyla ayıklanacak tekrar yok.
//
// Bu döküm OBS'den daha dar: öğretim yöntemi, önşart ve rezervasyon kolonları
// yok. Olanlar (kod, ad, eğitmen, gün, saat, bina, derslik, kontenjan, kayıtlı,
// bölüm sınırlaması, CRN) bizim modelimize birebir oturuyor.
package archive

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
	"itu-scraper/internal/term"
)

const (
	base = "https://itutakvimci.com/ders-arsivi/data"
	// Source, üretilen veride kaynak göstermek için.
	Source = "itutakvimci.com"
)

// Snapshot, tek bir dönemin tam ders listesi.
type Snapshot struct {
	Label    string // "2016-2017 Yaz Dönemi"
	Slug     string // "2016-2017-yaz"
	Sections []model.Section
}

// Fetch, yayınlanmış tüm dönemleri indirir.
// levels, branş kodundan seviye (LS/LU/...) çözmek için kullanılır.
func Fetch(ctx context.Context, f *fetch.Client, levels map[string]string, log func(string, ...any)) ([]Snapshot, error) {
	raw, err := f.Bytes(ctx, base+"/terms.json")
	if err != nil {
		return nil, fmt.Errorf("dönem listesi alınamadı: %w", err)
	}
	var labels []string
	if err := json.Unmarshal(raw, &labels); err != nil {
		return nil, fmt.Errorf("dönem listesi çözümlenemedi: %w", err)
	}
	log("arşivde %d dönem listeleniyor", len(labels))

	var out []Snapshot
	for _, label := range labels {
		if strings.TrimSpace(label) == "" {
			continue
		}
		secs, err := fetchTerm(ctx, f, label, levels)
		if err != nil {
			return nil, err
		}
		if len(secs) == 0 {
			log("uyarı: %s boş döndü, atlanıyor", label)
			continue
		}
		norm := normalizeLabel(label)
		out = append(out, Snapshot{Label: norm, Slug: term.Slug(norm), Sections: secs})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("arşivden hiç dönem okunamadı — kaynak yapısı değişmiş olabilir")
	}
	return out, nil
}

func fetchTerm(ctx context.Context, f *fetch.Client, label string, levels map[string]string) ([]model.Section, error) {
	// Dosya adı: boşluklar ve tireler alt çizgiye çevriliyor
	// ("2016 - 2017 Yaz Dönemi" -> "2016___2017_Yaz_Dönemi.csv").
	name := strings.ReplaceAll(strings.ReplaceAll(label, " ", "_"), "-", "_") + ".csv"
	body, err := f.Bytes(ctx, base+"/csv_birlesik/"+url.PathEscape(name))
	if err != nil {
		return nil, fmt.Errorf("%s: %w", label, err)
	}
	secs, err := parseCSV(body, levels)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", label, err)
	}
	sort.Slice(secs, func(i, j int) bool { return secs[i].CRN < secs[j].CRN })
	return secs, nil
}

// normalizeLabel, kaynağın "2016 - 2017 Yaz Dönemi" biçimini OBS'nin kullandığı
// "2016-2017 Yaz Dönemi" biçimine çeker.
func normalizeLabel(s string) string {
	return strings.TrimSpace(strings.ReplaceAll(squash(s), " - ", "-"))
}

func parseCSV(data []byte, levels map[string]string) ([]model.Section, error) {
	r := csv.NewReader(bytes.NewReader(bytes.TrimPrefix(data, []byte("\xef\xbb\xbf"))))
	r.FieldsPerRecord = -1
	r.LazyQuotes = true
	recs, err := r.ReadAll()
	if err != nil {
		return nil, err
	}
	if len(recs) < 2 {
		return nil, nil
	}

	// Kolonları başlık adıyla çözüyoruz; sıraya güvenmek kaynağın bir gün
	// kolon eklemesiyle sessizce bozulur.
	col := map[string]int{}
	for i, h := range recs[0] {
		col[strings.TrimSpace(h)] = i
	}
	for _, want := range []string{"Kod", "Ders", "CRN", "Kontenjan", "Kayıtlı"} {
		if _, ok := col[want]; !ok {
			return nil, fmt.Errorf("beklenen kolon yok: %q (gelen: %v)", want, recs[0])
		}
	}
	get := func(rec []string, name string) string {
		i, ok := col[name]
		if !ok || i >= len(rec) {
			return ""
		}
		return strings.TrimSpace(rec[i])
	}

	var out []model.Section
	for _, rec := range recs[1:] {
		crn := get(rec, "CRN")
		code := squash(get(rec, "Kod"))
		if crn == "" || code == "" {
			continue
		}
		branch := strings.Fields(code)[0]

		days := normalizeDays(split(get(rec, "Gün")))
		times := normalizeTimes(split(get(rec, "Saat")))
		buildings, rooms := splitPlaces(get(rec, "Bina"), len(days))

		out = append(out, model.Section{
			CRN:        crn,
			Code:       code,
			Branch:     branch,
			Level:      levels[branch],
			Name:       squash(get(rec, "Ders")),
			Instructor: squash(get(rec, "Eğitmen")),
			Buildings:  buildings,
			Days:       days,
			Times:      times,
			Rooms:      rooms,
			Capacity:   atoi(get(rec, "Kontenjan")),
			Enrolled:   atoi(get(rec, "Kayıtlı")),
			Programs:   SplitPrograms(get(rec, "Bölüm Sınırlaması")),
		})
	}
	return out, nil
}

var (
	wsRe   = regexp.MustCompile(`\s+`)
	timeRe = regexp.MustCompile(`^(\d{2})(\d{2})/(\d{2})(\d{2})$`)
)

func squash(s string) string { return strings.TrimSpace(wsRe.ReplaceAllString(s, " ")) }

// split, çok oturumlu hücreleri ayırır. Kaynak yıllara göre iki ayırıcı
// kullanıyor: yeni dökümlerde " / ", eskilerde düz boşluk.
func split(s string) []string {
	s = strings.TrimSpace(s)
	if s == "" {
		return []string{}
	}
	var raw []string
	if strings.Contains(s, "/") && strings.Contains(s, " / ") {
		raw = strings.Split(s, " / ")
	} else {
		raw = wsRe.Split(s, -1)
	}
	out := []string{}
	for _, p := range raw {
		p = strings.TrimSpace(p)
		if p == "" || p == "-" || p == "--" || p == "----" {
			continue
		}
		out = append(out, p)
	}
	return out
}

var programCodeRe = regexp.MustCompile(`^[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9_]{1,19}$`)

// SplitPrograms, "Bölüm Sınırlaması" kolonunu program kodları listesine ayırır.
// Kaynak yıla göre virgül, noktalı virgül, dik çizgi ya da boşlukla ayırabiliyor
// ("AIN, ARC, BIO", "CEV CHZ IML", "BLG_LS; MAT_LS"). Bazı kayıtlarda düz cümle
// geçiyor ("Yabancı Uyruklu Tüm Lisans ve Lisansüstü Öğrenciler"); cümleyi
// bölmek sahte program kodları üretir, o yüzden yalnızca bütün parçalar kod
// biçimindeyse bölüyoruz, aksi halde hücrenin tamamını tek öğe döndürüyoruz.
func SplitPrograms(cell string) []string {
	parts := programTokens(cell)
	for _, p := range parts {
		if !programCodeRe.MatchString(p) {
			return []string{squash(cell)}
		}
	}
	return parts
}

// programTokens, ayraçları tek standarda indirir: virgül, noktalı virgül ve dik
// çizgi boşluğa çevrilip tümü tek ayraç sayılır; "-"/"--"/"----" boş hücre
// gösterimleri atlanır.
func programTokens(s string) []string {
	s = strings.NewReplacer(",", " ", ";", " ", "|", " ").Replace(s)
	var out []string
	for _, p := range strings.Fields(s) {
		if p == "-" || p == "--" || p == "----" {
			continue
		}
		out = append(out, p)
	}
	return out
}

// splitPlaces, "Bina" kolonunu bina ve derslik olarak ayırır. Kaynak ikisini tek
// hücrede birleştiriyor: "INB / A104" tek oturum için bina+derslik,
// "MDB / MDB / -- / --" ise iki oturum için iki bina + iki derslik.
// Eleman sayısı oturum sayısının iki katıysa ikinci yarı dersliktir.
func splitPlaces(cell string, sessions int) (buildings, rooms []string) {
	parts := split(cell)
	if sessions > 0 && len(parts) == 2*sessions {
		return parts[:sessions], parts[sessions:]
	}
	return parts, []string{}
}

// normalizeTimes, eski dökümlerdeki "0930/1229" biçimini bugünkü
// "09:30/12:29" biçimine çeker; iki dönem yan yana karşılaştırılabilsin.
func normalizeTimes(times []string) []string {
	for i, t := range times {
		if m := timeRe.FindStringSubmatch(t); m != nil {
			times[i] = m[1] + ":" + m[2] + "/" + m[3] + ":" + m[4]
		}
	}
	return times
}

// Kaynak bazı yıllarda İngilizce sayfadan toplamış; tek dilde aranabilsin diye
// gün adlarını Türkçe'ye çekiyoruz.
var dayTR = map[string]string{
	"monday": "Pazartesi", "tuesday": "Salı", "wednesday": "Çarşamba",
	"thursday": "Perşembe", "friday": "Cuma", "saturday": "Cumartesi", "sunday": "Pazar",
}

func normalizeDays(days []string) []string {
	for i, d := range days {
		if tr, ok := dayTR[strings.ToLower(d)]; ok {
			days[i] = tr
		}
	}
	return days
}

func atoi(s string) int {
	n, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return 0
	}
	return n
}
