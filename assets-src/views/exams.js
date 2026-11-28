// Sınavlar görünümü: aktif dönemin sınav takvimini ders/bina/tür üzerinden
// arar. Bina filtresi yer alanından çıkarılır (yeni kazıma yok).
//
// Aktif dönemin takvimi henüz ilan edilmediyse üstte bir durum kartı (ilan
// tarihi akademik takvimdeki "Sınav Programının İlanı" etkinliğinden) ve
// altında son ilan edilmiş takvim gösterilir. Sınavlar güne göre gruplanır;
// aynı ders + öğretim üyesi + saat + yer taşıyan şubeler tek satıra birleşir.

import { $, getJSON, esc, fold, looseIncludes, debounce, buildingOf, setStatus, downloadICS, parseTurkishDate, isViewVisible } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { toast } from '../core/toast.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from '../core/persistence.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

let inited = false;
let currentHits = []; // son filtre sonucu — .ics dışa aktarımı için
// Sınav listesi sayfalama: satır (birleşik) sayısı üzerinden "daha fazla" ile artar.
let examsShown = 400;

const TBD_PLACE = 'İlgili Bölümce Açıklanacak';
const realPlace = (p) => Boolean(p) && p !== '-' && p !== TBD_PLACE;

function examPreference() {
  const params = new URLSearchParams(location.search);
  const keys = ['eq', 'etype', 'building', 'ebranch'];
  const explicit = location.hash === '#sinavlar' && keys.some((key) => params.has(key));
  const pref = explicit ? {} : readLocalState('itu-exam-filters', { fallback: {}, validate: isPlainObject });
  const saved = { eq: pref.q, etype: pref.type, building: pref.building, ebranch: pref.branch };
  const value = (key) => params.has(key) ? params.get(key) : (saved[key] || '');
  return { q: value('eq'), type: value('etype'), building: value('building'), branch: value('ebranch') };
}

function saveExamPreference() {
  const data = {
    q: $('#eq').value.trim(), type: $('#f-etype').value,
    building: $('#f-building').value, branch: $('#f-ebranch').value,
  };
  writeLocalState('itu-exam-filters', data, { validate: isPlainObject });
  // Yaşanmış hata (courses.js'te bulunan aynı sınıf): loadExams() asenkron —
  // kullanıcı veri gelmeden başka sekmeye geçerse geç gelen yanıt renderExams()
  // üzerinden buraya düşüp URL'i (hash dahil) #sinavlar'a geri yazabiliyordu.
  if (!isViewVisible('sinavlar')) return;
  const p = new URLSearchParams();
  if (data.q) p.set('eq', data.q);
  if (data.type) p.set('etype', data.type);
  if (data.building) p.set('building', data.building);
  if (data.branch) p.set('ebranch', data.branch);
  history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}#sinavlar`);
}

// Uygulama içi sekme geçişi: sekme bağlantısına tıklamayı taklit eder; sekme
// çubuğu yoksa bağlantı normal gezinmeye düşer.
function goView(view, ev) {
  const tab = document.querySelector(`.tabs [data-view="${view}"]`);
  if (!tab) return;
  ev?.preventDefault();
  tab.click();
}

export function initExams() {
  if (inited) return;
  $('#eq').value = examPreference().q;
  // DOM Event nesnesini `append` bayrağı sanmamak için çağrıyı sar. Aksi halde
  // input/change kaynaklı filtreler URL'ye ve yerel tercihlere hiç yazılmıyordu.
  $('#eq').addEventListener('input', saveExamPreference);
  $('#eq').addEventListener('input', debounce(() => renderExams(true), 120));
  for (const control of [$('#f-etype'), $('#f-building'), $('#f-ebranch')]) {
    control.addEventListener('change', () => {
      saveExamPreference();
      renderExams(true);
    });
  }
  const ics = $('#e-ics');
  if (ics) ics.addEventListener('click', exportExamsICS);
  const emore = $('#emore');
  if (emore) emore.addEventListener('click', () => { examsShown += 200; renderExams(true); });
  const calLink = document.querySelector('#view-sinavlar .xm-cal-link');
  if (calLink) calLink.addEventListener('click', (ev) => goView('takvim', ev));
  const mount = $('#exam-list-mount');
  if (mount) {
    mount.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-exam-code]');
      if (!btn) return;
      window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: btn.dataset.examCode, source: 'sinavlar' } }));
    });
  }
  inited = true;
}

