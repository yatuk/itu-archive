// Ortak ders detay modalı. Dersler, önşart haritası, seçmeli havuz ve geçmiş
// sekmelerinin tümü aynı paneli açar — tek giriş openCourseDetail(code, opts).
//
// Panel iki bölümden oluşur: (1) seçili dönemdeki tüm şubeler (şube başına
// hoca, oturum, haftalık saat, doluluk, önşart), (2) geçmiş dönemler (doluluk
// trendi + dönem tablosu). Ders o dönem açık değilse neden açıklanır, geçmiş
// yine gösterilir — sessiz boşluk olmaz.

import { $, getJSON, esc, termLabel, sessionHours, fillMeasured } from './utils.js';
import { state } from './store.js';
import { fillBar, trendChart } from './chart.js';

let lastDetailFocus = null;
let lastDetailHash = null; // detay açılmadan önceki görünüm hash'i (kapatınca dön)

// Dolma süresini insanca yazar: "kayıt başladıktan 3 sa 20 dk sonra doldu".
// Kontenjan zaman serisi yalnızca aktif dönem için yüklenir (state.quota).
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

// "A, B" / "A; B" / "A | B" → ["A", "B"]. Boşluk-önemsiz. Tek isimde tek eleman.
// Saf — test edilebilir.
export function splitInstructors(instr) {
  return String(instr ?? '').split(/[;,|]/).map((s) => s.trim()).filter(Boolean);
}

// Doluluk ölçüm zamanı (Faz 0.4): "%100" anlık sanılmasın — kontenjan zaman
// serisi günde bir tazeleniyor. Yalnızca bu dönem için ölçüm kaydı varsa döner.
function measured(crn) {
  if (!state.quotaLast) return '';
  const rec = state.quota?.get(crn);
  if (!rec) return '';
  return fillMeasured(state.quotaLast);
}

// Oturum satırı: "Pazartesi 08:30/11:29 · AYB"
function sessionsHtml(sec) {
  return sec.days.map((d, i) => [d, sec.times[i] || '', sec.rooms[i] || '', sec.buildings[i] || '']
    .filter(Boolean).join(' · ')).join('<br>');
}

// Tek şube kartı. Öğretim üyesi, dolma süresi, oturumlar, önşart, sınıf/kredi
// ve rezervasyon alanlarının tümü burada korunur (eski panelin alanları).
function secCard(s) {
  const pct = s.capacity ? `%${Math.round((s.enrolled / s.capacity) * 100)}` : '';
  const hrs = sessionHours(s.times);
  const note = fillNote(s.crn);
  // Çoklu hocada ("A, B" / "A; B" / "A | B") her isim için ayrı buton üret —
  // tek `data-name` ile "A, B" aranınca hiç sonuç çıkmıyordu (Faz 0.3).
  const names = splitInstructors(s.instructor);
  const histBtns = names
    .filter((n) => n !== '-' && n !== '***')
    .map((n) => `<button type="button" class="btn-ghost d-hist" data-name="${esc(n)}">${esc(n)} geçmişinde ara</button>`)
    .join('');
  const sessions = sessionsHtml(s);
  return `
    <div class="d-sec">
      <div class="d-sec-head">
        <b class="d-crn">${esc(s.crn)}</b>
        <span class="d-sec-instr">${esc(s.instructor || '—')}</span>
        ${histBtns}
      </div>
      <div class="d-sec-meta">${[s.method, hrs ? `haftada ${hrs} sa (oturum)` : ''].filter(Boolean).join(' · ')}</div>
      ${sessions ? `<div class="d-sec-when">${sessions}</div>` : ''}
      <div class="d-sec-stats">${fillBar(s.capacity, s.enrolled)} ${s.capacity ? `${s.enrolled} / ${s.capacity} (${pct})` : '—'}${note ? ` · ${esc(note)}` : ''}${measured(s.crn) ? `<small class="fill-measured"> · ${esc(measured(s.crn))}</small>` : ''}</div>
      ${s.prereq && s.prereq !== '-' ? `<div class="d-sec-req"><span>önşart:</span> ${esc(s.prereq)}</div>` : ''}
      ${s.classReq && s.classReq !== '-' ? `<div class="d-sec-req"><span>sınıf / kredi:</span> ${esc(s.classReq)}</div>` : ''}
      ${s.reserved && s.reserved !== '-' ? `<div class="d-sec-req"><span>rezervasyon:</span> ${esc(s.reserved)}</div>` : ''}
    </div>`;
}

