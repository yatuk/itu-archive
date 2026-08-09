// Package store, scraper çıktısını GitHub Pages'in servis edeceği statik
// dosyalara yazar.
//
// Düzen:
//
//	docs/data/index.json                       -> site açılışta bunu çeker
//	docs/data/terms/<slug>/meta.json           -> branş listesi + istatistik
//	docs/data/terms/<slug>/search.json         -> hafif arama indeksi
//	docs/data/terms/<slug>/branches/<KOD>.json -> talep üzerine yüklenen tam kayıt
//	docs/data/terms/<slug>/all.csv             -> tek dosya döküm
//	docs/data/calendar/<yil>.json              -> akademik takvim
//
// Branş bazlı bölmenin iki nedeni var: tarayıcı 10 MB'lık tek dosya indirmesin,
// ve git diff'leri "hangi branşta ne değişti" sorusuna okunabilir cevap versin.
package store

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"itu-scraper/internal/history"
	"itu-scraper/internal/model"
)

type Store struct{ root string }

func New(root string) *Store { return &Store{root: root} }

func (s *Store) path(parts ...string) string {
	return filepath.Join(append([]string{s.root}, parts...)...)
}

// WriteJSON, deterministik (girintili, sıralı) JSON yazar. Girinti şart:
// tek satırlık JSON'da git diff'i işe yaramaz hale geliyor.
func (s *Store) WriteJSON(v any, parts ...string) error {
	p := s.path(parts...)
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		return err
	}
	f, err := os.Create(p)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", " ")
	enc.SetEscapeHTML(false)
	return enc.Encode(v)
}

// Source, üretilen tüm veride kullanılan kaynak etiketi.
const Source = "itu-archive"

// WriteTerm, bir dönemin tüm dosyalarını yazar ve meta'sını döndürür.
// live, dönemin aktif (canlı) taranmış dönem olup olmadığını işaretler.
func (s *Store) WriteTerm(label, slug, scrapedAt string, live bool, sections []model.Section) (*model.TermMeta, error) {
	// OBS ve tarihsel dökümler zaman zaman aynı şubeyi iki kez döndürüyor
	// (ör. itutakvimci CSV'lerinde birebir tekrar eden satırlar). CRN site
	// tarafında detay aramasının ve kontenjan zaman serisinin anahtarı, aynı
	// branş içinde tekrar olmamalı. Dikkat: CRN yalnızca branş içinde
	// benzersiz — çapraz listelenen dersler (aynı CRN, farklı branş kodu)
	// meşru ve korunmalı, o yüzden anahtar (branş, CRN).
	sections = dedupe(sections)

	byBranch := map[string][]model.Section{}
	for _, sec := range sections {
		byBranch[sec.Branch] = append(byBranch[sec.Branch], sec)
	}

	branches := make([]model.BranchMeta, 0, len(byBranch))
	for code, secs := range byBranch {
		sort.Slice(secs, func(i, j int) bool { return secs[i].CRN < secs[j].CRN })
		if err := s.WriteJSON(secs, "data", "terms", slug, "branches", code+".json"); err != nil {
			return nil, err
		}
		levelSet := map[string]bool{}
		for _, sec := range secs {
			if sec.Level != "" {
				levelSet[sec.Level] = true
			}
		}
		levels := make([]string, 0, len(levelSet))
		for lv := range levelSet {
			levels = append(levels, lv)
		}
		sort.Strings(levels)
		branches = append(branches, model.BranchMeta{Code: code, Levels: levels, Sections: len(secs)})
	}
	sort.Slice(branches, func(i, j int) bool { return branches[i].Code < branches[j].Code })

	meta := &model.TermMeta{
		Term:      label,
		Slug:      slug,
		ScrapedAt: scrapedAt,
		Source:    Source,
		Live:      live,
		Sections:  len(sections),
		Courses:   countDistinct(sections, func(s model.Section) string { return s.Code }),
		Branches:  branches,
		Stats:     Stats(sections),
	}
	if err := s.WriteJSON(meta, "data", "terms", slug, "meta.json"); err != nil {
		return nil, err
	}
	if err := s.writeSearchIndex(slug, sections); err != nil {
		return nil, err
	}
	if err := s.writeCSV(slug, sections); err != nil {
		return nil, err
	}
	return meta, nil
}

