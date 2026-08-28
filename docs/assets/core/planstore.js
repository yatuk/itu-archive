// "Ders Planım" not girişi depolaması ve giriş üreticisi (Faz: Ders Planım).
//
// Her şey localStorage'da kalır, sunucuya HİÇBİR şey gitmez. Veri program bazlı
// tutulur (kullanıcı ÇAP yapıyorsa iki plan ayrı). Bu bir transkript değildir —
// kullanıcının kendi beyanı; arayüz "girdiğin notlara göre" der.
//
// Şema (program kodu anahtarlı):
//   { grades:   { "<DERS KODU>": { grade: "BB", prev: "FF" } },
//     elective: { "<s<sy>i<sy>>": { code: "SNT 102", grade: "BB", prev: "" } },
//     transfer: { credits, gpa },
//     updatedAt: <ms> }
//
// Tekrar: son not `grade`'te, önceki `prev`'te saklanır; hesaba yalnızca son
// not girer (latestOnly/calcGPA). Seçmeli slotta ders seçilmediyse plan kredisi
// varsayılandır ve `defaultCredit` işareti taşır.

import { parseRange, canonicalCode } from './plan.js?v=48f281c5afc3';
import { readLocalState, writeLocalState, isPlainObject } from './persistence.js?v=48f281c5afc3';

const KEY = 'itu-grades';

export function loadStored(prog) {
  const all = readLocalState(KEY, {
    fallback: {},
    legacyKey: KEY,
    validate: isPlainObject,
  });
  return isPlainObject(all[prog]) ? all[prog] : {};
}

export function saveStored(prog, data) {
  const all = readLocalState(KEY, {
    fallback: {},
    legacyKey: KEY,
    validate: isPlainObject,
  });
  all[prog] = { ...data, updatedAt: Date.now() };
  writeLocalState(KEY, all, { validate: isPlainObject });
}

// Zorunlu ders notunu yazar; mevcut not varsa eskiye taşınır (tekrar işareti).
// Manuel "tekrar" işareti (setRepeat) korunur — GANO hesabına girmez.
export function setGrade(data, code, grade) {
  const grades = { ...(data.grades || {}) };
  const cur = grades[code];
  grades[code] = { grade, prev: cur && cur.grade ? cur.grade : '', repeat: cur?.repeat || false };
  return { ...data, grades };
}

// Dersin "tekrar" işaretini açar/kapatır. Yalnızca saklanan işaret — not/prev
// korunur, GANO hesabı (buildEntries) repeat'i yok sayar.
export function setRepeat(data, code, repeat) {
  const grades = { ...(data.grades || {}) };
  const cur = grades[code] || {};
  grades[code] = { ...cur, repeat: Boolean(repeat) };
  return { ...data, grades };
}

// Seçmeli slot seçimini yazar: önce hangi dersi aldı, sonra not.
export function setElective(data, slotKey, code, grade) {
  const elective = { ...(data.elective || {}) };
  const cur = elective[slotKey];
  elective[slotKey] = { code, grade, prev: cur && cur.grade ? cur.grade : '' };
  return { ...data, elective };
}

export function exportJSON(prog, data) {
  return JSON.stringify({ program: prog, ...data }, null, 2);
}

export function importJSON(json) {
  try {
    const d = JSON.parse(json);
    if (!d || !d.program) return null;
    return { program: d.program, data: { grades: d.grades || {}, elective: d.elective || {}, requiredSlots: d.requiredSlots || {}, transfer: d.transfer || null, targetGpa: d.targetGpa || '' } };
  } catch { return null; }
}

// Kredi/AKTS varsayılanı: seçmeli slot aralığından ilk değer.
function slotDefaultCredits(e) {
  return parseRange(e.credits, [0])[0] || 0;
}
function slotDefaultEcts(e) {
  return (e.ects && e.ects.length ? e.ects : [0])[0] || 0;
}

// Plan + saklanan notlardan GANO girdilerini üretir. catalogMap, seçilen seçmeli
// dersin kredisini verir (kod → { local, ects }); yoksa slot varsayılanı kullanılır
// ve girdi `defaultCredit:true` işaretlenir. Saf — test edilebilir.
export function buildEntries(plan, stored, catalogMap = new Map()) {
  const entries = [];
  const grades = stored?.grades || {};
  const elective = stored?.elective || {};
  plan.semesters.forEach((sem, si) => {
    sem.items.forEach((item, ii) => {
      const slotKey = `s${si}i${ii}`;
      if (item.course) {
        // Kanonik kod: OBS çift kod basabilirdi ("SAO 101E SAO 101"); not anahtarı
        // ve GANO girdisi tek kodla tutarlı olsun diye burada indirgenir.
        const code = canonicalCode(item.course.code);
        const rec = grades[code] || grades[item.course.code] || {};
        entries.push({
          code,
          credits: item.course.credits || 0,
          ects: item.course.ects || 0,
          grade: rec.grade || '',
          prev: rec.prev || '',
          required: true,
        });
      } else if (item.elective) {
        const pick = elective[slotKey];
        if (pick && pick.code) {
          const cat = catalogMap.get(pick.code);
          const credits = cat && cat.local != null ? cat.local : slotDefaultCredits(item.elective);
          const ects = cat && cat.ects != null ? cat.ects : slotDefaultEcts(item.elective);
          entries.push({
            code: pick.code,
            credits,
            ects,
            grade: pick.grade || '',
            prev: pick.prev || '',
            required: false,
            defaultCredit: !(cat && cat.local != null),
            slot: slotKey,
          });
        } else {
          entries.push({
            code: item.elective.title || 'Seçmeli',
            credits: slotDefaultCredits(item.elective),
            ects: slotDefaultEcts(item.elective),
            grade: '',
            required: false,
            defaultCredit: true,
            slot: slotKey,
          });
        }
      }
    });
  });
  return entries;
}

// Tür bazlı ilerleme kovaları: yalnızca gerçek türler (TB/TM/MT/ITB/EC) kova olur;
// türü olmayan ya da "Z"/"S" işaretli dersler sayılmaz. Dönüş Map<tür,{done,total}>
// — notu girilmiş derslerin kredisi done'a girer. Saf, test edilebilir.
export function typeBuckets(plan, entries) {
  const REAL = ['TB', 'TM', 'MT', 'ITB', 'EC'];
  const out = new Map();
  const doneByCode = new Map((entries || []).filter((e) => e.grade).map((e) => [e.code, e]));
  for (const sem of (plan?.semesters || [])) {
    for (const item of sem.items) {
      if (!item.course || !REAL.includes(item.course.type)) continue;
      const t = item.course.type;
      const cur = out.get(t) || { done: 0, total: 0 };
      cur.total += item.course.credits || 0;
      const e = doneByCode.get(canonicalCode(item.course.code));
      if (e) cur.done += e.credits || 0;
      out.set(t, cur);
    }
  }
  return out;
}

// GANO girdilerini yarıyıllara böler (yarıyıl ortalaması için).
export function entriesBySemester(plan, stored, catalogMap) {
  const out = [];
  const all = buildEntries(plan, stored, catalogMap);
  let idx = 0;
  plan.semesters.forEach((sem) => {
    out.push(all.slice(idx, idx + sem.items.length));
    idx += sem.items.length;
  });
  return out;
}
