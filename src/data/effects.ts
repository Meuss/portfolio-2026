// The effects the site ships with. Pick variants live with the dev-only FX
// panel (`pnpm dev`, bottom-left) and press "Save as default": it rewrites
// this file. Slots, variants and param ranges live in `effects-registry.ts`.
import type { FxConfig } from './effects-registry';

export const effects: FxConfig = {
  heroBackground: { variant: 'ascii', params: { intensity: 1.2, speed: 0.6, cell: 15, ruby: 0 } },
  heroWall: {
    variant: 'swap',
    params: {
      distance: 36,
      vertical: 30,
      depth: 70,
      skew: 1,
      radius: 10,
      delay: 3250,
      speed: 0.6,
      bounce: 0,
      parallax: 0.6,
      spread: 0,
      dim: 0.7,
      autoplay: 1,
      pause: 1,
      drag: 1,
    },
  },
  heroName: { variant: 'decode', params: { speed: 1.3 } },
  heroNameHover: { variant: 'off', params: {} },
  logo: { variant: 'off', params: {} },
  cursor: { variant: 'off', params: {} },
  contactCursor: { variant: 'crosshair', params: { snap: 1, coords: 1, typing: 0.8 } },
  primaryButton: { variant: 'star', params: { orbit: 3.5, intensity: 0.95, hover: 1 } },
  featuredMedia: { variant: 'refine', params: { stages: 4, speed: 1, stagger: 150 } },
  workMedia: { variant: 'tilt', params: { angle: 8, glare: 0.5 } },
  ctaBackground: { variant: 'off', params: {} },
  mobileMenu: { variant: 'staggered', params: { speed: 1 } },
  aboutPortrait: { variant: 'lanyard', params: { swing: 0.4, length: 4 } },
  contactOrb: { variant: 'off', params: {} },
  contactHeading: { variant: 'tech', params: { radius: 6, dash: 6 } },
  contactLead: { variant: 'scrambled', params: { radius: 100, duration: 1.2, speed: 0.5 } },
  notFound: { variant: 'fuzzy', params: { intensity: 0.18, hover: 0.5, range: 30 } },
};
