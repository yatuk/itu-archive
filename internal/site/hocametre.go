package site

import (
	"encoding/json"
	"fmt"
	"html/template"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

// Hocametre: notkutusu.com'daki öğrenci oylarının toplu özeti
// (docs/data/hocametre.json). Yorumlar hiç okunmaz/gösterilmez; yalnızca
// ölçüt ortalamaları ve oy sayıları. Dosya yoksa sayfalar paneli atlar.

type hmRating struct {
	Avg float64 `json:"avg"`
	N   int     `json:"n"`
}

type hmEntry struct {
	Key     string              `json:"key"`
	Name    string              `json:"name"`
	URL     string              `json:"url"`
	Votes   int                 `json:"votes"`
	Overall *float64            `json:"overall"`
	Ratings map[string]hmRating `json:"ratings"`
}

type hmLabel struct {
	TR string `json:"tr"`
	EN string `json:"en"`
}

type hmData struct {
	FetchedAt   string             `json:"fetchedAt"`
	Criteria    map[string]hmLabel `json:"criteria"`
	Instructors []hmEntry          `json:"instructors"`
}

// hmIndex, eşleştirme için hazırlanmış hocametre verisi.
type hmIndex struct {
	data    hmData
	byKey   map[string][]int // key -> giriş indeksleri
	byToken map[string][]int // token -> giriş indeksleri (yalnızca tek kişilik girişler)
	tokens  [][]string
}

// hmFewVotes altında kalan değerler soluk ve "az oy" etiketiyle gösterilir.
const hmFewVotes = 5

// hmTitleTokens, katlanmış addan atılan akademik unvan parçaları.
var hmTitleTokens = map[string]bool{
	"prof": true, "dr": true, "doc": true, "docent": true, "yrd": true,
	"ogr": true, "ogretim": true, "uyesi": true, "uye": true, "gor": true,
	"gorevlisi": true, "ars": true, "aras": true, "arastirma": true,
	"okt": true, "okutman": true, "uzm": true, "muh": true,
}

// foldName, adı hocametre anahtar biçimine indirger: Türkçe duyarlı küçük
// ASCII (ı/İ→i, ş→s, ğ→g, ü→u, ö→o, ç→c), unvanlar atılmış, boşluklar tekil.
func foldName(name string) string {
	return strings.Join(foldTokens(name), " ")
}

func foldTokens(name string) []string {
	s := strings.NewReplacer(
		"İ", "i", "I", "i", "ı", "i", "Ş", "s", "ş", "s", "Ğ", "g", "ğ", "g",
		"Ü", "u", "ü", "u", "Ö", "o", "ö", "o", "Ç", "c", "ç", "c",
		"Â", "a", "â", "a", "Î", "i", "î", "i", "Û", "u", "û", "u",
	).Replace(name)
	s = strings.ToLower(s)
	var b strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		} else {
			b.WriteByte(' ')
		}
	}
	var out []string
	for _, tok := range strings.Fields(b.String()) {
		if hmTitleTokens[tok] {
			continue
		}
		out = append(out, tok)
	}
	return out
}

// loadHocametre, dosyayı okur. Dosya yoksa (nil, nil) döner.
func loadHocametre(path string) (*hmIndex, error) {
	raw, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var d hmData
	if err := json.Unmarshal(raw, &d); err != nil {
		return nil, fmt.Errorf("%s çözümlenemedi: %w", filepath.Base(path), err)
	}
	return newHMIndex(d), nil
}

func newHMIndex(d hmData) *hmIndex {
	ix := &hmIndex{data: d, byKey: map[string][]int{}, byToken: map[string][]int{}}
	ix.tokens = make([][]string, len(d.Instructors))
	for i, e := range d.Instructors {
		key := e.Key
		if key == "" {
			key = foldName(e.Name)
		}
		ix.byKey[key] = append(ix.byKey[key], i)
		toks := strings.Fields(key)
		ix.tokens[i] = toks
		// "A / B" gibi ortak girişler bulanık eşleşmeye katılmaz: tek bir
		// hocayı iki kişilik bir oy kümesine bağlamak yanıltıcı olur.
		if strings.Contains(e.Name, "/") || strings.Contains(e.Name, ",") {
			continue
		}
		seen := map[string]bool{}
		for _, t := range toks {
			if !seen[t] {
				seen[t] = true
				ix.byToken[t] = append(ix.byToken[t], i)
			}
		}
	}
	return ix
}

