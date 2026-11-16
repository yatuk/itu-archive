// Geçmiş görünümü: dönemlerin birleştirilmiş kaydında ders/hoca arama, ders
// bazlı dönem geçmişi (dönem başına kontenjan/yazılan grafiği + dönem tablosu)
// ve hoca bazlı ders listesi. Altta en çok dönem açılan dersler ile en çok
// şubesi olan öğretim üyeleri durur. Eşleştirme/gruplama mantığı tek kaynak
// olarak burada; görünüm düz DOM ile çizilir.

import { $, getJSON, normSearch, searchMatch, debounce, termLabel, setStatus, isViewVisible, esc } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { readLocalState, writeLocalState } from '../core/persistence.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

let inited = false;
let selectedKey = '';
let lastCourse = null; // hoca kartından "derse dön" için
let codeBranch = null; // ders kodu → branş (history/courses/<branş>.json)
let nameBucket = null; // hoca adı → kova (history/instructors/<kova>.json)

const COURSE_TERM_PAGE = 8;
const PERSON_COURSE_PAGE = 10;

export function initHistory() {
  if (inited) return;
  const params = new URLSearchParams(location.search);
  const saved = location.hash === '#gecmis' && params.has('hq')
    ? params.get('hq')
    : readLocalState('itu-history-search', { fallback: '', validate: (value) => typeof value === 'string' });
  $('#hq').value = saved;
  $('#hq').addEventListener('input', debounce(searchHistory, 140));
  const view = $('#view-gecmis');
  if (view) view.addEventListener('click', onViewClick);
  inited = true;
}

export function onShow() {
  initHistory();
  if (!state.hist) searchHistory();
}

export async function loadHistory() {
  if (state.hist) return;
  try {
    const [codes, names] = await Promise.all([
      getJSON('data/history/codes.json'),
      getJSON('data/history/names.json'),
    ]);
    // Arama metinlerini bir kez katlayıp boşluksuz anahtarlara indiriyoruz
    // (Dersler sekmesiyle ortak normSearch — "BLG 102E" ≡ "BLG102E").
    state.hist = {
      codes, names,
      codeHay: codes.map((c) => normSearch(`${c[0]} ${c[1]}`)),
      nameHay: names.map((n) => normSearch(n[0])),
    };
    codeBranch = new Map(codes.map((c) => [c[0], c[2]]));
    nameBucket = new Map(names.map((n) => [n[0], n[1]]));
  } catch (e) {
    setStatus($('#hresultline'), `${I18N.t('histLoadError')} (${e.message})`, { error: true });
  }
}

// Tek tıklama dinleyicisi: sonuç çipleri, tablo içi hoca/ders bağlantıları,
// "daha fazla" düğmeleri ve alt kartlar data-* öznitelikleriyle yönlenir.
function onViewClick(ev) {
  const el = ev.target.closest('[data-hcourse], [data-hperson], [data-hdetail], [data-hmore], [data-hback]');
  if (!el) return;
  if (el.dataset.hcourse) {
    ev.preventDefault();
    showCourse(el.dataset.hcourse, el.dataset.branch || codeBranch?.get(el.dataset.hcourse), { scroll: true });
  } else if (el.dataset.hperson) {
    ev.preventDefault();
    showPerson(el.dataset.hperson, el.dataset.bucket || nameBucket?.get(el.dataset.hperson), { scroll: true });
  } else if (el.dataset.hdetail) {
    window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: el.dataset.hdetail, source: 'gecmis' } }));
  } else if (el.dataset.hmore) {
    const box = el.closest('.hist-det');
    if (box) for (const row of box.querySelectorAll('[data-hidden-row]')) row.hidden = false;
    el.closest('.hist-morer')?.remove();
  } else if (el.dataset.hback && lastCourse) {
    showCourse(lastCourse.code, lastCourse.branch, { scroll: true });
  }
}

