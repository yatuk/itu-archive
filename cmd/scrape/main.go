// Command scrape, İTÜ ders programını ve akademik takvimi çekip docs/ altına
// GitHub Pages'in servis edeceği statik JSON/CSV dosyaları yazar.
//
//	go run ./cmd/scrape              # aktif dönem + akademik takvim
//	go run ./cmd/scrape -backfill    # ek olarak tarihsel arşivi içeri al
package main

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync/atomic"
	"syscall"
	"time"

	"itu-scraper/internal/archive"
	"itu-scraper/internal/fetch"
	"itu-scraper/internal/final"
	"itu-scraper/internal/history"
	"itu-scraper/internal/model"
	"itu-scraper/internal/obs"
	"itu-scraper/internal/prereq"
	"itu-scraper/internal/store"
	"itu-scraper/internal/takvim"
	"itu-scraper/internal/term"
)

func termSlug(label string) string { return term.Slug(label) }
func sortKey(slug string) string   { return term.SortKey(slug) }

func main() {
	var (
		out          = flag.String("out", "docs", "çıktı kök dizini (GitHub Pages kaynağı)")
		workers      = flag.Int("workers", 8, "eşzamanlı istek sayısı")
		rps          = flag.Float64("rps", 6, "saniyedeki istek üst sınırı")
		backfill     = flag.Bool("backfill", false, "tarihsel arşivi içeri al")
		skipCourses  = flag.Bool("skip-courses", false, "ders programını atla")
		skipCalendar = flag.Bool("skip-calendar", false, "akademik takvimi atla")
		skipExams    = flag.Bool("skip-exams", false, "sınav takvimini atla")
		skipPrereq   = flag.Bool("skip-prereq", false, "önşart grafiğini atla")
		mode         = flag.String("mode", "tam", "koşu modu (tam/hafif) — status.json'a yazılır")
		dumpDir      = flag.String("dump-dir", "/tmp/itu-scrape-dump", "hatalı yanıtların ham gövdesinin saklanacağı dizin (K8)")
	)
	flag.Parse()

	if err := run(*out, *workers, *rps, *backfill, *skipCourses, *skipCalendar, *skipExams, *skipPrereq, *mode, *dumpDir); err != nil {
		log.Fatalf("hata: %v", err)
	}
}

func run(out string, workers int, rps float64, backfill, skipCourses, skipCalendar, skipExams, skipPrereq bool, mode, dumpDir string) error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	started := time.Now()
	f := fetch.New(rps, workers)
	f.DumpDir = dumpDir
	st := store.New(out)

	var currentSlug, currentLabel string

	if !skipCourses {
		label, slug, err := scrapeCourses(ctx, f, st, workers)
		if err != nil {
			return err
		}
		currentSlug, currentLabel = slug, label
	}

	if !skipCalendar {
		if err := scrapeCalendar(ctx, f, st); err != nil {
			return err
		}
	}

	if !skipExams {
		if currentLabel == "" {
			oc := obs.New(f)
			label, err := oc.PageTerm(ctx)
			if err != nil || label == "" {
				label, err = oc.ActiveTerm(ctx, "LS")
			}
			if err != nil {
				return err
			}
			currentLabel, currentSlug = label, termSlug(label)
		}
		if err := scrapeExams(ctx, f, st, workers, currentLabel, currentSlug); err != nil {
			return err
		}
	}

	if backfill {
		if err := runBackfill(ctx, f, st, currentSlug); err != nil {
			return err
		}
	}

	idx, err := buildHistory(out, st)
	if err != nil {
		return err
	}

	if !skipPrereq {
		if err := scrapePrereqs(ctx, f, st, workers, idx); err != nil {
			return err
		}
	}

	if err := writeIndex(out, st, currentSlug); err != nil {
		return err
	}

	// sitemap artık cmd/site tarafından üretiliyor (dil + tüm sayfalar).

	// Faz 1: koşu özeti — site bayatlığı ve izleme için. Her koşuda yazılır;
	// içerik değişmese bile commit edilir (keepalive, 4.6).
	if err := writeStatus(st, out, mode, started); err != nil {
		return err
	}

	logf("bitti (%s)", time.Since(started).Round(time.Second))
	return nil
}

