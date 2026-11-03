/**
 * Tilted card: the screenshot frame turns in 3D toward the pointer, the phone
 * capture lifts off it (it physically sits on top), and a soft glare follows
 * the pointer across the desktop screenshot. Springs back on leave.
 *
 * Fine pointers only; reduced motion: no-op. Transforms only, rAF-eased.
 */
import './media-tilt.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

export const mount: FxMount = (host, params) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || prefersReducedMotion()) return { destroy() {} };

  let p: FxParams = { ...params };
  const card = (host.closest('article') as HTMLElement | null) ?? host;
  const desktop = host.querySelector<HTMLElement>('.frame-desktop');
  const mobile = host.querySelector<HTMLElement>('.frame-mobile');
  const glare = document.createElement('span');
  glare.className = 'fx-tilt-glare';
  glare.setAttribute('aria-hidden', 'true');
  desktop?.append(glare);
  host.classList.add('fx-tilt-host');

  // Normalised pointer (-1..1) and hover amount (0..1), current and target.
  const cur = { x: 0, y: 0, h: 0 };
  const tgt = { x: 0, y: 0, h: 0 };
  let raf = 0;

  const paint = () => {
    const a = p.angle ?? 8;
    host.style.transform = `perspective(900px) rotateX(${(-cur.y * a).toFixed(3)}deg) rotateY(${(cur.x * a).toFixed(3)}deg)`;
    if (mobile) mobile.style.transform = `translateZ(${(cur.h * 36).toFixed(2)}px)`;
    glare.style.setProperty('--glare-x', `${((cur.x + 1) * 50).toFixed(2)}%`);
    glare.style.setProperty('--glare-y', `${((cur.y + 1) * 50).toFixed(2)}%`);
    glare.style.opacity = String(cur.h * (p.glare ?? 0.5));
  };
  const tick = () => {
    cur.x += (tgt.x - cur.x) * 0.12;
    cur.y += (tgt.y - cur.y) * 0.12;
    cur.h += (tgt.h - cur.h) * 0.12;
    paint();
    const moving =
      Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.h - cur.h) > 0.002;
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    tgt.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    tgt.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    tgt.h = 1;
    kick();
  };
  const onLeave = () => {
    tgt.x = tgt.y = tgt.h = 0;
    kick();
  };
  card.addEventListener('pointermove', onMove);
  card.addEventListener('pointerleave', onLeave);

  return {
    update(next) {
      p = { ...next };
      paint();
    },
    destroy() {
      cancelAnimationFrame(raf);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      glare.remove();
      host.classList.remove('fx-tilt-host');
      host.style.removeProperty('transform');
      mobile?.style.removeProperty('transform');
    },
  };
};
