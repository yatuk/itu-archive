// "Ders Planım" sekmesi: kullanıcı programını seçer, müfredat yarıyıl yarıyıl
// listelenir ve her satırın yanına "bu dönem açık mı, hangi şubeler, kontenjan
// ne durumda" bilgisi konur. Önşart Haritası yapıyı/sırayı anlatır; bu sekme
// bu döneme dönük eyleme odaklanır.
//
// Veri kaynakları:
//   - program listesi: data/curriculum/index.json
//   - müfredat:         data/curriculum/<PROG>.json
//   - bu dönem şubeler: data/terms/<term>/search.json (join core/plan.js'te)
//   - ders geçmişi:     data/history/courses/<BRANŞ>.json (son açılış için)
//
// Yeniden kullanım (Faz E — kopyalanmış üçüncü sürüm yazılmaz):
//   - ders detayı → core/course-detail.js
//   - seçmeli havuz → önşart sekmesindeki panel (?prog=X&pool=<slot>#onsart)
//   - şube satırı / doluluk çubuğu → fillBar (core/chart.js)
//   - programa ekle → core/favorites.js addToSchedule

import { $, getJSON, esc, trNum, termLabel, debounce } from '../core/utils.js';
import { state } from '../core/store.js';
import { openCourseDetail } from '../core/course-detail.js';
import { fillBar } from '../core/chart.js';
import * as fav from '../core/favorites.js';
import { toast } from '../core/toast.js';
import { joinCourse, joinElective, semesterLoad, planSummary, codeKey } from '../core/plan.js';
import { isTaken } from '../core/taken.js';

let inited = false;
let progIndex = [];     // curriculum/index.json (fakülte → program listesi)
let plan = null;        // seçili programın müfredatı
let progCode = '';      // seçili program kodu
let termSlug = '';      // eşleştirme yapılan dönem
let rows = [];          // o dönemin search.json satırları
const histCache = new Map(); // branş → history nesnesi

// Filtre durumu (URL'den okunur, DOM'dan yazılır).
const filters = { open: false, cap: false, hideTaken: false, semesters: new Set(), types: new Set() };

export async function onShow() {
  ensureHost();
  if (!inited) {
    init();
    inited = true;
  }
  if (!progIndex.length) {
    progIndex = (await getJSON('data/curriculum/index.json').catch(() => []));
  }
  const sel = $('#dp-prog');
  if (sel.options.length === 0) sel.innerHTML = renderProgramOptions();
  const params = new URLSearchParams(location.search);
  const want = params.get('prog') || '';
  applyParams(params);
  // URL'deki program geçerliyse onu, değilse ilk programı seç (URL kaynaktır).
  const current = progIndex.some((p) => p.code === want) ? want : (progIndex[0]?.code || '');
  sel.value = current;
  await selectProgram(current);
}

function ensureHost() {
  // #dp-root HTML'de hazır durur; içerik doldurulmuş mu onu kontrol et.
  if ($('#dp-prog')) return;
  const root = document.querySelector('#view-dersplanim');
  root.innerHTML = `
    <p class="note">
      Programını seç: müfredatın yarıyıl yarıyıl, her dersin <strong>bu dönem açık olup
      olmadığı, şubeleri ve kontenjan durumu</strong> yanında. "Programa ekle" seçili
      şubeyi Program sekmesindeki takvimine ekler; seçmeli slotlar önşart haritasındaki
      havuza gider.
    </p>
    <div class="console dp-console">
      <label class="query">
        <span class="sigil">&gt;</span>
        <select id="dp-prog" class="dp-prog-select" aria-label="Program seç"></select>
      </label>
      <label>dönem <select id="dp-term" aria-label="Dönem seç"></select></label>
      <button type="button" id="dp-refresh" class="btn-ghost" title="Durumları yenile">↻</button>
    </div>
    <div class="dp-filters" role="group" aria-label="Ders Planım filtreleri">
      <label class="check"><input type="checkbox" id="dp-open"> yalnızca bu dönem açık olanlar</label>
      <label class="check"><input type="checkbox" id="dp-cap"> yalnızca kontenjanı olanlar</label>
      <label class="check"><input type="checkbox" id="dp-hide"> aldıklarımı gizle</label>
      <span class="dp-sems" id="dp-sems" role="group" aria-label="Yarıyıl seçimi"></span>
      <span class="dp-type-filter" id="dp-types" role="group" aria-label="Türe göre filtrele"></span>
    </div>
    <p class="resultline" id="dp-result" aria-live="polite">program seçiliyor…</p>
    <div id="dp-summary" class="dp-summary"></div>
    <div id="dp-semesters" class="dp-semesters"></div>`;
}