function chipHTML(chip) {
  const pressed = chip.key === selectedKey;
  const data = chip.kind === 'course'
    ? `data-hcourse="${esc(chip.code)}" data-branch="${esc(chip.branch)}"`
    : `data-hperson="${esc(chip.name)}" data-bucket="${esc(chip.bucket)}"`;
  const main = chip.kind === 'course'
    ? `<span class="code" translate="no">${esc(chip.code)}</span> ${esc(chip.name)}`
    : esc(chip.name);
  return `<button type="button" class="hist-hit" aria-pressed="${pressed}" data-key="${esc(chip.key)}" ${data}>${main}<small>${esc(chip.sub)}</small></button>`;
}

function courseChip(c) {
  return { key: `c|${c[0]}`, kind: 'course', code: c[0], name: c[1], branch: c[2], sub: `${c[3]} ${I18N.t('histUnitTerms')}` };
}
function personChip(n) {
  return { key: `p|${n[0]}`, kind: 'person', name: n[0], bucket: n[1], sub: `${n[2]} ${I18N.t('histUnitTerms')} · ${n[3]} ${I18N.t('prgSube')}` };
}

function syncPressed() {
  for (const b of document.querySelectorAll('#hmatches .hist-hit')) {
    b.setAttribute('aria-pressed', String(b.dataset.key === selectedKey));
  }
}

// Alt kartlar (en çok dönem açılan dersler / en çok şubesi olan öğretim
// üyeleri) ve kaynak satırı veriden bir kez hesaplanır.
function renderTopAndFoot() {
  const top = $('#hist-top');
  if (!top || !state.hist) return;
  const locale = I18N.lang === 'en' ? 'en' : 'tr';
  const topCourses = topByCount(state.hist.codes, 3, 6);
  const topPeople = topByCount(state.hist.names, 3, 6);
  $('#hist-top-courses').innerHTML = topCourses.map((c) =>
    `<a href="/#gecmis" data-hcourse="${esc(c[0])}" data-branch="${esc(c[2])}"><span><span class="code" translate="no">${esc(c[0])}</span> <span class="hist-nm">${esc(c[1])}</span></span><small class="num">${esc(`${c[3]} ${I18N.t('histUnitTerms')}`)}</small></a>`).join('');
  $('#hist-top-people').innerHTML = topPeople.map((n) =>
    `<a href="/#gecmis" data-hperson="${esc(n[0])}" data-bucket="${esc(n[1])}"><span class="hist-nm">${esc(n[0])}</span><small class="num">${esc(`${n[3]} ${I18N.t('prgSube')} · ${n[2]} ${I18N.t('histUnitTerms')}`)}</small></a>`).join('');
  top.hidden = !(topCourses.length || topPeople.length);
  const foot = $('#hist-foot');
  if (foot) {
    const missing = (state.index?.terms || []).filter((t) => t.missing).map((t) => t.label.replace(/\s+Dönemi$/i, ''));
    const parts = [I18N.t('histFootSource', {
      courses: state.hist.codes.length.toLocaleString(locale),
      people: state.hist.names.length.toLocaleString(locale),
    })];
    if (missing.length) parts.push(I18N.t('histFootMissing', { terms: missing.join(', ') }));
    foot.textContent = parts.join(' · ');
  }
}

