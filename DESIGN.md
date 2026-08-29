---
name: İTÜ Ders Arşivi
description: OBS'nin yayınlamadığı İTÜ ders verisini kalıcılaştıran açık veri arşivi — iki temalı (sade / fosfor), terminal-arşiv kimliği.
colors:
  # tema token'ları (sade / fosfor)
  sade-bg: "#f4f6f4"
  sade-panel: "#ffffff"
  sade-panel2: "#eef1ee"
  sade-fg: "#1e2b23"
  sade-dim: "#45564c"
  sade-dimmer: "#5a6b61"
  sade-acid: "#805f1a"
  sade-acid-vivid: "#c9a227"
  sade-on-accent: "#241c04"
  sade-cyan: "#1f3f6b"
  sade-amber: "#8a5f00"
  sade-red: "#c2303a"
  sade-line: "#cdd7cf"
  sade-line-hot: "#73877b"
  fosfor-bg: "#050806"
  fosfor-panel: "#0a100c"
  fosfor-panel2: "#0d1611"
  fosfor-fg: "#c8f7dd"
  fosfor-dim: "#6da086"
  fosfor-dimmer: "#5b8f78"
  fosfor-acid: "#c9a227"
  fosfor-acid-vivid: "#c9a227"
  fosfor-cyan: "#6f9fd8"
  fosfor-amber: "#ffc857"
  fosfor-red: "#ff4f6d"
  fosfor-line: "#16281d"
  fosfor-line-hot: "#3f351a"
  # zemin/efekt varyantları (rgba örtücülerin RGB'si — alfa ayrı katman)
  # altın vurguyla uyumlu sıcak ton — eski asit yeşilinin soğuk tonu değil
  canvas-bg: "#050402"
  detail-bg: "#0c0a05"
  glow-bg: "#1c1608"
  now-bg-dark: "#241c08"
  row-hover-dark: "#14120a"
  tt-onboard-bg: "#2a2008"
  tt-bg: "#1a1a1a"
  tt-line-sade: "#c2cec5"
  chart-gold: "#c9a227"
  chart-axis: "#a09687"
  now-bg-light: "#f5ecd2"
  row-hover-light: "#f2efe6"
  detail-bg-light: "#f9f7f1"
  canvas-bg-light: "#fcfbf7"
  data-ink: "#1e2b23"
  data-white: "#ffffff"
  black: "#000000"
  red-soft: "#ff2828"
typography:
  scale:
    micro: "9px"
    tiny: "10px"
    small: "11px"
    label: "12px"
    meta: "13px"
    body: "14px"
    accent: "15px"
    base: "16px"
    card-title: "17px"
    metric: "18px"
    display: "clamp(22px, 4.2vw, 38px)"
  display:
    fontFamily: "Space Grotesk, ui-monospace, monospace"
    fontSize: "clamp(22px, 4.2vw, 38px)"
    fontWeight: 700
    letterSpacing: "0.04em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    lineHeight: "1.55"
  data:
    fontFamily: "ui-monospace, JetBrains Mono, SF Mono, Cascadia Mono, Menlo, Consolas, monospace"
rounded:
  hairline: "1px"
  sm: "2px"
  focus: "3px"
  xs: "4px"
  md: "6px"
  field: "8px"
  card: "14px"
  panel: "16px"
  lg: "22px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
components:
  brand-title:
    textColor: "{colors.fosfor-acid}"
    fontFamily: "{typography.display.fontFamily}"
  data-cell:
    fontFamily: "{typography.data.fontFamily}"
  quota-bar:
    height: "6px"
    width: "46px"
---

# İTÜ Ders Arşivi — Tasarım Sistemi

## Overview

İTÜ Ders Arşivi, OBS'nin yayınlamayı bıraktığı ders verisini kalıcılaştıran bir **açık veri arşivi**dir. Kimlik, veriyi "arşiv" metaforuyla taşıyan bir **terminal-arşiv dili**dir: monospace veri hücreleri, `>` istem ön eki, `//` başlıklar, "DERS ARŞİVİ" masthead. Bu kimlik iki temaya bölünür:

