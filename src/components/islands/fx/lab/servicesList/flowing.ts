/**
 * Flowing Menu: a port of React Bits' `FlowingMenu` (plain JS + CSS flavour)
 * onto the five service rows.
 *
 * When the pointer enters a row, an inverted band (`ink` ground, `paper`
 * text) opens over it from the edge the pointer came in by, carrying a
 * marquee that repeats the row's title with a small `muted` pill between
 * repeats (the original puts an image there). Moving to another row, the
 * band travels there; leaving the list, it closes toward the edge the
 * pointer left by. As in the original, the band is one shape across the list
 * whose top and bottom edges are springs of different stiffness (`stretch`),
 * it leans a little toward the pointer (`magnet`), and the marquee is nudged
 * by the pointer's sideways speed (`follow`).
 *
 * Each row gets an `aria-hidden` band clipped to the shared band's extent, so
 * the band covers the row between its hairlines; the real text stays in the
 * markup, under it. Rows are not links: this is a pointer-only flourish, so on
 * touch screens, for keyboard users and under reduced motion nothing is added.
 *
 * Params:
 * - `speed`: marquee speed in px per second (original default 60).
 * - `duration`: period of the band's springs in seconds; lower is snappier
 *   (original default 0.5).
 * - `magnet`: how far the band leans toward the pointer within its row, as a
 *   share of the pointer's distance from the row's middle (capped at 30% of
 *   the row). The original uses 0.25; at 0, the default here, the settled
 *   band covers its row exactly.
 */
import './flowing.css';
import { prefersReducedMotion, type FxLabMount, type FxParams } from '../../types';

const ROOT = 'fx-svc-flow';
const BAND = 'fx-svc-flow-band';
const TRACK = 'fx-svc-flow-track';
const PART = 'fx-svc-flow-part';
const PART_TEXT = 'fx-svc-flow-text';
const SEPARATOR = 'fx-svc-flow-sep';

// The original's other settings, at its defaults.
const STRETCH = 0.6;
const FOLLOW = 0.4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface Row {
  item: HTMLElement;
  band: HTMLElement;
  track: HTMLElement;
  title: string;
  /** Band box (the row's padding box) in list coordinates. */
  top: number;
  height: number;
  /** Hit box (the whole row, hairline included) in list coordinates. */
  hitTop: number;
  hitHeight: number;
  /** Marquee state. */
  x: number;
  part: number;
  spin: number;
  covered: boolean;
}

