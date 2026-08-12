package archive

import (
	"reflect"
	"testing"
)

const csvHeader = "Kod,Ders,Eğitmen,Gün,Saat,Bina,Kayıtlı,Kontenjan,Bölüm Sınırlaması,CRN,Dönem"

func TestParseCSV(t *testing.T) {
	csv := csvHeader + "\n" +
		// Tek oturum, eski saat biçimi, bina+derslik tek hücrede.
		"AKM 204,Akışkanlar Mekaniği,Birgül Benli,Cuma,0930/1229,INB / A104,51,50,CEV CHZ IML,12873,2017 - 2018 Güz Dönemi\n" +
		// Çok oturum: bina/derslik ikilileri, " / " ayırıcı, kısıtlama yok.
		"MAT 101,Matematik I,Ahmet X,Pazartesi / Çarşamba,08:30/12:29 / 13:30/17:29,MDB / MDB / D1 / D2,30,30,----,20001,2017 - 2018 Güz Dönemi\n" +
		// İngilizce gün adı Türkçe'ye çekilir.
		"FIZ 101,Fizik I,B, Monday,0930/1229,INB,10,20,-,30001,2017 - 2018 Güz Dönemi\n" +
		// Bölüm kısıtlaması düz cümle: kod sanılmamalı.
		"HSS 101,Hukuk,C, Pazartesi,0930/1229,INB,5,10,\"Yabancı Uyruklu Tüm Öğrenciler\",40001,2017 - 2018 Güz Dönemi\n" +
		// Virgülle ayrılmış program kodları tek tek öğe olmalı (dropdown bu listeden besleniyor).
		"CEV 205,Çevre Kimyası,D, Pazartesi,0930/1229,INB,30,20,\"AIN, ARC, BIO, BIOE\",50001,2017 - 2018 Güz Dönemi\n" +
		// Boş CRN'li satır atlanır.
		"TES 111E,Project,D, Pazartesi,0930/1229,INB,1,2,-,,2017 - 2018 Güz Dönemi\n"

	levels := map[string]string{"AKM": "LS", "MAT": "LS"}
	secs, err := parseCSV([]byte(csv), levels)
	if err != nil {
		t.Fatal(err)
	}
	if len(secs) != 5 {
		t.Fatalf("5 şube bekleniyordu, %d geldi", len(secs))
	}

	s0 := secs[0]
	if s0.CRN != "12873" || s0.Code != "AKM 204" || s0.Name != "Akışkanlar Mekaniği" || s0.Instructor != "Birgül Benli" {
		t.Errorf("temel alanlar: %+v", s0)
	}
	if !reflect.DeepEqual(s0.Days, []string{"Cuma"}) || !reflect.DeepEqual(s0.Times, []string{"09:30/12:29"}) {
		t.Errorf("zaman: %v / %v", s0.Days, s0.Times)
	}
	if !reflect.DeepEqual(s0.Buildings, []string{"INB"}) || !reflect.DeepEqual(s0.Rooms, []string{"A104"}) {
		t.Errorf("bina/derslik: %v / %v", s0.Buildings, s0.Rooms)
	}
	if !reflect.DeepEqual(s0.Programs, []string{"CEV", "CHZ", "IML"}) {
		t.Errorf("programlar: %v", s0.Programs)
	}
	if s0.Capacity != 50 || s0.Enrolled != 51 || s0.Level != "LS" {
		t.Errorf("kontenjan/seviye: %+v", s0)
	}

	s1 := secs[1]
	if !reflect.DeepEqual(s1.Days, []string{"Pazartesi", "Çarşamba"}) {
		t.Errorf("çok oturum günleri: %v", s1.Days)
	}
	if !reflect.DeepEqual(s1.Buildings, []string{"MDB", "MDB"}) || !reflect.DeepEqual(s1.Rooms, []string{"D1", "D2"}) {
		t.Errorf("çok oturum bina/derslik: %v / %v", s1.Buildings, s1.Rooms)
	}

	s2 := secs[2]
	if !reflect.DeepEqual(s2.Days, []string{"Pazartesi"}) {
		t.Errorf("İngilizce gün çevrilmedi: %v", s2.Days)
	}

	s3 := secs[3]
	if !reflect.DeepEqual(s3.Programs, []string{"Yabancı Uyruklu Tüm Öğrenciler"}) {
		t.Errorf("cümle program sanılmamalı: %v", s3.Programs)
	}

	s4 := secs[4]
	if !reflect.DeepEqual(s4.Programs, []string{"AIN", "ARC", "BIO", "BIOE"}) {
		t.Errorf("virgüllü program kodları ayrılmalı: %v", s4.Programs)
	}
}

func TestParseCSVMissingColumn(t *testing.T) {
	if _, err := parseCSV([]byte("Kod,Ders,CRN\n1,2,3\n"), nil); err == nil {
		t.Fatal("eksik kolon hata vermeli")
	}
}

func TestNormalizeLabel(t *testing.T) {
	cases := []struct{ in, want string }{
		{"2016 - 2017 Yaz Dönemi", "2016-2017 Yaz Dönemi"},
		{"2016-2017 Yaz Dönemi", "2016-2017 Yaz Dönemi"},
	}
	for _, c := range cases {
		if got := normalizeLabel(c.in); got != c.want {
			t.Errorf("normalizeLabel(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}
