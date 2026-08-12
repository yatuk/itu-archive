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

// Türkçe takvim tarihi: "09 Temmuz 2026" -> yerel gece yarısı Date.
// Çözümlenemeyen girdilerde (biçim bozuk, bilinmeyen ay) null döner.
const TR_MONTHS = {
  Ocak: 0, Şubat: 1, Mart: 2, Nisan: 3, Mayıs: 4, Haziran: 5,
  Temmuz: 6, Ağustos: 7, Eylül: 8, Ekim: 9, Kasım: 10, Aralık: 11,
};
export function parseTurkishDate(str) {
  const m = String(str ?? '').trim().match(/^(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$/);
  if (!m) return null;
  const month = TR_MONTHS[m[2]];
  if (month === undefined) return null;
  const day = Number(m[1]);
  const d = new Date(Number(m[3]), month, day);
  // Date taşan günü devreder (32 Ocak → 1 Şubat); taşmayı geri al:
  if (isNaN(d) || d.getDate() !== day || d.getMonth() !== month) return null;
  return d;
}

// Takvim tarihleri çoğunlukla aralık olur: "24 - 26 Ağustos 2026",
// "28 Ağustos - 01 Eylül 2023" veya "29 Aralık 2025 - 02 Ocak 2026".
// {start, end} Date çiftine çevirir; tek tarihte start === end.
// Çözümlenemezse null döner.
export function parseTurkishDateRange(str) {
  const s = String(str ?? '').trim();
  if (!s) return null;
  const one = parseTurkishDate(s);
  if (one) return { start: one, end: one };
  let m = s.match(/^(\d{1,2})\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$/); // "24 - 26 Ağustos 2026"
  if (m) {
    const start = parseTurkishDate(`${m[1]} ${m[3]} ${m[4]}`);
    const end = parseTurkishDate(`${m[2]} ${m[3]} ${m[4]}`);
    if (start && end && end >= start) return { start, end };
    return null;
  }
  m = s.match(/^(\d{1,2})\s+([^\s\d]+)\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$/); // "28 Ağustos - 01 Eylül 2023"
  if (m) {
    const start = parseTurkishDate(`${m[1]} ${m[2]} ${m[5]}`);
    const end = parseTurkishDate(`${m[3]} ${m[4]} ${m[5]}`);
    if (start && end && end >= start) return { start, end };
    return null;
  }
  m = s.match(/^(\d{1,2})\s+([^\s\d]+)\s+(\d{4})\s*-\s*(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$/); // "29 Aralık 2025 - 02 Ocak 2026"
  if (m) {
    const start = parseTurkishDate(`${m[1]} ${m[2]} ${m[3]}`);
    const end = parseTurkishDate(`${m[4]} ${m[5]} ${m[6]}`);
    if (start && end && end >= start) return { start, end };
    return null;
  }
  return null;
}

// Takvim etkinliğini bugüne göre sınıflandırır: { past, now, label }.
// label canlı hesaptır — scrape anına sabitlenmiş `remaining` etiketine
// güvenmez (bayat kalıp yanlış "geçti" diyebilir). Aralıklı tarihte
// geçmiş = bitiş bugünden önce, devam = bugün aralık içinde.
// Tarih çözümlenemezse etkinlik "gelecek" sayılır (boş ekran üretmemek için).
export function calendarDayState(dateStr, today = new Date()) {
  const r = parseTurkishDateRange(dateStr);
  if (!r) return { past: false, now: false, label: '' };
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = (d) => Math.round((start - d) / 86400000); // >0 geçmiş, 0 bugün, <0 gelecek
  const ds = diff(r.start);
  const de = diff(r.end);
  if (de > 0) return { past: true, now: false, label: de === 1 ? 'Dün bitti' : `${de} gün geçti` };
  if (ds > 0) return { past: false, now: true, label: 'Devam ediyor' };
  const ahead = -ds;
  if (ahead === 0) return { past: false, now: true, label: 'Bugün' };
  return { past: false, now: false, label: ahead === 1 ? 'Yarın' : `${ahead} gün kaldı` };
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
