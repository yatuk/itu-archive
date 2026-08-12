// Akademik takvim görünümü: seçilen yılın takvimini tabloya göre gruplar,
// geçmiş etkinlikleri isteğe bağlı gizler.

import { $, getJSON, esc, setStatus, calendarDayState, fmtDate } from '../core/utils.js';
import { state } from '../core/store.js';
import { initReveal } from '../core/reveal.js';

let inited = false;

export function initCalendar() {
  if (inited) return;
  $('#f-year').addEventListener('change', () => loadCalendar($('#f-year').value));
  $('#f-upcoming').addEventListener('change', renderCalendar);
  inited = true;
}

export function onShow() {
  initCalendar();
  if (!state.calendar && state.index) loadCalendar($('#f-year').value);
}

export async function loadCalendar(yearId) {
  $('#calendar').innerHTML = '<p class="empty">yükleniyor…</p>';
  try {
    state.calendar = await getJSON(`data/calendar/${yearId}.json`);
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
    const st = calendarDayState(ev.date);
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
