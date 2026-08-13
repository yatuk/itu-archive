// Sınavlar görünümü: aktif dönemin sınav takvimini ders/bina/tür üzerinden
// arar. Bina filtresi yer alanından çıkarılır (yeni kazıma yok).

import { $, getJSON, esc, fold, debounce, buildingOf, setStatus } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillRows } from '../core/table.js';

let inited = false;

export function initExams() {
  if (inited) return;
  $('#eq').addEventListener('input', debounce(renderExams, 120));
  $('#f-etype').addEventListener('change', renderExams);
  $('#f-building').addEventListener('change', renderExams);
  inited = true;
}

export function onShow() {
  initExams();
  if (!state.exams && state.index) loadExams();
}

async function loadExams() {
  setStatus($('#eresultline'), 'yükleniyor…', { busy: true });
  try {
    const sched = await getJSON(`data/exams/${state.index.currentSlug}.json`);
    state.exams = sched;
    state.examHay = sched.exams.map((e) => fold(`${e.crn} ${e.code} ${e.name} ${e.instructor}`));
    const types = [...new Set(sched.exams.map((e) => e.type))].sort();
    $('#f-etype').innerHTML = '<option value="">hepsi</option>' +
      types.map((t) => `<option>${esc(t)}</option>`).join('');

    const buildings = [...new Set(sched.exams.map((e) => buildingOf(e.place)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    $('#f-building').innerHTML = '<option value="">hepsi</option>' +
      buildings.map((b) => `<option>${esc(b)}</option>`).join('');
  } catch (e) {
    state.exams = { exams: [] };
    state.examHay = [];
    setStatus($('#eresultline'), `sınav takvimi yüklenemedi (${e.message})`, { error: true });
  }
  renderExams();
}

function renderExams() {
  if (!state.exams) return;
  const q = fold($('#eq').value.trim());
  const type = $('#f-etype').value;
  const bld = $('#f-building').value;
  const terms = q ? q.split(/\s+/) : [];

  const hits = state.exams.exams.filter((e, i) => {
    if (type && e.type !== type) return false;
    if (bld && buildingOf(e.place) !== bld) return false;
    return terms.every((t) => state.examHay[i].includes(t));
  });

  $('#eresultline').innerHTML = state.exams.exams.length
    ? `<b>${hits.length}</b> / ${state.exams.exams.length} sınav · ${esc(state.exams.term || '')}`
    : 'Bu dönem için sınav takvimi henüz ilan edilmemiş.';

  const rows = fillRows($('#erows'), hits.slice(0, 400), (e) => `
    <tr><td class="crn">${esc(e.crn)}</td>
        <td class="code"><button type="button" class="row-toggle x-detail" data-code="${esc(e.code)}"><b>${esc(e.code)}</b></button></td>
        <td>${esc(e.name)}</td>
        <td>${esc(e.instructor || '—')}</td>
        <td>${esc(e.type)}</td>
        <td class="when">${esc(e.place || '—')}</td>
        <td>${esc(e.date)}</td>
        <td class="when">${esc(e.day)} ${esc(e.time)}</td></tr>`,
  { empty: 'eşleşen sınav yok', colspan: 8 });
  if (rows) {
    rows.forEach((tr) => {
      const b = tr.querySelector('.x-detail');
      if (b) b.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: b.dataset.code, source: 'sinavlar' } }));
      });
    });
  }
}