export const mount: FxLabMount = (host, params) => {
  const list = host.querySelector<HTMLElement>('ol');
  const items = list ? [...list.querySelectorAll<HTMLElement>(':scope > li.service')] : [];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!list || !items.length || !finePointer || prefersReducedMotion()) return { destroy() {} };

  const settings = { speed: 60, duration: 0.5, magnet: 0 };
  const apply = (next: FxParams) => {
    settings.speed = Math.max(0, next.speed ?? settings.speed);
    settings.duration = Math.max(0.1, next.duration ?? settings.duration);
    settings.magnet = clamp(next.magnet ?? settings.magnet, 0, 1);
  };
  apply(params);

  host.classList.add(ROOT);

  const makePart = (title: string) => {
    const part = document.createElement('span');
    part.className = PART;
    const text = document.createElement('span');
    text.className = PART_TEXT;
    text.textContent = title;
    const separator = document.createElement('span');
    separator.className = SEPARATOR;
    part.append(text, separator);
    return part;
  };

  const rows: Row[] = items.map((item) => {
    const band = document.createElement('div');
    band.className = BAND;
    band.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = TRACK;
    const title = (item.querySelector('h3')?.textContent ?? '').trim();
    track.append(makePart(title));
    band.append(track);
    item.append(band);
    return {
      item,
      band,
      track,
      title,
      top: 0,
      height: 0,
      hitTop: 0,
      hitHeight: 0,
      x: 0,
      part: 0,
      spin: 0,
      covered: false,
    };
  });

  // The shared band, in list coordinates.
  const b = {
    top: 0,
    bottom: 0,
    vTop: 0,
    vBottom: 0,
    toTop: 0,
    toBottom: 0,
    lead: 1,
    shown: false,
    index: -1,
    rest: 0,
  };
  const cursor = { x: 0, y: null as number | null, t: 0, vx: 0 };
  let raf = 0;
  let last = 0;
  let onScreen = true;

  const measure = () => {
    for (const row of rows) {
      row.top = row.item.offsetTop + row.item.clientTop;
      row.height = row.item.clientHeight;
      row.hitTop = row.item.offsetTop;
      row.hitHeight = row.item.offsetHeight;
      // Enough copies of the part to cover the row plus one, so the loop never shows a gap.
      const first = row.track.firstElementChild as HTMLElement | null;
      const width = first?.getBoundingClientRect().width ?? 0;
      if (width > 0) {
        row.part = width;
        row.x = (((row.x % width) + width) % width) - width;
        const copies = Math.max(2, Math.ceil(row.item.getBoundingClientRect().width / width) + 1);
        while (row.track.children.length < copies) row.track.append(makePart(row.title));
        while (row.track.children.length > copies) row.track.lastElementChild!.remove();
      }
    }
    if (b.shown && b.index >= 0) {
      const row = rows[b.index];
      b.toTop = row.top;
      b.toBottom = row.top + row.height;
    }
  };

  const paint = () => {
    for (const row of rows) {
      row.covered = false;
      const from = Math.max(b.top, row.top);
      const to = Math.min(b.bottom, row.top + row.height);
      if (!b.shown || to - from < 0.25) {
        row.band.style.visibility = 'hidden';
      } else {
        row.band.style.visibility = 'visible';
        row.band.style.clipPath = `inset(${(b.top - row.top).toFixed(2)}px 0px ${(row.top + row.height - b.bottom).toFixed(2)}px 0px)`;
        row.covered = (to - from) / row.height > 0.04;
      }
      row.track.style.transform = `translate3d(${row.x.toFixed(2)}px, 0, 0)`;
    }
  };

  const frame = (now: number) => {
    raf = 0;
    const elapsed = clamp((now - last) / 1000, 0, 1 / 20);
    last = now;
    let busy = false;

    if (b.shown) {
      const current = b.index >= 0 ? rows[b.index] : null;
      if (current) {
        const lean =
          cursor.y === null
            ? 0
            : clamp(
                (cursor.y - (current.top + current.height / 2)) * settings.magnet,
                -current.height * 0.3,
                current.height * 0.3,
              );
        b.toTop = current.top + lean;
        b.toBottom = current.top + current.height + lean;
      } else {
        b.toTop = b.toBottom = b.rest;
      }
      const gap = (b.toTop + b.toBottom) / 2 - (b.top + b.bottom) / 2;
      if (Math.abs(gap) > 2) b.lead = gap > 0 ? 1 : -1;
      const omega = (Math.PI * 2) / settings.duration;
      const fast = omega * (1 + 1.1 * STRETCH);
      const slow = omega * (1 - 0.4 * STRETCH);
      const zeta = 1 - 0.3 * STRETCH;
      const wTop = b.lead > 0 ? slow : fast;
      const wBottom = b.lead > 0 ? fast : slow;
      const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
      const dt = elapsed / steps;
      for (let i = 0; i < steps; i++) {
        b.vTop += (-wTop * wTop * (b.top - b.toTop) - 2 * zeta * wTop * b.vTop) * dt;
        b.vBottom +=
          (-wBottom * wBottom * (b.bottom - b.toBottom) - 2 * zeta * wBottom * b.vBottom) * dt;
        b.top += b.vTop * dt;
        b.bottom += b.vBottom * dt;
        if (b.bottom < b.top) {
          const mid = (b.top + b.bottom) / 2;
          const v = (b.vTop + b.vBottom) / 2;
          b.top = b.bottom = mid;
          b.vTop = b.vBottom = v;
        }
      }
      const resting =
        Math.abs(b.top - b.toTop) < 0.1 &&
        Math.abs(b.bottom - b.toBottom) < 0.1 &&
        Math.abs(b.vTop) < 2 &&
        Math.abs(b.vBottom) < 2;
      if (resting) {
        b.top = b.toTop;
        b.bottom = b.toBottom;
        b.vTop = b.vBottom = 0;
        if (b.index < 0 && b.bottom - b.top < 0.5) b.shown = false;
      } else busy = true;
    }

    cursor.vx *= Math.exp(-elapsed / 0.3);
    const push = clamp(cursor.vx * FOLLOW * 0.55, -1600, 1600);

    for (const row of rows) {
      const goal = row.covered ? 1 : 0;
      row.spin += (goal - row.spin) * (1 - Math.exp(-elapsed / 0.35));
      if (Math.abs(goal - row.spin) < 0.002) row.spin = goal;
      if (!row.covered && row.spin === 0) continue;
      busy = true;
      if (row.part <= 0) continue;
      row.x += (-settings.speed + push) * row.spin * elapsed;
      row.x = (((row.x % row.part) + row.part) % row.part) - row.part;
    }

    paint();
    if (busy && onScreen) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (raf || !onScreen) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const goTo = (index: number, from: 'top' | 'bottom') => {
    const row = rows[index];
    const top = row.top;
    const bottom = row.top + row.height;
    if (!b.shown) {
      const start = from === 'bottom' ? bottom : top;
      b.top = b.bottom = start;
      b.vTop = b.vBottom = 0;
      b.shown = true;
    }
    const shift = (top + bottom) / 2 - (b.top + b.bottom) / 2;
    if (Math.abs(shift) > 0.5) b.lead = shift > 0 ? 1 : -1;
    else b.lead = from === 'bottom' ? -1 : 1;
    b.toTop = top;
    b.toBottom = bottom;
    b.index = index;
    kick();
  };

  const release = (toward: 'top' | 'bottom') => {
    if (!b.shown) return;
    const point = toward === 'top' ? b.toTop : b.toBottom;
    b.lead = toward === 'top' ? -1 : 1;
    b.rest = point;
    b.toTop = b.toBottom = point;
    b.index = -1;
    cursor.y = null;
    kick();
  };

  const listY = (clientY: number) => clientY - list.getBoundingClientRect().top;
  const rowAt = (y: number) =>
    rows.findIndex((row) => y >= row.hitTop && y < row.hitTop + row.hitHeight);
  const halfOf = (y: number, index: number): 'top' | 'bottom' => {
    const row = rows[index];
    return y - row.hitTop < row.hitHeight / 2 ? 'top' : 'bottom';
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const now = performance.now();
    const gap = (now - cursor.t) / 1000;
    if (gap > 0 && gap < 0.1) {
      const instant = (event.clientX - cursor.x) / gap;
      cursor.vx += (instant - cursor.vx) * (1 - Math.exp(-gap / 0.08));
    }
    cursor.x = event.clientX;
    cursor.t = now;
    const y = listY(event.clientY);
    cursor.y = y;
    const index = rowAt(y);
    if (index >= 0 && index !== b.index) goTo(index, halfOf(y, index));
    else kick();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || b.index < 0) return;
    const rect = list.getBoundingClientRect();
    if (event.clientY <= rect.top) release('top');
    else if (event.clientY >= rect.bottom) release('bottom');
    else release(halfOf(listY(event.clientY), b.index));
  };

  measure();
  paint();

  const resize = new ResizeObserver(() => {
    measure();
    paint();
    kick();
  });
  resize.observe(list);
  for (const row of rows) resize.observe(row.track.firstElementChild as Element);

  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    if (onScreen) kick();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  visibility.observe(list);

  list.addEventListener('pointermove', onPointerMove);
  list.addEventListener('pointerleave', onPointerLeave);

  return {
    update(next) {
      apply(next);
      kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      resize.disconnect();
      visibility.disconnect();
      list.removeEventListener('pointermove', onPointerMove);
      list.removeEventListener('pointerleave', onPointerLeave);
      for (const row of rows) row.band.remove();
      host.classList.remove(ROOT);
    },
  };
};
