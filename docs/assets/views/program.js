// Program görünümü: seçilen şubelerden haftalık ders programı kurucu.
//
// Akış: DERSLER'de şubeler seçilip "programa gönder" ile eklenir, buradaki arama
// (combobox) ile şube eklenir, ya da "Ders Ekle" ile bölüm → ders → CRN zinciri
// kurulur. Birden fazla program (liste) tutulur, localStorage'da saklanır.
// Seçili liste + çakışma listesi solda, haftalık ızgara sağda.

import { $, getJSON, esc, fold, debounce, downloadCSV, downloadICS, parseTurkishDate, trNum } from '../core/utils.js';
import { state, indexReady } from '../core/store.js';
import { fillBar } from '../core/chart.js';
import { buildTimetable, openDetail } from './courses.js';
import * as fav from '../core/favorites.js';
import { toast } from '../core/toast.js';
import { confirmDialog, promptDialog } from '../core/dialog.js';

let term = null;
let rows = [];
let inited = false;
let hits = [];
let openMenuKey = null;
let dragFrom = null;
// Paylaşılan URL'deki crns listesi yalnızca bir kez uygulanır.
let crnsApplied = false;

// --- çoklu program (liste) ---
const PROG_KEY = 'itu-programs';
const PASTELS = ['#5b8def', '#8a6fe8', '#2ecc9f', '#e8a04c', '#e86f8a', '#5bb8e8', '#a0c94c', '#c96fe8', '#e8c94c', '#4cc9c9'];

function loadPrograms() {
  try {
    const p = JSON.parse(localStorage.getItem(PROG_KEY) || 'null');
    if (p && Array.isArray(p.programs) && p.programs.length) return p;
  } catch {}
  return { programs: [{ id: 1, name: 'Program 1', items: [] }], active: 1 };
}
function savePrograms(ps) {
  try { localStorage.setItem(PROG_KEY, JSON.stringify(ps)); } catch {}
}
function progItems() {
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  return p ? p.items.filter((f) => f.term === term) : [];
}
function setProgItems(items) {
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  if (!p) return;
  p.items = [
    ...p.items.filter((f) => f.term !== term),
    ...items.map((i) => ({ ...i, term })),
  ];
  savePrograms(ps);
}
// Aktif programa kayıt ekler (varsa atlar). Dönen değer: eklendi mi.
function addToActive(branch, crn) {
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  if (!p) return false;
  const key = fav.favKeyOf(branch, crn);
  if (p.items.some((f) => f.term === term && fav.favKeyOf(f.branch, f.crn) === key)) return false;
  p.items.push({ term, branch, crn });
  savePrograms(ps);
  return true;
}
function renderProgSelector() {
  const ps = loadPrograms();
  const sel = $('#p-prog');
  sel.innerHTML = ps.programs.map((p, i) =>
    `<option value="${p.id}">${esc(p.name)}</option>`).join('');
  sel.value = String(ps.active);
  const p = ps.programs.find((x) => x.id === ps.active);
  $('#p-credits-val').textContent = p ? (p.credits != null ? p.credits : '—') : '—';
  render();
}

export function initProgram() {
  if (inited) return;
  $('#p-term').addEventListener('change', (e) => loadTerm(e.target.value));
  $('#p-q').addEventListener('input', debounce(search, 120));
  $('#p-q').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (hits[0]) addRow(hits[0]); }
    else if (e.key === 'Escape') hideResults();
  });
  $('#p-results').addEventListener('click', (e) => {
    const b = e.target.closest('.p-result');
    if (b) { addRow(hits[Number(b.dataset.i)]); hideResults(); $('#p-q').value = ''; }
  });
  $('#p-addrow').addEventListener('click', addRowEntry);
  $('#p-dl').addEventListener('click', downloadPNG);
  $('#p-prog').addEventListener('change', (e) => { const ps = loadPrograms(); ps.active = Number(e.target.value); savePrograms(ps); renderProgSelector(); });
  $('#p-prog-new').addEventListener('click', progNew);
  $('#p-prog-copy').addEventListener('click', progCopy);
  $('#p-prog-del').addEventListener('click', progDel);
  $('#p-prog-rename').addEventListener('click', progRename);
  $('#p-clear').addEventListener('click', () => {
    // Tek tıkla program silinmesin — onay iste (Critique P2).
    confirmDialog({
      title: 'Programı temizle',
      message: `${progItems().length} şube silinecek. Geri alınamaz.`,
      okLabel: 'Temizle',
      danger: true,
    }).then((yes) => {
      if (!yes) return;
      setProgItems([]);
      renderProgSelector();
      toast('Program temizlendi');
    });
  });
  $('#p-csv').addEventListener('click', exportCSV);
  $('#p-ics').addEventListener('click', exportScheduleICS);
  $('#p-share').addEventListener('click', share);
  $('#p-obs').addEventListener('click', (e) => { e.preventDefault(); showOBS(); });
  $('#p-obs').addEventListener('mouseenter', () => showTip());
  $('#p-obs').addEventListener('mouseleave', () => hideTip());
  $('#p-favs').addEventListener('click', addFavorites);
  $('#p-full').addEventListener('change', render);
  document.addEventListener('click', () => { if (openMenuKey) closeMenus(); });
  inited = true;
  maybeOnboard();
}

// --- program yönetimi ---

