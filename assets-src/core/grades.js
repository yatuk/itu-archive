// Not ölçeği ve GANO hesabı (Faz: Ders Planım not girişi). Saf fonksiyonlar —
// DOM'a ve localStorage'a dokunmaz; görünüm (views/dersplanim.js) veriyi buraya
// besler. Tek ölçek kaynağı bu modüldür.
//
// Kaynak: İTÜ not dönüştürme tablosu. Ölçek üniversiteden üniversiteye değişir
// ve İTÜ zaman içinde güncelleyebilir; bu tablo ve son güncelleme tarihi yorumda
// tutulur, arayüz "girdiğin notlara göre" der — resmî GANO değildir.
//
// Ölçek (son güncelleme: 2026-08):
//   AA 4.00 · BA+ 3.75 · BA 3.50 · BB+ 3.25 · BB 3.00 · CB+ 2.75 · CB 2.50
//   CC+ 2.25 · CC 2.00 · DC+ 1.75 · DC 1.50 · DD+ 1.25 · DD 1.00
//   FF 0.00 · VF 0.00
// Ortalamaya girmeyen kodlar (muaf/geçti/kredisiz/eksik/çekilen): M, G, P, BL, E.
// Bunlar hem paydaya hem paya girmez. FF/VF ise katsayı 0, kredi PAYDAYA SAYILIR.

export const GRADE_POINTS = {
  AA: 4.0, 'BA+': 3.75, BA: 3.5, 'BB+': 3.25, BB: 3.0,
  'CB+': 2.75, CB: 2.5, 'CC+': 2.25, CC: 2.0,
  'DC+': 1.75, DC: 1.5, 'DD+': 1.25, DD: 1.0,
  FF: 0.0, VF: 0.0,
};

// Ortalamaya girmeyen kodlar (ne pay, ne payda).
export const EXEMPT = new Set(['M', 'G', 'P', 'BL', 'E']);

// Girdi yoksa null döner. Not harfi GRADE_POINTS'te yoksa o kayıt atlanır
// (alınmadı / muaf / geçti). Kredisiz ders payda da sayılmaz (ağırlık 0).
export function gradePoints(grade) {
  return grade === undefined || grade === null || grade === '' ? undefined : GRADE_POINTS[grade];
}

// Ağırlıklı ortalama (GANO / yarıyıl ortalaması). entries: [{ credits, grade }].
// FF/VF katsayısı 0 olduğu için payı düşürür ama kredisi paydada kalır — OBS ile
// eşleşen tek düşürme yolu bu; yanlış uygulanırsa sonuç tutmaz.
export function calcGPA(entries) {
  let num = 0, den = 0;
  for (const e of entries || []) {
    const pts = gradePoints(e.grade);
    if (pts === undefined) continue;
    const cr = Number(e.credits) || 0;
    num += pts * cr;
    den += cr;
  }
  return den === 0 ? null : num / den;
}

// Kayıtları ders bazında teke indirir: her kodun YALNIZCA son notu sayılır
// (İTÜ'de tekrarda son alınan not geçerli; öncekiler saklanır ama hesaba girmez).
// records: [{ code, credits, grade, seq }] — seq yoksa dizideki son konum.
export function latestOnly(records) {
  const byCode = new Map();
  for (let i = 0; i < (records || []).length; i++) {
    const r = records[i];
    if (!r || !r.code) continue;
    const seq = r.seq != null ? r.seq : i;
    const prev = byCode.get(r.code);
    if (!prev || seq > prev.seq) byCode.set(r.code, { ...r, seq });
  }
  return [...byCode.values()].map(({ code, credits, grade }) => ({ code, credits, grade }));
}

// Dersin tamamlanmış (başarıyla geçilmiş) sayılıp sayılmadığı: AA–DD (DD ve DD+
// şartlı geçer ama OBS kazanılmış sayar) ile muaf/geçti/kredisiz (M, G, P, BL).
// FF, VF, eksik (E), boş ve bilinmeyen notlar tamamlanmış değildir.
export function isPassingGrade(grade) {
  if (grade == null || grade === '' || grade === 'E') return false;
  return EXEMPT.has(grade) || Number(GRADE_POINTS[grade]) > 0;
}

