<p align="center">
  <img src="docs/glitch_effect.gif" alt="İTÜ Ders Arşivi" width="600">
</p>

# İTÜ Ders Arşivi

OBS'nin ders programı sayfası sadece içinde bulunduğunuz dönemi gösteriyor. Dönem
bitiyor, veri gidiyor. Geçen sene bu dersi kim vermişti, kontenjan kaç kişide
dolmuştu, hangi güne konmuştu? Hiçbirini geriye dönük soramıyorsunuz.

Bu depo o veriyi her gün çekip git'e yazıyor. Şu an 2016-2017 Yaz'dan bugüne 28
dönem, 68.773 şube kaydı duruyor içinde. Akademik takvim de dahil.

## Kaynaklar

| Nereden | Ne |
|---|---|
| `obs.itu.edu.tr/public/DersProgram` | Aktif dönem. 4 program seviyesi (OL/LS/LU/LUI), 337 branş kodu |
| `obs.itu.edu.tr/public/FinalTakvimi` | Final ve ek sınav takvimi |
| `obs.itu.edu.tr/public/GenelTanimlamalar/OnsartAra` | Katalogdaki her dersin önşartı |
| `obs.itu.edu.tr/public/DersPlan` | Her programın güncel müfredatı, dönem dönem (önlisans `_OL`, lisans `_LS`, yüksek lisans `_YL`, doktora `_DR`) |
| `obs.itu.edu.tr/public/DersKatalog` | Ders katalog formu: kredi (T+U+L/yerel/AKTS), dil, ders tanımı, öğrenme çıktıları, haftalık konular, kaynak kitaplar |
| `takvim.sis.itu.edu.tr` | 4 akademik yılın takvimi |
| Tarihsel dökümler | 2016-2017'ye kadar geçmiş dönemler, `-backfill` ile |

Aktif dönem OBS'den geliyor, kayıt tam: öğretim yöntemi, önşart, rezervasyon,
derslik. Geçmiş dönemlerde bunların bir kısmı yok.

## Ne sorabilirsin

Sitedeki geçmiş sekmesi 27 dönemin birleştirilmiş kaydı üzerinde çalışıyor.
OBS'de sorulamayan şeyler burada sorulabiliyor:

- BLG 102E'yi son beş yılda kim verdi (13 dönem, dönem dönem hoca listesi)
- Bu ders hangi mevsimde açılıyor, güz mü bahar mı
- Bir öğretim üyesi hangi dersleri veriyor ve kaç dönemdir veriyor
- Bir şube geçen sefer kaç dakikada doldu

7.668 ders ve 2.653 öğretim üyesi indekslenmiş durumda. Ortak ders veren
öğretim üyeleri ayrı kartlarda sayılır; bir şube birden çok hocanın şube
sayısına girebilir.

Site ayrıca bir ders planı haritası sunuyor. Bir bölüm seçin, o bölümün güncel
müfredatı dönem sütunları halinde çiziliyor. Önşart ilişkileri ok'larla her
zaman görünür, tıklamaya gerek yok. Oklar mantık taşır: düz ok zorunlu, kesikli
ok alternatif (VEYA). OBS'nin "MAT 102 Veya MAT 102E" gibi ifadeleri ayrıştırılıp
kesikli gösteriliyor, biri yeter. Bir düğüme tıklayınca önşartı panelde VE/VEYA
ağacı olarak görürsünüz (hepsi gerekli / biri yeterli etiketleriyle). Grafikte
de geriye doğru önşartlar ve ileriye doğru bu dersi önşart olarak isteyen
dersler parlıyor. Seçmeli ders slotları tek bir düğüm. Bazı havuzlarda 150'den
fazla alternatif var, hepsini tek tek düğüm yapmak grafiği okunmaz hale
getiriyordu. Tıklayınca alternatifler panelde listeleniyor. Program seçici
fakülte içinde seviyeye göre gruplanıyor. Yüksek lisans ve doktora programları
tek dönemli listedir, dönem ayrımı yok.

