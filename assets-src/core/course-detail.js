// Ortak ders detay paneli. Dersler, önşart haritası, seçmeli havuz, sınavlar,
// geçmiş, program ve Ders Planım aynı paneli açar; tek giriş
// openCourseDetail(code, opts).
//
// Panel tek kaydırmalı bir sayfadır (sekme yok): yapışkan başlık (kod, ad,
// kredi/AKTS, OBS bağlantısı, şube/doluluk/boş yer şeridi), "Bu dönemki
// şubeler", "Özet" (kredi ızgarası, katalog, önşart, not dağılımı, alabilen
// programlar) ve "Geçmiş dönemler".
//
// Yerleşim iki kiplidir. Dersler sekmesi görünür ve ekran ≥760 px ise panel
// listenin sağında bir ızgara sütunu olarak durur (liste görünür kalır,
// modal değildir). Diğer sekmelerden ya da dar ekranda açıldığında aynı panel
// sağdan gelen bir çekmece (760 px altında alttan gelen tam boy sayfa) olur:
// perde, odak tuzağı, aria-modal. Adres ve geri tuşu davranışı iki kipte
// aynıdır (#ders/<slug>). Yapışkan başlığın altındaki atlama çubuğu
// (Şubeler · Özet · Önşart · Notlar · Geçmiş) tek sayfayı bölüme kaydırır.

import { $, getJSON, esc, termLabel, sessionHours, fillMeasured, frozenMeasuredAt, fmtDay, buildingName, trNum, formatInt, isViewVisible } from './utils.js?v=dde1e9339338';
import { state } from './store.js?v=dde1e9339338';
import { quotaState, trendChart } from './chart.js?v=dde1e9339338';
import { parseReq, renderReqTree } from '../prereq.js?v=dde1e9339338';
import { codeToSlug } from './urlcodes.js?v=dde1e9339338';
import { loadProgramMap } from './programs.js?v=dde1e9339338';
import { TAKEN_CHANGED, getTaken } from './taken.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';
import { loadStyle } from './lazy-style.js';
import { isRemoteMethod } from './campus.js';
import { inActiveProgram, removeFromActiveProgram, PROGRAMS_CHANGED } from './program-store.js';
import { toast } from './toast.js?v=dde1e9339338';
import { instructorSlug, copyCrn } from '../views/courses.js?v=dde1e9339338';

const t = (key, vars) => I18N.t(key, vars);

let lastDetailFocus = null;
let lastDetailHash = null; // detay açılmadan önceki görünüm hash'i (kapatınca dön)
// Açık panelin kimliği: aynı dersin başka şubesine tıklamak yeniden yüklemez.
let current = null; // { code, term, crn, branch }
let openSeq = 0;

const DOCK_MQ = '(min-width: 760px)';

// İçerik bazlı mobil tespiti (user-agent değil): dar ekranda grafik ve
// katlanabilirlerin varsayılanı farklılaşır.
function isMobile() {
  return window.matchMedia('(max-width: 600px)').matches;
}

const CLOSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const EXT_SVG = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6"/></svg>';

// "haftada X sa" / "X h/week" — word order differs by language, hence a helper.
function weeklyHoursLabel(hrs) {
  if (!hrs) return '';
  const abbr = t('progHourAbbr');
  return I18N.lang === 'en' ? `${hrs} ${abbr}/week` : `haftada ${hrs} ${abbr}`;
}

// "A, B" / "A; B" / "A | B" → ["A", "B"]. Boşluk-önemsiz. Tek isimde tek eleman.
// Saf — test edilebilir.
export function splitInstructors(instr) {
  return String(instr ?? '').split(/[;,|]/).map((s) => s.trim()).filter(Boolean);
}

const NO_INSTRUCTOR = new Set(['', '-', '--', '·', '.', '***']);

// Dolma süresi kısa etiketi: kontenjan ölçümündeki "ilk ölçümden X dk sonra
// doldu" süresi gün (1 günden kısaysa saat, 1 saatten kısaysa dakika) olarak.
// Saf — test edilebilir. minutes: null/undefined → '' (dolmadı ya da veri yok).
export function fillSpeedLabel(minutes, tr = t) {
  if (minutes == null || !Number.isFinite(Number(minutes))) return '';
  const m = Number(minutes);
  if (m <= 0) return tr('cdFillPrefilled');
  if (m < 60) return tr('cdFillMinutes', { n: Math.max(1, Math.round(m)) });
  if (m < 1440) {
    const h = Math.max(1, Math.round(m / 60));
    return h === 1 ? tr('cdFillOneHour') : tr('cdFillHours', { n: h });
  }
  const d = Math.max(1, Math.round(m / 1440));
  return d === 1 ? tr('cdFillOneDay') : tr('cdFillDays', { n: d });
}

// Kesin süre (başlık ipucu): "ilk ölçümden 3 sa 20 dk sonra doldu".
function fillExact(m) {
  if (!m) return t('cdFillPrefilled');
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const span = h ? `${h} ${t('progHourAbbr')}${rest ? ` ${rest} ${t('progMinAbbr')}` : ''}` : `${rest} ${t('progMinAbbr')}`;
  return I18N.lang === 'en' ? `filled ${span} after first measurement` : `ilk ölçümden ${span} sonra doldu`;
}

// Kontenjan ölçümü yalnızca Dersler'de yüklü dönem için vardır (state.quota).
function quotaRec(term, crn) {
  if (term !== state.termSlug) return null;
  return state.quota?.get(String(crn)) || null;
}

// Bina kodu → ad haritası (docs/data/buildings.json). Bir kez yüklenir.
let buildingsCache = null;
async function loadBuildings() {
  if (buildingsCache === null) {
    buildingsCache = await getJSON('data/buildings.json').catch(() => []);
  }
  return buildingsCache;
}

// OBS katalog formunun derin bağlantısı. Taban dersNo, kodun sayısal öneki
// (TR/EN çiftleri tek sayfada birleşir: "BLG 102E" → dersNo=102).
export function obsDeepLink(code) {
  const m = String(code ?? '').match(/^([A-ZÇĞİÖŞÜ]{2,5})\s+(\d+)/);
  if (!m) return '';
  return 'https://obs.itu.edu.tr/public/DersKatalog/DersKatalogBilgiBransDersKodu?bransKodu=' +
    encodeURIComponent(m[1]) + '&dersNo=' + encodeURIComponent(m[2]);
}

// Doluluk ölçüm zamanı (Faz 0.4): "%100" anlık sanılmasın.
function measuredNote(term, secs) {
  if (term !== state.termSlug || !state.quotaLast) return '';
  if (!secs.some((s) => state.quota?.get(String(s.crn)))) return '';
  const frozenDay = fmtDay(frozenMeasuredAt(state.freeze, state.termSlug, state.quotaFinalAt), I18N.lang);
  if (frozenDay) return t('freshLastMeasured', { date: frozenDay });
  return fillMeasured(state.quotaLast, Date.now(), I18N.lang);
}

/* ---------- şube satırları ---------- */

const DAY_KEYS = {
  Pazartesi: 'progDayAbbrMon', Salı: 'progDayAbbrTue', Çarşamba: 'progDayAbbrWed',
  Perşembe: 'progDayAbbrThu', Cuma: 'progDayAbbrFri', Cumartesi: 'progDayAbbrSat', Pazar: 'progDayAbbrSun',
};
const shortDay = (day) => (DAY_KEYS[day] ? t(DAY_KEYS[day]) : day);

