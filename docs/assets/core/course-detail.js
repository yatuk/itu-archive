// Ortak ders detay modalı. Dersler, önşart haritası, seçmeli havuz ve geçmiş
// sekmelerinin tümü aynı paneli açar — tek giriş openCourseDetail(code, opts).
//
// Panel iki bölümden oluşur: (1) seçili dönemdeki tüm şubeler (şube başına
// hoca, oturum, haftalık saat, doluluk, önşart), (2) geçmiş dönemler (doluluk
// trendi + dönem tablosu). Ders o dönem açık değilse neden açıklanır, geçmiş
// yine gösterilir — sessiz boşluk olmaz.

import { $, getJSON, esc, termLabel, sessionHours, fillMeasured, buildingName, trNum } from './utils.js';
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

// Bina kodu → ad haritası (docs/data/buildings.json). Bir kez yüklenir, tüm
// oturum satırlarında kullanılır. Yüklenemezse boş dizi (kodlar aynen gösterilir).
let buildingsCache = null;
async function loadBuildings() {
  if (buildingsCache === null) {
    buildingsCache = await getJSON('data/buildings.json').catch(() => []);
  }
  return buildingsCache;
}
// Oturum satırı: "Pazartesi 08:30/11:29 · BBB (Bilgisayar ve Bilişim Binası)"
function sessionsHtml(sec, buildings) {
  return sec.days.map((d, i) => {
    const b = sec.buildings[i];
    const bld = b ? `${esc(buildingName(b, buildings))}` : '';
    return [d, sec.times[i] || '', sec.rooms[i] || '', bld].filter(Boolean).join(' · ');
  }).join('<br>');
}

// OBS katalog formunun derin bağlantısı. Taban dersNo, kodun sayısal öneki
// (TR/EN çiftleri tek sayfada birleşir: "BLG 102E" → dersNo=102).
export function obsDeepLink(code) {
  const m = String(code ?? '').match(/^([A-ZÇĞİÖŞÜ]{2,5})\s+(\d+)/);
  if (!m) return '';
  return 'https://obs.itu.edu.tr/public/DersKatalog/DersKatalogBilgiBransDersKodu?bransKodu=' +
    encodeURIComponent(m[1]) + '&dersNo=' + encodeURIComponent(m[2]);
}

// Ters-önşart bölümünü doldurur: reverse.json'dan "bu dersi önşart isteyenler".
// Veri yoksa (dosya yok, ders grafikte yok) bölüm sessizce gizlenir.
async function loadReqBy(sec) {
  const code = sec.dataset.code;
  const reverse = await getJSON('data/prereq/reverse.json').catch(() => null);
  if (!reverse || !reverse[code]) { sec.hidden = true; return; }
  const reqs = reverse[code];
  sec.innerHTML = `<h4>Bu dersi önşart isteyenler (${reqs.length})</h4>
    <div class="d-req-list">${reqs.map((r) => `<button type="button" class="d-req" data-code="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
  sec.querySelectorAll('.d-req').forEach((b) => b.addEventListener('click', () => {
    openCourseDetail(b.dataset.code, { source: 'reverse' });
  }));
}

// Doluluk ölçüm zamanı (Faz 0.4): "%100" anlık sanılmasın — kontenjan zaman
// serisi günde bir tazeleniyor. Yalnızca bu dönem için ölçüm kaydı varsa döner.
function measured(crn) {
  if (!state.quotaLast) return '';
  const rec = state.quota?.get(crn);
  if (!rec) return '';
  return fillMeasured(state.quotaLast);
}

