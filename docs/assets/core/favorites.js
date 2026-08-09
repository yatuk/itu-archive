// Favoriler ve program (ders programı) kaydı — localStorage'da kalıcı.
// Kayıt: { term, branch, crn } üçlüsü; branş|crn anahtarı dönem içinde benzersiz.
import { getJSON } from './utils.js';

const FAV_KEY = 'itu-favorites';
const SCHED_KEY = 'itu-schedule';

export function favKeyOf(branch, crn) { return `${branch}|${crn}`; }

function read(key) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return [];
    const p = JSON.parse(v);
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}
function write(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* dolu/saklı mod */ }
}

export function loadFavorites() { return read(FAV_KEY); }
export function saveFavorites(list) { write(FAV_KEY, list); }

// toggleFavorite, ekler/kaldırır; dönen değer "artık favori mi".
export function toggleFavorite(term, branch, crn) {
  const list = loadFavorites();
  const key = favKeyOf(branch, crn);
  const i = list.findIndex((f) => f.term === term && favKeyOf(f.branch, f.crn) === key);
  if (i >= 0) { list.splice(i, 1); saveFavorites(list); return false; }
  list.push({ term, branch, crn });
  saveFavorites(list);
  return true;
}

export function isFavorite(term, branch, crn) {
  const key = favKeyOf(branch, crn);
  return loadFavorites().some((f) => f.term === term && favKeyOf(f.branch, f.crn) === key);
}

export function loadSchedule() { return read(SCHED_KEY); }
export function saveSchedule(list) { write(SCHED_KEY, list); }

// schedule'e kayıt ekler (varsa atlar). backup opsiyonel yedek CRN.
export function addToSchedule(term, branch, crn, backup) {
  const list = loadSchedule();
  const key = favKeyOf(branch, crn);
  if (list.some((f) => f.term === term && favKeyOf(f.branch, f.crn) === key)) return false;
  const rec = { term, branch, crn };
  if (backup) rec.backup = backup;
  list.push(rec);
  saveSchedule(list);
  return true;
}

export function removeFromSchedule(term, branch, crn) {
  const key = favKeyOf(branch, crn);
  const list = loadSchedule().filter((f) => !(f.term === term && favKeyOf(f.branch, f.crn) === key));
  saveSchedule(list);
}

export function clearSchedule() { saveSchedule([]); }

// {term, branch, crn} kaydını o dönemin arama satırına çevirir (yoksa null).
// Satır biçimi: [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan, seviye, yöntem, programlar]
export async function rowFor(rec) {
  try {
    const rows = await getJSON(`data/terms/${rec.term}/search.json`);
    return rows.find((r) => r[3] === rec.branch && r[0] === rec.crn) || null;
  } catch { return null; }
}
