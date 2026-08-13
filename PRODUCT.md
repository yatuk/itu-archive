# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Statik site: düz HTML/CSS + vanilya JS (modül tabanlı, framework yok), GitHub Pages'ten `docs/` köküyle yayınlanır. Veri Go kazıyıcılarla (`cmd/`, `internal/`) çekilip `docs/data/*.json`/CSV olarak commit edilir; ön yüz aynı dosyaları doğrudan okur.

## Users

Birincil kullanıcı **İTÜ öğrencisidir**; ders seçimi ve kayıt haftalarında programını kurar, dersleri arar, önşartları ve final çakışmalarını kontrol eder, kontenjan doluluğunu ve dersin geçmişini (hangi dönemlerde, kiminle açıldığını) görür. Kayıt kararı vermeden önce OBS'yi doğrular.

## Product Purpose

OBS'nin yayınlamadığı İTÜ ders verisini kalıcılaştırır ve aranabilir yapar: geçmiş dönemler, kontenjan zaman serisi, müfredat/önşart haritası, sınav takvimi, akademik takvim (6 tür), katalog ve not dağılımı. Kullanıcının tek işi: **"bu dersi alabilir miyim, ne zaman, kimden, yer var mı"** sorusunu OBS'den hızlı cevaplamak. Başarı: öğrenci kayıt haftasında bilinçli karar verir; kaybolan dönem verisi artık "sorulamaz" değildir.

## Positioning

OBS yalnızca içinde bulunulan dönemi gösterir; dönem bitince veri kaybolur. Bu arşiv 2016'dan bugüne dönem dönem veriyi sürüm kontrolüne alır, kontenjanı zaman serisi olarak saklar ve müfredat/önşart ilişkilerini tıklanabilir görselleştirir. Komşu bir ürün (OBS) bu tarihselliği doğru şekilde kopyalayamaz.

## Operating Context

Kaynaklar: `obs.itu.edu.tr/public/*` (DersProgram, DersKatalog, DersBilgi, DersNotDagilimi, GenelTanimlamalar) ve `takvim.sis.itu.edu.tr`. Ders programı günde bir kez, kontenjan kayıt haftalarında yarım saatte bir taranır; CI (GitHub Actions) ile otomatikleşir. Kullanıcı kayıt haftasında, çoğunlukla **telefondan, telaşlı ve zaman baskısıyla** siteye bakar; ders seçme ekranıyla yan yana. Teknik okuryazarlığı yüksektir ama vakit yoktur. Ham veri indirilebilir (JSON/CSV): sayfa da aynı dosyaları kullanır.

## Capabilities and Constraints

- 8 sekme: Dersler (filtre/arama, kontenjan doluluğu, zaman çizelgesi), Geçmiş (27 dönem birleşik kayıt), Önşart Haritası (canvas, VE/VEYA mantığı), Sınavlar, Akademik Takvim (6 tür, .ics), Dönemler, Program kurucu (çakışma işareti, ECTS, .ics, CRN doldur), Hakkında.
- 2016-2017'den bugüne 28 dönem / ~69.000 şube; katalog 238 branş; not dağılımı ~6.157 grup; resmî tanımlar (64 bina, 285 program).
- **Etik sınır:** not dağılımında toplam yazılan < 10 ise kaydedilmez (kişi ifşası).
- **Veri boşlukları:** 2024-2025 Güz hiçbir kaynakta yok; 2025-2026 Güz dönem başı dökümü komşu dönemlerden eksik görünüyor; katalog tüm kodları kapsamaz (grafik dışı kodlar yasaldır).
- Veri şeması geriye uyumlu: alan eklenir, silinmez.
- Statik site, arka uç yok; kod/veri açık kaynak, ODC-By lisansıyla.

## Brand Commitments

Ad: **İTÜ Ders Arşivi** (domain `itu-ders.com`, GitHub `yatuk/itu-archive`). Terminal/retro kimlik: scanlines, monospace `root@itu:~/arsiv$` prompt'u, "DERS ARŞİVİ" masthead. Ton: **Türkçe, sade, kurumsal değil; arşivin sakinliği — şaka yok, pazarlama dili yok.** İki tema: **"sade"** (açık, varsayılan) iyileştirme yüzeyidir; **"fosfor"** (koyu terminal) kasıtlı kimliktir ve **piksel düzeyinde dondurulmuştur — değiştirilmez**. **Kırmızı yalnızca ders çakışması ve %100 dolu kontenjan için** ayrılmıştır. Dil: TR birincil, EN ikincil.

## Evidence on Hand

`docs/data/`: `terms/` (28 dönem JSON+CSV), `quota/`, `exams/`, `calendar/` (6 tür + birleşik), `catalog/` (238 dosya + index), `grades/`, `buildings.json`, `programs.json`, `prereq/graph.json` + `reverse.json`, `index.json`. Kopya ve gerçek metin `docs/index.html` Hakkında sekmesinde mevcuttur.

## Product Principles

1. **Veri önce:** sayfa açık JSON/CSV'nin üzerine bir mercektir; ham veri her zaman indirilebilir.
2. **Tarihsellik:** OBS'nin yayınlamayı bıraktığı veri asla kaybolmaz, dönem dönem sürüm kontrolündedir.
3. **Mahremiyet:** not dağılımı yalnızca toplu; birey ifşasına yol açabilecek <10 kişilik sınıflar kaydedilmez.
4. **Eklemeli uyumluluk:** şema geriye uyumlu büyür, mevcut veri kırılmaz.
5. **Doğrulama önce:** kayıt kararı için her zaman OBS'nin kendi sayfası referans gösterilir.
6. **Fosfor dondurulmuştur:** koyu terminal teması sitenin başlangıç kimliğidir; görsel değişiklik yalnızca "sade" yüzeyine dokunur.

## Accessibility & Inclusion

Hedef **WCAG 2.1 AA** (kullanıcı onayı). Yüksek kontrast teması mevcut; önşart canvas'ı klavye gezinmesi destekler; odak yönetimi ve `aria-live` güncellemeleri mevcut. TR/EN dil seçeneği bulunur.
