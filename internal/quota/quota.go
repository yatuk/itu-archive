// Package quota, kontenjan doluluğunun zaman serisini tutar.
//
// Amaç şu soruya cevap vermek: "bu ders geçen dönem kayıt açıldıktan kaç dakika
// sonra doldu?" OBS anlık sayı veriyor, geçmişi kimse tutmuyor.
//
// Boyut problemi gerçek: 3900 şubelik bir dönemde 15 dakikada bir tam snapshot
// almak haftada 80 MB eder. Onun yerine append-only JSONL tutuyoruz ve her
// satıra yalnızca bir öncekine göre DEĞİŞEN CRN'leri yazıyoruz. Kayıt dışı
// dönemlerde satırlar neredeyse boş kalır, kayıt haftasında yoğunlaşır.
// Append-only olması git diff'ini de temiz tutuyor: her çalıştırma tek satır ekler.
package quota

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"time"

	"itu-scraper/internal/model"
)

// Snapshot, JSONL dosyasındaki tek bir satır.
type Snapshot struct {
	TS string `json:"ts"`
	// Full, ilk satırda ya da kontenjan tanımları değiştiğinde true olur;
	// o satır tam durumu içerir, sonrakiler onun üzerine delta uygular.
	Full bool `json:"full,omitempty"`
	// Cap, yalnızca değişen kontenjanlar (CRN -> kontenjan).
	Cap map[string]int `json:"cap,omitempty"`
	// Enr, yalnızca değişen doluluklar (CRN -> yazılan).
	Enr map[string]int `json:"enr,omitempty"`
	// Gone, bu snapshot'ta artık görünmeyen CRN'ler (şube kapanmış).
	Gone []string `json:"gone,omitempty"`
}

// State, bir dönemin o ana kadarki bilinen durumu.
type State struct {
	Cap map[string]int
	Enr map[string]int
}

func newState() *State {
	return &State{Cap: map[string]int{}, Enr: map[string]int{}}
}

// Path, bir dönemin zaman serisi dosyası.
func Path(root, slug string) string {
	return filepath.Join(root, "data", "quota", slug+".jsonl")
}

// Replay, mevcut dosyayı okuyup son durumu çıkarır. Dosya yoksa boş durum döner.
func Replay(path string) (*State, int, error) {
	st := newState()
	lines := 0

	f, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return st, 0, nil
		}
		return nil, 0, err
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	sc.Buffer(make([]byte, 0, 1<<20), 64<<20)
	for sc.Scan() {
		line := sc.Bytes()
		if len(line) == 0 {
			continue
		}
		var s Snapshot
		if err := json.Unmarshal(line, &s); err != nil {
			return nil, 0, fmt.Errorf("%s satır %d: %w", path, lines+1, err)
		}
		if s.Full {
			st = newState()
		}
		for crn, v := range s.Cap {
			st.Cap[crn] = v
		}
		for crn, v := range s.Enr {
			st.Enr[crn] = v
		}
		for _, crn := range s.Gone {
			delete(st.Cap, crn)
			delete(st.Enr, crn)
		}
		lines++
	}
	return st, lines, sc.Err()
}

// Append, yeni bir ölçümü dosyaya ekler. Değişen hiçbir şey yoksa dosyaya
// dokunmaz ve false döner; böylece sakin dönemlerde boş commit birikmez.
func Append(path string, sections []model.Section, now time.Time) (bool, Snapshot, error) {
	prev, lines, err := Replay(path)
	if err != nil {
		return false, Snapshot{}, err
	}

	snap := Snapshot{
		TS:   now.UTC().Format(time.RFC3339),
		Full: lines == 0,
		Cap:  map[string]int{},
		Enr:  map[string]int{},
	}

	seen := make(map[string]struct{}, len(sections))
	for _, s := range sections {
		seen[s.CRN] = struct{}{}
		if old, ok := prev.Cap[s.CRN]; !ok || old != s.Capacity {
			snap.Cap[s.CRN] = s.Capacity
		}
		if old, ok := prev.Enr[s.CRN]; !ok || old != s.Enrolled {
			snap.Enr[s.CRN] = s.Enrolled
		}
	}
	for crn := range prev.Enr {
		if _, ok := seen[crn]; !ok {
			snap.Gone = append(snap.Gone, crn)
		}
	}
	sort.Strings(snap.Gone)

	if !snap.Full && len(snap.Cap) == 0 && len(snap.Enr) == 0 && len(snap.Gone) == 0 {
		return false, snap, nil
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return false, snap, err
	}
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return false, snap, err
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(snap); err != nil {
		return false, snap, err
	}
	return true, snap, nil
}

