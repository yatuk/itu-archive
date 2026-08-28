// "Aldığım dersler" (Faz D, G8 kısmi): kullanıcının beyan ettiği dersler ve
// programı. Sunucuya GİTMEZ, localStorage'da kalır. Bu bir transkript DEĞİLDİR —
// kullanıcının kendi beyanı; arayüz "kesin sağlıyorsun" değil "girdiğin derslere
// göre sağlanıyor görünüyor" der.

import { readLocalState, writeLocalState, isPlainObject } from './persistence.js?v=48f281c5afc3';

const KEY = 'itu-taken';

export function getTaken() {
  const d = readLocalState(KEY, {
    fallback: null, legacyKey: KEY,
    validate: (value) => isPlainObject(value) && Array.isArray(value.codes),
  });
  if (d) return { codes: d.codes.filter((code) => typeof code === 'string'), program: typeof d.program === 'string' ? d.program : '' };
  return { codes: [], program: '' };
}

export function saveTaken(t) {
  writeLocalState(KEY, { codes: t.codes, program: t.program || '' }, {
    validate: (value) => isPlainObject(value) && Array.isArray(value.codes),
  });
}

// Ders kodu metnini temizler: virgül/noktalı virgül/satır ayraç olabilir, ders
// kodunun İÇİNDEKİ boşluk korunur. "blg 102e, MAT 101E\nCEN 102" → ["BLG 102E",
// "MAT 101E", "CEN 102"]; "BLG 102E MAT 101E" (boşluk ayraçlı) → iki kod.
export function parseCodes(text) {
  const seen = new Set();
  const out = [];
  const re = /([a-zçğıiöşü]{2,5})\s*(\d{2,4}[a-z]?)/gi;
  for (const part of String(text || '').split(/[\n,;]+/)) {
    for (const m of part.matchAll(re)) {
      // "BLG102E" ve "BLG 102E" aynı koda düşsün: harf + boşluk + sayı.
      const code = `${m[1]} ${m[2]}`.toUpperCase();
      if (!seen.has(code)) { seen.add(code); out.push(code); }
    }
  }
  return out;
}

// Ders kodu kayıtlı mı? (büyük/küçük + boşluktan bağımsız)
export function isTaken(code) {
  const wanted = String(code || '').trim().toUpperCase().replace(/\s+/g, ' ');
  if (!wanted) return false;
  return getTaken().codes.some((c) => c === wanted);
}

export function setProgram(program) {
  const t = getTaken();
  t.program = program;
  saveTaken(t);
}

export function exportTaken() {
  return JSON.stringify(getTaken(), null, 2);
}

export function importTaken(json) {
  try {
    const d = JSON.parse(json);
    if (!d || !Array.isArray(d.codes)) return false;
    saveTaken({ codes: d.codes, program: d.program || '' });
    return true;
  } catch { return false; }
}

// "Aldığım dersler" değişince görünümler yeniden çizer (önşart/program/havuz).
export const TAKEN_CHANGED = 'itu:taken-changed';
export function notifyTakenChanged() {
  window.dispatchEvent(new CustomEvent(TAKEN_CHANGED));
}
