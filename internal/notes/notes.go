// Package notes, Not Kutusu kayıtlarını okur, doğrular ve yazar.
//
// Not Kutusu arşivin dışarıdan yazma kabul eden ilk parçası. Tasarım kararı:
// DOSYA BARINDIRILMAZ, yalnızca bağlantı ve üstveri tutulur. Sebepleri:
//
//   - Alan: GitHub Pages yayımlanan siteyi 1 GB ile sınırlıyor, docs/ zaten
//     269 MB. Taranmış bir PDF 3-15 MB; yüz not bile sığmaz.
//   - Kalıcılık: git'te binary silmek geçmişten silmez. Yanlış yüklenen bir
//     dosya, geçmiş yeniden yazılmadan geri alınamaz — bir arşivde yapılacak
//     en son şey.
//   - Kaldırma: telif talebine cevap tek JSON satırı silmek olur.
//
// Katkı akışı sunucusuz: GitHub issue formu -> bu paketin ayrıştırıcısı ->
// doğrulama -> docs/data/notes/<BRANŞ>.json. Moderasyon, PR incelemesidir.
package notes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"itu-scraper/internal/model"
)

// Dir, notes verisinin docs kökü altındaki yolu.
func Dir(root string) string { return filepath.Join(root, "data", "notes") }

// BranchPath, bir branşın kayıt dosyası.
func BranchPath(root, branch string) string {
	return filepath.Join(Dir(root), strings.ToUpper(branch)+".json")
}

// IndexPath, kapsam özeti.
func IndexPath(root string) string { return filepath.Join(Dir(root), "index.json") }

// LoadBranch, bir branşın kayıtlarını okur. Dosya yoksa boş dilim döner —
// ilk katkı öncesi durum hata değildir.
func LoadBranch(root, branch string) ([]model.Note, error) {
	b, err := os.ReadFile(BranchPath(root, branch))
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var out []model.Note
	if err := json.Unmarshal(b, &out); err != nil {
		return nil, fmt.Errorf("%s okunamadı: %w", BranchPath(root, branch), err)
	}
	return out, nil
}

// SaveBranch, kayıtları kararlı sırayla yazar (ders kodu, sonra ID): git diff'i
// "hangi not eklendi" sorusuna okunabilir cevap versin, sıra oynamasın.
func SaveBranch(root, branch string, list []model.Note) error {
	sort.SliceStable(list, func(i, j int) bool {
		if list[i].Code != list[j].Code {
			return list[i].Code < list[j].Code
		}
		return list[i].ID < list[j].ID
	})
	if err := os.MkdirAll(Dir(root), 0o755); err != nil {
		return err
	}
	b, err := json.MarshalIndent(list, "", " ")
	if err != nil {
		return err
	}
	return os.WriteFile(BranchPath(root, branch), append(b, '\n'), 0o644)
}

// LoadAll, tüm branş dosyalarını okur.
func LoadAll(root string) ([]model.Note, error) {
	entries, err := os.ReadDir(Dir(root))
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var out []model.Note
	for _, e := range entries {
		name := e.Name()
		if e.IsDir() || !strings.HasSuffix(name, ".json") || name == "index.json" {
			continue
		}
		list, err := LoadBranch(root, strings.TrimSuffix(name, ".json"))
		if err != nil {
			return nil, err
		}
		out = append(out, list...)
	}
	return out, nil
}

// WriteIndex, kapsam özetini üretir (site "kaç not var" diyebilsin).
func WriteIndex(root string, all []model.Note, now time.Time) error {
	idx := model.NotesIndex{
		GeneratedAt: now.UTC().Format(time.RFC3339),
		Notes:       len(all),
		ByBranch:    map[string]int{},
	}
	courses := map[string]struct{}{}
	for _, n := range all {
		idx.ByBranch[n.Branch]++
		courses[n.Code] = struct{}{}
		if n.Dead {
			idx.Dead++
		}
	}
	idx.Branches = len(idx.ByBranch)
	idx.Courses = len(courses)
	if err := os.MkdirAll(Dir(root), 0o755); err != nil {
		return err
	}
	b, err := json.MarshalIndent(idx, "", " ")
	if err != nil {
		return err
	}
	return os.WriteFile(IndexPath(root), append(b, '\n'), 0o644)
}

