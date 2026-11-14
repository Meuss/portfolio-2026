/**
 * Every effect on the site: the module each slot runs and its settings. This
 * table is the only place they are chosen; to change an effect, edit its entry
 * (what each param does is documented at the top of its module).
 *
 * `runtime.ts` mounts an entry into every `[data-fx-slot~="<slot>"]` element
 * (the cursor on <body>) and imports its module on demand. A slot name in the
 * markup without an entry here does nothing: `effects.test.ts` keeps the two
 * in step.
 */
import type { FxLoader, FxParams } from './types';

interface Fx {
  load: FxLoader;
  params: FxParams;
}

// The same tilt on the homepage's featured cards and on /work.
const tilt: Fx = { load: () => import('./media-tilt'), params: { angle: 8, glare: 0.5 } };

export const effects = {
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
  workTeaser: {
    load: () => import('./card-pixel'),
    params: { gap: 5, speed: 35, accent: 0.15, spotlight: 0.5 },
  },
  aboutPortrait: { load: () => import('./portrait-lanyard'), params: { swing: 0.4, length: 4 } },
  notFound: {
    load: () => import('./text-fuzzy'),
    params: { intensity: 0.18, hover: 0.5, range: 30 },
  },
  heroBackground: {
    load: () => import('./bg-glitch'),
    params: { intensity: 0.5, speed: 0.05, cell: 31, accent: 0 },
  },
  heroWall: {
    load: () => import('./wall-swap'),
    params: {
      distance: 48,
      vertical: 19,
      depth: 157,
      skew: 0,
      radius: 10,
      delay: 2750,
      speed: 1.05,
      bounce: 0,
      parallax: 0.6,
      spread: 0,
      dim: 0.7,
      autoplay: 1,
      pause: 1,
      drag: 1,
    },
  },
  mobileMenu: { load: () => import('./menu-staggered'), params: { speed: 1 } },
  howTimeline: {
    load: () => import('./timeline-fill'),
    params: { start: 0.7, end: 0.5, smooth: 0.3 },
  },
  approachHeading: {
    load: () => import('./text-scroll-reveal'),
    params: { opacity: 0.1, blur: 4, rotation: 3, start: 0.9, end: 0.7 },
  },
} satisfies Record<string, Fx>;

export type FxSlot = keyof typeof effects;