function progNew() {
  const ps = loadPrograms();
  const id = Math.max(0, ...ps.programs.map((p) => p.id)) + 1;
  const name = `Program ${ps.programs.length + 1}`;
  ps.programs.push({ id, name, items: [] });
  ps.active = id;
  savePrograms(ps);
  renderProgSelector();
  toast(`Yeni program "${name}" oluşturuldu`);
}
function progCopy() {
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  if (!p) return;
  const id = Math.max(0, ...ps.programs.map((x) => x.id)) + 1;
  ps.programs.push({ id, name: p.name + ' (kopya)', items: JSON.parse(JSON.stringify(p.items)) });
  ps.active = id;
  savePrograms(ps);
  renderProgSelector();
  toast('Program kopyalandı');
}
function progDel() {
  const ps = loadPrograms();
  if (ps.programs.length <= 1) { toast('En az bir program kalmalı', { kind: 'warn' }); return; }
  const i = ps.programs.findIndex((x) => x.id === ps.active);
  if (i < 0) return;
  // Native confirm yerine stillenmiş onay (Critique P2 — tema dışı diyalog yok).
  confirmDialog({
    title: 'Programı sil',
    message: `"${ps.programs[i].name}" silinsin mi?`,
    okLabel: 'Sil',
    danger: true,
  }).then((yes) => {
    if (!yes) return;
    ps.programs.splice(i, 1);
    ps.active = ps.programs[0].id;
    savePrograms(ps);
    renderProgSelector();
    toast('Program silindi');
  });
}
function progRename() {
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  if (!p) return;
  promptDialog({
    title: 'Programı yeniden adlandır',
    message: 'Yeni program adı:',
    value: p.name,
    validate: (v) => v.trim().length > 0,
  }).then((name) => {
    if (name == null) return;
    p.name = name.trim();
    savePrograms(ps);
    renderProgSelector();
    toast('Program yeniden adlandırıldı');
  });
}

// --- ders ekleme (bölüm → ders → CRN zinciri) ---

let rowIdx = 0;
function addRowEntry() {
  const wrap = $('#p-rows');
  const id = ++rowIdx;
  const div = document.createElement('div');
  div.className = 'p-row';
  div.dataset.id = id;
  div.innerHTML = `
    <select class="p-row-branch" data-id="${id}"><option value="">Bölüm seç</option></select>
    <select class="p-row-course" data-id="${id}" disabled><option value="">Ders seç</option></select>
    <select class="p-row-crn" data-id="${id}" disabled><option value="">Şube (CRN) seç</option></select>
    <button type="button" class="p-row-del p-danger" data-id="${id}">Dersi Sil</button>`;
  wrap.appendChild(div);
  const branchSel = div.querySelector('.p-row-branch');
  const branches = [...new Set(rows.map((r) => r[3]))].sort();
  branchSel.innerHTML = '<option value="">Bölüm seç</option>' +
    branches.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  branchSel.addEventListener('change', () => fillCourseSelect(id, branchSel.value));
  div.querySelector('.p-row-del').addEventListener('click', () => div.remove());
  branchSel.focus();
}

function fillCourseSelect(id, branch) {
  const div = document.querySelector(`.p-row[data-id="${id}"]`);
  if (!div) return;
  const courseSel = div.querySelector('.p-row-course');
  const crnSel = div.querySelector('.p-row-crn');
  courseSel.innerHTML = '<option value="">Ders seç</option>';
  crnSel.innerHTML = '<option value="">Şube (CRN) seç</option>';
  courseSel.disabled = !branch;
  crnSel.disabled = true;
  if (!branch) return;
  const codes = [...new Set(rows.filter((r) => r[3] === branch).map((r) => r[1]))].sort();
  courseSel.innerHTML = '<option value="">Ders seç</option>' +
    codes.map((c) => {
      const name = rows.find((r) => r[1] === c)?.[2] || '';
      return `<option value="${esc(c)}">${esc(c)} - ${esc(name)}</option>`;
    }).join('');
  courseSel.addEventListener('change', () => fillCRNSelect(id, branch, courseSel.value));
}

function fillCRNSelect(id, branch, code) {
  const div = document.querySelector(`.p-row[data-id="${id}"]`);
  if (!div) return;
  const crnSel = div.querySelector('.p-row-crn');
  crnSel.innerHTML = '<option value="">Şube (CRN) seç</option>';
  crnSel.disabled = !code;
  if (!code) return;
  const secs = rows.filter((r) => r[3] === branch && r[1] === code);
  crnSel.innerHTML = '<option value="">Şube (CRN) seç</option>' +
    secs.map((r) => `<option value="${esc(r[0])}">${esc(r[0])}: ${esc(r[5] || '—')} · ${esc(r[4] || '—')} · ${r[6] ? `${r[7]}/${r[6]}` : '—'}</option>`).join('');
  // CRN seçilince ekle ve satırı kaldır.
  crnSel.addEventListener('change', () => {
    if (!crnSel.value) return;
    const r = rows.find((x) => x[0] === crnSel.value);
    if (r) {
      const added = addToActive(r[3], r[0]);
      toast(added ? `${r[1]} eklendi` : `${r[1]} zaten listede`, { kind: added ? 'ok' : 'warn' });
      render();
      renderProgSelector();
    }
    div.remove();
  });
}

