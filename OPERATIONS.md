# Yayın ve geri alma

## Yayın kapısı

`test` workflow'undaki `quality-gate` durumu `main` için zorunlu branch-protection kontrolü olmalıdır. Kapı şu üç işi birlikte ister:

- Go/JavaScript birim testleri, generator drift ve veri doğrulama
- Masaüstü/mobil Playwright regresyonu
- Ana araç sayfalarında Lighthouse erişilebilirlik, SEO, LCP, CLS, TBT ve asset bütçeleri

GitHub Pages yayını tamamlanınca `live-smoke`, HTML'deki asset sürümünü commit ile karşılaştırır; canlı `status.json` tazeliğini, temel görünümleri, kritik SEO sayfalarını ve yatay taşmayı kontrol eder. Her koşuda masaüstü ve mobil ekran kanıtları 14 gün saklanır.

## Güvenli geri alma

1. Başarısız `live-smoke` koşusundaki commit ve beklenen asset sürümünü kaydet.
2. Son sağlam yayını GitHub Actions ve `git log` üzerinden belirle.
3. Hatalı commit'i geçmişi yeniden yazmadan `git revert <commit>` ile geri al.
4. Revert PR'ında `quality-gate` tamamlanmadan merge etme.
5. Yayından sonra `live-smoke` sonucunu ve `https://itu-ders.com/status/` sayfasını doğrula.

Scraper başarısızlığında son sağlam JSON/CSV dosyaları silinmez. Yeni veri yalnız doğrulama kapılarını geçerse commit edilir; hata durumunda veri üretim workflow'u başarısız olur ve mevcut Pages yayını hizmet vermeye devam eder.
