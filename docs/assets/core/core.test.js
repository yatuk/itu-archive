// Saf frontend fonksiyonlarının testleri. Çalıştırma:
//   node --test docs/assets/core/
// (docs/package.json "type":"module" ile ES modüller olarak yüklenir.)

import test from 'node:test';
import assert from 'node:assert/strict';

import { fold, termLabel, buildingOf, parseTurkishDate, parseTurkishDateRange, calendarDayState } from './utils.js';
import { fillBar, trendChart } from './chart.js';
import { sortValue, parseWhen, timeBucket, matchesDay, buildTimetable, programList } from '../views/courses.js';
import { parseReq, reqAlts } from '../prereq.js';
import { buildSnippet } from '../views/program.js';
import * as fav from './favorites.js';

test('fold Türkçe karakterleri ASCII katar', () => {
  assert.equal(fold('İTÜ Mühendislik ŞŞ ĞĞ'), 'itu muhendislik ss gg');
  assert.equal(fold('BIL 100E'), 'bil 100e');
  assert.equal(fold(''), '');
});

test('termLabel dönem slug kısaltır', () => {
  assert.equal(termLabel('2025-2026-guz'), '2025-26 Güz');
  assert.equal(termLabel('2024-2025-yaz'), '2024-25 Yaz');
  assert.equal(termLabel('2023-2024-bahar'), '2023-24 Bahar');
});

test('buildingOf yer alanından bina ayıklar', () => {
  assert.equal(buildingOf('Ayazağa/İnşaat Binası-D100'), 'İnşaat Binası');
  assert.equal(buildingOf('Süleyman Demirel Kültür Merkezi'), 'Süleyman Demirel Kültür Merkezi');
  assert.equal(buildingOf(''), '');
  assert.equal(buildingOf(undefined), '');
});

test('parseTurkishDate Türkçe ay adını Date yapar', () => {
  assert.deepEqual(parseTurkishDate('09 Temmuz 2026'), new Date(2026, 6, 9));
  assert.deepEqual(parseTurkishDate('1 Ocak 2024'), new Date(2024, 0, 1));
  assert.deepEqual(parseTurkishDate('31 Aralık 2025'), new Date(2025, 11, 31));
});

test('parseTurkishDate bozuk girdide null döner', () => {
  assert.equal(parseTurkishDate(''), null);
  assert.equal(parseTurkishDate('foo'), null);
  assert.equal(parseTurkishDate('32 Ocak 2026'), null);
  assert.equal(parseTurkishDate('09 Bogus 2026'), null);
  assert.equal(parseTurkishDate(null), null);
});

test('parseTurkishDateRange aralıkları ve tek tarihi çözer', () => {
  assert.deepEqual(parseTurkishDateRange('24 - 26 Ağustos 2026'),
    { start: new Date(2026, 7, 24), end: new Date(2026, 7, 26) });
  assert.deepEqual(parseTurkishDateRange('28 Ağustos - 01 Eylül 2023'),
    { start: new Date(2023, 7, 28), end: new Date(2023, 8, 1) });
  assert.deepEqual(parseTurkishDateRange('29 Aralık 2025 - 02 Ocak 2026'),
    { start: new Date(2025, 11, 29), end: new Date(2026, 0, 2) });
  const one = parseTurkishDateRange('09 Temmuz 2026');
  assert.deepEqual(one, { start: new Date(2026, 6, 9), end: new Date(2026, 6, 9) });
  assert.equal(parseTurkishDateRange('Bilinmiyor'), null);
  assert.equal(parseTurkishDateRange(''), null);
});

test('calendarDayState tek tarihte geçmiş/bugün/gelecek sınıflandırır', () => {
  const today = new Date(2026, 7, 13); // 13 Ağustos 2026
  assert.deepEqual(calendarDayState('09 Temmuz 2026', today), { past: true, now: false, label: '35 gün geçti' });
  assert.deepEqual(calendarDayState('13 Ağustos 2026', today), { past: false, now: true, label: 'Bugün' });
  const future = calendarDayState('09 Aralık 2026', today);
  assert.equal(future.past, false);
  assert.equal(future.now, false);
  assert.ok(future.label.endsWith('gün kaldı'));
});

