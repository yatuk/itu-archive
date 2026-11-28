// /gano-hesaplama/ iniş sayfasındaki satır içi YANO/GANO hesaplayıcısı.
// İşaretleme sunucuda tam üretilir (internal/site/landing_gano.go); bu modül
// yalnızca etkileşim ekler. Not katsayıları tek kaynaktan, core/grades.js'ten;
// harf notu seçicisi core/grade-picker.js'ten gelir (Müfredat ve GPA sekmesi
// de aynı seçiciyi kullanır). Arayüz metinleri formun data-* özniteliklerinden
// okunur, böylece aynı dosya TR ve EN sayfasında çalışır.
import { GRADE_POINTS } from '../core/grades.js';
import { gradePickerHTML, gradePickerValue, bindGradePickers } from '../core/grade-picker.js';

const form = document.getElementById('lpg-form');
if (form) init(form);

const CR_MAX = 30;

function init(form) {
  const $ = (sel, root = form) => root.querySelector(sel);
  const body = $('#lpg-rows');
  const t = form.dataset;
  const rowsOf = () => [...body.querySelectorAll('.lpg-row')];
  let rid = rowsOf().length;

  const num = (v) => {
    const s = String(v == null ? '' : v).trim().replace(',', '.');
    if (!s) return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };
  const fmt = (v) => String(Math.round(v * 100) / 100);
  const gradeLabel = (name) => (name ? t.gradeOf.replace('%s', name) : t.grade);

  function el(tag, attrs, kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
    }
    for (const k of kids || []) e.append(k);
    return e;
  }

  const X_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  function newRow() {
    const id = ++rid;
    const row = el('div', { class: 'lpg-row' });
    const nmId = 'lpg-n' + id, crId = 'lpg-c' + id;
    row.append(
      el('div', { class: 'lpg-c-nm' }, [
        el('label', { class: 'sr-only', for: nmId, text: t.course }),
        el('input', { id: nmId, class: 'lpg-in lpg-nm', placeholder: t.phCourse, autocomplete: 'off' }),
      ]),
      el('div', { class: 'lpg-step' }, [
        el('button', { type: 'button', class: 'lpg-sb', 'data-d': '-1', 'aria-label': t.crDown, 'aria-controls': crId, text: '−' }),
        el('label', { class: 'sr-only', for: crId, text: t.credits }),
        el('input', { id: crId, class: 'lpg-in lpg-num lpg-cr', inputmode: 'decimal', placeholder: t.phCr, autocomplete: 'off' }),
        el('button', { type: 'button', class: 'lpg-sb', 'data-d': '1', 'aria-label': t.crUp, 'aria-controls': crId, text: '+' }),
      ]),
    );
    row.insertAdjacentHTML('beforeend', gradePickerHTML({ cls: 'lpg-gp', value: 'BB', label: gradeLabel('') }));
    const rm = el('button', { type: 'button', class: 'lpg-rm', 'aria-label': t.remove });
    rm.innerHTML = X_SVG;
    row.append(rm);
    return row;
  }

  // Örnek satırlar değiştiği an "örnek" rozeti ve açıklaması kalkar.
  function dropExample() {
    for (const id of ['lpg-ex', 'lpg-ex-note']) {
      const e = document.getElementById(id);
      if (e) e.hidden = true;
    }
  }

  function calc() {
    let P = 0, C = 0;
    for (const row of rowsOf()) {
      const crIn = $('.lpg-cr', row);
      const cr = num(crIn.value);
      const g = GRADE_POINTS[gradePickerValue($('.lpg-gp', row))];
      crIn.setAttribute('aria-invalid', crIn.value.trim() && !(cr > 0) ? 'true' : 'false');
      if (cr > 0 && g !== undefined) { P += cr * g; C += cr; }
    }
    const y = C ? P / C : 0;
    $('#lpg-yano').textContent = y.toFixed(2);
    $('#lpg-tcr').textContent = fmt(C);
    $('#lpg-yano-sub').replaceChildren(el('b', { text: fmt(P) }), ` ${t.pts} ÷ `, el('b', { text: fmt(C) }), ` ${t.cr}`);

    const pgIn = $('#lpg-prev-g'), pcIn = $('#lpg-prev-c');
    const pg = num(pgIn.value), pc = num(pcIn.value);
    const pgOk = pg >= 0 && pg <= 4;
    const has = pgOk && pc > 0;
    const g = has ? (pg * pc + P) / (pc + C) : y;
    $('#lpg-gano').textContent = g.toFixed(2);
    $('#lpg-allcr').textContent = fmt(has ? pc + C : C);
    const gsub = $('#lpg-gano-sub');
    if (has) {
      gsub.replaceChildren(`(${pg.toFixed(2)} × ${fmt(pc)} + ${fmt(P)}) ÷ `, el('b', { text: fmt(pc + C) }), ` ${t.cr}`);
    } else {
      gsub.textContent = t.noprev;
    }
    // Fark satırı: iki ondalıkta gösterilen değerler üzerinden (ekrandaki
    // sayılarla tutarlı); işaret ve ok rengin yanında ikinci göstergedir.
    const delta = $('#lpg-delta');
    if (has) {
      const d = Math.round(g * 100) / 100 - Math.round(pg * 100) / 100;
      const dir = d > 0.0001 ? 'up' : d < -0.0001 ? 'down' : 'flat';
      const sign = dir === 'up' ? '+' : dir === 'down' ? '−' : '±';
      const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';
      delta.className = `lpg-delta lpg-${dir}`;
      delta.replaceChildren(
        ...(arrow ? [el('span', { 'aria-hidden': 'true', text: arrow + ' ' })] : []),
        el('b', { text: sign + Math.abs(d).toFixed(2) }), ` ${t.delta}`);
      delta.hidden = false;
    } else {
      delta.hidden = true;
    }
    pgIn.setAttribute('aria-invalid', pgIn.value.trim() && !pgOk ? 'true' : 'false');
    pcIn.setAttribute('aria-invalid', pcIn.value.trim() && !(pc > 0) ? 'true' : 'false');
  }

  bindGradePickers(body, { onPick: () => { dropExample(); calc(); } });

  form.addEventListener('input', (e) => {
    if (body.contains(e.target)) {
      dropExample();
      // Ders adı seçicinin erişilebilir adına yansır: "MAT 101 harf notu".
      if (e.target.classList.contains('lpg-nm')) {
        const gp = $('.lpg-gp', e.target.closest('.lpg-row'));
        if (gp) gp.setAttribute('aria-label', gradeLabel(e.target.value.trim()));
      }
    }
    calc();
  });
  form.addEventListener('change', calc);
  form.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
  body.addEventListener('click', (e) => {
    const step = e.target.closest('.lpg-sb');
    if (step) {
      const input = $('.lpg-cr', step.closest('.lpg-step'));
      const cur = num(input.value);
      const base = Number.isFinite(cur) ? cur : 0;
      // Buçuklu kredi (3.5) korunur; adım 1, aralık 0–30.
      const next = Math.min(CR_MAX, Math.max(0, Math.round((base + Number(step.dataset.d)) * 100) / 100));
      input.value = fmt(next);
      dropExample();
      calc();
      return;
    }
    const b = e.target.closest('.lpg-rm');
    if (!b) return;
    const row = b.closest('.lpg-row');
    const next = row.nextElementSibling || row.previousElementSibling;
    row.remove();
    dropExample();
    if (!rowsOf().length) body.append(newRow());
    calc();
    const focus = next && next.isConnected ? next : rowsOf()[0];
    $('.lpg-rm', focus).focus();
  });
  $('#lpg-add').addEventListener('click', () => {
    const row = newRow();
    body.append(row);
    calc();
    $('.lpg-nm', row).focus();
  });
  $('#lpg-clear').addEventListener('click', () => {
    const row = newRow();
    body.replaceChildren(row);
    dropExample();
    calc();
    $('.lpg-nm', row).focus();
  });
  form.classList.add('lpg-on');
  calc();
}
