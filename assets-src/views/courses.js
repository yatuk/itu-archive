// Dersler görünümü: dönem arama/filtre/sıralama, şube seçimi (sepet), zaman
// çizelgesi, detay paneli, CSV indirme ve paylaşılabilir URL durumu.
//
// Tüm veri state.rows (arama indeksi) üzerinden çalışır; tam kayıt yalnızca
// detay açılınca ilgili branş dosyasından gelir. Arama indeksi 12 alanlıdır:
// [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan, seviye, yöntem,
// alabilen programlar[], yer] — son üç alan tarihsel dönemlerde olmayabilir,
// filtrelerde "yoksa geç" yapılır. "yer" (bina+derslik) "zaman" ile aynı
// sırada " | " ile ayrılmış oturum listesidir (bkz. sessionsWithLocation).
//
// Liste her genişlikte aynı yapıdır: sonuçlar derse göre gruplanır (ders
// başlığı + şube satırları), sayfalama ders grupları üzerinden yapılır. Dar
// ekranda satırlar CSS ile karta döner; ayrı bir mobil veri yolu yoktur.

import { $, getJSON, esc, fold, normSearch, matchRow, markField, suggestDrop, debounce, downloadCSV, setStatus, fillMeasured, frozenMeasuredAt, fmtDay, timeAgo, isViewVisible, tickCount, formatInt } from '../core/utils.js?v=dde1e9339338';
import { methodToCode } from '../core/urlcodes.js?v=dde1e9339338';
import { formatProgramLabel, loadProgramMap, normalizeProgramLevel, programLevelLabel } from '../core/programs.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { quotaState } from '../core/chart.js?v=dde1e9339338';
import * as fav from '../core/favorites.js?v=dde1e9339338';
import { toast } from '../core/toast.js?v=dde1e9339338';
import { openCourseDetail } from '../core/course-detail.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';
import { writeLocalState, isPlainObject } from '../core/persistence.js?v=dde1e9339338';
import { isRemoteMethod, transitionIssue } from '../core/campus.js';
import { specialSectionKind } from '../core/section-kind.js';

// Sayfa başına ders grubu; "daha fazla" bir sonraki dilimi ekler.
const GROUP_PAGE = 30;
// Bir ders başlığı altında ilk görünen şube sayısı. Kalanlar kullanıcı
// istediğinde kurulur (yüzlerce gizli düğmeyi baştan DOM'a eklememek için).
const SECTION_PREVIEW_COMPACT = 4;
const SECTION_PREVIEW_WIDE = 8;
// Zaman çizelgesi bu kadar şubeden sonra okunmaz hale gelir; fazlası için
// dürüst bir not gösterilir.
const TT_MAX_SECTIONS = 80;

let groupCacheRows = null;
let groupCache = [];
const compactLayout = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(max-width: 640px)')
  : { matches: false, addEventListener() {}, addListener() {} };
const sectionPreview = () => (compactLayout.matches ? SECTION_PREVIEW_COMPACT : SECTION_PREVIEW_WIDE);

const t = (key, vars) => I18N.t(key, vars);
const timeLabel = (value) => ({
  sabah: t('timeMorning'),
  ogle: t('timeNoon'),
  aksam: t('timeEvening'),
}[value] || value);
const DAY_EN = {
  Pazartesi: 'Monday', Salı: 'Tuesday', Çarşamba: 'Wednesday',
  Perşembe: 'Thursday', Cuma: 'Friday', Cumartesi: 'Saturday', Pazar: 'Sunday',
};
const dayLabel = (day) => (I18N.lang === 'en' ? (DAY_EN[day] || day) : day);
const localizeSchedule = (value) => {
  if (I18N.lang !== 'en') return value;
  return String(value || '').replace(/Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar/g, (day) => DAY_EN[day]);
};

const STAR_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>';
const X_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const ALERT_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>';

