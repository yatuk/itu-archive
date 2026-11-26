package site

// /kontenjan/ iniş sayfasının veriden üretilen gövdesi: özet şeridi (şube,
// kontenjanlı, dolu, son ölçüm), "En hızlı dolan dersler" tablosu, "Boş yer
// bol" listesi ve sık sorular. Hepsi derleme anında aktif dönemin
// search.json dökümünden hesaplanır; sayılar sayfada düz metin olarak durur,
// JS yalnızca tabloya arama süzgeci ekler. Sınıflar lpk- önekini taşır ve
// yalnızca style.css'teki tema değişkenlerini kullanır (sade ve fosfor).

import (
	"encoding/json"
	"fmt"
	"html/template"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// kontSect, aktif dönemdeki tek bir şubenin kontenjan alanları.
type kontSect struct {
	Code, Name string
	Cap, Enr   int
}

// kontCourse, bir dersin kontenjanlı şubelerinin toplamı.
type kontCourse struct {
	Code, Name string
	Sections   int // kontenjanlı şube sayısı
	Full       int // yazılan >= kontenjan olan şube sayısı
	Enr, Cap   int
}

// kontStats, sayfanın ham verisi.
type kontStats struct {
	Term     string // "2026-2027 Güz"
	Total    int    // tüm şubeler
	Quota    int    // kontenjanı > 0 olan şubeler
	Full     int    // dolu şubeler (kontenjanlılar içinde)
	Measured string // son ölçüm, ISO-8601 (boş olabilir)
	Top      []kontCourse
	Free     []kontCourse
}

const (
	kontMinSections = 3
	kontMinCap      = 150
	kontTopN        = 10
	kontFreeN       = 4
)

// computeKontenjan, şube listesinden özet sayıları ve iki sıralamayı üretir.
// Sıralamalar yalnızca kontenjanı > 0 olan şubeleri kullanır; en az 3 şubesi
// ve en az 150 toplam kontenjanı olan dersler aday olur. Oran yazılan /
// kontenjan; eşitlikte ders kodu sırası. Aynı veri her zaman aynı çıktıyı verir.
func computeKontenjan(sects []kontSect) (total, quota, full int, top, free []kontCourse) {
	total = len(sects)
	by := map[string]*kontCourse{}
	for _, s := range sects {
		if s.Cap <= 0 {
			continue
		}
		quota++
		c := by[s.Code]
		if c == nil {
			c = &kontCourse{Code: s.Code, Name: s.Name}
			by[s.Code] = c
		}
		c.Sections++
		c.Cap += s.Cap
		c.Enr += s.Enr
		if s.Enr >= s.Cap {
			full++
			c.Full++
		}
	}
	var cands []kontCourse
	for _, c := range by {
		if c.Sections >= kontMinSections && c.Cap >= kontMinCap {
			cands = append(cands, *c)
		}
	}
	// a.Enr/a.Cap ? b.Enr/b.Cap, tam sayı çarpımıyla (kayan nokta yok).
	cmp := func(a, b kontCourse) int {
		l, r := a.Enr*b.Cap, b.Enr*a.Cap
		switch {
		case l > r:
			return 1
		case l < r:
			return -1
		}
		return 0
	}
	top = append([]kontCourse(nil), cands...)
	sort.Slice(top, func(i, j int) bool {
		if c := cmp(top[i], top[j]); c != 0 {
			return c > 0
		}
		return top[i].Code < top[j].Code
	})
	free = append([]kontCourse(nil), cands...)
	sort.Slice(free, func(i, j int) bool {
		if c := cmp(free[i], free[j]); c != 0 {
			return c < 0
		}
		return free[i].Code < free[j].Code
	})
	if len(top) > kontTopN {
		top = top[:kontTopN]
	}
	if len(free) > kontFreeN {
		free = free[:kontFreeN]
	}
	return
}

// kontenjanStats, aktif dönemin şube dökümünü ve son ölçüm zamanını okur.
func (b *Builder) kontenjanStats() (kontStats, bool) {
	slug := b.index.CurrentSlug
	if slug == "" {
		return kontStats{}, false
	}
	var rows [][]json.RawMessage
	if err := readJSON(filepath.Join(b.root, "data", "terms", slug, "search.json"), &rows); err != nil || len(rows) == 0 {
		return kontStats{}, false
	}
	sects := make([]kontSect, 0, len(rows))
	for _, r := range rows {
		if len(r) < 8 {
			continue
		}
		var s kontSect
		var cp, en float64
		json.Unmarshal(r[1], &s.Code)
		json.Unmarshal(r[2], &s.Name)
		json.Unmarshal(r[6], &cp)
		json.Unmarshal(r[7], &en)
		s.Cap, s.Enr = int(cp), int(en)
		sects = append(sects, s)
	}
	st := kontStats{Term: shortTermLabel(b.index.CurrentTerm)}
	st.Total, st.Quota, st.Full, st.Top, st.Free = computeKontenjan(sects)
	if st.Quota == 0 {
		return kontStats{}, false
	}
	st.Measured = b.kontenjanMeasured(slug)
	return st, true
}

// kontenjanMeasured, uygulamanın "son ölçüm" dediği zaman: doluluk serisinin
// son anlık görüntüsü (quota/<slug>.json last/finalAt) ile dönem donduysa
// status.json freeze.measuredAt'in en geç olanı; ikisi de yoksa tarama zamanı.
func (b *Builder) kontenjanMeasured(slug string) string {
	var best string
	pick := func(iso string) {
		if iso > best {
			best = iso
		}
	}
	var q struct {
		Last    string `json:"last"`
		FinalAt string `json:"finalAt"`
	}
	if readJSON(filepath.Join(b.root, "data", "quota", slug+".json"), &q) == nil {
		pick(q.Last)
		pick(q.FinalAt)
	}
	var status struct {
		Freeze *struct {
			Slug       string `json:"slug"`
			Frozen     bool   `json:"frozen"`
			MeasuredAt string `json:"measuredAt"`
		} `json:"freeze"`
	}
	if readJSON(filepath.Join(b.root, "data", "status.json"), &status) == nil && status.Freeze != nil &&
		status.Freeze.Frozen && status.Freeze.Slug == slug {
		pick(status.Freeze.MeasuredAt)
	}
	if best == "" {
		best = b.index.ScrapedAt
	}
	return best
}

// kontenjanSections, writeLandingPage'in özet, SSS ve şema yuvalarını doldurur.
// Veri yoksa üçü de boş döner ve sayfa elle yazılmış metinle kalır.
func (b *Builder) kontenjanSections() (body, faq string, schema map[string]any) {
	st, ok := b.kontenjanStats()
	if !ok {
		return "", "", nil
	}
	link := func(code string) bool { return b.courses[code] != nil }
	return st.bodyHTML(link), st.faqHTML(), st.faqSchema()
}


// kontDay, ISO zamanı kampüs saatine (UTC+3, 2016'dan beri sabit) çevirip
// ("12 Eki", "2026", "2026-10-12") döner.
func kontDay(iso string) (dayMonth, year, date string) {
	t, err := time.Parse(time.RFC3339, iso)
	if err != nil {
		return "", "", ""
	}
	t = t.In(time.FixedZone("TRT", 3*3600))
	return fmt.Sprintf("%d %s", t.Day(), trMonthsShort[t.Month()]), fmt.Sprint(t.Year()), t.Format("2006-01-02")
}

func (s kontStats) pct() int {
	if s.Quota == 0 {
		return 0
	}
	return (s.Full*100 + s.Quota/2) / s.Quota
}

// kontPill, bir dersin toplam doluluk etiketi: aşıldı/doldu kırmızı, %5 veya
// daha az yer kaldıysa sarı, aksi halde sade "N yer".
func kontPill(enr, cap int) (cls, text string) {
	switch {
	case enr > cap:
		return "lpk-pill lpk-full", fmt.Sprintf("dolu +%d", enr-cap)
	case enr == cap:
		return "lpk-pill lpk-full", "dolu"
	case (cap-enr)*20 <= cap:
		return "lpk-pill lpk-warn", fmt.Sprintf("%d yer", cap-enr)
	}
	return "lpk-pill lpk-ok", fmt.Sprintf("%d yer", cap-enr)
}

func kontBar(enr, cap int) string {
	w := 100.0
	if cap > 0 && enr < cap {
		w = float64(enr) * 100 / float64(cap)
	}
	cls := "lpk-bar"
	switch {
	case enr >= cap:
		cls += " lpk-full"
	case (cap-enr)*20 <= cap:
		cls += " lpk-warn"
	}
	return fmt.Sprintf(`<span class="%s" aria-hidden="true"><i style="width:%.1f%%"></i></span>`, cls, w)
}

func kontCode(code string, link func(string) bool) string {
	esc := template.HTMLEscapeString(code)
	if link != nil && link(code) {
		return `<a class="lpk-code" href="/ders/` + courseSlug(code) + `/">` + esc + `</a>`
	}
	return `<span class="lpk-code">` + esc + `</span>`
}

const kontSearchIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`

// bodyHTML, özet şeridi + tablo + "Boş yer bol" + stil ve süzgeç betiği.
// link, ders sayfası olan kodlar için true döner (yönlendirmeye çarpmasın).
func (s kontStats) bodyHTML(link func(string) bool) string {
	var sb strings.Builder
	sb.WriteString(kontenjanStyle)
	sb.WriteString(`<section class="lpk" aria-label="Kontenjan özeti">`)

	// Özet şeridi
	sb.WriteString(`<dl class="lpk-stats">`)
	fmt.Fprintf(&sb, `<div><dt>Şube</dt><dd><strong>%s</strong><span>%s</span></dd></div>`,
		kontNum(s.Total), template.HTMLEscapeString(s.Term))
	fmt.Fprintf(&sb, `<div><dt>Kontenjanlı</dt><dd><strong>%s</strong><span>%s şubede kontenjan yok</span></dd></div>`,
		kontNum(s.Quota), kontNum(s.Total-s.Quota))
	fmt.Fprintf(&sb, `<div><dt>Dolu</dt><dd><strong>%s</strong><span>%s şubenin %%%d'%s</span>`+
		`<span class="lpk-bar lpk-full lpk-statbar" aria-hidden="true"><i style="width:%d%%"></i></span></dd></div>`,
		kontNum(s.Full), kontNum(s.Quota), s.pct(), trPossessive(s.pct()), s.pct())
	if dm, y, d := kontDay(s.Measured); dm != "" {
		fmt.Fprintf(&sb, `<div><dt>Son ölçüm</dt><dd><strong><time datetime="%s">%s</time></strong><span>%s</span></dd></div>`, d, dm, y)
	}
	sb.WriteString(`</dl>`)

	sb.WriteString(`<div class="lpk-grid"><div class="lpk-main">`)
	sb.WriteString(`<h2 class="lpk-h" id="lpk-top">En hızlı dolan dersler <small>yazılan / kontenjan oranına göre</small></h2>`)
	sb.WriteString(`<div class="lpk-search" hidden><label for="lpk-q"><span class="lpk-sr">Tabloda ders ara</span>` + kontSearchIcon +
		`</label><input id="lpk-q" type="search" placeholder="ders kodu veya adı" autocomplete="off" spellcheck="false" aria-controls="lpk-body"></div>`)
	sb.WriteString(`<div class="lpk-tblwrap"><table class="lpk-tbl" aria-labelledby="lpk-top"><thead><tr>` +
		`<th scope="col">Kod</th><th scope="col" class="lpk-col-nm">Ders adı</th><th scope="col" class="lpk-r lpk-col-sb">Şube</th>` +
		`<th scope="col" class="lpk-r">Dolu şube</th><th scope="col" class="lpk-r">Yazılan / kontenjan</th></tr></thead><tbody id="lpk-body">`)
	for _, c := range s.Top {
		cls, pill := kontPill(c.Enr, c.Cap)
		name := template.HTMLEscapeString(c.Name)
		fmt.Fprintf(&sb, `<tr data-lpk-row><td>%s<span class="lpk-nm-m">%s</span></td><td class="lpk-col-nm">%s</td>`+
			`<td class="lpk-n lpk-col-sb">%d</td><td class="lpk-n">%d<span class="lpk-of">/%d</span></td>`+
			`<td class="lpk-fl"><span class="lpk-fill">%s<span class="lpk-num">%d/%d</span><span class="%s">%s</span></span></td></tr>`,
			kontCode(c.Code, link), name, name, c.Sections, c.Full, c.Sections, kontBar(c.Enr, c.Cap), c.Enr, c.Cap, cls, pill)
	}
	sb.WriteString(`</tbody></table></div>`)
	sb.WriteString(`<p class="lpk-empty" id="lpk-empty" hidden>Bu aramaya uyan ders tabloda yok. Tüm şubeler için <a href="/#dersler">Dersler sekmesini</a> aç.</p>`)
	sb.WriteString(`<ul class="lpk-legend" aria-label="Etiketler"><li><span class="lpk-pill lpk-full">dolu</span> kontenjan doldu</li>` +
		`<li><span class="lpk-pill lpk-full">dolu +N</span> kontenjan aşıldı</li>` +
		`<li><span class="lpk-pill lpk-warn">N yer</span> %5 veya daha az kaldı</li></ul>`)
	sb.WriteString(`</div>`)

	if len(s.Free) > 0 {
		sb.WriteString(`<div class="lpk-side"><h2 class="lpk-h" id="lpk-free-h">Boş yer bol</h2><ul class="lpk-free" aria-labelledby="lpk-free-h">`)
		for _, c := range s.Free {
			fmt.Fprintf(&sb, `<li><span class="lpk-free-a">%s<span class="lpk-free-nm">%s · %d şube</span></span>`+
				`<span class="lpk-free-r"><span class="lpk-pill lpk-ok">%s yer</span><span class="lpk-num">%d/%d</span></span></li>`,
				kontCode(c.Code, link), template.HTMLEscapeString(c.Name), c.Sections, kontNum(c.Cap-c.Enr), c.Enr, c.Cap)
		}
		sb.WriteString(`</ul></div>`)
	}
	sb.WriteString(`</div>`)
	fmt.Fprintf(&sb, `<p class="lpk-note">Tablo, en az %d kontenjanlı şubesi ve toplam %d kontenjanı olan dersleri kapsar. Tüm %s şube, doluluk geçmişi ve dolma hızı <a href="/#dersler">Dersler sekmesinde</a>.</p>`,
		kontMinSections, kontMinCap, kontNum(s.Total))
	sb.WriteString(`</section>`)
	sb.WriteString(kontenjanScript)
	return sb.String()
}

