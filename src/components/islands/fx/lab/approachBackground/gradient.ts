/**
 * What the gradient backgrounds of this slot share (`glowTop`, `meshGlow`),
 * both rebuilt from Gradient Studio (gradientsaas.blogspot.com), a generator
 * of "editorial" CSS backgrounds. A Studio background is a stack of layers
 * over a base ramp: a "light treatment", a glow, a deep vignette and a film
 * grain. Here the base ramp is the section's own ground (`paper`), and every
 * layer is drawn from the tokens:
 * - `light`: the treatment, styled by the variant's class (its CSS);
 * - `vignette`: the Studio's centre-clear vignette and bottom falloff, in
 *   `paper`, which also fades the light out before the bottom hairline;
 * - `grain`: the Studio's fractal-noise grain, as a mask over a `faint` fill.
 *
 * The light leans a little toward the pointer (a CSS transition on a
 * transform, set per pointer event; no frame loop). Under reduced motion it
 * stays put. Strength, accent and grain are custom properties on the
 * background's root, so `update` applies them live.
 */
import './gradient.css';
import { addLayer } from './layer';
import { prefersReducedMotion, type FxParams } from '../../types';

export function gradientBackground(host: HTMLElement, className: string, initial: FxParams) {
  const { layer, remove } = addLayer(host);
  const root = document.createElement('div');
  root.className = `fx-approach-studio ${className}`;
  const light = document.createElement('div');
  light.className = 'fx-approach-studio-light';
  const vignette = document.createElement('div');
  vignette.className = 'fx-approach-studio-vignette';
  const grain = document.createElement('div');
  grain.className = 'fx-approach-studio-grain';
  root.append(light, vignette, grain);
  layer.append(root);

  const apply = (params: FxParams) => {
    root.style.setProperty('--fx-i', String(params.intensity));
    root.style.setProperty('--fx-a', String(params.accent));
    root.style.setProperty('--fx-g', String(params.grain));
  };
  apply(initial);

  let near = false;
  let inside = false;
  const io = new IntersectionObserver(([entry]) => (near = entry.isIntersecting), {
    rootMargin: '50% 0px',
  });
  const lean = (x: number, y: number) => {
    light.style.transform = `translate(${(x * 4).toFixed(2)}%, ${(y * 3).toFixed(2)}%)`;
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !near) return;
    const rect = layer.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const now = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    if (now) lean(x - 0.5, y - 0.5);
    else if (inside) lean(0, 0);
    inside = now;
  };
  const onLeave = () => {
    if (inside) lean(0, 0);
    inside = false;
  };
  const still = prefersReducedMotion();
  if (!still) {
    io.observe(layer);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
  }

  return {
    update: apply,
    destroy() {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      root.remove();
      remove();
    },
  };
}
