package yatay

import (
	"regexp"
	"strings"
)

// ArchiveProgram, docs/data/programs.json'daki tek bir kayıt (yalnızca eşleme
// için gereken alanlar).
type ArchiveProgram struct {
	Code  string `json:"code"`
	Name  string `json:"name"`
	Level int    `json:"level"`
}

var (
	englishPctRe  = regexp.MustCompile(`\(\s*%\s*(\d+)\s*İngilizce\s*\)`)
	uolpRe        = regexp.MustCompile(`\(İngilizce\)\s*UOLP.*$`)
	kktcSuffixRe  = regexp.MustCompile(`\s*\(KKTC\)\s*$`)
	spaceRe       = regexp.MustCompile(`\s+`)
	archiveTailRe = regexp.MustCompile(`\s*\(İngilizce\)\s*|\s*Lisans\s*$`)
)

var foldReplacer = strings.NewReplacer(
	"ı", "i", "İ", "i", "I", "i", "ş", "s", "Ş", "s", "ğ", "g", "Ğ", "g",
	"ü", "u", "Ü", "u", "ö", "o", "Ö", "o", "ç", "c", "Ç", "c",
)

func fold(s string) string {
	s = foldReplacer.Replace(strings.ToLower(s))
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}

// baseAliases, yatay geçiş sayfalarındaki program adıyla programs.json'daki
// resmî ad arasındaki gerçek yazım farklarını düzeltir (dilbilgisi eki farkı,
// tek/çift kelime farkı) — kısaltma/dil eki soyulduktan, katlandıktan SONRA
// uygulanır. Küçük ve elle doğrulanmış: 62 benzersiz yatay adının tamamı bu
// tabloyla veya doğrudan katlanmış eşleşmeyle çözülüyor (bkz. match_test.go).
var baseAliases = map[string]string{
	fold("Şehir ve Bölge Planlaması"):                    fold("Şehir ve Bölge Planlama"),
	fold("Gemi İnşaatı ve Gemi Makineleri Mühendisliği"): fold("Gemi İnşaatı ve Gemi Makinaları Mühendisliği"),
	fold("Gemi İnşaatı ve Gemi Makineleri Müh."):         fold("Gemi İnşaatı ve Gemi Makinaları Mühendisliği"),
	fold("Petrol ve Doğalgaz Mühendisliği"):              fold("Petrol ve Doğal Gaz Mühendisliği"),
	// Bölüm adı değişti: eski yıllarda "Kontrol Mühendisliği", sonradan
	// "Kontrol ve Otomasyon Mühendisliği" oldu — aynı program, aynı kod.
	fold("Kontrol Mühendisliği"): fold("Kontrol ve Otomasyon Mühendisliği"),
	// Kaynak sayfadaki yazım hatası ("Tasarımyı" → "Tasarımı").
	fold("Endüstri Ürünleri Tasarımyı"): fold("Endüstri Ürünleri Tasarımı"),
}

// splitLanguage, yatay geçiş sayfasındaki program adından "(% NN İngilizce)"
// ibaresini ayıklar. isEnglish nil ise ad hiç dil eki taşımıyordu (bazı
// müzik/sanat programları gibi tek şubeli) — çağıran taraf bu durumda tek
// aday varsa onu kullanır.
func splitLanguage(raw string) (base string, isEnglish *bool, isKKTC, isUOLP bool) {
	s := raw
	if strings.HasPrefix(s, "İTÜ-KKTC ") {
		isKKTC = true
		s = strings.TrimPrefix(s, "İTÜ-KKTC ")
	}
	if kktcSuffixRe.MatchString(s) {
		isKKTC = true
		s = kktcSuffixRe.ReplaceAllString(s, "")
	}
	if uolpRe.MatchString(s) {
		isUOLP = true
		s = uolpRe.ReplaceAllString(s, "")
	}
	if m := englishPctRe.FindStringSubmatch(s); m != nil {
		v := m[1] == "100"
		isEnglish = &v
		s = englishPctRe.ReplaceAllString(s, "")
	}
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " ")), isEnglish, isKKTC, isUOLP
}

// archiveIndex, foldlanmış temel ada göre (İngilizce mi değil mi) kodu bulur.
type archiveIndex map[string]map[bool]string

// buildArchiveIndex, programs.json kayıtlarından (yalnızca lisans, KKTC/UOLP/
// ikinci öğretim hariç — bkz. paket yorumu) bir arama tablosu kurar.
func buildArchiveIndex(programs []ArchiveProgram) archiveIndex {
	idx := archiveIndex{}
	for _, p := range programs {
		if p.Level != 2 {
			continue
		}
		if strings.Contains(p.Name, "KKTC") || strings.Contains(p.Name, "UOLP") ||
			strings.Contains(p.Name, "kinci Öğretim") || strings.Contains(p.Name, "(TAU)") {
			continue
		}
		isEng := strings.Contains(p.Name, "(İngilizce)")
		base := fold(archiveTailRe.ReplaceAllString(p.Name, ""))
		if idx[base] == nil {
			idx[base] = map[bool]string{}
		}
		idx[base][isEng] = p.Code
	}
	return idx
}

// MatchPrograms, her Result'a (kopyalarını değiştirmeden) eşleşen arşiv
// program kodunu ekler. KKTC ve UOLP hedefli kayıtlar kasıtlı olarak
// eşlenmeden bırakılıyor — bu programlar ana kampüs müfredat/önşart
// verisinde yok, yanlış bir kod bağlamak sessiz bir veri hatası olurdu.
// "Ses Eğitimi" gibi dil eki taşımayan ama birden fazla adayı olan adlar da
// aynı sebeple boş bırakılır (bkz. archiveIndex'te SES_LS/SES_TH_LS/SES_TS_LS).
func MatchPrograms(results []Result, programs []ArchiveProgram) []Result {
	idx := buildArchiveIndex(programs)
	out := make([]Result, len(results))
	for i, r := range results {
		out[i] = r
		out[i].ProgramCode = matchOne(idx, r.Program)
	}
	return out
}

func matchOne(idx archiveIndex, raw string) string {
	base, isEnglish, isKKTC, isUOLP := splitLanguage(raw)
	if isKKTC || isUOLP {
		return ""
	}
	key := fold(base)
	if alias, ok := baseAliases[key]; ok {
		key = alias
	}
	byLang, ok := idx[key]
	if !ok {
		return ""
	}
	if isEnglish != nil {
		if code, ok := byLang[*isEnglish]; ok {
			return code
		}
		// Yatay sayfası dil oranı belirtmiş ama arşivde o dilde ayrı bir kod
		// yok (ör. Uçak Mühendisliği'nin tek kodu var) — tek adaysa onu kullan.
		if len(byLang) == 1 {
			for _, code := range byLang {
				return code
			}
		}
		return ""
	}
	// Yatay adı dil eki taşımıyor: yalnızca tek aday varsa güvenli.
	if len(byLang) == 1 {
		for _, code := range byLang {
			return code
		}
	}
	return ""
}
