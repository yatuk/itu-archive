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
import { joinCourse, joinElective, semesterLoad, canonicalCode, groupSections, parseRange, creditBadge } from '../core/plan.js';
import { isTaken, getTaken, saveTaken, notifyTakenChanged } from '../core/taken.js';
import { loadStored, saveStored, setGrade, setRepeat, setElective, buildEntries, exportJSON, importJSON, typeBuckets } from '../core/planstore.js';
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
let initialParams = null; // onShow'da senkron yakalanan URL parametreleri

// Filtre durumu (URL'den okunur, DOM'dan yazılır).
const filters = { open: false, cap: false, hideTaken: false, semesters: new Set(), types: new Set() };

export async function onShow() {
  // URL parametrelerini SENKRON yakala: app.js writeViewUrl, await sırasında
  // sekme URL'sini yeniden yazıp prog'u düşürebilir (DOM henüz boşken) —
  // doğrudan ?prog=X#dersplanim bağlantısı bu yüzden programı kaybetmemeli.
  const urlParams = new URLSearchParams(location.search);
  initialParams = urlParams;
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
  const want = urlParams.get('prog') || '';
  applyParams(urlParams);
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
    <div class="dp-grades" id="dp-grades">
      <p class="dp-grades-empty" id="dp-grades-empty">Not girdikçe GANO burada hesaplanır.</p>
      <div class="dp-grades-body">
        <div class="dp-grades-grid">
          <div class="dp-metric"><em>GANO</em><b id="dp-gano">yok</b><small>girdiğin notlara göre</small></div>
          <div class="dp-metric"><em>ilerleme</em><b id="dp-progress">0/0 kredi</b><small id="dp-progress-sub"></small></div>
          <div class="dp-metric"><em>hedef</em><b id="dp-target">yok</b><small id="dp-target-sub"></small></div>
        </div>
        <div class="dp-types-progress" id="dp-types-progress" aria-live="polite"></div>
        <div class="dp-transfer">
          <label>şimdiye kadarki kredi <input id="dp-tcredits" type="number" min="0" step="0.5" inputmode="decimal" placeholder="0–250"></label>
          <label>mevcut GANO <input id="dp-tgpa" type="number" min="0" max="4" step="0.01" inputmode="decimal" placeholder="0–4"></label>
          <label class="dp-target-gpa">hedef GANO <input id="dp-targetgpa" type="number" min="0" max="4" step="0.01" value="3.00" placeholder="0–4"> <span class="dp-target-hint" id="dp-target-hint"></span></label>
        </div>
      </div>
      <div class="dp-grades-actions">
        <button type="button" id="dp-export" class="btn-ghost">dışa aktar</button>
        <button type="button" id="dp-import" class="btn-ghost">içe aktar</button>
        <button type="button" id="dp-reset" class="btn-ghost">tümünü sıfırla</button>
      </div>
      <p class="dp-privacy">Notların yalnızca tarayıcında saklanır (localStorage); sunucuya hiçbir şey gönderilmez.
      Bu bir transkript değildir, "resmî GANO'n budur" demeyiz, "girdiğin notlara göre" deriz. Yuvarlama,
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
        const label = p.name !== p.code ? `${p.code} · ${p.name}` : p.code;
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
    $('#dp-semesters').innerHTML = `<p class="empty">Bu programa ait bir ders planı bulunamadı (${esc(code)}).</p>`;
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
  const want = (initialParams || new URLSearchParams(location.search)).get('term');
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

// Not seçici: dar select (DOM node). data-gkind course/elective; seçiliyse "filled".
function buildGradeSelect(selected, code, kind = 'course', slotKey = '') {
  const sel = document.createElement('select');
  sel.className = 'dp-grade';
  sel.dataset.gkind = kind;
  sel.dataset.gcode = code;
  if (kind === 'elective') sel.dataset.gslot = slotKey;
  sel.setAttribute('aria-label', `${code} notu`);
  sel.tabIndex = 0;
  const none = document.createElement('option');
  none.value = '';
  none.textContent = '·';
  sel.appendChild(none);
  for (const g of GRADE_CHOICES) {
    const o = document.createElement('option');
    o.value = g;
    o.textContent = g;
    if (g === selected) o.selected = true;
    sel.appendChild(o);
  }
  if (selected) sel.classList.add('filled');
  return sel;
}

function makeClearBtn() {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'dp-grade-clear';
  b.dataset.act = 'dp-clear';
  b.textContent = '×';
  b.title = 'notu temizle';
  return b;
}

// Not seçiliyse yanına × ekler, boşsa kaldırır.
function syncGradeClear(select, hasGrade) {
  const wrap = select.closest('.dp-grade-wrap');
  if (!wrap) return;
  let clear = wrap.querySelector('.dp-grade-clear');
  if (hasGrade && !clear) wrap.appendChild(makeClearBtn());
  else if (!hasGrade && clear) clear.remove();
}

// Seçmeli slot için ders seçimi + not girişi. Option listeleri esc'li string (güvenli).
function electiveControls(slotKey, e, pick) {
  const opts = (e.options || []).map((o) =>
    `<option value="${esc(o.code)}" ${pick?.code === o.code ? 'selected' : ''}>${esc(o.code)} · ${esc(o.name || '')}</option>`
  ).join('');
  const defaultOpt = `<option value="" ${!pick?.code ? 'selected' : ''}>· ders seç ·</option>`;
  const pickSel = `<select class="dp-epick" data-slot="${slotKey}" aria-label="Seçmeli ders seç">${defaultOpt}${opts}</select>`;
  const grade = pick?.code
    ? `<span class="dp-grade-wrap"><select class="dp-grade dp-egrade${pick.grade ? ' filled' : ''}" data-gkind="elective" data-gslot="${slotKey}" data-gcode="${esc(pick.code)}" aria-label="${esc(pick.code)} notu" tabindex="0">
        <option value="">·</option>${GRADE_CHOICES.map((g) => `<option value="${g}" ${g === pick.grade ? 'selected' : ''}>${g}</option>`).join('')}
      </select><button type="button" class="dp-grade-clear" data-act="dp-clear" title="notu temizle">×</button></span>`
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
  wrap.innerHTML = '<span class="dp-type-label">tür:</span>' + types.map((t) =>
    `<button type="button" class="dp-type ${filters.types.has(t) ? 'on' : ''}" data-type="${t}" aria-pressed="${filters.types.has(t)}">${t}</button>`
  ).join('');
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
  const frag = document.createDocumentFragment();
  let any = false;

  for (const { s, i } of sems) {
    const load = semesterLoad(s);
    const avg = semAvgs[i];
    const sem = document.createElement('section');
    sem.className = 'dp-sem';
    sem.dataset.si = i;
    const head = document.createElement('h3');
    head.className = 'dp-sem-head';
    const t = document.createElement('span');
    t.textContent = s.title;
    head.appendChild(t);
    const loadEl = document.createElement('span');
    loadEl.className = 'dp-load';
    loadEl.textContent = fmtSemLoad(load);
    head.appendChild(loadEl);
    if (avg != null) {
      const avgEl = document.createElement('span');
      avgEl.className = 'dp-sem-avg';
      avgEl.title = 'Bu yarıyılın ortalaması (girdiğin notlara göre)';
      avgEl.textContent = `ort ${fmtTr2(avg)}`;
      head.appendChild(avgEl);
    }
    sem.appendChild(head);
    sem.appendChild(buildColHead());

    let hasRows = false;
    s.items.forEach((item, ii) => {
      const slotKey = `s${i}i${ii}`;
      if (item.course) {
        const c = item.course;
        const code = canonicalCode(c.code);
        if (filters.types.size && (!c.type || !filters.types.has(c.type))) return;
        if (filters.hideTaken && isTaken(code)) return;
        const st = joinCourse(code, rows, historyFor(branchOf(code)));
        if (st.state === 'closed' && !histCache.has(branchOf(code))) historyCodes.push(code);
        if (filters.open && st.state !== 'open') return;
        if (filters.cap && !(st.state === 'open' && st.sections.some((sec) => sec.cap > sec.enr))) return;
        if (st.state === 'open') openCount++; else if (st.state === 'closed') closedCount++;
        shown++;
        sem.appendChild(courseRow(c, st, slotKey));
        hasRows = true;
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
        sem.appendChild(electiveRow(joined, open, slotKey));
        hasRows = true;
      }
    });
    if (!hasRows) continue;
    any = true;
    frag.appendChild(sem);
  }

  if (any) root.replaceChildren(frag);
  else {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Bu filtrelerle eşleşen ders yok.';
    root.replaceChildren(p);
  }

  // "Bu dönem planından N ders açık · M zorunlu · K seçmeli slot"
  $('#dp-result').innerHTML = planSummaryLine(openCount, closedCount, slotOpen, shown);

  renderGPA();
  if (historyCodes.length) ensureHistoryFor(historyCodes);
}

// Sütun başlık satırı — blok başında bir kez: kredi | ders | tekrar | not (+ durum boş).
function buildColHead() {
  const h = document.createElement('div');
  h.className = 'dp-colhead';
  for (const lbl of ['kredi', 'ders', 'tekrar', 'not']) {
    const s = document.createElement('span');
    s.textContent = lbl;
    h.appendChild(s);
  }
  h.appendChild(document.createElement('span'));
  return h;
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

// Ders satırı — sabit 5 hücreli ızgara: kredi | ders | tekrar | not | durum.
// Şube listesi satırın ALTINDA katlı (varsayılan kapalı) — satır yüksekliği şube
// sayısından bağımsızdır. Tam DOM (createElement + textContent): ham HTML yok.
function courseRow(c, st, slotKey) {
  const code = canonicalCode(c.code);
  const rec = (stored.grades || {})[code] || {};

  const card = document.createElement('div');
  card.className = 'dp-course';

  const row = document.createElement('div');
  row.className = 'dp-row';

  // 1) kredi rozeti — sadece sayı ("3", "1,5", "0")
  const credit = document.createElement('span');
  credit.className = 'dp-credit';
  credit.textContent = creditBadge(c);
  credit.title = `${trNum(c.credits ?? 0)} kredi`;
  row.appendChild(credit);

  // 2) ders: kod (kalın buton) + ad (normal) — tek satır, taşarsa alt satıra
  const title = document.createElement('span');
  title.className = 'dp-title';
  const codeBtn = document.createElement('button');
  codeBtn.type = 'button';
  codeBtn.className = 'dp-code';
  codeBtn.dataset.act = 'detail';
  codeBtn.dataset.code = code;
  codeBtn.textContent = code;
  const name = document.createElement('span');
  name.className = 'dp-name';
  name.textContent = c.name;
  title.append(codeBtn, name);
  row.appendChild(title);

  // 3) tekrar — saklanan işaret (GANO'ya etkisiz)
  const rep = document.createElement('button');
  rep.type = 'button';
  rep.className = 'dp-repeat-btn' + (rec.repeat ? ' on' : '');
  rep.dataset.act = 'dp-repeat';
  rep.dataset.gcode = code;
  rep.setAttribute('aria-pressed', rec.repeat ? 'true' : 'false');
  rep.title = rec.prev
    ? `tekrar olarak işaretli · önceki: ${rec.prev}`
    : 'tekrar olarak işaretle';
  rep.textContent = rec.repeat ? '↻' : '↺';
  row.appendChild(rep);

  // 4) not: dar select + seçiliyse ×
  const wrap = document.createElement('span');
  wrap.className = 'dp-grade-wrap';
  const sel = buildGradeSelect(rec.grade || '', code);
  wrap.appendChild(sel);
  if (rec.grade) wrap.appendChild(makeClearBtn());
  row.appendChild(wrap);

  // 5) durum / şube disclosure: "● N" tıklanınca şubeler açılır
  if (st.state === 'open') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dp-sec-btn open';
    btn.dataset.act = 'dp-sec';
    btn.setAttribute('aria-expanded', 'false');
    const totalCap = st.sections.reduce((s, x) => s + (x.cap || 0), 0);
    btn.title = `${st.sections.length} şube · toplam kontenjan ${trNum(totalCap)}`;
    btn.textContent = `● ${st.sections.length}`;
    row.appendChild(btn);
  } else {
    const span = document.createElement('span');
    span.className = 'dp-sec-btn closed';
    span.textContent = st.state === 'closed' ? '● kapalı' : '● yok';
    span.title = st.state === 'closed'
      ? `bu dönem açık değil · son ${termLabel(st.lastTerm)}`
      : 'bu dönem açık değil';
    row.appendChild(span);
  }

  card.appendChild(row);

  // şube bölümü — satırın altında, varsayılan kapalı
  const secWrap = document.createElement('div');
  secWrap.className = 'dp-secslot';
  secWrap.hidden = true;
  if (st.state === 'open') secWrap.appendChild(renderSections(st.sections));
  card.appendChild(secWrap);

  return card;
}

// Varsayılan görünür şube grubu sayısı; fazlası "N şube daha göster" arkasında.
const SECTION_SHOW = 3;

// Şubeleri çizer: aynı zaman/kontenjanlıları gruplar, varsayılan 3 grup + "daha
// göster". DOM node döndürür — HTML string yolu tamamen bırakıldı (CRN hücresi
// textContent ile kurulur; ham "<span>" ekranda metin olarak görünmez).
function renderSections(sections) {
  const groups = groupSections(sections);
  const hasInstr = groups.some((g) => g.instructor);
  const shown = groups.slice(0, SECTION_SHOW);
  const rest = groups.slice(SECTION_SHOW);
  const restCount = rest.reduce((s, g) => s + g.count, 0);
  const wrap = document.createElement('div');
  wrap.className = `dp-sections ${hasInstr ? 'has-instr' : 'no-instr'}`;
  for (const g of shown) wrap.appendChild(sectionGroupRow(g, hasInstr));
  if (restCount > 0) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'dp-more';
    more.dataset.act = 'dp-more';
    more.setAttribute('aria-expanded', 'false');
    more.dataset.count = String(restCount);
    more.textContent = `${restCount} şube daha göster`;
    wrap.appendChild(more);
    const moreWrap = document.createElement('div');
    moreWrap.className = 'dp-more-wrap';
    moreWrap.hidden = true;
    for (const g of rest) moreWrap.appendChild(sectionGroupRow(g, hasInstr));
    wrap.appendChild(moreWrap);
  }
  return wrap;
}

