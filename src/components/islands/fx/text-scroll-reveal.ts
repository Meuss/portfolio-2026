/**
 * Scroll reveal (React Bits "Scroll Reveal", ported): a heading's words go from
 * a low opacity (and a blur) to full, one after another, as the heading scrolls
 * up through the viewport, while the whole block straightens from a slight
 * rotation. Scrubbed: it follows the scroll position both ways.
 *
 * - Timing follows React Bits: every word fades over half of the scrub and
 *   each next word starts 0.05 later, so the words overlap in a soft wave.
 * - The scrub starts when the heading's top crosses `start` (a fraction of the
 *   viewport height, measured from the top) and is complete when its bottom
 *   crosses `end`, so it always ends with the heading on screen. `opacity` is
 *   the words' starting opacity, `blur` their starting blur in px (0 = none),
 *   `rotation` the block's starting angle in degrees.
 * - The words are plain inline spans around the original text (the whitespace
 *   between them stays as text), so the heading wraps exactly as before, reads
 *   as one string to assistive tech and stays selectable. `destroy()` puts the
 *   original text nodes and `style` attribute back.
 * - Per frame: one layout read (the parent's box, which the rotation doesn't
 *   move), then the writes, only for the words whose value changed. The passive
 *   scroll listener is attached only while the heading is near the viewport;
 *   away from it the words settle at full (scrolled past) or dim (not reached).
 * - The dimmed state only exists once the first frame has painted from the
 *   current scroll position. If the heading is already on screen then, the
 *   words ease into it instead of dimming in one frame.
 * - Reduced motion: no-op; the plain heading stays.
 */
import './text-scroll-reveal.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** React Bits' scrub constants: each word's share of the scrub, and the gap between words. */
const SPAN = 0.5;
const GAP = 0.05;
/** Breakable whitespace only: no-break spaces stay inside their word. */
const SPACES = /([^\S\u00a0\u202f]+)/;

/** Wrap every word of every text node in an inline span; returns how to undo it. */
function split(host: HTMLElement) {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode())
    if ((walker.currentNode as Text).data) texts.push(walker.currentNode as Text);
  const words: HTMLSpanElement[] = [];
  const swaps = texts.map((text) => {
    // Splitting on a capturing group alternates words (even) and spaces (odd).
    const nodes = text.data.split(SPACES).flatMap<ChildNode>((part, i) => {
      if (!part) return [];
      if (i % 2) return [document.createTextNode(part)];
      const word = document.createElement('span');
      word.className = 'fx-scroll-reveal-word';
      word.textContent = part;
      words.push(word);
      return [word];
    });
    text.replaceWith(...nodes);
    return { text, nodes };
  });
  const restore = () =>
    swaps.forEach(({ text, nodes }) => {
      nodes[0]?.before(text);
      nodes.forEach((n) => n.remove());
    });
  return { words, restore };
}

export const mount: FxMount = (host, params) => {
  const parent = host.parentElement;
  if (!parent || !host.textContent?.trim() || prefersReducedMotion()) return { destroy() {} };

  let p: FxParams = { ...params };
  const style = host.getAttribute('style');
  const { words, restore } = split(host);
  /** Last written reveal per word (-1 = not written yet) and the last rotation. */
  const last = words.map(() => -1);
  let lastAngle = NaN;
  let offset = 0;
  let height = 0;
  let raf = 0;
  let listening = false;
  let painted = false;
  let intro = 0;

  // Geometry that only changes with the layout: read on resize, not per frame.
  const layout = () => {
    offset = host.offsetParent === parent ? host.offsetTop : host.offsetTop - parent.offsetTop;
    height = host.offsetHeight;
  };

  const frame = () => {
    raf = 0;
    // Read once: the parent isn't rotated, so the rotation never feeds back.
    const top = parent.getBoundingClientRect().top + offset;
    const vh = window.innerHeight;
    const start = p.start ?? 0.9;
    const end = Math.min(p.end ?? 0.55, start);
    const progress = clamp01((start * vh - top) / (height + (start - end) * vh || 1));

    // …then write.
    if (!painted) {
      painted = true;
      if (top < vh && top + height > 0 && progress < 1) {
        host.classList.add('fx-scroll-reveal--intro');
        intro = window.setTimeout(() => host.classList.remove('fx-scroll-reveal--intro'), 450);
      }
      host.classList.add('fx-scroll-reveal');
    }
    const base = clamp01(p.opacity ?? 0.1);
    const blur = Math.max(0, p.blur ?? 0);
    const at = progress * (SPAN + Math.max(0, words.length - 1) * GAP);
    words.forEach((word, i) => {
      const t = clamp01((at - i * GAP) / SPAN);
      if (t === last[i]) return;
      last[i] = t;
      word.style.opacity = t >= 1 ? '' : (base + (1 - base) * t).toFixed(3);
      word.style.filter = blur && t < 1 ? `blur(${(blur * (1 - t)).toFixed(2)}px)` : '';
    });
    const angle = (p.rotation ?? 0) * (1 - progress);
    if (angle !== lastAngle) {
      lastAngle = angle;
      host.style.rotate = angle ? `${angle.toFixed(3)}deg` : '';
    }
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) {
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });
    } else {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    }
  };

  // Only follow the scroll while the heading is within half a viewport of the
  // screen. One last frame on the way out settles the words at full or dim.
  const io = new IntersectionObserver(
    ([entry]) => {
      listen(entry.isIntersecting);
      request();
    },
    { rootMargin: '50% 0px' },
  );
  const ro = new ResizeObserver(() => {
    layout();
    request();
  });

  layout();
  io.observe(host);
  ro.observe(host);

  return {
    update(next) {
      p = { ...next };
      last.fill(-1);
      lastAngle = NaN;
      request();
    },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(intro);
      io.disconnect();
      ro.disconnect();
      listen(false);
      restore();
      host.classList.remove('fx-scroll-reveal', 'fx-scroll-reveal--intro');
      if (style === null) host.removeAttribute('style');
      else host.setAttribute('style', style);
    },
  };
};
