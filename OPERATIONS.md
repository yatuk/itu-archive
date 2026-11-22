# Yayın ve geri alma

## Yayın kapısı

`test` workflow'undaki `quality-gate` durumu `main` için zorunlu branch-protection kontrolü olmalıdır. Kapı şu üç işi birlikte ister:

- Go/JavaScript birim testleri, generator drift ve veri doğrulama
- Masaüstü/mobil Playwright regresyonu
- Ana araç sayfalarında Lighthouse erişilebilirlik, SEO, LCP, CLS, TBT ve asset bütçeleri

Site Cloudflare Pages'ten (`main` / `docs`) yayınlanır. `docs/**` değiştiren her `main` push'unda, her gün 06:23 UTC'de ve elle `live-smoke` koşar. Önce canlı `/build.json`'un test edilen commit'teki `docs/build.json` ile aynı damgayı göstermesini en çok 10 dakika bekler (`scripts/wait-for-deploy.mjs`); süre dolarsa koşu "deploy not seen" hatasıyla, testleri çalıştırmadan düşer (test hatası değil, commit'teki Cloudflare Pages kontrolüne bakılır). Ardından ana sayfa başlığı/H1, veri listesi, sekmeler, canlı `status.json` tazeliği, ders ve hoca sayfaları, eski adres 301'leri, `_headers` (HSTS, asset immutable önbelleği), kritik SEO sayfaları ve yatay taşma denetlenir. Her koşuda masaüstü ve mobil ekran kanıtları 14 gün saklanır. Veri workflow'ları `GITHUB_TOKEN` ile push ettiği için push tetiklemez; veri yayınlarını günlük koşu kapsar. Yerelde: `node scripts/wait-for-deploy.mjs --print` canlı damgayı yazar, `npx playwright test --config=playwright.live.config.js` testleri çalıştırır (`EXPECTED_BUILD` verilirse canlı damga da denetlenir).

## Asset üretimi ve sürümleri

- `assets-src/` elle yazılan kaynaktır; `docs/assets/` üretilen çıktıdır ve elle düzenlenmez.
- `go run ./cmd/site -assets-only` yalnız asset adımını çalıştırır: küçültme, `style.css`'in uygulama çekirdeği (`docs/assets/css/app.css`) ile sekme parçalarına (`docs/assets/css/<sekme>.css`) bölünmesi ve `?v=` yamaları (JS importları, `docs/index.html`, `docs/404.html`, üretilmiş HTML sayfaları). Bu dosyalar için çıktı tam `go run ./cmd/site` ile birebir aynıdır, CI drift denetimi aynı sonucu verir. Veri ya da `internal/site` değişikliğinde tam üretim gerekir.
- `?v=` dosya başına içerik özetidir. JS modülünün sürümü içe aktardığı dosyaların sürümlerini de kapsar (Merkle); bir yardımcı modül değişince onu içe aktaranların da sürümü değişir. `-version X` tüm dosyalara tek sürüm verir (yalnız acil önbellek kırma için).
- `docs/build.json` yayın damgasıdır: `docs/` altındaki tüm dosyaların (kendisi ve nokta dosyaları hariç) yol+içerik SHA-256 özeti (`cmd/site/buildstamp.go`). Tam üretim ve `-assets-only` her koşunun sonunda yeniler; git'e ya da saate bağlı olmadığı için drift denetimi aynı sonucu verir. `?v=` dosya başına olduğundan yayın tespiti için tek bir asset sürümüne bakılmaz. `docs/` elle değiştirildiyse `go run ./cmd/site` (en az `-assets-only`) çalıştırılmalı, yoksa damga eski kalır ve CI drift denetimi düşer.
- Arayüz metinleri `assets-src/i18n/tr.js` ve `assets-src/i18n/en.js` sözlüklerindedir; `i18n.js` yalnız etkin dilinkini yükler (üst düzey `await`), `docs/index.html` aynı sözlüğü `modulepreload` ile erkenden ister. Her satır tek satırlık `anahtar: 'metin',` olmalı: cmd/site bu biçimi okuyup İngilizcede boş ya da eksik anahtara derlenen `en.js`'te Türkçe değeri yazar (eski `en || tr` düşüşü). Yeni anahtar iki sözlüğe de eklenir; `go test ./cmd/site` ve `core.test.js` eşleşmeyi denetler.
- Statik SEO sayfaları eksiksiz `style.css`'i kullanır. Uygulama yalnız `css/app.css` ile açılır; sekme stilleri sekme ilk açıldığında yüklenir ve görünüm stili gelmeden gösterilmez. Yeni bir sekme sınıfı ekliyorsan `cmd/site/csssplit.go`'daki kova belirteçlerine uyduğundan ve `go test ./cmd/site` (sahiplik denetimi) geçtiğinden emin ol.

## Güvenli geri alma

1. Başarısız `live-smoke` koşusundaki commit ve beklenen yayın damgasını (`build`) kaydet.
2. Son sağlam yayını GitHub Actions ve `git log` üzerinden belirle.
3. Hatalı commit'i geçmişi yeniden yazmadan `git revert <commit>` ile geri al.
4. Revert PR'ında `quality-gate` tamamlanmadan merge etme.
5. Yayından sonra `live-smoke` sonucunu ve `https://itu-ders.com/status/` sayfasını doğrula.

Scraper başarısızlığında son sağlam JSON/CSV dosyaları silinmez. Yeni veri yalnız doğrulama kapılarını geçerse commit edilir; hata durumunda veri üretim workflow'u başarısız olur ve mevcut Pages yayını hizmet vermeye devam eder.
