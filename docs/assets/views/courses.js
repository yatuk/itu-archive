// Dersler görünümü: dönem arama/filtre/sıralama, şube seçimi (sepet), zaman
// çizelgesi, detay paneli, CSV indirme ve paylaşılabilir URL durumu.
//
// Tüm veri state.rows (arama indeksi) üzerinden çalışır; tam kayıt yalnızca
// detay açılınca ilgili branş dosyasından gelir. Arama indeksi 10 alanlıdır:
// [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan, seviye, yöntem] —
// son iki alan tarihsel dönemlerde olmayabilir, filtrelerde "yoksa geç" yapılır.

import { $, getJSON, esc, fold, normSearch, matchRow, markField, suggestDrop, debounce, downloadCSV, setStatus, fillMeasured, formatInt, timeAgo } from '../core/utils.js?v=48f281c5afc3';
import { methodToCode } from '../core/urlcodes.js?v=48f281c5afc3';
import { formatProgramLabel, loadProgramMap, normalizeProgramLevel, programLevelLabel } from '../core/programs.js?v=48f281c5afc3';
import { state } from '../core/store.js?v=48f281c5afc3';
import { quotaDisplay } from '../core/chart.js?v=48f281c5afc3';
import { fillRows } from '../core/table.js?v=48f281c5afc3';
import * as fav from '../core/favorites.js?v=48f281c5afc3';
import { toast } from '../core/toast.js?v=48f281c5afc3';
import { openCourseDetail } from '../core/course-detail.js?v=48f281c5afc3';
import { I18N } from '../i18n.js?v=48f281c5afc3';
import { writeLocalState, isPlainObject } from '../core/persistence.js?v=48f281c5afc3';

const PAGE = 200;
const MOBILE_GROUP_PAGE = 30;
const MOBILE_SECTION_PREVIEW = 4;
let mobileGroupCacheRows = null;
let mobileGroupCache = [];
const mobileCourseLayout = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(max-width: 640px)')
  : { matches: false, addEventListener() {}, addListener() {} };
const timeLabel = (value) => ({
  sabah: I18N.t('timeMorning'),
  ogle: I18N.t('timeNoon'),
  aksam: I18N.t('timeEvening'),
}[value] || value);
const localizeSchedule = (value) => {
  if (I18N.lang !== 'en') return value;
  const days = {
    Pazartesi: 'Monday', Salı: 'Tuesday', Çarşamba: 'Wednesday',
    Perşembe: 'Thursday', Cuma: 'Friday', Cumartesi: 'Saturday', Pazar: 'Sunday',
  };
  return String(value || '').replace(/Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar/g, (day) => days[day]);
};

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
  $('#tt-toggle').addEventListener('click', toggleTimetable);
  // Sık kullanılan filtreler ilk sırada; seviye/yöntem/program/kod ikincil
  // disclosure içinde. Açık/kapalı olması filtre değerlerini değiştirmez.
  $('#sel-all').addEventListener('change', () => {
    const on = $('#sel-all').checked;
    for (const r of state.filtered) {
      if (on) state.selected.add(selKey(r));
      else state.selected.delete(selKey(r));
    }
    for (const cb of document.querySelectorAll('#rows .row-sel')) cb.checked = on;
    updateSelection();
  });
  $('#sel-csv').addEventListener('click', exportSelectedCSV);
  $('#sel-clear').addEventListener('click', clearSelection);
  $('#sel-only').addEventListener('change', () => { if (ttOn) renderTimetable(); });
  $('#sel-send').addEventListener('click', sendToProgram);
  wireSort();
  // Mobil "sırala" seçicisi: masaüstü sıralama başlıklarının yerine.
  $('#mobile-sort').addEventListener('change', (e) => {
    const key = e.target.value;
    state.sort = { key, dir: state.sort.key === key ? state.sort.dir : 1 };
    updateSortUI();
    applyFilters();
  });
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
      filterSheet.setAttribute('aria-label', I18N.t('filterDialogLabel'));
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
    for (const sel of ['#f-branch', '#f-day', '#f-time', '#f-method', '#f-program']) $(sel).value = '';
    $('#f-level').value = 'LS';
    $('#f-code').value = '';
    $('#f-open').checked = false;
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

  // Masaüstü tablo, mobil ise ders altında gruplanmış şube listesi kullanır.
  // Ekran yönü/genişliği çalışma sırasında değişirse aynı filtrelenmiş veri yeni
  // düzene baştan basılır; iki ayrı veri kaynağı ya da cihaz tespiti yoktur.
  const switchCourseLayout = () => {
    state.shown = 0;
    renderRows(false);
  };
  if (mobileCourseLayout.addEventListener) mobileCourseLayout.addEventListener('change', switchCourseLayout);
  else mobileCourseLayout.addListener(switchCourseLayout);
}

