// The choices saved from the dev FX panel ("Save as default"), which rewrites
// this whole file. A slot listed here runs this variant instead of the default
// its slot file declares; entries for a slot or a variant that no longer exists
// are ignored. Not edited by hand, except to delete an entry.
import type { FxLabConfig } from './spec';

export const saved: FxLabConfig = {
  approachBackground: { variant: 'glowTop', params: { intensity: 0.7, accent: 0.3, grain: 0.5 } },
  servicesList: {
    variant: 'bento',
    params: {
      spotlight: 300,
      glow: 0.7,
      particles: 24,
      tilt: 0,
      magnetism: 0,
      ripple: 1,
      layout: 2,
    },
  },
};