// match, bizim hoca adımızı hocametre girişine bağlar: önce birebir anahtar,
// yoksa token kümesi diğerini kapsayan (en az 2 ortak token) TEK aday.
// Birden fazla aday varsa eşleşme yapılmaz.
func (ix *hmIndex) match(name string) *hmEntry {
	if ix == nil {
		return nil
	}
	ours := foldTokens(name)
	if len(ours) == 0 {
		return nil
	}
	if ids := ix.byKey[strings.Join(ours, " ")]; len(ids) == 1 {
		return &ix.data.Instructors[ids[0]]
	} else if len(ids) > 1 {
		return nil
	}
	if len(ours) < 2 {
		return nil
	}
	ourSet := map[string]bool{}
	for _, t := range ours {
		ourSet[t] = true
	}
	cands := map[int]bool{}
	for t := range ourSet {
		for _, i := range ix.byToken[t] {
			cands[i] = true
		}
	}
	found := -1
	for i := range cands {
		theirSet := map[string]bool{}
		for _, t := range ix.tokens[i] {
			theirSet[t] = true
		}
		shared := 0
		for t := range ourSet {
			if theirSet[t] {
				shared++
			}
		}
		if shared < 2 || (shared != len(ourSet) && shared != len(theirSet)) {
			continue
		}
		if found >= 0 {
			return nil // belirsiz
		}
		found = i
	}
	if found < 0 {
		return nil
	}
	return &ix.data.Instructors[found]
}

// hmHasData: panelde gösterilecek bir şey var mı.
func (e *hmEntry) hasData() bool {
	return e != nil && e.Votes > 0 && (e.Overall != nil || len(e.Ratings) > 0)
}

// fmtScore, 3.856 → "3,86" (TR) / "3.86" (EN).
func fmtScore(v float64, langCode string) string {
	s := strconv.FormatFloat(v, 'f', 2, 64)
	if langCode != "en" {
		s = strings.Replace(s, ".", ",", 1)
	}
	return s
}

// hmCriteriaOrder: bilinen ölçütler. Tümünde 5 en iyisidir; ödevde 1 çok
// ödev, yoklamada 1 sık yoklama demektir.
var hmCriteriaOrder = []string{"TEACHING_SKILLS", "IS_HELPFUL", "GIVES_NOTES", "ASSIGNS_HOMEWORK", "TAKES_ATTENDANCE"}

// hmHints, ölçeğin yönü sezgisel olmayan ölçütlerin etiket altı ipucudur.
var hmHints = map[string]hmLabel{
	"ASSIGNS_HOMEWORK": {TR: "5 = az ödev", EN: "5 = little homework"},
	"TAKES_ATTENDANCE": {TR: "5 = yoklama almıyor", EN: "5 = no attendance"},
}

var hmFallbackLabels = map[string]hmLabel{
	"TEACHING_SKILLS":  {TR: "Anlatım", EN: "Teaching"},
	"IS_HELPFUL":       {TR: "Yardımseverlik", EN: "Helpfulness"},
	"GIVES_NOTES":      {TR: "Not paylaşımı", EN: "Shares notes"},
	"ASSIGNS_HOMEWORK": {TR: "Ödev", EN: "Homework"},
	"TAKES_ATTENDANCE": {TR: "Yoklama", EN: "Attendance"},
}

func (ix *hmIndex) label(code, langCode string) string {
	l, ok := ix.data.Criteria[code]
	if !ok || (l.TR == "" && l.EN == "") {
		l = hmFallbackLabels[code]
	}
	if langCode == "en" && l.EN != "" {
		return l.EN
	}
	if l.TR != "" {
		return l.TR
	}
	return code
}

