// Ortak ders detay modalı. Dersler, önşart haritası, seçmeli havuz ve geçmiş
// sekmelerinin tümü aynı paneli açar — tek giriş openCourseDetail(code, opts).
//
// Panel dört görev odaklı sekmeden oluşur: Özet, Şubeler, Katalog ve Geçmiş.
// Tablo satırından açıldığında ilgili CRN'nin Şubeler görünümü; doğrudan bağlantıda
// ise karar özeti öne gelir. Uzun program ve arşiv listeleri kontrollü açılır.

import { $, getJSON, esc, termLabel, sessionHours, fillMeasured, buildingName, trNum, formatInt } from './utils.js?v=dde1e9339338';
import { state } from './store.js?v=dde1e9339338';
import { fillBar, quotaDisplay, trendChart } from './chart.js?v=dde1e9339338';
import { parseReq, renderReqTree } from '../prereq.js?v=dde1e9339338';
import { codeToSlug } from './urlcodes.js?v=dde1e9339338';
import { loadProgramMap } from './programs.js?v=dde1e9339338';
import { TAKEN_CHANGED, getTaken } from './taken.js?v=dde1e9339338';

let lastDetailFocus = null;
let lastDetailHash = null; // detay açılmadan önceki görünüm hash'i (kapatınca dön)

// İçerik bazlı mobil tespiti (user-agent değil): dar ekranda panel/grafik
// davranışı farklılaşır (trend 6 dönem, katlanabilirler kapalı, tam ekran panel).
function isMobile() {
  return window.matchMedia('(max-width: 600px)').matches;
}

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
  if (!reverse || !reverse[code]) {
    (sec.closest('.d-relation-more') || sec).hidden = true;
    return;
  }
  const reqs = reverse[code];
  const count = sec.closest('.d-relation-more')?.querySelector('[data-req-count]');
  if (count) count.textContent = String(reqs.length);
  sec.innerHTML = `<div class="d-req-list">${reqs.map((r) => `<button type="button" class="d-req" data-code="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
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
// Tek şube kartı (Faz: panel elden geçirme). method/saat liste başlığında
// tekrar ediliyorsa showMeta=false (kartta yalnız derslik/süre kalır).
function secCard(s, buildings, showMeta = true) {
  const hrs = sessionHours(s.times);
  const note = fillNote(s.crn);
  const names = splitInstructors(s.instructor);
  const instructors = names
    .filter((n) => n !== '-' && n !== '***')
    .map((n) => `<button type="button" class="d-instr-history" data-name="${esc(n)}" title="${esc(n)} geçmişinde ara">${esc(n)}</button>`)
    .join('');
  const sessions = sessionsHtml(s, buildings);
  // Sade tema tek sayısal temsil kullanır; fosfor eski yüzde + çubuğu korur.
  const stats = s.capacity ? quotaDisplay(s.capacity, s.enrolled, { detail: true }) : '·';
  return `
    <article class="d-sec" data-crn="${esc(s.crn)}">
      <div class="d-sec-head">
        <b class="d-crn">${esc(s.crn)}</b>
        <span class="d-sec-instr">${instructors || esc(s.instructor || '·')}</span>
        <span class="d-sec-stats">${stats}${note ? ` · ${esc(note)}` : ''}${measured(s.crn) ? `<small class="fill-measured"> · ${esc(measured(s.crn))}</small>` : ''}</span>
      </div>
      ${showMeta ? `<div class="d-sec-meta">${[s.method, hrs ? `haftada ${hrs} sa` : ''].filter(Boolean).join(' · ')}</div>` : ''}
      ${sessions ? `<div class="d-sec-when">${sessions}</div>` : ''}
      ${(s.prereq && s.prereq !== '-') || (s.classReq && s.classReq !== '-') || (s.reserved && s.reserved !== '-') ? `<details class="d-sec-rules"><summary>Kayıt koşulları</summary>
        ${s.prereq && s.prereq !== '-' ? `<p><b>Önşart</b>${esc(s.prereq)}</p>` : ''}
        ${s.classReq && s.classReq !== '-' ? `<p><b>Sınıf / kredi</b>${esc(s.classReq)}</p>` : ''}
        ${s.reserved && s.reserved !== '-' ? `<p><b>Rezervasyon</b>${esc(s.reserved)}</p>` : ''}
      </details>` : ''}
    </article>`;
}