export function onShow() {
  initExams();
  // Hash/query navigasyonu uygulama yüklenirken gerçekleşmiş olsa bile görünüm
  // açıldığında en güncel URL/yerel tercihi forma geri uygula.
  const pref = examPreference();
  $('#eq').value = pref.q;
  $('#f-etype').value = pref.type;
  $('#f-building').value = pref.building;
  $('#f-ebranch').value = pref.branch;
  if (!state.exams && state.index) loadExams();
  else if (state.exams) renderExams(true);
}

function shortTermLabel(label) {
  return String(label || '').replace(/\s+Dönemi$/i, '').trim();
}

function localizedTerm(label, slug) {
  const short = shortTermLabel(label);
  if (I18N.lang !== 'en') return short;
  const m = /^(\d{4}-\d{4})-(guz|bahar|yaz)$/.exec(slug || '');
  if (!m) return short;
  return `${m[1]} ${{ guz: 'Fall', bahar: 'Spring', yaz: 'Summer' }[m[2]]}`;
}

function revision() {
  return encodeURIComponent(state.index.scrapedAt || state.index.currentSlug);
}

async function loadExams() {
  setStatus($('#eresultline'), I18N.t('statLoading'), { busy: true });
  const slug = state.index.currentSlug;
  let current = null;
  let loadError = null;
  try {
    // Silinen bir önceki dönem dosyası CDN'de günlerce 200 dönebilir. Her veri
    // taramasında değişen sorgu, eski cache anahtarını kullanmamamızı sağlar.
    const [sched, termRows] = await Promise.all([
      getJSON(`data/exams/${slug}.json?v=${revision()}`),
      getJSON(`data/terms/${slug}/search.json`),
    ]);
    // OBS'nin sınav servisi dönem parametresi kabul etmiyor ve yeni takvim
    // açıklanana kadar geçen dönemin sınavlarını döndürebiliyor. Dosya yanlış
    // dönem adıyla cache'lenmiş olsa bile CRN örtüşmesi bunu yakalar.
    if (examScheduleMatchesTerm(sched, termRows, slug)) current = sched;
  } catch (e) {
    // Aktif dönemin takvimi henüz yoksa 404 olağan bir boş durumdur. Gerçek ağ
    // ve veri hataları ise tanı koyabilmek için görünür kalır.
    if (!/HTTP 404\b/.test(String(e.message || e))) loadError = e;
  }

  if (current) {
    state.exams = { ...current, published: true };
  } else {
    // Aktif dönem ilan edilmedi: son ilan edilmiş takvimi ve ilan tarihini bul.
    const [fallback, announce] = await Promise.all([findLastPublished(slug), findAnnounceDate(slug)]);
    state.exams = {
      term: state.index.currentTerm,
      slug,
      exams: fallback ? fallback.exams : [],
      published: false,
      fallback: fallback ? { term: fallback.term, slug: fallback.slug, scrapedAt: fallback.scrapedAt } : null,
      announce,
    };
  }
  state.examHay = state.exams.exams.map((e) => fold(`${e.crn} ${e.code} ${e.name} ${e.instructor}`));
  fillExamFilters(state.exams.exams);
  renderExamStatus();
  renderExams();
  if (loadError) setStatus($('#eresultline'), `${I18N.t('examLoadError')} (${loadError.message})`, { error: true });
}