export async function onShow() {
  initProgram();
  if (!state.index) await indexReady;
  if (!state.index) {
    toast('Veriler yüklenemedi, sayfayı yenile.', { kind: 'err' });
    return;
  }
  const params = new URLSearchParams(location.search);
  if (!term) {
    const sel = $('#p-term');
    sel.innerHTML = state.index.terms
      .filter((t) => !t.missing)
      .map((t) => `<option value="${t.slug}">${t.label}${t.live ? ' · canlı' : ''}</option>`).join('');
    sel.value = state.index.currentSlug;
    if (params.has('term')) {
      const want = params.get('term');
      if ([...sel.options].some((o) => o.value === want)) sel.value = want;
    }
    term = sel.value;
  }
  await loadTerm(term);
  if (params.has('crns') && !crnsApplied) {
    crnsApplied = true;
    const list = params.get('crns').split(',').map((s) => s.trim()).filter(Boolean);
    let added = 0;
    for (const crn of list) {
      const r = rows.find((x) => x[0] === crn);
      if (r && addToActive(r[3], crn)) added++;
    }
    if (added) toast(`${added} şube paylaşılan programdan yüklendi`);
  }
  renderProgSelector();
  render();
}

async function loadTerm(slug) {
  term = slug;
  try {
    rows = await getJSON(`data/terms/${slug}/search.json`);
  } catch (e) {
    rows = [];
    toast(`Dönem verisi yüklenemedi (${e.message})`, { kind: 'err' });
  }
  render();
}

function search() {
  const q = fold($('#p-q').value.trim());
  const box = $('#p-results');
  if (q.length < 2) { hideResults(); return; }
  const hay = rows.map((r) => fold(`${r[0]} ${r[1]} ${r[2]} ${r[4]}`));
  hits = [];
  for (let i = 0; i < rows.length && hits.length < 12; i++) {
    if (hay[i].includes(q)) hits.push(rows[i]);
  }
  box.hidden = false;
  box.innerHTML = hits.map((r, idx) => `
    <button type="button" class="p-result" data-i="${idx}">
      <b>${esc(r[1])}</b><span>${esc(r[2])}</span>
      <em>${esc(r[5] || '—')}</em><em>${r[6] ? `${r[7]}/${r[6]}` : '—'}</em>
    </button>`).join('') || '<p class="empty">eşleşme yok</p>';
}

function hideResults() {
  $('#p-results').hidden = true;
  $('#p-results').innerHTML = '';
}

function addRow(r) {
  const added = addToActive(r[3], r[0]);
  toast(added ? `${r[1]} eklendi` : `${r[1]} zaten listede`, { kind: added ? 'ok' : 'warn' });
  render();
  renderProgSelector();
}

function currentItems() {
  const recs = progItems();
  const items = [];
  for (const rec of recs) {
    const r = rows.find((x) => x[3] === rec.branch && x[0] === rec.crn);
    if (r) items.push({ rec, row: r });
  }
  return items;
}

function render() {
  const items = currentItems();
  $('#p-count').textContent = items.length;
  renderCRNStrip(items);
  renderList(items);
  renderGrid(items.map((i) => i.row));
  renderSummary(items);
  updateCredits(items);
  renderCredits(items); // satır başına "3 kr · 6 AKTS" (katalog asenkron)
  updateBookmarklet(items);
}

// Seçili şube satırlarının altına küçük punto kredi/AKTS: "3 kr · 6 AKTS".
// Katalog verisi olmayan branşlar sessizce atlanır.
async function renderCredits(items) {
  const box = $('#p-list');
  if (!items.length) return;
  const cache = new Map();
  for (let i = 0; i < items.length; i++) {
    const { row } = items[i];
    const branch = row[3];
    let map = cache.get(branch);
    if (map === undefined) {
      map = await getJSON(`data/catalog/${branch}.json`).catch(() => null);
      cache.set(branch, map);
    }
    const c = map && map[row[1]] && map[row[1]].credits;
    const item = box.children[i];
    if (!item || !c) continue;
    const parts = [];
    if (c.local != null) parts.push(`${trNum(c.local)} kr`);
    if (c.ects) parts.push(`${trNum(c.ects)} AKTS`);
    if (!parts.length) continue;
    const small = document.createElement('small');
    small.className = 'p-cred';
    small.textContent = parts.join(' · ');
    const code = item.querySelector('.p-code');
    if (code && !code.querySelector('.p-cred')) code.appendChild(small);
  }
}

function renderCRNStrip(items) {
  const strip = $('#p-crnstrip');
  const list = $('#p-crnlist');
  if (!items.length) { strip.hidden = true; list.innerHTML = ''; return; }
  strip.hidden = false;
  list.innerHTML = items.map(({ row }) => `<span class="p-crnchip">${esc(row[0])}</span>`).join('');
}

