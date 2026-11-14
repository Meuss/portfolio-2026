/**
 * Experiment: a background for the approach section (homepage).
 *
 * Host: the `<section>` of `Approach.astro`. Its content is one wrapper `<div>`
 * holding the heading (which has its own decided effect, `approachHeading`)
 * and the three reasons (`data-reveal`). A variant never touches that content.
 *
 * A variant does one of two things:
 * - restyle the section itself through a class on the host (`surface.ts`);
 * - draw behind the content: get the layer from `addLayer(host)` in
 *   `layer.ts` and put a canvas or styled elements inside it. The layer is an
 *   `aria-hidden` `<div>` inserted as the section's first child, filling the
 *   section, clipped to it, under the content and without pointer events;
 *   while it is there the section is positioned and is its own stacking
 *   context (`layer.css`). Call the returned `remove()` in `destroy()`.
 *
 * Whatever a variant draws stays behind running text: keep it dark enough for
 * `ink` and `muted` text to hold AA contrast (4.5:1) everywhere, take every
 * colour from the tokens, give reduced motion a still version, and stop any
 * loop while the section is off-screen or the tab is hidden.
 */
import type { FxLabSlot } from '../spec';

export default {
  default: 'off',
  variants: {
    surface: { load: () => import('./surface'), params: {} },
  },
  panel: import.meta.env.DEV && {
    label: 'Approach background',
    where: 'Home, approach',
    variants: {
      surface: { label: 'Flat tone', params: {} },
    },
  },
} satisfies FxLabSlot;
