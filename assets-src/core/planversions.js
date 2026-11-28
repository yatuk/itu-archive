// Müfredat plan sürümleri: OBS bir programın birden çok plan sürümünü listeler
// ("2021-2022 / Güz ile 2026-2027/ Güz Dönemleri Arası", "… Dönemi Sonrası").
// Öğrenci kaydolduğu dönemde geçerli sürüme tabidir. Bu modül saf: sürüm
// listesi data/curriculum/<PROG>.json içindeki `versions` alanından gelir
// (cmd/curriculum), her sürümün validFrom (dahil) / validUntil (hariç) dönemi
// "2021-2022 Güz" biçimindedir; boşsa o uç açıktır.

const SEASON = { güz: 0, guz: 0, fall: 0, bahar: 1, spring: 1, yaz: 2, summer: 2 };
const TERM_RE = /(\d{4})\s*-\s*(\d{4})(?:\s*\/?\s*(güz|guz|bahar|yaz|fall|spring|summer))?/i;

// "2023-2024 / Güz", "2023-2024 Güz", "2023-2024 Fall" → sıralanabilir sayı
// (yıl*3 + Güz 0 / Bahar 1 / Yaz 2). Çözülemezse null.
export function termKey(term) {
  const m = String(term || '').match(TERM_RE);
  if (!m) return null;
  const season = SEASON[(m[3] || 'güz').toLocaleLowerCase('tr-TR')] ?? 0;
  return Number(m[1]) * 3 + season;
}

// Transkript kayıtlarındaki en erken dönem (ör. "2023-2024 / Güz"); yoksa ''.
export function firstTranscriptTerm(records) {
  let best = '';
  let bestKey = Infinity;
  for (const r of records || []) {
    const k = termKey(r?.term);
    if (k != null && k < bestKey) { bestKey = k; best = r.term; }
  }
  return best;
}

// Plandaki sürüm listesi (en güncel önce). Eski dosyalarda alan yoksa tek
// satırlık "güncel" liste döner, böylece arayüz seçiciyi gizler.
export function planVersions(plan) {
  const list = Array.isArray(plan?.versions) ? plan.versions.filter((v) => v && Number(v.planId) > 0) : [];
  if (!list.length) {
    return plan?.planId ? [{ planId: plan.planId, label: plan.planLabel || '', validFrom: plan.validFrom || '', validUntil: plan.validUntil || '', latest: true }] : [];
  }
  return [...list].sort((a, b) => (b.latest ? 1 : 0) - (a.latest ? 1 : 0)
    || (termKey(b.validFrom) ?? -1) - (termKey(a.validFrom) ?? -1)
    || b.planId - a.planId);
}

function contains(v, key) {
  const from = termKey(v.validFrom);
  const until = termKey(v.validUntil);
  return (from == null || from <= key) && (until == null || key < until);
}

// Verilen döneme (öğrencinin ilk dönemi) göre geçerli sürüm. Birden çok sürüm
// aralığa uyuyorsa en geç başlayan (en özgül) seçilir. Dönem tüm sürümlerden
// önceyse en erken başlayan sürüm, çözülemezse null döner (çağıran güncel
// sürümde kalır).
export function pickPlanVersion(versions, term) {
  const key = termKey(term);
  const list = (versions || []).filter((v) => v && v.planId);
  if (key == null || !list.length) return null;
  const hits = list.filter((v) => contains(v, key));
  if (hits.length) {
    return hits.sort((a, b) => (termKey(b.validFrom) ?? -Infinity) - (termKey(a.validFrom) ?? -Infinity)
      || (b.latest ? 1 : 0) - (a.latest ? 1 : 0) || b.planId - a.planId)[0];
  }
  const dated = list.filter((v) => termKey(v.validFrom) != null)
    .sort((a, b) => termKey(a.validFrom) - termKey(b.validFrom));
  if (dated.length && key < termKey(dated[0].validFrom)) return dated[0];
  return null;
}

// Sürümün yükleneceği dosya: güncel sürüm <PROG>.json, eskiler arşiv dosyası.
export function versionFile(code, version) {
  if (!version || version.latest) return `data/curriculum/${code}.json`;
  return version.file || `data/curriculum/versions/${code}-${version.planId}.json`;
}

// "2021-2022 Güz" → EN "Fall 2021-2022".
export function termText(term, lang = 'tr') {
  const m = String(term || '').match(TERM_RE);
  if (!m) return String(term || '');
  const k = termKey(term) % 3;
  if (lang === 'en') return `${['Fall', 'Spring', 'Summer'][k]} ${m[1]}-${m[2]}`;
  return `${m[1]}-${m[2]} ${['Güz', 'Bahar', 'Yaz'][k]}`;
}

// Seçicideki kısa sürüm adı. t(key, vars) çeviri işlevidir.
export function versionLabel(v, t, lang = 'tr') {
  if (!v) return '';
  const from = v.validFrom ? termText(v.validFrom, lang) : '';
  const until = v.validUntil ? termText(v.validUntil, lang) : '';
  let range;
  if (from && until) range = t('planVerRange', { from, until });
  else if (from) range = t('planVerFrom', { from });
  else if (until) range = t('planVerUntil', { until });
  else range = v.label || `#${v.planId}`;
  return v.latest ? `${range} · ${t('planVerLatest', {})}` : range;
}