// Aktif dönemden önceki dönemlerin sınav dosyalarını sırayla dener (en fazla
// üç dönem). Dosya adı/slug ve tarih aralığı tutmayan dosya kabul edilmez.
async function findLastPublished(currentSlug) {
  const terms = (state.index.terms || []).filter((t) => !t.missing && t.slug !== currentSlug);
  for (const t of terms.slice(0, 3)) {
    try {
      const sched = await getJSON(`data/exams/${t.slug}.json?v=${revision()}`);
      const exams = Array.isArray(sched?.exams) ? sched.exams : [];
      if (!exams.length || (sched.slug && sched.slug !== t.slug)) continue;
      const dated = exams.filter((e) => examDateMatchesTerm(e?.date, t.slug)).length;
      if (dated / exams.length < 0.80) continue;
      return { term: sched.term || t.label, slug: t.slug, scrapedAt: sched.scrapedAt || '', exams };
    } catch (e) {
      // 404 = o dönemin dosyası yayından kaldırılmış; bir öncekine bak.
    }
  }
  return null;
}

// Akademik takvimden aktif dönemin "Sınav Programının İlanı" tarihini bulur.
async function findAnnounceDate(slug) {
  const m = /^(\d{4}-\d{4})-(guz|bahar|yaz)$/.exec(slug || '');
  if (!m) return null;
  const cal = (state.index.calendars || []).find((c) => String(c.label || '').startsWith(m[1]));
  if (!cal) return null;
  const type = (cal.types || []).includes('lisans') ? 'lisans/' : '';
  let data;
  try {
    data = await getJSON(`data/calendar/${type}${cal.yearId}.json`);
  } catch (e) {
    return null;
  }
  const event = findAnnounceEvent(data?.events, m[2]);
  return event ? { iso: event.start, title: event.title } : null;
}

// Saf · test edilebilir: dönem mevsimine ait "Sınav Programı(nın) İlanı"
// etkinliğini seçer. Mevsim adı başlıkta geçmeli ("Güz Yarıyılı Sınav
// Programının İlanı", "Yazöğretimi Sınav Programı İlanı").
export function findAnnounceEvent(events, season) {
  if (!Array.isArray(events)) return null;
  const seasonRe = { guz: /güz/i, bahar: /bahar/i, yaz: /yaz/i }[season];
  if (!seasonRe) return null;
  return events.find((e) => {
    const title = String(e?.title || '');
    return /s[ıi]nav\s*program/i.test(title) && /[iİ]lan/i.test(title) && seasonRe.test(title) &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(e?.start || ''));
  }) || null;
}

function isoToDate(iso) {
  const [y, mo, d] = String(iso).split('-').map(Number);
  return new Date(y, mo - 1, d);
}

function daysFromToday(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((date - today) / 86400000);
}

function fmtLongDate(date) {
  return date.toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : 'tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderExamStatus() {
  const card = $('#exam-status');
  const sec = $('#exam-sec');
  const ex = state.exams;
  if (!card || !sec || !ex) return;
  const termName = localizedTerm(ex.term, ex.slug);
  card.hidden = ex.published;
  if (!ex.published) {
    $('#exam-status-term').textContent = termName;
    $('#exam-status-title').textContent = I18N.t('exAnnTitle', { term: termName });
    $('#exam-status-body').textContent = I18N.t(ex.fallback ? 'exAnnBody' : 'exAnnBodyNoFallback');
    const when = $('#exam-status-when');
    if (ex.announce) {
      const date = isoToDate(ex.announce.iso);
      const n = daysFromToday(date);
      $('#exam-status-date').textContent = fmtLongDate(date);
      $('#exam-status-rel').textContent = n > 0
        ? I18N.t('relInDays', { n })
        : n === 0 ? I18N.t('relToday') : I18N.t('relDaysAgo', { n: -n });
      when.hidden = false;
    } else {
      when.hidden = true;
    }
  }
  const shown = ex.published ? ex : ex.fallback;
  sec.hidden = !shown;
  if (!shown) return;
  const shownName = localizedTerm(shown.term, shown.slug);
  $('#exam-sec-title').textContent = ex.published
    ? I18N.t('exSecCurrent', { term: shownName })
    : I18N.t('exSecLast', { term: shownName });
  const dates = ex.exams.map((e) => parseTurkishDate(e.date)).filter(Boolean).sort((a, b) => a - b);
  const parts = [];
  if (dates.length) {
    parts.push(I18N.t('exSecRange', { from: fmtLongDate(dates[0]), to: fmtLongDate(dates[dates.length - 1]) }));
  }
  if (shown.scrapedAt) {
    const d = new Date(shown.scrapedAt);
    if (!isNaN(d)) parts.push(I18N.t('exSecScraped', { date: d.toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : 'tr-TR') }));
  }
  $('#exam-sec-note').textContent = parts.join(' · ');
}

