// Akademik takvim görünümü: seçilen yılın takvimini bugüne göre özetler
// ("şimdi" kartı + yıl şeridi) ve etkinlikleri ay ay listeler. Yakın aylar
// açık, sonrakiler <details> içinde kapalı durur; geçmiş etkinlikler isteğe
// bağlı gizlenir.

import { $, getJSON, esc, fmtDate, downloadICS, hashShort, parseTurkishDateRange } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from '../core/persistence.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

let inited = false;

function calendarPreference() {
  const params = new URLSearchParams(location.search);
  const explicit = location.hash === '#takvim' && ['year', 'caltype', 'upcoming'].some((key) => params.has(key));
  const pref = explicit ? {} : readLocalState('itu-calendar-filters', { fallback: {}, validate: isPlainObject });
  return {
    year: params.get('year') || pref.year || '',
    type: params.get('caltype') || pref.type || '',
    upcoming: params.has('upcoming') ? params.get('upcoming') !== '0' : pref.upcoming !== false,
  };
}

function saveCalendarPreference() {
  const data = { year: $('#f-year').value, type: $('#f-caltype').value, upcoming: $('#f-upcoming').checked };
  writeLocalState('itu-calendar-filters', data, { validate: isPlainObject });
  const p = new URLSearchParams();
  if (data.year) p.set('year', data.year);
  if (data.type) p.set('caltype', data.type);
  if (!data.upcoming) p.set('upcoming', '0');
  history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}#takvim`);
}

// Tür slug → i18n anahtarı. Liste kodda sabit değil — hangi türlerin
// seçileceğini index.json (seçili yılın types'ı) belirler (P0-4).
const CAL_TYPE_KEYS = {
  lisans: 'calTypeLisans',
  'yatay-cap-yandal': 'calTypeYatayCapYandal',
  onkayit: 'calTypeOnkayit',
  hazirlik: 'calTypeHazirlik',
  lisansustu: 'calTypeLisansustu',
  'ikinci-ogretim-lisansustu': 'calTypeIkinciOgretimLisansustu',
};

// Tür seçicisini seçili yılın index.json'da ilan edilen türlerinden doldurur:
// tür dosyası olmayan seçenek "takvim yüklenemedi" hatası üretmesin.
function populateTypes(yearId) {
  const sel = $('#f-caltype');
  const cal = (state.index?.calendars || []).find((c) => c.yearId === yearId);
  const types = cal?.types || [];
  sel.innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
    types.map((slug) => `<option value="${esc(slug)}">${esc(CAL_TYPE_KEYS[slug] ? I18N.t(CAL_TYPE_KEYS[slug]) : slug)}</option>`).join('');
  if (!types.includes(sel.value)) sel.value = '';
}

export function initCalendar() {
  if (inited) return;
  const pref = calendarPreference();
  if ([...$('#f-year').options].some((o) => o.value === pref.year)) $('#f-year').value = pref.year;
  $('#f-upcoming').checked = pref.upcoming;
  populateTypes($('#f-year').value);
  if ([...$('#f-caltype').options].some((o) => o.value === pref.type)) $('#f-caltype').value = pref.type;
  $('#f-year').addEventListener('change', () => {
    populateTypes($('#f-year').value);
    saveCalendarPreference();
    loadCalendar($('#f-year').value, $('#f-caltype').value);
  });
  $('#f-caltype').addEventListener('change', () => { saveCalendarPreference(); loadCalendar($('#f-year').value, $('#f-caltype').value); });
  $('#f-upcoming').addEventListener('change', () => { saveCalendarPreference(); renderCalendar(); });
  const ics = $('#cal-ics');
  if (ics) ics.addEventListener('click', exportICS);
  inited = true;
}

export function onShow() {
  initCalendar();
  if (!state.calendar && state.index) loadCalendar($('#f-year').value, $('#f-caltype').value);
}

function setSummaryHidden(hidden) {
  for (const id of ['#cal-now', '#cal-strip']) {
    const el = $(id);
    if (el) el.hidden = hidden;
  }
  const foot = $('#cal-foot');
  if (foot && hidden) foot.textContent = '';
}

