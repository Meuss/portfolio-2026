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
  variants: {},
  panel: import.meta.env.DEV && {
    label: 'Services',
    where: 'Home, services',
    variants: {},
  },
} satisfies FxLabSlot;
