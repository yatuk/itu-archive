// Paylaşılan yardımcılar. Saf fonksiyonlar (esc, fold, termLabel, buildingOf)
// test edilebilir; veri/UX yardımcıları (getJSON, setStatus) tüm görünümlerin
// tek kaynağıdır — kopyalar burada toplanır.

import { I18N } from '../i18n.js';

const cache = new Map();

// Tarih/saat biçimi görüntü dilini izler; veri ayrıştırma (parseTurkishDate)
// her zaman kaynağın Türkçe yazımına bakar, o tarafa dokunulmaz.
const locale = () => (I18N.lang === 'en' ? 'en-GB' : 'tr-TR');

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

// Arama normalizasyonu — Dersler ve Geçmiş sekmelerinde ORTAK. Türkçe katlayıp
// tüm boşlukları siler: "BLG 102E", "BLG102E" ve "BLG  102  E" aynı anahtarı
// ("blg102e") üretir. Boşluksuz kod/yazım farkını görmezden gelir.
export function normSearch(s) {
  return fold(String(s)).replace(/\s+/g, '');
}

// Türkçe sayı biçimi: ondalık ayracı virgül; tam sayıda ",0" yazılmaz.
// 15.0 → "15", 12.5 → "12,5", 3 → "3".
export function trNum(n) {
  if (n == null || isNaN(Number(n))) return '';
  const s = String(Number(n)).replace('.', ',');
  return s.endsWith(',0') ? s.slice(0, -2) : s;
}

// Arama eşleştirmesi: normalize edilmiş `hay` içinde `term`'i ara. Kod benzeri
// terimlerde İngilizce-E soneki yok sayılır ("BLG 102E" hem "BLG 102" hem
// "BLG 102E"yi bulur). Ters yön zaten eşleşir: boşluk silindiği için
// "blg102" ⊂ "blg102e…". Saf fonksiyon — test edilebilir.
export function searchMatch(term, hay) {
  if (hay.includes(term)) return true;
  if (/\d[e]$/.test(term) && hay.includes(term.slice(0, -1))) return true;
  return false;
}

/* --- alan bazlı arama eşleştirmesi (Dersler görünümü) ---
   Tek boşluksuz yığın (state.hay) yerine her alan kendi normalizasyonuyla
   saklanır: kod boşluksuz (normSearch) — "blg411e" ↔ "BLG 411E"; ad/hoca/crn
   fold ile — boşluklar korunur ki kelime sınırı kavramı kaybolmasın.
   Skor hiyerarşisi (büyük önce): kod tam > kod başı > ad kelime başı >
   hoca kelime başı > kod/kelime ortası. <3 karakterli terimler YALNIZCA
   kelime başından eşleşir (Ovatman içindeki "ma" gibi ortalar elenir). */

const SCORE = {
  codeExact: 10000,
  codeStart: 8000,
  crn: 8000,
  nameStart: 6000,
  instrStart: 5000,
  codeMid: 4000,
  wordMid: 2000,
};

// Tek bir normalize alanda terimin en iyi eşleşmesini puanlar.
// kind: 'code' | 'crn' | 'name' | 'instructor'. Kod/crn boşluksuz alandır —
// kelime başı yalnızca index 0; ad/hoca boşluklu olduğundan kelime başı = bir
// önceki karakter [a-z0-9] değilse. Dönüş: { at, len, score } | null.
function bestInField(term, field, kind) {
  if (!field) return null;
  const cands = [term];
  // İngilizce-E soneki yalnızca kod alanında yok sayılır ("blg102e" → "blg102"),
  // böylece "BLG 102E" araması "BLG 102" dersini de bulur.
  if (kind === 'code' && /\d[e]$/.test(term)) cands.push(term.slice(0, -1));
  let best = null;
  for (const cand of cands) {
    let at = 0;
    while ((at = field.indexOf(cand, at)) >= 0) {
      const wordStart = at === 0 || !/[a-z0-9]/.test(field[at - 1]);
      if (term.length < 3 && !wordStart) { at++; continue; }
      let score;
      const exact = cand === field;
      if (kind === 'code') score = exact ? SCORE.codeExact : wordStart ? SCORE.codeStart : SCORE.codeMid;
      else if (kind === 'crn') score = wordStart ? SCORE.crn : SCORE.wordMid;
      else if (kind === 'name') score = wordStart ? SCORE.nameStart : SCORE.wordMid;
      else score = wordStart ? SCORE.instrStart : SCORE.wordMid;
      if (!best || score > best.score) best = { at, len: cand.length, score };
      at++;
    }
  }
  return best;
}

