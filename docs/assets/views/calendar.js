// Akademik takvim görünümü: seçilen yılın takvimini tabloya göre gruplar,
// geçmiş etkinlikleri isteğe bağlı gizler.

import { $, getJSON, esc, setStatus, calendarDayState, fmtDate } from '../core/utils.js';
import { state } from '../core/store.js';
import { initReveal } from '../core/reveal.js';

let inited = false;

// Takvim türü seçenekleri — scraper'ın yazdığı calendar/<tür>/<yearId>.json ile
// eşleşir (Faz 3C: lisans, yatay-ÇAP, önkayıt, hazırlık, lisansüstü, II. öğretim).
const CAL_TYPES = ['Lisans', 'Yatay Geçiş / ÇAP / Yandal', 'Önkayıt', 'İngilizce Hazırlık', 'Lisansüstü', 'II. Öğretim Lisansüstü'];

export function initCalendar() {
  if (inited) return;
  $('#f-year').addEventListener('change', () => loadCalendar($('#f-year').value, $('#f-caltype').value));
  $('#f-caltype').addEventListener('change', () => loadCalendar($('#f-year').value, $('#f-caltype').value));
  $('#f-upcoming').addEventListener('change', renderCalendar);
  $('#f-caltype').innerHTML = '<option value="">tümü</option>' +
    CAL_TYPES.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  inited = true;
}

export function onShow() {
  initCalendar();
  if (!state.calendar && state.index) loadCalendar($('#f-year').value, $('#f-caltype').value);
}

export async function loadCalendar(yearId, type) {
  $('#calendar').innerHTML = '<p class="empty">yükleniyor…</p>';
  try {
    // Tür seçildiyse türe özgü dosya; yoksa birleşik (geriye uyumlu).
    const path = type
      ? `data/calendar/${encodeURIComponent(type)}/${yearId}.json`
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
