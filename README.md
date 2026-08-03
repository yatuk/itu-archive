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
| `takvim.sis.itu.edu.tr` | 4 akademik yılın takvimi |
| Tarihsel dökümler | 2016-2017'ye kadar geçmiş dönemler, `-backfill` ile |

Aktif dönem OBS'den geliyor, dolayısıyla tam kayıt: öğretim yöntemi, önşart,
rezervasyon, derslik. Geçmiş dönemlerde bunların bir kısmı yok.

## Çalıştırma

```bash
go run ./cmd/scrape            # aktif dönem + akademik takvim
go run ./cmd/scrape -backfill  # geçmiş dönemleri de al, bir kez yeterli
```

Her şey `docs/data` altına yazılıyor. Tam tarama bir dakika sürüyor. Bayraklar:
`-out`, `-workers`, `-rps`, `-skip-courses`, `-skip-calendar`.

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

Son olarak, OBS tablosu 15 kolon değilse ya da tarihsel dökümde beklenen başlıklar
yoksa scraper hata verip duruyor. Sessizce bozuk veri yazmaktansa workflow'u
kırmızıya düşürmek daha iyi.

## Eksikler

2024-2025 Güz hiçbir kaynakta yok. Sitede "veri yok" diye işaretli, ama nedenini
ben de bilmiyorum.

2025-2026 Güz dökümünde 2.985 şube var. Komşu dönemler 3.300 ile 3.800 arasında
olduğuna göre bu döküm dönem başında alınmış, muhtemelen eksik.

Geçmiş dönemler OBS'den geri alınamıyor. Öğretim yöntemi, önşart ve rezervasyon
bilgisi ancak bugünden sonraki taramalarda birikecek.

Geçmiş dönemlerde seviye bilgisi (LS/LU) bugünkü branş listesinden tahmin ediliyor.
O tarihten sonra kapanmış branşlarda boş kalabilir.

## Uyarı

Resmî bir İTÜ hizmeti değil. Kayıt kararı vermeden önce OBS'nin kendi sayfasına
bakın. Kontenjanlar günde bir kez tazeleniyor, anlık değil. Scraper saniyede altı
istekle sınırlı çalışıyor.
