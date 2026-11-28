// Ctrl/Cmd+K komut paleti: tek giriş kutusu, gruplu sonuçlar.
//   Dersler  — kod/ad → ders detay paneli
//   CRN      — şube numarası → o şubeye odaklı detay paneli
//   Hocalar  — öğretim üyesi → Dersler'de o hocanın araması
//   Sayfalar — sekmeler ve iki araç sayfası
// Veri, uygulamanın Dersler için zaten yüklediği dönem arama dizisidir
// (search.json: [crn, kod, ad, bölüm, hoca, …]); yüklenmemişse ilk açılışta
// çekilir. Modül app.js'ten ilk Ctrl+K'da tembel yüklenir.
//
// Erişilebilirlik: role="dialog" aria-modal, giriş role="combobox" +
// aria-activedescendant, sonuçlar role="listbox" içinde role="group"lar.
// Odak hep giriş kutusunda kalır; Esc kapatır ve odağı açan öğeye geri verir.

import { getJSON, esc, fold } from './utils.js';
import { state, indexReady } from './store.js';
import { I18N } from '../i18n.js';
import { openCourseDetail } from './detail-loader.js';

const t = (key, vars) => I18N.t(key, vars);
const GROUP_MAX = 8;

// Sayfalar: sekmeler (SPA içi) ve ayrı araç sayfaları. kw: ek arama sözcükleri.
const PAGES = [
  { view: 'dersler', label: 'tabDersler', kw: 'courses ders arama sube' },
  { view: 'dersplanim', label: 'tabDersplanim', kw: 'mufredat gpa gano not transkript curriculum' },
  { view: 'onsart', label: 'tabOnsart', kw: 'onsart prerequisite harita' },
  { view: 'sinavlar', label: 'tabSinavlar', kw: 'sinav exam final vize' },
  { view: 'takvim', label: 'tabTakvim', kw: 'takvim calendar akademik' },
  { view: 'program', label: 'tabProgram', kw: 'program haftalik schedule cizelge' },
  { view: 'gecmis', label: 'tabGecmis', kw: 'gecmis history arsiv' },
  { view: 'donemler', label: 'tabDonemler', kw: 'donem terms' },
  { view: 'hakkinda', label: 'tabHakkinda', kw: 'hakkinda about api' },
  { href: '/gano-hesaplama/', label: 'cmdkPageGpaCalc', kw: 'gano gpa hesaplama hesapla calculator' },
  { href: '/kontenjan/', label: 'cmdkPageQuota', kw: 'kontenjan bos yer quota capacity' },
];

const NO_INSTRUCTOR = new Set(['', '-', '--', '·', '.', '***']);

// Büyük/küçük ve aksan duyarsız, Türkçe İ/ı farkında katlama.
export function paletteNorm(s) {
  return fold(String(s ?? '')).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}
const compact = (s) => s.replace(/\s+/g, '');

// Saf: arama dizisinden palet indeksi. Ders başına tek kayıt, hoca başına tek kayıt.
export function buildPaletteIndex(rows) {
  const courses = new Map();
  const crns = new Map();
  const instructors = new Map();
  for (const r of rows || []) {
    const [crn, code, name, , instr] = r;
    if (code && !courses.has(code)) {
      const nameN = paletteNorm(name);
      courses.set(code, { code, name: name || '', key: compact(paletteNorm(code)), nameN, words: nameN.split(' '), sections: 0 });
    }
    if (code) courses.get(code).sections++;
    if (crn != null && crn !== '') crns.set(String(crn), r);
    for (const part of String(instr ?? '').split(/[;,|]/)) {
      const nm = part.trim();
      if (NO_INSTRUCTOR.has(nm)) continue;
      const n = paletteNorm(nm);
      const cur = instructors.get(n);
      if (cur) cur.sections++;
      else instructors.set(n, { name: nm, nameN: n, words: n.split(' '), sections: 1 });
    }
  }
  return { courses: [...courses.values()], crns, instructors: [...instructors.values()] };
}

// Sözcük başı eşleşmesi: her terim adın bir sözcüğünün başında mı?
function wordScore(terms, words, full) {
  let score = 0;
  for (const term of terms) {
    if (words.some((w) => w.startsWith(term))) score += 3;
    else if (term.length >= 3 && full.includes(term)) score += 1;
    else return 0;
  }
  return score;
}

