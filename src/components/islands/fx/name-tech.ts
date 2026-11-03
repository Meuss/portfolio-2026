/**
 * Tech text (fine pointers only): letters of the hero name near the pointer
 * turn into dashed orange vector outlines that march slowly, easing back to solid
 * ink as the pointer moves away.
 *
 * - Each letter keeps its real glyph plus an inline SVG <text> of the same
 *   glyph, aligned on the measured HTML baseline; the h1 keeps an aria-label
 *   and the wrapper is aria-hidden, so the name is read once.
 * - Shares the h1 with the entrance variants (name-cells.ts): it waits while an
 *   `.fx-board` is up and re-wraps whenever the plain text comes back.
 * - Reduced motion: outlines still follow the pointer, without marching.
 */
import './name-tech.css';
import type { FxMount, FxParams } from './types';

const NS = 'http://www.w3.org/2000/svg';

interface Letter {
  el: HTMLElement;
  o: number;
}

export const mount: FxMount = (host, initial) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return { destroy() {} };

  let params: FxParams = { ...initial };
  // Remember the real text before wrapping, so entrances never read our layers back.
  host.dataset.fxText ??= host.textContent?.trim() ?? '';
  const text = host.dataset.fxText;
  const ownLabel = !host.hasAttribute('aria-label');
  if (ownLabel) host.setAttribute('aria-label', text);

  let wrapper: HTMLElement | null = null;
  let letters: Letter[] = [];

  const applyParams = () => {
    const dash = params.dash ?? 6;
    const gap = Math.max(2, Math.round(dash * 0.7));
    host.style.setProperty('--fx-tech-dash', `${dash}px ${gap}px`);
    host.style.setProperty('--fx-tech-period', `${dash + gap}px`);
  };

  /** Put each SVG outline's baseline exactly on the HTML glyph's baseline. */
  const alignBaselines = () => {
    const first = letters[0]?.el;
    if (!first) return;
    const marker = document.createElement('span');
    marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    first.append(marker);
    const baseline = marker.getBoundingClientRect().top - first.getBoundingClientRect().top;
    marker.remove();
    for (const l of letters) l.el.querySelector('text')?.setAttribute('y', String(baseline));
  };

  const wrap = () => {
    const root = document.createElement('span');
    root.className = 'fx-tech';
    root.setAttribute('aria-hidden', 'true');
    const made: Letter[] = [];
    for (const word of text.split(/(\s+)/)) {
      if (!word) continue;
      if (/^\s+$/.test(word)) {
        root.append(word);
        continue;
      }
      const w = document.createElement('span');
      w.className = 'fx-tech-word';
      for (const ch of word) {
        const letter = document.createElement('span');
        letter.className = 'fx-tech-letter';
        const glyph = document.createElement('span');
        glyph.className = 'fx-tech-glyph';
        glyph.textContent = ch;
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'fx-tech-outline');
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', '0');
        t.textContent = ch;
        svg.append(t);
        letter.append(glyph, svg);
        w.append(letter);
        made.push({ el: letter, o: 0 });
      }
      root.append(w);
    }
    wrapper = root;
    letters = made;
    host.replaceChildren(root);
    alignBaselines();
  };

  /** Wrap whenever the h1 shows plain text again; stand aside while an entrance board is up. */
  const sync = () => {
    if (host.querySelector('.fx-board')) {
      wrapper = null;
      letters = [];
      return;
    }
    if (!wrapper || !wrapper.isConnected) wrap();
  };
  const mo = new MutationObserver(sync);
  mo.observe(host, { childList: true });

  // --- Pointer falloff ---------------------------------------------------
  const pointer = { x: -1e4, y: -1e4 };
  let raf = 0;
  const tick = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const reach = (params.radius ?? 6) * rem;
    let moving = false;
    for (const l of letters) {
      const r = l.el.getBoundingClientRect();
      const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
      const target = Math.pow(Math.max(0, 1 - d / reach), 1.4);
      l.o += (target - l.o) * 0.2;
      if (Math.abs(target - l.o) < 0.004) l.o = target;
      else moving = true;
      l.el.style.setProperty('--o', l.o.toFixed(3));
    }
    wrapper?.classList.toggle(
      'is-active',
      letters.some((l) => l.o > 0.01),
    );
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    kick();
  };
  const onLeave = () => {
    pointer.x = pointer.y = -1e4;
    kick();
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', alignBaselines);
  document.documentElement.addEventListener('pointerleave', onLeave);

  applyParams();
  document.fonts.ready.then(() => {
    sync();
    alignBaselines();
  });

  return {
    update(next) {
      params = { ...next };
      applyParams();
      kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', alignBaselines);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (wrapper?.isConnected) host.replaceChildren(text);
      host.style.removeProperty('--fx-tech-dash');
      host.style.removeProperty('--fx-tech-period');
      if (ownLabel) host.removeAttribute('aria-label');
    },
  };
};
