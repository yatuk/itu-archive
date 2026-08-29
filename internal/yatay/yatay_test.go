package yatay

import "testing"

// Gerçek sayfalardan alınmış kısaltılmış örnekler (2026-08-29'da çekildi).
// Kaynak HTML kasıtlı olarak bozuk bırakıldı: kapanmamış <td>, tırnaksız
// öznitelik, colsapan yazım hatası — hepsi gerçek sayfada da böyle.

const combinedFixture = `<table class="onsart" border="1"><tbody>
<tr style="font-weight:bold;" bgcolor="#F0F0F0"><td rowspan="2">Bölüm</td><td colspan="3">3.YY</td><td colspan="3">5.YY</td></tr>
<tr style="font-weight:bold;" bgcolor="#F0F0F0"><td>Yerleşen</td><td>Tavan Not Ortalaması</td><td>Taban Not Ortalaması</td><td>Yerleşen</td><td>Tavan Not Ortalaması</td><td>Taban Not Ortalaması</td></tr>
<tr><td colsapan="7"><b>İnşaat Fakültesi</b></td></tr>
<tr><td>İnşaat Mühendisliği (% 30 İngilizce)</td><td>5</td><td>3.71</td><td>3.44</td><td>0</td><td>--</td><td>--</td></tr>
<tr><td>Geomatik Mühendisliği(% 100 İngilizce)</td><td>0</td><td>--</td><td>--</td><td>0</td><td>--</td><td>--</td></tr>
<tr><td colsapan="7"><b>Mimarlık Fakültesi</b></td></tr>
<tr><td>Mimarlık  (% 30 İngilizce)</td><td>3</td><td>3.91</td><td>3.67</td><td>3</td><td>3.74</td><td>3.59</td></tr>
</tbody></table>`

func TestParseCombined(t *testing.T) {
	results, err := Parse(combinedFixture, formatCombined)
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	// 3 program × 2 yarıyıl = 6 kayıt.
	if len(results) != 6 {
		t.Fatalf("6 kayıt bekleniyordu, %d geldi: %+v", len(results), results)
	}

	first := results[0]
	if first.Faculty != "İnşaat Fakültesi" {
		t.Errorf("faculty = %q", first.Faculty)
	}
	if first.Program != "İnşaat Mühendisliği (% 30 İngilizce)" {
		t.Errorf("program = %q", first.Program)
	}
	if first.Semester != 3 || first.Placed != 5 {
		t.Errorf("semester/placed = %d/%d", first.Semester, first.Placed)
	}
	if first.Ceiling == nil || *first.Ceiling != 3.71 {
		t.Errorf("ceiling = %v", first.Ceiling)
	}
	if first.Floor == nil || *first.Floor != 3.44 {
		t.Errorf("floor = %v", first.Floor)
	}

	// 5. yarıyıl "--" → yerleşen yok, ceiling/floor nil olmalı ama satır kaybolmamalı.
	second := results[1]
	if second.Semester != 5 || second.Placed != 0 {
		t.Errorf("second semester/placed = %d/%d", second.Semester, second.Placed)
	}
	if second.Ceiling != nil || second.Floor != nil {
		t.Errorf("second ceiling/floor nil olmalıydı: %v/%v", second.Ceiling, second.Floor)
	}

	// Geomatik (0 kontenjan dolu) her iki yarıyılda da boş.
	geoResults := results[2:4]
	for _, r := range geoResults {
		if r.Ceiling != nil {
			t.Errorf("Geomatik ceiling nil olmalıydı: %v", r.Ceiling)
		}
	}

	// İkinci fakülteye geçiş doğru izlendi mi?
	last := results[len(results)-1]
	if last.Faculty != "Mimarlık Fakültesi" {
		t.Errorf("last faculty = %q", last.Faculty)
	}
}

