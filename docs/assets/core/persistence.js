// Küçük kullanıcı tercihleri ve kullanıcının oluşturduğu içerik için güvenli,
// sürümlü localStorage erişimi. Depolama kapalı/doluysa ya da kayıt bozuksa
// çağıran her zaman fallback alır; hiçbir görünüm bunun yüzünden açılmaz kalmaz.

export function versionedKey(key, version = 1) {
  return `${key}:v${version}`;
}

export function readLocalState(key, {
  version = 1,
  fallback = null,
  validate = () => true,
  legacyKey = '',
  parseLegacy = (raw) => JSON.parse(raw),
  migrate = (value) => value,
} = {}) {
  const storageKey = versionedKey(key, version);
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const envelope = JSON.parse(raw);
      if (envelope?.version === version && validate(envelope.data)) return envelope.data;
      try { localStorage.removeItem(storageKey); } catch {}
    }
    if (legacyKey) {
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw != null) {
        const legacy = parseLegacy(legacyRaw);
        const data = migrate(legacy);
        if (validate(data)) {
          writeLocalState(key, data, { version, validate });
          return data;
        }
      }
    }
  } catch {}
  return typeof fallback === 'function' ? fallback() : fallback;
}

export function writeLocalState(key, data, { version = 1, validate = () => true } = {}) {
  if (!validate(data)) return false;
  try {
    localStorage.setItem(versionedKey(key, version), JSON.stringify({ version, data }));
    return true;
  } catch {
    return false;
  }
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
