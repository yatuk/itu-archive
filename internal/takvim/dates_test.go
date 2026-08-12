package takvim

import (
	"strings"
	"testing"
)

func TestParseTRDate(t *testing.T) {
	tests := []struct {
		in     string
		want   string // ISO
		wantOK bool
	}{
		{"09 Temmuz 2026", "2026-07-09", true},
		{"1 Ocak 2026", "2026-01-01", true},
		{"31 Aralık 2026", "2026-12-31", true},
		{"15 Ağustos 2026", "2026-08-15", true},
		{"29 Şubat 2024", "2024-02-29", true}, // artık yıl
		{"29 Şubat 2025", "", false},          // artık yıl değil — round-trip yakalar
		{"32 Ocak 2026", "", false},           // taşan gün
		{"0 Mayıs 2026", "", false},           // gün 0
		{"09 Temmuz", "", false},              // yıl yok
		{"09 Xyz 2026", "", false},            // bilinmeyen ay
		{"", "", false},
		{"  09 Temmuz 2026  ", "2026-07-09", true},
	}
	for _, tt := range tests {
		d, ok := parseTRDate(tt.in)
		if ok != tt.wantOK {
			t.Errorf("parseTRDate(%q) ok=%v, want %v", tt.in, ok, tt.wantOK)
			continue
		}
		if ok && d.Format("2006-01-02") != tt.want {
			t.Errorf("parseTRDate(%q) = %s, want %s", tt.in, d.Format("2006-01-02"), tt.want)
		}
	}
}

func TestParseTRRange(t *testing.T) {
	tests := []struct {
		in        string
		wantStart string
		wantEnd   string
		wantOK    bool
	}{
		{"09 Temmuz 2026", "2026-07-09", "2026-07-09", true},                // tek tarih
		{"24 - 26 Ağustos 2026", "2026-08-24", "2026-08-26", true},          // aynı ay
		{"28 Ağustos - 01 Eylül 2023", "2023-08-28", "2023-09-01", true},    // ay değişir
		{"29 Aralık 2025 - 02 Ocak 2026", "2025-12-29", "2026-01-02", true}, // yıl değişir
		{"07 - 09 Eylül 2026 23:59", "2026-09-07", "2026-09-09", true},      // kapanış saati soneki
		{"09 Temmuz 2026 17:00", "2026-07-09", "2026-07-09", true},          // tek tarih + saat
		{"28 Eylül 10:00 - 02 Ekim 2026 17:00", "2026-09-28", "2026-10-02", true}, // gömülü saat + yalnız 2. tarihte yıl
		{"02 Kasım 2026 09:00 - 02 Şubat 2027 17:00", "2026-11-02", "2027-02-02", true}, // iki tarihte de yıl + saat
		{"30 Eylül 2026-15:30", "2026-09-30", "2026-09-30", true},           // tireyle bitişik saat
		{"26 - 28 Ağustos 2026", "2026-08-26", "2026-08-28", true},
		{"32 Ocak 2026", "", "", false}, // taşan gün
		{"boş", "", "", false},
		{"", "", "", false},
		{"26 - 24 Ağustos 2026", "", "", false}, // ters sıra — geçerli değil
	}
	for _, tt := range tests {
		start, end, ok := ParseTRRange(tt.in)
		if ok != tt.wantOK {
			t.Errorf("ParseTRRange(%q) ok=%v, want %v", tt.in, ok, tt.wantOK)
			continue
		}
		if ok && (start != tt.wantStart || end != tt.wantEnd) {
			t.Errorf("ParseTRRange(%q) = %s/%s, want %s/%s", tt.in, start, end, tt.wantStart, tt.wantEnd)
		}
	}
}

func TestAddISODates(t *testing.T) {
	in := `{"year":"X","yearId":"854","scrapedAt":"2026-08-12T13:55:35Z","events":[
		{"table":"Güz","title":"A","date":"24 - 26 Ağustos 2026","remaining":"1 gün kaldı"},
		{"table":"Güz","title":"B","date":"çözülemez","remaining":"x"}]}`
	out, err := AddISODates([]byte(in))
	if err != nil {
		t.Fatal(err)
	}
	s := string(out)
	if !strings.Contains(s, `"start": "2026-08-24"`) || !strings.Contains(s, `"end": "2026-08-26"`) {
		t.Errorf("aralık tarihine start/end yazılmadı:\n%s", s)
	}
	// Çözülemeyen etkinlik içerik kaybetmeden kalmalı, start/end boş.
	if !strings.Contains(s, `"title": "B"`) || !strings.Contains(s, `"date": "çözülemez"`) {
		t.Errorf("çözülemeyen etkinlik kayboldu:\n%s", s)
	}
	if strings.Contains(s, `"start": ""`) {
		t.Errorf("boş start alanı yazılmamalı (omitempty):\n%s", s)
	}

	// Değişiklik yoksa girdi aynen dönmeli (deterministik diff).
	same, err := AddISODates(out)
	if err != nil {
		t.Fatal(err)
	}
	if string(same) != string(out) {
		t.Error("ikinci çağrı değişiklik üretti — deterministik değil")
	}
}

func TestAddISODatesMalformed(t *testing.T) {
	if _, err := AddISODates([]byte("{")); err == nil {
		t.Error("çözümlenemez JSON hata dönmeli")
	}
}
