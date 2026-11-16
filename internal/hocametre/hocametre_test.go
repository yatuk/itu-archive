package hocametre

import (
	"testing"
	"time"
)

func TestFold(t *testing.T) {
	cases := map[string]string{
		"Nizamettin Aydın":            "nizamettin aydin",
		"nizamettin aydın":            "nizamettin aydin",
		"İSMAİL ÇÖĞÜŞ":                "ismail cogus",
		"Prof. Dr. Nizamettin  Aydın": "nizamettin aydin",
		"Doç. Dr. Ayşe Yılmaz":        "ayse yilmaz",
		"Öğr. Gör. Dr. Ali Veli":      "ali veli",
		"Arş. Gör. Ali Veli":          "ali veli",
		"Dr. Öğr. Üyesi Zeynep Şahin": "zeynep sahin",
		"  Mehmet   Işık ":            "mehmet isik",
	}
	for in, want := range cases {
		if got := Fold(in); got != want {
			t.Errorf("Fold(%q)=%q, istenen %q", in, got, want)
		}
	}
}

func votes(name string, rs ...float64) []APIVote {
	var v []APIVote
	for _, r := range rs {
		v = append(v, APIVote{Rating: r, RatingName: name})
	}
	return v
}

func TestAggregateMergeWeighted(t *testing.T) {
	now := time.Now()
	a := APIItem{Name: "Nizamettin Aydın", Slug: "a1", Ratings: append(votes("IS_HELPFUL", 5, 5, 5), votes("TEACHING_SKILLS", 4)...)}
	b := APIItem{Name: "nizamettin aydın", Slug: "b2", Ratings: votes("IS_HELPFUL", 1)}
	c := APIItem{Name: "Silinmiş Hoca", Slug: "c3", DeletedAt: &now, Ratings: votes("IS_HELPFUL", 5)}
	d := APIItem{Name: "Oysuz Hoca", Slug: "d4"}
	e := APIItem{Name: "Prof. Dr. Ali Veli", Slug: "e5", Ratings: []APIVote{
		{Rating: 3, RatingName: "GIVES_NOTES"},
		{Rating: 1, RatingName: "GIVES_NOTES", DeletedAt: &now},
	}}
	got := Aggregate([]APIItem{b, a, c, d, e})
	if len(got) != 3 {
		t.Fatalf("3 kişi bekleniyordu, %d geldi: %+v", len(got), got)
	}
	if got[0].Key != "ali veli" || got[1].Key != "nizamettin aydin" || got[2].Key != "oysuz hoca" {
		t.Fatalf("sıra/anahtar yanlış: %v %v %v", got[0].Key, got[1].Key, got[2].Key)
	}
	ali := got[0]
	if ali.Ratings["GIVES_NOTES"].N != 1 || ali.Ratings["GIVES_NOTES"].Avg != 3 || ali.Votes != 1 {
		t.Errorf("silinmiş oy atlanmalı: %+v", ali)
	}
	n := got[1]
	if n.Name != "Nizamettin Aydın" {
		t.Errorf("ad: %q", n.Name)
	}
	h := n.Ratings["IS_HELPFUL"]
	if h.N != 4 || h.Avg != 4 { // (15+1)/4
		t.Errorf("ağırlıklı ortalama: %+v", h)
	}
	if n.Votes != 4 {
		t.Errorf("votes: %d", n.Votes)
	}
	// overall: (4 + 4) / 2
	if n.Overall == nil || *n.Overall != 4 {
		t.Errorf("overall: %v", n.Overall)
	}
	if len(n.Slugs) != 2 || n.Slugs[0] != "a1" || n.URL != ProfileURL+"a1" {
		t.Errorf("slugs/url: %v %s", n.Slugs, n.URL)
	}
	o := got[2]
	if o.Votes != 0 || o.Overall != nil || len(o.Ratings) != 0 || o.URL == "" {
		t.Errorf("oysuz: %+v", o)
	}
}

func TestLookup(t *testing.T) {
	ix := NewIndex(time.Now(), []Instructor{
		{Key: "ali veli"}, {Key: "mehmet ali kaya"}, {Key: "mehmet ali demir"},
		{Key: "ayse nur yilmaz"}, {Key: "zeynep sahin"},
	})
	cases := []struct {
		in   string
		want string
	}{
		{"Prof. Dr. Ali Veli", "ali veli"},           // tam
		{"Ayşe Yılmaz", "ayse nur yilmaz"},           // alt küme
		{"Ayşe Nur Deniz Yılmaz", "ayse nur yilmaz"}, // üst küme
		{"Mehmet Ali", ""},                           // belirsiz
		{"Zeynep", ""},                               // tek token
		{"Kimse Yok", ""},
	}
	for _, c := range cases {
		p, ok := ix.Lookup(c.in)
		if c.want == "" {
			if ok {
				t.Errorf("Lookup(%q) bulunmamalıydı: %s", c.in, p.Key)
			}
			continue
		}
		if !ok || p.Key != c.want {
			t.Errorf("Lookup(%q)=%v,%v istenen %q", c.in, p, ok, c.want)
		}
	}
}
