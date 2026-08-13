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

import { trNum } from './utils.js';

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

// Ders kodunun dönem şubelerini bulur. "BLG 102E" hem "BLG 102E" hem "BLG 102"
// satırlarıyla eşleşir (İngilizce-E soneki — aramadaki mevcut davranış).
export function sectionsForCode(rows, code) {
  const want = codeKey(code);
  if (!want) return [];
  return (rows || [])
    .filter((r) => {
      const key = codeKey(r[1]);
      // Satırın E-soneksiz hali sorguya eşitse de eşleşir: "BLG 102" sorgusu
      // "BLG 102E" şubesini de bulur.
      return key === want || key.replace(/E$/, '') === want;
    })
    .map(rowToSection);
}

// Bir ders kodunun durumu: açık (bu dönem şubesi var) / kapalı (geçmişte açıldı)
// / eşleşme yok (geçmişte de hiç açılmadı ya da kod farklı).
// history: history/courses/<BRANŞ>.json nesnesi (kod → { code, terms, rows }).
export function joinCourse(code, rows, history) {
  const sections = sectionsForCode(rows, code);
  if (sections.length) return { state: 'open', sections };
  const want = codeKey(code);
  const rec = (history && (history[code] || history[want])) || null;
  if (rec && rec.terms && rec.terms.length) {
    return { state: 'closed', lastTerm: rec.terms[rec.terms.length - 1] };
  }
  return { state: 'missing' };
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
