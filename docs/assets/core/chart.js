// Görselleştirme yardımcıları: doluluk çubuğu ve dönem trend grafiği.
// Saf string üreticileri — DOM'a dokunmazlar, test edilebilirler.

import { termLabel, esc, formatInt } from './utils.js';
import { I18N } from '../i18n.js';

// fillBar, kontenjan/yazılan için yüzde + çubuk üretir — kontenjan çubuğunun
// TEK kaynağı (tablo, geçmiş, program, ders planım, detay paneli). full/tight
// sınıfları doluluk durumunu taşır. detail:true → "yazılan / kapasite · %pct"
// (detay paneli şube kartı); aksi halde "%pct".
export function fillBar(cap, enr, { detail = false } = {}) {
  if (!cap) return '·';
  const pct = Math.min(100, Math.round((enr / cap) * 100));
  const cls = pct >= 100 ? 'full' : pct >= 85 ? 'tight' : '';
  const label = detail ? `${formatInt(enr)} / ${formatInt(cap)} · %${pct}` : `%${pct}`;
  return `<span class="fill">${label}<span class="bar ${cls}"><i style="width:${pct}%"></i></span></span>`;
}

// trendChart (Faz: panel elden geçirme): iç içe (nested) çubuk — açık çerçeve
// kontenjan, içindeki dolu kısım yazılan. Kronolojik (eski solda), sıfır tabanlı,
// %100 referans çizgisi, yaz dönemi işareti. Varsayılan son 8 dönem; limit<=0
// hepsini çizer. Renkler CSS değişkenlerinden.
export function trendChart(byTerm, limit = 8) {
  const agg = [...byTerm].map(([slug, rows]) => ({
    slug,
    cap: rows.reduce((s, r) => s + r.cap, 0),
    enr: rows.reduce((s, r) => s + r.enr, 0),
  }));
  agg.sort((a, b) => a.slug.localeCompare(b.slug)); // kronolojik

  const max = Math.max(1, ...agg.map((a) => a.cap));
  const W = 720, H = 92, pad = 10;
  const visible = limit > 0 ? agg.slice(-limit) : agg;
  const rest = limit > 0 ? agg.length - visible.length : 0;
  const n = visible.length;
  const gap = 8;
  const barW = n ? Math.min(52, (W - pad * 2 - gap * (n - 1)) / n) : 0;

  // Slug mevsimi veride Türkçe; etiket görüntü diline çevrilir.
  const seasonFull = { guz: 'Güz', bahar: 'Bahar', yaz: 'Yaz' };
  const refY = H - 14 - (H - 26); // %100 referansı — sıfır tabanlı tepe
  let bars = '';
  visible.forEach((a, i) => {
    const x = pad + i * (barW + gap);
    const capH = Math.round((a.cap / max) * (H - 26));
    const enrH = Math.round((a.enr / max) * (H - 26));
    const yBase = H - 14;
    const full = a.cap > 0 && a.enr >= a.cap;
    const [, y2, season] = a.slug.split('-');
    const label = `${y2} ${I18N.seasonName(seasonFull[season]) || ''}`.trim();
    bars += `
      <g class="t-bar" tabindex="0" data-caption="${esc(termLabel(a.slug))} · ${I18N.t('chartCap')} ${a.cap} · ${I18N.t('chartEnr')} ${a.enr} · %${a.cap ? Math.round((a.enr / a.cap) * 100) : 0}">
        <rect x="${x}" y="${yBase - capH}" width="${barW}" height="${capH}" fill="var(--chart-cap)" stroke="var(--chart-cap-edge)"/>
        <rect x="${x}" y="${yBase - enrH}" width="${barW}" height="${enrH}" fill="${full ? 'var(--red)' : 'var(--acid)'}"/>
        ${season === 'yaz' ? `<line x1="${x}" y1="${H - 2}" x2="${x + barW}" y2="${H - 2}" stroke="var(--amber)"/>` : ''}
        <text x="${x + barW / 2}" y="${H - 3}" text-anchor="middle" font-size="9" fill="var(--chart-axis)">${esc(label)}</text>
      </g>`;
  });
  const refLine = `<line x1="${pad}" y1="${refY}" x2="${W - pad}" y2="${refY}" stroke="var(--chart-axis)" stroke-dasharray="3 3"/>`;

  return `<figure class="trend">
    <div class="t-chart">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${refLine}${bars}</svg>
      <p class="t-caption" aria-live="polite"></p>
    </div>
    ${rest ? `<button type="button" class="btn-ghost t-more">${esc(I18N.t('chartShowAll', { n: rest }))}</button>` : ''}
    <figcaption class="sr-only">${esc(I18N.t('chartCaption'))}</figcaption>
  </figure>`;
}
