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
	if len(empty.faq()) != 0 || empty.faqSchema() != nil || calendarLead(empty, 0) != "" {
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
	b := &Builder{l: langTR}
	html := string(b.renderLanding(landingLayout{H1: "x", CTA: landingAction{href: "/#takvim", label: "Aç"}, FAQ: qa}))
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

func TestCalendarToolRendersEveryEventGroupedByMonth(t *testing.T) {
	events := testCalendarEvents()
	rows := calRows(events)
	if len(rows) != len(events) {
		t.Fatalf("satır sayısı %d, olay %d", len(rows), len(events))
	}
	h := calendarToolHTML("2026-2027", "2026-11-15", "854", rows)
	if got := strings.Count(h, `<tr data-s="`); got != len(events) {
		t.Errorf("tabloda %d olay satırı var, %d bekleniyordu", got, len(events))
	}
	for _, want := range []string{
		`data-src="/data/calendar/lisans/854.json"`,
		`<tr class="lp-cal-mo" data-m="2026-09"><td colspan="3">Eylül 2026<span class="lp-cal-c">2</span>`,
		`data-s="2027-01-02" data-e="2027-01-17" data-k="sinav"`,
		`<td class="lp-cal-dt">2–17 Oca 2027</td>`,
		"Güz Yarıyılı Sonu Sınavları",
		// Sunucu yedeği: tarama tarihine göre süren ve sıradaki olaylar.
		"15 Kasım 2026 taramasına göre", "Süren etkinlik yok.", "Güz Yarıyılı Sınav Programının İlanı",
		`data-lp-cal-tools hidden`, `data-k="donem" aria-pressed="false">Tatil ve dönem<span class="lp-n">3</span>`,
	} {
		if !strings.Contains(h, want) {
			t.Errorf("takvim bloğu %q içermeli", want)
		}
	}
	if strings.Contains(h, "—") {
		t.Error("em dash yasak")
	}
	lead := string(calendarLead(buildCalendarSummary("2026-2027", "2026-11-15", events), len(rows)))
	if !strings.Contains(lead, "Güz finalleri <b>2–17 Ocak 2027</b> tarihleri arasında") || !strings.Contains(lead, "bahar dönemi <b>1 Şubat 2027</b>") {
		t.Errorf("giriş cümlesi = %q", lead)
	}
}

func TestCalendarKindsAndShortTitles(t *testing.T) {
	cases := map[string]string{
		"İTÜ Açılış Tarihi":                    "donem",
		"Güz Yarıyılı Sonu":                    "donem",
		"Güz Yarıyılı Sonu Sınavları":          "sinav",
		"2. Sınıf Öğrencilerin WEB Ders Kaydı": "kayit",
		"Ara Tatil":                      "donem",
		"MasterBee Programı Başvuruları": "",
	}
	for title, want := range cases {
		if got := strings.Join(calKinds(title), " "); got != want {
			t.Errorf("calKinds(%q) = %q, beklenen %q", title, got, want)
		}
	}
	long := "YKS Sınav Sonucu Üniversitemiz Lisans Programlarına Yerleştirilen Denizcilik Fakültesi, İTÜ-KKTC ve UOLP-Uluslararası Ortak Lisans Programı Öğrencilerinin Elektronik Kayıtları ( Link )"
	short := calShortTitle(long)
	if strings.Contains(short, "Link") || utf8.RuneCountInString(short) > 81 || !strings.HasSuffix(short, "…") {
		t.Errorf("kısaltma = %q", short)
	}
	if got := calShortTitle("Kapatılacak Derslerin Fakülteler Tarafından ÖİDB'ye Bildirilmesi"); got != "Kapatılacak Derslerin: fakültelerce ÖİDB'ye bildirim" {
		t.Errorf("kısaltma = %q", got)
	}
	for in, want := range map[[2]string]string{
		{"2027-01-02", "2027-01-17"}: "2–17 Oca 2027",
		{"2026-11-23", "2026-12-31"}: "23 Kas–31 Ara 2026",
		{"2026-12-28", "2027-01-02"}: "28 Ara 2026–2 Oca 2027",
		{"2026-07-09", "2026-07-09"}: "9 Tem 2026",
	} {
		if got := shortDateRange(in[0], in[1]); got != want {
			t.Errorf("shortDateRange(%v) = %q, beklenen %q", in, got, want)
		}
	}
}
