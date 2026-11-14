/**
 * Pixel card (React Bits `PixelCard`): the empty frame of the "Your project?"
 * teaser fills with a grid of small square pixels. When the card scrolls into
 * view they pop in from the centre outward (each overshoots and flashes as it
 * lands), then shimmer, each at its own size, phase and rate, for as long as
 * the card stays on screen; while the pointer is over the card, pixels near it
 * swell. Neutral pixels (`line`, `faint`, `muted`) with a minority of orange.
 * The caption keeps a calm zone: no pixel is drawn behind it.
 *
 * Settings (`effects.ts`):
 * - `gap`: distance between pixel centres, in CSS px (React Bits default 5; min 2).
 * - `speed`: shimmer speed, 0–100 like the original (default 35); 0 keeps the
 *   pixels still once they have appeared.
 * - `accent`: share of pixels drawn in orange, 0–1.
 * - `spotlight`: how much pixels near the pointer swell, 0–1 (React Bits default 0.5).
 *
 * Mounts on the teaser's `ProjectFrame`; the canvas goes inside its blank
 * plate (clipped by the frame's rounded corners). Trigger: the appear starts
 * once `VIEW` of the frame is in view, on every device. When the card leaves
 * the viewport entirely the field is cleared, so it ripples in again on every
 * return, scrolling down or up. The pointer only drives the spotlight (the
 * whole `article` is its target; touch pointers are ignored).
 *
 * Contract: Canvas2D, crisp at DPR (capped at 2), resized with the plate.
 * Frames run only while pixels move (appear, shimmer, disappear, spotlight),
 * never off-screen or in a hidden tab. Reduced motion: no-op (the card stays
 * as it is without JS).
 */
import './card-pixel.css';
import { prefersReducedMotion, rgbCss, tokenRgb, type FxMount } from './types';

