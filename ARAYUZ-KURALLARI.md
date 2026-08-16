# Arayüz kuralları

Her UI değişikliğinde bu liste denetlenir. Kaynak: Vercel Web Interface
Guidelines, bu projenin kısıtlarına uyarlanmış hâli. Estetik bir liste değil;
**disiplin** listesidir — DESIGN.md'nin teşhisi şudur: *"sitenin sorunu
cansızlık değil, disiplinsizlik."*

Tasarım kimliği kararları [DESIGN.md](DESIGN.md), ürün kısıtları
[PRODUCT.md](PRODUCT.md) içindedir. Burada yalnızca **ölçülebilir** kurallar var.

## Bu projeye özel, pazarlıksız kısıtlar

Bunlar genel kılavuzların üstündedir; çelişirse bunlar kazanır.

- **Fosfor donmuştur.** Koyu terminal teması piksel düzeyinde değişmez.
  Görsel değişiklik yalnızca *sade* yüzeyine ve iki temanın paylaştığı
  sınıflara dokunur.
- **Kırmızı ayrılmıştır.** Yalnızca ders çakışması ve %100 dolu kontenjan.
  Uyarı/tehlike için amber kullanılır.
- **Sade'de neon taklidi yok.** Asit yeşili sade'de koyu, fosfor'da neondur.
- **Gövde metnine monospace bulaşmaz** (sade). Monospace yalnızca veri
  sınıflarında: `.crn .code .when .num .fill .tt-time code pre`.
- **Ton:** Türkçe, sakin, kurumsal değil. Şaka yok, pazarlama dili yok.
- **Kullanıcıya görünen metinde em-dash (—) yok**, orta nokta (·) kullanılır.
  Kod yorumlarında serbesttir.

## Otomatik denetlenenler

Bunları CI koşuyor — elle kontrol gerekmez.

| Kural | Nerede |
|---|---|
| Sayfa gövdesi yatay kaymaz; geniş içerik kendi kabında kayar | `test/e2e/smoke.spec.js` |
| SEO sayfasında tek `<h1>` (içerik başlığı) | `test/e2e/smoke.spec.js` |
| Nav bağlantıları hap stilini alır (`.tabs a`) | `test/e2e/smoke.spec.js` |
| İki tema uygulanır, `theme-color` zeminle eşleşir | `test/e2e/smoke.spec.js` |
| "İçeriğe atla" ilk odak durağıdır | `test/e2e/smoke.spec.js` |
| Konsol hatası yok (bilinen quota 404'ü hariç) | `test/e2e/smoke.spec.js` |
| Ders tablosu gerçekten satır basar | `test/e2e/smoke.spec.js` |
| Veri şeması ve dosya bütünlüğü | `cmd/validate` |

## Elle denetlenenler

### Etkileşim

- Klavye desteği tam; odak göstergesi `:focus-visible` ile **görünür**.
  Outline kaldırılıyorsa yerine bir gösterge konur.
- Dokunma hedefi ≥ 24px, mobilde ≥ 44px.
- Mobilde `input/select/textarea` yazı boyu ≥ 16px (iOS otomatik yakınlaştırmayı
  engeller). Zoom kısıtlanmaz (`user-scalable` yasak).
- Filtre, sekme, sayfalama ve panel durumu **URL'ye yansır** — kayıt haftasında
  öğrenci linki paylaşabilmeli.
- Gezinme `<a>` ile yapılır; `<div onClick>` değil.
- Modal ve çekmecelerde `overscroll-behavior: contain`.
- Yıkıcı işlem onay ister veya geri alma penceresi sunar.

### Form

- Yapıştırma engellenmez. Metin önce kabul edilir, sonra doğrulanır.
- Hata mesajı hatalı alanın yanında; gönderimde ilk hataya odaklanılır.
- `autocomplete` anlamlı; e-posta/kod/kullanıcı adı alanlarında `spellcheck`
  kapalı.
- Onay kutusu ve radyonun tıklama alanı etiketini de kapsar.

### Hareket

- `prefers-reduced-motion` her zaman karşılanır (scanlines, tanecik, nabız,
  imleç yanıp sönmesi dahil).
- Yalnızca `transform` ve `opacity` animasyonlanır; düzen özellikleri değil.
- `transition: all` yasak — özellikler tek tek yazılır.

### İçerik ve erişilebilirlik

- Hedef **WCAG 2.1 AA**. Bu bir iddia değil, ölçülen bir eşiktir.
- Sayısal karşılaştırmada `font-variant-numeric: tabular-nums`.
- Durum yalnızca renkle anlatılmaz; ikinci bir gösterge bulunur.
- İkon-yalnız butonların erişilebilir adı vardır; dekoratif öğeler
  `aria-hidden="true"`.
- Marka adı ve ders/CRN kodlarında `translate="no"` — otomatik çeviri
  `BLG 102E`'yi bozmamalı.
- Boş, seyrek, yoğun ve hata durumlarının hepsi tasarlanır.
- **Dürüst veri etiketleri:** "en son X önce ölçüldü", "geçen sefer X sonra
  doldu". Boş durum nedenini söyler.
- Üç nokta yerine `…` karakteri.

### Başarım

- 50'den uzun listeler sanallaştırılır.
- Görsellerde açık boyut verilir (CLS önlenir).
- Kritik fontlar `font-display: swap` ile önyüklenir.
- DOM okumaları yazmalardan önce toplanır.

## Bilinen açıklar

Bilerek bırakılmış, kapatılacak maddeler:

- `translate="no"` yalnızca marka başlığında; tablo içindeki ders/CRN
  kodlarına henüz uygulanmadı.
- Erişilebilirlik denetimi (axe) henüz CI'da değil — WCAG AA hâlâ ölçülmüş
  değil, hedeflenmiş durumda.
- Form köşe yarıçapları tek ailede değil (select 2px / program select 6px /
  sade arama 8px).
