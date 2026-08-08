package final

import "testing"

func TestParse(t *testing.T) {
	body := `<html><body>
	<table>
	<thead><tr><th>CRN</th><th>Ders Kodu</th><th></th><th>Ders Adı</th><th>Öğretim Üyesi</th><th>Tür</th><th>Yer</th><th>Gün</th><th>Saat</th><th>Tarih</th></tr></thead>
	<tbody>
	<tr><td>10001</td><td>BLG</td><td>101E</td><td>Algorithms</td><td>Prof. Dr. A</td><td>Final Sınavı</td><td>Ayazağa/İnşaat Binası-D100</td><td>Pazartesi</td><td>09:00-11:00</td><td>10 Ağustos 2026</td></tr>
	</tbody>
	</table></body></html>`

	exams, err := parse(body, "BLG")
	if err != nil {
		t.Fatal(err)
	}
	if len(exams) != 1 {
		t.Fatalf("1 sınav bekleniyordu, %d geldi", len(exams))
	}
	e := exams[0]
	if e.CRN != "10001" || e.Code != "BLG 101E" || e.Branch != "BLG" || e.Name != "Algorithms" {
		t.Errorf("temel alanlar: %+v", e)
	}
	if e.Type != "Final Sınavı" || e.Place != "Ayazağa/İnşaat Binası-D100" {
		t.Errorf("tür/yer: %q / %q", e.Type, e.Place)
	}
	if e.Day != "Pazartesi" || e.Time != "09:00-11:00" || e.Date != "10 Ağustos 2026" {
		t.Errorf("zaman: %+v", e)
	}
}

func TestParseSkipsHeader(t *testing.T) {
	body := `<tbody><tr><td>CRN</td><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td></tr></tbody>`
	exams, err := parse(body, "X")
	if err != nil {
		t.Fatal(err)
	}
	if len(exams) != 0 {
		t.Fatalf("başlık satırı atlanmalı: %d", len(exams))
	}
}

func TestParseWrongColumns(t *testing.T) {
	body := `<tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody>`
	if _, err := parse(body, "X"); err == nil {
		t.Fatal("eksik kolonlu tablo hata vermeli")
	}
}
