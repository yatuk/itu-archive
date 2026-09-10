// Dönemler görünümü: tüm dönemlerin listesi; canlı/arşiv ayrımı ve CSV/meta
// indirme bağlantıları. Yalnızca index.json'a bağlı, ekstra veri çekmez.
// Kart ızgarasının kabuğu React'te (terms-grid.tsx) — bu dosya yalnızca
// veriyi hazırlar ve initReveal ile giriş animasyonunu tetikler.

import { $, fmtDate } from '../core/utils.js?v=dde1e9339338';
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

let termsModule = null;
let termsModulePromise = null;
function loadTermsWidget() {
  if (!termsModulePromise) {
    termsModulePromise = import('../react/dersler-table.js').then((mod) => {
      termsModule = mod;
      return mod;
    });
  }
  return termsModulePromise;
}

export async function renderTerms() {
  const terms = state.index.terms.map((t) => {
    const label = localizedTermLabel(t.label, t.slug);
    if (t.missing) {
      const whyKey = KNOWN_GAPS[t.slug];
      return {
        key: t.slug,
        label,
        missing: true,
        missingReason: whyKey ? I18N.t(whyKey) : I18N.t('termNoDataFallback'),
      };
    }
    const live = t.live;
    const src = live ? I18N.t('termSourceLive') : I18N.t('termSourceArchive');
    const failed = Array.isArray(t.failedBranches) ? t.failedBranches.length : 0;
    return {
      key: t.slug,
      label,
      live,
      meta: `${t.sections.toLocaleString(I18N.lang === 'en' ? 'en' : 'tr')} ${I18N.t('prgSube')} · ${I18N.t('termSourceLabel')} ${src} · ${fmtDate(t.scrapedAt)}`,
      warn: t.partial
        ? `${I18N.t('termScanPartial')}${failed ? `: ${failed}${I18N.t('termBranchesFailedSuffix')}` : ''}${I18N.t('termResultsIncomplete')}`
        : '',
      csvHref: `data/terms/${t.slug}/all.csv`,
      metaHref: `data/terms/${t.slug}/meta.json`,
    };
  });

  const mod = await loadTermsWidget();
  const container = $('#terms');
  mod.mountTermsGrid(container, {
    terms,
    labels: {
      csv: 'CSV',
      metaJson: 'meta.json',
      live: I18N.t('termBadgeLive'),
    },
  });
  initReveal(container);
}
