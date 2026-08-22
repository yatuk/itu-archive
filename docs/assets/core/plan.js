// "Ders Planım" join mantığı (saf, test edilebilir; DOM'a dokunmaz).
//
// Müfredat planı kalemlerini (docs/data/curriculum/<PROG>.json) dönem şube
// kayıtlarıyla birleştirir: bu dönem açık mı, kaç şube, son açılış hangi dönem.
// İki veri kaynağı:
//   - aktif dönem şubeleri: data/terms/<slug>/search.json (10 alanlı satırlar)
//   - ders geçmişi:          data/history/courses/<BRANŞ>.json (kod → {terms})
//
// Görünüm (views/dersplanim.js) buradaki saf fonksiyonları çağırır; kopyalanmış
// üçüncü bir "şube eşleştirme" mantığı yazılmaz.

import { trNum } from './utils.js?v=7e12ca046d39';

// search.json satırı: [crn, kod, ad, branş, hoca, zaman, kont, yazılan, seviye, yöntem, programlar]
// Şube bilgisini okunur nesneye toplar (Faz E: courses.js satır bileşenine giriş).
export function rowToSection(r) {
  return {
    crn: r[0], code: r[1], name: r[2], branch: r[3], instructor: r[4],
    when: r[5], cap: r[6], enr: r[7], level: r[8], method: r[9], programs: r[10],
  };
}

// Kod karşılaştırma anahtarı: büyük/küçük + boşluktan bağımsız, "BLG 102E" → "BLG102E".
export function codeKey(code) {
  return String(code || '').toUpperCase().replace(/\s+/g, '');
}

// Ham plan kodunu TEK kanonik koda indirger. OBS müfredatı aynı dersin İngilizce
// ve Türkçe kodlarını yan yana basabilirdi ("SAO 101E SAO 101"); E sonekli
// (İngilizce) sürüm kanonik kabul edilir. Görünüm ve eşleştirme bu fonksiyonu
// tek kaynak kullanır — kod iki kere basılmaz, join çift kodla bozulmaz.
export function canonicalCode(code) {
  const parts = String(code || '').trim().split(/\s+/);
  const tokens = [];
  for (let i = 0; i + 1 < parts.length; i++) {
    // "101" ya da "101E" (İngilizce-E sonekli) sayı parçası: "SAO 101E" tek kalem.
    if (/^\d{2,4}E?$/i.test(parts[i + 1])) {
      tokens.push(parts[i] + ' ' + parts[i + 1]);
      i++;
    }
  }
  if (!tokens.length) return String(code || '').trim();
  return tokens.find((t) => t.endsWith('E')) || tokens[0];
}

// Plan kodu ↔ dönem şube kodu eşleşmesini ortak saf fonksiyona indirger:
// boşlukları at, büyük harfe çevir, E sonekini iki yönlü dene — "SAO 101" ↔
// "SAO 101E" her iki yönde de eşleşir. (E-soneki İngilizce koddur, ders aynıdır.)
export function codesMatch(a, b) {
  const ka = codeKey(a);
  const kb = codeKey(b);
  if (!ka || !kb) return false;
  if (ka === kb) return true;
  return ka.replace(/E$/, '') === kb || kb.replace(/E$/, '') === ka;
}

// Ders kodunun dönem şubelerini bulur. "BLG 102E" hem "BLG 102E" hem "BLG 102"
// satırlarıyla eşleşir (İngilizce-E soneki — aramadaki mevcut davranış).
export function sectionsForCode(rows, code) {
  const canonical = canonicalCode(code);
  const want = codeKey(canonical);
  if (!want) return [];
  return (rows || [])
    .filter((r) => codesMatch(r[1], canonical))
    .map(rowToSection);
}

