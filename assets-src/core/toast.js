// Minimal bildirim (toast): sağ üstte kayıp giden kartlar. Tema token'larından
// beslenir; reduced-motion'da animasyonsuz gösterilir.
let container = null;

export function toast(msg, opts = {}) {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toasts';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (opts.kind ? ` toast-${opts.kind}` : '');
  el.textContent = msg;
  // İsteğe bağlı aksiyon butonu ("geri al" gibi) — toast ömrü boyunca canlı.
  if (opts.action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-action';
    btn.textContent = opts.action.label;
    btn.addEventListener('click', () => {
      opts.action.fn();
      el.remove();
    });
    el.appendChild(btn);
  }
  container.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3100);
}
