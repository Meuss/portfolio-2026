/**
 * Cursor lamp (fine pointers only): a soft pool of orange light trailing the
 * pointer, screen-blended so it only ever lightens.
 *
 * Reduced motion: the lamp tracks the pointer directly, without trailing.
 */
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

export const mount: FxMount = (_host, params) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return { destroy() {} };

  const reduce = prefersReducedMotion();
  const lamp = document.createElement('div');
  lamp.className = 'fx-lamp';
  lamp.setAttribute('aria-hidden', 'true');
  document.body.append(lamp);

  const apply = (p: FxParams) => {
    lamp.style.setProperty('--lamp-size', `${p.size ?? 44}rem`);
    lamp.style.setProperty('--lamp-strength', String(p.strength ?? 1));
  };
  apply(params);

  const target = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  let raf = 0;
  let placed = false;

  const paint = () => {
    lamp.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  };
  const tick = () => {
    pos.x += (target.x - pos.x) * 0.18;
    pos.y += (target.y - pos.y) * 0.18;
    paint();
    raf = Math.hypot(target.x - pos.x, target.y - pos.y) > 0.3 ? requestAnimationFrame(tick) : 0;
  };

  const onMove = (e: PointerEvent) => {
    target.x = e.clientX;
    target.y = e.clientY;
    if (!placed || reduce) {
      // First contact (or reduced motion): appear where the pointer is.
      pos.x = target.x;
      pos.y = target.y;
      placed = true;
      paint();
    }
    lamp.classList.add('is-on');
    if (!reduce && !raf) raf = requestAnimationFrame(tick);
  };
  const onLeave = () => lamp.classList.remove('is-on');

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  return {
    update: apply,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      lamp.remove();
    },
  };
};
