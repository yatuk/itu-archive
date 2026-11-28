// Package curriculum, OBS'nin public ders planı sayfalarından her programın
// güncel müfredatını (dönem dönem zorunlu/seçmeli dersler) çeker.
//
// Akış üç aşamalı:
//
//	GenelTanimlamalar/ProgramKodlariList?programSeviyeTipiId=<id> -> program kodları ("BLG_LS", "BLG_HBY_YL")
//	DersPlan/DersPlanlariList?programKodu=X&planTipiKodu=<tip> -> o programın plan sürümleri (yıllara göre)
//	DersPlan/DersPlanDetay/<id>                                  -> son sürümün ders tablosu
//	DersPlan/_DersGrupSearch?grupId=<id>                          -> bir seçmeli slotun alternatif ders listesi
//
// Seviyeler OBS'de farklı parametrelerle geliyor:
//
//	1 = Önlisans (_OL)     planTipiKodu=on-lisans, dönem sütunları (lisans gibi)
//	2 = Lisans (_LS)       planTipiKodu=lisans
//	3 = Yüksek Lisans (_YL) planTipiKodu=yuksek-lisans, TEK düz tablo (dönem yok)
//	4 = Doktora (_DR)      planTipiKodu=doktora, TEK düz tablo (dönem yok)
//
// Lisans ve önlisans planları "1. Yarıyıl" başlıklı tablolara bölünmüş; yüksek
// lisans ve doktora ise dönem ayrımı olmayan tek bir düz liste — o programlar
// tek dönemli olarak saklanıyor.
//
// Bir program birden çok plan sürümü listeler (örn. "2017-2018 Güz ile
// 2021-2022 Güz Dönemleri Arası"); son satır her zaman en güncel olanı ve
// <PROG>.json'a o yazılır (varsayılan). Öğrenci, kaydolduğu dönemde geçerli
// sürüme tabidir; bu yüzden Client.AllVersions açıkken eski sürümler de
// (geçerliliği MinVersionYear'dan önce bitenler hariç) çekilir ve Plan.Older'da
// döner. Etiketteki dönem aralığı ParseValidity ile çözülür.
package curriculum

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"itu-scraper/internal/fetch"
)

// URL'ler değişken: testler httptest sunucusuna yönlendirir (setBase).
var (
	programListURL = "https://obs.itu.edu.tr/public/GenelTanimlamalar/ProgramKodlariList"
	planListURL    = "https://obs.itu.edu.tr/public/DersPlan/DersPlanlariList"
	planDetailURL  = "https://obs.itu.edu.tr/public/DersPlan/DersPlanDetay"
	groupSearchURL = "https://obs.itu.edu.tr/public/DersPlan/_DersGrupSearch"
)

// setBase, tüm uç noktaları verilen köke taşır (yalnız testler için).
func setBase(base string) {
	programListURL = base + "/public/GenelTanimlamalar/ProgramKodlariList"
	planListURL = base + "/public/DersPlan/DersPlanlariList"
	planDetailURL = base + "/public/DersPlan/DersPlanDetay"
	groupSearchURL = base + "/public/DersPlan/_DersGrupSearch"
}

// Level, bir program seviyesinin OBS parametreleri. Seviye tipi ID'leri
// ProgramKodlariList'e, plan tipi kodları DersPlanlariList'e veriliyor.
type Level struct {
	Name     string // "OL", "LS", "YL", "DR"
	SeviyeID int    // programSeviyeTipiId
	PlanTipi string // planTipiKodu
	Suffix   string // program kodu soneki
	Flat     bool   // dönem tabloları yerine tek düz tablo (lisansüstü)
}

// Levels, desteklenen program seviyeleri. İkinci öğretim (ID 5) dahil değil:
// kodları yüksek lisansla (_YL) çakışıp aynı dosyayı ezebilir.
var Levels = []Level{
	{Name: "OL", SeviyeID: 1, PlanTipi: "on-lisans", Suffix: "_OL"},
	{Name: "LS", SeviyeID: 2, PlanTipi: "lisans", Suffix: "_LS"},
	{Name: "YL", SeviyeID: 3, PlanTipi: "yuksek-lisans", Suffix: "_YL", Flat: true},
	{Name: "DR", SeviyeID: 4, PlanTipi: "doktora", Suffix: "_DR", Flat: true},
}