function timeKey(s) {
  return (s.days || []).map((d, i) => `${shortDay(d)} ${String(s.times?.[i] || '').replace('/', '–')}`.trim()).join(', ');
}
const isOnline = (s) => isRemoteMethod(s.method);
function placeKey(s) {
  if (isOnline(s)) return '';
  const parts = (s.days || []).map((_, i) => [s.buildings?.[i], s.rooms?.[i]]
    .filter((x) => x && !/^-+$/.test(String(x).trim())).join(' ')).filter(Boolean);
  return [...new Set(parts)].join(', ');
}
const buildingKey = (s) => (isOnline(s) ? '' : [...new Set((s.buildings || []).filter(Boolean))].join(', '));
function methodLabel(s) {
  if (!s.method) return '';
  if (isOnline(s)) return t('cdMethodOnline');
  if (/yüz\s*yüze|face/i.test(s.method)) return t('cdMethodFace');
  return s.method;
}

// Tüm şubelerde aynı olan alanlar bir kez yazılır; her şube satırı yalnızca
// farklı olanı gösterir. Saf — test edilebilir.
export function commonFields(secs) {
  const same = (f) => secs.length > 0 && secs.every((s) => f(s) === f(secs[0]));
  return {
    time: same(timeKey),
    method: same(methodLabel),
    place: same(placeKey),
    building: same(buildingKey),
    hours: same((s) => sessionHours(s.times)),
  };
}

function rulesOf(s) {
  return [
    s.prereq && s.prereq !== '-' ? { label: t('detailPrereq'), value: s.prereq } : null,
    s.classReq && s.classReq !== '-' ? { label: t('detailClassReq'), value: s.classReq } : null,
    s.reserved && s.reserved !== '-' ? { label: t('cdReserved'), value: s.reserved } : null,
  ].filter(Boolean);
}
const rulesHtml = (rules) => `<details class="d-rules"><summary>${esc(t('cdRegRequirements'))}</summary>${rules.map((r) => `<p><b>${esc(r.label)}</b> ${esc(r.value)}</p>`).join('')}</details>`;

function instructorHtml(instr) {
  const names = splitInstructors(instr).filter((n) => !NO_INSTRUCTOR.has(n));
  if (!names.length) return '<span class="d-none">·</span>';
  return names.map((n) => {
    const slug = instructorSlug(n);
    return slug ? `<a href="/hoca/${slug}/">${esc(n)}</a>` : esc(n);
  }).join(', ');
}

function fillHtml(cap, enr, cls = '') {
  const q = quotaState(cap, enr);
  if (q.kind === 'unknown') return `<span class="d-fill-unknown">${esc(t('quotaUnknown'))}</span>`;
  const over = Math.max(0, q.enrolled - q.capacity);
  const pill = q.kind === 'full' ? (over ? t('quotaFullOver', { n: formatInt(over) }) : t('quotaFull'))
    : q.kind === 'tight' ? t('quotaLeft', { n: formatInt(q.remaining) }) : '';
  return `<span class="d-fill is-${q.kind}${cls ? ` ${cls}` : ''}"><span class="d-bar" aria-hidden="true"><i style="width:${Math.min(100, q.pct)}%"></i></span>`
    + `<span class="d-fill-n num">${formatInt(q.enrolled)}/${formatInt(q.capacity)}</span>`
    + `${pill ? `<span class="d-tag is-${q.kind}">${esc(pill)}</span>` : ''}</span>`;
}

function addButtonState(term, branch, s) {
  const on = inActiveProgram(term, branch, String(s.crn));
  const full = quotaState(s.capacity, s.enrolled).kind === 'full';
  const label = on ? t('cdInProgram') : full ? t('cdAddAnyway') : t('cdAddToProgram');
  return { on, full, label };
}

function addButtonHtml(term, branch, s) {
  const st = addButtonState(term, branch, s);
  return `<button type="button" class="d-add${st.on ? ' is-on' : ''}${st.full ? ' is-full' : ''}" data-add-crn="${esc(s.crn)}" aria-pressed="${st.on}">`
    + `<span class="d-add-l">${esc(st.label)}</span><span class="sr-only"> · CRN ${esc(s.crn)}</span></button>`;
}

function sectionRow(s, ctx) {
  const { common, term, branch, focusCrn, sharedRules } = ctx;
  const diff = [];
  if (!common.time) diff.push(timeKey(s));
  if (!common.method && methodLabel(s)) diff.push(methodLabel(s));
  if (!common.place && placeKey(s)) diff.push(placeKey(s));
  if (!common.hours && !common.time && sessionHours(s.times)) diff.push(weeklyHoursLabel(sessionHours(s.times)));
  const q = quotaRec(term, s.crn);
  const speed = q && q.filledAt ? fillSpeedLabel(q.fillMinutes) : '';
  const rules = sharedRules ? [] : rulesOf(s);
  const focus = String(s.crn) === String(focusCrn);
  return `<article class="d-row${focus ? ' is-focus' : ''}" data-crn="${esc(s.crn)}">
      <button type="button" class="d-row-crn crn" translate="no" data-copy-crn="${esc(s.crn)}" title="${esc(t('courseCopyHint'))}" aria-label="${esc(t('courseCopyCRN', { crn: s.crn }))}">${esc(s.crn)}</button>
      <div class="d-row-who">${instructorHtml(s.instructor)}${diff.length ? `<div class="d-row-diff">${esc(diff.filter(Boolean).join(' · '))}</div>` : ''}</div>
      ${addButtonHtml(term, branch, s)}
      <div class="d-row-fill">${s.capacity ? fillHtml(s.capacity, s.enrolled) : `<span class="d-fill-unknown">${esc(t('quotaUnknown'))}</span>`}${speed ? `<span class="d-speed" title="${esc(fillExact(q.fillMinutes))}">${esc(speed)}</span>` : ''}</div>
      ${rules.length ? `<div class="d-row-rules">${rulesHtml(rules)}</div>` : ''}
    </article>`;
}