function courseScore(q, qc, terms, c) {
  if (c.key === qc) return 1000;
  if (c.key.startsWith(qc)) return 900 - (c.key.length - qc.length);
  if (qc.length >= 3 && c.key.includes(qc)) return 600;
  // Karışık: her terim ya kodda ya adda ("blg veri", "mat 2").
  let s = 0;
  for (const term of terms) {
    if (c.key.startsWith(term)) s += 4;
    else if (c.words.some((w) => w.startsWith(term))) s += 3;
    else if (term.length >= 3 && (c.nameN.includes(term) || c.key.includes(term))) s += 1;
    else return 0;
  }
  return 100 + s * 10 + (c.nameN.startsWith(q) ? 20 : 0);
}

// Saf: sorgu → gruplar [{ id, items: [{ kind, … }] }], her grup en çok GROUP_MAX.
export function searchPalette(index, query, pages = PAGES, pageLabel = (p) => p.label) {
  const q = paletteNorm(query);
  const qc = compact(q);
  const terms = q ? q.split(' ') : [];
  const groups = [];

  if (index && /^\d{3,6}$/.test(qc)) {
    const items = [];
    const exact = index.crns.get(qc);
    if (exact) items.push({ kind: 'crn', row: exact });
    for (const [crn, row] of index.crns) {
      if (items.length >= GROUP_MAX) break;
      if (crn !== qc && crn.startsWith(qc)) items.push({ kind: 'crn', row });
    }
    if (items.length) groups.push({ id: 'crn', items });
  }

  if (index && qc.length >= 2) {
    const hits = [];
    for (const c of index.courses) {
      const s = courseScore(q, qc, terms, c);
      if (s > 0) hits.push([s, c]);
    }
    hits.sort((a, b) => b[0] - a[0] || a[1].code.localeCompare(b[1].code, 'tr'));
    if (hits.length) groups.push({ id: 'courses', items: hits.slice(0, GROUP_MAX).map(([, c]) => ({ kind: 'course', course: c })) });
  }

  if (index && qc.length >= 2 && !/^\d+$/.test(qc)) {
    const hits = [];
    for (const ins of index.instructors) {
      const s = wordScore(terms, ins.words, ins.nameN);
      if (s > 0) hits.push([s + (ins.nameN.startsWith(q) ? 2 : 0), ins]);
    }
    hits.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name, 'tr'));
    if (hits.length) groups.push({ id: 'instructors', items: hits.slice(0, GROUP_MAX).map(([, ins]) => ({ kind: 'instructor', instructor: ins })) });
  }

  const pageItems = [];
  for (const p of pages) {
    if (!q) { pageItems.push({ kind: 'page', page: p }); continue; }
    const hay = paletteNorm(`${pageLabel(p)} ${p.kw || ''}`);
    if (wordScore(terms, hay.split(' '), hay) > 0) pageItems.push({ kind: 'page', page: p });
  }
  if (pageItems.length) groups.push({ id: 'pages', items: pageItems.slice(0, q ? GROUP_MAX : pages.length) });
  return groups;
}

/* ---------- veri ---------- */

let cached = { rows: null, slug: '', index: null };
let loading = null;

function indexFor(rows, slug) {
  if (cached.rows !== rows) cached = { rows, slug, index: buildPaletteIndex(rows) };
  return cached.index;
}

async function ensureData() {
  if (state.rows?.length) return { index: indexFor(state.rows, state.termSlug), slug: state.termSlug };
  if (!loading) {
    loading = (async () => {
      if (!state.index) await indexReady;
      const slug = state.termSlug || state.index?.currentSlug;
      if (!slug) return null;
      const rows = await getJSON(`data/terms/${slug}/search.json`);
      return { rows, slug };
    })().catch((error) => { console.warn('Palet verisi yüklenemedi:', error); return null; })
      .finally(() => { loading = null; });
  }
  const got = await loading;
  if (state.rows?.length) return { index: indexFor(state.rows, state.termSlug), slug: state.termSlug };
  return got ? { index: indexFor(got.rows, got.slug), slug: got.slug } : null;
}

/* ---------- arayüz ---------- */

const SEARCH_SVG = '<svg class="cmdk-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