// -- program seçici --

function renderProgramOptions() {
  // Fakülteye göre gruplu; aynı bölümün farklı planları (KKTC/İngilizce vb.)
  // planLabel ile ayrışsın — kullanıcı yanlış planı seçmesin (Faz F).
  const byFac = new Map();
  for (const p of progIndex) {
    const f = p.faculty || 'Diğer';
    if (!byFac.has(f)) byFac.set(f, []);
    byFac.get(f).push(p);
  }
  const groups = [...byFac.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'tr'))
    .map(([fac, ps]) => {
      ps.sort((a, b) => a.code.localeCompare(b.code));
      const opts = ps.map((p) => {
        const label = p.name !== p.code ? `${p.code} — ${p.name}` : p.code;
        return `<option value="${esc(p.code)}">${esc(label)}</option>`;
      }).join('');
      return `<optgroup label="${esc(fac)}">${opts}</optgroup>`;
    }).join('');
  return groups;
}

async function selectProgram(code) {
  if (!code || code === progCode && plan) return;
  progCode = code;
  plan = null;
  setDPResult('yükleniyor…', { busy: true });
  try {
    plan = await getJSON(`data/curriculum/${code}.json`);
  } catch {
    setDPResult(`müfredat yüklenemedi (${esc(code)})`, { error: true });
    plan = null;
    return;
  }
  // Programın planı yoksa (kapanmış program, eksik plan) açık mesaj — boş liste değil.
  if (!plan || !plan.semesters || !plan.semesters.length) {
    $('#dp-semesters').innerHTML = `<p class="empty">Bu program için yüklenmiş bir ders planı bulunamadı (${esc(code)}).</p>`;
    $('#dp-summary').innerHTML = '';
    setDPResult('');
    return;
  }
  $('#dp-result').textContent = `${plan.programName || code} · ${plan.planLabel || ''}`.trim();
  await ensureTerm();
  await reloadRows();
  renderAll();
  saveState();
}

function setDPResult(msg, opts) {
  const el = $('#dp-result');
  if (!el) return;
  el.textContent = msg;
  el.className = 'resultline' + (opts?.error ? ' err' : opts?.busy ? ' busy' : '');
}

// -- dönem seçici --

async function ensureTerm() {
  const sel = $('#dp-term');
  if (!sel.options.length && state.index) {
    sel.innerHTML = state.index.terms
      .filter((t) => !t.missing)
      .map((t) => `<option value="${t.slug}">${t.label}</option>`).join('');
  }
  const params = new URLSearchParams(location.search);
  const want = params.get('term');
  termSlug = (want && state.index?.terms.some((t) => t.slug === want)) ? want : (state.index?.currentSlug || '');
  sel.value = termSlug;
}

async function reloadRows() {
  rows = [];
  try {
    rows = await getJSON(`data/terms/${termSlug}/search.json`);
  } catch { /* dönem verisi yok — boş geç */ }
}

// -- tarihçe yükleme (son açılış için) --

function branchOf(code) {
  return String(code || '').split(/\s+/)[0] || '';
}

async function ensureHistoryFor(codes) {
  const needed = [...new Set(codes.map(branchOf).filter((b) => b && !histCache.has(b)))];
  if (!needed.length) return;
  await Promise.all(needed.map(async (b) => {
    try {
      histCache.set(b, await getJSON(`data/history/courses/${b}.json`));
    } catch {
      histCache.set(b, {}); // bu branş için geçmiş yok
    }
  }));
  renderAll();
}

function historyFor(branch) {
  return histCache.get(branch) || null;
}

// -- filtreler --

function applyParams(params) {
  filters.open = params.get('fopen') === '1';
  filters.cap = params.get('fcap') === '1';
  filters.hideTaken = params.get('fhide') === '1';
  filters.semesters = new Set((params.get('fsems') || '').split(',').filter(Boolean));
  filters.types = new Set((params.get('ftypes') || '').split(',').filter(Boolean));
  $('#dp-open').checked = filters.open;
  $('#dp-cap').checked = filters.cap;
  $('#dp-hide').checked = filters.hideTaken;
  renderSemesterFilter();
  renderTypeFilter();
}