func levelOf(name string) Level {
	for _, lv := range Levels {
		if lv.Name == name {
			return lv
		}
	}
	return Levels[1] // varsayılan: lisans
}

type Program struct {
	Code    string // "BLG_LS"
	Name    string
	Faculty string
	Level   string // "OL" | "LS" | "YL" | "DR"
}

// Course (Faz: Ders Planım) — plan satırındaki tüm kolonlar. Alan eklemeli,
// geriye uyumlu: eski {code,name} kayıtları yine okunur.
type Course struct {
	Code     string  `json:"code"`
	Name     string  `json:"name"`
	Language string  `json:"language,omitempty"` // ders dili
	Required string  `json:"required,omitempty"` // "Z" zorunlu | "S" seçmeli
	Credits  float64 `json:"credits,omitempty"`  // Kredi (Türkçe virgül → sayı)
	Ects     float64 `json:"ects,omitempty"`     // AKTS
	Theory   int     `json:"theory,omitempty"`   // Teo.
	Tutorial int     `json:"tutorial,omitempty"` // Uyg.
	Lab      int     `json:"lab,omitempty"`      // Lab.
	Type     string  `json:"type,omitempty"`     // TB/TM/MT/ITB/EC
}

type Elective struct {
	Title   string    `json:"title"`
	GroupID string    `json:"groupId,omitempty"` // _DersGrupSearch?grupId=
	Credits string    `json:"credits,omitempty"` // aralık olabilir: "3 / 4"
	Ects    []float64 `json:"ects,omitempty"`    // aralık: "4 / 5 / 6" → [4,5,6]
	Options []Course  `json:"options"`
}

// Item, bir dönemdeki tek bir slot: ya sabit bir ders ya da bir seçmeli grup.
type Item struct {
	Course   *Course   `json:"course,omitempty"`
	Elective *Elective `json:"elective,omitempty"`
}

type Semester struct {
	Title string `json:"title"`
	Items []Item `json:"items"`
}

type Plan struct {
	PlanID       int    `json:"planId,omitempty"`
	ProgramCode  string `json:"programCode"`
	ProgramName  string `json:"programName"`
	Faculty      string `json:"faculty"`
	Level        string `json:"level"`
	PlanLabel    string `json:"planLabel"`
	SourceURL    string `json:"sourceUrl,omitempty"`
	TotalCredits string `json:"totalCredits,omitempty"` // sayfa altı "Toplam Kredi"
	TotalEcts    string `json:"totalEcts,omitempty"`    // sayfa altı "Toplam AKTS"
	// OBS bazı programlarda (özellikle önlisans) AKTS toplamını 0,00 basar;
	// o zaman kalemlerden toplanır ve bu bayrak "hesaplandı" işareti olur.
	TotalCreditsComputed bool `json:"totalCreditsComputed,omitempty"`
	TotalEctsComputed    bool `json:"totalEctsComputed,omitempty"`
	// Etiketten çözülen geçerlilik aralığı ("2021-2022 Güz"): ValidFrom dahil,
	// ValidUntil hariç (bir sonraki sürüm o dönemden başlar). Boşsa açık uç.
	ValidFrom  string     `json:"validFrom,omitempty"`
	ValidUntil string     `json:"validUntil,omitempty"`
	Semesters  []Semester `json:"semesters"`
	// Versions yalnız en güncel dosyada (<PROG>.json) bulunur: programın
	// çekilen tüm plan sürümleri (OBS sırasıyla, en güncel sonda).
	Versions []PlanVersion `json:"versions,omitempty"`
	// Older, aynı programın eski sürümleri (yazım için; JSON'a girmez).
	Older []*Plan `json:"-"`
}

// PlanVersion, bir programın plan sürümü listesindeki tek satır.
type PlanVersion struct {
	PlanID     int    `json:"planId"`
	Label      string `json:"label"`
	ValidFrom  string `json:"validFrom,omitempty"`
	ValidUntil string `json:"validUntil,omitempty"`
	// File, sürümün tam planı (site köküne göre). En güncel sürümün de arşiv
	// kopyası yazılır; arayüz en günceli <PROG>.json'dan okur.
	File   string `json:"file,omitempty"`
	Latest bool   `json:"latest,omitempty"`
}

// VersionFile, bir plan sürümünün arşiv dosyasının site köküne göre yolu.
func VersionFile(programCode string, planID int) string {
	return fmt.Sprintf("data/curriculum/versions/%s-%d.json", programCode, planID)
}