function renderList(items) {
  const box = $('#p-list');
  const markFull = $('#p-full').checked;
  box.innerHTML = items.map(({ rec, row }, idx) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = row;
    const full = cap > 0 && enr >= cap;
    const key = fav.favKeyOf(branch, crn);
    const speed = fillSpeedNote(crn);
    return `<div class="p-item${markFull && full ? ' p-full' : ''}" draggable="true" data-idx="${idx}" data-key="${esc(key)}">
      <span class="p-grip" aria-hidden="true">⋮⋮</span>
      <span class="p-crn">${esc(crn)}${rec.backup ? `<small class="p-backup">yedek: ${esc(rec.backup)}</small>` : ''}</span>
      <div class="p-code"><b>${esc(code)}</b><small>${esc(name)}${speed ? ` · ${esc(speed)}` : ''}</small></div>
      <span class="p-when">${esc(when || '—')}</span>
      <span class="p-fill">${cap ? fillBar(cap, enr) : '—'}</span>
      <button type="button" class="p-menu" data-menu="${esc(key)}" aria-label="${esc(code)} için eylemler" aria-haspopup="menu">⋮</button>
      <div class="p-menu-pop" data-pop="${esc(key)}" hidden></div>
    </div>`;
  }).join('') || '<p class="empty">Henüz ders eklenmedi. "Ders Ekle" ile bölüm → ders → CRN seç ya da DERSLER\'de seçip "programa gönder".</p>';

  box.querySelectorAll('.p-item').forEach((item) => {
    const idx = Number(item.dataset.idx);
    const { row } = items[idx];
    item.addEventListener('click', (ev) => {
      if (ev.target.closest('.p-menu')) return;
      openDetail(row, term);
    });
    item.addEventListener('dragstart', (ev) => {
      dragFrom = idx;
      item.classList.add('drag');
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', String(idx));
    });
    item.addEventListener('dragover', (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; item.classList.add('over'); });
    item.addEventListener('dragleave', () => item.classList.remove('over'));
    item.addEventListener('drop', (ev) => {
      ev.preventDefault();
      item.classList.remove('over');
      const from = Number(ev.dataTransfer.getData('text/plain') || dragFrom);
      reorderSchedule(from, idx);
    });
    item.addEventListener('dragend', () => { item.classList.remove('drag', 'over'); dragFrom = null; });
  });

  box.querySelectorAll('.p-menu').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const key = btn.dataset.menu;
      const pop = box.querySelector(`[data-pop="${key}"]`);
      if (openMenuKey === key && !pop.hidden) { closeMenus(); return; }
      closeMenus();
      openMenuKey = key;
      pop.hidden = false;
      const rec = items.find((it) => fav.favKeyOf(it.rec.branch, it.rec.crn) === key);
      pop.innerHTML = `
        <button type="button" data-act="detail" data-key="${key}">detay</button>
        <button type="button" data-act="copy" data-key="${key}">CRN kopyala</button>
        <button type="button" data-act="obs" data-key="${key}">OBS'de ara</button>
        ${rec && rec.rec.backup
          ? `<button type="button" data-act="rmbackup" data-key="${key}">yedek CRN kaldır</button>`
          : `<button type="button" data-act="backup" data-key="${key}">yedek CRN belirle</button>`}
        <button type="button" data-act="remove" data-key="${key}">çıkar</button>`;
    });
  });
  box.querySelectorAll('[data-act]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const [br, cr] = b.dataset.key.split('|');
      const row = rows.find((x) => x[3] === br && x[0] === cr);
      if (b.dataset.act === 'remove') {
        // 8 sn içinde "geri al" ile geri getirilebilir (Critique P2).
        const before = progItems();
        setProgItems(currentItems().filter((i) => fav.favKeyOf(i.rec.branch, i.rec.crn) !== key).map((i) => i.rec));
        render(); renderProgSelector();
        toast(`${cr} çıkarıldı`, {
          action: { label: 'geri al', fn: () => { setProgItems(before); render(); renderProgSelector(); } },
        });
      } else if (b.dataset.act === 'copy') {
        copyText(cr); toast(`CRN ${cr} kopyalandı`);
      } else if (b.dataset.act === 'detail') {
        if (row) openDetail(row, term);
      } else if (b.dataset.act === 'obs') {
        window.open('https://obs.itu.edu.tr/public/DersProgram', '_blank', 'noopener');
      } else if (b.dataset.act === 'backup') {
        setBackup(br, cr);
      } else if (b.dataset.act === 'rmbackup') {
        removeBackup(br, cr);
      }
      closeMenus();
    });
  });
}

function reorderSchedule(from, to) {
  if (from === to) return;
  const items = currentItems();
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return;
  const moved = items[from].rec;
  const vis = currentItems().map((i) => i.rec);
  vis.splice(from, 1);
  vis.splice(to, 0, moved);
  setProgItems(vis);
  render();
  toast('Sıralama güncellendi');
}

// Renk atama: aynı ders kodu aynı rengi kullanır (sabit), çakışma kırmızı kenar.
const colorFor = (() => {
  const map = new Map();
  let next = 0;
  return (code) => {
    if (!map.has(code)) { map.set(code, PASTELS[next % PASTELS.length]); next++; }
    return map.get(code);
  };
})();

// Blok zeminine göre okunur yazı rengi: parlak zemin → koyu yazı, koyu zemin →
// açık yazı (WCAG parlaklık formülü). Blok-yazı kontrastı ≥4.5:1 tutulur.
function fgFor(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.4 ? '#1e2b23' : '#ffffff';
}

