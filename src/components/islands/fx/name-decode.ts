/**
 * Decode: an orange block caret runs through the name; each letter it passes
 * glitches in through two sliced frames before settling, like a terminal
 * decrypting a line.
 */
import { buildBoard, layer, restore, wait } from './name-cells';
import { prefersReducedMotion, type FxMount } from './types';

export const mount: FxMount = (el, params) => {
  let cancelled = false;
  if (prefersReducedMotion()) return { destroy() {} };
  const speed = params.speed ?? 1;
  const parts: { glyph: HTMLElement; block: HTMLElement }[] = [];
  const cells = buildBoard(el, (cell, final) => {
    const glyph = layer('fx-glyph fx-glyph--hidden', final);
    const block = layer('fx-block');
    cell.append(glyph, block);
    parts.push({ glyph, block });
  });

  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
  Promise.all(
    cells.map(async (c) => {
      const { glyph, block } = parts[c.index];
      await wait((c.index * 62) / speed);
      if (cancelled) return;
      await block.animate(
        [
          { transform: 'scaleX(0)', transformOrigin: 'left' },
          { transform: 'scaleX(1)', transformOrigin: 'left' },
        ],
        { duration: 70 / speed, easing: ease, fill: 'forwards' },
      ).finished;
      glyph.classList.remove('fx-glyph--hidden');
      block.animate(
        [
          { transform: 'scaleX(1)', transformOrigin: 'right' },
          { transform: 'scaleX(0)', transformOrigin: 'right' },
        ],
        { duration: 110 / speed, easing: ease, fill: 'forwards' },
      );
      glyph.textContent = c.random();
      await glyph.animate(
        [
          {
            clipPath: 'inset(0 0 58% 0)',
            transform: 'translateX(0.07em)',
            color: 'var(--color-accent)',
          },
          {
            clipPath: 'inset(36% 0 0 0)',
            transform: 'translateX(-0.05em)',
            color: 'var(--color-accent)',
          },
          { clipPath: 'inset(-0.3em -0.03em)', transform: 'none' },
        ],
        { duration: 210 / speed, easing: 'steps(3, jump-none)' },
      ).finished;
      glyph.textContent = c.final;
    }),
  ).then(() => !cancelled && setTimeout(() => restore(el), 250));

  return {
    destroy() {
      cancelled = true;
      restore(el);
    },
  };
};
