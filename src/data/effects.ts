// The effect slots still being tuned. Pick variants live with the dev-only FX
// panel (`pnpm dev`, bottom-left) and press "Save as default": it rewrites
// this file. Slots, variants and param ranges live in `effects-registry.ts`.
// Decided effects are not here: see `src/components/islands/fx/fixed.ts`.
import type { FxConfig } from './effects-registry';

export const effects: FxConfig = {
  heroBackground: {
    variant: 'glitch',
    params: { intensity: 0.5, speed: 0.05, cell: 31, accent: 0 },
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
  mobileMenu: { variant: 'staggered', params: { speed: 1 } },
  howTimeline: { variant: 'fill', params: { start: 0.7, end: 0.5, smooth: 0.3 } },
  approachHeading: {
    variant: 'reveal',
    params: { opacity: 0.1, blur: 4, rotation: 3, start: 0.9, end: 0.7 },
  },
};
