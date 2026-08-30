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
//   - şube satırı / kontenjan özeti → quotaDisplay (core/chart.js)
//   - programa ekle → core/favorites.js addToSchedule

import { $, getJSON, esc, trNum, termLabel, debounce, isViewVisible, staggerReveal } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { openCourseDetail } from '../core/course-detail.js?v=dde1e9339338';
import { quotaDisplay } from '../core/chart.js?v=dde1e9339338';
import * as fav from '../core/favorites.js?v=dde1e9339338';
import { toast } from '../core/toast.js?v=dde1e9339338';
import { joinCourse, joinElective, semesterLoad, canonicalCode, groupSections, parseRange, creditBadge, sectionsForCode } from '../core/plan.js?v=dde1e9339338';
import { getTaken, saveTaken, notifyTakenChanged } from '../core/taken.js?v=dde1e9339338';
import { loadStored, saveStored, setGrade, setRepeat, setElective, buildEntries, exportJSON, importJSON, typeBuckets, loadLastProgram, saveLastProgram } from '../core/planstore.js?v=dde1e9339338';
import { GRADE_POINTS, EXEMPT, calcGPA, latestOnly, progress, targetNeeded, fmtTr2 } from '../core/grades.js?v=dde1e9339338';
import { confirmDialog } from '../core/dialog.js?v=dde1e9339338';
import { formatProgramLabel, normalizeProgramLevel } from '../core/programs.js?v=dde1e9339338';
import { parseOBSTranscript, matchTranscriptToPlan, mergeTranscriptMatch, transcriptProgramCandidates } from '../core/transcript.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';
import { createBackup, parseBackup, backupSummary, restoreBackup } from '../core/backup.js?v=dde1e9339338';
import { buildBalancedPlan } from '../core/planner.js?v=dde1e9339338';

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
const filters = { open: false, cap: false, semesters: new Set(), types: new Set() };

export async function onShow() {
  // URL parametrelerini SENKRON yakala: app.js writeViewUrl, await sırasında
  // sekme URL'sini yeniden yazıp prog'u düşürebilir (DOM henüz boşken) —
  // doğrudan ?prog=X#dersplanim bağlantısı bu yüzden programı kaybetmemeli.
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has('prog') || !initialParams) initialParams = urlParams;
  ensureHost();
  if (!inited) {
    init();
    inited = true;
  }
  if (!progIndex.length) {
    progIndex = (await getJSON('data/curriculum/index.json').catch(() => []));
  }
  const levelSel = $('#dp-level');
  const fac = $('#dp-fac');
  const sel = $('#dp-prog');
  // URL'de program yoksa son seçilene düş (sayfa yenilenince not verisi
  // localStorage'da dururken program seçimi kaybolmasın — bkz. saveLastProgram).
  const want = urlParams.get('prog') || initialParams?.get('prog') || loadLastProgram() || '';
  applyParams(urlParams);
  // URL programı varsa ilgili seviye/fakülteyi aç; aksi halde Lisans seçili
  // fakat fakülte ve program boş başlar. İlk katalog kaydı artık gizlice seçilmez.
  const secili = progIndex.find((p) => p.code === want) || null;
  levelSel.value = secili ? normalizeProgramLevel(secili.level, secili.code) : 'LS';
  fac.innerHTML = renderFacultyOptions(levelSel.value);
  fac.value = secili ? facultyOf(secili) : '';
  sel.innerHTML = renderProgramOptions(fac.value, levelSel.value);
  sel.value = secili?.code || '';
  // Yatay geçiş hedef seçici — yalnızca Lisans, seviye seçimi yok.
  const yfac = $('#dp-yatay-fac');
  if (yfac && !yfac.options.length) {
    yfac.innerHTML = renderFacultyOptions('LS');
    $('#dp-yatay-prog').innerHTML = renderProgramOptions('', 'LS');
  }
  if (secili) await selectProgram(secili.code);
  else showProgramEmpty();
}

