// Haftalık program kayıtlarının (localStorage 'itu-programs') küçük ortak
// erişimi. Program görünümü bu kaydın sahibidir; ders detay paneli, program
// modülünü yüklemeden bir şubenin aktif programda olup olmadığını okuyabilsin
// ve "Programda" düğmesiyle kaldırabilsin diye okuma/yazma burada durur.
// Kayıt: { programs: [{ id, name, items: [{ term, branch, crn }] }], active }.

import { readLocalState, writeLocalState, isPlainObject } from './persistence.js';

export const PROGRAMS_KEY = 'itu-programs';
// Program kaydı başka bir modülde değişince yayılan olay (görünüm yeniden çizer).
export const PROGRAMS_CHANGED = 'itu:programs-changed';

const valid = (value) => isPlainObject(value) && Array.isArray(value.programs) && value.programs.length > 0;

// Kayıtlı program listesi; yoksa ya da bozuksa null.
export function readPrograms() {
  return readLocalState(PROGRAMS_KEY, { fallback: null, legacyKey: PROGRAMS_KEY, validate: valid });
}

export function writePrograms(ps) {
  writeLocalState(PROGRAMS_KEY, ps, { validate: valid });
}

const sameItem = (term, branch, crn) => (f) => f.term === term && f.branch === branch && String(f.crn) === String(crn);

// Şube aktif programda mı? Program hiç kurulmadıysa hayır.
export function inActiveProgram(term, branch, crn) {
  const ps = readPrograms();
  const p = ps?.programs.find((x) => x.id === ps.active);
  return Boolean(p && Array.isArray(p.items) && p.items.some(sameItem(term, branch, crn)));
}

// Şubeyi aktif programdan çıkarır; dönen değer: gerçekten çıkarıldı mı.
export function removeFromActiveProgram(term, branch, crn) {
  const ps = readPrograms();
  const p = ps?.programs.find((x) => x.id === ps.active);
  if (!p || !Array.isArray(p.items)) return false;
  const before = p.items.length;
  p.items = p.items.filter((f) => !sameItem(term, branch, crn)(f));
  if (p.items.length === before) return false;
  writePrograms(ps);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(PROGRAMS_CHANGED));
  return true;
}