export async function loadTerm(slug) {
  state.termSlug = slug;
  state.quota = null;
  state.quotaLast = null;
  state.selected.clear(); // seçim döneme özeldir
  updateSelection();
  setStatus($('#resultline'), 'dönem yükleniyor…', { busy: true });
  // Faz 5.4: iskelet — dönem verisi gelene kadar shimmer satırları.
  $('#rows').innerHTML = '<tr class="skel-row"><td colspan="10"><div class="skel">' +
    '<div class="skel-line wide"></div>'.repeat(5) +
    '</div></td></tr>';
  $('#course-groups').innerHTML = '<div class="mobile-course-skeleton skel">' +
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
    branchSel.innerHTML = '<option value="">hepsi</option>' +
      meta.branches.map((b) => `<option value="${b.code}">${b.code} (${b.sections})</option>`).join('');
    branchSel.value = meta.branches.some((b) => b.code === keep) ? keep : '';

    // Öğretim yöntemi seçenekleri veriden gelir (tarihsel dönemlerde boş).
    const methods = [...new Set(rows.map((r) => r[9]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
    const mSel = $('#f-method');
    const keepM = mSel.value;
    mSel.innerHTML = '<option value="">hepsi</option>' +
      methods.map((m) => `<option>${esc(m)}</option>`).join('');
    mSel.value = methods.includes(keepM) ? keepM : '';

    await syncProgramFilter($('#f-program').value);

    applyFilters();
  } catch (e) {
    setStatus($('#resultline'), `veri yüklenemedi (${e.message})`, { error: true });
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
  pSel.innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
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
  } catch {
    if (state.termSlug !== slug) return;
    state.quota = null; // bu dönem için henüz ölçüm yok
    state.quotaLast = null;
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
    // ad kelime başı > hoca kelime başı > kelime ortası); eşitlikte sütun sıralaması.
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
  // 0 sonuçta terim düşürme önerisi: gürültü katan terimi düşürüp en kesin
  // kalanı öner ("engineering ma" → yalnızca 'engineering').
  let hint = '';
  if (n === 0 && terms.length > 1) {
    const countFor = (sub) => state.rows.reduce(
      (acc, r, i) => acc + (passBase(r) && matchRow(sub, fieldsOf(i)) ? 1 : 0), 0);
    const drop = suggestDrop(terms, countFor);
    if (drop >= 0) {
      const rest = terms.filter((_, j) => j !== drop).map((t) => `'${esc(t)}'`).join(' ve ');
      hint = ` · yalnızca ${rest} ile aramayı dene`;
    }
  }
  const measured = state.quotaLast ? fillMeasured(state.quotaLast, Date.now(), I18N.lang) : '';
  const quotaFreshness = measured ? ` · ${I18N.lang === 'en' ? 'capacity' : 'kontenjan ölçümü'} ${esc(measured)}` : '';
  const scrapedAgo = state.scrapedAt ? timeAgo(state.scrapedAt, Date.now(), I18N.lang) : '';
  const scrapeFreshness = scrapedAgo
    ? ` · <span class="${state.stale ? 'data-stale' : ''}">${I18N.lang === 'en' ? 'last scrape' : 'son tarama'} ${esc(scrapedAgo)}</span>`
    : '';
  $('#resultline').innerHTML = (n === total
    ? (I18N.lang === 'en'
      ? `<b>${n}</b> sections · ${state.meta.courses} courses · ${state.meta.branches.length} branches`
      : `<b>${n}</b> şube · ${state.meta.courses} ders · ${state.meta.branches.length} bölüm`)
    : (I18N.lang === 'en'
      ? `<b>${n}</b> / ${total} sections matched${hint}`
      : `<b>${n}</b> / ${total} şube eşleşti${hint}`)) + scrapeFreshness + quotaFreshness;
  // Mobil filtre düğmesi etiketi: aktif filtre sayısı (dönem sayılmaz).
  const activeCount = [
    branch, day, time, level, method, program, code.trim(),
    openOnly ? '1' : '',
  ].filter(Boolean).length;
  const fb = $('#f-filter-btn');
  if (fb) fb.textContent = `${I18N.t('filterButton')} (${activeCount})`;
  const secondaryCount = [level, method, program, code.trim()].filter(Boolean).length;
  const more = $('#f-more-toggle');
  more.textContent = `${I18N.t('filterMore')}${secondaryCount ? ` (${secondaryCount})` : ''}`;
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
    case 'instructor': return r[3];
    case 'when': return r[5];
    case 'cap': return r[6];
    case 'enr': return r[7];
    case 'fill': { const c = r[6]; return c ? r[7] / c : -1; }
    default: return '';
  }
}

function wireSort() {
  const headers = [...document.querySelectorAll('#results th[data-sort]')];
  for (const th of headers) {
    // Gerçek buton: klavye ve ekran okuyucu erişimi için th yerine buton.
    th.querySelector('.th-sort').addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sort.key === key) state.sort.dir *= -1;
      else state.sort = { key, dir: 1 };
      updateSortUI();
      applyFilters();
    });
  }
  updateSortUI();
}