function ensureHost() {
  // #dp-root HTML'de hazır durur; içerik doldurulmuş mu onu kontrol et.
  if ($('#dp-prog')) return;
  const root = document.querySelector('#view-dersplanim');
  const en = I18N.lang === 'en';
  const t = (tr, english) => en ? english : tr;
  root.innerHTML = `
    <p class="dp-intro">
      ${t('Programını ve dönemi seç; müfredatı, açık şubeleri ve not planını birlikte gör.', 'Choose your program and term to see the curriculum, open sections, and grade plan together.')}
    </p>
    <div class="console dp-console">
      <div class="dp-program-pick" role="group" aria-label="Program seçimi">
        <span class="sigil" aria-hidden="true">&gt;</span>
        <label><span class="dp-field-label">${t('seviye', 'level')}</span>
        <select id="dp-level" class="dp-level-select" aria-label="Program seviyesi seç">
          <option value="OL">${t('Önlisans', 'Associate')}</option><option value="LS" selected>${t('Lisans', 'Bachelor')}</option>
          <option value="YL">${t('Yüksek Lisans', 'Master')}</option><option value="DR">${t('Doktora', 'Doctorate')}</option>
        </select>
        </label>
        <label><span class="dp-field-label">${t('fakülte', 'faculty')}</span>
        <select id="dp-fac" class="dp-fac-select" aria-label="Fakülte seç"></select>
        </label>
        <label><span class="dp-field-label">${t('program', 'program')}</span>
        <select id="dp-prog" class="dp-prog-select" aria-label="Bölüm seç"></select>
        </label>
      </div>
      <label class="dp-term-pick"><span class="dp-field-label">${t('dönem', 'term')}</span><select id="dp-term" aria-label="${t('Dönem seç', 'Choose term')}"></select></label>
    </div>
    <div id="dp-empty" class="dp-empty">
      <h2>${t('Ders planını görmek için programını seç', 'Choose your program to view its course plan')}</h2>
      <p>${t('Önce seviyeyi, ardından fakülte ve programı seç. GANO ve dönem dersleri seçiminin ardından burada açılır.', 'Choose a level, faculty, and program. GPA tools and term courses will appear after your selection.')}</p>
      <button type="button" class="btn-ghost dp-transcript-open">${t('OBS transkriptinden aktar', 'Import from OBS transcript')}</button>
    </div>
    <div class="dp-filterbar" role="group" aria-label="Ders Planım filtreleri">
      <div class="dp-filter-primary">
        <label class="check"><input type="checkbox" id="dp-open"> yalnızca açık dersler</label>
        <label class="check"><input type="checkbox" id="dp-cap"> kontenjanı olanlar</label>
        <button type="button" id="dp-filter-toggle" class="btn-ghost" aria-expanded="false" aria-controls="dp-filter-more">Yarıyıl ve tür</button>
      </div>
      <div class="dp-filter-more" id="dp-filter-more" hidden>
        <span class="dp-sems" id="dp-sems" role="group" aria-label="Yarıyıl seçimi"></span>
        <span class="dp-type-filter" id="dp-types" role="group" aria-label="Türe göre filtrele"></span>
      </div>
    </div>
    <div id="dp-summary" class="dp-summary"></div>
    <div class="dp-resultbar">
      <p class="resultline" id="dp-result" aria-live="polite">program seçiliyor…</p>
    </div>
    <details class="dp-recommend" id="dp-recommend">
      <summary><span>Dönem için ders öner</span><small>Müfredat, notların ve açık şubeler kullanılır</small></summary>
      <div class="dp-recommend-controls">
        <label>hedef yarıyıl <select id="dp-recommend-sem"></select></label>
        <label>en fazla kredi <input id="dp-recommend-credit" class="f-in dp-credit-input" type="number" min="1" max="40" value="18"></label>
        <button type="button" id="dp-recommend-run" class="btn-primary">Öneri oluştur</button>
      </div>
      <p class="dp-recommend-note">Öneriler kayıt hakkını garanti etmez. Alternatif önşartlar ve bölüm kuralları için işaretli uyarıları kontrol et.</p>
      <div id="dp-recommend-result" aria-live="polite"></div>
    </details>
    <details class="dp-recommend" id="dp-balanced">
      <summary><span>Dengeli plan oluştur</span><small>Önşart zinciri, tekrar dersleri ve geçmiş zorluk kullanılır</small></summary>
      <div class="dp-recommend-controls">
        <button type="button" id="dp-balanced-run" class="btn-primary">Dengeli plan oluştur</button>
      </div>
      <p class="dp-recommend-note">Kalan zorunlu dersleri, önşart sırasını bozmadan çok döneme dağıtır: tekrar dersleri erken ve hafif dönemlere, geçmişte kalma oranı yüksek dersler ayrı dönemlere konur, kredi hedefi dönem başına 10–14. Seçmeli slotlar bu plana dahil değildir.</p>
      <div id="dp-balanced-result" aria-live="polite"></div>
    </details>
    <details class="dp-grades" id="dp-grades">
      <summary><span>GANO ve ilerleme</span><b id="dp-grade-preview">Not girdikçe hesaplanır</b></summary>
      <p class="dp-grades-empty" id="dp-grades-empty">Derslerin yanındaki not alanlarından not girdikçe GANO ve ilerleme burada hesaplanır.</p>
      <div class="dp-transcript-callout">
        <div>
          <strong>${t('OBS transkriptinden notları aktar', 'Import grades from an OBS transcript')}</strong>
          <span>${t('Belgeler → Transkript Önizleme ekranındaki metni kopyala. Ham belge saklanmaz veya sunucuya gönderilmez.', 'Copy the text from Documents → Transcript Preview. The raw document is neither stored nor sent to a server.')}</span>
        </div>
        <button type="button" class="btn-ghost dp-transcript-open">${t('Transkript yapıştır', 'Paste transcript')}</button>
      </div>
      <p id="dp-transcript-result" class="dp-transcript-result" hidden aria-live="polite"></p>
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
      <details class="dp-data-tools">
        <summary>Veri ve gizlilik</summary>
        <div class="dp-grades-actions">
          <button type="button" id="dp-export" class="btn-ghost">JSON dışa aktar</button>
          <button type="button" id="dp-import" class="btn-ghost">JSON içe aktar</button>
          <button type="button" id="dp-backup-all" class="btn-ghost">Program + GANO yedeği indir</button>
          <button type="button" id="dp-restore-all" class="btn-ghost">Tüm yedeği geri yükle</button>
          <input id="dp-restore-file" type="file" accept="application/json,.json" hidden>
          <button type="button" id="dp-reset" class="btn-ghost">tümünü sıfırla</button>
        </div>
        <p class="dp-privacy">Notların yalnızca bu tarayıcıda saklanır; sunucuya gönderilmez. Bu bir transkript değildir ve sonuçlar OBS ile küçük farklar gösterebilir. Kaynak:
        <a href="https://www.sis.itu.edu.tr/tr/duyurular/not-basari-duyurusu/" target="_blank" rel="noopener">İTÜ not ve başarı yönergesi</a>.</p>
      </details>
    </details>
    <details class="dp-recommend" id="dp-yatay">
      <summary><span>Yatay geçiş ihtimalini gör</span><small id="dp-yatay-preview">2011'den bugüne resmî taban/tavan</small></summary>
      <div class="dp-recommend-controls">
        <label>hedef fakülte <select id="dp-yatay-fac"></select></label>
        <label>hedef program <select id="dp-yatay-prog"></select></label>
      </div>
      <p class="dp-recommend-note">Kaynak: <a href="https://www.sis.itu.edu.tr/TR/mevzuat/yatay-cap-yandal-yonerge.php" target="_blank" rel="noopener">İTÜ Yatay Geçiş, ÇAP ve Yandal Yönergesi</a>, MADDE 30(4). Değerlendirme puanı %40 YKS (100'lük karşılığı) + %60 AGNO'dan oluşuyor. YKS'nin 100'lük karşılığının resmî çevrim formülü İTÜ tarafından ayrı bir senato kararına bırakılmış ve yayımlanmamış, bu yüzden nihai puanını burada hesaplayamıyoruz; yalnızca AGNO katkını ve geçmiş yılların taban/tavanını gösteriyoruz. 2023-2024 öncesi sayfalar farklı bir ölçüt (ham AGNO) kullanıyordu, iki dönem doğrudan karşılaştırılamaz.</p>
      <div id="dp-yatay-result" aria-live="polite"></div>
    </details>
    <div id="dp-semesters" class="dp-semesters"></div>`;
}

// -- program seçici --

// Önce fakülte, sonra bölüm: 313 programlık tek liste yerine iki adım.
// 22 fakültenin arasından seçmek, uzun gruplu listede kaydırmaktan hızlı.

function facultyOf(p) {
  return p.faculty || 'Diğer';
}

function renderFacultyOptions(level = 'LS') {
  const facs = [...new Set(progIndex
    .filter((p) => normalizeProgramLevel(p.level, p.code) === level)
    .map(facultyOf))].sort((a, b) => a.localeCompare(b, 'tr'));
  return `<option value="">${I18N.lang === 'en' ? 'Choose faculty…' : 'Fakülte seçiniz…'}</option>` +
    facs.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join('');
}

