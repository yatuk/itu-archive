// Statik sayfalar (ders/, hoca/, brans/, dersler/, iniş sayfaları) için küçük
// yardımcı: uygulamayla aynı tema düğmeleri ve dil bağlantısı, /hoca/ dizininde
// istemci tarafı arama. Modül değil, bağımlılığı yok; JS kapalıyken sayfalar
// düz liste/bağlantı olarak çalışmaya devam eder.
(function () {
  'use strict';
  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* özel pencere */ }
  }

  // --- tema: app.js#initTheme ile aynı anahtar ve davranış
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.theme-btn'));
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0a0a0a' : '#f4f6f4');
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-theme') === t;
      b.setAttribute('aria-pressed', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'sade');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-theme') === 'dark' ? 'dark' : 'sade';
      applyTheme(t);
      store('itu-theme', t);
    });
  });

  // --- sekme satırı: dar ekranda etkin sekme görünür kalsın (satır yatay kayar)
  var tabs = document.querySelector('.tabs.app-tabs');
  var active = tabs && tabs.querySelector('a[aria-current="true"]');
  if (active && tabs.scrollWidth > tabs.clientWidth) {
    tabs.scrollLeft = active.offsetLeft - (tabs.clientWidth - active.offsetWidth) / 2;
  }

  // --- dil: bağlantı karşı dil sürümüne gider; tercihi uygulama için de sakla
  var lang = document.getElementById('lang-btn');
  if (lang) {
    lang.addEventListener('click', function () {
      var to = lang.getAttribute('data-lang');
      if (to === 'tr' || to === 'en') store('itu-lang', to);
    });
  }

  // --- /hoca/ dizini: ad ve branş süzgeci
  var tools = document.querySelector('[data-hx-tools]');
  if (!tools) return;
  var q = document.getElementById('hx-q');
  var branch = document.getElementById('hx-branch');
  var count = document.getElementById('hx-count');
  var empty = document.getElementById('hx-empty');
  var groups = Array.prototype.slice.call(document.querySelectorAll('.hx-group'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.hx-list li'));
  var total = items.length;
  tools.hidden = false;

  var map = { 'ı': 'i', 'İ': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c', 'â': 'a', 'î': 'i', 'û': 'u' };
  function fold(s) {
    return String(s || '').replace(/[ıİşŞğĞüÜöÖçÇâîû]/g, function (c) { return map[c]; })
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  var params = new URLSearchParams(location.search);
  if (params.get('q')) q.value = params.get('q');
  if (params.get('b')) branch.value = params.get('b');

  var fmt = new Intl.NumberFormat('tr-TR');
  function run() {
    var words = fold(q.value).split(' ').filter(Boolean);
    var br = branch.value;
    var shown = 0;
    items.forEach(function (li) {
      var k = li.getAttribute('data-k') || '';
      var ok = (!br || (' ' + li.getAttribute('data-b') + ' ').indexOf(' ' + br + ' ') !== -1) &&
        words.every(function (w) { return k.indexOf(w) !== -1; });
      li.hidden = !ok;
      if (ok) shown++;
    });
    groups.forEach(function (g) {
      g.hidden = !g.querySelector('li:not([hidden])');
    });
    empty.hidden = shown !== 0;
    count.textContent = shown === total ? fmt.format(total) + ' hoca' : fmt.format(shown) + ' / ' + fmt.format(total) + ' hoca';
    var next = new URLSearchParams(location.search);
    if (q.value.trim()) next.set('q', q.value.trim()); else next.delete('q');
    if (br) next.set('b', br); else next.delete('b');
    var qs = next.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
  var timer = 0;
  q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 80); });
  branch.addEventListener('change', run);
  run();
})();
