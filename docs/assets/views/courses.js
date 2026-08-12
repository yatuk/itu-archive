// Dersler görünümü: dönem arama/filtre/sıralama, şube seçimi (sepet), zaman
// çizelgesi, detay paneli, CSV indirme ve paylaşılabilir URL durumu.
//
// Tüm veri state.rows (arama indeksi) üzerinden çalışır; tam kayıt yalnızca
// detay açılınca ilgili branş dosyasından gelir. Arama indeksi 10 alanlıdır:
// [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan, seviye, yöntem] —
// son iki alan tarihsel dönemlerde olmayabilir, filtrelerde "yoksa geç" yapılır.

import { $, getJSON, esc, fold, debounce, downloadCSV, setStatus, fillMeasured } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillBar } from '../core/chart.js';
import { fillRows } from '../core/table.js';
import * as fav from '../core/favorites.js';
import { toast } from '../core/toast.js';
import { openCourseDetail } from '../core/course-detail.js';

const PAGE = 200;
const TIME_LABEL = { sabah: 'sabah (<12:00)', ogle: 'öğle (12:00-17:00)', aksam: 'akşam (≥17:00)' };

export function initCourses() {
  $('#q').addEventListener('input', debounce(applyFilters, 120));
  $('#f-branch').addEventListener('change', applyFilters);
  $('#f-day').addEventListener('change', applyFilters);
  $('#f-time').addEventListener('change', applyFilters);
  $('#f-level').addEventListener('change', applyFilters);
  $('#f-method').addEventListener('change', applyFilters);
  $('#f-program').addEventListener('change', applyFilters);
  $('#f-code').addEventListener('input', debounce(applyFilters, 120));
  $('#f-open').addEventListener('change', applyFilters);
  $('#f-term').addEventListener('change', () => loadTerm($('#f-term').value));
  $('#more').addEventListener('click', () => renderRows(true));
  $('#csv').addEventListener('click', exportCSV);
  $('#tt-toggle').addEventListener('click', toggleTimetable);
  $('#sel-all').addEventListener('change', () => {
    const on = $('#sel-all').checked;
    for (const r of state.filtered) {
      if (on) state.selected.add(selKey(r));
      else state.selected.delete(selKey(r));
    }
    for (const cb of document.querySelectorAll('#rows .row-sel')) cb.checked = on;
    updateSelection();
  });
  $('#sel-csv').addEventListener('click', exportSelectedCSV);
  $('#sel-clear').addEventListener('click', clearSelection);
  $('#sel-only').addEventListener('change', () => { if (ttOn) renderTimetable(); });
  $('#sel-send').addEventListener('click', sendToProgram);
  wireSort();
}