// İlerleme: plan toplamına göre tamamlanan kredi/AKTS. Yalnızca geçilen dersler
// sayılır (FF/VF sayılmaz; BL geçer ama 0 kredi ekler). entries ders başına tek
// (son) denemedir, yani tekrar edilen ders bir kez sayılır. transfer dışarıdan
// gelen kredi ekler (yatay geçiş).
export function progress(entries, planTotal, transfer) {
  let doneCredits = 0, doneEcts = 0;
  for (const e of entries || []) {
    if (!isPassingGrade(e.grade)) continue;
    if (e.grade === 'BL') continue;
    doneCredits += Number(e.credits) || 0;
    doneEcts += Number(e.ects) || 0;
  }
  doneCredits += Number(transfer?.credits) || 0;
  doneEcts += Number(transfer?.ects) || 0;
  const creditsTotal = num0(planTotal?.credits);
  const ectsTotal = num0(planTotal?.ects);
  return {
    credits: { done: doneCredits, total: creditsTotal },
    ects: { done: doneEcts, total: ectsTotal },
  };
}

// Ters hesap: "GANO'yu hedef'e çıkarmak için kalan kredide ortalama X gerekiyor".
// current: { gpa, credits } (transfer dahil). Dönüş:
//   { needed }            — gereken ortalama (4,00 üstünde değil)
//   { needed, reachable:false } — hedefe ulaşılamaz ("4,00'ü aşmak gerekir")
//   null                   — kalan kredi 0 veya geçersiz
export function targetNeeded(current, target, remaining) {
  const cr = Number(current?.credits) || 0;
  const gpa = Number(current?.gpa);
  const rem = Number(remaining);
  if (rem <= 0 || isNaN(gpa) || isNaN(target)) return null;
  const currentNum = gpa * cr;
  const targetNum = target * (cr + rem);
  const needed = (targetNum - currentNum) / rem;
  if (needed > 4.0 + 1e-9) return { needed, reachable: false };
  return { needed, reachable: true };
}

// Türkçe iki ondalıklı sayı: 2.1 → "2,10"; tam sayı 3 → "3,00".
export function fmtTr2(n) {
  if (n == null || isNaN(Number(n))) return '';
  return Number(n).toFixed(2).replace('.', ',');
}