// Tek şube grubu satırı: CRN aralığı · (hoca) · gün/saat · şube başına doluluk.
// Toplu kontenjan tek sayı olarak basılmaz; her satır kendi kontenjanını gösterir.
function sectionGroupRow(g, hasInstr) {
  const row = document.createElement('div');
  row.className = 'dp-section';
  // CRN hücresi: aralık etiketi + (varsa) şube sayısı rozeti. title tooltip'te
  // ilk 8 CRN + fazlası; hepsi textContent — esc/innerHTML gerekmez.
  const crn = document.createElement('span');
  crn.className = 'dp-crn';
  crn.title = g.crns.slice(0, 8).join(', ') + (g.crns.length > 8 ? ` … +${g.crns.length - 8}` : '');
  const range = document.createElement('span');
  range.textContent = g.label;
  crn.appendChild(range);
  if (g.count > 1) {
    crn.append(' ');
    const badge = document.createElement('span');
    badge.className = 'dp-crn-count';
    badge.textContent = `${g.count} şube`;
    crn.appendChild(badge);
  }
  row.appendChild(crn);
  // hasInstr (bu derste hoca kolonu çiziliyorsa) grubun hocası yoksa boş hücre
  // konur — aksi halde ızgaradaki kolonlar satırlar arasında kayar.
  if (hasInstr) {
    const instr = document.createElement('span');
    instr.className = 'dp-instr';
    if (g.instructor) instr.textContent = g.instructor;
    row.appendChild(instr);
  }
  const when = document.createElement('span');
  when.className = 'dp-when';
  when.textContent = g.when || 'saat yok';
  row.appendChild(when);
  const fill = document.createElement('span');
  fill.className = 'dp-fill';
  if (g.cap > 0) {
    fill.innerHTML = fillBar(g.cap, g.enr); // fillBar kendi güvenilir motifi üretir
    if (g.enr >= g.cap) {
      fill.append(' ');
      const full = document.createElement('span');
      full.className = 'dp-full';
      full.textContent = 'dolu';
      fill.appendChild(full);
    }
  } else {
    fill.textContent = 'kontenjan yok';
  }
  row.appendChild(fill);
  const actions = document.createElement('span');
  actions.className = 'dp-actions';
  const det = document.createElement('button');
  det.type = 'button';
  det.dataset.act = 'detail';
  det.dataset.code = g.code;
  det.textContent = 'detay';
  actions.appendChild(det);
  const add = document.createElement('button');
  add.type = 'button';
  add.dataset.act = 'add';
  add.dataset.branch = g.branch;
  add.dataset.crn = g.crns[0];
  add.title = `${g.crns[0]} şubesini programa ekle`;
  add.textContent = 'programa ekle';
  actions.appendChild(add);
  row.appendChild(actions);
  return row;
}

