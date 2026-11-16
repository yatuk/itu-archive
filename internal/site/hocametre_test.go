package site

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestFoldNameStripsTitlesAndTurkishLetters(t *testing.T) {
	cases := map[string]string{
		"Prof. Dr. Adil YÜCEL":        "adil yucel",
		"Dr. Öğr. Üyesi Şükrü Çağlar": "sukru caglar",
		"  İnci   Işık ":              "inci isik",
		"Arş. Gör. Ğülşen Öz":         "gulsen oz",
	}
	for in, want := range cases {
		if got := foldName(in); got != want {
			t.Errorf("foldName(%q) = %q, beklenen %q", in, got, want)
		}
	}
}

func TestHocametreMatching(t *testing.T) {
	ix, err := loadHocametre(filepath.Join("testdata", "hocametre.json"))
	if err != nil || ix == nil {
		t.Fatalf("fixture okunamadı: %v", err)
	}
	cases := []struct {
		name string
		want string // boş = eşleşme yok
	}{
		{"Adil Yücel", "Adil Yücel"},             // birebir anahtar
		{"Prof. Dr. Adil Yücel", "Adil Yücel"},   // unvan atılır
		{"Mehmet Kaya", "Mehmet Ali Kaya"},       // bizimki onunkinin alt kümesi, 2 ortak token
		{"Ayşe Demir", "Ayşe Demir"},             // birebir anahtar, alt küme adayına rağmen
		{"Selin Öz Kara Tekin", "Selin Öz Kara"}, // tek aday: onunki bizimkinin alt kümesi... ve Selin Öz de
		{"Kemal Sunal", ""},                      // hiç aday yok
		{"Can Ece", ""},                          // ortak (A / B) giriş bulanık eşleşmeye katılmaz
		{"Adil", ""},                             // tek token, birebir değil
	}
	for _, c := range cases {
		got := ix.match(c.name)
		gotName := ""
		if got != nil {
			gotName = got.Name
		}
		if c.name == "Selin Öz Kara Tekin" {
			// Hem "selin oz" hem "selin oz kara" kapsanıyor → belirsiz, eşleşme yok.
			if got != nil {
				t.Errorf("belirsiz adda eşleşme olmamalı, %q bulundu", gotName)
			}
			continue
		}
		if gotName != c.want {
			t.Errorf("match(%q) = %q, beklenen %q", c.name, gotName, c.want)
		}
	}
}

func TestHocametreMissingFileIsNotAnError(t *testing.T) {
	ix, err := loadHocametre(filepath.Join("testdata", "yok.json"))
	if err != nil || ix != nil {
		t.Fatalf("eksik dosya sessizce atlanmalı: ix=%v err=%v", ix, err)
	}
	if html := ix.renderPanel(nil, "tr"); html != "" {
		t.Fatal("veri yokken panel boş olmalı")
	}
}

func TestHocametrePanelRendersAllCriteriaAsBarsAndFlagsFewVotes(t *testing.T) {
	ix, _ := loadHocametre(filepath.Join("testdata", "hocametre.json"))
	html := ix.renderPanel(ix.match("Adil Yücel"), "tr")
	for _, want := range []string{"3,85", "26</span> öğrenci oyu", "4,58", "Anlatım", "Yoklama", "5 = az ödev", "5 = yoklama almıyor", "Her ölçütte 5 en iyisi", "az oy", "notkutusu'nda yorumları gör", "https://notkutusu.com/hocametre/adil_yucelX"} {
		if !strings.Contains(html, want) {
			t.Errorf("panel %q içermeli", want)
		}
	}
	if strings.Contains(html, "—") {
		t.Error("kullanıcı metninde em-dash olmamalı")
	}
	// Beş ölçüt de "yüksek daha iyi": nötr nokta ya da ayrı grup yok.
	for _, gone := range []string{"is-neutral", "ip-dot", "Yönü belirsiz"} {
		if strings.Contains(html, gone) {
			t.Errorf("panel artık %q içermemeli", gone)
		}
	}
	if strings.Count(html, `class="ip-crit`) != 5 {
		t.Error("beş ölçüt de dolu çubuk olmalı")
	}
	few := ix.renderPanel(ix.match("Mehmet Ali Kaya"), "tr")
	if !strings.Contains(few, `ip-score is-few`) {
		t.Error("5 oyun altı soluk gösterilmeli")
	}
	if ix.renderPanel(ix.match("Bora Sert"), "tr") != "" {
		t.Error("oyu olmayan giriş için panel çizilmemeli")
	}
}

func TestAblativeTRFollowsVowelHarmony(t *testing.T) {
	for in, want := range map[string]string{"2025-2026 Bahar": "2025-2026 Bahar'dan", "2024-2025 Güz": "2024-2025 Güz'den", "2023-2024 Yaz": "2023-2024 Yaz'dan"} {
		if got := ablativeTR(in); got != want {
			t.Errorf("ablativeTR(%q) = %q, want %q", in, got, want)
		}
	}
}