function updateSortUI() {
  for (const th of document.querySelectorAll('#results th[data-sort]')) {
    const on = th.dataset.sort === state.sort.key;
    th.classList.toggle('sorted', on);
    th.setAttribute('aria-sort', on ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none');
  }
  const ms = $('#mobile-sort');
  if (ms) ms.value = state.sort.key;
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
  if (q) chips.push({ key: 'q', label: `"${q}"` });
  if ($('#f-branch').value) chips.push({ key: 'branch', label: `${I18N.t('filterBranch')}: ${$('#f-branch').value}` });
  if ($('#f-code').value.trim()) chips.push({ key: 'code', label: `${I18N.t('filterCode')}: ${$('#f-code').value.trim()}` });
  if ($('#f-day').value) chips.push({ key: 'day', label: `${I18N.t('filterDay')}: ${$('#f-day option:checked').textContent}` });
  if ($('#f-time').value) chips.push({ key: 'time', label: `${I18N.t('filterTime')}: ${timeLabel($('#f-time').value)}` });
  if ($('#f-level').value) chips.push({ key: 'level', label: `${I18N.t('filterLevel')}: ${programLevelLabel($('#f-level').value, I18N.lang)}` });
  if ($('#f-method').value) chips.push({ key: 'method', label: `${I18N.t('filterMethod')}: ${$('#f-method').value}` });
  if ($('#f-program').value) chips.push({ key: 'program', label: `${I18N.t('filterProgram')}: ${$('#f-program').value}` });
  if ($('#f-open').checked) chips.push({ key: 'open', label: I18N.t('filterOpen') });

  box.hidden = !chips.length;
  if (!chips.length) { box.innerHTML = ''; return; }
  box.innerHTML = chips.map((c) =>
    `<button type="button" class="chip-x" data-key="${c.key}" title="${I18N.lang === 'en' ? 'Remove filter' : 'Filtreyi kaldır'}">${esc(c.label)} ✕</button>`).join('');
  box.querySelectorAll('.chip-x').forEach((b) =>
    b.addEventListener('click', async () => { await clearFilter(b.dataset.key); applyFilters(); }));
}

async function clearFilter(key) {
  switch (key) {
    case 'q': $('#q').value = ''; break;
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

/* ---------- şube seçimi / sepet ---------- */

function selKey(r) { return `${r[3]}|${r[0]}`; }

function updateSelection() {
  const n = state.selected.size;
  $('#sepet').hidden = !n;
  if (!n) { $('#sel-all').checked = false; return; }
  $('#sel-count').textContent = I18N.lang === 'en' ? `${n} sections selected` : `${n} şube seçili`;
  $('#sel-all').checked = state.filtered.length > 0 && state.filtered.every((r) => state.selected.has(selKey(r)));
}

function clearSelection() {
  state.selected.clear();
  for (const cb of document.querySelectorAll('#rows .row-sel')) cb.checked = false;
  $('#sel-all').checked = false;
  updateSelection();
  if (ttOn) renderTimetable();
}

function rowsToCSV(rows, filename) {
  const headers = ['CRN', 'Ders Kodu', 'Bölüm', 'Ders Adı', 'Öğretim Üyesi', 'Zaman', 'Kontenjan', 'Yazılan', 'Doluluk (%)'];
  const data = rows.map((r) => [
    r[0], r[1], r[3], r[2], r[4], r[5], r[6], r[7],
    r[6] ? Math.round((r[7] / r[6]) * 100) : '',
  ]);
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
  if (!state.selected.size) { toast('Önce şube seç', { kind: 'warn' }); return; }
  let added = 0;
  for (const r of state.rows) {
    if (state.selected.has(selKey(r)) && fav.addToSchedule(state.termSlug, r[3], r[0])) added++;
  }
  toast(added ? `${added} şube programa gönderildi` : 'Seçili şubeler zaten programda', { kind: added ? 'ok' : 'warn' });
  window.dispatchEvent(new CustomEvent('itu:goto-program'));
}

/* ---------- tablo ---------- */

function renderRows(append) {
  if (mobileCourseLayout.matches) renderMobileGroups(append);
  else renderTableRows(append);
}

function renderTableRows(append) {
  const tbody = $('#rows');
  const slice = state.filtered.slice(state.shown, state.shown + PAGE);

  if (!slice.length && !state.shown) {
    fillRows(tbody, [], null, { empty: I18N.lang === 'en' ? 'No matching courses' : 'eşleşen ders yok', colspan: 10 });
    $('#more').hidden = true;
    return;
  }

  const rows = fillRows(tbody, slice, (r) => {
    const [crn, code, name, branch, instructor, when, cap, enr] = r;
    const key = selKey(r);
    const starred = fav.isFavorite(state.termSlug, branch, crn);
    // Arama eşleşmesini <mark> ile göster — "neden çıktı" görünür olsun.
    const hits = state.marks?.get(key)?.hits || null;
    const hitField = (f) => (hits ? hits.filter((h) => h.field === f) : null);
    return `
      <td class="sel"><input type="checkbox" class="row-sel" data-key="${esc(key)}" aria-label="${I18N.lang === 'en' ? 'Select section' : 'Şubeyi seç'}"${state.selected.has(key) ? ' checked' : ''}></td>
      <td class="fav"><button type="button" class="fav-star${starred ? ' on' : ''}" data-key="${esc(key)}" aria-label="${starred ? (I18N.lang === 'en' ? 'Remove from favorites' : 'Favorilerden çıkar') : (I18N.lang === 'en' ? 'Add to favorites' : 'Favorilere ekle')}" aria-pressed="${starred}">${starred ? '★' : '☆'}</button></td>
      <td class="crn" data-label="CRN">${markField(crn, 'crn', hitField('crn'))}</td>
      <td class="code" data-label="Ders"><b>${markField(code, 'code', hitField('code'))}</b><small>${esc(branch)}</small></td>
      <td class="course-name" data-label="Adı"><button class="row-toggle" type="button" aria-haspopup="dialog">${markField(name, 'name', hitField('name'))}</button></td>
      <td class="course-instructor" data-label="Öğretim Üyesi">${markField(instructor || '·', 'instructor', hitField('instructor'))}</td>
      <td class="when course-schedule" data-label="Zaman">${when
        ? when.split(' | ').map((session) => `<span>${esc(localizeSchedule(session))}</span>`).join('')
        : '<span>·</span>'}</td>
      <td class="num quota-legacy-col" data-label="Kont.">${formatInt(cap)}</td>
      <td class="num quota-legacy-col" data-label="Yazılan">${formatInt(enr)}</td>
      <td class="num quota-main-col" data-label="Kontenjan">${quotaDisplay(cap, enr, { legacyCounts: true })}</td>`;
  }, { append });

  if (rows) {
    rows.forEach((tr, i) => {
      const r = slice[i];
      // Toggle tıklaması satıra kabarcıklanıp openDetail'i iki kez çağırmasın
      // (ikinci çağrı odak-dönüş kaydını ezdiği için WCAG 2.4.3'ü bozuyordu).
      tr.querySelector('.row-toggle').addEventListener('click', (ev) => { ev.stopPropagation(); openDetail(r); });
      // Satırın herhangi bir yerine tıklayınca detay açılır; checkbox tıklaması
      // seçim için ayrıdır ve satır tıklamasını tetiklemez.
      tr.addEventListener('click', () => openDetail(r));
      const cb = tr.querySelector('.row-sel');
      if (cb) {
        cb.addEventListener('click', (ev) => ev.stopPropagation());
        cb.addEventListener('change', () => {
          if (cb.checked) state.selected.add(cb.dataset.key);
          else state.selected.delete(cb.dataset.key);
          updateSelection();
        });
      }
      wireFavoriteButton(tr.querySelector('.fav-star'));
    });
  }

  state.shown += slice.length;
  $('#more').hidden = state.shown >= state.filtered.length;
  $('#more').textContent = I18N.lang === 'en'
    ? `show more (${state.filtered.length - state.shown} remaining)`
    : `daha fazla göster (${state.filtered.length - state.shown} kaldı)`;
}

// Mobilde tekrar eden ders adı/kodu tek başlık altında toplanır. Filtrelenmiş
// satır sırası korunur; böylece seçili sıralamanın ilk eşleşmesi grup sırasını,
// devamındaki eşleşmeler de şube sırasını belirler.
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
  if (rows !== mobileGroupCacheRows) {
    mobileGroupCacheRows = rows;
    mobileGroupCache = groupCourseRows(rows);
  }
  return mobileGroupCache;
}

function createMobileSection(row, extra = false) {
  const [crn, code, name, branch, instructor, when, cap, enr] = row;
  const key = selKey(row);
  const starred = fav.isFavorite(state.termSlug, branch, crn);
  const hits = state.marks?.get(key)?.hits || [];
  const cleanInstructor = instructor && !['-', '·', '.'].includes(instructor.trim()) ? instructor : '';
  const schedule = when
    ? when.split(' | ').map((session) => `<span>${esc(localizeSchedule(session))}</span>`).join('')
    : `<span class="mobile-data-missing">${I18N.lang === 'en' ? 'Time not announced' : 'Zaman açıklanmadı'}</span>`;
  const quota = Number(cap) > 0
    ? quotaDisplay(cap, enr, { legacyCounts: true })
    : `<span class="quota-unknown">${I18N.lang === 'en' ? 'capacity not announced' : 'kontenjan açıklanmadı'}</span>`;
  const li = document.createElement('li');
  li.className = `mobile-section${extra ? ' mobile-section-extra' : ''}`;
  li.hidden = extra;
  li.innerHTML = `
    <button type="button" class="mobile-section-open" aria-haspopup="dialog" aria-label="${esc(code)} ${esc(name)}, CRN ${esc(crn)} ${I18N.lang === 'en' ? 'open details' : 'detayını aç'}">
      <span class="mobile-section-top">
        <span class="mobile-crn"><span>CRN</span> ${markField(crn, 'crn', hits.filter((h) => h.field === 'crn'))}</span>
        <span class="mobile-quota">${quota}</span>
      </span>
      <span class="mobile-schedule">${schedule}</span>
      ${cleanInstructor ? `<span class="mobile-instructor">${markField(cleanInstructor, 'instructor', hits.filter((h) => h.field === 'instructor'))}</span>` : ''}
    </button>
    <button type="button" class="fav-star${starred ? ' on' : ''}" data-key="${esc(key)}" aria-label="${starred ? (I18N.lang === 'en' ? 'Remove from favorites' : 'Favorilerden çıkar') : (I18N.lang === 'en' ? 'Add to favorites' : 'Favorilere ekle')}" aria-pressed="${starred}">${starred ? '★' : '☆'}</button>`;
  li.querySelector('.mobile-section-open').addEventListener('click', () => openDetail(row));
  wireFavoriteButton(li.querySelector('.fav-star'));
  return li;
}

function renderMobileGroups(append) {
  const box = $('#course-groups');
  const groups = cachedGroupCourseRows(state.filtered);
  const slice = groups.slice(state.shown, state.shown + MOBILE_GROUP_PAGE);

  if (!append) box.innerHTML = '';
  if (!slice.length && !state.shown) {
    box.innerHTML = `<p class="empty">${I18N.lang === 'en' ? 'No matching courses' : 'eşleşen ders yok'}</p>`;
    $('#more').hidden = true;
    return;
  }

  const frag = document.createDocumentFragment();
  for (const group of slice) {
    const first = group.rows[0];
    const titleHitRow = group.rows.find((row) => {
      const hits = state.marks?.get(selKey(row))?.hits || [];
      return hits.some((hit) => hit.field === 'code' || hit.field === 'name');
    }) || first;
    const titleHits = state.marks?.get(selKey(titleHitRow))?.hits || [];
    const article = document.createElement('article');
    article.className = 'mobile-course-group';
    article.innerHTML = `
      <header class="mobile-course-head">
        <button type="button" class="mobile-course-open" aria-haspopup="dialog">
          <span class="mobile-course-code">${markField(group.code, 'code', titleHits.filter((h) => h.field === 'code'))}</span>
          <span class="mobile-course-name">${markField(group.name, 'name', titleHits.filter((h) => h.field === 'name'))}</span>
        </button>
        <span class="mobile-course-count">${group.rows.length} ${I18N.lang === 'en' ? 'sections' : 'şube'}</span>
      </header>
      <ul class="mobile-section-list"></ul>`;

    const list = article.querySelector('.mobile-section-list');
    // İlk görünümde yalnızca ekranda görünen dört şubeyi kur. Önceki sürüm
    // yüzlerce gizli düğmeyi yine de DOM'a ekliyordu; kalanlar ancak kullanıcı
    // açıkça istediğinde erişilebilir kontrolleriyle birlikte oluşturulur.
    group.rows.slice(0, MOBILE_SECTION_PREVIEW).forEach((row) => {
      list.appendChild(createMobileSection(row));
    });

    article.querySelector('.mobile-course-open').addEventListener('click', () => openDetail(first));
    if (group.rows.length > MOBILE_SECTION_PREVIEW) {
      const toggle = document.createElement('button');
      const hiddenCount = group.rows.length - MOBILE_SECTION_PREVIEW;
      toggle.type = 'button';
      toggle.className = 'mobile-sections-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = I18N.lang === 'en' ? `show ${hiddenCount} more sections` : `${hiddenCount} şube daha göster`;
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (!expanded && !list.querySelector('.mobile-section-extra')) {
          const extras = document.createDocumentFragment();
          group.rows.slice(MOBILE_SECTION_PREVIEW).forEach((row) => {
            extras.appendChild(createMobileSection(row, true));
          });
          list.appendChild(extras);
        }
        for (const row of article.querySelectorAll('.mobile-section-extra')) row.hidden = expanded;
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.textContent = expanded
          ? (I18N.lang === 'en' ? `show ${hiddenCount} more sections` : `${hiddenCount} şube daha göster`)
          : (I18N.lang === 'en' ? 'Collapse sections' : 'Şubeleri daralt');
      });
      article.appendChild(toggle);
    }
    frag.appendChild(article);
  }
  box.appendChild(frag);

  state.shown += slice.length;
  const remaining = groups.length - state.shown;
  $('#more').hidden = remaining <= 0;
  $('#more').textContent = I18N.lang === 'en'
    ? `show more courses (${remaining} remaining)`
    : `daha fazla ders göster (${remaining} kaldı)`;
}

