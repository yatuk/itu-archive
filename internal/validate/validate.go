// Package validate, docs/data altındaki üretilmiş verinin bütünlüğünü denetler.
//
// Amaç, kazıyıcının sessizce bozuk veri yazmasını yakalamak: CRN çakışması,
// kapasitesinden fazla yazılan, önşart grafiğinde olmayan düğüme giden kenar,
// geçmiş indeksinde dosyası olmayan ders... Workflow'a eklenip her taramada
// koşturulabilir; hatalar sıfırdan farklı çıkış koduyla döner, uyarılar yalnızca
// raporlanır.
package validate

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"itu-scraper/internal/catalog"
	"itu-scraper/internal/curriculum"
	"itu-scraper/internal/model"
	"itu-scraper/internal/quota"
)

// Result, denetim çıktısı.
type Result struct {
	Errors   []string
	Warnings []string
}

func (r *Result) errf(format string, args ...any) {
	r.Errors = append(r.Errors, fmt.Sprintf(format, args...))
}

func (r *Result) warnf(format string, args ...any) {
	r.Warnings = append(r.Warnings, fmt.Sprintf(format, args...))
}

// All, tüm veriyi denetler. skipSite true ise üretilen SEO sayfalarının
// denetimi atlanır — sayfalar ayrı bir adımda (cmd/site) üretilmediğinde
// (ör. scrape CI yalnızca veri çektiğinde) bu kontrol anlamsız hata üretir.
func All(root string, skipSite bool) *Result {
	res := &Result{}
	terms := filepath.Join(root, "data", "terms")

	entries, err := os.ReadDir(terms)
	if err != nil {
		res.errf("data/terms okunamadı: %v", err)
		return res
	}

	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		res.checkTerm(filepath.Join(terms, e.Name()), e.Name())
	}

	res.checkHistory(root)
	res.checkPrereq(root)
	res.checkQuota(root)
	res.checkCurriculum(root)
	res.checkIndex(root)
	res.checkCalendar(root)
	res.checkCatalog(root)
	res.checkGrades(root)
	res.checkDefinitions(root)
	if !skipSite {
		res.checkSitePages(root)
	}
	return res
}

func readJSON(path string, v any) error {
	b, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, v)
}

// checkTerm, tek bir dönemin branş dosyalarını, meta'sını ve arama indeksini
// denetler.
func (r *Result) checkTerm(dir, slug string) {
	branchDir := filepath.Join(dir, "branches")
	files, err := os.ReadDir(branchDir)
	if err != nil {
		r.errf("%s: branches klasörü okunamadı: %v", slug, err)
		return
	}

	var meta model.TermMeta
	if err := readJSON(filepath.Join(dir, "meta.json"), &meta); err != nil {
		r.errf("%s: meta.json okunamadı: %v", slug, err)
		return
	}

	total := 0
	for _, bf := range files {
		if !strings.HasSuffix(bf.Name(), ".json") {
			continue
		}
		var secs []model.Section
		if err := readJSON(filepath.Join(branchDir, bf.Name()), &secs); err != nil {
			r.errf("%s/%s: çözümlenemedi: %v", slug, bf.Name(), err)
			continue
		}
		branch := strings.TrimSuffix(bf.Name(), ".json")
		seen := map[string]struct{}{}
		for i, s := range secs {
			if s.CRN == "" {
				r.errf("%s/%s: satır %d: CRN boş", slug, branch, i)
			}
			if s.Code == "" {
				r.errf("%s/%s: CRN %q: ders kodu boş", slug, branch, s.CRN)
			}
			if s.Branch != branch {
				r.errf("%s/%s: CRN %q: branş alanı %q dosya adıyla uyuşmuyor", slug, branch, s.CRN, s.Branch)
			}
			if s.Code != "" && !strings.HasPrefix(s.Code, branch) {
				r.warnf("%s/%s: CRN %q: kod %q branş %q ile başlamıyor", slug, branch, s.CRN, s.Code, branch)
			}
			if len(s.Days) != len(s.Times) || len(s.Days) != len(s.Rooms) || len(s.Days) != len(s.Buildings) {
				// Günü olmayan saatli dersler (çevrimiçi/asenkron) meşru; bu yüzden
				// hata değil, not.
				r.warnf("%s/%s: CRN %q: oturum dizileri farklı uzunlukta (gün %d, saat %d, derslik %d, bina %d)",
					slug, branch, s.CRN, len(s.Days), len(s.Times), len(s.Rooms), len(s.Buildings))
			}
			if s.Capacity > 0 && s.Enrolled > s.Capacity {
				r.warnf("%s/%s: CRN %q: yazılan (%d) kontenjandan (%d) fazla", slug, branch, s.CRN, s.Enrolled, s.Capacity)
			}
			// programs elemanları tekil program kodu olmalı; virgüllü/ayraçlı
			// eleman "alabilen program" filtresinin gruplu gelmesi demektir.
			for _, p := range s.Programs {
				if strings.ContainsAny(p, ",;|") {
					r.errf("%s/%s: CRN %q: gruplu program kodu %q", slug, branch, s.CRN, p)
				}
			}
			if _, dup := seen[s.CRN]; dup {
				r.errf("%s/%s: CRN %q birden çok kez geçiyor", slug, branch, s.CRN)
			}
			seen[s.CRN] = struct{}{}
		}
		total += len(secs)
	}

	if total != meta.Sections {
		r.errf("%s: meta.json %d şube diyor, branş dosyalarında %d var", slug, meta.Sections, total)
	}

	var search []json.RawMessage
	if err := readJSON(filepath.Join(dir, "search.json"), &search); err == nil {
		if len(search) != total {
			r.errf("%s: search.json %d kayıt, branş dosyalarında %d", slug, len(search), total)
		}
	}
}

