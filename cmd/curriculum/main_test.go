package main

import (
	"testing"

	"itu-scraper/internal/curriculum"
)

func TestMergeCurriculumPlansPreservesFailedPrograms(t *testing.T) {
	previous := []*curriculum.Plan{
		{ProgramCode: "BLG_LS", ProgramName: "eski BLG"},
		{ProgramCode: "MAT_LS", ProgramName: "korunacak MAT"},
	}
	fresh := []*curriculum.Plan{{ProgramCode: "BLG_LS", ProgramName: "yeni BLG"}}

	merged, retained := mergeCurriculumPlans(previous, fresh)
	if len(merged) != 2 || retained != 1 {
		t.Fatalf("bir plan korunmalı: len=%d retained=%d", len(merged), retained)
	}
	byCode := map[string]*curriculum.Plan{}
	for _, plan := range merged {
		byCode[plan.ProgramCode] = plan
	}
	if byCode["BLG_LS"].ProgramName != "yeni BLG" {
		t.Fatal("taze plan eski planın üzerine yazılmadı")
	}
	if byCode["MAT_LS"].ProgramName != "korunacak MAT" {
		t.Fatal("çekilemeyen programın önceki planı kayboldu")
	}
}
