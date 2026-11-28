// Ortak harf notu seçici: renk rampalı hap (pill) dizisi, erişilebilir bir
// radiogroup olarak. İki yerde kullanılır:
//   - /gano-hesaplama/ satır içi hesaplayıcısı (landing/gano-calc.js); sunucu
//     aynı işaretlemeyi internal/site/landing_gano.go'da üretir.
//   - "Müfredat ve GPA" sekmesindeki ders başına not girişi (views/dersplanim.js);
//     orada seçili not tek bir çip olarak durur, tıklanınca haplar açılır.
//
// Sınıf adları çağırandan gelir (cls öneki: "<cls>" grup, "<cls>-pill" hap);
// böylece her sayfanın stili kendi dosyasında kalır. Renk, hapın --gp-w
// değişkeninden (katsayı / 4, yüzde) CSS'te color-mix ile hesaplanır. Katsayısı
// olmayan kodlar (M, G, P, BL, E) data-kind="x" ile nötr kalır.
//
// Klavye: ok tuşları (ve Home/End) odağı haplar arasında gezdirir, Enter/Space
// seçer, Escape çağıranın onEscape'ini çalıştırır. Gezinme "roving tabindex"
// ile yapılır: grupta Tab ile tek bir durak vardır.
import { GRADE_POINTS } from './grades.js';

// Ölçek sırası tek kaynaktan: AA … DD, FF, VF.
export const PICKER_GRADES = Object.keys(GRADE_POINTS);

// Katsayının 4'e oranı (0–100, tam sayı); katsayısı olmayan kod için null.
export function gradeTone(letter) {
  const p = GRADE_POINTS[letter];
  return p === undefined ? null : Math.round((p / 4) * 100);
}

const attr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Tek hap: renk değişkeni ve seçili durumu taşır.
function pillHTML(cls, g, on, focusable) {
  const tone = gradeTone(g);
  const look = tone == null ? ' data-kind="x"' : ` style="--gp-w:${tone}%"`;
  return `<button type="button" class="${cls}-pill" role="radio" aria-checked="${on ? 'true' : 'false'}" tabindex="${focusable ? '0' : '-1'}" data-grade="${attr(g)}"${look}>${attr(g)}</button>`;
}

// Seçicinin HTML'i. grades: hap sırası; value: seçili not ('' = yok).
export function gradePickerHTML({ cls, value = '', label = '', grades = PICKER_GRADES } = {}) {
  const focusAt = Math.max(0, grades.indexOf(value));
  const pills = grades.map((g, i) => pillHTML(cls, g, g === value, i === focusAt)).join('');
  return `<span class="${cls}" role="radiogroup" data-gp aria-label="${attr(label)}">${pills}</span>`;
}

// Seçili hapın notu ('' = seçim yok).
export function gradePickerValue(group) {
  const on = group && group.querySelector('[role="radio"][aria-checked="true"]');
  return on ? on.dataset.grade : '';
}

// Seçimi değiştirir; Tab durağı seçili hapa (yoksa ilk hapa) taşınır.
export function setGradePickerValue(group, value) {
  if (!group) return;
  const pills = [...group.querySelectorAll('[role="radio"]')];
  const at = Math.max(0, pills.findIndex((p) => p.dataset.grade === value));
  pills.forEach((p, i) => {
    p.setAttribute('aria-checked', p.dataset.grade === value ? 'true' : 'false');
    p.tabIndex = i === at ? 0 : -1;
  });
}

// root altındaki bütün seçicileri tek dinleyiciyle bağlar (satırlar yeniden
// çizilse de çalışır). onPick(group, grade, pill) seçimden sonra çağrılır.
export function bindGradePickers(root, { onPick, onEscape } = {}) {
  const pillOf = (t) => (t && t.closest ? t.closest('[data-gp] [role="radio"]') : null);
  root.addEventListener('click', (ev) => {
    const pill = pillOf(ev.target);
    if (!pill || !root.contains(pill)) return;
    const group = pill.closest('[data-gp]');
    setGradePickerValue(group, pill.dataset.grade);
    if (onPick) onPick(group, pill.dataset.grade, pill);
  });
  root.addEventListener('keydown', (ev) => {
    const pill = pillOf(ev.target);
    if (!pill || !root.contains(pill) || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const group = pill.closest('[data-gp]');
    const pills = [...group.querySelectorAll('[role="radio"]')];
    const n = pills.length;
    let i = pills.indexOf(pill);
    switch (ev.key) {
      case 'ArrowRight': case 'ArrowDown': i = (i + 1) % n; break;
      case 'ArrowLeft': case 'ArrowUp': i = (i - 1 + n) % n; break;
      case 'Home': i = 0; break;
      case 'End': i = n - 1; break;
      case 'Enter': case ' ':
        ev.preventDefault();
        pill.click();
        return;
      case 'Escape':
        if (onEscape) { ev.preventDefault(); onEscape(group, pill); }
        return;
      default: return;
    }
    ev.preventDefault();
    pills.forEach((p, j) => { p.tabIndex = j === i ? 0 : -1; });
    pills[i].focus();
  });
}
