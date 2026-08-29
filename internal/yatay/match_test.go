package yatay

import "testing"

var testPrograms = []ArchiveProgram{
	{Code: "BLG_LS", Name: "Bilgisayar Mühendisliği Lisans", Level: 2},
	{Code: "BLGE_LS", Name: "Bilgisayar Mühendisliği (İngilizce) Lisans", Level: 2},
	{Code: "UCK_LS", Name: "Uçak Mühendisliği Lisans", Level: 2}, // İngilizce koda ayrılmamış
	{Code: "MUZ_LS", Name: "Müzikoloji Lisans", Level: 2},        // dil eki hiç yok
	{Code: "SBP_LS", Name: "Şehir ve Bölge Planlama Lisans", Level: 2},
	{Code: "SBPE_LS", Name: "Şehir ve Bölge Planlama (İngilizce) Lisans", Level: 2},
	{Code: "GEM_LS", Name: "Gemi İnşaatı ve Gemi Makinaları Mühendisliği Lisans", Level: 2},
	{Code: "KOM_LS", Name: "Kontrol ve Otomasyon Mühendisliği Lisans", Level: 2},
	{Code: "KOME_LS", Name: "Kontrol ve Otomasyon Mühendisliği (İngilizce) Lisans", Level: 2},
	{Code: "EUT_LS", Name: "Endüstri Ürünleri Tasarımı Lisans", Level: 2},
	// Aynı program KKTC'de de var — level=2 ama "(KKTC)" içeriyor, adaylardan düşmeli.
	{Code: "ARC_LS", Name: "Mimarlık (İngilizce) (KKTC) Lisans", Level: 2},
	{Code: "MIM_LS", Name: "Mimarlık Lisans", Level: 2},
	// THM/TSM şubeleri kendi ayrı adlarını taşıyor, temel koddan ayrı kalmalı.
	{Code: "SES_LS", Name: "Ses Eğitimi Lisans", Level: 2},
	{Code: "SES_TH_LS", Name: "Ses Eğitimi (THM) Lisans", Level: 2},
	{Code: "SES_TS_LS", Name: "Ses Eğitimi (TSM) Lisans", Level: 2},
	// Lisansüstü — level != 2, aday olmamalı.
	{Code: "BLG_YL", Name: "Bilgisayar Mühendisliği Yüksek Lisans", Level: 3},
}

func result(program string) Result { return Result{Program: program} }

func TestMatchPrograms(t *testing.T) {
	cases := []struct {
		name string
		want string
	}{
		{"Bilgisayar Mühendisliği (% 30 İngilizce)", "BLG_LS"},
		{"Bilgisayar Mühendisliği (% 100 İngilizce)", "BLGE_LS"},
		// Yalnızca tek kod var, dil oranı ne olursa olsun ona düşmeli.
		{"Uçak Mühendisliği (% 30 İngilizce)", "UCK_LS"},
		// Dil eki hiç yok, tek aday var.
		{"Müzikoloji", "MUZ_LS"},
		// baseAliases: "Planlaması" → "Planlama".
		{"Şehir ve Bölge Planlaması (% 30 İngilizce)", "SBP_LS"},
		{"Şehir ve Bölge Planlaması (% 100 İngilizce)", "SBPE_LS"},
		// baseAliases: "Makineleri" → "Makinaları".
		{"Gemi İnşaatı ve Gemi Makineleri Mühendisliği (% 30 İngilizce)", "GEM_LS"},
		// baseAliases: bölüm adı değişikliği.
		{"Kontrol Mühendisliği (% 30 İngilizce)", "KOM_LS"},
		{"Kontrol Mühendisliği (% 100 İngilizce)", "KOME_LS"},
		// baseAliases: kaynak sayfa yazım hatası.
		{"Endüstri Ürünleri Tasarımyı (% 100 İngilizce)", "EUT_LS"},
		// KKTC (önek biçimi) — kasıtlı olarak eşleşmemeli.
		{"İTÜ-KKTC Mimarlık (% 100 İngilizce)", ""},
		// KKTC (sonek biçimi) — kasıtlı olarak eşleşmemeli.
		{"Mimarlık (KKTC)", ""},
		// UOLP — kasıtlı olarak eşleşmemeli.
		{"Bilgisayar Mühendisliği (İngilizce) UOLP (ABD-NJIT)", ""},
		// THM/TSM şubeleri kendi ayrı adlarını taşıyor ("(THM)"/"(TSM)" fold'da
		// da kalır) — düz "Ses Eğitimi" onlarla çakışmaz, temel koda düşer.
		{"Ses Eğitimi", "SES_LS"},
		// Bilinmeyen program — boş kalmalı.
		{"Var Olmayan Program (% 30 İngilizce)", ""},
	}

	results := make([]Result, len(cases))
	for i, c := range cases {
		results[i] = result(c.name)
	}
	matched := MatchPrograms(results, testPrograms)

	for i, c := range cases {
		if got := matched[i].ProgramCode; got != c.want {
			t.Errorf("%q: got %q, want %q", c.name, got, c.want)
		}
	}
}

func TestMatchProgramsDoesNotMutateInput(t *testing.T) {
	results := []Result{result("Bilgisayar Mühendisliği (% 30 İngilizce)")}
	_ = MatchPrograms(results, testPrograms)
	if results[0].ProgramCode != "" {
		t.Errorf("girdi mutasyona uğramış: %+v", results[0])
	}
}