function sectionsHtml({ term, secs, branch, crn, buildings }) {
  const caption = [termLabel(term), measuredNote(term, secs)].filter(Boolean).join(' · ');
  const head = `<h3 class="d-h" id="d-h-secs"><span>${esc(t('cdSectionsThisTerm'))}</span><small>${esc(caption)}</small></h3>`;
  if (!secs.length) {
    const msg = I18N.lang === 'en'
      ? `This course is not offered in <b>${esc(termLabel(term))}</b>.`
      : `Bu ders <b>${esc(termLabel(term))}</b> döneminde açık değil.`;
    return `<section class="d-block d-blk-secs" aria-labelledby="d-h-secs">${head}<p class="empty">${msg}</p></section>`;
  }
  const ordered = secs.slice().sort((a, b) =>
    (a.capacity > 0 ? 0 : 1) - (b.capacity > 0 ? 0 : 1) ||
    Number(a.crn) - Number(b.crn) || String(a.crn).localeCompare(b.crn));
  const common = commonFields(secs);
  const first = secs[0];
  const parts = [];
  if (common.time && timeKey(first)) parts.push(`<b>${esc(timeKey(first))}</b>`);
  if (common.method && methodLabel(first)) parts.push(`<b>${esc(methodLabel(first))}</b>`);
  if (!isOnline(first)) {
    if (common.place && placeKey(first)) parts.push(`<b>${esc(placeKey(first))}</b>`);
    else if (common.building && buildingKey(first)) {
      const b = buildingKey(first);
      const full = buildingName(b, buildings);
      parts.push(`<b>${esc(full && full !== b ? `${b} · ${full}` : b)}</b>`);
    }
  }
  if (common.hours && sessionHours(first.times)) parts.push(esc(weeklyHoursLabel(sessionHours(first.times))));
  const rules0 = JSON.stringify(rulesOf(first));
  const sharedRules = secs.every((s) => JSON.stringify(rulesOf(s)) === rules0);
  const lead = secs.length > 1 ? `${esc(t('cdCommonAll'))} ` : '';
  const commonLine = parts.length ? `<p class="d-common">${lead}${parts.join(' · ')}</p>` : '';
  const ctx = { common, term, branch, focusCrn: crn, sharedRules };
  return `<section class="d-block d-blk-secs" aria-labelledby="d-h-secs">${head}${commonLine}
    ${sharedRules && rulesOf(first).length ? rulesHtml(rulesOf(first)) : ''}
    <div class="d-rows">${ordered.map((s) => sectionRow(s, ctx)).join('')}</div>
  </section>`;
}

/* ---------- başlık ---------- */

function titleNames(name, cat) {
  const en = cat?.nameEn && cat.nameEn.trim();
  if (I18N.lang === 'en' && en) return { main: en, sub: en.toLocaleLowerCase('en') === String(name).toLocaleLowerCase('en') ? '' : name };
  return { main: name, sub: en && en.toLocaleLowerCase('tr') !== String(name).toLocaleLowerCase('tr') ? en : '' };
}

function headHtml({ code, name, cat, secs, obsLink, special }) {
  const names = titleNames(name || code, cat);
  const c = cat?.credits || {};
  const credit = c.local != null
    ? `${trNum(c.local)} ${t('planCreditsFull')}${c.ects ? ` · ${trNum(c.ects)} ${t('progECTSWord')}` : ''}`
    : '';
  const withCap = secs.filter((s) => Number(s.capacity) > 0);
  const cap = withCap.reduce((a, s) => a + Number(s.capacity), 0);
  const enr = withCap.reduce((a, s) => a + (Number(s.enrolled) || 0), 0);
  const left = withCap.reduce((a, s) => a + Math.max(0, Number(s.capacity) - (Number(s.enrolled) || 0)), 0);
  const q = quotaState(cap, enr);
  const sub = [
    names.sub ? `<span class="d-ph-en">${esc(names.sub)}</span>` : '',
    credit ? `<span class="num">${esc(credit)}</span>` : '',
    obsLink ? `<a class="d-obs" href="${esc(obsLink)}" target="_blank" rel="noopener">${esc(t('cdObsCatalog'))} ${EXT_SVG}</a>` : '',
  ].filter(Boolean).join('');
  return `<header class="d-ph">
      <div class="d-ph-top">
        <div class="d-ph-t">
          <div class="d-ph-code"><span class="code" translate="no">${esc(code)}</span>${special ? `<span class="section-kind-badge ${special}">${esc(t(special === 'extra-exam' ? 'courseExtraExamBadge' : 'courseGraduationBadge'))}</span>` : ''}</div>
          <h2 class="d-ph-name" id="detail-title">${esc(names.main)}</h2>
          ${sub ? `<div class="d-ph-sub">${sub}</div>` : ''}
        </div>
        <button type="button" class="d-x" id="detail-close" data-d-close aria-label="${esc(t('cdClose'))}">${CLOSE_SVG}</button>
      </div>
      <div class="d-stats">
        <div><small>${esc(t('cdStatSections'))}</small><strong class="num">${formatInt(secs.length)}</strong></div>
        <div><small>${esc(t('cdStatFill'))}</small><strong class="num">${cap ? `${formatInt(enr)}/${formatInt(cap)}` : '–'}</strong>${cap ? `<span class="d-bar is-${q.kind}" aria-hidden="true"><i style="width:${Math.min(100, q.pct)}%"></i></span>` : ''}</div>
        <div><small>${esc(t('cdStatLeft'))}</small><strong class="num${cap && !left ? ' is-zero' : ''}">${cap ? formatInt(left) : '–'}</strong></div>
      </div>
    </header>`;
}

function loadingHtml(code) {
  return `<header class="d-ph">
      <div class="d-ph-top">
        <div class="d-ph-t"><div class="d-ph-code"><span class="code" translate="no">${esc(code)}</span></div><h2 class="d-ph-name" id="detail-title">${esc(code)}</h2></div>
        <button type="button" class="d-x" id="detail-close" data-d-close aria-label="${esc(t('cdClose'))}">${CLOSE_SVG}</button>
      </div>
    </header>
    <p class="empty d-loading">${esc(t('statLoading'))}</p>`;
}

/* ---------- özet / katalog ---------- */

function programsHtml(programs, hasTermData) {
  if (!hasTermData) {
    return `<div class="d-progs d-progs-none"><span>${t('cdProgNoTermDataTitle')}</span><p>${t('cdProgNoTermDataBody')}</p></div>`;
  }
  if (!programs.length) {
    return `<div class="d-progs d-progs-none"><span>${t('cdProgNoRestrictionTitle')}</span><p>${t('cdProgNoRestrictionBody')}</p></div>`;
  }
  return `<details class="d-progs">
    <summary><span>${t('detailPrograms')}</span><b>${programs.length}</b></summary>
    <div class="d-progs-body">
      ${programs.length > 12 ? `<label class="d-prog-search-wrap"><span class="sr-only">${t('cdProgSearchLabel')}</span><input type="search" class="d-prog-search" placeholder="${esc(t('cdProgSearchPlaceholder'))}" autocomplete="off"></label>` : ''}
      <div class="d-prog-list">${programs.map((p) => `<button type="button" class="d-prog" data-program="${esc(p)}" title="${esc(t('cdProgFilterTitle'))}">${esc(p)}</button>`).join('')}</div>
      <p class="d-prog-empty" hidden>${t('cdProgNoMatch')}</p>
    </div>
  </details>`;
}

const fold = (title, body, { open = false, cls = '' } = {}) =>
  `<details class="d-fold${cls ? ` ${cls}` : ''}"${open ? ' open' : ''}><summary>${title}</summary><div class="d-fold-body">${body}</div></details>`;