function renderGrid(itemRows) {
  const wrap = $('#p-grid');
  const t = buildTimetable(itemRows);
  if (!t || !t.all.length) {
    wrap.innerHTML = '<p class="empty">Zaman bilgisi olan ders eklenmedi.</p>';
    return;
  }
  placedRefs = [];
  const { startSlot, nSlots } = t;
  const ROW = 28;
  const H = nSlots * ROW;
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const TTD = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const fmtMin = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const byDay = days.map(() => []);
  for (const s of t.all) {
    const di = days.indexOf(s.day);
    if (di >= 0) byDay[di].push(s);
  }

  const place = (events) => {
    const evs = events.slice().sort((a, b) => a.start - b.start || a.end - b.end);
    const lanes = [];
    const out = [];
    for (const ev of evs) {
      let lane = lanes.findIndex((end) => end <= ev.start);
      if (lane === -1) { lane = lanes.length; lanes.push(ev.end); } else lanes[lane] = ev.end;
      out.push({ ...ev, lane });
    }
    const laneCount = Math.max(1, lanes.length);
    out.forEach((o) => { o.laneCount = laneCount; });
    return out;
  };

  let html = `<p class="tt-note"><b>${t.all.length}</b> oturum · <b>${itemRows.length}</b> şube</p>`;
  html += `<div class="tt-scroll"><div class="tt-grid">`;
  html += `<div class="tt-head tt-corner"></div>${TTD.map((d) => `<div class="tt-head tt-dayhead">${d}</div>`).join('')}`;
  html += `<div class="tt-timecol">`;
  for (let si = 0; si < nSlots; si++) html += `<div class="tt-timeslot">${fmtMin(startSlot + si * 30)}</div>`;
  html += `</div>`;
  for (let di = 0; di < 7; di++) {
    const placed = place(byDay[di]);
    html += `<div class="tt-day" style="height:${H}px">`;
    for (const p of placed) {
      const top = ((p.start - startSlot) / 30) * ROW;
      const height = Math.max(20, ((p.end - p.start) / 30) * ROW);
      const w = 100 / p.laneCount;
      const left = p.lane * w;
      const conflict = p.laneCount > 1;
      const color = colorFor(p.row[1]);
      const fg = fgFor(color);
      placedRefs.push(p.row);
      html += `<button type="button" class="tt-block${conflict ? ' tt-block-conf' : ''}" style="top:${top}px;left:${left}%;width:${w}%;height:${height}px;--ttc:${color};--tt-fg:${fg}" title="${esc(p.row[1])} · ${esc(p.row[5])}">
        <span class="tt-time">${fmtMin(p.start)} - ${fmtMin(p.end)}</span>
        <span class="tt-code">${esc(p.row[1])}</span>
        ${conflict ? '<span class="tt-conf-icon" title="Çakışma">⚠</span>' : ''}
      </button>`;
    }
    html += `</div>`;
  }
  html += `</div></div>`;
  wrap.innerHTML = html;

  wrap.querySelectorAll('.tt-block').forEach((b, i) => {
    b.addEventListener('click', () => openDetail(placedRefs[i], term));
  });
}

let placedRefs = [];

function renderSummary(items) {
  const box = $('#p-summary');
  const full = items.filter(({ row }) => row[6] > 0 && row[7] >= row[6]).length;
  const t = buildTimetable(items.map((i) => i.row));
  const pairs = new Set();
  if (t) {
    for (const col of t.grid) for (const cell of col) {
      const codes = [...new Set(cell.map((c) => c.row[1]))].sort();
      if (codes.length > 1) pairs.add(codes.join(' × '));
    }
  }
  let html = `<p><b>${items.length}</b> şube · <b>${t ? t.all.length : 0}</b> oturum</p>`;
  if (full) html += `<p class="p-warn">⚠ ${full} dolu şube</p>`;
  if (pairs.size) {
    html += `<p class="p-conf">⚠ Çakışan dersler:</p><ul class="p-conf-list">${[...pairs].map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`;
  }
  // Faz 4.1: final çakışması — exams verisi yüklenmişse asenkron ekler.
  loadFinalsNote(items, box);
  // Faz 4.2: vize haftası yoğunluğu — katalog planlarından asenkron sayar.
  loadMidtermNote(items, box);
  box.innerHTML = html;
}

let finalsCache = null;
async function loadFinalsNote(items, box) {
  try {
    if (finalsCache === null) {
      finalsCache = await getJSON(`data/exams/${term}.json`).catch(() => null);
    }
    const exams = finalsCache ? finalsCache.exams : null;
    const crns = items.map((i) => i.row[0]);
    const conf = finalsConflict(exams, crns);
    if (!conf.length) return;
    const pairs = conf.map(([a, b]) => `${esc(a.code)} × ${esc(b.code)} (${esc(a.date)} ${esc(a.time)})`);
    const wrap = document.createElement('div');
    wrap.className = 'p-conf';
    wrap.innerHTML = `⚠ Final çakışması:<ul class="p-conf-list">${pairs.map((p) => `<li>${p}</li>`).join('')}</ul>`;
    box.appendChild(wrap);
  } catch { /* finals verisi yoksa sessiz */ }
}

// Katalogdaki haftalık konulardan ara sınav haftalarını sayar: "Hafta 7 (4)".
// course-detail.js'teki vize deseniyle aynı (/ara\s*sınav/i). Saf — test edilebilir.
export function midtermWeeks(records) {
  const counts = new Map();
  for (const rec of records || []) {
    for (const topic of rec?.weeklyTopics || []) {
      if (!/ara\s*sınav/i.test(topic)) continue;
      const week = (String(topic).split(' — ')[0] || topic).trim();
      counts.set(week, (counts.get(week) || 0) + 1);
    }
  }
  return counts;
}

// Faz 4.2: seçili şubelerin katalog planlarından "Vize yoğunluğu" satırı üretir.
// Katalog/branş dosyası yoksa sessizce atlanır (creditTotals deseni).
let midtermCache = new Map();
async function loadMidtermNote(items, box) {
  try {
    const records = [];
    for (const { row } of items) {
      const branch = row[3];
      if (!midtermCache.has(branch)) {
        midtermCache.set(branch, await getJSON(`data/catalog/${branch}.json`).catch(() => null));
      }
      const map = midtermCache.get(branch);
      if (map && map[row[1]]) records.push(map[row[1]]);
    }
    const mw = midtermWeeks(records);
    if (!mw.size) return;
    const parts = [...mw.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([k, n]) => `${k} (${n})`).join(' · ');
    const wrap = document.createElement('div');
    wrap.className = 'p-conf';
    wrap.innerHTML = `📝 Vize yoğunluğu: ${esc(parts)}`;
    box.appendChild(wrap);
  } catch { /* katalog yoksa sessiz */ }
}

