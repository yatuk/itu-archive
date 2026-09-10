// Geçmiş görünümü: 27 dönemin birleştirilmiş kaydında ders/hoca arama, ders
// bazlı dönem geçmişi (trend grafiği dahil) ve hoca bazlı ders listesi.
// Arama/keşif çipleri ve ayrıntı kartının kabuğu React'te (history-search.tsx,
// history-detail.tsx) — bu dosya veriyi hazırlar, eşleştirme/gruplama
// mantığını (tek kaynak) taşır ve React'i monte eder.

import { $, getJSON, normSearch, searchMatch, debounce, termLabel, setStatus, isViewVisible } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { fillBar, trendChart } from '../core/chart.js?v=dde1e9339338';
import { initReveal } from '../core/reveal.js?v=dde1e9339338';
import { readLocalState, writeLocalState } from '../core/persistence.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

let inited = false;

let historyModule = null;
let historyModulePromise = null;
function loadHistoryWidget() {
  if (!historyModulePromise) {
    historyModulePromise = import('../react/dersler-table.js').then((mod) => {
      historyModule = mod;
      return mod;
    });
  }
  return historyModulePromise;
}

export function initHistory() {
  if (inited) return;
  const params = new URLSearchParams(location.search);
  const saved = location.hash === '#gecmis' && params.has('hq')
    ? params.get('hq')
    : readLocalState('itu-history-search', { fallback: '', validate: (value) => typeof value === 'string' });
  $('#hq').value = saved;
  $('#hq').addEventListener('input', debounce(searchHistory, 140));
  inited = true;
}

export function onShow() {
  initHistory();
  if (!state.hist) searchHistory();
}

async function loadHistory() {
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
  } catch (e) {
    setStatus($('#hresultline'), `${I18N.t('histLoadError')} (${e.message})`, { error: true });
  }
}

function courseChip(c) {
  return { key: `c|${c[0]}`, kind: 'course', code: c[0], name: c[1], branch: c[2], sub: `${c[3]} ${I18N.t('histUnitTerms')}` };
}
function personChip(n) {
  return { key: `p|${n[0]}|${n[1]}`, kind: 'person', name: n[0], bucket: n[1], sub: `${n[2]} ${I18N.t('histUnitTerms')} · ${n[3]} ${I18N.t('prgSube')}` };
}

function onChipSelect(chip) {
  return chip.kind === 'course' ? showCourse(chip.code, chip.branch) : showPerson(chip.name, chip.bucket);
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
  const box = $('#hmatches');
  historyModule?.unmountHistoryDetail();
  $('#hdetail').innerHTML = '';

  const mod = await loadHistoryWidget();
  const labels = {
    courseSectionLabel: I18N.t('histSectionCourses'),
    instructorSectionLabel: I18N.t('histSectionInstructors'),
  };

  if (q.length < 2) {
    const topCourses = topByCount(state.hist.codes, 3, 6);
    const topPeople = topByCount(state.hist.names, 3, 6);
    const locale = I18N.lang === 'en' ? 'en' : 'tr';
    $('#hresultline').innerHTML =
      `<b>${state.hist.codes.length.toLocaleString(locale)}</b> ${I18N.t('histUnitCourses')} · ` +
      `<b>${state.hist.names.length.toLocaleString(locale)}</b> ${I18N.t('histUnitPeopleIndexed')}`;
    mod.mountHistorySearch(box, {
      mode: 'discovery',
      intro: (topCourses.length || topPeople.length) ? I18N.t('histIntro') : undefined,
      courseSectionLabel: I18N.t('histTopCourses'),
      instructorSectionLabel: I18N.t('histTopInstructors'),
      courses: topCourses.map(courseChip),
      people: topPeople.map(personChip),
      emptyMessage: '',
      onSelect: onChipSelect,
    });
    return;
  }

  const courses = [];
  state.hist.codeHay.forEach((h, i) => { if (courses.length < 40 && searchMatch(q, h)) courses.push(state.hist.codes[i]); });
  const people = [];
  state.hist.nameHay.forEach((h, i) => { if (people.length < 40 && searchMatch(q, h)) people.push(state.hist.names[i]); });

  $('#hresultline').innerHTML = `<b>${courses.length}</b> ${I18N.t('histUnitCourses')}, <b>${people.length}</b> ${I18N.t('histUnitPeopleMatched')}`;

  mod.mountHistorySearch(box, {
    mode: courses.length || people.length ? 'results' : 'empty',
    ...labels,
    courses: courses.map(courseChip),
    people: people.map(personChip),
    emptyMessage: I18N.t('emptyRow'),
    onSelect: onChipSelect,
  });
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

function openCourseDetailFromHistory(code) {
  window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code, source: 'gecmis' } }));
}