// Tek şube kartı. Öğretim üyesi, dolma süresi, oturumlar, önşart, sınıf/kredi
// ve rezervasyon alanlarının tümü burada korunur (eski panelin alanları).
function secCard(s, buildings) {
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
  const sessions = sessionsHtml(s, buildings);
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
  const [list, hist, cat, gr, buildings] = await Promise.all([
    getJSON(`data/terms/${t}/branches/${branch}.json`).catch(() => []),
    getJSON(`data/history/courses/${branch}.json`).then((all) => all[code] || null).catch(() => null),
    getJSON(`data/catalog/${branch}.json`).then((all) => all[code] || null).catch(() => null),
    getJSON(`data/grades/${branch}.json`).then((all) => (Array.isArray(all) ? all.filter((g) => g.code === code) : [])).catch(() => []),
    loadBuildings(),
  ]);
  const secs = Array.isArray(list) ? list.filter((s) => s.code === code) : [];
  const obsLink = obsDeepLink(code);

  if (!secs.length) {
    content.innerHTML = `
      <h3 id="detail-title">${esc(code)} ${obsLink ? `<a class="d-obs" href="${esc(obsLink)}" target="_blank" rel="noopener" title="OBS katalog formu">OBS'de aç ↗</a>` : ''}</h3>
      <p class="empty">Bu ders <b>${esc(termLabel(t))}</b> döneminde açık değil.</p>
      <section class="d-req-by" data-code="${esc(code)}"><h4>Bu dersi önşart isteyenler</h4>
        <p class="empty">yükleniyor…</p></section>
      ${gradesHtml(gr)}
      ${histHtml(hist)}
      ${catalogHtml(cat)}`;
    wireHistButtons(content);
    const reqBy = content.querySelector('.d-req-by');
    if (reqBy) loadReqBy(reqBy);
    return;
  }

  const programs = [...new Set(secs.flatMap((s) => s.programs || []))];
  content.innerHTML = `
    <h3 id="detail-title">${esc(code)} <span>${esc(secs[0].name)}</span>${obsLink ? `<a class="d-obs" href="${esc(obsLink)}" target="_blank" rel="noopener" title="OBS katalog formu">OBS'de aç ↗</a>` : ''}</h3>
    <div class="d-meta">${[branch, secs[0].level, secs[0].method].filter(Boolean).map((x) => `<span class="d-pill">${esc(x)}</span>`).join('')}</div>
    <section class="d-secs">
      <h4>Bu dönem · ${secs.length} şube</h4>
      ${secs.map((s) => secCard(s, buildings)).join('')}
    </section>
    <section class="d-progs">
      <h4>Bu dersi alabilen programlar${programs.length ? ` (${programs.length})` : ''}</h4>
      <div class="d-prog-list">${programs.length
        ? programs.map((p) => `<button type="button" class="d-prog" data-program="${esc(p)}" title="Derslerde bu programa göre filtrele">${esc(p)}</button>`).join('')
        : '<span class="d-prog d-prog-none">kısıtlama yok — tüm programlar alabilir</span>'}</div>
    </section>
    <section class="d-req-by" data-code="${esc(code)}"><h4>Bu dersi önşart isteyenler</h4>
      <p class="empty">yükleniyor…</p></section>
    ${gradesHtml(gr)}
    ${catalogHtml(cat)}
    ${histHtml(hist)}`;
  wireHistButtons(content);
  wireProgButtons(content);
  wireEqButtons(content);
  const reqBy = content.querySelector('.d-req-by');
  if (reqBy) loadReqBy(reqBy);
}

// Alabilen program çiplerine tıklayınca dersler sekmesinde o programa göre filtrele.
function wireProgButtons(content) {
  content.querySelectorAll('.d-prog[data-program]').forEach((b) => b.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: { program: b.dataset.program } }));
    closeCourseDetail();
  }));
}

// Katalog bölümü (Faz 3). Veri yoksa hiç render edilmez — panel eski haliyle
// çalışır. Kredi satırı, şube kartındaki "oturum süresi"nden ayrı etiketlidir:
// bu, resmî T+U+L paketidir.
function catalogHtml(cat) {
  if (!cat) return '';
  const c = cat.credits || {};
  const parts = [];
  if (c.theory || c.practice || c.lab) parts.push(`${c.theory || 0}+${c.practice || 0}+${c.lab || 0}`);
  if (c.local != null) parts.push(`yerel ${trNum(c.local)}`);
  if (c.ects) parts.push(`AKTS ${trNum(c.ects)}`);
  const details = (title, open, body) => `<details class="d-cat-details"${open ? ' open' : ''}><summary>${title}</summary>${body}</details>`;
  const list = (items) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  // Faz 4.2: vize haftası göstergesi — "Hafta N — ... Ara Sınav ..." satırlarını
  // sayar. Katalog planı yoksa bölüm sessiz.
  const midterms = (cat.weeklyTopics || []).filter((t) => /ara\s*sınav/i.test(t));
  const midtermLine = midterms.length
    ? `<p class="d-cat-midterm">vize: ${esc(midterms.map((t) => t.split(' — ')[0] || t).join(', '))}</p>`
    : '';
  // Faz 3.5: haftalık plan tablosu (hafta/konu/çıktı). Yapılandırılmış veri yoksa
  // geriye uyumlu <ol> listesine düş.
  const hasOut = (cat.weeklyPlan || []).some((w) => w.outcomes);
  const planHtml = (cat.weeklyPlan || []).length
    ? `<div class="tablewrap"><table class="d-cat-plan" aria-label="Haftalık ders planı">
        <thead><tr><th class="num">Hafta</th><th>Konu</th>${hasOut ? '<th>Çıktılar</th>' : ''}</tr></thead>
        <tbody>${cat.weeklyPlan.map((w) => `<tr${/ara\s*sınav/i.test(w.topic) ? ' class="d-cat-mid" title="Ara sınav haftası"' : ''}><td class="num">${w.week}</td><td>${esc(w.topic)}</td>${hasOut ? `<td>${esc(w.outcomes || '—')}</td>` : ''}</tr>`).join('')}</tbody>
      </table></div>`
    : (cat.weeklyTopics || []).length ? `<ol>${list(cat.weeklyTopics)}</ol>` : '';
  // Faz 3.5: denklikler — tıklanınca o dersin detayı açılır.
  const eqs = cat.equivalents || [];
  const eqHtml = eqs.length
    ? `<div class="d-cat-eq"><h4>Ders denklikleri</h4><div class="d-eq-list">${eqs.map((e) => `<button type="button" class="d-eq" data-eq="${esc(e)}">${esc(e)}</button>`).join('')}</div></div>`
    : '';
  return `<section class="d-cat">
    <h4>Katalog</h4>
    ${parts.length ? `<p class="d-cat-credits">${esc(parts.join(' · '))}${cat.language ? ` · dil: ${esc(cat.language)}` : ''}</p>` : ''}
    ${midtermLine}
    ${eqHtml}
    ${cat.description ? details('Ders içeriği', false, `<p>${esc(cat.description)}</p>`) : ''}
    ${(cat.outcomes || []).length ? details(`Öğrenme çıktıları (${cat.outcomes.length})`, true, `<ul>${list(cat.outcomes)}</ul>`) : ''}
    ${planHtml ? details(`Haftalık plan (${(cat.weeklyPlan || cat.weeklyTopics || []).length})`, false, planHtml) : ''}
    ${(cat.textbooks || []).length ? details('Kaynak kitaplar', false, `<ul>${list(cat.textbooks)}</ul>`) : ''}
    ${cat.sourceUrl ? `<p class="d-cat-src">kaynak: <a href="${esc(cat.sourceUrl)}" target="_blank" rel="noopener">OBS katalog formu</a></p>` : ''}
  </section>`;
}

// Faz 3.5: denklik çipine tıklayınca o dersin ortak detayı açılır.
function wireEqButtons(content) {
  content.querySelectorAll('.d-eq[data-eq]').forEach((b) => b.addEventListener('click', () => {
    openCourseDetail(b.dataset.eq, { source: 'katalog' });
  }));
}

// Harf notu sıralaması (katalogdaki resmî geçme ölçeğine göre değil, kabaca
// azalan başarı): AA > BA+ > BA > BB+ > BB > CB+ > CB > CC+ > CC > DC+ > DC >
// DD+ > DD > FF > VF. Geçme eşiği CC+ ve üzeri kabul edilir (İTÜ'de ders bazında
// değişebilir; bu yalnızca gösterge).
export const GRADE_ORDER = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF'];

// Saf yardımcı: harf notu dağılımından geçme oranı (% ≥CC+). Test edilebilir.
export function gradePassPct(grades, total) {
  const pass = GRADE_ORDER.slice(0, 8).reduce((s, g) => s + (grades[g] || 0), 0);
  return total ? Math.round((pass / total) * 100) : 0;
}

// Saf yardımcı: en sık harf notu + yüzdesi. Test edilebilir.
export function gradeMode(grades, total) {
  const e = Object.entries(grades).sort((a, b) => b[1] - a[1])[0];
  if (!e) return { grade: '—', pct: 0 };
  return { grade: e[0], pct: total ? Math.round((e[1] / total) * 100) : 0 };
}

// gradesHtml, harf notu dağılımını (Faz 3B) çubuk grafik + geçme oranı + mod
// olarak render eder. Veri yoksa hiç çıktı üretmez (opsiyonel bölüm).
function gradesHtml(gr) {
  if (!gr || !gr.length) return '';
  const total = gr[0].total;
  const gradeBars = (term) => {
    const max = Math.max(...Object.values(term.grades), 1);
    const order = GRADE_ORDER.filter((g) => term.grades[g]);
    return `<div class="d-grade-bars">${order.map((g) => `
      <div class="d-grade" title="${esc(g)} · ${term.grades[g]} kişi">
        <span class="d-grade-l">${esc(g)}</span>
        <span class="d-grade-bar"><i style="width:${Math.round((term.grades[g] / max) * 100)}%"></i></span>
        <span class="d-grade-n">${term.grades[g]}</span>
      </div>`).join('')}</div>`;
  };
  const statLine = (term) => {
    const pct = gradePassPct(term.grades, term.total);
    const mode = gradeMode(term.grades, term.total);
    const modeTxt = `${mode.grade} (%${mode.pct})`;
    return `<p class="d-grade-stat">geçme ≥CC+ %${pct} · en sık ${esc(modeTxt)} · ${term.total} öğrenci</p>`;
  };
  // Birden çok dönem varsa en yenisi (donem kodu büyük) üstte; diğerleri
  // katlanabilir listeye.
  const sorted = [...gr].sort((a, b) => (b.donem || '').localeCompare(a.donem || ''));
  const latest = sorted[0];
  const older = sorted.slice(1);
  return `<section class="d-grades">
    <h4>Not dağılımı · ${esc(latest.term)}</h4>
    ${statLine(latest)}
    ${gradeBars(latest)}
    ${older.length ? `<details class="d-grades-more"><summary>önceki dönemler (${older.length})</summary>
      ${older.map((tm) => `<h5>${esc(tm.term)}</h5>${statLine(tm)}${gradeBars(tm)}`).join('')}
    </details>` : ''}
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