function updateCredits(items) {
  // Kredi ve AKTS ayrı etiketle: "Kredi 12,5 · AKTS 15". Katalog verisi yoksa
  // dürüstçe "—" kalır. AKTS 30'u aşınca nötr amber rozet (kırmızı çakışma için).
  const el = $('#p-credits-val');
  const ps = loadPrograms();
  const p = ps.programs.find((x) => x.id === ps.active);
  if (p && p.credits != null) { el.textContent = p.credits; return; }
  el.textContent = items.length ? '—' : '—';
  if (!items.length) return;
  creditTotals(items).then((r) => {
    if (!r.ectsKnown && !r.localKnown) return;
    const parts = [];
    if (r.localKnown) parts.push(`Kredi ${trNum(r.local)}${r.localKnown < r.all ? '+' : ''}`);
    if (r.ectsKnown) parts.push(`AKTS ${trNum(r.ects)}`);
    let txt = parts.join(' · ');
    const unkLocal = r.all - r.localKnown;
    if (unkLocal > 0) txt += ` (${unkLocal} dersin kredisi bilinmiyor)`;
    if (r.ectsKnown && r.ects > 30) {
      el.innerHTML = `${esc(txt)} <span class="ects-warn" title="Toplam AKTS 30'u aşıyor">AKTS 30+</span>`;
    } else {
      el.textContent = txt;
    }
  }).catch(() => {});
}

// --- Faz 4: kayıt haftası yardımcıları ---

// Final çakışması: seçili şubelerin final sınavları aynı güne + örtüşen saate
// düşüyorsa döndürür. Veri examHay'dan değil, ham exams listesinden çözülür.
// Saf fonksiyon — test edilebilir.
export function finalsConflict(exams, crns) {
  const byCrn = new Map(crns.map((c) => [c, true]));
  const mine = (exams || []).filter((e) => byCrn.has(String(e.crn)));
  const out = [];
  for (let i = 0; i < mine.length; i++) {
    for (let j = i + 1; j < mine.length; j++) {
      const a = mine[i], b = mine[j];
      if (a.code === b.code) continue; // aynı dersin farklı şubesi finali çakışmaz
      if (!examOverlap(a, b)) continue;
      out.push([a, b]);
    }
  }
  return out;
}

// İki sınavın tarih+saat örtüşmesi: aynı gün ve "HH:MM-HH:MM" aralıkları çakışıyor.
export function examOverlap(a, b) {
  if (a.date !== b.date) return false;
  const ra = parseTimeRange(a.time), rb = parseTimeRange(b.time);
  if (!ra || !rb) return false;
  return ra[0] < rb[1] && rb[0] < ra[1];
}

// "09:00-11:00" → [540, 660]. Saf — testli.
export function parseTimeRange(t) {
  const m = String(t || '').match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])];
}

// Kredi/AKTS toplamları: seçili şubelerin branş dosyalarından yerel kredi ve
// ECTS'leri ayrı ayrı toplar. Katalogu olmayan branşlar sessizce atlanır;
// bilinmeyen sayısı (all - known) dışarıda bildirilir. Saf — test edilebilir.
export async function creditTotals(items) {
  const cache = new Map();
  let local = 0, ects = 0, localKnown = 0, ectsKnown = 0;
  for (const { row } of items) {
    const branch = row[3];
    let map = cache.get(branch);
    if (map === undefined) {
      map = await getJSON(`data/catalog/${branch}.json`).catch(() => null);
      cache.set(branch, map);
    }
    const ent = map && map[row[1]];
    if (ent && ent.credits) {
      if (ent.credits.local != null) { local += ent.credits.local; localKnown++; }
      if (ent.credits.ects) { ects += ent.credits.ects; ectsKnown++; }
    }
  }
  return { local, localKnown, ects, ectsKnown, all: items.length };
}

// Dolma hızı notu (Faz 4.4): quota kaydından "geçen sefer X sa sonra doldu".
export function fillSpeedNote(crn) {
  const q = state.quota?.get(String(crn));
  if (!q || !q.filledAt) return '';
  const m = q.fillMinutes;
  if (!m) return 'geçen sefer ilk ölçümde doluydu';
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const span = h ? `${h} sa${rest ? ` ${rest} dk` : ''}` : `${rest} dk`;
  return `geçen sefer ${span} sonra doldu`;
}

function addFavorites() {
  const favs = fav.loadFavorites().filter((f) => f.term === term);
  let added = 0;
  for (const f of favs) if (addToActive(f.branch, f.crn)) added++;
  toast(added ? `${added} favori programa eklendi` : 'Bu dönem için favori yok', { kind: added ? 'ok' : 'warn' });
  render(); renderProgSelector();
}

function currentCRNs() {
  return currentItems().map((i) => i.row[0]);
}

export function buildSnippet(crns) {
  const arr = crns.map((c) => `'${c}'`).join(',');
  return `!function(){var e=[${arr}];let t=document.querySelectorAll("input[type='number']"),n=0;t.forEach(t=>{(function e(t){let n=window.getComputedStyle(t);if("none"===n.display||"hidden"===n.visibility)return!1;let l=t.parentElement;for(;l;){let i=window.getComputedStyle(l);if("none"===i.display||"hidden"===i.visibility)return!1;l=l.parentElement}return!0})(t)&&n<e.length&&(t.value=e[n],t.dispatchEvent(new Event("input",{bubbles:!0})),n++)}),setTimeout(function(){let e=document.querySelector('button[type="submit"]:not([disabled])');e&&e.click(),setTimeout(function(){let e=document.querySelector(".card-footer.d-flex.justify-content-end");if(e){let t=e.getElementsByTagName("button");t.length>1&&t[1].click()}},50)},50)}();`;
}