let host = null;
let input = null;
let list = null;
let statusEl = null;
let opts = { showView: null };
let items = [];
let active = -1;
let returnTo = null;
let data = null;
let seq = 0;
let hadModal = false;

function ensureHost() {
  if (host) return;
  host = document.createElement('div');
  host.className = 'cmdk';
  host.hidden = true;
  host.innerHTML = `<div class="cmdk-scrim"></div>
    <div class="cmdk-box" role="dialog" aria-modal="true" aria-label="${esc(t('cmdkLabel'))}">
      <div class="cmdk-field">
        ${SEARCH_SVG}
        <input class="cmdk-input" id="cmdk-input" type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-list"
          aria-autocomplete="list" aria-label="${esc(t('cmdkLabel'))}" placeholder="${esc(t('cmdkPlaceholder'))}"
          autocomplete="off" spellcheck="false" enterkeyhint="go">
        <button type="button" class="cmdk-close" aria-label="${esc(t('detailClose'))}"><span aria-hidden="true">Esc</span></button>
      </div>
      <div class="cmdk-list" id="cmdk-list" role="listbox" aria-label="${esc(t('cmdkResults'))}"></div>
      <p class="cmdk-status" aria-live="polite"></p>
      <p class="cmdk-foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> ${esc(t('cmdkFootMove'))}</span><span><kbd>Enter</kbd> ${esc(t('cmdkFootRun'))}</span><span><kbd>Esc</kbd> ${esc(t('cmdkFootClose'))}</span></p>
    </div>`;
  document.body.appendChild(host);
  input = host.querySelector('.cmdk-input');
  list = host.querySelector('.cmdk-list');
  statusEl = host.querySelector('.cmdk-status');

  host.querySelector('.cmdk-scrim').addEventListener('click', () => closePalette());
  host.querySelector('.cmdk-close').addEventListener('click', () => closePalette());
  input.addEventListener('input', render);
  host.addEventListener('keydown', onKey);
  // Fare: üzerine gelinen seçenek etkin olur, tıklama çalıştırır; odak girişte kalır.
  list.addEventListener('pointerdown', (e) => { if (e.target.closest('[role="option"]')) e.preventDefault(); });
  list.addEventListener('pointermove', (e) => {
    const opt = e.target.closest('[role="option"]');
    if (opt) setActive(Number(opt.dataset.i), false);
  });
  list.addEventListener('click', (e) => {
    const opt = e.target.closest('[role="option"]');
    if (opt) run(Number(opt.dataset.i));
  });
}

function pageLabel(p) { return t(p.label); }

function groupTitle(id) {
  return t({ crn: 'cmdkGroupCrn', courses: 'cmdkGroupCourses', instructors: 'cmdkGroupInstructors', pages: 'cmdkGroupPages' }[id]);
}

function itemHtml(it) {
  if (it.kind === 'course') {
    const c = it.course;
    return `<span class="cmdk-code" translate="no">${esc(c.code)}</span><span class="cmdk-main">${esc(c.name)}</span><span class="cmdk-meta">${esc(t('cmdkSections', { n: c.sections }))}</span>`;
  }
  if (it.kind === 'crn') {
    const [crn, code, name, , instr] = it.row;
    return `<span class="cmdk-code" translate="no">${esc(crn)}</span><span class="cmdk-main"><b translate="no">${esc(code)}</b> ${esc(name)}</span><span class="cmdk-meta">${esc(String(instr || '').split(/[;,|]/)[0].trim())}</span>`;
  }
  if (it.kind === 'instructor') {
    const ins = it.instructor;
    return `<span class="cmdk-main">${esc(ins.name)}</span><span class="cmdk-meta">${esc(t('cmdkSections', { n: ins.sections }))}</span>`;
  }
  const p = it.page;
  return `<span class="cmdk-main">${esc(pageLabel(p))}</span><span class="cmdk-meta">${esc(p.href || `#${p.view}`)}</span>`;
}

