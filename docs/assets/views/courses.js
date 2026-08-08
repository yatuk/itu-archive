// Dersler görünümü: dönem arama/filtre/sıralama, satır detayı, CSV indirme ve
// paylaşılabilir URL durumu. Tüm veri state.rows (arama indeksi) üzerinden
// çalışır; tam kayıt yalnızca detay açılınca ilgili branş dosyasından gelir.

import { $, getJSON, esc, fold, debounce, downloadCSV, setStatus } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillBar } from '../core/chart.js';
import { fillRows } from '../core/table.js';

const PAGE = 200;

export function initCourses() {
  $('#q').addEventListener('input', debounce(applyFilters, 120));
  $('#f-branch').addEventListener('change', applyFilters);
  $('#f-day').addEventListener('change', applyFilters);
  $('#f-open').addEventListener('change', applyFilters);
  $('#f-term').addEventListener('change', () => loadTerm($('#f-term').value));
  $('#more').addEventListener('click', () => renderRows(true));
  $('#csv').addEventListener('click', exportCSV);
  $('#tt-toggle').addEventListener('click', toggleTimetable);
  wireSort();
}

export async function loadTerm(slug) {
  state.termSlug = slug;
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

    applyFilters();
  } catch (e) {
    setStatus($('#resultline'), `veri yüklenemedi (${e.message})`, { error: true });
  }
}

// Kontenjan zaman serisini arka planda yükler; detay satırındaki dolma
// süresi bilgisi buradan gelir.
export async function loadQuota(slug) {
  try {
    const sum = await getJSON(`data/quota/${slug}.json`);
    state.quota = new Map(sum.courses.map((c) => [c.crn, c]));
  } catch {
    state.quota = null; // bu dönem için henüz ölçüm yok
  }
}

// Dolma süresini insanca yazar: "kayıt başladıktan 3 sa 20 dk sonra doldu".
function fillNote(crn) {
  const q = state.quota?.get(crn);
  if (!q || !q.filledAt) return '';
  const m = q.fillMinutes;
  if (!m) return 'ilk ölçümde zaten doluydu';
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const span = h ? `${h} sa${rest ? ` ${rest} dk` : ''}` : `${rest} dk`;
  return `ilk ölçümden ${span} sonra doldu`;
}

