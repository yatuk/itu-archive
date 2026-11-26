// /akademik-takvim/ tablosunu bugüne göre canlandırır. Tablo sunucuda eksiksiz
// basılır (internal/site/calendar_tool.go); burada yalnız tarayıcının bugünü
// hesaba katılır: geçmiş satırlar soluklaşır, süren satırlar vurgulanır, durum
// sütununa geri sayım yazılır, "bugün" ayracı eklenir, Şimdi / Sırada şeridi
// yeniden kurulur ve tür süzgeçleri ile arama açılır. Modül değil.
(function () {
  'use strict';
  var table = document.querySelector('[data-lp-cal]');
  if (!table) return;
  var tbody = table.tBodies[0];
  var DAY = 864e5;
  var WD = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var MO = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  function parse(s) { var p = s.split('-'); return new Date(+p[0], p[1] - 1, +p[2]); }
  function days(a, b) { return Math.round((b - a) / DAY); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function lc(s) { return String(s).toLocaleLowerCase('tr'); }

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var todayLabel = today.getDate() + ' ' + MO[today.getMonth()] + ' ' + today.getFullYear() + ' ' + WD[today.getDay()];

  var rows = Array.prototype.map.call(tbody.querySelectorAll('tr[data-s]'), function (tr) {
    var ev = tr.querySelector('.lp-cal-ev');
    var S = parse(tr.getAttribute('data-s')), E = parse(tr.getAttribute('data-e'));
    var state = E < today ? 'past' : S <= today ? 'ongoing' : 'future';
    return {
      tr: tr, S: S, E: E, state: state,
      kinds: (tr.getAttribute('data-k') || '').split(' ').filter(Boolean),
      date: tr.querySelector('.lp-cal-dt').textContent,
      short: ev.firstChild ? ev.firstChild.textContent : ev.textContent,
      full: ev.getAttribute('title') || (ev.firstChild ? ev.firstChild.textContent : ev.textContent),
      text: lc((ev.getAttribute('title') || '') + ' ' + ev.textContent + ' ' + tr.querySelector('.lp-cal-dt').textContent),
      month: null
    };
  });
  // Her satırın ay başlığı (tr.lp-cal-mo) — süzgeçte boş kalan ayları gizlemek için.
  var monthOf = [];
  var cur = null;
  Array.prototype.forEach.call(tbody.rows, function (tr) {
    if (tr.classList.contains('lp-cal-mo')) cur = tr;
    else if (tr.hasAttribute('data-s')) monthOf.push(cur);
  });
  rows.forEach(function (r, i) { r.month = monthOf[i]; });

  function stateHTML(r) {
    if (r.state === 'past') return '<span class="lp-pill lp-pill-past">geçti</span>';
    if (r.state === 'ongoing') {
      var left = days(today, r.E);
      return '<span class="lp-pill lp-pill-now">sürüyor</span>' + (left > 0 ? '<span class="lp-cd">' + left + ' gün daha</span>' : '');
    }
    var n = days(today, r.S);
    return '<span class="lp-pill ' + (n <= 14 ? 'lp-pill-soon' : 'lp-pill-ok') + '">' + (n === 1 ? 'yarın' : n + ' gün kaldı') + '</span>';
  }

  // Satır durumları ve bugün ayracı.
  rows.forEach(function (r) {
    r.tr.classList.add('is-' + r.state);
    r.tr.querySelector('.lp-cal-st').innerHTML = stateHTML(r);
  });
  table.classList.add('is-live');
  var todayRow = document.createElement('tr');
  todayRow.className = 'lp-cal-today';
  todayRow.setAttribute('data-lp-cal-today-row', '');
  todayRow.innerHTML = '<td colspan="3"><div class="lp-cal-today-line"><span class="lp-pill lp-pill-now">BUGÜN</span><span>' + esc(todayLabel) + '</span></div></td>';
  var tm = today.getFullYear() * 12 + today.getMonth();

  function placeToday(visible) {
    if (todayRow.parentNode) todayRow.parentNode.removeChild(todayRow);
    if (!visible.length) return;
    var first = null;
    for (var i = 0; i < visible.length; i++) if (visible[i].state === 'future') { first = visible[i]; break; }
    if (!first) { tbody.appendChild(todayRow); return; }
    var anchor = first.tr;
    // İlk gelecek satır ayının ilk satırıysa ve bugün daha önceki bir aydaysa,
    // ayraç ay başlığının üstüne gelir.
    var m = first.S.getFullYear() * 12 + first.S.getMonth();
    var prev = anchor.previousElementSibling;
    while (prev && prev.hidden) prev = prev.previousElementSibling;
    if (prev && prev.classList.contains('lp-cal-mo') && tm < m) anchor = prev;
    tbody.insertBefore(todayRow, anchor);
  }

  // Şimdi / Sırada şeridi.
  var nowBox = document.querySelector('[data-lp-cal-now]');
  if (nowBox) {
    var lbl = nowBox.querySelector('[data-lp-cal-today]');
    if (lbl) lbl.textContent = todayLabel;
    var on = rows.filter(function (r) { return r.state === 'ongoing'; });
    var ongoing = nowBox.querySelector('[data-lp-cal-ongoing]');
    ongoing.innerHTML = on.map(function (r) {
      var tot = days(r.S, r.E) + 1, done = days(r.S, today) + 1, left = days(today, r.E);
      return '<div class="lp-cal-item"><b title="' + esc(r.full) + '">' + esc(r.short) + '</b><span class="lp-cal-d">' + esc(r.date) +
        (left > 0 ? ' · ' + left + ' gün daha' : ' · bugün bitiyor') + '</span><div class="lp-cal-prog" aria-hidden="true"><i style="width:' +
        Math.round(done / tot * 100) + '%"></i></div></div>';
    }).join('') || '<div class="lp-cal-item"><span class="lp-cal-d">Bugün süren etkinlik yok.</span></div>';
    var nx = rows.filter(function (r) { return r.state === 'future'; }).slice(0, 4);
    nowBox.querySelector('[data-lp-cal-next]').innerHTML = nx.map(function (r) {
      var n = days(today, r.S);
      return '<li><span class="lp-cal-d">' + esc(r.date) + '</span><span class="lp-cal-t" title="' + esc(r.full) + '">' + esc(r.short) +
        '</span><span class="lp-cd">' + (n === 1 ? 'yarın' : n + ' gün kaldı') + '</span></li>';
    }).join('') || '<li><span class="lp-cal-t">Bu takvimde yaklaşan tarih yok.</span></li>';
  }

  // Süzgeçler ve arama.
  var tools = document.querySelector('[data-lp-cal-tools]');
  var meta = document.querySelector('[data-lp-cal-meta]');
  var q = tools && tools.querySelector('[data-lp-cal-q]');
  var kind = 'all';
  var emptyRow = document.createElement('tr');
  emptyRow.innerHTML = '<td colspan="3" class="lp-empty">Bu süzgeçle etkinlik yok.</td>';

  function apply() {
    var words = q ? lc(q.value.trim()).split(/\s+/).filter(Boolean) : [];
    var visible = [];
    var perMonth = new Map();
    rows.forEach(function (r) {
      var ok = (kind === 'all' || r.kinds.indexOf(kind) !== -1) &&
        words.every(function (w) { return r.text.indexOf(w) !== -1; });
      r.tr.hidden = !ok;
      if (ok) { visible.push(r); perMonth.set(r.month, (perMonth.get(r.month) || 0) + 1); }
    });
    Array.prototype.forEach.call(tbody.querySelectorAll('tr.lp-cal-mo'), function (m) {
      var n = perMonth.get(m) || 0;
      m.hidden = n === 0;
      var c = m.querySelector('.lp-cal-c');
      if (c) c.textContent = n;
    });
    placeToday(visible);
    if (emptyRow.parentNode) emptyRow.parentNode.removeChild(emptyRow);
    if (!visible.length) tbody.appendChild(emptyRow);
    if (meta) {
      var fut = visible.filter(function (r) { return r.state !== 'past'; }).length;
      meta.textContent = visible.length + ' etkinlik · ' + (visible.length - fut) + ' geçti · ' + fut + ' sürüyor veya yaklaşıyor';
    }
  }

  if (tools) {
    tools.hidden = false;
    tools.addEventListener('click', function (e) {
      var b = e.target.closest('.lp-chip');
      if (!b) return;
      kind = b.getAttribute('data-k');
      Array.prototype.forEach.call(tools.querySelectorAll('.lp-chip'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      apply();
    });
    if (q) q.addEventListener('input', apply);
  }
  apply();
})();
