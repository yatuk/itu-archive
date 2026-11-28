/* Mobil kabuk (yalnız sade tema, ≤600px).
   Uygulamanın kendi sekme çubuğu (.app-tabs) mobilde alt sekme çubuğuna
   dönüşür: dört birincil görünüm + "Daha fazla". Daha fazla, ikincil görünümleri
   ve tema/dil ayarlarını alttan açılan bir sayfada (sheet) toplar. Müfredat
   sekmesinde seçili program tek bir özet kartında tam adıyla görünür; seçiciler
   kesilen <select>'ler yerine yine sayfada, satır kıran listeler olarak açılır.

   Bu modül yalnız DOM ekler ve mevcut denetimleri (sekme bağlantıları, tema
   düğmeleri, dil düğmesi, Müfredat seçicileri) TIKLAR / DEĞİŞTİRİR; kendi
   durumunu tutmaz. Görsel kuralların tamamı style.css'teki "MOBİL KABUK"
   bölümündedir ve `html.mshell[data-theme="sade"]` ile sınırlıdır: fosfor
   (data-theme="dark") ve masaüstü bu modülden etkilenmez. */

import { I18N } from './i18n.js?v=dde1e9339338';

const MOBILE = '(max-width: 600px)';
const PRIMARY = ['dersler', 'program', 'dersplanim', 'onsart'];
const SECONDARY = ['sinavlar', 'takvim', 'gecmis', 'donemler', 'hakkinda'];