// Şubeleri aynı zaman/kontenjan/hoca üzerinden gruplar. Aynı gün/saat ve kontenjana
// sahip şubeler (ör. 37 kopya şube) tek satıra iner: CRN aralığı · gün/saat · N şube.
// Dönüş: [{ crns, when, cap, enr, instructor, branch, code, count, label }] — label
// düz metindir ("10008–10010"); "<" içeren hiçbir alan üretilmez (render tarafı textContent).
export function groupSections(sections) {
  const groups = [];
  const byKey = new Map();
  for (const s of (sections || [])) {
    const instructor = cleanInstructor(s.instructor);
    const key = [s.when, s.cap, s.enr, instructor, s.branch].join('|');
    let g = byKey.get(key);
    if (!g) {
      g = { crns: [], when: s.when, cap: s.cap, enr: s.enr, instructor, branch: s.branch, code: s.code };
      byKey.set(key, g);
      groups.push(g);
    }
    g.crns.push(s.crn);
  }
  return groups.map((g) => ({ ...g, count: g.crns.length, label: crnRangeText(g.crns) }));
}

// "-" / "—" gibi yedek hoca işaretleri boş sayılır — hoca kolonu o zaman hiç çizilmez.
function cleanInstructor(v) {
  const t = String(v || '').trim();
  return (t === '-' || t === '·' || t === '–') ? '' : t;
}

// Ders satırının yük etiketi: "2+0+0 · 0 kr · 2 AKTS". Kredi 0/eksikse "0 kr"
// basılır — birim tek başına kalmaz, "kr" boş kalmaz.
export function courseMetaLabel(c) {
  const tct = [c.theory, c.tutorial, c.lab].map((n) => n || 0).join('+');
  return `${tct} · ${trNum(c.credits ?? 0)} kr · ${trNum(c.ects ?? 0)} AKTS`;
}

// Satırdaki kredi rozetinin metni — yalnızca sayı ("3", "1,5", "0"). Saf, testli.
export function creditBadge(c) {
  return trNum(c.credits ?? 0);
}

// "10008, 10009, 10010" → "10008–10010"; sayısal olmayan CRN'ler virgüllü kalır.
export function crnRangeText(crns) {
  const nums = (crns || []).map(Number).filter((n) => !isNaN(n));
  if (nums.length !== (crns || []).length) return (crns || []).join(', ');
  nums.sort((a, b) => a - b);
  const parts = [];
  let start = nums[0], prev = nums[0];
  for (let i = 1; i <= nums.length; i++) {
    const cur = nums[i];
    if (cur !== prev + 1) {
      parts.push(prev === start ? String(start) : `${start}–${prev}`);
      start = cur;
    }
    prev = cur;
  }
  return parts.join(', ');
}

// Bir ders kodunun durumu: açık (bu dönem şubesi var) / kapalı (geçmişte açıldı)
// / eşleşme yok (geçmişte de hiç açılmadı ya da kod farklı).
// history: history/courses/<BRANŞ>.json nesnesi (kod → { code, terms, rows }).
export function joinCourse(code, rows, history) {
  const canonical = canonicalCode(code);
  const sections = sectionsForCode(rows, canonical);
  if (sections.length) return { state: 'open', sections };
  const rec = historyRecord(history, canonical) || historyRecord(history, code);
  if (rec && rec.terms && rec.terms.length) {
    return { state: 'closed', lastTerm: rec.terms[rec.terms.length - 1] };
  }
  return { state: 'missing' };
}

// history kaydını kod + kanonik + anahtar biçimlerinin birinde arar.
function historyRecord(history, code) {
  if (!history || !code) return null;
  const c = canonicalCode(code);
  return history[code] || history[c] || history[codeKey(c)] || history[codeKey(code)] || null;
}

// Seçmeli slot: her alternatifin durumunu ekleyip bu dönem açık olanları sayar.
export function joinElective(elective, rows, history) {
  const options = (elective.options || []).map((o) => ({
    ...o,
    status: joinCourse(o.code, rows, history),
  }));
  const openCount = options.filter((o) => o.status.state === 'open').length;
  return { ...elective, options, openCount };
}

