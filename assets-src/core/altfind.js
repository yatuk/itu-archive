// Program (Program sekmesi) → "Alternatif Bul": mevcut programdaki her ders
// kodu için tüm açık şubeler arasından, tercih edilen gün/yoğunluk/saat
// kısıtlarını karşılayan ÇAKIŞMASIZ kombinasyonlar arar. Saf modül: DOM/ağ
// erişimi yoktur; şube listesi ve tercihler çağıran taraftan (views/program.js)
// gelir. Kampüs/bina verisi taranan şube listesinde yok (yalnız "online" /
// "yüz yüze" yöntemi var) — bu yüzden "kampüs günü" gibi bina bazlı bir
// kısıt burada YOKTUR; var olmayan veriyi uydurmaktansa kapsam dışı bırakıldı.

export const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

// "Pazartesi 08:30/12:29 | Çarşamba 13:00/16:59" -> oturum listesi (dakika).
// views/courses.js#parseWhen ile aynı biçimi ayrıştırır; core modülü views'a
// bağımlı olmasın diye küçük bir kopyası burada tutulur.
export function parseSessions(when) {
  const out = [];
  if (!when) return out;
  for (const part of String(when).split(' | ')) {
    const m = part.trim().match(/^(\S+)\s+(\d{2}:\d{2})\/(\d{2}:\d{2})$/);
    if (!m) continue;
    const start = toMin(m[2]), end = toMin(m[3]);
    if (end > start) out.push({ day: m[1], start, end });
  }
  return out;
}

function toMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function overlaps(a, b) {
  return a.day === b.day && a.start < b.end && b.start < a.end;
}

// row: [crn, code, name, branch, instructor, when, cap, enr, level, method]
// section: satırın kendisi + önceden ayrıştırılmış oturumlar.
export function toSection(row) {
  return { row, code: row[1], branch: row[3], crn: row[0], sessions: parseSessions(row[5]) };
}

// codes: program'daki ders kodları kümesi. Döner: Map<code, section[]>
// (o kod için AÇIK — en az bir oturumlu — tüm şubeler).
export function candidatesByCode(rows, codes) {
  const map = new Map();
  for (const code of codes) map.set(code, []);
  for (const row of rows) {
    if (!map.has(row[1])) continue;
    // Oturumu olmayan şube (ör. tez/seminer) hiçbir zaman çakışmaz — yine de
    // adaydır (yalnızca zamanlı şubelerle sınırlamak, zaman bilgisi hiç
    // yayınlanmamış bir dersi yanlışlıkla "değiştirilemez" saydırırdı).
    map.get(row[1]).push(toSection(row));
  }
  return map;
}

function sectionsConflict(a, b) {
  for (const sa of a.sessions) for (const sb of b.sessions) if (overlaps(sa, sb)) return true;
  return false;
}

// combo: section[]. Gün başına { start, end, sessions[] } özetler.
function dayStats(combo) {
  const byDay = new Map();
  for (const sec of combo) {
    for (const s of sec.sessions) {
      if (!WEEKDAYS.includes(s.day)) continue;
      const cur = byDay.get(s.day) || { start: Infinity, end: -Infinity, sessions: [], codes: new Set() };
      cur.start = Math.min(cur.start, s.start);
      cur.end = Math.max(cur.end, s.end);
      cur.sessions.push(s);
      cur.codes.add(sec.code);
      byDay.set(s.day, cur);
    }
  }
  for (const d of byDay.values()) d.sessions.sort((a, b) => a.start - b.start);
  return byDay;
}

