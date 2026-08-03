// Package term, dönem etiketlerini dosya sistemi ve URL için güvenli
// slug'lara çevirir.
package term

import "strings"

// Slug, İTÜ'nün etiket biçimini kısaltır:
// "2025-2026 Güz Dönemi" -> "2025-2026-guz"
func Slug(label string) string {
	s := strings.ToLower(strings.TrimSpace(label))
	s = strings.NewReplacer(
		"ı", "i", "İ", "i", "ş", "s", "Ş", "s", "ğ", "g", "Ğ", "g",
		"ü", "u", "Ü", "u", "ö", "o", "Ö", "o", "ç", "c", "Ç", "c",
	).Replace(s)
	s = strings.ReplaceAll(s, "dönemi", "")
	s = strings.ReplaceAll(s, "donemi", "")
	var b strings.Builder
	lastDash := false
	for _, r := range s {
		switch {
		case (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9'):
			b.WriteRune(r)
			lastDash = false
		default:
			if !lastDash && b.Len() > 0 {
				b.WriteByte('-')
				lastDash = true
			}
		}
	}
	return strings.Trim(b.String(), "-")
}

// SortKey, dönemleri kronolojik sıralamak için karşılaştırılabilir bir anahtar
// üretir ("2025-2026-guz" -> "2025-1"). Sıra: Güz < Bahar < Yaz.
func SortKey(slug string) string {
	parts := strings.SplitN(slug, "-", 3)
	if len(parts) < 3 {
		return slug
	}
	order := map[string]string{"guz": "1", "bahar": "2", "yaz": "3"}
	o, ok := order[parts[2]]
	if !ok {
		o = "9"
	}
	return parts[0] + "-" + o
}