- **fosfor** (koyu, `data-theme` yok / `dark`): sitenin **başlangıç kimliği** — siyaha yakın zemin, scanlines/tanecik/neon dekorasyonları.
- **sade** (açık, varsayılan `[data-theme="sade"]`): genel kitleye yüz; terminal dekorasyonlarını kapatır ama **veri monospace kalır**.

**2026-08 güncellemesi:** vurgu rengi İTÜ'nün kurumsal kimliğine (Pantone 872 altın, Pantone 295 lacivert) taşındı; her iki tema da aynı altını paylaşıyor. "Fosfor piksel düzeyinde donmuştur" kuralı bu değişiklikle **kaldırıldı** — bundan sonraki görsel değişiklikler yine sade + paylaşılan sınıflarla sınırlı tutulur (fosforun kendine özgü dekorasyonları — scanlines, tanecik, neon gölge — hâlâ yalnızca kasıtlı bir kararla değişir), ama vurgu rengi artık iki temada da ortak ve dondurulmuş değil.

## Colors

Token adları tek kaynaktır (`assets-src/style.css` — `docs/assets/style.css` küçültülmüş üretilen çıktıdır, elle düzenlenmez); iki tema aynı adları farklı değerlerle ezdirir.

| Token | sade (açık) | fosfor (koyu) |
|---|---|---|
| `--bg` | `#f4f6f4` | `#050806` |
| `--panel` | `#ffffff` | `#0a100c` |
| `--panel-2` | `#eef1ee` | `#0d1611` |
| `--line` | `#cdd7cf` (dekoratif, ~1.5:1) | `#16281d` |
| `--line-hot` | `#73877b` (form kenarlığı ≥3:1) | `#3f351a` |
| `--fg` | `#1e2b23` (14.7:1) | `#c8f7dd` |
| `--dim` | `#45564c` (ikincil ~7:1) | `#6da086` |
| `--dimmer` | `#5a6b61` (etiket ~5:1) | `#5b8f78` |
| `--acid` | `#805f1a` (metin/kenarlık ≥5.4:1) | `#c9a227` (8.3:1) |
| `--acid-vivid` | `#c9a227` (yalnızca dolgu, ≥6:1 için `--on-accent` ile) | `#c9a227` (metinle de güvenli) |
| `--on-accent` | `#241c04` (`--acid-vivid` dolgusu üstü metin) | `--bg` (zaten koyu) |
| `--cyan` | `#1f3f6b` (bağlantı/odak, 10.6:1) | `#6f9fd8` (7.3:1) |
| `--amber` | `#8a5f00` (uyarı) | `#ffc857` |
| `--red` | `#c2303a` | `#ff4f6d` |

Renk kuralları:

