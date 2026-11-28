// Dersler listesindeki "geçtin" / "tekrar" işaretleri için salt-okunur özet.
//
// Kaynaklar (ikisi de yalnız bu tarayıcıda, localStorage'da):
//   · itu-taken  — core/taken.js: kullanıcının beyan ettiği / Müfredat'tan
//                  işlenen ders kodları (notsuz da olabilir).
//   · itu-grades — core/planstore.js: program bazlı not kaydı
//                  { <prog>: { grades: { KOD: { grade, prev } },
//                              elective: { slot: { code, grade } },
//                              transcript: { entries: [{ code, grade }] },
//                              updatedAt } }
// Bu modül hiçbir şeyi YAZMAZ; Müfredat sekmesinin biçimini yalnız okur.
// Not biliniyorsa o belirleyicidir: geçer not → "geçtin" (harfiyle), FF/VF →
// "tekrar". Not bilinmiyor ama ders "aldıklarım"da ise yalnız "geçtin".

import { readLocalState, isPlainObject, versionedKey } from './persistence.js';
import { getTaken } from './taken.js';
import { isPassingGrade } from './grades.js';

const GRADES_KEY = 'itu-grades';
const FAILING = new Set(['FF', 'VF']);

// Değişince işaretlerin yeniden hesaplanacağı localStorage anahtarları
// (başka sekmeden gelen `storage` olayı için).
export const MARK_STORAGE_KEYS = new Set([
  'itu-taken', versionedKey('itu-taken'), GRADES_KEY, versionedKey(GRADES_KEY),
]);

export function normCode(code) {
  return String(code || '').trim().toUpperCase().replace(/\s+/g, ' ');
}

function cleanGrade(g) {
  return typeof g === 'string' ? g.trim().toUpperCase() : '';
}

// Saf: not deposu + aldığım kodlar → Map<KOD, { status: 'passed'|'retake', grade }>.
// Birden çok program varsa en son güncellenen programın notu kazanır; program
// içinde transkript tabandır, plandaki (sonradan girilen) not onu ezer.
export function buildTakenMarks(gradesStore, takenCodes = []) {
  const latest = new Map(); // KOD → harf
  const progs = isPlainObject(gradesStore) ? Object.values(gradesStore).filter(isPlainObject) : [];
  progs.sort((a, b) => (Number(a.updatedAt) || 0) - (Number(b.updatedAt) || 0));
  const put = (code, grade) => {
    const c = normCode(code);
    const g = cleanGrade(grade);
    if (c && g) latest.set(c, g);
  };
  for (const p of progs) {
    const entries = Array.isArray(p.transcript?.entries) ? p.transcript.entries : [];
    for (const e of entries) if (e && typeof e.code === 'string') put(e.code, e.grade);
    if (isPlainObject(p.grades)) {
      for (const [code, rec] of Object.entries(p.grades)) if (isPlainObject(rec)) put(code, rec.grade);
    }
    if (isPlainObject(p.elective)) {
      for (const rec of Object.values(p.elective)) if (isPlainObject(rec) && rec.code) put(rec.code, rec.grade);
    }
  }
  const marks = new Map();
  for (const [code, grade] of latest) {
    if (isPassingGrade(grade)) marks.set(code, { status: 'passed', grade });
    else if (FAILING.has(grade)) marks.set(code, { status: 'retake', grade });
  }
  for (const raw of takenCodes || []) {
    const c = normCode(raw);
    if (c && !latest.has(c)) marks.set(c, { status: 'passed', grade: '' });
  }
  return marks;
}

export function readTakenMarks() {
  const store = readLocalState(GRADES_KEY, { fallback: {}, legacyKey: GRADES_KEY, validate: isPlainObject });
  return buildTakenMarks(store, getTaken().codes);
}