const perSemesterFixture = `<table class="onsart" border="1"><tbody>
<tr style="font-weight:bold;" bgcolor="#F0F0F0"><td>Program</td><td>Yarıyıl</td><td>Kontenjan</td><td>Yerleşen</td><td>Tavan Değerlendirme Puanı</td><td>Taban Değerlendirme Puanı</td></tr>
<tr><td colsapan="7"><b>İnşaat Fakültesi</b></td></tr>
<tr><td>İnşaat Mühendisliği (% 30 İngilizce)<td>3.Yarıyıl</td><td>4</td><td>2</td><td>0.83046</td><td>0.80504</td></tr>
<tr><td>İnşaat Mühendisliği (% 30 İngilizce)<td>5.Yarıyıl</td><td>0</td><td>0</td><td>-</td><td>-</td></tr>
</tbody></table>`

func TestParsePerSemester(t *testing.T) {
	results, err := Parse(perSemesterFixture, formatPerSemester)
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if len(results) != 2 {
		t.Fatalf("2 kayıt bekleniyordu, %d geldi: %+v", len(results), results)
	}
	first := results[0]
	if first.Faculty != "İnşaat Fakültesi" {
		t.Errorf("faculty = %q", first.Faculty)
	}
	if first.Semester != 3 || first.Quota != 4 || first.Placed != 2 {
		t.Errorf("semester/quota/placed = %d/%d/%d", first.Semester, first.Quota, first.Placed)
	}
	if first.Ceiling == nil || *first.Ceiling != 0.83046 {
		t.Errorf("ceiling = %v", first.Ceiling)
	}

	second := results[1]
	if second.Semester != 5 || second.Quota != 0 {
		t.Errorf("second semester/quota = %d/%d", second.Semester, second.Quota)
	}
	if second.Ceiling != nil {
		t.Errorf("second ceiling nil olmalıydı (tek '-'): %v", second.Ceiling)
	}
}

// 2025-2026 sayfası bozuk HTML kullanıyor: <td> kapanmadan bir sonraki <td>
// açılıyor. splitOn bunu doğru bölmeli.
const malformedFixture = `<table><tbody>
<tr style="font-weight:bold;" bgcolor=#F0F0F0><td>Program<td>Yarıyıl</td><td>Kontenjan</td><td>Yerleşen</td><td>Tavan Değerlendirme Puanı</td><td>Taban Değerlendirme Puanı</td><td>Açıklama</td><tr>
<tr><td colsapan=8><b>İnşaat Fakültesi</b></td></tr>
<tr><td>İnşaat Mühendisliği (% 30 İngilizce)<td>3.Yarıyıl</td><td>5</td><td>5</td><td>0.87499</td><td>0.80037</td><td></td></tr>
</tbody></table>`

func TestParseMalformedHTML(t *testing.T) {
	results, err := Parse(malformedFixture, formatPerSemester)
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("1 kayıt bekleniyordu, %d geldi: %+v", len(results), results)
	}
	r := results[0]
	if r.Program != "İnşaat Mühendisliği (% 30 İngilizce)" {
		t.Errorf("program = %q (kapanmamış <td> hücreleri karıştırmış olabilir)", r.Program)
	}
	if r.Semester != 3 || r.Quota != 5 || r.Placed != 5 {
		t.Errorf("semester/quota/placed = %d/%d/%d", r.Semester, r.Quota, r.Placed)
	}
	if r.Ceiling == nil || *r.Ceiling != 0.87499 {
		t.Errorf("ceiling = %v", r.Ceiling)
	}
}

func TestParseEmptyBody(t *testing.T) {
	if _, err := Parse("<html><body>yok</body></html>", formatCombined); err == nil {
		t.Fatal("tablosuz gövdede hata bekleniyordu")
	}
}

func TestSplitOnHandlesUnclosedTags(t *testing.T) {
	cells := splitOn(`<td>a<TD>b</td><td>c`, tdOpenRe)
	want := []string{"a", "b", "c"}
	if len(cells) != len(want) {
		t.Fatalf("cells = %v", cells)
	}
	for i := range want {
		if cells[i] != want[i] {
			t.Errorf("cells[%d] = %q, want %q", i, cells[i], want[i])
		}
	}
}