/* ---------- doğrulama ---------- */

var (
	codeRe  = regexp.MustCompile(`^[A-ZÇĞİÖŞÜ]{2,5} [0-9]{3,4}[A-Z]{0,2}$`)
	slugSub = regexp.MustCompile(`[^a-z0-9]+`)
)

// NormalizeCode, "blg102e" / "BLG  102E" gibi girdileri "BLG 102E"ye çeker.
// Türkçe büyütme tuzağına düşmemek için ASCII kuralı uygulanır (i -> I).
func NormalizeCode(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}
	up := strings.Map(func(r rune) rune {
		switch r {
		case 'i':
			return 'İ'
		case 'ı':
			return 'I'
		}
		return []rune(strings.ToUpper(string(r)))[0]
	}, s)
	up = strings.Join(strings.Fields(up), " ")
	// "BLG102E" -> "BLG 102E"
	if !strings.Contains(up, " ") {
		if m := regexp.MustCompile(`^([A-ZÇĞİÖŞÜ]{2,5})([0-9].*)$`).FindStringSubmatch(up); m != nil {
			up = m[1] + " " + m[2]
		}
	}
	return up
}

// CodeSlug, ders kodundan URL/ID güvenli parça üretir: "BLG 102E" -> "blg-102e".
// site.courseSlug ile aynı sonucu vermeli — bağlantılar eşleşsin.
func CodeSlug(code string) string {
	s := strings.ToLower(code)
	s = strings.NewReplacer("ç", "c", "ğ", "g", "ı", "i", "İ", "i", "ö", "o", "ş", "s", "ü", "u").Replace(s)
	s = slugSub.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// Validate, tek bir kaydı denetler. known nil değilse ders kodunun arşivde
// gerçekten var olduğu da doğrulanır (uydurma koda not eklenmesin).
func Validate(n model.Note, known map[string]struct{}) error {
	if !codeRe.MatchString(n.Code) {
		return fmt.Errorf("ders kodu biçimi geçersiz: %q (örn. \"BLG 102E\")", n.Code)
	}
	if known != nil {
		if _, ok := known[n.Code]; !ok {
			return fmt.Errorf("ders kodu arşivde yok: %q", n.Code)
		}
	}
	if strings.TrimSpace(n.Title) == "" {
		return fmt.Errorf("başlık boş")
	}
	if len([]rune(n.Title)) > 120 {
		return fmt.Errorf("başlık çok uzun (%d karakter, en fazla 120)", len([]rune(n.Title)))
	}
	u, err := url.Parse(strings.TrimSpace(n.URL))
	if err != nil || u.Host == "" {
		return fmt.Errorf("bağlantı çözümlenemedi: %q", n.URL)
	}
	if u.Scheme != "https" {
		return fmt.Errorf("bağlantı https olmalı: %q", n.URL)
	}
	if !contains(model.NoteKinds, n.Kind) {
		return fmt.Errorf("tür geçersiz: %q (%s)", n.Kind, strings.Join(model.NoteKinds, ", "))
	}
	// Lisans beyanı zorunlu: telif ayrımını kural olarak değil veri modeli
	// olarak zorlamanın tek yolu bu.
	if !contains(model.NoteLicenses, n.License) {
		return fmt.Errorf("lisans geçersiz: %q (%s)", n.License, strings.Join(model.NoteLicenses, ", "))
	}
	if n.Language != "" && n.Language != "tr" && n.Language != "en" {
		return fmt.Errorf("dil geçersiz: %q (tr | en)", n.Language)
	}
	if len([]rune(n.Contributor)) > 40 {
		return fmt.Errorf("katkıcı adı çok uzun")
	}
	return nil
}

func contains(list []string, v string) bool {
	for _, x := range list {
		if x == v {
			return true
		}
	}
	return false
}

// HostOf, bağlantının görünen ana bilgisayarı ("www." atılır). Kullanıcı
// tıklamadan önce nereye gideceğini görsün diye kayda yazılır.
func HostOf(raw string) string {
	u, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return ""
	}
	return strings.TrimPrefix(strings.ToLower(u.Hostname()), "www.")
}