type Client struct {
	f *fetch.Client

	// AllVersions açıksa Plan eski plan sürümlerini de Older'a çeker.
	AllVersions bool
	// MinVersionYear: geçerliliği bu yılın Güz döneminde ya da daha önce biten
	// sürümler atlanır (o yıllarda kaydolup hâlâ okuyan öğrenci kalmadı). 0 = hepsi.
	MinVersionYear int

	mu     sync.Mutex
	groups map[string][]Course // grupId -> alternatifler, programlar arası paylaşılıyor
}

func New(f *fetch.Client) *Client {
	return &Client{f: f, groups: map[string][]Course{}}
}

var (
	rowRe         = regexp.MustCompile(`(?is)<tr>(.*?)</tr>`)
	cellRe        = regexp.MustCompile(`(?is)<td[^>]*>(.*?)</td>`)
	tagRe         = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe       = regexp.MustCompile(`\s+`)
	hrefRe        = regexp.MustCompile(`(?i)href="([^"]+)"`)
	h2Re          = regexp.MustCompile(`(?is)<h2[^>]*>(.*?)</h2>`)
	tableRe       = regexp.MustCompile(`(?is)<table[^>]*>(.*?)</table>`)
	grupIDRe      = regexp.MustCompile(`grupId=(\d+)`)
	planIDRe      = regexp.MustCompile(`DersPlanDetay/(\d+)`)
	branchOnlyRe  = regexp.MustCompile(`^[A-ZÇĞİÖŞÜ]{2,4}$`)
	romanSuffixRe = regexp.MustCompile(`\s+[IVX]+$`)
	totalKrediRe  = regexp.MustCompile(`(?i)Toplam\s+Kredi[^0-9]*([0-9.,]+)`)
	totalEctsRe   = regexp.MustCompile(`(?i)Toplam\s+AKTS[^0-9]*([0-9.,]+)`)
	// Ders kodu hücresindeki bağlantılar: <a href="...bransKodu=SAO&dersNo=101">SAO 101E</a>.
	// OBS aynı dersin İngilizce ve Türkçe kodlarını AYRI bağlantılar basar —
	// clean() bunları yan yana metne çevirip "SAO 101E SAO 101" üretirdi.
	codeLinkRe = regexp.MustCompile(`(?is)<a[^>]*>(.*?)</a>`)
	// "SAO 101E" / "BLG 102" / "TUR 121" kod kalıbı (branş + numara + isteğe bağlı E).
	codeRe = regexp.MustCompile(`(?i)\b([A-ZÇĞİÖŞÜ]{2,5})\s*(\d{2,4})\s*(E)?\b`)
)

// Programs, tüm seviyelerdeki programların kodunu, seviyesini ve fakültesini
// döndürür. Seviye tipi ID'leri kararlı olmadığı için ("hangisi önlisans,
// hangisi lisans" sorusunun cevabı siteden sitede değişiyor) her seviyeyi ayrı
// çekip program kodundaki sonekle (_OL, _LS, ...) doğruluyoruz.
func (c *Client) Programs(ctx context.Context) ([]Program, error) {
	var out []Program
	for _, lv := range Levels {
		ps, err := c.programsForLevel(ctx, lv)
		if err != nil {
			return nil, err
		}
		out = append(out, ps...)
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("hiç program bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	return out, nil
}

func (c *Client) programsForLevel(ctx context.Context, lv Level) ([]Program, error) {
	body, err := c.f.Text(ctx, fmt.Sprintf("%s?programSeviyeTipiId=%d", programListURL, lv.SeviyeID))
	if err != nil {
		return nil, err
	}
	var out []Program
	faculty := ""
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 1 {
			faculty = clean(cells[0][1]) // fakülte başlık satırı
			continue
		}
		if len(cells) != 2 {
			continue
		}
		code := clean(cells[0][1])
		if code == "" || !strings.HasSuffix(code, lv.Suffix) {
			continue
		}
		out = append(out, Program{Code: code, Name: clean(cells[1][1]), Faculty: faculty, Level: lv.Name})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("seviye %s (%d) için program bulunamadı — sayfa yapısı değişmiş olabilir", lv.Name, lv.SeviyeID)
	}
	return out, nil
}

// PlanVersions, bir programın OBS'de listelenen tüm plan sürümlerini (OBS
// sırasıyla; son satır en güncel) geçerlilik aralığıyla döndürür.
func (c *Client) PlanVersions(ctx context.Context, programCode string, lv Level) ([]PlanVersion, error) {
	url := fmt.Sprintf("%s?programKodu=%s&planTipiKodu=%s", planListURL, programCode, lv.PlanTipi)
	body, err := c.f.Text(ctx, url)
	if err != nil {
		return nil, err
	}
	out := parsePlanList(body, programCode)
	if len(out) == 0 {
		return nil, fmt.Errorf("%s: hiç plan sürümü bulunamadı", programCode)
	}
	return out, nil
}

// parsePlanList, DersPlanlariList sayfasındaki sürüm satırlarını çözer.
func parsePlanList(body, programCode string) []PlanVersion {
	var out []PlanVersion
	seen := map[int]bool{}
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) != 2 {
			continue
		}
		href := hrefRe.FindStringSubmatch(cells[0][1])
		if href == nil {
			continue
		}
		m := planIDRe.FindStringSubmatch(href[1])
		if m == nil {
			continue
		}
		id, _ := strconv.Atoi(m[1])
		if id <= 0 || seen[id] {
			continue
		}
		seen[id] = true
		label := clean(cells[1][1])
		from, until := ParseValidity(label)
		out = append(out, PlanVersion{PlanID: id, Label: label, ValidFrom: from, ValidUntil: until, File: VersionFile(programCode, id)})
	}
	if len(out) > 0 {
		out[len(out)-1].Latest = true
	}
	return out
}

