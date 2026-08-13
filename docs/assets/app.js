/* İTÜ Ders Arşivi — giriş noktası.
   Yalnızca başlatmayı, sekme yönlendirmesini ve statik üst bilgiyi yönetir;
   her sekmenin mantığı views/ altındaki kendi modülünde. Tüm veri docs/data
   altındaki statik JSON'lardan geliyor; sunucu tarafı yok. */

import { $, getJSON, fmtDate, esc, setStatus } from './core/utils.js';
import { state, markIndexReady } from './core/store.js';
import { I18N } from './i18n.js';
import { initCourses, loadTerm, applyFilters } from './views/courses.js';
import { initCourseDetail, openCourseDetail } from './core/course-detail.js';
import { initHistory, onShow as historyShow, searchHistory } from './views/history.js';
import { initExams, onShow as examsShow } from './views/exams.js';
import { initCalendar, onShow as calendarShow } from './views/calendar.js';
import { renderTerms } from './views/terms.js';
import { onShow as programShow } from './views/program.js';
import { onShow as dersplanimShow } from './views/dersplanim.js';
import { PrereqGraph } from './prereq.js';
import { methodToCode, codeToMethod, slugToCode, scopeParams } from './core/urlcodes.js';
import { openTakenEditor } from './core/taken-ui.js';

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
  initLangButton();
  initWelcome();
  const takenBtn = $('#taken-btn');
  if (takenBtn) takenBtn.addEventListener('click', openTakenEditor);
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
  // Geçmiş sekmesi notundaki dönem sayısı (statik kopya bayatlamasın).
  const histCount = $('#hist-note-count');
  if (histCount) histCount.textContent = ix.terms.length;
  $('#foot-build').textContent = `${I18N.t('footBuild')} ${fmtDate(ix.scrapedAt)}`;

  // Faz 1: koşu özeti (status.json) — son tarama zamanını gösterir, veri
  // bayatsa uyarı basar. Dosya yoksa sessizce index.json değerine düşer.
  getJSON('data/status.json').then((st) => {
    if (!st || !st.lastSuccessAt) return;
    const last = new Date(st.lastSuccessAt);
    if (isNaN(last)) return;
    $('#stat-scraped').textContent = fmtDate(st.lastSuccessAt);
    $('#foot-build').textContent = `${I18N.t('footBuild')} ${fmtDate(st.lastSuccessAt)}`;
    if ((Date.now() - last.getTime()) / 36e5 > 48) {
      const stEl = $('#stat-status');
      if (stEl) {
        stEl.textContent = 'veri bayat: son başarılı tarama 2 günden eski';
        stEl.className = 'warn';
      }
    }
  }).catch(() => {});


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
  initCourseDetail();
  initCalendar();
  initExams();
  initHistory();
  enhanceSearchInputs();
  wireSearchShortcut();

  // İlk sekme artık veri hazırken açılır (paylaşılan #program/#takvim/#sinavlar
  // bağlantıları bu sayede doğru çalışır).
  showView(VIEWS.includes(pendingView) ? pendingView : 'dersler', false);

  await loadTerm(initialSlug);
  // Paylaşılan #ders/<kod> bağlantısı: detay, aktif dönem yüklendikten sonra
  // açılır — aksi halde dönem bilinmeden "açık değil" gösterirdi.
  openDetailFromHash(pendingView);

  // Arama ve filtre durumunu URL'den uygula (loadTerm filtre seçeneklerini
  // yeniden kurduğu için bunları ondan sonra yazıyoruz).
  if (params.has('q')) $('#q').value = params.get('q');
  if (params.has('branch')) $('#f-branch').value = params.get('branch');
  if (params.has('day')) $('#f-day').value = params.get('day');
  if (params.has('time')) $('#f-time').value = params.get('time');
  if (params.has('level')) $('#f-level').value = params.get('level');
  // method URL'de kısa kodla (f/c/h) gelir; eski uzun biçim (geriye uyumlu)
  // aynen kabul edilir — applyFilters/saveState kısa koda çevirip sadeleştirir.
  if (params.has('method')) {
    const m = params.get('method');
    $('#f-method').value = codeToMethod(m) || m;
  }
  if (params.has('program')) $('#f-program').value = params.get('program');
  if (params.has('code')) $('#f-code').value = params.get('code');
  if (params.get('open') === '1') $('#f-open').checked = true;
  if (params.get('taken') === '1') $('#f-taken').checked = true;
  applyFilters();
}

