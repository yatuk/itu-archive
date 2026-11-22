// Uygulama kabuğu (/) her sorgu biçimiyle aynı HTML'i sunar ve statik
// canonical'ı "/"dir. Derin bağlantı bir ders koduna (?code=MIM 346) ya da
// branşa (?branch=CAB) işaret ediyorsa, aynı içeriğin taranabilir statik
// sayfası vardır (/ders/mim-346/, /brans/CAB/). Arama motoru bu URL'yi
// işlediğinde canonical o sayfayı göstersin diye, açılışta link[rel=canonical]
// statik sayfaya çevrilir; sayfa gerçekten varsa (HEAD 200) yapılır.

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

// syncStaticCanonical, gerekirse canonical'ı statik sayfaya çevirir. hreflang
// alternatifleri "/" içindir; canonical başka sayfaya geçince kaldırılır.
export function syncStaticCanonical(doc = document, loc = location) {
  const path = staticPageFor(loc.search);
  const link = doc.querySelector('link[rel="canonical"]');
  if (!path || !link || loc.protocol === 'file:') return Promise.resolve(false);
  return fetch(path, { method: 'HEAD' })
    .then((r) => {
      if (!r.ok || r.redirected) return false;
      link.href = new URL(path, link.href).href;
      for (const alt of doc.querySelectorAll('link[rel="alternate"][hreflang]')) alt.remove();
      return true;
    })
    .catch(() => false);
}
