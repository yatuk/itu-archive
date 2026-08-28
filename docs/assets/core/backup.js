import { isPlainObject, readLocalState, writeLocalState } from './persistence.js?v=38c6e1b51679';

export const BACKUP_FORMAT = 'itu-ders-backup';
export const BACKUP_VERSION = 1;

const KEYS = {
  programs: 'itu-programs',
  programView: 'itu-program-view',
  gpa: 'itu-grades',
  taken: 'itu-taken',
};

const validPrograms = (v) => isPlainObject(v) && Array.isArray(v.programs) && v.programs.length > 0 && v.programs.every((p) =>
  isPlainObject(p) && Number.isFinite(Number(p.id)) && typeof p.name === 'string' && Array.isArray(p.items));

export function createBackup(read = readLocalState, now = () => new Date()) {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: now().toISOString(),
    // Transkriptin ham metni ve kimlik bilgileri hiçbir zaman bu yapıya girmez.
    programs: read(KEYS.programs, { fallback: { programs: [{ id: 1, name: 'Program 1', items: [] }], active: 1 }, legacyKey: KEYS.programs, validate: validPrograms }),
    programView: read(KEYS.programView, { fallback: {}, validate: isPlainObject }),
    gpa: read(KEYS.gpa, { fallback: {}, legacyKey: KEYS.gpa, validate: isPlainObject }),
    taken: read(KEYS.taken, { fallback: { codes: [], program: '' }, legacyKey: KEYS.taken, validate: isPlainObject }),
  };
}

export function parseBackup(raw) {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!isPlainObject(value) || value.format !== BACKUP_FORMAT || value.version !== BACKUP_VERSION) return null;
    if (!validPrograms(value.programs) || !isPlainObject(value.programView) || !isPlainObject(value.gpa) || !isPlainObject(value.taken)) return null;
    return value;
  } catch { return null; }
}

export function backupSummary(value) {
  const programs = value?.programs?.programs || [];
  const sections = programs.reduce((n, p) => n + (p.items?.length || 0), 0);
  const gpaPrograms = Object.keys(value?.gpa || {}).length;
  return { programs: programs.length, sections, gpaPrograms };
}

export function restoreBackup(value, write = writeLocalState) {
  const parsed = parseBackup(value);
  if (!parsed) return false;
  return [
    write(KEYS.programs, parsed.programs, { validate: validPrograms }),
    write(KEYS.programView, parsed.programView, { validate: isPlainObject }),
    write(KEYS.gpa, parsed.gpa, { validate: isPlainObject }),
    write(KEYS.taken, parsed.taken, { validate: isPlainObject }),
  ].every(Boolean);
}
