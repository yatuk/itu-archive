// Saf frontend fonksiyonlarının testleri. Çalıştırma:
//   node --test docs/assets/core/
// (docs/package.json "type":"module" ile ES modüller olarak yüklenir.)

import test from 'node:test';
import assert from 'node:assert/strict';

import { fold, normSearch, searchMatch, trNum, termLabel, buildingOf, buildingName, parseTurkishDate, parseTurkishDateRange, calendarDayState, sessionHours, timeAgo, fillMeasured } from './utils.js';
import { fillBar, trendChart } from './chart.js';
import { splitInstructors, obsDeepLink, gradePassPct, gradeMode } from './course-detail.js';
import { sortValue, parseWhen, timeBucket, matchesDay, buildTimetable, programList } from '../views/courses.js';
import { parseReq, reqAlts } from '../prereq.js';
import { buildSnippet, parseTimeRange, examOverlap, finalsConflict, midtermWeeks } from '../views/program.js';
import { examToIcs } from '../views/exams.js';
import { topByCount } from '../views/history.js';
import { icsText, hashShort, foldLine, formatInt } from './utils.js';
import { methodToCode, codeToMethod, codeToSlug, slugToCode, scopeParams } from './urlcodes.js';
import { parseCodes } from './taken.js';
import * as fav from './favorites.js';

test('methodToCode/codeToMethod iki yönlü çevirir', () => {
  assert.equal(methodToCode('Fiziksel (Yüz yüze)'), 'f');
  assert.equal(methodToCode('Sanal (Çevrimiçi/Online)'), 'c');
  assert.equal(methodToCode('Bilinmeyen'), '');
  assert.equal(codeToMethod('f'), 'Fiziksel (Yüz yüze)');
  assert.equal(codeToMethod('x'), '');
});

test('codeToSlug/slugToCode çift yönlü (EHB 222E ↔ EHB-222E, BLG 102E)', () => {
  for (const code of ['EHB 222E', 'BLG 102E']) {
    const slug = codeToSlug(code);
    assert.ok(!slug.includes(' '), `${code} → boşluksuz slug: ${slug}`);
    assert.equal(slugToCode(slug), code);
  }
});

test('scopeParams görünüme göre parametreleri kapsar (term global)', () => {
  const p = new URLSearchParams('term=2026-2027-guz&time=ogle&level=LS&method=f&prog=CEN_LS');
  const scoped = scopeParams('onsart', p);
  assert.equal(scoped.get('term'), '2026-2027-guz');
  assert.equal(scoped.get('prog'), 'CEN_LS');
  assert.equal(scoped.get('time'), null);   // dersler'e ait, onsart'ta yok
  assert.equal(scoped.get('level'), null);
  assert.equal(scoped.get('method'), null);
});

test('parseCodes virgül/boşluk/satırla ayrılmış kodları temizler', () => {
  assert.deepEqual(parseCodes('blg 102e, MAT 101E\nCEN 102'), ['BLG 102E', 'MAT 101E', 'CEN 102']);
  assert.deepEqual(parseCodes('BLG 102E BLG 102E MAT 101E'), ['BLG 102E', 'MAT 101E']); // boşluk ayraçlı + tekrar
  assert.deepEqual(parseCodes('BLG102E'), ['BLG 102E']); // boşluksuz
  assert.deepEqual(parseCodes(''), []);
});

test('formatInt binlik ayracı nokta olarak koyar', () => {
  assert.equal(formatInt(7669), '7.669');
  assert.equal(formatInt(60), '60');
  assert.equal(formatInt(0), '0');
  assert.equal(formatInt(1234567), '1.234.567');
});

test('fold Türkçe karakterleri ASCII katar', () => {
  assert.equal(fold('İTÜ Mühendislik ŞŞ ĞĞ'), 'itu muhendislik ss gg');
  assert.equal(fold('BIL 100E'), 'bil 100e');
  assert.equal(fold(''), '');
});

