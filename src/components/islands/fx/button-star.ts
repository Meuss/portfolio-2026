/**
 * Star border: a small comet of warm light orbits each primary button just
 * outside its edge, trailing gilt, with a faint bloom underneath.
 *
 * - Pure CSS (an `@property` angle drives a masked conic gradient); two
 *   aria-hidden spans per button, no layout change, label and focus ring untouched.
 * - `orbit` is seconds per lap; `hover` parks it until hover / keyboard focus.
 * - Reduced motion: a still, faint gilt ring (see button-star.css).
 */
import './button-star.css';
import type { FxMount, FxParams } from './types';

export const mount: FxMount = (host, initial) => {
  const ring = document.createElement('span');
  ring.className = 'fx-star-ring';
  const bloom = document.createElement('span');
  bloom.className = 'fx-star-bloom';
  for (const el of [ring, bloom]) el.setAttribute('aria-hidden', 'true');
  host.classList.add('fx-star-host');
  host.append(bloom, ring);

  const apply = (p: FxParams) => {
    host.style.setProperty('--fx-star-orbit', `${p.orbit ?? 5}s`);
    host.style.setProperty(
      '--fx-star-opacity',
      String(Math.min(1, 0.25 + 0.6 * (p.intensity ?? 1))),
    );
    host.classList.toggle('fx-star-host--hover', p.hover === 1);
  };
  apply(initial);

  return {
    update: apply,
    destroy() {
      ring.remove();
      bloom.remove();
      host.classList.remove('fx-star-host', 'fx-star-host--hover');
      host.style.removeProperty('--fx-star-orbit');
      host.style.removeProperty('--fx-star-opacity');
    },
  };
};