// Şubeler kompakt satırlar olarak çizilir. İlk sekiz satır doğrudan görünür;
// daha uzun listeler kontrollü açılır. Şubeler birleştirilmez: her CRN'nin
// kontenjan ve kayıt durumu ayrı kalır.
function renderSecList(secs, buildings, focusCrn = '') {
  // Dolu (kap>0) olanlar önce, sonra CRN sırası.
  const ordered = secs.slice().sort((a, b) =>
    (String(b.crn) === String(focusCrn) ? 1 : 0) - (String(a.crn) === String(focusCrn) ? 1 : 0) ||
    (a.capacity > 0 ? 0 : 1) - (b.capacity > 0 ? 0 : 1) ||
    Number(a.crn) - Number(b.crn) || String(a.crn).localeCompare(b.crn));

  const uniformMethod = [...new Set(secs.map((s) => s.method).filter(Boolean))].length <= 1;
  const uniformHrs = [...new Set(secs.map((s) => sessionHours(s.times)))].length <= 1;
  const hrs = uniformHrs ? sessionHours(secs[0].times) : 0;
  const head = [];
  if (uniformMethod && secs[0].method) head.push(secs[0].method === 'Fiziksel (Yüz yüze)' ? 'yüz yüze' : secs[0].method);
  if (uniformHrs && hrs) head.push(`haftada ${hrs} sa`);
  const listHeader = head.length ? `<p class="d-secs-head">${secs.length} şube · ${esc(head.join(' · '))}</p>` : '';

  const card = (s) => secCard(s, buildings, !uniformMethod || !uniformHrs)
    .replace('class="d-sec"', `class="d-sec${String(s.crn) === String(focusCrn) ? ' is-focus' : ''}"`);
  const MAX = 8;
  const showAll = ordered.length > MAX;
  const html = ordered.slice(0, MAX).map(card).join('') +
    (showAll ? `<div class="d-secs-more" hidden>${ordered.slice(MAX).map(card).join('')}</div>
      <button type="button" class="btn-ghost d-secs-toggle">${ordered.length - MAX} şube daha göster</button>` : '');

  return `<div class="d-sec-list">${listHeader}${html}</div>`;
}

