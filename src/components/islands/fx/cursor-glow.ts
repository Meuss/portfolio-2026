/**
 * Glow trail (fine pointers only): the pointer spills soft motes of orange light
 * that drift upward through the air and cool to the deeper orange as they fade.
 *
 * - One fixed, screen-blended Canvas2D over the page; particles are a single
 *   pre-rendered radial sprite drawn additively.
 * - Emission scales with pointer speed; the loop stops once every mote is gone.
 * - Reduced motion: no trail at all (the pointer is left alone).
 */
import './cursor-glow.css';
import { prefersReducedMotion, tokenRgb, type FxMount, type FxParams } from './types';

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  seed: number;
}

/** A soft white radial blob, tinted per draw via a coloured copy. */
function sprite(rgb: number[]) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(${rgb.join(',')}, 1)`);
  g.addColorStop(0.35, `rgba(${rgb.join(',')}, 0.35)`);
  g.addColorStop(1, `rgba(${rgb.join(',')}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return c;
}

export const mount: FxMount = (_host, initial) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || prefersReducedMotion()) return { destroy() {} };

  let params: FxParams = { ...initial };
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-glow-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d')!;
  const warm = sprite(tokenRgb('accent-hover'));
  const cool = sprite(tokenRgb('accent'));
  // A hot core so fresh motes read as light, not paint.
  const core = sprite([255, 236, 200]);

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
  };
  resize();

  const motes: Mote[] = [];
  let last = { x: -1, y: -1 };
  let raf = 0;
  let prev = performance.now();

  const emit = (x: number, y: number, speed: number) => {
    const n = Math.min(6, 1 + Math.floor(speed / 9));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const life = (0.7 + Math.random() * 0.6) * (params.trail ?? 1);
      motes.push({
        x: last.x < 0 ? x : last.x + (x - last.x) * t,
        y: last.y < 0 ? y : last.y + (y - last.y) * t,
        vx: (Math.random() - 0.5) * 18,
        vy: -8 - Math.random() * 22,
        age: 0,
        life,
        size: 10 + Math.random() * 18,
        seed: Math.random() * 100,
      });
    }
    if (motes.length > 600) motes.splice(0, motes.length - 600);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    const intensity = params.intensity ?? 1;
    const shift = params.accent ?? 0.35;

    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i];
      m.age += dt;
      if (m.age >= m.life) {
        motes.splice(i, 1);
        continue;
      }
      // Gentle curl so the motes wander like warm air.
      m.vx += Math.sin(m.seed + m.age * 2.3) * 14 * dt;
      m.vx *= 0.97;
      m.vy *= 0.985;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const k = m.age / m.life; // 0 → 1
      const fade = (1 - k) * (1 - k);
      const size = m.size * (0.6 + k * 1.1);
      const a = fade * 0.32 * intensity;
      ctx.globalAlpha = a * (1 - k * shift);
      ctx.drawImage(warm, m.x - size, m.y - size, size * 2, size * 2);
      ctx.globalAlpha = a * k * shift * 1.4;
      ctx.drawImage(cool, m.x - size, m.y - size, size * 2, size * 2);
      if (k < 0.25) {
        const c = size * 0.35;
        ctx.globalAlpha = a * (1 - k * 4) * 0.8;
        ctx.drawImage(core, m.x - c, m.y - c, c * 2, c * 2);
      }
    }
    ctx.globalAlpha = 1;
    raf = motes.length && !document.hidden ? requestAnimationFrame(frame) : 0;
    if (!raf) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const speed = last.x < 0 ? 0 : Math.hypot(e.clientX - last.x, e.clientY - last.y);
    emit(e.clientX, e.clientY, speed);
    last = { x: e.clientX, y: e.clientY };
    if (!raf && !document.hidden) {
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const onLeave = () => (last = { x: -1, y: -1 });

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', resize);
  document.documentElement.addEventListener('pointerleave', onLeave);

  return {
    update(next) {
      params = { ...next };
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.remove();
    },
  };
};
