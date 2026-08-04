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
(function () {
  const PALETTE = [
    '#5eead4', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185',
    '#fb923c', '#facc15', '#a3e635', '#4ade80', '#2dd4bf', '#60a5fa', '#e879f9', '#94a3b8',
  ];
  const FOLD = { 'İ': 'i', 'I': 'i', 'ı': 'i', 'Ş': 's', 'ş': 's', 'Ğ': 'g', 'ğ': 'g', 'Ü': 'u', 'ü': 'u', 'Ö': 'o', 'ö': 'o', 'Ç': 'c', 'ç': 'c' };
  const fold = (s) => String(s).replace(/[İIıŞşĞğÜüÖöÇç]/g, (c) => FOLD[c]).toLowerCase();

  function hueOf(key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  const LANE_PAD = 90;   // ilk/son sütunun kenarla arası
  const ROW_PAD = 46;
  const NODE_R = 15;

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
      this.drag = null;
      this.nodes = null;
      this.ro = new ResizeObserver(() => { this.layout(); this.draw(); });
      this.ro.observe(this.canvas);
      this.bindInput();
    }

    // build: node = { code, name, kind:'course'|'elective', lane, requirement, options }
    // edge = { from, to } (kod)
    async build(nodes, edges, laneTitles, statusLabel) {
      this.laneTitles = laneTitles;
      this.nodes = nodes.map((n) => ({ ...n, x: 0, y: 0, deg: 0 }));
      this.byCode = new Map(this.nodes.map((n) => [n.code, n]));
      this.edges = edges
        .map((e) => ({ from: this.byCode.get(e.from), to: this.byCode.get(e.to) }))
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
      const contentW = LANE_PAD * 2 + (this.laneTitles.length - 1) * this.laneW;
      const k = Math.min(w / (contentW || w), h / ((this.contentHeight || h) * 1.05), 1.6);
      this.cam.k = Math.max(k, 0.25);
      this.cam.x = (w - contentW * this.cam.k) / 2;
      this.cam.y = (h - (this.contentHeight || h) * this.cam.k) / 2;
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
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
      if (!this.nodes) return;
      const focused = !!this.related;

      // Sütun başlıkları ve ayraç çizgileri — sabit düzenin okunurluğu için.
      ctx.font = '11px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(140,160,150,0.55)';
      ctx.textAlign = 'center';
      this.laneTitles.forEach((title, i) => {
        const [x] = this.worldToScreen(LANE_PAD + i * this.laneW, 0);
        ctx.fillText(title, x, 18);
      });

      const r = NODE_R * this.cam.k;
      for (const e of this.edges) {
        const related = focused && this.related.has(e.from.code) && this.related.has(e.to.code);
        const dim = focused && !related;
        drawEdge(ctx, this.worldToScreen(e.from.x, e.from.y), this.worldToScreen(e.to.x, e.to.y), r,
          dim ? 'rgba(140,160,150,0.08)' : (related ? 'rgba(0,255,156,0.85)' : 'rgba(120,200,170,0.4)'),
          related ? 1.8 : 1.1);
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
          ctx.fillStyle = dim ? 'rgba(140,160,150,0.35)' : 'rgba(230,245,235,0.92)';
          const label = n.kind === 'elective' ? wrapShort(n.name, 16) : n.code;
          ctx.fillText(label, x + r * 0.95, y + 3);
        }
      }

      if (this.focus) {
        const n = this.byCode.get(this.focus);
        if (n) {
          const [x, y] = this.worldToScreen(n.x, n.y);
          ctx.beginPath();
          ctx.arc(x, y, r * 0.72 + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#00ff9c';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
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
    }

    clearFocus() {
      this.focus = null;
      this.related = null;
      this.detail.innerHTML = '';
      this.draw();
    }

    panTo(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      this.focusNode(code);
    }

    renderDetail(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      const chip = (c) => `<button class="pg-chip" data-code="${esc(c)}">${esc(c)}</button>`;

      if (n.kind === 'elective') {
        const opts = (n.options || []).slice().sort((a, b) => a.code.localeCompare(b.code));
        this.detail.innerHTML = `
          <h3>${esc(n.name)} <span>seçmeli slot</span></h3>
          <p class="pg-empty">${opts.length} alternatiften biri seçilir. Aşağıdakilerden grafikte de bulunanlar tıklanabilir.</p>
          <div class="pg-chips">${opts.map((o) => `<button class="pg-chip" data-code="${esc(o.code)}" ${this.byCode.has(o.code) ? '' : 'disabled title="Bu ders grafikte yok"'}>${esc(o.code)}<em>${esc(o.name)}</em></button>`).join('')}</div>`;
      } else {
        const req = (this.byTo.get(code) || []).sort();
        const dep = (this.byFrom.get(code) || []).sort();
        this.detail.innerHTML = `
          <h3>${esc(n.code)} <span>${esc(n.name || '')}</span></h3>
          ${n.requirement ? `<pre class="pg-req">${esc(n.requirement)}</pre>` : '<p class="pg-empty">Bu programda kayıtlı önşartı yok.</p>'}
          ${req.length ? `<h4>Önşartları (${req.length})</h4><div class="pg-chips">${req.map(chip).join('')}</div>` : ''}
          ${dep.length ? `<h4>Bunu önşart olarak isteyenler (${dep.length})</h4><div class="pg-chips">${dep.map(chip).join('')}</div>` : ''}`;
      }
      this.detail.querySelectorAll('.pg-chip:not([disabled])').forEach((b) =>
        b.addEventListener('click', () => this.panTo(b.dataset.code)));
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
      c.addEventListener('wheel', (e) => {
        if (!this.nodes) return;
        e.preventDefault();
        const rect = c.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const [wx, wy] = this.screenToWorld(mx, my);
        this.cam.k = Math.min(4, Math.max(0.15, this.cam.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        const [sx, sy] = this.worldToScreen(wx, wy);
        this.cam.x += mx - sx; this.cam.y += my - sy;
        this.draw();
      }, { passive: false });

      c.addEventListener('mousedown', (e) => { this.drag = { x: e.clientX, y: e.clientY, moved: false }; });
      window.addEventListener('mousemove', (e) => {
        if (!this.drag) return;
        const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
        this.cam.x += dx; this.cam.y += dy;
        this.drag.x = e.clientX; this.drag.y = e.clientY;
        this.draw();
      });
      window.addEventListener('mouseup', (e) => {
        if (this.drag && !this.drag.moved && this.nodes) {
          const rect = c.getBoundingClientRect();
          const n = this.nodeAt(e.clientX - rect.left, e.clientY - rect.top);
          if (n) this.focusNode(n.code);
          else this.clearFocus();
        }
        this.drag = null;
      });
      c.addEventListener('mousemove', (e) => {
        if (!this.nodes) return;
        const rect = c.getBoundingClientRect();
        const n = this.nodeAt(e.clientX - rect.left, e.clientY - rect.top);
        if (n) {
          this.tip.hidden = false;
          this.tip.style.left = (e.clientX - rect.left + 14) + 'px';
          this.tip.style.top = (e.clientY - rect.top + 10) + 'px';
          this.tip.textContent = n.name ? `${n.code} — ${n.name}` : n.code;
        } else {
          this.tip.hidden = true;
        }
      });
    }
  }

  // drawEdge, iki sütun arasında yumuşak bir eğri çizer ve hedefe küçük bir
  // ok ucu ekler — önşart ilişkisinin yönü (A, B'nin önşartıysa A→B) her
  // zaman görünsün diye.
  function drawEdge(ctx, [x1, y1], [x2, y2], r, color, width) {
    const midX = (x1 + x2) / 2;
    ctx.beginPath();
    ctx.moveTo(x1 + r * 0.7, y1);
    ctx.bezierCurveTo(midX, y1, midX, y2, x2 - r * 0.9, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

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

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Bölüm seçici ve veri hazırlama ----

  let graph = null;
  let programs = null;
  let reqByCode = null;

  async function ensureData(root) {
    if (!graph) graph = new PlanGraph(root);
    if (!programs) {
      programs = await fetch('data/curriculum/index.json').then((r) => r.json());
      programs.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }
    return { graph, programs };
  }

  function buildProgramGraph(plan, prereqEdges) {
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
    const edges = prereqEdges.filter((e) => codeSet.has(e.from) && codeSet.has(e.to));
    return { nodes, edges, laneTitles };
  }

  async function selectProgram(root, code) {
    const { graph } = await ensureData(root);
    root.querySelector('.pg-status').textContent = 'müfredat indiriliyor…';
    const [plan, g] = await Promise.all([
      fetch(`data/curriculum/${code}.json`).then((r) => r.json()),
      reqByCode ? Promise.resolve(null) : fetch('data/prereq/graph.json').then((r) => r.json()),
    ]);
    if (g) {
      reqByCode = { edges: g.edges, req: new Map(g.nodes.filter((n) => n.requirement).map((n) => [n.code, n.requirement])) };
    }

    const { nodes, edges, laneTitles } = buildProgramGraph(plan, reqByCode.edges);
    for (const n of nodes) {
      const r = reqByCode.req.get(n.code);
      if (r) n.requirement = r;
    }

    root.querySelector('.pg-plan-label').textContent = plan.planLabel || '';
    await graph.build(nodes, edges, laneTitles, `${plan.programName} · ${nodes.length} ders/slot — bir düğüme tıkla`);
  }

  function renderProgramPicker(root, programs) {
    const sel = root.querySelector('.pg-program-select');
    const byFaculty = new Map();
    for (const p of programs) {
      if (!byFaculty.has(p.faculty)) byFaculty.set(p.faculty, []);
      byFaculty.get(p.faculty).push(p);
    }
    let html = '<option value="">Bölüm seçiniz…</option>';
    for (const [faculty, ps] of byFaculty) {
      html += `<optgroup label="${esc(faculty)}">` +
        ps.map((p) => `<option value="${esc(p.code)}">${esc(p.name)}</option>`).join('') +
        '</optgroup>';
    }
    sel.innerHTML = html;
    sel.addEventListener('change', () => { if (sel.value) selectProgram(root, sel.value); });
  }

  let inited = false;
  window.PrereqGraph = {
    async init(rootSelector) {
      const root = document.querySelector(rootSelector);
      const { programs } = await ensureData(root);
      if (!inited) {
        renderProgramPicker(root, programs);
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
        inited = true;
      }
    },
  };
})();