export async function loadTerm(slug) {
  state.termSlug = slug;
  state.selected.clear(); // seçim döneme özeldir
  updateSelection();
  setStatus($('#resultline'), 'dönem yükleniyor…', { busy: true });
  try {
    const [rows, meta] = await Promise.all([
      getJSON(`data/terms/${slug}/search.json`),
      getJSON(`data/terms/${slug}/meta.json`),
    ]);
    state.rows = rows;
    state.meta = meta;
    loadQuota(slug); // dolma sürelerini bu dönem için arka planda yükle
    // Aramayı bir kez katlanmış metin üzerinden yapıyoruz: her tuş vuruşunda
    // 4000 satırı yeniden normalize etmenin anlamı yok.
    state.hay = rows.map((r) => fold(`${r[0]} ${r[1]} ${r[2]} ${r[4]}`));

    const branchSel = $('#f-branch');
    const keep = branchSel.value;
    branchSel.innerHTML = '<option value="">hepsi</option>' +
      meta.branches.map((b) => `<option value="${b.code}">${b.code} (${b.sections})</option>`).join('');
    branchSel.value = meta.branches.some((b) => b.code === keep) ? keep : '';

    // Öğretim yöntemi seçenekleri veriden gelir (tarihsel dönemlerde boş).
    const methods = [...new Set(rows.map((r) => r[9]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
    const mSel = $('#f-method');
    const keepM = mSel.value;
    mSel.innerHTML = '<option value="">hepsi</option>' +
      methods.map((m) => `<option>${esc(m)}</option>`).join('');
    mSel.value = methods.includes(keepM) ? keepM : '';

    // "Alabilen programlar" filtre seçenekleri bu dönemin verisinden gelir.
    // Her satırdaki liste tek tek kodlara indirgenir, tekrarlar alınır ve
    // alfabetik sıralanır; "hepsi" en üstte sabittir.
    const programs = [...new Set(rows.flatMap((r) => programList(r)))].sort((a, b) => a.localeCompare(b, 'tr'));
    const pSel = $('#f-program');
    const keepP = pSel.value;
    pSel.innerHTML = '<option value="">hepsi</option>' +
      programs.map((p) => `<option>${esc(p)}</option>`).join('');
    pSel.value = programs.includes(keepP) ? keepP : '';

    applyFilters();
  } catch (e) {
    setStatus($('#resultline'), `veri yüklenemedi (${e.message})`, { error: true });
  }
}

// Kontenjan zaman serisini arka planda yükler; detay panelindeki dolma
// süresi bilgisi buradan gelir.
export async function loadQuota(slug) {
  try {
    const sum = await getJSON(`data/quota/${slug}.json`);
    state.quota = new Map(sum.courses.map((c) => [c.crn, c]));
    state.quotaLast = sum.last || null; // doluluk ölçüm zamanı (Faz 0.4)
  } catch {
    state.quota = null; // bu dönem için henüz ölçüm yok
    state.quotaLast = null;
  }
}

export function applyFilters() {
  const q = fold($('#q').value.trim());
  const branch = $('#f-branch').value;
  const day = $('#f-day').value;
  const time = $('#f-time').value;
  const level = $('#f-level').value;
  const method = $('#f-method').value;
  const program = $('#f-program').value;
  const code = $('#f-code').value.trim().toLowerCase();
  const openOnly = $('#f-open').checked;
  const terms = q ? q.split(/\s+/) : [];

  state.filtered = state.rows.filter((r, i) => {
    if (branch && r[3] !== branch) return false;
    if (code && !r[1].toLowerCase().includes(code)) return false;
    if (day && !matchesDay(r[5], day)) return false;
    if (time && !parseWhen(r[5]).some((s) => timeBucket(s.start) === time)) return false;
    // Seviye/yöntem/program alanları tarihsel dönemlerde yoktur; yoksa filtre uygulanmaz.
    if (level && r[8] && r[8] !== level) return false;
    if (method && r[9] && r[9] !== method) return false;
    if (program && !programList(r).includes(program)) return false;
    if (openOnly && r[7] >= r[6]) return false;
    if (!terms.length) return true;
    return terms.every((t) => state.hay[i].includes(t));
  });

  const { key, dir } = state.sort;
  state.filtered.sort((a, b) => {
    const va = sortValue(a, key), vb = sortValue(b, key);
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb), 'tr') * dir;
  });

  state.shown = 0;
  renderRows(false);

  const total = state.rows.length;
  const n = state.filtered.length;
  $('#resultline').innerHTML = n === total
    ? `<b>${n}</b> şube · ${state.meta.courses} ders · ${state.meta.branches.length} bölüm`
    : `<b>${n}</b> / ${total} şube eşleşti`;
  renderChips();
  updateSelection();
  if (ttOn) renderTimetable();
  saveState();
}

// "Alabilen programlar" alanı (r[10]) dizi ya da virgüllü tek string olarak
// gelebilir (tarihsel dönemlerde tek öğe içinde "AIN_LS, BIO_LS" gibi). Her iki
// durumu da tekil kod listesine indirger. Saf fonksiyon — test edilebilir.
export function programList(r) {
  const raw = r[10];
  if (!raw) return [];
  const parts = Array.isArray(raw) ? raw : String(raw).split(/[,;|]/);
  const out = [];
  for (const p of parts) {
    // Dizi içindeki tek öğe de virgüllü string olabilir (tarihsel dönemler).
    for (const q of String(p).split(/[,;|]/)) {
      const v = q.trim();
      if (v && !out.includes(v)) out.push(v);
    }
  }
  return out;
}

// Sıralama için satır değerini döndürür; Doluluk yüzde olarak hesaplanır.
// Saf fonksiyon — test edilebilir olması için dışa açık.
export function sortValue(r, key) {
  switch (key) {
    case 'crn': return r[0];
    case 'code': return r[1];
    case 'name': return r[2];
    case 'instructor': return r[3];
    case 'when': return r[5];
    case 'cap': return r[6];
    case 'enr': return r[7];
    case 'fill': { const c = r[6]; return c ? r[7] / c : -1; }
    default: return '';
  }
}

function wireSort() {
  const headers = [...document.querySelectorAll('#results th[data-sort]')];
  for (const th of headers) {
    // Gerçek buton: klavye ve ekran okuyucu erişimi için th yerine buton.
    th.querySelector('.th-sort').addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sort.key === key) state.sort.dir *= -1;
      else state.sort = { key, dir: 1 };
      updateSortUI();
      applyFilters();
    });
  }
  updateSortUI();
}

