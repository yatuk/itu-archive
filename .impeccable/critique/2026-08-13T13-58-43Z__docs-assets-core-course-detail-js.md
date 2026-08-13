---
target: ders detay paneli (docs/assets/core/course-detail.js)
total_score: 29
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 3
p2_count: 4
p3_count: 2
timestamp: 2026-08-13T13-58-43Z
slug: docs-assets-core-course-detail-js
---
# Critique — Ders Detay Paneli (course-detail.js)

## Method
Method: dual-agent (A: tasarım incelemesi · B: detektör + headless chromium kanıtı)

## Design Health Score (Nielsen 10)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Sistem durumu görünürlüğü | 4 | "yükleniyor…", ölçüm zamanı, "hepsi dolu", neden açıklamaları |
| 2 | Gerçek dünyayla uyum | 4 | Yerel dil, İTÜ terminolojisi, insanca zamanlama |
| 3 | Kullanıcı kontrolü | 4 | Esc/arka plan/✕ + derin bağlantı + geri dönüş |
| 4 | Tutarlılık | 2 | secCard doluluk çubuğu fillBar'dan sapıyor; .empty kötüye kullanımı |
| 5 | Hata önleme | 3 | Yıkıcı eylem yok; veri-yok açıklamaları |
| 6 | Tanımadan hatırlama | 3 | Kodlar adlarla zenginleşiyor; CRN aralığı yükü |
| 7 | Esneklik | 3 | Derin bağlantı, "N daha göster"; 394 satırlık geçmiş verimsiz |
| 8 | Estetik/minimal | 2 | Geçmiş 16.450px'e şişiyor; 440px program kutusu |
| 9 | Hata tanıma | 3 | Veri-yok durumları iyi açıklanıyor |
| 10 | Yardım/dokümantasyon | 1 | Panel içi yardım yok |
| **Total** | | **29/40** | **Good** |

## Design Specificity Verdict
**GEÇER** — yüksek ürün özgüllüğü (İTÜ veri sözleşmeleri, yerel mikro-kopya, .d-* sınıfları); kalıplar (doluluk çubuğu, çubuklar, çipler) yeniden kullanılabilir ama birebir kopya başka ürüne girmez.

## Kanıt (Assessment B)
- **Kontrast: 17 panel öğesinin tamamı ≥4.5:1** (sade teması; en düşük 4.97 dimmer-on-panel2).
- 360px'te panel/kutu taşması yok; geçmiş tablosu kendi .tablewrap içinde kayar.
- Odak: açılışta #detail-close'a gidiyor; **kapatınca BODY'de kalıyordu** (çift openDetail — toggle+tr handler) → düzeltildi. `aria-modal` odak tuzağı yoktu → eklendi.
- secCard doluluk çubuğu `full`/`tight` sınıfı almıyordu (dolu şube panelde yeşil, tabloda amber) → imza adımına alındı.

## Priority Issues
- **P1** Sade'de koyu perde: `.detail-panel`/`.dlg` rgba(3,5,4,.72) hardcoded → --scrim var'ı + sade hafif perde (düzeltildi).
- **P1** `.d-sec` beyaz kartlar beyaz zeminde görünmez → sade panel-2 + line-hot (düzeltildi).
- **P1** Geçmiş tablosu toplu derslerde patlıyor (TUR 101 → 394 satır/16.450px) → ertelendi (harden/eval).
- **P2** secCard full/tight eksik + gruplu şubeler kapasiteyi gizler → imza adımı.
- **P2** Odak dönüşü + tuzağı (düzeltildi: courses.js stopPropagation, course-detail.js trapDetailFocus).
- **P2** `.empty` 40px padding panel notlarını şişiriyor → sade dar varyant (düzeltildi).
- **P2** Program çipleri uzun adlarla 440px kutu → sade max-width+ellipsis (düzeltildi).
- **P3** `.d-*` h4 geniş-tracking sade'de → .05em (düzeltildi); `.detail-close` 18px küçük → hit alanı (düzeltildi).

## False Positives
- figcaption.sr-only overflow, .tablewrap iç kaydırma (kasıtlı), CLI detect [] (tarama sınırı).

## Önerilen sıradaki komutlar
/impeccable harden (geçmiş patlaması, taşma) → /impeccable polish (imza öğesi, triyaj).
