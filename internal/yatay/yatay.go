// Package yatay, İTÜ içi yatay geçiş (kurum içi, aynı seviye programlar arası)
// taban/tavan sonuç tablolarını sis.itu.edu.tr'den çeker.
//
// Kaynak sayfalar iki farklı metodoloji dönemine ayrılıyor — 2023-2024'te
// üniversite ölçütü değiştirdi:
//
//	2011-2012 → 2022-2023: sayfa "Not Ortalaması" (AGNO) taban/tavanı basıyor,
//	  4.00'lük skalada, bölüm başına TEK satır (3. ve 5. yarıyıl yan yana).
//	2023-2024 → günümüz: sayfa MADDE 30(4)'teki tam "Değerlendirme Puanı"nı
//	  (%40 YKS + %60 AGNO, 100'lük sistemden normalize) basıyor, 0-1 skalada,
//	  yarıyıl başına AYRI satır.
//
// İki dönem aynı değer değil — biri ham AGNO, diğeri ağırlıklı bileşik puan.
// Sessizce birbirine çevrilmiyor; Term.Metric hangisi olduğunu taşıyor.
//
// Sayfalar HTML olarak bozuk (kapanmamış <td>, tırnaksız öznitelikler) —
// standart <td>...</td> regex'i eşleşmeyi kaçırıyor. splitOn bunun yerine her
// etiketin başlangıcına göre bölüyor, kapanışın var olup olmamasından bağımsız.
package yatay

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strconv"
	"strings"

	"itu-scraper/internal/fetch"
)

// Metric, taban/tavan değerinin hangi ölçütte olduğunu belirtir.
type Metric string

const (
	MetricAGNO  Metric = "agno"          // ham ağırlıklı not ortalaması, 4.00 skala
	MetricScore Metric = "degerlendirme" // %40 YKS + %60 AGNO bileşik puanı, 0-1 skala
)

// Format, kaynak sayfanın tablo yapısını belirtir.
type format int

const (
	formatCombined    format = iota // bölüm başına tek satır, 3./5. yarıyıl yan yana (2011-2022)
	formatPerSemester               // yarıyıl başına ayrı satır (2023-günümüz)
)

// Spec, tek bir akademik yılın kaynak sayfasını tanımlar.
type Spec struct {
	Term   string // "2023-2024"
	URL    string
	Metric Metric
	format format
}

// Terms, bilinen tüm yıllar. sis.itu.edu.tr'nin kendi indeks sayfasından
// doğrulandı (2026-08-29); URL biçimi üç kez değişti (bkz. paket yorumu).
var Terms = []Spec{
	{Term: "2011-2012", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201210/201210yatay_taban_tavan_puanlar.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2012-2013", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201310/201310yatay_taban_tavan_puanlar.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2013-2014", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201410/201410_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2014-2015", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201510/201510_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2015-2016", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201610/201610_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2016-2017", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201710/201710_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2017-2018", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201810/201810_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2018-2019", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/201910/201910_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2019-2020", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202010/202010_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2020-2021", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202110/202110_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2021-2022", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202210/202210_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2022-2023", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202310/202310_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricAGNO, format: formatCombined},
	{Term: "2023-2024", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202410/202410_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricScore, format: formatPerSemester},
	{Term: "2024-2025", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202510/202510_ituiciyatay_taban_tavan_puanlari.htm", Metric: MetricScore, format: formatPerSemester},
	{Term: "2025-2026", URL: "https://www.sis.itu.edu.tr/TR/ogrenci/lisans/cap-yandal-yatay-gecis/202610/yatay-taban-tavan-202610.php", Metric: MetricScore, format: formatPerSemester},
}

// Result, tek bir program + yarıyıl için taban/tavan kaydı.
type Result struct {
	Faculty     string   `json:"faculty"`
	Program     string   `json:"program"`
	ProgramCode string   `json:"programCode,omitempty"` // arşiv kodu (BLG_LS vb.) — bkz. match.go; KKTC/UOLP hedefleri kasıtlı boş
	Semester    int      `json:"semester"`              // 3 veya 5
	Quota       int      `json:"quota,omitempty"`
	Placed      int      `json:"placed"`
	Ceiling     *float64 `json:"ceiling,omitempty"` // nil = o yarıyıl için yerleşen olmadı
	Floor       *float64 `json:"floor,omitempty"`
}

// Term, bir akademik yılın tüm sonuçları.
type Term struct {
	Term      string   `json:"term"`
	Metric    Metric   `json:"metric"`
	SourceURL string   `json:"sourceUrl"`
	Results   []Result `json:"results"`
}

type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

// Fetch, tek bir yılın sayfasını çeker ve çözer.
func (c *Client) Fetch(ctx context.Context, spec Spec) (*Term, error) {
	body, err := c.f.Text(ctx, spec.URL)
	if err != nil {
		return nil, err
	}
	results, err := Parse(body, spec.format)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", spec.Term, err)
	}
	return &Term{Term: spec.Term, Metric: spec.Metric, SourceURL: spec.URL, Results: results}, nil
}

var (
	tagRe  = regexp.MustCompile(`(?s)<[^>]*>`)
	spRe   = regexp.MustCompile(`\s+`)
	nbspRe = regexp.MustCompile(" ") // &nbsp; -> U+00A0; Go'nun \s'i (RE2) bunu kapsamıyor
)

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = nbspRe.ReplaceAllString(s, " ")
	return strings.TrimSpace(spRe.ReplaceAllString(s, " "))
}

var (
	tdOpenRe = regexp.MustCompile(`(?i)<td`)
	trOpenRe = regexp.MustCompile(`(?i)<tr`)
)