// Seçmeli slot — aynı 5 hücreli ızgara: kredi (slot varsayılanı) | slot başlığı
// | (tekrar boş) | ders seç → not | durum (havuzu aç). DOM node.
function electiveRow(e, open, slotKey) {
  const total = e.options ? e.options.length : 0;
  const pick = (stored.elective || {})[slotKey] || null;
  const el = document.createElement('div');
  el.className = 'dp-elective dp-course';
  const row = document.createElement('div');
  row.className = 'dp-row';

  const credit = document.createElement('span');
  credit.className = 'dp-credit';
  credit.textContent = creditBadge({ credits: parseRange(e.credits, [0])[0] });
  row.appendChild(credit);

  const title = document.createElement('span');
  title.className = 'dp-title dp-elective-name';
  title.textContent = e.title || 'Seçmeli';
  row.appendChild(title);

  const repCell = document.createElement('span');
  repCell.className = 'dp-repeat-cell';
  row.appendChild(repCell);

  const notCell = document.createElement('div');
  notCell.className = 'dp-elective-inputs';
  notCell.innerHTML = electiveControls(slotKey, e, pick);
  row.appendChild(notCell);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dp-sec-btn ' + (open ? 'open' : 'closed');
  btn.dataset.act = 'pool';
  if (e.title) btn.dataset.title = e.title;
  btn.textContent = open ? `● ${open}` : '● kapalı';
  btn.title = open
    ? `${total} alternatiften ${open} tanesi açık · havuzu aç`
    : 'bu dönem açık değil · havuzu aç';
  row.appendChild(btn);

  el.appendChild(row);
  return el;
}

