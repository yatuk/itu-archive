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
import { esc, fold, getJSON, termLabel, trNum, looseIncludes } from './core/utils.js?v=dde1e9339338';
import { state } from './core/store.js?v=dde1e9339338';
import { isTaken, TAKEN_CHANGED } from './core/taken.js?v=dde1e9339338';
import { readLocalState, writeLocalState, isPlainObject } from './core/persistence.js?v=dde1e9339338';
import { I18N } from './i18n.js?v=dde1e9339338';
import { courseProgress, readAllGrades, lastGradesProgram, gradeRank } from './core/passed.js?v=dde1e9339338';

  // Düğüm detay paneli (ders önşart ağacı / seçmeli havuz listesi) React'te —
  // akış şemasının kendisi (canvas çizimi, sürükleme, yakınlaştırma) kasten
  // vanilla'da kalıyor (bkz. prereq-detail.tsx başındaki not).
  let prereqModule = null;
  let prereqModulePromise = null;
  function loadPrereqWidget() {
    if (!prereqModulePromise) {
      prereqModulePromise = import('./react/dersler-table.js').then((mod) => {
        prereqModule = mod;
        return mod;
      });
    }
    return prereqModulePromise;
  }

  function prereqDetailLabels() {
    return {
      closeCourseAria: I18N.t('pgDetailCloseAriaLabel'),
      closePoolAria: I18N.t('pgClosePoolAriaLabel'),
      prereqHeading: I18N.t('detailPrereq'),
      noPrereq: I18N.t('pgNoPrereqInProgram'),
      requiredCourses: I18N.t('pgRequiredCourses'),
      requestedBy: I18N.t('pgRequestedBy'),
      sourceVerification: I18N.t('pgSourceVerification'),
      openObsRecord: I18N.t('pgOpenObsRecord'),
      viewCourseDetail: I18N.t('pgViewCourseDetail'),
      electivePool: I18N.t('pgElectivePool'),
      poolSearchPlaceholder: I18N.t('pgPoolSearchPlaceholder'),
      poolSearchAria: I18N.t('pgPoolSearchAriaLabel'),
      sortAria: I18N.t('pgSortAriaLabel'),
      sortByCode: I18N.t('pgSortByCode'),
      sortByName: I18N.t('pgSortByName'),
      sortOpenFirst: I18N.t('pgSortOpenFirst'),
      sortSeatsFirst: I18N.t('pgSortSeatsFirst'),
      alternativesWord: I18N.t('pgAlternativesWord'),
      openThisTermWord: I18N.t('pgOpenThisTermWord'),
      openBadge: I18N.t('pgOpenBadge'),
      branchUnit: I18N.t('prgSube'),
      lastOpenedPrefix: I18N.t('pgLastOpenedPrefix'),
      neverOpened: I18N.t('pgNeverOpened'),
      courseNameUnavailable: I18N.t('pgCourseNameUnavailable'),
      takenMark: I18N.t('pgTakenMark'),
      detailButton: I18N.t('pgDetailButton'),
      openInCourses: I18N.t('pgOpenInCourses'),
    };
  }

  // Canvas renkleri tema token'larından okunur (maket: Onsart.dc.html). Sabit
  // renk yazılmaz; tema değişince canvasColors() taze değer verir.
  let _canvasColors = null;
  function canvasColors() {
    const theme = document.documentElement.dataset.theme || 'dark';
    if (_canvasColors && _canvasColors.theme === theme) return _canvasColors;
    const cs = getComputedStyle(document.documentElement);
    const v = (n, fb) => cs.getPropertyValue(n).trim() || fb;
    const pgRoot = document.getElementById('pg-root');
    const ps = pgRoot ? getComputedStyle(pgRoot) : cs;
    const pv = (n, fb) => ps.getPropertyValue(n).trim() || fb;
    _canvasColors = {
      theme,
      bg: v('--bg', '#f4f6f4'),
      panel: v('--panel', '#fff'),
      panel2: v('--panel-2', '#eef1ee'),
      fg: v('--fg', '#1e2b23'),
      dim: v('--dim', '#45564c'),
      dimmer: v('--dimmer', '#5a6b61'),
      line: v('--line', '#cdd7cf'),
      hot: v('--line-hot', '#73877b'),
      acid: v('--acid', '#805f1a'),
      amber: v('--amber', '#8a5f00'),
      cyan: v('--cyan', '#1f3f6b'),
      // Geçti/kaldı renkleri #pg-root üzerinde tanımlı (temaya göre).
      pass: pv('--pg-pass', '#2f6b45'),
      fail: pv('--pg-fail', '#c2303a'),
      mono: v('--mono', 'ui-monospace, monospace'),
      sans: v('--sans', 'system-ui, sans-serif'),
    };
    return _canvasColors;
  }

  // Dünya koordinatları (maketteki SVG ile aynı ölçek): 112×40 düğüm, 150px
  // dönem sütunu, 56px satır. Kamera bu dünyayı canvas'a ölçekler.
  const NODE_W = 112;
  const NODE_H = 40;
  const LANE_W = 150;
  const ROW_H = 56;
  const TOP = 44;
  const SIDE = 10;
  // Haritanın okunamayacak kadar küçülmesini engelle. Yoğun planlarda
  // düğümlerin taşması kabul edilir; kullanıcı haritayı sürükleyebilir.
  const MIN_ZOOM = 0.55;
  const MAX_ZOOM = 3;

  const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      // Kutu boyu değişince (pencere, detay kartı, görünüm geçişi) bitmap ve
      // kamera tek frame'de birlikte yenilenir; aksi halde CSS bitmap'i sıkıştırır.
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

    // build: node = { code, label, name, kind:'course'|'elective', lane, requirement, options, offPlan }
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

      this.hay = this.nodes.map((n) => fold(`${n.label || ''} ${n.name || ''}`));
      this.focus = null; this.related = null;
      prereqModule?.unmountPrereqDetail();
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      this.statusLabel = statusLabel;
      this.renderStatus();

      this.layout();
      this.resize();
      await this.introAnimate();
      this.draw();
    }

    // Durum satırı: "Program · 48 ders/slot · 13 önşart bağı · odak BLG 223E".
    renderStatus() {
      if (!this.status) return;
      this.status.textContent = this.statusLabel || '';
      if (this.focus && this.byCode?.has(this.focus)) {
        const n = this.byCode.get(this.focus);
        const b = document.createElement('b');
        b.className = 'pg-status-focus';
        b.setAttribute('translate', 'no');
        b.textContent = n.kind === 'elective' ? n.name : (n.label || n.name);
        this.status.append(` · ${I18N.t('pgFocusWord')} `, b);
      }
    }

    // layout, her düğümü kendi dönem sütununa, o sütundaki sırasına göre
    // yukarıdan aşağı dizer (maket: zorunlu dersler üstte, seçmeli slotlar altta).
    layout() {
      // Veri yüklenmeden canvas resize olabilir (ResizeObserver erken tetiklenir);
      // boş graf boş döner — TypeError fırlatılmaz.
      if (!this.nodes || !this.nodes.length) return;
      const byLane = new Map();
      for (const n of this.nodes) {
        if (!byLane.has(n.lane)) byLane.set(n.lane, []);
        byLane.get(n.lane).push(n);
      }
      let maxRows = 1;
      for (const list of byLane.values()) maxRows = Math.max(maxRows, list.length);
      this.contentHeight = TOP + maxRows * ROW_H;
      this.contentWidth = this.laneTitles.length * LANE_W;
      for (const [lane, list] of byLane) {
        list.sort((a, b) => (a.kind === 'elective') - (b.kind === 'elective') || (a.order ?? 0) - (b.order ?? 0));
        list.forEach((n, i) => {
          n.x = lane * LANE_W + SIDE + NODE_W / 2;
          n.y = TOP + i * ROW_H + NODE_H / 2;
        });
      }
    }

    // introAnimate, düğümleri kendi sütunlarına kısa bir süzülmeyle yerleştirir.
    // requestAnimationFrame değil setTimeout: gizli sekmede rAF askıya
    // alınabiliyor. Hareket azaltma tercihinde animasyon atlanır.
    async introAnimate() {
      if (reduceMotion()) return;
      const targets = this.nodes.map((n) => ({ x: n.x, y: n.y }));
      const DUR = 320, start = performance.now();
      let last = start;
      while (true) {
        const now = performance.now();
        const t = Math.min(1, (now - start) / DUR);
        const e = 1 - Math.pow(1 - t, 3); // ease-out
        this.nodes.forEach((n, i) => {
          n.x = targets[i].x - (1 - e) * 24;
          n.y = targets[i].y;
        });
        this.alpha = e;
        this.draw();
        if (t >= 1) break;
        if (performance.now() - last > 16) {
          await new Promise((r) => setTimeout(r, 0));
          last = performance.now();
        }
      }
      this.alpha = 1;
      this.nodes.forEach((n, i) => { n.x = targets[i].x; n.y = targets[i].y; });
    }

    fitToView() {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      // ResizeObserver veri/program seçimi tamamlanmadan çalışabilir.
      if (!this.nodes?.length || !this.laneTitles?.length) {
        this.cam = { x: 0, y: 0, k: 1 };
        return;
      }
      const cw = this.contentWidth + SIDE, ch = this.contentHeight + 12;
      const k = Math.min(w / cw, h / ch, 1.25);
      this.cam.k = Math.max(k, MIN_ZOOM);
      // Sığmıyorsa ilk dönemler görünür kalsın (sola yasla); sığıyorsa ortala.
      this.cam.x = Math.max(0, (w - cw * this.cam.k) / 2);
      this.cam.y = 0;
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      // Gizli sekme ilk kurulurken 0×0 olabilir; görünür olduğunda observer yeni
      // ölçüyü tekrar yollar. Sıfır bitmap yazıp mevcut çizimi bozma.
      if (w < 1 || h < 1) return;
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
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
        ctx.font = `13px ${c.sans}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = c.dim;
        ctx.fillText(I18N.t('pgEmptyStateLine1'), w / 2, h / 2 - 6);
        ctx.font = `11px ${c.sans}`;
        ctx.fillStyle = c.dimmer;
        ctx.fillText(I18N.t('pgEmptyStateLine2'), w / 2, h / 2 + 14);
        return;
      }
      const k = this.cam.k;
      const focused = !!this.related;
      ctx.save();
      ctx.globalAlpha = this.alpha ?? 1;

      // Dönem sütun başlıkları
      ctx.textAlign = 'left';
      ctx.font = `600 ${Math.max(9, 11 * k)}px ${c.sans}`;
      ctx.fillStyle = c.dimmer;
      this.laneTitles.forEach((title, i) => {
        const [x, y] = this.worldToScreen(i * LANE_W + SIDE, 26);
        ctx.fillText(String(title).toLocaleUpperCase(I18N.lang === 'en' ? 'en' : 'tr'), x, y);
      });

      // Kenarlar: önce sönük olanlar, sonra odak zinciri üstte.
      const edgeOn = (e) => focused && this.related.has(e.from.code) && this.related.has(e.to.code);
      const ordered = [...this.edges].sort((a, b) => edgeOn(a) - edgeOn(b));
      for (const e of ordered) {
        const on = edgeOn(e);
        const [x1, y1] = this.worldToScreen(e.from.x + NODE_W / 2, e.from.y);
        const [x2, y2] = this.worldToScreen(e.to.x - NODE_W / 2, e.to.y);
        ctx.globalAlpha = (this.alpha ?? 1) * (on ? 1 : (focused ? 0.18 : 0.5));
        drawEdge(ctx, [x1, y1], [x2, y2], on ? c.acid : c.hot, on ? 2.2 : 1.3, e.alt, k);
      }

      // Düğümler
      const codeFont = `600 ${11.5 * k}px ${c.mono}`;
      const nameFont = `${10.5 * k}px ${c.sans}`;
      const elecFont = `600 ${11 * k}px ${c.sans}`;
      const showText = k > 0.45;
      for (const n of this.nodes) {
        const sel = n.code === this.focus;
        const rel = focused && !sel && this.related.has(n.code);
        const dim = focused && !sel && !rel;
        const [cx, cy] = this.worldToScreen(n.x, n.y);
        const bw = NODE_W * k, bh = NODE_H * k;
        const x = cx - bw / 2, y = cy - bh / 2;
        const nodeAlpha = (this.alpha ?? 1) * (dim ? 0.4 : 1);
        const st = n.progress || '';
        ctx.globalAlpha = nodeAlpha;
        ctx.beginPath();
        roundRect(ctx, x, y, bw, bh, 4 * k);
        ctx.fillStyle = sel ? c.fg : (n.kind === 'elective' ? c.panel2 : c.panel);
        ctx.fill();
        // Geçilen ders: yeşil hafif dolgu + yeşil kenar; alınabilir: solda
        // ince yeşil şerit; kaldı: kırmızı kenar. Seçili düğüm kendi rengini korur.
        if (st === 'passed' && !sel) {
          ctx.globalAlpha = nodeAlpha * 0.14;
          ctx.fillStyle = c.pass;
          ctx.fill();
          ctx.globalAlpha = nodeAlpha;
        }
        if (st === 'eligible' && !sel) {
          ctx.save();
          ctx.clip();
          ctx.fillStyle = c.pass;
          ctx.fillRect(x, y, 3.5 * k, bh);
          ctx.restore();
          ctx.beginPath();
          roundRect(ctx, x, y, bw, bh, 4 * k);
        }
        ctx.lineWidth = rel ? 2 : (st === 'passed' || st === 'failed' ? 1.5 : 1);
        ctx.strokeStyle = sel ? c.fg : rel ? c.acid
          : st === 'passed' ? c.pass : st === 'failed' ? c.fail
          : (n.kind === 'elective' ? c.line : c.hot);
        if (n.nocode && !sel) ctx.setLineDash([3 * k, 3 * k]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (n.code === this.hover && !sel) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = c.cyan;
          ctx.stroke();
        }
        if (showText) {
          ctx.textAlign = 'left';
          if (n.kind === 'elective') {
            ctx.beginPath();
            const dx = x + 14 * k, dy = y + 20 * k, r = 5 * k;
            ctx.moveTo(dx - r, dy); ctx.lineTo(dx, dy - r); ctx.lineTo(dx + r, dy); ctx.lineTo(dx, dy + r); ctx.closePath();
            ctx.strokeStyle = c.acid; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.font = elecFont;
            ctx.fillStyle = sel ? c.bg : c.dim;
            ctx.fillText(fitText(ctx, n.name, (NODE_W - 30) * k), x + 25 * k, y + 24 * k);
          } else {
            ctx.font = codeFont;
            ctx.fillStyle = sel ? c.bg : c.fg;
            ctx.fillText(n.label || '·', x + 8 * k, y + 17 * k);
            ctx.font = nameFont;
            ctx.fillStyle = sel ? c.bg : c.dim;
            ctx.fillText(fitText(ctx, n.name || '', (NODE_W - 14) * k), x + 8 * k, y + 31 * k);
          }
        }
        // Geçilen ders: sağ üst köşede onay işareti (renk körlüğüne karşı
        // yalnız renge dayanmasın). Kaldı: küçük çarpı.
        if ((st === 'passed' || st === 'failed') && showText) {
          const mx = x + bw - 10 * k, my = y + 9 * k, r = 3.4 * k;
          ctx.beginPath();
          if (st === 'passed') {
            ctx.moveTo(mx - r, my); ctx.lineTo(mx - r * 0.25, my + r * 0.8); ctx.lineTo(mx + r, my - r * 0.8);
          } else {
            ctx.moveTo(mx - r * 0.8, my - r * 0.8); ctx.lineTo(mx + r * 0.8, my + r * 0.8);
            ctx.moveTo(mx + r * 0.8, my - r * 0.8); ctx.lineTo(mx - r * 0.8, my + r * 0.8);
          }
          ctx.lineWidth = Math.max(1.4, 1.8 * k);
          ctx.lineCap = 'round';
          ctx.strokeStyle = sel ? c.bg : (st === 'passed' ? c.pass : c.fail);
          ctx.stroke();
          ctx.lineCap = 'butt';
        }
        // Önşartı bu planda olmayan bir koda bağlı ders: köşede amber nokta.
        // Geçilen/kaldığın derste bu uyarı gereksiz (yerini işaret alır).
        if (n.offPlan && st !== 'passed' && st !== 'failed') {
          ctx.beginPath();
          ctx.arc(x + 103 * k, y + 9 * k, 3.5 * k, 0, Math.PI * 2);
          ctx.fillStyle = c.amber;
          ctx.fill();
        }
      }
      ctx.restore();
    }

    nodeAt(px, py) {
      const [wx, wy] = this.screenToWorld(px, py);
      for (const n of this.nodes) {
        if (Math.abs(wx - n.x) <= NODE_W / 2 && Math.abs(wy - n.y) <= NODE_H / 2) return n;
      }
      return null;
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
      this.renderStatus();
      this.renderDetail(code);
      this.draw();
      this.queueResize();
      markListFocus(this.root, code);
      // Seçmeli slot paylaşılabilir URL durumu: ?prog=X&pool=<title>#onsart.
      const n = this.byCode.get(code);
      const prog = document.querySelector('.pg-program-select')?.value;
      if (prog && n && n.kind === 'elective') history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}&pool=${encodeURIComponent(n.name)}#onsart`);
      else if (prog) history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}#onsart`);
    }

    clearFocus() {
      this.focus = null;
      this.related = null;
      prereqModule?.unmountPrereqDetail();
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      const prog = this.root.querySelector('.pg-program-select')?.value;
      if (prog) history.replaceState(null, '', `?prog=${encodeURIComponent(prog)}#onsart`);
      this.renderStatus();
      markListFocus(this.root, null);
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
      prereqModule?.unmountPrereqDetail();
      this.detail.innerHTML = '';
      this.root.classList.remove('pg-has-detail');
      const reset = this.root.querySelector('.pg-reset');
      if (reset) reset.disabled = true;
      this.statusLabel = I18N.t('pgSelectProgramPrompt');
      this.renderStatus();
      const warn = this.root.querySelector('.pg-warnbox');
      if (warn) warn.hidden = true;
      const list = this.root.querySelector('.pg-semester-list');
      if (list) list.innerHTML = '';
      this.draw();
      this.queueResize();
    }

    panTo(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      this.focusNode(code);
    }

    // Ders detayı (maket: üç sütunlu kart) — vanilla HTML, esc'li. Seçmeli havuz
    // paneli React'te kalır (renderPool).
    async renderDetail(code) {
      const n = this.byCode.get(code);
      if (!n) return;
      if (n.kind === 'elective') { this.renderPool(n); return; }
      prereqModule?.unmountPrereqDetail();
      lastPoolNode = null;
      const en = I18N.lang === 'en';
      const semNo = n.lane + 1;
      const inPlan = (c) => this.byCode.has(c);
      const laneOf = (c) => (this.byCode.get(c)?.lane ?? -1) + 1;
      const tree = n.requirement ? parseReq(n.requirement) : null;
      const groups = reqGroups(tree);
      const dep = (this.byFrom.get(code) || []).slice()
        .sort((a, b) => laneOf(a) - laneOf(b) || a.localeCompare(b));
      const allDependents = n.nocode ? 0 : new Set((reqByCode?.edges || []).filter((e) => e.from === code).map((e) => e.to)).size;
      const sources = this.edges.filter((e) => e.to.code === code && e.sourceUrl);
      const source = sources[0] || (reqByCode?.edges || []).find((e) => e.to === code && e.sourceUrl);
      const fmtNum = (v) => trNum(v ?? 0);

      const facts = [];
      if (n.credits != null) facts.push(`<span><span class="num">${esc(fmtNum(n.credits))}</span> ${esc(I18N.t('planCreditsFull'))}</span>`);
      if (n.ects != null) facts.push(`<span><span class="num">${esc(fmtNum(n.ects))}</span> ${esc(I18N.t('planEctsAbbr'))}</span>`);
      if (n.type) facts.push(`<span>${esc(I18N.t('pgTypeWord'))} <span class="num">${esc(n.type)}</span></span>`);

      const groupHtml = groups.length ? groups.map((g) => {
        const grades = [...new Set(g.alts.flat().map((leaf) => minGrade(leaf.detail)).filter(Boolean))];
        const head = [g.alts.length > 1 ? I18N.t('pgOrOneEnoughShort') : I18N.t('pgRequiredShort')];
        if (grades.length === 1) head.push(tf('pgMinGrade', { grade: grades[0] }));
        const rows = mergeAlts(g.alts).map((alt) => {
          const codes = alt.codes;
          const hit = codes.find(inPlan);
          const taken = codes.some((c) => isTaken(c));
          const note = hit ? tf('pgInThisPlan', { n: laneOf(hit) }) : I18N.t('pgOtherProgram');
          const label = alt.text || codes.join(' / ');
          const btn = hit
            ? `<button type="button" class="pg-alt-code num" data-pan="${esc(hit)}" translate="no">${esc(label)}</button>`
            : `<span class="num" translate="no">${esc(label)}</span>`;
          return `<li class="pg-alt${hit ? ' in' : ''}">${btn}<small>${esc(note)}${taken ? ` · ${esc(I18N.t('pgTakenMark'))}` : ''}</small></li>`;
        }).join('');
        return `<div class="pg-req-group"><div class="pg-or">${esc(head.join(' · '))}</div><ul class="pg-alts">${rows}</ul></div>`;
      }).join('') : `<p class="pg-empty">${esc(I18N.t('pgNoPrereqInProgram'))}</p>`;

      const depHtml = dep.map((c) => {
        const d = this.byCode.get(c);
        return `<li><button type="button" class="pg-dep" data-pan="${esc(c)}"><span><span class="num" translate="no">${esc(d.label || c)}</span> ${esc(d.name || '')}</span><span class="num pg-dep-sem">${laneOf(c)}.</span></button></li>`;
      }).join('');

      this.detail.innerHTML = `<div class="pg-det">
        <div class="pg-det-col pg-det-main">
          <div class="pg-det-top"><span class="pg-k">${esc(tf('pgFocusedCourse', { n: semNo }))}</span>
            <button type="button" class="pg-detail-close" aria-label="${esc(I18N.t('pgDetailCloseAriaLabel'))}">×</button></div>
          <h3><span class="num" translate="no">${esc(n.label || '·')}</span> ${esc(n.name || I18N.t('pgCourseNameUnavailable'))}</h3>
          ${facts.length ? `<div class="pg-facts">${facts.join('')}</div>` : ''}
          <p class="pg-term-line">${n.nocode ? esc(I18N.t('dpNoCodeInPlan')) : esc(I18N.t('statLoading'))}</p>
          ${n.nocode ? '' : `<div class="pg-det-actions">
            <button type="button" class="btn-ghost pg-btn-sm" data-goto-courses="${esc(code)}">${esc(I18N.t('pgOpenInCoursesBtn'))}</button>
            <button type="button" class="btn-ghost pg-btn-sm" data-course-detail="${esc(code)}">${esc(I18N.t('pgCourseDetailBtn'))}</button>
          </div>`}
        </div>
        <div class="pg-det-col">
          <h4>${esc(I18N.t('pgRequiredCourses'))}</h4>
          ${groupHtml}
          ${tree ? `<details class="pg-raw-req"><summary>${esc(I18N.t('pgFullExpression'))}</summary><ul class="req-tree">${renderReqTree(tree)}</ul></details>` : ''}
        </div>
        <div class="pg-det-col">
          <h4>${esc(I18N.t('pgRequestedBy'))}</h4>
          ${dep.length ? `<ul class="pg-deps">${depHtml}</ul>` : `<p class="pg-empty">${esc(I18N.t('pgNoDependentsInPlan'))}</p>`}
          ${allDependents > dep.length ? `<p class="pg-all-deps">${esc(tf('pgAllProgramsCount', { n: allDependents }))}</p>` : ''}
          ${source ? `<div class="pg-src"><span class="pg-ok">${source.status === 'verified' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>' : ''}${esc(source.status === 'verified' ? I18N.t('pgObsVerified') : I18N.t('pgSourceRecord'))}${source.verifiedAt ? ` · ${esc(new Date(source.verifiedAt).toLocaleDateString(en ? 'en-GB' : 'tr-TR'))}` : ''}</span><a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener">${esc(I18N.t('pgOpenObsRecord'))}</a></div>` : ''}
        </div>
      </div>`;
      this.detail.querySelector('.pg-detail-close')?.addEventListener('click', () => this.clearFocus());
      this.detail.querySelectorAll('[data-pan]').forEach((b) => b.addEventListener('click', () => this.panTo(b.dataset.pan)));
      this.detail.querySelector('[data-goto-courses]')?.addEventListener('click', (ev) =>
        window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: ev.currentTarget.dataset.gotoCourses })));
      this.detail.querySelector('[data-course-detail]')?.addEventListener('click', (ev) =>
        window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code: ev.currentTarget.dataset.courseDetail, source: 'onsart' } })));
      if (!n.nocode) this.fillTermLine(n);
    }

    // "Bu dönem 2 şube · 32 yer · 1 şube dolu" — aktif dönem branş dosyasından.
    async fillTermLine(n) {
      const code = n.code;
      const secs = ((await activeSections(code.split(' ')[0])) || []).filter((s) => s.code === code);
      if (this.focus !== code) return;
      const line = this.detail.querySelector('.pg-term-line');
      if (!line) return;
      if (!secs.length) {
        const last = await lastOpenedTerm(code);
        if (this.focus !== code) return;
        line.textContent = last ? tf('pgNotOpenLast', { term: termLabel(last) }) : I18N.t('planNotOpenThisTerm');
        return;
      }
      const free = secs.reduce((a, s) => a + Math.max(0, (Number(s.capacity) || 0) - (Number(s.enrolled) || 0)), 0);
      const full = secs.filter((s) => Number(s.capacity) > 0 && Number(s.enrolled) >= Number(s.capacity)).length;
      line.textContent = tf('pgTermSections', { n: secs.length, free: trNum(free) });
      if (full) {
        line.append(' · ');
        const f = document.createElement('span');
        f.className = 'pg-full';
        f.textContent = tf('pgFullSections', { n: full });
        line.appendChild(f);
      }
    }

    // Seçmeli slotun alternatiflerini aranabilir, branş gruplu, canlı dönem
    // durumlu bir listeye döker. Veri çekme paralel + önbellekli; liste ilk
    // anda iskeletle gelir, durumlar geldikçe dolar (her aşamada React'i
    // yeniden monte ederek). Kullanıcı başka düğüme geçerse eski yükleme
    // kendini iptal eder (version + focus guard).
    async renderPool(n) {
      lastPoolNode = n; // TAKEN_CHANGED'te yeniden çizmek için (Faz D)
      const opts = (n.options || []).slice();
      const version = (this.poolVersion = (this.poolVersion || 0) + 1);
      const fresh = () => this.poolVersion === version && this.focus === n.code;
      const mod = await loadPrereqWidget();
      if (!fresh()) return;
      // Ders kartından havuza geçerken vanilla içerik React kökünden önce temizlenir.
      if (!this.detail.querySelector('.pg-detail-head')) {
        mod.unmountPrereqDetail();
        this.detail.innerHTML = '';
      }
      const labels = prereqDetailLabels();
      const status = {};
      const render = () => {
        if (!fresh()) return;
        mod.mountPrereqDetail(this.detail, {
          data: {
            kind: 'pool',
            name: n.name,
            options: opts.map((o) => ({ code: o.code, name: o.name })),
            status: { ...status },
            taken: opts.filter((o) => isTaken(o.code)).map((o) => o.code),
          },
          labels,
          onClose: () => this.clearFocus(),
          onPanTo: () => {},
          onOpenCourseDetail: (code) => window.dispatchEvent(new CustomEvent('itu:course-detail', { detail: { code } })),
          onOpenInCourses: (code) => window.dispatchEvent(new CustomEvent('itu:goto-courses', { detail: code })),
        });
      };
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
          status[o.code] = {
            open: mine.length > 0,
            sectionsCount: mine.length,
            enr: mine.reduce((a, s) => a + (Number(s.enrolled) || 0), 0),
            cap: mine.reduce((a, s) => a + (Number(s.capacity) || 0), 0),
          };
        }
        render();
      }));
      if (!fresh()) return;

      // Kapalı olanların geçmişteki son açılışını getir (branş başına bir istek).
      const closed = opts.filter((o) => status[o.code] && !status[o.code].open);
      await Promise.all(closed.map(async (o) => {
        const last = await lastOpenedTerm(o.code);
        const st = status[o.code];
        if (st && !st.open) st.last = last ? termLabel(last) : null;
      }));
      render();
    }

    search(q) {
      const f = fold(q.trim());
      if (f.length < 2 || !this.nodes) return [];
      const out = [];
      for (let i = 0; i < this.nodes.length && out.length < 30; i++) {
        if (looseIncludes(this.hay[i], f)) out.push(this.nodes[i]);
      }
      return out;
    }

    bindInput() {
      const c = this.canvas;
      // Klavye erişimi (Faz 5.4): canvas odaklanabilir; ok tuşları odaklanan
      // düğümü ekrandaki konuma göre yönlendirir.
      c.tabIndex = 0;
      c.setAttribute('aria-label', I18N.t('pgCanvasKeyboardAriaLabel'));
      c.addEventListener('keydown', (e) => {
        if (!this.nodes) return;
        if (!e.key.startsWith('Arrow')) return;
        e.preventDefault();
        const cur = this.focus && this.byCode.get(this.focus);
        if (!cur) { this.focusNode(this.nodes[0].code); return; }
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
        c.style.cursor = n ? 'pointer' : '';
        if (n) {
          this.tip.hidden = false;
          this.tip.style.left = (e.clientX - rect.left + 14) + 'px';
          this.tip.style.top = (e.clientY - rect.top + 10) + 'px';
          this.tip.textContent = n.kind === 'elective'
            ? `${n.name} · ${(n.options || []).length} ${I18N.t('pgOptionsWord')}`
            : (n.name ? `${n.label || '·'}: ${n.name}` : n.label);
        } else {
          this.tip.hidden = true;
        }
      });
      c.addEventListener('mouseleave', () => {
        this.tip.hidden = true;
        if (this.hover) { this.hover = null; this.draw(); }
      });
    }
  }

  // drawEdge, iki sütun arasında yumuşak bir eğri çizer ve hedefe küçük bir
  // ok ucu ekler — önşart ilişkisinin yönü (A, B'nin önşartıysa A→B) her
  // zaman görünsün diye. dash=true ise "alternatif" (VEYA) kenarı çizilir.
  function drawEdge(ctx, [x1, y1], [x2, y2], color, width, dash, k = 1) {
    const ah = 6 * Math.max(0.7, k);
    const ex = x2 - ah * 0.8;
    const midX = (x1 + ex) / 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(midX, y1, midX, y2, ex, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ah, y2 - ah * 0.55);
    ctx.lineTo(x2 - ah, y2 + ah * 0.55);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Metni verilen genişliğe sığdırır; taşarsa "…" ile keser.
  function fitText(ctx, s, max) {
    s = String(s || '');
    if (ctx.measureText(s).width <= max) return s;
    let lo = 0, hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (ctx.measureText(s.slice(0, mid) + '…').width <= max) lo = mid; else hi = mid - 1;
    }
    return s.slice(0, lo).trimEnd() + '…';
  }

  // Basit {placeholder} yer değiştirmeli çeviri.
  function tf(key, vars) {
    let s = I18N.t(key);
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  }

  function minGrade(detail) {
    const m = String(detail || '').match(/MIN\.?\s*([A-Z]{2})/i);
    return m ? m[1].toUpperCase() : '';
  }

  // Liste görünümünde odaktaki dersi işaretler (maket: .li.cur).
  function markListFocus(root, code) {
    root.querySelectorAll('.pg-li.cur').forEach((el) => el.classList.remove('cur'));
    if (!code) return;
    root.querySelectorAll('.pg-li[data-code]').forEach((el) => {
      if (el.dataset.code === code) el.classList.add('cur');
    });
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

  // reqGroups, ağacı "hepsi gerekli" gruplara böler; her grubun alternatifleri
  // (biri yeterli) vardır. Her alternatif bir kod yaprakları dizisidir (VE ile
  // bağlı birden çok kod tek alternatif sayılır). Saf — test edilebilir.
  export function reqGroups(tree) {
    if (!tree) return [];
    const leaves = (n, out = []) => {
      if (n.type === 'code' || n.type === 'text') out.push(n);
      else if (n.items) n.items.forEach((it) => leaves(it, out));
      return out;
    };
    const altsOf = (n) => {
      if (n.type === 'code' || n.type === 'text') return [[n]];
      if (n.type === 'or') return n.items.flatMap(altsOf);
      return [leaves(n)];
    };
    const items = tree.type === 'and' ? tree.items : [tree];
    return items.map((it) => ({ alts: altsOf(it) }));
  }

  // mergeAlts, tek kodlu alternatifleri ortak kökte birleştirir:
  // "BLG 102" ve "BLG 102E" → "BLG 102 / BLG 102E".
  export function mergeAlts(alts) {
    const out = [];
    const byBase = new Map();
    for (const alt of alts) {
      const codes = alt.filter((l) => l.type === 'code').map((l) => l.code);
      const texts = alt.filter((l) => l.type === 'text').map((l) => l.raw);
      if (codes.length === 1 && !texts.length) {
        const base = codes[0].replace(/(\d{3})[A-Z]*$/, '$1');
        if (byBase.has(base)) { const row = byBase.get(base); if (!row.codes.includes(codes[0])) row.codes.push(codes[0]); continue; }
        const row = { codes: [codes[0]] };
        byBase.set(base, row);
        out.push(row);
      } else {
        const joiner = ` ${I18N.t('pgAndWord')} `;
        out.push({ codes, text: [...codes, ...texts].join(joiner) });
      }
    }
    return out;
  }

  // summarizeReq, liste görünümü için kısa önşart özeti üretir ve bu planda
  // hiçbir alternatifi olmayan grubu "planda yok" (offPlan) işaretler.
  export function summarizeReq(tree, inPlan) {
    const groups = reqGroups(tree);
    const offCodes = [];
    const parts = groups.map((g) => {
      const fmt = (alt) => alt.map((l) => l.code || l.raw).join(` ${I18N.t('pgAndWord')} `);
      const hits = g.alts.filter((alt) => alt.length && alt.every((l) => l.type === 'code' && inPlan.has(l.code)));
      if (hits.length) return hits.slice(0, 2).map(fmt).join(` ${I18N.t('pgOrWord')} `);
      const first = g.alts[0] || [];
      offCodes.push(fmt(first));
      return fmt(first);
    });
    return { text: parts.join(` ${I18N.t('pgAndWord')} `), offPlan: offCodes.length > 0, offCodes };
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
    const label = tree.type === 'or' ? I18N.t('pgOrOneEnough') : I18N.t('pgAndAllRequired');
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

  // reqSatisfied, önşart ağacının geçilen derslerle (kod → en iyi not)
  // sağlanıp sağlanmadığını söyler. VE=hepsi, VEYA=biri; "MIN. CC" gibi asgari
  // not koşulu da aranır. Metin yaprakları (kod olmayan koşullar) bilinemediği
  // için sağlanmamış sayılır — "alınabilir" iddiası temkinli kalsın. Saf.
  export function reqSatisfied(tree, best) {
    if (!tree) return true;
    if (tree.type === 'code') {
      const g = best && best.get(tree.code);
      if (!g) return false;
      const min = minGrade(tree.detail);
      return !min || gradeRank(g) >= gradeRank(min);
    }
    if (tree.type === 'text') return false;
    const items = tree.items || [];
    return tree.type === 'or' ? items.some((it) => reqSatisfied(it, best)) : items.every((it) => reqSatisfied(it, best));
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
      // Müfredat'ta not değişti: geçti/alınabilir boyaması tazelenir.
      if (graph && graph.nodes) applyProgress(graph.root);
    });
    // Başka bir sekmede not girildiyse (aynı tarayıcı) da tazele.
    window.addEventListener('storage', (ev) => {
      if (graph && graph.nodes && (!ev.key || ev.key.startsWith('itu-grades'))) applyProgress(graph.root);
    });
  }
  // "Müfredat ve GPA"da en son açılan program — haritanın kendi başına
  // seçtiği/kullanıcının seçtiği programla karşılaştırmak için hatırlanır.
  let seenGradesProgram = '';
  let programs = null;
  let reqByCode = null;
  // Seviye filtresi: varsayılan yalnızca lisans. Kullanıcı değiştirirse bu
  // Set üzerinden seçici yeniden kurulur.
  let activeLevels = new Set(['LS']);
  let prereqPreference = {};

  function savePrereqPreference(root) {
    const program = root.querySelector('.pg-program-select')?.value || '';
    const list = root.classList.contains('pg-list-mode') || root.classList.contains('pg-mobile-full');
    // mufredat: bu tercih kaydedildiğinde "Müfredat ve GPA"da açık olan program.
    // Orada sonradan başka bir program seçilirse harita o programa geçer.
    prereqPreference = { program, levels: [...activeLevels], view: list ? 'list' : 'graph', mufredat: seenGradesProgram };
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
  const LEVEL_KEY = { OL: 'levelAssociate', LS: 'levelBachelor', YL: 'levelMaster', DR: 'levelDoctorate' };
  const LEVEL_ORDER = ['OL', 'LS', 'YL', 'DR'];
  const levelLabel = (lv) => I18N.t(LEVEL_KEY[lv] || 'levelBachelor');

  async function ensureData(root) {
    if (!graph) graph = new PlanGraph(root);
    if (!programs) {
      programs = await fetch('data/curriculum/index.json').then((r) => r.json());
      programs.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }
    return { graph, programs };
  }

  // laneTitle, müfredat verisindeki "N. Yarıyıl" başlığını görüntü diline çevirir:
  // TR'de "N. Dönem", EN'de "Term N". Başında sayı yoksa (beklenmeyen veri) ham
  // başlık aynen döner.
  function laneTitle(title) {
    const m = String(title || '').match(/^(\d+)/);
    if (!m) return String(title || '');
    const word = I18N.t('pgTermWord');
    return I18N.lang === 'en' ? `${word} ${m[1]}` : `${m[1]}. ${word}`;
  }

  function buildProgramGraph(plan, prereqEdges, reqMap) {
    const nodes = [];
    const seen = new Set();
    const laneTitles = plan.semesters.map((s) => laneTitle(s.title));
    plan.semesters.forEach((sem, laneIdx) => {
      sem.items.forEach((item, slot) => {
        if (item.course) {
          const c = item.course;
          const facts = { credits: c.credits, ects: c.ects, type: c.type || '', order: slot };
          if (!c.code) {
            // OBS planında kodu olmayan kalem (ör. laboratuvar): kesikli düğüm.
            nodes.push({ code: `__nocode_${laneIdx}_${slot}`, label: '', nocode: true, name: c.name, kind: 'course', lane: laneIdx, ...facts });
            return;
          }
          if (seen.has(c.code)) return;
          seen.add(c.code);
          nodes.push({ code: c.code, label: c.code, name: c.name, branch: c.code.split(' ')[0], kind: 'course', lane: laneIdx, ...facts });
        } else if (item.elective) {
          nodes.push({ code: `__elective_${laneIdx}_${slot}`, name: item.elective.title, kind: 'elective', lane: laneIdx, options: item.elective.options, order: slot });
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
    // Önşart özeti ve "planda olmayan koda bağlı" işareti (amber nokta).
    for (const n of nodes) {
      const r = reqMap && reqMap.get(n.code);
      if (!r) continue;
      n.requirement = r;
      const sum = summarizeReq(parseReq(r), codeSet);
      n.reqSummary = sum.text;
      n.offPlan = sum.offPlan;
      n.offCodes = sum.offCodes;
    }
    const edges = prereqEdges
      .filter((e) => codeSet.has(e.from) && codeSet.has(e.to))
      .map((e) => ({ ...e, alt: altsByTarget.get(e.to) ? altsByTarget.get(e.to).has(e.from) : false }));
    return { nodes, edges, laneTitles };
  }

  // ---- Müfredat ve GPA notlarına göre ilerleme ----
  // Düğümlere n.progress yazar: 'passed' | 'failed' | 'eligible' | ''.
  // Liste görünümü ve mobil gezgindeki satırlar da aynı durumu sınıfla taşır;
  // lejant yalnızca kullanıcının not verisi varsa görünür.
  let lastProgress = null;
  function applyProgress(root) {
    if (!root) return;
    const prog = root.querySelector('.pg-program-select')?.value || '';
    const p = courseProgress(readAllGrades(), prog);
    lastProgress = p;
    const counts = { passed: 0, failed: 0, eligible: 0 };
    const byCode = new Map();
    for (const n of graph?.nodes || []) {
      let st = '';
      if (n.kind === 'course' && !n.nocode) {
        st = p.status.get(n.code) || '';
        if (!st && n.requirement && reqSatisfied(parseReq(n.requirement), p.best)) st = 'eligible';
      } else if (n.kind === 'elective') {
        const m = /^__elective_(\d+)_(\d+)$/.exec(n.code);
        st = (m && p.slots.get(`s${m[1]}i${m[2]}`)) || '';
      }
      n.progress = st;
      if (st) counts[st]++;
      byCode.set(n.code, st);
    }
    root.dataset.passed = String(counts.passed);
    decorateProgress(root, byCode);
    const legend = root.querySelector('.pg-guide > div');
    if (legend) {
      const show = (cls, on, text) => {
        const el = legend.querySelector(cls);
        if (!el) return;
        el.hidden = !on;
        const label = el.querySelector('[data-pg-count]');
        if (label && text) label.textContent = text;
      };
      show('.pg-lg-passed', p.any, tf('pgLegendPassed', { n: counts.passed }));
      show('.pg-lg-eligible', p.any && counts.eligible > 0, '');
      show('.pg-lg-failed', counts.failed > 0, '');
    }
    if (graph && graph.nodes) graph.draw();
  }

  const STATE_CLASSES = ['is-passed', 'is-failed', 'is-eligible'];
  const STATE_LABEL = { passed: 'pgStatePassed', failed: 'pgStateFailed', eligible: 'pgStateEligible' };
  function decorateProgress(root, byCode) {
    const map = byCode || new Map((graph?.nodes || []).map((n) => [n.code, n.progress || '']));
    root.querySelectorAll('.pg-li[data-code], .pg-mobile-course[data-focus-code], .pg-mobile-course[data-pool-code]').forEach((el) => {
      const code = el.dataset.code || el.dataset.focusCode || el.dataset.poolCode;
      const st = map.get(code) || '';
      el.classList.remove(...STATE_CLASSES);
      el.querySelector('.pg-state-tag')?.remove();
      if (!st) return;
      el.classList.add(`is-${st}`);
      const tag = document.createElement('small');
      tag.className = 'pg-state-tag';
      tag.textContent = I18N.t(STATE_LABEL[st]);
      const host = el.querySelector('.pg-li-name, span') || el;
      host.appendChild(tag);
    });
  }

  async function selectProgram(root, code) {
    const { graph } = await ensureData(root);
    const statusEl = root.querySelector('.pg-status');
    statusEl.textContent = I18N.t('pgLoadingCurriculum');
    statusEl.classList.add('busy');
    const [plan, g] = await Promise.all([
      fetch(`data/curriculum/${code}.json`).then((r) => r.json()),
      reqByCode ? Promise.resolve(null) : fetch('data/prereq/graph.json').then((r) => r.json()),
    ]);
    if (g) {
      reqByCode = { edges: g.edges, req: new Map(g.nodes.filter((n) => n.requirement).map((n) => [n.code, n.requirement])) };
    }

    const { nodes, edges, laneTitles } = buildProgramGraph(plan, reqByCode.edges, reqByCode.req);

    root.querySelector('.pg-plan-label').textContent = plan.planLabel || '';
    renderSemesterList(root, plan, nodes, graph);
    renderWarnBox(root, nodes);
    const status = [plan.programName, `${nodes.length} ${I18N.t('pgCourseSlotWord')}`, tf('pgEdgeCount', { n: edges.length })].join(' · ');
    await graph.build(nodes, edges, laneTitles, status);
    renderMobileExplorer(root, plan, graph);
    applyProgress(root);
    statusEl.classList.remove('busy');
  }

  // Planda olmayan koda bağlı önşartları özetleyen amber not (maket: .warnbox).
  function renderWarnBox(root, nodes) {
    const box = root.querySelector('.pg-warnbox');
    if (!box) return;
    const off = nodes.filter((n) => n.offPlan);
    if (!off.length) { box.hidden = true; box.innerHTML = ''; return; }
    const examples = off.slice(0, 2).map((n) => tf('pgWarnExample', { course: n.label, req: (n.offCodes || [])[0] || '' }));
    box.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
      <span><b>${esc(tf('pgWarnCount', { n: off.length }))}</b> ${esc(tf('pgWarnBody', { examples: examples.join(', ') }))}</span>`;
    box.hidden = false;
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
            if (it.course) return it.course.code ? courseButton(it.course.code) : '';
            if (it.elective) {
              const node = [...byCode.values()].find((n) => n.kind === 'elective' && n.name === it.elective.title);
              return node ? `<button type="button" class="pg-mobile-course elective" data-pool-code="${esc(node.code)}"><span><b>${txt('Seçmeli havuz', 'Elective pool')}</b><small>${it.elective.options?.length || 0} ${txt('seçenek', 'options')}</small></span><em>${esc(it.elective.title)}</em><i aria-hidden="true">›</i></button>` : '';
            }
            return '';
          }).join('');
          return items ? `<details class="pg-mobile-semester" ${semIndex === 0 ? 'open' : ''}><summary>${esc(laneTitle(sem.title))}<span>${(sem.items || []).length} ${txt('ders/slot', 'courses/slots')}</span></summary>${items}</details>` : '';
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
      decorateProgress(box);
    };
    box.hidden = false;
    renderIndex();
  }

  // Liste görünümü (maket: dönem kartları): her ders kodu, adı ve önşart özeti;
  // planda olmayan koda bağlı önşart amber. Harita modunda sr-only kalır —
  // ekran okuyucu için grafiğin metin karşılığıdır. Satırlar odak düğmesidir.
  function renderSemesterList(root, plan, nodes, currentGraph) {
    const box = root.querySelector('.pg-semester-list');
    if (!box) return;
    const byLane = new Map();
    for (const n of nodes) {
      if (!byLane.has(n.lane)) byLane.set(n.lane, []);
      byLane.get(n.lane).push(n);
    }
    box.innerHTML = (plan.semesters || []).map((sem, lane) => {
      const list = (byLane.get(lane) || []).slice()
        .sort((a, b) => (a.kind === 'elective') - (b.kind === 'elective') || (a.order ?? 0) - (b.order ?? 0));
      if (!list.length) return '';
      const items = list.map((n) => {
        let pre, cls = '';
        if (n.kind === 'elective') pre = tf('pgListElective', { n: (n.options || []).length });
        else if (n.reqSummary) {
          pre = `${I18N.t('pgListPrereq')} ${n.reqSummary}${n.offPlan ? ` (${I18N.t('pgNotInPlan')})` : ''}`;
          if (n.offPlan) cls = ' w';
        } else pre = I18N.t('pgListNoPrereq');
        const title = n.kind === 'elective'
          ? `<span class="pg-li-name">${esc(n.name)}</span>`
          : `<span class="pg-li-name">${n.label ? `<span class="pg-li-code num" translate="no">${esc(n.label)}</span> ` : ''}${esc(n.name || '')}</span>`;
        return `<li><button type="button" class="pg-li" data-code="${esc(n.code)}">${title}<small class="pg-li-pre${cls}">${esc(pre)}</small></button></li>`;
      }).join('');
      return `<li class="pg-lsem"><h3>${esc(laneTitle(sem.title))}</h3><ul>${items}</ul></li>`;
    }).filter(Boolean).join('');
    box.querySelectorAll('.pg-li').forEach((b) => b.addEventListener('click', () => currentGraph.focusNode(b.dataset.code)));
  }

  // Harita / Liste geçişi. Masaüstünde iki düğmeli segment (.pg-map-toggle,
  // .pg-list-toggle); .pg-list-toggle ayrıca tek başına aç/kapa olarak çalışır.
  // Telefonda (≤700px) liste yerine odak gezgini vardır; aynı düğme tam
  // haritayı açıp kapatır.
  function initListToggle(root) {
    const btn = root.querySelector('.pg-list-toggle');
    const mapBtn = root.querySelector('.pg-map-toggle');
    const box = root.querySelector('.pg-semester-list');
    if (!btn || !box) return;
    const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
    const apply = (on) => {
      const mobile = isMobile();
      if (mobile) root.classList.toggle('pg-mobile-full', on);
      else {
        root.classList.toggle('pg-list-mode', on);
        box.classList.toggle('sr-only', !on);
      }
      btn.textContent = mobile ? I18N.t(on ? 'pgFocusView' : 'pgFullGraph') : I18N.t('pgListShort');
      btn.setAttribute('aria-pressed', String(on));
      if (mapBtn) mapBtn.setAttribute('aria-pressed', String(!on));
      if (!on && graph) graph.queueResize();
    };
    const current = () => root.classList.contains(isMobile() ? 'pg-mobile-full' : 'pg-list-mode');
    btn.addEventListener('click', () => { apply(!current()); savePrereqPreference(root); });
    mapBtn?.addEventListener('click', () => { if (current()) { apply(false); savePrereqPreference(root); } });
    apply(prereqPreference.view === 'list');
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
      `<button type="button" class="pg-level${activeLevels.has(lv) ? ' active' : ''}" data-level="${lv}" aria-pressed="${activeLevels.has(lv)}">${esc(levelLabel(lv))}</button>`).join('');
  }

  // Önce fakülte, sonra bölüm: tek uzun gruplu liste yerine iki adım.
  // Her iki liste de yalnızca aktif seviyedeki programları gösterir.

  function visibleProgs() {
    return programs.filter((p) => activeLevels.has(p.level || 'LS'));
  }

  // Seçili fakülteyi korur; o fakülte artık görünmüyorsa ilkine düşer.
  function renderFacultyPicker(root) {
    const sel = root.querySelector('.pg-faculty-select');
    const facs = [...new Set(visibleProgs().map((p) => p.faculty || I18N.t('planOtherFaculty')))]
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
    const ps = visibleProgs().filter((p) => (p.faculty || I18N.t('planOtherFaculty')) === faculty);
    const lvlAdi = (p) => LEVEL_KEY[p.level] ? I18N.t(LEVEL_KEY[p.level]) : (p.level || I18N.t('levelBachelor'));
    const html = `<option value="">${esc(I18N.t('pgSelectDepartmentPlaceholder'))}</option>` +
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

  // Programı seçicide açar: gerekirse seviyesini filtreye ekler, fakültesini
  // seçer. Seçicide bulunduysa true.
  function openProgramInPicker(root, code) {
    const hedef = programs.find((p) => p.code === code);
    if (!hedef) return false;
    const lv = hedef.level || 'LS';
    if (!activeLevels.has(lv)) {
      activeLevels.add(lv);
      const box = root.querySelector('.pg-levels');
      if (box) renderLevelFilter(box);
    }
    const facSel = root.querySelector('.pg-faculty-select');
    const fac = hedef.faculty || I18N.t('planOtherFaculty');
    renderProgramPicker(root);
    if ([...facSel.options].some((o) => o.value === fac)) {
      facSel.value = fac;
      renderProgramPicker(root);
    }
    const sel = root.querySelector('.pg-program-select');
    if (![...sel.options].some((o) => o.value === code)) return false;
    sel.value = code;
    return true;
  }

  // Sekme yeniden gösterildiğinde: Müfredat'ta o arada başka program
  // açıldıysa ona geç; değilse yalnızca geçti/alınabilir boyamasını tazele.
  function refreshFromGrades(root) {
    const now = lastGradesProgram();
    const sel = root.querySelector('.pg-program-select');
    if (now && now !== seenGradesProgram) {
      seenGradesProgram = now;
      if (sel && sel.value !== now && openProgramInPicker(root, now)) {
        selectProgram(root, now);
        savePrereqPreference(root);
        history.replaceState(null, '', `?prog=${encodeURIComponent(now)}#onsart`);
        return;
      }
    }
    if (graph && graph.nodes) applyProgress(root);
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
            ? `<button class="pg-chip" data-code="${esc(n.code)}">${esc(n.name)}<em>${esc(I18N.t('pgElectiveSlot'))}</em></button>`
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
        // Öncelik: URL'deki ?prog= > "Müfredat ve GPA"da açılan program (harita
        // tercihi kaydedildiğinden beri değiştiyse ya da hiç tercih yoksa) >
        // haritada hatırlanan tercih.
        const gradesProg = lastGradesProgram();
        seenGradesProgram = gradesProg;
        const fromGrades = !params.get('prog') && gradesProg && programs.some((p) => p.code === gradesProg)
          && (!prereqPreference.program || prereqPreference.mufredat !== gradesProg);
        const wantProg = params.get('prog') || (fromGrades ? gradesProg : '') || prereqPreference.program || '';
        if (wantProg) {
          // Paylaşılan link başka bir fakültenin programına işaret edebilir:
          // önce o programın seviyesini ve fakültesini aç, sonra bölüm listesini kur.
          const ok = openProgramInPicker(root, wantProg);
          const sel = root.querySelector('.pg-program-select');
          if (ok && fromGrades) {
            savePrereqPreference(root);
            history.replaceState(null, '', `?prog=${encodeURIComponent(wantProg)}#onsart`);
          }
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
      } else {
        refreshFromGrades(root);
      }
    },
  };