func (s kontStats) faq() []guideQA {
	return []guideQA{
		{q: "Doluluk nasıl hesaplanıyor?",
			a: "Her şube için OBS'deki yazılan öğrenci sayısı kontenjana bölünür. Ders satırı, o dersin kontenjanlı tüm şubelerinin toplamını gösterir; dolu şube sütunu kaç şubede yer kalmadığını sayar."},
		{q: "Yazılan sayısı neden kontenjanı geçiyor?",
			a: "OBS bazı şubelerde kontenjanın üstünde kayıt gösterir. Bu dersler \"dolu +N\" olarak işaretlenir; N, kontenjanı aşan öğrenci sayısıdır."},
		{q: "Bir dersin geçmiş dönemlerde ne kadar hızlı dolduğunu görebilir miyim?",
			a: "Evet. Dersler sekmesinde dersi açınca şubelerin ne zaman dolduğu ve önceki dönemlerin doluluk geçmişi ders panelinde görünür."},
		{q: "Kontenjanı olmayan şubeler neden ayrı?",
			a: fmt.Sprintf("%s döneminde açılan %s şubenin %s tanesinde kontenjan yayımlanmamış. Doluluk oranları yalnızca kontenjanı olan %s şube üzerinden hesaplanır.",
				s.Term, kontNum(s.Total), kontNum(s.Total-s.Quota), kontNum(s.Quota))},
	}
}

