// OBS Transkript Önizleme ekranından kopyalanan düz metni ayrıştırır.
// Saf modüldür: DOM, localStorage ve ağ erişimi yoktur. Öğrenci adı/numarası,
// kimlik ve doğum bilgileri hiçbir çıktıya alınmaz; yalnız ders kayıtları,
// dönem etiketi, belgedeki son toplam GANO ve staj süreleri (kurum adı
// olmadan) döner.

import { canonicalCode } from './plan.js?v=dde1e9339338';
import { GRADE_POINTS } from './grades.js?v=dde1e9339338';

const GRADES = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF', 'BL', 'M', 'G', 'P', 'E'];
const GRADE_PART = GRADES.map((g) => g.replace('+', '\\+')).join('|');
const COURSE_RE = new RegExp(`^([A-ZÇĞİÖŞÜ]{2,6})\\s+(\\d{3,4}[A-Z]{0,3})\\s+(.+?)\\s+(\\d+(?:[.,]\\d{1,2})?)\\s+(${GRADE_PART})(?:\\s+(\\*))?\\s*$`, 'i');
const TERM_RE = /^(\d{4}-\d{4})\s*\/\s*(Güz|Bahar|Yaz|Fall|Spring|Summer)\s+(?:Dönemi|Semester)$/i;
// "2026-2027 / Güz Dönemi - Devam Eden Dersler": notu olmayan, sürmekte olan
// dersler. Bu başlıktan sonra hiçbir satır notlu kayıt sayılmaz.
const IN_PROGRESS_RE = /^\d{4}-\d{4}\s*\/\s*(?:Güz|Bahar|Yaz|Fall|Spring|Summer)\b.*(?:Devam\s+Eden|In\s+Progress|Ongoing)/i;
// Dönem toplamlarından sonraki resmî akademik durum satırı: "Akd. Durum İyi
// Durum", "Akd. Durum Gözetim Listesi" (sayfa altbilgisinden " ÖN İZLEME"
// eklenebilir). Yalnızca bilinen durum adları alınır; satırdan başka hiçbir şey
// saklanmaz.
const STANDING_RE = /^Akd\.?\s*Durum(?:u)?\s*:?\s*(.+?)(?:\s+ÖN\s+İZLEME)?\s*$/i;
const STANDING_STATUSES = new Map([
  ['iyi durum', 'İyi Durum'],
  ['gözetim listesi', 'Gözetim Listesi'],
  ['gözetim', 'Gözetim Listesi'],
  ['onur', 'Onur'],
  ['onur listesi', 'Onur'],
  ['yüksek onur', 'Yüksek Onur'],
  ['yüksek onur listesi', 'Yüksek Onur'],
  ['good standing', 'İyi Durum'],
  ['watch list', 'Gözetim Listesi'],
  ['honor', 'Onur'],
  ['high honor', 'Yüksek Onur'],
]);

function standingStatus(raw) {
  return STANDING_STATUSES.get(String(raw || '').toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim()) || '';
}
// "Staj Bilgileri" bölümü: "Kurum Staj Tarihi Staj Süresi Program" başlığı,
// ardından her staj için "<kurum> 01.07.2025 - 25.08.2025 20 İş Günü <program>"
// satırı (program adı sonraki satıra taşabilir: "Lisans"). Kurum "MUAF" ise
// staj muaf sayılır. Kurum ve program adı SAKLANMAZ; yalnız gün, tarih, muafiyet.
const INTERNSHIP_HEAD_RE = /^(?:Staj\s+Bilgileri|Internship\s+(?:Information|Records))\b/i;
const INTERNSHIP_COLS_RE = /^Kurum\s+Staj\s+Tarihi\b|^(?:Institution|Company)\s+(?:Internship\s+)?Date\b/i;
const INTERNSHIP_DAYS_RE = /(\d{1,3})\s*(?:[İIiı][şsŞS]\s*[GgĞ][üuÜU][nN][üuÜU]?|(?:working|business|work)\s+days?)(?![A-Za-zÇĞİÖŞÜçğıöşü])/i;
const INTERNSHIP_DATES_RE = /(\d{1,2})\.(\d{1,2})\.(\d{4})\s*-\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/;
// Sayfa altbilgisi/üstbilgisi: staj satırlarının arasına girebilir.
const PAGE_NOISE_RE = /^(?:İSTANBUL\s+TEKNİK\s+ÜNİVERSİTESİ|ISTANBUL\s+TECHNICAL\s+UNIVERSITY|ÖĞRENİM\s+BELGESİ|TRANSCRIPT|ÖN\s+İZLEME|Sayfa\s+\d+\s*\/\s*\d+|Page\s+\d+\s*\/\s*\d+)\b|\s:\s|^[^:]{1,40}:\s|:$/i;