function aboutHtml({ code, cat, gr, programs, secs }) {
  const c = cat?.credits || {};
  const cell = (label, v) => `<div><small>${esc(label)}</small><strong class="num">${v == null || v === '' ? '·' : esc(trNum(v))}</strong></div>`;
  const facts = `<div class="d-facts">${cell(t('cdTheory'), c.theory)}${cell(t('cdPractice'), c.practice)}${cell(t('cdLab'), c.lab)}${cell(t('cdCreditShort'), c.local)}${cell(t('progECTSWord'), c.ects)}</div>`;
  const list = (items) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  const desc = cat?.description
    ? `<p class="d-desc" id="d-desc">${esc(cat.description)}</p><button type="button" class="d-desc-more" aria-controls="d-desc" aria-expanded="false" hidden>${esc(t('cdShowAll'))}</button>`
    : '';
  const metaBits = [];
  if (cat?.language) metaBits.push(`${esc(t('cdLanguage'))}: ${esc(cat.language)}`);
  const midterms = (cat?.weeklyTopics || []).filter((x) => /ara\s*sınav/i.test(x));
  if (midterms.length) metaBits.push(`${t('cdMidtermPrefix')} ${esc(midterms.map((x) => x.split(' · ')[0] || x).join(', '))}`);
  const meta = metaBits.length ? `<p class="d-cat-meta">${metaBits.join(' · ')}</p>` : '';
  const eqs = cat?.equivalents || [];
  const eqHtml = eqs.length
    ? `<div class="d-cat-eq"><h4>${t('cdEquivalents')}</h4><div class="d-eq-list">${eqs.map((e) => `<button type="button" class="d-eq" data-eq="${esc(e)}">${esc(e)}</button>`).join('')}</div></div>`
    : '';
  const hasOut = (cat?.weeklyPlan || []).some((w) => w.outcomes);
  const planHtml = (cat?.weeklyPlan || []).length
    ? `<div class="tablewrap"><table class="d-cat-plan" aria-label="${esc(t('cdWeeklyPlanAria'))}">
        <thead><tr><th class="num">${t('cdColWeek')}</th><th>${t('cdColTopic')}</th>${hasOut ? `<th>${t('cdColOutcomes')}</th>` : ''}</tr></thead>
        <tbody>${cat.weeklyPlan.map((w) => `<tr${/ara\s*sınav/i.test(w.topic) ? ` class="d-cat-mid" title="${esc(t('cdMidtermWeekTitle'))}"` : ''}><td class="num">${w.week}</td><td>${esc(w.topic)}</td>${hasOut ? `<td>${esc(w.outcomes || '·')}</td>` : ''}</tr>`).join('')}</tbody>
      </table></div>`
    : (cat?.weeklyTopics || []).length ? `<ol>${list(cat.weeklyTopics)}</ol>` : '';
  const folds = [
    (cat?.outcomes || []).length ? fold(`${t('cdLearningOutcomes')} <span>${cat.outcomes.length}</span>`, `<ul>${list(cat.outcomes)}</ul>`) : '',
    planHtml ? fold(`${t('cdWeeklyPlan')} <span>${(cat.weeklyPlan || cat.weeklyTopics || []).length}</span>`, planHtml) : '',
    (cat?.textbooks || []).length ? fold(t('cdTextbooks'), `<ul>${list(cat.textbooks)}</ul>`) : '',
  ].join('');
  const relations = `<div class="d-relations">
      <section class="d-relation"><h4>${t('detailPrereq')}</h4><div class="d-req-fwd" data-code="${esc(code)}"><p class="empty">${t('statLoading')}</p></div></section>
      <details class="d-relation d-relation-more"><summary>${t('cdReverseReqSummary')} <span data-req-count>…</span></summary>
        <div class="d-req-by" data-code="${esc(code)}"><p class="empty">${t('statLoading')}</p></div>
      </details>
    </div>`;
  return `<section class="d-block d-about" aria-labelledby="d-h-about">
    <h3 class="d-h" id="d-h-about"><span>${esc(t('cdTabOverview'))}</span></h3>
    ${facts}
    ${cat ? '' : `<p class="empty">${t('cdNoCatalogRecord')}</p>`}
    ${desc}${meta}
    ${relations}
    ${eqHtml}
    ${folds}
    ${gradesHtml(gr)}
    ${programsHtml(programs, secs.length > 0)}
    ${cat?.sourceUrl ? `<p class="d-cat-src">${t('cdSourcePrefix')} <a href="${esc(cat.sourceUrl)}" target="_blank" rel="noopener">${t('cdObsCatalogForm')}</a></p>` : ''}
  </section>`;
}

/* ---------- geçmiş dönemler ---------- */

const HIST_VISIBLE = 8;
let lastHistTerms = null; // trend "hepsini göster" için güncel byTerm