function showOBS() {
  const items = currentItems();
  const crns = items.map((i) => i.row[0]);
  if (!crns.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  const code = buildSnippet(crns);
  const backups = items.filter((i) => i.rec.backup).map((i) => `${i.row[0]} → yedek: ${i.rec.backup}`);
  const box = $('#p-obs-code');
  box.hidden = false;
  box.innerHTML = `<h2 class="eyebrow">OBS kayıt sayfası için CRN doldurma</h2>
    <p>Bu kodu OBS'nin ders seçme sayfasında konsola yapıştırıp çalıştır, ya da tarayıcı yer imi olarak kaydet. ${crns.length} CRN doldurur.</p>
    ${backups.length ? `<p class="p-backup-note">Yedek CRN'ler: ${esc(backups.join(' · '))}</p>` : ''}
    <pre class="p-code"><code>${esc(code)}</code></pre>
    <button type="button" id="p-copy" class="btn-ghost">kopyala</button>`;
  $('#p-copy').addEventListener('click', () => { copyText(code); toast('CRN kodu kopyalandı'); });
}

// Bookmarklet href'ini seçili CRN'lerle tazele (her render'da çağrılır).
function updateBookmarklet(items) {
  const a = $('#p-obs');
  if (!a) return;
  const crns = items.map((i) => i.row[0]);
  if (!crns.length) {
    a.setAttribute('href', 'javascript:void(0)');
    a.classList.add('is-disabled');
    return;
  }
  a.classList.remove('is-disabled');
  // Bookmarklet: seçili CRN'ler gömülü. OBS kayıt sayfasında çalışır.
  a.setAttribute('href', 'javascript:' + buildSnippet(crns));
  a.title = 'Sürükleyip OBS kayıt ekranında tıklamanız yeterli';
}

// --- tooltip ---
// Onboarding balonu gösterilirken hover tooltip'i asla aynı anda tetiklenmez.
let onboardingShowing = false;

function showTip() {
  if (onboardingShowing) return;
  const el = $('#p-obs-tt');
  if (el) el.classList.add('show');
}
function hideTip() {
  const el = $('#p-obs-tt');
  if (el) el.classList.remove('show');
}

// İlk ziyarette onboarding balonu göster, 3sn sonra kapat ve bir daha gösterme.
function maybeOnboard() {
  let seen = false;
  try { seen = localStorage.getItem('crn_tooltip_seen') === 'true'; } catch {}
  if (seen) return;
  try { localStorage.setItem('crn_tooltip_seen', 'true'); } catch {}
  const el = $('#p-obs-onboard');
  if (!el) return;
  onboardingShowing = true;
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
    onboardingShowing = false;
  }, 3000);
}

function exportCSV() {
  const items = currentItems();
  if (!items.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  downloadCSV(`program-${term}.csv`,
    ['CRN', 'Ders Kodu', 'Bölüm', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Kontenjan', 'Yazılan'],
    items.map(({ row: r }) => [r[0], r[1], r[3], r[2], r[4], r[5], r[6], r[7]]));
  toast('CSV indirildi');
}

const P_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// Yerel saatten "YYYY-MM-DDTHH:MM:SS" (icsText'in zamanlı etkinlik biçimi).
function isoDT(d, h, min) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(h)}:${p(min)}:00`;
}

// Bu haftanın Pazartesi'si (Pazartesi ise bugün). Program .ics'inin DTSTART tabanı;
// kullanıcı takvim uygulamasında dönemin başlangıcına kaydırabilir.
function mondayOfThisWeek() {
  const now = new Date();
  const off = (now.getDay() + 6) % 7; // Pzt=0 … Paz=6
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - off);
}

// Faz 4.5c: seçili şubelerin oturumlarını haftalık yinelenen etkinlik olarak .ics'e
// dışa aktarır. Oturumlar buildTimetable'dan (gün + başlangıç/bitiş dakikası) çözülür;
// her oturum için bir VEVENT + RRULE:FREQ=WEEKLY (14 haftalık dönem varsayımı).
function exportScheduleICS() {
  const items = currentItems();
  const t = buildTimetable(items.map((i) => i.row));
  if (!t || !t.all.length) { toast('Zaman bilgisi olan ders yok', { kind: 'warn' }); return; }
  const monday = mondayOfThisWeek();
  const events = t.all.map((s) => {
    const day = P_DAYS.indexOf(s.day);
    if (day < 0) return null;
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day);
    const code = s.row[1];
    return {
      uid: `${code}-${s.day}-${s.start}`,
      title: `${code}: ${s.row[5]}`,
      startISO: isoDT(start, Math.floor(s.start / 60), s.start % 60),
      endISO: isoDT(start, Math.floor(s.end / 60), s.end % 60),
      rrule: 'FREQ=WEEKLY;COUNT=14',
      desc: `CRN ${s.row[0]}`,
    };
  }).filter(Boolean);
  downloadICS(`itu-program-${term}.ics`, events);
  toast('Program .ics indirildi');
}

