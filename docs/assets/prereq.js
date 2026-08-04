// Ders planı haritası: seçilen bölümün müfredatını (dönem dönem zorunlu ve
// seçmeli dersler) gerçek önşart ilişkileriyle birlikte, dış kütüphane
// kullanmayan bir force-directed motorla çizer.
//
// Tasarım kararları:
// - Bütün katalog yerine tek bölüm gösteriliyor: 5000+ derslik grafik "vitray"
//   gibi okunmaz bir yığına dönüşüyordu. Bir bölümün müfredatı ~50-90 düğüm,
//   bu ölçekte grafik gerçekten okunabiliyor.
// - Seçmeli ders slotları ("7. Yarıyıl Seçmeli II") ayrı ayrı onlarca düğüm
//   olarak açılmıyor — bazı havuzlarda 150+ alternatif var (üniversite geneli
//   seçmeliler). Her slot TEK bir elmas düğüm; alternatifler tıklanınca açılan
//   panelde listeleniyor.
// - Fizik simülasyonu yalnızca açılışta ~150 tur çalışıp donuyor (Obsidian'ın
//   grafik görünümü gibi düğümler "uçarak" yerleşiyor). Devam eden bir
//   animasyon döngüsü yok, statik bir sitede CPU'yu sürekli yakmanın anlamı
//   yok. Her düğüm ayrıca kendi dönemine hafifçe çekiliyor, böylece kaotik
//   değil dönem dönem okunabilir bir yerleşim çıkıyor.
// - İtme kuvveti O(n²) değil, uzamsal ızgara ile yalnızca yakın düğümlere
//   bakıyor. Bu ölçekte şart değil ama kod tüm katalog modu için de kullanılıyor.
// - Çizim, düğüm başına ayrı fillStyle çağırmak yerine branşa göre gruplanmış
//   Path2D'lerle yapılıyor. Path2D'de art arda arc() çağırmadan önce moveTo
//   şart — yoksa daireler birbirine çizgiyle bağlanıp dolgu tek bir şekle
//   dönüşüyor.
(function () {
  const CELL = 46;
  const EDGE_LEN = 46;
  const TICKS = 160;
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

  class PrereqGraph {
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
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.canvas);
      this.bindInput();
    }

    // build, hazır bir {nodes, edges} çiftinden grafiği kurar (fetch işini
    // çağıran taraf yapar — tüm katalog ile bölüm modu aynı motoru paylaşıyor).
    //
    // node: { code, name, kind: 'course'|'elective', lane (dönem indeksi, opsiyonel),
    //         requirement, classReq, options (elective için) }
    // edge: { from, to } (kod)
    async build(nodes, edges, statusLabel) {
      this.nodes = nodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0, deg: 0 }));
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
      for (const n of this.nodes) n.r = Math.max(3, Math.min(15, 3 + Math.sqrt(n.deg) * 1.6));

      this.hay = this.nodes.map((n) => fold(`${n.code} ${n.name || ''}`));
      this.focus = null; this.related = null;
      this.detail.innerHTML = '';
      this.status.textContent = `${statusLabel} — yerleşiyor…`;

      this.seed();
      this.resize();
      await this.settle();
      this.fit();
      this.status.textContent = `${statusLabel} — bir düğüme tıkla`;
      this.draw();
    }

    seed() {
      const n = this.nodes.length;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 * 7;
        const r = Math.sqrt(i / n) * Math.sqrt(n) * 11;
        this.nodes[i].x = Math.cos(a) * r;
        this.nodes[i].y = Math.sin(a) * r + (this.nodes[i].lane ?? 0) * 90;
      }
    }

    // settle, fiziği TICKS tur çalıştırır. Sabit aralıkla yield etmiyoruz:
    // tarayıcılar arka plandaki/görünmeyen sekmelerde setTimeout'u bile
    // saniyelerce geciktirebiliyor (rAF ise süresiz askıya alınabiliyor),
    // her yield o gecikmeyi tekrar tekrar ödemek anlamına gelir. Bunun
    // yerine gerçekten geçen süreyi ölçüp yalnızca ~40ms'yi aştığımızda
    // yield ediyoruz — az düğümde hiç beklemeden tek nefeste biter, çok
    // düğümde de sayfa donmadan ilerler.
    async settle() {
      let last = performance.now();
      for (let t = 0; t < TICKS; t++) {
        this.tick(t / TICKS);
        if (t % 3 === 0) this.draw();
        if (performance.now() - last > 40) {
          await new Promise((r) => setTimeout(r, 0));
          last = performance.now();
        }
      }
    }

    tick(progress) {
      const nodes = this.nodes;
      const grid = new Map();
      const key = (cx, cy) => cx + ',' + cy;
      for (const n of nodes) {
        const cx = Math.round(n.x / CELL), cy = Math.round(n.y / CELL);
        const k = key(cx, cy);
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(n);
      }

      const repel = 1100 * (1 - progress * 0.5);
      for (const n of nodes) {
        const cx = Math.round(n.x / CELL), cy = Math.round(n.y / CELL);
        let fx = 0, fy = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const bucket = grid.get(key(cx + dx, cy + dy));
            if (!bucket) continue;
            for (const o of bucket) {
              if (o === n) continue;
              let ddx = n.x - o.x, ddy = n.y - o.y;
              let d2 = ddx * ddx + ddy * ddy;
              if (d2 < 25) d2 = 25;
              const f = repel / d2;
              fx += ddx * f; fy += ddy * f;
            }
          }
        }
        n.fx = fx; n.fy = fy;
      }

      for (const e of this.edges) {
        const dx = e.to.x - e.from.x, dy = e.to.y - e.from.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const f = (d - EDGE_LEN) * 0.05;
        const ux = dx / d, uy = dy / d;
        e.from.fx += ux * f; e.from.fy += uy * f;
        e.to.fx -= ux * f; e.to.fy -= uy * f;
      }

      const MAX_FORCE = 70, MAX_SPEED = 26;
      for (const n of nodes) {
        n.fx -= n.x * 0.003;
        // Dönem ipliği: her düğüm kendi yarıyılına ait yatay şeride hafifçe
        // çekiliyor. Kaotik bir top yığını değil, yukarıdan aşağı 1. yarıyıldan
        // sonuncuya doğru okunabilir bir akış çıkıyor.
        if (n.lane != null) {
          const targetY = n.lane * 90;
          n.fy += (targetY - n.y) * 0.02;
        } else {
          n.fy -= n.y * 0.003;
        }

        const fm = Math.hypot(n.fx, n.fy);
        if (fm > MAX_FORCE) { const s = MAX_FORCE / fm; n.fx *= s; n.fy *= s; }

        n.vx = (n.vx + n.fx) * 0.82;
        n.vy = (n.vy + n.fy) * 0.82;

        const vm = Math.hypot(n.vx, n.vy);
        if (vm > MAX_SPEED) { const s = MAX_SPEED / vm; n.vx *= s; n.vy *= s; }

        n.x += n.vx; n.y += n.vy;
      }
    }

    fit() {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of this.nodes) {
        if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
      }
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      const k = Math.min(w / ((maxX - minX) * 1.15 || 1), h / ((maxY - minY) * 1.15 || 1), 2.6);
      this.cam.k = Math.max(k, 0.05);
      this.cam.x = -((minX + maxX) / 2) * this.cam.k;
      this.cam.y = -((minY + maxY) / 2) * this.cam.k;
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (this.nodes) this.draw();
    }

    worldToScreen(x, y) {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      return [x * this.cam.k + this.cam.x + w / 2, y * this.cam.k + this.cam.y + h / 2];
    }
    screenToWorld(x, y) {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      return [(x - this.cam.x - w / 2) / this.cam.k, (y - this.cam.y - h / 2) / this.cam.k];
    }

    draw() {
      const ctx = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (!this.nodes) return;

      const focused = !!this.related;

      ctx.lineWidth = 1;
      if (!focused) {
        ctx.beginPath();
        for (const e of this.edges) {
          const [x1, y1] = this.worldToScreen(e.from.x, e.from.y);
          const [x2, y2] = this.worldToScreen(e.to.x, e.to.y);
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = 'rgba(150,170,160,0.16)';
        ctx.stroke();
      } else {
        ctx.beginPath();
        for (const e of this.edges) {
          if (this.related.has(e.from.code) && this.related.has(e.to.code)) continue;
          const [x1, y1] = this.worldToScreen(e.from.x, e.from.y);
          const [x2, y2] = this.worldToScreen(e.to.x, e.to.y);
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = 'rgba(150,170,160,0.05)';
        ctx.stroke();

        ctx.beginPath();
        for (const e of this.edges) {
          if (!(this.related.has(e.from.code) && this.related.has(e.to.code))) continue;
          const [x1, y1] = this.worldToScreen(e.from.x, e.from.y);
          const [x2, y2] = this.worldToScreen(e.to.x, e.to.y);
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        }
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(0,255,156,0.65)';
        ctx.stroke();
      }

      const byColor = new Map();
      for (const n of this.nodes) {
        const dim = focused && !this.related.has(n.code);
        const colorKey = n.kind === 'elective' ? 'elective' : n.branch || n.code.split(' ')[0];
        const color = dim ? '#3d5f4e' : (n.kind === 'elective' ? '#ffc857' : hueOf(colorKey));
        const bucketKey = color + (n.kind === 'elective' ? '|d' : '|c');
        if (!byColor.has(bucketKey)) byColor.set(bucketKey, { glow: new Path2D(), core: new Path2D(), color, diamond: n.kind === 'elective' });
        const g = byColor.get(bucketKey);
        const [x, y] = this.worldToScreen(n.x, n.y);
        const r = n.r * Math.min(1.4, Math.max(0.6, this.cam.k));

        if (n.kind === 'elective') {
          addDiamond(g.core, x, y, r * 1.3);
          if (!dim) addDiamond(g.glow, x, y, r * 2.6);
        } else {
          g.core.moveTo(x + r, y);
          g.core.arc(x, y, r, 0, Math.PI * 2);
          if (!dim) { g.glow.moveTo(x + r * 2.1, y); g.glow.arc(x, y, r * 2.1, 0, Math.PI * 2); }
        }
      }
      for (const g of byColor.values()) {
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = g.color;
        ctx.fill(g.glow);
        ctx.globalAlpha = focused ? 0.92 : 0.88;
        ctx.fill(g.core);
      }
      ctx.globalAlpha = 1;

      if (this.focus) {
        const n = this.byCode.get(this.focus);
        if (n) {
          const [x, y] = this.worldToScreen(n.x, n.y);
          const r = n.r * Math.min(1.4, Math.max(0.6, this.cam.k)) + 3;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2); // odak halkası; seçmelide de daire yeterli, ayırt edici olan elmas gövde
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
        const hit = Math.max(n.r, 7 / this.cam.k);
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
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.cam.k = Math.max(this.cam.k, 0.9);
      this.cam.x = -n.x * this.cam.k + w / 2;
      this.cam.y = -n.y * this.cam.k + h / 2;
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
        const k2 = Math.min(6, Math.max(0.03, this.cam.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        this.cam.k = k2;
        const [sx, sy] = this.worldToScreen(wx, wy);
        this.cam.x += mx - sx; this.cam.y += my - sy;
        this.draw();
      }, { passive: false });

      c.addEventListener('mousedown', (e) => {
        this.drag = { x: e.clientX, y: e.clientY, moved: false };
      });
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

  function addDiamond(path, x, y, r) {
    path.moveTo(x, y - r);
    path.lineTo(x + r, y);
    path.lineTo(x, y + r);
    path.lineTo(x - r, y);
    path.closePath();
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Bölüm seçici ve veri hazırlama ----

  let graph = null;       // PrereqGraph örneği
  let prereqEdges = null; // global {from,to} önşart kenarları, bir kez çekilir
  let programs = null;    // curriculum/index.json

  async function ensureData(root) {
    if (!graph) graph = new PrereqGraph(root);
    if (!prereqEdges) {
      const g = await fetch('data/prereq/graph.json').then((r) => r.json());
      prereqEdges = g.edges;
    }
    if (!programs) {
      programs = await fetch('data/curriculum/index.json').then((r) => r.json());
      programs.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }
    return { graph, prereqEdges, programs };
  }

  // buildProgramGraph, bir bölümün müfredatını node/edge listesine çevirir.
  // Aynı ders (örn. bir seçmeli havuzda da geçen bir zorunlu ders) tekrar
  // düğüm olarak eklenmiyor; kod tekilleştiriliyor.
  function buildProgramGraph(plan) {
    const nodes = [];
    const seen = new Set();
    plan.semesters.forEach((sem, laneIdx) => {
      sem.items.forEach((item, slot) => {
        if (item.course) {
          if (seen.has(item.course.code)) return;
          seen.add(item.course.code);
          nodes.push({
            code: item.course.code, name: item.course.name,
            branch: item.course.code.split(' ')[0], kind: 'course', lane: laneIdx,
          });
        } else if (item.elective) {
          const code = `__elective_${laneIdx}_${slot}`;
          nodes.push({
            code, name: item.elective.title, kind: 'elective',
            lane: laneIdx, options: item.elective.options,
          });
        }
      });
    });

    const codeSet = new Set(nodes.map((n) => n.code));
    const edges = prereqEdges.filter((e) => codeSet.has(e.from) && codeSet.has(e.to));

    // Global önşart grafiğinin ham metnini (requirement) tekil düğümlere
    // eklemek için ayrıca bakmamız gerekiyor — bunu ana sayfa çağırırken
    // birleştiriyoruz (bkz. attachRequirements).
    return { nodes, edges };
  }

  function attachRequirements(nodes, reqByCode) {
    for (const n of nodes) {
      const r = reqByCode.get(n.code);
      if (r) n.requirement = r;
    }
  }

  let reqByCode = null;

  async function selectProgram(root, code) {
    const { graph, prereqEdges } = await ensureData(root);
    root.querySelector('.pg-status').textContent = 'müfredat indiriliyor…';
    const plan = await fetch(`data/curriculum/${code}.json`).then((r) => r.json());

    if (!reqByCode) {
      const g = await fetch('data/prereq/graph.json').then((r) => r.json());
      reqByCode = new Map(g.nodes.filter((n) => n.requirement).map((n) => [n.code, n.requirement]));
    }

    const { nodes, edges } = buildProgramGraph(plan);
    attachRequirements(nodes, reqByCode);

    root.querySelector('.pg-plan-label').textContent = plan.planLabel || '';
    await graph.build(nodes, edges, `${plan.programName} · ${nodes.length} ders/slot`);
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
    sel.addEventListener('change', () => {
      if (sel.value) selectProgram(root, sel.value);
    });
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