function render() {
  const q = input.value;
  const groups = searchPalette(data?.index || null, q, PAGES, pageLabel);
  items = [];
  let html = '';
  groups.forEach((g, gi) => {
    html += `<div class="cmdk-group" role="group" aria-labelledby="cmdk-g-${gi}"><div class="cmdk-gh" id="cmdk-g-${gi}" aria-hidden="true">${esc(groupTitle(g.id))}</div>`;
    for (const it of g.items) {
      const i = items.length;
      items.push(it);
      html += `<div class="cmdk-opt is-${it.kind}" role="option" id="cmdk-o-${i}" data-i="${i}" aria-selected="false">${itemHtml(it)}</div>`;
    }
    html += '</div>';
  });
  list.innerHTML = html;
  const loadingData = !data && q.trim();
  statusEl.textContent = loadingData ? t('cmdkLoading') : (q.trim() && !items.length ? t('cmdkEmpty') : '');
  statusEl.hidden = !statusEl.textContent;
  setActive(items.length ? 0 : -1, false);
}

function setActive(i, scroll = true) {
  const prev = list.querySelector('[aria-selected="true"]');
  if (prev) prev.setAttribute('aria-selected', 'false');
  active = i;
  const el = i >= 0 ? list.querySelector(`#cmdk-o-${i}`) : null;
  if (el) {
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    if (scroll) el.scrollIntoView({ block: 'nearest' });
  } else {
    input.removeAttribute('aria-activedescendant');
  }
}

function onKey(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    closePalette();
    return;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    if (!items.length) return;
    const d = e.key === 'ArrowDown' ? 1 : -1;
    setActive((active + d + items.length) % items.length);
    return;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();
    if (active >= 0) run(active);
    return;
  }
  if (e.key === 'Tab') {
    // Odak tuzağı: giriş ↔ kapat düğmesi.
    e.preventDefault();
    e.stopPropagation();
    const close = host.querySelector('.cmdk-close');
    (document.activeElement === input ? close : input).focus();
  }
}

function run(i) {
  const it = items[i];
  if (!it) return;
  const slug = data?.slug;
  if (it.kind === 'page') {
    const p = it.page;
    if (p.href) {
      closePalette({ restore: false });
      location.assign(p.href);
      return;
    }
    closePalette({ restore: false });
    opts.showView?.(p.view);
    document.getElementById(`tab-${p.view}`)?.focus({ preventScroll: true });
    return;
  }
  if (it.kind === 'instructor') {
    closePalette({ restore: false });
    // Tam ad soyad aranır: matchRow her terimi hoca sözcük başında tutan
    // çok terimli sorguyu kabul eder (yalnız soyadı başka hocaları da getirir).
    const q = it.instructor.name;
    window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: { q } }));
    const box = document.getElementById('q');
    if (box) { box.dispatchEvent(new Event('input', { bubbles: true })); box.focus({ preventScroll: true }); }
    return;
  }
  // Ders/CRN: önce palet kapanır ve odak açana döner; detay paneli kapanınca
  // odağı oraya geri verir.
  closePalette();
  if (it.kind === 'course') openCourseDetail(it.course.code, { term: slug, source: 'dersler' });
  else openCourseDetail(it.row[1], { term: slug, crn: it.row[0], source: 'dersler' });
}

export function isPaletteOpen() {
  return Boolean(host && !host.hidden);
}

export function openPalette({ showView } = {}) {
  ensureHost();
  if (showView) opts.showView = showView;
  if (isPaletteOpen()) { input.select(); return; }
  const ae = document.activeElement;
  returnTo = ae && ae !== document.body ? ae : null;
  host.hidden = false;
  hadModal = document.body.classList.contains('modal-open');
  document.body.classList.add('modal-open');
  input.value = '';
  data = cached.index && cached.rows === state.rows && state.rows?.length ? { index: cached.index, slug: cached.slug } : null;
  render();
  input.focus();
  const mySeq = ++seq;
  ensureData().then((d) => {
    if (mySeq !== seq || !isPaletteOpen()) return;
    data = d;
    const keep = active;
    render();
    if (keep > 0 && keep < items.length) setActive(keep, false);
  });
}

export function closePalette({ restore = true } = {}) {
  if (!isPaletteOpen()) return;
  seq++;
  host.hidden = true;
  // Palet açılmadan önce başka bir modal (detay çekmecesi vb.) kaydırmayı
  // kilitlemişse kilit onundur.
  if (!hadModal) document.body.classList.remove('modal-open');
  const back = returnTo;
  returnTo = null;
  if (restore && back?.isConnected) back.focus({ preventScroll: true });
}

export function togglePalette(o) {
  if (isPaletteOpen()) closePalette();
  else openPalette(o);
}
