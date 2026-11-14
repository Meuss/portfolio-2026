/**
 * Approach light: the top light of the approach section (static markup and
 * CSS in `Approach.astro`) leans a little toward the pointer while it is over
 * the section, by up to 2% of the light's box sideways and 1.5% up or down,
 * eased by a 1.6s transition (`approach-light.css`); it goes back to the
 * centre when the pointer leaves. No frame loop.
 *
 * Host: the light layer (`.approach-light`), whose `.approach-light-pool` is
 * the part that leans. Fine pointers that can hover only; on touch screens
 * and under reduced motion nothing mounts and the light stays centred.
 */
import './approach-light.css';
import { prefersReducedMotion, type FxMount } from './types';

export const mount: FxMount = (host) => {
  const pool = host.querySelector<HTMLElement>('.approach-light-pool');
  if (!pool || prefersReducedMotion()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let near = false;
  let inside = false;
  new IntersectionObserver(([entry]) => (near = entry.isIntersecting), {
    rootMargin: '50% 0px',
  }).observe(host);

  // x, y: the pointer's place in the section, -0.5 to 0.5 from its centre.
  const lean = (x: number, y: number) => {
    pool.style.transform = `translate(${(x * 4).toFixed(2)}%, ${(y * 3).toFixed(2)}%)`;
  };
  const leave = () => {
    if (inside) lean(0, 0);
    inside = false;
  };
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch' || !near) return;
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const now = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (now) lean(x - 0.5, y - 0.5);
      else if (inside) lean(0, 0);
      inside = now;
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
};