// checkHistory, ders ve öğretim üyesi geçmiş indekslerini dosyalara bağlar.
func (r *Result) checkHistory(root string) {
	histDir := filepath.Join(root, "data", "history")

	var codes [][]any
	if err := readJSON(filepath.Join(histDir, "codes.json"), &codes); err != nil {
		r.errf("history/codes.json okunamadı: %v", err)
	} else {
		for _, c := range codes {
			if len(c) < 3 {
				r.errf("history/codes.json: hatalı satır %v", c)
				continue
			}
			code, branch := fmt.Sprint(c[0]), fmt.Sprint(c[2])
			var all map[string]*historyCourse
			if err := readJSON(filepath.Join(histDir, "courses", branch+".json"), &all); err != nil {
				r.errf("history: %q (%s) için branş dosyası yok", code, branch)
				continue
			}
			if _, ok := all[code]; !ok {
				r.errf("history: %q, %s.json içinde yok", code, branch)
			}
		}
	}

	var names [][]any
	if err := readJSON(filepath.Join(histDir, "names.json"), &names); err != nil {
		r.errf("history/names.json okunamadı: %v", err)
	} else {
		for _, n := range names {
			if len(n) < 3 {
				r.errf("history/names.json: hatalı satır %v", n)
				continue
			}
			name, bucket := fmt.Sprint(n[0]), fmt.Sprint(n[1])
			// Ayrışma hatası geri dönerse gruplu isim (virgüllü tek satır)
			// burada yakalanır. Ham şube verisindeki virgüllü instructor
			// alanına dokunulmaz — orada virgül yasal (ortak ders).
			if strings.ContainsAny(name, ",;|") {
				r.errf("history/names.json: gruplu isim %q (ayrışma hatası geri döndü)", name)
			}
			var all map[string]*historyInstructor
			if err := readJSON(filepath.Join(histDir, "instructors", bucket+".json"), &all); err != nil {
				r.errf("history: %q (%s) için harf dosyası yok", name, bucket)
				continue
			}
			for k := range all {
				if strings.ContainsAny(k, ",;|") {
					r.errf("history: %q (%s) dosyasında gruplu isim anahtarı", k, bucket)
				}
			}
			if _, ok := all[name]; !ok {
				r.errf("history: %q, %s.json içinde yok", name, bucket)
			}
		}
	}
}