function isoDate(d, m, y) {
  const dd = Number(d), mm = Number(m), yy = Number(y);
  if (!(dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 1950 && yy <= 2100)) return '';
  return `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
}

// Bir staj satırı (önceki taşmış satırlarla birleştirilmiş) → { days, start, end, exempt } | null.
export function parseInternshipRow(text) {
  const line = cleanLine(text).replace(/\s*ÖN\s+İZLEME\s*$/i, '');
  const daysMatch = line.match(INTERNSHIP_DAYS_RE);
  if (!daysMatch) return null;
  const days = Number(daysMatch[1]);
  if (!Number.isFinite(days) || days <= 0 || days > 365) return null;
  const head = line.slice(0, daysMatch.index);
  const dates = head.match(INTERNSHIP_DATES_RE);
  const start = dates ? isoDate(dates[1], dates[2], dates[3]) : '';
  const end = dates ? isoDate(dates[4], dates[5], dates[6]) : '';
  const institution = dates ? head.slice(0, dates.index) : head;
  const exempt = /(?:^|\s)(?:MUAF|EXEMPT(?:ED)?)(?=\s|$)/i.test(institution);
  return { days, start, end, exempt };
}

const PASSING_GRADES = new Set(['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'BL', 'M', 'G', 'P']);

// OBS ile müfredat kaynağı aynı ders adını farklı kısaltmalarla verebiliyor.
// Yalnız doğrulanmış, anlamı dar alias'ları birleştir; fuzzy/benzerlik tahmini yapma.
const NAME_ALIASES = new Map([
  ['general chemistry lab', 'general chemistry i laboratory'],
  ['general chemistry laboratory', 'general chemistry i laboratory'],
  ['general chemistry i lab', 'general chemistry i laboratory'],
  ['intro to electronics lab', 'introduction to electronics laboratory'],
  ['intro to electronics laboratory', 'introduction to electronics laboratory'],
  ['intr to electronics lab', 'introduction to electronics laboratory'],
  ['intr to electronics laboratory', 'introduction to electronics laboratory'],
  ['basic academic writing', 'basics of academic writing'],
].map(([from, to]) => [nameKey(from), nameKey(to)]));

function numberTR(raw) {
  const n = Number(String(raw || '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function cleanLine(raw) {
  return String(raw || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function nameKey(raw) {
  return String(raw || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9çğıöşü]+/g, ' ').trim();
}

function equivalentNameKey(raw) {
  const key = nameKey(raw);
  return NAME_ALIASES.get(key) || key;
}

function isPassingGrade(grade) {
  return PASSING_GRADES.has(grade);
}

export function electivePool(title, options) {
  if (/\b(?:ITB|SNT)\b/i.test(title || '')) return 'ITB_SNT';
  const branches = new Set([...options].map((code) => code.split(' ')[0]).filter(Boolean));
  return branches.size > 0 && [...branches].every((branch) => branch === 'ITB' || branch === 'SNT') ? 'ITB_SNT' : '';
}

// OBS uzun adları kırpar: "Linear Algebra and Applicat." ↔ "Linear Algebra and
// Applications". Sözcük sayısı aynı, her OBS sözcüğü plandaki karşılığına eşit
// ya da onun en az 4 harflik başı, en az bir sözcük gerçekten kırpılmış.
export function abbreviatedNameMatch(obsKey, planKey) {
  const a = String(obsKey || '').split(' ').filter(Boolean);
  const b = String(planKey || '').split(' ').filter(Boolean);
  if (a.length < 2 || a.length !== b.length) return false;
  let cut = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    if (a[i].length >= 4 && b[i].startsWith(a[i])) { cut = true; continue; }
    return false;
  }
  return cut;
}

function recordMatchesRequired(record, target, requiredByName) {
  if (target.code && record.code === target.code) return true;
  const key = equivalentNameKey(record.name);
  const sameName = requiredByName.get(key) || [];
  if (sameName.length) return sameName.length === 1 && sameName[0].slot === target.slot;
  // Tam ad tutmadıysa kırpılmış ad: tek aday olmalı ve kredi (biliniyorsa) aynı.
  const cands = [];
  for (const [planKey, list] of requiredByName) {
    if (abbreviatedNameMatch(key, planKey)) cands.push(...list);
  }
  if (cands.length !== 1 || cands[0].slot !== target.slot) return false;
  const rc = Number(record.credits);
  const tc = Number(target.credits);
  return !(Number.isFinite(rc) && Number.isFinite(tc) && rc > 0 && tc > 0 && rc !== tc);
}

function selectedEquivalentAttempt(records, target, requiredByName) {
  const attempts = (records || [])
    .filter((record) => recordMatchesRequired(record, target, requiredByName))
    .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
  if (!attempts.length) return null;
  // OBS'nin kuralı: `*` işaretli deneme yerine başka (aynı ya da eşdeğer
  // kodlu) bir ders alınmış demektir ve ortalamaya girmez. İşaretsiz son
  // deneme geçerlidir; başarısız da olsa (FF/VF) OBS onu sayar. İşaret
  // bilgisi hiç yoksa (eksik kopya) başarılı son deneme tercih edilir.
  const current = attempts.filter((record) => !record.markedRepeat);
  const passed = attempts.filter((record) => isPassingGrade(record.grade));
  const selected = current.length && current.length < attempts.length
    ? current.at(-1)
    : (passed.length ? passed : attempts).at(-1);
  const selectedIndex = attempts.indexOf(selected);
  return {
    ...selected,
    prev: selectedIndex > 0 ? attempts[selectedIndex - 1].grade : '',
    repeat: attempts.length > 1 || attempts.some((record) => record.markedRepeat),
    attempts: attempts.length,
    equivalentCodes: [...new Set(attempts.map((record) => record.code))],
  };
}

// Havuzu ITB_SNT olan slotların seçeneklerinin birleşimi (koda göre tekil,
// plan sırasıyla). Arayüz bu slotlarda seçiciye bu listeyi verir: ITB slotuna
// SNT dersi, SNT slotuna ITB dersi elle de seçilebilir.
export function itbSntSlotOptions(plan) {
  const slots = new Set();
  const options = [];
  const seen = new Set();
  for (const [si, semester] of (plan?.semesters || []).entries()) {
    for (const [ii, item] of (semester.items || []).entries()) {
      if (!item.elective) continue;
      const list = item.elective.options || [];
      const codes = list.map((o) => canonicalCode(o.code)).filter(Boolean);
      if (electivePool(item.elective.title, codes) !== 'ITB_SNT') continue;
      slots.add(`s${si}i${ii}`);
      for (const o of list) {
        const code = canonicalCode(o.code);
        if (!code || seen.has(code)) continue;
        seen.add(code);
        options.push(o);
      }
    }
  }
  return { slots, options };
}

export function parseOBSTranscript(raw) {
  const lines = String(raw || '').split(/\r?\n/).map(cleanLine).filter(Boolean);
  const records = [];
  const programs = new Set();
  let term = '';
  let expectProgram = false;
  let officialGpa = null;
  const standingByTerm = new Map();
  const internships = [];
  let inInternships = false;
  let internshipBuf = [];

  for (const line of lines) {
    // Staj bölümü: bu bölümdeki hiçbir satır ders kaydı sayılmaz.
    if (INTERNSHIP_HEAD_RE.test(line)) {
      inInternships = true;
      internshipBuf = [];
      term = '';
      expectProgram = false;
      continue;
    }
    if (inInternships) {
      if (/^\*\*\s*Belge\s+Sonu|^\*\*\s*End\s+of\s+Document/i.test(line)) { inInternships = false; internshipBuf = []; continue; }
      // Staj bölümünden sonra yeni bir dönem başlarsa (beklenmez) bölüm biter.
      if (TERM_RE.test(line) || IN_PROGRESS_RE.test(line)) { inInternships = false; internshipBuf = []; }
      else {
        if (INTERNSHIP_COLS_RE.test(line) || PAGE_NOISE_RE.test(line)) continue;
        internshipBuf.push(line);
        if (internshipBuf.length > 4) internshipBuf.shift();
        const row = parseInternshipRow(internshipBuf.join(' '));
        if (row) { internships.push(row); internshipBuf = []; }
        continue;
      }
    }
    if (IN_PROGRESS_RE.test(line)) {
      term = '';
      expectProgram = false;
      continue;
    }
    const termMatch = line.match(TERM_RE);
    if (termMatch) {
      term = `${termMatch[1]} / ${termMatch[2]}`;
      expectProgram = false;
      continue;
    }

    if (/^A\.Krd\.\s+B\.Krd\.\s+O\.K\.Krd\.\s+B\.Puan\s+Ort\./i.test(line)) {
      expectProgram = true;
      continue;
    }
    if (expectProgram && !/^(Dönem|Toplam)\b/i.test(line)) {
      programs.add(line);
      expectProgram = false;
      continue;
    }

    if (/^Toplam\s+/i.test(line)) {
      const nums = line.match(/\d+(?:[.,]\d+)?/g) || [];
      const last = numberTR(nums.at(-1));
      if (last != null && last >= 0 && last <= 4) officialGpa = last;
      continue;
    }

    const standingMatch = line.match(STANDING_RE);
    if (standingMatch) {
      const status = standingStatus(standingMatch[1]);
      if (term && status) standingByTerm.set(term, status);
      continue;
    }

    const match = line.match(COURSE_RE);
    if (!match || !term) continue;
    const code = canonicalCode(`${match[1].toLocaleUpperCase('tr-TR')} ${match[2].toLocaleUpperCase('tr-TR')}`);
    records.push({
      code,
      name: match[3],
      credits: numberTR(match[4]) || 0,
      grade: match[5].toLocaleUpperCase('tr-TR'),
      markedRepeat: match[6] === '*',
      term,
      seq: records.length,
    });
  }

  // standing: dönem başına resmî akademik durum (belge sırasıyla).
  const standing = [...standingByTerm.entries()].map(([t, status]) => ({ term: t, status }));
  return { records, programs: [...programs], officialGpa, standing, internships };
}

// OBS'nin kümülatif GANO kuralı (transkriptteki dönem "Toplam" satırlarından
// doğrulandı):
//   - `*` ile işaretli deneme, yerine sonradan alınmış bir ders olduğu için
//     ortalamaya girmez. Yerine geçen ders başka kodlu olabilir (BLG 112E VF *
//     → BBF 103E DC+, BLG 335E VF * → CEN 335E CB); bu bağı yalnız `*` taşır.
//   - Aynı koddan işaretsiz birden çok deneme varsa yalnız sonuncusu sayılır.
//     Yaz okulunda aynı FF/VF tekrarı A.Krd'yi artırır ama O.K.Krd'yi değil.
//   - FF/VF kredisi paydaya girer, katsayısı 0'dır. BL/M/G/P/E ve 0 kredili
//     dersler ortalamaya girmez. Notu olmayan (devam eden) dersler zaten
//     ayrıştırılmaz.
// Seçili müfredattan bağımsızdır: plana eşleşmeyen dersler (ör. CIN 101) de sayılır.
export function transcriptCountedAttempts(records) {
  const latest = new Map();
  for (const record of records || []) {
    if (!record?.code || record.markedRepeat || !GRADES.includes(record.grade)) continue;
    const prev = latest.get(record.code);
    if (!prev || (record.seq ?? 0) >= (prev.seq ?? 0)) latest.set(record.code, record);
  }
  return [...latest.values()]
    .filter((record) => GRADE_POINTS[record.grade] !== undefined && Number(record.credits) > 0)
    .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
}

// Transkriptin kendi kayıtlarından GANO: { gpa, credits, points }. Not yoksa gpa null.
export function transcriptGpa(records) {
  let points = 0, credits = 0;
  for (const record of transcriptCountedAttempts(records)) {
    const cr = Number(record.credits) || 0;
    points += GRADE_POINTS[record.grade] * cr;
    credits += cr;
  }
  return { gpa: credits > 0 ? points / credits : null, credits, points };
}

// Dönem özetleri (onur değerlendirmesi için, Lisans Yönetmeliği Madde 23(8)):
// her dönemin o dönemde alınan TÜM notlu denemelerinden yarıyıl ortalaması,
// başarılan kredi ve FF/VF olup olmadığı. Ders adı/kodu saklanmaz.
// Dönüş: [{ term, gpa, credits, passedCredits, hasFail }] (belge sırasıyla).
export function transcriptTermSummary(records) {
  const byTerm = new Map();
  for (const record of records || []) {
    if (!record?.term || !GRADES.includes(record.grade)) continue;
    const cur = byTerm.get(record.term) || { term: record.term, points: 0, credits: 0, passedCredits: 0, hasFail: false };
    const cr = Number(record.credits) || 0;
    const pts = GRADE_POINTS[record.grade];
    if (record.grade === 'FF' || record.grade === 'VF') cur.hasFail = true;
    if (pts !== undefined && cr > 0) {
      cur.points += pts * cr;
      cur.credits += cr;
      if (pts > 0) cur.passedCredits += cr;
    }
    byTerm.set(record.term, cur);
  }
  return [...byTerm.values()].map(({ points, ...t }) => ({ ...t, gpa: t.credits > 0 ? points / t.credits : null }));
}

export function transcriptLatest(records) {
  const byCode = new Map();
  for (const record of records || []) {
    if (!record?.code || !GRADES.includes(record.grade)) continue;
    const attempts = byCode.get(record.code) || [];
    attempts.push(record);
    byCode.set(record.code, attempts);
  }
  return [...byCode.entries()].map(([code, attempts]) => ({
    code,
    name: attempts.at(-1).name,
    credits: attempts.at(-1).credits,
    grade: attempts.at(-1).grade,
    term: attempts.at(-1).term,
    seq: attempts.at(-1).seq,
    prev: attempts.length > 1 ? attempts.at(-2).grade : '',
    repeat: attempts.length > 1 || attempts.some((a) => a.markedRepeat),
    attempts: attempts.length,
  }));
}

// Seçili müfredata önce ders koduyla, kod değişmişse benzersiz ders adıyla,
// ardından seçmeli havuz seçenekleriyle eşler. Tahmine dayalı dönem/slot ataması
// yapılmaz; eşleşmeyenler kullanıcıya açıkça raporlanır.
export function matchTranscriptToPlan(plan, records) {
  const latest = transcriptLatest(records);
  const required = [];
  const electives = [];
  for (const [si, semester] of (plan?.semesters || []).entries()) {
    for (const [ii, item] of (semester.items || []).entries()) {
      if (item.course) {
        const code = canonicalCode(item.course.code);
        required.push({ slot: `s${si}i${ii}`, code, name: item.course.name || '', credits: item.course.credits });
      } else if (item.elective) {
        const optionList = item.elective.options || [];
        const options = new Set(optionList.map((o) => canonicalCode(o.code)).filter(Boolean));
        // Ad → planın kendi kodu: seçici <select> yalnızca bu kodları tanır,
        // transkriptteki kod farklıysa (bkz. aşağıdaki ad eşleşmesi) plana
        // yazılan kod bu haritadan gelmeli — yoksa seçim boş görünür.
        const optionCodeByName = new Map();
        for (const o of optionList) {
          const key = equivalentNameKey(o.name);
          const code = canonicalCode(o.code);
          if (key && code && !optionCodeByName.has(key)) optionCodeByName.set(key, code);
        }
        electives.push({
          slot: `s${si}i${ii}`,
          options,
          optionCodeByName,
          pool: electivePool(item.elective.title, options),
        });
      }
    }
  }

  const requiredByName = new Map();
  for (const course of required) {
    const key = equivalentNameKey(course.name);
    if (!key) continue;
    const list = requiredByName.get(key) || [];
    list.push(course);
    requiredByName.set(key, list);
  }

  const usedRecords = new Set();
  const usedSlots = new Set();
  const courseAssignments = [];
  const electiveAssignments = [];
  const unmatched = [];

  // Zorunlu dersleri hedef slot bazında çöz. Böylece kodu boş laboratuvarlar
  // birbirini ezmez; kod değişimlerinde de eski başarısız deneme, daha sonraki
  // başarılı eşdeğer dersin önüne geçmez.
  for (const target of required) {
    const record = selectedEquivalentAttempt(records, target, requiredByName);
    if (!record) continue;
    for (const code of record.equivalentCodes) usedRecords.add(code);
    courseAssignments.push({
      ...record,
      sourceCode: record.code,
      targetCode: target.code || record.code,
      targetPlanCode: target.code,
      targetSlot: target.slot,
    });
  }

  const remaining = latest.filter((record) => !usedRecords.has(record.code));
  const assignedElectiveCodes = new Set();

  // ITB ve SNT seçmelileri İTÜ kuralı gereği birbirinin yerine sayılır: ITB
  // slotuna SNT dersi, SNT slotuna ITB dersi yazılabilir. Bu yüzden havuzu
  // ITB_SNT olan bütün slotlar tek bir ortak havuz gibi ele alınır. Bu havuza
  // uyan dersler (herhangi bir ITB_SNT slotunun seçeneği, adı ya da ITB/SNT
  // önekli kod) alındıkları sıraya göre (ilk deneme → en erken yarıyıl slotu)
  // yerleştirilir; yoksa 2. yılda alınan bir ders yalnız kendi kodunu listeleyen
  // 7. yarıyıl slotuna düşerdi.
  const itbSlots = electives.filter((entry) => entry.pool === 'ITB_SNT');
  const otherSlots = electives.filter((entry) => entry.pool !== 'ITB_SNT');
  const itbOptions = new Set();
  const itbCodeByName = new Map();
  for (const entry of itbSlots) {
    for (const code of entry.options) itbOptions.add(code);
    for (const [key, code] of entry.optionCodeByName) if (!itbCodeByName.has(key)) itbCodeByName.set(key, code);
  }
  const firstSeq = new Map();
  for (const record of records || []) {
    if (!record?.code) continue;
    const seq = record.seq ?? 0;
    if (!firstSeq.has(record.code) || seq < firstSeq.get(record.code)) firstSeq.set(record.code, seq);
  }
  const itbCandidates = remaining
    .map((record) => {
      // Seçenek listesindeki numarasız branş ("CIN") o branşın her dersini kapsar.
      const branch = String(record.code).split(' ')[0];
      if (itbOptions.has(record.code) || itbOptions.has(branch) || /^(?:ITB|SNT)\s/.test(record.code)) return { record, code: record.code };
      const key = equivalentNameKey(record.name);
      return key && itbCodeByName.has(key) ? { record, code: itbCodeByName.get(key) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (firstSeq.get(a.record.code) ?? a.record.seq ?? 0) - (firstSeq.get(b.record.code) ?? b.record.seq ?? 0));
  for (const { record, code } of itbCandidates) {
    const slot = itbSlots.find((entry) => !usedSlots.has(entry.slot));
    if (!slot) break;
    usedSlots.add(slot.slot);
    assignedElectiveCodes.add(record.code);
    electiveAssignments.push({ ...record, code, slot: slot.slot });
  }

  // Diğer havuzlarda kesin seçenek kodlarını bütün dersler için önce tüket.
  for (const record of remaining) {
    if (assignedElectiveCodes.has(record.code)) continue;
    const branch = String(record.code).split(' ')[0];
    const slot = otherSlots.find((entry) => !usedSlots.has(entry.slot) && (entry.options.has(record.code) || entry.options.has(branch)));
    if (slot) {
      usedSlots.add(slot.slot);
      assignedElectiveCodes.add(record.code);
      electiveAssignments.push({ ...record, slot: slot.slot });
    }
  }

  // Kod eşleşmezse tam ders adı eşleşmesi denenir: kampüsler arası farklı
  // numaralandırma aynı dersi başka kodla listeleyebiliyor (ör. İTÜ-KKTC planında
  // BLG 430E, ana kampüste BLG 422E — ikisi de "Computer Networks"). Yalnız
  // birebir ad eşleşmesi; NAME_ALIASES dışında tahmin/benzerlik yapılmaz.
  for (const record of remaining) {
    if (assignedElectiveCodes.has(record.code)) continue;
    const key = equivalentNameKey(record.name);
    if (!key) continue;
    const slot = otherSlots.find((entry) => !usedSlots.has(entry.slot) && entry.optionCodeByName.has(key));
    if (!slot) continue;
    usedSlots.add(slot.slot);
    assignedElectiveCodes.add(record.code);
    // Depoya planın kendi kodu yazılır (transkriptteki değil) — seçici bunu tanır.
    electiveAssignments.push({ ...record, code: slot.optionCodeByName.get(key), slot: slot.slot });
  }

  unmatched.push(...remaining.filter((record) => !assignedElectiveCodes.has(record.code)));

  // GANO anlık görüntüsü: OBS'nin saydığı her deneme, plana yazıldığı yerin
  // anahtarıyla (g:<kod> zorunlu, e:<slot> seçmeli) birlikte tutulur. Plana
  // eşleşmeyen sayılan dersler anahtarsız kalır ama ortalamaya girer.
  const keyBySeq = new Map();
  const planKeys = {};
  for (const item of courseAssignments) {
    const key = `g:${item.targetCode}`;
    keyBySeq.set(item.seq, key);
    planKeys[key] = item.grade;
  }
  for (const item of electiveAssignments) {
    const key = `e:${item.slot}`;
    keyBySeq.set(item.seq, key);
    planKeys[key] = item.grade;
  }
  const counted = transcriptCountedAttempts(records).map((record) => ({
    code: record.code,
    credits: record.credits,
    grade: record.grade,
    key: keyBySeq.get(record.seq) || '',
  }));

  return { latest, courseAssignments, electiveAssignments, unmatched, counted, planKeys, terms: transcriptTermSummary(records) };
}

// mergeTranscriptMatch üçüncü argümanla OBS'nin belgede yazan toplam GANO'sunu
// da saklar (çapraz kontrol ve "OBS transkriptine göre" etiketi için).
export function mergeTranscriptMatch(data, match, { officialGpa = null, standing = null } = {}) {
  const grades = { ...(data?.grades || {}) };
  const elective = { ...(data?.elective || {}) };
  const requiredSlots = { ...(data?.requiredSlots || {}) };
  for (const item of match?.courseAssignments || []) {
    const old = grades[item.targetCode] || {};
    grades[item.targetCode] = {
      grade: item.grade,
      prev: item.prev || (old.grade && old.grade !== item.grade ? old.grade : old.prev || ''),
      repeat: Boolean(item.repeat || old.repeat),
    };
    if (!item.targetPlanCode && item.targetSlot && item.sourceCode) {
      requiredSlots[item.targetSlot] = item.sourceCode;
    }
  }
  for (const item of match?.electiveAssignments || []) {
    const old = elective[item.slot] || {};
    elective[item.slot] = {
      code: item.code,
      grade: item.grade,
      prev: item.prev || (old.grade && old.grade !== item.grade ? old.grade : old.prev || ''),
    };
  }
  const next = { ...(data || {}), grades, elective, requiredSlots };
  if (Array.isArray(match?.counted)) {
    next.transcript = {
      officialGpa: Number.isFinite(officialGpa) ? officialGpa : null,
      entries: match.counted.map(({ code, credits, grade, key }) => ({ code, credits, grade, key })),
      planKeys: { ...(match.planKeys || {}) },
      // Plana yerleşmeyen dersler: yalnız ders bilgisi (kod, ad, kredi, not,
      // dönem); ham metin ya da kişisel bilgi saklanmaz.
      unmatched: transcriptUnmatchedList(match.unmatched),
    };
    const officialStanding = (Array.isArray(standing) ? standing : [])
      .filter((s) => s && typeof s.term === 'string' && standingStatus(s.status))
      .map((s) => ({ term: s.term, status: standingStatus(s.status) }));
    if (officialStanding.length) next.transcript.standing = officialStanding;
    if (Array.isArray(match.terms)) {
      next.transcript.terms = match.terms.map(({ term, gpa, credits, passedCredits, hasFail }) => ({ term, gpa, credits, passedCredits, hasFail }));
    }
  }
  return next;
}

// Saklanacak en küçük "plana yerleşmeyen ders" listesi.
export function transcriptUnmatchedList(list) {
  return (Array.isArray(list) ? list : [])
    .filter((r) => r && typeof r.code === 'string' && r.code)
    .map((r) => ({
      code: r.code,
      name: typeof r.name === 'string' ? r.name : '',
      credits: Number(r.credits) || 0,
      grade: typeof r.grade === 'string' ? r.grade : '',
      term: typeof r.term === 'string' ? r.term : '',
    }));
}

export function transcriptProgramCandidates(programIndex, transcriptPrograms) {
  const needles = (transcriptPrograms || []).map(nameKey).filter(Boolean);
  if (!needles.length) return [];
  return (programIndex || []).filter((program) => {
    const candidate = nameKey(program.name)
      .replace(/\b(?:ingilizce|english|lisans|onlisans|yuksek lisans|doktora)\b/g, '')
      .replace(/\s+/g, ' ').trim();
    return needles.some((needle) => {
      const plainNeedle = needle.replace(/\b(?:ingilizce|english|lisans|onlisans|yuksek lisans|doktora)\b/g, '').replace(/\s+/g, ' ').trim();
      // Transkriptteki ayırt edici nitelemeyi (örn. KKTC) düşürme. Daha kısa,
      // genel bir program adı özel kampüs programına aday sayılmamalı.
      return candidate.includes(plainNeedle);
    });
  });
}