// Verilen fakültenin bölümleri. Aynı bölümün farklı planları (KKTC/İngilizce vb.)
// kod + ad ile ayrışsın — kullanıcı yanlış planı seçmesin (Faz F).
function renderProgramOptions(faculty, level = $('#dp-level')?.value || 'LS') {
  if (!faculty) return `<option value="">${I18N.lang === 'en' ? 'Choose a faculty first…' : 'Önce fakülte seçiniz…'}</option>`;
  const ps = progIndex
    .filter((p) => facultyOf(p) === faculty && normalizeProgramLevel(p.level, p.code) === level)
    .sort((a, b) => a.name.localeCompare(b.name, 'tr') || a.code.localeCompare(b.code));
  return `<option value="">${I18N.lang === 'en' ? 'Choose program…' : 'Program seçiniz…'}</option>` +
    ps.map((p) => `<option value="${esc(p.code)}">${esc(formatProgramLabel(p.code, p, I18N.lang))}</option>`).join('');
}

function showProgramEmpty() {
  progCode = '';
  plan = null;
  const view = $('#view-dersplanim');
  view?.classList.add('dp-no-program');
  if ($('#dp-empty')) $('#dp-empty').hidden = false;
  if ($('#dp-result')) $('#dp-result').textContent = I18N.lang === 'en' ? 'No program selected' : 'Program seçilmedi';
  if ($('#dp-summary')) $('#dp-summary').innerHTML = '';
  if ($('#dp-semesters')) $('#dp-semesters').innerHTML = '';
}