// Bir satırın tüm alanları üzerinden terimlerin eşleşme skoru.
// fields: { crn, code, name, instructor } — önceden normalize edilmiş.
// Dönüş: { score, hits } | null; hits her terim için tek { field, at, len }.
export function matchRow(terms, fields) {
  const hits = [];
  let score = 0;
  for (const term of terms) {
    let best = null;
    for (const [field, kind] of [['code', 'code'], ['crn', 'crn'], ['name', 'name'], ['instructor', 'instructor']]) {
      const m = bestInField(term, fields[field], kind);
      if (m && (!best || m.score > best.score)) best = { field, ...m };
    }
    if (!best) return null;
    hits.push(best);
    score += best.score;
  }
  // Çok terimli sorguda en az bir terim kod veya ad alanında eşleşmeli; yalnızca
  // hocadan gelen çoklu eşleşme sonuç üretmesin (tek terimde hoca eşleşmesi geçerli).
  if (terms.length > 1 && !hits.some((h) => h.field === 'code' || h.field === 'name')) return null;
  return { score, hits };
}

// Eşleşen parçaları <mark> ile sarar (esc'li HTML). field: 'code'|'crn'|'name'|'instructor'.
// hits [{at,len}] normalize uzayda; kod/crn boşluksuz olduğundan orijinal metindeki
// boşluklar sayılarak geri eşlenir (fold uzunluk koruduğu için diğer alanlarda birebir).
export function markField(text, field, hits) {
  const str = String(text ?? '');
  if (!hits || !hits.length) return esc(str);
  const spaceless = field === 'code' || field === 'crn';
  const mapRange = (at, len) => {
    if (!spaceless) {
      const s = Math.max(0, at);
      const e = Math.min(str.length, at + len);
      return e > s ? [s, e] : null;
    }
    const findIdx = (n) => {
      let c = 0;
      for (let i = 0; i < str.length; i++) {
        if (/\s/.test(str[i])) continue;
        if (c === n) return i;
        c++;
      }
      return -1;
    };
    const s = findIdx(at);
    if (s < 0) return null;
    const e = findIdx(at + len - 1);
    if (e < 0) return null;
    return [s, e + 1];
  };
  const ranges = hits.map((h) => mapRange(h.at, h.len)).filter(Boolean)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (!ranges.length) return esc(str);
  const merged = [];
  for (const [s, e] of ranges) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  let out = '';
  let prev = 0;
  for (const [s, e] of merged) {
    out += esc(str.slice(prev, s)) + '<mark>' + esc(str.slice(s, e)) + '</mark>';
    prev = e;
  }
  out += esc(str.slice(prev));
  return out;
}

// 0 sonuçta düşürülecek terimi seçer: geriye kalan sorgu en az (ama sıfırdan
// çok) sonuç vereni bırak — en kesin öneri. countFor(subset) → eşleşen satır
// sayısı; hiçbir alt küme sonuç vermiyorsa -1 döner. Saf — test edilebilir.
export function suggestDrop(terms, countFor) {
  if (terms.length < 2) return -1; // düşürülecek terim yok
  let drop = -1;
  let best = Infinity;
  for (let i = 0; i < terms.length; i++) {
    const c = countFor(terms.filter((_, j) => j !== i));
    if (c > 0 && c < best) { best = c; drop = i; }
  }
  return drop;
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
  if (!iso) return '·';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' });
}

// "2025-2026-guz" -> "2025-26 Güz" (EN: "2025-26 Fall")
export function termLabel(slug) {
  const [y1, y2, season] = slug.split('-');
  const s = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' }[season] || season;
  return `${y1}-${String(y2).slice(2)} ${I18N.seasonName(s)}`;
}

// Yer alanındaki binayı ayıklar: "Ayazağa/İnşaat Binası-D100" -> "İnşaat Binası".
export function buildingOf(place) {
  const s = String(place || '').trim();
  if (!s) return '';
  return s.split('/').pop().split('-')[0].trim();
}

