// Resmî program kodu listesi (docs/data/programs.json — 285 program).
// Frontend kod → okunur ad + seviye çözer (G7); listede olmayan kodlar
// "kapanmış/grafik dışı" sayılır. Önbellekli.

import { getJSON } from './utils.js';

let _map = null;
export const PROGRAM_LEVELS = {
  OL: { tr: 'Önlisans', en: 'Associate' },
  LS: { tr: 'Lisans', en: "Bachelor's" },
  YL: { tr: 'Yüksek Lisans', en: "Master's" },
  DR: { tr: 'Doktora', en: 'Doctorate' },
};

const NUMERIC_LEVELS = { 1: 'OL', 2: 'LS', 3: 'YL', 4: 'DR' };

export function normalizeProgramLevel(value, code = '') {
  if (NUMERIC_LEVELS[value]) return NUMERIC_LEVELS[value];
  const raw = String(value || '').toUpperCase();
  if (raw === 'LU') return 'YL';
  if (raw === 'LUI') return 'DR';
  if (PROGRAM_LEVELS[raw]) return raw;
  const suffix = String(code).toUpperCase().match(/_(OL|LS|YL|DR|LU|LUI)$/)?.[1] || '';
  return suffix === 'LU' ? 'YL' : suffix === 'LUI' ? 'DR' : suffix;
}

export function programLevelLabel(level, lang = 'tr') {
  const key = normalizeProgramLevel(level);
  return PROGRAM_LEVELS[key]?.[lang] || PROGRAM_LEVELS[key]?.tr || String(level || '');
}

export function formatProgramLabel(code, program, lang = 'tr') {
  const level = normalizeProgramLevel(program?.level, code);
  const levelLabel = programLevelLabel(level, lang);
  const rawName = String(program?.name || '').trim();
  const name = rawName
    .replace(/\s+(?:Ön\s*Lisans|Lisans|Yüksek Lisans|Doktora)$/i, '')
    .trim() || (lang === 'en' ? 'Program name unavailable in archive' : 'Program adı arşivde bulunamadı');
  return [code, name, levelLabel].filter(Boolean).join(' · ');
}
export async function loadProgramMap() {
  if (_map === null) {
    const d = await getJSON('data/programs.json').catch(() => null);
    _map = new Map((d?.programs || []).map((p) => [p.code, p]));
  }
  return _map;
}

// Kod → okunur ad; listede yoksa kodun kendisi döner.
export async function programLabel(code) {
  const m = await loadProgramMap();
  const p = m.get(code);
  return formatProgramLabel(code, p);
}

// Kodun listede olup olmadığını söyler (kapanmış/grafik dışı kodlar için).
export async function isKnownProgram(code) {
  const m = await loadProgramMap();
  return m.has(code);
}