// Aktif (farketmez olmayan) tercihlere göre combo'yu değerlendirir.
// Döner: { pass: bool, failed: Set<prefKey> } — failed, geçilemeyen anahtarları
// listeler (esnetme sırasında hangisinin düşürüldüğünü göstermek için).
export function evaluate(combo, prefs) {
  const byDay = dayStats(combo);
  const failed = new Set();

  if (prefs.days) {
    for (const day of WEEKDAYS) {
      const want = prefs.days[day];
      if (!want || want === 'any') continue;
      const busy = byDay.has(day);
      if ((want === 'free' && busy) || (want === 'busy' && !busy)) failed.add(`day:${day}`);
    }
  }
  if (prefs.earliest != null) {
    for (const d of byDay.values()) if (d.start < prefs.earliest) failed.add('earliest');
  }
  if (prefs.latest != null) {
    for (const d of byDay.values()) if (d.end > prefs.latest) failed.add('latest');
  }
  if (prefs.lunchFree) {
    const L1 = 12 * 60 + 30, L2 = 13 * 60 + 30;
    for (const d of byDay.values()) {
      if (d.sessions.some((s) => s.start < L2 && L1 < s.end)) { failed.add('lunchFree'); break; }
    }
  }
  if (prefs.half && prefs.half !== 'any') {
    const noon = 12 * 60 + 30;
    for (const d of byDay.values()) {
      const morning = d.sessions.some((s) => s.start < noon);
      const afternoon = d.sessions.some((s) => s.end > noon);
      if (prefs.half === 'morning' && afternoon) failed.add('half');
      if (prefs.half === 'afternoon' && morning) failed.add('half');
    }
  }
  if (prefs.gap != null) {
    for (const d of byDay.values()) {
      for (let i = 1; i < d.sessions.length; i++) {
        const gap = d.sessions[i].start - d.sessions[i - 1].end;
        if (gap > prefs.gap) failed.add('gap');
      }
    }
  }
  if (prefs.dailySpan != null) {
    for (const d of byDay.values()) if (d.end - d.start > prefs.dailySpan) failed.add('dailySpan');
  }
  if (prefs.singleCourseDaysReduce) {
    // Sert filtre değil — "tek dersli gün" varlığı skor cezası olarak
    // değerlendirilir (evaluate çağıranı score() içinde kullanır).
  }

  return { pass: failed.size === 0, failed, byDay };
}

// Yoğunluk + tek-dersli-gün cezası + "mevcut programdan az değişsin" — düşük
// skor daha iyi. currentByCode: Map<code, crn> (mevcut seçim; değişmeyen ders
// başına küçük bir bonus verir).
export function score(combo, prefs, currentByCode) {
  const { byDay } = evaluate(combo, {});
  const days = [...byDay.keys()];
  let s = 0;
  if (prefs.density === 'compact') s += days.length * 100;
  else if (prefs.density === 'spread') s -= days.length * 100;
  for (const d of byDay.values()) {
    const singleCourse = new Set(d.sessions.map((x) => x.day)).size && d.codes.size === 1;
    if (prefs.singleCourseDaysReduce && singleCourse) s += 50;
    for (let i = 1; i < d.sessions.length; i++) s += Math.max(0, d.sessions[i].start - d.sessions[i - 1].end);
  }
  if (currentByCode) {
    for (const sec of combo) if (currentByCode.get(sec.code) !== sec.crn) s += 20;
  }
  return s;
}

// prefKeys esnetme sırası: en kısıtlayıcıdan en gevşeğe (Saatler önce, sonra
// Yoğunluk/tek-dersli-gün, en son Günler) — "Kilitli tercihler korunur"
// sözü: locked kümesindeki anahtar hiç düşürülmez.
const RELAX_ORDER = [
  'earliest', 'latest', 'lunchFree', 'half', 'gap', 'dailySpan',
  'singleCourseDaysReduce', 'density',
  ...WEEKDAYS.map((d) => `day:${d}`),
];

function clonePrefs(p) { return { ...p, days: p.days ? { ...p.days } : undefined }; }

function dropKey(prefs, key) {
  const p = clonePrefs(prefs);
  if (key.startsWith('day:')) { p.days[key.slice(4)] = 'any'; return p; }
  if (key === 'singleCourseDaysReduce') { p.singleCourseDaysReduce = false; return p; }
  if (key === 'density') { p.density = 'any'; return p; }
  p[key] = key === 'lunchFree' ? false : null;
  return p;
}

