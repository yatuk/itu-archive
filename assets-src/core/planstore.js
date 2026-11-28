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

import { parseRange, canonicalCode } from './plan.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from './persistence.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';
import { isPassingGrade } from './grades.js?v=dde1e9339338';

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

// Son seçilen program kodu — notlar programa göre saklanır ama hangi programın
// açık olduğu URL'de değilse hiçbir yerde durmuyordu. Sayfa yenilenince
// (?prog= olmadan) Ders Planım boş başlıyor, transkriptten aktarılan notlar
// localStorage'da dururken kullanıcıya kayıp gibi görünüyordu — Program
// sekmesi kendi aktif kaydını tek blob içinde tuttuğu için bu sorunu
// yaşamıyordu. Aynı örüntü: son program ayrı, küçük bir anahtarda saklanır.
const LAST_PROG_KEY = 'itu-grades-last-prog';

export function loadLastProgram() {
  return readLocalState(LAST_PROG_KEY, { fallback: '', validate: (v) => typeof v === 'string' });
}

export function saveLastProgram(prog) {
  writeLocalState(LAST_PROG_KEY, prog, { validate: (v) => typeof v === 'string' });
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
    const data = { grades: d.grades || {}, elective: d.elective || {}, requiredSlots: d.requiredSlots || {}, transfer: d.transfer || null, targetGpa: d.targetGpa || '' };
    if (validTranscript(d.transcript)) data.transcript = d.transcript;
    return { program: d.program, data };
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
            code: item.elective.title || I18N.t('planElectiveDefaultTitle'),
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
  const doneByCode = new Map((entries || []).filter((e) => isPassingGrade(e.grade)).map((e) => [e.code, e]));
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

function validTranscript(t) {
  return isPlainObject(t) && Array.isArray(t.entries) && isPlainObject(t.planKeys || {});
}

// -- Mezuniyete ne kaldı --

// Seçmeli slotun havuz türü: başlıktaki tür etiketi ("(MT)", "ITB Elective",
// "Functional-MT"); etiket yoksa seçeneklerin hepsi ITB/SNT ise ITB. SNT, İTÜ'de
// ITB havuzunun parçası sayılır (transcript.js · electivePool ile aynı kural).
export const ELECTIVE_GROUPS = ['MT', 'TM', 'TB', 'ITB', 'EC', 'other'];
export function electiveGroup(elective) {
  const title = String(elective?.title || '');
  const m = title.match(/(?:^|[^A-Za-zÇĞİÖŞÜçğıöşü])(ITB|SNT|MT|TM|TB|EC)(?![A-Za-zÇĞİÖŞÜçğıöşü])/);
  if (m) return m[1] === 'SNT' ? 'ITB' : m[1];
  const branches = new Set((elective?.options || []).map((o) => String(o?.code || '').split(' ')[0]).filter(Boolean));
  if (branches.size && [...branches].every((b) => b === 'ITB' || b === 'SNT')) return 'ITB';
  return 'other';
}

// Planda henüz geçilmemiş kalemler. entries: buildEntries çıktısı (plan
// sırasıyla, seçmelilerde slot anahtarı taşır); extraPassed: başka kaynaktan
// (transkript) geçildiği bilinen ders kodları. Geçme kuralı isPassingGrade:
// FF/VF/E kalmış sayılır. Dönüş:
//   { required: [{ code, name, credits, ects, semester, slot }],
//     electives: [{ group, credits, slots: [{ slot, title, credits, semester }] }] }
export function remainingPlan(plan, entries, extraPassed = new Set()) {
  const passed = new Set(extraPassed);
  const slotDone = new Set();
  for (const e of entries || []) {
    if (!isPassingGrade(e.grade)) continue;
    if (e.slot) slotDone.add(e.slot);
    else if (e.code) passed.add(e.code);
  }
  const required = [];
  const groups = new Map();
  (plan?.semesters || []).forEach((sem, si) => {
    sem.items.forEach((item, ii) => {
      const slot = `s${si}i${ii}`;
      if (item.course) {
        const code = canonicalCode(item.course.code);
        if (code && passed.has(code)) return;
        required.push({
          code, name: item.course.name || '', slot, semester: si,
          credits: Number(item.course.credits) || 0, ects: Number(item.course.ects) || 0,
        });
      } else if (item.elective) {
        if (slotDone.has(slot)) return;
        const group = electiveGroup(item.elective);
        const cur = groups.get(group) || { group, credits: 0, slots: [] };
        const credits = slotDefaultCredits(item.elective);
        cur.slots.push({ slot, title: item.elective.title || '', credits, semester: si });
        cur.credits += credits;
        groups.set(group, cur);
      }
    });
  });
  const electives = [...groups.values()].sort((a, b) => ELECTIVE_GROUPS.indexOf(a.group) - ELECTIVE_GROUPS.indexOf(b.group));
  return { required, electives };
}

// Dönem slug'ı ("2026-2027-guz") bir sonraki normal yarıyıla ilerler; yaz
// okulu normal yük sayılmaz, yazdan sonraki ilk normal dönem güzdür.
export function nextRegularTerm(slug) {
  const m = /^(\d{4})-(\d{4})-(guz|bahar|yaz)$/.exec(String(slug || ''));
  if (!m) return '';
  const y1 = Number(m[1]);
  if (m[3] === 'guz') return `${y1}-${y1 + 1}-bahar`;
  return `${y1 + 1}-${y1 + 2}-guz`;
}

// Transkript dönem etiketi ("2025-2026 / Bahar") → slug.
export function termSlugFromLabel(label) {
  const m = /^(\d{4})-(\d{4})\s*\/\s*(Güz|Bahar|Yaz|Fall|Spring|Summer)/i.exec(String(label || ''));
  if (!m) return '';
  const s = { güz: 'guz', fall: 'guz', bahar: 'bahar', spring: 'bahar', yaz: 'yaz', summer: 'yaz' }[m[3].toLocaleLowerCase('tr-TR')];
  return `${m[1]}-${m[2]}-${s}`;
}

// Tahmini mezuniyet dönemi (kaba): kalan kredi, plandaki normal yarıyıl yüküyle
// (program toplamı / yarıyıl sayısı) kaç yarıyıl sürer. startSlug kalan derslerin
// alınabileceği ilk dönemdir (sürmekte olan dönem dahil); yazsa sonraki güz.
// Dönüş: { semesters, slug } — kalan yoksa { semesters: 0, slug: '' }.
export function estimateGraduation({ remainingCredits, normalLoad, startSlug }) {
  const rem = Number(remainingCredits) || 0;
  const load = Number(normalLoad) || 0;
  if (rem <= 0) return { semesters: 0, slug: '' };
  if (load <= 0) return null;
  const semesters = Math.max(1, Math.ceil(rem / load - 1e-9));
  let slug = String(startSlug || '');
  if (/-yaz$/.test(slug)) slug = nextRegularTerm(slug);
  if (!slug) return { semesters, slug: '' };
  for (let i = 1; i < semesters; i++) slug = nextRegularTerm(slug);
  return { semesters, slug };
}

// Aktarılan transkriptin son NORMAL yarıyılı (yaz hariç) ve normal yarıyıl
// sayısı. Eski aktarımlarda dönem özeti yoksa null.
// OBS transkriptinde yazan son resmî akademik durum ({ term, status }) ya da null.
export function officialStanding(stored) {
  const list = Array.isArray(stored?.transcript?.standing) ? stored.transcript.standing : [];
  const last = list.filter((s) => s && typeof s.term === 'string' && typeof s.status === 'string').at(-1);
  return last ? { term: last.term, status: last.status } : null;
}

export function transcriptTerms(stored) {
  const terms = Array.isArray(stored?.transcript?.terms) ? stored.transcript.terms.filter((t) => t && typeof t.term === 'string') : [];
  if (!terms.length) return null;
  const regular = terms.filter((t) => !/\/\s*(Yaz|Summer)/i.test(t.term));
  return { count: regular.length, last: regular.at(-1) || null, lastAny: terms.at(-1), standing: officialStanding(stored) };
}

// Bir GANO girdisinin plandaki yeri: zorunlu ders koduyla, seçmeli slotuyla.
function entryKey(entry) {
  return entry.required ? `g:${entry.code}` : `e:${entry.slot}`;
}

// GANO'ya giren girdiler. Transkript aktarıldıysa (stored.transcript) taban,
// OBS'nin saydığı denemelerdir: plana eşleşmeyen dersler de girer, kredi
// transkriptten gelir. Aktarımdan sonra plandaki bir not elle değiştirildiyse
// o ders yeni notla, silindiyse hiç sayılmaz; plana elle eklenen notlar da
// eklenir. Dönüş: { entries, source, officialGpa }
//   source: 'plan' (transkript yok) · 'transcript' (aktarılan haliyle) ·
//           'edited' (transkript + sonradan değişen notlar)
export function gpaEntries(plan, stored, catalogMap = new Map()) {
  const planEntries = plan ? buildEntries(plan, stored, catalogMap) : [];
  const snap = stored?.transcript;
  if (!validTranscript(snap)) {
    return { entries: planEntries.filter((e) => e.grade), source: 'plan', officialGpa: null };
  }
  const planKeys = snap.planKeys || {};
  const current = new Map();
  const ectsByKey = new Map();
  for (const e of planEntries) { current.set(entryKey(e), e.grade || ''); ectsByKey.set(entryKey(e), e.ects || 0); }
  const currentGrade = (key) => {
    if (current.has(key)) return current.get(key);
    // Anahtar plandaki bir yere düşmüyorsa (plan sürümü değişti vb.) saklanan
    // nota bak; o da yoksa ders silinmiş sayılır.
    if (key.startsWith('g:')) return stored?.grades?.[key.slice(2)]?.grade || '';
    return stored?.elective?.[key.slice(2)]?.grade || '';
  };

  let edited = false;
  const entries = [];
  const covered = new Set();
  for (const item of snap.entries) {
    if (!item || typeof item.code !== 'string') continue;
    const credits = Number(item.credits) || 0;
    if (!item.key) { entries.push({ code: item.code, credits, grade: item.grade, source: 'transcript', key: '' }); continue; }
    covered.add(item.key);
    const now = currentGrade(item.key);
    const ects = ectsByKey.get(item.key) || 0;
    if (now === planKeys[item.key]) entries.push({ code: item.code, credits, ects, grade: item.grade, source: 'transcript', key: item.key });
    else if (now) { edited = true; entries.push({ code: item.code, credits, ects, grade: now, source: 'edited', key: item.key }); }
    else edited = true;
  }
  for (const e of planEntries) {
    const key = entryKey(e);
    if (covered.has(key)) continue;
    // Aktarımda plana yazılmış ama OBS'nin saymadığı deneme (ör. `*` işaretli):
    // değişmediyse sayılmaz.
    if (Object.prototype.hasOwnProperty.call(planKeys, key) && (e.grade || '') === planKeys[key]) continue;
    if (!e.grade) continue;
    edited = true;
    entries.push({ ...e, source: 'plan', key });
  }
  const official = Number(snap.officialGpa);
  return {
    entries,
    source: edited ? 'edited' : 'transcript',
    officialGpa: snap.officialGpa != null && Number.isFinite(official) ? official : null,
  };
}