// Summary, bir dönemin zaman serisinden türetilen özet. Sitenin okuduğu dosya bu;
// ham JSONL'i tarayıcıya indirtmiyoruz.
type Summary struct {
	Term      string       `json:"term"`
	Slug      string       `json:"slug"`
	Snapshots int          `json:"snapshots"`
	First     string       `json:"first"`
	Last      string       `json:"last"`
	Courses   []CourseFill `json:"courses"`
}

// CourseFill, tek bir şubenin dolma hikayesi.
type CourseFill struct {
	CRN      string `json:"crn"`
	Capacity int    `json:"capacity"`
	Enrolled int    `json:"enrolled"`
	// FilledAt, doluluğun ilk kez kontenjana ulaştığı an. Hiç dolmadıysa boş.
	FilledAt string `json:"filledAt,omitempty"`
	// FillMinutes, ilk ölçümden dolana kadar geçen dakika.
	FillMinutes int `json:"fillMinutes,omitempty"`
}

// Summarize, JSONL'i baştan oynatıp her CRN için dolma anını bulur.
func Summarize(path, term, slug string) (*Summary, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	st := newState()
	filled := map[string]time.Time{}
	var first, last time.Time
	snapshots := 0

	sc := bufio.NewScanner(f)
	sc.Buffer(make([]byte, 0, 1<<20), 64<<20)
	for sc.Scan() {
		if len(sc.Bytes()) == 0 {
			continue
		}
		var s Snapshot
		if err := json.Unmarshal(sc.Bytes(), &s); err != nil {
			return nil, err
		}
		ts, _ := time.Parse(time.RFC3339, s.TS)
		if snapshots == 0 {
			first = ts
		}
		last = ts
		snapshots++

		if s.Full {
			st = newState()
		}
		for crn, v := range s.Cap {
			st.Cap[crn] = v
		}
		for crn, v := range s.Enr {
			st.Enr[crn] = v
			// Dolma anını yalnızca ilk geçişte kaydediyoruz; sonradan kontenjan
			// artırılıp tekrar dolarsa ilk dolma bilgisi korunuyor.
			if _, done := filled[crn]; !done {
				if cap, ok := st.Cap[crn]; ok && cap > 0 && v >= cap {
					filled[crn] = ts
				}
			}
		}
		for _, crn := range s.Gone {
			delete(st.Cap, crn)
			delete(st.Enr, crn)
		}
	}
	if err := sc.Err(); err != nil {
		return nil, err
	}

	sum := &Summary{
		Term: term, Slug: slug, Snapshots: snapshots,
		First: first.Format(time.RFC3339), Last: last.Format(time.RFC3339),
	}
	for crn, cap := range st.Cap {
		cf := CourseFill{CRN: crn, Capacity: cap, Enrolled: st.Enr[crn]}
		if t, ok := filled[crn]; ok {
			cf.FilledAt = t.Format(time.RFC3339)
			cf.FillMinutes = int(t.Sub(first).Minutes())
		}
		sum.Courses = append(sum.Courses, cf)
	}
	sort.Slice(sum.Courses, func(i, j int) bool { return sum.Courses[i].CRN < sum.Courses[j].CRN })
	return sum, nil
}
