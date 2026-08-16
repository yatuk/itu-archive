// Sınavlar görünümü: aktif dönemin sınav takvimini ders/bina/tür üzerinden
// arar. Bina filtresi yer alanından çıkarılır (yeni kazıma yok).

import { $, getJSON, esc, fold, debounce, buildingOf, setStatus, downloadICS, parseTurkishDate } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillRows } from '../core/table.js';
import { toast } from '../core/toast.js';
import { I18N } from '../i18n.js';

let inited = false;
let currentHits = []; // son filtre sonucu — .ics dışa aktarımı için
// Sınav listesi sayfalama: 400'lük tavan yerine "daha fazla" ile artar.
let examsShown = 400;

export function initExams() {
  if (inited) return;
  $('#eq').addEventListener('input', debounce(renderExams, 120));
  $('#f-etype').addEventListener('change', renderExams);
  $('#f-building').addEventListener('change', renderExams);
  $('#f-ebranch').addEventListener('change', renderExams);
  const ics = $('#e-ics');
  if (ics) ics.addEventListener('click', exportExamsICS);
  const emore = $('#emore');
  if (emore) emore.addEventListener('click', () => { examsShown += 200; renderExams(true); });
  inited = true;
}

export function onShow() {
  initExams();
  if (!state.exams && state.index) loadExams();
}

async function loadExams() {
  setStatus($('#eresultline'), I18N.t('statLoading'), { busy: true });
  try {
    const sched = await getJSON(`data/exams/${state.index.currentSlug}.json`);
    state.exams = sched;
    state.examHay = sched.exams.map((e) => fold(`${e.crn} ${e.code} ${e.name} ${e.instructor}`));
    const types = [...new Set(sched.exams.map((e) => e.type))].sort();
    $('#f-etype').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
      types.map((t) => `<option>${esc(t)}</option>`).join('');

    const buildings = [...new Set(sched.exams.map((e) => buildingOf(e.place)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    $('#f-building').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
      buildings.map((b) => `<option>${esc(b)}</option>`).join('');
    // Faz B (G9): branş filtresi — e.branch veride vardı, şimdi kullanılıyor.
    const branches = [...new Set(sched.exams.map((e) => e.branch).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    $('#f-ebranch').innerHTML = `<option value="">${esc(I18N.t('filterAll'))}</option>` +
      branches.map((b) => `<option>${esc(b)}</option>`).join('');
  } catch (e) {
    state.exams = { exams: [] };
    state.examHay = [];
    setStatus($('#eresultline'), I18N.t('examLoadFail', { msg: e.message }), { error: true });
  }
  renderExams();
}

function renderExams(append) {
  if (!state.exams) return;
  if (!append) examsShown = 400;
  const q = fold($('#eq').value.trim());
  const type = $('#f-etype').value;
  const bld = $('#f-building').value;
  const ebranch = $('#f-ebranch').value;
  const terms = q ? q.split(/\s+/) : [];

  const hits = state.exams.exams.filter((e, i) => {
    if (type && e.type !== type) return false;
    if (bld && buildingOf(e.place) !== bld) return false;
    if (ebranch && e.branch !== ebranch) return false;
    return terms.every((t) => state.examHay[i].includes(t));
  });
  currentHits = hits; // .ics dışa aktarımı için

  // P2-17: yer bilgisi tüm satırlarda aynı/ilgisizse ("İlgili Bölümce
  // Açıklanacak") YER kolonu bilgi taşımıyor — gizle, üstte tek satır not düş.
  const realPlace = (p) => p && p !== '-' && p !== 'İlgili Bölümce Açıklanacak';
  const showPlace = hits.some((e) => realPlace(e.place));
  const etable = $('#etable');
  if (etable) etable.classList.toggle('hide-yer', !showPlace);

  let resultLine = state.exams.exams.length
    ? `<b>${hits.length}</b> / ${I18N.t('examCount', { total: state.exams.exams.length })} · ${esc(state.exams.term || '')}`
    : I18N.t('examNotPublished');
  if (!showPlace && hits.length) {
    resultLine += ` · ${esc(I18N.t('examPlaceTBA'))}`;
  }
  $('#eresultline').innerHTML = resultLine;

  const rows = fillRows($('#erows'), hits.slice(0, examsShown), (e) => `
    <tr><td class="crn" data-label="CRN">${esc(e.crn)}</td>
        <td class="code" data-label="${esc(I18N.t('thCode'))}"><button type="button" class="row-toggle x-detail" data-code="${esc(e.code)}"><b>${esc(e.code)}</b></button></td>
        <td data-label="${esc(I18N.t('thName'))}">${esc(e.name)}</td>
        <td data-label="${esc(I18N.t('thInstr'))}">${esc(e.instructor || '·')}</td>
        <td data-label="${esc(I18N.t('examType'))}">${esc(e.type)}</td>
        ${showPlace ? `<td class="when yer-col" data-label="${esc(I18N.t('examPlace'))}">${esc(e.place || '·')}</td>` : ''}
        <td data-label="${esc(I18N.t('examDate'))}">${esc(e.date)}</td>
        <td class="when" data-label="${esc(I18N.t('examTime'))}">${esc(I18N.dayName(e.day))} ${esc(e.time)}</td></tr>`,
  { empty: I18N.t('examNoMatch'), colspan: showPlace ? 8 : 7 });
  const emore = $('#emore');
  if (emore) {
    emore.hidden = hits.length <= examsShown;
    emore.textContent = I18N.t('moreLeft', { n: hits.length - examsShown });
  }
  if (rows) {
    rows.forEach((tr) => {
      const b = tr.querySelector('.x-detail');
      if (b) b.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: b.dataset.code, source: 'sinavlar' } }));
      });
    });
  }
}

// Sınav kaydını .ics etkinliğine çevirir: Türkçe tarih + "HH:MM-HH:MM" aralığı →
// ISO zamanlı başlangıç/bitiş. Saf — test edilebilir. Çözümlenemezse null.
export function examToIcs(e) {
  const start = parseTurkishDate(e.date);
  if (!start) return null;
  const m = String(e.time || '').match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const p = (n) => String(n).padStart(2, '0');
  const iso = (h, mi) => `${start.getFullYear()}-${p(start.getMonth() + 1)}-${p(start.getDate())}T${p(h)}:${p(mi)}:00`;
  const place = e.place && e.place !== '-' && e.place !== 'İlgili Bölümce Açıklanacak' ? e.place : '';
  return {
    uid: `${e.crn}-${e.code}-${e.date}`,
    title: `${e.code}: ${e.name} (${e.type})`,
    startISO: iso(+m[1], +m[2]),
    endISO: iso(+m[3], +m[4]),
    desc: [e.instructor, place].filter(Boolean).join(' · '),
  };
}

// Faz 4.5b: filtrelenmiş sınav listesini .ics olarak dışa aktarır.
function exportExamsICS() {
  if (!currentHits.length) { toast(I18N.t('examNone'), { kind: 'warn' }); return; }
  const events = currentHits.map(examToIcs).filter(Boolean);
  downloadICS(`itu-final-${state.index.currentSlug}.ics`, events);
  toast(I18N.t('examIcsDone', { n: events.length }));
}