async function showCourse(code, branch) {
  const all = await getJSON(`data/history/courses/${branch}.json`);
  const c = all[code];
  if (!c) return;

  // Dönem başına grupla: aynı dönemde birden çok şube olabiliyor.
  const byTerm = new Map();
  for (const [slug, instructor, cap, enr, days] of c.rows) {
    if (!byTerm.has(slug)) byTerm.set(slug, []);
    byTerm.get(slug).push({ instructor, cap, enr, days });
  }

  const seasons = { guz: I18N.t('histSeasonFall'), bahar: I18N.t('histSeasonSpring'), yaz: I18N.t('histSeasonSummer') };
  const openIn = new Set([...byTerm.keys()].map((s) => s.split('-')[2]));
  const rhythm = [...openIn].map((s) => seasons[s] || s).join(', ');

  // Dönem sırası yeniden eskiye; her dönemin ilk satırına dönem adını yaz.
  const rows = [];
  for (const [slug, secs] of byTerm) {
    secs.forEach((r, i) => rows.push({
      key: `${slug}|${i}`,
      termLabel: i === 0 ? termLabel(slug) : '',
      instructor: r.instructor,
      days: r.days,
      cap: r.cap,
      enr: r.enr,
      fillHTML: fillBar(r.cap, r.enr),
    }));
  }

  const openedText = I18N.lang === 'en' ? `Opened in ${byTerm.size} terms` : `${byTerm.size} dönemde açıldı`;
  const mod = await loadHistoryWidget();
  mod.mountHistoryDetail($('#hdetail'), {
    data: {
      kind: 'course',
      code: c.code,
      name: c.name,
      openedText,
      seasonsLabel: I18N.t('histSeasonsLabel'),
      rhythm,
      trendHTML: trendChart(byTerm),
      rows,
    },
    labels: detailLabels(),
    onOpenCourseDetail: openCourseDetailFromHistory,
  });
  initReveal($('#hdetail'));
  $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function showPerson(name, bucket) {
  const all = await getJSON(`data/history/instructors/${bucket}.json`);
  const p = all[name];
  if (!p) return;

  const byCourse = new Map();
  for (const [slug, code, cname] of p.rows) {
    if (!byCourse.has(code)) byCourse.set(code, { name: cname, terms: [] });
    byCourse.get(code).terms.push(slug);
  }
  const sorted = [...byCourse].sort((a, b) => b[1].terms.length - a[1].terms.length);

  const mod = await loadHistoryWidget();
  mod.mountHistoryDetail($('#hdetail'), {
    data: {
      kind: 'person',
      name,
      meta: `${byCourse.size} ${I18N.t('histDistinctCourses')} · ${p.rows.length} ${I18N.t('prgSube')} · ${p.terms} ${I18N.t('histUnitTerms')}`,
      rows: sorted.map(([code, v]) => ({ code, name: v.name, termCount: v.terms.length, terms: v.terms.map(termLabel).join(', ') })),
    },
    labels: detailLabels(),
    onOpenCourseDetail: openCourseDetailFromHistory,
  });
  initReveal($('#hdetail'));
  $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function detailLabels() {
  return {
    detailButton: I18N.t('histDetailButton'),
    colTerm: I18N.t('histColTerm'),
    colInstructor: I18N.t('thInstr'),
    colDay: I18N.t('histColDay'),
    colCap: I18N.t('thCap'),
    colEnr: I18N.t('thEnr'),
    colFill: I18N.t('thFill'),
    colCode: I18N.t('thCode'),
    colName: I18N.t('thName'),
    colTermCount: I18N.t('histColTermCount'),
    colTerms: I18N.t('histColTerms'),
  };
}
