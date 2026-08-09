/* İTÜ Ders Arşivi — giriş noktası.
   Yalnızca başlatmayı, sekme yönlendirmesini ve statik üst bilgiyi yönetir;
   her sekmenin mantığı views/ altındaki kendi modülünde. Tüm veri docs/data
   altındaki statik JSON'lardan geliyor; sunucu tarafı yok. */

import { $, getJSON, fmtDate, esc, setStatus } from './core/utils.js';
import { state, markIndexReady } from './core/store.js';
import { I18N } from './i18n.js';
import { initCourses, loadTerm, applyFilters } from './views/courses.js';
import { initHistory, onShow as historyShow, searchHistory } from './views/history.js';
import { initExams, onShow as examsShow } from './views/exams.js';
import { initCalendar, onShow as calendarShow } from './views/calendar.js';
import { renderTerms } from './views/terms.js';
import { onShow as programShow } from './views/program.js';
import { PrereqGraph } from './prereq.js';

// wireTabs içinde atanır; dış olaylar (örn. detay panelinden geçmişe atlama)
// sekme değiştirmek için bunu kullanır.
let showView = null;

// İlk açılıştaki sekme. `boot` index.json'u yükledikten sonra uygulanır;
// böylece program/takvim/sınavlar gibi veriye bağımlı görünümler (ör. paylaşılan
// #program bağlantısı) boş select'lerle erken render edilmez.
const pendingView = location.hash.slice(1);

async function boot() {
  I18N.translateDOM();
  initTheme();
  wireTabs();
  wireHistoryJump();
  window.addEventListener('itu:goto-program', () => { if (showView) showView('program', true); });
  try {
    state.index = await getJSON('data/index.json');
  } catch (e) {
    markIndexReady(); // yükleme başarısız olsa da bekleyenleri serbest bırak
    setStatus($('#stat-status'), I18N.t('statVeriYok'), { error: true });
    $('#rows').innerHTML = `<tr><td colspan="9" class="empty">Veri dosyaları okunamadı (${esc(e.message)}).</td></tr>`;
    return;
  }

  const ix = state.index;
  $('#stat-status').textContent = I18N.t('statOnline');
  $('#stat-status').className = 'ok';
  $('#stat-term').textContent = ix.currentTerm || '—';
  $('#stat-scraped').textContent = fmtDate(ix.scrapedAt);
  $('#stat-terms').textContent = `${ix.terms.filter((t) => !t.missing).length} dönem · ${ix.calendars.length} takvim yılı`;
  $('#foot-build').textContent = `${I18N.t('footBuild')} ${fmtDate(ix.scrapedAt)}`;

  // Dönem seçici (dersler görünümüne ait) + paylaşılabilir URL durumu.
  const termSel = $('#f-term');
  termSel.innerHTML = ix.terms
    .filter((t) => !t.missing)
    .map((t) => `<option value="${t.slug}">${t.label}${t.live ? ' · canlı' : ''}</option>`)
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

  // İlk sekme artık veri hazırken açılır (paylaşılan #program/#takvim/#sinavlar
  // bağlantıları bu sayede doğru çalışır).
  showView(VIEWS.includes(pendingView) ? pendingView : 'dersler', false);

  await loadTerm(initialSlug);

  // Arama ve filtre durumunu URL'den uygula (loadTerm filtre seçeneklerini
  // yeniden kurduğu için bunları ondan sonra yazıyoruz).
  if (params.has('q')) $('#q').value = params.get('q');
  if (params.has('branch')) $('#f-branch').value = params.get('branch');
  if (params.has('day')) $('#f-day').value = params.get('day');
  if (params.has('time')) $('#f-time').value = params.get('time');
  if (params.has('level')) $('#f-level').value = params.get('level');
  if (params.has('method')) $('#f-method').value = params.get('method');
  if (params.has('program')) $('#f-program').value = params.get('program');
  if (params.has('code')) $('#f-code').value = params.get('code');
  if (params.get('open') === '1') $('#f-open').checked = true;
  applyFilters();
}

/* ---------- tema ---------- */

