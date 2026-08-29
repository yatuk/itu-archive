// Program görünümü: seçilen şubelerden haftalık ders programı kurucu.
//
// Akış: DERSLER'de şubeler seçilip "programa gönder" ile eklenir, buradaki arama
// (combobox) ile şube eklenir, ya da "Ders Ekle" ile bölüm → ders → CRN zinciri
// kurulur. Birden fazla program (liste) tutulur, localStorage'da saklanır.
// Seçili liste + çakışma listesi solda, haftalık ızgara sağda.

import { $, getJSON, esc, fold, debounce, downloadCSV, downloadICS, parseTurkishDate, trNum, copyText } from '../core/utils.js?v=de58f9ba3069';
import { state, indexReady } from '../core/store.js?v=de58f9ba3069';
import { quotaDisplay } from '../core/chart.js?v=de58f9ba3069';
import { buildTimetable, parseWhen, openDetail } from './courses.js?v=de58f9ba3069';
import * as fav from '../core/favorites.js?v=de58f9ba3069';
import { toast } from '../core/toast.js?v=de58f9ba3069';
import { confirmDialog, promptDialog } from '../core/dialog.js?v=de58f9ba3069';
import { I18N } from '../i18n.js?v=de58f9ba3069';
import { readLocalState, writeLocalState, isPlainObject } from '../core/persistence.js?v=de58f9ba3069';

let term = null;
let rows = [];
let inited = false;
let hits = [];
let openMenuKey = null;
let dragFrom = null;
// Paylaşılan URL'deki crns listesi yalnızca bir kez uygulanır.
let crnsApplied = false;
// Izgara görünüm seçenekleri: boş hafta sonu sütunlarını açma ve tam gün aralığı.
let showWeekend = false;
let showFullDay = false;
// Mobilde varsayılan gün listesidir; "ızgara görünümü" ile ızgaraya geçilir.
let showGrid = false;
let gridContextMenu = null;
let gridContextReturnFocus = null;

// --- çoklu program (liste) ---
const PROG_KEY = 'itu-programs';
const PROGRAM_PREF_KEY = 'itu-program-view';
const PASTELS = ['#5b8def', '#8a6fe8', '#2ecc9f', '#e8a04c', '#e86f8a', '#5bb8e8', '#a0c94c', '#c96fe8', '#e8c94c', '#4cc9c9'];

function loadPrograms() {
  const p = readLocalState(PROG_KEY, {
    fallback: null,
    legacyKey: PROG_KEY,
    validate: (value) => isPlainObject(value) && Array.isArray(value.programs) && value.programs.length > 0,
  });
  if (p) return p;
  return { programs: [{ id: 1, name: 'Program 1', items: [] }], active: 1 };
}
function savePrograms(ps) {
  writeLocalState(PROG_KEY, ps, {
    validate: (value) => isPlainObject(value) && Array.isArray(value.programs) && value.programs.length > 0,
  });
}

function saveProgramView() {
  writeLocalState(PROGRAM_PREF_KEY, {
    grid: showGrid,
    weekend: showWeekend,
    fullDay: showFullDay,
    markFull: Boolean($('#p-full')?.checked),
  }, { validate: isPlainObject });
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
  $('#p-credits-val').textContent = p ? (p.credits != null ? p.credits : '·') : '·';
  render();
}

