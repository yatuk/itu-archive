/* İTÜ Ders Arşivi — istemci tarafı.
   Tüm veri docs/data altındaki statik JSON'lardan geliyor; sunucu tarafı yok.
   Yükleme stratejisi: açılışta yalnızca index.json, dönem seçilince o dönemin
   arama indeksi, satır açılınca da ilgili branşın tam kaydı. */

const $ = (sel) => document.querySelector(sel);
const PAGE = 200;

const state = {
  index: null,
  termSlug: null,
  rows: [],        // aktif dönemin arama indeksi
  meta: null,      // aktif dönemin meta.json'ı
  filtered: [],
  shown: 0,
  branchCache: new Map(),
  calendar: null,
};

const cache = new Map();
async function getJSON(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(path).then((r) => {
      if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
      return r.json();
    }));
  }
  return cache.get(path);
}

/* ---------- açılış ---------- */

async function boot() {
  wireTabs();
  try {
    state.index = await getJSON('data/index.json');
  } catch (e) {
    $('#stat-status').textContent = 'veri yüklenemedi';
    $('#rows').innerHTML = `<tr><td colspan="8" class="empty">Veri dosyaları okunamadı (${e.message}).</td></tr>`;
    return;
  }

  const ix = state.index;
  $('#stat-status').textContent = 'çevrimiçi';
  $('#stat-status').className = 'ok';
  $('#stat-term').textContent = ix.currentTerm || '—';
  $('#stat-scraped').textContent = fmtDate(ix.scrapedAt);
  $('#stat-terms').textContent = `${ix.terms.filter((t) => !t.missing).length} dönem · ${ix.calendars.length} takvim yılı`;
  $('#foot-build').textContent = `son tarama ${fmtDate(ix.scrapedAt)}`;

  const termSel = $('#f-term');
  termSel.innerHTML = ix.terms
    .filter((t) => !t.missing)
    .map((t) => `<option value="${t.slug}">${t.label}${t.source === 'obs' ? ' · canlı' : ''}</option>`)
    .join('');
  termSel.value = ix.currentSlug;

  const yearSel = $('#f-year');
  yearSel.innerHTML = ix.calendars.map((c) => `<option value="${c.yearId}">${c.label}</option>`).join('');

  renderTerms();
  fillHost();

  termSel.addEventListener('change', () => loadTerm(termSel.value));
  yearSel.addEventListener('change', () => loadCalendar(yearSel.value));
  $('#q').addEventListener('input', debounce(applyFilters, 120));
  $('#f-branch').addEventListener('change', applyFilters);
  $('#f-day').addEventListener('change', applyFilters);
  $('#f-open').addEventListener('change', applyFilters);
  $('#f-upcoming').addEventListener('change', renderCalendar);
  $('#more').addEventListener('click', () => renderRows(true));

  await loadTerm(ix.currentSlug);
}

/* ---------- dersler ---------- */

async function loadTerm(slug) {
  state.termSlug = slug;
  $('#resultline').textContent = 'dönem yükleniyor…';
  const [rows, meta] = await Promise.all([
    getJSON(`data/terms/${slug}/search.json`),
    getJSON(`data/terms/${slug}/meta.json`),
  ]);
  state.rows = rows;
  state.meta = meta;
  // Aramayı bir kez katlanmış metin üzerinden yapıyoruz: her tuş vuruşunda
  // 4000 satırı yeniden normalize etmenin anlamı yok.
  state.hay = rows.map((r) => fold(`${r[0]} ${r[1]} ${r[2]} ${r[4]}`));

  const branchSel = $('#f-branch');
  const keep = branchSel.value;
  branchSel.innerHTML = '<option value="">hepsi</option>' +
    meta.branches.map((b) => `<option value="${b.code}">${b.code} (${b.sections})</option>`).join('');
  branchSel.value = meta.branches.some((b) => b.code === keep) ? keep : '';

  applyFilters();
}