func (s kontStats) faqHTML() string {
	qa := s.faq()
	esc := make([]guideQA, len(qa))
	for i, it := range qa {
		esc[i] = guideQA{q: template.HTMLEscapeString(it.q), a: template.HTMLEscapeString(it.a)}
	}
	return renderGuideFAQ("Sık sorulan sorular", esc)
}

func (s kontStats) faqSchema() map[string]any {
	var ents []any
	for _, it := range s.faq() {
		ents = append(ents, map[string]any{
			"@type": "Question", "name": it.q,
			"acceptedAnswer": map[string]any{"@type": "Answer", "text": it.a},
		})
	}
	return map[string]any{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ents}
}

// kontenjanScript, tablo satırlarını ders kodu veya adına göre süzer. Türkçe
// harfleri ve boşlukları yok sayar ("ins305" -> "INS 305E"). JS yoksa arama
// kutusu gizli kalır, tablo olduğu gibi okunur.
const kontenjanScript = `<script>(function(){var w=document.querySelector('.lpk-search'),q=document.getElementById('lpk-q');if(!w||!q)return;w.hidden=false;` +
	`var rows=[].slice.call(document.querySelectorAll('[data-lpk-row]')),empty=document.getElementById('lpk-empty');` +
	`function n(s){return s.toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'')}` +
	`rows.forEach(function(r){r.k=n(r.cells[0].textContent+' '+r.cells[1].textContent)});` +
	`q.addEventListener('input',function(){var v=n(q.value),c=0;rows.forEach(function(r){var ok=!v||r.k.indexOf(v)>=0;r.hidden=!ok;if(ok)c++});if(empty)empty.hidden=c>0})})();</script>`

