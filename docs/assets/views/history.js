// Geçmiş görünümü: 27 dönemin birleştirilmiş kaydında ders/hoca arama, ders
// bazlı dönem geçmişi (trend grafiği dahil) ve hoca bazlı ders listesi.

import { $, getJSON, esc, normSearch, searchMatch, debounce, termLabel, setStatus } from '../core/utils.js';
import { state } from '../core/store.js';
import { fillBar, trendChart } from '../core/chart.js';
import { fillRows } from '../core/table.js';
import { initReveal } from '../core/reveal.js';
import { I18N } from '../i18n.js';

let inited = false;

export function initHistory() {
  if (inited) return;
  $('#hq').addEventListener('input', debounce(searchHistory, 140));
  inited = true;
}

export function onShow() {
  initHistory();
  if (!state.hist) searchHistory();
}

async function loadHistory() {
  if (state.hist) return;
  try {
    const [codes, names] = await Promise.all([
      getJSON('data/history/codes.json'),
      getJSON('data/history/names.json'),
    ]);
    // Arama metinlerini bir kez katlayıp boşluksuz anahtarlara indiriyoruz
    // (Dersler sekmesiyle ortak normSearch — "BLG 102E" ≡ "BLG102E").
    state.hist = {
      codes, names,
      codeHay: codes.map((c) => normSearch(`${c[0]} ${c[1]}`)),
      nameHay: names.map((n) => normSearch(n[0])),
    };
  } catch (e) {
    setStatus($('#hresultline'), I18N.t('histLoadFail', { msg: e.message }), { error: true });
  }
}

// Geçmiş sekmesine dışarıdan (örn. detay panelinden) arama yaptırmak için dışa açık.
export async function searchHistory() {
  await loadHistory();
  if (!state.hist) return;
  const q = normSearch($('#hq').value.trim());
  const box = $('#hmatches');
  $('#hdetail').innerHTML = '';

  if (q.length < 2) {
    box.innerHTML = discoveryHtml();
    const nf = I18N.lang === 'en' ? 'en' : 'tr';
    $('#hresultline').innerHTML =
      `<b>${state.hist.codes.length.toLocaleString(nf)}</b> ${esc(I18N.t('histCourses'))} · ` +
      `<b>${state.hist.names.length.toLocaleString(nf)}</b> ${esc(I18N.t('histInstrIndexed'))}`;
    for (const b of box.querySelectorAll('.chip')) {
      b.addEventListener('click', () => b.dataset.kind === 'course'
        ? showCourse(b.dataset.key, b.dataset.branch)
        : showPerson(b.dataset.key, b.dataset.bucket));
    }
    return;
  }

  const courses = [];
  state.hist.codeHay.forEach((h, i) => { if (courses.length < 40 && searchMatch(q, h)) courses.push(state.hist.codes[i]); });
  const people = [];
  state.hist.nameHay.forEach((h, i) => { if (people.length < 40 && searchMatch(q, h)) people.push(state.hist.names[i]); });

  $('#hresultline').innerHTML = I18N.t('histMatched', { c: `<b>${courses.length}</b>`, p: `<b>${people.length}</b>` });

  let html = '';
  if (courses.length) {
    html += `<h3 class="mh">${esc(I18N.t('histCoursesHead'))}</h3><div class="chips">` + courses.map((c) =>
      `<button class="chip" data-kind="course" data-key="${esc(c[0])}" data-branch="${esc(c[2])}">
         <b>${esc(c[0])}</b><span>${esc(c[1])}</span><em>${esc(I18N.t('histTermCount', { n: c[3] }))}</em></button>`).join('') + '</div>';
  }
  if (people.length) {
    html += `<h3 class="mh">${esc(I18N.t('histInstrHead'))}</h3><div class="chips">` + people.map((n) =>
      `<button class="chip" data-kind="person" data-key="${esc(n[0])}" data-bucket="${esc(n[1])}">
         <b>${esc(n[0])}</b><em>${esc(I18N.t('histTermCount', { n: n[2] }))} · ${esc(I18N.t('histSecCount', { n: n[3] }))}</em></button>`).join('') + '</div>';
  }
  box.innerHTML = html || `<p class="empty">${esc(I18N.t('emptyRow'))}</p>`;

  for (const b of box.querySelectorAll('.chip')) {
    b.addEventListener('click', () => b.dataset.kind === 'course'
      ? showCourse(b.dataset.key, b.dataset.branch)
      : showPerson(b.dataset.key, b.dataset.bucket));
  }
}

// Bir diziyi sayısal alana göre azalan sırayla sıralayıp ilk n öğeyi döner.
// Eşitlikte ad alfabetik (deterministik — her taramada aynı sıra, diff gürültüsü
// olmaz). Saf — test edilebilir.
export function topByCount(arr, countIdx, n) {
  return arr.slice().sort((a, b) => {
    const d = (b[countIdx] || 0) - (a[countIdx] || 0);
    return d !== 0 ? d : String(a[0]).localeCompare(String(b[0]), 'tr');
  }).slice(0, n);
}

