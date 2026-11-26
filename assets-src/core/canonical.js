// Uygulama kabuğu (/) her sorgu biçimiyle aynı HTML'i sunar ve statik
// canonical'ı "/"dir. Derin bağlantı bir ders koduna (?code=MIM 346) ya da
// branşa (?branch=CAB) işaret ediyorsa, aynı içeriğin taranabilir statik
// sayfası vardır (/ders/mim-346/, /brans/CAB/). Arama motoru bu URL'yi
// işlediğinde canonical o sayfayı göstersin diye, açılışta link[rel=canonical]
// statik sayfaya çevrilir; sayfa gerçekten varsa (HEAD 200) yapılır.
//
// Statik karşılığı olmayan uygulama sorgusu (?term=…, ?q=…, sayfası olmayan
// bir ?code=…) ise dizine girmemeli: Search Console'da "Tarandı - şu anda
// dizine eklenmiş değil" gürültüsü üretir. Bu durumda robots meta'sı
// "noindex, follow" olur. İkisi asla birlikte verilmez (canonical + noindex
// çelişkili sinyaldir). robots.txt ile engellenmez: engellenen URL'nin
// canonical'ı da görülmez.

// courseSlug, internal/site courseSlug ile aynıdır: küçük harf, harf/rakam
// dışı her dizi tek tireye iner, baştaki/sondaki tire atılır.
export function courseSlug(code) {
  return String(code || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// staticPageFor, kabuk sorgusunun karşılık geldiği statik sayfa yolunu döner
// ("" yoksa). Ders kodu branştan önce gelir (daha dar içerik).
export function staticPageFor(search) {
  const p = new URLSearchParams(search || '');
  const code = (p.get('code') || '').trim();
  if (/^[A-Za-z]{2,4}\s*\d{3,4}[A-Za-z]?$/.test(code)) {
    return `/ders/${courseSlug(code.replace(/^([A-Za-z]+)\s*/, '$1 '))}/`;
  }
  const branch = (p.get('branch') || '').trim();
  if (/^[A-Za-z]{2,4}$/.test(branch)) return `/brans/${branch.toUpperCase()}/`;
  return '';
}

// Sayfa içeriğini değiştirmeyen parametreler: dil seçimi ve kampanya/izleme
// ekleri. Yalnızca bunları taşıyan URL'nin canonical'ı "/" kalır, noindex
// almaz (ör. dil düğmesinin /?lang=en bağlantısı).
const NEUTRAL_PARAMS = new Set(['lang', 'gclid', 'fbclid', 'msclkid', 'ref']);

// hasAppQuery, sorgu uygulama durumu taşıyorsa (code, branch, term, q, …)
// true döner.
export function hasAppQuery(search) {
  for (const key of new URLSearchParams(search || '').keys()) {
    const k = key.toLowerCase();
    if (!NEUTRAL_PARAMS.has(k) && !k.startsWith('utm_')) return true;
  }
  return false;
}

function dropAlternates(doc) {
  for (const alt of doc.querySelectorAll('link[rel="alternate"][hreflang]')) alt.remove();
}

// markNoindex, robots meta'sını "noindex, follow" yapar (yoksa ekler). Kabuğun
// hreflang alternatifleri "/" içindir, bu URL için değil; kaldırılır.
export function markNoindex(doc = document) {
  let meta = doc.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = doc.createElement('meta');
    meta.setAttribute('name', 'robots');
    doc.head.appendChild(meta);
  }
  meta.setAttribute('content', 'noindex, follow');
  dropAlternates(doc);
}

// syncStaticCanonical, statik karşılık varsa (HEAD 200) canonical'ı ona
// çevirir ve 'canonical' döner; yoksa ve URL uygulama sorgusu taşıyorsa
// noindex verir ve 'noindex' döner; aksi halde hiçbir şeyi değiştirmez ('').
// Ağ hatası "karşılık yok" sayılmaz: geçici bir hata yüzünden var olan bir
// sayfanın derin bağlantısı noindex almasın diye sayfa olduğu gibi kalır.
export function syncStaticCanonical(doc = document, loc = location, fetchFn = globalThis.fetch) {
  if (loc.protocol === 'file:' || !hasAppQuery(loc.search)) return Promise.resolve('');
  const noindex = () => { markNoindex(doc); return 'noindex'; };
  const path = staticPageFor(loc.search);
  if (!path) return Promise.resolve(noindex());
  const link = doc.querySelector('link[rel="canonical"]');
  if (!link || typeof fetchFn !== 'function') return Promise.resolve('');
  return Promise.resolve()
    .then(() => fetchFn(path, { method: 'HEAD' }))
    .then((r) => {
      if (r.status !== 200 || r.redirected) return noindex();
      link.href = new URL(path, link.href).href;
      dropAlternates(doc);
      return 'canonical';
    }, () => '');
}