// splitOn, text'i tag'in (büyük/küçük harf duyarsız) her tekrarına göre böler
// ve her parçanın açılış etiketinden sonraki (etiketler temizlenmiş)
// içeriğini döner. Kaynak HTML kapanmamış <td> içerebiliyor
// (`<td>Program<td>Yarıyıl</td>`) — standart <td>...</td> regex'i böyle
// satırlarda hücreleri birbirine karıştırır; bu fonksiyon yalnızca
// açılışlara göre böldüğü için kapanışın var olup olmamasından etkilenmez.
// Eski sayfalar büyük harfli <TABLE>/<TR>/<TD> kullanıyor — regex ile arama
// (bytes.ToLower ile ön işleme değil) konum kaymasına yol açmadan bunu çözer;
// 'İ'.ToLower gibi çok baytlı Türkçe harflerin kopyalanmış bir metinde
// kaydırma yaratma riski böylece yok.
func splitOn(text string, re *regexp.Regexp) []string {
	locs := re.FindAllStringIndex(text, -1)
	out := make([]string, 0, len(locs))
	for i, loc := range locs {
		end := len(text)
		if i+1 < len(locs) {
			end = locs[i+1][0]
		}
		seg := text[loc[0]:end]
		if gt := strings.IndexByte(seg, '>'); gt >= 0 {
			seg = seg[gt+1:]
		}
		out = append(out, clean(seg))
	}
	return out
}

var tableRe = regexp.MustCompile(`(?is)<table.*?</table>`)

// Parse, gövdeyi biçime göre çözer. Saf — testli.
func Parse(body string, f format) ([]Result, error) {
	m := tableRe.FindString(body)
	if m == "" {
		return nil, fmt.Errorf("tablo bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	rows := splitOnRaw(m)
	var out []Result
	faculty := ""
	for _, row := range rows {
		cells := splitOn(row, tdOpenRe)
		if len(cells) == 1 {
			// Tek hücreli satır: fakülte başlığı (örn. "İnşaat Fakültesi").
			if cells[0] != "" {
				faculty = cells[0]
			}
			continue
		}
		switch f {
		case formatCombined:
			out = append(out, parseCombinedRow(faculty, cells)...)
		case formatPerSemester:
			if r, ok := parsePerSemesterRow(faculty, cells); ok {
				out = append(out, r)
			}
		}
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("sonuç satırı bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	return out, nil
}

// splitOnRaw, splitOn ile aynı bölme mantığını kullanır ama içeriği
// temizlemeden (etiketleri kaldırmadan) döner — satır bölme için, hücrelerin
// kendisi zaten splitOn ile ayrıca temizlenecek.
func splitOnRaw(text string) []string {
	locs := trOpenRe.FindAllStringIndex(text, -1)
	out := make([]string, 0, len(locs))
	for i, loc := range locs {
		end := len(text)
		if i+1 < len(locs) {
			end = locs[i+1][0]
		}
		out = append(out, text[loc[0]:end])
	}
	return out
}

// parseCombinedRow, 2011-2022 dönemi tek-satır biçimini çözer: Bölüm |
// 3.YY-Yerleşen | 3.YY-Tavan | 3.YY-Taban | 5.YY-Yerleşen | 5.YY-Tavan | 5.YY-Taban.
func parseCombinedRow(faculty string, cells []string) []Result {
	if len(cells) < 7 {
		return nil
	}
	program := cells[0]
	if program == "" {
		return nil
	}
	var out []Result
	if r, ok := combinedSemester(faculty, program, 3, cells[1], cells[2], cells[3]); ok {
		out = append(out, r)
	}
	if r, ok := combinedSemester(faculty, program, 5, cells[4], cells[5], cells[6]); ok {
		out = append(out, r)
	}
	return out
}

func combinedSemester(faculty, program string, semester int, placedS, ceilingS, floorS string) (Result, bool) {
	placed, _ := strconv.Atoi(placedS)
	r := Result{Faculty: faculty, Program: program, Semester: semester, Placed: placed}
	if c, ok := parseScoreCell(ceilingS); ok {
		r.Ceiling = &c
	}
	if fl, ok := parseScoreCell(floorS); ok {
		r.Floor = &fl
	}
	return r, true
}

// parsePerSemesterRow, 2023-günümüz biçimini çözer: Program | Yarıyıl |
// Kontenjan | Yerleşen | Tavan | Taban | [Açıklama].
func parsePerSemesterRow(faculty string, cells []string) (Result, bool) {
	if len(cells) < 6 {
		return Result{}, false
	}
	program := cells[0]
	if program == "" {
		return Result{}, false
	}
	semester := 0
	if strings.HasPrefix(cells[1], "3") {
		semester = 3
	} else if strings.HasPrefix(cells[1], "5") {
		semester = 5
	}
	if semester == 0 {
		return Result{}, false
	}
	quota, _ := strconv.Atoi(cells[2])
	placed, _ := strconv.Atoi(cells[3])
	r := Result{Faculty: faculty, Program: program, Semester: semester, Quota: quota, Placed: placed}
	if c, ok := parseScoreCell(cells[4]); ok {
		r.Ceiling = &c
	}
	if fl, ok := parseScoreCell(cells[5]); ok {
		r.Floor = &fl
	}
	return r, true
}

// parseScoreCell, "--"/"-"/boş → (0, false); sayısal değer → (değer, true).
func parseScoreCell(s string) (float64, bool) {
	s = strings.TrimSpace(s)
	if s == "" || s == "-" || s == "--" {
		return 0, false
	}
	v, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0, false
	}
	return v, true
}