// Bina kodu → ad ("BBB" → "Bilgisayar ve Bilişim Binası"). docs/data/buildings.json
// code→name haritasından; eşleşme yoksa kodu aynen döndürür. Saf · testli.
export function buildingName(code, buildings) {
  const c = String(code || '').trim();
  if (!c) return '';
  const map = buildings && buildings.find ? buildings : null;
  if (map) {
    const hit = map.find((b) => b.code === c);
    if (hit && hit.name) return hit.name;
  }
  return c; // eşleşme yoksa kod (eski davranış)
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
// label canlı hesaptır · scrape anına sabitlenmiş `remaining` etiketine
// güvenmez (bayat kalıp yanlış "geçti" diyebilir). Aralıklı tarihte
// geçmiş = bitiş bugünden önce, devam = bugün aralık içinde.
// Tarih çözümlenemezse etkinlik "gelecek" sayılır (boş ekran üretmemek için).
//
// isoOpsiyonel: scraper'ın yazdığı makinece okunur { start, end } (ISO "2006-01-02").
// Varsa Türkçe metin ayrıştırmaya tercih edilir · scraper bazı biçimleri
// (gömülü saatli aralıklar) JS'ten daha sağlam çözer.
export function calendarDayState(dateStr, today = new Date(), iso) {
  let r = null;
  if (iso && iso.start && iso.end) {
    const p = (v) => { const [y, m, d] = String(v).split('-').map(Number); return new Date(y, m - 1, d); };
    const a = p(iso.start), b = p(iso.end);
    if (!isNaN(a) && !isNaN(b) && b >= a) r = { start: a, end: b };
  }
  if (!r) r = parseTurkishDateRange(dateStr);
  if (!r) return { past: false, now: false, label: '' };
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = (d) => Math.round((start - d) / 86400000); // >0 geçmiş, 0 bugün, <0 gelecek
  const ds = diff(r.start);
  const de = diff(r.end);
  if (de > 0) return { past: true, now: false, label: de === 1 ? I18N.t('calEndedYesterday') : I18N.t('calDaysPassed', { n: de }) };
  if (ds > 0) return { past: false, now: true, label: I18N.t('calOngoing') };
  const ahead = -ds;
  if (ahead === 0) return { past: false, now: true, label: I18N.t('calToday') };
  return { past: false, now: false, label: ahead === 1 ? I18N.t('calTomorrow') : I18N.t('calDaysLeft', { n: ahead }) };
}

// Oturum sürelerini toplar: ["08:30/11:29", "13:00/15:59"] -> 6 sa/hafta.
// Oturum süresidir, resmî T+U+L kredisi değildir (katalog verisiyle gelir).
// Saf · test edilebilir.
export function sessionHours(times) {
  if (!Array.isArray(times) || !times.length) return 0;
  let mins = 0;
  for (const t of times) {
    const m = String(t).match(/^(\d{2}):(\d{2})\/(\d{2}):(\d{2})$/);
    if (!m) continue;
    const s = Number(m[1]) * 60 + Number(m[2]);
    const e = Number(m[3]) * 60 + Number(m[4]);
    if (e > s) mins += e - s;
  }
  return Math.round(mins / 60);
}

// ISO zaman damgasından kısa "ne kadar önce" metni üretir: "şimdi", "4 dk önce",
// "6 sa önce", "3 gün önce"; 30 günden eskisinde tarih. Saf · test edilebilir.
export function timeAgo(iso, now = Date.now()) {
  if (iso == null || String(iso).trim() === '') return ''; // new Date(null) → 1970 tuzağı
  const t = new Date(iso);
  if (isNaN(t)) return '';
  const ms = now - t.getTime();
  if (ms < 0) return '';
  const min = Math.floor(ms / 60000);
  if (min < 1) return I18N.t('agoNow');
  if (min < 60) return I18N.t('agoMin', { n: min });
  const hr = Math.floor(min / 60);
  if (hr < 24) return I18N.t('agoHour', { n: hr });
  const day = Math.floor(hr / 24);
  if (day < 30) return I18N.t('agoDay', { n: day });
  return t.toLocaleDateString(locale());
}

// Doluluk rozetinin ölçüm zamanını küçük etikete çevirir: "en son 6 sa önce
// ölçüldü". Zaman damgası yoksa (eski dönem/quota yoksa) boş döner — saf, testli.
export function fillMeasured(lastIso, now = Date.now()) {
  const ago = timeAgo(lastIso, now);
  return ago ? I18N.t('fillMeasured', { ago }) : '';
}

// safeHref, dış bağlantıyı DOM'a koymadan önce şemasını doğrular.
//
// Not Kutusu kullanıcı katkısı taşır: kayıtlar cmd/notes tarafından doğrulanır
// (https zorunlu), ama JSON elle düzenlenebilir ya da bir PR gözden kaçabilir.
// esc() `javascript:` şemasını nötrleştirmez — içinde kaçırılacak karakter yok.
// Bu yüzden render tarafında ikinci bir kapı: yalnızca http(s) geçer, geri
// kalanı boş döner ve arayüz bağlantı yerine düz metin gösterir.
export function safeHref(raw) {
  const s = String(raw ?? '').trim();
  try {
    const u = new URL(s);
    return (u.protocol === 'https:' || u.protocol === 'http:') ? s : '';
  } catch {
    return ''; // göreli/bozuk adres — dış bağlantı olarak kabul edilmez
  }
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

// ICS (takvim) metni üretir · saf, testli. events: [{ uid, title, startISO,
// endISO, desc? }], ISO tarihleri "YYYY-MM-DD" (tüm gün) ya da
// "YYYY-MM-DDTHH:MM:SS". downloadCSV deseninin yanına ikinci üretici.
export function icsText(events, stamp = new Date().toISOString().slice(0, 19)) {
  const escTxt = (v) => String(v ?? '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const dt = (iso, allDay) => {
    const s = String(iso || '');
    // iCal temel biçim: tüm gün "YYYYMMDD", zamanlı "YYYYMMDDTHHMMSS".
    return allDay ? s.replace(/T.*$/, '').replace(/-/g, '') : s.replace(/[-:]/g, '').replace(/\..*/, '');
  };
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//itu-ders//Ders Arşivi//TR',
    'CALSCALE:GREGORIAN',
  ];
  for (const [i, e] of (events || []).entries()) {
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(e.startISO || '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${escTxt(e.uid || `itu-ders-${i}`)}@itu-ders.com`);
    lines.push(`DTSTAMP:${dt(stamp, false)}`);
    lines.push(`DTSTART:${dt(e.startISO, allDay)}`);
    lines.push(`DTEND:${dt(e.endISO || e.startISO, allDay)}`);
    lines.push(`SUMMARY:${escTxt(e.title)}`);
    if (e.desc) lines.push(`DESCRIPTION:${escTxt(e.desc)}`);
    if (e.rrule) lines.push(`RRULE:${String(e.rrule)}`); // değer sözdizimi ';' içerir · escape edilmez
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  // RFC 5545: uzun satırları 75 oktette katla (bazı takvim uygulamaları reddeder).
  return lines.map((ln) => foldLine(ln)).join('\r\n');
}

// ICS dışa aktarımı · Faz 4.5. icsText'i dosyaya indirir.
export function downloadICS(filename, events) {
  const blob = new Blob([icsText(events)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Binlik ayraç (nokta): 7669 → "7.669" (Türkçe gösterim kuralı). P2-18.
export function formatInt(n) {
  const s = String(Math.round(Number(n) || 0));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Kısa, stabil kimlik karması (Faz 4.5 · .ics uid'i uzun/Türkçe başlık yerine).
// Deterministik FNV-1a; 8 hex basamak çakışma ihtimali pratikte yok.
export function hashShort(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// RFC 5545 satır katlaması: 75 okteti aşan mantıksal satır, CRLF + boşlukla
// devam satırlarına bölünür. Bazı takvim uygulamaları uzun satırı reddeder.
export function foldLine(text, limit = 75) {
  if (text.length <= limit) return text;
  const out = [text.slice(0, limit)];
  let rest = text.slice(limit);
  while (rest.length > limit - 1) {
    out.push(' ' + rest.slice(0, limit - 1));
    rest = rest.slice(limit - 1);
  }
  if (rest) out.push(' ' + rest);
  return out.join('\r\n');
}