// writeSearchIndex, tarayıcıda anlık arama için sıkıştırılmış bir dizi yazar.
// Nesne yerine dizi kullanmak dosyayı yaklaşık yarıya indiriyor.
// Alanlar: [crn, kod, ad, branş, öğretim üyesi, gün|saat, kontenjan, yazılan,
// seviye, yöntem, alabilen programlar[]]
// Son üç alan filtreler için; tarihsel dönemlerde boş olabilir ve önceki veride
// hiç bulunmayabilir — istemci yoksa yokmuş gibi davranır.
func (s *Store) writeSearchIndex(slug string, sections []model.Section) error {
	idx := make([][]any, 0, len(sections))
	for _, sec := range sections {
		when := make([]string, 0, len(sec.Days))
		for i, d := range sec.Days {
			t := ""
			if i < len(sec.Times) {
				t = sec.Times[i]
			}
			when = append(when, strings.TrimSpace(d+" "+t))
		}
		idx = append(idx, []any{
			sec.CRN, sec.Code, sec.Name, sec.Branch, sec.Instructor,
			strings.Join(when, " | "), sec.Capacity, sec.Enrolled, sec.Level, sec.Method, sec.Programs,
		})
	}
	return s.WriteJSON(idx, "data", "terms", slug, "search.json")
}

func (s *Store) writeCSV(slug string, sections []model.Section) error {
	p := s.path("data", "terms", slug, "all.csv")
	if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
		return err
	}
	f, err := os.Create(p)
	if err != nil {
		return err
	}
	defer f.Close()
	if _, err := f.WriteString("\xef\xbb\xbf"); err != nil { // Excel için BOM
		return err
	}
	w := csv.NewWriter(f)
	defer w.Flush()
	if err := w.Write([]string{
		"CRN", "Ders Kodu", "Branş", "Seviye", "Ders Adı", "Öğretim Yöntemi", "Öğretim Üyesi",
		"Bina", "Gün", "Saat", "Derslik", "Kontenjan", "Yazılan", "Rezervasyon",
		"Alabilen Programlar", "Önşart", "Sınıf/Kredi Önşartı",
	}); err != nil {
		return err
	}
	for _, s := range sections {
		if err := w.Write([]string{
			s.CRN, s.Code, s.Branch, s.Level, s.Name, s.Method, s.Instructor,
			strings.Join(s.Buildings, " | "), strings.Join(s.Days, " | "),
			strings.Join(s.Times, " | "), strings.Join(s.Rooms, " | "),
			strconv.Itoa(s.Capacity), strconv.Itoa(s.Enrolled), s.Reserved,
			strings.Join(s.Programs, ", "), s.Prereq, s.ClassReq,
		}); err != nil {
			return err
		}
	}
	return w.Error()
}

// WriteExams, bir dönemin sınav takvimini yazar.
func (s *Store) WriteExams(sched *model.ExamSchedule) error {
	return s.WriteJSON(sched, "data", "exams", sched.Slug+".json")
}

