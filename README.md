<p align="center">
  <a href="https://itu-ders.com/">
    <img src="docs/social-card-v2.png" alt="İTÜ Ders Arşivi — ders programı, önşart haritası ve akademik takvim" width="760">
  </a>
</p>

# İTÜ Ders Arşivi

[itu-ders.com](https://itu-ders.com/), İTÜ OBS ve akademik takvimde yayımlanan açık veriyi düzenli olarak arşivleyen bağımsız bir öğrenci aracıdır.

- Güncel ve geçmiş dersleri, şubeleri, hocaları ve kontenjanları ara
- Haftalık ders programı oluştur; çakışmaları gör ve ICS/CSV olarak dışa aktar
- Bölüm ders planını, önşart haritasını, sınavları ve akademik takvimi incele
- Notlarını veya OBS Transkript Önizleme metnini yalnızca tarayıcıda işleyerek GANO hesapla

Ham veri JSON/CSV olarak `docs/data/` altında yayımlanır. Kaynaklar İTÜ'nün herkese açık OBS sayfaları ile `takvim.sis.itu.edu.tr` adresidir. Proje İTÜ'nün resmî hizmeti değildir.

## Yerelde çalıştırma

```bash
go run ./cmd/scrape
go run ./cmd/site
python -m http.server 8765 --directory docs
```

Yalnız `assets-src/` altındaki CSS/JS'i değiştirdiysen tam üretim (5–10 dakika) yerine hızlı kipi kullan:

```bash
go run ./cmd/site -assets-only
```

Bu kip `assets-src/` → `docs/assets/` küçültmesini, uygulama CSS'inin sekme parçalarına bölünmesini (`docs/assets/css/`) ve `?v=` sürüm yamalarını (JS importları, `docs/index.html`, üretilmiş HTML sayfaları) çalıştırır; veri ve SEO sayfası üretmez. Bu dosyalar için çıktısı tam üretimle birebir aynıdır. Veri, şablon ya da `internal/site` değiştiyse tam `go run ./cmd/site` gerekir.

Asset sürümleri dosya başınadır: her CSS/JS dosyasının `?v=` değeri kendi içeriğinden gelir; JS modüllerinde içe aktardığı dosyaların sürümlerini de kapsar. Tek satırlık bir CSS değişikliği yalnız o dosyanın önbelleğini kırar.

## Test

```bash
go test ./...
node --test docs/assets/core/core.test.js
go run ./cmd/validate -quiet
npx playwright test
```

Site Cloudflare Pages'ten yayınlanır; kaynak `main / docs`. Tarama ve yayın güvenlikleri, veri biçimi ve geri alma adımları için [OPERATIONS.md](OPERATIONS.md) dosyasına bakın.