// LatestPlanID, bir programın en güncel müfredat sürümünün detay ID'sini bulur.
func (c *Client) LatestPlanID(ctx context.Context, programCode string, lv Level) (int, string, error) {
	vs, err := c.PlanVersions(ctx, programCode, lv)
	if err != nil {
		return 0, "", err
	}
	last := vs[len(vs)-1]
	return last.PlanID, last.Label, nil
}

// termRe, plan etiketindeki "2021-2022 / Güz" dönem kalıbı. Yıl ile dönem
// arasındaki eğik çizgi ve boşluklar OBS'de tutarsız ("2026-2027/ Güz",
// "2024 - 2025 / Güz", "2025-2026 Güz"); dönem adı yoksa Güz varsayılır.
var termRe = regexp.MustCompile(`(?i)(\d{4})\s*-\s*(\d{4})(?:\s*/?\s*(güz|guz|bahar|yaz|fall|spring|summer))?`)

// ParseValidity, plan sürümü etiketinden geçerlilik aralığını çözer:
//
//	"… 2017-2018 / Güz ile 2021-2022 / Güz Dönemleri Arası" → ("2017-2018 Güz", "2021-2022 Güz")
//	"… 2026-2027/ Güz Dönemi Sonrası"                       → ("2026-2027 Güz", "")
//	"… 2026-2027 / Güz Dönemi Öncesi"                       → ("", "2026-2027 Güz")
//	"… (PhD)"                                                → ("", "")
//
// Başlangıç dahil, bitiş hariçtir: OBS ardışık sürümlerde bitiş dönemini bir
// sonraki sürümün başlangıcı olarak yazar.
func ParseValidity(label string) (from, until string) {
	var terms []string
	var ends []int
	for _, m := range termRe.FindAllStringSubmatchIndex(label, -1) {
		y1, _ := strconv.Atoi(label[m[2]:m[3]])
		y2, _ := strconv.Atoi(label[m[4]:m[5]])
		if y1 < 1950 || y1 > 2200 || y2 != y1+1 {
			continue
		}
		season := "Güz"
		if m[6] >= 0 {
			season = normSeason(label[m[6]:m[7]])
		}
		terms = append(terms, fmt.Sprintf("%d-%d %s", y1, y2, season))
		ends = append(ends, m[1])
	}
	switch {
	case len(terms) >= 2:
		return terms[0], terms[1]
	case len(terms) == 1:
		rest := strings.ToLower(label[ends[0]:])
		if strings.Contains(rest, "öncesi") || strings.Contains(rest, "oncesi") || strings.Contains(rest, "before") {
			return "", terms[0]
		}
		return terms[0], ""
	}
	return "", ""
}

func normSeason(s string) string {
	switch strings.ToLower(s) {
	case "bahar", "spring":
		return "Bahar"
	case "yaz", "summer":
		return "Yaz"
	}
	return "Güz"
}

