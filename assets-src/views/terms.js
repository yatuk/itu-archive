// Dönemler görünümü: tüm dönemlerin listesi; canlı/arşiv ayrımı ve CSV/meta
// indirme bağlantıları. Yalnızca index.json'a bağlı, ekstra veri çekmez.

import { $, esc, fmtDate } from '../core/utils.js?v=dde1e9339338';
import { state } from '../core/store.js?v=dde1e9339338';
import { initReveal } from '../core/reveal.js?v=dde1e9339338';
import { I18N } from '../i18n.js?v=dde1e9339338';

// Bilinen arşiv boşlukları — README "Eksikler" bölümüyle eşleşir (Faz 6).
const KNOWN_GAPS = {
  '2024-2025-guz': 'termGap20242025Guz',
};

// site.go'daki localizedTermLabel ile aynı kural: EN'de "-guz/-bahar/-yaz"
// dönem eki "Fall/Spring/Summer Term" olarak gösterilir; TR'de etiket aynen kalır.
function localizedTermLabel(label, slug) {
  if (I18N.lang !== 'en') return label;
  const m = /^(.+)-(guz|bahar|yaz)$/.exec(slug || '');
  if (!m) return label;
  const season = { guz: 'Fall Term', bahar: 'Spring Term', yaz: 'Summer Term' }[m[2]];
  return `${m[1]} ${season}`;
}

export function renderTerms() {
  $('#terms').innerHTML = state.index.terms.map((t) => {
    const label = localizedTermLabel(t.label, t.slug);
    if (t.missing) {
      const whyKey = KNOWN_GAPS[t.slug];
      const why = whyKey ? I18N.t(whyKey) : I18N.t('termNoDataFallback');
      return `<article class="termcard reveal missing">
        <div><h3>${esc(label)}<span class="badge">${esc(I18N.t('termBadgeNoData'))}</span></h3>
        <p class="meta">${esc(why)}</p></div>
        <div class="links"></div></article>`;
    }
    const live = t.live;
    const src = live ? I18N.t('termSourceLive') : I18N.t('termSourceArchive');
    const failed = Array.isArray(t.failedBranches) ? t.failedBranches.length : 0;
    const partial = t.partial
      ? `<p class="meta warn">${esc(I18N.t('termScanPartial'))}${failed ? `: ${failed}${esc(I18N.t('termBranchesFailedSuffix'))}` : ''}${esc(I18N.t('termResultsIncomplete'))}</p>`
      : '';
    return `<article class="termcard reveal">
      <div>
        <h3>${esc(label)}${live ? `<span class="badge live">${esc(I18N.t('termBadgeLive'))}</span>` : ''}</h3>
        <p class="meta">${t.sections.toLocaleString(I18N.lang === 'en' ? 'en' : 'tr')} ${esc(I18N.t('prgSube'))} · ${esc(I18N.t('termSourceLabel'))} ${esc(src)} · ${fmtDate(t.scrapedAt)}</p>
        ${partial}
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${t.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${t.slug}/meta.json">meta.json</a>
      </div></article>`;
  }).join('');
  initReveal($('#terms'));
}