function renderSemesterFilter() {
  const wrap = document.querySelector('#dp-sems');
  if (!wrap || !plan) return;
  wrap.innerHTML = plan.semesters.map((s, i) => {
    const v = String(i);
    return `<label class="check"><input type="checkbox" value="${v}" ${filters.semesters.has(v) ? 'checked' : ''}> ${esc(s.title)}</label>`;
  }).join('');
  wrap.querySelectorAll('input').forEach((cb) =>
    cb.addEventListener('change', () => {
      if (cb.checked) filters.semesters.add(cb.value);
      else filters.semesters.delete(cb.value);
      saveState();
      renderAll();
    }));
}

function renderTypeFilter() {
  const wrap = $('#dp-types');
  if (!wrap) return;
  const types = ['ITB', 'TB', 'TM', 'MT', 'EC'];
  wrap.innerHTML = types.map((t) =>
    `<button type="button" class="dp-type ${filters.types.has(t) ? 'on' : ''}" data-type="${t}" aria-pressed="${filters.types.has(t)}">${t}</button>`
  ).join('') + '<span class="dp-type-label">tür</span>';
  wrap.querySelectorAll('.dp-type').forEach((b) =>
    b.addEventListener('click', () => {
      const t = b.dataset.type;
      if (filters.types.has(t)) filters.types.delete(t);
      else filters.types.add(t);
      b.classList.toggle('on');
      b.setAttribute('aria-pressed', String(filters.types.has(t)));
      saveState();
      renderAll();
    }));
}

// URL'ye yazar; sekme değişince app.js görünüme ait olmayanları düşürür.
function saveState() {
  const p = new URLSearchParams();
  if (progCode) p.set('prog', progCode);
  if (termSlug && termSlug !== state.index?.currentSlug) p.set('term', termSlug);
  if (filters.open) p.set('fopen', '1');
  if (filters.cap) p.set('fcap', '1');
  if (filters.hideTaken) p.set('fhide', '1');
  const sems = [...filters.semesters];
  if (sems.length) p.set('fsems', sems.join(','));
  const types = [...filters.types];
  if (types.length) p.set('ftypes', types.join(','));
  const qs = p.toString();
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + '#dersplanim');
}

// -- çizim --

function renderAll() {
  if (!plan) return;
  const sems = plan.semesters
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => !filters.semesters.size || filters.semesters.has(String(i)));

  renderSummary(sems.map((x) => x.s));
  renderSemesterFilter();

  const typeActive = filters.types.size > 0;
  let openCount = 0, closedCount = 0, slotOpen = 0, shown = 0;

  const root = $('#dp-semesters');
  const historyCodes = [];

  root.innerHTML = sems.map(({ s, i }) => {
    const load = semesterLoad(s);
    let itemHtml = '';
    for (const item of s.items) {
      if (item.course) {
        const c = item.course;
        if (filters.types.size && (!c.type || !filters.types.has(c.type))) continue;
        if (filters.hideTaken && isTaken(c.code)) continue;
        const st = joinCourse(c.code, rows, historyFor(branchOf(c.code)));
        if (st.state === 'closed' && !histCache.has(branchOf(c.code))) historyCodes.push(c.code);
        if (filters.open && st.state !== 'open') continue;
        if (filters.cap && !(st.state === 'open' && st.sections.some((sec) => sec.cap > sec.enr))) continue;
        if (st.state === 'open') openCount++; else if (st.state === 'closed') closedCount++;
        shown++;
        itemHtml += courseRow(c, st);
      } else if (item.elective) {
        const e = item.elective;
        const title = e.title || 'Seçmeli';
        if (filters.hideTaken && e.options && e.options.every((o) => isTaken(o.code))) continue;
        if (filters.types.size && !matchesElectiveType(e, filters.types)) continue;
        const joined = joinElective(e, rows, historyFor(''));
        const open = joined.openCount;
        if (filters.open && !open) continue;
        if (filters.cap && !(joined.options.some((o) => o.status.state === 'open' && o.status.sections.some((sec) => sec.cap > sec.enr)))) continue;
        if (open) slotOpen++;
        shown++;
        itemHtml += electiveRow(joined, open);
      }
    }
    if (!itemHtml) return '';
    return `<section class="dp-sem">
      <h3 class="dp-sem-head">${esc(s.title)} <span class="dp-load">${esc(fmtSemLoad(load))}</span></h3>
      ${itemHtml}
    </section>`;
  }).join('');

  root.innerHTML = root.innerHTML || '<p class="empty">Filtreler bu görünümde hiçbir ders bırakmadı.</p>';

  // "Bu dönem planından N ders açık · M zorunlu · K seçmeli slot"
  $('#dp-result').innerHTML = planSummaryLine(openCount, closedCount, slotOpen, shown);

  if (historyCodes.length) ensureHistoryFor(historyCodes);
}

