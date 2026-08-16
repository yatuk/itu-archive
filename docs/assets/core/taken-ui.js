// "Aldığım dersler" düzenleyici modalı (Faz D, G8 kısmi). Beyan — transkript
// değil; localStorage'da kalır, sunucuya gitmez. Kaydedilince TAKEN_CHANGED
// olayı fırlar, görünümler (önşart/program/havuz) yeniden çizer.

import { getTaken, saveTaken, parseCodes, exportTaken, importTaken, notifyTakenChanged } from './taken.js';
import { I18N } from '../i18n.js';

let host = null;
let bound = false;

function ensureHost() {
  if (host) return host;
  host = document.createElement('div');
  host.className = 'dlg';
  host.hidden = true;
  host.innerHTML = `<div class="dlg-box" role="dialog" aria-modal="true" aria-labelledby="taken-title">
    <button type="button" class="dlg-close" aria-label="${I18N.t('detailClose')}">✕</button>
    <h3 class="dlg-title" id="taken-title">${I18N.t('takenTitle')}</h3>
    <div class="dlg-body">
      <label class="dlg-field" for="taken-codes">${I18N.t('takenCodesLabel')}</label>
      <textarea id="taken-codes" class="taken-codes" rows="5" spellcheck="false" placeholder="BLG 102E, MAT 101E, CEN 102"></textarea>
      <label class="dlg-field" for="taken-program">${I18N.t('takenProgLabel')}</label>
      <input id="taken-program" class="taken-program" type="text" placeholder="BLG_LS">
      <p class="dlg-note">${I18N.t('takenNote')}</p>
      <div class="dlg-row">
        <button type="button" class="btn-ghost taken-export">${I18N.t('takenExport')}</button>
        <button type="button" class="btn-ghost taken-import">${I18N.t('takenImport')}</button>
      </div>
    </div>
    <div class="dlg-actions">
      <button type="button" class="dlg-ok btn-primary">${I18N.t('takenSave')}</button>
      <button type="button" class="dlg-cancel btn-ghost">${I18N.t('dlgCancel')}</button>
    </div>
  </div>`;
  document.body.appendChild(host);

  const close = () => { host.hidden = true; document.body.classList.remove('modal-open'); };
  host.querySelector('.dlg-close').addEventListener('click', close);
  host.querySelector('.dlg-cancel').addEventListener('click', close);
  host.querySelector('.dlg-ok').addEventListener('click', () => {
    const codesEl = host.querySelector('.taken-codes');
    const progEl = host.querySelector('.taken-program');
    saveTaken({ codes: parseCodes(codesEl.value), program: progEl.value.trim() });
    notifyTakenChanged();
    close();
  });
  host.querySelector('.taken-export').addEventListener('click', () => {
    const blob = new Blob([exportTaken()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'itu-taken.json'; a.click();
    URL.revokeObjectURL(a.href);
  });
  host.querySelector('.taken-import').addEventListener('click', () => {
    const val = window.prompt(I18N.t('takenImportPrompt'));
    if (val && importTaken(val)) {
      const t = getTaken();
      host.querySelector('.taken-codes').value = t.codes.join(', ');
      host.querySelector('.taken-program').value = t.program || '';
    }
  });
  bound = true;
  return host;
}

export function openTakenEditor() {
  const h = ensureHost();
  const t = getTaken();
  h.querySelector('.taken-codes').value = t.codes.join(', ');
  h.querySelector('.taken-program').value = t.program || '';
  h.hidden = false;
  document.body.classList.add('modal-open');
  h.querySelector('.taken-codes').focus();
}