export function initProgram() {
  if (inited) return;
  const pref = readLocalState(PROGRAM_PREF_KEY, { fallback: {}, validate: isPlainObject });
  showGrid = pref.grid === true;
  showWeekend = pref.weekend === true;
  showFullDay = pref.fullDay === true;
  $('#p-gridview').checked = showGrid;
  $('#p-weekend').checked = showWeekend;
  $('#p-fullday').checked = showFullDay;
  $('#p-full').checked = pref.markFull === true;
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
  $('#p-full').addEventListener('change', () => { saveProgramView(); render(); });
  // Izgara görünüm seçenekleri (hafta sonu sütunları / tam gün aralığı / ızgara).
  $('#p-gridview').addEventListener('change', (e) => { showGrid = e.target.checked; saveProgramView(); render(); });
  $('#p-weekend').addEventListener('change', (e) => { showWeekend = e.target.checked; saveProgramView(); render(); });
  $('#p-fullday').addEventListener('change', (e) => { showFullDay = e.target.checked; saveProgramView(); render(); });
  document.addEventListener('click', () => { if (openMenuKey) closeMenus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gridContextMenu && !gridContextMenu.hidden) closeGridContextMenu(true);
  });
  window.addEventListener('itu:add-program-items', async (event) => {
    const detail = event.detail || {};
    if (detail.term && detail.term !== term) await loadTerm(detail.term);
    let added = 0;
    for (const item of (detail.items || [])) if (addToActive(item.branch, String(item.crn))) added++;
    renderProgSelector();
    toast(added ? `${added} şube programa eklendi` : 'Seçilen şubeler zaten programda', { kind: added ? 'ok' : 'warn' });
  });
  inited = true;
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
    secs.map((r) => `<option value="${esc(r[0])}">${esc(r[0])}: ${esc(r[5] || '·')} · ${esc(r[4] || '·')} · ${r[6] ? `${r[7]}/${r[6]}` : '·'}</option>`).join('');
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
      <em>${esc(r[5] || '·')}</em><em>${r[6] ? `${r[7]}/${r[6]}` : '·'}</em>
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
  renderList(items);
  renderGrid(items.map((i) => i.row));
  renderSummary(items);
  updateCredits(items);
  renderCredits(items); // satır başına "3 kr · 6 AKTS" (katalog asenkron)
  updateBookmarklet(items);
  const empty = items.length === 0;
  for (const id of ['p-clear', 'p-dl', 'p-csv', 'p-ics', 'p-share']) {
    const control = $(`#${id}`);
    if (control) control.disabled = empty;
  }
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
    const item = box.querySelector(`.p-item[data-idx="${i}"]`);
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

function renderList(items) {
  const box = $('#p-list');
  const markFull = $('#p-full').checked;
  const rowsHtml = items.map(({ rec, row }, idx) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = row;
    const full = cap > 0 && enr >= cap;
    const key = fav.favKeyOf(branch, crn);
    const speed = fillSpeedNote(crn);
    return `<div class="p-item${markFull && full ? ' p-full' : ''}" role="row" draggable="true" data-idx="${idx}" data-key="${esc(key)}">
      <span class="p-grip" aria-hidden="true">⋮⋮</span>
      <span class="p-crn" role="cell"><span class="p-mobile-label">CRN</span>${esc(crn)}<button type="button" class="copy-btn" data-copy="${esc(crn)}" data-copy-label="CRN" aria-label="CRN ${esc(crn)} kopyala">kopyala</button>${rec.backup ? `<small class="p-backup">yedek: ${esc(rec.backup)}</small>` : ''}</span>
      <div class="p-code" role="cell"><b>${esc(code)}</b><button type="button" class="copy-btn" data-copy="${esc(code)}" data-copy-label="Ders kodu" aria-label="${esc(code)} ders kodunu kopyala">kopyala</button><small>${esc(name)}${speed ? ` · ${esc(speed)}` : ''}</small></div>
      <span class="p-instructor" role="cell">${esc(instructor && instructor !== '-' ? instructor : 'Öğretim üyesi açıklanmadı')}${instructor && instructor !== '-' ? `<button type="button" class="copy-btn" data-copy="${esc(instructor)}" data-copy-label="Öğretim üyesi" aria-label="${esc(instructor)} adını kopyala">kopyala</button>` : ''}</span>
      <span class="p-when" role="cell">${esc(when || 'Zaman açıklanmadı')}</span>
      <span class="p-fill" role="cell" aria-label="Kontenjan">${cap ? quotaDisplay(cap, enr) : '·'}</span>
      <button type="button" class="p-remove" data-remove="${esc(key)}" aria-label="${esc(code)} dersini programdan çıkar">Çıkar</button>
      <button type="button" class="p-menu" data-menu="${esc(key)}" aria-label="${esc(code)} için diğer eylemler" aria-haspopup="menu" aria-expanded="false">⋮</button>
      <div class="p-menu-pop" data-pop="${esc(key)}" hidden></div>
    </div>`;
  }).join('');
  box.innerHTML = items.length ? `
    <div class="p-list-head" role="row">
      <span role="columnheader">Ders ve şube</span>
      <span role="columnheader">Kontenjan / işlem</span>
    </div>${rowsHtml}`
    : '<p class="empty">Henüz ders eklenmedi. Yukarıdan ders kodu, ad veya CRN arayarak ekle.</p>';

  box.querySelectorAll('.p-item').forEach((item) => {
    const idx = Number(item.dataset.idx);
    const { row } = items[idx];
    item.addEventListener('click', (ev) => {
      if (ev.target.closest('button, .p-menu-pop')) return;
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

  box.querySelectorAll('.p-remove').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      removeScheduleItem(btn.dataset.remove);
    });
  });

  box.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async (ev) => {
    ev.stopPropagation();
    const ok = await copyText(btn.dataset.copy);
    toast(ok ? `${btn.dataset.copyLabel} kopyalandı` : 'Kopyalanamadı', { kind: ok ? 'ok' : 'warn' });
  }));

  box.querySelectorAll('.p-menu').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const key = btn.dataset.menu;
      const pop = box.querySelector(`[data-pop="${key}"]`);
      if (openMenuKey === key && !pop.hidden) { closeMenus(); return; }
      closeMenus();
      openMenuKey = key;
      pop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      const rec = items.find((it) => fav.favKeyOf(it.rec.branch, it.rec.crn) === key);
      pop.innerHTML = `
        <button type="button" data-act="detail" data-key="${key}">detay</button>
        <button type="button" data-act="copy" data-key="${key}">CRN kopyala</button>
        <button type="button" data-act="obs" data-key="${key}">OBS'de ara</button>
        ${rec && rec.rec.backup
          ? `<button type="button" data-act="rmbackup" data-key="${key}">yedek CRN kaldır</button>`
          : `<button type="button" data-act="backup" data-key="${key}">yedek CRN belirle</button>`}
        <button type="button" data-act="remove" data-key="${key}">Programdan çıkar</button>`;
      wireMenuActions(pop);
    });
  });
}