async function selectProgram(code) {
  if (!code) { showProgramEmpty(); return; }
  if (code === progCode && plan) return;
  $('#view-dersplanim')?.classList.remove('dp-no-program');
  if ($('#dp-empty')) $('#dp-empty').hidden = true;
  progCode = code;
  plan = null;
  stored = loadStored(code);
  saveLastProgram(code);
  const savedTarget = Number(stored.targetGpa);
  $('#dp-targetgpa').value = Number.isFinite(savedTarget) && savedTarget >= 0 && savedTarget <= 4
    ? String(savedTarget) : '3.00';
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
  none.textContent = 'Yeni';
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
        <option value="">Yeni</option>${GRADE_CHOICES.map((g) => `<option value="${g}" ${g === pick.grade ? 'selected' : ''}>${g}</option>`).join('')}
      </select><button type="button" class="dp-grade-clear" data-act="dp-clear" title="notu temizle">×</button></span>`
    : '<span class="dp-grade-hint">önce ders seç</span>';
  return `<div class="dp-elective-inputs">${pickSel}${grade}</div>`;
}

// -- filtreler --

function applyParams(params) {
  filters.open = params.get('fopen') === '1';
  filters.cap = params.get('fcap') === '1';
  filters.semesters = new Set((params.get('fsems') || '').split(',').filter(Boolean));
  filters.types = new Set((params.get('ftypes') || '').split(',').filter(Boolean));
  $('#dp-open').checked = filters.open;
  $('#dp-cap').checked = filters.cap;
  renderSemesterFilter();
  renderTypeFilter();
  updateFilterDisclosure();
}

function updateFilterDisclosure() {
  const toggle = $('#dp-filter-toggle');
  if (!toggle) return;
  const count = filters.semesters.size + filters.types.size;
  toggle.textContent = `Yarıyıl ve tür${count ? ` (${count})` : ''}`;
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
      updateFilterDisclosure();
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
      updateFilterDisclosure();
      saveState();
      renderAll();
    }));
}

// URL'ye yazar; sekme değişince app.js görünüme ait olmayanları düşürür.
// Yaşanmış hata (courses.js/exams.js/history.js'te bulunan aynı sınıf): bu
// fonksiyon plan/müfredat gibi asenkron yüklemelerden sonra da çağrılıyor —
// kullanıcı veri gelmeden başka sekmeye geçmişse geç gelen çağrı URL'i
// (hash dahil) #dersplanim'e geri yazabiliyordu.
function saveState() {
  if (!isViewVisible('dersplanim')) return;
  const p = new URLSearchParams();
  if (progCode) p.set('prog', progCode);
  if (termSlug && termSlug !== state.index?.currentSlug) p.set('term', termSlug);
  if (filters.open) p.set('fopen', '1');
  if (filters.cap) p.set('fcap', '1');
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
  renderRecommendSemesterOptions();

  let openCount = 0, closedCount = 0, slotOpen = 0, slotCount = 0, shown = 0;

  const root = $('#dp-semesters');
  const historyCodes = [];
  const semAvgs = semesterAverages();
  const frag = document.createDocumentFragment();
  let any = false;

  for (const { s, i } of sems) {
    const load = semesterLoad(s);
    const avg = semAvgs[i];
    const sem = document.createElement('details');
    sem.className = 'dp-sem';
    sem.dataset.si = i;
    sem.open = true;
    const head = document.createElement('summary');
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
        const code = resolvedCourseCode(c, slotKey);
        if (filters.types.size && (!c.type || !filters.types.has(c.type))) return;
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
        if (filters.types.size && !matchesElectiveType(e, filters.types)) return;
        const joined = joinElective(e, rows, historyFor(''));
        const open = joined.openCount;
        if (filters.open && !open) return;
        if (filters.cap && !(joined.options.some((o) => o.status.state === 'open' && o.status.sections.some((sec) => sec.cap > sec.enr)))) return;
        slotCount++;
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
  $('#dp-result').innerHTML = planSummaryLine(openCount, closedCount, slotOpen, slotCount, shown);

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

function planSummaryLine(open, closed, slotOpen, slotCount, shown) {
  const parts = [`<b>${open}</b> ders açık`];
  parts.push(`<b>${shown - slotCount}</b> ders gösteriliyor`);
  if (slotCount) parts.push(`<b>${slotOpen}/${slotCount}</b> seçmeli açık`);
  if (closed) parts.push(`${closed} kapalı`);
  return parts.join(' · ');
}

// Bazı eski OBS müfredatlarında laboratuvar/yazım dersinin kodu boş. Transkript
// aktarımı bu slot için doğrulanmış kaynak kodunu saklar; diğer bütün derslerde
// müfredat kodu değişmeden kullanılır.
function resolvedCourseCode(course, slotKey) {
  return canonicalCode(course?.code) || canonicalCode((stored.requiredSlots || {})[slotKey]);
}

function resolvedPlan() {
  if (!plan || !Object.keys(stored.requiredSlots || {}).length) return plan;
  return {
    ...plan,
    semesters: plan.semesters.map((semester, si) => ({
      ...semester,
      items: semester.items.map((item, ii) => {
        if (!item.course || canonicalCode(item.course.code)) return item;
        const code = resolvedCourseCode(item.course, `s${si}i${ii}`);
        return code ? { ...item, course: { ...item.course, code } } : item;
      }),
    })),
  };
}

// Ders satırı — sabit 5 hücreli ızgara: kredi | ders | tekrar | not | durum.
// Şube listesi satırın ALTINDA katlı (varsayılan kapalı) — satır yüksekliği şube
// sayısından bağımsızdır. Tam DOM (createElement + textContent): ham HTML yok.
function courseRow(c, st, slotKey) {
  const code = resolvedCourseCode(c, slotKey);
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
  rep.textContent = '⇄';
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
    btn.textContent = `${st.sections.length} şube`;
    row.appendChild(btn);
  } else {
    const span = document.createElement('span');
    span.className = 'dp-sec-btn closed';
    span.textContent = st.state === 'closed' ? 'kapalı' : 'veri yok';
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
    fill.innerHTML = quotaDisplay(g.cap, g.enr);
    if (g.enr >= g.cap) {
      fill.append(' ');
      const full = document.createElement('span');
      full.className = 'dp-full quota-fosfor-only';
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
  btn.textContent = open ? `${open} açık` : 'kapalı';
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
  const remain = remainingRequired();
  const remainHtml = remain > 0 ? `<div><dt>kalan</dt><dd>${remain} zorunlu ders</dd></div>` : '';
  el.innerHTML = `<div class="dp-summary-main">
      <h2>${esc(prog)}</h2>
    </div>
    <dl class="dp-summary-meta">
      <div><dt>program toplamı${esc(computed)}</dt><dd>${esc(total)}</dd></div>
      <div><dt>görünüm</dt><dd>${esc(load)}</dd></div>
      ${remainHtml}
    </dl>`;
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
  for (const [si, sem] of plan.semesters.entries()) {
    for (const [ii, item] of sem.items.entries()) {
      const code = item.course ? resolvedCourseCode(item.course, `s${si}i${ii}`) : '';
      if (item.course && item.course.required === 'Z' && !graded.has(code)) n++;
    }
  }
  return n;
}

// -- GANO hesapları (Faz: Ders Planım not girişi) --

function allEntries() {
  return buildEntries(resolvedPlan(), stored, catalogMap);
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
  const preview = $('#dp-grade-preview');
  if (emptyEl) emptyEl.hidden = !empty;
  if (body) body.classList.toggle('hidden', empty);
  const t = stored.transfer || {};
  $('#dp-tcredits').value = t.credits ?? '';
  $('#dp-tgpa').value = t.gpa ?? '';
  if (empty) {
    if (preview) preview.textContent = 'Not girdikçe hesaplanır';
    setTargetState(true);
    renderYatay();
    return;
  }

  const st = currentState();
  $('#dp-gano').textContent = st.gpa == null ? 'yok' : fmtTr2(st.gpa);
  if (preview) preview.textContent = st.gpa == null
    ? `${trNum(st.credits)} kredi girildi`
    : `${fmtTr2(st.gpa)} GANO · ${trNum(st.credits)} kredi`;
  const tot = planTotal();
  const p = progress(allEntries(), { credits: tot.credits, ects: tot.ects }, stored.transfer);
  $('#dp-progress').textContent = `${p.credits.done}/${p.credits.total} kredi`;
  const sub = $('#dp-progress-sub');
  if (sub) sub.textContent = tot.ects > 0 ? `${p.ects.done}/${p.ects.total} AKTS` : '';
  $('#dp-target').textContent = targetText(st, tot);
  $('#dp-types-progress').textContent = typeProgress();
  setTargetState(st.gpa == null || st.credits === 0);
  renderYatay();
}

// Hedef GANO alanı, mevcut GANO yokken sonuç üretemez — pasifleştir ve nedenini yaz.
function setTargetState(off) {
  const input = $('#dp-targetgpa');
  const hint = $('#dp-target-hint');
  if (!input) return;
  input.disabled = off;
  if (hint) hint.textContent = off ? 'mevcut GANO yok, önce not gir' : '';
}

// -- yatay geçiş --
// MADDE 8 şartları: 3. yy AGNO≥2,50 + 30–59,99 kredi; 5. yy AGNO≥2,60 +
// 60–94,99 kredi. Tam değerlendirme puanı (MADDE 30(4)) burada hesaplanmıyor
// — YKS'nin 100'lük karşılığının resmî çevrim formülü yayımlı değil; bunu
// uydurmak yanlış bir kesinlik izlenimi verir. Yalnızca AGNO katkısı ve
// geçmiş taban/tavan gösterilir (bkz. panel içindeki not).
function eligibleSemesters(gpa, credits) {
  const out = [];
  if (gpa != null && gpa >= 2.5 && credits >= 30 && credits < 60) out.push(3);
  if (gpa != null && gpa >= 2.6 && credits >= 60 && credits < 95) out.push(5);
  return out;
}

const yatayCache = new Map(); // programCode -> Promise|sonuç|null

async function loadYatayRollup(code) {
  if (yatayCache.has(code)) return yatayCache.get(code);
  const promise = getJSON(`data/yatay/by-program/${code}.json`).catch(() => null);
  yatayCache.set(code, promise);
  const result = await promise;
  yatayCache.set(code, result);
  return result;
}

function yatayRow(r) {
  const dp = r.metric === 'degerlendirme';
  const fmt = (v) => v == null ? '·' : dp ? v.toFixed(5) : fmtTr2(v);
  return `<tr><td>${esc(r.term)}</td><td>${r.semester}. yy</td>
    <td class="num">${r.quota ?? '·'}</td><td class="num">${r.placed}</td>
    <td class="num">${fmt(r.floor)}</td><td class="num">${fmt(r.ceiling)}</td></tr>`;
}

async function renderYatay() {
  const box = $('#dp-yatay-result');
  if (!box) return;
  const targetCode = $('#dp-yatay-prog')?.value || '';
  const st = currentState();
  const elig = eligibleSemesters(st.gpa, st.credits);

  let head = '';
  if (st.gpa == null) {
    head = '<p class="dp-recommend-note">Önce not gir. AGNO hesaplanmadan uygunluk kontrol edilemez.</p>';
  } else if (!elig.length) {
    head = `<p class="dp-recommend-note">Şu an ${trNum(st.credits)} kredidesin. Yatay geçiş yalnızca 3. yarıyıl (30–59,99 kredi, AGNO ≥ 2,50) veya 5. yarıyıl (60–94,99 kredi, AGNO ≥ 2,60) aralığında başvurulabiliyor.</p>`;
  } else {
    head = `<p class="dp-recommend-note">AGNO'n <b>${fmtTr2(st.gpa)}</b> (${trNum(st.credits)} kredi). ${elig.map((s) => `${s}.`).join(' ve ')} yarıyıl için kredi/AGNO şartını sağlıyorsun; bu, değerlendirme puanının %60'ını oluşturuyor.</p>`;
  }

  if (!targetCode) {
    box.innerHTML = head + '<p class="empty">Hedef program seç.</p>';
    return;
  }

  box.innerHTML = head + '<p class="empty">yükleniyor…</p>';
  const rollup = await loadYatayRollup(targetCode);
  if ($('#dp-yatay-prog')?.value !== targetCode) return; // seçim değişti, yanıt eski
  if (!rollup) {
    box.innerHTML = head + '<p class="empty">Bu program için yatay geçiş verisi yok.</p>';
    return;
  }

  const rows = rollup.years.flatMap((y) => {
    const sems = elig.length ? y.results.filter((r) => elig.includes(r.semester)) : y.results;
    return sems.map((r) => ({ term: y.term, metric: y.metric, ...r }));
  });
  const scoreEra = rows.filter((r) => r.metric === 'degerlendirme').reverse();
  const agnoEra = rows.filter((r) => r.metric === 'agno').reverse();

  let body = `<p class="dp-recommend-note"><b>${esc(rollup.program)}</b> · ${esc(rollup.faculty)}</p>`;
  if (scoreEra.length) {
    body += `<div class="tablewrap"><table class="htable"><thead><tr><th>Yıl</th><th>Yarıyıl</th>
      <th class="num">Kontenjan</th><th class="num">Yerleşen</th><th class="num">Taban</th><th class="num">Tavan</th></tr></thead>
      <tbody>${scoreEra.map(yatayRow).join('')}</tbody></table></div>`;
  }
  if (agnoEra.length) {
    body += `<details class="dp-yatay-old"><summary>2011-2022 arası (eski ölçüt: ham AGNO, yukarıdakiyle karşılaştırılamaz)</summary>
      <div class="tablewrap"><table class="htable"><thead><tr><th>Yıl</th><th>Yarıyıl</th>
      <th class="num">Yerleşen</th><th class="num">Taban</th><th class="num">Tavan</th></tr></thead>
      <tbody>${agnoEra.map((r) => `<tr><td>${esc(r.term)}</td><td>${r.semester}. yy</td><td class="num">${r.placed}</td>
        <td class="num">${r.floor != null ? fmtTr2(r.floor) : '·'}</td><td class="num">${r.ceiling != null ? fmtTr2(r.ceiling) : '·'}</td></tr>`).join('')}</tbody></table></div>
    </details>`;
  }
  if (!scoreEra.length && !agnoEra.length) body += '<p class="empty">Bu yarıyıl için hiç yerleşen olmamış.</p>';
  box.innerHTML = head + body;
}

// Tür bazlı eksik: "EC 0/5 kredi" — yalnızca gerçek türler kova olur; türü olmayan
// dersler sayılmaz, Z/S kovalara sızmaz. Kova hesabı saf planstore.typeBuckets'te.
function typeProgress() {
  const buckets = typeBuckets(resolvedPlan(), allEntries());
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

// Girilen notlar tamamlanmış ders durumuna da işlenir; önşart ve seçmeli havuz
// görünümleri TAKEN_CHANGED ile tazelenir. Var olan kayıtları silmez, yalnızca ekler.
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

function setTranscriptResult(message, kind = '') {
  const result = $('#dp-transcript-result');
  if (!result) return;
  result.hidden = !message;
  result.textContent = message || '';
  result.className = `dp-transcript-result${kind ? ` ${kind}` : ''}`;
}

async function selectTranscriptProgram(code) {
  const program = progIndex.find((item) => item.code === code);
  if (!program) return false;
  const level = normalizeProgramLevel(program.level, program.code);
  $('#dp-level').value = level;
  $('#dp-fac').innerHTML = renderFacultyOptions(level);
  $('#dp-fac').value = facultyOf(program);
  $('#dp-prog').innerHTML = renderProgramOptions(facultyOf(program), level);
  $('#dp-prog').value = program.code;
  await selectProgram(program.code);
  return Boolean(plan);
}

// Ham metin yalnız bu diyaloğun textarea'sında yaşar. Kapanırken değer temizlenir
// ve düğüm DOM'dan kaldırılır; localStorage'a yalnız eşleşen kod/not çiftleri yazılır.
function openTranscriptDialog() {
  const en = I18N.lang === 'en';
  const host = document.createElement('div');
  host.className = 'dlg transcript-dlg';
  host.innerHTML = `<div class="dlg-box transcript-dlg-box" role="dialog" aria-modal="true" aria-labelledby="transcript-title" aria-describedby="transcript-help">
    <button type="button" class="dlg-close" aria-label="${en ? 'Close' : 'Kapat'}">✕</button>
    <h3 id="transcript-title">${en ? 'Import grades from OBS' : 'OBS transkriptinden notları aktar'}</h3>
    <ol class="transcript-steps" id="transcript-help">
      <li>${en ? 'Open Documents → Transcript Preview in OBS.' : 'OBS’de Belgeler → Transkript Önizleme’ye gir.'}</li>
      <li>${en ? 'Open the Turkish preview and click inside the document. Use Select All and Copy.' : 'Türkçe önizlemeyi aç ve belgenin içine tıkla. Bilgisayarda Ctrl+A / Ctrl+C; telefonda Tümünü seç / Kopyala yap.'}</li>
      <li>${en ? 'Paste below and review the summary before importing.' : 'Aşağıya yapıştır; aktarmadan önce bulunan ders özetini kontrol et.'}</li>
    </ol>
    <p class="transcript-privacy"><strong>${en ? 'Privacy:' : 'Gizlilik:'}</strong> ${en ? 'Parsing happens only in this browser. The raw transcript is not uploaded or saved; after confirmation, only course codes and grades remain in this browser.' : 'Ayrıştırma yalnız bu tarayıcıda yapılır. Ham transkript yüklenmez ve kaydedilmez; onaydan sonra yalnız ders kodları ve notlar bu tarayıcıda kalır.'}</p>
    <label class="transcript-label" for="transcript-input">${en ? 'Transcript text' : 'Transkript metni'}</label>
    <textarea id="transcript-input" class="transcript-input" rows="9" spellcheck="false" autocomplete="off" placeholder="${en ? 'Paste the copied transcript here…' : 'Kopyaladığın transkripti buraya yapıştır…'}"></textarea>
    <div class="transcript-preview" id="transcript-preview" aria-live="polite">${en ? 'No text pasted yet.' : 'Henüz metin yapıştırılmadı.'}</div>
    <div class="dlg-actions">
      <button type="button" class="dlg-cancel btn-ghost">${en ? 'Cancel' : 'Vazgeç'}</button>
      <button type="button" class="dlg-ok btn-primary" disabled>${en ? 'Import grades' : 'Notları aktar'}</button>
    </div>
  </div>`;
  document.body.appendChild(host);
  document.body.classList.add('modal-open');
  const opener = document.activeElement;
  const input = host.querySelector('#transcript-input');
  const preview = host.querySelector('#transcript-preview');
  const ok = host.querySelector('.dlg-ok');
  let parsed = null;
  let inferredCode = '';
  let settled = false;

  return new Promise((resolve) => {
    const close = (value) => {
      if (settled) return;
      settled = true;
      input.value = '';
      host.remove();
      document.body.classList.remove('modal-open');
      opener?.focus?.();
      resolve(value);
    };
    const refresh = () => {
      if (input.value.length > 2_000_000) {
        parsed = null;
        ok.disabled = true;
        preview.textContent = en ? 'This text is too large to process.' : 'Bu metin işlenemeyecek kadar büyük.';
        preview.className = 'transcript-preview error';
        return;
      }
      parsed = parseOBSTranscript(input.value);
      const candidates = transcriptProgramCandidates(progIndex, parsed.programs);
      inferredCode = !progCode && candidates.length === 1 ? candidates[0].code : '';
      const canChooseProgram = Boolean(progCode || inferredCode);
      ok.disabled = parsed.records.length === 0 || !canChooseProgram;
      preview.className = `transcript-preview${parsed.records.length ? ' ready' : ''}`;
      if (!parsed.records.length) {
        preview.textContent = input.value.trim()
          ? (en ? 'No course rows were found. Copy the Turkish transcript preview as text.' : 'Ders satırı bulunamadı. Türkçe transkript önizlemesini metin olarak kopyaladığından emin ol.')
          : (en ? 'No text pasted yet.' : 'Henüz metin yapıştırılmadı.');
        return;
      }
      const distinct = new Set(parsed.records.map((r) => r.code)).size;
      const repeats = parsed.records.length - distinct;
      const targetCode = progCode || inferredCode;
      const target = progIndex.find((item) => item.code === targetCode);
      const parts = [en ? `${parsed.records.length} rows, ${distinct} courses` : `${parsed.records.length} kayıt · ${distinct} farklı ders`];
      if (repeats) parts.push(en ? `${repeats} repeat attempts` : `${repeats} tekrar kaydı`);
      if (parsed.officialGpa != null) parts.push(en ? `OBS total GPA ${String(parsed.officialGpa).replace('.', ',')}` : `OBS toplam GANO ${String(parsed.officialGpa).replace('.', ',')}`);
      if (target) parts.push(`${en ? 'Program' : 'Program'}: ${formatProgramLabel(target.code, target, I18N.lang)}`);
      else parts.push(en ? 'Choose your program above before importing.' : 'Aktarmadan önce yukarıdan programını seç.');
      if (plan && progCode) {
        const match = matchTranscriptToPlan(plan, parsed.records);
        const count = match.courseAssignments.length + match.electiveAssignments.length;
        parts.push(en ? `${count} courses match this plan` : `${count} ders seçili planla eşleşiyor`);
        if (match.unmatched.length) parts.push(en ? `${match.unmatched.length} unmatched` : `${match.unmatched.length} eşleşmeyen`);
      }
      preview.textContent = parts.join(' · ');
    };

    input.addEventListener('input', refresh);
    host.querySelector('.dlg-close').addEventListener('click', () => close(null));
    host.querySelector('.dlg-cancel').addEventListener('click', () => close(null));
    ok.addEventListener('click', () => {
      if (!ok.disabled && parsed) close({ parsed, inferredCode });
    });
    host.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(null); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...host.querySelectorAll('button:not([disabled]), textarea')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    input.focus();
  });
}

async function importTranscript() {
  const choice = await openTranscriptDialog();
  if (!choice) return;
  if (!progCode && choice.inferredCode) await selectTranscriptProgram(choice.inferredCode);
  if (!plan || !progCode) {
    toast(I18N.lang === 'en' ? 'Choose your program first' : 'Önce programını seç', { kind: 'warn' });
    return;
  }
  const match = matchTranscriptToPlan(plan, choice.parsed.records);
  const imported = match.courseAssignments.length + match.electiveAssignments.length;
  if (!imported) {
    setTranscriptResult(I18N.lang === 'en' ? 'No courses matched the selected plan.' : 'Seçili ders planıyla eşleşen ders bulunamadı.', 'error');
    return;
  }
  stored = mergeTranscriptMatch(stored, match);
  saveStored(progCode, stored);
  catalogMap.clear();
  ensureCatalogForPicks();
  renderAll();
  syncTakenFromGrades();
  const repeatCount = match.latest.filter((item) => item.repeat).length;
  const details = [I18N.lang === 'en' ? `${imported} grades imported` : `${imported} not aktarıldı`];
  if (repeatCount) details.push(I18N.lang === 'en' ? `${repeatCount} repeated courses` : `${repeatCount} tekrar dersi`);
  if (match.unmatched.length) details.push(I18N.lang === 'en' ? `${match.unmatched.length} courses need manual review` : `${match.unmatched.length} ders elle kontrol edilmeli`);
  setTranscriptResult(`${details.join(' · ')}. ${I18N.lang === 'en' ? 'The raw transcript was not saved.' : 'Ham transkript kaydedilmedi.'}`, match.unmatched.length ? 'warn' : 'success');
  $('#dp-grades').open = true;
  toast(I18N.lang === 'en' ? 'Transcript grades imported' : 'Transkript notları aktarıldı');
}

function renderRecommendSemesterOptions() {
  const select = $('#dp-recommend-sem');
  if (!select || !plan) return;
  const current = select.value;
  select.innerHTML = plan.semesters.map((sem, index) => `<option value="${index}">${esc(sem.title)}</option>`).join('');
  select.value = current && Number(current) < plan.semesters.length ? current : String(Math.min(plan.semesters.length - 1, 0));
}

function passedCodes() {
  const done = new Set(getTaken().codes || []);
  for (const [code, rec] of Object.entries(stored.grades || {})) {
    if (EXEMPT.has(rec.grade) || Number(GRADE_POINTS[rec.grade]) > 0) done.add(canonicalCode(code));
  }
  for (const rec of Object.values(stored.elective || {})) {
    if (rec?.code && (EXEMPT.has(rec.grade) || Number(GRADE_POINTS[rec.grade]) > 0)) done.add(canonicalCode(rec.code));
  }
  return done;
}

async function buildRecommendations() {
  const box = $('#dp-recommend-result');
  if (!plan || !rows.length) { box.innerHTML = '<p class="empty">Bu dönem için açık şube verisi yok.</p>'; return; }
  const target = Number($('#dp-recommend-sem').value || 0);
  const maxCredits = Math.max(1, Math.min(40, Number($('#dp-recommend-credit').value || 18)));
  const done = passedCodes();
  const graph = await getJSON('data/prereq/graph.json').catch(() => ({ edges: [] }));
  const incoming = new Map();
  for (const edge of (graph.edges || [])) {
    const list = incoming.get(edge.to) || [];
    list.push(edge.from); incoming.set(edge.to, list);
  }
  const candidates = [];
  plan.semesters.forEach((semester, semesterIndex) => (semester.items || []).forEach((item) => {
    if (!item.course) return;
    const code = canonicalCode(item.course.code);
    if (!code || done.has(code)) return;
    const sections = sectionsForCode(rows, code);
    if (!sections.length) return;
    const previous = (stored.grades || {})[code]?.grade;
    const missing = (incoming.get(code) || []).filter((required) => !done.has(required));
    const best = sections.slice().sort((a, b) => {
      const ar = Number(a.cap || 0) - Number(a.enr || 0), br = Number(b.cap || 0) - Number(b.enr || 0);
      return Number(br > 0) - Number(ar > 0) || br - ar;
    })[0];
    candidates.push({ code, name: item.course.name, credits: Number(item.course.credits || 0), semesterIndex, section: best,
      missing, failed: previous === 'FF' || previous === 'VF' });
  }));
  candidates.sort((a, b) => Number(b.failed) - Number(a.failed) || Math.abs(a.semesterIndex - target) - Math.abs(b.semesterIndex - target) || a.semesterIndex - b.semesterIndex);
  let used = 0;
  const chosen = candidates.filter((item) => {
    if (item.semesterIndex > target + 1 || used + item.credits > maxCredits) return false;
    used += item.credits; return true;
  });
  box.innerHTML = chosen.length ? `<div class="dp-recommend-list">${chosen.map((item, index) => `
    <label class="dp-recommend-item${item.missing.length ? ' needs-review' : ''}">
      <input type="checkbox" data-rec-index="${index}" ${item.missing.length ? '' : 'checked'}>
      <span><b>${esc(item.code)}</b> ${esc(item.name || '')}<small>${item.credits} kr · ${esc(item.section.when || 'zaman açıklanmadı')} · CRN ${esc(item.section.crn)}</small></span>
      <em>${item.failed ? 'Tekrar dersi' : `${item.semesterIndex + 1}. yarıyıl`}${item.missing.length ? ` · önşartı kontrol et: ${esc(item.missing.join(', '))}` : ''}</em>
    </label>`).join('')}</div>
    <div class="dp-recommend-footer"><b>${trNum(used)} kredi önerildi</b><button type="button" id="dp-recommend-add" class="btn-primary">Seçilenleri programa ekle</button></div>`
    : '<p class="empty">Bu dönem, notların ve kredi sınırıyla eşleşen ders bulunamadı.</p>';
  staggerReveal(box, '.dp-recommend-item');
  box._items = chosen;
  $('#dp-recommend-add')?.addEventListener('click', () => {
    const items = [...box.querySelectorAll('[data-rec-index]:checked')].map((input) => chosen[Number(input.dataset.recIndex)]?.section).filter(Boolean)
      .map((section) => ({ branch: section.branch, crn: String(section.crn) }));
    if (!items.length) { toast('Önce en az bir ders seç', { kind: 'warn' }); return; }
    window.dispatchEvent(new CustomEvent('itu:goto-program'));
    setTimeout(() => window.dispatchEvent(new CustomEvent('itu:add-program-items', { detail: { term: termSlug, items } })), 0);
  });
}

// Kalan zorunlu derslerin geçmiş kalma oranını (FF+VF/toplam) branş bazlı
// not dağılımı arşivinden hesaplar (docs/data/grades/<BRANŞ>.json) — tüm
// dönemler toplanır. Veri yoksa (yeni/nadir açılan ders) o kod haritada
// olmaz; planlayıcı bunu "zor değil" (nötr) sayar, tahmin yapmaz.
async function loadDifficulty(codes) {
  const branches = new Set([...codes].map(branchOf).filter(Boolean));
  const perCode = new Map(); // code -> { ff_vf, total }
  await Promise.all([...branches].map(async (branch) => {
    const rows = await getJSON(`data/grades/${branch}.json`).catch(() => []);
    if (!Array.isArray(rows)) return;
    for (const row of rows) {
      const code = canonicalCode(row.code);
      if (!codes.has(code)) continue;
      const g = row.grades || {};
      const failCount = (g.FF || 0) + (g.VF || 0);
      const cur = perCode.get(code) || { failVf: 0, total: 0 };
      cur.failVf += failCount;
      cur.total += Number(row.total) || 0;
      perCode.set(code, cur);
    }
  }));
  const difficulty = new Map();
  for (const [code, { failVf, total }] of perCode) {
    if (total > 0) difficulty.set(code, { failRate: failVf / total });
  }
  return difficulty;
}

async function buildBalancedPlanUI() {
  const box = $('#dp-balanced-result');
  if (!plan || !plan.semesters) { box.innerHTML = '<p class="empty">Önce programını seç.</p>'; return; }
  box.innerHTML = '<p class="empty">hesaplanıyor…</p>';

  const done = passedCodes();
  // Kalan zorunlu dersler: müfredattaki her .course girdisi, henüz geçilmemişse
  // (aynı kod tekrar ediyorsa — örn. iki farklı dönemde aynı slot — bir kez sayılır).
  const seen = new Set();
  const remaining = [];
  for (const sem of plan.semesters) {
    for (const item of sem.items || []) {
      if (!item.course) continue;
      const code = canonicalCode(item.course.code);
      if (!code || done.has(code) || seen.has(code)) continue;
      seen.add(code);
      remaining.push({ code, name: item.course.name || '', credits: item.course.credits || 0 });
    }
  }
  if (!remaining.length) {
    box.innerHTML = '<p class="empty">Tüm zorunlu dersler tamamlanmış görünüyor.</p>';
    return;
  }

  const failedCodes = new Set(
    remaining.map((r) => r.code).filter((code) => {
      const g = (stored.grades || {})[code]?.grade;
      return g === 'FF' || g === 'VF';
    })
  );

  const [graph, difficulty] = await Promise.all([
    getJSON('data/prereq/graph.json').catch(() => ({ edges: [] })),
    loadDifficulty(new Set(remaining.map((r) => r.code))),
  ]);

  const result = buildBalancedPlan({
    remaining, failedCodes, edges: graph.edges || [], difficulty,
  });

  if (!result.terms.length) {
    box.innerHTML = '<p class="empty">Plan oluşturulamadı.</p>';
    return;
  }

  const cyclicNote = result.cyclic.length
    ? `<p class="dp-recommend-note">Uyarı: ${esc(result.cyclic.join(', '))} için önşart verisinde devirli bir bağımlılık tespit edildi (veri hatası olabilir); bu dersler sıra gözetmeden yerleştirildi.</p>`
    : '';

  // Yalnızca 1. dönem (bu dönem alınabilecek dersler) tıklanabilir: sonraki
  // dönemler henüz açılmamış, gerçek şube/CRN'i yok — salt metin kalır.
  // 1. dönemdeki bir ders bu dönem açık değilse de metin kalır (eklenecek
  // şube yok).
  const firstTerm = result.terms[0];
  const chosen = firstTerm
    ? firstTerm.courses
      .map((c) => ({ ...c, sections: sectionsForCode(rows, c.code) }))
      .filter((c) => c.sections.length)
      .map((c) => ({
        ...c,
        section: c.sections.slice().sort((a, b) => {
          const ar = Number(a.cap || 0) - Number(a.enr || 0), br = Number(b.cap || 0) - Number(b.enr || 0);
          return Number(br > 0) - Number(ar > 0) || br - ar;
        })[0],
      }))
    : [];
  const chosenByCode = new Map(chosen.map((c) => [c.code, c]));

  box.innerHTML = cyclicNote + `<div class="dp-balanced-terms">${result.terms.map((t) => `
    <div class="dp-balanced-term">
      <div class="dp-balanced-term-head"><b>${t.index + 1}. dönem</b><span>${trNum(t.totalCredits)} kredi</span></div>
      <ul class="dp-balanced-list">${t.courses.map((c) => {
        const pick = t.index === 0 ? chosenByCode.get(c.code) : null;
        if (!pick) {
          return `<li><b>${esc(c.code)}</b> ${esc(c.name || '')}<small>${trNum(c.credits)} kr · ${esc(c.reason)}</small></li>`;
        }
        return `<li class="dp-balanced-pick">
          <label><input type="checkbox" data-balanced-code="${esc(c.code)}" checked>
          <span><b>${esc(c.code)}</b> ${esc(c.name || '')}<small>${trNum(c.credits)} kr · ${esc(pick.section.when || 'zaman açıklanmadı')} · CRN ${esc(pick.section.crn)}</small></span></label>
        </li>`;
      }).join('')}</ul>
    </div>`).join('')}</div>
    ${chosen.length ? `<div class="dp-recommend-footer"><b>bu dönem açık ${chosen.length} ders eklenebilir</b><button type="button" id="dp-balanced-add" class="btn-primary">Seçilenleri programa ekle</button></div>` : ''}`;
  staggerReveal(box, '.dp-balanced-term');

  $('#dp-balanced-add')?.addEventListener('click', () => {
    const items = [...box.querySelectorAll('[data-balanced-code]:checked')]
      .map((input) => chosenByCode.get(input.dataset.balancedCode)?.section)
      .filter(Boolean)
      .map((section) => ({ branch: section.branch, crn: String(section.crn) }));
    if (!items.length) { toast('Önce en az bir ders seç', { kind: 'warn' }); return; }
    window.dispatchEvent(new CustomEvent('itu:goto-program'));
    setTimeout(() => window.dispatchEvent(new CustomEvent('itu:add-program-items', { detail: { term: termSlug, items } })), 0);
  });
}

function downloadJSON(data, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}

// -- olaylar --

function init() {
  $('#dp-recommend-run').addEventListener('click', buildRecommendations);
  $('#dp-balanced-run').addEventListener('click', buildBalancedPlanUI);
  $('#dp-yatay-fac').addEventListener('change', () => {
    $('#dp-yatay-prog').innerHTML = renderProgramOptions($('#dp-yatay-fac').value, 'LS');
    renderYatay();
  });
  $('#dp-yatay-prog').addEventListener('change', renderYatay);
  const term = $('#dp-term');
  term.addEventListener('change', async () => {
    termSlug = term.value;
    await reloadRows();
    renderAll();
    saveState();
  });
  $('#dp-filter-toggle').addEventListener('click', () => {
    const toggle = $('#dp-filter-toggle');
    const more = $('#dp-filter-more');
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    more.hidden = !open;
  });
  $('#dp-level').addEventListener('change', () => {
    const fac = $('#dp-fac');
    fac.innerHTML = renderFacultyOptions($('#dp-level').value);
    fac.value = '';
    $('#dp-prog').innerHTML = renderProgramOptions('', $('#dp-level').value);
    showProgramEmpty();
    saveState();
  });
  // Fakülte değişince bölüm listesi yenilenir; program kullanıcı tarafından seçilir.
  $('#dp-fac').addEventListener('change', () => {
    const sel = $('#dp-prog');
    sel.innerHTML = renderProgramOptions($('#dp-fac').value, $('#dp-level').value);
    sel.value = '';
    showProgramEmpty();
  });
  $('#dp-prog').addEventListener('change', () => {
    selectProgram($('#dp-prog').value);
  });
  document.querySelectorAll('.dp-transcript-open').forEach((button) => button.addEventListener('click', importTranscript));
  ['#dp-open', '#dp-cap'].forEach((sel) => {
    $(sel).addEventListener('change', () => {
      filters.open = $('#dp-open').checked;
      filters.cap = $('#dp-cap').checked;
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
  $('#dp-targetgpa').addEventListener('input', () => {
    const value = Number(String($('#dp-targetgpa').value || '').replace(',', '.'));
    if (Number.isFinite(value) && value >= 0 && value <= 4 && progCode) {
      stored = { ...stored, targetGpa: value };
      saveStored(progCode, stored);
    }
    renderGPA();
  });

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
    const target = Number(stored.targetGpa);
    $('#dp-targetgpa').value = Number.isFinite(target) && target >= 0 && target <= 4 ? String(target) : '3.00';
    catalogMap.clear();
    ensureCatalogForPicks();
    renderAll();
    toast('Notlar içe aktarıldı');
  });
  $('#dp-backup-all').addEventListener('click', () => {
    downloadJSON(createBackup(), `itu-ders-yedek-${new Date().toISOString().slice(0, 10)}.json`);
    toast('Program ve GANO yedeği indirildi');
  });
  $('#dp-restore-all').addEventListener('click', () => $('#dp-restore-file').click());
  $('#dp-restore-file').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const parsed = parseBackup(await file.text());
    if (!parsed) { toast('Geçersiz veya desteklenmeyen yedek', { kind: 'warn' }); return; }
    const summary = backupSummary(parsed);
    const yes = await confirmDialog({ title: 'Tüm yedeği geri yükle', message: `${summary.programs} program, ${summary.sections} şube ve ${summary.gpaPrograms} GANO planı mevcut tarayıcı verilerinin yerini alacak.`, okLabel: 'Geri yükle' });
    if (!yes) return;
    if (!restoreBackup(parsed)) { toast('Yedek kaydedilemedi', { kind: 'warn' }); return; }
    toast('Yedek geri yüklendi');
    location.reload();
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
      $('#dp-targetgpa').value = '3.00';
      renderAll();
      toast('Notlar sıfırlandı');
    });
  });
}

// i18n görünümüne uydur: boot'ta onShow dışı çağrılmaz.
export function initDersplanim() {
  // (app.js wireTabs onShow üzerinden çağırır)
}
