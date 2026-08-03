// Package history, arşivlenmiş tüm dönemleri tarayıp "geçmiş" indekslerini üretir.
//
// Cevaplamak istediğimiz sorular:
//
//	MAT 103'ü son beş yılda kim verdi?
//	Bu hoca hangi dersleri veriyor?
//	SEN 411 sadece güz döneminde mi açılıyor?
//
// Bunların hiçbiri OBS'de sorulamıyor çünkü OBS yalnızca aktif dönemi biliyor.
// Cevap 27 dönemlik arşivin içinde duruyor, sadece ters indeks gerekiyor.
package history

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"itu-scraper/internal/model"
	"itu-scraper/internal/term"
)

// CourseRow, bir dersin tek bir dönemdeki bir şubesi.
// Dizi olarak serialize ediliyor, nesne hâline göre dosyayı yarıya indiriyor:
// [dönem, hoca, kontenjan, yazılan, gün]
type CourseRow struct {
	Slug       string
	Instructor string
	Capacity   int
	Enrolled   int
	Days       string
}

func (r CourseRow) MarshalJSON() ([]byte, error) {
	return json.Marshal([]any{r.Slug, r.Instructor, r.Capacity, r.Enrolled, r.Days})
}

// Course, bir ders kodunun tüm geçmişi.
type Course struct {
	Code  string      `json:"code"`
	Name  string      `json:"name"`
	Terms []string    `json:"terms"` // açıldığı dönemler, yeniden eskiye
	Rows  []CourseRow `json:"rows"`
}

// InstructorRow: [dönem, ders kodu, ders adı, kontenjan, yazılan]
type InstructorRow struct {
	Slug     string
	Code     string
	Name     string
	Capacity int
	Enrolled int
}

func (r InstructorRow) MarshalJSON() ([]byte, error) {
	return json.Marshal([]any{r.Slug, r.Code, r.Name, r.Capacity, r.Enrolled})
}

type Instructor struct {
	Name  string          `json:"name"`
	Rows  []InstructorRow `json:"rows"`
	Terms int             `json:"terms"`
}

// Index, üretilen tüm geçmiş verisi.
type Index struct {
	Terms       []string // yeniden eskiye
	Courses     map[string]*Course
	Instructors map[string]*Instructor
}

// Build, docs/data/terms altındaki bütün dönemleri okuyup indeksi kurar.
func Build(root string) (*Index, error) {
	termsDir := filepath.Join(root, "data", "terms")
	entries, err := os.ReadDir(termsDir)
	if err != nil {
		return nil, err
	}

	idx := &Index{
		Courses:     map[string]*Course{},
		Instructors: map[string]*Instructor{},
	}

	var slugs []string
	for _, e := range entries {
		if e.IsDir() {
			slugs = append(slugs, e.Name())
		}
	}
	// Yeniden eskiye: sitede en son dönem en üstte görünsün.
	sort.Slice(slugs, func(i, j int) bool { return term.SortKey(slugs[i]) > term.SortKey(slugs[j]) })
	idx.Terms = slugs

	for _, slug := range slugs {
		branchDir := filepath.Join(termsDir, slug, "branches")
		files, err := os.ReadDir(branchDir)
		if err != nil {
			continue
		}
		for _, bf := range files {
			b, err := os.ReadFile(filepath.Join(branchDir, bf.Name()))
			if err != nil {
				continue
			}
			var sections []model.Section
			if err := json.Unmarshal(b, &sections); err != nil {
				continue
			}
			for _, s := range sections {
				idx.addCourse(slug, s)
				idx.addInstructor(slug, s)
			}
		}
	}
	return idx, nil
}

func (idx *Index) addCourse(slug string, s model.Section) {
	c, ok := idx.Courses[s.Code]
	if !ok {
		c = &Course{Code: s.Code, Name: s.Name}
		idx.Courses[s.Code] = c
	}
	// Ders adı yıllar içinde değişebiliyor; en güncel dönemin adını tutuyoruz
	// (dönemler yeniden eskiye işlendiği için ilk gördüğümüz en günceli).
	if c.Name == "" {
		c.Name = s.Name
	}
	if len(c.Terms) == 0 || c.Terms[len(c.Terms)-1] != slug {
		c.Terms = append(c.Terms, slug)
	}
	c.Rows = append(c.Rows, CourseRow{
		Slug:       slug,
		Instructor: s.Instructor,
		Capacity:   s.Capacity,
		Enrolled:   s.Enrolled,
		Days:       strings.Join(s.Days, ", "),
	})
}

func (idx *Index) addInstructor(slug string, s model.Section) {
	name := strings.TrimSpace(s.Instructor)
	if name == "" || name == "***" || name == "--" || name == "-" {
		return
	}
	in, ok := idx.Instructors[name]
	if !ok {
		in = &Instructor{Name: name}
		idx.Instructors[name] = in
	}
	in.Rows = append(in.Rows, InstructorRow{
		Slug: slug, Code: s.Code, Name: s.Name,
		Capacity: s.Capacity, Enrolled: s.Enrolled,
	})
}

// Bucket, bir ismi hangi harf dosyasına koyacağımızı söyler. Türkçe harfler
// ASCII'ye katlanıyor ki site tarafındaki arama ile aynı kovaya düşsün.
func Bucket(name string) string {
	for _, r := range fold(name) {
		if r >= 'a' && r <= 'z' {
			return string(r)
		}
		if r >= '0' && r <= '9' {
			return "0"
		}
	}
	return "_"
}

var folder = strings.NewReplacer(
	"ı", "i", "İ", "i", "I", "i", "ş", "s", "Ş", "s", "ğ", "g", "Ğ", "g",
	"ü", "u", "Ü", "u", "ö", "o", "Ö", "o", "ç", "c", "Ç", "c",
	"â", "a", "Â", "a", "î", "i", "Î", "i", "û", "u", "Û", "u",
)

func fold(s string) string { return strings.ToLower(folder.Replace(s)) }