function fmtSemLoad(load) {
  const k = typeof load.credits === 'object' ? `${trNum(load.credits.min)}–${trNum(load.credits.max)}` : trNum(load.credits);
  const e = typeof load.ects === 'object' ? `${trNum(load.ects.min)}–${trNum(load.ects.max)}` : trNum(load.ects);
  return `${k} kr · ${e} AKTS`;
}

// -- özet şeridi --

// Plan toplamları. Sayfa altı değeri 0/çözülemezse (önlisans AKTS gibi) kalemlerden
// toplanır ve "hesaplandı" işareti konur — sıfır göstermek veri yokluğunu "sıfır AKTS"
// iddiasına çevirir. Kaynak kazıyıcı totalEctsComputed da yazabilir; eski dosyalarda
// toplam 0 ise burada yine hesaplanır.
function planTotal() {
  let cSum = 0, eSum = 0;
  for (const sem of (plan?.semesters || [])) {
    for (const it of sem.items) {
      if (it.course) { cSum += it.course.credits || 0; eSum += it.course.ects || 0; }
      else if (it.elective) {
        cSum += parseRange(it.elective.credits, [0])[0] || 0;
        eSum += (it.elective.ects && it.elective.ects[0]) || 0;
      }
    }
  }
  const c = num(plan?.totalCredits);
  const e = num(plan?.totalEcts);
  return {
    credits: c > 0 ? c : cSum,
    ects: e > 0 ? e : eSum,
    creditsComputed: plan?.totalCreditsComputed === true || !(c > 0),
    ectsComputed: plan?.totalEctsComputed === true || !(e > 0),
  };
}

