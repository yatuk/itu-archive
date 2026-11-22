import { readLocalState, writeLocalState } from './core/persistence.js?v=dde1e9339338';

// Çok hafif i18n modülü. `?lang=en` parametresinden veya localStorage'dan
// dil seçimi okur; `t(key)` ile çeviri yapar.
//
// Sözlükler i18n/tr.js ve i18n/en.js'tedir; yalnız etkin dilinki yüklenir.
// Yükleme modülün üst düzey await'idir: i18n.js'i içe aktaran her modül (ve
// app.js'in ilk boyaması) sözlük gelmeden çalışmaz, anahtar ya da yanlış dil
// görünmez. index.html aynı dili seçip sözlüğü modulepreload ile erkenden
// ister, böylece bu adım modül ağacıyla paralel iner.
//
// Eksik ya da boş İngilizce anahtar Türkçeye düşer; bu birleştirme derleme
// zamanında yapılır (cmd/site, docs/assets/i18n/en.js'e tr değerini yazar).
// Sözlükte olmayan anahtar anahtarın kendisini döndürür.
const LANGS = ['tr', 'en'];
const isLang = (value) => LANGS.includes(value);

function detectLang() {
  let lang = 'tr';
  const params = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
  const want = params.get('lang');
  if (want && isLang(want)) lang = want;
  else if (typeof window !== 'undefined') {
    lang = readLocalState('itu-lang', {
      fallback: lang, legacyKey: 'itu-lang', parseLegacy: (raw) => raw,
      validate: isLang,
    });
  }
  return lang;
}

const lang = detectLang();
// Dinamik import adresleri düz metin kalmalı: cmd/site yalnız sabit adreslere
// dosyanın kendi ?v= sürümünü işler.
const dict = (lang === 'en' ? await import('./i18n/en.js') : await import('./i18n/tr.js')).default;

const I18N = (() => {
  function t(key, vars) {
    let s = dict[key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  }

  // statik HTML içindeki data-i18n attribute'lerini çevir
  function translateDOM() {
    document.documentElement.lang = lang;
    for (const el of document.querySelectorAll('[data-i18n]')) {
      const k = el.getAttribute('data-i18n');
      if (k) el.textContent = t(k);
    }
    // Görsel metinden ayrı erişilebilir adlar ve form ipuçları da dil değişimini
    // izler. Ders adları bu işaretleri taşımaz; arşivdeki özgün ad aynen kalır.
    for (const [attr, dataAttr] of [
      ['aria-label', 'data-i18n-aria-label'],
      ['placeholder', 'data-i18n-placeholder'],
      ['title', 'data-i18n-title'],
    ]) {
      for (const el of document.querySelectorAll(`[${dataAttr}]`)) {
        const key = el.getAttribute(dataAttr);
        if (key) el.setAttribute(attr, t(key));
      }
    }
  }

  // Dil değiştirir (Faz 5.3). Görünümler boot'ta I18N.t ile render edildiğinden
  // en sağlam yol tercihi kalıcılaştırıp sayfayı yenilemektir — görünümler
  // aynı kodla yeniden çizilir, yeni dilin sözlüğü de yüklemede gelir.
  // ?lang= parametresi korunur.
  function setLang(next) {
    next = isLang(next) ? next : (next === 'en' ? 'tr' : 'en');
    writeLocalState('itu-lang', next, { validate: isLang });
    // Yenileme öncesi/eskiden kalma istemciler için uyumluluk aynası.
    try { localStorage.setItem('itu-lang', next); } catch (e) {}
    const params = new URLSearchParams(location.search);
    params.set('lang', next);
    location.search = params.toString(); // yeniden yükler
  }

  return { t, lang, translateDOM, setLang };
})();
export { I18N };
