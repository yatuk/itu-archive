// Kalan zorunlu dersler için önşart zincirini bozmayan, çok dönemlik dengeli
// bir plan üretir (Ders Planım → "Dengeli plan oluştur"). Saf modül: DOM,
// localStorage ve ağ erişimi yoktur — veri (kalan dersler, önşart kenarları,
// zorluk sinyali) çağıran taraftan (views/dersplanim.js) beslenir.
//
// Kapsam: yalnızca ZORUNLU dersler (spec: "kalan zorunlu derslerin ön koşul
// zinciri"). Seçmeli slotlar sabit bir kod taşımadığı için (havuzdan hangi
// dersin seçileceği öğrenciye kalır) bu planlayıcının dışındadır.

import { canonicalCode } from './plan.js?v=f55dd720fb58';

export const DEFAULT_MIN_CREDITS = 10;
export const DEFAULT_MAX_CREDITS = 14;
export const DEFAULT_HARD_CAP_CREDITS = 18;
// FF+VF oranı bu eşiğin üstündeyse ders "zor" sayılır; aynı dönemde iki zor
// ders yan yana konmaz (kural 3). Sabit bir eşik keyfi görünebilir ama
// operasyonel bir sınır gerekiyor — arşivdeki dağılımda %15 üstü FF+VF
// gözle görülür şekilde ortalamanın üstünde bir kalma oranına karşılık gelir.
export const HARD_FAIL_RATE = 0.15;

// remaining: [{ code, name, credits }], edges: [{ from, to }] (from dersi
// to'nun önşartı). Döner: Map<code, 0-index dönem>. Devirli önşart (veri
// hatası) tespit edilirse o kod 0'a sabitlenir ve `cyclic` listesine eklenir
// — sonsuz döngüye girmeden en azından bir sonuç üretilir.
function computeEarliestTerms(remaining, edges) {
  const codes = new Set(remaining.map((r) => r.code));
  const prereqsOf = new Map(remaining.map((r) => [r.code, []]));
  for (const e of edges || []) {
    const from = canonicalCode(e.from), to = canonicalCode(e.to);
    if (from && to && from !== to && codes.has(to) && codes.has(from)) {
      prereqsOf.get(to).push(from);
    }
  }
  const earliest = new Map();
  const visiting = new Set();
  const cyclic = new Set();
  function resolve(code) {
    if (earliest.has(code)) return earliest.get(code);
    if (visiting.has(code)) { cyclic.add(code); earliest.set(code, 0); return 0; }
    visiting.add(code);
    const prereqs = prereqsOf.get(code) || [];
    const term = prereqs.length ? 1 + Math.max(...prereqs.map(resolve)) : 0;
    visiting.delete(code);
    earliest.set(code, term);
    return term;
  }
  for (const r of remaining) resolve(r.code);
  return { earliest, cyclic };
}

function buildReason({ minTerm, placed, isRepeat, hard }) {
  const parts = [];
  if (isRepeat) parts.push('tekrar dersi — erken ve hafif bir döneme planlandı');
  if (hard) parts.push('geçmişte kalma oranı yüksek — bu dönemde tek zor ders olarak tutuldu');
  if (placed > minTerm) {
    parts.push(minTerm > 0
      ? `önşart(lar) ${minTerm}. dönem sonunda biter, kredi dengesi için ${placed + 1}. döneme kaydırıldı`
      : `kredi dengesi için ${placed + 1}. döneme kaydırıldı`);
  } else if (minTerm > 0) {
    parts.push(`önşart(lar) ${minTerm}. dönem sonunda tamamlanmış olmalı`);
  }
  return parts.length ? parts.join(' · ') : 'önşart uygun, kredi dengesinde yer var';
}

/**
 * @param {object} opts
 * @param {{code:string, name?:string, credits?:number}[]} opts.remaining kalan zorunlu dersler
 * @param {Set<string>} [opts.failedCodes] daha önce FF/VF alınmış (tekrar) kodlar
 * @param {{from:string, to:string}[]} [opts.edges] önşart kenarları (from, to'nun önşartı)
 * @param {Map<string, {failRate:number}>} [opts.difficulty] kod → geçmiş FF+VF oranı
 * @param {number} [opts.minCredits]
 * @param {number} [opts.maxCredits]
 * @param {number} [opts.hardCapCredits]
 * @returns {{ terms: {index:number, totalCredits:number, courses:object[]}[], cyclic: string[] }}
 */