test('normSearch boşluğu kaldırır — iki sekmede ortak arama anahtarı', () => {
  // "BLG 102E", "BLG102E" ve "BLG  102  E" aynı anahtarı üretmeli.
  assert.equal(normSearch('BLG 102E'), 'blg102e');
  assert.equal(normSearch('BLG102E'), 'blg102e');
  assert.equal(normSearch('BLG  102  E'), 'blg102e');
  // Türkçe karakterler de katlanır (fold Ş→s ASCII yapar).
  assert.equal(normSearch('Mühendislik  Gülşen'), 'muhendislikgulsen');
  assert.equal(normSearch(''), '');
});

test('searchMatch boşluksuz ve E-soneki farkını görmezden gelir', () => {
  // Hay normalizasyonlu gelir (normSearch): boşluksuz yazım eşleşir.
  assert.equal(searchMatch('blg102e', 'blg102edoğaldilişleme'), true);
  assert.equal(searchMatch('blg102e', 'blg102e'), true);
  // E-soneki: "BLG 102E" araması "BLG 102" dersini de bulur.
  assert.equal(searchMatch('blg102e', 'blg102'), true);
  assert.equal(searchMatch('blg102', 'blg102e'), true); // ters yön (boşluksuz hay alt-string)
  // E'siz kelime için E düşürme yok ("blg" → "blg" zaten; "eee" sonu e işe karışmaz).
  assert.equal(searchMatch('blg', 'blg102e'), true);
  // İlgisiz hay'da eşleşme yok.
  assert.equal(searchMatch('blg102e', 'turb101'), false);
  assert.equal(searchMatch('blg102', 'blg100'), false);
});

