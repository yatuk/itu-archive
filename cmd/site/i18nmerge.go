package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// Dil sözlükleri assets-src/i18n/<dil>.js dosyalarındadır ve tarayıcı yalnız
// etkin dilinkini yükler. Eskiden iki dil tek dosyadaydı ve t() eksik ya da boş
// İngilizce anahtarı Türkçeye düşürüyordu (`en[k] || tr[k] || k`). Türkçe
// sözlük artık İngilizce kipte yüklenmediği için bu düşüş derleme zamanında
// yapılır: derlenen en.js, İngilizcede olmayan ya da boş bırakılan her anahtar
// için tr.js'teki değeri taşır. Kaynaktaki en.js elle yazıldığı gibi kalır.

const (
	i18nBaseDict     = "i18n/tr.js" // düşülen (varsayılan) dil
	i18nFallbackDict = "i18n/en.js" // eksikleri tabandan tamamlanan dil
)

// i18nEntryRE, sözlükteki tek satırlık `anahtar: 'metin',` girdisidir.
// 1: anahtar, 2: tırnaklı metin (kaçışlar dahil, olduğu gibi).
var i18nEntryRE = regexp.MustCompile(`^\s*([A-Za-z_$][\w$]*)\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$`)

type i18nEntry struct {
	key, literal string
	line         int // 0 tabanlı satır
}

type i18nDict struct {
	lines   []string
	entries []i18nEntry
	byKey   map[string]int // anahtar → entries içindeki son girdi (JS'te son yazan kazanır)
	close   int            // kapanış `};` satırı
}

// parseI18nDict, `export default { ... };` biçimindeki sözlüğü okur. Gövdede
// girdi, yorum ya da boş satır dışında bir şey varsa hata verir: birleştirme
// yalnız tanıdığı biçime güvenir, sessizce yanlış sözlük üretmez.
func parseI18nDict(name string, src []byte) (*i18nDict, error) {
	text := strings.ReplaceAll(string(src), "\r\n", "\n")
	d := &i18nDict{lines: strings.Split(text, "\n"), byKey: map[string]int{}, close: -1}
	open := -1
	for i, l := range d.lines {
		s := strings.TrimSpace(l)
		switch {
		case open < 0:
			if s == "export default {" {
				open = i
			} else if s != "" && !strings.HasPrefix(s, "//") {
				return nil, fmt.Errorf("%s:%d: sözlük `export default {` ile başlamalı", name, i+1)
			}
		case d.close < 0:
			if s == "};" {
				d.close = i
				continue
			}
			if s == "" || strings.HasPrefix(s, "//") {
				continue
			}
			m := i18nEntryRE.FindStringSubmatch(l)
			if m == nil {
				return nil, fmt.Errorf("%s:%d: tanınmayan sözlük satırı (beklenen `anahtar: 'metin',`): %s", name, i+1, s)
			}
			if !strings.HasSuffix(strings.TrimSpace(l), ",") {
				return nil, fmt.Errorf("%s:%d: sözlük girdisi virgülle bitmeli", name, i+1)
			}
			d.byKey[m[1]] = len(d.entries)
			d.entries = append(d.entries, i18nEntry{key: m[1], literal: m[2], line: i})
		default:
			if s != "" && !strings.HasPrefix(s, "//") {
				return nil, fmt.Errorf("%s:%d: sözlük kapanışından sonra beklenmeyen içerik", name, i+1)
			}
		}
	}
	if open < 0 || d.close < 0 {
		return nil, fmt.Errorf("%s: `export default { ... };` bulunamadı", name)
	}
	return d, nil
}

// emptyLiteral, JS'te yanlış (falsy) olan tek metin değerini, boş metni tanır.
func emptyLiteral(lit string) bool { return lit == "''" || lit == `""` }

// mergeI18nFallback, fb sözlüğünü base'teki değerlerle tamamlar: fb'de boş
// olan anahtarın metni base'tekiyle değişir, fb'de hiç olmayan anahtar kapanıştan
// önce eklenir. Sonuçtaki her anahtarın değeri eski `fb[k] || base[k]` değeridir.
func mergeI18nFallback(base, fb []byte) ([]byte, error) {
	b, err := parseI18nDict(i18nBaseDict, base)
	if err != nil {
		return nil, err
	}
	f, err := parseI18nDict(i18nFallbackDict, fb)
	if err != nil {
		return nil, err
	}
	lines := append([]string(nil), f.lines...)
	for key, idx := range f.byKey {
		e := f.entries[idx]
		bi, ok := b.byKey[key]
		if !ok || !emptyLiteral(e.literal) {
			continue
		}
		lines[e.line] = "  " + key + ": " + b.entries[bi].literal + ","
	}
	var missing []string
	seen := map[string]bool{}
	for _, e := range b.entries {
		if _, ok := f.byKey[e.key]; ok || seen[e.key] {
			continue
		}
		seen[e.key] = true
		missing = append(missing, "  "+e.key+": "+b.entries[b.byKey[e.key]].literal+",")
	}
	if len(missing) > 0 {
		tail := append(append([]string(nil), missing...), lines[f.close:]...)
		lines = append(lines[:f.close], tail...)
	}
	return []byte(strings.Join(lines, "\n")), nil
}

// i18nSourceFor, küçültmeden önce bir asset kaynağını hazırlar: düşen dilin
// sözlüğü taban sözlükle tamamlanır, diğer dosyalar olduğu gibi döner.
func i18nSourceFor(srcDir, rel string, in []byte) ([]byte, error) {
	if filepath.ToSlash(rel) != i18nFallbackDict {
		return in, nil
	}
	base, err := os.ReadFile(filepath.Join(srcDir, filepath.FromSlash(i18nBaseDict)))
	if err != nil {
		return nil, fmt.Errorf("%s okunamadı: %w", i18nBaseDict, err)
	}
	return mergeI18nFallback(base, in)
}
