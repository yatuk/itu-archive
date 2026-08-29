// Akademik takvim görünümü: seçilen yılın takvimini tabloya göre gruplar,
// geçmiş etkinlikleri isteğe bağlı gizler.

import { $, getJSON, esc, setStatus, calendarDayState, fmtDate, downloadICS, hashShort } from '../core/utils.js?v=d0ca68eb0d19';
import { state } from '../core/store.js?v=d0ca68eb0d19';
import { initReveal } from '../core/reveal.js?v=d0ca68eb0d19';
import { readLocalState, writeLocalState, isPlainObject } from '../core/persistence.js?v=d0ca68eb0d19';

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

// Tür slug → görünür etiket. Liste kodda sabit değil — hangi türlerin
// seçileceğini index.json (seçili yılın types'ı) belirler (P0-4).
const CAL_TYPE_LABELS = {
  lisans: 'Lisans',
  'yatay-cap-yandal': 'Yatay Geçiş / ÇAP / Yandal',
  onkayit: 'Önkayıt',
  hazirlik: 'İngilizce Hazırlık',
  lisansustu: 'Lisansüstü',
  'ikinci-ogretim-lisansustu': 'II. Öğretim Lisansüstü',
};

// Tür seçicisini seçili yılın index.json'da ilan edilen türlerinden doldurur:
// tür dosyası olmayan seçenek "takvim yüklenemedi" hatası üretmesin.
function populateTypes(yearId) {
  const sel = $('#f-caltype');
  const cal = (state.index?.calendars || []).find((c) => c.yearId === yearId);
  const types = cal?.types || [];
  sel.innerHTML = '<option value="">tümü</option>' +
    types.map((slug) => `<option value="${esc(slug)}">${esc(CAL_TYPE_LABELS[slug] || slug)}</option>`).join('');
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

export async function loadCalendar(yearId, type) {
  $('#calendar').innerHTML = '<p class="empty">yükleniyor…</p>';
  try {
    // Tür seçildiyse türe özgü dosya (slug yol-güvenli); yoksa birleşik (geriye uyumlu).
    const path = type
      ? `data/calendar/${type}/${yearId}.json`
      : `data/calendar/${yearId}.json`;
    state.calendar = await getJSON(path);
  } catch (e) {
    $('#calendar').innerHTML = `<p class="empty error">takvim yüklenemedi (${esc(e.message)})</p>`;
    return;
  }
  renderCalendar();
}

function renderCalendar() {
  const cal = state.calendar;
  if (!cal) return;
  const upcomingOnly = $('#f-upcoming').checked;

  const groups = new Map();
  for (const ev of cal.events) {
    // Scraper'ın ISO start/end'i varsa ona güven (JS'in çözemediği gömülü-saatli
    // aralıklar dahil); yoksa Türkçe metni ayrıştır.
    const st = calendarDayState(ev.date, new Date(), ev.start && ev.end ? { start: ev.start, end: ev.end } : null);
    if (upcomingOnly && st.past) continue;
    if (!groups.has(ev.table)) groups.set(ev.table, []);
    // Etiket canlı hesaptan; tarih çözümlenemediyse kazıyıcının etiketine düş.
    groups.get(ev.table).push({ ...ev, past: st.past, now: st.now, left: st.label || ev.remaining });
  }

  if (!groups.size) {
    $('#calendar').innerHTML = '<p class="empty">bu akademik yıl için gelecek etkinlik yok' +
      (cal.scrapedAt ? ` · son tarama ${fmtDate(cal.scrapedAt)}` : '') + '</p>';
    return;
  }

  let html = '';
  for (const [title, evs] of groups) {
    html += `<section class="calgroup reveal"><h3>${esc(title)}</h3><ol>` +
      evs.map((e) => `<li class="${e.now ? 'now' : e.past ? 'past' : ''}">
        <span>${esc(e.title)}</span>
        <span class="date">${esc(e.date)}</span>
        <span class="left">${esc(e.left)}</span></li>`).join('') +
      '</ol></section>';
  }
  $('#calendar').innerHTML = html;
  initReveal($('#calendar'));
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
