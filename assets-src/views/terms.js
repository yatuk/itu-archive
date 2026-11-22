// Dönemler görünümü: tüm dönemler yıl × Güz/Bahar/Yaz matrisinde; canlı/arşiv
// ayrımı, eksik dönemler ve CSV/meta indirme bağlantıları. Yalnızca
// index.json'a bağlı, ekstra veri çekmez.
//
// Hakkında sekmesinin veri sayıları (aktif dönem, arşiv) ve içindekiler
// gezinmesi de buradan beslenir: ikisi de index.json'un aynı özetini kullanır.

import { $, esc, getJSON } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

// Bilinen arşiv boşlukları — README "Eksikler" bölümüyle eşleşir (Faz 6).
const KNOWN_GAPS = {
  '2024-2025-guz': 'termGap20242025Guz',
};

const SEASONS = ['guz', 'bahar', 'yaz'];
const SEASON_KEYS = { guz: 'histSeasonFall', bahar: 'histSeasonSpring', yaz: 'histSeasonSummer' };

const numLocale = () => (I18N.lang === 'en' ? 'en' : 'tr');
const fmtNum = (n) => Number(n || 0).toLocaleString(numLocale());

// site.go'daki localizedTermLabel ile aynı kural: EN'de "-guz/-bahar/-yaz"
// dönem eki "Fall/Spring/Summer Term" olarak gösterilir; TR'de etiket aynen kalır.
function localizedTermLabel(label, slug) {
  if (I18N.lang !== 'en') return label;
  const m = /^(.+)-(guz|bahar|yaz)$/.exec(slug || '');
  if (!m) return label;
  const season = { guz: 'Fall Term', bahar: 'Spring Term', yaz: 'Summer Term' }[m[2]];
  return `${m[1]} ${season}`;
}

function shortTerm(slug) {
  const m = /^(\d{4}-\d{4})-(guz|bahar|yaz)$/.exec(slug || '');
  return m ? `${m[1]} ${I18N.t(SEASON_KEYS[m[2]])}` : String(slug || '');
}

function fmtDay(iso) {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return '';
  return d.toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : 'tr-TR');
}

function slugKey(year, season) {
  return year * 3 + SEASONS.indexOf(season);
}

// Saf · test edilebilir: index.json dönem listesini yıl × mevsim matrisine
// çevirir. Hücre türleri: data (canlı/arşiv), missing (bilinen boşluk ya da
// aradaki kayıtsız dönem), yet (en yeni dönemden sonra), pre (arşivden önce).
export function buildTermMatrix(terms) {
  const bySlug = new Map();
  let min = Infinity;
  let max = -Infinity;
  for (const t of terms || []) {
    const m = /^(\d{4})-(\d{4})-(guz|bahar|yaz)$/.exec(t.slug || '');
    if (!m) continue;
    bySlug.set(t.slug, t);
    if (t.missing) continue;
    const k = slugKey(Number(m[1]), m[3]);
    min = Math.min(min, k);
    max = Math.max(max, k);
  }
  if (!Number.isFinite(min)) return [];
  const firstYear = Math.floor(min / 3);
  const lastYear = Math.floor(max / 3);
  const years = [];
  for (let y = lastYear; y >= firstYear; y -= 1) {
    const label = `${y}-${y + 1}`;
    years.push({
      label,
      cells: SEASONS.map((season) => {
        const slug = `${label}-${season}`;
        const t = bySlug.get(slug);
        const k = slugKey(y, season);
        if (t && !t.missing) return { kind: 'data', season, slug, term: t };
        if (t && t.missing) return { kind: 'missing', season, slug, term: t };
        if (k > max) return { kind: 'yet', season, slug };
        if (k < min) return { kind: 'pre', season, slug };
        return { kind: 'missing', season, slug };
      }),
    });
  }
  return years;
}

function cellHTML(c) {
  const seasonName = esc(I18N.t(SEASON_KEYS[c.season]));
  const head = `<span class="term-cl" aria-hidden="true">${seasonName}</span>`;
  if (c.kind === 'data') {
    const t = c.term;
    const src = t.live ? I18N.t('termSourceLive') : I18N.t('termSourceArchive');
    const failed = Array.isArray(t.failedBranches) ? t.failedBranches.length : 0;
    const warn = t.partial
      ? `<span class="term-warn">${esc(`${I18N.t('termScanPartial')}${failed ? `: ${failed}${I18N.t('termBranchesFailedSuffix')}` : ''}${I18N.t('termResultsIncomplete')}`)}</span>`
      : '';
    const badge = t.live ? `<span class="term-badge"><i aria-hidden="true"></i>${esc(I18N.t('termBadgeLive'))}</span>` : '';
    const label = localizedTermLabel(t.label, t.slug);
    return `<div class="term-cell${t.live ? ' live' : ''}" role="cell">${head}` +
      `<span class="term-n"><span class="num">${fmtNum(t.sections)}</span> <small>${esc(I18N.t('prgSube'))}</small>${badge}</span>` +
      `<span class="term-m">${esc(src)} · ${esc(fmtDay(t.scrapedAt))}</span>${warn}` +
      `<span class="term-lk"><a href="data/terms/${esc(t.slug)}/all.csv" rel="nofollow" download aria-label="${esc(`${label} CSV`)}">CSV</a>` +
      `<a href="data/terms/${esc(t.slug)}/meta.json" rel="nofollow" download aria-label="${esc(`${label} meta.json`)}">meta.json</a></span></div>`;
  }
  if (c.kind === 'missing') {
    const whyKey = KNOWN_GAPS[c.slug];
    return `<div class="term-cell miss" role="cell">${head}<span class="term-n">${esc(I18N.t('termBadgeNoData'))}</span>` +
      `<span class="term-m">${esc(whyKey ? I18N.t(whyKey) : I18N.t('termNoDataFallback'))}</span></div>`;
  }
  const why = c.kind === 'yet' ? I18N.t('termNotYet') : I18N.t('termPreArchive');
  return `<div class="term-cell none" role="cell">${head}<span>${esc(why)}</span></div>`;
}