function fillExamFilters(exams) {
  const types = [...new Set(exams.map((e) => e.type).filter(Boolean))].sort();
  $('#f-etype').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
    types.map((t) => `<option>${esc(t)}</option>`).join('');
  const buildings = [...new Set(exams.map((e) => buildingOf(e.place)).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'tr'));
  $('#f-building').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
    buildings.map((b) => `<option>${esc(b)}</option>`).join('');
  // Faz B (G9): branş filtresi — e.branch veride vardı, şimdi kullanılıyor.
  const branches = [...new Set(exams.map((e) => e.branch).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'tr'));
  $('#f-ebranch').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
    branches.map((b) => `<option>${esc(b)}</option>`).join('');
  const pref = examPreference();
  if ([...$('#f-etype').options].some((o) => o.value === pref.type)) $('#f-etype').value = pref.type;
  if ([...$('#f-building').options].some((o) => o.value === pref.building)) $('#f-building').value = pref.building;
  if ([...$('#f-ebranch').options].some((o) => o.value === pref.branch)) $('#f-ebranch').value = pref.branch;
}

// Gelen sınav listesinin aktif dönemin şubelerine ait olup olmadığını CRN
// örtüşmesiyle doğrular. Doğru sınav takvimi tüm şubeleri kapsamadığından eşik
// %100 değil; kazıyıcıdaki korumayla aynı %40 sınırı kullanılır.
export function examScheduleMatchesTerm(sched, termRows, termSlug, minOverlap = 0.40) {
  const exams = Array.isArray(sched?.exams) ? sched.exams : [];
  if (!exams.length || !Array.isArray(termRows) || !termRows.length) return false;
  const termSections = new Set(termRows.map((row) => {
    const crn = String(row?.[0] || '').trim();
    const code = String(row?.[1] || '').trim().toUpperCase();
    return crn && code ? `${crn}|${code}` : '';
  }).filter(Boolean));
  const matched = exams.reduce((count, exam) => {
    const key = `${String(exam?.crn || '').trim()}|${String(exam?.code || '').trim().toUpperCase()}`;
    return count + (termSections.has(key) ? 1 : 0);
  }, 0);
  const dated = exams.filter((exam) => examDateMatchesTerm(exam?.date, termSlug)).length;
  return matched / exams.length >= minOverlap && dated / exams.length >= 0.80;
}

// Akademik dönem için makul sınav tarih aralığı. Bu özellikle Güz etiketiyle
// cache'lenmiş Ağustos Yaz finallerini ayırır; tarih sınırları final/mazeret
// haftalarına pay bırakacak kadar geniş tutulur.
export function examDateMatchesTerm(value, termSlug) {
  const match = String(termSlug || '').match(/^(\d{4})-(\d{4})-(guz|bahar|yaz)$/);
  const date = parseTurkishDate(value);
  if (!match || !date) return false;
  const firstYear = Number(match[1]);
  const secondYear = Number(match[2]);
  let start;
  let end;
  if (match[3] === 'guz') {
    start = new Date(firstYear, 8, 1);  // 1 Eylül
    end = new Date(secondYear, 2, 1);  // 1 Mart (hariç)
  } else if (match[3] === 'bahar') {
    start = new Date(secondYear, 1, 1); // 1 Şubat
    end = new Date(secondYear, 7, 1);   // 1 Ağustos (hariç)
  } else {
    start = new Date(secondYear, 5, 1); // 1 Haziran
    end = new Date(secondYear, 9, 1);   // 1 Ekim (hariç)
  }
  return date >= start && date < end;
}

