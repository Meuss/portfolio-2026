/**
 * Lanyard: the About portrait becomes an ID badge hanging from a strap. The
 * strap is a verlet rope (Canvas2D) anchored above the photo; the badge rides
 * its end, tilting with the last segment and turning in 3D with its sideways
 * speed. Grab it and fling it; it swings back and settles.
 *
 * Contract:
 * - The real `<img>` (and its alt) stays in the figure, only wrapped; the plate,
 *   clip and caption are decorative and `aria-hidden`.
 * - Nothing reflows: the plate grows outward absolutely, the strap is drawn into
 *   the space above, and the badge only moves by transform (the figure stays sticky).
 * - Touch: dragging starts only on the badge (`touch-action: none` there alone).
 * - The loop stops once the badge is still, off-screen, or the tab is hidden.
 * - Reduced motion: the badge hangs straight, no physics, no dragging.
 */
import './portrait-lanyard.css';
import { prefersReducedMotion, rgbCss, tokenRgb, type FxMount, type FxParams } from './types';

const SEGMENTS = 10;
const STEP = 1 / 60;
const CLIP_REM = 1.5;

interface Pt {
  x: number;
  y: number;
  px: number;
  py: number;
}

export const mount: FxMount = (figure, params) => {
  const img = figure.querySelector('img');
  if (!img) return { destroy() {} };
  const reduce = prefersReducedMotion();
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  // Strap colours from the palette: a hairline edge around a surface-tone band.
  const [line, surface, ink] = ['line', 'surface', 'ink'].map(tokenRgb);
  const colors = {
    edge: line.map((v, i) => v + (ink[i] - v) * 0.06),
    strap: surface.map((v, i) => v + (line[i] - v) * 0.3),
    gilt: tokenRgb('gilt'),
  };
  const fr = document.documentElement.lang === 'fr';

  // Build the badge around the real image.
  const stage = document.createElement('div');
  stage.className = 'fx-lanyard-stage';
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-lanyard-strap';
  canvas.setAttribute('aria-hidden', 'true');
  const badge = document.createElement('div');
  badge.className = 'fx-lanyard-badge';
  const plate = document.createElement('div');
  plate.className = 'fx-lanyard-plate';
  plate.setAttribute('aria-hidden', 'true');
  const caption = document.createElement('div');
  caption.className = 'fx-lanyard-caption';
  caption.innerHTML = `<span>Thomas Miller</span><span>${fr ? 'Développeur web' : 'Web developer'}</span>`;
  plate.append(caption);
  const clip = document.createElement('div');
  clip.className = 'fx-lanyard-clip';
  clip.setAttribute('aria-hidden', 'true');
  img.replaceWith(stage);
  badge.append(plate, clip, img);
  stage.append(canvas, badge);
  const ctx = canvas.getContext('2d')!;

  let p = { ...params };
  let pts: Pt[] = [];
  let width = 0;
  let strap = 0; // strap length, px
  let seg = 0;
  const rest = { x: 0, y: 0 }; // rope end at rest (top of the clip), stage coords
  const anchor = { x: 0, y: 0 };
  const box = { left: 0, top: 0, size: 0 };
  let angle = 0;
  let spin = 0;
  let dragging = false;
  const grab = { dx: 0, dy: 0, tx: 0, ty: 0 };
  let raf = 0;
  let last = 0;
  let acc = 0;
  let still = 0;
  let visible = true;

  const gravity = () => 2600 * (0.55 + 0.45 * (p.swing ?? 1)) ** 2;
  const damping = () => Math.min(0.996, 0.972 + 0.014 * (p.swing ?? 1));

  /** Rope hanging straight down from the anchor to the badge's resting point. */
  const layout = () => {
    width = stage.clientWidth;
    strap = (p.length ?? 8) * rem;
    seg = strap / SEGMENTS;
    rest.x = width / 2;
    rest.y = -CLIP_REM * rem;
    anchor.x = rest.x;
    anchor.y = rest.y - strap;
    pts = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
      const y = anchor.y + seg * i;
      return { x: anchor.x, y, px: anchor.x, py: y };
    });
    // The canvas covers every place the rope can reach (a circle of `strap` around the anchor).
    const pad = 1.5 * rem;
    box.size = 2 * (strap + pad);
    box.left = anchor.x - strap - pad;
    box.top = anchor.y - strap - pad;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.style.left = `${box.left}px`;
    canvas.style.top = `${box.top}px`;
    canvas.style.width = canvas.style.height = `${box.size}px`;
    canvas.width = canvas.height = Math.round(box.size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    angle = spin = 0;
  };

  const end = () => pts[pts.length - 1];

  const simulate = () => {
    const g = gravity() * STEP * STEP;
    const damp = damping();
    for (let i = 1; i < pts.length; i++) {
      const q = pts[i];
      const vx = (q.x - q.px) * damp;
      const vy = (q.y - q.py) * damp;
      q.px = q.x;
      q.py = q.y;
      q.x += vx;
      q.y += vy + g;
    }
    if (dragging) {
      const e = end();
      e.x += (grab.tx - e.x) * 0.55;
      e.y += (grab.ty - e.y) * 0.55;
    }
    // Light strap, heavy badge: the end barely gives way to the strap.
    for (let k = 0; k < 18; k++) {
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const wa = i === 0 ? 0 : 1;
        const wb = i + 1 === pts.length - 1 ? (dragging ? 0 : 0.18) : 1;
        if (wa + wb === 0) continue;
        const diff = (len - seg) / len / (wa + wb);
        a.x += dx * diff * wa;
        a.y += dy * diff * wa;
        b.x -= dx * diff * wb;
        b.y -= dy * diff * wb;
      }
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, box.size, box.size);
    ctx.save();
    ctx.translate(-box.left, -box.top);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(end().x, end().y);
    };
    const band = 0.62 * rem;
    path();
    ctx.strokeStyle = rgbCss(colors.edge);
    ctx.lineWidth = band;
    ctx.stroke();
    path();
    ctx.strokeStyle = rgbCss(colors.strap);
    ctx.lineWidth = band - 2;
    ctx.stroke();
    path();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = rgbCss(colors.gilt, 0.7);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    // The strap comes down from out of view: fade it in from the anchor.
    ctx.globalCompositeOperation = 'destination-in';
    const fade = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, strap * 0.45);
    fade.addColorStop(0, 'rgb(0 0 0 / 0)');
    fade.addColorStop(1, 'rgb(0 0 0 / 1)');
    ctx.fillStyle = fade;
    ctx.fillRect(box.left, box.top, box.size, box.size);
    ctx.restore();

    // The badge rides the rope end, tilted by the last segment, turned by its speed.
    const e = end();
    const prev = pts[pts.length - 2];
    const target = -Math.atan2(e.x - prev.x, e.y - prev.y);
    angle += (target - angle) * 0.35;
    const vx = e.x - e.px;
    spin += (Math.max(-38, Math.min(38, vx * 4)) - spin) * 0.2;
    badge.style.transform =
      `perspective(900px) translate(${e.x - rest.x}px, ${e.y - rest.y}px) ` +
      `rotate(${angle}rad) rotateY(${spin}deg)`;
  };

  const energy = () =>
    pts.reduce((m, q) => Math.max(m, Math.abs(q.x - q.px) + Math.abs(q.y - q.py)), 0);

  const frame = (now: number) => {
    acc += Math.min(0.1, (now - last) / 1000);
    last = now;
    while (acc >= STEP) {
      simulate();
      acc -= STEP;
    }
    draw();
    still = !dragging && energy() < 0.03 ? still + 1 : 0;
    raf = still > 45 || !visible || document.hidden ? 0 : requestAnimationFrame(frame);
  };
  const wake = () => {
    if (reduce || raf || !visible || document.hidden) return;
    still = 0;
    acc = 0;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const nudge = (vx: number) => {
    const e = end();
    e.px -= vx;
    wake();
  };

  // Pointer: stage coordinates of the pointer, minus where the badge was grabbed.
  const local = (ev: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };
  const aim = (ev: PointerEvent) => {
    const l = local(ev);
    let tx = l.x - grab.dx;
    let ty = l.y - grab.dy;
    // Keep the end within reach of the strap so it never stretches.
    const dx = tx - anchor.x;
    const dy = ty - anchor.y;
    const d = Math.hypot(dx, dy);
    if (d > strap) {
      tx = anchor.x + (dx / d) * strap;
      ty = anchor.y + (dy / d) * strap;
    }
    grab.tx = tx;
    grab.ty = ty;
  };
  const onDown = (ev: PointerEvent) => {
    if (ev.button !== 0) return;
    const l = local(ev);
    grab.dx = l.x - end().x;
    grab.dy = l.y - end().y;
    aim(ev);
    dragging = true;
    badge.classList.add('is-dragging');
    badge.setPointerCapture(ev.pointerId);
    ev.preventDefault();
    wake();
  };
  const onMove = (ev: PointerEvent) => dragging && aim(ev);
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    badge.classList.remove('is-dragging');
    wake();
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
  });
  const ro = new ResizeObserver(() => {
    if (stage.clientWidth === width) return;
    layout();
    draw();
  });
  const onVisibility = () => !document.hidden && wake();

  layout();
  draw();
  ro.observe(stage);
  if (!reduce) {
    badge.classList.add('is-draggable');
    badge.addEventListener('pointerdown', onDown);
    badge.addEventListener('pointermove', onMove);
    badge.addEventListener('pointerup', onUp);
    badge.addEventListener('pointercancel', onUp);
    io.observe(stage);
    document.addEventListener('visibilitychange', onVisibility);
    // A first gentle swing, so it reads as hanging rather than printed.
    nudge(3.5);
  }

  return {
    update(next: FxParams) {
      const relength = next.length !== p.length;
      p = { ...next };
      if (relength) {
        layout();
        draw();
        nudge(2);
      } else {
        wake();
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      stage.replaceWith(img);
    },
  };
};
