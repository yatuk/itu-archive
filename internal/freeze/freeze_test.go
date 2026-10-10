package freeze

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

const addDrop = "Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse Yazılma"

// 854.json'daki gerçek durum: iki ekle-bırak satırı da "Güz Dönemi" tablosunda.
var cal2026 = []Event{
	{Title: "Güz Yarıyılı Cezalı Kayıt Yenilemesi", Start: "2026-09-28", End: "2026-10-02"},
	{Title: addDrop, Start: "2026-09-28", End: "2026-10-09"},
	{Title: "Bahar Yarıyılı Cezalı Kayıt Yenilemesi", Start: "2027-02-01", End: "2027-02-05"},
	{Title: addDrop, Start: "2027-02-01", End: "2027-02-12"},
}

func ts(s string) time.Time {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		panic(err)
	}
	return t
}

func TestAddDropEnd(t *testing.T) {
	cases := []struct {
		name   string
		slug   string
		events []Event
		want   string // bitiş GÜNÜ; "" = bulunamadı
	}{
		{"güz: iki satırdan eylül-ekim olanı", "2026-2027-guz", cal2026, "2026-10-09"},
		{"bahar: güz tablosundaki şubat satırı", "2026-2027-bahar", cal2026, "2027-02-12"},
		{"yaz: ekle-bırak satırı yok", "2026-2027-yaz", cal2026, ""},
		{"başka akademik yılın takvimi", "2025-2026-guz", cal2026, ""},
		{"boş takvim", "2026-2027-guz", nil, ""},
		{"bozuk slug", "2026-guz", cal2026, ""},
		{"bozuk tarih", "2026-2027-guz", []Event{{Title: addDrop, End: "9 Ekim"}}, ""},
		{"bitiş boşsa başlangıç", "2026-2027-guz", []Event{{Title: addDrop, Start: "2026-10-09"}}, "2026-10-09"},
		{"başlık yazım farkı", "2026-2027-guz",
			[]Event{{Title: "DERS PLANINDAKİ DERSLERDEN BİRİSİNİ BIRAKIP  BİR BAŞKA DERSE YAZILMA", End: "2026-10-09"}}, "2026-10-09"},
		{"aynı dönemde iki satır: geç olan", "2026-2027-guz",
			[]Event{{Title: addDrop, End: "2026-10-02"}, {Title: addDrop, End: "2026-10-09"}}, "2026-10-09"},
	}
	for _, c := range cases {
		end, ok := AddDropEnd(c.slug, c.events)
		got := ""
		if ok {
			got = Date(end)
		}
		if got != c.want {
			t.Errorf("%s: AddDropEnd = %q, want %q", c.name, got, c.want)
		}
	}
}

func TestAddDropEndIsEndOfDayIstanbul(t *testing.T) {
	end, ok := AddDropEnd("2026-2027-guz", cal2026)
	if !ok {
		t.Fatal("bitiş bulunamadı")
	}
	// 9 Ekim 23:59 TRT hâlâ ekle-bırak günü; 10 Ekim 00:00 TRT = 9 Ekim 21:00 UTC.
	if want := ts("2026-10-09T21:00:00Z"); !end.Equal(want) {
		t.Fatalf("bitiş anı = %s, want %s", end.UTC(), want)
	}
}

func TestFrozen(t *testing.T) {
	guz, guzOK := AddDropEnd("2026-2027-guz", cal2026)
	bahar, baharOK := AddDropEnd("2026-2027-bahar", cal2026)
	yaz, yazOK := AddDropEnd("2026-2027-yaz", cal2026)

	cases := []struct {
		name string
		now  string
		end  time.Time
		ok   bool
		last string
		want bool
	}{
		{"bitişten önce", "2026-10-05T02:17:00Z", guz, guzOK, "2026-09-28T02:20:00Z", false},
		{"bitiş günü akşamı (TRT) hâlâ açık", "2026-10-09T20:30:00Z", guz, guzOK, "2026-10-09T20:00:00Z", false},
		{"bitişten sonra, bitiş sonrası ölçüm yok", "2026-10-12T02:17:00Z", guz, guzOK, "2026-10-05T09:05:14Z", false},
		{"bitişten sonra, bitiş sonrası ölçüm var", "2026-10-19T02:17:00Z", guz, guzOK, "2026-10-12T02:20:00Z", true},
		{"hiç ölçüm yok", "2026-10-19T02:17:00Z", guz, guzOK, "", false},
		{"takvim yok", "2026-10-19T02:17:00Z", time.Time{}, false, "2026-10-12T02:20:00Z", false},
		{"yaz: etkinlik yok", "2027-08-02T02:17:00Z", yaz, yazOK, "2027-07-26T02:20:00Z", false},
		{"bahar: güz bitişi geçti ama bahar bitmedi", "2027-02-08T02:17:00Z", bahar, baharOK, "2027-02-01T02:20:00Z", false},
		{"bahar: bitiş sonrası ilk koşu", "2027-02-15T02:17:00Z", bahar, baharOK, "2027-02-08T02:20:00Z", false},
		{"bahar: donmuş", "2027-02-22T02:17:00Z", bahar, baharOK, "2027-02-15T02:20:00Z", true},
	}
	for _, c := range cases {
		if got := Frozen(ts(c.now), c.end, c.ok, ParseTime(c.last)); got != c.want {
			t.Errorf("%s: Frozen = %v, want %v", c.name, got, c.want)
		}
	}
}

func TestLoadAddDropEnd(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "data", "calendar", "lisans")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	write := func(name, body string) {
		t.Helper()
		if err := os.WriteFile(filepath.Join(dir, name), []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	ev := func(end string) string {
		return `{"table":"Güz Dönemi","title":"` + addDrop + `","start":"` + end + `","end":"` + end + `"}`
	}
	// Yanlış yıl etiketi altındaki uygun tarihli satır seçilmemeli.
	write("564.json", `{"year":"2025-2026 Eğitim - Öğretim Yılı","events":[`+ev("2025-10-10")+`,`+ev("2026-10-30")+`]}`)
	write("854.json", `{"year":"2026-2027 Eğitim - Öğretim Yılı","events":[`+ev("2026-10-09")+`,`+ev("2027-02-12")+`]}`)
	write("bozuk.json", `{"year":`)

	for slug, want := range map[string]string{
		"2026-2027-guz":   "2026-10-09",
		"2026-2027-bahar": "2027-02-12",
		"2025-2026-guz":   "2025-10-10",
		"2027-2028-guz":   "", // takvimi henüz yok
		"2026-2027-yaz":   "",
	} {
		end, ok := LoadAddDropEnd(root, slug)
		got := ""
		if ok {
			got = Date(end)
		}
		if got != want {
			t.Errorf("%s: LoadAddDropEnd = %q, want %q", slug, got, want)
		}
	}
	if _, ok := LoadAddDropEnd(filepath.Join(root, "yok"), "2026-2027-guz"); ok {
		t.Error("takvim dizini yokken bitiş bulunmamalı")
	}
}