// writeStatus, docs/data/status.json'a koşu özetini yazar: site "son tarama"
// bilgisini buradan okur, veri bayatsa uyarı basar. partial/failedBranches Faz 2
// (kısmi başarı) ile dolar; şimdilik başarılı koşu varsayımı.
func writeStatus(st *store.Store, out, mode string, started time.Time) error {
	now := time.Now().UTC()
	sections := 0
	partial := false
	var failedBranches []string
	if b, err := os.ReadFile(filepath.Join(out, "data", "index.json")); err == nil {
		var ix struct {
			CurrentSlug string `json:"currentSlug"`
		}
		if json.Unmarshal(b, &ix) == nil && ix.CurrentSlug != "" {
			if mb, err := os.ReadFile(filepath.Join(out, "data", "terms", ix.CurrentSlug, "meta.json")); err == nil {
				var mt struct {
					Sections       int      `json:"sections"`
					Partial        bool     `json:"partial"`
					FailedBranches []string `json:"failedBranches"`
				}
				_ = json.Unmarshal(mb, &mt)
				sections = mt.Sections
				partial = mt.Partial
				failedBranches = mt.FailedBranches
			}
		}
	}
	// Önceki koşunun sections'ı (commit'li status.json) — validate %20 düşüş
	// kuralı bu değeri kullanır.
	prevSections := 0
	sources := map[string]model.Provenance{}
	if b, err := os.ReadFile(filepath.Join(out, "data", "status.json")); err == nil {
		var prev struct {
			Sections int                         `json:"sections"`
			Sources  map[string]model.Provenance `json:"sources"`
		}
		_ = json.Unmarshal(b, &prev)
		prevSections = prev.Sections
		for name, source := range prev.Sources {
			sources[name] = source
		}
	}
	// Kaynak bazlı başarı zamanı dosyanın kendi provenance'ından gelir. Bir
	// kaynak bu koşuda atlandıysa önceki başarılı zaman korunur; "şimdi başarılı"
	// diye yanlış tazelenmez.
	currentSlug, currentCalendar := currentDataRefs(out)
	provenanceFiles := map[string]string{
		"courses":       filepath.Join(out, "data", "terms", currentSlug, "meta.json"),
		"exams":         filepath.Join(out, "data", "exams", currentSlug+".json"),
		"calendar":      filepath.Join(out, "data", "calendar", currentCalendar+".json"),
		"prerequisites": filepath.Join(out, "data", "prereq", "graph.json"),
	}
	for name, path := range provenanceFiles {
		if p, ok := readProvenance(path); ok {
			sources[name] = p
		}
	}
	status := map[string]any{
		"schemaVersion":  model.DataSchemaVersion,
		"lastRunAt":      now.Format(time.RFC3339),
		"lastSuccessAt":  now.Format(time.RFC3339),
		"mode":           mode,
		"partial":        partial,
		"failedBranches": failedBranches,
		"durationSec":    int(time.Since(started).Seconds()),
		"sections":       sections,
		"prevSections":   prevSections,
		"sources":        sources,
	}
	return st.WriteJSON(status, "data", "status.json")
}

func currentDataRefs(root string) (slug, calendarYearID string) {
	b, err := os.ReadFile(filepath.Join(root, "data", "index.json"))
	if err != nil {
		return "", ""
	}
	var idx struct {
		CurrentSlug string `json:"currentSlug"`
		Calendars   []struct {
			YearID string `json:"yearId"`
		} `json:"calendars"`
	}
	_ = json.Unmarshal(b, &idx)
	if len(idx.Calendars) > 0 {
		calendarYearID = idx.Calendars[0].YearID
	}
	return idx.CurrentSlug, calendarYearID
}