function histHtml(hist, term) {
  const byTerm = new Map();
  for (const [slug, instructor, cap, enr] of hist?.rows || []) {
    if (!byTerm.has(slug)) byTerm.set(slug, []);
    byTerm.get(slug).push({ instructor, cap: Number(cap) || 0, enr: Number(enr) || 0 });
  }
  const head = (caption) => `<h3 class="d-h" id="d-h-hist"><span>${esc(t('cdPastTerms'))}</span><small>${esc(caption)}</small></h3>`;
  if (!byTerm.size) {
    return `<section class="d-block d-blk-hist" aria-labelledby="d-h-hist">${head('')}<p class="empty">${t('cdPastNoData')}</p></section>`;
  }
  lastHistTerms = byTerm;
  const seasons = { guz: t('cdSeasonFall'), bahar: t('cdSeasonSpring'), yaz: t('cdSeasonSummer') };
  const openIn = [...new Set([...byTerm.keys()].map((s) => s.split('-')[2]))].map((s) => seasons[s] || s);
  const openedIn = I18N.lang === 'en' ? `opened in ${byTerm.size} terms` : `${byTerm.size} dönemde açıldı`;
  const terms = [...byTerm.entries()].sort(([a], [b]) => b.localeCompare(a));
  const termRow = ([slug, rows], i) => {
    const cap = rows.reduce((a, r) => a + r.cap, 0);
    const enr = rows.reduce((a, r) => a + r.enr, 0);
    const pct = cap ? Math.min(100, Math.round((enr / cap) * 100)) : 0;
    return `<div class="d-hrow${slug === term ? ' is-now' : ''}"${i >= HIST_VISIBLE ? ' data-hist-extra hidden' : ''}>
        <span class="d-hrow-t">${esc(termLabel(slug))}</span>
        <span class="d-htrack" aria-hidden="true"><i style="width:${pct}%"></i></span>
        <span class="d-hrow-v num">${esc(cap ? t('cdHistRowValue', { n: rows.length, enr: formatInt(enr), cap: formatInt(cap) }) : t('cdHistRowEnrolled', { n: rows.length, enr: formatInt(enr) }))}</span>
      </div>`;
  };
  const more = terms.length > HIST_VISIBLE
    ? `<button type="button" class="d-link-btn d-hist-toggle" aria-expanded="false" data-more="${esc(t('cdHistShowOlder', { n: terms.length - HIST_VISIBLE }))}" data-less="${esc(t('cdShowLess'))}">${esc(t('cdHistShowOlder', { n: terms.length - HIST_VISIBLE }))}</button>`
    : '';
  const records = [];
  for (const [slug, rows] of terms) rows.forEach((r, i) => records.push({ slug, first: i === 0, ...r }));
  const instr = (name) => splitInstructors(name).filter((n) => !NO_INSTRUCTOR.has(n))
    .map((n) => `<button type="button" class="d-instr-history" data-name="${esc(n)}" title="${esc(I18N.lang === 'en' ? `search ${n}'s history` : `${n} geçmişinde ara`)}">${esc(n)}</button>`).join('') || '·';
  return `<section class="d-block d-blk-hist" aria-labelledby="d-h-hist">
    ${head(`${openedIn} · ${openIn.join(', ')}`)}
    <p class="d-hist-legend">${esc(t('cdHistLegend'))}</p>
    <div class="d-hrows">${terms.map(termRow).join('')}</div>
    ${more}
    ${fold(t('cdFillChart'), trendChart(byTerm, isMobile() ? 6 : 8), { cls: 'd-trend-fold' })}
    <details class="d-fold d-records">
      <summary>${t('cdTermRecords')} <span>${records.length}</span></summary>
      <div class="d-fold-body tablewrap"><table class="htable" aria-label="${esc(t('cdHistAriaLabel'))}">
        <thead><tr><th>${t('cdColTerm')}</th><th>${t('detailInstr')}</th><th class="num">${t('cdColCapAbbr')}</th><th class="num">${t('detailEnr')}</th></tr></thead>
        <tbody>${records.map((r) => `<tr><td>${r.first ? esc(termLabel(r.slug)) : ''}</td>
          <td>${instr(r.instructor)}</td><td class="num">${r.cap}</td><td class="num">${r.enr}</td></tr>`).join('')}</tbody>
      </table></div>
    </details>
  </section>`;
}

/* ---------- not dağılımı ---------- */

// Harf notu sıralaması (kabaca azalan başarı). Geçme eşiği CC+ ve üzeri kabul
// edilir (İTÜ'de ders bazında değişebilir; bu yalnızca gösterge).
export const GRADE_ORDER = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF'];

// Saf yardımcı: harf notu dağılımından geçme oranı (% ≥CC+). Test edilebilir.
export function gradePassPct(grades, total) {
  const pass = GRADE_ORDER.slice(0, 8).reduce((s, g) => s + (grades[g] || 0), 0);
  return total ? Math.round((pass / total) * 100) : 0;
}

// Saf yardımcı: en sık harf notu + yüzdesi. Test edilebilir.
export function gradeMode(grades, total) {
  const e = Object.entries(grades).sort((a, b) => b[1] - a[1])[0];
  if (!e) return { grade: '·', pct: 0 };
  return { grade: e[0], pct: total ? Math.round((e[1] / total) * 100) : 0 };
}

// Harf notu dağılımı (Faz 3B): çubuk grafik + geçme oranı + mod. Veri yoksa
// hiç çıktı üretmez (opsiyonel bölüm).
function gradesHtml(gr) {
  if (!gr || !gr.length) return '';
  const gradeTier = (g) => {
    const i = GRADE_ORDER.indexOf(g);
    if (i < 0) return '';
    if (i < 8) return 'is-pass';
    if (i < 13) return 'is-borderline';
    return 'is-fail';
  };
  const gradeBars = (term) => {
    const max = Math.max(...Object.values(term.grades), 1);
    const order = GRADE_ORDER.filter((g) => term.grades[g]);
    return `<div class="d-grade-bars">${order.map((g) => `
      <div class="d-grade" title="${esc(g)} · ${term.grades[g]} ${t('cdPeopleCount')}">
        <span class="d-grade-l">${esc(g)}</span>
        <span class="d-grade-bar"><i class="${gradeTier(g)}" style="width:${Math.round((term.grades[g] / max) * 100)}%"></i></span>
        <span class="d-grade-n">${term.grades[g]}</span>
      </div>`).join('')}</div>`;
  };
  const statLine = (term) => {
    const pct = gradePassPct(term.grades, term.total);
    const mode = gradeMode(term.grades, term.total);
    return `<p class="d-grade-stat">${t('cdPassRateWord')} ≥CC+ %${pct} · ${t('cdMostCommon')} ${esc(`${mode.grade} (%${mode.pct})`)} · ${term.total} ${t('cdStudentsCount')}</p>`;
  };
  const sorted = [...gr].sort((a, b) => (b.donem || '').localeCompare(a.donem || ''));
  const latest = sorted[0];
  const older = sorted.slice(1);
  const pct = gradePassPct(latest.grades, latest.total);
  const mode = gradeMode(latest.grades, latest.total);
  return `<details class="d-grades">
    <summary><span><b>${t('cdGradeDist')}</b><small>${esc(latest.term)}</small></span><strong>≥CC+ %${pct} · ${t('cdMostCommon')} ${esc(mode.grade)}</strong></summary>
    <div class="d-grades-body">${statLine(latest)}
    ${gradeBars(latest)}
    ${older.length ? `<details class="d-grades-more"><summary>${t('cdPreviousTerms')} (${older.length})</summary>
      ${older.map((tm) => `<h5>${esc(tm.term)}</h5>${statLine(tm)}${gradeBars(tm)}`).join('')}
    </details>` : ''}</div>
  </details>`;
}

/* ---------- panel yerleşimi ---------- */

let panelHome = null; // { parent, next }: çekmece kipinde panelin DOM yeri

function panelEl() { return $('#detail-panel'); }
function isOpen() { const p = panelEl(); return Boolean(p && !p.hidden); }
function isDocked() { return Boolean(panelEl()?.classList.contains('is-docked')); }

// Dersler görünür ve geniş ekran: liste yanında sütun. Aksi halde çekmece.
function wantsDock() {
  return Boolean($('#course-work')) && isViewVisible('dersler') && window.matchMedia(DOCK_MQ).matches;
}

function placePanel(dock) {
  const panel = panelEl();
  const work = $('#course-work');
  const scrim = $('#detail-scrim');
  if (!panelHome) panelHome = { parent: panel.parentNode, next: panel.nextSibling };
  if (dock && work) {
    if (panel.parentNode !== work) work.appendChild(panel);
    work.classList.add('has-detail');
    panel.classList.add('is-docked');
    panel.setAttribute('role', 'region');
    panel.removeAttribute('aria-modal');
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('modal-open');
  } else {
    if (panel.parentNode !== panelHome.parent) panelHome.parent.insertBefore(panel, panelHome.next);
    work?.classList.remove('has-detail');
    panel.classList.remove('is-docked');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    if (scrim) scrim.hidden = false;
    document.body.classList.add('modal-open');
  }
}

function notify(open) {
  window.dispatchEvent(new CustomEvent('itu:detail-change', {
    detail: open && current ? { open: true, code: current.code, crn: current.crn || '', term: current.term } : { open: false },
  }));
}

// Seçili şubeyi panelde vurgular ve görünür alana kaydırır (pencere kaymaz).
function focusSection(crn, { scroll = true } = {}) {
  const panel = panelEl();
  let target = null;
  for (const row of panel.querySelectorAll('.d-row[data-crn]')) {
    const on = Boolean(crn) && row.dataset.crn === String(crn);
    row.classList.toggle('is-focus', on);
    if (on) target = row;
  }
  if (!scroll) return;
  if (!target) { panel.scrollTop = 0; return; }
  const head = panel.querySelector('.d-ph');
  const top = target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
  const headH = head ? head.getBoundingClientRect().height : 0;
  const visibleTop = panel.scrollTop + headH;
  const visibleBottom = panel.scrollTop + panel.clientHeight;
  if (top < visibleTop || top + target.offsetHeight > visibleBottom) {
    panel.scrollTop = Math.max(0, top - headH - 12);
  }
}

function syncAddButtons(content) {
  if (!current) return;
  for (const btn of content.querySelectorAll('[data-add-crn]')) {
    const crn = btn.dataset.addCrn;
    const s = current.secs.find((x) => String(x.crn) === crn);
    if (!s) continue;
    const st = addButtonState(current.term, current.branch, s);
    btn.classList.toggle('is-on', st.on);
    btn.classList.toggle('is-full', st.full);
    btn.setAttribute('aria-pressed', String(st.on));
    const label = btn.querySelector('.d-add-l');
    if (label) label.textContent = st.label;
  }
}

// Şubeyi aktif programa ekler ya da (zaten varsa) çıkarır. Panel düğmesi ve
// Dersler listesindeki satır düğmesi aynı yolu kullanır; dönen değer: şube
// artık programda mı. Ekleme sonrası PROGRAMS_CHANGED yayılır ki açık olan
// diğer düğmeler (liste satırı ↔ panel) durumunu tazelesin.
export async function toggleSectionProgram(term, branch, crn) {
  const id = String(crn);
  if (inActiveProgram(term, branch, id)) {
    removeFromActiveProgram(term, branch, id);
    toast(t('cdRemovedFromProgram', { crn: id }), { kind: 'warn' });
    return false;
  }
  const program = await import('../views/program.js?v=dde1e9339338');
  await program.onShow();
  await program.addProgramItems({ term, items: [{ branch, crn: id }] });
  window.dispatchEvent(new CustomEvent(PROGRAMS_CHANGED));
  return inActiveProgram(term, branch, id);
}

async function toggleProgram(btn, content) {
  if (!current) return;
  const { term, branch } = current;
  btn.disabled = true;
  try {
    await toggleSectionProgram(term, branch, btn.dataset.addCrn);
  } finally {
    btn.disabled = false;
    syncAddButtons(content);
  }
}

// code: "BLG 101E"; term varsayılanı Dersler'deki aktif dönem (state.termSlug).
// crn yalnızca odak bilgisidir; panel koddaki tüm şubeleri gösterir.
//
// keepFocus: odağı panele taşıma (Dersler'de j/k ile panel açıkken satırlar
// arasında gezinilir, odak listede kalır). returnFocus: panel kapanınca
// odağın döneceği öğe (varsayılan: paneli açan öğe).
export async function openCourseDetail(code, { term, crn, source, keepFocus = false, returnFocus = null } = {}) {
  const tm = term || state.termSlug;
  initCourseDetail();
  await loadStyle('detail');
  const panel = panelEl();
  const content = $('#detail-content');
  const wasOpen = isOpen();
  const opener = document.activeElement;
  const focusInPanel = Boolean(opener && panel.contains(opener));
  if (!wasOpen || (isDocked() && opener && !panel.contains(opener))) {
    lastDetailFocus = opener && opener !== document.body && !panel.contains(opener) ? opener : lastDetailFocus;
  }
  if (returnFocus) lastDetailFocus = returnFocus;
  placePanel(wantsDock());
  panel.hidden = false;

  // Paylaşılabilir detay bağlantısı: #ders/<slug>. Kapatınca dönülecek görünümü
  // hatırla; bağlantıdan doğrudan açılıyorsa kapatınca Dersler'e dön.
  // pushState: tarayıcı GERİ düğmesi paneli kapatır. Panel açıkken başka bir
  // derse geçmek aynı geçmiş girişini değiştirir (geri tuşu yine paneli kapatır).
  const slug = codeToSlug(code);
  if (!location.hash.startsWith('#ders/')) {
    lastDetailHash = location.hash || '#dersler';
    history.pushState(null, '', '#ders/' + slug);
  } else if (location.hash !== '#ders/' + slug) {
    if (!wasOpen) lastDetailHash = null;
    history.replaceState(null, '', location.pathname + location.search + '#ders/' + slug);
  } else if (!wasOpen) {
    lastDetailHash = null;
  }

  // Aynı dersin başka şubesi: veriyi yeniden yüklemeden odağı taşı.
  if (wasOpen && current && current.code === code && current.term === tm && content.querySelector('.d-ph')) {
    current.crn = crn ? String(crn) : '';
    focusSection(current.crn);
    notify(true);
    return;
  }

  const seq = ++openSeq;
  current = { code, term: tm, crn: crn ? String(crn) : '', branch: String(code).split(' ')[0], secs: [], source };
  content.innerHTML = loadingHtml(code);
  panel.scrollTop = 0;
  if (!keepFocus || focusInPanel) $('#detail-close')?.focus({ preventScroll: true });
  notify(true);

  const branch = current.branch;
  const [list, hist, cat, gr, buildings] = await Promise.all([
    getJSON(`data/terms/${tm}/branches/${branch}.json`).catch(() => []),
    getJSON(`data/history/courses/${branch}.json`).then((all) => all[code] || null).catch(() => null),
    getJSON(`data/catalog/${branch}.json`).then((all) => all[code] || null).catch(() => null),
    getJSON(`data/grades/${branch}.json`).then((all) => (Array.isArray(all) ? all.filter((g) => g.code === code) : [])).catch(() => []),
    loadBuildings(),
  ]);
  if (seq !== openSeq || !isOpen()) return; // bu arada başka ders açıldı ya da kapandı
  // branches/*.json günlük/haftalık taramadan gelir; saatlik kontenjan ölçümü
  // (state.quota) varsa kapasite/yazılan onunla güncellenir.
  const secs = (Array.isArray(list) ? list.filter((s) => s.code === code) : []).map((s) => {
    const live = quotaRec(tm, s.crn);
    return live ? { ...s, capacity: live.capacity, enrolled: live.enrolled } : s;
  });
  current.secs = secs;
  const programs = [...new Set(secs.flatMap((s) => s.programs || []))];
  const name = secs[0]?.name || cat?.name || hist?.name || code;
  const method = secs[0]?.method || '';
  const special = /\bek\s*sınav\b|additional\s+exam/i.test(method) ? 'extra-exam'
    : /\b(bitirme|graduation\s+(?:project|study|design|thesis)|capstone)\b/i.test(name || '') ? 'graduation' : '';
  const hadFocus = panel.contains(document.activeElement);
  content.innerHTML = headHtml({ code, name, cat, secs, obsLink: obsDeepLink(code), special })
    + sectionsHtml({ term: tm, secs, branch, crn: current.crn, buildings })
    + aboutHtml({ code, cat, gr, programs, secs })
    + histHtml(hist, tm);
  if (hadFocus) $('#detail-close')?.focus({ preventScroll: true });

  wireContent(content, code);
  buildJumpNav(content);
  focusSection(current.crn);
  syncJumpNav();
}

/* ---------- panel içi bölüm gezinmesi ---------- */

// Yapışkan başlığın altında küçük bir atlama çubuğu: Şubeler · Özet · Önşart
// · Notlar · Geçmiş (yalnız içerikte gerçekten olanlar). Panel tek kaydırmalı
// sayfa olarak kalır; düğme ilgili bölüme kaydırır, kaydırdıkça o an okunan
// bölüm işaretlenir. Bağlantı değil düğme: #… adresi paneli kapatırdı.
const JUMPS = [
  { key: 'secs', sel: '.d-blk-secs', label: () => t('cdJumpSections') },
  { key: 'about', sel: '.d-about', label: () => t('cdTabOverview') },
  { key: 'req', sel: '.d-relations', label: () => t('detailPrereq') },
  { key: 'grades', sel: '.d-grades', label: () => t('cdJumpGrades') },
  { key: 'hist', sel: '.d-blk-hist', label: () => t('cdJumpHistory') },
];

function jumpTargets(root) {
  return JUMPS.map((j) => ({ ...j, el: root.querySelector(j.sel) })).filter((j) => j.el);
}

function buildJumpNav(content) {
  const head = content.querySelector('.d-ph');
  const targets = jumpTargets(content);
  if (!head || targets.length < 2) return;
  const nav = document.createElement('nav');
  nav.className = 'd-jump';
  nav.setAttribute('aria-label', t('cdJumpNav'));
  nav.innerHTML = targets.map((j) => `<button type="button" class="d-jump-b" data-jump="${j.key}">${esc(j.label())}</button>`).join('');
  head.appendChild(nav);
}

function headBottom(panel) {
  const head = panel.querySelector('.d-ph');
  return head ? head.getBoundingClientRect().bottom : panel.getBoundingClientRect().top;
}

let jumpPinned = null; // son tıklanan bölüm: sayfa sonundaki kısa bölüm de işaretli kalsın
let jumpRaf = 0;

function jumpTo(key) {
  const panel = panelEl();
  const target = jumpTargets(panel).find((j) => j.key === key);
  if (!target) return;
  // Kapalı <details> bölümü (not dağılımı) açılır.
  if (target.el.tagName === 'DETAILS') target.el.open = true;
  const delta = target.el.getBoundingClientRect().top - headBottom(panel);
  panel.scrollTop = Math.max(0, panel.scrollTop + delta - 6);
  jumpPinned = key;
  syncJumpNav();
}

function syncJumpNav() {
  const panel = panelEl();
  const nav = panel?.querySelector('.d-jump');
  if (!nav) return;
  const targets = jumpTargets(panel);
  const line = headBottom(panel) + 12;
  let active = targets[0]?.key;
  for (const j of targets) if (j.el.getBoundingClientRect().top <= line) active = j.key;
  const atEnd = panel.scrollTop > 0 && panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
  if (atEnd) active = jumpPinned && targets.some((j) => j.key === jumpPinned) ? jumpPinned : targets[targets.length - 1]?.key;
  for (const b of nav.querySelectorAll('[data-jump]')) {
    const on = b.dataset.jump === active;
    b.classList.toggle('is-on', on);
    if (on) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
  }
}

function wireContent(content, code) {
  wireHistButtons(content);
  wireProgButtons(content);
  wireProgramSearch(content);
  wireEqButtons(content);
  wireTrendChart(content);
  const desc = content.querySelector('.d-desc');
  const more = content.querySelector('.d-desc-more');
  if (desc && more) {
    requestAnimationFrame(() => { more.hidden = desc.scrollHeight <= desc.clientHeight + 1; });
    more.addEventListener('click', () => {
      const open = !desc.classList.contains('is-open');
      desc.classList.toggle('is-open', open);
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? t('cdShowLess') : t('cdShowAll');
    });
  }
  const histToggle = content.querySelector('.d-hist-toggle');
  if (histToggle) {
    histToggle.addEventListener('click', () => {
      const open = histToggle.getAttribute('aria-expanded') !== 'true';
      for (const row of content.querySelectorAll('[data-hist-extra]')) row.hidden = !open;
      histToggle.setAttribute('aria-expanded', String(open));
      histToggle.textContent = open ? histToggle.dataset.less : histToggle.dataset.more;
    });
  }
  const reqFwd = content.querySelector('.d-req-fwd');
  if (reqFwd) loadPrereqWhenVisible(reqFwd, () => loadPrereqTree(reqFwd, code));
  const reqBy = content.querySelector('.d-req-by');
  if (reqBy) loadPrereqWhenVisible(reqBy, () => loadReqBy(reqBy));
  enrichProgLabels(content);
}

// Ters-önşart bölümünü doldurur: reverse.json'dan "bu dersi önşart isteyenler".
async function loadReqBy(sec) {
  const code = sec.dataset.code;
  const reverse = await getJSON('data/prereq/reverse.json').catch(() => null);
  const count = sec.closest('.d-relation-more')?.querySelector('[data-req-count]');
  if (!reverse || !reverse[code]) {
    if (count) count.textContent = '0';
    sec.innerHTML = `<p class="empty">${esc(t('cdNoReverseReq'))}</p>`;
    return;
  }
  const reqs = reverse[code];
  if (count) count.textContent = String(reqs.length);
  sec.innerHTML = `<div class="d-req-list">${reqs.map((r) => `<button type="button" class="d-req" data-code="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
  sec.querySelectorAll('.d-req').forEach((b) => b.addEventListener('click', () => {
    openCourseDetail(b.dataset.code, { source: 'reverse' });
  }));
}

// programs.json'dan kod → okunur ad. Kod resmî listede yoksa "kapanmış" soluk;
// kullanıcının beyan ettiği programı varsa işaretle (Faz D, G8).
async function enrichProgLabels(content) {
  try {
    const [m, taken] = await Promise.all([loadProgramMap(), Promise.resolve(getTaken())]);
    for (const b of content.querySelectorAll('.d-prog[data-program]')) {
      const code = b.dataset.program;
      const p = m.get(code);
      if (p) {
        b.textContent = `${code} · ${p.name}`;
      } else {
        b.classList.add('d-prog-stale');
        b.title = t('cdProgStaleTitle');
      }
      if (taken.program && code === taken.program) {
        b.classList.add('d-prog-mine');
        b.title = t('cdProgMineTitle');
      }
    }
  } catch { /* liste yoksa sessiz — yalnız kodlar görünür */ }
}

// Faz D: "aldığım dersler" değişince açık paneldeki önşart + program etiketleri
// tazelenir (kullanıcı kaydettikten sonra paneli yeniden açmasına gerek kalmaz).
if (typeof window !== 'undefined') {
  window.addEventListener(TAKEN_CHANGED, () => {
    const content = $('#detail-content');
    if (!content || !isOpen()) return;
    const reqFwd = content.querySelector('.d-req-fwd');
    const code = reqFwd?.dataset.code;
    if (reqFwd && code) loadPrereqTree(reqFwd, code);
    enrichProgLabels(content);
  });
}

// graph.json (1,9MB) + reverse.json (288KB) YALNIZCA önşart bölümü görünüme
// girince yüklenir — her detay açılışında ağa gidilmez (mobil veri maliyeti).
function loadPrereqWhenVisible(section, loader) {
  if (!section || !('IntersectionObserver' in window)) { loader(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      loader();
    }
  }, { rootMargin: '240px' });
  io.observe(section);
}
let reqGraphCache = null;
async function loadReqGraph() {
  if (reqGraphCache === null) {
    reqGraphCache = await getJSON('data/prereq/graph.json').catch(() => null);
  }
  return reqGraphCache;
}
async function loadPrereqTree(box, code) {
  try {
    const g = await loadReqGraph();
    const node = (g?.nodes || []).find((n) => n.code === code);
    const req = node?.requirement;
    if (!req) {
      box.innerHTML = `<p class="empty">${t('cdNoPrereqRegistered')}</p>`;
      return;
    }
    box.innerHTML = `<ul class="req-tree">${renderReqTree(parseReq(req))}</ul>`;
  } catch { /* graph yoksa sessiz */ }
}