function matchesElectiveType(e, types) {
  // Slot adındaki tür etiketini dene ("(ITB)", "ITB Elective"); bilinmiyorsa geç.
  const title = e.title || '';
  for (const t of types) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(title)) return true;
  }
  return false;
}

function planSummaryLine(open, closed, slotOpen, shown) {
  const parts = [`bu dönem planından <b>${open}</b> ders açık`];
  parts.push(`<b>${shown - slotOpen}</b> zorunlu`);
  parts.push(`<b>${slotOpen}</b> seçmeli slot`);
  if (closed) parts.push(`${closed} kapalı`);
  return parts.join(' · ');
}

function courseRow(c, st) {
  const meta = `${[c.theory, c.tutorial, c.lab].map((n) => n || 0).join('+')} · ${trNum(c.credits)} kr · ${trNum(c.ects)} AKTS`;
  const badges = [
    c.required ? `<span class="dp-badge dp-req">${esc(c.required)}</span>` : '',
    c.type ? `<span class="dp-badge dp-type-b">${esc(c.type)}</span>` : '',
  ].join('');
  const status = statusBadge(c, st);
  const sections = st.state === 'open' ? `<div class="dp-sections">${st.sections.map(sectionRow).join('')}</div>` : '';
  return `<div class="dp-course">
    <div class="dp-course-head">
      <button type="button" class="dp-code" data-act="detail" data-code="${esc(c.code)}">${esc(c.code)}</button>
      <span class="dp-name">${esc(c.name)}</span>
      ${badges}
      <span class="dp-meta">${meta}</span>
      ${status}
    </div>
    ${sections}
  </div>`;
}

function statusBadge(c, st) {
  if (st.state === 'open') {
    const cap = st.sections.reduce((s, x) => s + (x.cap || 0), 0);
    const enr = st.sections.reduce((s, x) => s + (x.enr || 0), 0);
    return `<span class="dp-status open" title="${esc(c.code)} bu dönem açık">● açık · ${st.sections.length} şube · ${enr}/${cap}</span>`;
  }
  if (st.state === 'closed') {
    return `<span class="dp-status closed">● bu dönem açık değil · son ${esc(termLabel(st.lastTerm))}</span>`;
  }
  return `<span class="dp-status missing">● eşleşme bulunamadı</span>`;
}

// Şube alt satırı: CRN · hoca · gün/saat · doluluk + eylemler.
function sectionRow(sec) {
  const when = sec.when || '—';
  const fill = sec.cap > 0 ? fillBar(sec.cap, sec.enr) : '—';
  const full = sec.cap > 0 && sec.enr >= sec.cap;
  return `<div class="dp-section">
    <span class="dp-crn">${esc(sec.crn)}</span>
    <span class="dp-instr">${esc(sec.instructor || '—')}</span>
    <span class="dp-when">${esc(when)}</span>
    <span class="dp-fill">${fill}${full ? ' <span class="dp-full">dolu</span>' : ''}</span>
    <span class="dp-actions">
      <button type="button" data-act="detail" data-code="${esc(sec.code)}">detay</button>
      <button type="button" data-act="add" data-branch="${esc(sec.branch)}" data-crn="${esc(sec.crn)}">programa ekle</button>
    </span>
  </div>`;
}