// Takvimi PNG olarak indirir (canvas çizimi).
function downloadPNG() {
  const items = currentItems();
  if (!items.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  const wrap = $('#p-grid');
  const rect = wrap.getBoundingClientRect();
  if (rect.width < 100 || rect.height < 100) { toast('Takvim hazır değil', { kind: 'warn' }); return; }
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  // PNG çizimi aktif temanın token'larını kullanır (sabit #fff/#666 olmaz —
  // koyu temada açık zeminli çıktı sürpriz olmasın).
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  const bg = v('--bg') || '#ffffff';
  const fg = v('--fg') || '#1e2b23';
  const dim = v('--dim') || '#4c5f53';
  const line = v('--line') || '#dde4de';
  const red = v('--red') || '#ff4f6d';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, rect.width, rect.height);

  const t = buildTimetable(items.map((i) => i.row));
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const TTD = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const fmtMin = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const W = rect.width, H = rect.height;
  const timeW = 46, headH = 22, dayW = (W - timeW) / 7;
  const ROW = 28;
  const nSlots = t ? t.nSlots : 0;

  ctx.font = '11px sans-serif';
  ctx.fillStyle = dim;
  ctx.textAlign = 'center';
  ctx.fillText(fmtMin(t.startSlot), 0, headH + 10);
  TTD.forEach((d, di) => {
    ctx.fillStyle = fg;
    ctx.fillText(d, timeW + dayW * di + dayW / 2, 14);
    ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(timeW + dayW * di, headH); ctx.lineTo(timeW + dayW * di, H); ctx.stroke();
  });
  ctx.beginPath(); ctx.moveTo(timeW, headH); ctx.lineTo(W, headH); ctx.stroke();

  for (let si = 0; si <= nSlots; si++) {
    const y = headH + si * ROW;
    ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(timeW, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Bloklar
  const byDay = days.map(() => []);
  if (t) for (const s of t.all) {
    const di = days.indexOf(s.day);
    if (di >= 0) byDay[di].push(s);
  }
  const place = (events) => {
    const evs = events.slice().sort((a, b) => a.start - b.start || a.end - b.end);
    const lanes = [];
    const out = [];
    for (const ev of evs) {
      let lane = lanes.findIndex((end) => end <= ev.start);
      if (lane === -1) { lane = lanes.length; lanes.push(ev.end); } else lanes[lane] = ev.end;
      out.push({ ...ev, lane });
    }
    const laneCount = Math.max(1, lanes.length);
    out.forEach((o) => { o.laneCount = laneCount; });
    return out;
  };
  for (let di = 0; di < 7; di++) {
    const placed = place(byDay[di]);
    for (const p of placed) {
      const top = headH + ((p.start - t.startSlot) / 30) * ROW;
      const height = Math.max(14, ((p.end - p.start) / 30) * ROW);
      const w = dayW / p.laneCount;
      const x = timeW + di * dayW + p.lane * w;
      const color = colorFor(p.row[1]);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x + 1, top + 1, w - 2, height - 2);
      ctx.globalAlpha = 1;
      if (p.laneCount > 1) {
        ctx.strokeStyle = red;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, top + 1, w - 2, height - 2);
      }
      ctx.fillStyle = fgFor(color); // blok parlaklığına göre okunur metin
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(p.row[1], x + 4, top + 12);
      ctx.font = '8px sans-serif';
      ctx.fillText(`${fmtMin(p.start)}-${fmtMin(p.end)}`, x + 4, top + 22);
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `program-${term}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('PNG indirildi');
  }, 'image/png');
}

function share() {
  const items = currentItems();
  if (!items.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  const p = new URLSearchParams();
  if (term !== state.index?.currentSlug) p.set('term', term); // aktif dönemi yazma
  p.set('crns', items.map((i) => i.row[0]).join(','));
  copyText(`${location.origin}${location.pathname}?${p.toString()}#program`);
  toast('Paylaşım bağlantısı kopyalandı');
}

function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).catch(() => fallbackCopy(txt));
  } else fallbackCopy(txt);
}

// --- yedek CRN ---

function setBackup(branch, crn) {
  promptDialog({
    title: 'Yedek CRN',
    message: 'Yedek CRN girin (aynı ders koduna ait olmalı):',
    validate: (v) => v.trim().length > 0,
  }).then((input) => {
    if (!input) return;
    const backup = input.trim();
    const all = loadPrograms();
  const p = all.programs.find((x) => x.id === all.active);
  if (!p) return;
  const idx = p.items.findIndex((f) => f.term === term && f.branch === branch && f.crn === crn);
  if (idx < 0) return;
  const key = fav.favKeyOf(branch, backup);
  if (p.items.some((f) => f.term === term && fav.favKeyOf(f.branch, f.crn) === key)) {
    toast('Bu CRN zaten listede', { kind: 'warn' });
    return;
  }
  p.items[idx].backup = backup;
  savePrograms(all);
  toast(`Yedek CRN ${backup} eklendi`);
  loadTerm(term);
  });
}

function removeBackup(branch, crn) {
  const all = loadPrograms();
  const p = all.programs.find((x) => x.id === all.active);
  if (!p) return;
  const idx = p.items.findIndex((f) => f.term === term && f.branch === branch && f.crn === crn);
  if (idx < 0) return;
  const old = p.items[idx].backup;
  delete p.items[idx].backup;
  savePrograms(all);
  toast(`Yedek CRN ${old} kaldırıldı`);
  loadTerm(term);
}

function fallbackCopy(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch { /* güvenlik */ }
  ta.remove();
}

function closeMenus() {
  if (openMenuKey) {
    const pop = document.querySelector(`[data-pop="${openMenuKey}"]`);
    if (pop) pop.hidden = true;
    openMenuKey = null;
  }
}