function updateSortUI() {
  for (const th of document.querySelectorAll('#results th[data-sort]')) {
    const on = th.dataset.sort === state.sort.key;
    th.classList.toggle('sorted', on);
    th.setAttribute('aria-sort', on ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none');
  }
}

/* ---------- filtre çipleri ---------- */

function renderChips() {
  const box = $('#chips');
  const chips = [];
  const q = $('#q').value.trim();
  if (q) chips.push({ key: 'q', label: `"${q}"` });
  if ($('#f-branch').value) chips.push({ key: 'branch', label: `bölüm: ${$('#f-branch').value}` });
  if ($('#f-code').value.trim()) chips.push({ key: 'code', label: `kod: ${$('#f-code').value.trim()}` });
  if ($('#f-day').value) chips.push({ key: 'day', label: `gün: ${$('#f-day').value}` });
  if ($('#f-time').value) chips.push({ key: 'time', label: `saat: ${TIME_LABEL[$('#f-time').value] || $('#f-time').value}` });
  if ($('#f-level').value) chips.push({ key: 'level', label: `seviye: ${$('#f-level').value}` });
  if ($('#f-method').value) chips.push({ key: 'method', label: `yöntem: ${$('#f-method').value}` });
  if ($('#f-program').value) chips.push({ key: 'program', label: `program: ${$('#f-program').value}` });
  if ($('#f-open').checked) chips.push({ key: 'open', label: 'yalnızca kontenjan' });

  box.hidden = !chips.length;
  if (!chips.length) { box.innerHTML = ''; return; }
  box.innerHTML = chips.map((c) =>
    `<button type="button" class="chip-x" data-key="${c.key}" title="Filtreyi kaldır">${esc(c.label)} ✕</button>`).join('');
  box.querySelectorAll('.chip-x').forEach((b) =>
    b.addEventListener('click', () => { clearFilter(b.dataset.key); applyFilters(); }));
}

function clearFilter(key) {
  switch (key) {
    case 'q': $('#q').value = ''; break;
    case 'branch': $('#f-branch').value = ''; break;
    case 'code': $('#f-code').value = ''; break;
    case 'day': $('#f-day').value = ''; break;
    case 'time': $('#f-time').value = ''; break;
    case 'level': $('#f-level').value = ''; break;
    case 'method': $('#f-method').value = ''; break;
    case 'program': $('#f-program').value = ''; break;
    case 'open': $('#f-open').checked = false; break;
  }
}

/* ---------- şube seçimi / sepet ---------- */

function selKey(r) { return `${r[3]}|${r[0]}`; }

function updateSelection() {
  const n = state.selected.size;
  $('#sepet').hidden = !n;
  if (!n) { $('#sel-all').checked = false; return; }
  $('#sel-count').textContent = `${n} şube seçili`;
  $('#sel-all').checked = state.filtered.length > 0 && state.filtered.every((r) => state.selected.has(selKey(r)));
}

function clearSelection() {
  state.selected.clear();
  for (const cb of document.querySelectorAll('#rows .row-sel')) cb.checked = false;
  $('#sel-all').checked = false;
  updateSelection();
  if (ttOn) renderTimetable();
}

function rowsToCSV(rows, filename) {
  const headers = ['CRN', 'Ders Kodu', 'Branş', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Kontenjan', 'Yazılan', 'Doluluk (%)'];
  const data = rows.map((r) => [
    r[0], r[1], r[3], r[2], r[4], r[5], r[6], r[7],
    r[6] ? Math.round((r[7] / r[6]) * 100) : '',
  ]);
  downloadCSV(filename, headers, data);
}

function exportCSV() {
  const only = $('#sel-only').checked;
  const rows = only && state.selected.size ? state.rows.filter((r) => state.selected.has(selKey(r))) : state.filtered;
  rowsToCSV(rows, `dersler-${state.termSlug}.csv`);
}

function exportSelectedCSV() {
  rowsToCSV(state.rows.filter((r) => state.selected.has(selKey(r))), `secili-${state.termSlug}.csv`);
}

// Seçili şubeleri program oluşturucuya ekleyip o sekmeye geçer.
function sendToProgram() {
  if (!state.selected.size) { toast('Önce şube seç', { kind: 'warn' }); return; }
  let added = 0;
  for (const r of state.rows) {
    if (state.selected.has(selKey(r)) && fav.addToSchedule(state.termSlug, r[3], r[0])) added++;
  }
  toast(added ? `${added} şube programa gönderildi` : 'Seçili şubeler zaten programda', { kind: added ? 'ok' : 'warn' });
  window.dispatchEvent(new CustomEvent('itu:goto-program'));
}

/* ---------- tablo ---------- */

// Doluluk rozetinin yanına ölçüm zamanını ekler (Faz 0.4): "%100" anlık sanılmasın —
// kontenjan günde bir tazeleniyor. Yalnızca bu dönem için ölçüm kaydı varsa göster.
function measuredNote(crn) {
  if (!state.quotaLast) return '';
  const rec = state.quota?.get(crn);
  if (!rec) return '';
  const note = fillMeasured(state.quotaLast);
  return note ? ` · ${note}` : '';
}

function renderRows(append) {
  const tbody = $('#rows');
  const slice = state.filtered.slice(state.shown, state.shown + PAGE);

  if (!slice.length && !state.shown) {
    fillRows(tbody, [], null, { empty: 'eşleşen ders yok', colspan: 10 });
    $('#more').hidden = true;
    return;
  }

  const frag = fillRows(tbody, slice, (r) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = r;
    const key = selKey(r);
    const starred = fav.isFavorite(state.termSlug, branch, crn);
    return `
      <td class="sel"><input type="checkbox" class="row-sel" data-key="${esc(key)}" aria-label="Şubeyi seç"${state.selected.has(key) ? ' checked' : ''}></td>
      <td class="fav"><button type="button" class="fav-star${starred ? ' on' : ''}" data-key="${esc(key)}" aria-label="Favorilere ekle/kaldır" aria-pressed="${starred}">${starred ? '★' : '☆'}</button></td>
      <td class="crn">${esc(crn)}</td>
      <td class="code"><b>${esc(code)}</b><small>${esc(branch)}</small></td>
      <td><button class="row-toggle" type="button" aria-haspopup="dialog">${esc(name)}</button></td>
      <td>${esc(instructor || '—')}</td>
      <td class="when">${esc(when || '—')}</td>
      <td class="num">${cap}</td>
      <td class="num">${enr}</td>
      <td class="num">${fillBar(cap, enr)}<small class="fill-measured">${measuredNote(crn)}</small></td>`;
  }, { append });

  if (frag) {
    frag.querySelectorAll('tr').forEach((tr, i) => {
      const r = slice[i];
      tr.querySelector('.row-toggle').addEventListener('click', () => openDetail(r));
      // Satırın herhangi bir yerine tıklayınca detay açılır; checkbox tıklaması
      // seçim için ayrıdır ve satır tıklamasını tetiklemez.
      tr.addEventListener('click', () => openDetail(r));
      const cb = tr.querySelector('.row-sel');
      if (cb) {
        cb.addEventListener('click', (ev) => ev.stopPropagation());
        cb.addEventListener('change', () => {
          if (cb.checked) state.selected.add(cb.dataset.key);
          else state.selected.delete(cb.dataset.key);
          updateSelection();
        });
      }
      const star = tr.querySelector('.fav-star');
      if (star) {
        star.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const [branch, crn] = star.dataset.key.split('|');
          const on = fav.toggleFavorite(state.termSlug, branch, crn);
          star.classList.toggle('on', on);
          star.textContent = on ? '★' : '☆';
          star.setAttribute('aria-pressed', String(on));
          toast(on ? `Favoriye eklendi (${crn})` : `Favoriden çıkarıldı (${crn})`, { kind: on ? 'ok' : 'warn' });
        });
      }
    });
  }

  state.shown += slice.length;
  $('#more').hidden = state.shown >= state.filtered.length;
  $('#more').textContent = `daha fazla göster (${state.filtered.length - state.shown} kaldı)`;
}

