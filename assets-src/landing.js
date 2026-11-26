// İniş (araç) sayfalarının ortak davranışı: ilk ekrandaki birincil uygulama
// düğmesi görünümden çıkınca mobilde (<760px, CSS) alttaki yapışkan çubuğu
// açar. internal/site/landing_shell.go'nun ürettiği işaretlemeyle çalışır:
// [data-lp-top] (gözlenen düğme) ve [data-lp-sticky] (çubuk). Modül değil,
// bağımlılığı yok; JS kapalıyken çubuk hiç görünmez.
(function () {
  'use strict';
  var top = document.querySelector('[data-lp-top]');
  var bar = document.querySelector('[data-lp-sticky]');
  if (!top || !bar || !('IntersectionObserver' in window)) return;
  var link = bar.querySelector('a');
  bar.hidden = false;
  bar.classList.add('is-on');
  bar.setAttribute('aria-hidden', 'true');
  document.body.classList.add('lp-has-sticky');
  new IntersectionObserver(function (entries) {
    var e = entries[entries.length - 1];
    var show = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle('is-shown', show);
    bar.setAttribute('aria-hidden', String(!show));
    if (link) link.tabIndex = show ? 0 : -1;
  }).observe(top);
})();
