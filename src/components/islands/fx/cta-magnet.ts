/**
 * Magnet lines: a field of short hairlines across the closing CTA that all
 * turn to point at the cursor, brightening from graphite to gilt near it.
 * With the pointer elsewhere they settle into a slow idle wave.
 *
 * Contract: Canvas2D at DPR (capped at 2), transparent over the CTA band.
 * Pointer tracking on fine pointers only; paused off-screen and when the tab
 * is hidden; a single still frame under reduced motion.
 */
import { prefersReducedMotion, tokenRgb, type FxMount, type FxParams } from './types';

export const mount: FxMount = (host, params) => {
  const GILT = tokenRgb('gilt');
  // A step brighter than the hairline token, so idle needles still read.
  const LINE = tokenRgb('line').map((v, i) => Math.round(v + (tokenRgb('ink')[i] - v) * 0.06));
  let p: FxParams = { ...params };
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  host.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy: () => canvas.remove() };

  const still = prefersReducedMotion();
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let dpr = 1;
  let points: { x: number; y: number; a: number }[] = [];
  const pointer = { x: 0, y: 0, inside: false };
  let raf = 0;
  let visible = true;
  const t0 = performance.now();

  const build = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    const s = p.spacing ?? 30;
    points = [];
    for (let y = s / 2; y < h; y += s) {
      for (let x = s / 2; x < w; x += s) points.push({ x, y, a: idle(x, y, 0) });
    }
  };

  const idle = (x: number, y: number, t: number) =>
    Math.sin(x * 0.012 + t * 0.6) * 0.5 + Math.cos(y * 0.015 - t * 0.4) * 0.4 + 0.6;

  const draw = (now: number) => {
    const t = (now - t0) / 1000;
    const len = (p.length ?? 14) / 2;
    const k = p.intensity ?? 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    for (const pt of points) {
      let target: number;
      let glow = 0;
      if (pointer.inside) {
        const dx = pointer.x - pt.x;
        const dy = pointer.y - pt.y;
        target = Math.atan2(dy, dx);
        glow = Math.min(1, Math.exp(-Math.hypot(dx, dy) / 240) * k);
      } else {
        target = idle(pt.x, pt.y, still ? 0 : t);
      }
      // Ease along the shortest arc.
      let d = target - pt.a;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      pt.a += still ? d : d * 0.12;
      const c = LINE.map((v, i) => Math.round(v + (GILT[i] - v) * glow));
      ctx.strokeStyle = `rgb(${c[0]} ${c[1]} ${c[2]} / ${0.55 + 0.45 * glow})`;
      const cx = Math.cos(pt.a) * len;
      const cy = Math.sin(pt.a) * len;
      ctx.beginPath();
      ctx.moveTo(pt.x - cx, pt.y - cy);
      ctx.lineTo(pt.x + cx, pt.y + cy);
      ctx.stroke();
    }
  };

  const frame = (now: number) => {
    draw(now);
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (still || raf || !visible || document.hidden) return;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.inside =
      pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
  };
  const onLeave = () => (pointer.inside = false);
  const onVisibility = () => (document.hidden ? stop() : start());
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });
  const ro = new ResizeObserver(() => {
    build();
    draw(performance.now());
  });

  ro.observe(canvas);
  if (!still) {
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
  }
  requestAnimationFrame(() => canvas.classList.add('is-lit'));

  return {
    update(next) {
      const rebuild = next.spacing !== p.spacing;
      p = { ...next };
      if (rebuild) build();
      if (!raf) draw(performance.now());
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.remove();
    },
  };
};
