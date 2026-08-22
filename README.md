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

## Test

```bash
go test ./...
node --test docs/assets/core/core.test.js
go run ./cmd/validate -quiet
npx playwright test
```

GitHub Pages kaynağı `main / docs` olmalıdır. Tarama ve yayın güvenlikleri, veri biçimi ve geri alma adımları için [OPERATIONS.md](OPERATIONS.md) dosyasına bakın.