test('calendarDayState aralıkta devam/geçmiş/gelecek sınıflandırır', () => {
  const today = new Date(2026, 7, 13); // 13 Ağustos 2026
  // Bitmemiş, bugün içinde sürüyor.
  assert.deepEqual(calendarDayState('10 - 15 Ağustos 2026', today), { past: false, now: true, label: 'Devam ediyor' });
  // Bitiş bugünden önce -> geçmiş (bitişe göre).
  assert.equal(calendarDayState('01 - 05 Ağustos 2026', today).past, true);
  // Başlangıç bugünden sonra -> gelecek (başlangıca göre).
  assert.equal(calendarDayState('24 - 26 Ağustos 2026', today).past, false);
  assert.ok(calendarDayState('24 - 26 Ağustos 2026', today).label.includes('11 gün kaldı'));
});

test('calendarDayState çözümlenemeyen tarihi "gelecek" sayar', () => {
  assert.deepEqual(calendarDayState('Belirsiz', new Date(2026, 7, 13)), { past: false, now: false, label: '' });
});

test('fillBar kapasitesiz şubede çubuk basmaz', () => {
  assert.equal(fillBar(0, 5), '—');
  const html = fillBar(50, 25);
  assert.ok(html.includes('%50'));
  assert.ok(html.includes('bar'));
});

test('fillBar tam ve kritik doluluk sınıflarını verir', () => {
  assert.ok(fillBar(10, 10).includes('full'));
  assert.ok(fillBar(20, 18).includes('tight'));
  assert.ok(fillBar(20, 10).includes('bar '));
});

test('trendChart dönem bazında SVG üretir', () => {
  const byTerm = new Map([
    ['2025-2026-guz', [{ cap: 50, enr: 30 }, { cap: 50, enr: 40 }]],
    ['2025-2026-bahar', [{ cap: 60, enr: 60 }]],
  ]);
  const svg = trendChart(byTerm);
  assert.ok(svg.startsWith('<figure class="trend">'));
  assert.ok(svg.includes('<svg'));
  // Dönem başına bir çubuk çifti (kontenjan + doluluk) ve bir eksen etiketi.
  assert.equal((svg.match(/<rect /g) || []).length, 4);
  assert.ok(svg.includes('>26G<'));
  assert.ok(svg.includes('>26B<'));
});

test('trendChart boş girdide bozulmaz', () => {
  assert.ok(trendChart(new Map()).includes('<svg'));
});

test('sortValue satır alanlarını ve doluluğu döndürür', () => {
  const row = ['100', 'BLG 101E', 'Algorithms', 'BIL', 'Hoca', 'Pazartesi 09:30/12:29', 50, 25];
  assert.equal(sortValue(row, 'crn'), '100');
  assert.equal(sortValue(row, 'code'), 'BLG 101E');
  assert.equal(sortValue(row, 'cap'), 50);
  assert.equal(sortValue(row, 'enr'), 25);
  assert.equal(sortValue(row, 'fill'), 0.5);
  assert.equal(sortValue(row, 'when'), 'Pazartesi 09:30/12:29');
});

test('sortValue sıfır kapasitede doluluğu -1 verir', () => {
  assert.equal(sortValue(['1', 'X 1', '', '', '', '', 0, 3], 'fill'), -1);
});

test('parseWhen oturumları gün + dakika aralığına çevirir', () => {
  const got = parseWhen('Pazartesi 08:30/12:29 | Çarşamba 13:00/16:59');
  assert.equal(got.length, 2);
  assert.deepEqual(got[0], { day: 'Pazartesi', start: 8 * 60 + 30, end: 12 * 60 + 29 });
  assert.deepEqual(got[1], { day: 'Çarşamba', start: 13 * 60, end: 16 * 60 + 59 });
});

test('parseWhen bozuk/boş girdilerde sessizce geçer', () => {
  assert.equal(parseWhen('').length, 0);
  assert.equal(parseWhen('Pazartesi 08:30/12:29 | ').length, 1);
  assert.equal(parseWhen('Ders saati ilan edilecek').length, 0);
  assert.equal(parseWhen('Pazartesi').length, 0);
  assert.equal(parseWhen('08:30/12:29').length, 0);
});

