// Akademik takvim görünümü: seçilen yılın takvimini tabloya göre gruplar,
// geçmiş etkinlikleri isteğe bağlı gizler.

import { $, getJSON, esc, setStatus, calendarDayState, fmtDate, downloadICS } from '../core/utils.js';
import { state } from '../core/store.js';
import { initReveal } from '../core/reveal.js';

let inited = false;

// Takvim türü seçenekleri — scraper'ın yazdığı calendar/<slug>/<yearId>.json ile
// eşleşir (Faz 3C). slug yol-güvenli dizin adıdır; label seçicide görünür.
const CAL_TYPES = [
  { slug: 'lisans', label: 'Lisans' },
  { slug: 'yatay-cap-yandal', label: 'Yatay Geçiş / ÇAP / Yandal' },
  { slug: 'onkayit', label: 'Önkayıt' },
  { slug: 'hazirlik', label: 'İngilizce Hazırlık' },
  { slug: 'lisansustu', label: 'Lisansüstü' },
  { slug: 'ikinci-ogretim-lisansustu', label: 'II. Öğretim Lisansüstü' },
];

export function initCalendar() {
  if (inited) return;
  $('#f-year').addEventListener('change', () => loadCalendar($('#f-year').value, $('#f-caltype').value));
  $('#f-caltype').addEventListener('change', () => loadCalendar($('#f-year').value, $('#f-caltype').value));
  $('#f-upcoming').addEventListener('change', renderCalendar);
  const ics = $('#cal-ics');
  if (ics) ics.addEventListener('click', exportICS);
  $('#f-caltype').innerHTML = '<option value="">tümü</option>' +
    CAL_TYPES.map((t) => `<option value="${esc(t.slug)}">${esc(t.label)}</option>`).join('');
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
    uid: `${cal.yearId}-${esc(e.title)}`,
    title: `${e.table}: ${e.title}`,
    // Scraper ISO start/end; eski dosyalarda yoksa Türkçe date string'i (tüm gün).
    startISO: e.start || e.date,
    endISO: e.end || e.date,
    desc: e.remaining,
  }));
  downloadICS(`itu-takvim-${cal.yearId}.ics`, events);
}
