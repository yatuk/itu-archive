package obs

import (
	"reflect"
	"testing"
)

func TestParseTable(t *testing.T) {
	body := `<html><body>
	<table>
	<thead><tr><th>a</th></tr></thead>
	<tbody>
	<tr>
		<td>10001</td><td>BLG 101E</td><td>Algorithms</td><td>Yüz Yüze</td><td>Prof. Dr. A</td>
		<td>B1<br/>B2</td><td>Pazartesi<br/>Çarşamba</td><td>09:30/12:29<br/>13:30/17:29</td><td>D1<br/>D2</td>
		<td>60</td><td>45</td><td>-</td><td>BLG_LS, MAT_LS</td><td>MAT 101</td><td>MIN CC</td>
	</tr>
	</tbody>
	</table></body></html>`

	br := Branch{ID: 1, Code: "BLG", Level: "LS"}
	secs, err := parseTable(body, br)
	if err != nil {
		t.Fatal(err)
	}
	if len(secs) != 1 {
		t.Fatalf("1 şube bekleniyordu, %d geldi", len(secs))
	}
	s := secs[0]
	if s.CRN != "10001" || s.Code != "BLG 101E" || s.Name != "Algorithms" || s.Method != "Yüz Yüze" {
		t.Errorf("temel alanlar yanlış: %+v", s)
	}
	if !reflect.DeepEqual(s.Days, []string{"Pazartesi", "Çarşamba"}) {
		t.Errorf("Days: %v", s.Days)
	}
	if !reflect.DeepEqual(s.Times, []string{"09:30/12:29", "13:30/17:29"}) {
		t.Errorf("Times: %v", s.Times)
	}
	if !reflect.DeepEqual(s.Rooms, []string{"D1", "D2"}) || !reflect.DeepEqual(s.Buildings, []string{"B1", "B2"}) {
		t.Errorf("Rooms/Buildings: %v / %v", s.Rooms, s.Buildings)
	}
	if s.Capacity != 60 || s.Enrolled != 45 {
		t.Errorf("kontenjan: %d/%d", s.Capacity, s.Enrolled)
	}
	if !reflect.DeepEqual(s.Programs, []string{"BLG_LS", "MAT_LS"}) {
		t.Errorf("Programs: %v", s.Programs)
	}
	if s.Prereq != "MAT 101" || s.ClassReq != "MIN CC" || s.Reserved != "-" {
		t.Errorf("önşart alanları: %q %q %q", s.Prereq, s.ClassReq, s.Reserved)
	}
	if s.Branch != "BLG" || s.Level != "LS" {
		t.Errorf("branş/seviye: %q/%q", s.Branch, s.Level)
	}
}

func TestParseTableWrongColumns(t *testing.T) {
	body := `<tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody>`
	if _, err := parseTable(body, Branch{Code: "X"}); err == nil {
		t.Fatal("eksik kolonlu tablo hata vermeli")
	}
}

func TestParseTableSkipsEmptyCRN(t *testing.T) {
	// CRN boş satırlar atlanır (başlık/toplam satırları gibi).
	cells := func(v string) string { return "<td>" + v + "</td>" }
	row := "<tr>" + cells("") + cells("") + cells("") + cells("") + cells("") +
		cells("") + cells("") + cells("") + cells("") + cells("") +
		cells("") + cells("") + cells("") + cells("") + cells("") + "</tr>"
	body := "<tbody>" + row + "</tbody>"
	secs, err := parseTable(body, Branch{Code: "X"})
	if err != nil {
		t.Fatal(err)
	}
	if len(secs) != 0 {
		t.Fatalf("boş CRN'li satır atlanmalı: %d şube", len(secs))
	}
}