// renderPanel, yalnızca toplu değerlerle hocametre bölümünü çizer: beş ölçüt
// de "yüksek daha iyi" olduğu için hepsi dolu çubuk, genel puan sağda.
func (ix *hmIndex) renderPanel(e *hmEntry, langCode string) string {
	if ix == nil || !e.hasData() {
		return ""
	}
	esc := template.HTMLEscapeString
	var b strings.Builder
	b.WriteString(`<section class="ip-blk" aria-labelledby="h-hm">`)
	b.WriteString(`<div class="ip-blk-h"><div><h2 id="h-hm">Hocametre</h2><p class="ip-note">Öğrencilerin notkutusu'nda verdiği puanlar, 1 ile 5 arası.</p></div>`)
	if strings.HasPrefix(e.URL, "https://") {
		fmt.Fprintf(&b, `<a class="ip-ext" href="%s" rel="noopener">notkutusu'nda yorumları gör →</a>`, esc(e.URL))
	}
	b.WriteString(`</div><div class="ip-card ip-hm"><div class="ip-pad">`)

	ticks := `<span class="ip-ticks" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b></span>`
	row := func(code string) {
		r, ok := e.Ratings[code]
		if !ok || r.N == 0 {
			return
		}
		pos := math.Min(1, math.Max(0, (r.Avg-1)/4)) * 100
		label := ix.label(code, langCode)
		cls := "ip-crit"
		few := ""
		if r.N < hmFewVotes {
			cls += " is-few"
			few = ` · az oy`
		}
		mark := fmt.Sprintf(`<i style="width:%.1f%%"></i>`, pos)
		hint, aria := "", ""
		if h, ok := hmHints[code]; ok {
			t := h.TR
			if langCode == "en" {
				t = h.EN
			}
			hint = `<small>` + esc(t) + `</small>`
			aria = ", " + t
		}
		fmt.Fprintf(&b, `<div class="%s"><span class="ip-lab">%s%s</span><span class="ip-track" role="img" aria-label="%s: 5 üzerinden %s, %d oy%s">%s%s</span>`+
			`<span class="ip-val num">%s<small>%d oy%s</small></span></div>`,
			cls, esc(label), hint, esc(label), fmtScore(r.Avg, langCode), r.N, esc(aria), mark, ticks, fmtScore(r.Avg, langCode), r.N, few)
	}
	row("GIVES_NOTES")
	row("IS_HELPFUL")
	row("TEACHING_SKILLS")
	row("ASSIGNS_HOMEWORK")
	row("TAKES_ATTENDANCE")
	var extra []string
	for code := range e.Ratings {
		known := false
		for _, k := range hmCriteriaOrder {
			known = known || k == code
		}
		if !known {
			extra = append(extra, code)
		}
	}
	sort.Strings(extra)
	for _, code := range extra {
		row(code)
	}
	b.WriteString(`</div>`)

	cls := "ip-score"
	if e.Votes < hmFewVotes {
		cls += " is-few"
	}
	fmt.Fprintf(&b, `<div class="%s"><span class="ip-k">Genel</span>`, cls)
	if e.Overall != nil {
		fmt.Fprintf(&b, `<p class="ip-big num">%s<small> / 5</small></p>`, fmtScore(*e.Overall, langCode))
	}
	fmt.Fprintf(&b, `<p class="ip-note"><span class="num">%d</span> öğrenci oyu`, e.Votes)
	if e.Votes < hmFewVotes {
		b.WriteString(` · <span class="ip-few">az oy</span>`)
	}
	b.WriteString(`</p><p class="ip-note">Her ölçütte 5 en iyisi: ödevde az ödev, yoklamada yoklama almamak demek. Puanlar öğrenci beyanıdır, resmî değerlendirme değildir.</p></div>`)
	b.WriteString(`</div></section>`)
	return b.String()
}