// kontenjanStyle, yalnızca bu sayfanın bölümleri için. Renkler style.css'teki
// tema değişkenlerinden gelir; sade ve fosfor temaları kendiliğinden çalışır.
const kontenjanStyle = `<style>
.lpk{margin:16px 0 8px}
.lpk-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.lpk-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:0 0 20px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius-card,14px)}
.lpk-stats>div{padding:12px 16px;min-width:0}
.lpk-stats>div+div{border-left:1px solid var(--line)}
.lpk-stats dt{font-size:11.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--dimmer);font-weight:600}
.lpk-stats dd{margin:0}
.lpk-stats strong{display:block;margin-top:2px;font-family:var(--mono);font-size:22px;font-variant-numeric:tabular-nums;color:var(--fg)}
.lpk-stats dd>span{display:block;font-size:12.5px;color:var(--dim)}
.lpk-stats .lpk-statbar{display:block;width:100%;margin-top:6px}
.lpk-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start}
.lpk-main,.lpk-side{min-width:0}
.lpk-h{margin:4px 0 10px;font-size:17px}
.lpk-h small{display:inline-block;margin-left:6px;font-size:12.5px;font-weight:400;color:var(--dim)}
.lpk-search{position:relative;margin-bottom:10px}
.lpk-search svg{position:absolute;left:12px;top:50%;width:16px;height:16px;transform:translateY(-50%);color:var(--dimmer);pointer-events:none}
.lpk-search input{box-sizing:border-box;width:100%;min-height:44px;padding:8px 12px 8px 36px;font:inherit;font-size:15px;color:var(--fg);background:var(--panel);border:1px solid var(--line-hot);border-radius:10px}
.lpk-search input::placeholder{color:var(--dimmer)}
.lpk-search input:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}
.lpk-tblwrap{overflow-x:auto;-webkit-overflow-scrolling:touch;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius-card,14px)}
.lpk-tbl{width:100%;min-width:0;border-collapse:collapse;font-size:14px}
.lpk-tbl th{position:static;padding:10px 14px;text-align:left;font-size:11.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--dimmer);font-weight:600;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;border-bottom:1px solid var(--line);white-space:nowrap}
.lpk-tbl td{padding:0 14px;vertical-align:middle;border-top:1px solid var(--line);border-bottom:0;color:var(--fg)}
.lpk-tbl tbody tr:first-child td{border-top:0}
.lpk-tbl .lpk-r{text-align:right}
.lpk-code{display:inline-flex;align-items:center;min-height:44px;font-family:var(--mono);font-weight:700;font-size:13px;white-space:nowrap;color:var(--fg)}
a.lpk-code{text-decoration:none}
a.lpk-code:hover{color:var(--cyan);text-decoration:underline}
a.lpk-code:focus-visible{outline:2px solid var(--cyan);outline-offset:2px;border-radius:4px}
.lpk-nm-m{display:none}
.lpk-n{font-family:var(--mono);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
.lpk-of{color:var(--dimmer)}
.lpk-fl{white-space:nowrap}
.lpk-fill{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.lpk-num{min-width:82px;text-align:right;font-family:var(--mono);font-size:13px;font-variant-numeric:tabular-nums}
.lpk-bar{display:inline-block;position:relative;width:90px;height:6px;border-radius:999px;background:var(--line);overflow:hidden}
.lpk-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:inherit;background:var(--acid-vivid)}
.lpk-bar.lpk-warn i{background:var(--amber)}
.lpk-bar.lpk-full i{background:var(--red)}
.lpk-pill{display:inline-block;min-width:62px;box-sizing:border-box;text-align:center;font-size:11.5px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid currentColor;white-space:nowrap;line-height:1.5}
.lpk-pill.lpk-full{color:var(--red)}
.lpk-pill.lpk-warn{color:var(--amber)}
.lpk-pill.lpk-ok{color:var(--dim);border-color:var(--line-hot)}
.lpk-empty{margin:10px 0 0;color:var(--dim);font-size:14px}
.lpk-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin:10px 0 0;padding:0;list-style:none;font-size:12.5px;color:var(--dim)}
.lpk-legend li{display:inline-flex;align-items:center;gap:6px}
.lpk-legend .lpk-pill{min-width:0}
.lpk-free{margin:0;padding:4px 14px;list-style:none;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius-card,14px)}
.lpk-free li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:4px 0 8px}
.lpk-free li+li{border-top:1px solid var(--line)}
.lpk-free-a{display:flex;flex-direction:column;min-width:0}
.lpk-free-a .lpk-code{min-height:40px}
.lpk-free-nm{margin-top:-8px;font-size:13px;color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lpk-free-r{display:grid;gap:3px;justify-items:end;flex:none}
.lpk-free-r .lpk-pill{min-width:0}
.lpk-free-r .lpk-num{min-width:0;font-size:12.5px;color:var(--dim)}
.lpk-note{margin:14px 0 0;color:var(--dim);font-size:13.5px}
@media (max-width:900px){.lpk-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:640px){
.lpk-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.lpk-stats>div:nth-child(3){border-left:0}
.lpk-stats>div:nth-child(n+3){border-top:1px solid var(--line)}
.lpk-col-nm,.lpk-col-sb{display:none}
.lpk-nm-m{display:block;margin:-8px 0 8px;color:var(--dim);font-size:12.5px;line-height:1.35}
.lpk-tbl th,.lpk-tbl td{padding-left:10px;padding-right:10px}
.lpk-tbl td.lpk-fl{padding-top:8px;padding-bottom:8px}
.lpk-fill{flex-direction:column;align-items:flex-end;gap:3px}
.lpk-bar{width:48px}
.lpk-num{min-width:0}
}
</style>`

// kontNum, sayıyı ayırıcısız yazar (taslaktaki gibi: 5463, 2308/2260);
// tablo ve şerit aynı tek biçimi kullanır.
func kontNum(n int) string { return fmt.Sprint(n) }

// trPossessive, 0-100 arası bir sayının okunuşuna göre iyelik ekini döner:
// %24'ü (dördü), %20'si (yirmisi), %71'i (biri), %40'ı (kırkı).
func trPossessive(n int) string {
	if n < 0 {
		n = -n
	}
	if n == 0 {
		return "ı"
	}
	if n%100 == 0 {
		return "ü"
	}
	units := [...]string{"", "i", "si", "ü", "ü", "i", "sı", "si", "i", "u"}
	tens := [...]string{"", "u", "si", "u", "ı", "si", "ı", "i", "i", "ı"}
	if d := n % 10; d != 0 {
		return units[d]
	}
	return tens[(n/10)%10]
}
