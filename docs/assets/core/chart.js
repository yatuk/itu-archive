// Görselleştirme yardımcıları: doluluk çubuğu ve dönem trend grafiği.
// Saf string üreticileri — DOM'a dokunmazlar, test edilebilirler.

import { termLabel } from './utils.js';

// fillBar, kontenjan/yazılan için yüzde + çubuk üretir.
export function fillBar(cap, enr) {
  if (!cap) return '—';
  const pct = Math.min(100, Math.round((enr / cap) * 100));
  const cls = pct >= 100 ? 'full' : pct >= 85 ? 'tight' : '';
  return `<span class="fill">%${pct}<span class="bar ${cls}"><i style="width:${pct}%"></i></span></span>`;
}

// trendChart, her dönem için kontenjan (çerçeve) ve yazılan (dolu) çubukları
// çizer. Aynı dönemdeki birden çok şube toplanıyor. Renkler CSS değişkenlerinden
// gelir ki tema tek kaynaktan yönetilsin.
export function trendChart(byTerm) {
  const agg = [...byTerm].map(([slug, rows]) => ({
    slug,
    cap: rows.reduce((s, r) => s + r.cap, 0),
    enr: rows.reduce((s, r) => s + r.enr, 0),
  }));
  const max = Math.max(1, ...agg.map((a) => a.cap));
  const W = 720, H = 92, pad = 10;
  const n = agg.length;
  const gap = 8;
  const barW = n ? Math.min(52, (W - pad * 2 - gap * (n - 1)) / n) : 0;

  let bars = '';
  const seasonShort = { guz: 'G', bahar: 'B', yaz: 'Y' };
  agg.forEach((a, i) => {
    const x = pad + i * (barW + gap);
    const capH = Math.round((a.cap / max) * (H - 26));
    const enrH = Math.round((a.enr / max) * (H - 26));
    const yBase = H - 14;
    const full = a.cap > 0 && a.enr >= a.cap;
    const [y1, y2, season] = a.slug.split('-');
    const short = String(y2).slice(2) + (seasonShort[season] || season);
    bars += `
      <rect x="${x}" y="${yBase - capH}" width="${barW}" height="${capH}" fill="var(--chart-cap)" stroke="var(--chart-cap-edge)" stroke-width="1"/>
      <rect x="${x}" y="${yBase - enrH}" width="${Math.max(2, barW * 0.55)}" height="${enrH}" fill="${full ? 'var(--red)' : 'var(--acid)'}"/>
      <title>${termLabel(a.slug)} — kontenjan ${a.cap}, yazılan ${a.enr}</title>
      <text x="${x + barW / 2}" y="${H - 3}" text-anchor="middle" font-size="9" fill="var(--chart-axis)">${short}</text>`;
  });

  return `<figure class="trend">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kontenjan ve doluluk zaman çizelgesi">${bars}</svg>
    <figcaption>Kontenjan (çerçeve) · yazılan (dolu) — dönem dönem</figcaption>
  </figure>`;
}