// "4 / 5" veya "4" kredi aralığını sayı dizisine çevirir; boşsa varsayılan.
export function parseRange(s, def) {
  const parts = String(s || '').split('/').map((p) => parseFloat(p.replace(',', '.')));
  const nums = parts.filter((n) => !isNaN(n));
  return nums.length ? nums : (def || [0]);
}

// Tek plan kaleminin yükü. Zorunlu ders tek değer; seçmeli slot aralıklı
// olabilir (credits "4 / 5", ects [4,5,6]). Dönüş { credits: number[]|[], ects: number[] }.
export function itemLoad(item) {
  if (item.course) {
    return { credits: [item.course.credits || 0], ects: [item.course.ects || 0] };
  }
  if (item.elective) {
    const e = item.elective;
    return {
      credits: parseRange(e.credits),
      ects: (e.ects && e.ects.length) ? e.ects.slice() : [0],
    };
  }
  return { credits: [], ects: [] };
}

// Bir yarıyılın plan yükü. Her kalemin min/max'ı toplanır; tüm kalemler tek
// değerse tek sayı, aralıklar varsa { min, max } döner. Seçmeli slotta ders
// seçimi yoksa plan kredisi birebir kullanılır.
export function semesterLoad(semester) {
  let cMin = 0, cMax = 0, eMin = 0, eMax = 0;
  for (const item of (semester.items || [])) {
    const { credits, ects } = itemLoad(item);
    const cLo = credits.length ? Math.min(...credits) : 0;
    const cHi = credits.length ? Math.max(...credits) : 0;
    const eLo = ects.length ? Math.min(...ects) : 0;
    const eHi = ects.length ? Math.max(...ects) : 0;
    cMin += cLo; cMax += cHi;
    eMin += eLo; eMax += eHi;
  }
  const range = (min, max) => (min === max ? min : { min, max });
  return { credits: range(cMin, cMax), ects: range(eMin, eMax) };
}

// Yükü ekrana yazar: {min,max} → "30–32 AKTS", tek → "30 AKTS". kredi/akts
// ayrı yazılır ("3 kr · 4,5 AKTS").
export function fmtLoad(item) {
  const { credits, ects } = itemLoad(item);
  const cr = fmtRange(credits);
  const ec = fmtRange(ects);
  const out = [];
  if (cr) out.push(cr);
  if (ec) out.push(ec);
  return out.join(' · ');
}

function fmtRange(nums) {
  if (!nums || !nums.length) return '';
  const min = Math.min(...nums), max = Math.max(...nums);
  return min === max ? trNum(min) : `${trNum(min)}–${trNum(max)}`;
}

// Özet sayıları (Faz C): plan kalemleri × durum. totalCredits/totalEcts plan
// başlığından (string, "134") gelir; girilen krediye göre hesap görünümde yapılır.
export function planSummary(plan, rows, history) {
  const out = {
    courses: 0,       // zorunlu ders satırı
    open: 0,          // açık zorunlu ders
    closed: 0,        // bu dönem kapalı (geçmişte açıldı)
    missing: 0,       // eşleşme yok
    slots: 0,         // seçmeli slot
    slotOpen: 0,      // en az bir alternatifi açık olan slot
    totalCredits: plan.totalCredits || '',
    totalEcts: plan.totalEcts || '',
  };
  for (const sem of (plan.semesters || [])) {
    for (const item of (sem.items || [])) {
      if (item.course) {
        out.courses++;
        const st = joinCourse(item.course.code, rows, history).state;
        if (st === 'open') out.open++;
        else if (st === 'closed') out.closed++;
        else out.missing++;
      } else if (item.elective) {
        out.slots++;
        if (joinElective(item.elective, rows, history).openCount > 0) out.slotOpen++;
      }
    }
  }
  return out;
}
