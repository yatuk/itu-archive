// Dönemler görünümü: tüm dönemlerin listesi; canlı/arşiv ayrımı ve CSV/meta
// indirme bağlantıları. Yalnızca index.json'a bağlı, ekstra veri çekmez.

import { $, esc, fmtDate } from '../core/utils.js';
import { I18N } from '../i18n.js';
import { state } from '../core/store.js';
import { initReveal } from '../core/reveal.js';

// Bilinen arşiv boşlukları — README "Eksikler" bölümüyle eşleşir (Faz 6).
const KNOWN_GAPS = { '2024-2025-guz': 'termsGap20242025Guz' };

export function renderTerms() {
  $('#terms').innerHTML = state.index.terms.map((t) => {
    if (t.missing) {
      const why = KNOWN_GAPS[t.slug];
      return `<article class="termcard reveal missing">
        <div><h3>${esc(t.label)}<span class="badge">${esc(I18N.t('termsNoData'))}</span></h3>
        <p class="meta">${esc(why ? I18N.t(why) : I18N.t('termsGapGeneric'))}</p></div>
        <div class="links"></div></article>`;
    }
    const live = t.live;
    const src = live ? I18N.t('termsSrcLive') : I18N.t('termsSrcArchive');
    // Faz 6: 2025-2026 Güz dönem başında alınmış, komşulara göre eksik görünüyor.
    const partial = t.slug === '2025-2026-guz' && t.sections < 3200
      ? `<p class="meta warn">${esc(I18N.t('termsPartial'))}</p>`
      : '';
    return `<article class="termcard reveal">
      <div>
        <h3>${esc(t.label)}${live ? `<span class="badge live">${esc(I18N.t('termLive'))}</span>` : ''}</h3>
        <p class="meta">${esc(I18N.t('termsMeta', { n: t.sections.toLocaleString(I18N.lang === 'en' ? 'en' : 'tr'), src }))} · ${fmtDate(t.scrapedAt)}</p>
        ${partial}
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${t.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${t.slug}/meta.json">meta.json</a>
      </div></article>`;
  }).join('');
  initReveal($('#terms'));
}
