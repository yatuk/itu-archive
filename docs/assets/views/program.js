// Program görünümü: seçilen şubelerden haftalık ders programı kurucu.
//
// Akış: DERSLER'de şubeler seçilip "programa gönder" ile eklenir ya da buradaki
// arama (combobox) ile şube eklenir. Seçili liste + çakışma listesi solda,
// haftalık ızgara sağda. "OBS'ye doldur" CRN doldurma kodunu üretir.

import { $, getJSON, esc, fold, debounce, downloadCSV } from '../core/utils.js';
import { state, indexReady } from '../core/store.js';
import { fillBar } from '../core/chart.js';
import { buildTimetable, openDetail } from './courses.js';
import * as fav from '../core/favorites.js';
import { toast } from '../core/toast.js';

let term = null;
let rows = [];
let inited = false;
let hits = [];
let openMenuKey = null;
let dragFrom = null;
// Paylaşılan URL'deki crns listesi yalnızca bir kez uygulanır (sekme her
// açıldığında yeniden eklenmesin).
let crnsApplied = false;

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
  $('#p-clear').addEventListener('click', () => { fav.clearSchedule(); render(); toast('Program temizlendi'); });
  $('#p-csv').addEventListener('click', exportCSV);
  $('#p-share').addEventListener('click', share);
  $('#p-obs').addEventListener('click', showOBS);
  $('#p-favs').addEventListener('click', addFavorites);
  $('#p-full').addEventListener('change', render);
  document.addEventListener('click', () => { if (openMenuKey) closeMenus(); });
  inited = true;
}

export async function onShow() {
  initProgram();
  // Index yüklenmeden açılırsa (paylaşılan #program bağlantısı ya da erken
  // tıklama) bekleyip devam et — dönem seçici ve crns ekleme index'e bağlı.
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
    // Paylaşılan program URL'i: ?term=&crns=
    if (params.has('term')) {
      const want = params.get('term');
      if ([...sel.options].some((o) => o.value === want)) sel.value = want;
    }
    term = sel.value;
  }
  // Dönem satırlarını önce yükle; crns ekleme onlarsız yapılamaz.
  await loadTerm(term);
  if (params.has('crns') && !crnsApplied) {
    crnsApplied = true;
    const list = params.get('crns').split(',').map((s) => s.trim()).filter(Boolean);
    let added = 0;
    for (const crn of list) {
      const r = rows.find((x) => x[0] === crn);
      if (r && fav.addToSchedule(term, r[3], crn)) added++;
    }
    if (added) toast(`${added} şube paylaşılan programdan yüklendi`);
  }
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
  const added = fav.addToSchedule(term, r[3], r[0]);
  toast(added ? `${r[1]} eklendi` : `${r[1]} zaten listede`, { kind: added ? 'ok' : 'warn' });
  render();
}

function currentItems() {
  const recs = fav.loadSchedule().filter((f) => f.term === term);
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
}

function renderList(items) {
  const box = $('#p-list');
  const markFull = $('#p-full').checked;
  box.innerHTML = items.map(({ rec, row }, idx) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = row;
    const full = cap > 0 && enr >= cap;
    const key = fav.favKeyOf(branch, crn);
    return `<div class="p-item${markFull && full ? ' p-full' : ''}" draggable="true" data-idx="${idx}" data-key="${esc(key)}">
      <span class="p-grip" aria-hidden="true">⋮⋮</span>
      <span class="p-crn">${esc(crn)}</span>
      <div class="p-code"><b>${esc(code)}</b><small>${esc(name)}</small></div>
      <span class="p-when">${esc(when || '—')}</span>
      <span class="p-fill">${cap ? fillBar(cap, enr) : '—'}</span>
      <button type="button" class="p-menu" data-menu="${esc(key)}" aria-label="${esc(code)} için eylemler" aria-haspopup="menu">⋮</button>
      <div class="p-menu-pop" data-pop="${esc(key)}" hidden></div>
    </div>`;
  }).join('') || '<p class="empty">Henüz ders eklenmedi. Arama yapıp şube ekle ya da DERSLER\'de seçip "programa gönder".</p>';

  // Tıklama → detay; ⋮ menü ayrı.
  box.querySelectorAll('.p-item').forEach((item) => {
    const idx = Number(item.dataset.idx);
    const { row } = items[idx];
    item.addEventListener('click', (ev) => {
      if (ev.target.closest('.p-menu')) return;
      openDetail(row, term);
    });
    // Sürükle-bırak: sıralama
    item.addEventListener('dragstart', (ev) => {
      dragFrom = idx;
      item.classList.add('drag');
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', String(idx));
    });
    item.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      item.classList.add('over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('over'));
    item.addEventListener('drop', (ev) => {
      ev.preventDefault();
      item.classList.remove('over');
      const from = Number(ev.dataTransfer.getData('text/plain') || dragFrom);
      reorderSchedule(from, idx);
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('drag', 'over');
      dragFrom = null;
    });
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
      pop.innerHTML = `
        <button type="button" data-act="detail" data-key="${key}">detay</button>
        <button type="button" data-act="copy" data-key="${key}">CRN kopyala</button>
        <button type="button" data-act="obs" data-key="${key}">OBS'de ara</button>
        <button type="button" data-act="remove" data-key="${key}">çıkar</button>`;
    });
  });
  box.querySelectorAll('[data-act]').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const [br, cr] = b.dataset.key.split('|');
      const row = rows.find((x) => x[3] === br && x[0] === cr);
      if (b.dataset.act === 'remove') {
        fav.removeFromSchedule(term, br, cr);
        toast(`${cr} çıkarıldı`);
        render();
      } else if (b.dataset.act === 'copy') {
        copyText(cr);
        toast(`CRN ${cr} kopyalandı`);
      } else if (b.dataset.act === 'detail') {
        if (row) openDetail(row, term);
      } else if (b.dataset.act === 'obs') {
        window.open('https://obs.itu.edu.tr/public/DersProgram', '_blank', 'noopener');
      }
      closeMenus();
    });
  });
}

