/**
 * Top light: Gradient Studio's "Top light" treatment ("soft studio
 * illumination", gradientsaas.blogspot.com) in the palette. A soft pool of
 * light hangs from the top centre of the section and falls off downward, with
 * the Studio's vignette and grain; the pool leans a little toward the pointer.
 * No frame loop.
 *
 * Params: `intensity` the strength of the light, `accent` the trace of orange
 * in the wash under the top edge (0: none), `grain` the film grain.
 */
import './glowTop.css';
import { gradientBackground } from './gradient';
import type { FxLabMount } from '../../types';

export const mount: FxLabMount = (host, params) =>
  gradientBackground(host, 'fx-approach-glowtop', params);