- **Kırmızı yalnızca ders çakışması ve %100 dolu kontenjan içindir.** Başka hiçbir yerde kullanılmaz (hata metni hariç).
- **`--acid` İTÜ'nün kurumsal altını (Pantone 872), her iki temada aynı köke sahip** — sade'de metin/kenarlık için koyulaştırılmış (`#805f1a`, ham `#c9a227` beyaz zeminde 2.2:1 vererek AA'yı geçemiyor), fosforda ham tonun kendisi zaten güvenli. Ham/parlak ton (`--acid-vivid`) yalnızca koyu metinli büyük dolgularda (rozet, aktif sekme, buton) kullanılır — o dolgunun üstündeki metin `--on-accent` olur, `--bg` değil.
- `--cyan` artık İTÜ lacivertidir (Pantone 295) — bağlantı/odak rolünü sürdürüyor, yalnızca rengi değişti.
- `--amber` "dolu/kritik" ve nötr uyarılar.
- Hafta sonu, bayat veri gibi "ikincil" durumlar amber veya soluk zeminle; kırmızı değil.

## Typography

- **Gövde:** sade = `--sans` (sistem-ui); fosfor = `--mono` (donmuş kimlik kararı — dokunulmaz).
- **Veri (sade):** yalnızca veri sınıfları monospace — `.crn, .code, .when, .num, .d-crn, .fill, .p-crnlist, .tt-time, code, pre`. Rakam hizalaması (`tabular-nums` sayısal kolonlarda) gerçekten işe yarar; gövde metnine monospace bulaşmaz.
- **Display:** Space Grotesk (600/700, latin-ext) yalnızca marka/başlık. `clamp(22px,4.2vw,38px)` masthead.
- **Etiketler:** `.eyebrow` / başlık hapı `11px, 600, .18em uppercase` (sade'de 12px, .05em). Tablo başlığı `11-12px, uppercase, .14em` (sade'de .05em).
- **Ses tonu:** küçük, sakin, kurumsal değil. Harf aralığı geniş etiketlerde dikkat — kısa metin için, okunurluğu bozacak kadar değil.

## Layout

- İçerik genişliği `--w: 1180px`; Program/Ders Planım `main.wrap.wide` (1500px).
- Sayfa ritmi: `.wrap` (20px) + `main` (20px) yatay kenar boşlukları.
- Konsollar: `.console` `padding:16px; grid; gap:14px`; filtreler `gap:18px`.
- Izgara: Dersler tablosu `min-width:900px` (yatay kaydırma), Program ızgarası `min-width:720px`, 56px saat sütunu + gün kolonları.
- Mobil (≤860px): Program/Ders Planım tek sütuna iner; sabitlenmiş başlık/saat sütunu kritiktir.
- Boşluk tutarlılığı hedefi: form köşe yarıçapları ve buton yükseklikleri aynı ailede aynı olmalı (şu an select 2px / program select 6px / sade arama 8px — iyileştirme yüzeyi).

## Elevation & Depth

- Sade: düz yüzeyler, ince kenarlıklar (`--line`), minimal gölge (`--shadow-soft`/`--shadow-card` mevcut ama ölçülü).
- Fosfor: neon `text-shadow` yalnızca masthead'de; scanlines/tanecik katmanları kimlik — donmuş.
- Hover: hafif `brightness`/`scale` (`.tt-block`), satır vurgusu; abartılı gölge yok.

## Shapes

- Kart `--radius-card: 14px`, `--radius-lg: 22px`.
- Form kenarlıkları: sade arama kutusu 8px, program select 6px, genel `select` 2px — **iyileştirilecek tutarsızlık** (tek aile: 2-8px arası tek değere).
- Bloklar 6px; çipler pill.

## Components

- **Sade ana sayfa hiyerarşisi:** üst bölüm yalnızca marka, tek cümle açıklama ve tema/dil araçlarını taşır. Dört hücreli durum kartı ve tanıtım bandı sade temada gösterilmez; veri tazeliği sonuç satırında bağlama yakın verilir. Fosfor temanın durum şeridi korunur.
- **Ana gezinme:** sade temada altı sık kullanılan görünüm doğrudan görünür (`Dersler`, `Ders Planım`, `Önşart Haritası`, `Sınavlar`, `Akademik Takvim`, `Program`); `Geçmiş`, `Dönemler` ve `Hakkında`, `Daha fazla` altında toplanır. Mobil açılım akış içinde ikinci satıra dönüşür ve içeriğin üzerine binmez.
- **Ders filtreleri:** arama, dönem, bölüm, gün, saat ve yalnızca kontenjanı olanlar birincildir. Seviye, yöntem, program ve ders kodu `Diğer filtreler` disclosure'ındadır. CSV, zaman çizelgesi ve mobil sıralama filtre kutusundan ayrılıp sonuç araçlarına taşınır.
- **Ders Planım hiyerarşisi:** fakülte, program ve dönem tek seçim yüzeyidir. Açık ders/kontenjan birincil; yarıyıl ve tür ikincil disclosure filtresidir. Program toplamı tek özet bandında, GANO/ilerleme ile veri taşıma ve gizlilik araçları kapatılabilir tek panelde yer alır. Yarıyıllar daraltılabilir; sade temada dersler iç içe kartlar yerine ayraçlı satırlardır.
- **Kaldırılan yüzey:** bağımsız “Aldığım dersler” düğmesi, modalı ve ders listesindeki filtresi yoktur. Ders Planım'a girilen notların önşart hesaplarına katkısı iç mantık olarak sürer.

- **Kontenjan gösterimi:** sade temada aynı nicelik tek sayısal temsille verilir: normalde `34 / 50`, kritik durumda `47 / 50 · 3 yer`, tam doluda `50 / 50 · dolu`. Yüzde ve çubuk liste/detay yüzeylerinde gösterilmez; yüzde yalnızca sıralama ve durum hesabında kalır. Fosfor temanın `%NN` + ince 46×6 terminal çubuğu piksel düzeyinde korunur. Dönem trend grafiği değişimi zaman içinde anlattığı için bu sadeleştirme kuralının dışındadır.
- **Ders tablosu:** sade temada 8 görünür kolon (sel, fav, CRN, kod, ad, hoca, zaman, kontenjan); fosforda donmuş 10 kolon korunur. Satır tıklanınca detay; sort butonları; arama eşleşmesi `<mark>`.
- **Detay modalı:** `.detail-panel` (fixed, karartma) > `.detail-box` (max 680px) — 6 yüzeyden tek giriş; d-head / meta pill'leri / şube kartları / önşart ağacı / not dağılımı / katalog / geçmiş.
- **Tabs (Fluid Island):** yapışkan cam hap, 9 sekme; sade'de numarasız düz adlar.
- **Filtre çipleri:** aktif filtreleri `✕` ile; arama + gelişmiş filtreler disclosure'ı.
- **Butonlar:** `btn-primary` (cyan zemin) tekincil, `btn-ghost` ikincil, `p-danger` yıkıcı (red — yalnızca silme).
- **Saat ızgarası:** `.tt-*` — yatay saat çizgileri (gradient), sticky başlık/saat sütunu, çakışma kırmızı kenarlık, blok içinde kod+CRN.

## Do's and Don'ts

**Do**
- Veriyi öne koy: ham JSON/CSV indirilebilir kalır; arayüz bir mercektir.
- Veri için monospace; gövde için sans (sade).
- Kırmızıyı yalnızca çakışma ve %100 doluya sakla; çakışma yoksa amber.
- Dürüst veri etiketleri: "en son X önce ölçüldü", "geçen sefer X sonra doldu", boş durumlar neden söyler.
- Fosforun kendi dekorasyonlarına (scanlines, tanecik, neon gölge, mono gövde) dokunma; vurgu rengi artık ortak olsa da bu kimlik unsurları kasıtlı bir kararla değişir.

**Don't**
- **Anti-referanslar:** krem zemin + yüksek kontrastlı serif + terrakota üçlüsü; gazete/broadsheet taklidi (saç teli çizgi, sıfır köşe yarıçapı, sıkışık kolon); SaaS dashboard şablonu (büyük sayı + küçük etiket + gradyan aksan kartları); her şeyi karta sarmak (kart içinde kart); Inter ve sistem varsayılanlarını kimlik olarak dayatmak.
- Sade'de fosfor neon'u (asit glow) taklit etme.
- Kırmızıyı uyarı/tehlike için kullanma — o çakışmanın rengi.
- Gövde metnine monospace bulaştırma (sade).
- `/impeccable bolder` / `delight`: sitenin sorunu cansızlık değil, disiplinsizlik.
