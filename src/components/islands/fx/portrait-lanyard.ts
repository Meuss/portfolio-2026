/**
 * Lanyard: the About portrait becomes an ID badge hanging from a strap. The
 * strap is a light verlet rope (Canvas2D) anchored above the photo. The badge is
 * a rigid body on its end: a rod from the clip to the centre of the photo, where
 * the weight sits, so it swings like something heavy on a short strap. Hold it
 * anywhere and it pivots around your grip; pull past the strap's reach and the
 * strap stretches a little, then springs back.
 *
 * Contract:
 * - The real `<img>` (and its alt) stays in the figure, only wrapped; the plate,
 *   clip and caption are decorative and `aria-hidden`.
 * - Nothing reflows: the plate grows outward absolutely, the strap is drawn into
 *   the space above, and the badge only moves by transform (the figure stays sticky).
 * - Touch: dragging starts only on the badge, and vertical swipes there still
 *   scroll the page (`touch-action: pan-y`).
 * - Physics runs at a fixed step and draws interpolated, so it looks the same at
 *   any refresh rate. The loop stops once the badge is still, off-screen, or the
 *   tab is hidden.
 * - Reduced motion: the badge hangs straight, no physics, no dragging.
 */
import './portrait-lanyard.css';
import { prefersReducedMotion, rgbCss, tokenRgb, type FxMount, type FxParams } from './types';

const SEGMENTS = 8;
const STEP = 1 / 120;
const ITERATIONS = 8;
const CLIP_REM = 1.5;
/** How far the strap can stretch when pulled past its reach. */
const STRETCH_REM = 2.5;
/** Fastest a point may travel, in px per step: keeps a wild fling on screen. */
const MAX_SPEED = 18;
/** Past this tilt (radians) a loose badge is eased back, so a fling can't flip it over. */
const MAX_TILT = 0.95;
// Inverse masses: a light strap carrying a heavy badge.
const W_STRAP = 1;
const W_CLIP = 0.06;
const W_BADGE = 0.03;

interface Pt {
  x: number;
  y: number;
  px: number;
  py: number;
}