func readProvenance(path string) (model.Provenance, bool) {
	b, err := os.ReadFile(path)
	if err != nil {
		return model.Provenance{}, false
	}
	var envelope struct {
		Provenance model.Provenance `json:"provenance"`
	}
	if json.Unmarshal(b, &envelope) != nil || envelope.Provenance.LastSuccessfulAt == "" {
		return model.Provenance{}, false
	}
	return envelope.Provenance, true
}

// partialGate, kısmi başarı eşiğini uygular (Faz 2): başarısız oran %5'in
// altındaysa uyarıyla devam edilir (meta.partial işaretlenecek); üstündeyse
// hata döner — iş kırmızı, commit olmaz, bozuk/eksik arşiv sessizce yayınlanmaz.
func partialGate(total int, failed []string) error {
	if len(failed) == 0 {
		return nil
	}
	if total <= 0 {
		return fmt.Errorf("branş listesi boş")
	}
	rate := float64(len(failed)) / float64(total)
	if rate >= 0.05 {
		sample := failed
		if len(sample) > 5 {
			sample = failed[:5]
		}
		return fmt.Errorf("%d/%d branş hatalı (%0.1f%%) — eşiğin üstünde; örnekler: %s",
			len(failed), total, rate*100, strings.Join(sample, "; "))
	}
	logf("UYARI: %d/%d branş hatalı (%0.1f%%) — kısmi tarama yazılıyor", len(failed), total, rate*100)
	return nil
}

const snapshotShrinkMin = 0.80

// snapshotShrinkGate, aynı dönem için daha önce yayımlanmış sağlam snapshot'a
// göre beklenmedik küçülmeyi yazımdan önce durdurur. Dönem geçişinde yeni slug
// kullanıldığı için gerçek yeni dönemler bu karşılaştırmaya girmez.
func snapshotShrinkGate(st *store.Store, slug string, sections int) error {
	if sections <= 0 {
		return fmt.Errorf("%s: boş ders snapshot'ı yayınlanamaz", slug)
	}
	b, err := os.ReadFile(st.Path("data", "terms", slug, "meta.json"))
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("%s önceki snapshot metası okunamadı: %w", slug, err)
	}
	var previous model.TermMeta
	if err := json.Unmarshal(b, &previous); err != nil {
		return fmt.Errorf("%s önceki snapshot metası bozuk; üzerine yazılmadı: %w", slug, err)
	}
	if previous.Sections <= 0 {
		return fmt.Errorf("%s önceki snapshot şube sayısı geçersiz; üzerine yazılmadı", slug)
	}
	if float64(sections) < float64(previous.Sections)*snapshotShrinkMin {
		return fmt.Errorf("%s şube sayısı %d → %d (%%%.0f düşüş); önceki sağlam snapshot korundu",
			slug, previous.Sections, sections, 100*(1-float64(sections)/float64(previous.Sections)))
	}
	return nil
}