export function initCourses() {
  $('#q').addEventListener('input', debounce(applyFilters, 120));
  $('#f-branch').addEventListener('change', applyFilters);
  $('#f-day').addEventListener('change', applyFilters);
  $('#f-time').addEventListener('change', applyFilters);
  $('#f-level').addEventListener('change', () => syncProgramFilter().then(applyFilters));
  $('#f-method').addEventListener('change', applyFilters);
  $('#f-program').addEventListener('change', applyFilters);
  $('#f-code').addEventListener('input', debounce(applyFilters, 120));
  $('#f-open').addEventListener('change', applyFilters);
  $('#f-term').addEventListener('change', () => loadTerm($('#f-term').value));
  $('#more').addEventListener('click', () => renderRows(true));
  $('#csv').addEventListener('click', exportCSV);
  // Liste / zaman çizelgesi bölümlü düğmesi.
  $('#view-list').addEventListener('click', () => setTimetable(false));
  $('#tt-toggle').addEventListener('click', () => setTimetable(true));
  $('#sel-csv').addEventListener('click', exportSelectedCSV);
  $('#sel-clear').addEventListener('click', clearSelection);
  $('#sel-only').addEventListener('change', () => { if (ttOn) renderTimetable(); });
  $('#sel-send').addEventListener('click', sendToProgram);
  // Sıralama: anahtar seçici + yön düğmesi (artan/azalan) her genişlikte.
  $('#mobile-sort').addEventListener('change', (e) => {
    const key = e.target.value;
    state.sort = { key, dir: state.sort.key === key ? state.sort.dir : 1 };
    updateSortUI();
    applyFilters();
  });
  $('#sort-dir').addEventListener('click', () => {
    state.sort = { key: state.sort.key, dir: state.sort.dir === -1 ? 1 : -1 };
    updateSortUI();
    applyFilters();
  });
  updateSortUI();

  // Etkin filtre çipleri: kaldır düğmeleri ve "filtreleri temizle".
  $('#chips').addEventListener('click', async (ev) => {
    const x = ev.target.closest('.filter-chip-x');
    if (x) {
      await clearFilter(x.dataset.key);
      applyFilters();
      $('#q').focus({ preventScroll: true });
      return;
    }
    if (ev.target.closest('.filter-clear-all')) clearAllFilters();
  });

  // Sık kullanılan filtreler ilk sırada; seviye/yöntem/program/kod ikincil
  // disclosure içinde. Açık/kapalı olması filtre değerlerini değiştirmez.
  const moreToggle = $('#f-more-toggle');
  moreToggle.addEventListener('click', () => {
    const open = moreToggle.getAttribute('aria-expanded') !== 'true';
    moreToggle.setAttribute('aria-expanded', String(open));
    $('#filters-more').hidden = !open;
  });
  // Mobil filtre bottom-sheet: "Filtreler (N)" düğmesi + uygula/temizle + karartma.
  const filterSheet = $('#filters');
  const filterTrigger = $('#f-filter-btn');
  const filterScrim = $('#filters-scrim');
  const sheetFocusable = () => [...filterSheet.querySelectorAll(
    'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.hidden && !el.disabled && el.getClientRects().length);
  const fsOpen = (open) => {
    filterSheet.classList.toggle('open', open);
    filterScrim.classList.toggle('show', open);
    filterScrim.hidden = !open;
    filterTrigger.setAttribute('aria-expanded', String(open));
    if (open) {
      filterSheet.setAttribute('role', 'dialog');
      filterSheet.setAttribute('aria-modal', 'true');
      filterSheet.setAttribute('aria-label', t('filterDialogLabel'));
      requestAnimationFrame(() => sheetFocusable()[0]?.focus());
    } else {
      filterSheet.removeAttribute('role');
      filterSheet.removeAttribute('aria-modal');
      filterSheet.removeAttribute('aria-label');
      if (document.activeElement && filterSheet.contains(document.activeElement)) filterTrigger.focus();
    }
  };
  filterTrigger.addEventListener('click', () => fsOpen(!filterSheet.classList.contains('open')));
  $('#fs-apply').addEventListener('click', () => fsOpen(false));
  $('#fs-clear').addEventListener('click', () => {
    resetFilterControls({ keepQuery: true });
    fsOpen(false);
    syncProgramFilter().then(applyFilters);
  });
  filterScrim.addEventListener('click', () => fsOpen(false));
  filterSheet.addEventListener('keydown', (event) => {
    if (!filterSheet.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      fsOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = sheetFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Dar/geniş düzen arasında yalnızca ilk görünen şube sayısı değişir; aynı
  // filtrelenmiş veri baştan basılır.
  const switchCourseLayout = () => {
    state.shown = 0;
    renderRows(false);
  };
  if (compactLayout.addEventListener) compactLayout.addEventListener('change', switchCourseLayout);
  else compactLayout.addListener(switchCourseLayout);
}

export async function loadTerm(slug) {
  state.termSlug = slug;
  state.quota = null;
  state.quotaLast = null;
  state.quotaFinalAt = null;
  state.selected.clear(); // seçim döneme özeldir
  updateSelection();
  setStatus($('#resultline'), t('resultTermLoading'), { busy: true });
  // Faz 5.4: iskelet — dönem verisi gelene kadar shimmer satırları.
  $('#course-groups').innerHTML = '<div class="course-skeleton skel">' +
    '<div class="skel-line wide"></div>'.repeat(4) + '</div>';
  try {
    const [rows, meta] = await Promise.all([
      getJSON(`data/terms/${slug}/search.json`),
      getJSON(`data/terms/${slug}/meta.json`),
    ]);
    state.rows = rows;
    state.meta = meta;
    loadQuota(slug); // dolma sürelerini bu dönem için arka planda yükle
    // Aramayı bir kez alan bazlı katlanmış indekse çeviriyoruz: her tuş vuruşunda
    // 4000 satırı yeniden normalize etmenin anlamı yok. Kod boşluksuz (normSearch),
    // ad/hoca boşluklu (fold) — kelime sınırı ve kod yazımı esnekliği korunur.
    state.search = buildSearchIndex(rows);

    const branchSel = $('#f-branch');
    const keep = branchSel.value;
    branchSel.innerHTML = `<option value="">${esc(t('filterAll'))}</option>` +
      meta.branches.map((b) => `<option value="${b.code}">${b.code} (${b.sections})</option>`).join('');
    branchSel.value = meta.branches.some((b) => b.code === keep) ? keep : '';

    // Öğretim yöntemi seçenekleri veriden gelir (tarihsel dönemlerde boş).
    const methods = [...new Set(rows.map((r) => r[9]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
    const mSel = $('#f-method');
    const keepM = mSel.value;
    mSel.innerHTML = `<option value="">${esc(t('filterAll'))}</option>` +
      methods.map((m) => `<option>${esc(m)}</option>`).join('');
    mSel.value = methods.includes(keepM) ? keepM : '';

    await syncProgramFilter($('#f-program').value);

    applyFilters();
  } catch (e) {
    setStatus($('#resultline'), t('resultLoadError', { msg: e.message }), { error: true });
  }
}

export async function syncProgramFilter(preferred = '') {
  const pSel = $('#f-program');
  if (!pSel) return;
  const level = normalizeProgramLevel($('#f-level')?.value || 'LS');
  const map = await loadProgramMap();
  const programs = [...new Set((state.rows || []).flatMap((r) => programList(r)))]
    .filter((code) => normalizeProgramLevel(map.get(code)?.level, code) === level)
    .sort((a, b) => {
      const an = map.get(a)?.name || a;
      const bn = map.get(b)?.name || b;
      return an.localeCompare(bn, 'tr') || a.localeCompare(b, 'tr');
    });
  const keep = preferred || pSel.value;
  pSel.innerHTML = `<option value="">${esc(t('filterAll'))}</option>` +
    programs.map((code) => `<option value="${esc(code)}">${esc(formatProgramLabel(code, map.get(code), I18N.lang))}</option>`).join('');
  pSel.value = programs.includes(keep) ? keep : '';
}

// Alan bazlı arama indeksi: her satırın crn/kod/ad/hoca alanı ayrı normalize
// edilir (kod boşluksuz, ad/hoca boşluklu). Satır sırası state.rows ile aynıdır.
function buildSearchIndex(rows) {
  return {
    crn: rows.map((r) => fold(r[0])),
    code: rows.map((r) => normSearch(r[1])),
    name: rows.map((r) => fold(r[2])),
    instructor: rows.map((r) => fold(r[4])),
  };
}

// Kontenjan zaman serisini arka planda yükler; detay panelindeki dolma
// süresi bilgisi buradan gelir.
export async function loadQuota(slug) {
  try {
    const sum = await getJSON(`data/quota/${slug}.json`);
    if (state.termSlug !== slug) return; // kullanıcı yükleme sürerken dönem değiştirdi
    state.quota = new Map(sum.courses.map((c) => [c.crn, c]));
    state.quotaLast = sum.last || null; // doluluk ölçüm zamanı (Faz 0.4)
    state.quotaFinalAt = sum.finalAt || null;
  } catch {
    if (state.termSlug !== slug) return;
    state.quota = null; // bu dönem için henüz ölçüm yok
    state.quotaLast = null;
    state.quotaFinalAt = null;
  }
  // Ölçüm özeti satırlarda tekrarlanmaz; yükleme bitince sonuç satırını bir kez
  // yenileyerek global tazelik bilgisini görünür kıl.
  if (state.rows.length) applyFilters();
}

export function applyFilters() {
  const q = fold($('#q').value.trim());
  const branch = $('#f-branch').value;
  const day = $('#f-day').value;
  const time = $('#f-time').value;
  const level = $('#f-level').value;
  const method = $('#f-method').value;
  const program = $('#f-program').value;
  const code = $('#f-code').value.trim().toLowerCase();
  const openOnly = $('#f-open').checked;
  // Arama terimleri boşluğa göre bölünür, sonra ortak normalizasyonla boşluksuz
  // anahtarlara indirilir ("BLG 102E" → ["blg","102e"], "BLG102E" → ["blg102e"]).
  const terms = q ? q.split(/\s+/).map(normSearch) : [];
  // Yüklenmemişse indeksi kur (dönem hatası sonrası güvenlik).
  if (!state.search) state.search = buildSearchIndex(state.rows);

  // Serbest-metin dışı filtreler. Sorgudan bağımsız; 0 sonuç önerisi de bunu kullanır.
  const passBase = (r) => {
    if (branch && r[3] !== branch) return false;
    if (code && !r[1].toLowerCase().includes(code)) return false;
    if (day && !matchesDay(r[5], day)) return false;
    if (time && !parseWhen(r[5]).some((s) => timeBucket(s.start) === time)) return false;
    // Seviye/yöntem/program alanları tarihsel dönemlerde yoktur; yoksa filtre uygulanmaz.
    if (level && r[8] && r[8] !== level) return false;
    if (method && r[9] && r[9] !== method) return false;
    if (program && !programList(r).includes(program)) return false;
    if (openOnly && r[7] >= r[6]) return false;
    return true;
  };
  const fieldsOf = (i) => ({
    crn: state.search.crn[i],
    code: state.search.code[i],
    name: state.search.name[i],
    instructor: state.search.instructor[i],
  });

  // Alan bazlı eşleştirme: her satır için skor + hangi alan/konum eşleştiği
  // (satırda <mark> vurgusu için). Sorgu boşsa marks boş kalır, vurgu yok.
  state.marks = new Map(); // selKey → { score, hits }
  const scoreOf = new Map();
  state.filtered = [];
  for (let i = 0; i < state.rows.length; i++) {
    const r = state.rows[i];
    if (!passBase(r)) continue;
    if (terms.length) {
      const m = matchRow(terms, fieldsOf(i));
      if (!m) continue;
      state.marks.set(selKey(r), m);
      scoreOf.set(selKey(r), m.score);
    }
    state.filtered.push(r);
  }

  const { key, dir } = state.sort;
  const bySort = (a, b) => {
    const va = sortValue(a, key), vb = sortValue(b, key);
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb), 'tr') * dir;
  };
  if (terms.length) {
    // Sorgu aktifken sonuçlar alaka skoruyla listelenir (kod tam > kod başı >
    // ad kelime başı > hoca kelime başı > kelime ortası); eşitlikte sıralama.
    state.filtered.sort((a, b) => {
      const d = (scoreOf.get(selKey(b)) ?? 0) - (scoreOf.get(selKey(a)) ?? 0);
      return d || bySort(a, b);
    });
  } else {
    state.filtered.sort(bySort);
  }

  state.shown = 0;
  renderRows(false);

  const total = state.rows.length;
  const n = state.filtered.length;
  const courseCount = cachedGroupCourseRows(state.filtered).length;
  // 0 sonuçta terim düşürme önerisi: gürültü katan terimi düşürüp en kesin
  // kalanı öner ("engineering ma" → yalnızca 'engineering').
  let hint = '';
  if (n === 0 && terms.length > 1) {
    const countFor = (sub) => state.rows.reduce(
      (acc, r, i) => acc + (passBase(r) && matchRow(sub, fieldsOf(i)) ? 1 : 0), 0);
    const drop = suggestDrop(terms, countFor);
    if (drop >= 0) {
      const rest = terms.filter((_, j) => j !== drop).map((x) => `'${esc(x)}'`).join(I18N.lang === 'en' ? ' and ' : ' ve ');
      hint = t('resultDropHint', { terms: rest });
    }
  }
  // Ekle-bırak sonrası dönem donar: göreli süreler yerine son ölçümün mutlak tarihi.
  const frozenDay = fmtDay(frozenMeasuredAt(state.freeze, state.termSlug, state.quotaFinalAt), I18N.lang);
  const measured = !frozenDay && state.quotaLast ? fillMeasured(state.quotaLast, Date.now(), I18N.lang) : '';
  const quotaFreshness = measured ? ` · ${esc(t('freshQuota', { ago: measured }))}` : '';
  const scrapedAgo = !frozenDay && state.scrapedAt ? timeAgo(state.scrapedAt, Date.now(), I18N.lang) : '';
  let scrapeFreshness = '';
  if (frozenDay) {
    scrapeFreshness = ` · <span class="data-frozen" title="${esc(t('freshFrozenTitle'))}">${esc(t('freshLastMeasured', { date: frozenDay }))}</span>`;
  } else if (scrapedAgo) {
    scrapeFreshness = ` · <span class="${state.stale ? 'data-stale' : ''}">${esc(t('freshScrape', { ago: scrapedAgo }))}</span>`;
  }
  // Sonuç sayısı jump-cut yerine eski değerden yeni değere yuvarlanır: HTML
  // eski sayıyla basılır (hedefle basılırsa tickCount'un ilk rAF'ı çalışana
  // dek doğru değer bir kare parlayıp geri yuvarlanırdı), sonra animasyon onu
  // hedefe taşır.
  const prevCount = Number($('#resultline b')?.textContent);
  const startCount = Number.isFinite(prevCount) ? prevCount : n;
  const countHtml = `<b class="num">${startCount}</b>`;
  const line = n === total
    ? t('resultAll', { n: countHtml, courses: `<span class="num">${state.meta.courses}</span>`, branches: `<span class="num">${state.meta.branches.length}</span>` })
    : t('resultMatched', { n: countHtml, total: `<span class="num">${total}</span>`, courses: `<span class="num">${courseCount}</span>` }) + hint;
  $('#resultline').classList.remove('busy', 'error');
  $('#resultline').innerHTML = line + scrapeFreshness + quotaFreshness;
  tickCount($('#resultline b'), prevCount, n);
  // Mobil filtre düğmesi etiketi: aktif filtre sayısı (dönem sayılmaz).
  const activeCount = [
    branch, day, time, level, method, program, code.trim(),
    openOnly ? '1' : '',
  ].filter(Boolean).length;
  const fb = $('#f-filter-btn');
  if (fb) fb.textContent = `${t('filterButton')} (${activeCount})`;
  const secondaryCount = [level, method, program, code.trim()].filter(Boolean).length;
  const more = $('#f-more-toggle');
  more.textContent = `${t('filterMore')}${secondaryCount ? ` (${secondaryCount})` : ''}`;
  renderChips();
  updateSelection();
  if (ttOn) renderTimetable();
  saveState();
}

// "Alabilen programlar" alanı (r[10]) dizi ya da virgüllü tek string olarak
// gelebilir (tarihsel dönemlerde tek öğe içinde "AIN_LS, BIO_LS" gibi). Her iki
// durumu da tekil kod listesine indirger. Saf fonksiyon — test edilebilir.
export function programList(r) {
  const raw = r[10];
  if (!raw) return [];
  const parts = Array.isArray(raw) ? raw : String(raw).split(/[,;|]/);
  const out = [];
  for (const p of parts) {
    // Dizi içindeki tek öğe de virgüllü string olabilir (tarihsel dönemler).
    for (const q of String(p).split(/[,;|]/)) {
      const v = q.trim();
      if (v && !out.includes(v)) out.push(v);
    }
  }
  return out;
}

// Sıralama için satır değerini döndürür; Doluluk yüzde olarak hesaplanır.
// Saf fonksiyon — test edilebilir olması için dışa açık.
export function sortValue(r, key) {
  switch (key) {
    case 'crn': return r[0];
    case 'code': return r[1];
    case 'name': return r[2];
    case 'instructor': return r[4] || '';
    case 'when': return r[5];
    case 'cap': return r[6];
    case 'enr': return r[7];
    case 'fill': { const c = r[6]; return c ? r[7] / c : -1; }
    default: return '';
  }
}

function updateSortUI() {
  const ms = $('#mobile-sort');
  if (ms) ms.value = state.sort.key;
  const dirBtn = $('#sort-dir');
  if (dirBtn) {
    const desc = state.sort.dir === -1;
    dirBtn.setAttribute('aria-pressed', String(desc));
    dirBtn.classList.toggle('active', desc);
  }
}

export function restoreCourseSort(key, dir) {
  const allowed = new Set(['crn', 'code', 'name', 'instructor', 'when', 'cap', 'enr', 'fill']);
  state.sort = { key: allowed.has(key) ? key : 'crn', dir: Number(dir) === -1 ? -1 : 1 };
  updateSortUI();
}

/* ---------- filtre çipleri ---------- */

function renderChips() {
  const box = $('#chips');
  const chips = [];
  const q = $('#q').value.trim();
  if (q) chips.push({ key: 'q', text: `"${q}"` });
  if ($('#f-branch').value) chips.push({ key: 'branch', label: t('filterBranch'), value: $('#f-branch').value });
  if ($('#f-code').value.trim()) chips.push({ key: 'code', label: t('filterCode'), value: $('#f-code').value.trim() });
  if ($('#f-day').value) chips.push({ key: 'day', label: t('filterDay'), value: $('#f-day option:checked').textContent });
  if ($('#f-time').value) chips.push({ key: 'time', label: t('filterTime'), value: timeLabel($('#f-time').value) });
  // Lisans varsayılandır; yalnızca kullanıcı başka bir seviye seçtiyse çip olur.
  const level = $('#f-level').value;
  if (level && level !== 'LS') chips.push({ key: 'level', label: t('filterLevel'), value: programLevelLabel(level, I18N.lang) });
  if ($('#f-method').value) chips.push({ key: 'method', label: t('filterMethod'), value: $('#f-method').value });
  if ($('#f-program').value) chips.push({ key: 'program', label: t('filterProgram'), value: $('#f-program').value });
  if ($('#f-open').checked) chips.push({ key: 'open', text: t('filterOpen') });

  const parts = chips.map((c) => {
    const body = c.value !== undefined
      ? `<span class="filter-chip-label">${esc(c.label)}:</span> <b>${esc(c.value)}</b>`
      : `<b>${esc(c.text)}</b>`;
    const label = c.key === 'q' ? t('filterRemoveSearch') : t('filterRemove', { label: c.label || c.text });
    return `<span class="filter-chip">${body}<button type="button" class="filter-chip-x" data-key="${c.key}" aria-label="${esc(label)}" title="${esc(label)}">${X_SVG}</button></span>`;
  });
  if (chips.length) parts.push(`<button type="button" class="filter-clear-all">${esc(t('filtersClearAll'))}</button>`);
  if (state.rows.length && !state.filtered.length) parts.push(`<p class="filter-help">${esc(t('courseNoMatchHelp'))}</p>`);
  box.innerHTML = parts.join('');
  box.hidden = !parts.length;
}

async function clearFilter(key) {
  switch (key) {
    case 'q': $('#q').value = ''; $('#q').dispatchEvent(new Event('input')); break;
    case 'branch': $('#f-branch').value = ''; break;
    case 'code': $('#f-code').value = ''; break;
    case 'day': $('#f-day').value = ''; break;
    case 'time': $('#f-time').value = ''; break;
    case 'level': $('#f-level').value = 'LS'; await syncProgramFilter(); break;
    case 'method': $('#f-method').value = ''; break;
    case 'program': $('#f-program').value = ''; break;
    case 'open': $('#f-open').checked = false; break;
  }
}

function resetFilterControls({ keepQuery = false } = {}) {
  for (const sel of ['#f-branch', '#f-day', '#f-time', '#f-method', '#f-program']) $(sel).value = '';
  $('#f-level').value = 'LS';
  $('#f-code').value = '';
  $('#f-open').checked = false;
  if (!keepQuery) {
    $('#q').value = '';
    $('#q').dispatchEvent(new Event('input')); // arama × düğmesi senkron kalsın
  }
}

function clearAllFilters() {
  resetFilterControls();
  syncProgramFilter().then(applyFilters);
  $('#q').focus({ preventScroll: true });
}

/* ---------- şube seçimi / sepet ---------- */

function selKey(r) { return `${r[3]}|${r[0]}`; }

function updateSelection() {
  const n = state.selected.size;
  $('#sepet').hidden = !n;
  if (n) $('#sel-count').innerHTML = t('selCount', { n: `<b class="num">${n}</b>` });
  syncSelectAll();
}

// "Tümünü seç" kutusu filtrelenmiş bütün şubeleri kapsar (önceki tablo
// davranışı); durumu her seçim değişiminde yeniden hesaplanır.
function syncSelectAll() {
  const all = $('#sel-all');
  if (!all) return;
  const rows = state.filtered || [];
  let selected = 0;
  for (const r of rows) if (state.selected.has(selKey(r))) selected++;
  all.checked = rows.length > 0 && selected === rows.length;
  all.indeterminate = selected > 0 && selected < rows.length;
}

function setSelected(key, on) {
  if (on) state.selected.add(key);
  else state.selected.delete(key);
}

// Görünen satırların kutu/vurgu durumunu state.selected ile eşitler; listeyi
// baştan kurmadan (kaydırma konumu ve açık şube listeleri korunur).
function syncRenderedSelection() {
  for (const li of document.querySelectorAll('#course-groups .course-section')) {
    const on = state.selected.has(li.dataset.key);
    li.classList.toggle('is-selected', on);
    const box = li.querySelector('.row-sel');
    if (box) box.checked = on;
  }
}

function clearSelection() {
  state.selected.clear();
  updateSelection();
  syncRenderedSelection();
  if (ttOn) renderTimetable();
}

function rowsToCSV(rows, filename) {
  const headers = ['CRN', 'Ders Kodu', 'Bölüm', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Yer', 'Kontenjan', 'Yazılan', 'Doluluk (%)'];
  const data = rows.map((r) => {
    const [cap, enr] = effectiveQuota(r);
    return [r[0], r[1], r[3], r[2], r[4], r[5], r[11] || '', cap, enr, cap ? Math.round((enr / cap) * 100) : ''];
  });
  downloadCSV(filename, headers, data);
}

function exportCSV() {
  const only = $('#sel-only').checked;
  const rows = only && state.selected.size ? state.rows.filter((r) => state.selected.has(selKey(r))) : state.filtered;
  rowsToCSV(rows, `dersler-${state.termSlug}.csv`);
}

function exportSelectedCSV() {
  rowsToCSV(state.rows.filter((r) => state.selected.has(selKey(r))), `secili-${state.termSlug}.csv`);
}

// Seçili şubeleri program oluşturucuya ekleyip o sekmeye geçer.
function sendToProgram() {
  if (!state.selected.size) { toast(t('selNeedSection'), { kind: 'warn' }); return; }
  let added = 0;
  for (const r of state.rows) {
    if (state.selected.has(selKey(r)) && fav.addToSchedule(state.termSlug, r[3], r[0])) added++;
  }
  toast(added ? t('selSent', { n: added }) : t('selAlreadyInProgram'), { kind: added ? 'ok' : 'warn' });
  window.dispatchEvent(new CustomEvent('itu:goto-program'));
}

/* ---------- liste: derse göre gruplanmış şubeler ---------- */

// Kontenjan/yazılan sayısını gösterirken saatlik kontenjan ölçümü (state.quota),
// varsa, günlük/haftalık katalog taramasından (r[6]/r[7]) daha güncel olduğu için
// önceliklidir — aksi halde "kontenjan ölçümü N sa önce" yazsa da satırlar
// eski taramanın sayılarını gösterir.
export function effectiveQuota(r) {
  const live = state.quota?.get(r[0]);
  return live ? [live.capacity, live.enrolled] : [r[6], r[7]];
}

// Aynı dersin şubeleri tek başlık altında toplanır. Filtrelenmiş satır sırası
// korunur; böylece seçili sıralamanın ilk eşleşmesi grup sırasını, devamındaki
// eşleşmeler de şube sırasını belirler.
export function groupCourseRows(rows) {
  const byCourse = new Map();
  for (const row of rows) {
    const key = `${row[1]}\u0000${row[2]}`;
    if (!byCourse.has(key)) byCourse.set(key, { code: row[1], name: row[2], rows: [] });
    byCourse.get(key).rows.push(row);
  }
  return [...byCourse.values()];
}

// "Daha fazla" aynı filtrelenmiş dizinin devamını basar. Binlerce şubeyi her
// tıklamada yeniden gruplamak yerine, filtre/sıralama yeni bir dizi üretene dek
// sonucu paylaşırız. Referans karşılaştırması bilinçlidir: applyFilters her
// çalıştığında state.filtered'ı baştan kurar, dolayısıyla eski sonuç sızmaz.
export function cachedGroupCourseRows(rows) {
  if (rows !== groupCacheRows) {
    groupCacheRows = rows;
    groupCache = groupCourseRows(rows);
  }
  return groupCache;
}

// Hoca adını /hoca/<slug>/ sayfasının adresine çevirir. internal/site
// instructorSlug ile aynı kural: Türkçe harfler ASCII'ye, nokta silinir,
// kalan her harf/rakam dışı dizi tek tireye iner, en fazla 80 karakter.
export function instructorSlug(name) {
  const s = String(name || '')
    .replace(/[İIı]/g, 'i')
    .toLowerCase()
    .replace(/[üşçğö]/g, (c) => ({ ü: 'u', ş: 's', ç: 'c', ğ: 'g', ö: 'o' }[c]))
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.slice(0, 80);
}

const NO_INSTRUCTOR = new Set(['', '-', '--', '·', '.', '***']);

// Birden çok hoca virgülle ayrılır; her ad kendi sayfasına bağlanır, arama
// vurgusu (<mark>) ad içindeki konuma kaydırılarak korunur.
function instructorLinks(instr, hits) {
  const str = String(instr ?? '');
  if (NO_INSTRUCTOR.has(str.trim())) return '<span class="course-none">·</span>';
  const segments = [];
  const re = /[;,|]/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) { segments.push([last, m.index]); last = m.index + 1; }
  segments.push([last, str.length]);
  return segments.map(([s, e]) => {
    let a = s, b = e;
    while (a < b && /\s/.test(str[a])) a++;
    while (b > a && /\s/.test(str[b - 1])) b--;
    if (a >= b) return '';
    const name = str.slice(a, b);
    const local = (hits || [])
      .filter((h) => h.at < b && h.at + h.len > a)
      .map((h) => ({ ...h, at: h.at - a }));
    const inner = markField(name, 'instructor', local);
    const slug = NO_INSTRUCTOR.has(name) ? '' : instructorSlug(name);
    return slug ? `<a href="/hoca/${slug}/">${inner}</a>` : inner;
  }).filter(Boolean).join(', ');
}

// Kontenjan tek sayısal temsille: normalde "34 / 50", kritik (≥%85) durumda
// amber "47 / 50 · 3 yer", tam doluda kırmızı "50 / 50 · dolu" (DESIGN.md).
function quotaCell(cap, enr) {
  const q = quotaState(cap, enr);
  if (q.kind === 'unknown') return `<span class="quota-unknown">${esc(t('quotaUnknown'))}</span>`;
  const counts = `${formatInt(q.enrolled)} / ${formatInt(q.capacity)}`;
  let tail = '';
  if (q.kind === 'full') tail = ` · <span class="quota-state full">${esc(t('quotaFull'))}</span>`;
  else if (q.kind === 'tight') tail = ` · <span class="quota-state tight">${esc(t('quotaLeft', { n: formatInt(q.remaining) }))}</span>`;
  return `<span class="quota-sade quota-${q.kind}">${counts}${tail}</span>`;
}

function whenCell(row, kind) {
  const parts = String(row[5] || '').split(' | ').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) {
    if (kind === 'extra-exam') return `<span class="course-special-time">${esc(t('progExtraExamUntimed'))}</span>`;
    if (kind === 'graduation') return `<span class="course-special-time">${esc(t('progGraduationUntimed'))}</span>`;
    return `<span class="course-data-missing">${esc(t('courseTimeMissing'))}</span>`;
  }
  return parts.map((part) => {
    const m = part.match(/^(\S+)\s+(\d{2}:\d{2})\/(\d{2}:\d{2})$/);
    if (!m) return `<span>${esc(localizeSchedule(part))}</span>`;
    return `<span><span class="course-day">${esc(dayLabel(m[1]))}</span> <span class="when">${m[2]}–${m[3]}</span></span>`;
  }).join('');
}

function whereCell(row) {
  const where = row[11] || '';
  if (!where) return '';
  return where.split(' | ').map((loc) => `<span>${esc(loc.trim() || '·')}</span>`).join('');
}

function createSection(row, extra = false) {
  const [crn, code, name, branch, instructor] = row;
  const [cap, enr] = effectiveQuota(row);
  const key = selKey(row);
  const starred = fav.isFavorite(state.termSlug, branch, crn);
  const selected = state.selected.has(key);
  const hits = state.marks?.get(key)?.hits || [];
  const kind = specialSectionKind(row);
  const li = document.createElement('li');
  li.className = `course-section${selected ? ' is-selected' : ''}${extra ? ' course-section-extra' : ''}`;
  li.dataset.key = key;
  li.innerHTML = `
    <span class="cs-sel"><label><span class="sr-only">${esc(t('courseSelectSection', { crn }))}</span><input type="checkbox" class="row-sel"${selected ? ' checked' : ''}></label></span>
    <span class="cs-fav"><button type="button" class="fav-star${starred ? ' on' : ''}" data-key="${esc(key)}" aria-pressed="${starred}" aria-label="${esc(t(starred ? 'favRemoveLabel' : 'favAddLabel'))}">${STAR_SVG}</button></span>
    <button type="button" class="course-section-open course-crn crn" translate="no" aria-haspopup="dialog" aria-label="${esc(t('courseOpenSection', { code, name, crn }))}">${markField(crn, 'crn', hits.filter((h) => h.field === 'crn'))}</button>
    <span class="course-ins">${instructorLinks(instructor, hits.filter((h) => h.field === 'instructor'))}</span>
    <span class="course-when">${whenCell(row, kind)}</span>
    <span class="course-where">${whereCell(row)}</span>
    <span class="course-quota">${Number(cap) > 0 ? quotaCell(cap, enr) : `<span class="quota-unknown">${esc(t('quotaUnknown'))}</span>`}</span>`;
  li.querySelector('.course-section-open').addEventListener('click', () => openDetail(row));
  li.querySelector('.row-sel').addEventListener('change', (ev) => {
    setSelected(key, ev.target.checked);
    li.classList.toggle('is-selected', ev.target.checked);
    updateSelection();
    if (ttOn) renderTimetable();
  });
  // Satırın boş bir yerine tıklamak da detayı açar (önceki tablo davranışı);
  // bağlantı, düğme ve onay kutusu kendi işini yapar.
  li.addEventListener('click', (ev) => {
    if (ev.target.closest('a, button, input, label')) return;
    openDetail(row);
  });
  wireFavoriteButton(li.querySelector('.fav-star'));
  return li;
}

function columnHead() {
  const head = document.createElement('div');
  head.className = 'course-colhead';
  head.innerHTML = `<span class="cs-sel"><label><span class="sr-only">${esc(t('courseSelectAll'))}</span><input type="checkbox" class="row-sel" id="sel-all"></label></span>`
    + `<span><span class="sr-only">${esc(t('colFav'))}</span></span>`
    + `<span>${esc(t('colCRN'))}</span><span>${esc(t('colInstructor'))}</span><span>${esc(t('colWhen'))}</span><span>${esc(t('colWhere'))}</span><span class="cq">${esc(t('colQuota'))}</span>`;
  head.querySelector('#sel-all').addEventListener('change', (ev) => {
    for (const r of state.filtered) setSelected(selKey(r), ev.target.checked);
    updateSelection();
    syncRenderedSelection();
    if (ttOn) renderTimetable();
  });
  return head;
}

function createGroup(group) {
  const first = group.rows[0];
  const titleHitRow = group.rows.find((row) => {
    const hits = state.marks?.get(selKey(row))?.hits || [];
    return hits.some((hit) => hit.field === 'code' || hit.field === 'name');
  }) || first;
  const titleHits = state.marks?.get(selKey(titleHitRow))?.hits || [];
  const kinds = [...new Set(group.rows.map((r) => specialSectionKind(r)).filter(Boolean))];
  const badges = kinds.map((kind) => {
    const isExtra = kind === 'extra-exam';
    return `<span class="section-kind-badge ${kind}" title="${esc(t(isExtra ? 'courseExtraExamHelp' : 'courseGraduationHelp'))}">${esc(t(isExtra ? 'courseExtraExamBadge' : 'courseGraduationBadge'))}</span>`;
  }).join('');
  const fullCount = group.rows.filter((r) => {
    const [cap, enr] = effectiveQuota(r);
    return quotaState(cap, enr).kind === 'full';
  }).length;
  const meta = t('courseSectionCount', { n: group.rows.length }) + (fullCount ? ` · ${t('courseFullCount', { n: fullCount })}` : '');

  const article = document.createElement('article');
  article.className = 'course-group';
  article.innerHTML = `
    <header class="course-group-head">
      <button type="button" class="course-group-open" aria-haspopup="dialog" aria-label="${esc(t('courseOpenCourse', { code: group.code, name: group.name }))}">
        <span class="course-group-code code" translate="no">${markField(group.code, 'code', titleHits.filter((h) => h.field === 'code'))}</span>
        <span class="course-group-name">${markField(group.name, 'name', titleHits.filter((h) => h.field === 'name'))}</span>
      </button>
      ${badges ? `<span class="course-group-badges">${badges}</span>` : ''}
      <span class="course-group-meta">${esc(meta)}</span>
    </header>
    <ul class="course-section-list" aria-label="${esc(t('courseSectionsOf', { code: group.code }))}"></ul>`;

  const list = article.querySelector('.course-section-list');
  const preview = sectionPreview();
  group.rows.slice(0, preview).forEach((row) => list.appendChild(createSection(row)));
  article.querySelector('.course-group-open').addEventListener('click', () => {
    openCourseDetail(group.code, { source: 'dersler' });
  });

  if (group.rows.length > preview) {
    const hiddenCount = group.rows.length - preview;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'course-sections-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = t('courseMoreSections', { n: hiddenCount });
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (!expanded && !list.querySelector('.course-section-extra')) {
        const extras = document.createDocumentFragment();
        group.rows.slice(preview).forEach((row) => extras.appendChild(createSection(row, true)));
        list.appendChild(extras);
      }
      for (const row of list.querySelectorAll('.course-section-extra')) row.hidden = expanded;
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.textContent = expanded ? t('courseMoreSections', { n: hiddenCount }) : t('courseLessSections');
    });
    article.appendChild(toggle);
  }
  return article;
}

function renderRows(append) {
  const box = $('#course-groups');
  const groups = cachedGroupCourseRows(state.filtered);
  if (!append) {
    box.innerHTML = '';
    state.shown = 0;
  }
  if (!groups.length) {
    box.innerHTML = `<p class="empty">${esc(t('courseEmpty'))}</p>`;
    $('#more').hidden = true;
    return;
  }
  const slice = groups.slice(state.shown, state.shown + GROUP_PAGE);
  const frag = document.createDocumentFragment();
  if (!append) frag.appendChild(columnHead());
  for (const group of slice) frag.appendChild(createGroup(group));
  box.appendChild(frag);

  state.shown += slice.length;
  const remaining = groups.length - state.shown;
  $('#more').hidden = ttOn || remaining <= 0;
  $('#more').textContent = t('courseMoreGroups', { n: remaining });
  syncSelectAll();
}

// Favori aç/kapa + toast.
function toggleFavoriteByKey(key) {
  const [branch, crn] = key.split('|');
  const on = fav.toggleFavorite(state.termSlug, branch, crn);
  toast(t(on ? 'favAdded' : 'favRemoved', { crn }), { kind: on ? 'ok' : 'warn' });
  return on;
}

function wireFavoriteButton(star) {
  if (!star) return;
  star.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const on = toggleFavoriteByKey(star.dataset.key);
    star.classList.toggle('on', on);
    star.setAttribute('aria-pressed', String(on));
    star.setAttribute('aria-label', t(on ? 'favRemoveLabel' : 'favAddLabel'));
    star.classList.remove('pop');
    void star.offsetWidth;
    star.classList.add('pop');
  });
}

/* ---------- detay paneli (modal) ---------- */

// Detay paneli ortak bileşende (core/course-detail.js); bu fonksiyon satır
// bilgisini aktarır. program.js ve liste aynı imzayla çağırır.
// termSlug verilmezse Dersler'deki aktif dönem kullanılır.
export function openDetail(row, termSlug) {
  openCourseDetail(row[1], { term: termSlug, crn: row[0], source: 'dersler' });
}

/* ---------- URL durumu ---------- */

// Dönem + arama + filtre durumunu URL'ye yazar; bağlantı paylaşılabilir olur.
function saveState() {
  const p = new URLSearchParams();
  // term yalnızca aktif dönem dışındaysa yaz (varsayılan URL'ye girmez).
  if (state.termSlug && state.termSlug !== state.index?.currentSlug) p.set('term', state.termSlug);
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
  if (state.sort.key !== 'crn') p.set('sort', state.sort.key);
  if (state.sort.dir !== 1) p.set('sdir', String(state.sort.dir));
  writeLocalState('itu-courses-state', {
    term: state.termSlug || '', q, branch: $('#f-branch').value, day: $('#f-day').value,
    time: $('#f-time').value, level: $('#f-level').value, method: $('#f-method').value,
    program: $('#f-program').value, code: $('#f-code').value.trim(), open: $('#f-open').checked,
    sort: state.sort.key, dir: state.sort.dir,
  }, { validate: isPlainObject });
  // Yaşanmış hata: bu fonksiyon dönem/kontenjan yüklenirken (loadTerm/loadQuota)
  // boot sırasında Dersler aktif sekme OLMASA BİLE çalışıyordu — URL'i tamamen
  // bu formun kendi alanlarından yeniden kurduğu için diğer sekmelerin query
  // parametrelerini (ör. Önşart Haritası'nın ?prog=X'i) sessizce siliyordu.
  // Paylaşılabilir bir derin bağlantıyla açılan başka bir sekme, birkaç saniye
  // içinde query'sini kaybediyordu. Yalnızca Dersler gerçekten görünürken yaz.
  if (!isViewVisible('dersler')) return;
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
  history.replaceState(null, '', url);
}

/* ---------- zaman çizelgesi ---------- */

let ttOn = false;

// Liste ile çizelge arasında geçiş. Filtreler/arama uygulanınca çizelge
// yeniden çizilir; "yalnızca seçilenler" açıksa seçim kümesi kullanılır.
function setTimetable(on) {
  ttOn = Boolean(on);
  $('#course-groups').hidden = ttOn;
  const groups = cachedGroupCourseRows(state.filtered || []);
  $('#more').hidden = ttOn || state.shown >= groups.length;
  $('#tt').hidden = !ttOn;
  $('#tt-toggle').classList.toggle('active', ttOn);
  $('#tt-toggle').setAttribute('aria-pressed', String(ttOn));
  $('#view-list').classList.toggle('active', !ttOn);
  $('#view-list').setAttribute('aria-pressed', String(!ttOn));
  if (ttOn) renderTimetable();
}

function timetableRows() {
  const only = $('#sel-only').checked;
  if (only && state.selected.size) return state.rows.filter((r) => state.selected.has(selKey(r)));
  return state.filtered;
}

// "Pazartesi 08:30/12:29 | Çarşamba 13:00/16:59" -> oturum listesi (dakika cinsinden).
export function parseWhen(when) {
  const out = [];
  if (!when) return out;
  for (const part of String(when).split(' | ')) {
    const m = part.trim().match(/^(\S+)\s+(\d{2}:\d{2})\/(\d{2}:\d{2})$/);
    if (!m) continue;
    const day = m[1];
    const start = toMin(m[2]), end = toMin(m[3]);
    if (end > start) out.push({ day, start, end });
  }
  return out;
}

// Saat dilimini dakikadan kovaya indirir. Saf fonksiyon — test edilebilir.
export function timeBucket(startMin) {
  if (startMin < 12 * 60) return 'sabah';
  if (startMin < 17 * 60) return 'ogle';
  return 'aksam';
}

// Gün filtresi için tam-token eşleşmesi. when alanı "Pazartesi 08:30/12:29 |
// Çarşamba 13:00/16:59" biçimindedir. Alt-dize araması yanlış eşleşme üretir:
// "Pazar", "Pazartesi"nin içinde geçer; "Cuma", "Cumartesi"nin içinde. Saf
// fonksiyon — test edilebilir.
export function matchesDay(when, day) {
  return String(when || '').split(/\s+/).includes(day);
}

function toMin(x) {
  const [h, m] = x.split(':').map(Number);
  return h * 60 + m;
}

function fmtMin(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

const TT_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// "gün|saat" oturumlarıyla aynı sırada duran "yer" (bina+derslik) dizisini
// hizalı biçimde eşler. Bir "gün|saat" parçası parseWhen'de reddedilirse
// (bozuk biçim) karşılık gelen "yer" parçası da atlanır ki indeksler kaymasın.
function sessionsWithLocation(when, where) {
  const whenParts = String(when || '').split(' | ');
  const whereParts = String(where || '').split(' | ');
  const out = [];
  whenParts.forEach((part, i) => {
    const m = part.trim().match(/^(\S+)\s+(\d{2}:\d{2})\/(\d{2}:\d{2})$/);
    if (!m) return;
    const start = toMin(m[2]), end = toMin(m[3]);
    if (end <= start) return;
    out.push({ day: m[1], start, end, where: (whereParts[i] || '').trim() });
  });
  return out;
}

// Aynı günde art arda gelen dersler arasında bina/kampüs için önerilen tampon
// yoksa uyarı üretir. Bina bilgisi olmayan eski dönemler karşılaştırmaya
// girmez; bilinmeyen yeni bina kodlarında 20 dakikalık muhafazakâr eski kural
// sürer. Saf fonksiyon — test edilebilir.
export function buildingGapWarnings(all) {
  const byDay = new Map();
  for (const s of all) {
    if (!byDay.has(s.day)) byDay.set(s.day, []);
    byDay.get(s.day).push(s);
  }
  const out = [];
  for (const [day, sessions] of byDay) {
    sessions.sort((a, b) => a.start - b.start);
    for (let i = 1; i < sessions.length; i++) {
      const prev = sessions[i - 1], cur = sessions[i];
      const gap = cur.start - prev.end;
      const issue = transitionIssue(prev.where, cur.where, gap);
      if (!issue) continue;
      out.push({ ...issue, day, fromCode: prev.row[1], toCode: cur.row[1], fromWhere: prev.where, toWhere: cur.where });
    }
  }
  return out;
}

// Oturumları gün × 30dk slot ızgarasına yerleştirir; çakışma (aynı hücrede
// birden çok farklı ders) buradan görünür. Saf fonksiyon — test edilebilir.
export function buildTimetable(rows) {
  const all = [];
  for (const r of rows) {
    const where = isRemoteMethod(r[9]) ? '' : r[11];
    for (const s of sessionsWithLocation(r[5], where)) all.push({ ...s, row: r });
  }
  if (!all.length) return null;
  const startSlot = Math.floor(Math.min(...all.map((s) => s.start)) / 30) * 30;
  const endSlot = Math.ceil(Math.max(...all.map((s) => s.end)) / 30) * 30;
  const nSlots = (endSlot - startSlot) / 30;

  const grid = TT_DAYS.map(() => Array.from({ length: nSlots }, () => []));
  for (const s of all) {
    const di = TT_DAYS.indexOf(s.day);
    if (di < 0) continue;
    for (let x = s.start; x < s.end; x += 30) {
      const si = (x - startSlot) / 30;
      if (si >= 0 && si < nSlots) grid[di][si].push(s);
    }
  }
  return { startSlot, nSlots, grid, all };
}

// Farklı derslerin aynı günde üst üste binen oturum çiftleri. Aynı dersin
// şubeleri birbirinin alternatifidir; çakışma sayılmaz. Saf fonksiyon.
export function timetableConflicts(sessions) {
  const out = [];
  const byDay = new Map();
  for (const s of sessions) {
    if (!byDay.has(s.day)) byDay.set(s.day, []);
    byDay.get(s.day).push(s);
  }
  for (const [day, list] of byDay) {
    list.sort((a, b) => a.start - b.start || a.end - b.end);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length && list[j].start < list[i].end; j++) {
        const a = list[i], b = list[j];
        if (a.row[1] === b.row[1]) continue;
        out.push({ day, a, b, start: Math.max(a.start, b.start), end: Math.min(a.end, b.end) });
      }
    }
  }
  return out;
}