// DFS: en az adaylı ders önce (en kısıtlayıcı değişken önce — klasik CSP
// sezgisi), çakışan dal erken budanır. budget aşılırsa arama durur (perf
// güvenliği — geniş kataloglu derslerde patlamasın).
function searchCombos(candidatesByCodeMap, prefs, { limit = 40, budget = 200000 } = {}) {
  const codes = [...candidatesByCodeMap.keys()].sort(
    (a, b) => candidatesByCodeMap.get(a).length - candidatesByCodeMap.get(b).length);
  const results = [];
  let visited = 0;
  function dfs(i, chosen) {
    if (results.length >= limit || visited > budget) return;
    visited++;
    if (i === codes.length) {
      const { pass } = evaluate(chosen, prefs);
      if (pass) results.push(chosen.slice());
      return;
    }
    const code = codes[i];
    for (const sec of candidatesByCodeMap.get(code)) {
      if (chosen.some((c) => sectionsConflict(c, sec))) continue;
      chosen.push(sec);
      dfs(i + 1, chosen);
      chosen.pop();
      if (results.length >= limit || visited > budget) return;
    }
  }
  dfs(0, []);
  return { results, visited };
}

// Ana giriş noktası. rows: dönemin tüm şube listesi (search.json). codes:
// program'daki ders kodları. prefs: yukarıdaki şekil. currentByCode: Map<code,crn>.
// Döner: { combos: [{ sections, score, changed }], relaxed: string[] } —
// relaxed, hiçbir kombinasyon bulunamayınca otomatik düşürülen (kilitsiz)
// tercih anahtarlarının listesidir; hâlâ sonuç yoksa boş combos döner.
export function findAlternatives(rows, codes, prefs, { locked = new Set(), currentByCode = new Map(), limit = 40 } = {}) {
  const byCode = candidatesByCode(rows, codes);
  // Bir dersin hiç açık şubesi yoksa (ör. arşiv/kapalı dönem) o ders sabit
  // kalır — swap edilemez, mevcut seçim varsa aynen korunur, yoksa alternatif
  // aranamaz (boş sonuç).
  for (const [code, list] of byCode) {
    if (!list.length) return { combos: [], relaxed: [], unavailable: [code] };
  }

  let p = prefs;
  const relaxed = [];
  let { results } = searchCombos(byCode, p, { limit });
  for (const key of RELAX_ORDER) {
    if (results.length) break;
    if (locked.has(key)) continue;
    const before = JSON.stringify(p);
    p = dropKey(p, key);
    if (JSON.stringify(p) === before) continue;
    relaxed.push(key);
    ({ results } = searchCombos(byCode, p, { limit }));
  }

  const combos = results.map((sections) => ({
    sections,
    score: score(sections, p, currentByCode),
    changed: sections.filter((s) => currentByCode.get(s.code) !== s.crn).length,
  })).sort((a, b) => a.score - b.score || a.changed - b.changed);

  return { combos, relaxed, unavailable: [] };
}

// 9 hazır ayar → prefs. "Kampüs" kategorisi (bina verisi yok) hariç.
export function presetPrefs(name) {
  const base = () => ({
    days: Object.fromEntries(WEEKDAYS.map((d) => [d, 'any'])),
    density: 'any', singleCourseDaysReduce: false,
    earliest: null, latest: null, lunchFree: false, half: 'any', gap: null, dailySpan: null,
  });
  const p = base();
  switch (name) {
    case 'compact': p.density = 'compact'; break; // Az gün, dolu gün
    case 'spread': p.density = 'spread'; break; // Dengeli
    case 'lateStart': p.earliest = 10 * 60 + 30; break; // Geç başla
    case 'earlyEnd': p.latest = 15 * 60 + 30; break; // Erken çık
    case 'fridayFree': p.days.Cuma = 'free'; break; // Cuma boş
    case 'reduceGaps': p.gap = 60; break; // Boşlukları azalt
    case 'shortDays': p.dailySpan = 6 * 60; break; // Kısa günler
    case 'midweekBreather': p.days.Çarşamba = 'free'; break; // Çarşamba nefesi
    case 'mergeCampusDays': p.density = 'compact'; p.singleCourseDaysReduce = true; break; // Kampüs günlerini birleştir (bina verisi yok — yoğunluk+tek-ders ile en yakın karşılık)
    default: break;
  }
  return p;
}
