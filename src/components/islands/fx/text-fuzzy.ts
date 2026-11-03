/**
 * Fuzzy text: the host's text is drawn to a canvas and redrawn every frame
 * one pixel row at a time, each row nudged sideways at random, like a signal
 * that won't hold. `intensity` is the resting fuzz, `hover` the fuzz while the
 * pointer is over it, `range` the widest nudge in px.
 *
 * The real text stays in the host as visually hidden copy; the canvas is
 * aria-hidden. Uses the host's own font, size, weight and colour. Paused
 * off-screen and in hidden tabs. Reduced motion: one still, clean frame.
 * destroy() restores the plain text.
 */
import './text-fuzzy.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

export const mount: FxMount = (host, params) => {
  let p: FxParams = { ...params };
  const still = prefersReducedMotion();
  const original = host.textContent?.trim() ?? '';
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = original;
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-fuzzy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };
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
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rows = src.height;
    const range = pad * dpr;
    for (let y = 0; y < rows; y++) {
      const dx = still ? 0 : (Math.random() - 0.5) * 2 * fuzz * range;
      ctx.drawImage(src, 0, y, src.width, 1, range + dx, y, src.width, 1);
    }
  };

  let raf = 0;
  let visible = true;
  const frame = () => {
    // Ease toward the target fuzz so hover swells rather than snaps.
    const target = hovering ? (p.hover ?? 0.5) : (p.intensity ?? 0.18);
    fuzz += (target - fuzz) * 0.15;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onEnter = () => (hovering = true);
  const onLeave = () => (hovering = false);
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

  return {
    update(next) {
      const resize = next.range !== p.range;
      p = { ...next };
      if (resize) prepare();
      if (!raf) draw();
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.classList.remove('fx-fuzzy');
      host.replaceChildren(original);
    },
  };
};
