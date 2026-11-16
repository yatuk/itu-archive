// Package hocametre, notkutusu.com "hocametre" verisinin (hoca puanları)
// özetlenmiş halini üretir ve okur. Yalnızca toplulaştırılmış değerler
// saklanır: e-posta, kimlik, yorum ya da oy bazlı veri dosyaya girmez.
package hocametre

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"sort"
	"strings"
	"time"
)

// Kaynak bilgisi ve profil adresi öneki.
const (
	Source     = "notkutusu.com/hocametre"
	ProfileURL = "https://notkutusu.com/hocametre/"
)

// Criterion, bir puanlama ölçütünün Türkçe/İngilizce adı.
type Criterion struct {
	TR string `json:"tr"`
	EN string `json:"en"`
}

// Criteria, API'deki ratingName değerlerinin etiketleri.
var Criteria = map[string]Criterion{
	"GIVES_NOTES":      {TR: "Not paylaşımı", EN: "Shares notes"},
	"IS_HELPFUL":       {TR: "Yardımseverlik", EN: "Helpfulness"},
	"ASSIGNS_HOMEWORK": {TR: "Ödev", EN: "Homework"},
	"TAKES_ATTENDANCE": {TR: "Yoklama", EN: "Attendance"},
	"TEACHING_SKILLS":  {TR: "Anlatım", EN: "Teaching"},
}

// Rating, tek ölçüt için ortalama ve oy sayısı.
type Rating struct {
	Avg float64 `json:"avg"`
	N   int     `json:"n"`
}

// Instructor, bir öğretim üyesinin (birleştirilmiş profillerin) özeti.
type Instructor struct {
	Key     string            `json:"key"`
	Name    string            `json:"name"`
	Slugs   []string          `json:"slugs"`
	URL     string            `json:"url"`
	Votes   int               `json:"votes"`
	Overall *float64          `json:"overall"`
	Ratings map[string]Rating `json:"ratings"`
}

// Index, dosyanın tamamı.
type Index struct {
	FetchedAt   string               `json:"fetchedAt"`
	Source      string               `json:"source"`
	Criteria    map[string]Criterion `json:"criteria"`
	Instructors []Instructor         `json:"instructors"`

	byKey  map[string]*Instructor
	tokens [][]string // Instructors ile aynı sırada, katlanmış token'lar
}

// APIVote / APIItem, API yanıtının kullandığımız alanları. Başka hiçbir alan
// (e-posta, id, yorum) okunmaz.
type APIVote struct {
	Rating     float64    `json:"rating"`
	RatingName string     `json:"ratingName"`
	DeletedAt  *time.Time `json:"deletedAt"`
}

type APIItem struct {
	Name      string     `json:"name"`
	Slug      string     `json:"slug"`
	DeletedAt *time.Time `json:"deletedAt"`
	Ratings   []APIVote  `json:"instructorRatings"`
}

var titleTokens = map[string]bool{
	"prof": true, "doc": true, "dr": true, "ogr": true, "gor": true,
	"ars": true, "uyesi": true, "ogretim": true, "gorevlisi": true,
	"arastirma": true, "uye": true, "yrd": true,
}

var foldRepl = strings.NewReplacer(
	"ı", "i", "İ", "i", "I", "i", "ş", "s", "Ş", "s", "ğ", "g", "Ğ", "g",
	"ü", "u", "Ü", "u", "ö", "o", "Ö", "o", "ç", "c", "Ç", "c",
)

// foldTokens, adı ASCII küçük harfe indirip noktalama/boşluklara göre böler.
// Baştaki akademik unvan kelimeleri atılır (en az bir kelime kalır).
func foldTokens(name string) []string {
	s := strings.ToLower(foldRepl.Replace(name))
	toks := strings.FieldsFunc(s, func(r rune) bool {
		return !(r >= 'a' && r <= 'z' || r >= '0' && r <= '9')
	})
	i := 0
	for i < len(toks)-1 && titleTokens[toks[i]] {
		i++
	}
	return toks[i:]
}

// Fold, adı karşılaştırma anahtarına çevirir: Türkçe duyarlı küçük ASCII,
// unvansız, tek boşluklu ("Prof. Dr. Nizamettin Aydın" → "nizamettin aydin").
func Fold(name string) string {
	return strings.Join(foldTokens(name), " ")
}

func round2(x float64) float64 { return math.Round(x*100) / 100 }

// displayName, baştaki unvanları atıp boşlukları sadeleştirir.
func displayName(name string) string {
	f := strings.Fields(name)
	i := 0
	for i < len(f)-1 {
		t := foldTokens(f[i] + " x")
		if len(t) == 2 && titleTokens[t[0]] {
			i++
			continue
		}
		break
	}
	return strings.Join(f[i:], " ")
}

func isMixedCase(s string) bool {
	return s != strings.ToLower(s) && s != strings.ToUpper(s)
}

type acc struct {
	sum float64
	n   int
}

type group struct {
	name      string
	nameVotes int
	mixed     bool
	slugs     map[string]int
	crit      map[string]*acc
}

