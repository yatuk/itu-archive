<p align="center">
  <img src="docs/glitch_effect.gif" alt="İTÜ Ders Arşivi" width="600">
</p>

# İTÜ Ders Arşivi

OBS'nin ders programı sayfası sadece içinde bulunduğunuz dönemi gösteriyor. Dönem
bitiyor, veri gidiyor. Geçen sene bu dersi kim vermişti, kontenjan kaç kişide
dolmuştu, hangi güne konmuştu? Hiçbirini geriye dönük soramıyorsunuz.

Bu depo o veriyi her gün çekip git'e yazıyor. Şu an 2016-2017 Yaz'dan bugüne 27
dönem, 64.309 şube kaydı duruyor içinde. Akademik takvim de dahil.

## Kaynaklar

| Nereden | Ne |
|---|---|
| `obs.itu.edu.tr/public/DersProgram` | Aktif dönem. 4 program seviyesi (OL/LS/LU/LUI), 337 branş kodu |
| `obs.itu.edu.tr/public/FinalTakvimi` | Final ve ek sınav takvimi |
| `obs.itu.edu.tr/public/GenelTanimlamalar/OnsartAra` | Katalogdaki her dersin önşartı |
| `obs.itu.edu.tr/public/DersPlan` | Her lisans programının güncel müfredatı, dönem dönem |
| `takvim.sis.itu.edu.tr` | 4 akademik yılın takvimi |
| Tarihsel dökümler | 2016-2017'ye kadar geçmiş dönemler, `-backfill` ile |

Aktif dönem OBS'den geliyor, dolayısıyla tam kayıt: öğretim yöntemi, önşart,
rezervasyon, derslik. Geçmiş dönemlerde bunların bir kısmı yok.

## Ne sorabilirsin

Sitedeki geçmiş sekmesi 27 dönemin birleştirilmiş kaydı üzerinde çalışıyor.
OBS'de sorulamayan şeyler burada sorulabiliyor:

- BLG 102E'yi son beş yılda kim verdi (13 dönem, dönem dönem hoca listesi)
- Bu ders hangi mevsimde açılıyor, güz mü bahar mı
- Bir öğretim üyesi hangi dersleri veriyor ve kaç dönemdir veriyor
- Bir şube geçen sefer kaç dakikada doldu

6.264 ders ve 4.148 öğretim üyesi indekslenmiş durumda.

Site ayrıca bir "ders planı haritası" sunuyor: bir bölüm seçin, o bölümün güncel
müfredatı dönem dönem, gerçek önşart ilişkileriyle kendiliğinden yerleşen bir
grafikte çiziliyor. Bir düğüme tıklayınca geriye doğru önşartlar, ileriye doğru
o dersi önşart olarak isteyen dersler parlıyor. Seçmeli ders slotları tek bir
düğüm (bazı havuzlarda 150'den fazla alternatif var, hepsini tek tek düğüm
yapmak grafiği okunmaz hale getiriyordu); tıklayınca alternatifler panelde
listeleniyor.

## Çalıştırma

```bash
go run ./cmd/scrape            # ders programı, sınav takvimi, önşartlar, akademik takvim
go run ./cmd/scrape -backfill  # geçmiş dönemleri de al, bir kez yeterli
go run ./cmd/quota             # kontenjan doluluğundan tek ölçüm al
go run ./cmd/curriculum        # tüm lisans programlarının müfredatını çek
```

Her şey `docs/data` altına yazılıyor. Tam tarama iki dakika sürüyor. Bayraklar:
`-out`, `-workers`, `-rps`, `-skip-courses`, `-skip-calendar`, `-skip-exams`, `-skip-prereq`.