let lastHistTerms = null; // trend "hepsini göster" için güncel byTerm

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
  lastHistTerms = byTerm; // trend "hepsini göster" yeniden çizimi için
  const seasons = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' };
  const openIn = [...new Set([...byTerm.keys()].map((s) => s.split('-')[2]))].map((s) => seasons[s] || s);
  const rows = [];
  for (const [slug, secs] of byTerm) secs.forEach((r, i) => rows.push({ slug, termFirst: i === 0, ...r }));
  return `<section class="d-hist">
    <div class="d-section-head"><div><h4>Geçmiş dönemler</h4><p>${byTerm.size} dönemde açıldı · ${esc(openIn.join(', '))}</p></div></div>
    ${trendChart(byTerm, isMobile() ? 6 : 8)}
    <details class="d-history-records">
      <summary>Dönem kayıtları <span>${rows.length}</span></summary>
      <div class="tablewrap"><table class="htable" aria-label="Dönem geçmişi">
        <thead><tr><th>Dönem</th><th>Öğretim üyesi</th><th class="num">Kont.</th><th class="num">Yazılan</th><th class="num quota-legacy-col">Doluluk</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${r.termFirst ? esc(termLabel(r.slug)) : ''}</td>
          <td>${esc(r.instructor || '·')}</td><td class="num">${r.cap}</td><td class="num">${r.enr}</td>
          <td class="num quota-legacy-col">${fillBar(r.cap, r.enr)}</td></tr>`).join('')}</tbody>
      </table></div>
    </details>
  </section>`;
}

function programsHtml(programs, hasTermData) {
  if (!hasTermData) {
    return `<div class="d-progs d-progs-none"><span>Program bilgisi yok</span><p>Ders bu dönemde açılmadığı için program kısıtları listelenemiyor.</p></div>`;
  }
  if (!programs.length) {
    return `<div class="d-progs d-progs-none"><span>Program kısıtı yok</span><p>Tüm programlar bu dersi alabilir.</p></div>`;
  }
  return `<details class="d-progs">
    <summary><span>Alabilen programlar</span><b>${programs.length}</b></summary>
    <div class="d-progs-body">
      ${programs.length > 12 ? `<label class="d-prog-search-wrap"><span class="sr-only">Programlarda ara</span><input type="search" class="d-prog-search" placeholder="program ara…" autocomplete="off"></label>` : ''}
      <div class="d-prog-list">${programs.map((p) => `<button type="button" class="d-prog" data-program="${esc(p)}" title="Derslerde bu programa göre filtrele">${esc(p)}</button>`).join('')}</div>
      <p class="d-prog-empty" hidden>Eşleşen program yok.</p>
    </div>
  </details>`;
}

function overviewHtml({ code, term, secs, cat, gr, hist, programs }) {
  const termCount = new Set((hist?.rows || []).map((r) => r[0])).size;
  const hrs = secs.length ? sessionHours(secs[0].times) : 0;
  const credits = cat?.credits || {};
  const creditText = credits.local != null
    ? `${trNum(credits.local)} kredi${credits.ects ? ` · ${trNum(credits.ects)} AKTS` : ''}`
    : 'Katalog bilgisi yok';
  return `<div class="d-overview-stats">
      <div><span>Bu dönem</span><b>${secs.length ? `${secs.length} şube` : 'Açık değil'}</b><small>${esc(termLabel(term))}${hrs ? ` · haftada ${hrs} sa` : ''}</small></div>
      <div><span>Kredi</span><b>${esc(creditText)}</b><small>${esc(cat?.language || 'dil bilgisi yok')}</small></div>
      <div><span>Arşiv</span><b>${termCount ? `${termCount} dönem` : 'Kayıt yok'}</b><small>${termCount ? 'geçmiş açılışlar' : 'dönem verisi bulunamadı'}</small></div>
    </div>
    <div class="d-overview-relations">
      <section class="d-relation"><h4>Önşart</h4><div class="d-req-fwd" data-code="${esc(code)}"><p class="empty">yükleniyor…</p></div></section>
      <details class="d-relation d-relation-more"><summary>Bu dersi önşart isteyenler <span data-req-count>…</span></summary>
        <div class="d-req-by" data-code="${esc(code)}"><p class="empty">yükleniyor…</p></div>
      </details>
    </div>
    ${gradesHtml(gr)}
    ${programsHtml(programs, secs.length > 0)}`;
}

function detailShell({ code, name, branch, level, method, obsLink, term, secs, cat, gr, hist, programs, buildings, crn }) {
  const active = crn && secs.length ? 'sections' : 'overview';
  const panels = {
    overview: overviewHtml({ code, term, secs, cat, gr, hist, programs }),
    sections: secs.length
      ? `<section class="d-secs"><div class="d-section-head"><div><h4>Bu dönemki şubeler</h4><p>${esc(termLabel(term))} · ${secs.length} şube</p></div></div>${renderSecList(secs, buildings, crn)}</section>`
      : `<p class="empty">Bu ders <b>${esc(termLabel(term))}</b> döneminde açık değil.</p>`,
    catalog: catalogHtml(cat) || '<p class="empty">Bu ders için katalog kaydı bulunamadı.</p>',
    history: histHtml(hist),
  };
  const tab = (key, label, extra = '') => `<button type="button" role="tab" id="d-tab-${key}" aria-controls="d-panel-${key}" aria-selected="${active === key}" tabindex="${active === key ? '0' : '-1'}" data-dtab="${key}">${label}${extra}</button>`;
  return `<header class="d-head">
      <div class="d-title-block"><h3 id="detail-title"><span class="d-code">${esc(code)}</span><span class="d-name">${esc(name || code)}</span></h3>
        <div class="d-meta">${[branch, level, method].filter(Boolean).map((x) => `<span class="d-pill">${esc(x)}</span>`).join('')}</div>
      </div>
      ${obsLink ? `<a class="d-obs" href="${esc(obsLink)}" target="_blank" rel="noopener">OBS kataloğu ↗</a>` : ''}
    </header>
    <nav class="d-tabs" role="tablist" aria-label="Ders detayı bölümleri">
      ${tab('overview', 'Özet')}
      ${tab('sections', 'Şubeler', `<span>${secs.length}</span>`)}
      ${tab('catalog', 'Katalog')}
      ${tab('history', 'Geçmiş')}
    </nav>
    <div class="d-panels">
      ${Object.entries(panels).map(([key, html]) => `<section role="tabpanel" id="d-panel-${key}" aria-labelledby="d-tab-${key}" data-dpanel="${key}"${active === key ? '' : ' hidden'}>${html}</section>`).join('')}
    </div>`;
}

function wireDetailTabs(content) {
  const tabs = [...content.querySelectorAll('[data-dtab]')];
  const panels = [...content.querySelectorAll('[data-dpanel]')];
  const activate = (key, focus = false) => {
    for (const tab of tabs) {
      const on = tab.dataset.dtab === key;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    }
    for (const panel of panels) panel.hidden = panel.dataset.dpanel !== key;
    const scroller = content.querySelector('.d-panels');
    if (scroller) scroller.scrollTop = 0;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.dtab));
    tab.addEventListener('keydown', (ev) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) return;
      ev.preventDefault();
      let next = ev.key === 'Home' ? 0 : ev.key === 'End' ? tabs.length - 1
        : (index + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[next].dataset.dtab, true);
    });
  });
}

function wireProgramSearch(content) {
  const input = content.querySelector('.d-prog-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLocaleLowerCase('tr');
    let shown = 0;
    for (const button of content.querySelectorAll('.d-prog[data-program]')) {
      const visible = !q || button.textContent.toLocaleLowerCase('tr').includes(q);
      button.hidden = !visible;
      if (visible) shown++;
    }
    const empty = content.querySelector('.d-prog-empty');
    if (empty) empty.hidden = shown !== 0;
  });
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
  // #ders/<slug> (boşluksuz, kararlı). pushState: tarayıcı GERİ düğmesi paneli kapatır.
  // Eski #ders/...%20... kodlu bağlantılar yine çözülür (openDetailFromHash slugToCode).
  const slug = codeToSlug(code);
  if (!location.hash.startsWith('#ders/')) history.pushState(null, '', '#ders/' + slug);

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
  const programs = [...new Set(secs.flatMap((s) => s.programs || []))];
  const name = secs[0]?.name || cat?.name || hist?.name || code;
  content.innerHTML = detailShell({
    code, name, branch, level: secs[0]?.level, method: secs[0]?.method,
    obsLink, term: t, secs, cat, gr, hist, programs, buildings, crn,
  });
  wireDetailTabs(content);
  wireHistButtons(content);
  wireProgButtons(content);
  wireProgramSearch(content);
  wireEqButtons(content);
  wireTrendChart(content);
  const secToggle = content.querySelector('.d-secs-toggle');
  if (secToggle) {
    secToggle.addEventListener('click', () => {
      const more = content.querySelector('.d-secs-more');
      const open = more.hidden;
      more.hidden = !open;
      secToggle.textContent = open ? 'daha az göster' : `${content.querySelectorAll('.d-secs-more .d-sec').length} şube daha göster`;
      secToggle.setAttribute('aria-expanded', String(open));
    });
  }
  const reqFwd = content.querySelector('.d-req-fwd');
  if (reqFwd) loadPrereqWhenVisible(reqFwd, () => loadPrereqTree(reqFwd, code));
  const reqBy = content.querySelector('.d-req-by');
  if (reqBy) loadPrereqWhenVisible(reqBy, () => loadReqBy(reqBy));

  // Faz A (G5): EN modunda, katalogda İngilizce ad varsa başlığı onunla değiştir.
  const titleSpan = content.querySelector('#detail-title .d-name');
  if (titleSpan && document.documentElement.lang === 'en' && cat?.nameEn) {
    titleSpan.textContent = cat.nameEn;
  }

  // Faz B (G7): "alabilen programlar" çiplerine resmî listeden okunur ad yaz;
  // listede olmayan kodları soluk işaretle (kapanmış/grafik dışı).
  enrichProgLabels(content);
}

// programs.json'dan kod → okunur ad. Kod resmî listede yoksa "kapanmış" soluk;
// kullanıcının beyan ettiği programı varsa işaretle (Faz D, G8).
async function enrichProgLabels(content) {
  try {
    const [m, taken] = await Promise.all([loadProgramMap(), Promise.resolve(getTaken())]);
    for (const b of content.querySelectorAll('.d-prog[data-program]')) {
      const code = b.dataset.program;
      const p = m.get(code);
      if (p) {
        b.textContent = `${code} · ${p.name}`;
      } else {
        b.classList.add('d-prog-stale');
        b.title = 'Bu program kodu resmî listede yok (kapanmış/grafik dışı olabilir)';
      }
      if (taken.program && code === taken.program) {
        b.classList.add('d-prog-mine');
        b.title = 'Senin programın';
      }
    }
  } catch { /* liste yoksa sessiz — yalnız kodlar görünür */ }
}

// Faz D: "aldığım dersler" değişince açık paneldeki önşart + program etiketleri
// tazelenir (kullanıcı kaydettikten sonra paneli yeniden açmasına gerek kalmaz).
if (typeof window !== 'undefined') {
  window.addEventListener(TAKEN_CHANGED, () => {
    const content = $('#detail-content');
    if (!content || content.hidden) return;
    const reqFwd = content.querySelector('.d-req-fwd');
    const code = reqFwd?.dataset.code;
    if (reqFwd && code) loadPrereqTree(reqFwd, code);
    enrichProgLabels(content);
  });
}

// Panelde dersin önşart VE/VEYA ağacı (P1-9). prereq/graph.json'da kayıtlı
// önşartı olan ders için yapılandırılmış ağaç; yoksa "kayıtlı önşartı yok".
// graph.json önşart sekmesinde zaten lazy yüklenir; burada önbellekli.
// graph.json (1,9MB) + reverse.json (288KB) YALNIZCA önşart bölümü görünüme
// girince yüklenir — her detay açılışında ağa gidilmez (mobil veri maliyeti).
function loadPrereqWhenVisible(section, loader) {
  if (!section || !('IntersectionObserver' in window)) { loader(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      loader();
    }
  }, { rootMargin: '240px' });
  io.observe(section);
}
let reqGraphCache = null;
async function loadReqGraph() {
  if (reqGraphCache === null) {
    reqGraphCache = await getJSON('data/prereq/graph.json').catch(() => null);
  }
  return reqGraphCache;
}
async function loadPrereqTree(box, code) {
  try {
    const g = await loadReqGraph();
    const node = (g?.nodes || []).find((n) => n.code === code);
    const req = node?.requirement;
    if (!req) {
      box.innerHTML = '<p class="empty">Kayıtlı önşartı yok.</p>';
      return;
    }
    box.innerHTML = `<ul class="req-tree">${renderReqTree(parseReq(req))}</ul>`;
  } catch { /* graph yoksa sessiz */ }
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
    ? `<p class="d-cat-midterm">vize: ${esc(midterms.map((t) => t.split(' · ')[0] || t).join(', '))}</p>`
    : '';
  // Faz 3.5: haftalık plan tablosu (hafta/konu/çıktı). Yapılandırılmış veri yoksa
  // geriye uyumlu <ol> listesine düş.
  const hasOut = (cat.weeklyPlan || []).some((w) => w.outcomes);
  const planHtml = (cat.weeklyPlan || []).length
    ? `<div class="tablewrap"><table class="d-cat-plan" aria-label="Haftalık ders planı">
        <thead><tr><th class="num">Hafta</th><th>Konu</th>${hasOut ? '<th>Çıktılar</th>' : ''}</tr></thead>
        <tbody>${cat.weeklyPlan.map((w) => `<tr${/ara\s*sınav/i.test(w.topic) ? ' class="d-cat-mid" title="Ara sınav haftası"' : ''}><td class="num">${w.week}</td><td>${esc(w.topic)}</td>${hasOut ? `<td>${esc(w.outcomes || '·')}</td>` : ''}</tr>`).join('')}</tbody>
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
    ${(cat.outcomes || []).length ? details(`Öğrenme çıktıları (${cat.outcomes.length})`, !isMobile(), `<ul>${list(cat.outcomes)}</ul>`) : ''}
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
  if (!e) return { grade: '·', pct: 0 };
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
  const pct = gradePassPct(latest.grades, latest.total);
  const mode = gradeMode(latest.grades, latest.total);
  return `<details class="d-grades">
    <summary><span><b>Not dağılımı</b><small>${esc(latest.term)}</small></span><strong>≥CC+ %${pct} · en sık ${esc(mode.grade)}</strong></summary>
    <div class="d-grades-body">${statLine(latest)}
    ${gradeBars(latest)}
    ${older.length ? `<details class="d-grades-more"><summary>önceki dönemler (${older.length})</summary>
      ${older.map((tm) => `<h5>${esc(tm.term)}</h5>${statLine(tm)}${gradeBars(tm)}`).join('')}
    </details>` : ''}</div>
  </details>`;
}

