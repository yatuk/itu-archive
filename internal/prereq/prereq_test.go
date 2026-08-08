package prereq

import (
	"reflect"
	"testing"
)

// splitCells, OBS'nin kapanış etiketi eksik hücreleriyle başa çıkmalı.
// "Ders Adı" hücresinin </td>'si yoksa bile 4 hücre doğru bölünmeli.
func TestSplitCellsUnclosedTD(t *testing.T) {
	row := `<tr><td>MAT 103</td><td>Matematik I <td>( MAT 101 MIN. DD )</td><td>MIN CC</td></tr>`
	got := splitCells(row)
	if len(got) != 4 {
		t.Fatalf("4 hücre bekleniyordu, %d geldi: %v", len(got), got)
	}
	if got[0] != "MAT 103" || got[1] != "Matematik I" || got[2] != "( MAT 101 MIN. DD )" || got[3] != "MIN CC" {
		t.Errorf("hücreler yanlış: %v", got)
	}
}

func TestSplitCellsNormal(t *testing.T) {
	row := `<tr><td>AKM 204</td><td>Akışkanlar Mekaniği</td><td>ifade</td><td></td></tr>`
	got := splitCells(row)
	if len(got) != 4 {
		t.Fatalf("4 hücre bekleniyordu: %v", got)
	}
}

func TestExtractCodes(t *testing.T) {
	expr := "( MAT 102 MIN. DD Veya MAT 102E MIN. DD ) Veya ( MAT 104 MIN. DD Veya MAT 104E MIN. DD )"
	got := extractCodes(expr)
	want := []string{"MAT 102", "MAT 102E", "MAT 104", "MAT 104E"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("extractCodes = %v, want %v", got, want)
	}
}

func TestExtractCodesDedup(t *testing.T) {
	got := extractCodes("BLG 101E Veya BLG 101E")
	if len(got) != 1 {
		t.Errorf("tekrarlar elenmeli: %v", got)
	}
}