export async function loadCalendar(yearId, type) {
  setSummaryHidden(true);
  $('#calendar').innerHTML = `<p class="empty">${esc(I18N.t('statLoading'))}</p>`;
  try {
    // Tür seçildiyse türe özgü dosya (slug yol-güvenli); yoksa birleşik (geriye uyumlu).
    const path = type
      ? `data/calendar/${type}/${yearId}.json`
      : `data/calendar/${yearId}.json`;
    state.calendar = await getJSON(path);
  } catch (e) {
    $('#calendar').innerHTML = `<p class="empty error">${esc(I18N.t('calLoadError'))} (${esc(e.message)})</p>`;
    return;
  }
  renderCalendar();
}

// --- tarih yardımcıları -----------------------------------------------------

const DAY = 86400000;
const locale = () => (I18N.lang === 'en' ? 'en-GB' : 'tr-TR');

function isoDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || ''));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

function todayMidnight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Etkinliğin {start, end} aralığı: kazıyıcının ISO alanları varsa onlar, yoksa
// Türkçe tarih metni. Çözülemezse null.
function eventRange(ev) {
  const a = isoDate(ev.start);
  const b = isoDate(ev.end);
  if (a && b && b >= a) return { start: a, end: b };
  return parseTurkishDateRange(ev.date);
}