// Alabilen program çiplerine tıklayınca dersler sekmesinde o programa göre filtrele.
function wireProgButtons(content) {
  content.querySelectorAll('.d-prog[data-program]').forEach((b) => b.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: { program: b.dataset.program } }));
    closeCourseDetail();
  }));
}

function wireProgramSearch(content) {
  const input = content.querySelector('.d-prog-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLocaleLowerCase(I18N.lang === 'en' ? 'en' : 'tr');
    let shown = 0;
    for (const button of content.querySelectorAll('.d-prog[data-program]')) {
      const visible = !q || button.textContent.toLocaleLowerCase(I18N.lang === 'en' ? 'en' : 'tr').includes(q);
      button.hidden = !visible;
      if (visible) shown++;
    }
    const empty = content.querySelector('.d-prog-empty');
    if (empty) empty.hidden = shown !== 0;
  });
}

// Denklik çipine tıklayınca o dersin ortak detayı açılır.
function wireEqButtons(content) {
  content.querySelectorAll('.d-eq[data-eq]').forEach((b) => b.addEventListener('click', () => {
    openCourseDetail(b.dataset.eq, { source: 'katalog' });
  }));
}

// Trend grafiği etkileşimi: caption sabit satır (hover/focus ile güncellenir)
// + "hepsini göster" (8 dönem → tümü).
function wireTrendChart(content) {
  const chart = content.querySelector('.trend');
  if (!chart) return;
  const caption = chart.querySelector('.t-caption');
  const bars = [...chart.querySelectorAll('.t-bar')];
  const last = bars[bars.length - 1];
  const setCap = (bar) => { if (caption && bar) caption.textContent = bar.dataset.caption || ''; };
  if (caption && last) caption.textContent = last.dataset.caption || '';
  for (const b of bars) {
    b.addEventListener('mouseenter', () => setCap(b));
    b.addEventListener('focus', () => setCap(b));
    b.addEventListener('mouseleave', () => setCap(last));
    b.addEventListener('blur', () => setCap(last));
  }
  const more = chart.querySelector('.t-more');
  if (more) {
    more.addEventListener('click', () => {
      const parent = chart.parentElement;
      chart.outerHTML = trendChart(lastHistTerms || new Map(), 0); // limit 0 = hepsi
      if (parent) wireTrendChart(parent);
    });
  }
}

