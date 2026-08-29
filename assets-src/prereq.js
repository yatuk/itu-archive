// Ders planı haritası: seçilen bölümün müfredatını dönem sütunları halinde,
// önşart ilişkilerini her zaman görünür ok'larla çizen bir akış şeması.
//
// Tasarım kararları:
// - Force-directed bir denemeden buraya geçildi: kaotik yerleşimde kenarlar
//   yalnızca bir düğüme tıklanınca netleşiyordu, yapı ilk bakışta okunmuyordu.
//   Sabit dönem sütunları + her zaman görünür ok'lu kenarlar bunu çözüyor —
//   hangi dersin hangisine bağlı olduğu tıklamadan görülüyor.
// - Seçmeli ders slotları ("7. Yarıyıl Seçmeli II") ayrı ayrı onlarca düğüm
//   olarak açılmıyor — bazı havuzlarda 150+ alternatif var. Her slot TEK bir
//   elmas düğüm; alternatifler tıklanınca açılan panelde listeleniyor.
// - Düğüm konumları sabit (fizik yok), o yüzden "canlı" hissi girişteki kısa
//   bir yerleşme animasyonundan geliyor: düğümler kendi sütunlarına doğru
//   süzülerek yerleşiyor, sonra durup net bir diyagrama dönüşüyor.
// - Çizim yine branşa göre gruplanmış Path2D'lerle yapılıyor (düğüm başına
//   ayrı fillStyle çağırmamak için); art arda arc() öncesi moveTo şart, yoksa
//   daireler çizgiyle birleşip tek bir "vitray" şekline dönüşüyor.
import { esc, fold, getJSON, termLabel } from './core/utils.js?v=dde1e9339338';
import { state } from './core/store.js?v=dde1e9339338';
import { isTaken, TAKEN_CHANGED } from './core/taken.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from './core/persistence.js?v=dde1e9339338';
import { I18N } from './i18n.js?v=dde1e9339338';

  const PALETTE = [
    '#5eead4', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185',
    '#fb923c', '#facc15', '#a3e635', '#4ade80', '#2dd4bf', '#60a5fa', '#e879f9', '#94a3b8',
  ];

  function hueOf(key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  // Canvas renkleri temaya göre seçilir (WCAG 2.2 AA: kenar ≥3:1, etiket ≥4.5:1).
  // Açık temada koyu zemin üstüne tasarlanmış renkler okunmaz olur; burada token
  // değerleri okunur ve açık yüzey için yeniden üretilir. Koyu temada değerler
  // ESKİSİYLE AYNIDIR. Tema değişince canvasColors() taze değer verir.
  let _canvasColors = null;
  function canvasColors() {
    const theme = document.documentElement.dataset.theme || 'dark';
    if (_canvasColors && _canvasColors.theme === theme) return _canvasColors;
    const light = theme === 'sade';
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    const c = light ? {
      emptyDim: 'rgba(69,86,76,0.75)',
      emptyFaint: 'rgba(69,86,76,0.5)',
      laneHeaderBg: 'rgba(238,241,238,0.92)',
      laneHeaderFg: 'rgba(30,43,35,0.92)',
      edge: v('--dim') || 'rgba(69,86,76,0.85)',       // ~7:1, kenar ≥3:1
      edgeRelated: v('--acid') || 'rgba(26,122,85,1)',  // ~5.3:1
      edgeDim: 'rgba(120,130,125,0.18)',
      label: v('--fg') || 'rgba(30,43,35,0.95)',        // ~14:1 + halo
      labelDim: 'rgba(110,120,115,0.6)',
      labelHalo: 'rgba(255,255,255,0.92)',
      focus: v('--acid') || '#1a7a55',
      hover: v('--cyan') || '#1f6f8b',
    } : {
      // Koyu ve yüksek kontrast — mevcut çizim değerleri, değişmez.
      emptyDim: 'rgba(140,160,150,0.6)',
      emptyFaint: 'rgba(140,160,150,0.4)',
      laneHeaderBg: 'rgba(10,16,12,0.85)',
      laneHeaderFg: 'rgba(230,245,235,0.85)',
      edge: 'rgba(120,200,170,0.4)',
      edgeRelated: 'rgba(0,255,156,0.85)',
      edgeDim: 'rgba(140,160,150,0.08)',
      label: 'rgba(230,245,235,0.92)',
      labelDim: 'rgba(140,160,150,0.35)',
      labelHalo: null,
      focus: '#00ff9c',
      hover: 'rgba(53,224,255,0.9)',
    };
    _canvasColors = { theme, ...c };
    return _canvasColors;
  }

  const LANE_PAD = 90;   // ilk/son sütunun kenarla arası
  const ROW_PAD = 46;
  const NODE_R = 15;
  // Haritanın okunamayacak kadar küçülmesini engelle. Yoğun planlarda
  // düğümlerin taşması kabul edilir; kullanıcı haritayı sürükleyebilir.
  const MIN_ZOOM = 0.55;
  const MAX_ZOOM = 3;

  class PlanGraph {
    constructor(root) {
      this.root = root;
      this.canvas = root.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.tip = root.querySelector('.pg-tooltip');
      this.detail = root.querySelector('.pg-detail');
      this.status = root.querySelector('.pg-status');
      this.cam = { x: 0, y: 0, k: 1 };
      this.focus = null;
      this.related = null;
      this.hover = null;
      this.drag = null;
      this.nodes = null;
      this.resizeFrame = 0;
      // Detay paneli açılınca grid canvas sütununu daraltır. Yalnızca layout/draw
      // yapmak bitmap'i eski genişlikte bırakıp CSS ile sıkıştırıyordu; özellikle
      // son dönem sütunları üst üste/yinelenmiş görünüyordu. Kutuyu gözleyip hem
      // bitmap boyutunu hem kamerayı tek frame'de birlikte yenile.
      this.ro = new ResizeObserver(() => this.queueResize());
      this.ro.observe(root.querySelector('.pg-canvas-wrap'));
      this.bindInput();
    }

    queueResize() {
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = 0;
        this.resize();
      });
    }

    // build: node = { code, name, kind:'course'|'elective', lane, requirement, options }
    // edge = { from, to } (kod)
    async build(nodes, edges, laneTitles, statusLabel) {
      this.laneTitles = laneTitles;
      this.nodes = nodes.map((n) => ({ ...n, x: 0, y: 0, deg: 0 }));
      this.byCode = new Map(this.nodes.map((n) => [n.code, n]));
      this.edges = edges
        .map((e) => ({ ...e, from: this.byCode.get(e.from), to: this.byCode.get(e.to) }))
        .filter((e) => e.from && e.to);

      this.byFrom = new Map();
      this.byTo = new Map();
      const push = (map, key, val) => {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(val);
      };
      for (const e of this.edges) {
        e.from.deg++; e.to.deg++;
        push(this.byFrom, e.from.code, e.to.code);
        push(this.byTo, e.to.code, e.from.code);
      }

      this.hay = this.nodes.map((n) => fold(`${n.code} ${n.name || ''}`));
      this.focus = null; this.related = null;
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      this.status.textContent = statusLabel;

      this.layout();
      this.resize();
      await this.introAnimate();
      this.draw();
    }

    // layout, her düğümü kendi dönem sütununda, o sütundaki sırasına göre
    // dikey ortalanmış olarak konumlandırır. Fizik yok — pozisyon tamamen
    // dönem ve sıraya göre belirleniyor, bu yüzden kenarlar her zaman aynı
    // (öngörülebilir) yerde ve net görünüyor.
    layout() {
      // Veri yüklenmeden canvas resize olabilir (ResizeObserver erken tetiklenir);
      // boş graf boş döner — TypeError fırlatılmaz.
      if (!this.nodes || !this.nodes.length) return;
      const w = Math.max(this.canvas.clientWidth, 600);
      const laneCount = this.laneTitles.length;
      const laneW = laneCount > 1 ? (w - LANE_PAD * 2) / (laneCount - 1) : 0;
      const byLane = new Map();
      for (const n of this.nodes) {
        if (!byLane.has(n.lane)) byLane.set(n.lane, []);
        byLane.get(n.lane).push(n);
      }
      let maxRows = 1;
      for (const list of byLane.values()) maxRows = Math.max(maxRows, list.length);
      const rowH = Math.max(NODE_R * 2 + 18, 64);
      this.contentHeight = maxRows * rowH + ROW_PAD * 2;

      for (const [lane, list] of byLane) {
        list.sort((a, b) => (a.kind === 'elective') - (b.kind === 'elective') || a.code.localeCompare(b.code));
        const totalH = list.length * rowH;
        const offsetY = (this.contentHeight - totalH) / 2 + rowH / 2;
        list.forEach((n, i) => {
          n.x = LANE_PAD + lane * laneW;
          n.y = offsetY + i * rowH;
        });
      }
      this.rowH = rowH;
      this.laneW = laneW; // fitToView ve başlık çizimi bunu kullanıyor, yakınlaştırmadan bağımsız sabit
    }

    // introAnimate, düğümleri rastgele bir başlangıç noktasından kendi
    // hedeflerine doğru süzdürür. requestAnimationFrame değil setTimeout
    // kullanıyoruz: sekme görünür değilken tarayıcılar rAF'ı süresiz askıya
    // alabiliyor, animasyon hiç bitmeyebilir.
    async introAnimate() {
      const targets = this.nodes.map((n) => ({ x: n.x, y: n.y }));
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.nodes.forEach((n) => {
        n.x = w / 2 + (Math.random() - 0.5) * 60;
        n.y = h / 2 + (Math.random() - 0.5) * 60;
      });
      const DUR = 420, start = performance.now();
      const sx = w / 2, sy = h / 2;
      let last = start;
      while (true) {
        const now = performance.now();
        const t = Math.min(1, (now - start) / DUR);
        const e = 1 - Math.pow(1 - t, 3); // ease-out
        this.nodes.forEach((n, i) => {
          n.x = sx + (targets[i].x - sx) * e;
          n.y = sy + (targets[i].y - sy) * e;
        });
        this.draw();
        if (t >= 1) break;
        if (performance.now() - last > 16) {
          await new Promise((r) => setTimeout(r, 0));
          last = performance.now();
        }
      }
      this.nodes.forEach((n, i) => { n.x = targets[i].x; n.y = targets[i].y; });
    }

    fitToView() {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      // ResizeObserver veri/program seçimi tamamlanmadan çalışabilir. Bu sırada
      // laneTitles henüz yoktur; boş canvas varsayılan kamerayla çizilir.
      if (!this.nodes?.length || !this.laneTitles?.length) {
        this.cam = { x: 0, y: 0, k: 1 };
        return;
      }
      const contentW = LANE_PAD * 2 + (this.laneTitles.length - 1) * this.laneW;
      const k = Math.min(w / (contentW || w), h / ((this.contentHeight || h) * 1.05), 1.6);
      this.cam.k = Math.max(k, MIN_ZOOM);
      this.cam.x = (w - contentW * this.cam.k) / 2;
      this.cam.y = (h - (this.contentHeight || h) * this.cam.k) / 2;
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      // Gizli sekme ilk kurulurken 0×0 olabilir; görünür olduğunda observer yeni
      // ölçüyü tekrar yollar. Sıfır bitmap yazıp mevcut çizimi bozma.
      if (w < 1 || h < 1) return;
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.layout();
      this.fitToView();
      if (this.nodes) this.draw();
    }

    worldToScreen(x, y) { return [x * this.cam.k + this.cam.x, y * this.cam.k + this.cam.y]; }
    screenToWorld(x, y) { return [(x - this.cam.x) / this.cam.k, (y - this.cam.y) / this.cam.k]; }

    draw() {
      const ctx = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const c = canvasColors();
      // Boş durum: program seçilene kadar kılavuz mesajı.
      if (!this.nodes) {
        ctx.font = '13px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = c.emptyDim;
        ctx.fillText('> bir bölüm seçin', w / 2, h / 2 - 6);
        ctx.font = '11px ui-monospace, monospace';
        ctx.fillStyle = c.emptyFaint;
        ctx.fillText('dönem sütunlarında önşart okları burada çizilir', w / 2, h / 2 + 14);
        return;
      }
      const focused = !!this.related;

      // Dönem sütunu arka plan bantları: komşu dönemleri ayırır.
      for (let i = 0; i < this.laneTitles.length; i++) {
        const [x] = this.worldToScreen(LANE_PAD + i * this.laneW - this.laneW / 2, 0);
        const bandW = this.laneW * this.cam.k;
        if (i % 2 === 1) {
          ctx.fillStyle = 'rgba(140,200,170,0.035)';
          ctx.fillRect(x, 0, bandW, this.contentHeight * this.cam.k);
        }
        ctx.fillStyle = 'rgba(140,200,170,0.07)';
        ctx.fillRect(x + bandW, 0, 1, this.contentHeight * this.cam.k);
      }

      // Sütun başlıkları — üstte koyu bir şerit üstünde.
      ctx.textAlign = 'center';
      ctx.font = '11px ui-monospace, monospace';
      this.laneTitles.forEach((title, i) => {
        const [x] = this.worldToScreen(LANE_PAD + i * this.laneW, 0);
        ctx.fillStyle = c.laneHeaderBg;
        ctx.fillRect(x - (this.laneW / 2) * this.cam.k, 0, this.laneW * this.cam.k, 26);
        ctx.fillStyle = c.laneHeaderFg;
        ctx.fillText(title, x, 17);
      });

      const r = NODE_R * this.cam.k;
      for (const e of this.edges) {
        const related = focused && this.related.has(e.from.code) && this.related.has(e.to.code);
        const dim = focused && !related;
        drawEdge(ctx, this.worldToScreen(e.from.x, e.from.y), this.worldToScreen(e.to.x, e.to.y), r,
          dim ? c.edgeDim : (related ? c.edgeRelated : c.edge),
          related ? 1.8 : 1.1,
          // Kesikli ok: önşart bir VEYA grubunun parçası — biri yeterli, hepsi değil.
          e.alt && !dim);
      }

      const byColor = new Map();
      for (const n of this.nodes) {
        const dim = focused && !this.related.has(n.code);
        const colorKey = n.kind === 'elective' ? 'elective' : (n.branch || n.code.split(' ')[0]);
        const color = dim ? '#3d5f4e' : (n.kind === 'elective' ? '#ffc857' : hueOf(colorKey));
        const bucketKey = color + (n.kind === 'elective' ? '|d' : '|c');
        if (!byColor.has(bucketKey)) byColor.set(bucketKey, { fill: new Path2D(), stroke: color, diamond: n.kind === 'elective' });
        const g = byColor.get(bucketKey);
        const [x, y] = this.worldToScreen(n.x, n.y);
        if (n.kind === 'elective') addDiamond(g.fill, x, y, r * 0.95);
        else { g.fill.moveTo(x + r * 0.72, y); g.fill.arc(x, y, r * 0.72, 0, Math.PI * 2); }
      }
      for (const g of byColor.values()) {
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = g.stroke;
        ctx.fill(g.fill);
      }
      ctx.globalAlpha = 1;

      // Etiketler: yakınlaştırıldıkça belirginleşir, çok uzaklaştırıldığında
      // (çok sütunlu bir program) metin çorbası olmaması için gizlenir.
      if (this.cam.k > 0.45) {
        ctx.font = `${Math.max(9, 10 * this.cam.k)}px ui-monospace, monospace`;
        ctx.textAlign = 'left';
        for (const n of this.nodes) {
          const dim = focused && !this.related.has(n.code);
          const [x, y] = this.worldToScreen(n.x, n.y);
          ctx.fillStyle = dim ? c.labelDim : c.label;
          const label = n.kind === 'elective' ? wrapShort(n.name, 16) : n.code;
          // Açık temada koyu etiket: parlak düğüm dolgusu üstünde de okunması için
          // beyaz halo (kontur) eklenir. Koyu temada halo yok — görünüm değişmez.
          if (c.labelHalo) {
            ctx.strokeStyle = c.labelHalo;
            ctx.lineWidth = 3;
            ctx.strokeText(label, x + r * 0.95, y + 3);
          }
          ctx.fillText(label, x + r * 0.95, y + 3);
          // Seçmeli slot rozeti: kaç alternatifi olduğu tıklamadan görünsün.
          // Koyu zemin + açık yazı iki temada da okunur; bilinçli olarak korunur.
          if (n.kind === 'elective' && n.options && n.options.length) {
            const badge = String(n.options.length);
            ctx.font = `bold ${Math.max(8, 9 * this.cam.k)}px ui-monospace, monospace`;
            const bw = ctx.measureText(badge).width + 8;
            const bx = x + r * 0.7, by = y - r * 0.95;
            ctx.fillStyle = 'rgba(10,16,12,0.85)';
            ctx.fillRect(bx, by, bw, 13 * this.cam.k);
            ctx.fillStyle = '#ffc857';
            ctx.fillText(badge, bx + 4, by + 10 * this.cam.k);
            ctx.fillStyle = dim ? c.labelDim : c.label;
          }
        }
      }

      // Hover halkası (nazik) ve odak parlaması (belirgin).
      const ring = (code, radius, width, color, blur) => {
        const n = this.byCode.get(code);
        if (!n) return;
        const [x, y] = this.worldToScreen(n.x, n.y);
        ctx.save();
        if (blur) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
      };
      if (this.hover && this.hover !== this.focus) ring(this.hover, r * 0.72 + 3, 1.5, c.hover, 0);
      if (this.focus) ring(this.focus, r * 0.72 + 4, 2, c.focus, 14);
    }

    nodeAt(px, py) {
      const [wx, wy] = this.screenToWorld(px, py);
      let best = null, bestD = Infinity;
      for (const n of this.nodes) {
        const dx = n.x - wx, dy = n.y - wy;
        const d = dx * dx + dy * dy;
        const hit = Math.max(NODE_R * 1.3, 16 / this.cam.k);
        if (d < hit * hit && d < bestD) { best = n; bestD = d; }
      }
      return best;
    }

    focusNode(code) {
      this.focus = code;
      this.root.classList.add('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = false;
      const related = new Set([code]);
      const walk = (start, map) => {
        const q = [start];
        while (q.length) {
          const cur = q.pop();
          for (const next of map.get(cur) ?? []) {
            if (!related.has(next)) { related.add(next); q.push(next); }
          }
        }
      };
      walk(code, this.byTo);
      walk(code, this.byFrom);
      this.related = related;
      this.renderDetail(code);
      this.draw();
      this.queueResize();
      // Seçmeli slot paylaşılabilir URL durumu: ?prog=X&pool=<title>#onsart.
      const n = this.byCode.get(code);
      const prog = document.querySelector('.pg-program-select')?.value;
      if (prog && n && n.kind === 'elective') history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}&pool=${encodeURIComponent(n.name)}#onsart`);
      else if (prog) history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}#onsart`);
    }

    clearFocus() {
      this.focus = null;
      this.related = null;
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      const prog = this.root.querySelector('.pg-program-select')?.value;
      if (prog) history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}#onsart`);
      this.draw();
      this.queueResize();
    }

    // reset, tüm grafiği boşaltır — seçili program artık görünmeyen bir
    // seviyeye düştüğünde kullanılır.
    reset() {
      this.nodes = null;
      this.edges = null;
      this.byCode = null;
      this.focus = null;
      this.related = null;
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      this.status.textContent = 'bir bölüm seçin';
      this.draw();
      this.queueResize();
    }

    panTo(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      this.focusNode(code);
    }

    renderDetail(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      if (n.kind === 'elective') { this.renderPool(n); return; }
      const chip = (c) => `<button class="pg-chip" data-code="${esc(c)}">${esc(c)}</button>`;
      const req = (this.byTo.get(code) || []).sort();
      const dep = (this.byFrom.get(code) || []).sort();
      // Ham ifade yerine ayrıştırılmış VE/VEYA ağacı: "hepsi gerekli" ile
      // "biri yeterli" ayrımı açıkça görünsün.
      const tree = n.requirement ? parseReq(n.requirement) : null;
      const sources = this.edges.filter((e) => e.to.code === code && e.sourceUrl);
      const source = sources[0];
      this.detail.innerHTML = `
        <div class="pg-detail-head"><h3>${esc(n.code)} <span>${esc(n.name || '')}</span></h3><button type="button" class="pg-detail-close" aria-label="Detayı kapat">×</button></div>
        ${tree ? `<h4>Önşartı</h4><ul class="req-tree">${renderReqTree(tree)}</ul>` : '<p class="pg-empty">Bu programda kayıtlı önşartı yok.</p>'}
        ${req.length ? `<h4>Gereken dersler (${req.length})</h4><div class="pg-chips">${req.map(chip).join('')}</div>` : ''}
        ${dep.length ? `<h4>Bunu önşart olarak isteyenler (${dep.length})</h4><div class="pg-chips">${dep.map(chip).join('')}</div>` : ''}
        ${source ? `<div class="pg-source"><b>Kaynak ve doğrulama</b><span>${source.status === 'verified' ? 'OBS kaydı doğrulandı' : 'Kaynak kaydı'}${source.verifiedAt ? ` · ${new Date(source.verifiedAt).toLocaleDateString('tr-TR')}` : ''}</span><a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener">İTÜ OBS kaydını aç ↗</a></div>` : ''}
        <button type="button" class="btn-ghost pg-detail-open" data-code="${esc(n.code)}">bu dersi detaylandır</button>`;
      this.detail.querySelectorAll('.pg-chip:not([disabled])').forEach((b) =>
        b.addEventListener('click', () => this.panTo(b.dataset.code)));
      const dOpen = this.detail.querySelector('.pg-detail-open');
      this.detail.querySelector('.pg-detail-close')?.addEventListener('click', () => this.clearFocus());
      if (dOpen) {
        dOpen.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: dOpen.dataset.code, source: 'onsart' } }));
        });
      }
    }

    // Seçmeli slotun alternatiflerini aranabilir, branş gruplu, canlı dönem
    // durumlu bir listeye döker. Veri çekme paralel + önbellekli; liste ilk
    // anda iskeletle gelir, durumlar geldikçe dolar. Kullanıcı başka düğüme
    // geçerse eski yükleme kendini iptal eder (version + focus guard).
    async renderPool(n) {
      lastPoolNode = n; // TAKEN_CHANGED'te yeniden çizmek için (Faz D)
      const opts = (n.options || []).slice();
      const version = (this.poolVersion = (this.poolVersion || 0) + 1);
      this.detail.innerHTML = `
        <div class="pg-detail-head"><h3>${esc(n.name)} <span>seçmeli havuz</span></h3><button type="button" class="pg-detail-close" aria-label="Havuzu kapat">×</button></div>
        <div class="pg-pool-head">
          <input type="search" class="pg-pool-search" placeholder="ara: kod veya ad…" aria-label="Havuzda ara">
          <select class="pg-pool-sort" aria-label="Sıralama">
            <option value="code">koda göre</option>
            <option value="name">ada göre</option>
            <option value="open">bu dönem açık olanlar önce</option>
            <option value="cap">kontenjanı olanlar önce</option>
          </select>
        </div>
        <p class="pg-pool-status">${opts.length} alternatif, durum taranıyor…</p>
        <div class="pg-pool-groups"></div>`;
      this.detail.querySelector('.pg-detail-close')?.addEventListener('click', () => this.clearFocus());

      const groupsEl = this.detail.querySelector('.pg-pool-groups');
      const statusEl = this.detail.querySelector('.pg-pool-status');
      const status = new Map();
      let q = '';
      let sortKey = 'code';
      const fresh = () => this.poolVersion === version && this.focus === n.code;

      // Olay yetki devri — her render'da yeniden bağlama yok.
      groupsEl.addEventListener('click', (ev) => {
        const act = ev.target.closest('[data-act]');
        if (!act) return;
        if (act.dataset.act === 'detay') {
          window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: act.dataset.code } }));
        } else if (act.dataset.act === 'courses') {
          window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: act.dataset.code }));
        }
      });

      const render = () => {
        if (!fresh()) return;
        const f = fold(q);
        let list = opts;
        if (f) list = list.filter((o) => fold(o.code + ' ' + o.name).includes(f));
        const seat = (s) => (s && s.open && s.cap > 0 ? s.cap - s.enr : -1);
        const order = {
          code: (a, b) => a.code.localeCompare(b.code),
          name: (a, b) => a.name.localeCompare(b.name, 'tr') || a.code.localeCompare(b.code),
          open: (a, b) => {
            const oa = status.get(a.code) && status.get(a.code).open ? 0 : 1;
            const ob = status.get(b.code) && status.get(b.code).open ? 0 : 1;
            return oa - ob || a.code.localeCompare(b.code);
          },
          cap: (a, b) => seat(status.get(b.code)) - seat(status.get(a.code)) || a.code.localeCompare(b.code),
        }[sortKey];
        list = list.slice().sort(order);

        const groups = new Map();
        for (const o of list) {
          const b = o.code.split(' ')[0];
          if (!groups.has(b)) groups.set(b, []);
          groups.get(b).push(o);
        }
        const big = opts.length > 30; // büyük havuzda gruplar varsayılan kapalı
        groupsEl.innerHTML = [...groups].map(([b, items]) => `
          <details class="pg-pool-group" ${big ? '' : 'open'}>
            <summary>${esc(b)} <span>${items.length}</span></summary>
            ${items.map((o) => {
              const st = status.get(o.code);
              const taken = isTaken(o.code);
              const badge = !st ? '<span class="loading">…</span>'
                : st.open
                  ? `<span class="open">● açık · ${st.sections.length} şube · ${st.enr}/${st.cap || '·'}</span>`
                  : `<span class="closed">● ${st.last ? 'son ' + esc(termLabel(st.last)) : 'hiç açılmadı'}</span>`;
              return `<div class="pg-pool-row${taken ? ' pg-pool-taken' : ''}">
                <div class="pg-pool-name"><b>${esc(o.code)}</b><em title="${esc(o.name)}">${esc(o.name || 'Ders adı arşivde bulunamadı')}</em></div>
                <span class="pg-pool-status-badge">${taken ? '<span class="taken-mark">✓ aldım</span>' : ''}${badge}</span>
                <span class="pg-pool-actions">
                  <button data-act="detay" data-code="${esc(o.code)}">detay</button>
                  <button data-act="courses" data-code="${esc(o.code)}">derslerde aç</button>
                </span>
              </div>`;
            }).join('')}
          </details>`).join('');
        const openCount = [...status.values()].filter((s) => s.open).length;
        statusEl.textContent = `${opts.length} alternatif · ${openCount} tanesi bu dönem açık`;
      };

      this.detail.querySelector('.pg-pool-search').addEventListener('input', (e) => { q = e.target.value; render(); });
      this.detail.querySelector('.pg-pool-sort').addEventListener('change', (e) => { sortKey = e.target.value; render(); });
      render();

      // Aktif dönem branş dosyalarını paralel çek; her seçeneğin durumunu doldur.
      const byBranch = new Map();
      for (const o of opts) {
        const b = o.code.split(' ')[0];
        if (!byBranch.has(b)) byBranch.set(b, []);
        byBranch.get(b).push(o);
      }
      await Promise.all([...byBranch].map(async ([b, items]) => {
        const secs = (await activeSections(b)) || [];
        const byCode = new Map();
        for (const s of secs) {
          if (!byCode.has(s.code)) byCode.set(s.code, []);
          byCode.get(s.code).push(s);
        }
        for (const o of items) {
          const mine = byCode.get(o.code) || [];
          status.set(o.code, {
            open: mine.length > 0,
            sections: mine,
            enr: mine.reduce((a, s) => a + (Number(s.enrolled) || 0), 0),
            cap: mine.reduce((a, s) => a + (Number(s.capacity) || 0), 0),
          });
        }
        render();
      }));
      if (!fresh()) return;

      // Kapalı olanların geçmişteki son açılışını getir (branş başına bir istek).
      const closed = opts.filter((o) => status.has(o.code) && !status.get(o.code).open);
      await Promise.all(closed.map(async (o) => {
        const last = await lastOpenedTerm(o.code);
        const st = status.get(o.code);
        if (st && !st.open) st.last = last;
      }));
      render();
    }

    search(q) {
      const f = fold(q.trim());
      if (f.length < 2 || !this.nodes) return [];
      const out = [];
      for (let i = 0; i < this.nodes.length && out.length < 30; i++) {
        if (this.hay[i].includes(f)) out.push(this.nodes[i]);
      }
      return out;
    }

    bindInput() {
      const c = this.canvas;
      // Klavye erişimi (Faz 5.4): canvas odaklanabilir; ok tuşları odaklanan
      // düğümü ekrandaki konuma göre yönlendirir. role="img" statik olmaktan
      // çıkar — arama kutusu zaten aynı focusNode'a gider.
      c.tabIndex = 0;
      c.setAttribute('aria-label', 'Önşart haritası: odaklanmak için ok tuşlarını kullan');
      c.addEventListener('keydown', (e) => {
        if (!this.nodes || !this.focus) return;
        const cur = this.byCode.get(this.focus);
        if (!cur) return;
        const steps = e.key.startsWith('Arrow') ? 1 : 0;
        if (!steps) return;
        e.preventDefault();
        let best = null, bestD = Infinity;
        const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
        for (const n of this.nodes) {
          if (n.code === this.focus) continue;
          const dx = n.x - cur.x, dy = n.y - cur.y;
          // Yönle uyumlu (skaler çarpım pozitif) en yakın düğümü seç.
          const dot = dx * dir[0] + dy * dir[1];
          if (dot <= 0) continue;
          const dist = dx * dx + dy * dy;
          if (dist < bestD) { bestD = dist; best = n; }
        }
        if (best) this.focusNode(best.code);
      });
      c.addEventListener('wheel', (e) => {
        if (!this.nodes) return;
        e.preventDefault();
        const rect = c.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const [wx, wy] = this.screenToWorld(mx, my);
        this.cam.k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.cam.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        const [sx, sy] = this.worldToScreen(wx, wy);
        this.cam.x += mx - sx; this.cam.y += my - sy;
        this.draw();
      }, { passive: false });

      // Dokunma + fare: pointer olayları tekelleşir (mobilde pan + dokunuş).
      // touch-action:none zaten var — sayfa kaydırması çalınmaz.
      this.pointers = new Map();
      this.pinch = null;
      const pDist = () => {
        const ps = [...this.pointers.values()];
        return ps.length >= 2 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
      };
      c.addEventListener('pointerdown', (e) => {
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.pointers.size === 1) this.drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
        else if (this.pointers.size === 2) {
          this.pinch = { dist: pDist(), startK: this.cam.k };
          this.drag = null;
        }
      });
      window.addEventListener('pointermove', (e) => {
        if (!this.pointers.has(e.pointerId)) return;
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.pinch && this.pointers.size >= 2) {
          const d = pDist();
          if (d > 0) { this.cam.k = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.pinch.startK * (d / this.pinch.dist))); this.draw(); }
          return;
        }
        if (!this.drag || this.drag.id !== e.pointerId) return;
        const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
        this.cam.x += dx; this.cam.y += dy;
        this.drag.x = e.clientX; this.drag.y = e.clientY;
        this.draw();
      });
      window.addEventListener('pointerup', (e) => {
        this.pointers.delete(e.pointerId);
        if (this.pinch && this.pointers.size < 2) this.pinch = null;
        if (this.drag && this.drag.id === e.pointerId) {
          if (!this.drag.moved && this.nodes) {
            const rect = c.getBoundingClientRect();
            const n = this.nodeAt(e.clientX - rect.left, e.clientY - rect.top);
            if (n) this.focusNode(n.code);
            else this.clearFocus();
          }
          this.drag = null;
        }
      });
      window.addEventListener('pointercancel', () => { this.pointers.clear(); this.pinch = null; this.drag = null; });
      c.addEventListener('mousemove', (e) => {
        if (!this.nodes) return;
        const rect = c.getBoundingClientRect();
        const n = this.nodeAt(e.clientX - rect.left, e.clientY - rect.top);
        const code = n ? n.code : null;
        if (code !== this.hover) { this.hover = code; this.draw(); }
        if (n) {
          this.tip.hidden = false;
          this.tip.style.left = (e.clientX - rect.left + 14) + 'px';
          this.tip.style.top = (e.clientY - rect.top + 10) + 'px';
          this.tip.textContent = n.kind === 'elective'
            ? `${n.name} · ${(n.options || []).length} seçenek`
            : (n.name ? `${n.code}: ${n.name}` : n.code);
        } else {
          this.tip.hidden = true;
        }
      });
    }
  }

  // drawEdge, iki sütun arasında yumuşak bir eğri çizer ve hedefe küçük bir
  // ok ucu ekler — önşart ilişkisinin yönü (A, B'nin önşartıysa A→B) her
  // zaman görünsün diye. dash=true ise "alternatif" (VEYA) kenarı çizilir.
  function drawEdge(ctx, [x1, y1], [x2, y2], r, color, width, dash) {
    const midX = (x1 + x2) / 2;
    ctx.beginPath();
    ctx.moveTo(x1 + r * 0.7, y1);
    ctx.bezierCurveTo(midX, y1, midX, y2, x2 - r * 0.9, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    const ah = 5;
    const ang = Math.atan2(y2 - y1, x2 - x1 - r);
    const tx = x2 - r * 0.72, ty = y2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - ah * Math.cos(ang - 0.5), ty - ah * Math.sin(ang - 0.5));
    ctx.lineTo(tx - ah * Math.cos(ang + 0.5), ty - ah * Math.sin(ang + 0.5));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function addDiamond(path, x, y, r) {
    path.moveTo(x, y - r);
    path.lineTo(x + r, y);
    path.lineTo(x, y + r);
    path.lineTo(x - r, y);
    path.closePath();
  }

  function wrapShort(s, max) {
    s = String(s || '');
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
  }

  // ---- Önşart ifadesi ayrıştırıcısı ----
  // OBS ifadeleri "Ve"/"Veya" operatörleri ve parantezlerle gelir:
  //   "( MAT 102 MIN. DD Veya MAT 102E MIN. DD ) Veya ( MAT 104 MIN. DD ... )"
  // Ve, Veya'dan sıkı bağlanır (AND > OR). Sonuç ağaçtır:
  //   { type:'or'|'and', items:[...] } veya { type:'code', code, detail }
  export function parseReq(text) {
    text = String(text || '').trim();
    if (!text) return null;
    // Tüm ifadeyi saran dış parantezleri at.
    while (text[0] === '(' && matchingClose(text) === text.length - 1) {
      text = text.slice(1, -1).trim();
    }
    const orParts = splitTop(text, 'Veya');
    if (orParts.length > 1) return { type: 'or', items: orParts.map(parseReq) };
    const andParts = splitTop(text, 'Ve');
    if (andParts.length > 1) return { type: 'and', items: andParts.map(parseReq) };
    const m = text.match(/^([A-ZÇĞİÖŞÜ]{2,5}\s\d{3}[A-Z]{0,2})(.*)$/);
    if (m) return { type: 'code', code: m[1], detail: m[2].trim() };
    return { type: 'text', raw: text };
  }

  function matchingClose(s) {
    let d = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') d++;
      else if (s[i] === ')') { d--; if (d === 0) return i; }
    }
    return -1;
  }

  // splitTop, bir operatörü parantez derinliği 0'da böler (iç grupları bozmaz).
  function splitTop(s, op) {
    const parts = [];
    let depth = 0, last = 0;
    const re = new RegExp(`\\(|\\)|\\b${op}\\b`, 'g');
    let m;
    while ((m = re.exec(s))) {
      const ch = m[0];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0) { parts.push(s.slice(last, m.index).trim()); last = m.index + m[0].length; }
    }
    parts.push(s.slice(last).trim());
    return parts.filter((p) => p.length);
  }

  // reqAlts, VEYA grubunun içindeki tüm kodları "alternatif" işaretler — bunlar
  // bireysel zorunlu değildir, tek bir seçenek yeterlidir. Saf — test edilebilir.
  export function reqAlts(tree, out = new Set()) {
    if (!tree) return out;
    if (tree.type === 'or') {
      const mark = (n) => {
        if (n.type === 'code') out.add(n.code);
        else if (n.items) n.items.forEach(mark);
      };
      tree.items.forEach(mark);
    } else if (tree.items) {
      tree.items.forEach((n) => reqAlts(n, out));
    }
    return out;
  }

  // renderReqTree, önşart ağacını okunur HTML'e çevirir: VE/VEYA grupları
  // iç içe listeler halinde, biri yeter / hepsi gerekli etiketleriyle.
  // Detay paneli de aynı ağacı gösterir (P1-9) — export. Faz D (G8): "aldığım
  // dersler"e göre alınmış dersler yeşil, alınmamışlar soluk; grup tatmini
  // (VE=hepsi, VEYA=biri) etiketinde.
  export function renderReqTree(tree) {
    if (tree.type === 'code') {
      const taken = isTaken(tree.code);
      return `<li class="req-item req-code${taken ? ' req-taken' : ' req-untaken'}">${esc(tree.code)}${tree.detail ? ` <em>${esc(tree.detail)}</em>` : ''}</li>`;
    }
    if (tree.type === 'text') return `<li class="req-item req-text">${esc(tree.raw)}</li>`;
    const label = tree.type === 'or' ? 'VEYA: biri yeterli' : 'VE: hepsi gerekli';
    const cls = tree.type === 'or' ? 'req-or' : 'req-and';
    const codes = collectCodes(tree);
    const satisfied = tree.type === 'or'
      ? codes.some((c) => isTaken(c))
      : codes.every((c) => isTaken(c));
    return `<li class="req-item req-group ${cls}${satisfied ? ' req-satisfied' : ' req-unsatisfied'}">
      <span class="req-op">${label}</span>
      <ul>${tree.items.map(renderReqTree).join('')}</ul>
    </li>`;
  }

  // Ağaçtaki tüm yaprak ders kodlarını toplar (grup tatmini için).
  function collectCodes(tree, out = []) {
    if (tree.type === 'code') out.push(tree.code);
    else if (tree.items) for (const it of tree.items) collectCodes(it, out);
    return out;
  }

  // ---- Bölüm seçici ve veri hazırlama ----

  let graph = null;
  let lastPoolNode = null;
  // Tema değişince canvas renkleri tazelenir ve grafik yeniden çizilir
  // (canvasColors() tema bazında önbellekler; data-theme değişince yeni değer üretir).
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    new MutationObserver(() => graph && graph.draw()).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });
  }
  // Faz D (G8): "aldığım dersler" değişince açık havuzdaki "✓ aldım" işaretleri
  // tazelenir (kayıttan sonra havuzu yeniden açmaya gerek kalmaz).
  if (typeof window !== 'undefined') {
    window.addEventListener(TAKEN_CHANGED, () => {
      if (graph && lastPoolNode) graph.renderPool(lastPoolNode);
    });
  }
  let programs = null;
  let reqByCode = null;
  // Seviye filtresi: varsayılan yalnızca lisans. Kullanıcı değiştirirse bu
  // Set üzerinden seçici yeniden kurulur.
  let activeLevels = new Set(['LS']);
  let prereqPreference = {};

  function savePrereqPreference(root) {
    const program = root.querySelector('.pg-program-select')?.value || '';
    const list = root.classList.contains('pg-list-mode') || root.classList.contains('pg-mobile-full');
    prereqPreference = { program, levels: [...activeLevels], view: list ? 'list' : 'graph' };
    writeLocalState('itu-prereq-view', prereqPreference, { validate: isPlainObject });
  }

  // ---- Seçmeli havuz yardımcıları ----
  // Havuz listesi her seçmeli slot açılışında branş dosyalarını çeker;
  // getJSON zaten önbellekliyor, ama eksik dosyayı (null) da modül düzeyinde
  // tutuyoruz ki aynı branşı her seferinde yeniden denemesin.
  const poolCache = new Map(); // "slug/KOD" -> sections[] | null; "hist/KOD" -> history map | null

  async function activeSections(branch) {
    const slug = state.index && state.index.currentSlug;
    if (!slug) return null;
    const key = `${slug}/${branch}`;
    if (!poolCache.has(key)) {
      try {
        poolCache.set(key, await getJSON(`data/terms/${slug}/branches/${branch}.json`));
      } catch {
        poolCache.set(key, null);
      }
    }
    return poolCache.get(key);
  }

  // Geçmişteki en son açılış dönemi: history/courses/<BRANŞ>.json'daki
  // terms[] en yeni önce sıralıdır, ilk eleman son açılıştır.
  async function lastOpenedTerm(code) {
    const branch = code.split(' ')[0];
    const key = `hist/${branch}`;
    if (!poolCache.has(key)) {
      try {
        poolCache.set(key, await getJSON(`data/history/courses/${branch}.json`));
      } catch {
        poolCache.set(key, null);
      }
    }
    const rec = poolCache.get(key);
    const hit = rec && rec[code];
    return hit && hit.terms && hit.terms.length ? hit.terms[0] : null;
  }
  const LEVEL_TR = { OL: 'Önlisans', LS: 'Lisans', YL: 'Yüksek Lisans', DR: 'Doktora' };
  const LEVEL_ORDER = ['OL', 'LS', 'YL', 'DR'];

  async function ensureData(root) {
    if (!graph) graph = new PlanGraph(root);
    if (!programs) {
      programs = await fetch('data/curriculum/index.json').then((r) => r.json());
      programs.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }
    return { graph, programs };
  }

  function buildProgramGraph(plan, prereqEdges, reqMap) {
    const nodes = [];
    const seen = new Set();
    const laneTitles = plan.semesters.map((s) => s.title.replace('. Yarıyıl', '. Dönem'));
    plan.semesters.forEach((sem, laneIdx) => {
      sem.items.forEach((item, slot) => {
        if (item.course) {
          if (seen.has(item.course.code)) return;
          seen.add(item.course.code);
          nodes.push({ code: item.course.code, name: item.course.name, branch: item.course.code.split(' ')[0], kind: 'course', lane: laneIdx });
        } else if (item.elective) {
          nodes.push({ code: `__elective_${laneIdx}_${slot}`, name: item.elective.title, kind: 'elective', lane: laneIdx, options: item.elective.options });
        }
      });
    });
    const codeSet = new Set(nodes.map((n) => n.code));

    // Hedef başına "alternatif" kümesini bir kez hesapla: o dersin önşart
    // ifadesindeki VEYA gruplarına düşen kodlar zorunlu değildir (biri yeter).
    const altsByTarget = new Map();
    for (const target of codeSet) {
      const t = reqMap && reqMap.get(target);
      altsByTarget.set(target, t ? reqAlts(parseReq(t)) : new Set());
    }
    const edges = prereqEdges
      .filter((e) => codeSet.has(e.from) && codeSet.has(e.to))
      .map((e) => ({ ...e, alt: altsByTarget.get(e.to) ? altsByTarget.get(e.to).has(e.from) : false }));
    return { nodes, edges, laneTitles };
  }

  async function selectProgram(root, code) {
    const { graph } = await ensureData(root);
    const statusEl = root.querySelector('.pg-status');
    statusEl.textContent = 'müfredat indiriliyor…';
    statusEl.classList.add('busy');
    const [plan, g] = await Promise.all([
      fetch(`data/curriculum/${code}.json`).then((r) => r.json()),
      reqByCode ? Promise.resolve(null) : fetch('data/prereq/graph.json').then((r) => r.json()),
    ]);
    if (g) {
      reqByCode = { edges: g.edges, req: new Map(g.nodes.filter((n) => n.requirement).map((n) => [n.code, n.requirement])) };
    }

    const { nodes, edges, laneTitles } = buildProgramGraph(plan, reqByCode.edges, reqByCode.req);
    for (const n of nodes) {
      const r = reqByCode.req.get(n.code);
      if (r) n.requirement = r;
    }

    root.querySelector('.pg-plan-label').textContent = plan.planLabel || '';
    renderBranchLegend(root, nodes);
    renderSemesterList(root, plan, reqByCode);
    await graph.build(nodes, edges, laneTitles, `${plan.programName} · ${nodes.length} ders/slot, bir düğüme tıkla`);
    renderMobileExplorer(root, plan, graph);
    statusEl.classList.remove('busy');
  }

  // Telefonda masaüstü canvas'ını küçültmek yerine, önce dönemleri gösteren ve
  // bir derse dokununca "önce → seçili → sonra" ilişkisini açan odak gezgini.
  // Düğmeler aynı grafın indeksini kullandığı için görsel ve metin görünümü
  // arasında veri farkı oluşmaz.
  function renderMobileExplorer(root, plan, currentGraph) {
    const box = root.querySelector('.pg-mobile-explorer');
    if (!box) return;
    const byCode = new Map((currentGraph.nodes || []).map((n) => [n.code, n]));
    const en = I18N.lang === 'en';
    const txt = (tr, english) => en ? english : tr;
    const courseButton = (code, rel = '') => {
      const n = byCode.get(code) || { code, name: '' };
      return `<button type="button" class="pg-mobile-course" data-focus-code="${esc(code)}">
        <span><b>${esc(n.code)}</b>${rel ? `<small>${esc(rel)}</small>` : ''}</span>
        <em>${esc(n.name || txt('Ders adı arşivde bulunamadı', 'Course name unavailable in archive'))}</em><i aria-hidden="true">›</i>
      </button>`;
    };
    const renderIndex = () => {
      box.innerHTML = `<div class="pg-mobile-explorer-head"><div><b>${txt('Dönemlere göre dersler', 'Courses by term')}</b><span>${txt('Bağlantıları görmek için bir derse dokun.', 'Tap a course to inspect its links.')}</span></div></div>` +
        (plan.semesters || []).map((sem, semIndex) => {
          const items = (sem.items || []).map((it) => {
            if (it.course) return courseButton(it.course.code);
            if (it.elective) {
              const node = [...byCode.values()].find((n) => n.kind === 'elective' && n.name === it.elective.title);
              return node ? `<button type="button" class="pg-mobile-course elective" data-pool-code="${esc(node.code)}"><span><b>${txt('Seçmeli havuz', 'Elective pool')}</b><small>${it.elective.options?.length || 0} ${txt('seçenek', 'options')}</small></span><em>${esc(it.elective.title)}</em><i aria-hidden="true">›</i></button>` : '';
            }
            return '';
          }).join('');
          return items ? `<details class="pg-mobile-semester" ${semIndex === 0 ? 'open' : ''}><summary>${esc(sem.title)}<span>${(sem.items || []).length} ${txt('ders/slot', 'courses/slots')}</span></summary>${items}</details>` : '';
        }).join('');
      wire();
    };
    const renderFocus = (code) => {
      const n = byCode.get(code);
      if (!n) return;
      const before = (currentGraph.byTo.get(code) || []);
      const after = (currentGraph.byFrom.get(code) || []);
      const logic = n.requirement ? (/veya/i.test(n.requirement) ? txt('VEYA · biri yeterli', 'OR · any one is enough') : txt('VE · hepsi gerekli', 'AND · all are required')) : '';
      const source = (currentGraph.edges || []).find((edge) => edge.to.code === code && edge.sourceUrl);
      box.innerHTML = `<div class="pg-mobile-explorer-head"><button type="button" class="pg-mobile-back">← ${txt('Dönemler', 'Terms')}</button><button type="button" class="pg-mobile-detail" data-detail-code="${esc(code)}">${txt('Ders detayı', 'Course details')}</button></div>
        <div class="pg-mobile-flow">
          <section><h3>${txt('Önce alınması gerekenler', 'Required before')}</h3>${logic ? `<p class="pg-mobile-logic">${esc(logic)}</p>` : ''}${before.length ? before.map((c) => courseButton(c, txt('önşart', 'prerequisite'))).join('') : `<p class="pg-mobile-empty">${txt('Kayıtlı önşart yok.', 'No recorded prerequisite.')}</p>`}</section>
          <article class="pg-mobile-selected"><span>${txt('Seçili ders', 'Selected course')}</span><b>${esc(n.code)}</b><h2>${esc(n.name || txt('Ders adı arşivde bulunamadı', 'Course name unavailable in archive'))}</h2>${n.requirement ? `<p>${esc(n.requirement)}</p>` : ''}${source ? `<p class="pg-mobile-source">${txt('Kaynak', 'Source')}: <a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener">İTÜ OBS ↗</a>${source.verifiedAt ? ` · ${new Date(source.verifiedAt).toLocaleDateString('tr-TR')}` : ''}</p>` : ''}</article>
          <section><h3>${txt('Bu dersten sonra açılanlar', 'Courses unlocked after')}</h3>${after.length ? after.map((c) => courseButton(c, txt('bu dersi ister', 'requires this course'))).join('') : `<p class="pg-mobile-empty">${txt('Bu dersi doğrudan isteyen başka ders yok.', 'No course directly requires this course.')}</p>`}</section>
        </div>`;
      wire();
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const wire = () => {
      box.querySelector('.pg-mobile-back')?.addEventListener('click', renderIndex);
      box.querySelectorAll('[data-focus-code]').forEach((b) => b.addEventListener('click', () => renderFocus(b.dataset.focusCode)));
      box.querySelectorAll('[data-pool-code]').forEach((b) => b.addEventListener('click', () => currentGraph.focusNode(b.dataset.poolCode)));
      box.querySelector('[data-detail-code]')?.addEventListener('click', (ev) => window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: ev.currentTarget.dataset.detailCode, source: 'onsart-mobile' } })));
    };
    box.hidden = false;
    renderIndex();
  }

  // Faz 5.4 (D2): grafiğin dönem-dönem metin karşılığı. Ekran okuyucu için her
  // zaman DOM'da (sr-only), mobilde "listeye dön" ile görünür olur. Course /
  // elective item'ları müfredat şemasından, önşart grafik indeksinden gelir.
  function renderSemesterList(root, plan, reqByCode) {
    const box = root.querySelector('.pg-semester-list');
    if (!box) return;
    box.innerHTML = (plan.semesters || []).map((sem) => {
      const items = (sem.items || []).map((it) => {
        if (it.course) {
          const req = reqByCode?.req?.get(it.course.code);
          return `<li><code>${esc(it.course.code)}</code>: ${esc(it.course.name)}${req ? `<span class="pg-list-req"> · önşart: ${esc(req)}</span>` : ''}</li>`;
        }
        if (it.elective) {
          const n = it.elective.options ? it.elective.options.length : 0;
          return `<li><span class="pg-list-elect">Seçmeli havuz:</span> ${esc(it.elective.title)} (${n} seçenek)</li>`;
        }
        return '';
      }).filter(Boolean).join('');
      return items ? `<li><h3>${esc(sem.title)}</h3><ul>${items}</ul></li>` : '';
    }).filter(Boolean).join('');
  }

  // Faz 5.4 (D1): mobilde grafik yerine dönem-dönem listeye geçiş. Liste her
  // programda üretilir; grafik modunda sr-only (ekran okuyucu yine erişir).
  function initListToggle(root) {
    const btn = root.querySelector('.pg-list-toggle');
    const box = root.querySelector('.pg-semester-list');
    if (!btn || !box) return;
    btn.addEventListener('click', () => {
      const mobile = window.matchMedia('(max-width: 700px)').matches;
      const on = mobile ? root.classList.toggle('pg-mobile-full') : root.classList.toggle('pg-list-mode');
      btn.textContent = mobile ? (on ? 'Odak görünümü' : 'Tam grafik') : (on ? 'Grafik görünümü' : 'Liste görünümü');
      btn.setAttribute('aria-pressed', String(on));
      if (!mobile) box.classList.toggle('sr-only', !on);
      savePrereqPreference(root);
    });
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    if (mobile) btn.textContent = 'Tam grafik';
    if (prereqPreference.view === 'list') {
      if (mobile) root.classList.add('pg-mobile-full');
      else {
        root.classList.add('pg-list-mode');
        box.classList.remove('sr-only');
      }
      btn.textContent = mobile ? 'Odak görünümü' : 'Grafik görünümü';
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  // renderBranchLegend, grafikteki renklerin hangi branşa ait olduğunu
  // gösterir — düğüm renkleri branş kodundan türetiliyor.
  function renderBranchLegend(root, nodes) {
    const box = root.querySelector('.pg-branches');
    const branches = [...new Set(nodes.filter((n) => n.kind === 'course').map((n) => n.branch))].sort();
    box.innerHTML = branches.length
      ? branches.map((b) => `<span class="pg-branch"><i style="background:${hueOf(b)}"></i>${esc(b)}</span>`).join('')
      : '';
  }

  // Seviye filtresi düğmelerini kurar; tıklamayla activeLevels güncellenir,
  // butonlar ve seçici yeniden çizilir.
  function initLevelFilter(root) {
    const box = root.querySelector('.pg-levels');
    if (!box) return;
    box.addEventListener('click', (ev) => {
      const b = ev.target.closest('.pg-level');
      if (!b) return;
      const lv = b.dataset.level;
      if (activeLevels.has(lv)) activeLevels.delete(lv);
      else activeLevels.add(lv);
      renderLevelFilter(box);
      renderProgramPicker(root);
      savePrereqPreference(root);
    });
    renderLevelFilter(box);
  }

  function renderLevelFilter(box) {
    box.innerHTML = LEVEL_ORDER.map((lv) =>
      `<button type="button" class="pg-level${activeLevels.has(lv) ? ' active' : ''}" data-level="${lv}" aria-pressed="${activeLevels.has(lv)}">${LEVEL_TR[lv]}</button>`).join('');
  }

  // Önce fakülte, sonra bölüm: tek uzun gruplu liste yerine iki adım.
  // Her iki liste de yalnızca aktif seviyedeki programları gösterir.

  function visibleProgs() {
    return programs.filter((p) => activeLevels.has(p.level || 'LS'));
  }

  // Seçili fakülteyi korur; o fakülte artık görünmüyorsa ilkine düşer.
  function renderFacultyPicker(root) {
    const sel = root.querySelector('.pg-faculty-select');
    const facs = [...new Set(visibleProgs().map((p) => p.faculty || 'Diğer'))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
    const prev = sel.value;
    sel.innerHTML = facs.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join('');
    sel.value = facs.includes(prev) ? prev : (facs[0] || '');
    return sel.value;
  }

  // Seçiciyi seçili fakültenin (ve aktif seviyenin) programlarıyla kurar.
  // Seçili program listeden düştüyse seçimi temizleyip grafiği sıfırlar.
  function renderProgramPicker(root) {
    const faculty = renderFacultyPicker(root);
    const sel = root.querySelector('.pg-program-select');
    const ps = visibleProgs().filter((p) => (p.faculty || 'Diğer') === faculty);
    const lvlAdi = (p) => LEVEL_TR[p.level] || p.level || 'Lisans';
    const html = '<option value="">Bölüm seçiniz…</option>' +
      ps.map((p) => `<option value="${esc(p.code)}">${esc(p.name)} · ${esc(lvlAdi(p))}</option>`).join('');
    const prev = sel.value;
    sel.innerHTML = html;
    const stillThere = prev && [...sel.options].some((o) => o.value === prev);
    sel.value = stillThere ? prev : '';
    if (!stillThere) {
      root.querySelector('.pg-plan-label').textContent = '';
      if (graph) graph.reset();
    }
  }

  let inited = false;
  export const PrereqGraph = {
    async init(rootSelector) {
      const root = document.querySelector(rootSelector);
      const { programs: ps } = await ensureData(root);
      if (!inited) {
        prereqPreference = readLocalState('itu-prereq-view', { fallback: {}, validate: isPlainObject });
        const levels = Array.isArray(prereqPreference.levels)
          ? prereqPreference.levels.filter((level) => LEVEL_ORDER.includes(level)) : [];
        activeLevels = new Set(levels.length ? levels : ['LS']);
        initLevelFilter(root);
        renderProgramPicker(root);
        // Fakülte değişince bölüm listesi yenilenir (seçim temizlenir).
        root.querySelector('.pg-faculty-select').addEventListener('change', () => {
          renderProgramPicker(root);
        });
        root.querySelector('.pg-program-select').addEventListener('change', () => {
          const sel = root.querySelector('.pg-program-select');
          if (!sel.value) return;
          selectProgram(root, sel.value);
          savePrereqPreference(root);
          history.replaceState(null, '', `?prog=${encodeURIComponent(sel.value)}#onsart`);
        });
        root.querySelector('.pg-search').addEventListener('input', (e) => {
          const results = root.querySelector('.pg-results');
          if (!graph || !graph.nodes) { results.innerHTML = ''; return; }
          const hits = graph.search(e.target.value);
          results.innerHTML = hits.map((n) => n.kind === 'elective'
            ? `<button class="pg-chip" data-code="${esc(n.code)}">${esc(n.name)}<em>seçmeli slot</em></button>`
            : `<button class="pg-chip" data-code="${esc(n.code)}">${esc(n.code)}<em>${esc(n.name || '')}</em></button>`
          ).join('');
          results.querySelectorAll('.pg-chip').forEach((b) =>
            b.addEventListener('click', () => graph.panTo(b.dataset.code)));
        });
        root.querySelector('.pg-reset').addEventListener('click', () => graph && graph.clearFocus());
        initListToggle(root);

        // Paylaşılabilir URL: ?prog=BLG_LS&pool=<slot>#onsart — programı seç,
        // grafik kurulunca (varsa) havuz panelini aç.
        const params = new URLSearchParams(location.search);
        const wantProg = params.get('prog') || prereqPreference.program || '';
        if (wantProg) {
          // Paylaşılan link başka bir fakültenin programına işaret edebilir:
          // önce o programın fakültesini aç, sonra bölüm listesini kur.
          const hedef = programs.find((p) => p.code === wantProg);
          if (hedef) {
            const facSel = root.querySelector('.pg-faculty-select');
            const fac = hedef.faculty || 'Diğer';
            if ([...facSel.options].some((o) => o.value === fac)) {
              facSel.value = fac;
              renderProgramPicker(root);
            }
          }
          const sel = root.querySelector('.pg-program-select');
          const ok = [...sel.options].some((o) => o.value === wantProg);
          if (ok) {
            sel.value = wantProg;
            selectProgram(root, wantProg).then(() => {
              const wantPool = params.get('pool');
              if (!wantPool || !graph || !graph.nodes) return;
              const f = fold(wantPool);
              const node = graph.nodes.find((nn) => nn.kind === 'elective' && fold(nn.name) === f);
              if (node) graph.focusNode(node.code);
            });
          }
        } else {
          // İlk ziyaret: ne URL'de ?prog= var ne de hatırlanan bir tercih.
          // Fakülte zaten (alfabetik) ilkine düşmüş durumda — Ders Planım'daki
          // fakülte→bölüm davranışıyla tutarlı olsun diye program da ilk
          // seçeneğe düşer, kullanıcı boş "Bölüm seçiniz…" ile karşılaşmaz.
          const sel = root.querySelector('.pg-program-select');
          const first = sel.options[1]; // options[0] = "Bölüm seçiniz…" placeholder
          if (first) {
            sel.value = first.value;
            selectProgram(root, first.value);
            savePrereqPreference(root);
            history.replaceState(null, '', `?prog=${encodeURIComponent(first.value)}#onsart`);
          }
        }

        inited = true;
      }
    },
  };
