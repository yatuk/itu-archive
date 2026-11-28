/* İTÜ Ders Arşivi — giriş noktası.
   Yalnızca başlatmayı, sekme yönlendirmesini ve statik üst bilgiyi yönetir;
   her sekmenin mantığı views/ altındaki kendi modülünde. Tüm veri docs/data
   altındaki statik JSON'lardan geliyor; sunucu tarafı yok. */

import { $, getJSON, fmtDate, esc, setStatus, formatInt } from './core/utils.js?v=dde1e9339338';
import { state, markIndexReady, indexReady } from './core/store.js?v=dde1e9339338';
import { I18N } from './i18n.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from './core/persistence.js?v=dde1e9339338';
import { initCourses, loadTerm, applyFilters, syncProgramFilter, restoreCourseSort } from './views/courses.js?v=dde1e9339338';
import { openCourseDetail, prefetchCourseDetail, wireCourseDetailEvents } from './core/detail-loader.js';
import { loadStyle } from './core/lazy-style.js';
import { methodToCode, codeToMethod, slugToCode, scopeParams } from './core/urlcodes.js?v=dde1e9339338';
import { syncStaticCanonical } from './core/canonical.js?v=dde1e9339338';

// Dersler dışındaki sekmeler ilk açılışlarında yüklenir: modül (dinamik
// import) ve css/<ad>.css parçası birlikte gelir, görünüm ikisi hazır olunca
// gösterilir. İlk boyamada yalnız Dersler'in modül grafiği ve çekirdek CSS iner.
let termsRendered = false;
const renderTermsOnce = async (m) => {
  if (termsRendered) return;
  termsRendered = true;
  if (!state.index) await indexReady;
  if (state.index) m.renderTerms();
};
const LAZY_VIEWS = {
  gecmis: { style: 'gecmis', load: () => import('./views/history.js'), show: (m) => m.onShow() },
  dersplanim: { style: 'dersplanim', load: () => import('./views/dersplanim.js'), show: (m) => m.onShow() },
  onsart: { style: 'onsart', load: () => import('./prereq.js'), show: (m) => m.PrereqGraph.init('#pg-root') },
  sinavlar: { style: 'sinavlar', load: () => import('./views/exams.js'), show: (m) => m.onShow() },
  takvim: { style: 'takvim', load: () => import('./views/calendar.js'), show: (m) => m.onShow() },
  donemler: { style: 'donemler', load: () => import('./views/terms.js'), show: renderTermsOnce },
  hakkinda: { style: 'hakkinda', load: () => import('./views/terms.js'), show: renderTermsOnce },
  program: { style: 'program', load: () => import('./views/program.js'), show: (m) => m.onShow() },
};
const viewLoads = new Map();
const lazyEntry = (view) => (Object.hasOwn(LAZY_VIEWS, view) ? LAZY_VIEWS[view] : null);

// Sekmenin modülünü ve stilini yükler; çözülen değer modüldür.
function loadView(view) {
  const entry = lazyEntry(view);
  if (!entry) return Promise.resolve(null);
  if (!viewLoads.has(view)) {
    const promise = Promise.all([entry.load(), loadStyle(entry.style)]).then(([mod]) => {
      entry.mod = mod;
      return mod;
    });
    promise.catch(() => viewLoads.delete(view)); // sonraki açılışta yeniden dene
    viewLoads.set(view, promise);
  }
  return viewLoads.get(view);
}

// wireTabs içinde atanır; dış olaylar (örn. detay panelinden geçmişe atlama)
// sekme değiştirmek için bunu kullanır.
let showView = null;

// İlk açılıştaki sekme. `boot` index.json'u yükledikten sonra uygulanır;
// böylece program/takvim/sınavlar gibi veriye bağımlı görünümler (ör. paylaşılan
// #program bağlantısı) boş select'lerle erken render edilmez.
const pendingView = location.hash.slice(1);