// Geçmiş sekmesine dışarıdan (örn. detay panelinden) arama yaptırmak için dışa açık.
export async function searchHistory() {
  await loadHistory();
  if (!state.hist) return;
  const q = normSearch($('#hq').value.trim());
  writeLocalState('itu-history-search', $('#hq').value.trim(), { validate: (value) => typeof value === 'string' });
  // Yaşanmış hata (courses.js/exams.js'te bulunan aynı sınıf): loadHistory()
  // asenkron — kullanıcı ilk açılışta veri gelmeden başka sekmeye geçerse geç
  // gelen yanıt URL'i (hash dahil) #gecmis'e geri yazabiliyordu.
  if (isViewVisible('gecmis')) {
    const params = new URLSearchParams();
    if ($('#hq').value.trim()) params.set('hq', $('#hq').value.trim());
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}#gecmis`);
  }
  renderTopAndFoot();
  const box = $('#hmatches');
  $('#hdetail').innerHTML = '';
  selectedKey = '';

  if (q.length < 2) {
    const locale = I18N.lang === 'en' ? 'en' : 'tr';
    $('#hresultline').innerHTML =
      `<b>${state.hist.codes.length.toLocaleString(locale)}</b> ${I18N.t('histUnitCourses')} · ` +
      `<b>${state.hist.names.length.toLocaleString(locale)}</b> ${I18N.t('histUnitPeopleIndexed')} · ${esc(I18N.t('histIntroShort'))}`;
    box.innerHTML = '';
    return;
  }

  const courses = [];
  state.hist.codeHay.forEach((h, i) => { if (courses.length < 40 && searchMatch(q, h)) courses.push(state.hist.codes[i]); });
  const people = [];
  state.hist.nameHay.forEach((h, i) => { if (people.length < 40 && searchMatch(q, h)) people.push(state.hist.names[i]); });

  $('#hresultline').innerHTML = `<b>${courses.length}</b> ${I18N.t('histUnitCourses')}, <b>${people.length}</b> ${I18N.t('histUnitPeopleMatched')}`;
  if (!courses.length && !people.length) {
    box.innerHTML = `<p class="hist-empty">${esc(I18N.t('emptyRow'))}</p>`;
    return;
  }
  box.innerHTML = [...courses.map(courseChip), ...people.map(personChip)].map(chipHTML).join('');
  // Tek eşleşme varsa ayrıntı doğrudan açılır (kaydırmadan).
  if (courses.length + people.length === 1) {
    if (courses.length) showCourse(courses[0][0], courses[0][2], { scroll: false });
    else showPerson(people[0][0], people[0][1], { scroll: false });
  }
}

// Bir diziyi sayısal alana göre azalan sırayla sıralayıp ilk n öğeyi döner.
// Eşitlikte ad alfabetik (deterministik — her taramada aynı sıra, diff gürültüsü
// olmaz). Saf — test edilebilir.
export function topByCount(arr, countIdx, n) {
  return arr.slice().sort((a, b) => {
    const d = (b[countIdx] || 0) - (a[countIdx] || 0);
    return d !== 0 ? d : String(a[0]).localeCompare(String(b[0]), 'tr');
  }).slice(0, n);
}

// Çeviri şablonundaki {ad} yer tutucularına hazır HTML parçası yerleştirir;
// şablonun kendisi kaçışlanır.
function tHTML(key, html) {
  return I18N.t(key).split(/(\{\w+\})/).map((part) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return m && m[1] in html ? html[m[1]] : esc(part);
  }).join('');
}

const SEASON_ORDER = { guz: 0, bahar: 1, yaz: 2 };
function termSortKey(slug) {
  const [y1, , season] = String(slug).split('-');
  return Number(y1) * 10 + (SEASON_ORDER[season] ?? 0);
}

function seasonName(season) {
  return { guz: I18N.t('histSeasonFall'), bahar: I18N.t('histSeasonSpring'), yaz: I18N.t('histSeasonSummer') }[season] || season;
}

function termName(slug) {
  const [y1, y2, season] = String(slug).split('-');
  return `${y1}-${y2} ${seasonName(season)}`;
}

// Saf · test edilebilir: ders geçmişi satırlarını ([slug, hoca, kont, yazılan,
// günler]) dönem başına toplar; dönemler yeniden eskiye sıralı döner.
export function summarizeCourseTerms(rows) {
  const byTerm = new Map();
  for (const [slug, instructor, cap, enr, days] of rows || []) {
    if (!byTerm.has(slug)) byTerm.set(slug, { slug, cap: 0, enr: 0, sections: [] });
    const t = byTerm.get(slug);
    t.cap += Number(cap) || 0;
    t.enr += Number(enr) || 0;
    t.sections.push({ instructor: instructor || '', cap: Number(cap) || 0, enr: Number(enr) || 0, days: days || '' });
  }
  return [...byTerm.values()].sort((a, b) => termSortKey(b.slug) - termSortKey(a.slug));
}

