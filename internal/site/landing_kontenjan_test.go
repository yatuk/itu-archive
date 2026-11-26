package site

import (
	"strings"
	"testing"
)

func kontFixture() []kontSect {
	var s []kontSect
	add := func(code, name string, cap, enr int) {
		s = append(s, kontSect{Code: code, Name: name, Cap: cap, Enr: enr, Level: "LS"})
	}
	// AAA 101: 3 şube, 165 kontenjan, 185 yazılan (oran 1.12) — en hızlı.
	add("AAA 101", "Alpha", 55, 60)
	add("AAA 101", "Alpha", 55, 65)
	add("AAA 101", "Alpha", 55, 60)
	// BBB 102: 3 şube, 150/150 (oran 1.0); ilk şube dolu değil.
	add("BBB 102", "Beta", 50, 40)
	add("BBB 102", "Beta", 50, 55)
	add("BBB 102", "Beta", 50, 55)
	// CCC 103: oran 1.0 eşitliği, kod sırasıyla BBB'den sonra.
	add("CCC 103", "Gamma", 50, 50)
	add("CCC 103", "Gamma", 50, 50)
	add("CCC 103", "Gamma", 50, 50)
	// DDD 104: boş yer bol (30/300).
	add("DDD 104", "Delta", 100, 10)
	add("DDD 104", "Delta", 100, 10)
	add("DDD 104", "Delta", 100, 10)
	// EEE 105: yalnızca 2 kontenjanlı şube — sıralamaya girmez.
	add("EEE 105", "Eps", 100, 100)
	add("EEE 105", "Eps", 100, 100)
	add("EEE 105", "Eps", 0, 12) // kontenjan yok
	// FFF 106: 3 şube ama toplam kontenjan 149 — girmez.
	add("FFF 106", "Phi", 50, 50)
	add("FFF 106", "Phi", 50, 50)
	add("FFF 106", "Phi", 49, 0)
	add("GGG 107", "NoCap", 0, 5)
	return s
}

func TestComputeKontenjan(t *testing.T) {
	total, quota, full, top, free := computeKontenjan(kontFixture())
	if total != 19 || quota != 17 {
		t.Fatalf("total/quota = %d/%d, want 19/17", total, quota)
	}
	// dolu: AAA 3 + BBB 2 + CCC 3 + EEE 2 + FFF 2 = 12
	if full != 12 {
		t.Fatalf("full = %d, want 12", full)
	}
	var codes []string
	for _, c := range top {
		codes = append(codes, c.Code)
	}
	if got := strings.Join(codes, ","); got != "AAA 101,BBB 102,CCC 103,DDD 104" {
		t.Fatalf("top = %s", got)
	}
	if top[0].Sections != 3 || top[0].Full != 3 || top[0].Enr != 185 || top[0].Cap != 165 {
		t.Fatalf("AAA toplamı yanlış: %+v", top[0])
	}
	if top[1].Full != 2 {
		t.Fatalf("BBB dolu şube = %d, want 2", top[1].Full)
	}
	if free[0].Code != "DDD 104" || free[len(free)-1].Code != "AAA 101" {
		t.Fatalf("free sırası yanlış: %+v", free)
	}
}

func TestComputeKontenjanTopLimit(t *testing.T) {
	var s []kontSect
	for i := 0; i < 15; i++ {
		code := "X " + string(rune('A'+i))
		for j := 0; j < 3; j++ {
			s = append(s, kontSect{Code: code, Name: code, Cap: 60, Enr: 10 + i, Level: "LS"})
		}
	}
	_, _, _, top, free := computeKontenjan(s)
	if len(top) != 10 || len(free) != 4 {
		t.Fatalf("len top/free = %d/%d", len(top), len(free))
	}
	if top[0].Code != "X O" || free[0].Code != "X A" {
		t.Fatalf("sıra yanlış: %s %s", top[0].Code, free[0].Code)
	}
}

func TestTrPossessive(t *testing.T) {
	for n, want := range map[int]string{24: "ü", 20: "si", 71: "i", 40: "ı", 10: "u", 6: "sı", 9: "u", 100: "ü", 0: "ı"} {
		if got := trPossessive(n); got != want {
			t.Errorf("trPossessive(%d) = %q, want %q", n, got, want)
		}
	}
}

func TestKontPill(t *testing.T) {
	cases := []struct {
		enr, cap  int
		cls, text string
	}{
		{185, 165, "lpk-full", "dolu +20"},
		{380, 380, "lpk-full", "dolu"},
		{198, 200, "lpk-warn", "2 yer"},
		{190, 200, "lpk-warn", "10 yer"},
		{189, 200, "lpk-ok", "11 yer"},
	}
	for _, c := range cases {
		cls, text := kontPill(c.enr, c.cap)
		if !strings.Contains(cls, c.cls) || text != c.text {
			t.Errorf("kontPill(%d,%d) = %q %q", c.enr, c.cap, cls, text)
		}
	}
}

func TestKontenjanBodyHTML(t *testing.T) {
	total, quota, full, top, free := computeKontenjan(kontFixture())
	st := kontStats{Term: "2026-2027 Güz", Total: total, Quota: quota, Full: full,
		Measured: "2026-10-12T09:17:57Z", Top: top, Free: free}
	html := st.bodyHTML(func(code string) bool { return code != "CCC 103" })
	for _, want := range []string{
		`<strong>19</strong>`, `<strong>17</strong>`, `2 şubede kontenjan yok`,
		`17 şubenin %71'i`, `<time datetime="2026-10-12">12 Eki</time>`,
		`href="/ders/aaa-101/"`, `<span class="lpk-code">CCC 103</span>`,
		`185/165`, `dolu +20`, `270 yer`,
	} {
		if !strings.Contains(html, want) {
			t.Errorf("gövdede %q yok", want)
		}
	}
	if strings.Contains(html, "—") || strings.Contains(st.faqHTML(), "—") {
		t.Error("kullanıcı metninde uzun tire var")
	}
	if n := strings.Count(html, "<tr data-lpk-row>"); n != len(top) {
		t.Errorf("satır sayısı %d, want %d", n, len(top))
	}
}

// "Boş yer bol" yalnız lisans derslerini gösterir; lisansüstü bir ders en
// boş olsa bile listeye girmez (ama "en hızlı dolan" adayı olmaya devam eder).
func TestComputeKontenjanFreeOnlyLisans(t *testing.T) {
	s := kontFixture()
	for i := 0; i < 3; i++ {
		s = append(s, kontSect{Code: "MYL 527E", Name: "Independent Study", Cap: 60, Enr: 0, Level: "YL"})
	}
	_, _, _, _, free := computeKontenjan(s)
	for _, c := range free {
		if c.Code == "MYL 527E" {
			t.Fatalf("lisansüstü ders boş yer listesinde: %+v", free)
		}
	}
	if free[0].Code != "DDD 104" {
		t.Fatalf("free[0] = %s, want DDD 104", free[0].Code)
	}
}
