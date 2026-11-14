/**
 * Flat tone: the approach section sits on `surface`, one flat step up from the
 * page ground, like the footer band. No params, no motion.
 */
import './surface.css';
import type { FxLabMount } from '../../types';

export const mount: FxLabMount = (host) => {
  host.classList.add('fx-approach-surface');
  return { destroy: () => host.classList.remove('fx-approach-surface') };
};
