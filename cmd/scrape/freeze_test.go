package main

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"itu-scraper/internal/model"
	"itu-scraper/internal/store"
)

func TestTermFreeze(t *testing.T) {
	const slug = "2026-2027-guz"
	setup := func(t *testing.T, scrapedAt string, partial, withCalendar bool) string {
		t.Helper()
		root := t.TempDir()
		st := store.New(root)
		meta := model.TermMeta{
			Term: "2026-2027 Güz Dönemi", Slug: slug, ScrapedAt: scrapedAt,
			Source: store.Source, Live: true, Sections: 5500, Partial: partial,
		}
		if err := st.WriteJSON(meta, "data", "terms", slug, "meta.json"); err != nil {
			t.Fatal(err)
		}
		if err := st.WriteJSON(model.SiteIndex{CurrentSlug: slug}, "data", "index.json"); err != nil {
			t.Fatal(err)
		}
		if withCalendar {
			dir := filepath.Join(root, "data", "calendar", "lisans")
			if err := os.MkdirAll(dir, 0o755); err != nil {
				t.Fatal(err)
			}
			// Gerçek veri gibi: iki ekle-bırak satırı da "Güz Dönemi" tablosunda.
			body := `{"year":"2026-2027 Eğitim - Öğretim Yılı","yearId":"854","events":[
{"table":"Güz Dönemi","title":"Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse Yazılma","start":"2026-09-28","end":"2026-10-09"},
{"table":"Güz Dönemi","title":"Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse Yazılma","start":"2027-02-01","end":"2027-02-12"}]}`
			if err := os.WriteFile(filepath.Join(dir, "854.json"), []byte(body), 0o644); err != nil {
				t.Fatal(err)
			}
		}
		return root
	}
	at := func(s string) time.Time {
		v, err := time.Parse(time.RFC3339, s)
		if err != nil {
			t.Fatal(err)
		}
		return v
	}

	cases := []struct {
		name         string
		now, scraped string
		partial, cal bool
		wantFrozen   bool
		wantEnd      string
	}{
		{"ekle-bırak sürerken", "2026-10-05T02:17:00Z", "2026-09-28T02:20:00Z", false, true, false, "2026-10-09"},
		{"bitişten sonraki ilk pazartesi", "2026-10-12T02:17:00Z", "2026-10-05T09:05:14Z", false, true, false, "2026-10-09"},
		{"bitiş sonrası tam tarama var", "2026-10-19T02:17:00Z", "2026-10-12T02:20:00Z", false, true, true, "2026-10-09"},
		{"bitiş sonrası tarama kısmi", "2026-10-19T02:17:00Z", "2026-10-12T02:20:00Z", true, true, false, "2026-10-09"},
		{"takvim yok", "2026-10-19T02:17:00Z", "2026-10-12T02:20:00Z", false, false, false, ""},
	}
	for _, c := range cases {
		root := setup(t, c.scraped, c.partial, c.cal)
		got := termFreeze(root, at(c.now))
		if got.Frozen != c.wantFrozen || got.AddDropEnd != c.wantEnd {
			t.Errorf("%s: termFreeze = %+v, want frozen=%v addDropEnd=%q", c.name, got, c.wantFrozen, c.wantEnd)
		}
	}

	if got := termFreeze(t.TempDir(), at("2026-10-19T02:17:00Z")); got != (freezeInfo{}) {
		t.Errorf("index.json yokken sıfır değer beklenir, got %+v", got)
	}
}
