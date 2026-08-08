package quota

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"itu-scraper/internal/model"
)

func TestReplayNonexistent(t *testing.T) {
	st, lines, err := Replay(filepath.Join(t.TempDir(), "yok.jsonl"))
	if err != nil {
		t.Fatal(err)
	}
	if lines != 0 || len(st.Cap) != 0 {
		t.Errorf("boş durum bekleniyordu: lines=%d cap=%v", lines, st.Cap)
	}
}

func TestAppendLifecycle(t *testing.T) {
	path := filepath.Join(t.TempDir(), "2025-2026-guz.jsonl")
	now := time.Date(2026, 1, 15, 10, 0, 0, 0, time.UTC)

	secs := func(cap, enr int) []model.Section {
		return []model.Section{{CRN: "100", Capacity: cap, Enrolled: enr}}
	}

	// İlk ölçüm: dosya yok, Full snapshot.
	written, snap, err := Append(path, secs(50, 10), now)
	if err != nil {
		t.Fatal(err)
	}
	if !written || !snap.Full {
		t.Fatalf("ilk ölçüm Full olmalıydı: written=%v full=%v", written, snap.Full)
	}

	// Aynı değerler: dosyaya dokunulmamalı.
	written, _, err = Append(path, secs(50, 10), now.Add(time.Hour))
	if err != nil {
		t.Fatal(err)
	}
	if written {
		t.Fatal("değişiklik yokken yazılmamalı")
	}

	// Doluluk değişti: delta yalnızca değişen CRN'i içermeli.
	written, snap, err = Append(path, secs(50, 25), now.Add(2*time.Hour))
	if err != nil {
		t.Fatal(err)
	}
	if !written || snap.Full {
		t.Fatalf("delta snapshot bekleniyordu: written=%v full=%v", written, snap.Full)
	}
	if snap.Enr["100"] != 25 || len(snap.Enr) != 1 || len(snap.Cap) != 0 {
		t.Errorf("delta yanlış: %+v", snap)
	}

	st, lines, err := Replay(path)
	if err != nil {
		t.Fatal(err)
	}
	if lines != 2 {
		t.Errorf("2 satır bekleniyordu, %d var", lines)
	}
	if st.Enr["100"] != 25 || st.Cap["100"] != 50 {
		t.Errorf("son durum yanlış: %+v", st)
	}
}

func TestSummarizeFills(t *testing.T) {
	path := filepath.Join(t.TempDir(), "t.jsonl")
	t0 := "2026-01-15T10:00:00Z"
	t1 := "2026-01-15T10:30:00Z"
	t2 := "2026-01-15T11:00:00Z"

	// Full: A (20/50), B (39/40 dolu değil). Sonra B 45 ve 50'ye çıkar.
	lines := []string{
		`{"ts":"` + t0 + `","full":true,"cap":{"A":50,"B":40},"enr":{"A":20,"B":39}}`,
		`{"ts":"` + t1 + `","enr":{"B":45}}`,
		`{"ts":"` + t2 + `","enr":{"B":50}}`,
	}
	data := ""
	for _, l := range lines {
		data += l + "\n"
	}
	if err := os.WriteFile(path, []byte(data), 0o644); err != nil {
		t.Fatal(err)
	}

	sum, err := Summarize(path, "2025-2026 Güz Dönemi", "2025-2026-guz")
	if err != nil {
		t.Fatal(err)
	}
	if sum.Snapshots != 3 || sum.First != t0 || sum.Last != t2 {
		t.Errorf("üst bilgi yanlış: %+v", sum)
	}
	byCRN := map[string]CourseFill{}
	for _, c := range sum.Courses {
		byCRN[c.CRN] = c
	}
	a, b := byCRN["A"], byCRN["B"]
	if a.FilledAt != "" || a.FillMinutes != 0 {
		t.Errorf("A hiç dolmadı, dolu görünüyor: %+v", a)
	}
	if b.FilledAt != t1 || b.FillMinutes != 30 {
		t.Errorf("B ilk ölçümden 30 dk sonra dolmalı: %+v", b)
	}
}