const ICONS = {
  dersler: '<path d="M4 5h16M4 10h16M4 15h10M4 20h7"/>',
  program: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  dersplanim: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M7 9.5V15c0 1.5 2.2 3 5 3s5-1.5 5-3V9.5"/>',
  onsart: '<rect x="3" y="3" width="7" height="6" rx="2"/><rect x="14" y="15" width="7" height="6" rx="2"/><path d="M6.5 9v3.5a2.5 2.5 0 0 0 2.5 2.5h5"/>',
  more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const SHORT_KEYS = { dersler: 'mshTabDersler', program: 'mshTabProgram', dersplanim: 'mshTabPlan', onsart: 'mshTabOnsart' };
const DESC_KEYS = {
  sinavlar: 'mshDescSinavlar', takvim: 'mshDescTakvim', gecmis: 'mshDescGecmis',
  donemler: 'mshDescDonemler', hakkinda: 'mshDescHakkinda',
};
const TAB_KEYS = {
  sinavlar: 'tabSinavlar', takvim: 'tabTakvim', gecmis: 'tabGecmis', donemler: 'tabDonemler', hakkinda: 'tabHakkinda',
};

const t = (k, vars) => I18N.t(k, vars);
const svg = (name, size = 24) =>
  `<svg class="mshell-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isSade = () => document.documentElement.getAttribute('data-theme') === 'sade';
const isActive = () => isSade() && window.matchMedia(MOBILE).matches;

let sheet = null;
let scrim = null;
let lastFocus = null;
let sheetMode = '';

/* ---------- alt sekme çubuğu ---------- */

function enhanceTabs() {
  const nav = document.querySelector('.tabs.app-tabs');
  if (!nav || nav.querySelector('.mshell-more')) return;
  for (const view of PRIMARY) {
    const a = nav.querySelector(`[data-view="${view}"]`);
    if (!a) continue;
    a.insertAdjacentHTML('afterbegin', `<span class="mshell-ico" aria-hidden="true">${svg(view)}</span>`);
    a.insertAdjacentHTML('beforeend', `<span class="mshell-short">${escHtml(t(SHORT_KEYS[view]))}</span>`);
  }
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'mshell-more';
  more.setAttribute('aria-haspopup', 'dialog');
  more.setAttribute('aria-expanded', 'false');
  more.innerHTML = `<span class="mshell-ico" aria-hidden="true">${svg('more')}</span><span class="mshell-more-label">${escHtml(t('mshMore'))}</span>`;
  more.addEventListener('click', () => openSheet('more', more));
  nav.append(more);
}

/* ---------- sayfa (sheet) ---------- */

function ensureSheet() {
  if (sheet) return;
  scrim = document.createElement('div');
  scrim.className = 'mshell-scrim';
  scrim.hidden = true;
  scrim.addEventListener('click', closeSheet);
  sheet = document.createElement('div');
  sheet.className = 'mshell-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'mshell-sheet-title');
  sheet.hidden = true;
  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (e.key !== 'Tab') return;
    // Odak sayfanın içinde döner (aria-modal).
    const f = [...sheet.querySelectorAll('button, [href], select, input')].filter((el) => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  sheet.addEventListener('click', onSheetClick);
  document.body.append(scrim, sheet);
}

function head(title) {
  return `<div class="mshell-grab" aria-hidden="true"></div>
    <div class="mshell-sh-head"><h2 id="mshell-sheet-title">${escHtml(title)}</h2>
    <button type="button" class="mshell-close" data-mshell-close aria-label="${escHtml(t('mshClose'))}">${svg('close', 22)}</button></div>`;
}

function renderMore() {
  const active = document.documentElement.dataset.activeView || '';
  const items = SECONDARY.filter((v) => document.getElementById(`tab-${v}`)).map((v) => `
    <button type="button" class="mshell-mi" data-mshell-view="${v}"${active === v ? ' aria-current="page"' : ''}>
      <span class="mshell-mi-t"><b>${escHtml(t(TAB_KEYS[v]))}</b><span>${escHtml(t(DESC_KEYS[v]))}</span></span>${svg('right', 18)}
    </button>`).join('');
  const themeName = isSade() ? t('mshThemeSade') : t('mshThemeFosfor');
  const langName = I18N.lang === 'en' ? 'English' : 'Türkçe';
  return head(t('mshMore')) + `<div class="mshell-sh-body">
    <nav class="mshell-menu" aria-label="${escHtml(t('mshMore'))}">${items}</nav>
    <div class="mshell-menu"><button type="button" class="mshell-mi" data-mshell-settings>
      <span class="mshell-mi-t"><b>${escHtml(t('mshSettings'))}</b><span>${escHtml(themeName)} · ${escHtml(langName)}</span></span>${svg('right', 18)}
    </button></div></div>`;
}

function renderSettings() {
  const cur = isSade() ? 'sade' : 'dark';
  const themes = [
    ['sade', t('mshThemeSade'), t('mshThemeSadeSub')],
    ['dark', t('mshThemeFosfor'), t('mshThemeFosforSub')],
  ];
  const term = document.getElementById('stat-term')?.textContent?.trim();
  const scraped = document.getElementById('stat-scraped')?.textContent?.trim();
  const info = term && term !== '·' ? `<p class="mshell-datainfo">${escHtml(t('mshDataInfo', { term, time: scraped || '·' }))}</p>` : '';
  return head(t('mshSettings')) + `<div class="mshell-sh-body">
    <h3 class="mshell-field">${escHtml(t('mshTheme'))}</h3>
    <div class="mshell-grid2" role="group" aria-label="${escHtml(t('mshTheme'))}">${themes.map(([v, name, sub]) => `
      <button type="button" class="mshell-opt mshell-theme" data-mshell-theme="${v}" aria-pressed="${v === cur}">
        <span class="mshell-sw mshell-sw-${v}" aria-hidden="true"><i></i><i></i><i></i></span>
        <b>${escHtml(name)}</b><small>${escHtml(sub)}</small></button>`).join('')}</div>
    <h3 class="mshell-field">${escHtml(t('mshLang'))}</h3>
    <div class="mshell-grid2" role="group" aria-label="${escHtml(t('mshLang'))}">
      <button type="button" class="mshell-opt" data-mshell-lang="tr" aria-pressed="${I18N.lang !== 'en'}" lang="tr">Türkçe</button>
      <button type="button" class="mshell-opt" data-mshell-lang="en" aria-pressed="${I18N.lang === 'en'}" lang="en">English</button>
    </div>${info}</div>`;
}

/* ---------- Müfredat: program özeti + seçici sayfası ---------- */

const sel = (id) => document.getElementById(id);
const selectedText = (s) => (s && s.selectedIndex >= 0 && s.value ? s.options[s.selectedIndex].textContent.trim() : '');

function optionList(s, name, { grid = false } = {}) {
  if (!s) return '';
  const opts = [...s.options].filter((o) => o.value);
  if (!opts.length) {
    const ph = s.options[0]?.textContent?.trim();
    return ph ? `<p class="mshell-note">${escHtml(ph)}</p>` : '';
  }
  if (grid) {
    return `<div class="mshell-grid2" role="radiogroup" aria-label="${escHtml(name)}">${opts.map((o) => `
      <button type="button" class="mshell-opt" role="radio" aria-checked="${o.value === s.value}" data-mshell-set="${s.id}" data-value="${escHtml(o.value)}">${escHtml(o.textContent.trim())}</button>`).join('')}</div>`;
  }
  return `<div class="mshell-radios" role="radiogroup" aria-label="${escHtml(name)}">${opts.map((o) => `
    <button type="button" class="mshell-radio" role="radio" aria-checked="${o.value === s.value}" data-mshell-set="${s.id}" data-value="${escHtml(o.value)}">
      <span class="mshell-r" aria-hidden="true"></span><span class="mshell-rt">${escHtml(o.textContent.trim())}</span></button>`).join('')}</div>`;
}

// Plan sürümü (#dp-ver): yalnız programın birden çok sürümü (seçeneği) varsa.
function versionField() {
  const s = sel('dp-ver');
  if (!s || s.options.length < 2) return '';
  return `<h3 class="mshell-field">${escHtml(t('mshPlanVersion'))}</h3>${optionList(s, t('mshPlanVersion'))}`;
}

function renderPicker() {
  return head(t('mshPickTitle')) + `<div class="mshell-sh-body">
    <h3 class="mshell-field">${escHtml(t('mshLevel'))}</h3>${optionList(sel('dp-level'), t('mshLevel'), { grid: true })}
    <h3 class="mshell-field">${escHtml(t('mshFaculty'))}</h3>${optionList(sel('dp-fac'), t('mshFaculty'))}
    <h3 class="mshell-field">${escHtml(t('mshProgram'))}</h3>${optionList(sel('dp-prog'), t('mshProgram'))}${versionField()}
    <h3 class="mshell-field">${escHtml(t('mshTerm'))}</h3>${optionList(sel('dp-term'), t('mshTerm'))}
    </div><div class="mshell-sh-foot"><button type="button" class="mshell-apply" data-mshell-close>${escHtml(t('mshApply'))}</button></div>`;
}

function syncProgramCard() {
  const prog = sel('dp-prog');
  const pick = prog?.closest('[role="group"]');
  if (!prog || !pick) return;
  let card = document.querySelector('.mshell-prog');
  if (!card) {
    card = document.createElement('div');
    card.className = 'mshell-prog';
    card.innerHTML = `<div class="mshell-prog-t"><div class="mshell-prog-k">${escHtml(t('mshProgram'))}</div>
      <div class="mshell-prog-v"></div><div class="mshell-prog-d"></div></div>
      <button type="button" class="mshell-prog-change" aria-haspopup="dialog">${escHtml(t('mshChange'))}</button>`;
    card.querySelector('.mshell-prog-change').addEventListener('click', (e) => openSheet('picker', e.currentTarget));
    pick.before(card);
  }
  const name = selectedText(prog);
  // Program seçilmeden önce seçiciler yerinde kalır; seçildikten sonra özet kart.
  if (card.hidden !== !name) card.hidden = !name;
  if (name && !pick.hasAttribute('data-mshell-collapsed')) pick.setAttribute('data-mshell-collapsed', '');
  else if (!name && pick.hasAttribute('data-mshell-collapsed')) pick.removeAttribute('data-mshell-collapsed');
  // Yalnız değişince yaz: MutationObserver kendi yazımızla döngüye girmesin.
  const setText = (q, v) => { const el = card.querySelector(q); if (el.textContent !== v) el.textContent = v; };
  setText('.mshell-prog-v', name);
  // Eski bir plan sürümü seçiliyse (güncel ilk seçenektir) özet onu da söyler.
  const ver = sel('dp-ver');
  const verText = ver && ver.options.length > 1 && ver.selectedIndex > 0 ? selectedText(ver) : '';
  setText('.mshell-prog-d', [selectedText(sel('dp-level')), selectedText(sel('dp-term')), verText].filter(Boolean).join(' · '));
}

function watchPlan() {
  const root = document.getElementById('view-dersplanim');
  if (!root) return;
  let queued = false;
  const update = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncProgramCard();
      if (sheetMode === 'picker' && sheet && !sheet.hidden) rerender();
    });
  };
  // Görünüm tembel kurulur ve seçenekler sonradan dolar: değişiklikleri izle.
  new MutationObserver(update).observe(root, { childList: true, subtree: true });
  root.addEventListener('change', update);
}

/* ---------- açma / kapama ---------- */

function rerender() {
  const body = sheet.querySelector('.mshell-sh-body');
  const scroll = body ? body.scrollTop : 0;
  sheet.innerHTML = sheetMode === 'more' ? renderMore() : sheetMode === 'settings' ? renderSettings() : renderPicker();
  sheet.dataset.mode = sheetMode;
  const nb = sheet.querySelector('.mshell-sh-body');
  if (nb) nb.scrollTop = scroll;
}

function openSheet(mode, opener) {
  ensureSheet();
  if (sheet.hidden) lastFocus = opener || document.activeElement;
  sheetMode = mode;
  rerender();
  sheet.querySelector('.mshell-sh-body').scrollTop = 0;
  scrim.hidden = false;
  sheet.hidden = false;
  document.documentElement.classList.add('mshell-open');
  document.querySelector('.mshell-more')?.setAttribute('aria-expanded', String(mode !== 'picker'));
  sheet.querySelector('.mshell-close')?.focus();
}

function closeSheet() {
  if (!sheet || sheet.hidden) return;
  sheet.hidden = true;
  scrim.hidden = true;
  sheetMode = '';
  document.documentElement.classList.remove('mshell-open');
  document.querySelector('.mshell-more')?.setAttribute('aria-expanded', 'false');
  if (lastFocus && document.contains(lastFocus) && lastFocus.offsetParent !== null) lastFocus.focus();
  lastFocus = null;
}

function onSheetClick(e) {
  const el = e.target.closest('button');
  if (!el || !sheet.contains(el)) return;
  if (el.hasAttribute('data-mshell-close')) { closeSheet(); return; }
  if (el.dataset.mshellView) {
    const tab = document.getElementById(`tab-${el.dataset.mshellView}`);
    closeSheet();
    tab?.click();
    window.scrollTo({ top: 0 });
    return;
  }
  if (el.hasAttribute('data-mshell-settings')) { sheetMode = 'settings'; rerender(); sheet.querySelector('.mshell-close')?.focus(); return; }
  if (el.dataset.mshellTheme) {
    document.querySelector(`.theme-btn[data-theme="${el.dataset.mshellTheme}"]`)?.click();
    // Fosfor seçildiyse mobil kabuk kapanır: fosfor yerleşimi değişmez.
    if (!isSade()) closeSheet(); else rerender();
    return;
  }
  if (el.dataset.mshellLang) {
    if ((I18N.lang === 'en') !== (el.dataset.mshellLang === 'en')) document.getElementById('lang-btn')?.click();
    return;
  }
  if (el.dataset.mshellSet) {
    const s = sel(el.dataset.mshellSet);
    if (!s || s.value === el.dataset.value) return;
    s.value = el.dataset.value;
    s.dispatchEvent(new Event('change', { bubbles: true }));
    rerender();
  }
}

export function initMobileShell() {
  document.documentElement.classList.add('mshell');
  enhanceTabs();
  watchPlan();
  // Tema masaüstüne/fosfora geçince ya da pencere genişleyince sayfa kapanır.
  const mq = window.matchMedia(MOBILE);
  const onChange = () => { if (!isActive()) closeSheet(); };
  mq.addEventListener?.('change', onChange);
  new MutationObserver(onChange).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  // Sekme değişince açık sayfa kapanır.
  window.addEventListener('popstate', closeSheet);
}