async function boot() {
  syncStaticCanonical(); // ?code=/?branch= derin bağlantısında canonical statik sayfaya
  I18N.translateDOM();
  initTheme();
  initLangButton();
  wireTabs();
  wireHistoryJump();
  wireCourseDetailEvents();
  window.addEventListener('itu:goto-program', () => { if (showView) showView('program', true); });
  // Program modülü tembel yüklendiğinden "programa ekle" olayı burada
  // karşılanır; modül hazır olunca işlenir (Ders Planım, detay paneli).
  window.addEventListener('itu:add-program-items', (e) => {
    loadView('program')
      .then((m) => m.addProgramItems(e.detail || {}))
      .catch((error) => console.error('Program modülü yüklenemedi:', error));
  });
  // Paylaşılan sekme/detay bağlantısında o sekmenin modülü ve stili index.json
  // ile paralel inmeye başlasın.
  if (lazyEntry(pendingView)) loadView(pendingView).catch(() => {});
  else if (pendingView.startsWith('ders/')) prefetchCourseDetail();
  try {
    state.index = await getJSON('data/index.json');
  } catch (e) {
    markIndexReady(); // yükleme başarısız olsa da bekleyenleri serbest bırak
    setStatus($('#stat-status'), I18N.t('statVeriYok'), { error: true });
    $('#rows').innerHTML = `<p class="empty error">${esc(I18N.t('courseDataError', { msg: e.message }))}</p>`;
    window.__ituAppFailed?.('data');
    return;
  }

  const ix = state.index;
  state.scrapedAt = ix.scrapedAt || null;
  state.stale = state.scrapedAt ? (Date.now() - new Date(state.scrapedAt).getTime()) / 36e5 > 48 : false;
  $('#stat-status').textContent = I18N.t('statOnline');
  $('#stat-status').className = 'ok';
  $('#stat-term').textContent = ix.currentTerm || '·';
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
    state.scrapedAt = st.lastSuccessAt;
    state.freeze = st.freeze || null;
    // Donmuş dönemde tarama bilerek durur; "veri bayat" uyarısı yanıltıcı olur.
    const frozen = Boolean(st.freeze && st.freeze.frozen);
    state.stale = !frozen && (Date.now() - last.getTime()) / 36e5 > 48;
    if (state.stale) {
      const stEl = $('#stat-status');
      if (stEl) {
        stEl.textContent = 'veri bayat: son başarılı tarama 2 günden eski';
        stEl.className = 'warn';
      }
    }
    if (state.rows.length) applyFilters();
  }).catch(() => {});

  // Footer'daki gerçek ziyaret sayısı: Cloudflare Analytics'i doğrudan
  // sorgulayamayız (API token'ı tarayıcıya konulamaz) — ayrı, salt-okunur
  // bir Worker (cloudflare/stats-worker/) bu sayıyı sunucu tarafında
  // hesaplayıp döner. Worker deploy edilmemişse ya da erişilemiyorsa satır
  // gizli kalır; sahte/tahmini bir sayı asla gösterilmez. Yalnızca gerçek
  // alan adında denenir — yerelde/test'te var olmayan bir alt alan adına
  // fetch atmak, hiç yakalanamayan bir tarayıcı konsol hatası bırakır
  // (try/catch ağ hatasının kendisini gizlemez, yalnız reddi).
  if (location.hostname === 'itu-ders.com' || location.hostname === 'www.itu-ders.com') {
    fetch('https://stats.itu-ders.com/', { mode: 'cors' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !Number.isFinite(d.visits30d)) return;
        const row = $('#foot-visits-row');
        const cell = $('#foot-visits');
        if (!row || !cell) return;
        cell.textContent = `${formatInt(d.visits30d)}+`;
        row.hidden = false;
      })
      .catch(() => {});
  }

  // Dönem seçici (dersler görünümüne ait) + paylaşılabilir URL durumu.
  const termSel = $('#f-term');
  termSel.innerHTML = ix.terms
    .filter((t) => !t.missing)
    .map((t) => `<option value="${t.slug}">${t.label}${t.live ? ' · canlı' : ''}</option>`)
    .join('');
  const params = new URLSearchParams(location.search);
  const coursePref = readLocalState('itu-courses-state', { fallback: {}, validate: isPlainObject });
  const courseUrlKeys = ['term', 'q', 'branch', 'day', 'time', 'level', 'method', 'program', 'code', 'open', 'sort', 'sdir'];
  const explicitCourseState = pendingView === 'dersler' && courseUrlKeys.some((key) => params.has(key));
  const courseValue = (key, fallback = '') => params.has(key)
    ? params.get(key)
    : (!explicitCourseState && coursePref[key] != null ? coursePref[key] : fallback);
  let initialSlug = ix.currentSlug;
  const wantTerm = courseValue('term');
  if (wantTerm && ix.terms.some((t) => t.slug === wantTerm)) initialSlug = wantTerm;
  termSel.value = initialSlug;

  // Takvim yıl seçici.
  $('#f-year').innerHTML = ix.calendars.map((c) => `<option value="${c.yearId}">${c.label}</option>`).join('');

  fillHost();

  // Dersler görünümünün olay bağlantılarını kur; diğer görünümler ilk
  // açılışlarında kendi init'lerini çalıştırır (onShow → init).
  initCourses();
  warmCourseDetailOnIntent();
  enhanceSearchInputs();
  wireSearchShortcut();

  // İlk sekme artık veri hazırken açılır (paylaşılan #program/#takvim/#sinavlar
  // bağlantıları bu sayede doğru çalışır).
  // Hash, boot index.json'u beklerken değiştiyse (popstate o sekmeyi zaten
  // açtı) güncel hash kazanır; açılıştaki hash'e geri dönülmez. i18n.js
  // sözlüğü üst düzey await ile beklediğinden sayfa `load` olayı boot'tan önce
  // gelebilir ve bu pencere eskisinden geniştir.
  const startView = location.hash.slice(1);
  showView(VIEWS.includes(startView) ? startView : 'dersler', false);

  await loadTerm(initialSlug);
  // Paylaşılan #ders/<kod> bağlantısı: detay, aktif dönem yüklendikten sonra
  // açılır — aksi halde dönem bilinmeden "açık değil" gösterirdi.
  openDetailFromHash(pendingView);

  // Arama ve filtre durumunu URL'den uygula (loadTerm filtre seçeneklerini
  // yeniden kurduğu için bunları ondan sonra yazıyoruz).
  $('#q').value = courseValue('q');
  $('#f-branch').value = courseValue('branch');
  $('#f-day').value = courseValue('day');
  $('#f-time').value = courseValue('time');
  $('#f-level').value = courseValue('level', 'LS');
  // method URL'de kısa kodla (f/c/h) gelir; eski uzun biçim (geriye uyumlu)
  // aynen kabul edilir — applyFilters/saveState kısa koda çevirip sadeleştirir.
  if (courseValue('method')) {
    const m = courseValue('method');
    $('#f-method').value = codeToMethod(m) || m;
  }
  await syncProgramFilter(courseValue('program'));
  $('#f-code').value = courseValue('code');
  $('#f-open').checked = courseValue('open') === '1' || courseValue('open') === true;
  // "geçtiklerimi gizle" kişisel veriye bağlı: yalnız bu tarayıcının tercihi, URL'ye girmez.
  if ($('#f-taken-hide')) $('#f-taken-hide').checked = coursePref.hideTaken === true;
  const wantedSort = courseValue('sort', 'crn');
  restoreCourseSort(wantedSort, courseValue('sdir', coursePref.dir || 1));
  applyFilters();
    window.__ituAppReady?.();
}

