/* İTÜ Ders Arşivi — giriş noktası.
   Yalnızca başlatmayı, sekme yönlendirmesini ve statik üst bilgiyi yönetir;
   her sekmenin mantığı views/ altındaki kendi modülünde. Tüm veri docs/data
   altındaki statik JSON'lardan geliyor; sunucu tarafı yok. */

import { $, getJSON, fmtDate, esc, setStatus } from './core/utils.js';
import { state } from './core/store.js';
import { initCourses, loadTerm, applyFilters } from './views/courses.js';
import { initHistory, onShow as historyShow } from './views/history.js';
import { initExams, onShow as examsShow } from './views/exams.js';
import { initCalendar, onShow as calendarShow } from './views/calendar.js';
import { renderTerms } from './views/terms.js';
import { PrereqGraph } from './prereq.js';

async function boot() {
  wireTabs();
  try {
    state.index = await getJSON('data/index.json');
  } catch (e) {
    setStatus($('#stat-status'), 'veri yüklenemedi', { error: true });
    $('#rows').innerHTML = `<tr><td colspan="8" class="empty">Veri dosyaları okunamadı (${esc(e.message)}).</td></tr>`;
    return;
  }

  const ix = state.index;
  $('#stat-status').textContent = 'çevrimiçi';
  $('#stat-status').className = 'ok';
  $('#stat-term').textContent = ix.currentTerm || '—';
  $('#stat-scraped').textContent = fmtDate(ix.scrapedAt);
  $('#stat-terms').textContent = `${ix.terms.filter((t) => !t.missing).length} dönem · ${ix.calendars.length} takvim yılı`;
  $('#foot-build').textContent = `son tarama ${fmtDate(ix.scrapedAt)}`;

  // Dönem seçici (dersler görünümüne ait) + paylaşılabilir URL durumu.
  const termSel = $('#f-term');
  termSel.innerHTML = ix.terms
    .filter((t) => !t.missing)
    .map((t) => `<option value="${t.slug}">${t.label}${t.source === 'obs' ? ' · canlı' : ''}</option>`)
    .join('');
  const params = new URLSearchParams(location.search);
  let initialSlug = ix.currentSlug;
  const wantTerm = params.get('term');
  if (wantTerm && ix.terms.some((t) => t.slug === wantTerm)) initialSlug = wantTerm;
  termSel.value = initialSlug;

  // Takvim yıl seçici.
  $('#f-year').innerHTML = ix.calendars.map((c) => `<option value="${c.yearId}">${c.label}</option>`).join('');

  renderTerms();
  fillHost();

  // Görünümlerin olay bağlantılarını kur (veri yükleme sekme açılınca).
  initCourses();
  initCalendar();
  initExams();
  initHistory();

  await loadTerm(initialSlug);

  // Arama ve filtre durumunu URL'den uygula (loadTerm filtre seçeneklerini
  // yeniden kurduğu için bunları ondan sonra yazıyoruz).
  if (params.has('q')) $('#q').value = params.get('q');
  if (params.has('branch')) $('#f-branch').value = params.get('branch');
  if (params.has('day')) $('#f-day').value = params.get('day');
  if (params.get('open') === '1') $('#f-open').checked = true;
  applyFilters();
}

/* ---------- sekmeler ---------- */

const VIEWS = ['dersler', 'gecmis', 'onsart', 'sinavlar', 'takvim', 'donemler', 'hakkinda'];

function wireTabs() {
  const buttons = [...document.querySelectorAll('.tabs button')];

  const show = (view) => {
    for (const b of buttons) {
      const active = b.dataset.view === view;
      b.setAttribute('aria-selected', String(active));
      b.tabIndex = active ? 0 : -1; // roving tabindex: klavye dolaşımı
    }
    for (const s of document.querySelectorAll('.view')) {
      const active = s.id === `view-${view}`;
      s.hidden = !active;
    }
    if (view === 'takvim') calendarShow();
    if (view === 'sinavlar') examsShow();
    if (view === 'gecmis') historyShow();
    if (view === 'onsart') PrereqGraph.init('#pg-root');
    if (location.hash.slice(1) !== view) history.replaceState(null, '', `#${view}`);
  };

  for (const b of buttons) {
    b.addEventListener('click', () => show(b.dataset.view));
    // Sekmeler arasında ok tuşlarıyla dolaşım (kapsayıcı klavye erişimi).
    b.addEventListener('keydown', (ev) => {
      const idx = buttons.indexOf(b);
      let next = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (idx + 1) % buttons.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (idx - 1 + buttons.length) % buttons.length;
      else return;
      ev.preventDefault();
      buttons[next].focus();
      show(buttons[next].dataset.view);
    });
  }

  const initial = location.hash.slice(1);
  show(VIEWS.includes(initial) ? initial : 'dersler');
}

// Hakkında sekmesindeki curl örneklerine sitenin gerçek adresini yazar.
function fillHost() {
  const host = location.host + location.pathname.replace(/\/$/, '');
  for (const el of document.querySelectorAll('.prose .host')) el.textContent = host;
  for (const el of document.querySelectorAll('.prose .var')) el.textContent = state.index.currentSlug;
}

boot();