func scrapeCourses(ctx context.Context, f *fetch.Client, st *store.Store, workers int) (string, string, error) {
	oc := obs.New(f)

	// Dönem etiketini sayfa başlığından al (OBS geçiş dönemlerinde GetAktifDonem
	// bazen eski dönemi raporlarken arama verisi yeni dönemi döndürüyor; sayfa
	// başlığı her zaman OBS'nin gösterdiği gerçek güncel dönemi taşır).
	label, err := oc.PageTerm(ctx)
	if err != nil || label == "" {
		label, err = oc.ActiveTerm(ctx, "LS")
	}
	if err != nil {
		return "", "", err
	}
	slug := termSlug(label)
	logf("aktif dönem: %s (%s)", label, slug)

	branches, err := oc.AllBranches(ctx)
	if err != nil {
		return "", "", err
	}
	logf("%d branş kodu bulundu", len(branches))

	var done int64
	byBranch, failed, err := oc.ScrapeAll(ctx, branches, workers, func(br obs.Branch, n int) {
		if d := atomic.AddInt64(&done, 1); d%50 == 0 || int(d) == len(branches) {
			logf("  %d/%d branş", d, len(branches))
		}
	})
	if err != nil {
		return "", "", err
	}

	var sections []model.Section
	for _, secs := range byBranch {
		sections = append(sections, secs...)
	}
	if len(sections) == 0 {
		return "", "", fmt.Errorf("hiç ders bulunamadı — OBS uçları değişmiş olabilir")
	}
	sort.Slice(sections, func(i, j int) bool { return sections[i].CRN < sections[j].CRN })

	// Eşik aşıldıysa mevcut sağlam dönemi temizlemeden dur. Bu kapının
	// Clean/WriteTerm'den önce olması yerel çalıştırmalarda ve CI dışı
	// çağırılarda da son iyi snapshot'ı korur.
	if err := partialGate(len(branches), failed); err != nil {
		return "", "", err
	}
	if err := snapshotShrinkGate(st, slug, len(sections)); err != nil {
		return "", "", err
	}
	stamp := time.Now().UTC().Format(time.RFC3339)
	meta, err := st.ReplaceTermQuality(label, slug, stamp, true, sections, len(failed) > 0, failed)
	if err != nil {
		return "", "", err
	}
	logf("%s: %d şube, %d ders, %d branş yazıldı", slug, meta.Sections, meta.Courses, len(meta.Branches))
	return label, slug, nil
}

// takvimTürleri, takvimadi parametresi → (slug, görünür ad). slug dizin adıdır
// (ASCII, yol-güvenli — Türkçe/`/` dizin yapısını kırıyordu); label kullanıcıya
// gösterilir. 0, tüm tabloların birleşik görünümüdür (geriye uyumlu).
var takvimTürleri = []struct {
	adi   int
	slug  string
	label string
}{
	{15, "lisans", "Lisans"},
	{16, "yatay-cap-yandal", "Yatay Geçiş / ÇAP / Yandal"},
	{17, "onkayit", "Önkayıt"},
	{18, "hazirlik", "İngilizce Hazırlık"},
	{19, "lisansustu", "Lisansüstü"},
	{20, "ikinci-ogretim-lisansustu", "II. Öğretim Lisansüstü"},
}

func scrapeCalendar(ctx context.Context, f *fetch.Client, st *store.Store) error {
	tc := takvim.New(f)
	years, err := tc.Years(ctx)
	if err != nil {
		return err
	}
	logf("%d akademik yıl takvimi çekiliyor", len(years))
	for _, y := range years {
		// Birleşik görünüm (geriye uyumlu — mevcut dosya adı).
		all, err := tc.Fetch(ctx, y, 0)
		if err != nil {
			return err
		}
		if err := st.WriteJSON(all, "data", "calendar", y.ID+".json"); err != nil {
			return err
		}
		// Altı tür ayrı dosyalarda: calendar/<slug>/<yearId>.json.
		for _, tt := range takvimTürleri {
			cal, err := tc.Fetch(ctx, y, tt.adi)
			if err != nil {
				return err
			}
			cal.Type = tt.label
			if err := st.WriteJSON(cal, "data", "calendar", tt.slug, y.ID+".json"); err != nil {
				return err
			}
		}
		logf("  takvim %s: %d satır (birleşik) + %d tür", all.Year, len(all.Events), len(takvimTürleri))
	}
	return nil
}