`cmd/quota` ve `cmd/curriculum` ayrı komutlar çünkü frekansları farklı: ders
programı günde bir kez yeterli, kontenjan kayıt haftasında yarım saatte bir
anlamlı, müfredat ise dönemde belki bir kez değişiyor (`cmd/curriculum -only
BLG_LS` ile tek program test edilebilir). `cmd/quota` değişen bir şey yoksa
dosyaya hiç dokunmuyor, o yüzden sakin dönemlerde boş commit birikmiyor.

Siteyi yerelde açmak için:

```bash
python -m http.server 8765 --directory docs
```

### GitHub Pages

Settings > Pages > Source: Deploy from a branch, `main` / `docs`. Ayrı bir deploy
workflow'u yok, gerek de yok: scraper zaten `docs/` altına yazıyor, her commit
kendiliğinden yayına giriyor.

Bot'un commit atabilmesi için Settings > Actions > General kısmında workflow
izinleri "Read and write" olmalı. Bunu unutursanız Actions yeşil görünür ama hiçbir
şey push edilmez.

## Veri düzeni

```
docs/data/
  index.json                        # dönem ve takvim listesi
  terms/<dönem>/meta.json           # branş listesi, sayımlar, kaynak
  terms/<dönem>/search.json         # hafif arama indeksi
  terms/<dönem>/branches/<KOD>.json # tam kayıtlar
  terms/<dönem>/all.csv             # tek dosya döküm, Excel için BOM'lu
  calendar/<yıl>.json               # akademik takvim
  exams/<dönem>.json                # final ve ek sınav takvimi
  history/codes.json                # ders arama listesi
  history/names.json                # öğretim üyesi arama listesi
  history/courses/<BRANŞ>.json      # ders bazlı dönem geçmişi
  history/instructors/<harf>.json   # öğretim üyesi bazlı geçmiş
  quota/<dönem>.jsonl               # kontenjan zaman serisi, append-only
  quota/<dönem>.json                # türetilmiş dolma özeti
  prereq/graph.json                 # katalogdaki her dersin önşart ilişkisi
  curriculum/index.json             # lisans program listesi
  curriculum/<PROGRAM_LS>.json      # bir programın dönem dönem müfredatı
```

Dönem adları `2025-2026-guz` biçiminde. Branş bazlı bölmenin sebebi tarayıcıya 10
MB'lık tek dosya indirtmemek, ve git diff'inin "hangi branşta ne değişti" sorusuna
okunabilir cevap vermesi.

## Kaynaklardaki tuhaflıklar

Bu sayfaları kazımak göründüğü kadar düz bir iş değil. Çıkan sorunlar:

Takvim sayfası tek belgede iki kodlama birden kullanıyor. Statik şablon ISO-8859-9,
veritabanından gelen metinler UTF-8. Hangisini seçerseniz seçin metnin yarısı
bozuluyor, ya `Ã¼` ya `E\xc5\x9fitim` çıkıyor. `fetch.DecodeMixed` her bayt için
ayrı karar veriyor.

OBS, haftada iki oturumu olan dersleri tek hücreye `<br>` ile sıkıştırıyor. Düz
metne çevirdiğinizde `ÇarşambaÇarşamba` ve `09:30/12:2913:30/17:29` gibi şeyler
elde ediyorsunuz. Gün, saat, derslik ve bina kolonları `<br>` üzerinden bölünüp
paralel dizilere yazılıyor.

Tarihsel dökümlerin biçimi yıldan yıla değişiyor. Ayırıcı eskiden boşluk, sonradan
` / ` olmuş. Saatler bazen `0930/1229`, bazen `09:30/12:29`. Gün adları kimi yıl
Türkçe, kimi yıl İngilizce. Hepsi tek biçime çekiliyor, yoksa iki dönemi yan yana
koyup karşılaştıramıyorsunuz.

Aynı dökümlerde bina ve derslik aynı hücrede duruyor. `INB / A104` tek oturumun
binası ve dersliği, ama `MDB / MDB / -- / --` iki oturumun ikisi birden. Eleman
sayısı oturum sayısının iki katıysa ikinci yarı derslik sayılıyor.