// TermKey, "2021-2022 Güz" dönemini sıralanabilir sayıya çevirir (yıl*3 +
// Güz 0 / Bahar 1 / Yaz 2); çözülemezse -1.
func TermKey(term string) int {
	m := termRe.FindStringSubmatch(term)
	if m == nil {
		return -1
	}
	y, _ := strconv.Atoi(m[1])
	off := 0
	switch normSeason(m[3]) {
	case "Bahar":
		off = 1
	case "Yaz":
		off = 2
	}
	return y*3 + off
}

// keepVersion, eski sürümün çekilmeye değer olup olmadığını söyler: bitişi
// bilinmeyen ya da MinVersionYear Güz'ünden sonra biten sürümler tutulur.
func (c *Client) keepVersion(v PlanVersion) bool {
	if v.Latest || c.MinVersionYear <= 0 || v.ValidUntil == "" {
		return true
	}
	k := TermKey(v.ValidUntil)
	return k < 0 || k > c.MinVersionYear*3
}

// Plan, bir programın en güncel müfredatını tam olarak çeker (seçmeli grupları
// dahil). AllVersions açıksa eski sürümler Older'a, sürüm listesi Versions'a
// yazılır; tek bir eski sürümün sayfası bozuksa yalnız o sürüm atlanır.
func (c *Client) Plan(ctx context.Context, p Program) (*Plan, error) {
	return c.plan(ctx, p, nil)
}

func (c *Client) plan(ctx context.Context, p Program, warn func(string, ...any)) (*Plan, error) {
	vs, err := c.PlanVersions(ctx, p.Code, levelOf(p.Level))
	if err != nil {
		return nil, err
	}
	latest := vs[len(vs)-1]
	plan, err := c.PlanByID(ctx, p, latest)
	if err != nil {
		return nil, err
	}
	if !c.AllVersions {
		return plan, nil
	}
	var kept []PlanVersion
	for _, v := range vs[:len(vs)-1] {
		if !c.keepVersion(v) {
			continue
		}
		old, err := c.PlanByID(ctx, p, v)
		if err != nil {
			if warn != nil {
				warn("  %s sürüm %d atlandı: %v", p.Code, v.PlanID, err)
			}
			continue
		}
		if len(old.Semesters) == 0 {
			continue
		}
		plan.Older = append(plan.Older, old)
		kept = append(kept, v)
	}
	plan.Versions = append(kept, latest)
	return plan, nil
}

// PlanByID, verilen plan sürümünün ders tablosunu çeker.
func (c *Client) PlanByID(ctx context.Context, p Program, v PlanVersion) (*Plan, error) {
	body, err := c.f.Text(ctx, fmt.Sprintf("%s/%d", planDetailURL, v.PlanID))
	if err != nil {
		return nil, err
	}
	var plan *Plan
	if levelOf(p.Level).Flat {
		plan, err = c.parseFlatPlan(ctx, body, p, v.Label, v.PlanID)
	} else {
		plan, err = c.parseSemesterPlan(ctx, body, p, v.Label, v.PlanID)
	}
	if err != nil {
		return nil, err
	}
	plan.ValidFrom, plan.ValidUntil = ParseValidity(v.Label)
	return plan, nil
}

// parseSemesterPlan, lisans/önlisans planının yarıyıl tablolarını çözer.
func (c *Client) parseSemesterPlan(ctx context.Context, body string, p Program, label string, planID int) (*Plan, error) {
	titles := h2Re.FindAllStringSubmatch(body, -1)
	tables := tableRe.FindAllStringSubmatch(body, -1)

	plan := &Plan{PlanID: planID, ProgramCode: p.Code, ProgramName: p.Name, Faculty: p.Faculty, Level: p.Level, PlanLabel: label, SourceURL: fmt.Sprintf("%s/%d", planDetailURL, planID)}
	// İlk h2 program adı başlığı, dönem başlıkları ondan sonra geliyor;
	// ilk tablo da genelde ders bilgisi kutusu değil doğrudan 1. dönem —
	// sayıyı eşleştirip taşarsa kırpıyoruz.
	titleOffset := 1
	n := len(tables)
	if len(titles)-titleOffset < n {
		n = len(titles) - titleOffset
	}
	for i := 0; i < n; i++ {
		title := clean(titles[i+titleOffset][1])
		if !strings.Contains(title, "Yarıyıl") && !strings.Contains(title, "Yıl") {
			break // "Akademik Takvim" gibi plan dışı başlıklara geldik
		}
		sem := Semester{Title: title}
		for _, row := range rowRe.FindAllStringSubmatch(tables[i][1], -1) {
			cells := cellRe.FindAllStringSubmatch(row[1], -1)
			if len(cells) < 2 {
				continue
			}
			v := make([]string, len(cells))
			for j, cc := range cells {
				v[j] = clean(cc[1])
			}
			if v[0] == "Ders Kodu" {
				continue
			}
			if v[0] == "Dersler" {
				grp := grupIDRe.FindStringSubmatch(row[1])
				if grp == nil {
					continue
				}
				opts, err := c.group(ctx, grp[1])
				if err != nil {
					return nil, err
				}
				sem.Items = append(sem.Items, Item{Elective: &Elective{
					Title: v[1], GroupID: grp[1], Credits: at(v, 4), Ects: parseEctsRange(at(v, 5)), Options: opts,
				}})
				continue
			}
			sem.Items = append(sem.Items, Item{Course: parseCourse(v, cells[0][1])})
		}
		if len(sem.Items) > 0 {
			plan.Semesters = append(plan.Semesters, sem)
		}
	}
	fillPlanTotals(plan, body)
	return plan, nil
}

