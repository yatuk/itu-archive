// Saf frontend fonksiyonlarının testleri. Çalıştırma:
//   node --test docs/assets/core/
// (docs/package.json "type":"module" ile ES modüller olarak yüklenir.)

import test from 'node:test';
import assert from 'node:assert/strict';

import { fold, termLabel, buildingOf } from './utils.js';
import { fillBar, trendChart } from './chart.js';
import { sortValue, parseWhen, buildTimetable } from '../views/courses.js';

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
