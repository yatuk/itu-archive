// Paylaşılan yardımcılar. Saf fonksiyonlar (esc, fold, termLabel, buildingOf)
// test edilebilir; veri/UX yardımcıları (getJSON, setStatus) tüm görünümlerin
// tek kaynağıdır — kopyalar burada toplanır.

const cache = new Map();

export const $ = (sel) => document.querySelector(sel);

// getJSON, aynı yol bir kez çekilir (önbellek) ve başarısızlıkta hata fırlatır.
// Hatalı (örn. 404) sonuçlar önbellekte tutulmaz: dosya sonradan oluşursa
// sayfa yenilenmeden de aynı yol tekrar denenebilir.
export function getJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const p = fetch(path)
    .then((r) => {
      if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
      return r.json();
    })
    .catch((err) => {
      cache.delete(path);
      throw err;
    });
  cache.set(path, p);
  return p;
}

// setStatus, bir durum satırına metin + stil yazar. busy/error sınıfları
// style.css'te tanımlı; görünümler yükleniyor/hata durumunu tutarlı gösterir.
export function setStatus(el, msg, { busy = false, error = false } = {}) {
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle('busy', busy);
  el.classList.toggle('error', error);
}

/* Türkçe karakterleri ASCII'ye katlar. Gerekli, çünkü tr yerelinde
   "BIL".toLocaleLowerCase('tr') === "bıl" — kullanıcının yazdığı "bil" ile
   eşleşmiyor. Yan fayda: "muhendislik" araması "Mühendislik"i de buluyor. */
const FOLD = {
  'İ': 'i', 'I': 'i', 'ı': 'i', 'Ş': 's', 'ş': 's', 'Ğ': 'g', 'ğ': 'g',
  'Ü': 'u', 'ü': 'u', 'Ö': 'o', 'ö': 'o', 'Ç': 'c', 'ç': 'c',
  'Â': 'a', 'â': 'a', 'Î': 'i', 'î': 'i', 'Û': 'u', 'û': 'u',
};

export function fold(s) {
  return String(s).replace(/[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g, (c) => FOLD[c]).toLowerCase();
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
}

// "2025-2026-guz" -> "2025-26 Güz"
export function termLabel(slug) {
  const [y1, y2, season] = slug.split('-');
  const s = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' }[season] || season;
  return `${y1}-${String(y2).slice(2)} ${s}`;
}

// Yer alanındaki binayı ayıklar: "Ayazağa/İnşaat Binası-D100" -> "İnşaat Binası".
export function buildingOf(place) {
  const s = String(place || '').trim();
  if (!s) return '';
  return s.split('/').pop().split('-')[0].trim();
}

// CSV indirme (Excel için BOM'lu).
export function downloadCSV(filename, headers, rows) {
  const cell = (v) => {
    v = String(v ?? '');
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };
  const lines = [headers.map(cell).join(',')].concat(rows.map((r) => r.map(cell).join(',')));
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