// parseFlatPlan, yüksek lisans ve doktora programlarının tek düz tablosunu
// tek bir "dönem"e indirger. Bu programlarda dönem ayrımı yok — ders listesi
// tek tabloda duruyor ve seçmeli gruplar yine "Dersler" satırlarıyla geliyor.
func (c *Client) parseFlatPlan(ctx context.Context, body string, p Program, label string, planID int) (*Plan, error) {
	// Sayfada yardımcı tablolar da olabiliyor; en çok satırlı olanı ana liste
	// sayıyoruz.
	tables := tableRe.FindAllStringSubmatch(body, -1)
	var best string
	bestRows := -1
	for _, t := range tables {
		if n := len(rowRe.FindAllStringSubmatch(t[1], -1)); n > bestRows {
			best, bestRows = t[1], n
		}
	}
	if best == "" {
		return nil, fmt.Errorf("%s: plan tablosu bulunamadı", p.Code)
	}

	sem := Semester{Title: p.Name}
	for _, row := range rowRe.FindAllStringSubmatch(best, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) < 2 {
			continue
		}
		v := make([]string, len(cells))
		for j, cc := range cells {
			v[j] = clean(cc[1])
		}
		first := v[0]
		if first == "" || first == "Ders Kodu" {
			continue
		}
		if first == "Dersler" {
			grp := grupIDRe.FindStringSubmatch(row[1])
			if grp == nil {
				continue
			}
			opts, err := c.group(ctx, grp[1])
			if err != nil {
				return nil, err
			}
			sem.Items = append(sem.Items, Item{Elective: &Elective{
				Title: v[1], GroupID: grp[1], Credits: at(v, 4), Ects: parseEctsRange(at(v, 5)), Options: opts,
			}})
			continue
		}
		sem.Items = append(sem.Items, Item{Course: parseCourse(v, cells[0][1])})
	}

	plan := &Plan{PlanID: planID, ProgramCode: p.Code, ProgramName: p.Name, Faculty: p.Faculty, Level: p.Level, PlanLabel: label, SourceURL: fmt.Sprintf("%s/%d", planDetailURL, planID)}
	if len(sem.Items) > 0 {
		plan.Semesters = append(plan.Semesters, sem)
	}
	fillPlanTotals(plan, body)
	return plan, nil
}