/* ---------- tema ---------- */

function initTheme() {
  const btns = [...document.querySelectorAll('.theme-btn')];
  const domApply = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    applyTabLabels();
    for (const b of btns) {
      b.setAttribute('aria-pressed', String(b.dataset.theme === t));
      b.tabIndex = b.dataset.theme === t ? 0 : -1;
    }
  };
  const apply = (t) => {
    domApply(t);
    try { localStorage.setItem('itu-theme', t); } catch (e) {}
  };
  // Yalnızca sade (ana) ve dark (seçenek) var. Eski light/contrast/auto
  // tercihleri kaldırılan temalara karşılık gelir — sade'ye düşer (yoksa
  // :root koyusu görünürdü, çünkü light/contrast CSS blokları silindi).
  let cur = 'sade';
  try { cur = localStorage.getItem('itu-theme') === 'dark' ? 'dark' : 'sade'; } catch (e) {}
  domApply(cur);
  for (const b of btns) {
    b.addEventListener('click', () => apply(b.dataset.theme));
  }
}

// TR/EN düğmesi (Faz 5.3): mevcut dilin karşıtına geçer. setLang tercihi
// localStorage'a yazıp ?lang= ile sayfayı yeniden yükler — görünümler boot'ta
// I18N.t ile yeniden render edilir, çeviri eksiksiz olur.
function initLangButton() {
  const btn = $('#lang-btn');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(I18N.lang === 'en'));
  btn.addEventListener('click', () => I18N.setLang(I18N.lang === 'en' ? 'tr' : 'en'));
}

