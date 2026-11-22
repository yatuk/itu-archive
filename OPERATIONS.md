# Yayın ve geri alma

## Yayın kapısı

`test` workflow'undaki `quality-gate` durumu `main` için zorunlu branch-protection kontrolü olmalıdır. Kapı şu üç işi birlikte ister:

- Go/JavaScript birim testleri, generator drift ve veri doğrulama
- Masaüstü/mobil Playwright regresyonu
- Ana araç sayfalarında Lighthouse erişilebilirlik, SEO, LCP, CLS, TBT ve asset bütçeleri

GitHub Pages yayını tamamlanınca `live-smoke`, HTML'deki asset sürümünü commit ile karşılaştırır; canlı `status.json` tazeliğini, temel görünümleri, kritik SEO sayfalarını ve yatay taşmayı kontrol eder. Her koşuda masaüstü ve mobil ekran kanıtları 14 gün saklanır.

## Asset üretimi ve sürümleri

- `assets-src/` elle yazılan kaynaktır; `docs/assets/` üretilen çıktıdır ve elle düzenlenmez.
- `go run ./cmd/site -assets-only` yalnız asset adımını çalıştırır: küçültme, `style.css`'in uygulama çekirdeği (`docs/assets/css/app.css`) ile sekme parçalarına (`docs/assets/css/<sekme>.css`) bölünmesi ve `?v=` yamaları (JS importları, `docs/index.html`, `docs/404.html`, üretilmiş HTML sayfaları). Bu dosyalar için çıktı tam `go run ./cmd/site` ile birebir aynıdır, CI drift denetimi aynı sonucu verir. Veri ya da `internal/site` değişikliğinde tam üretim gerekir.
- `?v=` dosya başına içerik özetidir. JS modülünün sürümü içe aktardığı dosyaların sürümlerini de kapsar (Merkle); bir yardımcı modül değişince onu içe aktaranların da sürümü değişir. `-version X` tüm dosyalara tek sürüm verir (yalnız acil önbellek kırma için).
- `live-smoke`, yayının hazır olduğunu `app.js?v=` değeriyle anlar. Bu değer yalnız uygulama JS'i ya da JS'in yüklediği bir sekme CSS'i değişince değişir; yalnız çekirdek CSS'i (`css/app.css`) ya da statik sayfa CSS'ini etkileyen bir commit'te canlı sürüm zaten aynı göründüğü için bekleme hemen biter (workflow'un ileride `css/app.css?v=` değerine de bakması gerekebilir).
- Statik SEO sayfaları eksiksiz `style.css`'i kullanır. Uygulama yalnız `css/app.css` ile açılır; sekme stilleri sekme ilk açıldığında yüklenir ve görünüm stili gelmeden gösterilmez. Yeni bir sekme sınıfı ekliyorsan `cmd/site/csssplit.go`'daki kova belirteçlerine uyduğundan ve `go test ./cmd/site` (sahiplik denetimi) geçtiğinden emin ol.

## Güvenli geri alma

1. Başarısız `live-smoke` koşusundaki commit ve beklenen asset sürümünü kaydet.
2. Son sağlam yayını GitHub Actions ve `git log` üzerinden belirle.
3. Hatalı commit'i geçmişi yeniden yazmadan `git revert <commit>` ile geri al.
4. Revert PR'ında `quality-gate` tamamlanmadan merge etme.
5. Yayından sonra `live-smoke` sonucunu ve `https://itu-ders.com/status/` sayfasını doğrula.

Scraper başarısızlığında son sağlam JSON/CSV dosyaları silinmez. Yeni veri yalnız doğrulama kapılarını geçerse commit edilir; hata durumunda veri üretim workflow'u başarısız olur ve mevcut Pages yayını hizmet vermeye devam eder.
