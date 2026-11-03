/**
 * Scramble: every letter flickers through gilt stand-ins and locks into ink,
 * resolving left to right with a little randomness.
 */
import { buildBoard, layer, restore } from './name-cells';
import { prefersReducedMotion, type FxMount } from './types';

export const mount: FxMount = (el, params) => {
  if (prefersReducedMotion()) return { destroy() {} };
  const speed = params.speed ?? 1;
  const glyphs: HTMLElement[] = [];
  const cells = buildBoard(el, (cell) => {
    const g = layer('fx-glyph fx-glyph--pending');
    cell.append(g);
    glyphs.push(g);
  });
  const plan = cells.map((c) => {
    const start = (c.index * 55) / speed;
    return { start, end: start + (380 + Math.random() * 320) / speed, done: false };
  });

  let raf = 0;
  let lastSwap = 0;
  const t0 = performance.now();
  const tick = (now: number) => {
    const t = now - t0;
    const swap = now - lastSwap > 55 / speed;
    if (swap) lastSwap = now;
    let pending = 0;
    cells.forEach((c, i) => {
      const p = plan[i];
      if (p.done) return;
      pending++;
      if (t >= p.end) {
        p.done = true;
        glyphs[i].textContent = c.final;
        glyphs[i].className = 'fx-glyph fx-glyph--locked';
      } else if (t >= p.start && swap) {
        glyphs[i].textContent = c.random();
        glyphs[i].classList.add('is-live');
      }
    });
    if (pending) raf = requestAnimationFrame(tick);
    else setTimeout(() => restore(el), 450);
  };
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      restore(el);
    },
  };
};
