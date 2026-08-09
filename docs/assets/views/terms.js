// Dönemler görünümü: tüm dönemlerin listesi; canlı/arşiv ayrımı ve CSV/meta
// indirme bağlantıları. Yalnızca index.json'a bağlı, ekstra veri çekmez.

import { $, esc, fmtDate } from '../core/utils.js';
import { state } from '../core/store.js';
import { initReveal } from '../core/reveal.js';

export function renderTerms() {
  $('#terms').innerHTML = state.index.terms.map((t) => {
    if (t.missing) {
      return `<article class="termcard reveal missing">
        <div><h3>${esc(t.label)}<span class="badge">veri yok</span></h3>
        <p class="meta">Bu dönem ne OBS'de ne de arşiv snapshot'larında bulunuyor.</p></div>
        <div class="links"></div></article>`;
    }
    const live = t.source === 'obs';
    const src = live ? 'obs.itu.edu.tr (canlı)' : 'tarihsel döküm';
    return `<article class="termcard reveal">
      <div>
        <h3>${esc(t.label)}${live ? '<span class="badge live">canlı</span>' : ''}</h3>
        <p class="meta">${t.sections.toLocaleString('tr')} şube · kaynak ${esc(src)} · ${fmtDate(t.scrapedAt)}</p>
      </div>
      <div class="links">
        <a class="btn" href="data/terms/${t.slug}/all.csv" download>CSV</a>
        <a class="btn" href="data/terms/${t.slug}/meta.json">meta.json</a>
      </div></article>`;
  }).join('');
  initReveal($('#terms'));
}
