// Sınavlar görünümü: aktif dönemin sınav takvimini ders/bina/tür üzerinden
// arar. Bina filtresi yer alanından çıkarılır (yeni kazıma yok).

import { $, getJSON, esc, fold, debounce, buildingOf, setStatus, downloadICS, parseTurkishDate } from '../core/utils.js?v=f55dd720fb58';
import { state } from '../core/store.js?v=f55dd720fb58';
import { fillRows } from '../core/table.js?v=f55dd720fb58';
import { toast } from '../core/toast.js?v=f55dd720fb58';
import { readLocalState, writeLocalState, isPlainObject } from '../core/persistence.js?v=f55dd720fb58';

let inited = false;
let currentHits = []; // son filtre sonucu — .ics dışa aktarımı için
// Sınav listesi sayfalama: 400'lük tavan yerine "daha fazla" ile artar.
let examsShown = 400;

function examPreference() {
  const params = new URLSearchParams(location.search);
  const keys = ['eq', 'etype', 'building', 'ebranch'];
  const explicit = location.hash === '#sinavlar' && keys.some((key) => params.has(key));
  const pref = explicit ? {} : readLocalState('itu-exam-filters', { fallback: {}, validate: isPlainObject });
  const saved = { eq: pref.q, etype: pref.type, building: pref.building, ebranch: pref.branch };
  const value = (key) => params.has(key) ? params.get(key) : (saved[key] || '');
  return { q: value('eq'), type: value('etype'), building: value('building'), branch: value('ebranch') };
}

function saveExamPreference() {
  const data = {
    q: $('#eq').value.trim(), type: $('#f-etype').value,
    building: $('#f-building').value, branch: $('#f-ebranch').value,
  };
  writeLocalState('itu-exam-filters', data, { validate: isPlainObject });
  const p = new URLSearchParams();
  if (data.q) p.set('eq', data.q);
  if (data.type) p.set('etype', data.type);
  if (data.building) p.set('building', data.building);
  if (data.branch) p.set('ebranch', data.branch);
  history.replaceState(null, '', `${location.pathname}${p.size ? `?${p}` : ''}#sinavlar`);
}

export function initExams() {
  if (inited) return;
  $('#eq').value = examPreference().q;
  // DOM Event nesnesini `append` bayrağı sanmamak için çağrıyı sar. Aksi halde
  // input/change kaynaklı filtreler URL'ye ve yerel tercihlere hiç yazılmıyordu.
  $('#eq').addEventListener('input', saveExamPreference);
  $('#eq').addEventListener('input', debounce(() => renderExams(true), 120));
  for (const control of [$('#f-etype'), $('#f-building'), $('#f-ebranch')]) {
    control.addEventListener('change', () => {
      saveExamPreference();
      renderExams(true);
    });
  }
  const ics = $('#e-ics');
  if (ics) ics.addEventListener('click', exportExamsICS);
  const emore = $('#emore');
  if (emore) emore.addEventListener('click', () => { examsShown += 200; renderExams(true); });
  inited = true;
}

export function onShow() {
  initExams();
  // Hash/query navigasyonu uygulama yüklenirken gerçekleşmiş olsa bile görünüm
  // açıldığında en güncel URL/yerel tercihi forma geri uygula.
  const pref = examPreference();
  $('#eq').value = pref.q;
  $('#f-etype').value = pref.type;
  $('#f-building').value = pref.building;
  $('#f-ebranch').value = pref.branch;
  if (!state.exams && state.index) loadExams();
  else if (state.exams) renderExams(true);
}

