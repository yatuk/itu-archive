// URL durum yönetimi için kısa, kararlı kodlar (URL temizliği). OBS etiketi
// değişse de paylaşılan bağlantılar bozulmasın; eşleme tek yerde, iki yönlü.

const METHOD_CODES = {
  'Fiziksel (Yüz yüze)': 'f',
  'Sanal (Çevrimiçi/Online)': 'c',
  'Hibrit': 'h',
};
const CODE_METHODS = Object.fromEntries(Object.entries(METHOD_CODES).map(([k, v]) => [v, k]));

export function methodToCode(method) { return METHOD_CODES[method] || ''; }
export function codeToMethod(code) { return CODE_METHODS[code] || ''; }

// Ders kodu ↔ slug: "EHB 222E" ↔ "EHB-222E" (URL'de boşluk yerine tire).
export function codeToSlug(code) { return String(code || '').trim().replace(/\s+/g, '-'); }
export function slugToCode(slug) { return String(slug || '').replace(/-/g, ' '); }

// Görünüm başına sahip olunan parametreler; term tüm sekmelerde globaldir.
export const VIEW_PARAMS = {
  dersler: ['q', 'branch', 'day', 'time', 'level', 'method', 'program', 'code', 'open', 'taken'],
  onsart: ['prog', 'pool'],
  dersplanim: ['prog', 'fopen', 'fcap', 'fhide', 'fsems', 'ftypes'],
  takvim: ['year', 'caltype'],
  gecmis: ['hq'],
  sinavlar: ['eq', 'extype', 'building'],
  program: ['sched'],
  donemler: [],
  hakkinda: [],
};

// Parametreleri görünüme göre kapsar: yalnızca o görünümün + term kalır.
// URL temizliği: sekme değişiminde hedef görünüme ait olmayanlar düşer.
export function scopeParams(view, params) {
  const allowed = new Set([...(VIEW_PARAMS[view] || []), 'term']);
  const out = new URLSearchParams();
  for (const [k, v] of params) {
    if (allowed.has(k)) out.set(k, v);
  }
  return out;
}