// Sürüklenen öğeyi seçili listenin içinde taşır; diğer dönem kayıtları korunur.
function reorderSchedule(from, to) {
  if (from === to) return;
  const all = fav.loadSchedule();
  const others = all.filter((f) => f.term !== term);
  const vis = all.filter((f) => f.term === term);
  if (from < 0 || from >= vis.length || to < 0 || to >= vis.length) return;
  const [moved] = vis.splice(from, 1);
  vis.splice(to, 0, moved);
  fav.saveSchedule([...vis, ...others]);
  render();
  toast('Sıralama güncellendi');
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

  // Lane atama: çakışan dersler aynı günde yan yana sıralanır.
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
      placedRefs.push(p.row);
      html += `<button type="button" class="tt-block${conflict ? ' tt-block-conf' : ''}" style="top:${top}px;left:${left}%;width:${w}%;height:${height}px" title="${esc(p.row[1])} · ${esc(p.row[5])}">${esc(p.row[1])}</button>`;
    }
    html += `</div>`;
  }
  html += `</div></div>`;
  wrap.innerHTML = html;

  wrap.querySelectorAll('.tt-block').forEach((b, i) => {
    b.addEventListener('click', () => openDetail(placedRefs[i], term));
  });
}

// renderGrid içinde blokların satır referansları (tıklamada detay için).
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
  box.innerHTML = html;
}

function addFavorites() {
  const favs = fav.loadFavorites().filter((f) => f.term === term);
  let added = 0;
  for (const f of favs) if (fav.addToSchedule(term, f.branch, f.crn)) added++;
  toast(added ? `${added} favori programa eklendi` : 'Bu dönem için favori yok', { kind: added ? 'ok' : 'warn' });
  render();
}

function currentCRNs() {
  return currentItems().map((i) => i.row[0]);
}

// OBS kayıt sayfasında görünür sayı girdilerini CRN'lerle dolduran snippet.
// Saf fonksiyon — test edilebilir.
export function buildSnippet(crns) {
  const arr = crns.map((c) => `'${c}'`).join(',');
  return `!function(){var e=[${arr}];let t=document.querySelectorAll("input[type='number']"),n=0;t.forEach(t=>{(function e(t){let n=window.getComputedStyle(t);if("none"===n.display||"hidden"===n.visibility)return!1;let l=t.parentElement;for(;l;){let i=window.getComputedStyle(l);if("none"===i.display||"hidden"===i.visibility)return!1;l=l.parentElement}return!0})(t)&&n<e.length&&(t.value=e[n],t.dispatchEvent(new Event("input",{bubbles:!0})),n++)}),setTimeout(function(){let e=document.querySelector('button[type="submit"]:not([disabled])');e&&e.click(),setTimeout(function(){let e=document.querySelector(".card-footer.d-flex.justify-content-end");if(e){let t=e.getElementsByTagName("button");t.length>1&&t[1].click()}},50)},50)}();`;
}

function showOBS() {
  const crns = currentCRNs();
  if (!crns.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  const code = buildSnippet(crns);
  const box = $('#p-obs-code');
  box.hidden = false;
  box.innerHTML = `<h4 class="eyebrow">OBS kayıt sayfası için CRN doldurma</h4>
    <p>Bu kodu OBS'nin ders seçme sayfasında konsola yapıştırıp çalıştır, ya da tarayıcı yer imi olarak kaydet. ${crns.length} CRN doldurur.</p>
    <pre class="p-code"><code>${esc(code)}</code></pre>
    <button type="button" id="p-copy" class="btn-ghost">kopyala</button>`;
  $('#p-copy').addEventListener('click', () => { copyText(code); toast('CRN kodu kopyalandı'); });
}

function exportCSV() {
  const items = currentItems();
  if (!items.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  downloadCSV(`program-${term}.csv`,
    ['CRN', 'Ders Kodu', 'Branş', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Kontenjan', 'Yazılan'],
    items.map(({ row: r }) => [r[0], r[1], r[3], r[2], r[4], r[5], r[6], r[7]]));
  toast('CSV indirildi');
}

function share() {
  const items = currentItems();
  if (!items.length) { toast('Önce şube ekle', { kind: 'warn' }); return; }
  // Mevcut sayfa parametrelerini (q, branch, ...) almayan temiz bir bağlantı
  // üret — yalnızca dönem ve CRN listesi.
  const p = new URLSearchParams();
  p.set('term', term);
  p.set('crns', items.map((i) => i.row[0]).join(','));
  copyText(`${location.origin}${location.pathname}?${p.toString()}#program`);
  toast('Paylaşım bağlantısı kopyalandı');
}

function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).catch(() => fallbackCopy(txt));
  } else fallbackCopy(txt);
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