func scrapeExams(ctx context.Context, f *fetch.Client, st *store.Store, workers int, label, slug string) error {
	fc := final.New(f)
	branches, err := fc.Branches(ctx)
	if err != nil {
		return err
	}
	exams, failed, err := fc.ScrapeAll(ctx, branches, workers)
	if err != nil {
		return err
	}
	if err := partialGate(len(branches), failed); err != nil {
		return err
	}
	if len(exams) == 0 {
		// Sınav takvimi dönem ortasında boş olabiliyor; bu hata değil, sadece
		// henüz ilan edilmemiş demek. Var olan dosyanın üzerine yazmıyoruz.
		logf("sınav takvimi henüz ilan edilmemiş, atlandı")
		return nil
	}
	// OBS'nin sınav ucunda dönem parametresi yok: o an ne yayınlıyorsa onu verir.
	// Dönem döndükten sonra yeni dönemin takvimi ilan edilene kadar OBS hâlâ
	// ÖNCEKİ dönemin takvimini servis eder. Bunu aktif dönemin etiketiyle
	// yazarsak yaz finalleri "Güz" diye görünür (yaşanmış hata: 2026-2027 Güz
	// dosyası 2025-2026 Yaz finallerini taşıyordu).
	//
	// Sınavlar o dönemin kendi şubelerine ait olmalı: CRN'ler dönemin ders
	// listesinde yoksa takvim başka döneme aittir.
	yaz, oran, err := verifyExamTerm(st, slug, exams)
	if err != nil {
		return err
	}
	if !yaz {
		logf("sınav takvimi aktif dönemin şubeleriyle yalnızca %%%.0f örtüşüyor "+
			"(eşik %%%.0f) — başka döneme ait, yazılmadı", oran*100, examOverlapMin*100)
		return nil
	}
	sched := &model.ExamSchedule{
		SchemaVersion: model.DataSchemaVersion,
		Provenance: model.Provenance{
			Provider:         "İstanbul Teknik Üniversitesi OBS",
			Endpoint:         "https://obs.itu.edu.tr/public/FinalTakvimi/SearchFinalTakvimiByDersBransKodu",
			LastSuccessfulAt: time.Now().UTC().Format(time.RFC3339),
		},
		Term: label, Slug: slug,
		ScrapedAt:      time.Now().UTC().Format(time.RFC3339),
		Exams:          exams,
		Partial:        len(failed) > 0,
		FailedBranches: failed,
	}
	if err := st.WriteExams(sched); err != nil {
		return err
	}
	logf("sınav takvimi: %d kayıt (%d branş)", len(exams), len(branches))
	return nil
}

// examOverlapMin, sınav takvimini aktif döneme yazmak için gereken en düşük
// CRN örtüşmesi. Gerçek değerler net ayrışıyor: doğru dönemde ~%78, yanlış
// dönemde ~%5 (sınav takvimi tüm şubeleri kapsamaz, o yüzden eşik 1 değil).
const examOverlapMin = 0.40

// verifyExamTerm, dönem parametresi olmayan sınav ucunun sonucunu yayınlamadan
// önce aktif ders dökümüyle doğrular. Doğrulama girdisi yoksa hata verir;
// başka döneme ait olduğu anlaşılan veri hata değil, yaz=false sonucudur.
func verifyExamTerm(st *store.Store, slug string, exams []model.Exam) (yaz bool, oran float64, err error) {
	oran, olcum := examCRNOverlap(st, slug, exams)
	if !olcum {
		return false, 0, fmt.Errorf("sınav takviminin %s dönemine ait olduğu doğrulanamadı: dönem ders dökümü yok veya boş", slug)
	}
	return oran >= examOverlapMin, oran, nil
}

// examCRNOverlap, sınav CRN'lerinin ne kadarının dönemin kendi ders listesinde
// bulunduğunu döner. İkinci dönüş değeri ölçümün yapılabildiğini söyler.
// Ölçüm yapılamıyorsa çağıran fail-closed davranır; OBS'nin dönem
// parametresi olmayan ucundan gelen veriyi tahminle etiketlemez.
func examCRNOverlap(st *store.Store, slug string, exams []model.Exam) (float64, bool) {
	if len(exams) == 0 {
		return 0, false
	}
	donemCRN, err := termCRNs(st.Path("data", "terms", slug, "all.csv"))
	if err != nil || len(donemCRN) == 0 {
		return 0, false
	}
	var eslesen int
	for _, e := range exams {
		if _, ok := donemCRN[e.CRN]; ok {
			eslesen++
		}
	}
	return float64(eslesen) / float64(len(exams)), true
}