function instructorLinks(text) {
  const names = String(text || '').split(/\s*,\s*/).filter((n) => n && !/^[-·.\s]+$/.test(n));
  if (!names.length) return `<span class="hist-dim">${esc(I18N.t('histNoInstructor'))}</span>`;
  return names.map((n) => (nameBucket?.has(n)
    ? `<a href="/#gecmis" data-hperson="${esc(n)}" data-bucket="${esc(nameBucket.get(n))}">${esc(n)}</a>`
    : esc(n))).join(', ');
}

function chartHTML(terms) {
  const chrono = terms.slice().reverse();
  const max = Math.max(1, ...chrono.map((t) => Math.max(t.cap, t.enr)));
  const H = 176;
  const bars = chrono.map((t) => {
    const ch = Math.round(t.cap / max * H);
    const eh = t.enr ? Math.max(2, Math.round(t.enr / max * H)) : 0;
    const yaz = t.slug.endsWith('-yaz');
    const title = I18N.t('histChartBarTitle', { term: termName(t.slug), enr: t.enr, cap: t.cap });
    return `<div class="hist-cc" title="${esc(title)}"><div class="hist-cap" style="height:${ch}px"></div>` +
      `<div class="hist-enr${yaz ? ' yaz' : ''}" style="height:${eh}px"></div>` +
      `<span class="hist-cv num" style="bottom:${Math.max(ch, eh)}px">${t.cap ? t.enr : esc(I18N.t('termBadgeNoData'))}</span></div>`;
  }).join('');
  const labels = chrono.map((t) => {
    const [y1, y2, season] = t.slug.split('-');
    return `<span>${esc(`${y1.slice(2)}-${y2.slice(2)}`)}<br>${esc(seasonName(season))}</span>`;
  }).join('');
  const aria = chrono.map((t) => `${termName(t.slug)} ${t.enr} / ${t.cap}`).join('; ');
  const cols = `grid-template-columns:repeat(${chrono.length},minmax(0,1fr))`;
  const minW = `min-width:${Math.max(320, chrono.length * 44)}px`;
  return `<div class="hist-chart"><div class="hist-chart-in" style="${minW}">` +
    `<div class="tx-k">${esc(I18N.t('histChartTitle'))}</div>` +
    `<div class="hist-ch" role="img" aria-label="${esc(aria)}" style="${cols}">${bars}</div>` +
    `<div class="hist-cl num" aria-hidden="true" style="${cols}">${labels}</div>` +
    `<div class="hist-lgd"><span><i class="hist-sw cap"></i>${esc(I18N.t('histLegendCap'))}</span>` +
    `<span><i class="hist-sw enr"></i>${esc(I18N.t('histLegendEnr'))}</span>` +
    `<span><i class="hist-sw yaz"></i>${esc(I18N.t('histLegendEnrSummer'))}</span>` +
    `<span class="num">${esc(I18N.t('histLegendValue'))}</span></div>` +
    `</div></div>`;
}