function wireMenuActions(pop) {
  pop.querySelectorAll('[data-act]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const actionKey = b.dataset.key;
      const [br, cr] = actionKey.split('|');
      const row = rows.find((x) => x[3] === br && x[0] === cr);
      if (b.dataset.act === 'remove') {
        removeScheduleItem(actionKey);
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

function removeScheduleItem(key) {
  const before = progItems();
  const removed = before.find((rec) => fav.favKeyOf(rec.branch, rec.crn) === key);
  if (!removed) return;
  setProgItems(before.filter((rec) => fav.favKeyOf(rec.branch, rec.crn) !== key));
  renderProgSelector();
  toast(`${removed.crn} çıkarıldı`, {
    action: { label: 'geri al', fn: () => { setProgItems(before); renderProgSelector(); } },
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

// Blok zeminine göre okunur yazı rengi: koyu (#1e2b23) ve açık (#fff) metinden
// WCAG kontrast oranı yüksek olanı seçer (≥4.5:1 hedeflenir).
function fgFor(hex) {
  const L = lumOf(hex);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.074 ? '#ffffff' : '#1e2b23';
}

// WCAG göreli parlaklık (0..1).
function lumOf(hex) {
  const h = String(hex).replace('#', '');
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const r = lin(parseInt(h.slice(0, 2), 16) / 255);
  const g = lin(parseInt(h.slice(2, 4), 16) / 255);
  const b = lin(parseInt(h.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Açık temada pastel bloklar üzerinde açık renkli saat metni eşiğin altında
// kalabiliyor; zemin, seçilen metin rengiyle ≥4.5:1 sağlanana kadar koyulaştırılır.
// Fosfor teması pastel tonlarını korur (yalnızca sade temasında çağrılır).
function blockContrast(color) {
  let bg = color, L = lumOf(bg);
  for (let i = 0; i < 12; i++) {
    if (1.05 / (L + 0.05) >= 4.5 || (L + 0.05) / 0.074 >= 4.5) break;
    bg = '#' + [1, 3, 5].map((s) => Math.round(parseInt(bg.slice(s, s + 2), 16) * 0.8).toString(16).padStart(2, '0')).join('');
    L = lumOf(bg);
  }
  return { bg, fg: fgFor(bg) };
}

function renderGrid(itemRows) {
  const wrap = $('#p-grid');
  const t = buildTimetable(itemRows);
  // Zaman bilgisi olmayan şubeyi sessizce yutma — ızgaranın altına not düş (G).
  const noTime = itemRows.filter((r) => !parseWhen(r[5]).length);
  const noTimeNote = noTime.length
    ? `<p class="tt-no-time">⚠ ${noTime.length} şubenin zaman bilgisi yok: ${noTime.map((r) => `${esc(r[1])} (${esc(r[0])})`).join(', ')}</p>`
    : '';
  if (!t || !t.all.length) {
    wrap.innerHTML = '<p class="empty">Zaman bilgisi olan ders eklenmedi.</p>' + noTimeNote;
    return;
  }
  // Mobilde varsayılan GÜN LİSTESİ; "ızgara görünümü" ile yatay ızgaraya geçilir.
  if (window.matchMedia('(max-width: 600px)').matches && !showGrid) {
    renderDayList(itemRows, t, noTime, noTimeNote);
    return;
  }
  placedRefs = [];
  const FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const TTD = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const fmtMin = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const ROW = 28;

  // Görünür günler: seçili şubelerin hiçbiri hafta sonuna denk gelmiyorsa CMT/PAZ
  // gizlenir; "hafta sonunu göster" ile açılabilir (D).
  const hasDay = FULL.map((d) => t.all.some((s) => s.day === d));
  const visIdx = showWeekend || hasDay[5] || hasDay[6] ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

  // Izgara aralığı içeriğe göre daralır: en erken dersten 1 sa önce, en geç
  // dersten 1 sa sonra. "Tüm günü göster" açıksa 07:00-23:00 (D).
  let startSlot = showFullDay ? 7 * 60 : t.startSlot - 60;
  let endSlot = showFullDay ? 23 * 60 : (t.startSlot + t.nSlots * 30) + 60;
  startSlot = Math.max(0, Math.min(1380, startSlot));
  endSlot = Math.max(60, Math.min(1440, endSlot));
  const nSlots = (endSlot - startSlot) / 30;
  const H = nSlots * ROW;

  const byDay = FULL.map(() => []);
  for (const s of t.all) {
    const di = FULL.indexOf(s.day);
    if (di >= 0) byDay[di].push(s);
  }

  // Çakışan blokları yan yana şeritlere böler; kırmızı işaret YALNIZCA gerçek
  // çakışmada — aynı gün içinde zaman aralığı örtüşen bloklar (tüm gün değil).
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
    for (const o of out) {
      o.conflict = out.some((o2) => o2 !== o && o.start < o2.end && o2.start < o.end);
    }
    return out;
  };

  // Sade temada blok zeminini koyulaştırıp metin kontrastını ≥4.5:1'e garantile.
  const isSade = document.documentElement.dataset.theme === 'sade';

  let html = `<p class="tt-note"><b>${t.all.length}</b> oturum · <b>${itemRows.length}</b> şube</p>`;
  html += `<div class="tt-scroll">`;
  // Başlık satırı scroll kapsayıcının doğrudan çocuğu — sticky-top bu sayede
  // çalışır (grid item'a hapsolmaz); corner yatay kaydırmada sticky-left (F).
  html += `<div class="tt-headrow"><div class="tt-head tt-corner"></div>`;
  for (const di of visIdx) html += `<div class="tt-head tt-dayhead">${TTD[di]}</div>`;
  html += `</div>`;
  // Gövde: saat sütunu + gün sütunları aynı yatay şeritte. Timecol bu şeridin
  // doğrudan çocuğu — containing block'u tüm genişlik olduğundan sticky-left çalışır.
  html += `<div class="tt-body">`;
  html += `<div class="tt-timecol">`;
  for (let si = 0; si < nSlots; si++) html += `<div class="tt-timeslot">${fmtMin(startSlot + si * 30)}</div>`;
  html += `</div>`;
  html += `<div class="tt-days">`;
  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7; // Pzt=0 … Paz=6 (TTD sırası)
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = term === state.index?.currentSlug
    && now.getDay() >= 1 && now.getDay() <= 5
    && visIdx.includes(todayIdx)
    && nowMin >= startSlot && nowMin < endSlot;
  const nowTop = ((nowMin - startSlot) / 30) * ROW;
  for (const di of visIdx) {
    const placed = place(byDay[di]);
    html += `<div class="tt-day${di >= 5 ? ' tt-wknd' : ''}" style="height:${H}px">`;
    // Şu anki zaman çizgisi (C): bugünün sütununda, vurgu rengi (kırmızı çakışma için ayrıldı).
    if (showNow && di === todayIdx) {
      html += `<div class="tt-now" style="top:${nowTop}px" role="presentation"></div>`;
    }
    for (const p of placed) {
      const top = ((p.start - startSlot) / 30) * ROW;
      const height = Math.max(20, ((p.end - p.start) / 30) * ROW);
      const w = 100 / p.laneCount;
      const left = p.lane * w;
      const color = colorFor(p.row[1]);
      const { bg, fg } = isSade ? blockContrast(color) : { bg: color, fg: fgFor(color) };
      const narrow = height <= 56; // ≤ 1 saat: yalnızca kod, gerisi tooltip (E)
      placedRefs.push(p.row);
      html += `<button type="button" class="tt-block${p.conflict ? ' tt-block-conf' : ''}${narrow ? ' tt-block-narrow' : ''}" style="top:${top}px;left:${left}%;width:${w}%;height:${height}px;--ttc:${bg};--tt-fg:${fg}" title="${esc(p.row[1])} · ${esc(p.row[5])} · CRN ${esc(p.row[0])}">
        <span class="tt-time">${fmtMin(p.start)} - ${fmtMin(p.end)}</span>
        <span class="tt-code">${esc(p.row[1])}</span>
        <span class="tt-crn">CRN ${esc(p.row[0])}</span>
        ${p.conflict ? '<span class="tt-conf-icon" title="Çakışma">⚠</span>' : ''}
      </button>`;
    }
    html += `</div>`;
  }
  html += `</div></div></div>`;
  html += noTimeNote;
  wrap.innerHTML = html;

  // Sütun sayısı görünür gün sayısına göre değişir; tam saat çizgilerinin fazı
  // başlangıç yarım saatteyse (08:30) tek slot kayar (A).
  const days = wrap.querySelector('.tt-days');
  if (days) {
    days.style.gridTemplateColumns = `repeat(${visIdx.length}, 1fr)`;
    days.style.setProperty('--tt-halfshift', startSlot % 60 === 30 ? '28px' : '0px');
  }

  wrap.querySelectorAll('.tt-block').forEach((b, i) => {
    const row = placedRefs[i];
    b.addEventListener('click', () => openDetail(row, term));
    b.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      openGridContextMenu(row, b, ev.clientX, ev.clientY);
    });
    b.addEventListener('keydown', (ev) => {
      if ((ev.shiftKey && ev.key === 'F10') || ev.key === 'ContextMenu') {
        ev.preventDefault();
        const rect = b.getBoundingClientRect();
        openGridContextMenu(row, b, rect.left + Math.min(rect.width, 40), rect.top + 28);
      }
    });
  });
}

function openGridContextMenu(row, trigger, x, y) {
  closeGridContextMenu(false);
  const key = fav.favKeyOf(row[3], row[0]);
  const menu = document.createElement('div');
  menu.className = 'tt-context-menu';
  menu.setAttribute('role', 'menu');
  const en = I18N.lang === 'en';
  menu.setAttribute('aria-label', `${row[1]} ${en ? 'actions' : 'işlemleri'}`);
  menu.innerHTML = `
    <p><b>${esc(row[1])}</b><span>CRN ${esc(row[0])}</span></p>
    <button type="button" role="menuitem" data-act="detail" data-key="${esc(key)}">${en ? 'Open course details' : 'Ders ayrıntısını aç'}</button>
    <button type="button" role="menuitem" data-act="copy" data-key="${esc(key)}">${en ? 'Copy CRN' : "CRN'yi kopyala"}</button>
    <button type="button" role="menuitem" data-act="obs" data-key="${esc(key)}">${en ? 'Find on OBS' : "OBS'de ara"}</button>
    <button type="button" role="menuitem" class="danger" data-act="remove" data-key="${esc(key)}">${en ? 'Remove from schedule' : 'Programdan çıkar'}</button>`;
  document.body.appendChild(menu);
  gridContextMenu = menu;
  gridContextReturnFocus = trigger;
  wireMenuActions(menu);
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(8, Math.min(x, innerWidth - rect.width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, innerHeight - rect.height - 8))}px`;
  menu.querySelector('button')?.focus();
  menu.addEventListener('keydown', (ev) => {
    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const at = items.indexOf(document.activeElement);
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      items[(at + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    }
  });
  setTimeout(() => document.addEventListener('pointerdown', gridContextOutside, { once: true }), 0);
}

function gridContextOutside(ev) {
  if (!gridContextMenu?.contains(ev.target)) closeGridContextMenu(false);
}

function closeGridContextMenu(restoreFocus) {
  if (!gridContextMenu) return;
  gridContextMenu.remove();
  gridContextMenu = null;
  if (restoreFocus) gridContextReturnFocus?.focus();
  gridContextReturnFocus = null;
}

// Mobil GÜN LİSTESİ: gün başlıkları altında dersler zaman sırasıyla; çakışanlar
// üst üste "çakışıyor" etiketiyle (kırmızı kenarlık). Yatay ızgaranın yerine.
function renderDayList(itemRows, t, noTime, noTimeNote) {
  const wrap = $('#p-grid');
  const FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const fmtMin = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const byDay = FULL.map(() => []);
  for (const s of t.all) { const di = FULL.indexOf(s.day); if (di >= 0) byDay[di].push(s); }
  const visIdx = showWeekend || byDay[5].length || byDay[6].length ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];
  const list = document.createElement('div');
  list.className = 'dp-daylist';
  for (const di of visIdx) {
    if (!byDay[di].length) continue;
    const day = document.createElement('div');
    day.className = 'dp-day';
    const h = document.createElement('h4');
    h.textContent = FULL[di];
    day.appendChild(h);
    const sessions = byDay[di].slice().sort((a, b) => a.start - b.start || a.end - b.end);
    for (const s of sessions) {
      const conflict = sessions.some((o) => o !== s && s.start < o.end && o.start < s.end);
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'dp-sess' + (conflict ? ' dp-sess-conf' : '');
      row.title = `${s.row[1]} · ${s.row[5] || ''} · CRN ${s.row[0]}`;
      const code = document.createElement('b');
      code.textContent = s.row[1];
      const time = document.createElement('span');
      time.textContent = `${fmtMin(s.start)}–${fmtMin(s.end)}`;
      const crn = document.createElement('span');
      crn.textContent = `CRN ${s.row[0]}`;
      row.append(code, ' ', time, ' ', crn);
      if (conflict) {
        row.append(' ');
        const tag = document.createElement('em');
        tag.className = 'dp-sess-conf-tag';
        tag.textContent = 'çakışıyor';
        row.appendChild(tag);
      }
      row.addEventListener('click', () => openDetail(s.row, term));
      row.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        openGridContextMenu(s.row, row, ev.clientX, ev.clientY);
      });
      day.appendChild(row);
    }
    list.appendChild(day);
  }
  if (noTime.length) {
    const note = document.createElement('p');
    note.className = 'tt-no-time';
    note.textContent = noTimeNote.replace(/<[^>]+>/g, '');
    list.appendChild(note);
  }
  wrap.replaceChildren(list);
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
      const week = (String(topic).split(' · ')[0] || topic).trim();
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
  el.textContent = items.length ? '·' : '0 kredi · 0 AKTS';
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
function showTip() {
  const el = $('#p-obs-tt');
  if (el) el.classList.add('show');
}
function hideTip() {
  const el = $('#p-obs-tt');
  if (el) el.classList.remove('show');
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
    for (const o of out) {
      o.conflict = out.some((o2) => o2 !== o && o.start < o2.end && o2.start < o.end);
    }
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
      if (p.conflict) {
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

function closeMenus() {
  closeGridContextMenu(false);
  if (openMenuKey) {
    const pop = document.querySelector(`[data-pop="${openMenuKey}"]`);
    const button = document.querySelector(`[data-menu="${openMenuKey}"]`);
    if (pop) pop.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
    openMenuKey = null;
  }
}
