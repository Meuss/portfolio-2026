/**
 * Mesh glow: Gradient Studio's "Mesh glow" treatment ("dark luxury
 * interface", the treatment of its "Editorial" direction;
 * gradientsaas.blogspot.com) in the palette. A blurred wedge of light falls
 * from high on the right toward the lower left over a soft pool, with the
 * Studio's vignette and grain; the light leans a little toward the pointer.
 * No frame loop.
 *
 * Params: `intensity` the strength of the light, `accent` the trace of orange
 * in the pool (0: none), `grain` the film grain.
 */
import './meshGlow.css';
import { gradientBackground } from './gradient';
import type { FxLabMount } from '../../types';

export const mount: FxLabMount = (host, params) =>
  gradientBackground(host, 'fx-approach-meshglow', params);