// termCRNs, dönem dökümündeki CRN kümesini okur (all.csv'nin ilk kolonu).
func termCRNs(yol string) (map[string]struct{}, error) {
	f, err := os.Open(yol)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	r := csv.NewReader(f)
	r.FieldsPerRecord = -1
	kayitlar, err := r.ReadAll()
	if err != nil || len(kayitlar) < 2 {
		return nil, err
	}
	crns := make(map[string]struct{}, len(kayitlar)-1)
	for _, satir := range kayitlar[1:] { // başlık atlanır
		if len(satir) > 0 {
			// İlk hücrede BOM olabilir; CRN saf rakam.
			crns[strings.TrimFunc(satir[0], func(r rune) bool { return r < '0' || r > '9' })] = struct{}{}
		}
	}
	return crns, nil
}

func buildHistory(root string, st *store.Store) (*history.Index, error) {
	idx, err := history.Build(root)
	if err != nil {
		return nil, err
	}
	if err := st.WriteHistory(idx); err != nil {
		return nil, err
	}
	logf("geçmiş indeksi: %d ders, %d öğretim üyesi, %d dönem",
		len(idx.Courses), len(idx.Instructors), len(idx.Terms))
	return idx, nil
}

func scrapePrereqs(ctx context.Context, f *fetch.Client, st *store.Store, workers int, idx *history.Index) error {
	pc := prereq.New(f)
	branches, err := pc.Branches(ctx)
	if err != nil {
		return err
	}
	rows, failed, err := pc.ScrapeAll(ctx, branches, workers)
	if err != nil {
		return err
	}
	if err := partialGate(len(branches), failed); err != nil {
		return err
	}

	names := map[string]string{}
	for code, c := range idx.Courses {
		names[code] = c.Name
	}
	graph := prereq.BuildGraph(rows, names)
	graph.GeneratedAt = time.Now().UTC().Format(time.RFC3339)
	for i := range graph.Edges {
		graph.Edges[i].VerifiedAt = graph.GeneratedAt
	}
	graph.SchemaVersion = model.DataSchemaVersion
	graph.Provenance = model.Provenance{
		Provider:         "İstanbul Teknik Üniversitesi OBS",
		Endpoint:         "https://obs.itu.edu.tr/public/GenelTanimlamalar/OnsartAra",
		LastSuccessfulAt: graph.GeneratedAt,
	}
	graph.Partial = len(failed) > 0
	graph.FailedBranches = failed

	if err := st.WriteJSON(graph, "data", "prereq", "graph.json"); err != nil {
		return err
	}
	// Ters indeks (Faz 2.4): detay paneli graph.json'un 1.9 MB'ını yüklemeden
	// "bu dersi önşart isteyenler"i çeker.
	if err := st.WriteJSON(prereq.ReverseIndex(graph), "data", "prereq", "reverse.json"); err != nil {
		return err
	}
	logf("önşart grafiği: %d düğüm, %d kenar (%d branş)", len(graph.Nodes), len(graph.Edges), len(branches))
	return nil
}

func runBackfill(ctx context.Context, f *fetch.Client, st *store.Store, currentSlug string) error {
	// Ders taraması atlandıysa aktif dönemi yine de öğrenmemiz gerekiyor:
	// aksi halde arşiv sürümü canlı dönemin zengin kaydının üzerine yazar.
	if currentSlug == "" {
		label, err := obs.New(f).ActiveTerm(ctx, "LS")
		if err != nil {
			return fmt.Errorf("aktif dönem belirlenemedi, arşiv canlı veriyi ezebilir: %w", err)
		}
		currentSlug = termSlug(label)
	}

	// Arşivde seviye bilgisi yok; branş kodundan seviyeyi bugünkü OBS listesiyle
	// tahmin ediyoruz. Kusursuz değil (kapanmış branşlar boş kalır) ama filtreleri
	// çalışır kılmaya yetiyor.
	levels := map[string]string{}
	if brs, err := obs.New(f).AllBranches(ctx); err == nil {
		for _, br := range brs {
			if _, seen := levels[br.Code]; !seen {
				levels[br.Code] = br.Level
			}
		}
	}

	snaps, err := archive.Fetch(ctx, f, levels, logf)
	if err != nil {
		return err
	}
	stamp := time.Now().UTC().Format(time.RFC3339)
	for _, sn := range snaps {
		if sn.Slug == currentSlug {
			logf("%s: canlı scrape ile aynı dönem, arşiv sürümü atlandı", sn.Slug)
			continue
		}
		if err := snapshotShrinkGate(st, sn.Slug, len(sn.Sections)); err != nil {
			return err
		}
		meta, err := st.ReplaceTerm(sn.Label, sn.Slug, stamp, false, sn.Sections)
		if err != nil {
			return err
		}
		logf("%s: %d şube arşivden yazıldı", sn.Slug, meta.Sections)
	}
	return nil
}