// From the React Bits source: pixel size, reveal span, per-pixel fade-in time.
const PIXEL = 2;
const REVEAL = 0.6; // s, the ripple from the centre to the farthest pixel
const APPEAR = 0.26; // s, one pixel's fade in
const VIEW = 0.6; // share of the frame in view that starts the appear
const CALM_PAD = 16; // px kept clear around the caption
const CALM_FEATHER = 14; // px over which pixels fade back in beyond it

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const smoothstep = (e0: number, e1: number, v: number) => {
  const t = clamp((v - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeOutBack = (t: number) => {
  const c = 1.9;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

export const mount: FxMount = (host, params) => {
  if (prefersReducedMotion()) return;
  const plate = host.querySelector<HTMLElement>('.frame-blank');
  const card = host.closest<HTMLElement>('article') ?? host;
  if (!plate) return;

  const gap = Math.max(2, params.gap ?? 5);
  const speed = clamp(params.speed ?? 35, 0, 100);
  const accentShare = clamp(params.accent ?? 0.15, 0, 1);
  const spotlight = clamp(params.spotlight ?? 0.5, 0, 1);
  const neutrals = ['line', 'faint', 'muted'].map((n) => rgbCss(tokenRgb(n)));
  const colors = [...neutrals, rgbCss(tokenRgb('accent'))];
  const ACCENT = colors.length - 1;

  const caption = [...plate.children] as HTMLElement[];
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-pixel-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  plate.classList.add('fx-pixel-plate');
  plate.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = {
    raf: 0,
    last: 0,
    time: 0,
    dt: 1 / 60,
    visible: false,
    width: 0,
    height: 0,
    ratio: 1,
    count: 0,
    x: new Float32Array(0),
    y: new Float32Array(0),
    size: new Float32Array(0),
    phase: new Float32Array(0),
    rate: new Float32Array(0),
    jitter: new Float32Array(0),
    presence: new Float32Array(0),
    delay: new Float32Array(0),
    mask: new Float32Array(0),
    byColor: [] as number[][],
    active: false,
    changedAt: 0,
    hovering: false,
    pointerX: 0,
    pointerY: 0,
    spotX: 0,
    spotY: 0,
    spotVX: 0,
    spotVY: 0,
    spotPower: 0,
  };

  /** Pixels fade out toward the caption: 0 inside its padded box, 1 beyond the feather. */
  const buildMask = () => {
    const base = plate.getBoundingClientRect();
    const boxes = caption.map((el) => el.getBoundingClientRect()).filter((r) => r.width);
    for (let i = 0; i < s.count; i++) {
      let m = 1;
      for (const r of boxes) {
        const dx = Math.max(r.left - base.left - s.x[i], s.x[i] - (r.right - base.left), 0);
        const dy = Math.max(r.top - base.top - s.y[i], s.y[i] - (r.bottom - base.top), 0);
        m = Math.min(m, smoothstep(CALM_PAD, CALM_PAD + CALM_FEATHER, Math.hypot(dx, dy)));
      }
      s.mask[i] = m;
    }
  };

  let key = '';
  const build = () => {
    const width = Math.max(1, Math.round(canvas.clientWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight));
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const next = `${width}|${height}|${ratio}`;
    if (next === key) return;
    key = next;
    s.width = width;
    s.height = height;
    s.ratio = ratio;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const columns = Math.floor((width - 1) / gap) + 1;
    const rows = Math.floor((height - 1) / gap) + 1;
    const offsetX = (width - (columns - 1) * gap) / 2;
    const offsetY = (height - (rows - 1) * gap) / 2;
    const count = columns * rows;
    const previous = s.presence;
    s.count = count;
    s.x = new Float32Array(count);
    s.y = new Float32Array(count);
    s.size = new Float32Array(count);
    s.phase = new Float32Array(count);
    s.rate = new Float32Array(count);
    s.jitter = new Float32Array(count);
    s.presence = new Float32Array(count);
    s.delay = new Float32Array(count);
    s.mask = new Float32Array(count);
    s.byColor = colors.map(() => []);
    let i = 0;
    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        s.x[i] = offsetX + column * gap;
        s.y[i] = offsetY + row * gap;
        const tint =
          Math.random() < accentShare ? ACCENT : Math.floor(Math.random() * neutrals.length);
        s.byColor[tint].push(i);
        s.size[i] = PIXEL * (0.25 + Math.random() * 0.75);
        s.phase[i] = Math.random() * Math.PI * 2;
        s.rate[i] = 0.55 + Math.random() * 0.9;
        s.jitter[i] = Math.random();
        if (previous.length) s.presence[i] = previous[Math.min(i, previous.length - 1)];
        i++;
      }
    }
    buildMask();
    schedule();
  };

  /** Per-pixel delays: the appear ripples out from the centre, with a little jitter. */
  const schedule = () => {
    const ox = s.width / 2;
    const oy = s.height / 2;
    let far = 1;
    for (let i = 0; i < s.count; i++) far = Math.max(far, Math.hypot(s.x[i] - ox, s.y[i] - oy));
    for (let i = 0; i < s.count; i++) {
      const d = Math.hypot(s.x[i] - ox, s.y[i] - oy) / far;
      s.delay[i] = d * REVEAL * 0.82 + s.jitter[i] * REVEAL * 0.18;
    }
  };

  const appear = () => {
    if (s.active) return;
    s.active = true;
    s.changedAt = s.time;
    wake();
  };
  /** Out of view: empty the field so the next entrance ripples in afresh. */
  const reset = () => {
    s.active = false;
    s.presence.fill(0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /** Draws one frame; returns whether anything is still moving. */
  const draw = () => {
    const { width, height, ratio } = s;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    let present = false;
    let changing = false;
    const elapsed = s.time - s.changedAt;
    const appearStep = s.dt / APPEAR;
    for (let i = 0; i < s.count; i++) {
      if (!s.active) break;
      if (elapsed >= s.delay[i]) s.presence[i] = Math.min(1, s.presence[i] + appearStep);
      if (s.presence[i] < 1) changing = true;
      if (s.presence[i] > 0) present = true;
    }

    const spotRadius = Math.min(width, height) * 0.38 + 30;
    const spotStrength = spotlight * s.spotPower;
    const twinkle = speed > 0;
    const frequency = (speed / 35) * 1.35;

    for (let color = 0; color < colors.length; color++) {
      ctx.fillStyle = colors[color];
      for (const i of s.byColor[color]) {
        const presence = s.presence[i];
        if (presence <= 0.002 || s.mask[i] <= 0) continue;
        const x = s.x[i];
        const y = s.y[i];
        let size = s.size[i];
        let alpha = 0.5 + presence * 0.38;
        if (twinkle) {
          const wave = Math.sin(s.phase[i] + s.time * frequency * s.rate[i]);
          size *= 0.62 + 0.38 * wave;
          alpha += 0.12 * wave + (s.jitter[i] > 0.92 ? 0.35 * Math.max(0, wave) : 0);
        }
        size *= easeOutBack(presence);
        const flash = presence < 1 ? Math.sin(presence * Math.PI) : 0;
        size *= 1 + flash * 0.9;
        alpha += flash * 0.6;
        if (spotStrength > 0.001) {
          const near = smoothstep(spotRadius, 0, Math.hypot(x - s.spotX, y - s.spotY));
          size *= 1 + spotStrength * near * near * 2.4;
          alpha += spotStrength * near * 0.45;
        }
        alpha = Math.min(1, alpha) * s.mask[i];
        if (alpha <= 0.004 || size <= 0.05) continue;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      }
    }
    ctx.globalAlpha = 1;

    const spotMoving =
      Math.abs(s.spotPower - (s.hovering ? 1 : 0)) > 0.002 ||
      Math.abs(s.spotVX) + Math.abs(s.spotVY) > 0.5;
    return changing || (present && (twinkle || spotMoving));
  };

  const frame = (now: number) => {
    s.raf = 0;
    const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    s.dt = dt;
    s.time += dt;
    build();

    // Spotlight: a damped spring toward the pointer, faded in while hovering.
    const want = s.hovering ? 1 : 0;
    s.spotPower += (want - s.spotPower) * (1 - Math.exp(-(want ? 6 : 3) * dt));
    const stiffness = 120;
    const damping = 2 * Math.sqrt(stiffness) * 0.9;
    s.spotVX += (stiffness * (s.pointerX - s.spotX) - damping * s.spotVX) * dt;
    s.spotVY += (stiffness * (s.pointerY - s.spotY) - damping * s.spotVY) * dt;
    s.spotX += s.spotVX * dt;
    s.spotY += s.spotVY * dt;

    const moving = draw();
    if (moving && s.visible && !document.hidden) s.raf = requestAnimationFrame(frame);
    else {
      s.last = 0;
      if (!moving) {
        // At rest: settle the spotlight so the next hover starts from the pointer.
        s.spotPower = want;
        s.spotVX = s.spotVY = 0;
      }
    }
  };

  const wake = () => {
    if (!s.raf && s.visible && !document.hidden) s.raf = requestAnimationFrame(frame);
  };
  const sleep = () => {
    cancelAnimationFrame(s.raf);
    s.raf = 0;
    s.last = 0;
  };

  const local = (e: PointerEvent) => {
    const r = plate.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  // The pointer only drives the spotlight; the field is already up from the scroll.
  card.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    const [x, y] = local(e);
    s.hovering = true;
    s.pointerX = x;
    s.pointerY = y;
    if (s.spotPower < 0.01) {
      s.spotX = x;
      s.spotY = y;
      s.spotVX = s.spotVY = 0;
    }
    wake();
  });
  card.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    [s.pointerX, s.pointerY] = local(e);
    wake();
  });
  card.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    s.hovering = false;
    wake();
  });

  // The trigger: appear once enough of the frame is in view; reset once fully out.
  // Frames run only while it is on screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      s.visible = entry.isIntersecting;
      if (entry.intersectionRatio >= VIEW) appear();
      if (s.visible) wake();
      else {
        sleep();
        reset();
      }
    },
    { threshold: [0, VIEW] },
  );
  io.observe(plate);
  document.addEventListener('visibilitychange', () => (document.hidden ? sleep() : wake()));
  new ResizeObserver(() => {
    build();
    wake();
  }).observe(canvas);

  build();
};
