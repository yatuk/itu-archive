// Stillenmiş onay / metin diyaloğu — tarayıcının native confirm()/prompt()
// yerine. Tema token'larından beslenir; koyu ve açık temada tutarlı görünür
// (native diyalog tema dışıydı). confirmDialog → true|null, promptDialog → metin|null.
import { $, esc } from './utils.js?v=d0ca68eb0d19';

let host = null;
function ensureHost() {
  if (host) return host;
  host = document.createElement('div');
  host.className = 'dlg';
  host.hidden = true;
  host.innerHTML = `<div class="dlg-box" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
    <button type="button" class="dlg-close" aria-label="Kapat">✕</button>
    <h3 class="dlg-title" id="dlg-title"></h3>
    <p class="dlg-msg"></p>
    <div class="dlg-body" hidden></div>
    <div class="dlg-actions">
      <button type="button" class="dlg-ok btn-primary"></button>
      <button type="button" class="dlg-cancel btn-ghost"></button>
    </div>
  </div>`;
  document.body.appendChild(host);
  return host;
}

const STAY = Symbol('stay');

// openDialog: diyaloğu açar. onOk(dialog) OK'te çağrılır; STAY dönerse açık
// kalır (doğrulama veto), aksi halde dönüş değeriyle çözülür. Vazgeç/Esc → null.
function openDialog({ title, message = '', body = null, okLabel = 'Tamam', cancelLabel = 'Vazgeç', danger = false, onOk }) {
  return new Promise((resolve) => {
    const h = ensureHost();
    const ok = h.querySelector('.dlg-ok');
    ok.textContent = okLabel;
    ok.classList.toggle('p-danger', danger);
    h.querySelector('.dlg-cancel').textContent = cancelLabel;
    h.querySelector('.dlg-title').textContent = title;
    h.querySelector('.dlg-msg').textContent = message;
    const bodyEl = h.querySelector('.dlg-body');
    bodyEl.hidden = !body;
    bodyEl.innerHTML = body || '';
    h.hidden = false;
    document.body.classList.add('modal-open');

    const cleanup = () => {
      h.hidden = true;
      document.body.classList.remove('modal-open');
      ok.removeEventListener('click', onOkClick);
      h.querySelector('.dlg-cancel').removeEventListener('click', onCancel);
      h.querySelector('.dlg-close').removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKey);
    };
    const onOkClick = () => {
      const val = onOk ? onOk(h) : true;
      if (val === STAY) return; // doğrulama başarısız — açık kal
      cleanup();
      resolve(val);
    };
    const onCancel = () => { cleanup(); resolve(null); };
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };

    ok.addEventListener('click', onOkClick);
    h.querySelector('.dlg-cancel').addEventListener('click', onCancel);
    h.querySelector('.dlg-close').addEventListener('click', onCancel);
    document.addEventListener('keydown', onKey);

    const input = h.querySelector('.dlg-input');
    if (input) {
      input.focus();
      input.select();
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onOkClick(); });
    } else {
      ok.focus();
    }
  });
}

// Onay diyaloğu: true (Tamam) ya da null (Vazgeç/Esc).
export function confirmDialog({ title, message, okLabel = 'Tamam', danger = false }) {
  return openDialog({ title, message, okLabel, danger });
}

// Metin diyaloğu: girilen metin ya da null. validate girişi reddederse
// (false) diyalog kapanmaz.
export function promptDialog({ title, message, value = '', validate = null, okLabel = 'Tamam' }) {
  const body = `<input type="text" class="dlg-input f-in" value="${esc(value)}" spellcheck="false" aria-label="${esc(message || title)}">`;
  return openDialog({
    title, message, body, okLabel,
    onOk: (h) => {
      const val = h.querySelector('.dlg-input').value;
      if (validate && !validate(val)) return STAY;
      return val;
    },
  });
}