export async function renderTerms() {
  const terms = state.index.terms || [];
  const withData = terms.filter((t) => !t.missing);
  const live = withData.filter((t) => t.live);
  const archive = withData.filter((t) => !t.live);
  const total = withData.reduce((n, t) => n + (Number(t.sections) || 0), 0);
  const oldest = withData.slice().sort((a, b) => {
    const ka = /^(\d{4})-\d{4}-(guz|bahar|yaz)$/.exec(a.slug);
    const kb = /^(\d{4})-\d{4}-(guz|bahar|yaz)$/.exec(b.slug);
    return (ka ? slugKey(+ka[1], ka[2]) : 0) - (kb ? slugKey(+kb[1], kb[2]) : 0);
  })[0];

  const stats = $('#term-stats');
  if (stats) {
    stats.innerHTML =
      `<div><b class="num">${fmtNum(withData.length)}</b><span>${esc(I18N.t('termStatTerms', { from: oldest ? shortTerm(oldest.slug) : '' }))}</span></div>` +
      `<div><b class="num">${fmtNum(live.length)}</b><span>${esc(I18N.t('termStatLive'))}${live[0] ? ` · ${esc(shortTerm(live[0].slug))}` : ''}</span></div>` +
      `<div><b class="num">${fmtNum(archive.length)}</b><span>${esc(I18N.t('termStatArchive'))}</span></div>` +
      `<div><b class="num">${fmtNum(total)}</b><span>${esc(I18N.t('termStatSections'))}</span></div>`;
    stats.hidden = false;
  }

  const years = buildTermMatrix(terms);
  const container = $('#terms');
  if (container) {
    const head = `<div class="term-mr hd" role="row"><span role="columnheader">${esc(I18N.t('termColYear'))}</span>` +
      SEASONS.map((s) => `<span role="columnheader">${esc(I18N.t(SEASON_KEYS[s]))}</span>`).join('') + '</div>';
    container.innerHTML = `<div class="term-mx" role="table" aria-label="${esc(I18N.t('termMatrixAria'))}">${head}` +
      years.map((y) => `<div class="term-mr" role="row"><span class="term-yr num" role="rowheader">${esc(y.label)}</span>${y.cells.map(cellHTML).join('')}</div>`).join('') +
      '</div>';
  }

  const foot = $('#term-foot');
  if (foot) {
    const parts = [I18N.t('termFootSource')];
    if (live[0]) parts.push(I18N.t('termFootLive', { date: fmtDay(live[0].scrapedAt) }));
    foot.textContent = parts.join(' · ');
  }

  renderAboutStats(withData, oldest);
  wireAbout();
}

// --- Hakkında ----------------------------------------------------------------

function setText(sel, value) {
  const el = $(sel);
  if (el) el.textContent = value;
}

function renderAboutStats(withData, oldest) {
  const ix = state.index;
  const st = ix.stats || {};
  setText('#ab-active-term', ix.currentSlug ? shortTerm(ix.currentSlug) : (ix.currentTerm || ''));
  setText('#ab-n-sections', fmtNum(st.sections));
  setText('#ab-n-courses', fmtNum(st.courses));
  setText('#ab-n-branches', fmtNum(st.branches));
  setText('#ab-n-instructors', fmtNum(st.instructors));
  setText('#ab-archive-range', oldest ? I18N.t('abArchiveRange', { from: shortTerm(oldest.slug) }) : '');
  setText('#ab-n-terms', fmtNum(withData.length));
}

let aboutWired = false;
let aboutHistLoaded = false;

// Arşiv ders/hoca sayıları history/index.json'dan gelir; dosya küçük ama
// gereksiz istek olmasın diye yalnızca Hakkında ilk kez açıldığında çekilir.
async function loadAboutArchive() {
  if (aboutHistLoaded) return;
  aboutHistLoaded = true;
  try {
    const hist = await getJSON('data/history/index.json');
    setText('#ab-n-hcourses', fmtNum(hist.courses));
    setText('#ab-n-hinstructors', fmtNum(hist.instructors));
    if (Array.isArray(hist.terms)) setText('#ab-n-terms', fmtNum(hist.terms.length));
  } catch (e) {
    aboutHistLoaded = false;
    setText('#ab-n-hcourses', '·');
    setText('#ab-n-hinstructors', '·');
  }
}

function wireAbout() {
  if (aboutWired) return;
  const view = $('#view-hakkinda');
  if (!view) return;
  aboutWired = true;

  const onVisible = () => { if (!view.hidden) loadAboutArchive(); };
  onVisible();
  new MutationObserver(onVisible).observe(view, { attributes: true, attributeFilter: ['hidden'] });

  // İçindekiler: hash'e yazmadan kaydırır — SPA, hash'i sekme adı olarak okur.
  const toc = view.querySelector('.ab-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#ab-"]')];
  const setCurrent = (id) => {
    for (const a of links) {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };
  toc.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#ab-"]');
    if (!a) return;
    ev.preventDefault();
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
    setCurrent(target.id);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setCurrent(hit.target.id);
    }, { rootMargin: '-80px 0px -60% 0px' });
    for (const a of links) {
      const h = document.getElementById(a.getAttribute('href').slice(1));
      if (h) io.observe(h);
    }
  }
  if (links[0]) setCurrent(links[0].getAttribute('href').slice(1));
}