// writeIndex, docs/data/terms altındaki tüm meta.json'ları tarayarak site
// indeksini yeniden kurar. Dizinden okumak önemli: günlük çalıştırmada yalnızca
// aktif dönem yenilenir, geçmiş dönemler indeksten düşmemeli.
func writeIndex(root string, st *store.Store, requestedCurrentSlug string) error {
	termsDir := filepath.Join(root, "data", "terms")
	entries, err := os.ReadDir(termsDir)
	if err != nil {
		return fmt.Errorf("dönem dizini okunamadı: %w", err)
	}

	var metas []model.TermMeta
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		b, err := os.ReadFile(filepath.Join(termsDir, e.Name(), "meta.json"))
		if err != nil {
			continue
		}
		var m model.TermMeta
		if err := json.Unmarshal(b, &m); err != nil {
			continue
		}
		metas = append(metas, m)
	}
	if len(metas) == 0 {
		return fmt.Errorf("indekslenecek dönem bulunamadı")
	}

	// Dönem geçişinde eski meta dosyası live:true olarak kalabilir. Aktif slug bu
	// koşuda OBS'den geldiyse onu tek kaynak kabul et; yoksa mevcut live kayıtların
	// en yenisini, o da yoksa en yeni dönemi seç. Sonuçta tam olarak bir live dönem
	// vardır ve eski dönemlerin rozeti kendiliğinden kapanır.
	activeSlug := ""
	for _, m := range metas {
		if m.Slug == requestedCurrentSlug {
			activeSlug = requestedCurrentSlug
			break
		}
	}
	if activeSlug == "" {
		for _, m := range metas {
			if m.Live && (activeSlug == "" || sortKey(m.Slug) > sortKey(activeSlug)) {
				activeSlug = m.Slug
			}
		}
	}
	if activeSlug == "" {
		for _, m := range metas {
			if activeSlug == "" || sortKey(m.Slug) > sortKey(activeSlug) {
				activeSlug = m.Slug
			}
		}
	}

	var refs []model.TermRef
	var current model.TermRef
	var currentMeta model.TermMeta
	for i := range metas {
		m := &metas[i]
		live := m.Slug == activeSlug
		if m.Live != live {
			m.Live = live
			if err := st.WriteJSON(m, "data", "terms", m.Slug, "meta.json"); err != nil {
				return fmt.Errorf("%s live durumu yazılamadı: %w", m.Slug, err)
			}
		}
		ref := model.TermRef{
			SchemaVersion: m.SchemaVersion, Provenance: m.Provenance,
			Slug: m.Slug, Label: m.Term, ScrapedAt: m.ScrapedAt,
			Source: store.Source, Live: live, Sections: m.Sections,
			Partial: m.Partial, FailedBranches: m.FailedBranches,
		}
		refs = append(refs, ref)
		if live {
			current = ref
			currentMeta = *m
		}
	}

	refs = append(refs, missingTerms(refs)...)
	sort.Slice(refs, func(i, j int) bool { return sortKey(refs[i].Slug) > sortKey(refs[j].Slug) })

	var cals []model.CalRef
	calDir := filepath.Join(root, "data", "calendar")
	if ents, err := os.ReadDir(calDir); err == nil {
		for _, e := range ents {
			if !strings.HasSuffix(e.Name(), ".json") {
				continue // tür dizinleri (lisans/, hazirlik/ ...) JSON değil
			}
			b, err := os.ReadFile(filepath.Join(calDir, e.Name()))
			if err != nil {
				continue
			}
			var c model.Calendar
			if json.Unmarshal(b, &c) != nil {
				continue
			}
			// Bu yıl için hangi tür dosyaları var? (calendar/<slug>/<yearId>.json)
			var types []string
			for _, sub := range ents {
				if !sub.IsDir() {
					continue
				}
				if _, err := os.Stat(filepath.Join(calDir, sub.Name(), e.Name())); err == nil {
					types = append(types, sub.Name())
				}
			}
			sort.Strings(types)
			cals = append(cals, model.CalRef{YearID: c.YearID, Label: c.Year, Events: len(c.Events), Types: types})
		}
	}
	sort.Slice(cals, func(i, j int) bool { return cals[i].Label > cals[j].Label })

	idx := model.SiteIndex{
		SchemaVersion: model.DataSchemaVersion,
		Provenance:    currentMeta.Provenance,
		CurrentTerm:   current.Label,
		CurrentSlug:   current.Slug,
		ScrapedAt:     current.ScrapedAt,
		Terms:         refs,
		Calendars:     cals,
		Stats:         currentMeta.Stats,
	}
	if err := st.WriteJSON(idx, "data", "index.json"); err != nil {
		return err
	}
	logf("indeks: %d dönem, %d takvim yılı", len(refs), len(cals))
	return nil
}