// Bir gün içindeki oturumlara yan yana şerit atar: üst üste binen bir küme
// kendi içinde eşit genişlikli şeritlere bölünür.
function assignLanes(list) {
  list.sort((a, b) => a.start - b.start || b.end - a.end);
  let cluster = [];
  let clusterEnd = -1;
  const flush = () => {
    const laneEnds = [];
    for (const s of cluster) {
      let lane = laneEnds.findIndex((end) => end <= s.start);
      if (lane < 0) { lane = laneEnds.length; laneEnds.push(s.end); } else laneEnds[lane] = s.end;
      s.lane = lane;
    }
    for (const s of cluster) s.lanes = laneEnds.length;
    cluster = [];
  };
  for (const s of list) {
    if (cluster.length && s.start >= clusterEnd) flush();
    cluster.push(s);
    clusterEnd = Math.max(clusterEnd, s.end);
  }
  if (cluster.length) flush();
}

function renderTimetable() {
  const wrap = $('#tt');
  const source = timetableRows();
  const capped = source.length > TT_MAX_SECTIONS;
  const rows = capped ? source.slice(0, TT_MAX_SECTIONS) : source;
  const table = buildTimetable(rows);
  if (!table) {
    wrap.innerHTML = `<p class="empty">${esc(t('ttEmpty'))}</p>`;
    return;
  }
  const sessions = table.all.filter((s) => TT_DAYS.includes(s.day)).map((s) => ({ ...s }));
  const weekend = sessions.some((s) => s.day === 'Cumartesi' || s.day === 'Pazar');
  const days = weekend ? TT_DAYS : TT_DAYS.slice(0, 5);
  const startH = Math.floor(Math.min(...sessions.map((s) => s.start)) / 60);
  const endH = Math.max(startH + 1, Math.ceil(Math.max(...sessions.map((s) => s.end)) / 60));
  const span = (endH - startH) * 60;
  const pct = (m) => `${(((m - startH * 60) / span) * 100).toFixed(3)}%`;

  const conflicts = timetableConflicts(sessions);
  const inConflict = new Set();
  for (const c of conflicts) { inConflict.add(c.a); inConflict.add(c.b); }

  let status;
  if (conflicts.length) {
    const c = conflicts[0];
    const lineText = t('ttConflictLine', {
      day: esc(dayLabel(c.day)),
      time: `<span class="when">${fmtMin(c.start)}–${fmtMin(c.end)}</span>`,
      a: `<span class="code">${esc(c.a.row[1])}</span>`, ac: `<span class="crn">${esc(c.a.row[0])}</span>`,
      b: `<span class="code">${esc(c.b.row[1])}</span>`, bc: `<span class="crn">${esc(c.b.row[0])}</span>`,
    });
    const more = conflicts.length > 1 ? ` · ${esc(t('ttMoreConflicts', { n: conflicts.length - 1 }))}` : '';
    status = `<p class="ctt-status is-conflict" role="status">${ALERT_SVG}<span><b>${esc(t('ttConflict'))}</b> · ${lineText}${more}</span></p>`;
  } else {
    status = `<p class="ctt-status" role="status"><span>${esc(t('ttNoConflict', { s: sessions.length, n: rows.length }))}</span></p>`;
  }
  const cappedNote = capped ? `<p class="ctt-capped">${esc(t('ttCapped', { n: TT_MAX_SECTIONS }))}</p>` : '';

  const hours = [];
  for (let h = startH; h <= endH; h++) hours.push(h);
  const hourLabels = hours.map((h) => `<span style="top:${pct(h * 60)}">${String(h).padStart(2, '0')}:00</span>`).join('');
  const hourLines = hours.map((h) => `<i class="ctt-hl" style="top:${pct(h * 60)}"></i>`).join('');

  const dayCols = days.map((day) => {
    const list = sessions.filter((s) => s.day === day);
    assignLanes(list);
    const blocks = list.map((s) => {
      const time = `${fmtMin(s.start)}–${fmtMin(s.end)}`;
      const width = 100 / s.lanes;
      const style = `top:${pct(s.start)};height:${(((s.end - s.start) / span) * 100).toFixed(3)}%;left:calc(${(s.lane * width).toFixed(3)}% + 2px);width:calc(${width.toFixed(3)}% - 4px)`;
      const conflict = inConflict.has(s);
      return `<button type="button" class="ctt-block${conflict ? ' is-conflict' : ''}" style="${style}" data-code="${esc(s.row[1])}" title="${esc(`${s.row[1]} ${s.row[2]} · CRN ${s.row[0]}`)}" aria-label="${esc(t('ttOpenBlock', { code: s.row[1], time: `${dayLabel(day)} ${time}` }))}${conflict ? `, ${esc(t('ttConflict'))}` : ''}">`
        + `<b class="code" translate="no">${esc(s.row[1])}</b><span class="when">${time}</span>${s.where ? `<span class="ctt-room">${esc(s.where)}</span>` : ''}</button>`;
    }).join('');
    return `<div class="ctt-day">${hourLines}${blocks}</div>`;
  }).join('');

  wrap.innerHTML = `${status}${cappedNote}
    <div class="ctt-frame" role="region" aria-label="${esc(t('ttRegion'))}" tabindex="0">
      <div class="ctt-inner" style="--ctt-days:${days.length}">
        <div class="ctt-head"><span></span>${days.map((d) => `<span>${esc(dayLabel(d))}</span>`).join('')}</div>
        <div class="ctt-body" style="height:${(endH - startH) * 52}px">
          <div class="ctt-hours">${hourLabels}</div>
          ${dayCols}
        </div>
      </div>
    </div>`;

  // Bloğa tıklayınca ders detay paneli açılır (Faz 2.2: her yerden aynı panel).
  wrap.querySelectorAll('.ctt-block').forEach((block) => {
    block.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: block.dataset.code, source: 'tt' } }));
    });
  });
}
