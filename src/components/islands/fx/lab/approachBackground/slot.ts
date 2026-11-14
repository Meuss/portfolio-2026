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
    dots: {
      load: () => import('./dots'),
      params: { gap: 26, proximity: 150, intensity: 0.5, accent: 0.35 },
    },
    squares: {
      load: () => import('./squares'),
      params: { size: 52, speed: 0.2, intensity: 0.5, accent: 0.35 },
    },
    waves: {
      load: () => import('./waves'),
      params: { spacing: 16, speed: 0.6, intensity: 0.5, accent: 0.35 },
    },
    glowTop: {
      load: () => import('./glowTop'),
      params: { intensity: 0.7, accent: 0.3, grain: 0.5 },
    },
    meshGlow: {
      load: () => import('./meshGlow'),
      params: { intensity: 0.85, accent: 0.3, grain: 0.5 },
    },
  },
  panel: import.meta.env.DEV && {
    label: 'Approach background',
    where: 'Home, approach',
    variants: {
      surface: { label: 'Flat tone', params: {} },
      dots: {
        label: 'Dot grid',
        params: {
          gap: { label: 'Spacing', min: 14, max: 56, step: 1 },
          proximity: { label: 'Reach', min: 60, max: 320, step: 10 },
          intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
          accent: { label: 'Orange', min: 0, max: 1, step: 0.05 },
        },
      },
      squares: {
        label: 'Squares',
        params: {
          size: { label: 'Size', min: 20, max: 120, step: 1 },
          speed: { label: 'Speed', min: 0, max: 1.5, step: 0.05 },
          intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
          accent: { label: 'Orange', min: 0, max: 1, step: 0.05 },
        },
      },
      waves: {
        label: 'Waves',
        params: {
          spacing: { label: 'Spacing', min: 8, max: 48, step: 1 },
          speed: { label: 'Speed', min: 0, max: 3, step: 0.05 },
          intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
          accent: { label: 'Orange', min: 0, max: 1, step: 0.05 },
        },
      },
      glowTop: {
        label: 'Top light',
        params: {
          intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
          accent: { label: 'Orange', min: 0, max: 1, step: 0.05 },
          grain: { label: 'Grain', min: 0, max: 1, step: 0.05 },
        },
      },
      meshGlow: {
        label: 'Mesh glow',
        params: {
          intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
          accent: { label: 'Orange', min: 0, max: 1, step: 0.05 },
          grain: { label: 'Grain', min: 0, max: 1, step: 0.05 },
        },
      },
    },
  },
} satisfies FxLabSlot;