test('trNum Türkçe sayı biçimi: virgül, tam sayıda ,0 yok', () => {
  assert.equal(trNum(15), '15');
  assert.equal(trNum(15.0), '15');
  assert.equal(trNum(12.5), '12,5');
  assert.equal(trNum(3), '3');
  assert.equal(trNum(3.5), '3,5');
  assert.equal(trNum(null), '');
  assert.equal(trNum(undefined), '');
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

test('buildingName kodu resmî adla değiştirir', () => {
  const buildings = [
    { code: 'BBB', name: 'Bilgisayar ve Bilişim Binası' },
    { code: 'undeclared', name: 'İlgili Bölümce Açıklanacak' },
  ];
  assert.equal(buildingName('BBB', buildings), 'Bilgisayar ve Bilişim Binası');
  assert.equal(buildingName('undeclared', buildings), 'İlgili Bölümce Açıklanacak');
  // Eşleşme yoksa kod aynen döner (eski davranış).
  assert.equal(buildingName('XXX', buildings), 'XXX');
  assert.equal(buildingName('', buildings), '');
  assert.equal(buildingName('BBB', null), 'BBB');
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

test('calendarDayState ISO start/end varsa Türkçe metne tercih eder', () => {
  const today = new Date(2026, 7, 13); // 13 Ağustos 2026
  // JS'in çözemediği gömülü saatli aralık, ISO ile doğru sınıflandırılır.
  const iso = { start: '2026-08-10', end: '2026-08-15' };
  assert.deepEqual(calendarDayState('28 Eylül 10:00 - 02 Ekim 2026 17:00', today, iso),
    { past: false, now: true, label: 'Devam ediyor' });
  // ISO gelecekte: Türkçe metin çözülmese bile doğru.
  const future = calendarDayState('çözülemez', today, { start: '2026-09-10', end: '2026-09-11' });
  assert.equal(future.past, false);
  assert.ok(future.label.includes('gün kaldı'));
  // Bozuk ISO geri Türkçe metne düşer.
  assert.equal(calendarDayState('Belirsiz', today, { start: 'xx', end: '' }).label, '');
});

test('timeAgo kısa "ne kadar önce" metni üretir', () => {
  const now = Date.UTC(2026, 7, 13, 12, 0, 0);
  assert.equal(timeAgo('2026-08-13T12:00:00Z', now), 'şimdi');
  assert.equal(timeAgo('2026-08-13T11:56:00Z', now), '4 dk önce');
  assert.equal(timeAgo('2026-08-13T06:00:00Z', now), '6 sa önce');
  assert.equal(timeAgo('2026-08-10T12:00:00Z', now), '3 gün önce');
  assert.equal(timeAgo('bozuk', now), '');
});

test('fillMeasured ölçüm zamanı etiketi üretir; zamansız boş', () => {
  const now = Date.UTC(2026, 7, 13, 12, 0, 0);
  assert.equal(fillMeasured('2026-08-13T06:00:00Z', now), 'en son 6 sa önce ölçüldü');
  assert.equal(fillMeasured('2026-08-10T12:00:00Z', now), 'en son 3 gün önce ölçüldü');
  assert.equal(fillMeasured('', now), '');
  assert.equal(fillMeasured(null, now), '');
  assert.equal(fillMeasured('bozuk', now), '');
});

test('splitInstructors çoklu hocayı ayırır', () => {
  assert.deepEqual(splitInstructors('Burak Berk Üstündağ, Gökhan İnce'), ['Burak Berk Üstündağ', 'Gökhan İnce']);
  assert.deepEqual(splitInstructors('A; B | C'), ['A', 'B', 'C']);
  assert.deepEqual(splitInstructors('Tek Hoca'), ['Tek Hoca']);
  assert.deepEqual(splitInstructors(''), []);
  assert.deepEqual(splitInstructors(null), []);
  assert.deepEqual(splitInstructors('  '), []);
});

test('obsDeepLink koddan OBS katalog formu bağlantısı üretir', () => {
  assert.equal(obsDeepLink('BLG 102E'),
    'https://obs.itu.edu.tr/public/DersKatalog/DersKatalogBilgiBransDersKodu?bransKodu=BLG&dersNo=102');
  assert.ok(obsDeepLink('MAT 101').includes('bransKodu=MAT&dersNo=101'));
  assert.equal(obsDeepLink(''), '');
  assert.equal(obsDeepLink('ders'), '');
});

test('gradePassPct ≥CC+ geçme oranını yüzde yapar', () => {
  // AKM 204: AA 42, BA+ 33, BB+ 32, CB+ 34, CC+ 16, FF 19 — toplam 633
  const g = { AA: 42, 'BA+': 33, 'BB+': 32, 'CB+': 34, 'CC+': 16, FF: 19 };
  const pct = gradePassPct(g, 633);
  assert.ok(pct > 0 && pct <= 100);
  assert.equal(gradePassPct(g, 0), 0);
  assert.equal(gradePassPct({}, 10), 0);
});

test('gradeMode en sık harf notunu ve yüzdesini verir', () => {
  const g = { AA: 25, 'BA+': 6, VF: 42, FF: 19 };
  const mode = gradeMode(g, 239);
  assert.equal(mode.grade, 'VF');
  assert.equal(mode.pct, Math.round((42 / 239) * 100));
  assert.equal(gradeMode({}, 10).grade, '—');
});

test('sessionHours oturum sürelerini toplar ve yuvarlar', () => {
  assert.equal(sessionHours(['08:30/11:29']), 3);
  assert.equal(sessionHours(['08:30/11:29', '13:00/15:59']), 6);
  assert.equal(sessionHours(['09:00/12:00', '13:00/16:00', '18:00/21:00']), 9);
  assert.equal(sessionHours([]), 0);
  assert.equal(sessionHours(null), 0);
  assert.equal(sessionHours(['Ders saati ilan edilecek']), 0);
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

test('trendChart dönem bazında SVG üretir (iç içe çubuk + tam etiket)', () => {
  const byTerm = new Map([
    ['2025-2026-guz', [{ cap: 50, enr: 30 }, { cap: 50, enr: 40 }]],
    ['2025-2026-bahar', [{ cap: 60, enr: 60 }]],
  ]);
  const svg = trendChart(byTerm);
  assert.ok(svg.startsWith('<figure class="trend">'));
  assert.ok(svg.includes('<svg'));
  // Dönem başına bir iç içe çubuk (kontenjan çerçeve + doluluk dolu).
  assert.equal((svg.match(/<rect /g) || []).length, 4);
  assert.ok(svg.includes('>2026 Güz<'));
  assert.ok(svg.includes('>2026 Bahar<'));
  // 8'den az dönem: "hepsini göster" yok; kronolojik sıra.
  assert.ok(!svg.includes('t-more'));
});

test('trendChart 8+ dönemde "hepsini göster" üretir, limit=0 hepsini çizer', () => {
  const byTerm = new Map();
  for (let i = 0; i < 14; i++) {
    const slug = `20${String(20 + Math.floor(i / 3)).padStart(2, '0')}-20${String(20 + Math.floor(i / 3) + 1).slice(2)}-${['guz', 'bahar', 'yaz'][i % 3]}`;
    byTerm.set(slug, [{ cap: 60, enr: 40 + i }]);
  }
  const svg8 = trendChart(byTerm);
  assert.ok(svg8.includes('t-more')); // >8 dönem → hepsini göster
  assert.equal((svg8.match(/<rect /g) || []).length, 16); // 8 × 2
  const svgAll = trendChart(byTerm, 0);
  assert.ok(!svgAll.includes('t-more'));
  assert.equal((svgAll.match(/<rect /g) || []).length, 28); // 14 × 2
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

test('parseTimeRange "HH:MM-HH:MM"i dakikaya çevirir', () => {
  assert.deepEqual(parseTimeRange('09:00-11:00'), [540, 660]);
  assert.deepEqual(parseTimeRange('13:30-16:00'), [810, 960]);
  assert.equal(parseTimeRange('09:00'), null);
  assert.equal(parseTimeRange(''), null);
  assert.equal(parseTimeRange(null), null);
});

test('examOverlap aynı gün + örtüşen saatte true', () => {
  const a = { date: '13 Ağustos 2026', time: '09:00-11:00' };
  const b = { date: '13 Ağustos 2026', time: '10:00-12:00' };
  const c = { date: '13 Ağustos 2026', time: '11:00-13:00' }; // bitişik, örtüşme yok
  const d = { date: '14 Ağustos 2026', time: '09:00-11:00' }; // farklı gün
  assert.equal(examOverlap(a, b), true);
  assert.equal(examOverlap(a, c), false);
  assert.equal(examOverlap(a, d), false);
  assert.equal(examOverlap({ date: 'X', time: 'bozuk' }, { date: 'X', time: '09:00-11:00' }), false);
});

test('finalsConflict seçili şubelerde çakışan finalleri bulur', () => {
  const exams = [
    { crn: '10001', code: 'BLG 101', date: '13 Ağustos 2026', time: '09:00-11:00' },
    { crn: '10002', code: 'MAT 101', date: '13 Ağustos 2026', time: '10:00-12:00' },
    { crn: '10003', code: 'BLG 101', date: '13 Ağustos 2026', time: '13:00-15:00' }, // aynı ders — sayılmaz
    { crn: '10004', code: 'FIZ 101', date: '15 Ağustos 2026', time: '09:00-11:00' },
  ];
  const conf = finalsConflict(exams, ['10001', '10002', '10003', '10004']);
  assert.equal(conf.length, 1); // yalnızca BLG 101 × MAT 101
  assert.equal(conf[0][0].code + '×' + conf[0][1].code, 'BLG 101×MAT 101');
  assert.equal(finalsConflict(exams, ['10003', '10004']).length, 0);
  assert.equal(finalsConflict([], ['1']).length, 0);
});

test('icsText VEVENT satırları üretir', () => {
  const out = icsText([
    { uid: 'a', title: 'Ders Başı; Hazırlık', startISO: '2026-09-07', endISO: '2026-09-07' },
    { uid: 'b', title: 'Sınav', startISO: '2026-08-13T09:00:00', endISO: '2026-08-13T11:00:00', desc: 'Final' },
  ], '2026-08-13T00:00:00');
  assert.ok(out.startsWith('BEGIN:VCALENDAR'));
  assert.ok(out.includes('DTSTART:20260907'));
  assert.ok(out.includes('DTSTART:20260813T090000'));
  assert.ok(out.includes('SUMMARY:Ders Başı\\; Hazırlık'));
  assert.ok(out.includes('DESCRIPTION:Final'));
  assert.ok(out.endsWith('END:VCALENDAR'));
});

test('icsText RRULE satırını ekler (Faz 4.5 yinelenen oturum)', () => {
  const out = icsText([
    { uid: 'x', title: 'Ders', startISO: '2026-09-07T09:00:00', endISO: '2026-09-07T11:00:00', rrule: 'FREQ=WEEKLY;COUNT=14' },
  ], '2026-08-13T00:00:00');
  assert.ok(out.includes('RRULE:FREQ=WEEKLY;COUNT=14'));
});

test('midtermWeeks katalog haftalık konularından ara sınav haftalarını sayar', () => {
  const recs = [
    { weeklyTopics: ['Hafta 1 — Giriş', 'Hafta 7 — Konular + Ara Sınav I', 'Hafta 8 — Konu'] },
    { weeklyTopics: ['Hafta 7 — Ara Sınav II', 'Hafta 12 — Final öncesi'] },
  ];
  const mw = midtermWeeks(recs);
  assert.equal(mw.get('Hafta 7'), 2);
  assert.equal(mw.get('Hafta 12'), undefined); // "final öncesi" ara sınav değil
  assert.equal(mw.size, 1);
  assert.equal(midtermWeeks([]).size, 0);
  assert.equal(midtermWeeks([{ weeklyTopics: [] }]).size, 0);
  assert.equal(midtermWeeks(null).size, 0);
});

test('hashShort deterministik ve kısa (ics uid)', () => {
  const a = hashShort('854|Ders Başı'), b = hashShort('854|Ders Başı');
  assert.equal(a, b);
  assert.equal(a.length, 8);
  assert.notEqual(a, hashShort('854|Ders Bitiş'));
});

test('foldLine uzun satırı 75 oktette devam satırlarına böler', () => {
  const long = 'x'.repeat(160);
  const folded = foldLine(long);
  const segs = folded.split('\r\n');
  assert.ok(segs.length > 1, 'katlanmalı');
  assert.ok(segs[0].length <= 75, 'ilk satır ≤75');
  for (const s of segs.slice(1)) {
    assert.ok(s.startsWith(' '), 'devam satırı boşlukla başlar');
  }
  assert.equal(foldLine('kısa'), 'kısa');
});

test('topByCount sayısal alana göre azalan sıralar; eşitlikte ad alfabetik', () => {
  const rows = [['A', 'x', 3], ['B', 'y', 9], ['C', 'z', 1]];
  const top = topByCount(rows, 2, 2);
  assert.deepEqual(top.map((r) => r[0]), ['B', 'A']);
  assert.equal(topByCount(rows, 2, 0).length, 0);
  // Eşit sayıda → ad alfabetik (deterministik, diff gürültüsü olmasın).
  const ties = [['Zeynep', 'z', 5], ['Ali', 'a', 5], ['Mehmet', 'm', 5]];
  assert.deepEqual(topByCount(ties, 2, 3).map((r) => r[0]), ['Ali', 'Mehmet', 'Zeynep']);
  // Kart alt satırı için dönem/şube alanları dolu gelmeli (shard harfi değil).
  const people = [['Gülşah Sönmez', 'g', 18, 24]];
  const p = topByCount(people, 3, 1)[0];
  assert.equal(p[2], 18); // dönem
  assert.equal(p[3], 24); // şube
});

test('examToIcs Türkçe tarih + saat aralığını ISO zamanlı etkinliğe çevirir', () => {
  const ev = examToIcs({
    crn: '30054', code: 'SSI 518', name: 'Pazarlama Yönetimi', type: 'Final Sınavı',
    instructor: 'Elif Karaosmanoğlu', place: 'A101', date: '13 Ağustos 2026', time: '09:00-11:00',
  });
  assert.ok(ev);
  assert.equal(ev.startISO, '2026-08-13T09:00:00');
  assert.equal(ev.endISO, '2026-08-13T11:00:00');
  assert.ok(ev.title.includes('SSI 518'));
  assert.equal(examToIcs({ date: 'çözülemez', time: '09:00-11:00' }), null);
  assert.equal(examToIcs({ date: '13 Ağustos 2026', time: 'bozuk' }), null);
});