/** Pull two points to `len` apart. A strap (`slack`) only resists stretching, never pushes. */
const solve = (a: Pt, wa: number, b: Pt, wb: number, len: number, slack: boolean) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  if (slack && d <= len) return;
  const k = (d - len) / d / (wa + wb);
  a.x += dx * k * wa;
  a.y += dy * k * wa;
  b.x -= dx * k * wb;
  b.y -= dy * k * wb;
};

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
    stitch: tokenRgb('accent'),
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
  const clipEl = document.createElement('div');
  clipEl.className = 'fx-lanyard-clip';
  clipEl.setAttribute('aria-hidden', 'true');
  img.replaceWith(stage);
  badge.append(plate, clipEl, img);
  stage.append(canvas, badge);
  const ctx = canvas.getContext('2d')!;

  let p = { ...params };
  let pts: Pt[] = []; // the strap, anchor first; its last point is the clip
  const weight: Pt = { x: 0, y: 0, px: 0, py: 0 }; // the badge's centre of mass
  let width = 0;
  let height = 0;
  let strap = 0; // strap length, px
  let rod = 0; // clip to centre of mass, px
  let stretch = 0; // current extra strap length, px
  const stretchMax = STRETCH_REM * rem;
  const rest = { x: 0, y: 0 }; // clip at rest, stage coords
  const anchor = { x: 0, y: 0 };
  const box = { left: 0, top: 0, size: 0 };
  let spin = 0;
  let dragging = false;
  // Where the badge is held, along the rod (t) and across it (s), and where it's pulled to.
  const grab = { t: 0, s: 0, tx: 0, ty: 0, stretch: 0 };
  let raf = 0;
  let last = 0;
  let acc = 0;
  let still = 0;
  let visible = true;

  const swing = () => p.swing ?? 1;
  const gravity = () => 2400 * (0.7 + 0.75 * swing());
  /** Velocity lost per second: the badge barely, the strap a lot, wobble in between. */
  const badgeDamp = () => Math.exp(-(0.95 - 0.35 * Math.min(2, swing())) * STEP);
  const wobbleDamp = Math.exp(-0.7 * STEP);
  const strapDamp = Math.exp(-7 * STEP);

  const clip = () => pts[pts.length - 1];

  /** Everything hanging straight down from the anchor. */
  const layout = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    strap = (p.length ?? 8) * rem;
    rod = height / 2 + CLIP_REM * rem;
    rest.x = width / 2;
    rest.y = -CLIP_REM * rem;
    anchor.x = rest.x;
    anchor.y = rest.y - strap;
    pts = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
      const y = anchor.y + (strap / SEGMENTS) * i;
      return { x: anchor.x, y, px: anchor.x, py: y };
    });
    weight.x = weight.px = rest.x;
    weight.y = weight.py = rest.y + rod;
    stretch = spin = 0;
    // The canvas covers every place the strap can reach, stretched.
    const reach = strap + stretchMax + 1.5 * rem;
    box.size = 2 * reach;
    box.left = anchor.x - reach;
    box.top = anchor.y - reach;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.style.left = `${box.left}px`;
    canvas.style.top = `${box.top}px`;
    canvas.style.width = canvas.style.height = `${box.size}px`;
    canvas.width = canvas.height = Math.round(box.size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const carry = (q: Pt, vx: number, vy: number, g: number) => {
    q.px = q.x;
    q.py = q.y;
    q.x += vx;
    q.y += vy + g;
  };

  /** Move the held point toward the pointer, levering the rod around it. */
  const pull = () => {
    const c = clip();
    const ax = weight.x - c.x;
    const ay = weight.y - c.y;
    const len = Math.hypot(ax, ay) || 1;
    const gx = c.x + ax * grab.t - (ay / len) * grab.s;
    const gy = c.y + ay * grab.t + (ax / len) * grab.s;
    const w0 = 1 - grab.t;
    const w1 = grab.t;
    const k = 0.7 / (w0 * w0 + w1 * w1);
    const dx = grab.tx - gx;
    const dy = grab.ty - gy;
    c.x += dx * w0 * k;
    c.y += dy * w0 * k;
    weight.x += dx * w1 * k;
    weight.y += dy * w1 * k;
  };

  const limit = (q: Pt) => {
    const vx = q.x - q.px;
    const vy = q.y - q.py;
    const v = Math.hypot(vx, vy);
    if (v > MAX_SPEED) {
      q.px = q.x - (vx / v) * MAX_SPEED;
      q.py = q.y - (vy / v) * MAX_SPEED;
    }
  };

  /** A soft stop: past MAX_TILT the weight is sprung back toward it and loses speed. */
  const easeTilt = () => {
    const c = clip();
    const angle = Math.atan2(weight.x - c.x, weight.y - c.y);
    const over = Math.abs(angle) - MAX_TILT;
    if (over <= 0) return;
    const back = -Math.sign(angle) * over * rod * 0.012;
    weight.x += Math.cos(angle) * back;
    weight.y -= Math.sin(angle) * back;
    weight.px += (weight.x - weight.px) * 0.05;
    weight.py += (weight.y - weight.py) * 0.05;
  };

  const simulate = () => {
    const g = gravity() * STEP * STEP;
    const c = clip();

    for (let i = 1; i < pts.length - 1; i++) {
      const q = pts[i];
      carry(q, (q.x - q.px) * strapDamp, (q.y - q.py) * strapDamp, g);
    }
    // The badge keeps its swing but loses the fast clip-against-weight wobble.
    const damp = badgeDamp();
    const cvx = c.x - c.px;
    const cvy = c.y - c.py;
    const wvx = weight.x - weight.px;
    const wvy = weight.y - weight.py;
    const mx = (cvx + wvx) / 2;
    const my = (cvy + wvy) / 2;
    carry(c, (mx + (cvx - mx) * wobbleDamp) * damp, (my + (cvy - my) * wobbleDamp) * damp, g);
    carry(weight, (mx + (wvx - mx) * wobbleDamp) * damp, (my + (wvy - my) * wobbleDamp) * damp, g);

    stretch = dragging ? stretch + (grab.stretch - stretch) * 0.2 : stretch * 0.93;
    const seg = (strap + stretch) / SEGMENTS;
    const reach = strap + stretch;

    for (let k = 0; k < ITERATIONS; k++) {
      // From the heavy end back to the anchor, which is what keeps a chain taut.
      for (let i = pts.length - 2; i >= 0; i--) {
        const wa = i === 0 ? 0 : W_STRAP;
        const wb = i + 1 === pts.length - 1 ? W_CLIP : W_STRAP;
        solve(pts[i], wa, pts[i + 1], wb, seg, true);
      }
      solve(c, W_CLIP, weight, W_BADGE, rod, false);
      if (dragging) pull();
      // The strap never gives more than its length, however heavy the badge.
      const dx = c.x - anchor.x;
      const dy = c.y - anchor.y;
      const d = Math.hypot(dx, dy);
      if (d > reach) {
        c.x = anchor.x + (dx / d) * reach;
        c.y = anchor.y + (dy / d) * reach;
      }
    }
    solve(c, W_CLIP, weight, W_BADGE, rod, false);
    if (!dragging) easeTilt();
    limit(c);
    limit(weight);
  };

  /** Draw between the last two physics steps; `a` is how far along, `dt` the frame time. */
  const draw = (a = 1, dt = 0) => {
    const at = (q: Pt) => ({ x: q.px + (q.x - q.px) * a, y: q.py + (q.y - q.py) * a });
    const line = pts.map(at);
    const c = line[line.length - 1];
    const w = at(weight);

    ctx.clearRect(0, 0, box.size, box.size);
    ctx.save();
    ctx.translate(-box.left, -box.top);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y);
      for (let i = 1; i < line.length - 1; i++) {
        const mx = (line[i].x + line[i + 1].x) / 2;
        const my = (line[i].y + line[i + 1].y) / 2;
        ctx.quadraticCurveTo(line[i].x, line[i].y, mx, my);
      }
      ctx.lineTo(c.x, c.y);
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
    ctx.strokeStyle = rgbCss(colors.stitch, 0.7);
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

    // The rod is the badge: no lag between its angle and where it hangs. It turns
    // away from the direction it's travelling, eased so it never flips.
    const angle = -Math.atan2(w.x - c.x, w.y - c.y);
    const speed = (weight.x - weight.px) / STEP;
    const target = Math.max(-20, Math.min(20, speed * 0.028));
    spin += (target - spin) * (1 - Math.exp(-dt * 9));
    badge.style.transform =
      `perspective(1100px) translate(${c.x - rest.x}px, ${c.y - rest.y}px) ` +
      `rotate(${angle}rad) rotateY(${spin}deg)`;
  };

  const energy = () =>
    [...pts, weight].reduce((m, q) => Math.max(m, Math.abs(q.x - q.px) + Math.abs(q.y - q.py)), 0);

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    acc += dt;
    last = now;
    while (acc >= STEP) {
      simulate();
      acc -= STEP;
    }
    draw(acc / STEP, dt);
    still = !dragging && energy() < 0.012 && Math.abs(spin) < 0.05 ? still + 1 : 0;
    raf = still > 45 || !visible || document.hidden ? 0 : requestAnimationFrame(frame);
  };
  const wake = () => {
    if (reduce || raf || !visible || document.hidden) return;
    still = 0;
    acc = 0;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  /** Push the badge sideways, in px/s. */
  const nudge = (vx: number) => {
    weight.px -= vx * STEP;
    wake();
  };

  // Pointer: stage coordinates; the strap only stretches once the pointer is out of reach.
  const local = (ev: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };
  const aim = (ev: PointerEvent) => {
    const l = local(ev);
    grab.tx = l.x;
    grab.ty = l.y;
    const lever = Math.hypot(grab.t * rod, grab.s);
    const over = Math.hypot(l.x - anchor.x, l.y - anchor.y) - (strap + lever);
    grab.stretch = over > 0 ? stretchMax * (1 - 1 / (1 + over / stretchMax)) : 0;
  };
  const onDown = (ev: PointerEvent) => {
    if (ev.button !== 0) return;
    const l = local(ev);
    const c = clip();
    const ax = weight.x - c.x;
    const ay = weight.y - c.y;
    const len = Math.hypot(ax, ay) || 1;
    const vx = l.x - c.x;
    const vy = l.y - c.y;
    grab.t = (vx * ax + vy * ay) / (len * len);
    grab.s = (-vx * ay + vy * ax) / len;
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
    if (stage.clientWidth === width && stage.clientHeight === height) return;
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
    nudge(150);
  }

  return {
    update(next: FxParams) {
      const relength = next.length !== p.length;
      p = { ...next };
      if (relength) {
        layout();
        draw();
        nudge(120);
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
