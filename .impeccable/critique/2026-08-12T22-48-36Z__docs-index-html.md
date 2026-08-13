---
target: siteyi impeccable ile tara (İTÜ Ders Arşivi)
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
p2_count: 4
p3_count: 2
timestamp: 2026-08-12T22-48-36Z
slug: docs-index-html
---
# Critique — İTÜ Ders Arşivi (docs/index.html)

## Method
Method: dual-agent (A: ae874ad82061b71cb · B: a30c7c6d9df54b158)

## Design Health Score (Nielsen 10)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Statbar + resultline + toast her eylemde; "en son X önce ölçüldü" çürüklük karşıtı |
| 2 | Match System / Real World | 3 | Türkçe, öğrenci sözlüğü; ama OL/LS/LU/LUI ve AIN_LS çiğ kodları |
| 3 | User Control and Freedom | 3 | Esc/back/roving tabindex/derin linkler; ama native confirm()/prompt() ve undo yok |
| 4 | Consistency and Standards | 3 | 6 yüzeyde tek detay modali, tek token seti; ama Sınavlar tablosu sıralanamıyor |
| 5 | Error Prevention | 3 | Kademeli disable, dolu şube, final çakışması; "temizle" onaysız |
| 6 | Recognition Rather Than Recall | 3 | Filtre chip'leri, kalıcı statbar; ama 8 sekme + 11 filtre tek bakışta |
| 7 | Flexibility and Efficiency | 4 | Ok tuşları, paylaşılabilir URL, CSV/ICS/PNG, favoriler; ama global arama kısayolu yok |
| 8 | Aesthetic and Minimalist Design | 3 | Koyu tema güzel ve tutarlı; ama yoğunluk (11 filtre, 12 kontrol) |
| 9 | Error Recovery | 3 | Boş durumlar neden söyler; ama OBS snippet'i için kurtarma yolu yok |
| 10 | Help and Documentation | 3 | Hakkında mini-manuel; ama tema ikonları yalnız title tooltip |
| **Total** | | **32/40** | **Good** |

## Design Specificity Verdict
**LLM:** Kimlik ürüne özgü ve yapısal — `root@itu` prompt'u, `>` sigil, `//` başlıklar, yanıp sönen imleç, acid-green DERS ARŞİVİ, monospace veri. Terminal-arşiv metaforu ürünün kendisi; jenerik dashboard değil. Ama varsayılan `sade` teması kimliği tamamen sıyırıyor (scanlines, prompt, imleç, glow) — yeni ziyaretçi jenerik bir veri tablosu görür, kimlik yalnızca `◐` tıklayanlara açılır.

**Deterministik (B):** 206 gerçek pozitif kontrast bulgusu — hepsi sade temasının `--dimmer #6b7d72` (4.0–4.4:1) ve `--amber #9a6b00` (4.3:1) token'larında. Dosya-taramasındaki koyu-token "3.0:1" bulgularının tümü yanlış pozitif (detektör beyaz zemin varsayıyor; gerçek koyu zeminde 6.7–15:1). Estetik bulguları (dark-glow, gpt-thin-border, repeating-stripes, overused-font) kasıtlı fosfor kimliği.

## Overall Impression
En güçlü varlığı detay modali (69k satırı "bir ders hakkında her şey"e çeviriyor) ve dürüst veri araçları (ölçüm zamanı, dolma hızı, final çakışması). En büyük fırsat: varsayılan yüzeyin kimliği saklaması ve kayıt haftası kullanıcısına filtresi duvar gibi yüklenmesi.

## What's Working
1. Terminal-arşiv kimliği token + dekorasyon katmanlarıyla disiplinle işlenmiş; sade'de de veri monospace kalıyor.
2. Detay modalı: 6 yüzeyden tek giriş, her eksikliği açıklıyor, derin linkli.
3. Karar-hazır veri: doluluk çubuğu eşik renkli, "X önce ölçüldü", "geçen sefer X sonra doldu", final çakışması.

## Priority Issues
### P1 — Sade temanın token değerleri WCAG AA'da başarısız (206 bulgu)
- **Ne:** `--dimmer #6b7d72` 4.0–4.4:1, `--amber #9a6b00` 4.3:1 (4.5:1 gerekir); `--line` kenarlıklar ~1.2:1 (3:1 gerekir). Etkilenen: statbar dt, tablo başlıkları, placeholder'lar, eyebrow'lar, 10px rozetler.
- **Neden önemli:** Varsayılan tema AA hedefini tutturamıyor; 11px harf aralıklı küçük metin en kötü kombinasyon.
- **Fix:** `[data-theme="sade"]` (ve `light`) altında token değerlerini yeniden hesapla — token isimleri sabit, koyu/contrast teması piksel değişmez.
- **Command:** audit → (kullanıcının hazırladığı kontrast paketi)