/* ---------- tema ---------- */

function initTheme() {
  const btns = [...document.querySelectorAll('.theme-btn')];
  const domApply = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    // Tarayıcı çubuğu sayfa zeminiyle aynı kalsın (mobilde görünür).
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0a0a' : '#f4f6f4');
    for (const b of btns) {
      b.setAttribute('aria-pressed', String(b.dataset.theme === t));
      b.tabIndex = b.dataset.theme === t ? 0 : -1;
    }
  };
  const apply = (t) => {
    domApply(t);
    writeLocalState('itu-theme', t, { validate: (value) => value === 'sade' || value === 'dark' });
    // İlk CSS boyamasından önce çalışan küçük inline bootstrap için uyumluluk aynası.
    try { localStorage.setItem('itu-theme', t); } catch (e) {}
  };
  // Yalnızca sade (ana) ve dark (seçenek) var. Eski light/contrast/auto
  // tercihleri kaldırılan temalara karşılık gelir — sade'ye düşer (yoksa
  // :root koyusu görünürdü, çünkü light/contrast CSS blokları silindi).
  let cur = 'sade';
  cur = readLocalState('itu-theme', {
    fallback: 'sade', legacyKey: 'itu-theme', parseLegacy: (raw) => raw,
    validate: (value) => value === 'sade' || value === 'dark',
  });
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
  if ($('#f-level').value && $('#f-level').value !== 'LS') p.set('level', $('#f-level').value);
  const method = methodToCode($('#f-method').value);
  if (method) p.set('method', method);
  if ($('#f-program').value) p.set('program', $('#f-program').value);
  if ($('#f-code').value.trim()) p.set('code', $('#f-code').value.trim());
  if ($('#f-open').checked) p.set('open', '1');
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
  // Dokuz sekme tek, yatay kayan satırda: altı birincil görünüm, ince bir
  // ayraç, ardından üç ikincil görünüm. "Daha fazla" menüsü yoktur.
  const buttons = [...document.querySelectorAll('.tabs [data-view]')];

  // Kaydırılabilir sekme rayı: kenar solması yalnızca gerçekten devamı olan
  // tarafta görünür; rayın başındaki aktif sekme solgun çizilmez.
  const rail = document.querySelector('.tabs');
  const updateRailFade = () => {
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const start = rail.scrollLeft > 2;
    const end = rail.scrollLeft < max - 2;
    rail.dataset.fade = max <= 2 ? 'none' : start && end ? 'both' : start ? 'start' : 'end';
  };
  if (rail) {
    rail.addEventListener('scroll', updateRailFade, { passive: true });
    window.addEventListener('resize', updateRailFade, { passive: true });
  }

  let showSeq = 0;
  const show = (view, push) => {
    for (const b of buttons) {
      const active = b.dataset.view === view;
      b.setAttribute('aria-selected', String(active));
      if (active) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
      b.tabIndex = active ? 0 : -1; // roving tabindex: klavye dolaşımı
      if (active) {
        // Mobilde kaydırılabilir çubukta aktif sekme görünüme gelsin.
        b.scrollIntoView({ inline: 'center', block: 'nearest' });
      }
    }
    updateRailFade();
    // URL sahipliği hemen yeni sekmeye geçer (core/utils.js isViewVisible).
    document.documentElement.dataset.activeView = view;
    const seq = ++showSeq;
    const entry = lazyEntry(view);
    const reveal = (mod) => {
      if (seq !== showSeq) return; // bu arada başka bir sekmeye geçildi
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
      if (entry && mod) entry.show(mod);
      // Program oluşturucu ve Ders Planım daha geniş alan kullanır.
      const mainEl = document.querySelector('main.wrap');
      if (mainEl) mainEl.classList.toggle('wide', view === 'program' || view === 'dersplanim');
      writeViewUrl(view, push);
    };
    // Sekme ilk kez açılıyorsa modülü ve stili gelene kadar önceki görünüm
    // ekranda kalır (stilsiz içerik ya da boş alan görünmez); sonraki
    // açılışlar eskisi gibi eşzamanlıdır.
    if (!entry) reveal(null);
    else if (entry.mod) reveal(entry.mod);
    else {
      loadView(view).then(reveal, (error) => {
        console.error(`"${view}" sekmesi yüklenemedi:`, error);
        reveal(null);
      });
    }
  };
  showView = show;

  for (const b of buttons) {
    b.addEventListener('click', (ev) => {
      // Gerçek bağlantılar Ctrl/Cmd/Shift ve orta tıkta tarayıcının doğal
      // yeni sekme davranışını korur. Yalnızca düz sol tık SPA içinde açılır.
      if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      show(b.dataset.view, true);
    });
    // Sekmeler arasında ok tuşlarıyla dolaşım (kapsayıcı klavye erişimi).
    b.addEventListener('keydown', (ev) => {
      const visible = buttons.filter((x) => x.offsetParent !== null);
      const idx = visible.indexOf(b);
      let next = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (idx + 1) % visible.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (idx - 1 + visible.length) % visible.length;
      else return;
      ev.preventDefault();
      visible[next].focus();
      show(visible[next].dataset.view, true);
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
  window.addEventListener('itu:goto-history', async (e) => {
    const q = String(e.detail || '').trim();
    let historyView;
    try {
      historyView = await loadView('gecmis');
    } catch (error) {
      console.error('Geçmiş sekmesi yüklenemedi:', error);
      return;
    }
    if (showView) showView('gecmis', true);
    $('#hq').value = q;
    historyView.onShow();
    historyView.searchHistory();
  });
}

// Ders detay paneli ilk boyamaya girmez; kullanıcı listeye dokunduğu ya da
// klavyeyle odaklandığı an önceden çekilir ki ilk açılış beklemesin.
function warmCourseDetailOnIntent() {
  const view = $('#view-dersler');
  if (!view) return;
  const warm = () => {
    for (const type of ['pointerdown', 'focusin']) view.removeEventListener(type, warm);
    prefetchCourseDetail();
  };
  for (const type of ['pointerdown', 'focusin']) view.addEventListener(type, warm, { passive: true });
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
    btn.setAttribute('aria-label', I18N.t('searchClear'));
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

// Global kısayollar: "/" → Dersler arama kutusuna odaklan (Critique-Alex:
// güçlü kullanıcı 8 sekme geçmeden aramaya atlayabilsin). Ctrl/Cmd+K → komut
// paleti (core/palette.js, ilk açılışta tembel yüklenir); yazı alanındayken de
// çalışır. Başlıktaki arama düğmesi (dar ekran) ve kutudaki ipucu aynı paleti açar.
let paletteModule = null;
function loadPalette() {
  if (!paletteModule) {
    paletteModule = import('./core/palette.js');
    paletteModule.catch(() => { paletteModule = null; });
  }
  return paletteModule;
}
function openCommandPalette() {
  loadPalette()
    .then((m) => m.togglePalette({ showView: (view) => showView && showView(view, true) }))
    .catch((error) => console.error('Komut paleti yüklenemedi:', error));
}

function wireSearchShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.key && e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      openCommandPalette();
      return;
    }
    if (e.target.closest('input, select, textarea')) return;
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const q = $('#q');
      if (q) { showView('dersler', true); q.focus(); q.select(); }
    }
  });
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  for (const hint of document.querySelectorAll('.cmdk-hint')) hint.textContent = mac ? '⌘ K' : 'Ctrl K';
  for (const btn of document.querySelectorAll('[data-cmdk-open]')) btn.addEventListener('click', openCommandPalette);
}

// Hakkında sekmesindeki curl örneklerine sitenin gerçek adresini yazar.
function fillHost() {
  const host = location.host + location.pathname.replace(/\/$/, '');
  for (const el of document.querySelectorAll('.prose .host')) el.textContent = host;
  for (const el of document.querySelectorAll('.prose .var')) el.textContent = state.index.currentSlug;
  const rawCSV = document.querySelector('.raw-current-csv');
  const rawBranch = document.querySelector('.raw-current-branch');
  if (rawCSV) rawCSV.href = `/data/terms/${encodeURIComponent(state.index.currentSlug)}/all.csv`;
  if (rawBranch) rawBranch.href = `/data/terms/${encodeURIComponent(state.index.currentSlug)}/branches/BIL.json`;
}

boot().catch((error) => {
  console.error('Uygulama başlatılamadı:', error);
  window.__ituAppFailed?.('boot');
});