// Saf · test edilebilir: birleşik takvimde aynı etkinlik birden çok tür
// tablosunda tekrar eder (Ara Tatil gibi); başlık + aralık aynıysa bir kez kalır.
// Sonuç başlangıç tarihine göre sıralıdır; tarihsizler sona düşer.
export function normalizeCalendarEvents(events, today = todayMidnight()) {
  const seen = new Set();
  const out = [];
  for (const ev of Array.isArray(events) ? events : []) {
    const range = eventRange(ev);
    const key = `${String(ev.title || '').trim().toLocaleLowerCase('tr')}|${range ? range.start.getTime() : ev.date}|${range ? range.end.getTime() : ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    let status = 'upcoming';
    if (range) {
      if (range.end < today) status = 'past';
      else if (range.start <= today) status = 'now';
    }
    out.push({ ev, range, status });
  }
  out.sort((a, b) => {
    const da = a.range ? a.range.start.getTime() : Infinity;
    const db = b.range ? b.range.start.getTime() : Infinity;
    if (da !== db) return da - db;
    return String(a.ev.title).localeCompare(String(b.ev.title), 'tr');
  });
  return out;
}

function fmtDay(d) {
  return d.toLocaleDateString(locale(), { day: '2-digit', month: 'short' }).replace(/\.$/, '');
}

function fmtRange(range, rawDate) {
  if (!range) return String(rawDate || '');
  const { start, end } = range;
  let text;
  if (start.getTime() === end.getTime()) text = fmtDay(start);
  else if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    text = `${String(start.getDate()).padStart(2, '0')}–${fmtDay(end)}`;
  } else text = `${fmtDay(start)} – ${fmtDay(end)}`;
  const times = String(rawDate || '').match(/\b\d{1,2}:\d{2}\b/g);
  if (times && times.length) text += ` ${times.join('–')}`;
  return text;
}

function relLabel(item, today) {
  if (!item.range) return '';
  if (item.status === 'now') return I18N.t('relNow');
  if (item.status === 'past') return I18N.t('relDaysAgo', { n: Math.round((today - item.range.end) / DAY) });
  const n = Math.round((item.range.start - today) / DAY);
  return n === 1 ? I18N.t('relTomorrow') : I18N.t('relInDays', { n });
}

// --- "şimdi" kartı ------------------------------------------------------------

function renderNow(items, today) {
  const box = $('#cal-now');
  if (!box) return;
  const ongoing = items.filter((i) => i.status === 'now')
    .sort((a, b) => (a.range.end - a.range.start) - (b.range.end - b.range.start));
  const upcoming = items.filter((i) => i.status === 'upcoming' && i.range);
  if (!ongoing.length && !upcoming.length) {
    box.hidden = true;
    return;
  }
  const todayText = today.toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' });
  let first;
  if (ongoing.length) {
    const o = ongoing[0];
    const more = ongoing.length > 1 ? `<span class="cal-now-more">${esc(I18N.t('calNowMore', { n: ongoing.length - 1 }))}</span>` : '';
    first = `<span class="cal-now-big">${esc(I18N.t('calNowOngoing', { title: o.ev.title }))}</span>` +
      `<span class="cal-now-d num">${esc(fmtRange(o.range, o.ev.date))}</span>${more}`;
  } else {
    first = `<span class="cal-now-big cal-now-quiet">${esc(I18N.t('calNowNone'))}</span>`;
  }
  const col = (labelKey, item) => item
    ? `<div><span class="tx-k">${esc(I18N.t(labelKey))} · ${esc(relLabel(item, today))}</span>` +
      `<span class="cal-now-t">${esc(item.ev.title)}</span><span class="cal-now-d num">${esc(fmtRange(item.range, item.ev.date))}</span></div>`
    : '';
  box.innerHTML = `<div class="cal-now-today"><span class="tx-k">${esc(I18N.t('calNowToday'))} · ${esc(todayText)}</span>${first}</div>` +
    col('calNowNext', upcoming[0]) + col('calNowAfter', upcoming[1]);
  box.hidden = false;
}

// --- yıl şeridi ---------------------------------------------------------------

function findEvent(items, re) {
  return items.find((i) => i.range && re.test(String(i.ev.title || '').trim()));
}

// Saf · test edilebilir: öğretim yılı şeridinin bölümlerini (ders dönemi,
// yarıyıl sonu sınavları, ara tatil) etkinlik başlıklarından çıkarır.
export function buildYearStrip(items, firstYear) {
  const from = new Date(firstYear, 8, 1);      // 1 Eylül
  const to = new Date(firstYear + 1, 6, 1);    // 1 Temmuz (hariç)
  const segs = [];
  for (const season of [
    { key: 'fall', start: /^güz yarıyılı başlangıcı$/i, finals: /^güz yarıyılı sonu sınavları$/i, end: /^güz yarıyılı sonu$/i },
    { key: 'spring', start: /^bahar yarıyılı başlangıcı$/i, finals: /^bahar yarıyılı sonu sınavları$/i, end: /^bahar yarıyılı sonu$/i },
  ]) {
    const st = findEvent(items, season.start);
    const fin = findEvent(items, season.finals);
    if (!st || !fin) continue;
    const endEv = findEvent(items, season.end);
    const lectureEnd = endEv && endEv.range.start < fin.range.start
      ? endEv.range.start
      : new Date(fin.range.start.getTime() - DAY);
    segs.push({ kind: 'lectures', season: season.key, start: st.range.start, end: lectureEnd });
    segs.push({ kind: 'finals', season: season.key, start: fin.range.start, end: fin.range.end });
  }
  if (!segs.length) return null;
  const seenBreak = new Set();
  for (const i of items) {
    if (!i.range || !/^ara tatil$/i.test(String(i.ev.title || '').trim())) continue;
    const k = i.range.start.getTime();
    if (seenBreak.has(k)) continue;
    seenBreak.add(k);
    segs.push({ kind: 'break', start: i.range.start, end: i.range.end });
  }
  const inRange = segs.filter((s) => s.end >= from && s.start < to);
  return inRange.length ? { from, to, segs: inRange } : null;
}

function renderStrip(items, today) {
  const box = $('#cal-strip');
  if (!box) return;
  const m = /^(\d{4})/.exec(String(state.calendar?.year || ''));
  const strip = m ? buildYearStrip(items, Number(m[1])) : null;
  if (!strip) {
    box.hidden = true;
    return;
  }
  const total = (strip.to - strip.from) / DAY;
  const pct = (d) => Math.max(0, Math.min(100, ((d - strip.from) / DAY) / total * 100));
  const label = (s) => s.kind === 'finals'
    ? I18N.t('calStripFinals')
    : s.kind === 'lectures' ? I18N.t(s.season === 'fall' ? 'calStripFall' : 'calStripSpring') : '';
  const segHTML = strip.segs.map((s) => {
    const l = pct(s.start);
    const w = Math.max(0.4, pct(new Date(s.end.getTime() + DAY)) - l);
    const lbl = label(s);
    return `<div class="cal-seg ${s.kind}" style="left:${l.toFixed(2)}%;width:${w.toFixed(2)}%">${lbl ? `<span>${esc(lbl)}</span>` : ''}</div>`;
  }).join('');
  const ticks = [];
  for (let d = new Date(strip.from); d < strip.to; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    ticks.push(`<span style="left:${pct(d).toFixed(2)}%">${esc(d.toLocaleDateString(locale(), { month: 'short' }).replace(/\.$/, ''))}</span>`);
  }
  const showToday = today >= strip.from && today < strip.to;
  const todayHTML = showToday
    ? `<div class="cal-today" style="left:${pct(today).toFixed(2)}%"><b>${esc(I18N.t('calStripToday'))}</b></div>`
    : '';
  const yearLabel = `${strip.from.getFullYear()}-${strip.to.getFullYear()}`;
  const desc = strip.segs.filter((s) => s.kind !== 'break')
    .map((s) => `${label(s)} ${fmtRange({ start: s.start, end: s.end })}`).join(', ');
  const breaks = strip.segs.filter((s) => s.kind === 'break').map((s) => fmtRange({ start: s.start, end: s.end }));
  const aria = I18N.t('calStripAria', { year: yearLabel }) + ': ' + desc +
    (breaks.length ? `. ${I18N.t('calStripBreak')}: ${breaks.join(', ')}` : '') +
    (showToday ? `. ${I18N.t('calStripToday')}: ${today.toLocaleDateString(locale(), { day: 'numeric', month: 'long' })}` : '');
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', aria);
  box.innerHTML = `<div class="cal-strip-in" aria-hidden="true">` +
    `<div class="tx-k">${esc(I18N.t('calStripTitle', { year: yearLabel }))}</div>` +
    `<div class="cal-track">${segHTML}${todayHTML}</div>` +
    `<div class="cal-ticks">${ticks.join('')}</div>` +
    `<div class="cal-lgd"><span><i class="cal-sw lectures"></i>${esc(I18N.t('calStripLegendLectures'))}</span>` +
    `<span><i class="cal-sw finals"></i>${esc(I18N.t('calStripLegendFinals'))}</span>` +
    `<span><i class="cal-sw break"></i>${esc(I18N.t('calStripLegendBreak'))}</span></div>` +
    `</div>`;
  box.hidden = false;
}

// --- ay ay liste --------------------------------------------------------------

function monthKey(d) { return d.getFullYear() * 12 + d.getMonth(); }

function renderMonths(items, today, upcomingOnly) {
  const container = $('#calendar');
  const visible = upcomingOnly ? items.filter((i) => i.status !== 'past') : items;
  if (!visible.length) {
    const cal = state.calendar;
    container.innerHTML = `<p class="empty">${esc(I18N.t('calNoUpcomingEvents'))}` +
      (cal.scrapedAt ? ` · ${esc(I18N.t('statScraped'))} ${fmtDate(cal.scrapedAt)}` : '') + '</p>';
    return;
  }
  const months = [];
  const byKey = new Map();
  const undated = [];
  for (const item of visible) {
    if (!item.range) { undated.push(item); continue; }
    // Süren etkinlik bu ayın altında görünür; geçmiş etkinlik kendi ayında.
    const anchor = item.status === 'past' ? item.range.start : (item.range.start < today ? today : item.range.start);
    const key = monthKey(anchor);
    let m = byKey.get(key);
    if (!m) {
      m = { key, date: new Date(anchor.getFullYear(), anchor.getMonth(), 1), items: [] };
      byKey.set(key, m);
      months.push(m);
    }
    m.items.push(item);
  }
  months.sort((a, b) => a.key - b.key);
  const cur = monthKey(today);
  let openKeys = new Set(months.filter((m) => m.key >= cur && m.key <= cur + 2).map((m) => m.key));
  if (!openKeys.size) openKeys = new Set(months.slice(0, 3).map((m) => m.key));

  const rowHTML = (item) => {
    const cls = item.status === 'now' ? ' is-now' : item.status === 'past' ? ' is-past' : '';
    return `<div class="cal-ev${cls}"><span class="cal-dt num" title="${esc(item.ev.date)}">${esc(fmtRange(item.range, item.ev.date))}</span>` +
      `<span class="cal-ti">${esc(item.ev.title)}</span><span class="cal-rel num">${esc(relLabel(item, today))}</span></div>`;
  };
  const nameOf = (m) => {
    const s = m.date.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
    return s.charAt(0).toLocaleUpperCase(I18N.lang === 'en' ? 'en' : 'tr') + s.slice(1);
  };
  const parts = [];
  let closedRun = [];
  const flush = () => {
    if (closedRun.length) parts.push(`<div class="cal-sumcol">${closedRun.join('')}</div>`);
    closedRun = [];
  };
  for (const m of months) {
    const count = esc(I18N.t('calEventCount', { n: m.items.length }));
    if (openKeys.has(m.key)) {
      flush();
      parts.push(`<section class="cal-mon" aria-label="${esc(nameOf(m))}"><div class="cal-mh"><h3>${esc(nameOf(m))}</h3><span class="num">${count}</span></div>` +
        m.items.map(rowHTML).join('') + '</section>');
    } else {
      closedRun.push(`<details class="cal-mon"><summary><b>${esc(nameOf(m))}</b><span class="num">${count}</span></summary>` +
        m.items.map(rowHTML).join('') + '</details>');
    }
  }
  if (undated.length) {
    closedRun.push(`<details class="cal-mon"><summary><b>${esc(I18N.t('calUndated'))}</b><span class="num">${esc(I18N.t('calEventCount', { n: undated.length }))}</span></summary>` +
      undated.map(rowHTML).join('') + '</details>');
  }
  flush();
  container.innerHTML = parts.join('');
}

function renderFoot(items) {
  const foot = $('#cal-foot');
  const cal = state.calendar;
  if (!foot || !cal) return;
  const typeSlug = $('#f-caltype').value;
  const typeName = typeSlug ? (CAL_TYPE_KEYS[typeSlug] ? I18N.t(CAL_TYPE_KEYS[typeSlug]) : typeSlug) : I18N.t('filterAll');
  const ahead = items.filter((i) => i.status !== 'past').length;
  const year = String(cal.year || '').replace(/\s+Eğitim.*$/i, '');
  const parts = [
    I18N.t('calFootSource', { year, type: typeName, total: items.length, ahead }),
  ];
  if (cal.scrapedAt) parts.push(`${I18N.t('statScraped')} ${fmtDate(cal.scrapedAt)}`);
  foot.textContent = parts.join(' · ');
}

function renderCalendar() {
  const cal = state.calendar;
  if (!cal) return;
  const today = todayMidnight();
  const items = normalizeCalendarEvents(cal.events, today);
  renderNow(items, today);
  renderStrip(items, today);
  renderMonths(items, today, $('#f-upcoming').checked);
  renderFoot(items);
}

// Akademik takvimi .ics olarak dışa aktarır (Faz 4.5). Scraper'ın ISO
// start/end'i kullanılır; eski dosyalarda (yoksa) Türkçe tarih ayrıştırılır.
function exportICS() {
  const cal = state.calendar;
  if (!cal || !cal.events) return;
  const events = cal.events.map((e) => ({
    // Kırılgan uzun/Türkçe uid yerine kısa deterministik karma + sabit alan.
    uid: `${hashShort(cal.yearId + '|' + e.title)}@itu-ders.com`,
    title: `${e.table}: ${e.title}`,
    // Scraper ISO start/end; eski dosyalarda yoksa Türkçe date string'i (tüm gün).
    startISO: e.start || e.date,
    endISO: e.end || e.date,
    desc: e.remaining,
  }));
  downloadICS(`itu-takvim-${cal.yearId}.ics`, events);
}
