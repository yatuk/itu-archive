// Geçilen dersler: "Müfredat ve GPA" sekmesinde girilen / transkriptten
// aktarılan notlardan (planstore, `itu-grades`) ders bazında durum üretir.
// Önşart haritası bunu düğümleri boyamak için okur. Salt okunur — hiçbir şey
// yazmaz, sunucuya bir şey gitmez. "taken" deposu (core/taken.js) her not
// girilen dersi (FF dahil) içerdiğinden geçti/kaldı ayrımı için buradan okunur.

import { readLocalState, isPlainObject } from './persistence.js?v=dde1e9339338';
import { GRADE_POINTS, EXEMPT, isPassingGrade } from './grades.js?v=dde1e9339338';
import { canonicalCode } from './plan.js?v=dde1e9339338';
import { loadLastProgram } from './planstore.js?v=dde1e9339338';

const FAIL = new Set(['FF', 'VF']);

// Notun sıralaması (asgari not koşulu için): muaf/geçti kodları her asgariyi
// karşılar; bilinmeyen not -1.
export function gradeRank(grade) {
  const g = String(grade || '').toUpperCase();
  if (EXEMPT.has(g) && g !== 'E') return 5;
  return g in GRADE_POINTS ? GRADE_POINTS[g] : -1;
}

function normCode(code) {
  return canonicalCode(String(code || '').toUpperCase()).replace(/\s+/g, ' ').trim();
}

// all: { "<PROG>": { grades, elective, transcript } } (planstore şeması).
// prog: haritada açık program — seçmeli slot seçimleri yalnızca o programın
// slot anahtarlarıyla eşleşir.
// Dönüş: { status: Map<kod, 'passed'|'failed'>, best: Map<kod, not>,
//          slots: Map<"s<i>i<j>", 'passed'|'failed'>, any: boolean }
export function courseProgress(all, prog = '') {
  const best = new Map();
  const failed = new Set();
  let any = false;
  const note = (code, grade) => {
    const c = normCode(code);
    const g = String(grade || '').toUpperCase();
    if (!c || !g) return;
    any = true;
    if (isPassingGrade(g)) {
      const prev = best.get(c);
      if (!prev || gradeRank(g) > gradeRank(prev)) best.set(c, g);
    } else if (FAIL.has(g)) failed.add(c);
  };
  const slots = new Map();
  for (const [p, data] of Object.entries(isPlainObject(all) ? all : {})) {
    if (!isPlainObject(data)) continue;
    // Zorunlu ve seçmeli kayıtlarda yalnızca son not geçerli (tekrar = son not).
    for (const [code, rec] of Object.entries(isPlainObject(data.grades) ? data.grades : {})) {
      if (isPlainObject(rec)) note(code, rec.grade);
    }
    for (const [slot, rec] of Object.entries(isPlainObject(data.elective) ? data.elective : {})) {
      if (!isPlainObject(rec) || !rec.grade) continue;
      note(rec.code, rec.grade);
      if (p === prog) {
        const g = String(rec.grade).toUpperCase();
        if (isPassingGrade(g)) slots.set(slot, 'passed');
        else if (FAIL.has(g)) slots.set(slot, 'failed');
      }
    }
    // Transkript anlık görüntüsü: plana eşleşen (key'li) denemeler zaten
    // grades/elective'te; sonradan silinen ya da değiştirilen not orada
    // güncel. Yalnızca plana eşleşmeyen denemeler buradan eklenir.
    const snap = data.transcript;
    if (isPlainObject(snap) && Array.isArray(snap.entries)) {
      for (const item of snap.entries) {
        if (isPlainObject(item) && !item.key && typeof item.code === 'string') note(item.code, item.grade);
      }
    }
  }
  const status = new Map();
  for (const c of failed) status.set(c, 'failed');
  for (const c of best.keys()) status.set(c, 'passed');
  return { status, best, slots, any };
}

// Tüm programların not kayıtları (planstore ile aynı anahtar).
export function readAllGrades() {
  return readLocalState('itu-grades', { fallback: {}, legacyKey: 'itu-grades', validate: isPlainObject });
}

// "Müfredat ve GPA"da en son açılan program (yoksa en son güncellenen kayıt).
export function lastGradesProgram() {
  const last = loadLastProgram();
  if (last) return last;
  let pick = '', at = -1;
  for (const [p, data] of Object.entries(readAllGrades())) {
    const t = Number(data?.updatedAt) || 0;
    if (t > at) { at = t; pick = p; }
  }
  return pick;
}
