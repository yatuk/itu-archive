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

// İlerleme: plan toplamına göre tamamlanan kredi/AKTS. Yalnızca notu girilmiş
// (muaf dahil — ders tamamlanmıştır) kayıtlar sayılır. transfer dışarıdan gelen
// kredi ekler (yatay geçiş).
export function progress(entries, planTotal, transfer) {
  let doneCredits = 0, doneEcts = 0;
  for (const e of entries || []) {
    if (e.grade == null || e.grade === '') continue;
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