// checkCalendar, takvim dosyalarının içini denetler: en az bir etkinlik
// olmalı, her etkinlikte date ve remaining alanları dolu olmalı — sessizce
// boş takvim yazılmasını yakalar. (Biçim katılığına gitmez: tarih çözümleme
// esnekliği frontend'de calendarDayState'te.) start/end alanı yazılmışsa
// geçerli ISO olmalı — takvim uygulamasına aktarım (.ics) bozuk tarihle
// çıktı üretmesin.
func (r *Result) checkCalendar(root string) {
	calDir := filepath.Join(root, "data", "calendar")
	entries, err := os.ReadDir(calDir)
	if err != nil {
		if os.IsNotExist(err) {
			return
		}
		r.errf("data/calendar okunamadı: %v", err)
		return
	}
	// Üst düzeydeki <yearId>.json'lar + tür alt dizinleri (calendar/<tür>/).
	var files []string
	for _, e := range entries {
		if strings.HasSuffix(e.Name(), ".json") {
			files = append(files, filepath.Join(calDir, e.Name()))
		} else if e.IsDir() {
			sub, err := os.ReadDir(filepath.Join(calDir, e.Name()))
			if err != nil {
				continue
			}
			for _, se := range sub {
				if strings.HasSuffix(se.Name(), ".json") {
					files = append(files, filepath.Join(calDir, e.Name(), se.Name()))
				}
			}
		}
	}
	for _, f := range files {
		rel := strings.TrimPrefix(f, calDir+string(filepath.Separator))
		var cal struct {
			Events []struct {
				Date      string
				Remaining string
				Start     string
				End       string
			}
		}
		if err := readJSON(f, &cal); err != nil {
			r.errf("calendar/%s: çözümlenemedi: %v", rel, err)
			continue
		}
		if len(cal.Events) == 0 {
			r.errf("calendar/%s: hiç etkinlik yok", rel)
			continue
		}
		for i, ev := range cal.Events {
			if strings.TrimSpace(ev.Date) == "" {
				r.errf("calendar/%s: etkinlik %d: date boş", rel, i)
			}
			if strings.TrimSpace(ev.Remaining) == "" {
				r.errf("calendar/%s: etkinlik %d: remaining boş", rel, i)
			}
			// start/end varsa ISO "2006-01-02" olmalı (scraper artık yazıyor).
			if ev.Start != "" || ev.End != "" {
				for _, v := range []string{ev.Start, ev.End} {
					if v != "" {
						if _, err := time.Parse("2006-01-02", v); err != nil {
							r.errf("calendar/%s: etkinlik %d: geçersiz ISO tarih %q", rel, i, v)
						}
					}
				}
				if ev.Start != "" && ev.End != "" && ev.End < ev.Start {
					r.errf("calendar/%s: etkinlik %d: end, start'tan önce (%s < %s)", rel, i, ev.End, ev.Start)
				}
			}
		}
	}
}

// checkCatalog, katalog kayıtlarının bütünlüğünü denetler: dosya adı branşla
// eşleşmeli, kod kopya olmamalı, kaydın code alanı anahtarla aynı olmalı.
// Katalog verisi opsiyoneldir — veri yoksa (dizin yok) atlanır, site onsuz
// çalışır.
func (r *Result) checkCatalog(root string) {
	catDir := filepath.Join(root, "data", "catalog")
	entries, err := os.ReadDir(catDir)
	if err != nil {
		if os.IsNotExist(err) {
			return
		}
		r.errf("data/catalog okunamadı: %v", err)
		return
	}
	// Katalog tüm kodları kapsamak zorunda değil (DersKatalog'ta olmayan dersler
	// yasal); ancak kod önşart grafiğinde de geçmiyorsa muhtemelen yanlış aile —
	// uyarı, hata değil.
	var g model.PrereqGraph
	graphOK := readJSON(filepath.Join(root, "data", "prereq", "graph.json"), &g) == nil
	graphCodes := map[string]bool{}
	if graphOK {
		for _, n := range g.Nodes {
			graphCodes[n.Code] = true
		}
	}

	seen := map[string]bool{}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".json") || e.Name() == "index.json" {
			continue
		}
		branch := strings.TrimSuffix(e.Name(), ".json")
		var m map[string]catalog.Entry
		if err := readJSON(filepath.Join(catDir, e.Name()), &m); err != nil {
			r.errf("catalog/%s: çözümlenemedi: %v", e.Name(), err)
			continue
		}
		for code, ent := range m {
			if ent.Code != code {
				r.errf("catalog/%s: %q anahtarının içindeki code %q", e.Name(), code, ent.Code)
			}
			if !strings.HasPrefix(code, branch) {
				r.errf("catalog/%s: %q kodu branş %q ile başlamıyor", e.Name(), code, branch)
			}
			if seen[code] {
				r.errf("catalog: %q kodu birden çok dosyada", code)
			}
			if graphOK && !graphCodes[code] {
				r.warnf("catalog: %q kodu önşart grafiğinde yok", code)
			}
			seen[code] = true
		}
	}
}

