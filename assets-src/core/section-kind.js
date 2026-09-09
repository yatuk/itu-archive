// OBS bazı kayıtları normal ders şubeleriyle aynı listede yayımlar. Arayüzde
// bunları zaman bilgisi eksik bir ders gibi göstermek yerine türünü açıklarız.
export function specialSectionKind(row) {
  const name = String(row?.[2] || '');
  const method = String(row?.[9] || '');
  if (/\bek\s*sınav\b/i.test(method) || /\badditional\s+exam\b/i.test(method)) return 'extra-exam';
  if (/\b(bitirme|graduation\s+(?:project|study|design|thesis)|capstone)\b/i.test(name)) return 'graduation';
  return '';
}