Dersler sekmesinde tablo kolonları sıralanabiliyor. Görünen sonuç tek tıkla CSV
olarak indirilebiliyor (Excel için BOM'lu). Arama ve filtre durumu URL'ye
yazılıyor, filtrelediğiniz görünümün bağlantısını paylaşabilirsiniz. Filtreler
günün yanında saat dilimi (sabah/öğle/akşam), seviye (OL/LS/LU/LUI) ve öğretim
yöntemini de kapsıyor. Aktif filtreler tek tıkla kaldırılabilen çipler olarak
görünüyor. Şubeler seçilebiliyor. Seçilenler ayrı CSV olarak indirilebiliyor ve
"yalnızca seçilenler" modunda zaman çizelgesinde çakışma kontrolüne sokuluyor.
Bir dersin adına tıklayınca detay paneli açılıyor: o dönemdeki tüm şubeler,
haftalık oturum saati, programlar, önşart, dolma süresi, geçmiş dönemler
(doluluk grafiği) ve varsa katalog bilgisi (kredi, AKTS, dil, içerik, çıktılar,
kaynak kitaplar). Panel her sekmeyle paylaşılıyor — önşart haritasından, seçmeli
havuzdan, geçmişten ve sınavlardan da açılıyor — ve kendi paylaşılabilir
bağlantısına sahip (`#ders/BLG%20102E`). Alabilen program çipleri tıklanınca
dersler sekmesinde o programa göre filtrelenir; "bu dersi önşart isteyenler"
listesi ve OBS katalog formu bağlantısı da panelde. Katalog verisi geldiyse
"Not dağılımı" bölümü çubuk grafik + geçme oranı (≥CC+) + en sık harf notu
gösterir (10 kişinin altındaki sınıflar etik nedenle gizli).
"Zaman çizelgesi" düğmesi gün × saat ızgarasında çakışan dersleri kırmızı
işaretler; Program sekmesi seçili şubelerin final sınavlarını da çakışma
açısından denetler, katalogdan AKTS toplamını ve dolma hızını gösterir.
Akademik takvim tek tıkla `.ics` olarak dışa aktarılabilir. Sekmeler arası
geçiş tarayıcı geçmişine yazılıyor, geri/ileri çalışır. Üstteki "görünüm"
seçici ile sade (varsayılan) ve fosfor/koyu temalar arasında geçebilirsiniz;
yanındaki TR/EN düğmesi arayüzü İngilizceye çevirir. Sade tema
terminal görünümünü yumuşatır; fosfor kimliğini korur ve istenince seçilir.
Geçmiş sekmesinde bir dersin detayında dönem dönem kontenjan ve doluluk grafiği
var. Sınavlar sekmesinde tür ve bina filtresi var.

İlk denemede bu grafik force-directed bir yığındı, Obsidian'ın grafik görünümü
gibi organik ama kaotik. Kenarlar yalnızca bir düğüme tıklanınca netleşiyordu,
yapı ilk bakışta okunmuyordu. Sabit dönem sütunlarına geçildi, kenarlar
varsayılan olarak da net.

## Çalıştırma

```bash
go run ./cmd/scrape            # ders programı, sınav takvimi, önşartlar, akademik takvim (6 tür)
go run ./cmd/scrape -backfill  # geçmiş dönemleri de al, bir kez yeterli
go run ./cmd/quota             # kontenjan doluluğundan tek ölçüm al
go run ./cmd/curriculum        # tüm programların müfredatını çek (önlisans + lisansüstü dahil)
go run ./cmd/catalog           # ders katalog verisini çek (kredi, AKTS, içerik) — haftalık
go run ./cmd/grades            # harf notu dağılımı (son 3 yıl) — aylık
go run ./cmd/definitions       # resmî tanımlar: bina + program kodları — aylık
go run ./cmd/backfill-calendar # eski takvim dosyalarına ISO start/end ekler (bir kez)
go run ./cmd/validate          # docs/data bütünlüğünü denetle (kopya CRN, sarkan kenar...)
```

Her şey `docs/data` altına yazılıyor. Tam tarama iki dakika sürüyor. Bayraklar:
`-out`, `-workers`, `-rps`, `-skip-courses`, `-skip-calendar`, `-skip-exams`, `-skip-prereq`.

Testler ve doğrulama (CI'da her push'ta koşuyor):

```bash
go test ./...                          # kazıyıcı parse'ları (fixture tabanlı)
node --test docs/assets/core/core.test.js   # frontend saf fonksiyonları
go run ./cmd/validate -quiet           # yalnızca özet: kategori sayaçları + hata örnekleri
```

`cmd/quota` ve `cmd/curriculum` ayrı komutlar çünkü frekansları farklı. Ders
programı günde bir kez yeterli, kontenjan kayıt haftasında yarım saatte bir
anlamlı, müfredat ise dönemde belki bir kez değişiyor (`cmd/curriculum -only
BLG_LS` ile tek program test edilebilir). `cmd/quota` değişen bir şey yoksa
dosyaya hiç dokunmuyor, o yüzden sakin dönemlerde boş commit birikmiyor.
`cmd/validate` yalnızca okur. Kopya CRN, meta/şube sayısı tutarsızlığı, önşart
grafiğinde olmayan düğüme giden kenar gibi bozuklukları raporlar. Hata varsa
sıfırdan farklı kodla çıkar, workflow'a eklemeye uygun.

Siteyi yerelde açmak için:

```bash
python -m http.server 8765 --directory docs
```

### GitHub Pages

Settings > Pages > Source: Deploy from a branch, `main` / `docs`. Ayrı bir deploy
workflow'u yok, gerek de yok. Scraper zaten `docs/` altına yazıyor, her commit
kendiliğinden yayına giriyor.

Özel alan `itu-ders.com` (`docs/CNAME` içinde). DNS kayıtları Cloudflare'da,
sitedeki canonical/og/sitemap URL'leri yeni adrese yazıyor.

Bot'un commit atabilmesi için Settings > Actions > General kısmında workflow
izinleri "Read and write" olmalı. Bunu unutursanız Actions yeşil görünür ama
hiçbir şey push edilmez.

## Veri düzeni

```
docs/data/
  index.json                        # dönem ve takvim listesi
  terms/<dönem>/meta.json           # branş listesi, sayımlar, kaynak
  terms/<dönem>/search.json         # hafif arama indeksi
  terms/<dönem>/branches/<KOD>.json # tam kayıtlar
  terms/<dönem>/all.csv             # tek dosya döküm, Excel için BOM'lu
  calendar/<yıl>.json               # akademik takvim (tüm türler, birleşik)
  calendar/<tür>/<yıl>.json         # tek takvim türü (lisans, yatay-ÇAP, önkayıt, ...)
  exams/<dönem>.json                # final ve ek sınav takvimi
  history/codes.json                # ders arama listesi
  history/names.json                # öğretim üyesi arama listesi
  history/courses/<BRANŞ>.json      # ders bazlı dönem geçmişi
  history/instructors/<harf>.json   # öğretim üyesi bazlı geçmiş
  quota/<dönem>.jsonl               # kontenjan zaman serisi, append-only
  quota/<dönem>.json                # türetilmiş dolma özeti
  prereq/graph.json                 # katalogdaki her dersin önşart ilişkisi
  prereq/reverse.json               # ters önşart indeksi ("bunu kim istiyor")
  curriculum/index.json             # lisans program listesi
  curriculum/<PROGRAM_LS>.json      # bir programın dönem dönem müfredatı
  catalog/index.json                # katalog tarama özeti (kapsam sayıları)
  catalog/<BRANŞ>.json              # ders başına katalog: kredi, AKTS, dil, içerik, çıktılar, haftalık plan, denklikler
  grades/index.json                 # not dağılımı tarama özeti
  grades/<BRANŞ>.json               # ders başına harf notu dağılımı (AA…VF), <10 kişi gizli
  buildings.json                    # resmî bina kodu → ad
  programs.json                     # resmî program kodları, seviye etiketli
```

Dönem adları `2025-2026-guz` biçiminde. Branş bazlı bölmenin iki sebebi var:
tarayıcıya 10 MB'lık tek dosya indirtmemek ve git diff'inin "hangi branşta ne
değişti" sorusuna okunabilir cevap vermesi.

## Kaynaklardaki tuhaflıklar

Bu sayfaları kazımak göründüğü kadar düz bir iş değil. Çıkan sorunlar:

Takvim sayfası tek belgede iki kodlama birden kullanıyor. Statik şablon
ISO-8859-9, veritabanından gelen metinler UTF-8. Hangisini seçerseniz seçin
metnin yarısı bozuluyor, ya `Ã¼` ya `E\xc5\x9fitim` çıkıyor. `fetch.DecodeMixed`
her bayt için ayrı karar veriyor.

OBS, haftada iki oturumu olan dersleri tek hücreye `<br>` ile sıkıştırıyor. Düz
metne çevirdiğinizde `ÇarşambaÇarşamba` ve `09:30/12:2913:30/17:29` gibi şeyler
elde ediyorsunuz. Gün, saat, derslik ve bina kolonları `<br>` üzerinden bölünüp
paralel dizilere yazılıyor.

Tarihsel dökümlerin biçimi yıldan yıla değişiyor. Ayırıcı eskiden boşluk,
sonradan ` / ` olmuş. Saatler bazen `0930/1229`, bazen `09:30/12:29`. Gün adları
kimi yıl Türkçe, kimi yıl İngilizce. Hepsi tek biçime çekiliyor, yoksa iki
dönemi yan yana koyup karşılaştıramıyorsunuz.

Aynı dökümlerde bina ve derslik aynı hücrede duruyor. `INB / A104` tek oturumun
binası ve dersliği, ama `MDB / MDB / -- / --` iki oturumun ikisi birden. Eleman
sayısı oturum sayısının iki katıysa ikinci yarı derslik sayılıyor.

Bir de şu var, bulması en can sıkıcı olanı: `"BIL".toLocaleLowerCase("tr")` size
`"bıl"` veriyor. Türkçe yerelinde I harfi noktasız ı'ya düşüyor. Kullanıcı arama
kutusuna `bil` yazdığında hiçbir şey bulunmuyor. Site artık aramayı ASCII'ye
katlanmış metin üzerinde yapıyor. Yan fayda olarak `muhendislik` de
`Mühendislik`i buluyor.

Kontenjan zaman serisinde boyut sorunu var. 3900 şubelik bir dönemde yarım
saatte bir tam snapshot almak haftada onlarca megabayt eder. Onun yerine
append-only bir JSONL tutuyoruz ve her satıra yalnızca bir öncekine göre değişen
CRN'leri yazıyoruz. Kayıt dışı zamanlarda satır hiç yazılmıyor, kayıt haftasında
yoğunlaşıyor. Yan fayda olarak git diff'i de temiz kalıyor, her ölçüm tek satır
ekliyor.

Önşart sayfasında (`OnsartAra`) OBS'nin kendi markup'ında gerçek bir hata var.
"Ders Adı" hücresinin kapanış etiketi tamamen eksik. Tarayıcı bunu otomatik
kapatıyor ama eşleşen `<td>...</td>` çiftlerine bakan bir regex bunu bilmiyor ve
iki hücreyi birleştiriyor. Çözüm eşleşen çiftlere değil `<td` konumlarına göre
bölmek. Kapanış etiketi olsun olmasın doğru sonucu veriyor.

Müfredat sayfasında da benzer bir tuzak var. Dönem başlıkları (`1. Yarıyıl`)
`<h3>` değil `<h2>` etiketiyle geliyor, sayfanın kendi sekme başlıkları
(Akademik Takvim, Ders Bilgileri...) ise `<h3>`. İkisini karıştırınca yanlış
başlıklarla eşleşip sessizce boş bir müfredat üretiyorsunuz.

Force-directed grafikte de ilginç bir hata çıktı. Aynı `Path2D` üzerinde art
arda `arc()` çağırmak, `moveTo` olmadan her dairenin bitişini bir sonrakinin
başlangıcına düz bir çizgiyle bağlıyor. Sonuç, binlerce ayrı daire yerine tek
bir "vitray" şekli. Her `arc()`'tan önce `moveTo` çağırmak şart.

Fizikte de bir kararsızlık vardı. İki düğüm üst üste binince itme kuvveti
sonsuza gidiyor ve simülasyon bir turda sayısal olarak patlıyor (pozisyonlar
`1e+70` mertebesine fırlıyor). Çözüm minimum mesafe ve maksimum kuvvet/hız
sınırlaması. Bir de yerleşme animasyonunu `requestAnimationFrame` ile
zamanlamayın. Sekme görünür değilken tarayıcılar rAF'ı süresiz askıya alabiliyor
ve animasyon hiç bitmiyor. `setTimeout` ile, gerçekten geçen süreye göre
uyarlanabilir yield kullanmak güvenilir.

Son olarak, OBS tablosu 15 kolon değilse, sınav tablosu 10 kolon değilse ya da
tarihsel dökümde beklenen başlıklar yoksa scraper hata verip duruyor. Sessizce
bozuk veri yazmaktansa workflow'u kırmızıya düşürmek daha iyi.

## Eksikler

2024-2025 Güz hiçbir kaynakta yok. Sitede "veri yok" diye işaretli, ama nedenini
ben de bilmiyorum.

2025-2026 Güz dökümünde 2.985 şube var. Komşu dönemler 3.300 ile 3.800 arasında
olduğuna göre bu döküm dönem başında alınmış, muhtemelen eksik.

Geçmiş dönemler OBS'den geri alınamıyor. Öğretim yöntemi, önşart ve rezervasyon
bilgisi ancak bugünden sonraki taramalarda birikecek.

Geçmiş dönemlerde seviye bilgisi (LS/LU) bugünkü branş listesinden tahmin
ediliyor. O tarihten sonra kapanmış branşlarda boş kalabilir.

Müfredat lisans programlarında 128'in 106'sında çekilebildi. Kalan 22'si (Siber
Güvenlik Mühendisliği, Yapay Zeka gibi yeni açılan bazı programlar) OBS'de henüz
yayınlanmış bir plan sürümüne sahip değil. Önlisans (1), yüksek lisans (3) ve
doktora (4) programları da çekiliyor. İkinci öğretim (ID 5) kodları yüksek
lisansla (_YL) çakıştığı için kapsam dışı.

