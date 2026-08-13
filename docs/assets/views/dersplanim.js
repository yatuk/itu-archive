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
import { joinCourse, joinElective, semesterLoad } from '../core/plan.js';
import { isTaken, getTaken, saveTaken, notifyTakenChanged } from '../core/taken.js';
import { loadStored, saveStored, setGrade, setElective, buildEntries, exportJSON, importJSON } from '../core/planstore.js';
import { GRADE_POINTS, calcGPA, latestOnly, progress, targetNeeded, fmtTr2 } from '../core/grades.js';
import { confirmDialog } from '../core/dialog.js';

let inited = false;
let progIndex = [];     // curriculum/index.json (fakülte → program listesi)
let plan = null;        // seçili programın müfredatı
let progCode = '';      // seçili program kodu
let termSlug = '';      // eşleştirme yapılan dönem
let rows = [];          // o dönemin search.json satırları
const histCache = new Map(); // branş → history nesnesi
let stored = {};        // program bazlı not verisi (localStorage)
const catalogMap = new Map(); // seçilen seçmeli ders kodu → { local, ects }

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
    <div class="dp-grades" id="dp-grades" hidden>
      <div class="dp-grades-grid">
        <span><b id="dp-gano">—</b><em>GANO (girdiğin notlara göre)</em></span>
        <span><b id="dp-progress">—</b><em>ilerleme</em></span>
        <span><b id="dp-target">—</b><em>hedef</em></span>
      </div>
      <div class="dp-transfer">
        <label>şimdiye kadarki kredi <input id="dp-tcredits" type="number" min="0" step="0.5" inputmode="decimal"></label>
        <label>mevcut GANO <input id="dp-tgpa" type="number" min="0" max="4" step="0.01" inputmode="decimal"></label>
        <label class="dp-target-gpa">hedef GANO <input id="dp-targetgpa" type="number" min="0" max="4" step="0.01" value="3.00"></label>
      </div>
      <div class="dp-types-progress" id="dp-types-progress" aria-live="polite"></div>
      <div class="dp-grades-actions">
        <button type="button" id="dp-export" class="btn-ghost">dışa aktar</button>
        <button type="button" id="dp-import" class="btn-ghost">içe aktar</button>
        <button type="button" id="dp-reset" class="btn-ghost p-danger">tümünü sıfırla</button>
      </div>
      <p class="dp-privacy">Notların yalnızca tarayıcında saklanır (localStorage); sunucuya hiçbir şey gönderilmez.
      Bu bir transkript değildir — "resmî GANO'n budur" demeyiz, "girdiğin notlara göre" deriz. Yuvarlama,
      koşullu geçme ve tekrar kuralları OBS ile küçük farklar üretebilir; kaynak
      <a href="https://www.sis.itu.edu.tr/tr/duyurular/not-basari-duyurusu/" target="_blank" rel="noopener">İTÜ not ve başarı yönergesi</a>.</p>
    </div>
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
  stored = loadStored(code);
  catalogMap.clear();
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
  await ensureTerm();
  await reloadRows();
  renderAll();
  saveState();
  // Seçili seçmeli derslerin kredilerini katalogdan doldur (GANO hesabı için).
  ensureCatalogForPicks();
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

// -- not girişi (Faz: Ders Planım) --

// Seçilen seçmeli derslerin kredi/AKTS'sini katalogdan doldurur (GANO hesabı).
async function ensureCatalogForPicks() {
  const picks = stored.elective ? Object.values(stored.elective) : [];
  const needed = [...new Set(picks.map((p) => p?.code).filter((c) => c && !catalogMap.has(c) && !catalogPending.has(c)))];
  if (!needed.length) return;
  needed.forEach((c) => catalogPending.add(c));
  await Promise.all(needed.map(async (code) => {
    const branch = branchOf(code);
    try {
      const data = await getJSON(`data/catalog/${branch}.json`);
      const rec = data && data[code];
      if (rec && rec.credits) {
        catalogMap.set(code, { local: rec.credits.local, ects: rec.credits.ects });
      }
    } catch { /* katalogda yok — varsayılan kalır */ }
  }));
  renderGPA();
}