// Trend grafiği etkileşimi: caption sabit satır (hover/focus ile güncellenir,
// kırpılan ipucu kutusu yerine) + "hepsini göster" (8 dönem → tümü).
function wireTrendChart(content) {
  const chart = content.querySelector('.trend');
  if (!chart) return;
  const caption = chart.querySelector('.t-caption');
  const bars = [...chart.querySelectorAll('.t-bar')];
  const last = bars[bars.length - 1];
  const setCap = (bar) => { if (caption && bar) caption.textContent = bar.dataset.caption || ''; };
  if (caption && last) caption.textContent = last.dataset.caption || '';
  for (const b of bars) {
    b.addEventListener('mouseenter', () => setCap(b));
    b.addEventListener('focus', () => setCap(b));
    b.addEventListener('mouseleave', () => setCap(last));
    b.addEventListener('blur', () => setCap(last));
  }
  const more = chart.querySelector('.t-more');
  if (more) {
    more.addEventListener('click', () => {
      const parent = chart.parentElement;
      chart.outerHTML = trendChart(lastHistTerms || new Map(), 0); // limit 0 = hepsi
      if (parent) wireTrendChart(parent);
    });
  }
}

function wireHistButtons(content) {
  content.querySelectorAll('.d-instr-history').forEach((b) => b.addEventListener('click', () => {
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

// Modal içinde Tab döngüsü (aria-modal için odak tuzağı): odak panel dışına kaçmaz.
function trapDetailFocus(e) {
  if (e.key !== 'Tab') return;
  const panel = $('#detail-panel');
  if (!panel || panel.hidden) return;
  const focusables = [...panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (!panel.contains(active) || active === first)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (!panel.contains(active) || active === last)) {
    e.preventDefault();
    first.focus();
  }
}

// Modal kapama + dış kaynaklardan (havuz, önşart) gelen istekleri bağlar.
// app.js boot'ta bir kez çağırır.
export function initCourseDetail() {
  $('#detail-close').addEventListener('click', closeCourseDetail);
  $('#detail-panel').addEventListener('click', (e) => { if (e.target.id === 'detail-panel') closeCourseDetail(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#detail-panel').hidden) closeCourseDetail(); });
  document.addEventListener('keydown', trapDetailFocus);
  // Geri tuşu: hash #ders/ dışına dönünce panel kapanır (pushState ile).
  window.addEventListener('hashchange', () => {
    const panel = $('#detail-panel');
    if (panel && !panel.hidden && !location.hash.startsWith('#ders/')) closeCourseDetail();
  });
  // Mobil: başlığı aşağı sürükleyerek kapat (aşağı çekme).
  const box = $('#detail-box');
  if (box) {
    let drag = null;
    box.addEventListener('pointerdown', (e) => {
      if (!isMobile() || !e.target.closest('.d-head, #detail-close')) return;
      drag = { y: e.clientY, id: e.pointerId };
    });
    box.addEventListener('pointermove', (e) => {
      if (drag && drag.id === e.pointerId && e.clientY - drag.y > 60) {
        drag = null;
        closeCourseDetail();
      }
    });
    box.addEventListener('pointerup', () => { drag = null; });
  }
  window.addEventListener('itu:course-detail', (e) => {
    const d = e.detail || {};
    if (d.code) openCourseDetail(d.code, { term: d.term, source: d.source });
  });
}