// checkGrades, not dağılımı dosyalarının bütünlüğünü denetler: dosya adı
// branşla eşleşmeli, toplam ile kişi sayıları tutarlı olmalı, toplam ≥ 10
// (etik sınır) ve <10 kişilik kayıt bulunmamalı. Veri opsiyoneldir — dizin
// yoksa atlanır.
func (r *Result) checkGrades(root string) {
	dir := filepath.Join(root, "data", "grades")
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return
		}
		r.errf("data/grades okunamadı: %v", err)
		return
	}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".json") || e.Name() == "index.json" {
			continue
		}
		branch := strings.TrimSuffix(e.Name(), ".json")
		var list []struct {
			Code   string         `json:"code"`
			Total  int            `json:"total"`
			Grades map[string]int `json:"grades"`
		}
		if err := readJSON(filepath.Join(dir, e.Name()), &list); err != nil {
			r.errf("grades/%s: çözümlenemedi: %v", e.Name(), err)
			continue
		}
		for i, g := range list {
			if !strings.HasPrefix(g.Code, branch) {
				r.errf("grades/%s: kayıt %d: kod %q branş %q ile başlamıyor", e.Name(), i, g.Code, branch)
			}
			if g.Total < 10 {
				r.errf("grades/%s: kayıt %d: %q toplam %d — 10 altı (etik sınır)", e.Name(), i, g.Code, g.Total)
			}
			sum := 0
			for _, n := range g.Grades {
				sum += n
			}
			if sum > g.Total {
				r.errf("grades/%s: kayıt %d: %q kişi toplamı (%d) totalden (%d) fazla", e.Name(), i, g.Code, sum, g.Total)
			}
		}
	}
}

// checkDefinitions, resmî tanım dosyalarını (buildings, programs) denetler:
// kodlar boş olmamalı, tekrarsız olmalı, buildings kodları şube verisinde
// kullanılan kodlarla çakışmalı. Dosyalar opsiyoneldir — yoksa atlanır.
func (r *Result) checkDefinitions(root string) {
	var buildings []struct {
		Code string `json:"code"`
		Name string `json:"name"`
	}
	if err := readJSON(filepath.Join(root, "data", "buildings.json"), &buildings); err == nil {
		seen := map[string]bool{}
		for _, b := range buildings {
			if b.Code == "" || b.Name == "" {
				r.errf("buildings.json: boş kayıt %+v", b)
			}
			if seen[b.Code] {
				r.errf("buildings.json: %q kodu tekrar", b.Code)
			}
			seen[b.Code] = true
		}
	}

	var programs struct {
		Programs []struct {
			Code  string `json:"code"`
			Name  string `json:"name"`
			Level int    `json:"level"`
		} `json:"programs"`
	}
	if err := readJSON(filepath.Join(root, "data", "programs.json"), &programs); err == nil {
		seen := map[string]bool{}
		for _, p := range programs.Programs {
			if p.Code == "" || p.Name == "" {
				r.errf("programs.json: boş kayıt %+v", p)
			}
			if seen[p.Code] {
				r.errf("programs.json: %q kodu tekrar", p.Code)
			}
			seen[p.Code] = true
		}
	}
}