function renderSummary(sems) {
  const el = $('#dp-summary');
  if (!el) return;
  const tot = planTotal();
  const total = `${trNum(tot.credits)} kredi · ${trNum(tot.ects)} AKTS`;
  const computed = (tot.creditsComputed || tot.ectsComputed) ? ' · hesaplandı' : '';
  const load = sems.length === 1
    ? `seçili yarıyıl ${fmtSemLoad(semesterLoad(sems[0]))}`
    : sems.length > 1 ? `${sems.length} yarıyıl` : 'tüm plan';
  const prog = plan.programName || progCode;
  const label = plan.planLabel ? `<span class="dp-plan-label">${esc(plan.planLabel)}</span>` : '';
  const remain = remainingRequired();
  const remainHtml = remain > 0 ? `<span><b>${remain} ders</b><em>kalan zorunlu</em></span>` : '';
  el.innerHTML = `<div class="dp-summary-grid">
    <span><b>${esc(prog)}</b><em>${label || esc(progCode)}</em></span>
    <span><b>${esc(total)}</b><em>program toplamı${esc(computed)}</em></span>
    <span><b>${esc(load)}</b><em>plan uzunluğu</em></span>
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
      if (item.course && item.course.required === 'Z' && !graded.has(canonicalCode(item.course.code))) n++;
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

// GANO paneli: üç sabit hizalı kutu (etiket üstte, değer altta). Hiç not ve
// transfer yokken tek satır yeter; boş metrikler sıralanmaz.
function renderGPA() {
  const panel = $('#dp-grades');
  if (!panel) return;
  const hasGrades = hasAnyGrade();
  const hasTransfer = Boolean(stored.transfer && Number(stored.transfer.credits) > 0);
  const empty = !hasGrades && !hasTransfer;
  const emptyEl = $('#dp-grades-empty');
  const body = panel.querySelector('.dp-grades-body');
  if (emptyEl) emptyEl.hidden = !empty;
  if (body) body.classList.toggle('hidden', empty);
  const t = stored.transfer || {};
  $('#dp-tcredits').value = t.credits ?? '';
  $('#dp-tgpa').value = t.gpa ?? '';
  if (empty) { setTargetState(true); return; }

  const st = currentState();
  $('#dp-gano').textContent = st.gpa == null ? 'yok' : fmtTr2(st.gpa);
  const tot = planTotal();
  const p = progress(allEntries(), { credits: tot.credits, ects: tot.ects }, stored.transfer);
  $('#dp-progress').textContent = `${p.credits.done}/${p.credits.total} kredi`;
  const sub = $('#dp-progress-sub');
  if (sub) sub.textContent = tot.ects > 0 ? `${p.ects.done}/${p.ects.total} AKTS` : '';
  $('#dp-target').textContent = targetText(st, tot);
  $('#dp-types-progress').textContent = typeProgress();
  setTargetState(st.gpa == null || st.credits === 0);
}

// Hedef GANO alanı, mevcut GANO yokken sonuç üretemez — pasifleştir ve nedenini yaz.
function setTargetState(off) {
  const input = $('#dp-targetgpa');
  const hint = $('#dp-target-hint');
  if (!input) return;
  input.disabled = off;
  if (hint) hint.textContent = off ? 'mevcut GANO yok, önce not gir' : '';
}

// Tür bazlı eksik: "EC 0/5 kredi" — yalnızca gerçek türler kova olur; türü olmayan
// dersler sayılmaz, Z/S kovalara sızmaz. Kova hesabı saf planstore.typeBuckets'te.
function typeProgress() {
  const buckets = typeBuckets(plan, allEntries());
  if (!buckets.size) return '';
  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([t, b]) => `${t} ${b.done}/${b.total} kredi`)
    .join(' · ');
}

function targetText(st, tot) {
  if (st.gpa === null) return 'önce not gir, mevcut GANO yok';
  const target = parseFloat(String($('#dp-targetgpa').value || '3').replace(',', '.'));
  if (isNaN(target)) return '';
  const total = tot.credits;
  const remaining = Math.max(0, total - st.credits);
  if (remaining === 0) return 'tüm plan kredisi girilmiş, hedef hesabı kalmadı';
  const r = targetNeeded({ gpa: st.gpa, credits: st.credits }, target, remaining);
  if (!r) return '';
  const rem = Math.round(remaining);
  if (r.needed > 4.0) {
    return `GANO'yu ${fmtTr2(target)} yapmak için kalan ${rem} kredide ortalama ${fmtTr2(r.needed)} gerekir, 4,00'ü aşmak gerekir, ulaşılamaz`;
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
  const filled = select.value !== '';
  select.classList.toggle('filled', filled);
  syncGradeClear(select, filled);
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
  // Tekrar butonunun tooltip'i: önceki not varsa göster.
  const rec = stored.grades[gcode];
  const rep = select.closest('.dp-row')?.querySelector('.dp-repeat-btn');
  if (rep) rep.title = rec?.prev ? `tekrar olarak işaretli · önceki: ${rec.prev}` : 'tekrar olarak işaretle';
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
  if (next) {
    next.focus();
    next.select?.();
    // Klavye açıkken seçili satır görünürde kalsın (scroll-margin + pay).
    next.scrollIntoView({ block: 'nearest' });
  }
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
    } else if (a === 'dp-more') {
      // "N şube daha göster" — sonraki grup satırlarını aç/kapat.
      const wrap = act.nextElementSibling;
      const open = wrap ? !wrap.hidden : false;
      if (wrap) {
        wrap.hidden = open;
        act.textContent = open ? 'daha az göster' : `${act.dataset.count || ''} şube daha göster`;
        act.setAttribute('aria-expanded', String(!open));
      }
    } else if (a === 'dp-sec') {
      // "● N" — satırın altındaki şube listesini aç/kapat.
      const card = act.closest('.dp-course');
      const secWrap = card && card.querySelector('.dp-secslot');
      if (secWrap) {
        secWrap.hidden = !secWrap.hidden;
        act.setAttribute('aria-expanded', String(!secWrap.hidden));
      }
    } else if (a === 'dp-clear') {
      // Notu temizle (×) — select'i boşalt, commitGrade filled/×'ı günceller.
      const wrap = act.closest('.dp-grade-wrap');
      const sel = wrap && wrap.querySelector('.dp-grade');
      if (sel) { sel.value = ''; commitGrade(sel); }
    } else if (a === 'dp-repeat') {
      // Tekrar işareti — saklanan bayrak, GANO'ya etkisiz (refreshAverages çağrılmaz).
      const code = act.dataset.gcode;
      const cur = (stored.grades || {})[code] || {};
      stored = setRepeat(stored, code, !cur.repeat);
      saveStored(progCode, stored);
      act.classList.toggle('on', !cur.repeat);
      act.setAttribute('aria-pressed', String(!cur.repeat));
      act.textContent = !cur.repeat ? '↻' : '↺';
      act.title = cur.prev
        ? `tekrar olarak işaretli · önceki: ${cur.prev}`
        : 'tekrar olarak işaretle';
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
        if (inputs) inputs.innerHTML = electiveControls(slot, found.elective, { code: sel.value, grade: '' });
      }
      refreshAverages();
    }
  });
  $('#dp-semesters').addEventListener('keydown', (ev) => {
    const sel = ev.target;
    if (sel.classList && sel.classList.contains('dp-grade')) handleGradeKey(sel, ev);
  });

  // Transfer (yatay geçiş) başlangıç ağırlığı.
  // Geçersiz değere kırmızı çerçeve (yalnızca gerçekten geçersizken; boş alan geçerli).
  const setInvalid = (sel, on) => {
    const el = $(sel);
    if (el) {
      el.classList.toggle('dp-invalid', on);
      el.setAttribute('aria-invalid', String(on));
    }
    return !on;
  };
  const wireTransfer = () => {
    const crRaw = String($('#dp-tcredits').value || '').trim();
    const gpRaw = String($('#dp-tgpa').value || '').trim();
    const credits = parseFloat(crRaw.replace(',', '.'));
    const gpa = parseFloat(gpRaw.replace(',', '.'));
    const crOk = setInvalid('#dp-tcredits', crRaw !== '' && (isNaN(credits) || credits < 0 || credits > 250));
    const gpOk = setInvalid('#dp-tgpa', gpRaw !== '' && (isNaN(gpa) || gpa < 0 || gpa > 4));
    if (!crOk || !gpOk) return; // geçersizse saklanmaz
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