// Geçmiş dönem bölümü: dönem doluluk trendi (trendChart) + dönem tablosu.
// Veri yoksa neden açıklanır.
function histHtml(hist) {
  const byTerm = new Map();
  for (const [slug, instructor, cap, enr] of hist?.rows || []) {
    if (!byTerm.has(slug)) byTerm.set(slug, []);
    byTerm.get(slug).push({ instructor, cap, enr });
  }
  if (!byTerm.size) {
    return `<section class="d-hist"><h4>Geçmiş dönemler</h4>
      <p class="empty">2019 öncesi dönemlerde dönem bazlı kayıt veri tabanında yok.</p></section>`;
  }
  const seasons = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' };
  const openIn = [...new Set([...byTerm.keys()].map((s) => s.split('-')[2]))].map((s) => seasons[s] || s);
  const rows = [];
  for (const [slug, secs] of byTerm) secs.forEach((r, i) => rows.push({ slug, termFirst: i === 0, ...r }));
  return `<section class="d-hist">
    <h4>Geçmiş dönemler · ${byTerm.size} dönemde açıldı (${esc(openIn.join(', '))})</h4>
    ${trendChart(byTerm)}
    <div class="tablewrap"><table class="htable" aria-label="Dönem geçmişi">
      <thead><tr><th>Dönem</th><th>Öğretim üyesi</th><th class="num">Kont.</th><th class="num">Yazılan</th><th class="num">Doluluk</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${r.termFirst ? esc(termLabel(r.slug)) : ''}</td>
        <td>${esc(r.instructor || '—')}</td><td class="num">${r.cap}</td><td class="num">${r.enr}</td>
        <td class="num">${fillBar(r.cap, r.enr)}</td></tr>`).join('')}</tbody>
    </table></div>
  </section>`;
}

// code: "BLG 101E"; term varsayılanı Dersler'deki aktif dönem (state.termSlug).
// crn yalnızca odak bilgisidir — panel koddaki tüm şubeleri gösterir.
export async function openCourseDetail(code, { term, crn, source } = {}) {
  const t = term || state.termSlug;
  lastDetailFocus = document.activeElement;
  const panel = $('#detail-panel');
  const content = $('#detail-content');
  panel.hidden = false;
  document.body.classList.add('modal-open');
  content.innerHTML = '<p class="empty">yükleniyor…</p>';
  $('#detail-close').focus();
  // Paylaşılabilir detay bağlantısı: #ders/<kod>. Kapatınca dönülecek görünümü
  // hatırla (örn. önşart sekmesinden açıldıysa oraya dön). Bağlantıdan
  // doğrudan açılıyorsa kapatınca dersler görünümüne dön.
  lastDetailHash = location.hash.startsWith('#ders/') ? null : (location.hash || '#dersler');
  history.replaceState(null, '', '#ders/' + encodeURIComponent(code));

  const branch = String(code).split(' ')[0];
  const [list, hist, cat] = await Promise.all([
    getJSON(`data/terms/${t}/branches/${branch}.json`).catch(() => []),
    getJSON(`data/history/courses/${branch}.json`).then((all) => all[code] || null).catch(() => null),
    getJSON(`data/catalog/${branch}.json`).then((all) => all[code] || null).catch(() => null),
  ]);
  const secs = Array.isArray(list) ? list.filter((s) => s.code === code) : [];

  if (!secs.length) {
    content.innerHTML = `
      <h3 id="detail-title">${esc(code)}</h3>
      <p class="empty">Bu ders <b>${esc(termLabel(t))}</b> döneminde açık değil.</p>
      ${histHtml(hist)}
      ${catalogHtml(cat)}`;
    wireHistButtons(content);
    return;
  }

  const programs = [...new Set(secs.flatMap((s) => s.programs || []))];
  content.innerHTML = `
    <h3 id="detail-title">${esc(code)} <span>${esc(secs[0].name)}</span></h3>
    <div class="d-meta">${[branch, secs[0].level, secs[0].method].filter(Boolean).map((x) => `<span class="d-pill">${esc(x)}</span>`).join('')}</div>
    <section class="d-secs">
      <h4>Bu dönem · ${secs.length} şube</h4>
      ${secs.map(secCard).join('')}
    </section>
    <section class="d-progs">
      <h4>Bu dersi alabilen programlar${programs.length ? ` (${programs.length})` : ''}</h4>
      <div class="d-prog-list">${programs.length
        ? programs.map((p) => `<span class="d-prog">${esc(p)}</span>`).join('')
        : '<span class="d-prog d-prog-none">kısıtlama yok — tüm programlar alabilir</span>'}</div>
    </section>
    ${catalogHtml(cat)}
    ${histHtml(hist)}`;
  wireHistButtons(content);
}

// Katalog bölümü (Faz 3). Veri yoksa hiç render edilmez — panel eski haliyle
// çalışır. Kredi satırı, şube kartındaki "oturum süresi"nden ayrı etiketlidir:
// bu, resmî T+U+L paketidir.
function catalogHtml(cat) {
  if (!cat) return '';
  const c = cat.credits || {};
  const parts = [];
  if (c.theory || c.practice || c.lab) parts.push(`${c.theory || 0}+${c.practice || 0}+${c.lab || 0} (T+U+L)`);
  if (c.local) parts.push(`yerel ${c.local}`);
  if (c.ects) parts.push(`AKTS ${c.ects}`);
  const details = (title, open, body) => `<details class="d-cat-details"${open ? ' open' : ''}><summary>${title}</summary>${body}</details>`;
  const list = (items, tag) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  return `<section class="d-cat">
    <h4>Katalog</h4>
    ${parts.length ? `<p class="d-cat-credits">${esc(parts.join(' · '))}${cat.language ? ` · dil: ${esc(cat.language)}` : ''}</p>` : ''}
    ${cat.description ? details('Ders içeriği', false, `<p>${esc(cat.description)}</p>`) : ''}
    ${(cat.outcomes || []).length ? details(`Öğrenme çıktıları (${cat.outcomes.length})`, true, `<ul>${list(cat.outcomes)}</ul>`) : ''}
    ${(cat.weeklyTopics || []).length ? details(`Haftalık konular (${cat.weeklyTopics.length})`, false, `<ol>${list(cat.weeklyTopics)}</ol>`) : ''}
    ${(cat.textbooks || []).length ? details('Kaynak kitaplar', false, `<ul>${list(cat.textbooks)}</ul>`) : ''}
    ${cat.sourceUrl ? `<p class="d-cat-src">kaynak: <a href="${esc(cat.sourceUrl)}" target="_blank" rel="noopener">OBS katalog formu</a></p>` : ''}
  </section>`;
}

function wireHistButtons(content) {
  content.querySelectorAll('.d-hist').forEach((b) => b.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('itu:goto-history', { detail: b.dataset.name }));
    closeCourseDetail();
  }));
}

export function closeCourseDetail() {
  $('#detail-panel').hidden = true;
  document.body.classList.remove('modal-open');
  // Detay bağlantısından gelindiyse kapatınca açıldığı görünüme dön.
  if (location.hash.startsWith('#ders/')) history.replaceState(null, '', lastDetailHash || '#dersler');
  if (lastDetailFocus && typeof lastDetailFocus.focus === 'function') lastDetailFocus.focus();
}

// Modal kapama + dış kaynaklardan (havuz, önşart) gelen istekleri bağlar.
// app.js boot'ta bir kez çağırır.
export function initCourseDetail() {
  $('#detail-close').addEventListener('click', closeCourseDetail);
  $('#detail-panel').addEventListener('click', (e) => { if (e.target.id === 'detail-panel') closeCourseDetail(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#detail-panel').hidden) closeCourseDetail(); });
  window.addEventListener('itu:course-detail', (e) => {
    const d = e.detail || {};
    if (d.code) openCourseDetail(d.code, { term: d.term, source: d.source });
  });
}
