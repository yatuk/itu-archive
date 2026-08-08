package fetch

import (
	"testing"
	"unicode/utf8"
)

// DecodeMixed, aynı belgede UTF-8 ve ISO-8859-9 baytlarını karışık kullanan
// takvim.sis.itu.edu.tr gibi sayfaları çözmeli.
func TestDecodeMixed(t *testing.T) {
	// Latin-5 baytları: ı=0xFD, İ=0xDD, ş=0xFE, ğ=0xF0.
	latin := []byte{'A', 0xFD, 0xDD, 0xFE, 0xF0, 'B'}          // "AıİşğB"
	utf8 := []byte("Eğitim")                                     // saf UTF-8
	got := DecodeMixed(append(append([]byte{}, latin...), utf8...))
	want := "AıİşğBEğitim"
	if got != want {
		t.Errorf("DecodeMixed = %q, want %q", got, want)
	}
}

func TestDecodeMixedPureUTF8(t *testing.T) {
	in := "Üniversite öğrencileri şş ıı"
	if got := DecodeMixed([]byte(in)); got != in {
		t.Errorf("saf UTF-8 bozuldu: %q != %q", got, in)
	}
}

func TestDecodeMixedRejectsC1Control(t *testing.T) {
	// 0xC2 0x9F, UTF-8'de U+009F (C1 kontrol) üretir; plausible() bunu gerçek
	// metin saymamalı, iki bayt ayrı ayrı Latin-1 olarak yazılmalı (Â + kontrol).
	got := DecodeMixed([]byte{0xC2, 0x9F})
	if utf8.RuneCountInString(got) != 2 {
		t.Errorf("C1 kontrol tek rune olarak tüketilmemeli: %q", got)
	}
	if []rune(got)[0] != 'Â' {
		t.Errorf("ilk bayt Latin-1 olarak Â okunmalı: %q", got)
	}
}