function initTheme() {
  const btns = [...document.querySelectorAll('.theme-btn')];
  const resolveAuto = () => matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const domApply = (t) => {
    document.documentElement.setAttribute('data-theme', t === 'auto' ? resolveAuto() : t);
    for (const b of btns) {
      b.setAttribute('aria-pressed', String(b.dataset.theme === t));
      b.tabIndex = b.dataset.theme === t ? 0 : -1;
    }
  };
  const apply = (t) => {
    domApply(t);
    try { localStorage.setItem('itu-theme', t); } catch (e) {}
  };
  // Kayıtlı tercih (inline script dark/light çözmüş olabilir → cookie oku).
  let cur = 'dark';
  try { cur = localStorage.getItem('itu-theme') || 'dark'; } catch (e) {}
  domApply(cur); // auto ise sistemden çöz
  for (const b of btns) {
    b.addEventListener('click', () => apply(b.dataset.theme));
  }
  // Sistem teması değişince auto modunda güncelle.
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (localStorage.getItem('itu-theme') === 'auto') domApply('auto');
  });
}

/* ---------- sekmeler ---------- */

const VIEWS = ['dersler', 'gecmis', 'onsart', 'sinavlar', 'takvim', 'donemler', 'program', 'hakkinda'];

// show, sekme görünürlüğünü ve URL hash'ini yönetir. push=true ise tarayıcı
// geçmişine yazılır (geri/ileri çalışır), değilse mevcut girişi değiştirir
// (ilk yükleme ve popstate).
function wireTabs() {
  const buttons = [...document.querySelectorAll('.tabs button')];

  const show = (view, push) => {
    for (const b of buttons) {
      const active = b.dataset.view === view;
      b.setAttribute('aria-selected', String(active));
      b.tabIndex = active ? 0 : -1; // roving tabindex: klavye dolaşımı
    }
    for (const s of document.querySelectorAll('.view')) {
      const active = s.id === `view-${view}`;
      s.hidden = !active;
      // Görünür olan view'a giriş animasyonu; yeniden tetikleme için sınıfı
      // kaldırıp yeniden ekliyoruz (animation özelliğiyle tek sefer oynar).
      if (active) {
        s.classList.remove('view-enter');
        void s.offsetWidth; // reflow — animasyonu baştan başlat
        s.classList.add('view-enter');
      }
    }
    if (view === 'takvim') calendarShow();
    if (view === 'sinavlar') examsShow();
    if (view === 'gecmis') historyShow();
    if (view === 'program') programShow();
    if (view === 'onsart') PrereqGraph.init('#pg-root');
    // Program oluşturucu daha geniş alan kullanır.
    const mainEl = document.querySelector('main.wrap');
    if (mainEl) mainEl.classList.toggle('wide', view === 'program');
    const h = location.hash.slice(1);
    if (h !== view) {
      if (push) history.pushState(null, '', `#${view}`);
      else history.replaceState(null, '', `#${view}`);
    }
  };
  showView = show;

  for (const b of buttons) {
    b.addEventListener('click', () => show(b.dataset.view, true));
    // Sekmeler arasında ok tuşlarıyla dolaşım (kapsayıcı klavye erişimi).
    b.addEventListener('keydown', (ev) => {
      const idx = buttons.indexOf(b);
      let next = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (idx + 1) % buttons.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (idx - 1 + buttons.length) % buttons.length;
      else return;
      ev.preventDefault();
      buttons[next].focus();
      show(buttons[next].dataset.view, true);
    });
  }

  // Tarayıcının geri/ileri butonları sekme değişikliklerini geri alır.
  window.addEventListener('popstate', () => {
    const v = location.hash.slice(1);
    show(VIEWS.includes(v) ? v : 'dersler', false);
  });
}

// Detay panelinden "bu hocanın geçmişinde ara" — geçmiş sekmesine geçip arama
// kutusunu doldurur.
function wireHistoryJump() {
  window.addEventListener('itu:goto-history', (e) => {
    const q = String(e.detail || '').trim();
    if (showView) showView('gecmis', true);
    $('#hq').value = q;
    historyShow();
    searchHistory();
  });
}

// Hakkında sekmesindeki curl örneklerine sitenin gerçek adresini yazar.
function fillHost() {
  const host = location.host + location.pathname.replace(/\/$/, '');
  for (const el of document.querySelectorAll('.prose .host')) el.textContent = host;
  for (const el of document.querySelectorAll('.prose .var')) el.textContent = state.index.currentSlug;
}

boot();
