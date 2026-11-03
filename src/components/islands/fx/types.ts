export type FxParams = Record<string, number>;

/** A mounted effect. `update` applies new params live; `destroy` must leave the host as it found it. */
export interface FxInstance {
  update?(params: FxParams): void;
  destroy(): void;
}

export type FxMount = (host: HTMLElement, params: FxParams, variant: string) => FxInstance;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A colour token (`--color-gilt`, …) as [r, g, b] 0–255, read live so effects follow the palette. */
export function tokenRgb(name: string): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`);
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillStyle = value.trim() || '#000'; // normalises any CSS colour to #rrggbb
  const hex = ctx.fillStyle.startsWith('#') ? ctx.fillStyle.slice(1) : '000000';
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

export const rgbCss = ([r, g, b]: number[], alpha = 1) => `rgb(${r} ${g} ${b} / ${alpha})`;
