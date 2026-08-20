package quota

import (
	"bytes"
	"encoding/json"
	"errors"
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
	written, snap, err := Append(path, secs(50, 10), now, true)
	if err != nil {
		t.Fatal(err)
	}
	if !written || !snap.Full {
		t.Fatalf("ilk ölçüm Full olmalıydı: written=%v full=%v", written, snap.Full)
	}

	// Aynı değerler: dosyaya dokunulmamalı.
	written, _, err = Append(path, secs(50, 10), now.Add(time.Hour), true)
	if err != nil {
		t.Fatal(err)
	}
	if written {
		t.Fatal("değişiklik yokken yazılmamalı")
	}

	// Doluluk değişti: delta yalnızca değişen CRN'i içermeli.
	written, snap, err = Append(path, secs(50, 25), now.Add(2*time.Hour), true)
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

func TestAppendPartialDoesNotRemoveUnseenCRNs(t *testing.T) {
	path := filepath.Join(t.TempDir(), "partial.jsonl")
	t0 := time.Date(2026, 1, 15, 10, 0, 0, 0, time.UTC)
	full := []model.Section{
		{CRN: "A", Capacity: 50, Enrolled: 10},
		{CRN: "B", Capacity: 40, Enrolled: 20},
	}
	if written, _, err := Append(path, full, t0, true); err != nil || !written {
		t.Fatalf("tam temel yazılamadı: written=%v err=%v", written, err)
	}

	// B'nin branşı çekilemedi. A'daki gerçek değişiklik kaydedilmeli, B ise Gone
	// olmadan önceki güvenilir durumuyla korunmalı.
	partial := []model.Section{{CRN: "A", Capacity: 50, Enrolled: 25}}
	written, snap, err := Append(path, partial, t0.Add(30*time.Minute), false)
	if err != nil || !written {
		t.Fatalf("kısmi delta yazılamadı: written=%v err=%v", written, err)
	}
	if len(snap.Gone) != 0 {
		t.Fatalf("kısmi ölçüm görülmeyen CRN'yi kaldırdı: %v", snap.Gone)
	}
	st, _, err := Replay(path)
	if err != nil {
		t.Fatal(err)
	}
	if st.Enr["A"] != 25 || st.Enr["B"] != 20 {
		t.Fatalf("kısmi ölçüm güvenilir durumu bozdu: %+v", st.Enr)
	}
}

func TestAppendRejectsPartialInitialSnapshot(t *testing.T) {
	path := filepath.Join(t.TempDir(), "partial-first.jsonl")
	secs := []model.Section{{CRN: "A", Capacity: 50, Enrolled: 10}}
	written, _, err := Append(path, secs, time.Now(), false)
	if !errors.Is(err, ErrIncompleteInitial) || written {
		t.Fatalf("kısmi ilk ölçüm reddedilmeliydi: written=%v err=%v", written, err)
	}
	if _, statErr := os.Stat(path); !os.IsNotExist(statErr) {
		t.Fatalf("reddedilen ilk ölçüm dosya oluşturmamalı: %v", statErr)
	}
}

func TestSummarizeFills(t *testing.T) {
	path := filepath.Join(t.TempDir(), "t.jsonl")
	t0 := "2026-01-15T10:00:00Z"
	t1 := "2026-01-15T10:30:00Z"
	t2 := "2026-01-15T11:00:00Z"

	// Full: A (20/50), B (39/40 dolu değil), C (10/10 ilk ölçümde dolu).
	// Sonra B 45 ve 50'ye çıkar.
	lines := []string{
		`{"ts":"` + t0 + `","full":true,"cap":{"A":50,"B":40,"C":10},"enr":{"A":20,"B":39,"C":10}}`,
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
	a, b, c := byCRN["A"], byCRN["B"], byCRN["C"]
	if a.FilledAt != "" || a.FillMinutes != 0 {
		t.Errorf("A hiç dolmadı, dolu görünüyor: %+v", a)
	}
	if b.FilledAt != t1 || b.FillMinutes != 30 {
		t.Errorf("B ilk ölçümden 30 dk sonra dolmalı: %+v", b)
	}
	if c.FilledAt != t0 || c.FillMinutes != 0 {
		t.Errorf("C ilk ölçümde dolu: FillMinutes 0 olmalı, %+v", c)
	}

	// JSON serileştirme: FillMinutes > 0 görünür; 0 (ilk ölçümde dolu) omitempty
	// ile düşer — "0 dakikada doldu" yanlış iddiası üretilmez.
	raw, err := json.Marshal(sum)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Contains(raw, []byte(`"fillMinutes":30`)) {
		t.Errorf("fillMinutes:30 JSON'da olmalıydı: %s", raw)
	}
	if bytes.Contains(raw, []byte(`"fillMinutes":0`)) {
		t.Errorf("fillMinutes:0 yazılmamalı (omitempty): %s", raw)
	}
}
