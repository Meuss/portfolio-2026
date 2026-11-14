export type FxParams = Record<string, number>;

/** Mounts an effect into one host element, for as long as the page lives. */
export type FxMount = (host: HTMLElement, params: FxParams) => void;

/** An effect module, imported on demand. */
export type FxLoader = () => Promise<{ mount: FxMount }>;

/**
 * The contract of an experiment module (`lab/<slot>/<variant>.ts`). Unlike a
 * decided effect, the dev FX panel swaps it in and out and tunes it while the
 * page stays open, so it has to be removable.
 *
 * `mount(host, params)` runs once per element carrying the slot, after the
 * fonts are ready, and again every time the panel switches to this variant. It
 * sets the effect up synchronously and returns its instance.
 * - `host` is the slot's element (each slot file says which and what a variant
 *   may change in it). Other effects can live on it or inside it: only touch
 *   what the module itself added.
 * - `params` holds every param the slot file declares for the variant, as
 *   numbers. Read them, don't write to the object.
 *
 * `destroy()` is called once, before another variant (or the same one) mounts
 * on the same host. It must leave the host and the document exactly as `mount`
 * found them:
 * - remove every node the module added, and put back any it moved or replaced;
 * - remove every class, attribute, inline style and custom property it set,
 *   on the host and anywhere else (restore the previous value if there was one);
 * - remove every listener (host, window, document, media queries), disconnect
 *   every observer, and cancel every animation frame, timer and animation.
 * A second `mount` after a `destroy` must work like the first.
 *
 * The module's stylesheet is not removed by `destroy` (in dev, the CSS of every
 * variant tried stays in the page), so each rule must sit under a class that
 * `mount` adds and `destroy` removes. Never style the host through its tag, its
 * utility classes or `[data-fx-slot]`.
 *
 * `update(params)` is optional: it applies new values to the running effect
 * while a slider is dragged. Without it, the runtime calls `destroy()` and
 * `mount()` again on every change, which is fine for an effect that is cheap
 * to set up.
 */
export interface FxInstance {
  update?(params: FxParams): void;
  destroy(): void;
}

/** `mount` of an experiment module: see `FxInstance`. */
export type FxLabMount = (host: HTMLElement, params: FxParams) => FxInstance;

/** An experiment module, imported on demand. */
export type FxLabLoader = () => Promise<{ mount: FxLabMount }>;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A colour token (`--color-accent`, …) as [r, g, b] 0–255, read live so effects follow the palette. */
export function tokenRgb(name: string): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`);
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillStyle = value.trim() || '#000'; // normalises any CSS colour to #rrggbb
  const hex = ctx.fillStyle.startsWith('#') ? ctx.fillStyle.slice(1) : '000000';
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

export const rgbCss = ([r, g, b]: number[], alpha = 1) => `rgb(${r} ${g} ${b} / ${alpha})`;