async function loadExams() {
  setStatus($('#eresultline'), 'yükleniyor…', { busy: true });
  try {
    // Silinen bir önceki dönem dosyası CDN'de günlerce 200 dönebilir. Her veri
    // taramasında değişen sorgu, eski cache anahtarını kullanmamamızı sağlar.
    const revision = encodeURIComponent(state.index.scrapedAt || state.index.currentSlug);
    const [sched, termRows] = await Promise.all([
      getJSON(`data/exams/${state.index.currentSlug}.json?v=${revision}`),
      getJSON(`data/terms/${state.index.currentSlug}/search.json`),
    ]);
    // OBS'nin sınav servisi dönem parametresi kabul etmiyor ve yeni takvim
    // açıklanana kadar geçen dönemin sınavlarını döndürebiliyor. Dosya yanlış
    // dönem adıyla cache'lenmiş olsa bile CRN örtüşmesi bunu yakalar.
    if (!examScheduleMatchesTerm(sched, termRows, state.index.currentSlug)) {
      state.exams = {
        term: state.index.currentTerm,
        slug: state.index.currentSlug,
        exams: [],
      };
      state.examHay = [];
      renderExams();
      return;
    }
    state.exams = sched;
    state.examHay = sched.exams.map((e) => fold(`${e.crn} ${e.code} ${e.name} ${e.instructor}`));
    const types = [...new Set(sched.exams.map((e) => e.type))].sort();
    $('#f-etype').innerHTML = '<option value="">hepsi</option>' +
      types.map((t) => `<option>${esc(t)}</option>`).join('');

    const buildings = [...new Set(sched.exams.map((e) => buildingOf(e.place)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    $('#f-building').innerHTML = '<option value="">hepsi</option>' +
      buildings.map((b) => `<option>${esc(b)}</option>`).join('');
    // Faz B (G9): branş filtresi — e.branch veride vardı, şimdi kullanılıyor.
    const branches = [...new Set(sched.exams.map((e) => e.branch).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    $('#f-ebranch').innerHTML = '<option value="">hepsi</option>' +
      branches.map((b) => `<option>${esc(b)}</option>`).join('');
    const pref = examPreference();
    if ([...$('#f-etype').options].some((o) => o.value === pref.type)) $('#f-etype').value = pref.type;
    if ([...$('#f-building').options].some((o) => o.value === pref.building)) $('#f-building').value = pref.building;
    if ([...$('#f-ebranch').options].some((o) => o.value === pref.branch)) $('#f-ebranch').value = pref.branch;
  } catch (e) {
    state.exams = {
      term: state.index.currentTerm,
      slug: state.index.currentSlug,
      exams: [],
    };
    state.examHay = [];
    // Aktif dönemin takvimi henüz yoksa 404 olağan bir boş durumdur. Gerçek ağ
    // ve veri hataları ise tanı koyabilmek için görünür kalır.
    if (!/HTTP 404\b/.test(String(e.message || e))) {
      setStatus($('#eresultline'), `sınav takvimi yüklenemedi (${e.message})`, { error: true });
    }
  }
  renderExams();
}

// Gelen sınav listesinin aktif dönemin şubelerine ait olup olmadığını CRN
// örtüşmesiyle doğrular. Doğru sınav takvimi tüm şubeleri kapsamadığından eşik
// %100 değil; kazıyıcıdaki korumayla aynı %40 sınırı kullanılır.
export function examScheduleMatchesTerm(sched, termRows, termSlug, minOverlap = 0.40) {
  const exams = Array.isArray(sched?.exams) ? sched.exams : [];
  if (!exams.length || !Array.isArray(termRows) || !termRows.length) return false;
  const termSections = new Set(termRows.map((row) => {
    const crn = String(row?.[0] || '').trim();
    const code = String(row?.[1] || '').trim().toUpperCase();
    return crn && code ? `${crn}|${code}` : '';
  }).filter(Boolean));
  const matched = exams.reduce((count, exam) => {
    const key = `${String(exam?.crn || '').trim()}|${String(exam?.code || '').trim().toUpperCase()}`;
    return count + (termSections.has(key) ? 1 : 0);
  }, 0);
  const dated = exams.filter((exam) => examDateMatchesTerm(exam?.date, termSlug)).length;
  return matched / exams.length >= minOverlap && dated / exams.length >= 0.80;
}

// Akademik dönem için makul sınav tarih aralığı. Bu özellikle Güz etiketiyle
// cache'lenmiş Ağustos Yaz finallerini ayırır; tarih sınırları final/mazeret
// haftalarına pay bırakacak kadar geniş tutulur.
export function examDateMatchesTerm(value, termSlug) {
  const match = String(termSlug || '').match(/^(\d{4})-(\d{4})-(guz|bahar|yaz)$/);
  const date = parseTurkishDate(value);
  if (!match || !date) return false;
  const firstYear = Number(match[1]);
  const secondYear = Number(match[2]);
  let start;
  let end;
  if (match[3] === 'guz') {
    start = new Date(firstYear, 8, 1);  // 1 Eylül
    end = new Date(secondYear, 2, 1);  // 1 Mart (hariç)
  } else if (match[3] === 'bahar') {
    start = new Date(secondYear, 1, 1); // 1 Şubat
    end = new Date(secondYear, 7, 1);   // 1 Ağustos (hariç)
  } else {
    start = new Date(secondYear, 5, 1); // 1 Haziran
    end = new Date(secondYear, 9, 1);   // 1 Ekim (hariç)
  }
  return date >= start && date < end;
}

function renderExams(append) {
  // Filtre tercihi veri isteğinden bağımsız kaydedilir. Kullanıcı sınav verisi
  // yüklenmeden yazıp başka sekmeye geçerse de arama kaybolmamalı.
  if (!append) saveExamPreference();
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
    ? `<b>${hits.length}</b> / ${state.exams.exams.length} sınav · ${esc(state.exams.term || '')}`
    : 'Bu dönem için sınav takvimi henüz ilan edilmemiş.';
  if (!showPlace && hits.length) {
    resultLine += ' · yer: İlgili Bölümce Açıklanacak';
  }
  $('#eresultline').innerHTML = resultLine;

  const rows = fillRows($('#erows'), hits.slice(0, examsShown), (e) => `
    <tr><td class="crn" data-label="CRN">${esc(e.crn)}</td>
        <td class="code" data-label="Ders"><button type="button" class="row-toggle x-detail" data-code="${esc(e.code)}"><b>${esc(e.code)}</b></button></td>
        <td data-label="Adı">${esc(e.name)}</td>
        <td data-label="Akademisyen">${esc(e.instructor || '·')}</td>
        <td data-label="Tür">${esc(e.type)}</td>
        ${showPlace ? `<td class="when yer-col" data-label="Yer">${esc(e.place || '·')}</td>` : ''}
        <td data-label="Tarih">${esc(e.date)}</td>
        <td class="when" data-label="Saat">${esc(e.day)} ${esc(e.time)}</td></tr>`,
  { empty: 'eşleşen sınav yok', colspan: showPlace ? 8 : 7 });
  const emore = $('#emore');
  if (emore) {
    emore.hidden = hits.length <= examsShown;
    emore.textContent = `daha fazla göster (${hits.length - examsShown} kaldı)`;
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
  if (!currentHits.length) { toast('Sınav yok', { kind: 'warn' }); return; }
  const events = currentHits.map(examToIcs).filter(Boolean);
  downloadICS(`itu-final-${state.index.currentSlug}.ics`, events);
  toast(`${events.length} sınav .ics'e aktarıldı`);
}
