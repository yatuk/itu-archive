// Saf frontend fonksiyonlarının testleri. Çalıştırma:
//   node --test docs/assets/core/
// (docs/package.json "type":"module" ile ES modüller olarak yüklenir.)

import test from 'node:test';
import assert from 'node:assert/strict';

import { fold, normSearch, searchMatch, matchRow, markField, suggestDrop, trNum, termLabel, buildingOf, buildingName, parseTurkishDate, parseTurkishDateRange, calendarDayState, sessionHours, timeAgo, fillMeasured } from './utils.js';
import { fillBar, quotaDisplay, quotaState, trendChart } from './chart.js';
import { splitInstructors, obsDeepLink, gradePassPct, gradeMode } from './course-detail.js';
import { sortValue, parseWhen, timeBucket, matchesDay, buildTimetable, programList, groupCourseRows } from '../views/courses.js';
import { parseReq, reqAlts } from '../prereq.js';
import { buildSnippet, parseTimeRange, examOverlap, finalsConflict, midtermWeeks } from '../views/program.js';
import { examToIcs } from '../views/exams.js';
import { topByCount } from '../views/history.js';
import { icsText, hashShort, foldLine, formatInt } from './utils.js';
import { methodToCode, codeToMethod, codeToSlug, slugToCode, scopeParams } from './urlcodes.js';
import { parseCodes } from './taken.js';
import { codeKey, sectionsForCode, joinCourse, joinElective, parseRange, itemLoad, semesterLoad, fmtLoad, planSummary, canonicalCode, codesMatch, groupSections, crnRangeText, courseMetaLabel, creditBadge } from './plan.js';
import { GRADE_POINTS, EXEMPT, calcGPA, latestOnly, progress, targetNeeded, fmtTr2 } from './grades.js';
import { setGrade, setRepeat, setElective, buildEntries, exportJSON, importJSON, typeBuckets } from './planstore.js';
import * as fav from './favorites.js';
import { formatProgramLabel, normalizeProgramLevel, programLevelLabel } from './programs.js';

test('program etiketleri kod, ad ve açık seviye adıyla her zaman doludur', () => {
  assert.equal(normalizeProgramLevel('', 'CEN_LS'), 'LS');
  assert.equal(normalizeProgramLevel('LU'), 'YL');
  assert.equal(programLevelLabel('LS', 'tr'), 'Lisans');
  assert.equal(formatProgramLabel('CEN_LS', { name: 'Bilgisayar Mühendisliği (İngilizce) (KKTC) Lisans' }), 'CEN_LS · Bilgisayar Mühendisliği (İngilizce) (KKTC) · Lisans');
  assert.equal(formatProgramLabel('ABC_OL', { name: '' }), 'ABC_OL · Program adı arşivde bulunamadı · Önlisans');
});

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

  const eski = new URLSearchParams('fopen=1&fhide=1&taken=1');
  assert.equal(scopeParams('dersplanim', eski).get('fopen'), '1');
  assert.equal(scopeParams('dersplanim', eski).get('fhide'), null);
  assert.equal(scopeParams('dersler', eski).get('taken'), null);
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