// Faz 5.4: ilk ziyaret karşılaması — üç satırlık band, localStorage ile bir kez.
// Örnek arama butonları Dersler sekmesine filtreli atlar (app.js'teki global
// arama deseni gibi #q'yu doldurur + input tetikler).
function initWelcome() {
  const w = $('#welcome');
  if (!w) return;
  let seen = false;
  try { seen = localStorage.getItem('itu_welcome_seen') === '1'; } catch {}
  if (seen) return;
  w.hidden = false;
  const close = () => {
    w.hidden = true;
    try { localStorage.setItem('itu_welcome_seen', '1'); } catch {}
  };
  const closeBtn = $('#w-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
  for (const b of w.querySelectorAll('.w-example')) {
    b.addEventListener('click', () => {
      close();
      const q = $('#q');
      if (q) {
        q.value = b.dataset.q;
        q.dispatchEvent(new Event('input', { bubbles: true }));
      }
      showView('dersler', true);
    });
  }
}

// Sade temasında sekme adları düz ("Dersler"), fosfor/CRT'de numaralı
// ("01 · DERSLER") kalır — numaralandırma terminal kimliğinin parçası.
const TAB_PLAIN = {
  tr: { dersler: 'Dersler', gecmis: 'Geçmiş', dersplanim: 'Ders Planım/GPA', onsart: 'Önşart Haritası', sinavlar: 'Sınavlar', takvim: 'Akademik Takvim', donemler: 'Dönemler', program: 'Program', hakkinda: 'Hakkında' },
  en: { dersler: 'Courses', gecmis: 'History', dersplanim: 'My Plan/GPA', onsart: 'Prereq Map', sinavlar: 'Exams', takvim: 'Calendar', donemler: 'Terms', program: 'Schedule', hakkinda: 'About' },
};
function applyTabLabels() {
  const sade = document.documentElement.getAttribute('data-theme') === 'sade';
  const plain = TAB_PLAIN[I18N.lang] || TAB_PLAIN.tr;
  for (const b of document.querySelectorAll('.tabs button[data-view]')) {
    const key = 'tab' + b.dataset.view.charAt(0).toUpperCase() + b.dataset.view.slice(1);
    b.textContent = sade ? (plain[b.dataset.view] || I18N.t(key)) : I18N.t(key);
  }
}

/* ---------- sekmeler ---------- */

const VIEWS = ['dersler', 'gecmis', 'dersplanim', 'onsart', 'sinavlar', 'takvim', 'donemler', 'program', 'hakkinda'];

// Dersler filtrelerini kısa kodlarla query'ye yazar (term yalnızca aktif dönem
// dışındaysa). Varsayılanlar (boş/"hepsi"/aktif dönem) URL'ye girmez.
function derslerParams() {
  const p = new URLSearchParams();
  if (state.index && state.termSlug && state.termSlug !== state.index.currentSlug) p.set('term', state.termSlug);
  const q = $('#q').value.trim();
  if (q) p.set('q', q);
  if ($('#f-branch').value) p.set('branch', $('#f-branch').value);
  if ($('#f-day').value) p.set('day', $('#f-day').value);
  if ($('#f-time').value) p.set('time', $('#f-time').value);
  if ($('#f-level').value) p.set('level', $('#f-level').value);
  const method = methodToCode($('#f-method').value);
  if (method) p.set('method', method);
  if ($('#f-program').value) p.set('program', $('#f-program').value);
  if ($('#f-code').value.trim()) p.set('code', $('#f-code').value.trim());
  if ($('#f-open').checked) p.set('open', '1');
  if ($('#f-taken').checked) p.set('taken', '1');
  return p;
}

// Ders Planım filtreleri DOM'dan okunur (sekme açıkken URL'de kalır, sekme
// değişince app.js kapsama kuralıyla düşer).
function dersplanimParams() {
  const p = new URLSearchParams();
  // DOM henüz hazır değilken (ilk açılışta yazma, görünüm yüklenmeden) gelen
  // URL'deki prog korunur — ?prog=X#dersplanim bağlantısı sıyrılmasın.
  const prog = $('#dp-prog')?.value || new URLSearchParams(location.search).get('prog') || '';
  if (prog) p.set('prog', prog);
  if ($('#dp-open')?.checked) p.set('fopen', '1');
  if ($('#dp-cap')?.checked) p.set('fcap', '1');
  if ($('#dp-hide')?.checked) p.set('fhide', '1');
  const sems = [...document.querySelectorAll('#dp-sems input:checked')].map((x) => x.value);
  if (sems.length) p.set('fsems', sems.join(','));
  const types = [...document.querySelectorAll('#dp-types .on')].map((x) => x.dataset.type);
  if (types.length) p.set('ftypes', types.join(','));
  // Ders Planım'ın kendi dönem seçici (#dp-term) vardır; courses'in state.termSlug'u
  // değil. Henüz render edilmemişse (?.value undefined) term URL'e yazılmaz.
  const dpTerm = $('#dp-term')?.value || '';
  if (state.index && dpTerm && dpTerm !== state.index.currentSlug) p.set('term', dpTerm);
  return p;
}

// URL'yi sekmeye göre kapsar: query'de yalnızca görünümün parametreleri kalır
// (term global). Sekme değişiminde hedef görünüme ait olmayanlar düşer; dersler
// ve dersplanim filtreleri DOM'da durduğundan geri dönünce yeniden yazılır.
// Diğer görünümler mevcut query'yi hedef görünümün parametrelerine göre kapsar
// (örn. onsart'ta ?prog&pool korunur — seçmeli havuz paylaşım linki). push=true →
// tarayıcı geçmişi (geri/ileri), değilse mevcut giriş (filtre değişimi).
function writeViewUrl(view, push) {
  const h = location.hash.slice(1);
  const isDetail = h.startsWith('ders/');
  const hash = (view === 'dersler' && isDetail) ? h : view;
  let p;
  if (view === 'dersler') p = derslerParams();
  else if (view === 'dersplanim') p = dersplanimParams();
  else p = scopeParams(view, new URLSearchParams(location.search));
  if (view !== 'dersler' && state.index && state.termSlug && state.termSlug !== state.index.currentSlug) {
    p.set('term', state.termSlug);
  }
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '') + '#' + hash;
  if (push) history.pushState(null, '', url);
  else history.replaceState(null, '', url);
}

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
      if (active) {
        // Mobilde kaydırılabilir çubukta aktif sekme görünüme gelsin.
        b.scrollIntoView({ inline: 'center', block: 'nearest' });
      }
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
    if (view === 'dersplanim') dersplanimShow();
    if (view === 'onsart') PrereqGraph.init('#pg-root');
    // Program oluşturucu ve Ders Planım daha geniş alan kullanır.
    const mainEl = document.querySelector('main.wrap');
    if (mainEl) mainEl.classList.toggle('wide', view === 'program' || view === 'dersplanim');
    writeViewUrl(view, push);
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
    openDetailFromHash(v);
  });
}