/* ---------- detay paneli (modal) ---------- */

// Detay paneli artık ortak bileşende (core/course-detail.js); bu fonksiyon
// satır bilgisini aktarır. program.js ve tablo aynı imzayla çağırır.
// termSlug verilmezse Dersler'deki aktif dönem kullanılır.
export function openDetail(row, termSlug) {
  openCourseDetail(row[1], { term: termSlug, crn: row[0], source: 'dersler' });
}

/* ---------- URL durumu ---------- */

// Dönem + arama + filtre durumunu URL'ye yazar; bağlantı paylaşılabilir olur.
function saveState() {
  const p = new URLSearchParams();
  if (state.termSlug) p.set('term', state.termSlug);
  const q = $('#q').value.trim();
  if (q) p.set('q', q);
  if ($('#f-branch').value) p.set('branch', $('#f-branch').value);
  if ($('#f-day').value) p.set('day', $('#f-day').value);
  if ($('#f-time').value) p.set('time', $('#f-time').value);
  if ($('#f-level').value) p.set('level', $('#f-level').value);
  if ($('#f-method').value) p.set('method', $('#f-method').value);
  if ($('#f-program').value) p.set('program', $('#f-program').value);
  if ($('#f-code').value.trim()) p.set('code', $('#f-code').value.trim());
  if ($('#f-open').checked) p.set('open', '1');
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
  history.replaceState(null, '', url);
}