async function showCourse(code, branch, { scroll = false } = {}) {
  if (!branch) return;
  let all;
  try {
    all = await getJSON(`data/history/courses/${branch}.json`);
  } catch (e) {
    setStatus($('#hresultline'), `${I18N.t('histLoadError')} (${e.message})`, { error: true });
    return;
  }
  const c = all[code];
  if (!c) return;
  lastCourse = { code, branch };
  selectedKey = `c|${code}`;
  syncPressed();

  const terms = summarizeCourseTerms(c.rows);
  const seasonCounts = new Map();
  for (const t of terms) {
    const s = t.slug.split('-')[2];
    seasonCounts.set(s, (seasonCounts.get(s) || 0) + 1);
  }
  const seasons = [...seasonCounts].sort((a, b) => b[1] - a[1])
    .map(([s, n]) => `<b>${esc(seasonName(s))}</b> <span class="num">(${n})</span>`).join(', ');
  const latest = terms[0] ? termName(terms[0].slug) : '';

  const rows = [];
  terms.forEach((t, ti) => {
    t.sections.forEach((s, si) => {
      const hidden = ti >= COURSE_TERM_PAGE ? ' data-hidden-row hidden' : '';
      const ghost = s.cap === 0 && s.enr === 0;
      const full = s.cap > 0 && s.enr >= s.cap;
      const q = ghost
        ? esc(I18N.t('histNoEnrollment'))
        : `${s.enr} / ${s.cap}${full ? ` · <span class="hist-full">${esc(I18N.t('histFull'))}</span>` : ''}`;
      rows.push(`<div class="hist-tr${ghost ? ' ghost' : ''}" role="row"${hidden}>` +
        `<span class="hist-tm" role="cell">${si === 0 ? esc(termName(t.slug)) : `<span class="sr-only">${esc(termName(t.slug))}</span>`}</span>` +
        `<span role="cell">${instructorLinks(s.instructor)}</span>` +
        `<span class="hist-dy" role="cell">${esc(s.days || '·')}</span>` +
        `<span class="hist-q num" role="cell">${q}</span></div>`);
    });
  });
  const moreTerms = Math.max(0, terms.length - COURSE_TERM_PAGE);
  const more = moreTerms
    ? `<div class="hist-morer"><button type="button" class="tx-btn" data-hmore="1">${esc(I18N.t('histMoreTerms', { n: moreTerms }))}</button></div>`
    : '';

  $('#hdetail').innerHTML = `<section class="tx-card hist-det" aria-labelledby="hist-det-title">` +
    `<div class="hist-dhd"><div><span class="tx-k">${esc(I18N.t('histKindCourse'))}</span>` +
    `<h3 id="hist-det-title"><span class="code" translate="no">${esc(c.code)}</span> ${esc(c.name)}</h3>` +
    `<div class="hist-facts"><span>${tHTML('histOpenedIn', { n: `<b class="num">${terms.length}</b>` })}</span>` +
    `<span>${esc(I18N.t('histSeasonsLabel'))} ${seasons}</span>` +
    (latest ? `<span>${esc(I18N.t('histLatest'))} <b>${esc(latest)}</b></span>` : '') +
    `</div></div>` +
    `<div class="hist-acts"><button type="button" class="tx-btn" data-hdetail="${esc(c.code)}">${esc(I18N.t('histDetailButton'))}</button></div></div>` +
    chartHTML(terms) +
    `<div class="hist-tbl" role="table" aria-label="${esc(`${c.code} ${I18N.t('histTermHistoryLabel')}`)}">` +
    `<div class="hist-tr th" role="row"><span role="columnheader">${esc(I18N.t('histColTerm'))}</span><span role="columnheader">${esc(I18N.t('thInstr'))}</span><span role="columnheader">${esc(I18N.t('histColDays'))}</span><span role="columnheader" class="hist-q">${esc(I18N.t('histColEnrCap'))}</span></div>` +
    rows.join('') + `</div>${more}</section>`;
  if (scroll) $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Bir hoca adının /hoca/<slug>/ sayfa adresi; internal/site instructorSlug ile
// aynı kural. Dizine alınmayan adlar (TBA, staff…) için boş döner. Saf.
export function instructorSlug(name) {
  const raw = String(name || '').trim();
  const compact = raw.toLowerCase().replace(/[ .\-*]/g, '');
  if (!raw || ['', 'tba', 'staff', 'instructor', 'bilinmiyor', 'belirsiz'].includes(compact)) return '';
  const map = { ü: 'u', ş: 's', ç: 'c', ğ: 'g', ö: 'o', ı: 'i', İ: 'i', Ü: 'u', Ş: 's', Ç: 'c', Ğ: 'g', Ö: 'o', '.': '' };
  // Go'daki sıra: önce ToLower, sonra harf eşleme.
  const s = [...raw.toLowerCase()].map((ch) => (ch in map ? map[ch] : ch)).join('');
  let out = '';
  let lastDash = false;
  for (const ch of s) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) {
      out += ch;
      lastDash = false;
    } else if (!lastDash && out.length) {
      out += '-';
      lastDash = true;
    }
  }
  return out.replace(/^-+|-+$/g, '').slice(0, 80);
}