// Saf · test edilebilir: sınavları güne göre gruplar (tarih + saat sırası) ve
// aynı gün/saat/ders/öğretim üyesi/tür/yer taşıyan şubeleri tek satırda
// birleştirir. Her satır birleşen CRN listesini taşır; gün sayacı şube sayar.
export function groupExamsByDay(exams) {
  const timeKey = (t) => String(t || '').replace(/\D/g, '').padEnd(8, '0');
  const sorted = exams.map((e, i) => ({ e, i, d: parseTurkishDate(e.date) })).sort((a, b) => {
    const da = a.d ? a.d.getTime() : Infinity;
    const db = b.d ? b.d.getTime() : Infinity;
    if (da !== db) return da - db;
    const ta = timeKey(a.e.time);
    const tb = timeKey(b.e.time);
    if (ta !== tb) return ta < tb ? -1 : 1;
    const c = String(a.e.code).localeCompare(String(b.e.code), 'tr');
    return c || a.i - b.i;
  });
  const days = [];
  const byDay = new Map();
  const byRow = new Map();
  for (const { e, d } of sorted) {
    const dayKey = String(e.date || '');
    let day = byDay.get(dayKey);
    if (!day) {
      day = { key: dayKey, date: d, dateText: dayKey, dayName: String(e.day || ''), count: 0, rows: [] };
      byDay.set(dayKey, day);
      days.push(day);
    }
    day.count += 1;
    const rowKey = [dayKey, e.time, e.code, e.instructor, e.type, e.place].map((v) => String(v || '')).join('|');
    let row = byRow.get(rowKey);
    if (!row) {
      row = {
        key: rowKey, time: String(e.time || ''), code: String(e.code || ''), name: String(e.name || ''),
        instructor: String(e.instructor || ''), type: String(e.type || ''), place: String(e.place || ''), crns: [],
      };
      byRow.set(rowKey, row);
      day.rows.push(row);
    }
    if (e.crn && !row.crns.includes(String(e.crn))) row.crns.push(String(e.crn));
  }
  return days;
}

// "Ayazağa/İnşaat Binası-B101 Ayazağa/İnşaat Binası-B103" →
// "Ayazağa · İnşaat Binası B101, B103". Saf · test edilebilir.
export function formatExamPlace(place) {
  const p = String(place || '').trim();
  if (!realPlace(p)) return '';
  const sessions = p.split(/(?<=-[^\s-]+)\s+(?=[^\s/]+\/)/);
  const groups = [];
  const byBuilding = new Map();
  for (const s of sessions) {
    const m = s.match(/^(.*)-([^-]+)$/);
    const where = (m ? m[1] : s).trim();
    const room = m ? m[2].trim() : '';
    let g = byBuilding.get(where);
    if (!g) {
      g = { where, rooms: [] };
      byBuilding.set(where, g);
      groups.push(g);
    }
    if (room && !/açıklanacak/i.test(room)) g.rooms.push(room);
  }
  return groups.map((g) => `${g.where.replace(/\//g, ' · ')}${g.rooms.length ? ` ${g.rooms.join(', ')}` : ''}`).join('; ');
}

