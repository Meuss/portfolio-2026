/**
 * Crosshair (fine pointers only): two hairlines cross at the pointer with a
 * live mono readout ("X 0412 · Y 0233"). Over a link, button or field it snaps:
 * orange corner ticks frame the element and the readout measures it ("184 × 48").
 *
 * - The native cursor stays; everything here is an aria-hidden overlay.
 * - Movement eases (~0.25 lerp) and the loop stops once settled.
 * - Reduced motion: same overlay, no easing.
 */
import './cursor-crosshair.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const SNAP = 'a, button, [role="button"], input, textarea, select, label';
const RETICLE = 14; // px, the frame's size when not snapped
const PAD = 5; // px of air between a snapped element and its frame

const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');

export const mount: FxMount = (_host, initial) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return { destroy() {} };
  const instant = prefersReducedMotion();
  let params: FxParams = { ...initial };

  const root = document.createElement('div');
  root.className = 'fx-cross';
  root.setAttribute('aria-hidden', 'true');
  const h = document.createElement('div');
  h.className = 'fx-cross-h';
  const v = document.createElement('div');
  v.className = 'fx-cross-v';
  const frame = document.createElement('div');
  frame.className = 'fx-cross-frame';
  frame.append(...[0, 1, 2, 3].map(() => document.createElement('span')));
  const label = document.createElement('div');
  label.className = 'fx-cross-label';
  root.append(h, v, frame, label);
  document.body.append(root);

  const pointer = { x: 0, y: 0 };
  // Current (eased) and target geometry: cross point + frame box.
  const cur = { x: 0, y: 0, l: 0, t: 0, w: RETICLE, h: RETICLE };
  const tgt = { ...cur };
  let snapped: Element | null = null;
  let placed = false;
  let raf = 0;

  const computeTarget = () => {
    if (snapped && params.snap && snapped.isConnected) {
      const r = snapped.getBoundingClientRect();
      tgt.l = r.left - PAD;
      tgt.t = r.top - PAD;
      tgt.w = r.width + PAD * 2;
      tgt.h = r.height + PAD * 2;
      tgt.x = r.left + r.width / 2;
      tgt.y = r.top + r.height / 2;
    } else {
      tgt.x = pointer.x;
      tgt.y = pointer.y;
      tgt.l = pointer.x - RETICLE / 2;
      tgt.t = pointer.y - RETICLE / 2;
      tgt.w = tgt.h = RETICLE;
    }
  };

  const paint = () => {
    h.style.transform = `translateY(${cur.y}px)`;
    v.style.transform = `translateX(${cur.x}px)`;
    frame.style.transform = `translate(${cur.l}px, ${cur.t}px)`;
    frame.style.width = `${cur.w}px`;
    frame.style.height = `${cur.h}px`;
    const isSnapped = Boolean(snapped && params.snap);
    root.classList.toggle('is-snapped', isSnapped);
    if (isSnapped) {
      const r = snapped!.getBoundingClientRect();
      label.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      label.style.transform = `translate(${cur.l}px, ${cur.t + cur.h + 6}px)`;
    } else {
      label.textContent = params.coords ? `X ${pad4(pointer.x)} · Y ${pad4(pointer.y)}` : '';
      label.style.transform = `translate(${cur.x + 12}px, ${cur.y + 12}px)`;
    }
  };

  const tick = () => {
    computeTarget();
    const k = instant ? 1 : 0.25;
    let moving = false;
    for (const key of ['x', 'y', 'l', 't', 'w', 'h'] as const) {
      const d = tgt[key] - cur[key];
      cur[key] = Math.abs(d) < 0.2 ? tgt[key] : cur[key] + d * k;
      if (cur[key] !== tgt[key]) moving = true;
    }
    paint();
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    snapped = e.target instanceof Element ? e.target.closest(SNAP) : null;
    if (!placed) {
      placed = true;
      computeTarget();
      Object.assign(cur, tgt);
    }
    root.classList.add('is-on');
    kick();
  };
  const onLeave = () => root.classList.remove('is-on');
  // Typing in a field: the crosshair steps back (by the `typing` param) so it
  // doesn't sit over what's being written.
  const FIELD = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
  const onFocus = () => {
    const active = document.activeElement;
    root.classList.toggle('is-typing', active instanceof Element && active.matches(FIELD));
  };
  const applyTyping = () =>
    root.style.setProperty('--fx-cross-typing', String(1 - (params.typing ?? 0.8)));
  applyTyping();
  onFocus();
  // A snapped frame follows its element while the page scrolls.
  const onScroll = () => placed && kick();

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  document.addEventListener('focusin', onFocus);
  document.addEventListener('focusout', onFocus);

  return {
    update(next) {
      params = { ...next };
      applyTyping();
      if (placed) kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      root.remove();
    },
  };
};
