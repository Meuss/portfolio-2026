/**
 * Scrambled text: characters within `radius` px of the pointer flicker into
 * gilt `.` and `:` for `duration` seconds, then settle back. The flicker rate
 * follows `speed`.
 *
 * Every character keeps the width of its real glyph (measured once), so the
 * paragraph never reflows while letters swap. The real text stays in the DOM
 * as visually hidden copy for assistive tech; the visible board is aria-hidden.
 * Fine pointers only; reduced motion: no-op. destroy() restores the plain text.
 */
import './text-scrambled.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const CHARS = '.:';

interface Char {
  el: HTMLElement;
  real: string;
  until: number;
}

export const mount: FxMount = (host, params) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || prefersReducedMotion()) return { destroy() {} };

  let p: FxParams = { ...params };
  const original = host.textContent ?? '';
  const chars: Char[] = [];

  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = original;
  const board = document.createElement('span');
  board.setAttribute('aria-hidden', 'true');

  for (const part of original.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      board.append(' ');
      continue;
    }
    const word = document.createElement('span');
    word.className = 'fx-scr-word';
    for (const ch of part) {
      const el = document.createElement('span');
      el.className = 'fx-scr-char';
      el.textContent = ch;
      word.append(el);
      chars.push({ el, real: ch, until: 0 });
    }
    board.append(word);
  }
  host.replaceChildren(sr, board);
  host.classList.add('fx-scr');

  // Lock each cell to its real glyph's width so swaps never reflow the line.
  const lock = () => {
    chars.forEach((c) => (c.el.style.width = ''));
    const widths = chars.map((c) => c.el.getBoundingClientRect().width);
    chars.forEach((c, i) => (c.el.style.width = `${widths[i]}px`));
  };
  lock();

  let raf = 0;
  let lastSwap = 0;
  const tick = (now: number) => {
    const swap = now - lastSwap > 45 / Math.max(0.1, p.speed ?? 0.5);
    if (swap) lastSwap = now;
    let active = 0;
    for (const c of chars) {
      if (!c.until) continue;
      if (now >= c.until) {
        c.until = 0;
        c.el.textContent = c.real;
        c.el.classList.remove('is-scrambled');
        continue;
      }
      active++;
      if (swap) c.el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    raf = active ? requestAnimationFrame(tick) : 0;
  };

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    const radius = p.radius ?? 100;
    // Cheap reject: pointer nowhere near the paragraph.
    if (
      e.clientX < r.left - radius ||
      e.clientX > r.right + radius ||
      e.clientY < r.top - radius ||
      e.clientY > r.bottom + radius
    )
      return;
    const now = performance.now();
    const hold = (p.duration ?? 1.2) * 1000;
    for (const c of chars) {
      const b = c.el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
      if (d > radius) continue;
      // Closer letters stay scrambled a little longer.
      c.until = Math.max(c.until, now + hold * (1 - (d / radius) * 0.5));
      c.el.classList.add('is-scrambled');
    }
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const ro = new ResizeObserver(() => lock());
  ro.observe(host);
  window.addEventListener('pointermove', onMove, { passive: true });

  return {
    update(next) {
      p = { ...next };
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      host.classList.remove('fx-scr');
      host.replaceChildren(original);
    },
  };
};
