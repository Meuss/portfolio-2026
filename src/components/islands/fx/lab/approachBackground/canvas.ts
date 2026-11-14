/**
 * What the canvas backgrounds of this slot share (`dots`, `squares`, `waves`):
 * one canvas in the layer from `layer.ts`, sized to it at the device pixel
 * ratio (capped at 2); a frame loop that runs only while the section is near
 * the viewport and the tab is visible, and sleeps when the variant says it has
 * nothing left to animate; the pointer in layer coordinates (mouse and pen
 * only: touch shows the resting animation); and the palette, with a ceiling on
 * how bright anything drawn may be so the text on top keeps AA contrast.
 *
 * Under reduced motion there is no loop and no pointer: one still frame,
 * redrawn when the section is resized.
 */
import './canvas.css';
import { addLayer } from './layer';
import { prefersReducedMotion, tokenRgb } from '../../types';

export type Rgb = [number, number, number];

const linear = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
/** WCAG relative luminance. */
export const luminance = ([r, g, b]: Rgb) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
export const mix = (a: Rgb, b: Rgb, k: number): Rgb => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];
const css = ([r, g, b]: Rgb) => `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

/**
 * The palette, read from the tokens, and `tone(colour, k)`: the ground mixed
 * toward a colour by `k`, as an opaque CSS colour, pulled back toward the
 * ground when it would be brighter than `limit`. `limit` is the brightest a
 * pixel behind `muted` text may be for 4.5:1 (aiming at 4.7:1, a margin for
 * rounding and antialiasing), so no
 * param value or pointer state can break AA. `ink` text has far more room.
 */
export function palette() {
  const [paper, line, faint, muted, accent] = ['paper', 'line', 'faint', 'muted', 'accent'].map(
    (name) => tokenRgb(name) as Rgb,
  );
  const limit = (luminance(muted) + 0.05) / 4.7 - 0.05;
  /** A colour as an opaque CSS colour, pulled toward the ground if it is brighter than `limit`. */
  const cap = (colour: Rgb) => {
    if (luminance(colour) <= limit) return css(colour);
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (luminance(mix(paper, colour, mid)) > limit) hi = mid;
      else lo = mid;
    }
    return css(mix(paper, colour, lo));
  };
  const tone = (to: Rgb, k: number) => cap(mix(paper, to, Math.min(1, Math.max(0, k))));
  return { paper, line, faint, muted, accent, limit, cap, tone };
}

export interface CanvasVariant {
  /** The layer's CSS size changed (and on mount): rebuild what depends on it. */
  resize(width: number, height: number): void;
  /** Advance the simulation by `dt` seconds. Return `false` once at rest: the loop then sleeps until `wake()`. */
  step(dt: number): boolean;
  /** Draw the current state, in CSS pixels (the transform for the pixel ratio is set). */
  draw(ctx: CanvasRenderingContext2D): void;
  /** Pointer in layer coordinates; `inside` is whether it is over the section. */
  move?(x: number, y: number, inside: boolean, time: number): void;
  down?(x: number, y: number): void;
  leave?(): void;
}

export function canvasBackground(host: HTMLElement, variant: CanvasVariant, className = '') {
  const { layer, remove } = addLayer(host);
  const canvas = document.createElement('canvas');
  canvas.className = `fx-approach-canvas ${className}`.trim();
  layer.append(canvas);
  const ctx = canvas.getContext('2d')!;
  const still = prefersReducedMotion();
  const view = { width: 0, height: 0, ratio: 1 };
  let near = false;
  let raf = 0;
  let last = 0;
  let inside = false;

  const paint = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);
    variant.draw(ctx);
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const busy = variant.step(dt);
    paint();
    if (busy && near && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const wake = () => {
    if (still || raf || !near || document.hidden || !view.width) return;
    raf = requestAnimationFrame(frame);
  };
  const sleep = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };

  const fit = (width: number, height: number) => {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    if (width === view.width && height === view.height && ratio === view.ratio) return;
    const resized = width !== view.width || height !== view.height;
    Object.assign(view, { width, height, ratio });
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    if (resized) variant.resize(width, height);
    paint();
    wake();
  };
  const ro = new ResizeObserver(([entry]) =>
    fit(entry.contentRect.width, entry.contentRect.height),
  );
  // A change of pixel ratio alone (zoom, another screen) does not resize the layer.
  let ratioQuery: MediaQueryList | null = null;
  const onRatio = () => {
    ratioQuery?.removeEventListener('change', onRatio);
    ratioQuery = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    ratioQuery.addEventListener('change', onRatio);
    if (view.width) fit(view.width, view.height);
  };
  onRatio();
  // "Near": within half a viewport of the screen, so the loop is warm when it scrolls in.
  const io = new IntersectionObserver(
    ([entry]) => {
      near = entry.isIntersecting;
      if (near) wake();
      else sleep();
    },
    { rootMargin: '50% 0px' },
  );
  const onVisibility = () => (document.hidden ? sleep() : wake());

  const locate = (event: PointerEvent) => {
    const rect = layer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !near) return;
    const p = locate(event);
    if (!p.inside && !inside) return;
    inside = p.inside;
    variant.move?.(p.x, p.y, p.inside, event.timeStamp || performance.now());
    wake();
  };
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !near) return;
    const p = locate(event);
    if (!p.inside) return;
    variant.down?.(p.x, p.y);
    wake();
  };
  const onLeave = () => {
    if (!inside) return;
    inside = false;
    variant.leave?.();
    wake();
  };
  const root = document.documentElement;

  ro.observe(layer);
  io.observe(layer);
  document.addEventListener('visibilitychange', onVisibility);
  if (!still) {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
  }

  return {
    still,
    view,
    /** Redraw now (after a param change) and run the loop if there is motion to show. */
    refresh() {
      if (view.width) paint();
      wake();
    },
    wake,
    destroy() {
      sleep();
      ro.disconnect();
      io.disconnect();
      ratioQuery?.removeEventListener('change', onRatio);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      canvas.remove();
      remove();
    },
  };
}