// WriteHistory, geçmiş indekslerini diske döker.
//
// Bölme mantığı arama akışını takip ediyor: site açılışta yalnızca iki hafif
// liste (codes.json, names.json) indiriyor, kullanıcı bir derse ya da hocaya
// tıklayınca ilgili branş/harf dosyası geliyor.
func (s *Store) WriteHistory(idx *history.Index) error {
	byBranch := map[string]map[string]*history.Course{}
	codes := make([][]any, 0, len(idx.Courses))
	for code, c := range idx.Courses {
		branch := code
		if i := strings.IndexByte(code, ' '); i > 0 {
			branch = code[:i]
		}
		if byBranch[branch] == nil {
			byBranch[branch] = map[string]*history.Course{}
		}
		byBranch[branch][code] = c
		codes = append(codes, []any{code, c.Name, branch, len(c.Terms)})
	}
	sort.Slice(codes, func(i, j int) bool { return codes[i][0].(string) < codes[j][0].(string) })

	for branch, courses := range byBranch {
		if err := s.WriteJSON(courses, "data", "history", "courses", branch+".json"); err != nil {
			return err
		}
	}
	if err := s.WriteJSON(codes, "data", "history", "codes.json"); err != nil {
		return err
	}

	byBucket := map[string]map[string]*history.Instructor{}
	names := make([][]any, 0, len(idx.Instructors))
	for name, in := range idx.Instructors {
		terms := map[string]struct{}{}
		for _, r := range in.Rows {
			terms[r.Slug] = struct{}{}
		}
		in.Terms = len(terms)

		b := history.Bucket(name)
		if byBucket[b] == nil {
			byBucket[b] = map[string]*history.Instructor{}
		}
		byBucket[b][name] = in
		names = append(names, []any{name, b, in.Terms, len(in.Rows)})
	}
	sort.Slice(names, func(i, j int) bool { return names[i][0].(string) < names[j][0].(string) })

	for bucket, ins := range byBucket {
		if err := s.WriteJSON(ins, "data", "history", "instructors", bucket+".json"); err != nil {
			return err
		}
	}
	if err := s.WriteJSON(names, "data", "history", "names.json"); err != nil {
		return err
	}

	meta := map[string]any{
		"terms":       idx.Terms,
		"courses":     len(idx.Courses),
		"instructors": len(idx.Instructors),
		"generatedAt": time.Now().UTC().Format(time.RFC3339),
	}
	return s.WriteJSON(meta, "data", "history", "index.json")
}

// Stats, bir dönemin özet sayıları.
func Stats(sections []model.Section) model.SiteStats {
	st := model.SiteStats{Sections: len(sections)}
	st.Courses = countDistinct(sections, func(s model.Section) string { return s.Code })
	st.Branches = countDistinct(sections, func(s model.Section) string { return s.Branch })
	st.Instructors = countDistinct(sections, func(s model.Section) string {
		if s.Instructor == "" || s.Instructor == "***" {
			return ""
		}
		return s.Instructor
	})
	for _, s := range sections {
		st.Capacity += s.Capacity
		st.Enrolled += s.Enrolled
	}
	return st
}

func countDistinct(sections []model.Section, key func(model.Section) string) int {
	seen := map[string]struct{}{}
	for _, s := range sections {
		if k := key(s); k != "" {
			seen[k] = struct{}{}
		}
	}
	return len(seen)
}

// dedupe, aynı (branş, CRN) ikilisini yalnızca ilk geçene indirger. Kaynak
// tarafındaki birebir tekrar eden satırlar burada temizlenir; çapraz listelenen
// dersler (aynı CRN farklı branşta) korunur.
func dedupe(sections []model.Section) []model.Section {
	seen := map[string]struct{}{}
	out := make([]model.Section, 0, len(sections))
	for _, s := range sections {
		if s.CRN == "" {
			out = append(out, s)
			continue
		}
		key := s.Branch + "\x00" + s.CRN
		if _, dup := seen[key]; dup {
			continue
		}
		seen[key] = struct{}{}
		out = append(out, s)
	}
	return out
}

// Clean, bir dönemin branş klasörünü tazeler; kapanan branşların dosyaları
// arşivde hayalet olarak kalmasın.
func (s *Store) Clean(slug string) error {
	err := os.RemoveAll(s.path("data", "terms", slug, "branches"))
	if err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("eski branş dosyaları silinemedi: %w", err)
	}
	return nil
}
