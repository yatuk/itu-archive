// Ders programındaki OBS bina kodlarını kampüs düzeyinde anlamlandırır.
// Liste kasıtlı olarak yalnızca güvenilir eşlemeleri içerir: bilinmeyen yeni
// kodlarda kampüs uydurmak yerine bina bazlı muhafazakâr tampon kullanılır.

const CAMPUS_BY_BUILDING = new Map();

function register(campus, codes) {
  for (const code of codes) CAMPUS_BY_BUILDING.set(code, campus);
}

register('Ayazağa', [
  'AYB', 'AYBE', 'BBB', 'BEB', 'DEP', 'EEB', 'ENB', 'FEB', 'GDB', 'HDB',
  'HLB', 'HVZ', 'INB', 'KMB', 'KORT', 'KSB', 'MDB', 'MED', 'MEDB', 'MEDC',
  'MOBGAM', 'OKB', 'PYB', 'RSLN-M', 'SDKM', 'SLN', 'SLN-M', 'SLN-V',
  'SMB', 'STD', 'SYM', 'TRS', 'UUB', 'UZEM', 'YDB',
]);
register('Gümüşsuyu', ['KORT-G', 'MKB', 'MOB', 'SLN-G', 'STD-G']);
register('Taşkışla', ['MMB']);
register('Maçka', ['ISB', 'MIAB', 'MSB', 'TMB', 'YDY']);
register('Tuzla', [
  'DMB', 'DZB', 'DZB-AKD', 'DZB-ATL', 'DZB-B', 'DZB-C', 'DZB-D', 'DZB-DG',
  'DZB-KULE', 'DZB-LAB', 'DZB-SEM', 'DZB-SIM', 'DZB-TG',
]);

const CENTRAL_CAMPUSES = new Set(['Gümüşsuyu', 'Taşkışla', 'Maçka']);

export function locationBuilding(where) {
  const raw = String(where || '').trim();
  if (!raw || /^(?:-|undeclared|online(?:\/çevrimiçi)?)$/i.test(raw)) return '';
  return raw.split(/\s+/)[0].toUpperCase();
}

export function campusForBuilding(building) {
  return CAMPUS_BY_BUILDING.get(String(building || '').trim().toUpperCase()) || '';
}

export function campusForLocation(where) {
  return campusForBuilding(locationBuilding(where));
}

export function isRemoteMethod(method) {
  return /(?:sanal|online|çevrimiçi|uzaktan|remote)/i.test(String(method || ''));
}

// Bu değerler rota süresi iddiası değil, program kurarken bırakılması önerilen
// asgari güvenlik tamponlarıdır. Merkezi kampüsler birbirine görece yakın;
// Ayazağa ve özellikle Tuzla geçişleri toplu taşıma payı gerektirir.
export function minimumTransitionMinutes(fromWhere, toWhere) {
  const fromBuilding = locationBuilding(fromWhere);
  const toBuilding = locationBuilding(toWhere);
  if (!fromBuilding || !toBuilding || fromBuilding === toBuilding) return null;

  const fromCampus = campusForBuilding(fromBuilding);
  const toCampus = campusForBuilding(toBuilding);
  if (!fromCampus || !toCampus) {
    return { kind: 'building', required: 20, fromBuilding, toBuilding, fromCampus, toCampus };
  }
  if (fromCampus === toCampus) {
    return { kind: 'building', required: 10, fromBuilding, toBuilding, fromCampus, toCampus };
  }
  const centralPair = CENTRAL_CAMPUSES.has(fromCampus) && CENTRAL_CAMPUSES.has(toCampus);
  const required = fromCampus === 'Tuzla' || toCampus === 'Tuzla' ? 90 : centralPair ? 30 : 60;
  return { kind: 'campus', required, fromBuilding, toBuilding, fromCampus, toCampus };
}

export function transitionIssue(fromWhere, toWhere, gap) {
  if (!Number.isFinite(gap) || gap < 0) return null;
  const transition = minimumTransitionMinutes(fromWhere, toWhere);
  if (!transition || gap >= transition.required) return null;
  return { ...transition, gap };
}