export function applyFilters() {
  const q = fold($('#q').value.trim());
  const branch = $('#f-branch').value;
  const day = $('#f-day').value;
  const openOnly = $('#f-open').checked;
  const terms = q ? q.split(/\s+/) : [];

  state.filtered = state.rows.filter((r, i) => {
    // r = [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan]
    if (branch && r[3] !== branch) return false;
    if (day && !r[5].includes(day)) return false;
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
    ? `<b>${n}</b> şube · ${state.meta.courses} ders · ${state.meta.branches.length} branş`
    : `<b>${n}</b> / ${total} şube eşleşti`;
  if (ttOn) renderTimetable();
  saveState();
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

// Görünen satırları CSV olarak indirir (Excel için BOM'lu).
function exportCSV() {
  const headers = ['CRN', 'Ders Kodu', 'Branş', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Kontenjan', 'Yazılan', 'Doluluk (%)'];
  const rows = state.filtered.map((r) => [
    r[0], r[1], r[3], r[2], r[4], r[5], r[6], r[7],
    r[6] ? Math.round((r[7] / r[6]) * 100) : '',
  ]);
  downloadCSV(`dersler-${state.termSlug}.csv`, headers, rows);
}

function renderRows(append) {
  const tbody = $('#rows');
  const slice = state.filtered.slice(state.shown, state.shown + PAGE);

  if (!slice.length && !state.shown) {
    fillRows(tbody, [], null, { empty: 'eşleşen ders yok', colspan: 8 });
    $('#more').hidden = true;
    return;
  }

  const frag = fillRows(tbody, slice, (r) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = r;
    return `
      <td class="crn">${esc(crn)}</td>
      <td class="code"><b>${esc(code)}</b><small>${esc(branch)}</small></td>
      <td><button class="row-toggle" type="button" aria-expanded="false">${esc(name)}</button></td>
      <td>${esc(instructor || '—')}</td>
      <td class="when">${esc(when || '—')}</td>
      <td class="num">${cap}</td>
      <td class="num">${enr}</td>
      <td class="num">${fillBar(cap, enr)}</td>`;
  }, { append });

  if (frag) {
    frag.querySelectorAll('tr').forEach((tr) => {
      tr.querySelector('.row-toggle').addEventListener('click', (ev) => toggleDetail(tr, ev.currentTarget));
    });
  }

  state.shown += slice.length;
  $('#more').hidden = state.shown >= state.filtered.length;
  $('#more').textContent = `daha fazla göster (${state.filtered.length - state.shown} kaldı)`;
}

async function toggleDetail(tr, btn) {
  const next = tr.nextElementSibling;
  if (next && next.classList.contains('detail')) {
    next.remove();
    tr.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    return;
  }
  tr.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');

  const det = document.createElement('tr');
  det.className = 'detail';
  det.innerHTML = '<td colspan="8">yükleniyor…</td>';
  tr.after(det);

  const crn = tr.cells[0].textContent.trim();
  const branch = tr.cells[1].querySelector('small').textContent;
  let sec = null;
  try {
    const list = await getJSON(`data/terms/${state.termSlug}/branches/${branch}.json`);
    sec = list.find((s) => s.crn === crn);
  } catch { /* ağ hatası: aşağıda "detay yok" gösterilir */ }

  if (!sec) {
    det.innerHTML = '<td colspan="8">detay bulunamadı</td>';
    return;
  }

  const sessions = sec.days.map((d, i) => [d, sec.times[i] || '', sec.rooms[i] || '', sec.buildings[i] || '']
    .filter(Boolean).join(' · ')).join('\n');

  det.innerHTML = `<td colspan="8"><dl>
    ${field('Öğretim yöntemi', sec.method)}
    ${field('Seviye', sec.level)}
    ${field('Kontenjan', fillNote(crn))}
    ${sessions ? field('Oturumlar', sessions) : ''}
    ${sec.prereq && sec.prereq !== '-' ? field('Önşart', sec.prereq) : ''}
    ${sec.classReq && sec.classReq !== '-' ? field('Sınıf / kredi önşartı', sec.classReq) : ''}
    ${sec.reserved && sec.reserved !== '-' ? field('Rezervasyon', sec.reserved) : ''}
    ${sec.programs.length ? `<dt>Alabilen programlar</dt><dd class="tags">${sec.programs.map((p) => `<span>${esc(p)}</span>`).join('')}</dd>` : ''}
  </dl></td>`;
}

const field = (k, v) => (v ? `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>` : '');

// Dönem + arama + filtre durumunu URL'ye yazar; bağlantı paylaşılabilir olur.
function saveState() {
  const p = new URLSearchParams();
  if (state.termSlug) p.set('term', state.termSlug);
  const q = $('#q').value.trim();
  if (q) p.set('q', q);
  if ($('#f-branch').value) p.set('branch', $('#f-branch').value);
  if ($('#f-day').value) p.set('day', $('#f-day').value);
  if ($('#f-open').checked) p.set('open', '1');
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
  history.replaceState(null, '', url);
}

/* ---------- zaman çizelgesi ---------- */

let ttOn = false;

// Çizelge ile tablo arasında geçiş. Filtreler/arama uygulanınca çizelge
// state.filtered üzerinden yeniden çizilir.
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
  const t = buildTimetable(state.filtered);
  if (!t) {
    wrap.innerHTML = '<p class="empty">filtrelenen şubelerde zaman bilgisi yok</p>';
    return;
  }
  const { startSlot, nSlots, grid, all } = t;

  let conflictCells = 0;
  let html = `<p class="tt-note"><b>${all.length}</b> oturum · <b>${state.filtered.length}</b> şube</p>`;
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
