package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
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

func TestFilterProgramsAcceptsList(t *testing.T) {
	ps := []curriculum.Program{{Code: "CEN_LS"}, {Code: "BLGE_LS"}, {Code: "MAT_LS"}}
	got := filterPrograms(ps, " CEN_LS,BLGE_LS ,")
	if len(got) != 2 || got[0].Code != "CEN_LS" || got[1].Code != "BLGE_LS" {
		t.Fatalf("filtre: %+v", got)
	}
}

func TestArchiveAndVersionIndex(t *testing.T) {
	dir := t.TempDir()
	latest := &curriculum.Plan{
		PlanID: 300, ProgramCode: "ORN_LS", PlanLabel: "Örnek 2026-2027/ Güz Dönemi Sonrası", ValidFrom: "2026-2027 Güz",
		Versions: []curriculum.PlanVersion{{PlanID: 200}, {PlanID: 300, Latest: true}},
		Older:    []*curriculum.Plan{{PlanID: 200, ProgramCode: "ORN_LS", PlanLabel: "Örnek 2021-2022 / Güz ile 2026-2027/ Güz Dönemleri Arası"}},
	}
	copies := archiveCopies(latest)
	if len(copies) != 2 || copies[0].Versions != nil || copies[1].PlanID != 200 {
		t.Fatalf("arşiv kopyaları: %+v", copies)
	}
	if len(latest.Versions) != 2 {
		t.Fatal("arşiv kopyası güncel planın sürüm listesini silmemeli")
	}
	for _, c := range copies {
		raw, _ := json.Marshal(c)
		if err := os.WriteFile(filepath.Join(dir, fmt.Sprintf("%s-%d.json", c.ProgramCode, c.PlanID)), raw, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	idx, err := buildVersionIndex(dir, []*curriculum.Plan{latest})
	if err != nil {
		t.Fatal(err)
	}
	vs := idx["ORN_LS"]
	if len(vs) != 2 || vs[0].ID != 300 || !vs[0].Latest || vs[1].Latest {
		t.Fatalf("dizin: %+v", vs)
	}
	// Eski arşiv dosyasında alan yoksa aralık etiketten çözülür.
	if vs[1].ValidFrom != "2021-2022 Güz" || vs[1].ValidUntil != "2026-2027 Güz" || vs[1].File != "data/curriculum/versions/ORN_LS-200.json" {
		t.Errorf("eski sürüm satırı: %+v", vs[1])
	}
}