// Boş sorguda keşif kısayolları (P1-12): ne arayacağını bilmeyene başlangıç
// noktası. Kartlar doğrudan ilgili geçmişe gider (ders veya hoca); alt satır
// sıralama ölçütünü gösterir — shard/harf değil.
function discoveryHtml() {
  const h = state.hist;
  if (!h) return '';
  const topCourses = topByCount(h.codes, 3, 6);
  const topPeople = topByCount(h.names, 3, 6);
  if (!topCourses.length && !topPeople.length) return '';
  const courseChips = topCourses.length
    ? `<h3 class="h-disc">${esc(I18N.t('histTopCourses'))}</h3><div class="chips">` +
      topCourses.map((c) => `<button class="chip" data-kind="course" data-key="${esc(c[0])}" data-branch="${esc(c[2])}">
        <b>${esc(c[0])}</b><span>${esc(c[1])} · ${esc(I18N.t('histTermCount', { n: c[3] }))}</span></button>`).join('') + '</div>'
    : '';
  const personChips = topPeople.length
    ? `<h3 class="h-disc">${esc(I18N.t('histTopInstr'))}</h3><div class="chips">` +
      topPeople.map((n) => `<button class="chip" data-kind="person" data-key="${esc(n[0])}" data-bucket="${esc(n[1])}">
        <b>${esc(n[0])}</b><span>${esc(I18N.t('histSecCount', { n: n[3] }))} · ${esc(I18N.t('histTermCount', { n: n[2] }))}</span></button>`).join('') + '</div>'
    : '';
  return `<p class="h-intro">${esc(I18N.t('histIntro'))}</p>
    ${courseChips}${personChips}`;
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
  const rhythm = [...openIn].map((s) => I18N.seasonName(seasons[s] || s)).join(', ');

  // Dönem sırası yeniden eskiye; her dönemin ilk satırına dönem adını yaz.
  const rows = [];
  for (const [slug, secs] of byTerm) {
    secs.forEach((r, i) => rows.push({ slug, termFirst: i === 0, ...r }));
  }

  $('#hdetail').innerHTML = `
    <article class="hcard reveal">
      <h3>${esc(c.code)} <span>${esc(c.name)}</span></h3>
      <p class="meta">${esc(I18N.t('histOpenedIn', { n: byTerm.size, seasons: rhythm }))}
        <button type="button" class="btn-ghost h-detail" data-code="${esc(c.code)}">${esc(I18N.t('histShowDetail'))}</button></p>
      ${trendChart(byTerm)}
      <div class="tablewrap"><table class="htable" aria-label="${esc(c.code)} ${esc(I18N.t('histTermHistory'))}">
        <thead><tr><th>${esc(I18N.t('filterTerm'))}</th><th>${esc(I18N.t('thInstr'))}</th><th>${esc(I18N.t('filterDay'))}</th><th class="num">${esc(I18N.t('thCap'))}</th><th class="num">${esc(I18N.t('thEnr'))}</th><th class="num">${esc(I18N.t('thFill'))}</th></tr></thead>
        <tbody></tbody>
      </table></div>
    </article>`;
  fillRows($('#hdetail tbody'), rows, (r) => `
    <tr><td>${r.termFirst ? esc(termLabel(r.slug)) : ''}</td>
        <td>${esc(r.instructor || '·')}</td>
        <td class="when">${esc(r.days ? I18N.dayName(r.days) : '·')}</td>
        <td class="num">${r.cap}</td><td class="num">${r.enr}</td>
        <td class="num">${fillBar(r.cap, r.enr)}</td></tr>`);
  const dBtn = $('#hdetail .h-detail');
  if (dBtn) {
    dBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: dBtn.dataset.code, source: 'gecmis' } }));
    });
  }
  initReveal($('#hdetail'));
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
    <article class="hcard reveal">
      <h3>${esc(name)}</h3>
      <p class="meta">${esc(I18N.t('histPersonMeta', { courses: byCourse.size, secs: p.rows.length, terms: p.terms }))}</p>
      <div class="tablewrap"><table class="htable" aria-label="${esc(name)} ${esc(I18N.t('histCourseList'))}">
        <thead><tr><th>${esc(I18N.t('thCode'))}</th><th>${esc(I18N.t('thName'))}</th><th class="num">${esc(I18N.t('histHowManyTerms'))}</th><th>${esc(I18N.t('histTerms'))}</th></tr></thead>
        <tbody></tbody>
      </table></div>
    </article>`;
  fillRows($('#hdetail tbody'), sorted, ([code, v]) => `
    <tr><td><b>${esc(code)}</b></td><td>${esc(v.name)}</td>
        <td class="num">${v.terms.length}</td>
        <td class="when">${esc(v.terms.map(termLabel).join(', '))}</td></tr>`);
  initReveal($('#hdetail'));
  $('#hdetail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
