package history

import (
	"reflect"
	"testing"

	"itu-scraper/internal/model"
)

func TestBucket(t *testing.T) {
	cases := []struct{ in, want string }{
		{"Fatih", "f"},
		{"Öztürk", "o"},   // Türkçe harfler ASCII'ye katlanır
		{"Şahin", "s"},
		{"Çelik", "c"},
		{"12345", "0"},
		{"---", "_"},
		{"Zeynep Günay", "z"},
	}
	for _, c := range cases {
		if got := Bucket(c.in); got != c.want {
			t.Errorf("Bucket(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestSplitNames(t *testing.T) {
	cases := []struct{ in string; want []string }{
		{"Esra Baş", []string{"Esra Baş"}},
		{"Esra Baş, Alp Üstündağ", []string{"Esra Baş", "Alp Üstündağ"}},
		{"Abdullah Fişne , / Anıl Soylu", []string{"Abdullah Fişne", "Anıl Soylu"}},
		{"A; B | C", []string{"A", "B", "C"}},
		{"", nil},
		{"***", nil},
		{"-", nil},
		{"  ,  ", nil},
	}
	for _, c := range cases {
		if got := splitNames(c.in); !reflect.DeepEqual(got, c.want) {
			t.Errorf("splitNames(%q) = %v, want %v", c.in, got, c.want)
		}
	}
}

// addInstructor ortak verilen bir şubeyi her hocanın kaydına ekler.
func TestAddInstructorSplitsNames(t *testing.T) {
	idx := &Index{Instructors: map[string]*Instructor{}}
	idx.addInstructor("2025-2026-guz", newSection("Esra Baş, Alp Üstündağ"))
	idx.addInstructor("2025-2026-guz", newSection("Esra Baş"))

	if len(idx.Instructors) != 2 {
		t.Fatalf("2 ayrı hoca bekleniyordu, %d geldi", len(idx.Instructors))
	}
	if got := len(idx.Instructors["Esra Baş"].Rows); got != 2 {
		t.Errorf("Esra Baş iki şubede görünmeli, %d satır", got)
	}
	if got := len(idx.Instructors["Alp Üstündağ"].Rows); got != 1 {
		t.Errorf("Alp Üstündağ tek şubede görünmeli, %d satır", got)
	}
}

func newSection(instructor string) model.Section {
	return model.Section{
		CRN:        "100",
		Code:       "BLG 101E",
		Name:       "Algorithms",
		Instructor: instructor,
		Capacity:   50,
		Enrolled:   40,
	}
}