// missingTerms, arşivdeki en eski ve en yeni dönem arasında verisi olmayan
// dönemleri bulur. Bunları sitede boş göstermek, sessizce yok saymaktan iyi:
// örneğin 2024-2025 Güz hiçbir kaynakta yok.
func missingTerms(have []model.TermRef) []model.TermRef {
	seen := map[string]bool{}
	minYear, maxYear := 9999, 0
	for _, r := range have {
		seen[r.Slug] = true
		if y, err := strconv.Atoi(strings.SplitN(r.Slug, "-", 2)[0]); err == nil {
			if y < minYear {
				minYear = y
			}
			if y > maxYear {
				maxYear = y
			}
		}
	}
	if maxYear == 0 {
		return nil
	}

	seasons := []struct{ slug, label string }{{"guz", "Güz"}, {"bahar", "Bahar"}, {"yaz", "Yaz"}}
	var out []model.TermRef
	for y := minYear; y <= maxYear; y++ {
		for _, s := range seasons {
			slug := fmt.Sprintf("%d-%d-%s", y, y+1, s.slug)
			if seen[slug] {
				continue
			}
			// Aralığın dışına taşan uçları ekleme.
			if sortKey(slug) < minKey(have) || sortKey(slug) > maxKey(have) {
				continue
			}
			out = append(out, model.TermRef{
				Slug:    slug,
				Label:   fmt.Sprintf("%d-%d %s Dönemi", y, y+1, s.label),
				Missing: true,
			})
		}
	}
	return out
}

func minKey(refs []model.TermRef) string {
	k := "9999"
	for _, r := range refs {
		if v := sortKey(r.Slug); v < k {
			k = v
		}
	}
	return k
}

func maxKey(refs []model.TermRef) string {
	k := ""
	for _, r := range refs {
		if v := sortKey(r.Slug); v > k {
			k = v
		}
	}
	return k
}

// touchSitemap, sitemap.xml'in <lastmod> tarihini bugüne çeker. Google'a
// "bu sayfa düzenli güncelleniyor" sinyalini otomatik, elle dokunmadan vermek
// için — her scrape çalıştığında tazeleniyor.
func touchSitemap(root string) error {
	path := filepath.Join(root, "sitemap.xml")
	body := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://itu-ders.com/</loc>
    <lastmod>%s</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`, time.Now().UTC().Format("2006-01-02"))
	return os.WriteFile(path, []byte(body), 0o644)
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
