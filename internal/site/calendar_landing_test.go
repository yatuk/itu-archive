package site

import (
	"encoding/json"
	"strings"
	"testing"
	"unicode/utf8"

	"itu-scraper/internal/model"
)

func testCalendarEvents() []model.CalendarEvent {
	return []model.CalendarEvent{
		{Title: "Güz Yarıyılı Başlangıcı", Start: "2026-09-28", End: "2026-09-28"},
		{Title: "Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse Yazılma", Start: "2026-09-28", End: "2026-10-09"},
		{Title: "Ara Tatil", Start: "2026-11-16", End: "2026-11-20"},
		{Title: "Güz Yarıyılı Sınav Programının İlanı", Start: "2026-12-01", End: "2026-12-01"},
		{Title: "Güz Yarıyılı Sonu Sınavları", Start: "2027-01-02", End: "2027-01-17"},
		{Title: "4. Sınıf Öğrencilerin WEB Ders Kaydı", Start: "2027-01-26", End: "2027-01-26"},
		{Title: "2. Sınıf Öğrencilerin WEB Ders Kaydı", Start: "2027-01-27", End: "2027-01-27"},
		{Title: "Bahar Yarıyılı Başlangıcı", Start: "2027-02-01", End: "2027-02-01"},
		{Title: "Ders Planındaki Derslerden Birisini Bırakıp Bir Başka Derse Yazılma", Start: "2027-02-01", End: "2027-02-12"},
		{Title: "Bir Dersten Tümüyle Çekilme (T)", Start: "2027-02-15", End: "2027-02-19"},
	}
}

func TestBuildCalendarSummary(t *testing.T) {
	s := buildCalendarSummary("2026-2027", "2026-11-15", testCalendarEvents())
	if s.Finals == nil || s.Finals.dates() != "2–17 Ocak 2027" || s.Finals.Season != "Güz" {
		t.Fatalf("final dönemi yanlış: %+v", s.Finals)
	}
	if s.Start == nil || s.Start.Season != "Bahar" || s.Start.dates() != "1 Şubat 2027" {
		t.Fatalf("dönem başlangıcı yanlış: %+v", s.Start)
	}
	// Biten Güz ekleme-bırakma atlanır, yaklaşan Bahar dönemi seçilir.
	if s.AddDrop == nil || s.AddDrop.Season != "Bahar" || s.AddDrop.dates() != "1–12 Şubat 2027" {
		t.Fatalf("ekleme-bırakma yanlış: %+v", s.AddDrop)
	}
	if s.Register == nil || s.Register.dates() != "26–27 Ocak 2027" {
		t.Fatalf("kayıt yanlış: %+v", s.Register)
	}
	if len(s.Upcoming) != 3 {
		t.Fatalf("üç yaklaşan olay bekleniyordu: %+v", s.Upcoming)
	}
	if s.Upcoming[0].Label != "Ara tatil" || s.Upcoming[1].Label != "Güz sınav programı ilanı" {
		t.Errorf("sıra yanlış: %+v", s.Upcoming)
	}
	for _, e := range s.Upcoming {
		if e.Label == s.Finals.Label {
			t.Errorf("final dönemi yaklaşan listede tekrarlanmamalı: %+v", s.Upcoming)
		}
	}
}

func TestBuildCalendarSummarySkipsPastEvents(t *testing.T) {
	s := buildCalendarSummary("2026-2027", "2027-01-20", testCalendarEvents())
	if s.Finals != nil || s.Exam != nil {
		t.Errorf("biten olaylar özete girmemeli: %+v %+v", s.Finals, s.Exam)
	}
	if s.Start == nil || s.Start.Season != "Bahar" {
		t.Errorf("Bahar başlangıcı bekleniyordu: %+v", s.Start)
	}
	empty := buildCalendarSummary("2026-2027", "2030-01-01", testCalendarEvents())
	if empty.summaryHTML() != "" || empty.faqHTML() != "" || empty.faqSchema() != nil {
		t.Error("veri yokken özet ve SSS boş olmalı")
	}
}

func TestCalendarTitleAndDescription(t *testing.T) {
	s := buildCalendarSummary("2026-2027", "2026-11-15", testCalendarEvents())
	if got := calendarTitle(s.Year); got != "İTÜ Akademik Takvim 2026-2027 ve Final Takvimi" {
		t.Errorf("başlık = %q", got)
	}
	d := calendarDescription(s)
	if !strings.Contains(d, "2026-2027") || !strings.Contains(strings.ToLower(d), "final takvimi") || !strings.Contains(d, "2–17 Ocak 2027") {
		t.Errorf("açıklama eksik: %q", d)
	}
	if n := utf8.RuneCountInString(d); n > descMaxRunes {
		t.Errorf("açıklama %d karakter", n)
	}
	if strings.Contains(d, "—") {
		t.Errorf("em dash yasak: %q", d)
	}
	// Veri olmadan da final takvimi ifadesi korunur.
	if d := calendarDescription(calSummary{Year: "2026-2027"}); !strings.Contains(d, "final takvimi") {
		t.Errorf("yedek açıklama final takvimini anmalı: %q", d)
	}
}

func TestCalendarFAQMatchesSchemaAndPage(t *testing.T) {
	s := buildCalendarSummary("2026-2027", "2026-11-15", testCalendarEvents())
	qa := s.faq()
	if len(qa) < 3 || len(qa) > 4 {
		t.Fatalf("3-4 soru bekleniyordu: %d", len(qa))
	}
	html := s.faqHTML()
	raw, err := json.Marshal(s.faqSchema())
	if err != nil {
		t.Fatal(err)
	}
	for _, it := range qa {
		if !strings.Contains(html, it.q) {
			t.Errorf("soru sayfada görünmüyor: %q", it.q)
		}
		if !strings.Contains(string(raw), it.q) {
			t.Errorf("soru şemada yok: %q", it.q)
		}
		if strings.Contains(it.q+it.a, "—") {
			t.Errorf("em dash yasak: %q", it.a)
		}
	}
	if !strings.Contains(qa[0].a, "2–17 Ocak 2027") || !strings.Contains(qa[0].a, "1 Aralık 2026") {
		t.Errorf("final cevabı tarihleri içermeli: %q", qa[0].a)
	}
	if !strings.Contains(string(raw), `"FAQPage"`) {
		t.Error("FAQPage türü eksik")
	}
}

func TestCalendarSummaryHTMLLinksTabs(t *testing.T) {
	s := buildCalendarSummary("2026-2027", "2026-11-15", testCalendarEvents())
	h := s.summaryHTML()
	for _, want := range []string{`href="/#takvim"`, `href="/#sinavlar"`, "Güz finalleri", "15 Kasım 2026"} {
		if !strings.Contains(h, want) {
			t.Errorf("özet %q içermeli: %s", want, h)
		}
	}
}
