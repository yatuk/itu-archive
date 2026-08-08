// Ortak tablo üretici: "item listesini tbody'ye satır olarak bas" kalıbını tek
// yerde toplar. Görünümler kendi satır HTML'ini verir; boş durum, temizleme ve
// ESC kaçışı burada halledilir.
//
//   fillRows(tbody, items, makeRow, { empty, colspan, append })
//
// makeRow(item) -> satırın <tr> iç HTML'i. Dönen DocumentFragment üzerinden
// satır sonrası event listener bağlanabilir (örn. detay satırı açma).

import { esc } from './utils.js';

export function fillRows(tbody, items, makeRow, { empty = 'kayıt yok', colspan = 1, append = false } = {}) {
  if (!append) tbody.innerHTML = '';
  if (!items.length) {
    // Sayfalama eklemesinde boş dilim geldiyse mevcut satırları bozma.
    if (!append || !tbody.childElementCount) {
      tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty">${esc(empty)}</td></tr>`;
    }
    return null;
  }
  const frag = document.createDocumentFragment();
  for (const item of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = makeRow(item);
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);
  return frag;
}
