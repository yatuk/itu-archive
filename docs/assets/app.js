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
  exams: null,
  hist: null,      // {codes, names} arama listeleri
  quota: null,     // aktif dönemin dolma özeti, CRN -> kayıt
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
  $('#hq').addEventListener('input', debounce(searchHistory, 140));
  $('#eq').addEventListener('input', debounce(renderExams, 120));
  $('#f-etype').addEventListener('change', renderExams);

  await loadTerm(ix.currentSlug);
  loadQuota(ix.currentSlug); // arka planda, dolma sürelerini detay satırında göstermek için
}

/* ---------- kontenjan zaman serisi ---------- */

async function loadQuota(slug) {
  try {
    const sum = await getJSON(`data/quota/${slug}.json`);
    state.quota = new Map(sum.courses.map((c) => [c.crn, c]));
  } catch {
    state.quota = null; // bu dönem için henüz ölçüm yok
  }
}

// Dolma süresini insanca yazar: "kayıt başladıktan 3 sa 20 dk sonra doldu".
function fillNote(crn) {
  const q = state.quota?.get(crn);
  if (!q || !q.filledAt) return '';
  const m = q.fillMinutes;
  if (!m) return 'ilk ölçümde zaten doluydu';
  const h = Math.floor(m / 60);
  const rest = m % 60;
  const span = h ? `${h} sa${rest ? ` ${rest} dk` : ''}` : `${rest} dk`;
  return `ilk ölçümden ${span} sonra doldu`;
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
    ${field('Kontenjan', fillNote(crn))}
    ${sessions ? field('Oturumlar', sessions) : ''}
    ${sec.prereq && sec.prereq !== '-' ? field('Önşart', sec.prereq) : ''}
    ${sec.classReq && sec.classReq !== '-' ? field('Sınıf / kredi önşartı', sec.classReq) : ''}
    ${sec.reserved && sec.reserved !== '-' ? field('Rezervasyon', sec.reserved) : ''}
    ${sec.programs.length ? `<dt>Alabilen programlar</dt><dd class="tags">${sec.programs.map((p) => `<span>${esc(p)}</span>`).join('')}</dd>` : ''}
  </dl></td>`;
}

const field = (k, v) => (v ? `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>` : '');

/* ---------- geçmiş ---------- */

async function loadHistory() {
  if (state.hist) return;
  const [codes, names] = await Promise.all([
    getJSON('data/history/codes.json'),
    getJSON('data/history/names.json'),
  ]);
  // Arama metinlerini bir kez katlayıp saklıyoruz.
  state.hist = {
    codes, names,
    codeHay: codes.map((c) => fold(`${c[0]} ${c[1]}`)),
    nameHay: names.map((n) => fold(n[0])),
  };
}

async function searchHistory() {
  await loadHistory();
  const q = fold($('#hq').value.trim());
  const box = $('#hmatches');
  $('#hdetail').innerHTML = '';

  if (q.length < 2) {
    box.innerHTML = '';
    $('#hresultline').innerHTML =
      `<b>${state.hist.codes.length.toLocaleString('tr')}</b> ders · ` +
      `<b>${state.hist.names.length.toLocaleString('tr')}</b> öğretim üyesi indekslendi`;
    return;
  }

  const courses = [];
  state.hist.codeHay.forEach((h, i) => { if (courses.length < 40 && h.includes(q)) courses.push(state.hist.codes[i]); });
  const people = [];
  state.hist.nameHay.forEach((h, i) => { if (people.length < 40 && h.includes(q)) people.push(state.hist.names[i]); });

  $('#hresultline').innerHTML = `<b>${courses.length}</b> ders, <b>${people.length}</b> öğretim üyesi eşleşti`;

  let html = '';
  if (courses.length) {
    html += '<h3 class="mh">Dersler</h3><div class="chips">' + courses.map((c) =>
      `<button class="chip" data-kind="course" data-key="${esc(c[0])}" data-branch="${esc(c[2])}">
         <b>${esc(c[0])}</b><span>${esc(c[1])}</span><em>${c[3]} dönem</em></button>`).join('') + '</div>';
  }
  if (people.length) {
    html += '<h3 class="mh">Öğretim üyeleri</h3><div class="chips">' + people.map((n) =>
      `<button class="chip" data-kind="person" data-key="${esc(n[0])}" data-bucket="${esc(n[1])}">
         <b>${esc(n[0])}</b><em>${n[2]} dönem · ${n[3]} şube</em></button>`).join('') + '</div>';
  }
  box.innerHTML = html || '<p class="empty">eşleşme yok</p>';

  for (const b of box.querySelectorAll('.chip')) {
    b.addEventListener('click', () => b.dataset.kind === 'course'
      ? showCourse(b.dataset.key, b.dataset.branch)
      : showPerson(b.dataset.key, b.dataset.bucket));
  }
}

async function showCourse(code, branch) {
  const all = await getJSON(`data/history/courses/${branch}.json`);
  const c = all[code];
  if (!c) return;

  // Dönem başına grupla: aynı dönemde birden çok şube olabiliyor.
  const byTerm = new Map();
  for (const [slug, instructor, cap, enr, days] of c.rows) {
    if (!byTerm.has(slug)) byTerm.set(slug, []);
    byTerm.get(slug).push({ instructor, cap, enr, days });
  }

  const seasons = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' };
  const openIn = new Set([...byTerm.keys()].map((s) => s.split('-')[2]));
  const rhythm = [...openIn].map((s) => seasons[s] || s).join(', ');

  $('#hdetail').innerHTML = `
    <article class="hcard">
      <h3>${esc(c.code)} <span>${esc(c.name)}</span></h3>
      <p class="meta">${byTerm.size} dönemde açıldı · açıldığı dönemler: ${esc(rhythm)}</p>
      <div class="tablewrap"><table class="htable">
        <thead><tr><th>Dönem</th><th>Öğretim üyesi</th><th>Gün</th><th class="num">Kont.</th><th class="num">Yazılan</th><th class="num">Doluluk</th></tr></thead>
        <tbody>${[...byTerm].map(([slug, rows]) => rows.map((r, i) => `
          <tr><td>${i === 0 ? esc(termLabel(slug)) : ''}</td>
              <td>${esc(r.instructor || '—')}</td>
              <td class="when">${esc(r.days || '—')}</td>
              <td class="num">${r.cap}</td><td class="num">${r.enr}</td>
              <td class="num">${fillBar(r.cap, r.enr)}</td></tr>`).join('')).join('')}
        </tbody>
      </table></div>
    </article>`;
  $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function showPerson(name, bucket) {
  const all = await getJSON(`data/history/instructors/${bucket}.json`);
  const p = all[name];
  if (!p) return;

  const byCourse = new Map();
  for (const [slug, code, cname] of p.rows) {
    if (!byCourse.has(code)) byCourse.set(code, { name: cname, terms: [] });
    byCourse.get(code).terms.push(slug);
  }
  const sorted = [...byCourse].sort((a, b) => b[1].terms.length - a[1].terms.length);

  $('#hdetail').innerHTML = `
    <article class="hcard">
      <h3>${esc(name)}</h3>
      <p class="meta">${byCourse.size} farklı ders · ${p.rows.length} şube · ${p.terms} dönem</p>
      <div class="tablewrap"><table class="htable">
        <thead><tr><th>Ders</th><th>Adı</th><th class="num">Kaç dönem</th><th>Dönemler</th></tr></thead>
        <tbody>${sorted.map(([code, v]) => `
          <tr><td><b>${esc(code)}</b></td><td>${esc(v.name)}</td>
              <td class="num">${v.terms.length}</td>
              <td class="when">${esc(v.terms.map(termLabel).join(', '))}</td></tr>`).join('')}
        </tbody>
      </table></div>
    </article>`;
  $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// "2025-2026-guz" -> "2025-26 Güz"
function termLabel(slug) {
  const [y1, y2, season] = slug.split('-');
  const s = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' }[season] || season;
  return `${y1}-${String(y2).slice(2)} ${s}`;
}

/* ---------- sınav takvimi ---------- */

async function loadExams() {
  if (state.exams) return;
  try {
    const sched = await getJSON(`data/exams/${state.index.currentSlug}.json`);
    state.exams = sched;
    state.examHay = sched.exams.map((e) => fold(`${e.crn} ${e.code} ${e.name} ${e.instructor}`));
    const types = [...new Set(sched.exams.map((e) => e.type))].sort();
    $('#f-etype').innerHTML = '<option value="">hepsi</option>' +
      types.map((t) => `<option>${esc(t)}</option>`).join('');
  } catch {
    state.exams = { exams: [] };
    state.examHay = [];
  }
  renderExams();
}

function renderExams() {
  if (!state.exams) return;
  const q = fold($('#eq').value.trim());
  const type = $('#f-etype').value;
  const terms = q ? q.split(/\s+/) : [];

  const hits = state.exams.exams.filter((e, i) => {
    if (type && e.type !== type) return false;
    return terms.every((t) => state.examHay[i].includes(t));
  });

  $('#eresultline').innerHTML = state.exams.exams.length
    ? `<b>${hits.length}</b> / ${state.exams.exams.length} sınav · ${esc(state.exams.term || '')}`
    : 'Bu dönem için sınav takvimi henüz ilan edilmemiş.';

  $('#erows').innerHTML = hits.length
    ? hits.slice(0, 400).map((e) => `
      <tr><td class="crn">${esc(e.crn)}</td>
          <td class="code"><b>${esc(e.code)}</b></td>
          <td>${esc(e.name)}</td>
          <td>${esc(e.instructor || '—')}</td>
          <td>${esc(e.type)}</td>
          <td class="when">${esc(e.place || '—')}</td>
          <td>${esc(e.date)}</td>
          <td class="when">${esc(e.day)} ${esc(e.time)}</td></tr>`).join('')
    : '<tr><td colspan="8" class="empty">eşleşen sınav yok</td></tr>';
}

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
    if (view === 'sinavlar' && state.index) loadExams();
    if (view === 'gecmis' && !state.hist) searchHistory();
    if (view === 'onsart') window.PrereqGraph.init('#pg-root');
    if (location.hash.slice(1) !== view) window.history.replaceState(null, '', `#${view}`);
  };
  for (const b of buttons) b.addEventListener('click', () => show(b.dataset.view));
  const initial = location.hash.slice(1);
  const views = ['dersler', 'gecmis', 'onsart', 'sinavlar', 'takvim', 'donemler', 'hakkinda'];
  show(views.includes(initial) ? initial : 'dersler');
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
