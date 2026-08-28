// OBS Transkript Önizleme ekranından kopyalanan düz metni ayrıştırır.
// Saf modüldür: DOM, localStorage ve ağ erişimi yoktur. Öğrenci adı/numarası,
// kimlik ve doğum bilgileri hiçbir çıktıya alınmaz; yalnız ders kayıtları,
// dönem etiketi ve belgedeki son toplam GANO döner.

import { canonicalCode } from './plan.js?v=48f281c5afc3';

const GRADES = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF', 'BL', 'M', 'G', 'P', 'E'];
const GRADE_PART = GRADES.map((g) => g.replace('+', '\\+')).join('|');
const COURSE_RE = new RegExp(`^([A-ZÇĞİÖŞÜ]{2,6})\\s+(\\d{3,4}[A-Z]{0,3})\\s+(.+?)\\s+(\\d+(?:[.,]\\d{1,2})?)\\s+(${GRADE_PART})(?:\\s+(\\*))?\\s*$`, 'i');
const TERM_RE = /^(\d{4}-\d{4})\s*\/\s*(Güz|Bahar|Yaz|Fall|Spring|Summer)\s+(?:Dönemi|Semester)$/i;
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

function electivePool(title, options) {
  if (/\b(?:ITB|SNT)\b/i.test(title || '')) return 'ITB_SNT';
  const branches = new Set([...options].map((code) => code.split(' ')[0]).filter(Boolean));
  return branches.size > 0 && [...branches].every((branch) => branch === 'ITB' || branch === 'SNT') ? 'ITB_SNT' : '';
}

function recordMatchesRequired(record, target, requiredByName) {
  if (target.code && record.code === target.code) return true;
  const key = equivalentNameKey(record.name);
  const sameName = requiredByName.get(key) || [];
  return sameName.length === 1 && sameName[0].slot === target.slot;
}

function selectedEquivalentAttempt(records, target, requiredByName) {
  const attempts = (records || [])
    .filter((record) => recordMatchesRequired(record, target, requiredByName))
    .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
  if (!attempts.length) return null;
  const passed = attempts.filter((record) => isPassingGrade(record.grade));
  const selected = (passed.length ? passed : attempts).at(-1);
  const selectedIndex = attempts.indexOf(selected);
  return {
    ...selected,
    prev: selectedIndex > 0 ? attempts[selectedIndex - 1].grade : '',
    repeat: attempts.length > 1 || attempts.some((record) => record.markedRepeat),
    attempts: attempts.length,
    equivalentCodes: [...new Set(attempts.map((record) => record.code))],
  };
}

export function parseOBSTranscript(raw) {
  const lines = String(raw || '').split(/\r?\n/).map(cleanLine).filter(Boolean);
  const records = [];
  const programs = new Set();
  let term = '';
  let expectProgram = false;
  let officialGpa = null;

  for (const line of lines) {
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

  return { records, programs: [...programs], officialGpa };
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
        required.push({ slot: `s${si}i${ii}`, code, name: item.course.name || '' });
      } else if (item.elective) {
        const options = new Set((item.elective.options || []).map((o) => canonicalCode(o.code)).filter(Boolean));
        electives.push({
          slot: `s${si}i${ii}`,
          options,
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

  // Kesin seçenek kodlarını bütün dersler için önce tüket. Aksi halde daha
  // önce gelen genel bir ITB kaydı, sonraki SNT dersinin tek kesin slotunu alır.
  for (const record of remaining) {
    const slot = electives.find((entry) => !usedSlots.has(entry.slot) && entry.options.has(record.code));
    if (slot) {
      usedSlots.add(slot.slot);
      assignedElectiveCodes.add(record.code);
      electiveAssignments.push({ ...record, slot: slot.slot });
    }
  }

  for (const record of remaining) {
    if (assignedElectiveCodes.has(record.code) || !/^(?:ITB|SNT)\s/.test(record.code)) continue;
    const slot = electives.find((entry) => !usedSlots.has(entry.slot) && entry.pool === 'ITB_SNT');
    if (!slot) continue;
    usedSlots.add(slot.slot);
    assignedElectiveCodes.add(record.code);
    electiveAssignments.push({ ...record, slot: slot.slot });
  }

  unmatched.push(...remaining.filter((record) => !assignedElectiveCodes.has(record.code)));

  return { latest, courseAssignments, electiveAssignments, unmatched };
}

export function mergeTranscriptMatch(data, match) {
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
  return { ...(data || {}), grades, elective, requiredSlots };
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