// NextID, aynı ders için sıradaki kararlı kimliği üretir: blg-102e-01.
// Silinen kayıtların kimliği yeniden KULLANILMAZ (en büyük sayıdan devam) —
// eski paylaşılmış bağlantılar başka bir nota düşmesin.
func NextID(code string, existing []model.Note) string {
	prefix := CodeSlug(code) + "-"
	max := 0
	for _, n := range existing {
		if !strings.HasPrefix(n.ID, prefix) {
			continue
		}
		if v, err := strconv.Atoi(strings.TrimPrefix(n.ID, prefix)); err == nil && v > max {
			max = v
		}
	}
	return fmt.Sprintf("%s%02d", prefix, max+1)
}

// Duplicate, aynı URL'in aynı ders altında zaten kayıtlı olup olmadığını söyler.
func Duplicate(list []model.Note, code, rawURL string) bool {
	want := strings.TrimRight(strings.TrimSpace(rawURL), "/")
	for _, n := range list {
		if n.Code == code && strings.TrimRight(n.URL, "/") == want {
			return true
		}
	}
	return false
}

/* ---------- issue formu ayrıştırma ---------- */

// GitHub issue formu gövdeyi "### Alan\n\ndeğer" blokları olarak render eder;
// boş bırakılan opsiyonel alanlar "_No response_" gelir. Üçüncü taraf bir
// action eklemek yerine burada ayrıştırılıyor: test edilebilir ve depoda kalır.
var issueField = regexp.MustCompile(`(?m)^###[ \t]+(.+?)[ \t]*$`)

// ParseIssueBody, issue gövdesini alan haritasına çevirir. Anahtarlar
// küçültülmüş başlıklardır.
func ParseIssueBody(body string) map[string]string {
	body = strings.ReplaceAll(body, "\r\n", "\n")
	out := map[string]string{}
	locs := issueField.FindAllStringSubmatchIndex(body, -1)
	for i, loc := range locs {
		label := strings.TrimSpace(body[loc[2]:loc[3]])
		start := loc[1]
		end := len(body)
		if i+1 < len(locs) {
			end = locs[i+1][0]
		}
		val := strings.TrimSpace(body[start:end])
		if val == "_No response_" || val == "_Yanıt yok_" {
			val = ""
		}
		out[strings.ToLower(label)] = val
	}
	return out
}

// FromIssue, ayrıştırılmış alanlardan bir Note kurar. ID ve AddedAt burada
// atanmaz — çağıran mevcut listeye göre verir.
func FromIssue(fields map[string]string) model.Note {
	get := func(keys ...string) string {
		for _, k := range keys {
			if v, ok := fields[k]; ok && v != "" {
				return v
			}
		}
		return ""
	}
	raw := get("bağlantı", "baglanti", "link", "url")
	n := model.Note{
		Code:        NormalizeCode(get("ders kodu", "kod", "course code")),
		Title:       get("başlık", "baslik", "title"),
		URL:         strings.TrimSpace(raw),
		Host:        HostOf(raw),
		Kind:        normalizeChoice(get("tür", "tur", "kind")),
		License:     normalizeLicense(get("lisans", "license")),
		Term:        get("dönem", "donem", "term"),
		Instructor:  get("öğretim üyesi", "ogretim uyesi", "hoca", "instructor"),
		Language:    normalizeLang(get("dil", "language")),
		Contributor: get("takma ad", "katkıcı", "contributor"),
	}
	n.Branch = branchOf(n.Code)
	return n
}

