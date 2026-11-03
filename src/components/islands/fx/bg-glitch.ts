/**
 * Letter glitch: the hero ground is a grid of DM Mono characters in graphite
 * tones, a few re-rolling every tick with a brief gilt (sometimes ruby) flash.
 * A heavy vignette keeps the copy side dark; the edges and the upper right
 * carry the texture.
 *
 * Contract: Canvas2D, crisp at DPR (capped at 2), ~30fps, only changed cells
 * are redrawn. Paused off-screen and when the tab is hidden; one static frame
 * under reduced motion.
 */
import { prefersReducedMotion, tokenRgb, type FxMount, type FxParams } from './types';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-/<=>?@[]';
// Palette tokens, read at mount so the field follows the brand palette.
let PAPER: number[] = [];
let MUTED: number[] = [];
let GILT: number[] = [];
let RUBY: number[] = [];
const FLASH_MS = 420;
const FRAME_MS = 33;

const mix = (a: number[], b: number[], k: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * k));
const rgb = (c: number[]) => `rgb(${c[0]} ${c[1]} ${c[2]})`;

interface Cell {
  ch: string;
  base: number[];
  flash: number; // ms left
  hue: number[];
}

export const mount: FxMount = (host, params) => {
  [PAPER, MUTED, GILT, RUBY] = ['paper', 'muted', 'gilt', 'accent'].map(tokenRgb);
  let p: FxParams = { ...params };
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  host.append(canvas);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return { destroy: () => canvas.remove() };

  const still = prefersReducedMotion();
  let cells: Cell[] = [];
  let cols = 0;
  let rows = 0;
  let size = 16;
  let dpr = 1;
  const flashing = new Set<number>();
  let raf = 0;
  let last = 0;
  let visible = true;

  const random = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  /** Graphite tone by position: dark where the copy sits, lit at the edges and upper right. */
  const tone = (x: number, y: number) => {
    const dx = (x - 0.3) * 1.3;
    const dy = y - 0.55;
    const edge = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.25);
    const corner = Math.exp(-((x - 0.95) ** 2 + (y - 0.05) ** 2) * 6) * 0.6;
    const k = Math.min(1, edge ** 2.2 + corner) * 0.32 * (p.intensity ?? 1);
    return mix(PAPER, MUTED, Math.min(0.9, k));
  };

  const drawCell = (i: number) => {
    const c = cells[i];
    const x = (i % cols) * size;
    const y = Math.floor(i / cols) * size;
    ctx.fillStyle = rgb(PAPER);
    ctx.fillRect(x, y, size, size);
    const f = c.flash > 0 ? c.flash / FLASH_MS : 0;
    ctx.fillStyle = rgb(f > 0 ? mix(c.base, c.hue, f) : c.base);
    ctx.fillText(c.ch, x + size / 2, y + size / 2 + size * 0.04);
  };

  const build = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    size = Math.round((p.cell ?? 16) * dpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    canvas.width = w;
    canvas.height = h;
    cols = Math.ceil(w / size);
    rows = Math.ceil(h / size);
    ctx.font = `500 ${Math.round(size * 0.68)}px 'DM Mono', ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = rgb(PAPER);
    ctx.fillRect(0, 0, w, h);
    flashing.clear();
    cells = Array.from({ length: cols * rows }, (_, i) => ({
      ch: random(),
      base: tone(((i % cols) + 0.5) / cols, (Math.floor(i / cols) + 0.5) / rows),
      flash: 0,
      hue: GILT,
    }));
    cells.forEach((_, i) => drawCell(i));
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    if (dt < FRAME_MS) return;
    last = now;
    const speed = p.speed ?? 1;
    // Re-roll a small share of the grid, scaled by speed.
    const n = Math.round(cells.length * 0.012 * speed);
    for (let k = 0; k < n; k++) {
      const i = Math.floor(Math.random() * cells.length);
      const c = cells[i];
      c.ch = random();
      if (Math.random() < 0.18) {
        c.flash = FLASH_MS;
        c.hue = Math.random() < (p.ruby ?? 0.2) * 0.5 ? RUBY : GILT;
        flashing.add(i);
      }
      drawCell(i);
    }
    for (const i of flashing) {
      const c = cells[i];
      c.flash = Math.max(0, c.flash - dt);
      drawCell(i);
      if (c.flash === 0) flashing.delete(i);
    }
  };

  const start = () => {
    if (still || raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });
  let lastW = 0;
  let lastH = 0;
  const ro = new ResizeObserver(() => {
    if (canvas.clientWidth === lastW && canvas.clientHeight === lastH) return;
    lastW = canvas.clientWidth;
    lastH = canvas.clientHeight;
    build();
  });

  ro.observe(canvas);
  io.observe(canvas);
  document.addEventListener('visibilitychange', onVisibility);
  requestAnimationFrame(() => canvas.classList.add('is-lit'));
  start();

  return {
    update(next) {
      const rebuild = next.cell !== p.cell || next.intensity !== p.intensity;
      p = { ...next };
      if (rebuild) build();
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.remove();
    },
  };
};