function applyFilters() {
  const q = fold($('#q').value.trim());
  const branch = $('#f-branch').value;
  const day = $('#f-day').value;
  const openOnly = $('#f-open').checked;
  const terms = q ? q.split(/\s+/) : [];

  state.filtered = state.rows.filter((r, i) => {
    // r = [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan]
    if (branch && r[3] !== branch) return false;
    if (day && !r[5].includes(day)) return false;
    if (openOnly && r[7] >= r[6]) return false;
    if (!terms.length) return true;
    return terms.every((t) => state.hay[i].includes(t));
  });

  state.shown = 0;
  $('#rows').innerHTML = '';
  renderRows(false);

  const total = state.rows.length;
  const n = state.filtered.length;
  $('#resultline').innerHTML = n === total
    ? `<b>${n}</b> şube · ${state.meta.courses} ders · ${state.meta.branches.length} branş`
    : `<b>${n}</b> / ${total} şube eşleşti`;
}

function renderRows(append) {
  const tbody = $('#rows');
  if (!append) tbody.innerHTML = '';
  const slice = state.filtered.slice(state.shown, state.shown + PAGE);

  if (!slice.length && !state.shown) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">eşleşen ders yok</td></tr>';
    $('#more').hidden = true;
    return;
  }

  const frag = document.createDocumentFragment();
  for (const r of slice) {
    const [crn, code, name, branch, instructor, when, cap, enr] = r;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="crn">${esc(crn)}</td>
      <td class="code"><b>${esc(code)}</b><small>${esc(branch)}</small></td>
      <td><button class="row-toggle" type="button" aria-expanded="false">${esc(name)}</button></td>
      <td>${esc(instructor || '—')}</td>
      <td class="when">${esc(when || '—')}</td>
      <td class="num">${cap}</td>
      <td class="num">${enr}</td>
      <td class="num">${fillBar(cap, enr)}</td>`;
    tr.querySelector('.row-toggle').addEventListener('click', (ev) => toggleDetail(tr, r, ev.currentTarget));
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);

  state.shown += slice.length;
  $('#more').hidden = state.shown >= state.filtered.length;
  $('#more').textContent = `daha fazla göster (${state.filtered.length - state.shown} kaldı)`;
}

function fillBar(cap, enr) {
  if (!cap) return '—';
  const pct = Math.min(100, Math.round((enr / cap) * 100));
  const cls = pct >= 100 ? 'full' : pct >= 85 ? 'tight' : '';
  return `<span class="fill">%${pct}<span class="bar ${cls}"><i style="width:${pct}%"></i></span></span>`;
}

async function toggleDetail(tr, row, btn) {
  const next = tr.nextElementSibling;
  if (next && next.classList.contains('detail')) {
    next.remove();
    tr.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    return;
  }
  tr.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');

  const det = document.createElement('tr');
  det.className = 'detail';
  det.innerHTML = '<td colspan="8">yükleniyor…</td>';
  tr.after(det);

  const [crn, , , branch] = row;
  let sec = null;
  try {
    const list = await getJSON(`data/terms/${state.termSlug}/branches/${branch}.json`);
    sec = list.find((s) => s.crn === crn);
  } catch { /* ağ hatası: aşağıda "detay yok" gösterilir */ }

  if (!sec) {
    det.innerHTML = '<td colspan="8">detay bulunamadı</td>';
    return;
  }

  const sessions = sec.days.map((d, i) => [d, sec.times[i] || '', sec.rooms[i] || '', sec.buildings[i] || '']
    .filter(Boolean).join(' · ')).join('\n');

  det.innerHTML = `<td colspan="8"><dl>
    ${field('Öğretim yöntemi', sec.method)}
    ${field('Seviye', sec.level)}
    ${sessions ? field('Oturumlar', sessions) : ''}
    ${sec.prereq && sec.prereq !== '-' ? field('Önşart', sec.prereq) : ''}
    ${sec.classReq && sec.classReq !== '-' ? field('Sınıf / kredi önşartı', sec.classReq) : ''}
    ${sec.reserved && sec.reserved !== '-' ? field('Rezervasyon', sec.reserved) : ''}
    ${sec.programs.length ? `<dt>Alabilen programlar</dt><dd class="tags">${sec.programs.map((p) => `<span>${esc(p)}</span>`).join('')}</dd>` : ''}
  </dl></td>`;
}

const field = (k, v) => (v ? `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>` : '');

/* ---------- akademik takvim ---------- */

async function loadCalendar(yearId) {
  $('#calendar').innerHTML = '<p class="empty">yükleniyor…</p>';
  state.calendar = await getJSON(`data/calendar/${yearId}.json`);
  renderCalendar();
}

function renderCalendar() {
  const cal = state.calendar;
  if (!cal) return;
  const upcomingOnly = $('#f-upcoming').checked;

  const groups = new Map();
  for (const ev of cal.events) {
    const past = /geçti/.test(ev.remaining);
    if (upcomingOnly && past) continue;
    if (!groups.has(ev.table)) groups.set(ev.table, []);
    groups.get(ev.table).push({ ...ev, past, now: /devam ediyor/i.test(ev.remaining) });
  }

  if (!groups.size) {
    $('#calendar').innerHTML = '<p class="empty">bu yılda gelecek etkinlik kalmadı</p>';
    return;
  }

  let html = '';
  for (const [title, evs] of groups) {
    html += `<section class="calgroup"><h3>${esc(title)}</h3><ol>` +
      evs.map((e) => `<li class="${e.now ? 'now' : e.past ? 'past' : ''}">
        <span>${esc(e.title)}</span>
        <span class="date">${esc(e.date)}</span>
        <span class="left">${esc(e.remaining)}</span></li>`).join('') +
      '</ol></section>';
  }
  $('#calendar').innerHTML = html;
}

/* ---------- dönemler ---------- */

function renderTerms() {
  $('#terms').innerHTML = state.index.terms.map((t) => {
    if (t.missing) {
      return `<article class="termcard missing">
        <div><h3>${esc(t.label)}<span class="badge">veri yok</span></h3>
        <p class="meta">Bu dönem ne OBS'de ne de arşiv snapshot'larında bulunuyor.</p></div>
        <div class="links"></div></article>`;
    }
    const live = t.source === 'obs';
    const src = live ? 'obs.itu.edu.tr (canlı)' : 'tarihsel döküm';
    return `<article class="termcard">
      <div>
        <h3>${esc(t.label)}${live ? '<span class="badge live">canlı</span>' : ''}</h3>
        <p class="meta">${t.sections.toLocaleString('tr')} şube · kaynak ${esc(src)} · ${fmtDate(t.scrapedAt)}</p>
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${t.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${t.slug}/meta.json">meta.json</a>
      </div></article>`;
  }).join('');
}

/* ---------- sekmeler & yardımcılar ---------- */

function wireTabs() {
  const buttons = [...document.querySelectorAll('.tabs button')];
  const show = (view) => {
    for (const b of buttons) b.setAttribute('aria-selected', String(b.dataset.view === view));
    for (const s of document.querySelectorAll('.view')) s.hidden = s.id !== `view-${view}`;
    if (view === 'takvim' && !state.calendar && state.index) loadCalendar($('#f-year').value);
    if (location.hash.slice(1) !== view) history.replaceState(null, '', `#${view}`);
  };
  for (const b of buttons) b.addEventListener('click', () => show(b.dataset.view));
  const initial = location.hash.slice(1);
  show(['dersler', 'takvim', 'donemler', 'hakkinda'].includes(initial) ? initial : 'dersler');
}

// Hakkında sekmesindeki curl örneklerine sitenin gerçek adresini yazar.
function fillHost() {
  const host = location.host + location.pathname.replace(/\/$/, '');
  for (const el of document.querySelectorAll('.prose .host')) el.textContent = host;
  for (const el of document.querySelectorAll('.prose .var')) el.textContent = state.index.currentSlug;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
}

/* Türkçe karakterleri ASCII'ye katlar. Gerekli, çünkü tr yerelinde
   "BIL".toLocaleLowerCase('tr') === "bıl" — kullanıcının yazdığı "bil" ile
   eşleşmiyor. Yan fayda: "muhendislik" araması "Mühendislik"i de buluyor. */
const FOLD = {
  'İ': 'i', 'I': 'i', 'ı': 'i', 'Ş': 's', 'ş': 's', 'Ğ': 'g', 'ğ': 'g',
  'Ü': 'u', 'ü': 'u', 'Ö': 'o', 'ö': 'o', 'Ç': 'c', 'ç': 'c',
  'Â': 'a', 'â': 'a', 'Î': 'i', 'î': 'i', 'Û': 'u', 'û': 'u',
};
function fold(s) {
  return String(s).replace(/[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g, (c) => FOLD[c]).toLowerCase();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

boot();