func branchOf(code string) string {
	if i := strings.IndexByte(code, ' '); i > 0 {
		return code[:i]
	}
	return ""
}

// longestPrefix, adayları UZUNDAN KISAYA deneyerek eşleştirir.
//
// Sırayla denemek sessiz bir hataya yol açıyordu: "CC-BY-SA · ..." değeri
// listedeki "CC-BY" ile önce eşleşiyor ve katkıcının seçtiği ShareAlike şartı
// kaydedilirken DÜŞÜYORDU. Lisansı yanlış kaydetmek bu özellikteki en pahalı
// hata türü — en uzun eşleşme kuralı bunu yapısal olarak engeller.
func longestPrefix(v string, cands []string) (string, bool) {
	best, found := "", false
	for _, c := range cands {
		if strings.HasPrefix(v, c) && len(c) > len(best) {
			best, found = c, true
		}
	}
	return best, found
}

// Açılır liste değerleri formda "ozet · ders özeti" gibi açıklamalı gelebilir;
// anahtar baştaki sözcüktür.
func normalizeChoice(v string) string {
	v = strings.TrimSpace(strings.ToLower(v))
	if k, ok := longestPrefix(v, model.NoteKinds); ok {
		return k
	}
	return v
}

func normalizeLicense(v string) string {
	v = strings.ToUpper(strings.TrimSpace(v))
	if l, ok := longestPrefix(v, model.NoteLicenses); ok {
		return l
	}
	return v
}

func normalizeLang(v string) string {
	v = strings.ToLower(strings.TrimSpace(v))
	switch {
	case strings.HasPrefix(v, "tr"), strings.HasPrefix(v, "türkçe"), strings.HasPrefix(v, "turkce"):
		return "tr"
	case strings.HasPrefix(v, "en"), strings.HasPrefix(v, "ingilizce"):
		return "en"
	}
	return ""
}

/* ---------- bağlantı denetimi ---------- */

// CheckResult, tek bir bağlantının denetim sonucu.
type CheckResult struct {
	ID    string
	Alive bool
	Code  int
}

// Check, bağlantıya HEAD atar; HEAD desteklenmiyorsa (405/501) GET'e düşer.
// Drive/OneDrive gibi servisler yönlendirme yapar, yönlendirme izlenir.
//
// Ölü işaretlemesi muhafazakârdır: yalnızca 404/410 gibi kalıcı durumlar ölü
// sayılır. Geçici hata (ağ, 5xx, zaman aşımı) kaydı bozmaz — arşivin "sessizce
// yanlış veri yazmaktansa dokunma" ilkesi.
func Check(ctx context.Context, cl *http.Client, rawURL string) CheckResult {
	do := func(method string) (int, error) {
		req, err := http.NewRequestWithContext(ctx, method, rawURL, nil)
		if err != nil {
			return 0, err
		}
		req.Header.Set("User-Agent", "itu-archive-notes-linkcheck/1.0 (+https://itu-ders.com)")
		resp, err := cl.Do(req)
		if err != nil {
			return 0, err
		}
		defer resp.Body.Close()
		return resp.StatusCode, nil
	}
	code, err := do(http.MethodHead)
	if err != nil {
		return CheckResult{Alive: true} // geçici hata: dokunma
	}
	if code == http.StatusMethodNotAllowed || code == http.StatusNotImplemented || code == http.StatusForbidden {
		if c2, err2 := do(http.MethodGet); err2 == nil {
			code = c2
		}
	}
	return CheckResult{Alive: !permanentlyGone(code), Code: code}
}

// permanentlyGone, yalnızca kalıcı yokluk durumları.
func permanentlyGone(code int) bool {
	return code == http.StatusNotFound || code == http.StatusGone
}
