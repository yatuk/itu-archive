package site

// /ders-programi-olustur/ (EN: /en/schedule-builder/) iniş sayfasının gövdesi:
// aktif dönemin gerçek şubelerinden kurulan küçük, çalışan bir haftalık
// program örneği. Varsayılan (çakışmasız) çizelge sunucuda tam HTML olarak
// üretilir; satır içi küçük bir betik şube seçimlerini canlı hâle getirir.
//
// Seçim deterministiktir: aynı search.json her üretimde aynı şubeleri,
// aynı varsayılanları ve aynı örnek çakışmayı verir. Sınıf adlarının hepsi
// "lpp-" ile başlar; renkler yalnızca uygulamanın tema token'larından gelir.

import (
	"encoding/json"
	"fmt"
	"html/template"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

const (
	lppDayStart = 8*60 + 30  // 08:30
	lppDayEnd   = 17*60 + 30 // 17:30
	lppMaxSecs  = 4
)

type lppSlot struct {
	Day        int // 0 = Pazartesi … 4 = Cuma
	Start, End int // gece yarısından dakika; End dahil değil (11:29 → 690)
	Room       string
}

type lppSection struct {
	CRN, Code, Name, Instructor string
	Cap, Enr                    int
	Online                      bool
	Slots                       []lppSlot
}

type lppCourse struct {
	Key   string // ders anahtarı (TUR için "TUR 101": TUR 101 ve TUR 102 tek satırda)
	Color int    // 1..4
	Def   string // varsayılan CRN
	Secs  []lppSection
}

type lppDemo struct {
	Term      string
	Courses   []lppCourse
	ClashIdx  int // örnek çakışma için değişen dersin dizini (-1: yok)
	ClashCRN  string
	ClashWith int // örnek çakışmada çakışılan dersin dizini
}

// lppSpecs, örnekte gösterilen dersler. prefer, görsel taslaktaki şubelerdir;
// dönem değişip bu CRN'ler kaybolursa geri kalan şubelerden deterministik
// olarak tamamlanır.
var lppSpecs = []struct {
	key    string
	codes  []string
	prefer []string
	def    string
}{
	{"MAT 103E", []string{"MAT 103E"}, []string{"10184", "10195", "10200", "10232"}, "10232"},
	{"FIZ 101E", []string{"FIZ 101E"}, []string{"10451", "10460", "10468", "10475"}, "10451"},
	{"KIM 101E", []string{"KIM 101E"}, []string{"10261", "10266", "10269", "10276"}, "10276"},
	{"TUR 101", []string{"TUR 101", "TUR 102"}, []string{"10003", "10001", "10005"}, "10003"},
}

// Örnek çakışma aranırken önce Kimya, sonra Fizik, Matematik, Türk Dili denenir.
var lppClashOrder = []string{"KIM 101E", "FIZ 101E", "MAT 103E", "TUR 101"}

var lppDayIndex = map[string]int{"Pazartesi": 0, "Salı": 1, "Çarşamba": 2, "Perşembe": 3, "Cuma": 4}

type lppText struct {
	Heading, Intro, IntroLink, PicksLabel, GridLabel string
	Days, DayShort                                   [5]string
	Full, FullPlus, Left, Online, ClashTag           string
	NoClash, ClashOne, ClashMany, With               string
	Courses, HoursWeek                               string
	HintButton, HintAfter, Reset                     string
	StepsHead                                        string
	Steps                                            [3][2]string
}

var lppTextTR = lppText{
	Heading:    "Örnek haftalık program",
	Intro:      "Aşağıdaki örnek %s şubeleriyle çalışıyor. Her ders için bir şube (CRN) seç; çizelge anında güncellenir, aynı saate düşen dersler çakışma olarak işaretlenir.",
	IntroLink:  "Tüm şubelerle çalışan tam araç için <a href=\"/#program\">haftalık program aracını aç</a>.",
	PicksLabel: "Şube seçimi", GridLabel: "Haftalık çizelge",
	Days:     [5]string{"Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"},
	DayShort: [5]string{"Pzt", "Sal", "Çar", "Per", "Cum"},
	Full:     "dolu", FullPlus: "dolu +%d", Left: "%d yer", Online: "çevrimiçi", ClashTag: "çakışma",
	NoClash:  "Çakışma yok. Seçili şubeler aynı saate düşmüyor.",
	ClashOne: "%d çakışma:", ClashMany: "%d çakışma:", With: "ile",
	Courses: "ders", HoursWeek: "saat/hafta",
	HintButton: "Örnek çakışmayı göster", HintAfter: "%s şubesini %s (%s %s) yapar; %s ile çakışır.", Reset: "Varsayılana dön",
	StepsHead: "Üç adımda program",
	Steps: [3][2]string{
		{"Dersleri ekle", "Kod, ad veya CRN ile ara; şubeyi tek tıkla çizelgeye ekle."},
		{"Çakışmaları çöz", "Kırmızı bloklar aynı saate düşen şubeler. Alternatif Bul, kısıtlarına uyan çakışmasız kombinasyonları hesaplar."},
		{"Dışa aktar", "Programı görsel veya .ics takvim olarak indir, CRN listesini OBS kayıt ekranı için kopyala."},
	},
}

var lppTextEN = lppText{
	Heading:    "Sample weekly schedule",
	Intro:      "This sample uses real %s sections. Pick one section (CRN) per course; the grid updates instantly and courses at the same time are flagged as conflicts.",
	IntroLink:  "For the full tool with every section, <a href=\"/#program\">open the weekly schedule tool</a>.",
	PicksLabel: "Section picker", GridLabel: "Weekly grid",
	Days:     [5]string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"},
	DayShort: [5]string{"Mon", "Tue", "Wed", "Thu", "Fri"},
	Full:     "full", FullPlus: "full +%d", Left: "%d left", Online: "online", ClashTag: "conflict",
	NoClash:  "No conflicts. The selected sections do not overlap.",
	ClashOne: "%d conflict:", ClashMany: "%d conflicts:", With: "and",
	Courses: "courses", HoursWeek: "hours/week",
	HintButton: "Show a sample conflict", HintAfter: "switches %s to %s (%s %s), which overlaps %s.", Reset: "Reset to default",
	StepsHead: "Three steps to a schedule",
	Steps: [3][2]string{
		{"Add courses", "Search by code, name, or CRN and add a section to the grid in one click."},
		{"Resolve conflicts", "Red blocks are sections at the same time. Find Alternatives computes conflict-free combinations that fit your constraints."},
		{"Export", "Download the schedule as an image or .ics calendar, and copy the CRN list for OBS registration."},
	},
}

// programDemoHTML, aktif dönem verisinden örnek bölümünü üretir. Veri yoksa
// ya da örnek kurulamıyorsa boş döner; sayfa eski metinle kalır.
func (b *Builder) programDemoHTML(en bool) string {
	if b.index.CurrentSlug == "" {
		return ""
	}
	var rows [][]json.RawMessage
	if err := readJSON(filepath.Join(b.root, "data", "terms", b.index.CurrentSlug, "search.json"), &rows); err != nil {
		return ""
	}
	lang := "tr"
	if en {
		lang = "en"
	}
	term := shortTermLabel(localizedTermLabel(b.index.CurrentSlug, b.index.CurrentTerm, lang))
	d, ok := buildProgramDemo(lppParseRows(rows), term)
	if !ok {
		return ""
	}
	return renderProgramDemo(d, en)
}

// lppParseRows, search.json satırlarından örnekte geçen derslerin şubelerini
// çıkarır. Sütunlar: crn, kod, ad, branş, hoca, gün/saat, kontenjan, yazılan,
// düzey, öğretim şekli, programlar, derslik.
func lppParseRows(rows [][]json.RawMessage) map[string][]lppSection {
	want := map[string]bool{}
	for _, s := range lppSpecs {
		for _, c := range s.codes {
			want[c] = true
		}
	}
	out := map[string][]lppSection{}
	for _, r := range rows {
		if len(r) < 8 {
			continue
		}
		var crn, code, name, instr, when, mode, room string
		json.Unmarshal(r[1], &code)
		if !want[code] {
			continue
		}
		json.Unmarshal(r[0], &crn)
		json.Unmarshal(r[2], &name)
		json.Unmarshal(r[4], &instr)
		json.Unmarshal(r[5], &when)
		var capF, enrF float64
		json.Unmarshal(r[6], &capF)
		json.Unmarshal(r[7], &enrF)
		if len(r) > 9 {
			json.Unmarshal(r[9], &mode)
		}
		if len(r) > 11 {
			json.Unmarshal(r[11], &room)
		}
		s, ok := lppParseSection(crn, code, name, instr, when, room, mode, int(capF), int(enrF))
		if ok {
			out[code] = append(out[code], s)
		}
	}
	return out
}

func lppParseClock(s string) (int, bool) {
	h, m, ok := strings.Cut(strings.TrimSpace(s), ":")
	if !ok {
		return 0, false
	}
	hh, err1 := strconv.Atoi(h)
	mm, err2 := strconv.Atoi(m)
	if err1 != nil || err2 != nil {
		return 0, false
	}
	return hh*60 + mm, true
}

// lppParseSection, örneğe uygun şubeleri kabul eder: kontenjanı olan,
// tüm oturumları Pazartesi–Cuma 08:30–17:30 arasında kalan, Ayazağa (MED)
// dersliklerinde ya da çevrimiçi işlenen şubeler.
func lppParseSection(crn, code, name, instr, when, room, mode string, capacity, enrolled int) (lppSection, bool) {
	s := lppSection{CRN: crn, Code: code, Name: name, Instructor: strings.TrimSpace(instr), Cap: capacity, Enr: enrolled,
		Online: strings.Contains(mode, "Sanal") || strings.Contains(strings.ToLower(mode), "online")}
	if crn == "" || capacity <= 0 || s.Instructor == "" {
		return s, false
	}
	rooms := strings.Split(room, " | ")
	for i, part := range strings.Split(when, " | ") {
		day, span, ok := strings.Cut(strings.TrimSpace(part), " ")
		if !ok {
			return s, false
		}
		di, ok := lppDayIndex[day]
		if !ok {
			return s, false
		}
		a, b, ok := strings.Cut(span, "/")
		if !ok {
			return s, false
		}
		start, ok1 := lppParseClock(a)
		end, ok2 := lppParseClock(b)
		if !ok1 || !ok2 {
			return s, false
		}
		end++ // 11:29 → 11:30
		if start < lppDayStart || end > lppDayEnd || end <= start {
			return s, false
		}
		r := ""
		if i < len(rooms) {
			r = strings.TrimSpace(rooms[i])
		}
		if !s.Online && (!strings.HasPrefix(r, "MED ") || strings.HasSuffix(r, "--")) {
			return s, false
		}
		s.Slots = append(s.Slots, lppSlot{Day: di, Start: start, End: end, Room: r})
	}
	return s, len(s.Slots) > 0
}

func lppPattern(s lppSection) string {
	var b strings.Builder
	for _, sl := range s.Slots {
		fmt.Fprintf(&b, "%d-%d-%d;", sl.Day, sl.Start, sl.End)
	}
	return b.String()
}

// buildProgramDemo, dersleri seçer, çakışmasız varsayılanı ve örnek
// çakışmayı bulur. En az iki ders kurulamazsa ok=false döner.
func buildProgramDemo(byCode map[string][]lppSection, term string) (lppDemo, bool) {
	d := lppDemo{Term: term, ClashIdx: -1, ClashWith: -1}
	for _, spec := range lppSpecs {
		var cands []lppSection
		for _, c := range spec.codes {
			cands = append(cands, byCode[c]...)
		}
		sort.SliceStable(cands, func(i, j int) bool { return cands[i].CRN < cands[j].CRN })
		byCRN := map[string]lppSection{}
		for _, s := range cands {
			if _, dup := byCRN[s.CRN]; !dup {
				byCRN[s.CRN] = s
			}
		}
		picked := map[string]bool{}
		patterns := map[string]bool{}
		var secs []lppSection
		for _, crn := range spec.prefer {
			if s, ok := byCRN[crn]; ok && !picked[crn] && len(secs) < lppMaxSecs {
				secs = append(secs, s)
				picked[crn] = true
				patterns[lppPattern(s)] = true
			}
		}
		for _, s := range cands {
			if len(secs) >= lppMaxSecs {
				break
			}
			if picked[s.CRN] || patterns[lppPattern(s)] {
				continue
			}
			secs = append(secs, s)
			picked[s.CRN] = true
			patterns[lppPattern(s)] = true
		}
		if len(secs) == 0 {
			continue
		}
		sort.SliceStable(secs, func(i, j int) bool { return secs[i].CRN < secs[j].CRN })
		def := secs[0].CRN
		if picked[spec.def] {
			def = spec.def
		}
		d.Courses = append(d.Courses, lppCourse{Key: spec.key, Color: len(d.Courses) + 1, Def: def, Secs: secs})
	}
	if len(d.Courses) < 2 {
		return d, false
	}
	lppPickDefaults(&d)
	lppPickClash(&d)
	return d, true
}

func (c lppCourse) section(crn string) lppSection {
	for _, s := range c.Secs {
		if s.CRN == crn {
			return s
		}
	}
	return c.Secs[0]
}

func lppOverlap(a, b lppSection) bool {
	for _, x := range a.Slots {
		for _, y := range b.Slots {
			if x.Day == y.Day && x.Start < y.End && y.Start < x.End {
				return true
			}
		}
	}
	return false
}

// lppPickDefaults, tercih edilen varsayılanlar çakışıyorsa, her dersin
// varsayılanını öne alarak sırayla denenen ilk çakışmasız kombinasyonu seçer.
func lppPickDefaults(d *lppDemo) {
	n := len(d.Courses)
	order := make([][]lppSection, n)
	for i, c := range d.Courses {
		order[i] = append(order[i], c.section(c.Def))
		for _, s := range c.Secs {
			if s.CRN != c.Def {
				order[i] = append(order[i], s)
			}
		}
	}
	cur := make([]lppSection, n)
	var walk func(i int) bool
	walk = func(i int) bool {
		if i == n {
			return true
		}
		for _, s := range order[i] {
			ok := true
			for j := 0; j < i; j++ {
				if lppOverlap(cur[j], s) {
					ok = false
					break
				}
			}
			if ok {
				cur[i] = s
				if walk(i + 1) {
					return true
				}
			}
		}
		return false
	}
	if walk(0) {
		for i := range d.Courses {
			d.Courses[i].Def = cur[i].CRN
		}
	}
}

// lppPickClash, yalnızca tek bir dersin şubesini değiştirerek varsayılan
// programda çakışma yaratan ilk şubeyi bulur.
func lppPickClash(d *lppDemo) {
	for _, key := range lppClashOrder {
		for i, c := range d.Courses {
			if c.Key != key {
				continue
			}
			for _, s := range c.Secs {
				if s.CRN == c.Def {
					continue
				}
				for j, o := range d.Courses {
					if j != i && lppOverlap(s, o.section(o.Def)) {
						d.ClashIdx, d.ClashCRN, d.ClashWith = i, s.CRN, j
						return
					}
				}
			}
		}
	}
}

// --- çıktı ---

func lppHHMM(m int) string { return fmt.Sprintf("%02d:%02d", m/60, m%60) }

func (c lppCourse) label() string {
	codes := []string{}
	seen := map[string]bool{}
	for _, s := range c.Secs {
		if !seen[s.Code] {
			seen[s.Code] = true
			codes = append(codes, s.Code)
		}
	}
	if len(codes) == 2 && strings.HasPrefix(codes[1], strings.SplitN(codes[0], " ", 2)[0]+" ") {
		sort.Strings(codes)
		return codes[0] + " / " + strings.SplitN(codes[1], " ", 2)[1]
	}
	return strings.Join(codes, " / ")
}

func (c lppCourse) name(t lppText) string {
	name := c.section(c.Def).Name
	online := true
	for _, s := range c.Secs {
		online = online && s.Online
	}
	if online {
		name += " · " + t.Online
	}
	return name
}

func lppRoom(s lppSection, sl lppSlot, t lppText) string {
	if s.Online {
		return t.Online
	}
	return sl.Room
}

func lppFill(s lppSection, t lppText) (cls, pill, pillCls string) {
	left := s.Cap - s.Enr
	switch {
	case left < 0:
		return "lpp-fill--full", fmt.Sprintf(t.FullPlus, -left), "lpp-pill--full"
	case left == 0:
		return "lpp-fill--full", t.Full, "lpp-pill--full"
	case float64(left) <= float64(s.Cap)*0.05:
		return "lpp-fill--warn", fmt.Sprintf(t.Left, left), "lpp-pill--warn"
	}
	return "", fmt.Sprintf(t.Left, left), "lpp-pill--ok"
}

func lppOption(c lppCourse, s lppSection, t lppText) string {
	var parts []string
	for _, sl := range s.Slots {
		parts = append(parts, t.DayShort[sl.Day]+" "+lppHHMM(sl.Start))
	}
	txt := s.CRN + " · " + strings.Join(parts, ", ") + " · " + strconv.Itoa(s.Enr) + "/" + strconv.Itoa(s.Cap)
	if s.Enr >= s.Cap {
		txt += " " + t.Full
	}
	if s.Code != c.Key {
		txt += " · " + s.Code
	}
	return txt
}

type lppBlock struct {
	course      int
	sec         lppSection
	slot        lppSlot
	clash       bool
	lane, lanes int
}

// lppLayout, seçili şubelerden blokları üretir, çakışanları işaretler ve
// çakışan blokları yan yana şeritlere yerleştirir. Betikteki layout() ile
// aynı kuralı izler.
func lppLayout(courses []lppCourse, pick []string) ([]lppBlock, [][2]int) {
	var blocks []lppBlock
	for i, c := range courses {
		s := c.section(pick[i])
		for _, sl := range s.Slots {
			blocks = append(blocks, lppBlock{course: i, sec: s, slot: sl, lanes: 1})
		}
	}
	var pairs [][2]int
	for i := range blocks {
		for j := i + 1; j < len(blocks); j++ {
			x, y := blocks[i], blocks[j]
			if x.course != y.course && x.slot.Day == y.slot.Day && x.slot.Start < y.slot.End && y.slot.Start < x.slot.End {
				blocks[i].clash, blocks[j].clash = true, true
				pairs = append(pairs, [2]int{i, j})
			}
		}
	}
	for day := 0; day < 5; day++ {
		var idx []int
		for i, b := range blocks {
			if b.slot.Day == day {
				idx = append(idx, i)
			}
		}
		sort.SliceStable(idx, func(a, b int) bool {
			x, y := blocks[idx[a]], blocks[idx[b]]
			if x.slot.Start != y.slot.Start {
				return x.slot.Start < y.slot.Start
			}
			return x.course < y.course
		})
		var cluster []int
		clusterEnd := -1
		flush := func() {
			lanes := 0
			for _, i := range cluster {
				if blocks[i].lane+1 > lanes {
					lanes = blocks[i].lane + 1
				}
			}
			for _, i := range cluster {
				blocks[i].lanes = lanes
			}
			cluster = cluster[:0]
		}
		for _, i := range idx {
			b := blocks[i]
			if len(cluster) > 0 && b.slot.Start >= clusterEnd {
				flush()
			}
			used := map[int]bool{}
			for _, j := range cluster {
				if blocks[j].slot.End > b.slot.Start {
					used[blocks[j].lane] = true
				}
			}
			lane := 0
			for used[lane] {
				lane++
			}
			blocks[i].lane = lane
			cluster = append(cluster, i)
			if b.slot.End > clusterEnd {
				clusterEnd = b.slot.End
			}
		}
		if len(cluster) > 0 {
			flush()
		}
	}
	return blocks, pairs
}

func lppPct(v float64) string { return strconv.FormatFloat(v, 'f', 3, 64) + "%" }

func lppBlockHTML(b lppBlock, t lppText) string {
	span := float64(lppDayEnd - lppDayStart)
	top := float64(b.slot.Start-lppDayStart) / span * 100
	h := float64(b.slot.End-b.slot.Start) / span * 100
	w := 100 / float64(b.lanes)
	cls := "lpp-blk lpp-c" + strconv.Itoa(b.course+1)
	cx := ""
	if b.clash {
		cls += " lpp-blk--clash"
		cx = `<span class="lpp-cx">` + template.HTMLEscapeString(t.ClashTag) + `</span>`
	}
	when := lppHHMM(b.slot.Start) + "–" + lppHHMM(b.slot.End)
	room := lppRoom(b.sec, b.slot, t)
	title := b.sec.Code + " · CRN " + b.sec.CRN + " · " + t.Days[b.slot.Day] + " " + when + " · " + b.sec.Instructor
	return fmt.Sprintf(`<div class="%s" style="top:calc(%s + 1px);height:calc(%s - 2px);left:calc(%s + 2px);width:calc(%s - 4px)" title="%s"><b>%s</b>%s<span class="lpp-when">%s</span><span class="lpp-room">%s</span></div>`,
		cls, lppPct(top), lppPct(h), lppPct(w*float64(b.lane)), lppPct(w),
		template.HTMLEscapeString(title), lppCodeHTML(b.sec.Code), cx, when, template.HTMLEscapeString(room))
}

// lppCodeHTML, ders kodunu branş ve numara olarak böler; dar (çakışan,
// mobil) bloklarda numara gizlenebilsin diye.
func lppCodeHTML(code string) string {
	br, num, ok := strings.Cut(code, " ")
	if !ok {
		return template.HTMLEscapeString(code)
	}
	return template.HTMLEscapeString(br) + `<span class="lpp-num"> ` + template.HTMLEscapeString(num) + `</span>`
}

func lppHours(mins int, en bool) string {
	s := strconv.FormatFloat(float64(mins)/60, 'f', -1, 64)
	if strings.Contains(s, ".") {
		s = strconv.FormatFloat(float64(mins)/60, 'f', 1, 64)
		if !en {
			s = strings.ReplaceAll(s, ".", ",")
		}
	}
	return s
}

func lppStatusHTML(blocks []lppBlock, pairs [][2]int, t lppText) (cls, inner string) {
	if len(pairs) == 0 {
		return "lpp-status lpp-status--ok", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg><span>` + template.HTMLEscapeString(t.NoClash) + `</span>`
	}
	head := t.ClashOne
	if len(pairs) > 1 {
		head = t.ClashMany
	}
	var items []string
	for _, p := range pairs {
		x, y := blocks[p[0]], blocks[p[1]]
		a, b := max(x.slot.Start, y.slot.Start), min(x.slot.End, y.slot.End)
		items = append(items, fmt.Sprintf("%s (%s) %s %s (%s), %s %s–%s", x.sec.Code, x.sec.CRN, t.With, y.sec.Code, y.sec.CRN, t.Days[x.slot.Day], lppHHMM(a), lppHHMM(b)))
	}
	return "lpp-status lpp-status--bad", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5M12 18v.5"/></svg><span><b>` +
		template.HTMLEscapeString(fmt.Sprintf(head, len(pairs))) + `</b> ` + template.HTMLEscapeString(strings.Join(items, "; ")) + `</span>`
}

func renderProgramDemo(d lppDemo, en bool) string {
	t := lppTextTR
	if en {
		t = lppTextEN
	}
	esc := template.HTMLEscapeString
	pick := make([]string, len(d.Courses))
	for i, c := range d.Courses {
		pick[i] = c.Def
	}
	blocks, pairs := lppLayout(d.Courses, pick)

	var h strings.Builder
	h.WriteString(`<section class="lpp" id="lpp" aria-labelledby="lpp-h">`)
	h.WriteString(lppCSS)
	fmt.Fprintf(&h, `<h2 id="lpp-h">%s</h2><p class="lpp-intro">%s %s</p>`,
		esc(t.Heading), esc(fmt.Sprintf(t.Intro, d.Term)), t.IntroLink)
	h.WriteString(`<div class="lpp-builder">`)

	// Şube seçimi.
	fmt.Fprintf(&h, `<div class="lpp-box lpp-picks" role="group" aria-label="%s">`, esc(t.PicksLabel))
	for i, c := range d.Courses {
		s := c.section(c.Def)
		fillCls, pill, pillCls := lppFill(s, t)
		pct := min(100, float64(s.Enr)/float64(s.Cap)*100)
		fmt.Fprintf(&h, `<div class="lpp-pick" data-i="%d"><label class="lpp-pick-hd" for="lpp-sel-%d"><span class="lpp-sw lpp-c%d" aria-hidden="true"></span><span class="lpp-code">%s</span><span class="lpp-nm">%s</span></label>`,
			i, i+1, c.Color, esc(c.label()), esc(c.name(t)))
		fmt.Fprintf(&h, `<select class="lpp-sel" id="lpp-sel-%d" data-i="%d">`, i+1, i)
		for _, o := range c.Secs {
			sel := ""
			if o.CRN == c.Def {
				sel = " selected"
			}
			fmt.Fprintf(&h, `<option value="%s"%s>%s</option>`, esc(o.CRN), sel, esc(lppOption(c, o, t)))
		}
		h.WriteString(`</select>`)
		fmt.Fprintf(&h, `<div class="lpp-info" id="lpp-info-%d"><span class="lpp-hoca">%s</span><span class="lpp-fill %s"><span class="lpp-bar"><i style="width:%s"></i></span><span class="lpp-n">%d/%d</span></span><span class="lpp-pill %s">%s</span></div></div>`,
			i+1, esc(s.Instructor), fillCls, strconv.FormatFloat(pct, 'f', 1, 64)+"%", s.Enr, s.Cap, pillCls, esc(pill))
	}
	h.WriteString(`</div>`)

	// Haftalık çizelge.
	h.WriteString(`<div class="lpp-box lpp-week">`)
	fmt.Fprintf(&h, `<div class="lpp-grid-wrap"><div class="lpp-wk" role="group" aria-label="%s"><div class="lpp-corner"></div>`, esc(t.GridLabel))
	for i := 0; i < 5; i++ {
		fmt.Fprintf(&h, `<div class="lpp-dh"><span aria-hidden="true">%s</span><span class="lpp-sr">%s</span></div>`, esc(t.DayShort[i]), esc(t.Days[i]))
	}
	h.WriteString(`<div class="lpp-times" aria-hidden="true">`)
	hours := (lppDayEnd - lppDayStart) / 60
	for i := 0; i <= hours; i++ {
		fmt.Fprintf(&h, `<span style="top:%s">%s</span>`, lppPct(float64(i)/float64(hours)*100), lppHHMM(lppDayStart+i*60))
	}
	h.WriteString(`</div>`)
	for day := 0; day < 5; day++ {
		fmt.Fprintf(&h, `<div class="lpp-col" data-day="%d">`, day)
		for _, b := range blocks {
			if b.slot.Day == day {
				h.WriteString(lppBlockHTML(b, t))
			}
		}
		h.WriteString(`</div>`)
	}
	h.WriteString(`</div></div>`)

	mins := 0
	var crns []string
	for _, b := range blocks {
		mins += b.slot.End - b.slot.Start
	}
	for i, c := range d.Courses {
		crns = append(crns, c.section(pick[i]).CRN)
	}
	fmt.Fprintf(&h, `<p class="lpp-sum" id="lpp-sum"><span><b>%d</b> %s</span><span><b>%s</b> %s</span><span>CRN <b>%s</b></span></p>`,
		len(d.Courses), esc(t.Courses), lppHours(mins, en), esc(t.HoursWeek), esc(strings.Join(crns, " ")))
	stCls, stInner := lppStatusHTML(blocks, pairs, t)
	fmt.Fprintf(&h, `<p class="%s" id="lpp-status" role="status" aria-live="polite">%s</p>`, stCls, stInner)
	h.WriteString(`</div></div>`) // .lpp-week, .lpp-builder

	// Örnek çakışma ve sıfırlama (yalnızca betik çalışınca görünür).
	h.WriteString(`<p class="lpp-hint" id="lpp-hint" hidden>`)
	if d.ClashIdx >= 0 {
		c := d.Courses[d.ClashIdx]
		s := c.section(d.ClashCRN)
		fmt.Fprintf(&h, `<button type="button" class="lpp-link" data-lpp="clash">%s</button> <span>%s</span> `,
			esc(t.HintButton), esc(fmt.Sprintf(t.HintAfter, c.label(), s.CRN, t.Days[s.Slots[0].Day], lppHHMM(s.Slots[0].Start), d.Courses[d.ClashWith].label())))
	}
	fmt.Fprintf(&h, `<button type="button" class="lpp-link" data-lpp="reset">%s</button></p>`, esc(t.Reset))

	// Üç adım.
	fmt.Fprintf(&h, `<h3 class="lpp-steps-h">%s</h3><ol class="lpp-box lpp-steps">`, esc(t.StepsHead))
	for _, st := range t.Steps {
		fmt.Fprintf(&h, `<li><b>%s</b><p>%s</p></li>`, esc(st[0]), esc(st[1]))
	}
	h.WriteString(`</ol>`)

	h.WriteString(`<script type="application/json" id="lpp-data">` + lppDataJSON(d, t, en) + `</script>`)
	h.WriteString(lppJS)
	h.WriteString(`</section>`)
	return h.String()
}

// lppDataJSON, betiğin ihtiyaç duyduğu veriyi ve metinleri taşır.
// json.Marshal "<", ">" ve "&" karakterlerini kaçırdığı için </script>
// kapanışı veri içinden kırılamaz.
func lppDataJSON(d lppDemo, t lppText, en bool) string {
	type sec struct {
		CRN   string  `json:"crn"`
		Code  string  `json:"code"`
		Ins   string  `json:"ins"`
		Cap   int     `json:"cap"`
		Enr   int     `json:"enr"`
		Slots [][]any `json:"sl"`
	}
	type course struct {
		Label string `json:"l"`
		Def   string `json:"d"`
		Col   int    `json:"col"`
		Secs  []sec  `json:"s"`
	}
	payload := map[string]any{}
	var cs []course
	for _, c := range d.Courses {
		cc := course{Label: c.label(), Def: c.Def, Col: c.Color}
		for _, s := range c.Secs {
			ss := sec{CRN: s.CRN, Code: s.Code, Ins: s.Instructor, Cap: s.Cap, Enr: s.Enr}
			for _, sl := range s.Slots {
				ss.Slots = append(ss.Slots, []any{sl.Day, sl.Start, sl.End, lppRoom(s, sl, t)})
			}
			cc.Secs = append(cc.Secs, ss)
		}
		cs = append(cs, cc)
	}
	payload["c"] = cs
	if d.ClashIdx >= 0 {
		payload["x"] = []any{d.ClashIdx, d.ClashCRN}
	}
	dec := ","
	if en {
		dec = "."
	}
	payload["t"] = map[string]any{
		"days": t.Days, "full": t.Full, "fullPlus": t.FullPlus, "left": t.Left, "tag": t.ClashTag,
		"none": t.NoClash, "one": t.ClashOne, "many": t.ClashMany, "with": t.With,
		"courses": t.Courses, "hours": t.HoursWeek, "dec": dec,
	}
	b, _ := json.Marshal(payload)
	return string(b)
}

const lppCSS = `<style>
.lpp{margin:28px 0 8px}
.lpp h2{margin-bottom:6px}
.lpp-intro{color:var(--dim);margin:0 0 14px;max-width:72ch}
.lpp-intro a{color:var(--cyan)}
.lpp-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.lpp-builder{display:grid;grid-template-columns:minmax(0,360px) minmax(0,1fr);gap:16px;align-items:start}
.lpp-box{background:var(--panel);border:1px solid var(--line);border-radius:12px;min-width:0}
.lpp-c1{--lpp-c:var(--cyan)}
.lpp-c2{--lpp-c:var(--acid)}
.lpp-c3{--lpp-c:color-mix(in srgb,var(--cyan) 45%,var(--acid))}
.lpp-c4{--lpp-c:color-mix(in srgb,var(--cyan) 55%,var(--red))}
.lpp-picks{padding:4px 14px}
.lpp-pick{display:grid;gap:6px;padding:12px 0}
.lpp-pick+.lpp-pick{border-top:1px solid var(--line)}
.lpp-pick-hd{display:flex;align-items:center;gap:8px;min-width:0;cursor:pointer}
.lpp-sw{width:10px;height:10px;border-radius:3px;flex:none;background:var(--lpp-c)}
.lpp-code{font-family:var(--mono);font-weight:700;font-size:13px;color:var(--fg);white-space:nowrap}
.lpp-nm{color:var(--dim);font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lpp-sel{width:100%;min-height:44px;border:1px solid var(--line-hot);border-radius:9px;background:var(--panel);color:var(--fg);padding:0 8px;font-family:var(--mono);font-size:12.5px;font-variant-numeric:tabular-nums;max-width:100%}
.lpp-sel:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}
.lpp-pick--bad .lpp-sel{border-color:var(--red)}
.lpp-info{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;color:var(--dim)}
.lpp-hoca{color:var(--fg)}
.lpp-fill{display:inline-flex;align-items:center;gap:7px}
.lpp-bar{width:56px;height:6px;border-radius:3px;background:color-mix(in srgb,var(--fg) 11%,var(--panel));overflow:hidden;flex:none}
.lpp-bar i{display:block;height:100%;background:var(--dim);border-radius:3px}
.lpp-fill--warn .lpp-bar i{background:var(--amber)}
.lpp-fill--full .lpp-bar i{background:var(--red)}
.lpp-n{font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap}
.lpp-pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--line-hot);font-size:11.5px;line-height:1.5;white-space:nowrap;color:var(--dim)}
.lpp-pill--warn{color:var(--amber);border-color:var(--amber)}
.lpp-pill--full{color:var(--red);border-color:var(--red)}
.lpp-week{overflow:hidden}
.lpp-grid-wrap{padding:12px 12px 10px;overflow-x:auto}
.lpp-wk{--lpp-hh:44px;display:grid;grid-template-columns:44px repeat(5,minmax(0,1fr));min-width:300px}
.lpp-dh{font-size:12px;font-weight:600;color:var(--dim);text-align:center;padding-bottom:6px}
.lpp-times,.lpp-col{position:relative;height:calc(var(--lpp-hh)*9)}
.lpp-times span{position:absolute;right:6px;font-family:var(--mono);font-size:11px;color:var(--dimmer);transform:translateY(-50%);font-variant-numeric:tabular-nums}
.lpp-times span:first-child{transform:none}
.lpp-times span:last-child{transform:translateY(-100%)}
.lpp-col{border-left:1px solid var(--line);background-image:linear-gradient(to bottom,var(--line) 1px,transparent 1px);background-size:100% var(--lpp-hh);background-position:0 0}
.lpp-blk{position:absolute;box-sizing:border-box;border-radius:7px;padding:4px 6px;font-size:11.5px;line-height:1.25;overflow:hidden;color:var(--fg);background:color-mix(in srgb,var(--lpp-c) 13%,var(--panel));border:1px solid var(--lpp-c);border-left-width:3px}
.lpp-blk b{font-family:var(--mono);font-size:11.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lpp-blk>span{color:var(--dim);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lpp-blk--clash{background:color-mix(in srgb,var(--red) 12%,var(--panel));border-color:var(--red)}
.lpp-blk--clash b,.lpp-blk .lpp-cx{color:var(--red)}
.lpp-blk--clash b{white-space:normal}
.lpp-cx{font-weight:700;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em}
.lpp-sum{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12.5px;color:var(--dim);padding:0 12px 10px;margin:0}
.lpp-sum b{color:var(--fg);font-family:var(--mono);font-variant-numeric:tabular-nums}
.lpp-status{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-top:1px solid var(--line);font-size:13px;margin:0;color:var(--fg)}
.lpp-status svg{width:16px;height:16px;flex:none;margin-top:2px}
.lpp-status--ok svg{color:var(--acid)}
.lpp-status--bad{color:var(--red);background:color-mix(in srgb,var(--red) 10%,var(--panel))}
.lpp-hint{font-size:13px;color:var(--dim);margin:10px 0 0;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px}
.lpp-hint[hidden]{display:none}
.lpp-link{border:0;background:none;color:var(--cyan);text-decoration:underline;text-underline-offset:2px;cursor:pointer;padding:0;font:inherit;min-height:24px}
.lpp-link:focus-visible{outline:2px solid var(--cyan);outline-offset:2px;border-radius:3px}
.lpp-steps-h{margin:22px 0 8px;font-size:15px}
.lpp-steps{margin:0;padding:0;list-style:none;counter-reset:lpp}
.lpp-steps li{counter-increment:lpp;display:grid;grid-template-columns:28px minmax(0,1fr);column-gap:10px;padding:10px 14px}
.lpp-steps li+li{border-top:1px solid var(--line)}
.lpp-steps li::before{content:counter(lpp);grid-row:span 2;font-family:var(--mono);font-weight:700;color:var(--acid);font-size:13px;width:24px;height:24px;border-radius:50%;border:1px solid var(--line-hot);display:grid;place-items:center}
.lpp-steps b{font-weight:600;color:var(--fg)}
.lpp-steps p{margin:2px 0 0;color:var(--dim);font-size:13px}
@media (max-width:860px){.lpp-builder{grid-template-columns:minmax(0,1fr)}}
@media (max-width:560px){
.lpp-picks{padding:2px 12px}
.lpp-grid-wrap{padding:10px 8px 8px}
.lpp-wk{--lpp-hh:40px;grid-template-columns:36px repeat(5,minmax(0,1fr))}
.lpp-times span{font-size:10px;right:4px}
.lpp-blk{padding:3px 4px;font-size:10.5px}
.lpp-blk b{font-size:10.5px;white-space:normal;line-height:1.15;word-break:break-word}
.lpp-blk .lpp-when,.lpp-blk .lpp-room{display:none}
.lpp-blk--clash{padding:3px 2px 3px 3px}
.lpp-blk--clash .lpp-num,.lpp-blk--clash .lpp-cx{display:none}
.lpp-blk--clash b{white-space:nowrap;text-overflow:clip;font-size:9.5px;letter-spacing:-.02em}
}
</style>`

// lppJS, varsayılan çizelgeyi bozmadan seçimleri canlı hâle getirir.
// Kural (çakışma, şerit yerleşimi, metinler) Go tarafındaki lppLayout ve
// lppStatusHTML ile aynıdır.
const lppJS = `<script>(function(){var root=document.getElementById('lpp'),dataEl=document.getElementById('lpp-data');if(!root||!dataEl)return;var D;try{D=JSON.parse(dataEl.textContent)}catch(e){return}
var T=D.t,C=D.c,S=510,E=1050,pick=C.map(function(c){return c.d});
function esc(s){return String(s).replace(/[&<>"]/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]})}
function hm(m){return(m<600?'0':'')+Math.floor(m/60)+':'+(m%60<10?'0':'')+m%60}
function fmt(s,n){return s.replace('%d',n)}
function sec(i){var c=C[i];for(var k=0;k<c.s.length;k++)if(c.s[k].crn===pick[i])return c.s[k];return c.s[0]}
function pct(v){return v.toFixed(3)+'%'}
function codeHTML(c){var i=c.indexOf(' ');return i<0?esc(c):esc(c.slice(0,i))+'<span class="lpp-num"> '+esc(c.slice(i+1))+'</span>'}
function render(){var bl=[],pairs=[],i,j;
C.forEach(function(c,ci){var s=sec(ci);s.sl.forEach(function(sl){bl.push({ci:ci,s:s,d:sl[0],a:sl[1],b:sl[2],r:sl[3],lane:0,lanes:1})})});
for(i=0;i<bl.length;i++)for(j=i+1;j<bl.length;j++){var x=bl[i],y=bl[j];if(x.ci!==y.ci&&x.d===y.d&&x.a<y.b&&y.a<x.b){x.clash=y.clash=true;pairs.push([x,y])}}
for(var d=0;d<5;d++){var day=bl.filter(function(b){return b.d===d}).sort(function(p,q){return p.a-q.a||p.ci-q.ci}),cl=[],end=-1;
var flush=function(){var n=0;cl.forEach(function(b){n=Math.max(n,b.lane+1)});cl.forEach(function(b){b.lanes=n});cl=[]};
day.forEach(function(b){if(cl.length&&b.a>=end)flush();var used={};cl.forEach(function(o){if(o.b>b.a)used[o.lane]=1});var l=0;while(used[l])l++;b.lane=l;cl.push(b);if(b.b>end)end=b.b});if(cl.length)flush()}
var cols=root.querySelectorAll('.lpp-col');for(d=0;d<cols.length;d++){cols[d].innerHTML=bl.filter(function(b){return b.d===d}).map(function(b){var w=100/b.lanes,t=hm(b.a)+'–'+hm(b.b);
return '<div class="lpp-blk lpp-c'+(b.ci+1)+(b.clash?' lpp-blk--clash':'')+'" style="top:calc('+pct((b.a-S)/(E-S)*100)+' + 1px);height:calc('+pct((b.b-b.a)/(E-S)*100)+' - 2px);left:calc('+pct(w*b.lane)+' + 2px);width:calc('+pct(w)+' - 4px)" title="'+esc(b.s.code+' · CRN '+b.s.crn+' · '+T.days[b.d]+' '+t+' · '+b.s.ins)+'"><b>'+codeHTML(b.s.code)+'</b>'+(b.clash?'<span class="lpp-cx">'+esc(T.tag)+'</span>':'')+'<span class="lpp-when">'+t+'</span><span class="lpp-room">'+esc(b.r)+'</span></div>'}).join('')}
var bad={};pairs.forEach(function(p){bad[p[0].ci]=bad[p[1].ci]=1});
C.forEach(function(c,ci){var s=sec(ci),el=root.querySelector('.lpp-pick[data-i="'+ci+'"]');if(el)el.classList.toggle('lpp-pick--bad',!!bad[ci]);var sel=document.getElementById('lpp-sel-'+(ci+1));if(sel&&sel.value!==s.crn)sel.value=s.crn;
var left=s.cap-s.enr,fc='',pc='lpp-pill--ok',pt=fmt(T.left,left);if(left<0){fc='lpp-fill--full';pc='lpp-pill--full';pt=fmt(T.fullPlus,-left)}else if(left===0){fc='lpp-fill--full';pc='lpp-pill--full';pt=T.full}else if(left<=s.cap*0.05){fc='lpp-fill--warn';pc='lpp-pill--warn'}
var info=document.getElementById('lpp-info-'+(ci+1));if(info)info.innerHTML='<span class="lpp-hoca">'+esc(s.ins)+'</span><span class="lpp-fill '+fc+'"><span class="lpp-bar"><i style="width:'+Math.min(100,s.enr/s.cap*100).toFixed(1)+'%"></i></span><span class="lpp-n">'+s.enr+'/'+s.cap+'</span></span><span class="lpp-pill '+pc+'">'+esc(pt)+'</span>'});
var mins=bl.reduce(function(a,b){return a+b.b-b.a},0),h=mins/60,hs=(h%1?h.toFixed(1):String(h)).replace('.',T.dec);
var sum=document.getElementById('lpp-sum');if(sum)sum.innerHTML='<span><b>'+C.length+'</b> '+esc(T.courses)+'</span><span><b>'+hs+'</b> '+esc(T.hours)+'</span><span>CRN <b>'+C.map(function(c,ci){return sec(ci).crn}).join(' ')+'</b></span>';
var st=document.getElementById('lpp-status');if(!st)return;
if(pairs.length){st.className='lpp-status lpp-status--bad';st.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5M12 18v.5"/></svg><span><b>'+esc(fmt(pairs.length>1?T.many:T.one,pairs.length))+'</b> '+esc(pairs.map(function(p){var x=p[0],y=p[1];return x.s.code+' ('+x.s.crn+') '+T['with']+' '+y.s.code+' ('+y.s.crn+'), '+T.days[x.d]+' '+hm(Math.max(x.a,y.a))+'–'+hm(Math.min(x.b,y.b))}).join('; '))+'</span>'}
else{st.className='lpp-status lpp-status--ok';st.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg><span>'+esc(T.none)+'</span>'}}
root.querySelectorAll('.lpp-sel').forEach(function(sel){sel.addEventListener('change',function(){pick[+sel.getAttribute('data-i')]=sel.value;render()})});
var hint=document.getElementById('lpp-hint');if(hint){hint.hidden=false;hint.addEventListener('click',function(e){var btn=e.target.closest('[data-lpp]');if(!btn)return;var act=btn.getAttribute('data-lpp');
if(act==='clash'&&D.x){pick=C.map(function(c){return c.d});pick[D.x[0]]=D.x[1];render();var s=document.getElementById('lpp-sel-'+(D.x[0]+1));if(s)s.focus()}
else if(act==='reset'){pick=C.map(function(c){return c.d});render()}})}
render()})()</script>`