function wireHistButtons(content) {
  content.querySelectorAll('.d-instr-history').forEach((b) => b.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('itu:goto-history', { detail: b.dataset.name }));
    closeCourseDetail();
  }));
}

export function closeCourseDetail({ restoreFocus = true } = {}) {
  const panel = panelEl();
  if (!panel) return;
  const wasDocked = isDocked();
  openSeq++;
  $('#detail-content')?.replaceChildren();
  panel.hidden = true;
  const scrim = $('#detail-scrim');
  if (scrim) scrim.hidden = true;
  $('#course-work')?.classList.remove('has-detail');
  document.body.classList.remove('modal-open');
  current = null;
  notify(false);
  // Detay bağlantısından gelindiyse kapatınca açıldığı görünüme dön.
  if (location.hash.startsWith('#ders/')) {
    history.replaceState(null, '', location.pathname + location.search + (lastDetailHash || '#dersler'));
  }
  lastDetailHash = null;
  if (restoreFocus && lastDetailFocus && lastDetailFocus.isConnected && typeof lastDetailFocus.focus === 'function') {
    lastDetailFocus.focus({ preventScroll: wasDocked });
  }
  lastDetailFocus = null;
}

// Çekmece kipinde Tab döngüsü (aria-modal için odak tuzağı). Liste yanındaki
// sütun kipinde panel modal değildir; odak serbestçe listeye döner.
function trapDetailFocus(e) {
  if (e.key !== 'Tab' || !isOpen() || isDocked()) return;
  const panel = panelEl();
  const focusables = [...panel.querySelectorAll('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && el.getClientRects().length);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (!panel.contains(active) || active === first)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (!panel.contains(active) || active === last)) {
    e.preventDefault();
    first.focus();
  }
}

// Kapama ve klavye bağlarını kurar; birden çok çağrı güvenlidir. Dış
// kaynaklardan (havuz, önşart, sınavlar) gelen itu:course-detail istekleri
// core/detail-loader.js'te karşılanır — modül yüklenmeden de çalışsın diye.
let detailInited = false;
export function initCourseDetail() {
  if (detailInited) return;
  detailInited = true;
  const panel = panelEl();
  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-d-close]')) { closeCourseDetail(); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { jumpTo(jump.dataset.jump); return; }
    const copy = e.target.closest('[data-copy-crn]');
    if (copy) { copyCrn(copy.dataset.copyCrn); return; }
    const add = e.target.closest('[data-add-crn]');
    if (add) { toggleProgram(add, $('#detail-content')); return; }
    // Şube satırına tıklamak (bağlantı/düğme dışında) o şubeyi seçili yapar.
    const row = e.target.closest('.d-row[data-crn]');
    if (row && current && !e.target.closest('a, button, summary, details')) {
      current.crn = row.dataset.crn;
      focusSection(current.crn, { scroll: false });
      notify(true);
    }
  });
  $('#detail-scrim')?.addEventListener('click', () => closeCourseDetail());
  panel.addEventListener('scroll', () => {
    if (jumpRaf) return;
    jumpRaf = requestAnimationFrame(() => { jumpRaf = 0; syncJumpNav(); });
  }, { passive: true });
  // Kullanıcı kendisi kaydırınca tıklanan bölümün sabitlemesi kalkar.
  for (const type of ['wheel', 'touchmove']) {
    panel.addEventListener(type, () => { jumpPinned = null; }, { passive: true });
  }
  // Liste satırındaki "+ Programa ekle" panelin düğmelerini de tazeler.
  window.addEventListener(PROGRAMS_CHANGED, () => { if (isOpen()) syncAddButtons($('#detail-content')); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !isOpen() || e.defaultPrevented) return;
    // Sütun kipinde liste tarafındaki bir alanın kendi Escape'i (arama temizleme,
    // filtre sayfası) paneli kapatmaz.
    if (isDocked() && !panel.contains(e.target) && e.target.closest?.('input, select, textarea, #filters')) return;
    closeCourseDetail();
  });
  document.addEventListener('keydown', trapDetailFocus);
  // Geri tuşu: hash #ders/ dışına dönünce panel kapanır (pushState ile).
  window.addEventListener('hashchange', () => {
    if (isOpen() && !location.hash.startsWith('#ders/')) closeCourseDetail({ restoreFocus: false });
  });
  // Sütun kipindeyken başka sekmeye geçilirse panel kapanır (liste görünmez).
  new MutationObserver(() => {
    if (isOpen() && isDocked() && !isViewVisible('dersler')) closeCourseDetail({ restoreFocus: false });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-active-view'] });
  // Pencere daralıp genişleyince kip yeniden seçilir (açık panel korunur).
  window.matchMedia(DOCK_MQ).addEventListener?.('change', () => {
    if (!isOpen()) return;
    placePanel(wantsDock());
  });
}