Katalog verisi haftalık taramayla doluyor; OBS'de katalog formu olmayan
(eski/kaldırılmış) dersler bu kapsamda yer almıyor. Bazı derslerin (ör. bitirme
çalışması) tanım alanı kaynakta boş — kayıt yine yazılıyor, yalnızca içerik
bölümü panelde görünmüyor. Kapsam sayıları `catalog/index.json`'da.

Haftalık plan (`weeklyPlan`) ve ders denklikleri (`equivalents`) alanları katalog
taramayla doluyor: `weeklyPlan` haftalık `cmd/catalog` çalışmasında, denklikler
ise OBS'nin DersBilgi arama ucunu (DersBilgiSearch) ayrı ve yavaş biçimde çeken
`cmd/catalog -equivalents` geçişiyle eklenir. Veri yokken site eski biçimle
(haftalık konular listesi, denkliksiz) çalışır.

Not dağılımı yalnızca son üç akademik yılı kapsıyor; eski derslerin veya henüz
notu açıklanmamış dönemlerin dağılımı yok. 10 kişinin altındaki sınıflar etik
nedenle kaydedilmiyor (kişi ifşası). Kapsam `grades/index.json`'da.

## Uyarı

Resmî bir İTÜ hizmeti değil. Kayıt kararı vermeden önce OBS'nin kendi sayfasına
bakın. Kontenjanlar günde bir kez tazeleniyor, anlık değil. Scraper saniyede altı
istekle sınırlı çalışıyor.
