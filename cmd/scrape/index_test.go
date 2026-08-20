package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"itu-scraper/internal/model"
	"itu-scraper/internal/store"
)

func TestWriteIndexKeepsExactlyOneLiveTerm(t *testing.T) {
	root := t.TempDir()
	st := store.New(root)
	old := model.TermMeta{
		Term: "2026-2027 Güz Dönemi", Slug: "2026-2027-guz",
		ScrapedAt: "2026-08-20T00:00:00Z", Source: store.Source, Live: true,
		Sections: 4000,
	}
	current := model.TermMeta{
		Term: "2026-2027 Bahar Dönemi", Slug: "2026-2027-bahar",
		ScrapedAt: "2027-01-20T00:00:00Z", Source: store.Source, Live: true,
		Sections: 4200, Partial: true, FailedBranches: []string{"ZZZ"},
		Stats: model.SiteStats{Sections: 4200, Courses: 1800},
	}
	for _, meta := range []model.TermMeta{old, current} {
		if err := st.WriteJSON(meta, "data", "terms", meta.Slug, "meta.json"); err != nil {
			t.Fatal(err)
		}
	}

	if err := writeIndex(root, st, current.Slug); err != nil {
		t.Fatal(err)
	}

	readMeta := func(slug string) model.TermMeta {
		t.Helper()
		var meta model.TermMeta
		b, err := os.ReadFile(filepath.Join(root, "data", "terms", slug, "meta.json"))
		if err != nil {
			t.Fatal(err)
		}
		if err := json.Unmarshal(b, &meta); err != nil {
			t.Fatal(err)
		}
		return meta
	}
	if readMeta(old.Slug).Live {
		t.Fatal("eski dönem live olarak kaldı")
	}
	if !readMeta(current.Slug).Live {
		t.Fatal("istenen aktif dönem live değil")
	}

	var ix model.SiteIndex
	b, err := os.ReadFile(filepath.Join(root, "data", "index.json"))
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(b, &ix); err != nil {
		t.Fatal(err)
	}
	if ix.CurrentSlug != current.Slug || ix.CurrentTerm != current.Term {
		t.Fatalf("aktif dönem yanlış: %+v", ix)
	}
	live := 0
	for _, ref := range ix.Terms {
		if ref.Live {
			live++
		}
		if ref.Slug == current.Slug {
			if !ref.Partial || len(ref.FailedBranches) != 1 || ref.FailedBranches[0] != "ZZZ" {
				t.Fatalf("kısmi tarama bilgisi indekse taşınmadı: %+v", ref)
			}
		}
	}
	if live != 1 {
		t.Fatalf("indekste bir live dönem bekleniyordu, %d bulundu", live)
	}
}