### P1 — Dersler filtre duvarı (11 kontrol) en büyük UX yükü
- **Ne:** Varsayılan sekmede 8 select + kod input + checkbox + 2 buton kalıcı görünür.
- **Neden önemli:** Kayıt haftası zaman-baskılı; kontrol duvarı tek görevle (ara→seç→program) rekabet ediyor; mobilde dağınık sütun.
- **Fix:** Birincil (dönem/bölüm/gün/saat) + "gelişmiş filtreler" disclosure; aktif chip'ler özet kalır.
- **Command:** distill

### P1 — Yapışkan sekme çubuğu odaklanan içeriği örtüyor
- **Ne:** `.tabs` sticky top:12px; scroll-padding-top yok; klavye odağı çubuğun altında kalabilir (2.4.11).
- **Fix:** İçerik alanına scroll-padding-top (çubuk yüksekliği); odak halkası ≥2px + ≥3:1.
- **Command:** adapt

### P2 — Native confirm()/prompt() diyalogları ve undo yok
- **Ne:** program.js progDel(135)/progRename(147)/setBackup(831) tarayıcı diyaloğu; "temizle" onaysız, "çıkar"/sürükle-geri-al yok.
- **Fix:** Mevcut modal desenine yönlendir; yıkıcı eylemlerde onay + 8s undo toast.
- **Command:** polish / harden

### P2 — Geniş harf aralıklı küçük etiketler (wide-tracking 12)
- **Ne:** .statbar dt 12px/.18em, .detail dt 11px/.12em, .tt-chip 10px/.12em, .badge 10px/.16em — 0.14–0.18em büyük harf.
- **Fix:** Harf aralığını azalt, boyut ≥11px, kontrastı yükselt.
- **Command:** typeset

### P2 — 10px fonksiyonel metin + skipped-heading
- **Ne:** "canlı"/"veri yok" 10px (11px taban altı); h1 → h3 (h2 yok).
- **Fix:** Rozet ≥11px; sekmelere görünür h2 başlık ekle.
- **Command:** typeset / clarify

## Persona Red Flags
**Alex (power user):** Global arama kısayolu yok (tema seçici + dil + 8 sekme geçilmeden #q'ya ulaşılamıyor); filtreler mouse-first; 200 satır sayfalama; native prompt() akışı böler; DERSLER→program el değişimi bellekte.

**Sam (a11y):** Önşart canvas'ı klavye erişilebilir ama ekran okuyucuya yapı boş (statik aria-label; VE/VEYA ilişkisi, hover-only tooltip görünmez); ikon butonlar (⧉＋−✎, ⚠) title-only; skip-to-content yok; sade teması AA'da başarısız; Program grid div-layout.

**Casey (mobil):** 8 sticky sekme yatay pill'de kayıp; 11 filtre dağınık sütun; bookmarklet sürükleme gerektiriyor (dokunmatik yok); ikon butonlar ~24–30px (<44px); title tooltip'i dokunmatikte yok.

## Minor Observations
- "27 dönem" vs 28 dönem tutarsız kopyası (statbar/i18n vs app.js) — veri-doğruluğu iddialı üründe güvenilirlik kaybı.
- PNG dışa aktarıcı (downloadPNG) sabit #fff/#666 — tema dışı.
- Theme değişince tab genişliği reflow yapıyor.
- Varsayılan Dersler 69k'nın ilk 200 satırını yüklüyor — "yazmaya başla" boş durumu daha sakin olurdu.
- `#f-term { min-width:210px }` + CLS koruması düşünülmüş (övgü).
- Motion budget yüksek; prefers-reduced-motion global ele alınmış (doğru).

## Questions
1. Varsayılan `sade` scanlines/prompt/imleci sıyırıyorsa, ürünün ilk izlenimini jenerik veri-tablosu sitesinden ayıran ne? Kimlik yalnızca `◐`'ı bulanlara mı, yoksa arşivin ruhu varsayılan yüzde mi görünmeli?
2. 8 eşit ağırlıklı sekme gerçek işe uyuyor mu? Kayıt haftasında görev "programımı kur + çakışmayı gör" — o yol 8 sekmenin 7'sinde.
3. Veri-yoğunluğu-önce, kayıt haftasının kaygılı öğrencisi için doğru duygusal ton mu?