Bir de şu var, bulması en can sıkıcı olanı: `"BIL".toLocaleLowerCase("tr")` size
`"bıl"` veriyor. Türkçe yerelinde I harfi noktasız ı'ya düşüyor. Yani kullanıcı
arama kutusuna `bil` yazdığında hiçbir şey bulunmuyor. Site artık aramayı ASCII'ye
katlanmış metin üzerinde yapıyor. Yan fayda olarak `muhendislik` de `Mühendislik`i
buluyor.

Kontenjan zaman serisinde boyut sorunu var: 3900 şubelik bir dönemde yarım saatte
bir tam snapshot almak haftada onlarca megabayt eder. Onun yerine append-only bir
JSONL tutuyoruz ve her satıra yalnızca bir öncekine göre değişen CRN'leri yazıyoruz.
Kayıt dışı zamanlarda satır hiç yazılmıyor, kayıt haftasında yoğunlaşıyor. Yan
fayda olarak git diff'i de temiz kalıyor, her ölçüm tek satır ekliyor.

Önşart sayfasında (`OnsartAra`) OBS'nin kendi markup'ında gerçek bir hata var:
"Ders Adı" hücresinin kapanış etiketi tamamen eksik, tarayıcı bunu otomatik
kapatıyor ama eşleşen `<td>...</td>` çiftlerine bakan bir regex bunu bilmiyor
ve iki hücreyi birleştiriyor. Çözüm eşleşen çiftlere değil `<td` konumlarına
göre bölmek — kapanış etiketi olsun olmasın doğru sonucu veriyor.

Müfredat sayfasında da benzer bir tuzak var: dönem başlıkları (`1. Yarıyıl`)
`<h3>` değil `<h2>` etiketiyle geliyor; sayfanın kendi sekme başlıkları
(Akademik Takvim, Ders Bilgileri...) `<h3>`. İkisini karıştırınca yanlış
başlıklarla eşleşip sessizce boş bir müfredat üretiyorsunuz.

Force-directed grafikte de ilginç bir hata çıktı: aynı `Path2D` üzerinde art
arda `arc()` çağırmak, `moveTo` olmadan her dairenin bitişini bir sonrakinin
başlangıcına düz bir çizgiyle bağlıyor. Sonuç, binlerce ayrı daire yerine tek
bir "vitray" şekli. Her `arc()`'tan önce `moveTo` çağırmak şart.

Fizikte de bir kararsızlık vardı: iki düğüm üst üste binince itme kuvveti
sonsuza gidiyor ve simülasyon bir turda sayısal olarak patlıyor (pozisyonlar
`1e+70` mertebesine fırlıyor). Çözüm minimum mesafe ve maksimum kuvvet/hız
sınırlaması. Bir de yerleşme animasyonunu `requestAnimationFrame` ile
zamanlamayın: sekme görünür değilken tarayıcılar rAF'ı süresiz askıya
alabiliyor ve animasyon hiç bitmiyor. `setTimeout` ile, gerçekten geçen süreye
göre uyarlanabilir yield kullanmak güvenilir.

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

Geçmiş dönemlerde seviye bilgisi (LS/LU) bugünkü branş listesinden tahmin ediliyor.
O tarihten sonra kapanmış branşlarda boş kalabilir.

Müfredat 128 lisans programından 106'sında çekilebildi; kalan 22'si (Siber
Güvenlik Mühendisliği, Yapay Zeka gibi yeni açılan bazı programlar) OBS'de henüz
yayınlanmış bir plan sürümüne sahip değil. Önlisans ve lisansüstü programlar
şimdilik kapsam dışı.

## Uyarı

Resmî bir İTÜ hizmeti değil. Kayıt kararı vermeden önce OBS'nin kendi sayfasına
bakın. Kontenjanlar günde bir kez tazeleniyor, anlık değil. Scraper saniyede altı
istekle sınırlı çalışıyor.