// Aggregate, ham profilleri özetler; silinmiş profil/oyları atlar, aynı
// katlanmış adı taşıyan profilleri birleştirir (ağırlıklı ortalama). Çıktı
// key'e göre sıralıdır.
func Aggregate(items []APIItem) []Instructor {
	groups := map[string]*group{}
	for _, it := range items {
		if it.DeletedAt != nil {
			continue
		}
		key := Fold(it.Name)
		if key == "" {
			continue
		}
		per := map[string]*acc{}
		for _, v := range it.Ratings {
			if v.DeletedAt != nil || v.Rating < 1 || v.Rating > 5 {
				continue
			}
			if _, ok := Criteria[v.RatingName]; !ok {
				continue
			}
			a := per[v.RatingName]
			if a == nil {
				a = &acc{}
				per[v.RatingName] = a
			}
			a.sum += v.Rating
			a.n++
		}
		pv := 0
		for _, a := range per {
			if a.n > pv {
				pv = a.n
			}
		}
		g := groups[key]
		if g == nil {
			g = &group{slugs: map[string]int{}, crit: map[string]*acc{}}
			groups[key] = g
		}
		// Görünen ad: karışık harfli yazımı (Ali Veli) küçük/büyük harfliye tercih et.
		dn := displayName(it.Name)
		mixed := isMixedCase(dn)
		if g.name == "" || (mixed && !g.mixed) || (mixed == g.mixed && pv > g.nameVotes) {
			g.name, g.mixed, g.nameVotes = dn, mixed, pv
		}
		if it.Slug != "" {
			g.slugs[it.Slug] += pv
		}
		for k, a := range per {
			t := g.crit[k]
			if t == nil {
				t = &acc{}
				g.crit[k] = t
			}
			t.sum += a.sum
			t.n += a.n
		}
	}

	out := make([]Instructor, 0, len(groups))
	for key, g := range groups {
		ins := Instructor{Key: key, Name: g.name, Slugs: []string{}, Ratings: map[string]Rating{}}
		for s := range g.slugs {
			ins.Slugs = append(ins.Slugs, s)
		}
		sort.Slice(ins.Slugs, func(i, j int) bool {
			a, b := ins.Slugs[i], ins.Slugs[j]
			if g.slugs[a] != g.slugs[b] {
				return g.slugs[a] > g.slugs[b]
			}
			return a < b
		})
		if len(ins.Slugs) > 0 {
			ins.URL = ProfileURL + ins.Slugs[0]
		}
		var avgSum float64
		var avgN int
		for k, a := range g.crit {
			ins.Ratings[k] = Rating{Avg: round2(a.sum / float64(a.n)), N: a.n}
			avgSum += a.sum / float64(a.n)
			avgN++
			if a.n > ins.Votes {
				ins.Votes = a.n
			}
		}
		if avgN > 0 {
			o := round2(avgSum / float64(avgN))
			ins.Overall = &o
		}
		out = append(out, ins)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Key < out[j].Key })
	return out
}

// NewIndex, özet listesinden yazılabilir bir Index kurar.
func NewIndex(fetchedAt time.Time, ins []Instructor) *Index {
	ix := &Index{
		FetchedAt:   fetchedAt.UTC().Format("2006-01-02T15:04:05Z"),
		Source:      Source,
		Criteria:    Criteria,
		Instructors: ins,
	}
	ix.build()
	return ix
}

func (ix *Index) build() {
	ix.byKey = make(map[string]*Instructor, len(ix.Instructors))
	ix.tokens = make([][]string, len(ix.Instructors))
	for i := range ix.Instructors {
		ix.byKey[ix.Instructors[i].Key] = &ix.Instructors[i]
		ix.tokens[i] = strings.Fields(ix.Instructors[i].Key)
	}
}

// Load, dosyayı okur ve arama indeksini kurar.
func Load(path string) (*Index, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var ix Index
	if err := json.Unmarshal(b, &ix); err != nil {
		return nil, fmt.Errorf("%s: %w", path, err)
	}
	ix.build()
	return &ix, nil
}

// Lookup, adı arar: önce tam (katlanmış) eşleşme; yoksa token kümesi aday
// profili kapsayan ya da onun tarafından kapsanan, en az 2 ortak token'lı
// TEK profil. Birden fazla aday varsa bulunamadı sayılır.
func (ix *Index) Lookup(name string) (*Instructor, bool) {
	key := Fold(name)
	if key == "" {
		return nil, false
	}
	if p, ok := ix.byKey[key]; ok {
		return p, true
	}
	want := map[string]bool{}
	for _, t := range strings.Fields(key) {
		want[t] = true
	}
	var found *Instructor
	for i, toks := range ix.tokens {
		shared := 0
		for _, t := range toks {
			if want[t] {
				shared++
			}
		}
		if shared < 2 {
			continue
		}
		if shared == len(toks) || shared == len(want) {
			if found != nil {
				return nil, false
			}
			found = &ix.Instructors[i]
		}
	}
	return found, found != nil
}
