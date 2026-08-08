package term

import "testing"

func TestSlug(t *testing.T) {
	cases := []struct{ in, want string }{
		{"2025-2026 Güz Dönemi", "2025-2026-guz"},
		{"2024-2025 Bahar Dönemi", "2024-2025-bahar"},
		{"2016 - 2017 Yaz Dönemi", "2016-2017-yaz"},
		{"2016___2017_Yaz_Dönemi", "2016-2017-yaz"},
		{"  ", ""},
	}
	for _, c := range cases {
		if got := Slug(c.in); got != c.want {
			t.Errorf("Slug(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestSortKey(t *testing.T) {
	cases := []struct{ in, want string }{
		{"2025-2026-guz", "2025-1"},
		{"2025-2026-bahar", "2025-2"},
		{"2025-2026-yaz", "2025-3"},
		{"2025-2026-unknown", "2025-9"},
		{"2025-2026", "2025-2026"}, // geçersiz biçim olduğu gibi döner
	}
	for _, c := range cases {
		if got := SortKey(c.in); got != c.want {
			t.Errorf("SortKey(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestSortKeyOrdering(t *testing.T) {
	keys := []string{"2023-2024-yaz", "2024-2025-guz", "2024-2025-bahar", "2024-2025-yaz"}
	prev := ""
	for _, k := range keys {
		sk := SortKey(k)
		if sk <= prev {
			t.Errorf("sıra bozuk: %q (%q) <= %q", k, sk, prev)
		}
		prev = sk
	}
}