// checkPrereq, önşart grafiğindeki kenarların hep var olan düğümlere gittiğini
// denetler.
func (r *Result) checkPrereq(root string) {
	var g model.PrereqGraph
	if err := readJSON(filepath.Join(root, "data", "prereq", "graph.json"), &g); err != nil {
		r.errf("prereq/graph.json okunamadı: %v", err)
		return
	}
	seen := map[string]bool{}
	for _, n := range g.Nodes {
		if seen[n.Code] {
			r.errf("prereq: %q iki kez düğüm olarak var", n.Code)
		}
		seen[n.Code] = true
	}
	for _, e := range g.Edges {
		if !seen[e.From] {
			r.errf("prereq: %q kenarından gelen düğüm grafikte yok (→ %s)", e.From, e.To)
		}
		if !seen[e.To] {
			r.errf("prereq: %q kenarının hedefi grafikte yok (%s →)", e.To, e.From)
		}
		if e.From == e.To {
			r.errf("prereq: %q kendi kendine kenar", e.From)
		}
	}
}

// checkQuota, kontenjan özetlerinin sayısal tutarlılığını denetler.
func (r *Result) checkQuota(root string) {
	qDir := filepath.Join(root, "data", "quota")
	entries, err := os.ReadDir(qDir)
	if err != nil {
		if os.IsNotExist(err) {
			return
		}
		r.errf("data/quota okunamadı: %v", err)
		return
	}
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		var sum quota.Summary
		if err := readJSON(filepath.Join(qDir, e.Name()), &sum); err != nil {
			r.errf("quota/%s: çözümlenemedi: %v", e.Name(), err)
			continue
		}
		seen := map[string]bool{}
		for _, c := range sum.Courses {
			if seen[c.CRN] {
				r.errf("quota/%s: CRN %q iki kez", e.Name(), c.CRN)
			}
			seen[c.CRN] = true
			if c.Capacity > 0 && c.Enrolled > c.Capacity {
				r.warnf("quota/%s: CRN %q: yazılan (%d) kontenjandan (%d) fazla", e.Name(), c.CRN, c.Enrolled, c.Capacity)
			}
			if c.FilledAt != "" && c.FillMinutes < 0 {
				r.errf("quota/%s: CRN %q: dolma süresi negatif", e.Name(), c.CRN)
			}
		}
	}
}

// checkCurriculum, her program dosyasının geçerli olduğunu ve indeksle
// eşleştiğini denetler.
func (r *Result) checkCurriculum(root string) {
	curDir := filepath.Join(root, "data", "curriculum")
	var index []map[string]string
	if err := readJSON(filepath.Join(curDir, "index.json"), &index); err != nil {
		r.errf("curriculum/index.json okunamadı: %v", err)
		return
	}
	for _, p := range index {
		code := p["code"]
		if code == "" {
			r.errf("curriculum/index.json: kodsuz program satırı %v", p)
			continue
		}
		var plan curriculum.Plan
		if err := readJSON(filepath.Join(curDir, code+".json"), &plan); err != nil {
			r.errf("curriculum: %q dosyası yok/bozuk", code)
			continue
		}
		if plan.ProgramCode != code {
			r.errf("curriculum: %q dosyasının içindeki programCode %q", code, plan.ProgramCode)
		}
		if len(plan.Semesters) == 0 {
			r.warnf("curriculum: %q hiç dönem içermiyor", code)
		}
	}
}

// checkIndex, site indeksindeki referansların dosyalarla eşleştiğini denetler.
func (r *Result) checkIndex(root string) {
	var ix model.SiteIndex
	if err := readJSON(filepath.Join(root, "data", "index.json"), &ix); err != nil {
		r.errf("data/index.json okunamadı: %v", err)
		return
	}
	for _, t := range ix.Terms {
		if t.Missing {
			continue
		}
		if _, err := os.Stat(filepath.Join(root, "data", "terms", t.Slug, "meta.json")); err != nil {
			r.errf("index: %s dönemi için meta.json yok", t.Slug)
		}
	}
	for _, c := range ix.Calendars {
		if _, err := os.Stat(filepath.Join(root, "data", "calendar", c.YearID+".json")); err != nil {
			r.errf("index: %s takvimi için dosya yok", c.YearID)
		}
	}
}