/* ---------- zaman çizelgesi ---------- */

let ttOn = false;

// Çizelge ile tablo arasında geçiş. Filtreler/arama uygulanınca çizelge
// yeniden çizilir; "yalnızca seçilenler" açıksa seçim kümesi kullanılır.
function toggleTimetable() {
  ttOn = !ttOn;
  const wrap = $('#tt');
  document.querySelector('#results').closest('.tablewrap').hidden = ttOn;
  $('#more').hidden = ttOn;
  $('#tt-toggle').classList.toggle('active', ttOn);
  $('#tt-toggle').setAttribute('aria-pressed', String(ttOn));
  wrap.hidden = !ttOn;
  if (ttOn) renderTimetable();
}

function timetableRows() {
  const only = $('#sel-only').checked;
  if (only && state.selected.size) return state.rows.filter((r) => state.selected.has(selKey(r)));
  return state.filtered;
}

// "Pazartesi 08:30/12:29 | Çarşamba 13:00/16:59" -> oturum listesi (dakika cinsinden).
export function parseWhen(when) {
  const out = [];
  if (!when) return out;
  for (const part of String(when).split(' | ')) {
    const m = part.trim().match(/^(\S+)\s+(\d{2}:\d{2})\/(\d{2}:\d{2})$/);
    if (!m) continue;
    const day = m[1];
    const start = toMin(m[2]), end = toMin(m[3]);
    if (end > start) out.push({ day, start, end });
  }
  return out;
}