// Paylaşılabilir ders detay bağlantısı: #ders/BLG%20102E → dersler sekmesinde
// o dersin detayını açar. openCourseDetail URL'yi bu biçime yazar.
function openDetailFromHash(h) {
  if (!h || !h.startsWith('ders/')) return;
  // #ders/EHB-222E (slug) veya eski #ders/EHB%20222E (kodlu) — ikisini de çöz.
  const code = slugToCode(decodeURIComponent(h.slice(5))).trim();
  if (code) openCourseDetail(code, { source: 'link' });
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

// "derslerde aç" — dersler sekmesine geçip aramayı/filtreyi doldurur. detail:
// string ise arama (eski çağrılar), nesne ise { q, program }.
window.addEventListener('itu:goto-courses', (e) => {
  const d = e.detail;
  const q = typeof d === 'string' ? d : (d?.q ?? '');
  if (showView) showView('dersler', true);
  $('#q').value = q;
  if (typeof d === 'object' && d?.program) $('#f-program').value = d.program;
  applyFilters();
});

// Tüm arama alanlarına ortak iyileştirme: içerik varken sağda × temizleme
// düğmesi + Esc ile temizleme (Critique: arama görünümü tekil).
function enhanceSearchInputs() {
  for (const input of document.querySelectorAll('.query input, .pg-search')) {
    const wrap = input.closest('.query');
    if (!wrap) continue;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'search-clear';
    btn.setAttribute('aria-label', 'Aramayı temizle');
    btn.textContent = '×';
    wrap.appendChild(btn);
    const sync = () => { btn.hidden = input.value.length === 0; };
    input.addEventListener('input', sync);
    sync();
    btn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.focus();
      sync();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && input.value) btn.click();
    });
  }
}

// Global arama kısayolu: "/" veya Ctrl/Cmd+K → Dersler arama kutusuna odaklan.
// (Critique-Alex: güçlü kullanıcı 8 sekme geçmeden aramaya atlayabilsin.)
function wireSearchShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea')) return;
    if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)))) {
      e.preventDefault();
      const q = $('#q');
      if (q) { showView('dersler', true); q.focus(); q.select(); }
    }
  });
}

// Hakkında sekmesindeki curl örneklerine sitenin gerçek adresini yazar.
function fillHost() {
  const host = location.host + location.pathname.replace(/\/$/, '');
  for (const el of document.querySelectorAll('.prose .host')) el.textContent = host;
  for (const el of document.querySelectorAll('.prose .var')) el.textContent = state.index.currentSlug;
}

boot();
