// Kaydırma giriş animasyonu: .reveal elemanları görünür alana girince hafif
// fade-up yapar (yalnızca transform/opacity — performans güvenli).
//
// Güvenli düşüş: JS çalışmazsa ya da kullanıcı hareketi azaltmışsa (reduced
// motion) hiçbir şey gizlenmez — body'ye "reveal-ready" sınıfı eklenmedikçe
// .reveal elemanları varsayılan olarak görünürdür.

let io = null;
let ready = false;

export function initReveal(scope = document) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  if (!ready) {
    document.body.classList.add('reveal-ready');
    ready = true;
  }
  const els = scope.querySelectorAll('.reveal:not(.revealed)');
  if (!els.length) return;
  // IntersectionObserver desteklenmiyorsa hiçbir şey gizlenmesin — aksi halde
  // body "reveal-ready" olur, öğeler opacity:0'da kalır ve içerik görünmez
  // (boş ekran — takvim ilk açılışı).
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  }
  els.forEach((el) => {
    // Zaten görünür alandaysa observer'ı beklemeden görünür yap — ilk
    // gösterimde (örn. #takvim sekmesi açılışı) callback gecikebilir,
    // içerik DOM'da durur ama ekranda görünmez.
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh && r.bottom > 0) {
      el.classList.add('revealed');
    } else {
      io.observe(el);
    }
  });
}