// Saat dilimini dakikadan kovaya indirir. Saf fonksiyon — test edilebilir.
export function timeBucket(startMin) {
  if (startMin < 12 * 60) return 'sabah';
  if (startMin < 17 * 60) return 'ogle';
  return 'aksam';
}

// Gün filtresi için tam-token eşleşmesi. when alanı "Pazartesi 08:30/12:29 |
// Çarşamba 13:00/16:59" biçimindedir. Alt-dize araması yanlış eşleşme üretir:
// "Pazar", "Pazartesi"nin içinde geçer; "Cuma", "Cumartesi"nin içinde. Saf
// fonksiyon — test edilebilir.
export function matchesDay(when, day) {
  return String(when || '').split(/\s+/).includes(day);
}

function toMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmtMin(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

const TT_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// Oturumları gün × 30dk slot ızgarasına yerleştirir; çakışma (aynı hücrede
// birden çok farklı ders) buradan görünür. Saf fonksiyon — test edilebilir.
export function buildTimetable(rows) {
  const all = [];
  for (const r of rows) {
    for (const s of parseWhen(r[5])) all.push({ ...s, row: r });
  }
  if (!all.length) return null;
  const startSlot = Math.floor(Math.min(...all.map((s) => s.start)) / 30) * 30;
  const endSlot = Math.ceil(Math.max(...all.map((s) => s.end)) / 30) * 30;
  const nSlots = (endSlot - startSlot) / 30;

  const grid = TT_DAYS.map(() => Array.from({ length: nSlots }, () => []));
  for (const s of all) {
    const di = TT_DAYS.indexOf(s.day);
    if (di < 0) continue;
    for (let t = s.start; t < s.end; t += 30) {
      const si = (t - startSlot) / 30;
      if (si >= 0 && si < nSlots) grid[di][si].push(s);
    }
  }
  return { startSlot, nSlots, grid, all };
}

function renderTimetable() {
  const wrap = $('#tt');
  const rows = timetableRows();
  const t = buildTimetable(rows);
  if (!t) {
    wrap.innerHTML = '<p class="empty">seçilen/filtrelenen şubelerde zaman bilgisi yok</p>';
    return;
  }
  const { startSlot, nSlots, grid, all } = t;

  let conflictCells = 0;
  let html = `<p class="tt-note"><b>${all.length}</b> oturum · <b>${rows.length}</b> şube</p>`;
  html += `<div class="tt-scroll"><table class="tt">
    <thead><tr><th class="tt-time">saat</th>${TT_DAYS.map((d) => `<th>${d.slice(0, 3)}</th>`).join('')}</tr></thead><tbody>`;

  for (let si = 0; si < nSlots; si++) {
    html += `<tr><th class="tt-time">${fmtMin(startSlot + si * 30)}</th>`;
    for (let di = 0; di < 7; di++) {
      const cell = grid[di][si];
      const codes = [...new Set(cell.map((c) => c.row[1]))];
      const conflict = codes.length > 1;
      if (conflict) conflictCells++;
      html += `<td class="tt-cell${conflict ? ' tt-conflict' : ''}"${conflict ? ` title="Çakışma: ${esc(codes.join(', '))}"` : ''}>`;
      html += cell.map((c) =>
        `<button type="button" class="tt-chip" data-code="${esc(c.row[1])}" title="${esc(c.row[2])}">${esc(c.row[1])}</button>`).join('');
      html += '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';

  if (conflictCells) {
    html += `<p class="tt-conflict-note">⚠ <b>${conflictCells}</b> zaman hücresinde birden çok ders çakışıyor. Çipe tıklayınca arama daralır.</p>`;
  }
  wrap.innerHTML = html;

  wrap.querySelectorAll('.tt-chip').forEach((ch) => {
    ch.addEventListener('click', () => {
      $('#q').value = ch.dataset.code;
      applyFilters();
    });
  });
}