function dayLabel(day) {
  if (I18N.lang === 'en' && day.date) {
    return day.date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
  return [day.dayName, day.dateText].filter(Boolean).join(' · ');
}

function crnText(crns) {
  if (crns.length > 2) return `${crns[0]} +${crns.length - 1}`;
  return crns.join(', ');
}

function renderExams(append) {
  // Filtre tercihi veri isteğinden bağımsız kaydedilir. Kullanıcı sınav verisi
  // yüklenmeden yazıp başka sekmeye geçerse de arama kaybolmamalı.
  if (!append) saveExamPreference();
  if (!state.exams) return;
  if (!append) examsShown = 400;
  const q = fold($('#eq').value.trim());
  const type = $('#f-etype').value;
  const bld = $('#f-building').value;
  const ebranch = $('#f-ebranch').value;
  const terms = q ? q.split(/\s+/) : [];

  const all = state.exams.exams;
  const hits = all.filter((e, i) => {
    if (type && e.type !== type) return false;
    if (bld && buildingOf(e.place) !== bld) return false;
    if (ebranch && e.branch !== ebranch) return false;
    // Terimler ayrı ayrı; tümü tutmazsa boşluksuz yazım ("cen411") denenir.
    return terms.every((t) => state.examHay[i].includes(t)) || looseIncludes(state.examHay[i], q);
  });
  currentHits = hits; // .ics dışa aktarımı için
  const days = groupExamsByDay(hits);
  const rowCount = days.reduce((n, d) => n + d.rows.length, 0);

  const locale = I18N.lang === 'en' ? 'en' : 'tr';
  let resultLine;
  if (!all.length) {
    resultLine = esc(I18N.t('examNoScheduleYet'));
  } else {
    resultLine = `<b>${hits.length.toLocaleString(locale)}</b> / ${all.length.toLocaleString(locale)} ${esc(I18N.t('examCountUnit'))}`;
    if (rowCount && rowCount < hits.length) resultLine += ` · ${esc(I18N.t('exMergedNote', { n: rowCount.toLocaleString(locale) }))}`;
  }
  $('#eresultline').innerHTML = resultLine;
  $('#eresultline').classList.remove('busy', 'error');

  const mount = $('#exam-list-mount');
  if (!mount) return;
  if (!all.length) {
    mount.innerHTML = '';
  } else if (!hits.length) {
    mount.innerHTML = `<p class="empty">${esc(I18N.t('examEmptyRow'))}</p>`;
  } else {
    // Tür yalnızca baskın türden farklıysa (Ek Sınav gibi) satırda belirtilir.
    const typeCounts = new Map();
    for (const e of hits) typeCounts.set(e.type, (typeCounts.get(e.type) || 0) + 1);
    const mainType = [...typeCounts].sort((a, b) => b[1] - a[1])[0]?.[0];
    let budget = examsShown;
    const parts = [`<div class="xm-thd" aria-hidden="true"><span>${esc(I18N.t('examColTime'))}</span><span>${esc(I18N.t('examColCourse'))}</span><span>${esc(I18N.t('examColInstructor'))}</span><span>${esc(I18N.t('examColPlace'))}</span><span>${esc(I18N.t('examColCRN'))}</span></div>`];
    for (const day of days) {
      if (budget <= 0) break;
      const rows = day.rows.slice(0, budget);
      budget -= rows.length;
      const label = dayLabel(day);
      parts.push(`<section class="xm-day" aria-label="${esc(label)}"><div class="xm-dh"><b>${esc(label)}</b><span class="num">${esc(I18N.t('exDayCount', { n: day.count }))}</span></div>`);
      for (const r of rows) {
        const place = formatExamPlace(r.place);
        const placeHTML = place
          ? `<span class="xm-pl" title="${esc(r.place)}">${esc(place)}${/açıklanacak/i.test(r.place) ? ` <span class="tbd">${esc(I18N.t('exPlaceTbd'))}</span>` : ''}</span>`
          : `<span class="xm-pl tbd">${esc(I18N.t('exPlaceTbd'))}</span>`;
        const typeHTML = r.type && r.type !== mainType ? `<small class="xm-type">${esc(r.type)}</small>` : '';
        parts.push(`<div class="xm-row">` +
          `<span class="xm-tm num">${esc(r.time.replace(/\s*-\s*/, '–'))}</span>` +
          `<span class="xm-cn"><button type="button" class="xm-course" data-exam-code="${esc(r.code)}"><span class="code" translate="no">${esc(r.code)}</span> ${esc(r.name)}</button>${typeHTML}</span>` +
          `<span class="xm-ins">${esc(r.instructor || '·')}</span>` +
          placeHTML +
          `<span class="xm-crn crn" translate="no" title="${esc(r.crns.join(', '))}"><span class="sr-only">CRN </span>${esc(crnText(r.crns))}</span>` +
          `</div>`);
      }
      parts.push('</section>');
    }
    mount.innerHTML = parts.join('');
  }
  const emore = $('#emore');
  if (emore) {
    emore.hidden = rowCount <= examsShown;
    emore.textContent = I18N.lang === 'en'
      ? `${I18N.t('more')} (${rowCount - examsShown} remaining)`
      : `${I18N.t('more')} (${rowCount - examsShown} kaldı)`;
  }
}

// Sınav kaydını .ics etkinliğine çevirir: Türkçe tarih + "HH:MM-HH:MM" aralığı →
// ISO zamanlı başlangıç/bitiş. Saf — test edilebilir. Çözümlenemezse null.
export function examToIcs(e) {
  const start = parseTurkishDate(e.date);
  if (!start) return null;
  const m = String(e.time || '').match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const p = (n) => String(n).padStart(2, '0');
  const iso = (h, mi) => `${start.getFullYear()}-${p(start.getMonth() + 1)}-${p(start.getDate())}T${p(h)}:${p(mi)}:00`;
  const place = realPlace(e.place) ? e.place : '';
  const query = examMapsQuery(place);
  return {
    uid: `${e.crn}-${e.code}-${e.date}`,
    title: `${e.code}: ${e.name} (${e.type})`,
    startISO: iso(+m[1], +m[2]),
    endISO: iso(+m[3], +m[4]),
    desc: [e.instructor, place].filter(Boolean).join(' · '),
    location: query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '',
  };
}

// "Ayazağa/İnşaat Binası-B101 Ayazağa/İnşaat Binası-B103" gibi bir sınav
// yerinden Google Maps araması için bina düzeyinde bir sorgu üretir — oda
// numarası haritada aranamaz, o yüzden yalnızca kampüs/bina kısmı kalır
// (birden çok salon varsa ilk oturum yeri esas alınır). Saf — test edilebilir.
export function examMapsQuery(place) {
  const p = String(place || '').trim();
  if (!p) return '';
  // Bina adı kendi içinde boşluk (ve bazen tire: "Fen-Edebiyat") taşıyabildiği
  // için düz boşluk bölmesi yanlış keser — yalnızca "-Oda" sonrası gelen bir
  // boşluğu, ardından yeni bir "Kampüs/..." başlıyorsa ayraç sayar.
  const first = p.split(/(?<=-[^\s-]+)\s+(?=[^\s/]+\/)/)[0];
  const building = first.replace(/-[^-]*$/, '').replace(/\//g, ' ').trim();
  return building ? `İTÜ ${building}` : '';
}

// Faz 4.5b: filtrelenmiş sınav listesini .ics olarak dışa aktarır.
function exportExamsICS() {
  if (!currentHits.length) { toast(I18N.t('examNoneToast'), { kind: 'warn' }); return; }
  const events = currentHits.map(examToIcs).filter(Boolean);
  const slug = state.exams?.published ? state.index.currentSlug : (state.exams?.fallback?.slug || state.index.currentSlug);
  downloadICS(`itu-final-${slug}.ics`, events);
  toast(`${events.length} ${I18N.t('examIcsExportedSuffix')}`);
}