const catalogPending = new Set();

// Not seçenekleri: harf notları + muaf/geçti/kredisiz/eksik + "—" (alınmadı).
const GRADE_CHOICES = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF', 'M', 'G', 'P', 'BL', 'E'];

// Klavyeyle hızlı giriş: ilk harfe göre kademeli döngü (b → BA → BA+ → BB → …).
const GRADE_GROUPS = {
  a: ['AA'],
  b: ['BA', 'BA+', 'BB', 'BB+'],
  c: ['CB', 'CB+', 'CC', 'CC+'],
  d: ['DC', 'DC+', 'DD', 'DD+'],
  f: ['FF'],
  v: ['VF'],
  m: ['M'],
  g: ['G'],
  p: ['P'],
  l: ['BL'],
  e: ['E'],
};

function gradeOptions(selected, code) {
  const opts = ['<option value="">—</option>']
    .concat(GRADE_CHOICES.map((g) => `<option value="${g}" ${g === selected ? 'selected' : ''}>${g}</option>`))
    .join('');
  return `<select class="dp-grade" data-gkind="course" data-gcode="${esc(code)}" aria-label="${esc(code)} notu" tabindex="0">${opts}</select>`;
}

// Seçmeli slot için ders seçimi + not girişi.
function electiveControls(slotKey, e, pick) {
  const opts = (e.options || []).map((o) =>
    `<option value="${esc(o.code)}" ${pick?.code === o.code ? 'selected' : ''}>${esc(o.code)} — ${esc(o.name || '')}</option>`
  ).join('');
  const defaultOpt = `<option value="" ${!pick?.code ? 'selected' : ''}>— ders seç —</option>`;
  const pickSel = `<select class="dp-epick" data-slot="${slotKey}" aria-label="Seçmeli ders seç">${defaultOpt}${opts}</select>`;
  const grade = pick?.code
    ? `<select class="dp-grade dp-egrade" data-gkind="elective" data-gslot="${slotKey}" data-gcode="${esc(pick.code)}" aria-label="${esc(pick.code)} notu" tabindex="0">
        <option value="">—</option>${GRADE_CHOICES.map((g) => `<option value="${g}" ${g === pick.grade ? 'selected' : ''}>${g}</option>`).join('')}
      </select>`
    : '<span class="dp-grade-hint">önce ders seç</span>';
  return `<div class="dp-elective-inputs">${pickSel}${grade}</div>`;
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

  let openCount = 0, closedCount = 0, slotOpen = 0, shown = 0;

  const root = $('#dp-semesters');
  const historyCodes = [];

  const semAvgs = semesterAverages();
  root.innerHTML = sems.map(({ s, i }) => {
    const load = semesterLoad(s);
    const avg = semAvgs[i];
    const avgHtml = avg == null ? '' : `<span class="dp-sem-avg" title="Bu yarıyılın ortalaması (girdiğin notlara göre)">ort ${fmtTr2(avg)}</span>`;
    let itemHtml = '';
    s.items.forEach((item, ii) => {
      const slotKey = `s${i}i${ii}`;
      if (item.course) {
        const c = item.course;
        if (filters.types.size && (!c.type || !filters.types.has(c.type))) return;
        if (filters.hideTaken && isTaken(c.code)) return;
        const st = joinCourse(c.code, rows, historyFor(branchOf(c.code)));
        if (st.state === 'closed' && !histCache.has(branchOf(c.code))) historyCodes.push(c.code);
        if (filters.open && st.state !== 'open') return;
        if (filters.cap && !(st.state === 'open' && st.sections.some((sec) => sec.cap > sec.enr))) return;
        if (st.state === 'open') openCount++; else if (st.state === 'closed') closedCount++;
        shown++;
        itemHtml += courseRow(c, st, slotKey);
      } else if (item.elective) {
        const e = item.elective;
        if (filters.hideTaken && e.options && e.options.every((o) => isTaken(o.code))) return;
        if (filters.types.size && !matchesElectiveType(e, filters.types)) return;
        const joined = joinElective(e, rows, historyFor(''));
        const open = joined.openCount;
        if (filters.open && !open) return;
        if (filters.cap && !(joined.options.some((o) => o.status.state === 'open' && o.status.sections.some((sec) => sec.cap > sec.enr)))) return;
        if (open) slotOpen++;
        shown++;
        itemHtml += electiveRow(joined, open, slotKey);
      }
    });
    if (!itemHtml) return '';
    return `<section class="dp-sem" data-si="${i}">
      <h3 class="dp-sem-head">${esc(s.title)} <span class="dp-load">${esc(fmtSemLoad(load))}</span>${avgHtml}</h3>
      ${itemHtml}
    </section>`;
  }).join('');

  root.innerHTML = root.innerHTML || '<p class="empty">Filtreler bu görünümde hiçbir ders bırakmadı.</p>';

  // "Bu dönem planından N ders açık · M zorunlu · K seçmeli slot"
  $('#dp-result').innerHTML = planSummaryLine(openCount, closedCount, slotOpen, shown);

  renderGPA();
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

function courseRow(c, st, slotKey) {
  const meta = `${[c.theory, c.tutorial, c.lab].map((n) => n || 0).join('+')} · ${trNum(c.credits)} kr · ${trNum(c.ects)} AKTS`;
  const badges = [
    c.required ? `<span class="dp-badge dp-req">${esc(c.required)}</span>` : '',
    c.type ? `<span class="dp-badge dp-type-b">${esc(c.type)}</span>` : '',
  ].join('');
  const status = statusBadge(c, st);
  const rec = (stored.grades || {})[c.code] || {};
  const repeat = rec.prev ? `<span class="dp-repeat" title="İTÜ'de son alınan not geçerli — önceki hesaba girmez">tekrar · önceki: ${esc(rec.prev)}</span>` : '';
  const grade = gradeOptions(rec.grade || '', c.code);
  const sections = st.state === 'open' ? `<div class="dp-sections">${st.sections.map(sectionRow).join('')}</div>` : '';
  return `<div class="dp-course">
    <div class="dp-course-head">
      <button type="button" class="dp-code" data-act="detail" data-code="${esc(c.code)}">${esc(c.code)}</button>
      <span class="dp-name">${esc(c.name)}</span>
      ${badges}
      <span class="dp-meta">${meta}</span>
      ${status}
      <span class="dp-grade-wrap">${grade}</span>
      ${repeat}
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

function electiveRow(e, open, slotKey) {
  const meta = fmtSlotLoad(e);
  const total = e.options ? e.options.length : 0;
  const label = open
    ? `${total} alternatiften ${open} tanesi bu dönem açık`
    : `${total} alternatif · bu dönem açık değil`;
  const pick = (stored.elective || {})[slotKey] || null;
  return `<div class="dp-elective">
    <div class="dp-course-head">
      <span class="dp-name dp-elective-name">${esc(e.title || 'Seçmeli')}</span>
      <span class="dp-meta">${meta}</span>
      <span class="dp-status ${open ? 'open' : 'closed'}">● ${esc(label)}</span>
    </div>
    ${electiveControls(slotKey, e, pick)}
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
  const remain = remainingRequired();
  const remainHtml = remain > 0 ? `<span><b>${remain} ders</b><em>kalan zorunlu</em></span>` : '';
  el.innerHTML = `<div class="dp-summary-grid">
    <span><b>${esc(prog)}</b><em>${label || esc(progCode)}</em></span>
    <span><b>${esc(total)}</b><em>program toplamı</em></span>
    <span><b>${esc(load)}</b><em>plan yükü</em></span>
    ${remainHtml}
  </div>`;
}

function num(s) {
  const n = parseFloat(String(s || '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

// Notu girilmemiş (henüz alınmamış) zorunlu ders sayısı — "kalan zorunlu dersler".
function remainingRequired() {
  if (!plan) return 0;
  const graded = new Set(allEntries().filter((e) => e.grade).map((e) => e.code));
  let n = 0;
  for (const sem of plan.semesters) {
    for (const item of sem.items) {
      if (item.course && item.course.required === 'Z' && !graded.has(item.course.code)) n++;
    }
  }
  return n;
}

// -- GANO hesapları (Faz: Ders Planım not girişi) --

function allEntries() {
  return buildEntries(plan, stored, catalogMap);
}

// Yarıyıl ortalamaları: her yarıyılın kendi Σ(katsayı×kredi)/Σ(kredi).
function semesterAverages() {
  if (!plan) return [];
  const entries = allEntries();
  let idx = 0;
  return plan.semesters.map((sem) => {
    const slice = entries.slice(idx, idx + sem.items.length);
    idx += sem.items.length;
    return calcGPA(slice);
  });
}

// Mevcut GANO + kredi. transfer (yatay geçiş) varsa başlangıç ağırlığı olarak
// katılır; boş bırakılırsa yok sayılır.
function currentState() {
  const entries = allEntries();
  const base = stored.transfer;
  const baseCredits = Number(base?.credits) || 0;
  const baseGpa = Number(base?.gpa);
  const hasBase = baseCredits > 0 && !isNaN(baseGpa);
  let num = hasBase ? baseCredits * baseGpa : 0;
  let den = hasBase ? baseCredits : 0;
  for (const e of entries) {
    const pts = (e.grade == null || e.grade === '') ? undefined : GRADE_POINTS[e.grade];
    if (pts === undefined) continue;
    const cr = Number(e.credits) || 0;
    num += pts * cr;
    den += cr;
  }
  return { gpa: den === 0 ? null : num / den, credits: den };
}

function hasAnyGrade() {
  return allEntries().some((e) => e.grade);
}

// GANO paneli: ort, ilerleme, hedef + transfer alanları. Hiç not yoksa gizli.
function renderGPA() {
  const panel = $('#dp-grades');
  if (!panel) return;
  if (!hasAnyGrade() && !stored.transfer) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const st = currentState();
  $('#dp-gano').textContent = st.gpa === null ? '—' : fmtTr2(st.gpa);
  const p = progress(allEntries(), { credits: plan.totalCredits, ects: plan.totalEcts }, stored.transfer);
  $('#dp-progress').textContent = `${p.credits.done}/${p.credits.total || '?'} kredi · ${p.ects.done}/${p.ects.total || '?'} AKTS`;
  $('#dp-target').textContent = targetText(st);
  $('#dp-types-progress').textContent = typeProgress();
  const t = stored.transfer || {};
  $('#dp-tcredits').value = t.credits ?? '';
  $('#dp-tgpa').value = t.gpa ?? '';
}

// Tür bazlı eksik: "ITB kredin 9/12" — plan satırlarındaki type alanından bedava.
function typeProgress() {
  const planType = new Map();
  const doneType = new Map();
  const doneByCode = new Map(allEntries().filter((e) => e.grade).map((e) => [e.code, e]));
  for (const sem of (plan?.semesters || [])) {
    for (const item of sem.items) {
      if (!item.course || !item.course.type) continue;
      const t = item.course.type;
      planType.set(t, (planType.get(t) || 0) + (item.course.credits || 0));
      const e = doneByCode.get(item.course.code);
      if (e) doneType.set(t, (doneType.get(t) || 0) + (e.credits || 0));
    }
  }
  if (!planType.size) return '';
  return [...planType.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([t, total]) => `${t} kredin ${doneType.get(t) || 0}/${total}`)
    .join(' · ');
}

function targetText(st) {
  if (st.gpa === null) return 'not girilmedikçe hesap yok';
  const target = parseFloat(String($('#dp-targetgpa').value || '3').replace(',', '.'));
  if (isNaN(target)) return '';
  const total = num(plan.totalCredits);
  const remaining = Math.max(0, total - st.credits);
  if (remaining === 0) return 'tüm plan kredisi girilmiş — hedef hesabı kalmadı';
  const r = targetNeeded({ gpa: st.gpa, credits: st.credits }, target, remaining);
  if (!r) return '';
  const rem = Math.round(remaining);
  if (r.needed > 4.0) {
    return `GANO'yu ${fmtTr2(target)} yapmak için kalan ${rem} kredide ortalama ${fmtTr2(r.needed)} gerekir — 4,00'ü aşmak gerekir, ulaşılamaz`;
  }
  return `GANO'yu ${fmtTr2(target)} yapmak için kalan ${rem} kredide ortalama ${fmtTr2(r.needed)} gerekir`;
}

// Not değişince listeyi yeniden kurmadan yarıyıl ortalamaları + GANO tazelenir
// (seçici odağı korunur).
function refreshAverages() {
  const avgs = semesterAverages();
  for (const sec of document.querySelectorAll('.dp-sem')) {
    const si = Number(sec.dataset.si);
    const el = sec.querySelector('.dp-sem-avg');
    if (el) {
      const avg = Number.isInteger(si) ? avgs[si] : null;
      el.textContent = avg == null ? '' : `ort ${fmtTr2(avg)}`;
    }
  }
  renderGPA();
}

// Not değiştirme + kaydetme (klavye ve tıklama ortak yolu). Zorunlu ders notu
// stored.grades'a, seçmeli seçim notu stored.elective slotuna yazılır.
function commitGrade(select) {
  const gcode = select.dataset.gcode;
  if (select.dataset.gkind === 'elective') {
    stored = setElective(stored, select.dataset.gslot, gcode, select.value);
    saveStored(progCode, stored);
    syncTakenFromGrades();
    refreshAverages();
    return;
  }
  stored = setGrade(stored, gcode, select.value);
  saveStored(progCode, stored);
  syncTakenFromGrades();
  refreshAverages();
  const rec = stored.grades[gcode];
  // Tekrar işaretini güncelle (önceki not varsa) — odağı bozmadan.
  const row = select.closest('.dp-course');
  if (!row) return;
  let rep = row.querySelector('.dp-repeat');
  if (rec?.prev) {
    if (!rep) {
      rep = document.createElement('span');
      rep.className = 'dp-repeat';
      row.querySelector('.dp-course-head').appendChild(rep);
    }
    rep.title = "İTÜ'de son alınan not geçerli — önceki hesaba girmez";
    rep.textContent = `tekrar · önceki: ${rec.prev}`;
  } else if (rep) {
    rep.remove();
  }
}

// Klavye (delege): harf → kademeli döngü (b → BA → BA+ → …); Tab → sıradaki
// not alanı. #dp-semesters üzerinde tek keydown dinleyicisiyle (init'te) çalışır.
function handleGradeKey(sel, ev) {
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (ev.key === 'Tab') {
    ev.preventDefault();
    focusNextGrade(sel);
    return;
  }
  const key = ev.key.toLowerCase();
  const group = GRADE_GROUPS[key];
  if (!group) return;
  ev.preventDefault();
  const i = group.indexOf(sel.value);
  const next = i >= 0 ? (i + 1 < group.length ? group[i + 1] : '') : group[0];
  sel.value = next;
  commitGrade(sel);
}

// Girilen notlar aynı zamanda "aldığım dersler" beyanıdır (Faz D): notu olan
// dersler taken'e işlenir, görünümler (önşart/havuz/filtreler) TAKEN_CHANGED'la
// tazelenir. Silmez — kullanıcı "aldığım dersler" modalından kendi eklediklerini
// korur; yalnızca ekler.
function syncTakenFromGrades() {
  const t = getTaken();
  const graded = new Set(t.codes);
  for (const e of allEntries()) {
    if (e.grade && e.code && e.code !== 'Seçmeli') graded.add(e.code);
  }
  saveTaken({ codes: [...graded], program: t.program || progCode });
  notifyTakenChanged();
}

function focusNextGrade(current) {
  const all = [...document.querySelectorAll('#dp-semesters .dp-grade, #dp-semesters .dp-epick')];
  const idx = all.indexOf(current);
  const next = all[idx + 1];
  if (next) { next.focus(); next.select?.(); }
}

function electiveBySlot(slotKey) {
  if (!plan) return null;
  for (const [si, sem] of plan.semesters.entries()) {
    for (const [ii, item] of sem.items.entries()) {
      if (`s${si}i${ii}` === slotKey && item.elective) {
        return { slotKey, elective: item.elective };
      }
    }
  }
  return null;
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

  // Not girişi: değişiklik ve klavye (delege — satırlar yeniden çizilir).
  $('#dp-semesters').addEventListener('change', (ev) => {
    const sel = ev.target;
    if (!sel.classList) return;
    if (sel.classList.contains('dp-grade')) { commitGrade(sel); return; }
    if (sel.classList.contains('dp-epick')) {
      const slot = sel.dataset.slot;
      stored = setElective(stored, slot, sel.value, '');
      saveStored(progCode, stored);
      if (sel.value) ensureCatalogForPicks();
      const found = electiveBySlot(slot);
      if (found) {
        const inputs = sel.closest('.dp-elective-inputs');
        if (inputs) inputs.outerHTML = electiveControls(slot, found.elective, { code: sel.value, grade: '' });
      }
      refreshAverages();
    }
  });
  $('#dp-semesters').addEventListener('keydown', (ev) => {
    const sel = ev.target;
    if (sel.classList && sel.classList.contains('dp-grade')) handleGradeKey(sel, ev);
  });

  // Transfer (yatay geçiş) başlangıç ağırlığı.
  const wireTransfer = () => {
    const credits = parseFloat(String($('#dp-tcredits').value || '').replace(',', '.'));
    const gpa = parseFloat(String($('#dp-tgpa').value || '').replace(',', '.'));
    const t = {};
    if (!isNaN(credits) && credits > 0) t.credits = credits;
    if (!isNaN(gpa)) t.gpa = gpa;
    stored = { ...stored, transfer: Object.keys(t).length ? t : null };
    saveStored(progCode, stored);
    renderGPA();
  };
  $('#dp-tcredits').addEventListener('change', wireTransfer);
  $('#dp-tgpa').addEventListener('change', wireTransfer);
  $('#dp-targetgpa').addEventListener('input', renderGPA);

  // Dışa/içe aktar + sıfırla (veri yalnızca tarayıcıda, JSON ile taşınır).
  $('#dp-export').addEventListener('click', () => {
    const blob = new Blob([exportJSON(progCode, stored)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ders-planim-${progCode}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('#dp-import').addEventListener('click', () => {
    const val = window.prompt("Daha önce dışa aktardığın JSON'u yapıştır:");
    if (!val) return;
    const parsed = importJSON(val);
    if (!parsed) { toast('Geçersiz dosya', { kind: 'warn' }); return; }
    if (parsed.program !== progCode) { toast('Bu dosya başka bir programın notlarını içeriyor', { kind: 'warn' }); return; }
    stored = parsed.data;
    saveStored(progCode, stored);
    catalogMap.clear();
    ensureCatalogForPicks();
    renderAll();
    toast('Notlar içe aktarıldı');
  });
  $('#dp-reset').addEventListener('click', () => {
    confirmDialog({
      title: 'Tümünü sıfırla',
      message: `${progCode} için girilen tüm notlar ve transfer bilgisi silinecek. Geri alınamaz.`,
      okLabel: 'Sıfırla',
      danger: true,
    }).then((yes) => {
      if (!yes) return;
      stored = {};
      saveStored(progCode, stored);
      renderAll();
      toast('Notlar sıfırlandı');
    });
  });
}

// i18n görünümüne uydur: boot'ta onShow dışı çağrılmaz.
export function initDersplanim() {
  // (app.js wireTabs onShow üzerinden çağırır)
}