async function showPerson(name, bucket, { scroll = false } = {}) {
  if (!bucket) return;
  let all;
  try {
    all = await getJSON(`data/history/instructors/${bucket}.json`);
  } catch (e) {
    setStatus($('#hresultline'), `${I18N.t('histLoadError')} (${e.message})`, { error: true });
    return;
  }
  const p = all[name];
  if (!p) return;
  selectedKey = `p|${name}`;
  syncPressed();

  const byCourse = new Map();
  for (const [slug, code, cname] of p.rows) {
    if (!byCourse.has(code)) byCourse.set(code, { name: cname, terms: [] });
    const v = byCourse.get(code);
    if (!v.terms.includes(slug)) v.terms.push(slug);
  }
  const sorted = [...byCourse].sort((a, b) => b[1].terms.length - a[1].terms.length || a[0].localeCompare(b[0], 'tr'));
  const current = state.index?.currentSlug;
  const nowCount = current ? sorted.filter(([, v]) => v.terms.includes(current)).length : 0;
  const shortTerm = (slug) => {
    const [y1, y2, season] = slug.split('-');
    return `${y1.slice(2)}-${y2.slice(2)} ${seasonName(season).charAt(0)}`;
  };
  const rows = sorted.map(([code, v], i) => {
    const hidden = i >= PERSON_COURSE_PAGE ? ' data-hidden-row hidden' : '';
    const branch = codeBranch?.get(code);
    const codeHTML = branch
      ? `<a href="/#gecmis" class="code" translate="no" data-hcourse="${esc(code)}" data-branch="${esc(branch)}">${esc(code)}</a>`
      : `<span class="code" translate="no">${esc(code)}</span>`;
    const ts = v.terms.slice().sort((a, b) => termSortKey(b) - termSortKey(a)).map(shortTerm).join(' · ');
    return `<div class="hist-pc" role="row"${hidden}><span role="cell">${codeHTML}</span><span role="cell">${esc(v.name)}</span>` +
      `<span class="hist-n num" role="cell">${v.terms.length}</span><span class="hist-ts num" role="cell" title="${esc(v.terms.map(termName).join(', '))}">${esc(ts)}</span></div>`;
  });
  const moreCourses = Math.max(0, sorted.length - PERSON_COURSE_PAGE);
  const more = moreCourses
    ? `<div class="hist-morer"><button type="button" class="tx-btn" data-hmore="1">${esc(I18N.t('histMoreCourses', { n: moreCourses }))}</button></div>`
    : '';
  const slug = instructorSlug(name);
  const back = lastCourse
    ? `<button type="button" class="tx-btn" data-hback="1">${esc(I18N.t('histBackTo', { code: lastCourse.code }))}</button>`
    : '';
  const page = slug ? `<a class="tx-btn tx-btn-pri" href="/hoca/${esc(slug)}/">${esc(I18N.t('histInstructorPage'))}</a>` : '';

  $('#hdetail').innerHTML = `<section class="tx-card hist-det" aria-labelledby="hist-det-title">` +
    `<div class="hist-dhd"><div><span class="tx-k">${esc(I18N.t('histKindPerson'))}</span>` +
    `<h3 id="hist-det-title">${esc(name)}</h3>` +
    `<div class="hist-facts"><span><b class="num">${byCourse.size}</b> ${esc(I18N.t('histDistinctCourses'))}</span>` +
    `<span><b class="num">${p.rows.length}</b> ${esc(I18N.t('prgSube'))}</span>` +
    `<span><b class="num">${p.terms}</b> ${esc(I18N.t('histUnitTerms'))}</span>` +
    (nowCount ? `<span>${tHTML('histNowTeaching', { n: `<b class="num">${nowCount}</b>` })}</span>` : '') +
    `</div></div><div class="hist-acts">${page}${back}</div></div>` +
    `<div class="hist-ptbl" role="table" aria-label="${esc(`${name} ${I18N.t('histCourseListLabel')}`)}">` +
    `<div class="hist-pc th" role="row"><span role="columnheader">${esc(I18N.t('histColCode'))}</span><span role="columnheader">${esc(I18N.t('thName'))}</span><span role="columnheader" class="hist-n">${esc(I18N.t('histColTermCount'))}</span><span role="columnheader">${esc(I18N.t('histColTerms'))}</span></div>` +
    rows.join('') + `</div>${more}</section>`;
  if (scroll) $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
