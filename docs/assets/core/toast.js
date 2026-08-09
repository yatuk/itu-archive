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
  container.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3100);
}
