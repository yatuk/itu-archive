package site

import (
	"strings"
	"testing"
)

func TestInstructorGradeProfileReportsCoverageAndCourseContext(t *testing.T) {
	b := &Builder{
		codeTermInstrCount: map[string]int{
			"BLG 101\x002025-2026-guz":   1,
			"BLG 101\x002025-2026-bahar": 2,
			"MAT 101\x002025-2026-guz":   1,
		},
		gradesIndex: map[string]map[string]gradeFileRow{
			"BLG 101": {
				"2025-2026 Güz Dönemi": {Total: 20, Grades: map[string]int{"AA": 8, "FF": 2}},
			},
		},
	}
	hi := &histInstr{Rows: []instrRow{
		{Code: "BLG 101", Term: "2025-2026-guz"},
		{Code: "BLG 101", Term: "2025-2026-bahar"},
		{Code: "MAT 101", Term: "2025-2026-guz"},
	}}
	labels := map[string]string{
		"2025-2026-guz":   "2025-2026 Güz Dönemi",
		"2025-2026-bahar": "2025-2026 Bahar Dönemi",
	}

	gp := b.instructorGradeProfile(hi, labels)
	if gp.Records != 1 || gp.CandidatePairs != 3 || gp.SharedExcluded != 1 || gp.MissingGrades != 1 {
		t.Fatalf("beklenmeyen kapsam: %+v", gp)
	}
	if len(gp.Courses) != 1 || gp.Courses[0].Code != "BLG 101" || gp.Courses[0].Total != 20 {
		t.Fatalf("beklenmeyen ders kırılımı: %+v", gp.Courses)
	}

	html := renderInstructorGrades(langTR, gp)
	for _, want := range []string{"Geçmiş OBS", "1/3 benzersiz ders-dönem", "/ders/blg-101/", "2025-2026 Güz Dönemi"} {
		if !strings.Contains(html, want) {
			t.Errorf("çıktı %q içermeli", want)
		}
	}
}

func TestRenderCourseGradesUsesLatestTermAndLocalizesEnglish(t *testing.T) {
	records := map[string]gradeFileRow{
		"old": {Term: "2023-2024 Güz Dönemi", Donem: "202410", Total: 10, Grades: map[string]int{"CC": 10}},
		"new": {Term: "2024-2025 Bahar Dönemi", Donem: "202520", Total: 20, Grades: map[string]int{"AA": 8, "FF": 4}},
	}

	html := renderCourseGrades(langEN, records)
	for _, want := range []string{"2024-2025 Spring Term", "distribution of 20 grades", "AA/BA rate is 40%", "Compare all terms (2)"} {
		if !strings.Contains(html, want) {
			t.Errorf("çıktı %q içermeli", want)
		}
	}
	if strings.Index(html, "2024-2025 Spring Term") > strings.Index(html, "2023-2024 Fall Term") {
		t.Fatal("en yeni dönem geçmiş tablosunda önce gelmeli")
	}
}
