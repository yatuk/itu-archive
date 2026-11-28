// Önşart eşdeğerliği: OBS önşart ifadeleri çoğu zaman dersin ESKİ koduna
// bağlıdır (ör. EHB 222E), plan ise aynı dersi YENİ koduyla taşır (EEE 225E).
// Katalogdaki İngilizce ad (yoksa ad) normalize edilip plan dersinin adıyla
// (ve plan dersinin kendi katalog adıyla) karşılaştırılır; yerel krediler
// biliniyorsa eşit olmalıdır. Yalnız TEK plan dersi eşleşirse kabul edilir —
// belirsiz eşleşme hiç eşleşme sayılmaz. Saf — test edilebilir.

// normCourseName: küçük harf (tr-TR, ı→i), harf/rakam dışı her şey boşluk, tek boşluk.
export function normCourseName(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    // tr-TR'de "I" → "ı"; İngilizce adlarda büyük/küçük farkı eşleşmeyi bozmasın.
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9çğıöşü]+/g, ' ')
    .trim();
}

function localCredits(entry) {
  const v = entry && entry.credits && typeof entry.credits === 'object' ? entry.credits.local : entry?.credits;
  const n = Number(v);
  return v != null && v !== '' && Number.isFinite(n) ? n : null;
}

function catalogName(entry) {
  return normCourseName(entry && (entry.nameEn || entry.name));
}

// planEquivalents(offCodes, planCourses, catalogEntry) → Map(offCode → planCode)
//   offCodes: planda olmayan önşart kodları (iterable)
//   planCourses: [{ code, name, credits }] — plan kalemleri (name: İngilizce kısa ad)
//   catalogEntry(code): katalog kaydı { name, nameEn, credits: { local } } | null
export function planEquivalents(offCodes, planCourses, catalogEntry) {
  const out = new Map();
  const lookup = typeof catalogEntry === 'function' ? catalogEntry : () => null;
  const planCodes = new Set((planCourses || []).map((p) => p && p.code).filter(Boolean));
  const plan = (planCourses || []).filter((p) => p && p.code).map((p) => {
    const cat = lookup(p.code);
    const names = new Set([normCourseName(p.name), catalogName(cat)].filter(Boolean));
    const pc = localCredits(p);
    return { code: p.code, names, credits: pc != null ? pc : localCredits(cat) };
  });
  for (const off of new Set(offCodes || [])) {
    if (!off || planCodes.has(off)) continue;
    const entry = lookup(off);
    const name = catalogName(entry);
    if (!name) continue;
    const cr = localCredits(entry);
    const hits = plan.filter((p) => p.names.has(name) && (cr == null || p.credits == null || cr === p.credits));
    if (hits.length === 1) out.set(off, hits[0].code);
  }
  return out;
}