test('timeBucket saat dilimini doğru kovaya koyar', () => {
  assert.equal(timeBucket(8 * 60 + 30), 'sabah');
  assert.equal(timeBucket(11 * 60 + 59), 'sabah');
  assert.equal(timeBucket(12 * 60), 'ogle');
  assert.equal(timeBucket(16 * 60 + 59), 'ogle');
  assert.equal(timeBucket(17 * 60), 'aksam');
  assert.equal(timeBucket(20 * 60), 'aksam');
});

// Gün filtresi tam-token eşleşmeli; "Pazar", "Pazartesi"yi; "Cuma",
// "Cumartesi"yi eşleştirmemeli.
test('matchesDay Pazar Pazartesi eşleştirmez (eski alt-dize hatası)', () => {
  assert.equal(matchesDay('Pazartesi 08:30/12:29 | Çarşamba 13:00/16:59', 'Pazar'), false);
});
test('matchesDay Cuma Cumartesi eşleştirmez', () => {
  assert.equal(matchesDay('Cumartesi 09:00/12:00', 'Cuma'), false);
});
test('matchesDay tam günü eşleştirir', () => {
  assert.equal(matchesDay('Pazartesi 08:30/12:29', 'Pazartesi'), true);
  assert.equal(matchesDay('Pazar 09:00/12:00', 'Pazar'), true);
  assert.equal(matchesDay('Cuma 08:30/12:29', 'Cuma'), true);
  assert.equal(matchesDay('', 'Pazartesi'), false);
});

// ---- Önşart AND/OR ayrıştırıcısı ----

test('parseReq VEYA alternatiflerini ayırır, hepsi "biri yeter" olur', () => {
  const tree = parseReq('( MAT 102 MIN. DD Veya MAT 102E MIN. DD ) Veya ( MAT 104 MIN. DD Veya MAT 104E MIN. DD )');
  assert.equal(tree.type, 'or');
  assert.equal(tree.items.length, 2);
  const alts = [...reqAlts(tree)].sort();
  assert.deepEqual(alts, ['MAT 102', 'MAT 102E', 'MAT 104', 'MAT 104E']);
});

test('parseReq VE tümünü gerektirir, alternatif yok', () => {
  const tree = parseReq('MAT 101 MIN. DD Ve MAT 102 MIN. DD');
  assert.equal(tree.type, 'and');
  assert.equal(reqAlts(tree).size, 0);
});

test('parseReq karışık yapı: (A Ve B) Veya C', () => {
  const tree = parseReq('( MAT 101 MIN. DD Ve MAT 102 MIN. DD ) Veya MAT 103 MIN. DD');
  assert.equal(tree.type, 'or');
  const alts = [...reqAlts(tree)].sort();
  // A+B birlikte bir seçenek, C tek başına bir seçenek — hiçbiri bireysel zorunlu değil.
  assert.deepEqual(alts, ['MAT 101', 'MAT 102', 'MAT 103']);
});

test('parseReq tek ders ve boş girdi', () => {
  const tree = parseReq('MAT 101');
  assert.equal(tree.type, 'code');
  assert.equal(tree.code, 'MAT 101');
  assert.equal(reqAlts(tree).size, 0);
  assert.equal(parseReq(''), null);
  assert.equal(parseReq('   '), null);
});

test('parseReq gerçek OBS örneği (AKM 202)', () => {
  const expr = '( MAT 102 MIN. FF Veya MAT 102E MIN. FF ) Veya ( MAT 104 MIN. FF Veya MAT 104E MIN. FF )';
  const alts = [...reqAlts(parseReq(expr))].sort();
  assert.deepEqual(alts, ['MAT 102', 'MAT 102E', 'MAT 104', 'MAT 104E']);
});

// ---- Favoriler / program kaydı (localStorage shim ile) ----

const storeMap = new Map();
globalThis.localStorage = {
  getItem: (k) => (storeMap.has(k) ? storeMap.get(k) : null),
  setItem: (k, v) => storeMap.set(k, v),
  removeItem: (k) => storeMap.delete(k),
};

