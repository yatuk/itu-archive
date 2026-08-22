// OBS Transkript Önizleme ekranından kopyalanan düz metni ayrıştırır.
// Saf modüldür: DOM, localStorage ve ağ erişimi yoktur. Öğrenci adı/numarası,
// kimlik ve doğum bilgileri hiçbir çıktıya alınmaz; yalnız ders kayıtları,
// dönem etiketi ve belgedeki son toplam GANO döner.

import { canonicalCode } from './plan.js?v=e99ae63c7504';

const GRADES = ['AA', 'BA+', 'BA', 'BB+', 'BB', 'CB+', 'CB', 'CC+', 'CC', 'DC+', 'DC', 'DD+', 'DD', 'FF', 'VF', 'BL', 'M', 'G', 'P', 'E'];
const GRADE_PART = GRADES.map((g) => g.replace('+', '\\+')).join('|');
const COURSE_RE = new RegExp(`^([A-ZÇĞİÖŞÜ]{2,6})\\s+(\\d{3,4}[A-Z]{0,3})\\s+(.+?)\\s+(\\d+(?:[.,]\\d{1,2})?)\\s+(${GRADE_PART})(?:\\s+(\\*))?\\s*$`, 'i');
const TERM_RE = /^(\d{4}-\d{4})\s*\/\s*(Güz|Bahar|Yaz|Fall|Spring|Summer)\s+(?:Dönemi|Semester)$/i;

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
    .replace(/[^a-z0-9çğıöşü]+/g, ' ').trim();
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
        if (code) required.push({ code, name: item.course.name || '' });
      } else if (item.elective) {
        electives.push({
          slot: `s${si}i${ii}`,
          options: new Set((item.elective.options || []).map((o) => canonicalCode(o.code)).filter(Boolean)),
        });
      }
    }
  }

  const requiredByCode = new Map(required.map((r) => [r.code, r]));
  const requiredByName = new Map();
  for (const course of required) {
    const key = nameKey(course.name);
    if (!key) continue;
    const list = requiredByName.get(key) || [];
    list.push(course);
    requiredByName.set(key, list);
  }

  const usedRequired = new Set();
  const usedSlots = new Set();
  const courseAssignments = [];
  const electiveAssignments = [];
  const unmatched = [];

  for (const record of latest) {
    let target = requiredByCode.get(record.code);
    if (!target) {
      const byName = requiredByName.get(nameKey(record.name)) || [];
      if (byName.length === 1) target = byName[0];
    }
    if (target && !usedRequired.has(target.code)) {
      usedRequired.add(target.code);
      courseAssignments.push({ ...record, targetCode: target.code });
      continue;
    }

    const slot = electives.find((entry) => !usedSlots.has(entry.slot) && entry.options.has(record.code));
    if (slot) {
      usedSlots.add(slot.slot);
      electiveAssignments.push({ ...record, slot: slot.slot });
      continue;
    }
    unmatched.push(record);
  }

  return { latest, courseAssignments, electiveAssignments, unmatched };
}

export function mergeTranscriptMatch(data, match) {
  const grades = { ...(data?.grades || {}) };
  const elective = { ...(data?.elective || {}) };
  for (const item of match?.courseAssignments || []) {
    const old = grades[item.targetCode] || {};
    grades[item.targetCode] = {
      grade: item.grade,
      prev: item.prev || (old.grade && old.grade !== item.grade ? old.grade : old.prev || ''),
      repeat: Boolean(item.repeat || old.repeat),
    };
  }
  for (const item of match?.electiveAssignments || []) {
    const old = elective[item.slot] || {};
    elective[item.slot] = {
      code: item.code,
      grade: item.grade,
      prev: item.prev || (old.grade && old.grade !== item.grade ? old.grade : old.prev || ''),
    };
  }
  return { ...(data || {}), grades, elective };
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
