// Görselleştirme yardımcıları: doluluk çubuğu ve dönem trend grafiği.
// Saf string üreticileri — DOM'a dokunmazlar, test edilebilirler.

import { termLabel, esc, formatInt } from './utils.js?v=5200cebd4769';

// fillBar, dondurulmuş fosfor temasının yüzde + çubuk motifidir. full/tight
// sınıfları doluluk durumunu taşır. detail:true → "yazılan / kapasite · %pct";
// aksi halde "%pct". Sade tema quotaDisplay içindeki metin temsilini kullanır.
export function fillBar(cap, enr, { detail = false } = {}) {
  if (!cap) return '·';
  const pct = Math.min(100, Math.round((enr / cap) * 100));
  const cls = pct >= 100 ? 'full' : pct >= 85 ? 'tight' : '';
  const label = detail ? `${formatInt(enr)} / ${formatInt(cap)} · %${pct}` : `%${pct}`;
  return `<span class="fill">${label}<span class="bar ${cls}"><i style="width:${pct}%"></i></span></span>`;
}

// Kontenjanın anlamını görsel sunumdan ayırır. Yüzde sıralama/durum hesabında
// kalır; sade temada aynı sayıyı yüzde + oran + çubuk olarak tekrarlamayız.
export function quotaState(cap, enr) {
  const capacity = Number(cap) || 0;
  const enrolled = Number(enr) || 0;
  if (capacity <= 0) {
    return { capacity, enrolled, remaining: 0, pct: 0, kind: 'unknown' };
  }
  const remaining = Math.max(0, capacity - enrolled);
  const pct = Math.round((enrolled / capacity) * 100);
  const kind = enrolled >= capacity ? 'full' : pct >= 85 ? 'tight' : 'open';
  return { capacity, enrolled, remaining, pct, kind };
}

// İki temanın bilgi yoğunluğu bilinçli olarak farklıdır. Fosfor görünümü
// dondurulduğu için eski fillBar çıktısını korur; sade görünüm tek sayısal temsil
// ve yalnızca karar gerektiren durumda kısa bir metin gösterir.
export function quotaDisplay(cap, enr, { detail = false, legacyCounts = false, lang } = {}) {
  const q = quotaState(cap, enr);
  if (q.kind === 'unknown') return '·';
  const english = (lang || (typeof document !== 'undefined' ? document.documentElement.lang : 'tr')) === 'en';

  let state = '';
  if (q.kind === 'full') state = english ? 'full' : 'dolu';
  else if (q.kind === 'tight') state = `${formatInt(q.remaining)} ${english ? 'seats' : 'yer'}`;

  const counts = detail
    ? `${formatInt(q.enrolled)} ${english ? 'enrolled' : 'kayıtlı'} · ${formatInt(q.capacity)} ${english ? 'capacity' : 'kontenjan'}`
    : `${formatInt(q.enrolled)} / ${formatInt(q.capacity)}`;
  const sade = `${counts}${state ? ` · <span class="quota-state ${q.kind}">${state}</span>` : ''}`;
  const legacy = legacyCounts
    ? `${formatInt(q.enrolled)}/${formatInt(q.capacity)} · ${fillBar(q.capacity, q.enrolled)}`
    : fillBar(q.capacity, q.enrolled, { detail });
  const aria = `${formatInt(q.enrolled)} ${english ? 'enrolled' : 'kayıtlı'}, ${formatInt(q.capacity)} ${english ? 'capacity' : 'kontenjan'}${state ? `, ${state}` : ''}`;

  return `<span class="quota-sade quota-${q.kind}" aria-label="${aria}">${sade}</span>` +
    `<span class="quota-fosfor">${legacy}</span>`;
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
    const label = `${y2} ${seasonFull[season] || ''}`.trim();
    bars += `
      <g class="t-bar" tabindex="0" data-caption="${esc(termLabel(a.slug))} · kontenjan ${a.cap} · yazılan ${a.enr} · %${a.cap ? Math.round((a.enr / a.cap) * 100) : 0}">
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
    ${rest ? `<button type="button" class="btn-ghost t-more">${rest} dönemin hepsini göster</button>` : ''}
    <figcaption class="sr-only">Kontenjan ve doluluk zaman çizelgesi · ayrıntı için dönem tablosu.</figcaption>
  </figure>`;
}
