// Resmî program kodu listesi (docs/data/programs.json — 285 program).
// Frontend kod → okunur ad + seviye çözer (G7); listede olmayan kodlar
// "kapanmış/grafik dışı" sayılır. Önbellekli.

import { getJSON } from './utils.js';

let _map = null;
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
  return p ? `${code} — ${p.name}` : code;
}

// Kodun listede olup olmadığını söyler (kapanmış/grafik dışı kodlar için).
export async function isKnownProgram(code) {
  const m = await loadProgramMap();
  return m.has(code);
}