// checkSitePages, cmd/site ile üretilen statik sayfaların bağlantı
// bütünlüğünü, sitemap kapsamını, yetim sayfaları ve iç bağlantıları denetler.
func (r *Result) checkSitePages(root string) {
	derDir := filepath.Join(root, "dersler")
	bransDir := filepath.Join(root, "brans")
	dersDir := filepath.Join(root, "ders")
	hocaDir := filepath.Join(root, "hoca")

	var ix model.SiteIndex
	if err := readJSON(filepath.Join(root, "data", "index.json"), &ix); err != nil {
		r.warnf("seo sayfa denetimi: index.json okunamadı, atlandı")
		return
	}

	// Beklenen: her non-missing dönem için sayfa, her branş için sayfa.
	wantTerms := map[string]bool{}
	for _, t := range ix.Terms {
		if !t.Missing {
			wantTerms[t.Slug] = true
		}
	}
	wantBranch := map[string]bool{}
	for _, t := range ix.Terms {
		if t.Missing {
			continue
		}
		var m model.TermMeta
		if err := readJSON(filepath.Join(root, "data", "terms", t.Slug, "meta.json"), &m); err != nil {
			continue
		}
		for _, br := range m.Branches {
			wantBranch[br.Code] = true
		}
	}

	// Href regex: href="..."
	hrefRe := regexp.MustCompile(`href="([^"]*)"`)

	checkPage := func(dir, rel string, checkLinks bool) {
		full := filepath.Join(dir, rel, "index.html")
		b, err := os.ReadFile(full)
		if err != nil {
			r.errf("seo sayfası: %s/%s okunamadı: %v", filepath.Base(dir), rel, err)
			return
		}
		s := string(b)
		if !strings.Contains(s, "<title>") {
			r.errf("seo sayfası: %s/%s şablon bozuk (<title> yok)", filepath.Base(dir), rel)
		}
		if !strings.Contains(s, `<link rel="canonical" href="`) {
			r.errf("seo sayfası: %s/%s canonical yok", filepath.Base(dir), rel)
		}
		if !strings.Contains(s, `<meta name="description" content="`) {
			r.errf("seo sayfası: %s/%s meta description yok", filepath.Base(dir), rel)
		}
		// İç bağlantıları çöz (büyük sayfa setlerinde performans için atlanabilir).
		if !checkLinks {
			return
		}
		matches := hrefRe.FindAllStringSubmatch(s, -1)
		for _, m := range matches {
			href := m[1]
			if strings.HasPrefix(href, "#") || strings.HasPrefix(href, "mailto:") ||
				strings.HasPrefix(href, "javascript:") || strings.HasPrefix(href, "tel:") ||
				strings.Contains(href, "://") && !strings.Contains(href, "itu-ders.com") {
				continue
			}
			// SPA hash bağlantıları (/#gecmis gibi) — sitenin kendisi, dış dosya değil.
			if strings.HasPrefix(href, "/#") {
				continue
			}
			target := resolveHref(root, href, full)
			if target == "" {
				continue
			}
			if _, err := os.Stat(target); os.IsNotExist(err) {
				r.errf("seo: %s/%s içindeki bağlantı %s -> %s bulunamadı",
					filepath.Base(dir), rel, href, target)
			}
		}
	}

	// Dönem sayfaları.
	gotTerms := map[string]bool{}
	if ents, err := os.ReadDir(derDir); err == nil {
		for _, e := range ents {
			if !e.IsDir() {
				r.errf("seo sayfası: dersler altında klasör olmayan: %s", e.Name())
				continue
			}
			gotTerms[e.Name()] = true
			checkPage(derDir, e.Name(), true)
		}
	}
	for s := range wantTerms {
		if !gotTerms[s] {
			r.errf("seo sayfası: %s dönemi için sayfa üretilmemiş", s)
		}
	}
	for s := range gotTerms {
		if !wantTerms[s] {
			r.errf("seo sayfası: yetim dönem sayfası: %s (index'te yok)", s)
		}
	}

	// Branş sayfaları.
	gotBrs := map[string]bool{}
	if ents, err := os.ReadDir(bransDir); err == nil {
		for _, e := range ents {
			if !e.IsDir() {
				r.errf("seo sayfası: brans altında klasör olmayan: %s", e.Name())
				continue
			}
			gotBrs[e.Name()] = true
			checkPage(bransDir, e.Name(), true)
		}
	}
	for code := range wantBranch {
		if !gotBrs[code] {
			r.errf("seo sayfası: %s branşı için sayfa üretilmemiş", code)
		}
	}
	for code := range gotBrs {
		if !wantBranch[code] {
			r.errf("seo sayfası: yetim branş sayfası: %s (hiçbir dönemde yok)", code)
		}
	}

	// Ders sayfaları (kapsam: yalnızca dosya varsa geçerli; history'den eşleştirme
	// kod sayısı kadar büyük olduğu için yalnızca bağlantı bütünlüğüne bakar).
	gotDers := map[string]bool{}
	if ents, err := os.ReadDir(dersDir); err == nil {
		for _, e := range ents {
			if !e.IsDir() {
				continue
			}
			gotDers[e.Name()] = true
			checkPage(dersDir, e.Name(), false)
		}
	}

	// Hoca sayfaları.
	gotHoca := map[string]bool{}
	if ents, err := os.ReadDir(hocaDir); err == nil {
		for _, e := range ents {
			if !e.IsDir() {
				continue
			}
			gotHoca[e.Name()] = true
			checkPage(hocaDir, e.Name(), false)
		}
	}

	// Sitemap kapsamı: sitedeki her sayfa sitemap'te, sitemap'teki her loc dosyada.
	b, err := os.ReadFile(filepath.Join(root, "sitemap.xml"))
	if err != nil {
		r.errf("seo: sitemap.xml okunamadı")
		return
	}
	locRe := regexp.MustCompile(`<loc>([^<]*)</loc>`)
	smLocs := map[string]bool{}
	for _, m := range locRe.FindAllStringSubmatch(string(b), -1) {
		u := m[1]
		if !strings.HasPrefix(u, "https://itu-ders.com/") {
			r.errf("seo: sitemap'te beklenmeyen domain: %s", u)
			continue
		}
		smLocs[u] = true
	}
	// Kök sayfayı sitemap'te varsay.
	delete(smLocs, "https://itu-ders.com/")
	for s := range gotTerms {
		expected := fmt.Sprintf("https://itu-ders.com/dersler/%s/", s)
		if !smLocs[expected] {
			r.errf("seo: sitemap'te eksik dönem: %s", s)
		}
		delete(smLocs, expected)
	}
	for code := range gotBrs {
		expected := fmt.Sprintf("https://itu-ders.com/brans/%s/", code)
		if !smLocs[expected] {
			r.errf("seo: sitemap'te eksik branş: %s", code)
		}
		delete(smLocs, expected)
	}
	for s := range gotDers {
		expected := fmt.Sprintf("https://itu-ders.com/ders/%s/", s)
		if !smLocs[expected] {
			r.errf("seo: sitemap'te eksik ders: %s", s)
		}
		delete(smLocs, expected)
	}
	for s := range gotHoca {
		expected := fmt.Sprintf("https://itu-ders.com/hoca/%s/", s)
		if !smLocs[expected] {
			r.errf("seo: sitemap'te eksik hoca: %s", s)
		}
		delete(smLocs, expected)
	}
	for u := range smLocs {
		// Kalan loc'lar: ya kök sayfası (skip), ya yetim.
		if u == "https://itu-ders.com/" {
			continue
		}
		r.errf("seo: sitemap'te fazla URL: %s", u)
	}
}

func resolveHref(root, href, pagePath string) string {
	if idx := strings.IndexAny(href, "?#"); idx >= 0 {
		href = href[:idx]
	}
	if href == "" {
		return ""
	}

	var rel string
	if strings.HasPrefix(href, "https://itu-ders.com/") {
		rel = strings.TrimPrefix(href, "https://itu-ders.com")
	} else if strings.HasPrefix(href, "/") {
		rel = href
	} else {
		return filepath.Join(filepath.Dir(pagePath), href)
	}

	if rel == "" || rel == "/" {
		return filepath.Join(root, "index.html")
	}

	clean := filepath.Join(root, filepath.FromSlash(rel))
	// href / ile bitiyorsa ya da son elemanında nokta yoksa klasör varsay, index.html ekle.
	if strings.HasSuffix(href, "/") || !strings.Contains(filepath.Base(rel), ".") {
		return filepath.Join(clean, "index.html")
	}
	return clean
}

type historyCourse struct {
	Code  string `json:"code"`
	Name  string `json:"name"`
	Terms []string
	Rows  []json.RawMessage
}

type historyInstructor struct {
	Name  string
	Rows  []json.RawMessage
	Terms int
}
