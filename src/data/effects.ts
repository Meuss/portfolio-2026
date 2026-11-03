// The effects the site ships with. Pick variants live with the dev-only FX
// panel (`pnpm dev`, bottom-left) and press "Save as default": it rewrites
// this file. Slots, variants and param ranges live in `effects-registry.ts`.
import type { FxConfig } from './effects-registry';

export const effects: FxConfig = {
  heroBackground: {
    variant: 'glitch',
    params: { intensity: 0.7, speed: 0.05, cell: 31, accent: 0 },
  },
  heroWall: {
    variant: 'swap',
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
  heroName: { variant: 'scramble', params: { speed: 1 } },
  cursor: { variant: 'glow', params: { intensity: 0.25, trail: 0.4, accent: 0.1 } },
  primaryButton: { variant: 'star', params: { orbit: 3, intensity: 0.7, hover: 1 } },
  featuredMedia: { variant: 'refine', params: { stages: 4, speed: 1.6, stagger: 130 } },
  workMedia: { variant: 'tilt', params: { angle: 8, glare: 0.5 } },
  mobileMenu: { variant: 'staggered', params: { speed: 1 } },
  aboutPortrait: { variant: 'lanyard', params: { swing: 0.4, length: 4 } },
  contactLead: { variant: 'scrambled', params: { radius: 100, duration: 1.2, speed: 0.5 } },
  notFound: { variant: 'fuzzy', params: { intensity: 0.18, hover: 0.5, range: 30 } },
};
