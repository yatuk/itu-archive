// Ortak ders detay modalı. Dersler, önşart haritası, seçmeli havuz ve geçmiş
// sekmelerinin tümü aynı paneli açar — tek giriş openCourseDetail(code, opts).
//
// Başlangıçta views/courses.js içindeki openDetail'in birebir taşınmış halidir
// (saf refactor); detay/geçmiş eklemeleri ayrı commit'lerde gelir.

import { $, getJSON, esc } from './utils.js';
import { state } from './store.js';

let lastDetailFocus = null;

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

const field = (k, v) => (v ? `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>` : '');

// code: "BLG 101E"; term varsayılanı Dersler'deki aktif dönem (state.termSlug).
// crn verilirse o şubeye gider, verilmezse koddaki ilk şubeye.
export async function openCourseDetail(code, { term, crn, source } = {}) {
  const t = term || state.termSlug;
  lastDetailFocus = document.activeElement;
  const panel = $('#detail-panel');
  const content = $('#detail-content');
  panel.hidden = false;
  document.body.classList.add('modal-open');
  content.innerHTML = '<p class="empty">yükleniyor…</p>';
  $('#detail-close').focus();

  const branch = String(code).split(' ')[0];
  let sec = null;
  try {
    const list = await getJSON(`data/terms/${t}/branches/${branch}.json`);
    sec = crn ? list.find((s) => s.crn === crn) : list.find((s) => s.code === code);
  } catch { /* ağ hatası: aşağıda "detay yok" gösterilir */ }

  if (!sec) {
    content.innerHTML = '<p class="empty">detay bulunamadı</p>';
    return;
  }

  const sessions = sec.days.map((d, i) => [d, sec.times[i] || '', sec.rooms[i] || '', sec.buildings[i] || '']
    .filter(Boolean).join(' · ')).join('<br>');
  const pct = sec.capacity ? `%${Math.round((sec.enrolled / sec.capacity) * 100)}` : '';
  const note = fillNote(crn);
  const canHistory = sec.instructor && sec.instructor !== '-' && sec.instructor !== '***';
  const programs = sec.programs || [];

  // "Alabilen programlar" belirgin ve her zaman görünür; boşsa kısıtlama yok.
  const programsHtml = programs.length
    ? programs.map((p) => `<span class="d-prog">${esc(p)}</span>`).join('')
    : '<span class="d-prog d-prog-none">kısıtlama yok — tüm programlar alabilir</span>';

  content.innerHTML = `
    <h3 id="detail-title">${esc(code)} <span>${esc(sec.name)}</span></h3>
    <div class="d-meta">${[branch, sec.level, sec.method].filter(Boolean).map((x) => `<span class="d-pill">${esc(x)}</span>`).join('')}</div>
    <section class="d-progs">
      <h4>Bu dersi alabilen programlar${programs.length ? ` (${programs.length})` : ''}</h4>
      <div class="d-prog-list">${programsHtml}</div>
    </section>
    <dl>
      ${field('Öğretim üyesi', sec.instructor)}
      ${field('Kontenjan', sec.capacity ? `${sec.enrolled} / ${sec.capacity} (${pct})` : '—')}
      ${note ? field('Dolma', note) : ''}
      ${sessions ? field('Oturumlar', sessions) : ''}
      ${sec.prereq && sec.prereq !== '-' ? field('Önşart', sec.prereq) : ''}
      ${sec.classReq && sec.classReq !== '-' ? field('Sınıf / kredi önşartı', sec.classReq) : ''}
      ${sec.reserved && sec.reserved !== '-' ? field('Rezervasyon', sec.reserved) : ''}
    </dl>
    ${canHistory ? `<button type="button" class="btn-ghost d-hist" data-name="${esc(sec.instructor)}">bu hocanın geçmişinde ara</button>` : ''}`;

  const histBtn = content.querySelector('.d-hist');
  if (histBtn) {
    histBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('itu:goto-history', { detail: histBtn.dataset.name }));
      closeCourseDetail();
    });
  }
}

export function closeCourseDetail() {
  $('#detail-panel').hidden = true;
  document.body.classList.remove('modal-open');
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