test('normSearch boşluğu kaldırır · iki sekmede ortak arama anahtarı', () => {
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

// Alan bazlı arama eşleştirmesi (matchRow): alanlar courses.js'teki gibi
// normalize edilir — kod boşluksuz (normSearch), ad/hoca boşluklu (fold).
const searchFields = (o) => ({
  crn: fold(o.crn ?? ''),
  code: normSearch(o.code ?? ''),
  name: fold(o.name ?? ''),
  instructor: fold(o.instructor ?? ''),
});

test('matchRow: "engineering ma" BLG 411E eşleşmez (kısa terim kelime ortasında)', () => {
  const f = searchFields({ crn: '12345', code: 'BLG 411E', name: 'Software Engineering', instructor: 'Tolga Ovatman' });
  // "engineering" ad kelime başında ama "ma" (2 karakter) yalnızca kelime başından
  // eşleşir — "Ovatman" içinde ortada, kod/ad/crn'de yok → terim elenir.
  assert.equal(matchRow(['engineering', 'ma'], f), null);
});

test('matchRow: "blg411e" / "BLG 411E" / "blg 411" BLG 411E eşleştirir', () => {
  const f = searchFields({ crn: '12345', code: 'BLG 411E', name: 'Software Engineering', instructor: 'Tolga Ovatman' });
  assert.ok(matchRow(['blg411e'], f), 'boşluksuz kod');
  assert.ok(matchRow(['blg', '411e'], f), '"BLG 411E" iki terime bölünür');
  assert.ok(matchRow(['blg', '411'], f), '"blg 411" kod ortası eşleşmesi (411 ≥3 karakter)');
  // E-sonek: "BLG 102E" araması "BLG 102" dersini de bulur.
  const g = searchFields({ crn: '1', code: 'BLG 102', name: 'Doğal Dil İşleme', instructor: 'X' });
  assert.ok(matchRow(['blg102e'], g), 'E-sonek kod alanında yok sayılır');
});

test('matchRow: tek terim hoca eşleşmesi geçerli ("ovatman")', () => {
  const f = searchFields({ crn: '12345', code: 'BLG 411E', name: 'Software Engineering', instructor: 'Tolga Ovatman' });
  const m = matchRow(['ovatman'], f);
  assert.ok(m);
  assert.equal(m.hits[0].field, 'instructor');
});

test('matchRow: çok terimde yalnızca hoca eşleşmesi sonuç üretmez', () => {
  const f = searchFields({ crn: '12345', code: 'BLG 411E', name: 'Software Engineering', instructor: 'Tolga Ovatman' });
  // İki terim de yalnızca hoca alanında (kod/ad eşleşmesi yok) → çoklu hoca eşleşmesi elenir.
  assert.equal(matchRow(['tolga', 'ovatman'], f), null);
});

test('matchRow: ad kelime başı hoca kelime başından önce skorlanır', () => {
  const nameHit = matchRow(['software'], searchFields({ code: 'BLG 411E', name: 'Software Engineering', instructor: 'Zeynep' }));
  const instrHit = matchRow(['software'], searchFields({ code: 'BLG 512E', name: 'Algorithms', instructor: 'Software Ovatman' }));
  assert.ok(nameHit && instrHit);
  assert.ok(nameHit.score > instrHit.score, 'ad kelime başı hoca kelime başından üstte');
});

test('matchRow: "ısı"↔"isi", "İST"↔"ist" karşılıklı (fold katlar)', () => {
  const isi = searchFields({ code: 'ISI 201E', name: 'Isı Transferi', instructor: 'Z' });
  assert.ok(matchRow(['isi'], isi), '"ısı" araması "Isı"yı bulur');
  assert.ok(matchRow(['isi'], searchFields({ code: 'ISI 201E', name: 'Isı Transferi', instructor: 'Z' })));
  const ist = searchFields({ code: 'IST 102E', name: 'İstatistik', instructor: 'Z' });
  assert.ok(matchRow(['ist'], ist), '"İST" araması "ist" koduyla bulur');
});

test('matchRow: "ma" kelime başı verir, Ovatman\'ı vermez', () => {
  assert.ok(matchRow(['ma'], searchFields({ code: 'MAT 101E', name: 'Matematik', instructor: 'A' })), '"ma" Matematikte kelime başı');
  assert.ok(matchRow(['ma'], searchFields({ code: 'MAL 201', name: 'Malzeme Bilimi', instructor: 'B' })), '"ma" Malzemede kelime başı');
  assert.equal(matchRow(['ma'], searchFields({ code: 'BLG 411E', name: 'Software Engineering', instructor: 'Tolga Ovatman' })), null, '"ma" Ovatman içinde ortada');
});

test('markField: kod alanında boşluk geri eşlemesi', () => {
  assert.equal(markField('BLG 411E', 'code', [{ at: 0, len: 6 }]), '<mark>BLG 411</mark>E');
  assert.equal(markField('BLG 411E', 'code', [{ at: 3, len: 3 }]), 'BLG <mark>411</mark>E');
  assert.equal(markField('Software Engineering', 'name', [{ at: 0, len: 8 }]), '<mark>Software</mark> Engineering');
  // Örtüşen aralıklar birleşir; vuruş yoksa metin aynen kalır.
  assert.equal(markField('BLG 411E', 'code', [{ at: 0, len: 6 }, { at: 0, len: 3 }]), '<mark>BLG 411</mark>E');
  assert.equal(markField('BLG 411E', 'code', null), 'BLG 411E');
});

test('suggestDrop en kesin terimi önerir (engineering ma → engineering)', () => {
  // "ma" düşünce "engineering" az sonuç verir (kesin); "engineering" düşünce
  // "ma" çok sonuç verir (gürültü). En az sonuç bırakanı düşür → 'engineering' öner.
  const countFor = (sub) => (sub.length === 1 && sub[0] === 'engineering' ? 1 : 50);
  assert.equal(suggestDrop(['engineering', 'ma'], countFor), 1); // 'ma' düşer
  // Hiçbir alt küme sonuç vermiyorsa öneri yok.
  assert.equal(suggestDrop(['x', 'y'], () => 0), -1);
  // Tek terimde düşürme anlamsız.
  assert.equal(suggestDrop(['engineering'], countFor), -1);
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
  assert.equal(gradeMode({}, 10).grade, '·');
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
  assert.equal(fillBar(0, 5), '·');
  const html = fillBar(50, 25);
  assert.ok(html.includes('%50'));
  assert.ok(html.includes('bar'));
});

test('fillBar tam ve kritik doluluk sınıflarını verir', () => {
  assert.ok(fillBar(10, 10).includes('full'));
  assert.ok(fillBar(20, 18).includes('tight'));
  assert.ok(fillBar(20, 10).includes('bar '));
});

test('fillBar detail varyantı: yazılan/kapasite · %pct + aynı sınıflar', () => {
  const d = fillBar(60, 40, { detail: true });
  assert.ok(d.includes('40 / 60 · %67'), d);
  assert.ok(d.includes('bar '), 'tight sınıfı eklenmezken bar mevcut');
  const full = fillBar(60, 60, { detail: true });
  assert.ok(full.includes('60 / 60 · %100') && full.includes('full'), full);
  const tight = fillBar(60, 55, { detail: true });
  assert.ok(tight.includes('tight'), tight);
  // Varsayılan davranış değişmez.
  assert.ok(!fillBar(60, 40).includes('40 / 60'));
});

test('quotaState karar için kalan yeri ve durumu hesaplar', () => {
  assert.deepEqual(quotaState(0, 5), { capacity: 0, enrolled: 5, remaining: 0, pct: 0, kind: 'unknown' });
  assert.equal(quotaState(50, 34).kind, 'open');
  assert.deepEqual(quotaState(50, 47), { capacity: 50, enrolled: 47, remaining: 3, pct: 94, kind: 'tight' });
  assert.equal(quotaState(50, 50).kind, 'full');
  assert.equal(quotaState(50, 52).remaining, 0);
});

test('quotaDisplay sade metni tek oranla, fosforu eski çubukla üretir', () => {
  const open = quotaDisplay(50, 34, { legacyCounts: true });
  assert.ok(open.includes('34 / 50'));
  assert.ok(!open.match(/quota-sade[^>]*>[^<]*%68/));
  assert.ok(open.includes('34/50 · <span class="fill">%68'));

  const tight = quotaDisplay(50, 47);
  assert.ok(tight.includes('47 / 50 · <span class="quota-state tight">3 yer</span>'));
  const full = quotaDisplay(50, 52, { detail: true });
  assert.ok(full.includes('52 kayıtlı · 50 kontenjan'));
  assert.ok(full.includes('quota-state full">dolu'));
  assert.equal(quotaDisplay(0, 5), '·');
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

test('groupCourseRows aynı dersin şubelerini sırayı bozmadan tek grupta toplar', () => {
  const rows = [
    ['10001', 'TUR 101', 'Türk Dili I', 'TUR'],
    ['10002', 'TUR 101', 'Türk Dili I', 'TUR'],
    ['20001', 'MAT 101', 'Matematik I', 'MAT'],
  ];
  const groups = groupCourseRows(rows);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].code, 'TUR 101');
  assert.deepEqual(groups[0].rows.map((row) => row[0]), ['10001', '10002']);
  assert.equal(groups[1].rows[0][0], '20001');
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
    { weeklyTopics: ['Hafta 1 · Giriş', 'Hafta 7 · Konular + Ara Sınav I', 'Hafta 8 · Konu'] },
    { weeklyTopics: ['Hafta 7 · Ara Sınav II', 'Hafta 12 · Final öncesi'] },
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

test('codeKey kodu büyük/küçük + boşluktan bağımsız tek anahtara indirger', () => {
  assert.equal(codeKey('BLG 102E'), 'BLG102E');
  assert.equal(codeKey('blg 102e'), 'BLG102E');
  assert.equal(codeKey(''), '');
});

// Madde 1-2: OBS çift kod basabilir ("SAO 101E SAO 101"); kanonik kod tek kaynaktır,
// eşleştirme E sonekini iki yönlü esnetir.
test('canonicalCode çift koddan E sonekli tek kanonik kodu üretir', () => {
  assert.equal(canonicalCode('SAO 101E SAO 101'), 'SAO 101E');
  assert.equal(canonicalCode('SAO 103 SAO 103E'), 'SAO 103E'); // sıralama ters
  assert.equal(canonicalCode('SAO 107E SAO 107'), 'SAO 107E');
  assert.equal(canonicalCode('TUR 121'), 'TUR 121');           // tek kod
  assert.equal(canonicalCode('BLG 102E'), 'BLG 102E');
  assert.equal(canonicalCode(''), '');
  assert.equal(canonicalCode('   '), '');
});

test('codesMatch "SAO 101E" ↔ "SAO 101" her iki yönde eşleşir', () => {
  assert.equal(codesMatch('SAO 101E', 'SAO 101'), true);
  assert.equal(codesMatch('SAO 101', 'SAO 101E'), true);
  assert.equal(codesMatch('BLG 411E', 'BLG 411'), true);
  assert.equal(codesMatch('BLG 411', 'BLG 411E'), true);
  assert.equal(codesMatch('BLG 411E', 'BLG 411E'), true);
  assert.equal(codesMatch('BLG 411', 'BLG 411'), true);
  assert.equal(codesMatch('BLG 411E', 'TUR 101'), false);
  assert.equal(codesMatch('BLG 411', 'BLG 411E1'), false);
  assert.equal(codesMatch('', 'BLG 411'), false);
});

// Kök hata regresyonu: çift kodlu plan satırı ("SAO 101E SAO 101") dönem şubesi
// "SAO 101E" ile eşleşmeli — join "eşleşme bulunamadı" dönmemeli.
test('joinCourse çift kodlu plan kalemini dönem şubesiyle eşleştirir', () => {
  const rows = [['10001', 'SAO 101E', 'Fund. Prog I', 'SAO', 'Hoca', 'Pazartesi', 60, 30, 'OL', 'Fiziksel', 'SAO_OL']];
  const st = joinCourse('SAO 101E SAO 101', rows, {});
  assert.equal(st.state, 'open');
  assert.equal(st.sections.length, 1);
  assert.equal(sectionsForCode(rows, 'SAO 101E SAO 101').length, 1);
});

// Madde 7: aynı zaman/kontenjanlı şubeler tek satıra iner.
test('groupSections kopya şubeleri CRN aralığı + sayıyla gruplar', () => {
  const sections = [
    { crn: '10008', when: 'Cuma 08:30/10:29', cap: 60, enr: 10, instructor: '', branch: 'TUR' },
    { crn: '10009', when: 'Cuma 08:30/10:29', cap: 60, enr: 10, instructor: '', branch: 'TUR' },
    { crn: '10010', when: 'Cuma 08:30/10:29', cap: 60, enr: 10, instructor: '', branch: 'TUR' },
    { crn: '20001', when: 'Salı 13:00/15:59', cap: 60, enr: 10, instructor: '', branch: 'TUR' },
  ];
  const groups = groupSections(sections);
  assert.equal(groups.length, 2);
  const g = groups[0];
  assert.equal(g.count, 3);
  assert.deepEqual(g.crns, ['10008', '10009', '10010']);
  assert.equal(g.label, '10008–10010');
  assert.equal(groups[1].count, 1);
  // Farklı kontenjan/saat gruplanmaz.
  assert.equal(groupSections([
    { crn: '1', when: 'Cuma 08:30/10:29', cap: 60, enr: 10 },
    { crn: '2', when: 'Cuma 08:30/10:29', cap: 45, enr: 10 },
  ]).length, 2);
  assert.equal(groupSections([]).length, 0);
});

// Kritik: gruplama YALNIZCA veri döndürür — hiçbir alan HTML ("<") içermez.
// Render tarafı textContent kullanır; HTML string üretimi tamamen bırakıldı.
test('groupSections çıktısında hiçbir alan "<" içermez', () => {
  const groups = groupSections([
    { crn: '10008', when: 'Cuma 08:30/10:29', cap: 60, enr: 10, instructor: 'Hoca A', branch: 'TUR', code: 'TUR 101' },
    { crn: '10009', when: 'Cuma 08:30/10:29', cap: 60, enr: 10, instructor: 'Hoca A', branch: 'TUR', code: 'TUR 101' },
  ]);
  for (const g of groups) {
    for (const [k, v] of Object.entries(g)) {
      assert.ok(!String(v).includes('<'), `${k} alanı "<" içeriyor: ${JSON.stringify(v)}`);
    }
    assert.ok(!g.label.includes('<'), g.label);
    assert.deepEqual(g.crns, ['10008', '10009']);
    assert.equal(g.count, 2);
  }
});

// Hoca bilgisi "-" yedek işaretiyse kolon gizlenmeli (boş sayılır).
test('groupSections "-" hoca işaretini boş sayar', () => {
  const g = groupSections([{ crn: '1', when: 'Cuma', cap: 60, enr: 10, instructor: '-' }]);
  assert.equal(g[0].instructor, '');
  const g2 = groupSections([{ crn: '1', when: 'Cuma', cap: 60, enr: 10, instructor: 'Hoca A' }]);
  assert.equal(g2[0].instructor, 'Hoca A');
});

test('crnRangeText bitişik aralığı tireyle, kopukları virgülle yazar', () => {
  assert.equal(crnRangeText(['10008', '10009', '10010']), '10008–10010');
  assert.equal(crnRangeText(['10008', '10011']), '10008, 10011');
  assert.equal(crnRangeText(['10008']), '10008');
  assert.equal(crnRangeText([]), '');
  assert.equal(crnRangeText(['ABC-1', 'ABC-2']), 'ABC-1, ABC-2'); // sayısal değil
});

// Madde 8: kredisiz derste "0 kr" basılır, birim tek başına kalmaz.
test('courseMetaLabel kredisiz derste "0 kr" yazar', () => {
  assert.equal(courseMetaLabel({ credits: 0, ects: 2, theory: 2, tutorial: 0, lab: 0 }), '2+0+0 · 0 kr · 2 AKTS');
  assert.equal(courseMetaLabel({ credits: 4, ects: 5, theory: 3, tutorial: 2, lab: 0 }), '3+2+0 · 4 kr · 5 AKTS');
  assert.equal(courseMetaLabel({ ects: 2, theory: 2 }), '2+0+0 · 0 kr · 2 AKTS'); // credits eksik
});

test('joinCourse açık/kapalı/eşleşmeyen üç durumu ayırır', () => {
  // search.json satırı: [crn, kod, ad, branş, hoca, zaman, kont, yazılan, seviye, yöntem, programlar]
  const rows = [
    ['10001', 'BLG 101E', 'Intr.', 'BLG', 'Hoca A', 'Pazartesi', 100, 60, 'LS', 'Fiziksel', 'BLG_LS'],
    ['10002', 'BLG 101E', 'Intr.', 'BLG', 'Hoca B', 'Salı', 100, 100, 'LS', 'Fiziksel', 'BLG_LS'],
    ['10003', 'MAT 103E', 'Math I', 'MAT', 'Hoca C', 'Çarşamba', 50, 10, 'LS', 'Fiziksel', 'BLG_LS'],
  ];
  const hist = {
    'BLG 101E': { code: 'BLG 101E', terms: ['2023-2024-guz', '2024-2025-bahar'] },
    'CEN 102': { code: 'CEN 102', terms: ['2022-2023-guz'] },
  };
  // açık: bu dönem iki şubesi var
  const open = joinCourse('BLG 101E', rows, hist);
  assert.equal(open.state, 'open');
  assert.equal(open.sections.length, 2);
  assert.equal(open.sections[0].crn, '10001');
  // kapalı: bu dönem yok ama geçmişte açıldı — son açılış tarihi döner
  const closed = joinCourse('CEN 102', rows, hist);
  assert.equal(closed.state, 'closed');
  assert.equal(closed.lastTerm, '2022-2023-guz');
  // eşleşme yok: ne bu dönem ne geçmişte
  assert.equal(joinCourse('XYZ 999', rows, hist).state, 'missing');
  // E-soneksiz sorgu da açık dersi bulur
  assert.equal(joinCourse('BLG 101', rows, hist).state, 'open');
});

test('sectionsForCode İngilizce-E sonekini esnetir', () => {
  const rows = [['1', 'BLG 102E', 'CS', 'BLG', '', '', 0, 0]];
  assert.equal(sectionsForCode(rows, 'BLG 102').length, 1);
  assert.equal(sectionsForCode(rows, 'BLG 102E').length, 1);
  assert.equal(sectionsForCode(rows, 'BLG 112').length, 0);
});

test('parseRange kredi/AKTS aralığını sayı dizisine çevirir', () => {
  assert.deepEqual(parseRange('4 / 5', [0]), [4, 5]);
  assert.deepEqual(parseRange('3', [0]), [3]);
  assert.deepEqual(parseRange('4,5', [0]), [4.5]); // Türkçe virgül
  assert.deepEqual(parseRange('', [0]), [0]);
  assert.deepEqual(parseRange('', [2]), [2]);
});

test('semesterLoad aralıklı seçmeli slotta toplamı aralık döndürür', () => {
  const sem = {
    title: '1. Yarıyıl',
    items: [
      { course: { code: 'A', credits: 3, ects: 6 } },
      { course: { code: 'B', credits: 2, ects: 4 } },
      // seçmeli slot: kredi aralıklı, AKTS [4,5,6] — tek ders seçilmediği için
      // toplam aralık olarak kalmalı.
      { elective: { title: 'Seçmeli', credits: '4 / 5', ects: [4, 5, 6], options: [] } },
    ],
  };
  const load = semesterLoad(sem);
  assert.deepEqual(load.credits, { min: 9, max: 10 });
  assert.deepEqual(load.ects, { min: 14, max: 16 });
  assert.equal(load.credits.min + load.ects.max, 25);
});

test('semesterLoad tek değerli kalemlerde tek sayı döner', () => {
  const sem = {
    title: '1. Yarıyıl',
    items: [{ course: { code: 'A', credits: 3, ects: 6 } }],
  };
  assert.equal(semesterLoad(sem).credits, 3);
  assert.equal(semesterLoad(sem).ects, 6);
});

test('planSummary açık/kapalı/seçmeli slot özetini hesaplar', () => {
  const plan = {
    programCode: 'BLG_LS', totalCredits: '134', totalEcts: '245',
    semesters: [{
      title: '1. Yarıyıl',
      items: [
        { course: { code: 'BLG 101E', credits: 3 } },
        { course: { code: 'CEN 102', credits: 3 } },
        { course: { code: 'XYZ 999', credits: 3 } },
        { elective: { title: 'ITB', credits: '3 / 4', ects: [5, 6], options: [
          { code: 'BLG 101E' }, { code: 'XYZ 999' },
        ] } },
      ],
    }],
  };
  const rows = [['1', 'BLG 101E', '', 'BLG', '', '', 10, 0]];
  const hist = { 'CEN 102': { code: 'CEN 102', terms: ['2022-2023-guz'] } };
  const s = planSummary(plan, rows, hist);
  assert.equal(s.courses, 3);
  assert.equal(s.open, 1);
  assert.equal(s.closed, 1);
  assert.equal(s.missing, 1);
  assert.equal(s.slots, 1);
  assert.equal(s.slotOpen, 1); // BLG 101E alternatifi açık
  assert.equal(s.totalCredits, '134');
});

test('GRADE_POINTS eksiksiz ölçeği içerir (AA..VF, muaf ayrı)', () => {
  assert.equal(GRADE_POINTS.AA, 4.0);
  assert.equal(GRADE_POINTS.FF, 0.0);
  assert.equal(GRADE_POINTS['BA+'], 3.75);
  assert.equal(GRADE_POINTS.DD, 1.0);
  assert.ok(EXEMPT.has('M') && EXEMPT.has('G') && EXEMPT.has('BL') && EXEMPT.has('E'));
  assert.equal(GRADE_POINTS.M, undefined);
});

test('calcGPA: AA 3 kredi + FF 3 kredi → 2,00 (FF paydada sayılır)', () => {
  const gpa = calcGPA([{ credits: 3, grade: 'AA' }, { credits: 3, grade: 'FF' }]);
  assert.ok(gpa !== null);
  assert.ok(Math.abs(gpa - 2.0) < 1e-9);
  // VF de aynı: katsayı 0, kredi paydada.
  const vf = calcGPA([{ credits: 3, grade: 'AA' }, { credits: 3, grade: 'VF' }]);
  assert.ok(Math.abs(vf - 2.0) < 1e-9);
});

test('calcGPA: 0 kredilik AA ortalamayı değiştirmez', () => {
  const gpa = calcGPA([{ credits: 0, grade: 'AA' }, { credits: 3, grade: 'BB' }]);
  assert.ok(Math.abs(gpa - 3.0) < 1e-9);
});

test('calcGPA: muaf/geçti/kredisiz hem paydan hem payadan çıkar', () => {
  const gpa = calcGPA([
    { credits: 3, grade: 'M' },
    { credits: 3, grade: 'G' },
    { credits: 3, grade: 'BL' },
    { credits: 3, grade: 'E' },
    { credits: 3, grade: 'AA' },
  ]);
  assert.ok(Math.abs(gpa - 4.0) < 1e-9); // yalnızca AA sayılır
});

test('calcGPA: hiç hesaba giren yoksa null', () => {
  assert.equal(calcGPA([]), null);
  assert.equal(calcGPA([{ credits: 3, grade: '' }]), null);
  assert.equal(calcGPA([{ credits: 3, grade: 'M' }]), null);
});

test('latestOnly: tekrarda yalnızca son not sayılır (FF sonra BB)', () => {
  const recs = [
    { code: 'BLG 102E', credits: 3, grade: 'FF', seq: 1 },
    { code: 'MAT 103E', credits: 5, grade: 'AA', seq: 1 },
    { code: 'BLG 102E', credits: 3, grade: 'BB', seq: 2 }, // tekrar — sonraki
  ];
  const entries = latestOnly(recs);
  const blg = entries.find((e) => e.code === 'BLG 102E');
  assert.equal(blg.grade, 'BB');
  const gpa = calcGPA(entries);
  // (BB 3.0×3 + AA 4.0×5) / 8 = 29/8 = 3,625
  assert.ok(Math.abs(gpa - 3.625) < 1e-9);
});

test('targetNeeded: erişilemez hedefte reachable:false ve uygun mesaj verir', () => {
  const r = targetNeeded({ gpa: 1.5, credits: 100 }, 3.0, 10);
  assert.ok(r && r.reachable === false); // 10 kredide 1.5→3.0 imkânsız
  assert.ok(r.needed > 4.0);
  // Ulaşılabilir örnek: 2.0 × 30 + kalan 72'de hedef 3.0 → gerekli ortalama
  const ok = targetNeeded({ gpa: 2.0, credits: 30 }, 3.0, 72);
  assert.ok(ok && ok.reachable === true);
  const need = ((3.0 * (30 + 72)) - (2.0 * 30)) / 72; // = 3,25
  assert.ok(Math.abs(ok.needed - need) < 1e-9);
  assert.equal(targetNeeded({ gpa: 3.0, credits: 30 }, 3.0, 0), null);
});

test('progress: plan toplamına göre tamamlanan kredi/AKTS', () => {
  const p = progress(
    [{ credits: 3, ects: 6, grade: 'AA' }, { credits: 2, ects: 4, grade: '' }, { credits: 4, ects: 7, grade: 'BB' }],
    { credits: '134', ects: '241' },
    { credits: 10, ects: 15 }, // transfer
  );
  assert.deepEqual(p.credits, { done: 17, total: 134 });
  assert.deepEqual(p.ects, { done: 28, total: 241 });
});

test('fmtTr2 Türkçe iki ondalıklı biçim: 2.1 → "2,10"', () => {
  assert.equal(fmtTr2(2.1), '2,10');
  assert.equal(fmtTr2(2.0), '2,00');
  assert.equal(fmtTr2(3.625), '3,63');
  assert.equal(fmtTr2(null), '');
});

const planFixture = () => ({
  programCode: 'BLG_LS',
  semesters: [{
    title: '1. Yarıyıl',
    items: [
      { course: { code: 'BLG 101E', credits: 3, ects: 6 } },
      { elective: { title: '4.yy Seçime Bağlı Ders (ITB)', credits: '3', ects: [4, 5], options: [
        { code: 'SNT 102', name: 'Fotoğraf' }, { code: 'SNT 101', name: 'Heykel' },
      ] } },
    ],
  }],
});

test('setGrade: not yazılır, ikinci not eskiye taşınır (tekrar işareti)', () => {
  let data = {};
  data = setGrade(data, 'BLG 101E', 'FF');
  assert.equal(data.grades['BLG 101E'].grade, 'FF');
  assert.equal(data.grades['BLG 101E'].prev, '');
  data = setGrade(data, 'BLG 101E', 'BB');
  assert.equal(data.grades['BLG 101E'].grade, 'BB');
  assert.equal(data.grades['BLG 101E'].prev, 'FF'); // önceki saklanır
});

test('setElective: ders seçilir, not ayrı yazılır, önceki korunur', () => {
  let data = {};
  data = setElective(data, 's0i1', 'SNT 102', 'CC');
  assert.equal(data.elective['s0i1'].code, 'SNT 102');
  assert.equal(data.elective['s0i1'].grade, 'CC');
  data = setElective(data, 's0i1', 'SNT 102', 'BB');
  assert.equal(data.elective['s0i1'].grade, 'BB');
  assert.equal(data.elective['s0i1'].prev, 'CC');
});

test('buildEntries: seçmeli slotta ders seçilmeden plan kredisi kullanılır, varsayılan işaretli', () => {
  const entries = buildEntries(planFixture(), {});
  assert.equal(entries.length, 2);
  const e = entries[1];
  assert.equal(e.required, false);
  assert.equal(e.credits, 3);         // slot kredisi "3"
  assert.equal(e.ects, 4);            // AKTS aralığından ilk değer
  assert.equal(e.defaultCredit, true);
  assert.equal(e.slot, 's0i1');
  assert.equal(e.grade, '');
});

test('buildEntries: seçilen dersin kredisi katalogdan gelir (yoksa varsayılan)', () => {
  const stored = { elective: { s0i1: { code: 'SNT 102', grade: 'AA' } } };
  const catalog = new Map([['SNT 102', { local: 3, ects: 4.5 }]]);
  const entries = buildEntries(planFixture(), stored, catalog);
  const e = entries[1];
  assert.equal(e.code, 'SNT 102');
  assert.equal(e.credits, 3);
  assert.equal(e.ects, 4.5);
  assert.equal(e.defaultCredit, false);
  // Katalogda yoksa slot varsayılanına düşer + işaretlenir
  const noCat = buildEntries(planFixture(), stored);
  assert.equal(noCat[1].defaultCredit, true);
  assert.equal(noCat[1].credits, 3);
});

test('buildEntries + calcGPA: zorunlu + seçmeli notları GANO\'ya girer', () => {
  const stored = {
    grades: { 'BLG 101E': { grade: 'AA' } },
    elective: { s0i1: { code: 'SNT 102', grade: 'BB' } },
  };
  const catalog = new Map([['SNT 102', { local: 3, ects: 4.5 }]]);
  const entries = buildEntries(planFixture(), stored, catalog);
  const gpa = calcGPA(entries);
  assert.ok(Math.abs(gpa - ((4 * 3 + 3 * 3) / 6)) < 1e-9); // = 3,5
});

// Madde 6: tür kovaları yalnızca gerçek türleri sayar; Z/S (zorunlu/seçmeli
// işareti) kovalara sızmaz.
test('typeBuckets Z/S tür kovalarına sızmaz, yalnızca gerçek türleri sayar', () => {
  const plan = {
    semesters: [{
      items: [
        { course: { code: 'SAO 101E', type: 'Z', credits: 4 } },      // tür değil
        { course: { code: 'SAO 109E', type: 'TM', credits: 2 } },
        { course: { code: 'TUR 121', type: 'ITB', credits: 0 } },
        { course: { code: 'BLG 411E', type: '', credits: 3 } },        // türsüz
      ],
    }],
  };
  const entries = [
    { code: 'SAO 109E', credits: 2, grade: 'BB' },
    { code: 'TUR 121', credits: 0, grade: 'CC' },
  ];
  const buckets = typeBuckets(plan, entries);
  assert.equal(buckets.has('Z'), false);
  assert.deepEqual(buckets.get('TM'), { done: 2, total: 2 });
  assert.deepEqual(buckets.get('ITB'), { done: 0, total: 0 });
  assert.equal(buckets.has('TB'), false);
  // Çift kodlu plan satırı da kanonik kodla eşleşir.
  const plan2 = {
    semesters: [{ items: [{ course: { code: 'SAO 109 SAO 109E', type: 'TM', credits: 2 } }] }],
  };
  assert.deepEqual(typeBuckets(plan2, entries).get('TM'), { done: 2, total: 2 });
});

test('exportJSON/importJSON yuvarlak döner', () => {
  const data = { grades: { 'BLG 101E': { grade: 'AA' } }, elective: {}, transfer: { credits: 20, gpa: 2.8 } };
  const json = exportJSON('BLG_LS', data);
  const back = importJSON(json);
  assert.equal(back.program, 'BLG_LS');
  assert.deepEqual(back.data.grades['BLG 101E'], { grade: 'AA' });
  assert.equal(back.data.transfer.credits, 20);
  assert.equal(importJSON('bozuk'), null);
});

test('setRepeat işareti açar/kapatır, grade/prev korunur', () => {
  let data = setGrade({}, 'BLG 101E', 'FF');
  data = setGrade(data, 'BLG 101E', 'BB'); // prev: FF
  data = setRepeat(data, 'BLG 101E', true);
  assert.equal(data.grades['BLG 101E'].repeat, true);
  assert.equal(data.grades['BLG 101E'].grade, 'BB');
  assert.equal(data.grades['BLG 101E'].prev, 'FF');
  data = setRepeat(data, 'BLG 101E', false);
  assert.equal(data.grades['BLG 101E'].repeat, false);
});

test('setGrade mevcut repeat işaretini korur', () => {
  let data = setRepeat({}, 'MAT 101', true);
  data = setGrade(data, 'MAT 101', 'CB');
  assert.equal(data.grades['MAT 101'].repeat, true);
});

test('repeat işareti GANO hesabına girmez (buildEntries+calcGPA)', () => {
  const plan = { semesters: [{ items: [{ course: { code: 'BLG 101E', credits: 3, ects: 6 } }] }] };
  const withRep = buildEntries(plan, { grades: { 'BLG 101E': { grade: 'AA', repeat: true } } });
  const without = buildEntries(plan, { grades: { 'BLG 101E': { grade: 'AA' } } });
  assert.deepEqual(withRep, without);
  assert.ok(Math.abs(calcGPA(withRep) - 4.0) < 1e-9);
});

test('creditBadge kredi değerini Türkçe yazar, sıfır/eksikte "0"', () => {
  assert.equal(creditBadge({ credits: 3 }), '3');
  assert.equal(creditBadge({ credits: 1.5 }), '1,5');
  assert.equal(creditBadge({ credits: 0 }), '0');
  assert.equal(creditBadge({}), '0');
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