// group, bir seçmeli slotun alternatiflerini çeker; aynı grup birden fazla
// programda geçebildiği için sonucu önbelleğe alıyoruz.
func (c *Client) group(ctx context.Context, id string) ([]Course, error) {
	c.mu.Lock()
	if opts, ok := c.groups[id]; ok {
		c.mu.Unlock()
		return opts, nil
	}
	c.mu.Unlock()

	body, err := c.f.Text(ctx, fmt.Sprintf("%s?grupId=%s", groupSearchURL, id))
	if err != nil {
		return nil, err
	}
	var opts []Course
	seenBranch := map[string]bool{}
	for _, row := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(row[1], -1)
		if len(cells) == 0 {
			continue
		}
		first := clean(cells[0][1])
		if first == "" || first == "Ders" {
			continue
		}
		// Kod hücresinde bağlantı varsa kanonik kodu oradan al (çift kod da olabilir);
		// yoksa "BRANŞ NUMARA Adı..." biçiminden kırp.
		code := canonicalCode(cells[0][1])
		if code == "" {
			parts := strings.Fields(first)
			if len(parts) >= 2 && branchOnlyRe.MatchString(parts[0]) && (parts[1][0] < '0' || parts[1][0] > '9') {
				// OBS bazı satırları numarasız basıyor ("CIN <br/> Çince I"):
				// o branşın herhangi bir dersi sayılır. Kod yalnız branş
				// ("CIN") olarak saklanır; istemci bunu branş joker'i okur.
				// Aynı branşın I, II, III… satırları tek joker seçenekte toplanır.
				if !seenBranch[parts[0]] {
					seenBranch[parts[0]] = true
					opts = append(opts, Course{Code: parts[0], Name: romanSuffixRe.ReplaceAllString(strings.Join(parts[1:], " "), "")})
				}
				continue
			}
			if len(parts) < 3 || parts[1][0] < '0' || parts[1][0] > '9' {
				// "BLG 337E Başlık..." biçiminde değilse atla.
				continue
			}
			code = parts[0] + " " + parts[1]
		}
		name := strings.TrimSpace(first)
		if code != "" {
			name = strings.TrimSpace(strings.Replace(first, code, "", 1))
		}
		opts = append(opts, Course{Code: code, Name: name})
	}

	c.mu.Lock()
	c.groups[id] = opts
	c.mu.Unlock()
	return opts, nil
}

// ScrapeAll, tüm programların müfredatını eşzamanlı çeker. Bu sayfaların
// yapısı OBS'nin diğer tablolarından daha az standart (5 yıllık programlar,
// hazırlık dönemleri, çift ana dal planları...); tek bir programın sayfası
// beklenmedik çıkarsa tüm taramayı düşürmek yerine o programı atlayıp
// loglamayı tercih ediyoruz.
func (c *Client) ScrapeAll(ctx context.Context, programs []Program, workers int, warn func(string, ...any)) ([]*Plan, error) {
	jobs := make(chan Program)
	type result struct {
		plan *Plan
		err  error
		code string
	}
	results := make(chan result)
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for p := range jobs {
				plan, err := c.plan(ctx, p, warn)
				results <- result{plan, err, p.Code}
			}
		}()
	}
	go func() {
		defer close(jobs)
		for _, p := range programs {
			select {
			case jobs <- p:
			case <-ctx.Done():
				return
			}
		}
	}()
	go func() { wg.Wait(); close(results) }()

	var plans []*Plan
	for r := range results {
		if r.err != nil {
			if warn != nil {
				warn("  %s atlandı: %v", r.code, r.err)
			}
			continue
		}
		if len(r.plan.Semesters) > 0 {
			plans = append(plans, r.plan)
		}
	}
	return plans, nil
}

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}

// at, satır vektörünün i. elemanını döndürür (taşarsa boş).
func at(v []string, i int) string {
	if i < len(v) {
		return v[i]
	}
	return ""
}

// num, "4,5" gibi Türkçe ondalık virgülü sayıya çevirir; boşsa 0.
func num(s string) float64 {
	s = strings.ReplaceAll(strings.TrimSpace(s), ",", ".")
	if s == "" {
		return 0
	}
	f, _ := strconv.ParseFloat(s, 64)
	return f
}

// parseCourse, plan tablosu satırından Course üretir. Kolonlar: kod, ad, dil,
// Z/S, kredi, AKTS, teo, uyg, lab, tür (Faz: Ders Planım). rawCodeCell ham kod
// hücresinin HTML'idir; tek kanonik kod oradan üretilir (çift kod sorunu).
func parseCourse(v []string, rawCodeCell string) *Course {
	code := canonicalCode(rawCodeCell)
	if code == "" {
		code = matchCode(at(v, 0))
	}
	return &Course{
		Code: code, Name: at(v, 1), Language: at(v, 2), Required: at(v, 3),
		Credits: num(at(v, 4)), Ects: num(at(v, 5)),
		Theory: int(num(at(v, 6))), Tutorial: int(num(at(v, 7))), Lab: int(num(at(v, 8))),
		Type: normType(at(v, 9)),
	}
}

