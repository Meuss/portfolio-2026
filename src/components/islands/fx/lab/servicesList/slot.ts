/**
 * Experiment: other presentations of the services section (homepage).
 *
 * Host: the `<section>` of `ServiceBlocks.astro`, so a variant can reach the
 * whole section: the two-column grid, the sticky heading column on the left
 * and, on the right, the `<ol>` of five services (the section's only `<ol>`;
 * each row is an `li.service` holding an `h3` title and a muted `p` blurb)
 * followed by the "also" block of capabilities.
 *
 * A variant may:
 * - add classes to the host and style or re-lay-out anything in the section
 *   from them (its stylesheet is unlayered, so it wins over the Tailwind
 *   utilities in the markup without `!important`);
 * - add decorative `aria-hidden` nodes, listeners, and inline custom
 *   properties on the rows.
 *
 * A variant may not:
 * - remove, reorder, move or rewrite the content: the text stays the markup
 *   Astro rendered (both languages, readable without JS) and the `<ol>` keeps
 *   its five `<li>` in order;
 * - set `opacity`, `transform` or `transition` on a row or on the "also"
 *   block: those belong to their scroll reveal (`[data-reveal]` in
 *   `global.css`). Animate a child or a pseudo-element instead.
 */
import type { FxLabSlot } from '../spec';

export default {
  default: 'off',
  variants: {
    flowing: { load: () => import('./flowing'), params: { speed: 60, duration: 0.5, magnet: 0 } },
    bento: {
      load: () => import('./bento'),
      params: { spotlight: 300, glow: 0.7, particles: 12, tilt: 1, magnetism: 1, ripple: 1 },
    },
  },
  panel: import.meta.env.DEV && {
    label: 'Services',
    where: 'Home, services',
    variants: {
      flowing: {
        label: 'Flowing menu',
        params: {
          speed: { label: 'Marquee speed (px/s)', min: 0, max: 200, step: 5 },
          duration: { label: 'Slide duration (s)', min: 0.2, max: 1.5, step: 0.05 },
          magnet: { label: 'Lean to pointer', min: 0, max: 0.5, step: 0.05 },
        },
      },
      bento: {
        label: 'Magic bento',
        params: {
          spotlight: { label: 'Spotlight radius (px)', min: 100, max: 600, step: 10 },
          glow: { label: 'Glow strength', min: 0, max: 1, step: 0.05 },
          particles: { label: 'Particles per tile', min: 0, max: 48, step: 1 },
          tilt: { label: 'Tilt (0/1)', min: 0, max: 1, step: 1 },
          magnetism: { label: 'Magnetism (0/1)', min: 0, max: 1, step: 1 },
          ripple: { label: 'Click ripple (0/1)', min: 0, max: 1, step: 1 },
        },
      },
    },
  },
} satisfies FxLabSlot;
