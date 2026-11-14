/**
 * Fuzzy text: the host's text is drawn to a canvas and redrawn every frame
 * one pixel row at a time, each row nudged sideways at random, like a signal
 * that won't hold. `intensity` is the resting fuzz, `hover` the fuzz while the
 * pointer is over it, `range` the widest nudge in px.
 *
 * The real text stays in the host as visually hidden copy; the canvas is
 * aria-hidden. Uses the host's own font, size, weight and colour. The fuzz runs
 * for the first SETTLE_MS, then settles on a still, clean frame and the loop
 * stops; hovering wakes it, and it settles again shortly after the pointer
 * leaves. Paused off-screen and in hidden tabs. Reduced motion: one still,
 * clean frame.
 */
import './text-fuzzy.css';
import { prefersReducedMotion, type FxMount } from './types';

/** How long the fuzz runs after load, and after the pointer leaves. */
const SETTLE_MS = 3000;
const LEAVE_MS = 600;

export const mount: FxMount = (host, params) => {
  const p = params;
  const still = prefersReducedMotion();
  const original = host.textContent?.trim() ?? '';
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = original;
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-fuzzy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  host.replaceChildren(sr, canvas);
  host.classList.add('fx-fuzzy');

  const src = document.createElement('canvas');
  const sctx = src.getContext('2d')!;
  let dpr = 1;
  let textW = 0;
  let textH = 0;
  let pad = 0;

  /** Render the text once into an offscreen canvas, sized to its ink. */
  const prepare = () => {
    const style = getComputedStyle(host);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    sctx.font = font;
    const m = sctx.measureText(original);
    const ascent = m.actualBoundingBoxAscent;
    const descent = m.actualBoundingBoxDescent;
    textW = Math.ceil(m.width + 4);
    textH = Math.ceil(ascent + descent + 4);
    pad = p.range ?? 30;
    src.width = textW * dpr;
    src.height = textH * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.font = font;
    sctx.fillStyle = style.color;
    sctx.textBaseline = 'alphabetic';
    sctx.fillText(original, 2, ascent + 2);
    canvas.width = (textW + pad * 2) * dpr;
    canvas.height = textH * dpr;
    canvas.style.width = `${textW + pad * 2}px`;
    canvas.style.height = `${textH}px`;
    canvas.style.marginLeft = `${-pad}px`;
  };

  let hovering = false;
  let fuzz = p.intensity ?? 0.18;
  let until = performance.now() + SETTLE_MS; // fuzz until then (and while hovered)
  let settled = false; // the still frame is up and the loop is off
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rows = src.height;
    const range = pad * dpr;
    for (let y = 0; y < rows; y++) {
      const dx = still || settled ? 0 : (Math.random() - 0.5) * 2 * fuzz * range;
      ctx.drawImage(src, 0, y, src.width, 1, range + dx, y, src.width, 1);
    }
  };

  let raf = 0;
  let visible = true;
  const settle = () => {
    stop();
    settled = true;
    draw();
  };
  const frame = (now: number) => {
    if (!hovering && now >= until) return settle();
    // Ease toward the target fuzz so hover swells rather than snaps.
    const target = hovering ? (p.hover ?? 0.5) : (p.intensity ?? 0.18);
    fuzz += (target - fuzz) * 0.15;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (still || raf || !visible || document.hidden) return;
    if (!hovering && performance.now() >= until) {
      if (!settled) settle();
      return;
    }
    settled = false;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onEnter = () => {
    hovering = true;
    start();
  };
  const onLeave = () => {
    hovering = false;
    until = performance.now() + LEAVE_MS;
    start();
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });
  const ro = new ResizeObserver(() => {
    prepare();
    draw();
  });

  prepare();
  draw();
  io.observe(host);
  ro.observe(host);
  canvas.addEventListener('pointerenter', onEnter);
  canvas.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVisibility);
  start();
};
