// Not Kutusu görünümü: öğrencilerin paylaştığı ders notu bağlantıları.
//
// Arşiv dosya BARINDIRMAZ — her kayıt bir dış bağlantıdır (Drive, OneDrive,
// Notion...). Bu yüzden arayüzün iki özel görevi var:
//
//   1. Bağlantının nereye gittiğini tıklamadan göstermek (host rozeti). Dış
//      bağlantıya körlemesine tıklatmak dürüst değil.
//   2. Ölü bağlantıyı gizlememek. cmd/notes -check onları dead:true işaretler;
//      burada "yanıt vermiyor" diye görünür, sessizce kaybolmaz.
//
// Veri: data/notes/index.json (kapsam) + data/notes/<BRANŞ>.json (kayıtlar).
// Branş dosyaları yalnızca gerekince çekilir — Dersler sekmesindeki desen.

import { $, getJSON, esc, fold, debounce, setStatus, safeHref } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillRows } from '../core/table.js';
import { openCourseDetail } from '../core/course-detail.js';
import { I18N } from '../i18n.js';

const ISSUE_URL = 'https://github.com/yatuk/itu-archive/issues/new?template=not-kutusu.yml&labels=not-kutusu';

let inited = false;
let all = [];          // yüklenen tüm kayıtlar
let loadedBranches = new Set();
let shown = 60;

export function initNotes() {
  if (inited) return;
  $('#nq').addEventListener('input', debounce(() => { shown = 60; render(); }, 140));
  $('#f-nbranch').addEventListener('change', () => { shown = 60; onBranchChange(); });
  $('#f-nkind').addEventListener('change', () => { shown = 60; render(); });
  $('#f-nlang').addEventListener('change', () => { shown = 60; render(); });
  $('#f-ndead').addEventListener('change', () => { shown = 60; render(); });
  const more = $('#nmore');
  if (more) more.addEventListener('click', () => { shown += 60; render(); });
  for (const b of document.querySelectorAll('.n-add')) b.href = ISSUE_URL;
  inited = true;
}

export async function onShow() {
  initNotes();
  if (!state.notesIndex) await loadIndex();
}

// index.json yalnızca kapsam özeti: hangi branşta kaç not var. Tam kayıtlar
// branş seçilince (ya da "hepsi"nde ilk 12 branş) gelir.
async function loadIndex() {
  try {
    state.notesIndex = await getJSON('data/notes/index.json');
  } catch {
    state.notesIndex = { notes: 0, byBranch: {} };
  }
  const sel = $('#f-nbranch');
  const branches = Object.keys(state.notesIndex.byBranch || {}).sort();
  sel.innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
    branches.map((b) => `<option value="${esc(b)}">${esc(b)} (${state.notesIndex.byBranch[b]})</option>`).join('');
  await onBranchChange();
}

async function onBranchChange() {
  const branch = $('#f-nbranch').value;
  const idx = state.notesIndex || { byBranch: {} };
  const wanted = branch ? [branch] : Object.keys(idx.byBranch || {});
  await Promise.all(wanted.map(loadBranch));
  render();
}

async function loadBranch(branch) {
  if (loadedBranches.has(branch)) return;
  loadedBranches.add(branch);
  try {
    const list = await getJSON(`data/notes/${branch}.json`);
    if (Array.isArray(list)) all = all.concat(list);
  } catch { /* dosya yoksa sessiz — index bayat olabilir */ }
}

/* ---------- filtre + arama ---------- */

// Saf: dışa açık, test edilebilir. Arama ASCII'ye katlanmış metin üzerinde
// (Türkçe "I" tuzağı — utils.fold ile aynı kural).
export function filterNotes(list, { q = '', branch = '', kind = '', lang = '', showDead = false } = {}) {
  const needle = fold(q.trim());
  return list.filter((n) => {
    if (branch && n.branch !== branch) return false;
    if (kind && n.kind !== kind) return false;
    if (lang && n.language !== lang) return false;
    if (!showDead && n.dead) return false;
    if (!needle) return true;
    const hay = fold(`${n.code} ${n.title} ${n.instructor || ''} ${n.contributor || ''} ${n.host || ''}`);
    return needle.split(/\s+/).every((t) => hay.includes(t));
  });
}

function render() {
  const hits = filterNotes(all, {
    q: $('#nq').value,
    branch: $('#f-nbranch').value,
    kind: $('#f-nkind').value,
    lang: $('#f-nlang').value,
    showDead: $('#f-ndead').checked,
  });
  // En yeni katkı üstte.
  hits.sort((a, b) => String(b.addedAt || '').localeCompare(String(a.addedAt || '')));

  const total = state.notesIndex?.notes || 0;
  setStatus($('#nresultline'), total === 0
    ? I18N.t('notesEmptyAll')
    : I18N.t('notesResult', { n: hits.length, total }));

  const rows = fillRows($('#nrows'), hits.slice(0, shown), (n) => noteRow(n),
    { empty: I18N.t('notesNoMatch'), colspan: 5 });

  const more = $('#nmore');
  if (more) {
    more.hidden = hits.length <= shown;
    more.textContent = I18N.t('moreLeft', { n: hits.length - shown });
  }
  if (rows) wireRows(rows);
}

// Bağlantı yalnızca şeması güvenliyse <a> olur. Doğrulayıcı https zorunlu
// kılıyor ama JSON elle düzenlenebilir; render tarafında ikinci kapı.
function linkOrText(n) {
  const href = safeHref(n.url);
  if (!href) return `<span class="n-link n-badlink" title="${esc(I18N.t('notesBadLinkTitle'))}">${esc(n.title)}</span>`;
  return `<a class="n-link" href="${esc(href)}" target="_blank" rel="noopener nofollow ugc">${esc(n.title)} ↗</a>`;
}

// Saf: tek kaydın satır HTML'i. Dışa açık ki kaçış (escape), ölü rozeti ve
// güvensiz bağlantı davranışı DOM olmadan test edilebilsin.
export function noteRow(n) {
  const dead = n.dead
    ? `<span class="n-dead" title="${esc(I18N.t('notesDeadTitle'))}">${esc(I18N.t('notesDead'))}</span>`
    : '';
  const meta = [
    n.term ? esc(n.term) : '',
    n.instructor ? esc(n.instructor) : '',
    n.contributor ? `${esc(I18N.t('notesBy'))} ${esc(n.contributor)}` : '',
  ].filter(Boolean).join(' · ');
  return `
    <td class="code" data-label="${esc(I18N.t('thCode'))}">
      <button type="button" class="row-toggle n-course" data-code="${esc(n.code)}"><b>${esc(n.code)}</b></button>
    </td>
    <td data-label="${esc(I18N.t('notesTitle'))}">
      ${linkOrText(n)}
      ${dead}
      ${meta ? `<small class="n-meta">${meta}</small>` : ''}
    </td>
    <td data-label="${esc(I18N.t('notesKind'))}"><span class="n-kind">${esc(kindLabel(n.kind))}</span></td>
    <td data-label="${esc(I18N.t('notesHost'))}"><span class="n-host">${esc(n.host || '·')}</span></td>
    <td data-label="${esc(I18N.t('notesLicense'))}"><span class="n-lic">${esc(n.license)}</span></td>`;
}

function wireRows(rows) {
  for (const tr of rows) {
    const b = tr.querySelector('.n-course');
    if (b) b.addEventListener('click', () => openCourseDetail(b.dataset.code, { source: 'notlar' }));
  }
}

export function kindLabel(kind) {
  const key = 'noteKind' + String(kind || '').replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
  const v = I18N.t(key);
  return v === key ? kind : v;
}