function wireFavoriteButton(star) {
  if (!star) return;
  star.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const [branch, crn] = star.dataset.key.split('|');
    const on = fav.toggleFavorite(state.termSlug, branch, crn);
    star.classList.toggle('on', on);
    star.textContent = on ? '★' : '☆';
    star.setAttribute('aria-pressed', String(on));
    star.setAttribute('aria-label', on
      ? (I18N.lang === 'en' ? 'Remove from favorites' : 'Favorilerden çıkar')
      : (I18N.lang === 'en' ? 'Add to favorites' : 'Favorilere ekle'));
    star.classList.remove('pop');
    void star.offsetWidth;
    star.classList.add('pop');
    toast(on ? `Favoriye eklendi (${crn})` : `Favoriden çıkarıldı (${crn})`, { kind: on ? 'ok' : 'warn' });
  });
}

/* ---------- detay paneli (modal) ---------- */

// Detay paneli artık ortak bileşende (core/course-detail.js); bu fonksiyon
// satır bilgisini aktarır. program.js ve tablo aynı imzayla çağırır.
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
  const qs = p.toString();
  const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
  history.replaceState(null, '', url);
}

/* ---------- zaman çizelgesi ---------- */

let ttOn = false;

// Çizelge ile tablo arasında geçiş. Filtreler/arama uygulanınca çizelge
// yeniden çizilir; "yalnızca seçilenler" açıksa seçim kümesi kullanılır.
function toggleTimetable() {
  ttOn = !ttOn;
  const wrap = $('#tt');
  document.querySelector('#results').closest('.tablewrap').hidden = ttOn;
  $('#more').hidden = ttOn;
  $('#tt-toggle').classList.toggle('active', ttOn);
  $('#tt-toggle').setAttribute('aria-pressed', String(ttOn));
  wrap.hidden = !ttOn;
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

function toMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmtMin(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

const TT_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// Oturumları gün × 30dk slot ızgarasına yerleştirir; çakışma (aynı hücrede
// birden çok farklı ders) buradan görünür. Saf fonksiyon — test edilebilir.
export function buildTimetable(rows) {
  const all = [];
  for (const r of rows) {
    for (const s of parseWhen(r[5])) all.push({ ...s, row: r });
  }
  if (!all.length) return null;
  const startSlot = Math.floor(Math.min(...all.map((s) => s.start)) / 30) * 30;
  const endSlot = Math.ceil(Math.max(...all.map((s) => s.end)) / 30) * 30;
  const nSlots = (endSlot - startSlot) / 30;

  const grid = TT_DAYS.map(() => Array.from({ length: nSlots }, () => []));
  for (const s of all) {
    const di = TT_DAYS.indexOf(s.day);
    if (di < 0) continue;
    for (let t = s.start; t < s.end; t += 30) {
      const si = (t - startSlot) / 30;
      if (si >= 0 && si < nSlots) grid[di][si].push(s);
    }
  }
  return { startSlot, nSlots, grid, all };
}

function renderTimetable() {
  const wrap = $('#tt');
  const rows = timetableRows();
  const t = buildTimetable(rows);
  if (!t) {
    wrap.innerHTML = '<p class="empty">seçili şubelerde zaman bilgisi yok · çizelge oluşturulamadı</p>';
    return;
  }
  const { startSlot, nSlots, grid, all } = t;

  let conflictCells = 0;
  let html = `<p class="tt-note"><b>${all.length}</b> oturum · <b>${rows.length}</b> şube</p>`;
  html += `<div class="tt-scroll"><table class="tt">
    <thead><tr><th class="tt-time">saat</th>${TT_DAYS.map((d) => `<th>${d.slice(0, 3)}</th>`).join('')}</tr></thead><tbody>`;

  for (let si = 0; si < nSlots; si++) {
    html += `<tr><th class="tt-time">${fmtMin(startSlot + si * 30)}</th>`;
    for (let di = 0; di < 7; di++) {
      const cell = grid[di][si];
      const codes = [...new Set(cell.map((c) => c.row[1]))];
      const conflict = codes.length > 1;
      if (conflict) conflictCells++;
      html += `<td class="tt-cell${conflict ? ' tt-conflict' : ''}"${conflict ? ` title="Çakışma: ${esc(codes.join(', '))}"` : ''}>`;
      html += cell.map((c) =>
        `<button type="button" class="tt-chip" data-code="${esc(c.row[1])}" title="${esc(c.row[2])}">${esc(c.row[1])}</button>`).join('');
      html += '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';

  if (conflictCells) {
    html += `<p class="tt-conflict-note">⚠ <b>${conflictCells}</b> zaman hücresinde birden çok ders çakışıyor. Çipe tıklayınca ders detayı açılır.</p>`;
  }
  wrap.innerHTML = html;

  // Çipe tıklayınca ders detay paneli açılır (Faz 2.2: her yerden aynı panel).
  wrap.querySelectorAll('.tt-chip').forEach((ch) => {
    ch.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: ch.dataset.code, source: 'tt' } }));
    });
  });
}