// canonicalCode, ders kodu hücresinin HTML'inden TEK kanonik kod üretir. OBS aynı
// dersin İngilizce ve Türkçe kodlarını ayrı bağlantılar basar ("SAO 101E" + "SAO
// 101"); E sonekli (İngilizce) sürüm kanonik kabul edilir, yoksa ilk eşleşen alınır.
func canonicalCode(cellHTML string) string {
	var codes []string
	for _, m := range codeLinkRe.FindAllStringSubmatch(cellHTML, -1) {
		if c := matchCode(clean(m[1])); c != "" {
			codes = append(codes, c)
		}
	}
	if len(codes) == 0 {
		return matchCode(clean(cellHTML))
	}
	for _, c := range codes {
		if strings.HasSuffix(c, "E") {
			return c
		}
	}
	return codes[0]
}

// matchCode, bir metindeki "SAO 101E" kod kalıbını standart biçime ("SAO 101E")
// getirir; bulamazsa boş döner.
func matchCode(s string) string {
	m := codeRe.FindStringSubmatch(s)
	if m == nil {
		return ""
	}
	code := m[1] + " " + m[2]
	if m[3] != "" {
		code += "E"
	}
	return code
}

// normType, yalnızca gerçek ders türlerini bırakır. OBS önlisans planlarında tür
// kolonunda "Z"/"S" (zorunlu/seçmeli işareti) da geçiyor — bunlar tür değildir.
func normType(s string) string {
	t := strings.ToUpper(strings.TrimSpace(s))
	switch t {
	case "TB", "TM", "MT", "ITB", "EC":
		return t
	}
	return ""
}

// planTotals, sayfa altındaki "Toplam Kredi / Toplam AKTS" değerlerini çözer.
func planTotals(body string) (string, string) {
	g := func(re *regexp.Regexp) string {
		if m := re.FindStringSubmatch(body); m != nil {
			return m[1]
		}
		return ""
	}
	return g(totalKrediRe), g(totalEctsRe)
}

// fillPlanTotals, sayfa altı toplamlarını yazar; toplam 0/çözülemezse kalemlerden
// toplayıp "hesaplandı" işaretini koyar. OBS bazı programlarda (önlisans) AKTS
// toplamını kalemlerde AKTS olsa bile 0,00 basar — sıfır göstermek "bu planın
// AKTS'si yok" iddiasına dönüşmemeli.
func fillPlanTotals(plan *Plan, body string) {
	k, e := planTotals(body)
	plan.TotalCredits, plan.TotalEcts = k, e

	var cSum, eSum float64
	for _, sem := range plan.Semesters {
		for _, it := range sem.Items {
			switch {
			case it.Course != nil:
				cSum += it.Course.Credits
				eSum += it.Course.Ects
			case it.Elective != nil:
				if lo := slotCreditLo(it.Elective.Credits); lo > 0 {
					cSum += lo
				}
				if len(it.Elective.Ects) > 0 && it.Elective.Ects[0] > 0 {
					eSum += it.Elective.Ects[0]
				}
			}
		}
	}
	if num(k) == 0 && cSum > 0 {
		plan.TotalCredits = fmtTotal(cSum)
		plan.TotalCreditsComputed = true
	}
	if num(e) == 0 && eSum > 0 {
		plan.TotalEcts = fmtTotal(eSum)
		plan.TotalEctsComputed = true
	}
}

// slotCreditLo, seçmeli slot kredi aralığının ilk (varsayılan) değerini verir.
func slotCreditLo(s string) float64 {
	for _, p := range strings.FieldsFunc(strings.TrimSpace(s), func(r rune) bool { return r == '/' || r == '-' }) {
		if f := num(p); f > 0 {
			return f
		}
	}
	return 0
}

// fmtTotal, hesaplanan toplamı plan dosyası biçimine ("82,00") çevirir.
func fmtTotal(f float64) string {
	return strings.Replace(strconv.FormatFloat(f, 'f', 2, 64), ".", ",", 1)
}

// parseEctsRange, "4 / 5 / 6" aralığını sayı dizisine çevirir; tek değerse tek
// elemanlı dizi, boşsa nil.
func parseEctsRange(s string) []float64 {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	parts := strings.FieldsFunc(s, func(r rune) bool { return r == '/' || r == '-' })
	out := make([]float64, 0, len(parts))
	for _, p := range parts {
		out = append(out, num(p))
	}
	return out
}

// Count, verilen seviyedeki program sayısını döndürür.
func Count(programs []Program, level string) int {
	n := 0
	for _, p := range programs {
		if p.Level == level {
			n++
		}
	}
	return n
}