export function buildBalancedPlan({
  remaining,
  failedCodes = new Set(),
  edges = [],
  difficulty = new Map(),
  minCredits = DEFAULT_MIN_CREDITS,
  maxCredits = DEFAULT_MAX_CREDITS,
  hardCapCredits = DEFAULT_HARD_CAP_CREDITS,
} = {}) {
  const list = (remaining || [])
    .filter((r) => r?.code)
    .map((r) => ({ ...r, code: canonicalCode(r.code) }));
  if (!list.length) return { terms: [], cyclic: [] };

  const { earliest, cyclic } = computeEarliestTerms(list, edges);
  const creditsOf = new Map(list.map((r) => [r.code, Number(r.credits) || 0]));
  // 0 kredili dersler (ATA/TUR gibi idari zorunlu dersler) GANO'ya/iş yüküne
  // girmez; yüksek VF oranları genelde zorluktan değil ders çakışması gibi
  // idari sebeplerden gelir. "Zor ders" sınıflaması yalnızca gerçek kredi
  // taşıyan dersler için anlamlı — aksi halde bu dersler tek başına dönem
  // harcardı (yaşanmış hata).
  const isHard = (code) => (creditsOf.get(code) || 0) > 0 && (difficulty.get(code)?.failRate ?? 0) >= HARD_FAIL_RATE;

  // İşlem sırası: önce en erken uygun dönem (önşart zinciri), eşitlikte
  // tekrar dersleri (kural 2 — olabildiğince erken alınsın), sonra zor
  // dersler (yerleşimi kısıtlı olduğu için önce onlara yer ayrılır).
  const order = [...list].sort((a, b) => {
    const ea = earliest.get(a.code) ?? 0, eb = earliest.get(b.code) ?? 0;
    if (ea !== eb) return ea - eb;
    const fa = failedCodes.has(a.code) ? 1 : 0, fb = failedCodes.has(b.code) ? 1 : 0;
    if (fa !== fb) return fb - fa;
    const ha = isHard(a.code) ? 1 : 0, hb = isHard(b.code) ? 1 : 0;
    return hb - ha;
  });

  const terms = []; // { credits, hasHard, hasFailedCourse, courses: [] }
  const ensureTerm = (i) => {
    while (terms.length <= i) terms.push({ credits: 0, hasHard: false, hasFailedCourse: false, courses: [] });
    return terms[i];
  };

  for (const course of order) {
    const minTerm = earliest.get(course.code) ?? 0;
    const credits = Number(course.credits) || 0;
    const hard = isHard(course.code);
    const isRepeat = failedCodes.has(course.code);
    const upperBound = minTerm + list.length; // sonsuz döngüye karşı güvenli üst sınır

    let placed = -1;
    // 1. geçiş: tüm yumuşak kısıtları sağlayan ilk dönemi ara. Bir tekrar
    // dersi bir dönemde YERLEŞTİKTEN SONRA da o dönem hafif kalmalı — bu
    // yüzden kontrol yalnızca yerleştirilen dersin kendisi değil, dönemin
    // `hasFailedCourse` işareti üzerinden yapılır (aksi halde tekrar dersi
    // boş bir döneme düşer, sonra başka derslerle dolup ağırlaşabilirdi).
    for (let t = minTerm; t < upperBound && placed === -1; t++) {
      const term = ensureTerm(t);
      const after = term.credits + credits;
      if (after > maxCredits) continue;
      if (hard && term.hasHard) continue;
      if ((isRepeat || term.hasFailedCourse) && after > minCredits) continue;
      placed = t;
    }
    // 2. geçiş: kredi tavanını sert tavana kadar gevşet, zor ders kısıtı kalır.
    if (placed === -1) {
      for (let t = minTerm; t < upperBound && placed === -1; t++) {
        const term = ensureTerm(t);
        if (term.credits + credits > hardCapCredits) continue;
        if (hard && term.hasHard) continue;
        placed = t;
      }
    }
    // 3. geçiş: yalnızca önşart sırası korunur, ilk uyan dönem kullanılır.
    if (placed === -1) {
      let t = minTerm;
      while (ensureTerm(t).credits + credits > hardCapCredits) t++;
      placed = t;
    }

    const term = ensureTerm(placed);
    term.credits += credits;
    if (hard) term.hasHard = true;
    if (isRepeat) term.hasFailedCourse = true;
    term.courses.push({ ...course, reason: buildReason({ minTerm, placed, isRepeat, hard }) });
  }

  return {
    terms: terms
      .map((t, i) => ({ index: i, totalCredits: t.credits, courses: t.courses }))
      .filter((t) => t.courses.length),
    cyclic: [...cyclic],
  };
}
