// /gano-hesaplama/ iniş sayfasındaki satır içi YANO/GANO hesaplayıcısı.
// İşaretleme sunucuda tam üretilir (internal/site/landing_gano.go); bu modül
// yalnızca etkileşim ekler. Not katsayıları tek kaynaktan, core/grades.js'ten
// gelir. Arayüz metinleri formun data-* özniteliklerinden okunur, böylece aynı
// dosya TR ve EN sayfasında çalışır.
import { GRADE_POINTS } from '../core/grades.js';

const form = document.getElementById('lpg-form');
if (form) init(form);

function init(form) {
  const $ = (sel, root = form) => root.querySelector(sel);
  const body = $('#lpg-rows');
  const t = form.dataset;
  const grades = Object.keys(GRADE_POINTS);
  let rid = body.rows.length;

  const num = (v) => {
    const s = String(v == null ? '' : v).trim().replace(',', '.');
    if (!s) return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };
  const fmt = (v) => String(Math.round(v * 100) / 100);

  function el(tag, attrs, kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
    }
    for (const k of kids || []) e.append(k);
    return e;
  }

  function newRow() {
    const id = ++rid;
    const tr = el('tr');
    const cell = (cls, label, ctrl) => el('td', { class: cls }, [el('label', { class: 'sr-only', for: ctrl.id, text: label }), ctrl]);
    tr.append(
      cell('lpg-c-nm', t.course, el('input', { id: 'lpg-n' + id, class: 'lpg-in lpg-nm', placeholder: t.phCourse, autocomplete: 'off' })),
      cell('lpg-c-cr', t.credits, el('input', { id: 'lpg-c' + id, class: 'lpg-in lpg-num lpg-cr', inputmode: 'decimal', placeholder: t.phCr, autocomplete: 'off' })),
      cell('lpg-c-gr', t.grade, el('select', { id: 'lpg-g' + id, class: 'lpg-in lpg-gr' },
        grades.map((g) => { const o = el('option', { value: g, text: g }); if (g === 'BB') o.selected = true; return o; }))),
      el('td', { class: 'lpg-c-pt lpg-pt', text: '·' }),
    );
    const rm = el('button', { type: 'button', class: 'lpg-rm', 'aria-label': t.remove });
    rm.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    tr.append(el('td', { class: 'lpg-c-rm' }, [rm]));
    return tr;
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
    for (const tr of body.rows) {
      const cr = num($('.lpg-cr', tr).value);
      const g = GRADE_POINTS[$('.lpg-gr', tr).value];
      const ok = cr > 0 && g !== undefined;
      $('.lpg-pt', tr).textContent = ok ? (cr * g).toFixed(2) : '·';
      $('.lpg-cr', tr).setAttribute('aria-invalid', $('.lpg-cr', tr).value.trim() && !(cr > 0) ? 'true' : 'false');
      if (ok) { P += cr * g; C += cr; }
    }
    const y = C ? P / C : 0;
    $('#lpg-yano').textContent = y.toFixed(2);
    $('#lpg-yano-bar').style.width = (y / 4 * 100).toFixed(1) + '%';
    const sub = $('#lpg-yano-sub');
    sub.replaceChildren(el('b', { text: fmt(P) }), ` ${t.pts} ÷ `, el('b', { text: fmt(C) }), ` ${t.cr}`);

    const pgIn = $('#lpg-prev-g'), pcIn = $('#lpg-prev-c');
    const pg = num(pgIn.value), pc = num(pcIn.value);
    const pgOk = pg >= 0 && pg <= 4;
    const has = pgOk && pc > 0;
    const g = has ? (pg * pc + P) / (pc + C) : y;
    $('#lpg-gano').textContent = g.toFixed(2);
    const gsub = $('#lpg-gano-sub');
    if (has) {
      gsub.replaceChildren(`(${pg.toFixed(2)} × ${fmt(pc)} + ${fmt(P)}) ÷ `, el('b', { text: fmt(pc + C) }), ` ${t.cr}`);
    } else {
      gsub.textContent = t.noprev;
    }
    pgIn.setAttribute('aria-invalid', pgIn.value.trim() && !pgOk ? 'true' : 'false');
    pcIn.setAttribute('aria-invalid', pcIn.value.trim() && !(pc > 0) ? 'true' : 'false');
  }

  form.addEventListener('input', (e) => { if (body.contains(e.target)) dropExample(); calc(); });
  form.addEventListener('change', calc);
  form.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('.lpg-rm');
    if (!b) return;
    const tr = b.closest('tr');
    const next = tr.nextElementSibling || tr.previousElementSibling;
    tr.remove();
    dropExample();
    if (!body.rows.length) body.append(newRow());
    calc();
    const focus = next && next.isConnected ? next : body.rows[0];
    $('.lpg-rm', focus).focus();
  });
  $('#lpg-add').addEventListener('click', () => {
    const tr = newRow();
    body.append(tr);
    calc();
    $('.lpg-nm', tr).focus();
  });
  $('#lpg-clear').addEventListener('click', () => {
    const tr = newRow();
    body.replaceChildren(tr);
    dropExample();
    calc();
    $('.lpg-nm', tr).focus();
  });
  form.classList.add('lpg-on');
  calc();
}
