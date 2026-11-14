/**
 * Decided effects: each slot runs one module with constant params. They are not
 * in the dev FX panel; to change one, edit this table.
 *
 * The runtime mounts them the same way as the panel's slots: into every
 * `[data-fx-slot~="<slot>"]` element (the cursor on <body>), imported on demand.
 * A slot decided as "no effect" has no entry here and no `data-fx-slot` in the
 * markup.
 */
import type { FxLoader, FxParams } from './types';

export interface FixedFx {
  load: FxLoader;
  params: FxParams;
}

// The same tilt on the homepage's featured cards and on /work.
const tilt: FixedFx = { load: () => import('./media-tilt'), params: { angle: 8, glare: 0.5 } };

export const fixedFx = {
  heroName: { load: () => import('./name-scramble'), params: { speed: 1 } },
  cursor: {
    load: () => import('./cursor-glow'),
    params: { intensity: 0.25, trail: 0.4, accent: 0.1 },
  },
  primaryButton: {
    load: () => import('./button-star'),
    params: { orbit: 3, intensity: 0.7, hover: 1 },
  },
  featuredMedia: tilt,
  workMedia: tilt,
  aboutPortrait: { load: () => import('./portrait-lanyard'), params: { swing: 0.4, length: 4 } },
  notFound: {
    load: () => import('./text-fuzzy'),
    params: { intensity: 0.18, hover: 0.5, range: 30 },
  },
} satisfies Record<string, FixedFx>;

export type FixedFxSlot = keyof typeof fixedFx;
export const fixedFxSlots = Object.keys(fixedFx) as FixedFxSlot[];