function electiveRow(e, open) {
  const meta = fmtSlotLoad(e);
  const total = e.options ? e.options.length : 0;
  const label = open
    ? `${total} alternatiften ${open} tanesi bu dönem açık`
    : `${total} alternatif · bu dönem açık değil`;
  return `<div class="dp-elective">
    <div class="dp-course-head">
      <span class="dp-name dp-elective-name">${esc(e.title || 'Seçmeli')}</span>
      <span class="dp-meta">${meta}</span>
      <span class="dp-status ${open ? 'open' : 'closed'}">● ${esc(label)}</span>
    </div>
    <div class="dp-actions">
      <button type="button" class="btn-ghost" data-act="pool" data-title="${esc(e.title || '')}">havuzu aç →</button>
    </div>
  </div>`;
}

function fmtSlotLoad(e) {
  const cr = e.credits ? `kr: ${esc(e.credits)}` : '';
  const ec = e.ects && e.ects.length ? `AKTS: ${e.ects.map((n) => trNum(n)).join('/')}` : '';
  return [cr, ec].filter(Boolean).join(' · ');
}

function fmtSemLoad(load) {
  const k = typeof load.credits === 'object' ? `${trNum(load.credits.min)}–${trNum(load.credits.max)}` : trNum(load.credits);
  const e = typeof load.ects === 'object' ? `${trNum(load.ects.min)}–${trNum(load.ects.max)}` : trNum(load.ects);
  return `${k} kr · ${e} AKTS`;
}

// -- özet şeridi --

function renderSummary(sems) {
  const el = $('#dp-summary');
  if (!el) return;
  const total = `${trNum(num(plan.totalCredits))} kredi · ${trNum(num(plan.totalEcts))} AKTS`;
  const load = sems.length === 1
    ? `seçili yarıyıl ${fmtSemLoad(semesterLoad(sems[0]))}`
    : sems.length > 1 ? `${sems.length} yarıyıl` : 'tüm plan';
  const prog = plan.programName || progCode;
  const label = plan.planLabel ? `<span class="dp-plan-label">${esc(plan.planLabel)}</span>` : '';
  el.innerHTML = `<div class="dp-summary-grid">
    <span><b>${esc(prog)}</b><em>${label || esc(progCode)}</em></span>
    <span><b>${esc(total)}</b><em>program toplamı</em></span>
    <span><b>${esc(load)}</b><em>plan yükü</em></span>
  </div>`;
}

function num(s) {
  const n = parseFloat(String(s || '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

// -- olaylar --

function init() {
  const term = $('#dp-term');
  term.addEventListener('change', async () => {
    termSlug = term.value;
    await reloadRows();
    renderAll();
    saveState();
  });
  $('#dp-refresh').addEventListener('click', async () => {
    histCache.clear();
    await reloadRows();
    renderAll();
  });
  $('#dp-prog').addEventListener('change', () => {
    selectProgram($('#dp-prog').value);
  });
  ['#dp-open', '#dp-cap', '#dp-hide'].forEach((sel) => {
    $(sel).addEventListener('change', () => {
      filters.open = $('#dp-open').checked;
      filters.cap = $('#dp-cap').checked;
      filters.hideTaken = $('#dp-hide').checked;
      saveState();
      renderAll();
    });
  });
  // Olay yetki devri: satır düğmeleri (detay / programa ekle / havuz).
  $('#dp-semesters').addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'detail') {
      openCourseDetail(act.dataset.code, { term: termSlug, source: 'dersplanim' });
    } else if (a === 'add') {
      const ok = fav.addToSchedule(termSlug, act.dataset.branch, act.dataset.crn);
      toast(ok ? 'programa eklendi' : 'zaten listede');
      act.disabled = true;
      act.textContent = ok ? '✓ eklendi' : 'listedeydi';
    } else if (a === 'pool') {
      // Seçmeli havuz panelini mevcut akışla aç: URL'yi kur, önşart sekmesine git.
      // Sayfa, ?prog+&pool= URL mekanizmasını çalıştırır — ikinci bir liste yazılmaz.
      const p = new URLSearchParams();
      if (progCode) p.set('prog', progCode);
      if (act.dataset.title) p.set('pool', act.dataset.title);
      location.assign(location.pathname + '?' + p.toString() + '#onsart');
    }
  });
}

// i18n görünümüne uydur: boot'ta onShow dışı çağrılmaz.
export function initDersplanim() {
  // (app.js wireTabs onShow üzerinden çağırır)
}