test('favori toggle ekler ve kaldırır', () => {
  storeMap.clear();
  assert.equal(fav.toggleFavorite('2025-2026-yaz', 'BLG', '100'), true);
  assert.equal(fav.isFavorite('2025-2026-yaz', 'BLG', '100'), true);
  assert.equal(fav.toggleFavorite('2025-2026-yaz', 'BLG', '100'), false);
  assert.equal(fav.isFavorite('2025-2026-yaz', 'BLG', '100'), false);
});

test('favoriler döneme özeldir', () => {
  storeMap.clear();
  fav.toggleFavorite('2025-2026-yaz', 'BLG', '100');
  assert.equal(fav.isFavorite('2025-2026-bahar', 'BLG', '100'), false);
});

test('program kaydına ekleme tekrar eklemez', () => {
  storeMap.clear();
  assert.equal(fav.addToSchedule('2025-2026-yaz', 'BLG', '100'), true);
  assert.equal(fav.addToSchedule('2025-2026-yaz', 'BLG', '100'), false);
  assert.equal(fav.loadSchedule().length, 1);
  fav.removeFromSchedule('2025-2026-yaz', 'BLG', '100');
  assert.equal(fav.loadSchedule().length, 0);
});

// ---- OBS CRN doldurma snippet'i ----

test('buildSnippet seçilen CRNleri koda gömer', () => {
  const code = buildSnippet(['30263', '30320']);
  assert.ok(code.includes("'30263'"));
  assert.ok(code.includes("'30320'"));
  assert.ok(code.startsWith('!function'));
  assert.ok(code.endsWith('}();'));
});

// ---- Alabilen programlar (r[10]) normalizasyonu ----

// Tarihsel dönemlerde alan tek öğeli virgüllü string olabiliyor; dropdown ve
// filtre her biçimi tekil kod listesine indirgemeli.
test('programList dizi ve virgüllü string girdiyi aynı listeye indirger', () => {
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0, '', '', ['AIN_LS', 'BIO_LS']]), ['AIN_LS', 'BIO_LS']);
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0, '', '', ['AIN_LS, BIO_LS, CEV_LS']]), ['AIN_LS', 'BIO_LS', 'CEV_LS']);
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0, '', '', 'BLG_LS; MAT_LS | TEK_LS']), ['BLG_LS', 'MAT_LS', 'TEK_LS']);
});

test('programList boş/eksik alanda boş liste döndürür', () => {
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0]), []);
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0, '', '', []]), []);
  assert.deepEqual(programList([null, '', '', '', '', '', 0, 0, '', '', null]), []);
});

// Row biçimi: [crn, kod, ad, branş, hoca, zaman, kontenjan, yazılan]
const row = (crn, code, when) => [crn, code, code, 'BLG', 'Hoca', when, 10, 0];

test('buildTimetable çakışmayı işaretler', () => {
  const rows = [
    row('1', 'BLG 101', 'Pazartesi 08:30/10:29'),
    row('2', 'BLG 102', 'Pazartesi 09:30/11:29'), // 101 ile 09:30-10:29 arası çakışır
    row('3', 'MAT 101', 'Salı 08:30/10:29'),
  ];
  const t = buildTimetable(rows);
  assert.equal(t.all.length, 3);

  const pzt = 0, sli = 0; // 08:30-08:59 slotu (startSlot 08:30)
  assert.equal(t.grid[pzt][sli].length, 1); // yalnızca BLG 101
  const mid = 2; // 09:30-09:59 slotu: her iki ders de burada
  assert.equal(t.grid[pzt][mid].length, 2);
});

test('buildTimetable çakışmayan derslerde boş hücre bırakır', () => {
  const rows = [row('1', 'BLG 101', 'Pazartesi 08:30/10:29'), row('2', 'MAT 101', 'Salı 08:30/10:29')];
  const t = buildTimetable(rows);
  for (let d = 0; d < 7; d++) {
    for (let si = 0; si < t.nSlots; si++) {
      const codes = [...new Set(t.grid[d][si].map((c) => c.row[1]))];
      assert.ok(codes.length <= 1, `çakışma olmamalı: gün ${d} slot ${si}`);
    }
  }
});
