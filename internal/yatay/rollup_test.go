package yatay

import "testing"

func f(v float64) *float64 { return &v }

func TestBuildRollups(t *testing.T) {
	terms := []*Term{
		{Term: "2023-2024", Metric: MetricScore, Results: []Result{
			{Faculty: "İnşaat Fakültesi", Program: "İnşaat Mühendisliği (% 30 İngilizce)", ProgramCode: "INS_LS", Semester: 3, Quota: 4, Placed: 2, Ceiling: f(0.83), Floor: f(0.80)},
			{Faculty: "İnşaat Fakültesi", Program: "İnşaat Mühendisliği (% 30 İngilizce)", ProgramCode: "INS_LS", Semester: 5, Placed: 0},
			// Eşleşmemiş (KKTC) — rollup'a girmemeli.
			{Faculty: "İTÜ-KKTC", Program: "İTÜ-KKTC Mimarlık (% 100 İngilizce)", ProgramCode: "", Semester: 3, Placed: 1},
		}},
		{Term: "2024-2025", Metric: MetricScore, Results: []Result{
			{Faculty: "İnşaat Fakültesi", Program: "İnşaat Mühendisliği (% 30 İngilizce)", ProgramCode: "INS_LS", Semester: 3, Quota: 5, Placed: 5, Ceiling: f(0.88), Floor: f(0.79)},
		}},
	}

	rollups := BuildRollups(terms)
	if len(rollups) != 1 {
		t.Fatalf("1 program bekleniyordu, %d geldi: %+v", len(rollups), rollups)
	}
	r := rollups["INS_LS"]
	if r == nil {
		t.Fatal("INS_LS rollup'ta yok")
	}
	if r.Faculty != "İnşaat Fakültesi" {
		t.Errorf("faculty = %q", r.Faculty)
	}
	if len(r.Years) != 2 {
		t.Fatalf("2 yıl bekleniyordu, %d geldi", len(r.Years))
	}
	if r.Years[0].Term != "2023-2024" || len(r.Years[0].Results) != 2 {
		t.Errorf("ilk yıl yanlış: %+v", r.Years[0])
	}
	if r.Years[1].Term != "2024-2025" || len(r.Years[1].Results) != 1 {
		t.Errorf("ikinci yıl yanlış: %+v", r.Years[1])
	}
	// Yarıyıla göre sıralı olmalı (3 önce, 5 sonra).
	if r.Years[0].Results[0].Semester != 3 || r.Years[0].Results[1].Semester != 5 {
		t.Errorf("yarıyıl sırası yanlış: %+v", r.Years[0].Results)
	}
}
