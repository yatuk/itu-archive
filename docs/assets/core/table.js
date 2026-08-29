// Ortak tablo üretici: "item listesini tbody'ye satır olarak bas" kalıbını tek
// yerde toplar. Görünümler kendi satır HTML'ini verir; boş durum, temizleme ve
// ESC kaçışı burada halledilir.
//
//   fillRows(tbody, items, makeRow, { empty, colspan, append })
//
// makeRow(item) -> satırın <tr> iç HTML'i. Dönen değer oluşturulan <tr>
// elemanlarının dizisidir; çağıran bunlar üzerinden event listener bağlar
// (örn. detay satırı açma). NOT: DocumentFragment değil — appendChild çocukları
// tbody'ye taşır, fragment sonrasında boşalır; o yüzden tr'ler döndürülür.

import { esc } from './utils.js?v=f55dd720fb58';

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
  // appendChild çocukları taşır; listener bağlamak için tr'leri önce yakala.
  const trs = Array.from(frag.children);
  tbody.appendChild(frag);
  return trs;
}