function num0(s) {
  const n = parseFloat(String(s ?? '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

// -- Akademik durum (gözetim / onur) --
//
// Kaynak: İTÜ Lisans Eğitim ve Öğretim Yönetmeliği (RG 11.07.2016/29767;
// RG 22.07.2022/31900 ve RG 04.12.2023/32389 değişiklikleriyle). Güncel metin:
//   https://www.sis.itu.edu.tr/TR/mevzuat/lisans-yonetmelik.php
//   (ilk Resmî Gazete metni: https://www.resmigazete.gov.tr/eskiler/2016/07/20160711-5.htm)
// Denetim: 2026-11.
//   Madde 15(1) (değişik RG 22.07.2022): öğretim planından en az 30 kredi
//     tamamlayan 2., en az 60 kredi 3., en az 95 kredi 4. sınıf öğrencisidir.
//     Sınıf yarıyıl sayısına değil TAMAMLANAN KREDİYE göre belirlenir.
//   Madde 21(1): gözetim listesi — 1. ve 2. sınıfta AGNO < 1.80, 3. sınıfta
//     < 1.90, 4. sınıfta < 2.00. 21(2): gözetimdeki öğrencinin yarıyıl kredi
//     yükü en fazla 18; AGNO eşiğin üzerine çıkınca normal statüye döner.
//   Madde 23(8) (değişik RG 04.12.2023): AGNO'su en az 2,00 olan, o yarıyılda
//     en az 18 kredi ders alıp başaran öğrenci YARIYIL ortalaması 3,00–3,49 ise
//     "Onur", 3,50–4,00 ise "Yüksek Onur" öğrencisidir; o yarıyılda FF ya da VF
//     varsa olamaz. (En az sürede mezun olanda mezuniyet yarıyılında kredi
//     sınırı aranmaz — burada modellenmedi.)
//   Madde 31(1): mezuniyet için AGNO en az 2,00.
// Yönetmelikte "sınamalı" statüsü yoktur; düşük ortalamanın resmî sonucu
// gözetim listesidir. Ortalama belgede iki ondalıkla gösterilir (Madde 30),
// eşik karşılaştırması bu yüzden iki haneye yuvarlanmış değerle yapılır.
export const STANDING = {
  source: 'https://www.sis.itu.edu.tr/TR/mevzuat/lisans-yonetmelik.php',
  classCredits: [30, 60, 95],
  watch: { 1: 1.8, 2: 1.8, 3: 1.9, 4: 2.0 },
  watchMaxCredits: 18,
  honor: 3.0,
  highHonor: 3.5,
  honorMinGpa: 2.0,
  honorMinCredits: 18,
  graduationGpa: 2.0,
};

export function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

// Madde 15(1): tamamlanan krediden sınıf (1–4).
export function classYear(completedCredits) {
  const c = Number(completedCredits) || 0;
  const [two, three, four] = STANDING.classCredits;
  return c >= four ? 4 : c >= three ? 3 : c >= two ? 2 : 1;
}

// Madde 21(1): sınıfa göre gözetim eşiği.
export function watchThreshold(year) {
  return STANDING.watch[year] ?? STANDING.watch[1];
}

// Madde 23(8): bir yarıyılın onur değerlendirmesi.
// term: { gpa, passedCredits, hasFail }; gano: o yarıyıl sonundaki AGNO.
// Dönüş: { level: 'high'|'honor'|'none', reason: ''|'fail'|'credits'|'gano' } ya da null.
export function termHonor(term, gano) {
  if (!term || term.gpa == null || !Number.isFinite(Number(term.gpa))) return null;
  if (term.hasFail) return { level: 'none', reason: 'fail' };
  if ((Number(term.passedCredits) || 0) < STANDING.honorMinCredits) return { level: 'none', reason: 'credits' };
  if (gano == null || round2(gano) < STANDING.honorMinGpa) return { level: 'none', reason: 'gano' };
  const avg = round2(term.gpa);
  if (avg >= STANDING.highHonor) return { level: 'high', reason: '' };
  if (avg >= STANDING.honor) return { level: 'honor', reason: '' };
  return { level: 'none', reason: '' };
}

// Toplu akademik durum. gpa: AGNO; completedCredits: öğretim planından
// tamamlanan kredi; lastTerm: son normal yarıyılın özeti ({ term, gpa,
// passedCredits, hasFail }) ya da null. gpa yoksa null.
export function academicStanding({ gpa, completedCredits, lastTerm = null } = {}) {
  if (gpa == null || !Number.isFinite(Number(gpa))) return null;
  const g = round2(gpa);
  const year = classYear(completedCredits);
  const threshold = watchThreshold(year);
  const th = lastTerm ? termHonor(lastTerm, g) : null;
  return {
    gpa: g,
    year,
    watch: { threshold, on: g < threshold, gap: round2(threshold - g) },
    honor: {
      toHonor: Math.max(0, round2(STANDING.honor - g)),
      toHigh: Math.max(0, round2(STANDING.highHonor - g)),
      term: th ? { ...th, gpa: round2(lastTerm.gpa), label: lastTerm.term || '' } : null,
    },
    graduationOk: g >= STANDING.graduationGpa,
  };
}

// -- Tekrar önerisi --
// Son notu FF/VF/DD/DD+/DC/DC+ olan dersler (İTÜ'de tekrar edilen dersin son
// notu geçerlidir, Madde 22(1); AA ile geçilen ders tekrar edilemez, 22(2)).
// entries: GANO'ya giren denemeler (ders başına son not; gpaEntries çıktısı).
// Kazanç: not `target` olursa AGNO'nun değişimi. FF/VF kredisi zaten paydada
// olduğundan payda değişmez: Δ = (p(target) − p(grade)) × kredi / payda.
// base: { credits, gpa } devir (yatay geçiş) paydaya eklenir.
export const RETAKE_GRADES = ['FF', 'VF', 'DD', 'DD+', 'DC', 'DC+'].filter((g) => g in GRADE_POINTS);

export function retakeCandidates(entries, { target = 'BB', base = null } = {}) {
  const tp = GRADE_POINTS[target];
  if (tp === undefined) return [];
  // Aynı kod iki kez geldiyse (plan girdisi) son kayıt geçerlidir.
  const byCode = new Map();
  for (const e of entries || []) if (e && e.code) byCode.set(e.code, e);
  const list = [...byCode.values()];
  let den = 0;
  const baseCredits = Number(base?.credits) || 0;
  if (baseCredits > 0 && Number.isFinite(Number(base?.gpa))) den += baseCredits;
  for (const e of list) {
    if (GRADE_POINTS[e.grade] === undefined) continue;
    den += Number(e.credits) || 0;
  }
  if (den <= 0) return [];
  return list
    .filter((e) => RETAKE_GRADES.includes(e.grade) && (Number(e.credits) || 0) > 0 && tp > GRADE_POINTS[e.grade])
    .map((e) => {
      const credits = Number(e.credits) || 0;
      return { code: e.code, grade: e.grade, credits, key: e.key || '', slot: e.slot || '', gain: ((tp - GRADE_POINTS[e.grade]) * credits) / den };
    })
    .sort((a, b) => b.gain - a.gain || b.credits - a.credits || a.code.localeCompare(b.code));
}

// "+0,08" biçimi (Türkçe ondalık, işaretli; eksi için − karakteri).
export function fmtGain(n) {
  if (n == null || !Number.isFinite(Number(n))) return '';
  const v = round2(n);
  return `${v > 0 ? '+' : v < 0 ? '−' : '±'}${fmtTr2(Math.abs(v))}`;
}
