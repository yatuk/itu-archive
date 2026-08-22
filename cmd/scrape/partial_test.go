package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"

	"itu-scraper/internal/model"
	"itu-scraper/internal/store"
)

func TestPartialGateBoundary(t *testing.T) {
	if err := partialGate(21, []string{"BLG: timeout"}); err != nil {
		t.Fatalf("%%5 altı kısmi tarama kabul edilmeliydi: %v", err)
	}
	if err := partialGate(20, []string{"BLG: timeout"}); err == nil {
		t.Fatal("tam %%5 hata oranı yayın kapısını geçti")
	}
	if err := partialGate(0, []string{"BLG: timeout"}); err == nil {
		t.Fatal("boş branş listesi başarılı sayıldı")
	}
	if err := partialGate(0, nil); err != nil {
		t.Fatalf("hatasız boş girdi gereksiz yere reddedildi: %v", err)
	}
}

func TestWriteStatusTracksPerSourceSuccessWithoutRefreshingSkippedSource(t *testing.T) {
	root := t.TempDir()
	st := store.New(root)
	stamp := "2026-08-23T10:00:00Z"
	if err := st.WriteJSON(model.SiteIndex{
		CurrentSlug: "2026-2027-guz",
		Calendars:   []model.CalRef{{YearID: "854", Label: "2026-2027"}},
	}, "data", "index.json"); err != nil {
		t.Fatal(err)
	}
	if err := st.WriteJSON(model.TermMeta{
		Slug: "2026-2027-guz", Sections: 100,
		Provenance: model.Provenance{Provider: "OBS", Endpoint: "courses", LastSuccessfulAt: stamp},
	}, "data", "terms", "2026-2027-guz", "meta.json"); err != nil {
		t.Fatal(err)
	}
	oldExamStamp := "2026-08-20T09:00:00Z"
	if err := st.WriteJSON(map[string]any{
		"sections": 90,
		"sources": map[string]model.Provenance{
			"exams": {Provider: "OBS", Endpoint: "exams", LastSuccessfulAt: oldExamStamp},
		},
	}, "data", "status.json"); err != nil {
		t.Fatal(err)
	}
	if err := writeStatus(st, root, "tam", time.Now()); err != nil {
		t.Fatal(err)
	}
	b, err := os.ReadFile(filepath.Join(root, "data", "status.json"))
	if err != nil {
		t.Fatal(err)
	}
	var got struct {
		SchemaVersion int                         `json:"schemaVersion"`
		PrevSections  int                         `json:"prevSections"`
		Sources       map[string]model.Provenance `json:"sources"`
	}
	if err := json.Unmarshal(b, &got); err != nil {
		t.Fatal(err)
	}
	if got.SchemaVersion != model.DataSchemaVersion || got.PrevSections != 90 {
		t.Fatalf("status sürümü/geçmişi yanlış: %+v", got)
	}
	if got.Sources["courses"].LastSuccessfulAt != stamp {
		t.Fatalf("ders kaynağı başarı zamanı alınmadı: %+v", got.Sources)
	}
	if got.Sources["exams"].LastSuccessfulAt != oldExamStamp {
		t.Fatalf("atlanmış sınav kaynağının son başarısı korunmadı: %+v", got.Sources)
	}
}

func TestSnapshotShrinkGateFailsClosed(t *testing.T) {
	st := store.New(t.TempDir())
	meta := model.TermMeta{Slug: "2026-2027-guz", Sections: 100}
	if err := st.WriteJSON(meta, "data", "terms", meta.Slug, "meta.json"); err != nil {
		t.Fatal(err)
	}
	if err := snapshotShrinkGate(st, meta.Slug, 80); err != nil {
		t.Fatalf("tam %%20 sınırı kabul edilmeliydi: %v", err)
	}
	if err := snapshotShrinkGate(st, meta.Slug, 79); err == nil {
		t.Fatal("%20'den büyük küçülme yayın kapısını geçti")
	}
	if err := snapshotShrinkGate(st, "yeni-donem", 1); err != nil {
		t.Fatalf("yeni dönem önceki snapshot gerektirmemeli: %v", err)
	}
	path := st.Path("data", "terms", meta.Slug, "meta.json")
	if err := os.WriteFile(path, []byte("{"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := snapshotShrinkGate(st, meta.Slug, 100); err == nil {
		t.Fatal("bozuk önceki meta üzerine yazmaya izin verdi")
	}
}
