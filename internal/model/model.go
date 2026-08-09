// Package model, scraper'ın ürettiği veri tiplerini tanımlar.
// JSON etiketleri doğrudan site tarafından tüketiliyor, değiştirirken docs/assets/app.js'e bak.
package model

// Section, bir dersin tek bir şubesi (CRN). OBS tablosundaki bir satıra karşılık gelir.
// Çoklu oturumu olan derslerde Days/Times/Rooms/Buildings aynı uzunlukta paralel dizilerdir.
type Section struct {
	CRN        string   `json:"crn"`
	Code       string   `json:"code"`   // "BIL 100E"
	Branch     string   `json:"branch"` // "BIL"
	Level      string   `json:"level"`  // OL | LS | LU | LUI
	Name       string   `json:"name"`
	Method     string   `json:"method"`
	Instructor string   `json:"instructor"`
	Buildings  []string `json:"buildings"`
	Days       []string `json:"days"`
	Times      []string `json:"times"`
	Rooms      []string `json:"rooms"`
	Capacity   int      `json:"capacity"`
	Enrolled   int      `json:"enrolled"`
	Reserved   string   `json:"reserved"`
	Programs   []string `json:"programs"`
	Prereq     string   `json:"prereq"`
	ClassReq   string   `json:"classReq"`
}

// BranchMeta, bir branş kodunun dönem içindeki özeti. Aynı kod hem lisans hem
// lisansüstünde geçebildiği için seviye bir liste.
type BranchMeta struct {
	Code     string   `json:"code"`
	Levels   []string `json:"levels"`
	Sections int      `json:"sections"`
}

// TermMeta, docs/data/terms/<slug>/meta.json içeriği.
type TermMeta struct {
	Term      string       `json:"term"`
	Slug      string       `json:"slug"`
	ScrapedAt string       `json:"scrapedAt"`
	Source    string       `json:"source"` // veri kaynağı etiketi (site: "itu-archive")
	Live      bool         `json:"live,omitempty"` // aktif dönem mi (canlı tarama)
	Sections  int          `json:"sections"`
	Courses   int          `json:"courses"`
	Branches  []BranchMeta `json:"branches"`
	Stats     SiteStats    `json:"stats"`
}

// Exam, final sınav takvimindeki tek bir satır.
type Exam struct {
	CRN        string `json:"crn"`
	Code       string `json:"code"`   // "BIL 100E"
	Branch     string `json:"branch"` // "BIL"
	Name       string `json:"name"`
	Instructor string `json:"instructor"`
	Type       string `json:"type"`  // "Final Sınavı", "Mazeret Sınavı", ...
	Place      string `json:"place"` // "Ayazağa/İnşaat Binası-D100"
	Day        string `json:"day"`
	Time       string `json:"time"` // "09:00-11:00"
	Date       string `json:"date"` // "10 Ağustos 2026"
}

// ExamSchedule, bir dönemin sınav takvimi.
type ExamSchedule struct {
	Term      string `json:"term"`
	Slug      string `json:"slug"`
	ScrapedAt string `json:"scrapedAt"`
	Exams     []Exam `json:"exams"`
}

// PrereqNode, önşart grafiğindeki tek bir ders. Katalogdaki her ders bir düğüm;
// önşartı olmayanlar da (başka bir dersin önşartı olabildikleri için) dahil.
type PrereqNode struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Branch      string `json:"branch"`
	Requirement string `json:"requirement,omitempty"` // ham ifade, detay paneli için
	ClassReq    string `json:"classReq,omitempty"`
}

// PrereqEdge: From dersi, To dersinin önşartı.
type PrereqEdge struct {
	From string `json:"from"`
	To   string `json:"to"`
}

// PrereqGraph, docs/data/prereq/graph.json içeriği.
type PrereqGraph struct {
	GeneratedAt string       `json:"generatedAt"`
	Nodes       []PrereqNode `json:"nodes"`
	Edges       []PrereqEdge `json:"edges"`
}

// CalendarEvent, akademik takvimdeki tek bir satır.
type CalendarEvent struct {
	Table     string `json:"table"` // tabloyu açan başlık: "Güz Dönemi", "Yaz Okulu", ...
	Title     string `json:"title"`
	Date      string `json:"date"`
	Remaining string `json:"remaining"`
}

// Calendar, bir akademik yılın tüm takvim satırları.
type Calendar struct {
	Year      string          `json:"year"`   // "2026-2027 Eğitim - Öğretim Yılı"
	YearID    string          `json:"yearId"` // akademikyil parametresi
	ScrapedAt string          `json:"scrapedAt"`
	Events    []CalendarEvent `json:"events"`
}

// SiteIndex, docs/data/index.json — sitenin açılışta çektiği tek dosya.
type SiteIndex struct {
	CurrentTerm string    `json:"currentTerm"`
	CurrentSlug string    `json:"currentSlug"`
	ScrapedAt   string    `json:"scrapedAt"`
	Terms       []TermRef `json:"terms"`
	Calendars   []CalRef  `json:"calendars"`
	Stats       SiteStats `json:"stats"`
}

type TermRef struct {
	Slug      string `json:"slug"`
	Label     string `json:"label"`
	ScrapedAt string `json:"scrapedAt"`
	Source    string `json:"source"` // "itu-archive"
	Live      bool   `json:"live,omitempty"` // aktif dönem (canlı) işareti
	Sections  int    `json:"sections"`
	Missing   bool   `json:"missing,omitempty"` // veri bulunamayan dönem (arşiv boşluğu)
}

type CalRef struct {
	YearID string `json:"yearId"`
	Label  string `json:"label"`
	Events int    `json:"events"`
}

type SiteStats struct {
	Sections    int `json:"sections"`
	Courses     int `json:"courses"`
	Branches    int `json:"branches"`
	Instructors int `json:"instructors"`
	Capacity    int `json:"capacity"`
	Enrolled    int `json:"enrolled"`
}
