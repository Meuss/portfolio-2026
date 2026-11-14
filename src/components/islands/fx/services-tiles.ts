/**
 * Services tiles light: the light of React Bits' `MagicBento` (plain JS + CSS
 * flavour), ported for the homepage's service tiles. The tiles, their plates
 * (`.service-plate`: `surface`, 1px `line` rim, 8px radius) and their mono
 * indexes are markup in `ServiceBlocks.astro`; this module only paints light
 * into the plates, as `aria-hidden` layers (`services-tiles.css`):
 * - a spotlight (a soft `ink` light, peaking at 8%) inside the tile under the
 *   pointer;
 * - a 1px rim glow in `accent` that lights the rims of every tile near the
 *   pointer, centred on it;
 * - small `accent` particles drifting up in the hovered tile, drawn only near
 *   the pointer;
 * - a slight press (the plate and the tile's text scale to 0.985 about the
 *   tile's centre) while the button is down, and on click a wave of light
 *   that runs out across every rim from the click point; also once, from the
 *   top left, when the tiles first scroll into view.
 *
 * Host: the wrapper of the tiles' `<ol>` and the "also" block. The rows
 * (`li.service`) are never moved: their opacity and movement belong to the
 * scroll reveal. Frames run only while something moves and the tiles are on
 * screen. Fine pointers that can hover only; on touch screens and under
 * reduced motion nothing mounts and the tiles stay as they are.
 *
 * Params:
 * - `spotlight`: radius of the spotlight in px (the rim glow's is 0.75 of it).
 * - `glow`: strength of the orange rim glow and click wave, 0–1.
 * - `particles`: particles per tile.
 */
import './services-tiles.css';
import { prefersReducedMotion, tokenRgb, type FxMount } from './types';

/** Peak opacity of a particle, so one drifting behind text never cuts its contrast much. */
const STAR_ALPHA = 0.85;
/** The press: how far a tile gives while the button is down. */
const PRESSED = 0.985;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  rate: number;
}

interface Tile {
  item: HTMLElement;
  plate: HTMLElement;
  stars: HTMLCanvasElement;
  /** What the press scales: the plate and the tile's text, each about the tile's centre. */
  parts: HTMLElement[];
  rect: DOMRect | null;
  hot: number;
  press: number;
  vpress: number;
  starLevel: number;
  drawn: boolean;
  particles: Particle[] | null;
  written: Record<string, string>;
}

const make = (tag: string, className: string) => {
  const node = document.createElement(tag);
  node.className = className;
  return node;
};

export const mount: FxMount = (host, params) => {
  if (prefersReducedMotion()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const spotlight = Math.max(40, params.spotlight);
  const particles = clamp(Math.round(params.particles), 0, 120);
  host.style.setProperty('--fx-tiles-spot', `${spotlight}px`);
  host.style.setProperty('--fx-tiles-ring', `${Math.round(spotlight * 0.75)}px`);
  host.style.setProperty('--fx-tiles-glow', String(clamp(params.glow, 0, 1)));

  const tiles: Tile[] = [];
  for (const item of host.querySelectorAll<HTMLElement>('ol > li.service')) {
    const plate = item.querySelector<HTMLElement>(':scope > .service-plate');
    if (!plate) continue;
    const stars = make('canvas', 'fx-tiles-stars') as HTMLCanvasElement;
    plate.append(
      make('span', 'fx-tiles-light'),
      stars,
      make('span', 'fx-tiles-glow'),
      make('span', 'fx-tiles-wave'),
    );
    const text = item.querySelectorAll<HTMLElement>(
      ':scope > .service-index, :scope > h3, :scope > p',
    );
    tiles.push({
      item,
      plate,
      stars,
      parts: [plate, ...text],
      rect: null,
      hot: 0,
      press: 1,
      vpress: 0,
      starLevel: 0,
      drawn: false,
      particles: null,
      written: {},
    });
  }
  if (!tiles.length) return;

  const write = (tile: Tile, name: string, value: string) => {
    if (tile.written[name] === value) return;
    tile.written[name] = value;
    tile.plate.style.setProperty(name, value);
  };

  const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
  const light = { x: -1e5, y: -1e5, near: 0, ready: false };
  const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
  let bounds: DOMRect | null = null;
  let dirty = true;
  let raf = 0;
  let last = 0;
  let onScreen = false;
  let introPlayed = false;
  const starColor = tokenRgb('accent');

  const measure = () => {
    dirty = false;
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    for (const tile of tiles) {
      const rect = tile.item.getBoundingClientRect();
      tile.rect = rect;
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
      bottom = Math.max(bottom, rect.bottom);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (tile.stars.width !== width || tile.stars.height !== height) {
        tile.stars.width = width;
        tile.stars.height = height;
      }
      // Each part scales about the tile's centre, so the tile gives as one card.
      const cx = tile.item.clientWidth / 2;
      const cy = tile.item.clientHeight / 2;
      tile.parts.forEach((part, i) => {
        const origin = `${(cx - part.offsetLeft).toFixed(1)}px ${(cy - part.offsetTop).toFixed(1)}px`;
        if (tile.written[`origin${i}`] === origin) return;
        tile.written[`origin${i}`] = origin;
        part.style.transformOrigin = origin;
      });
    }
    bounds = new DOMRect(left, top, right - left, bottom - top);
  };

  const seed = (tile: Tile, rect: DOMRect) => {
    if (tile.particles && tile.particles.length === particles) return tile.particles;
    tile.particles = Array.from({ length: particles }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 6,
      vy: -4 - Math.random() * 10,
      size: 0.6 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      rate: 1.2 + Math.random() * 2.4,
    }));
    return tile.particles;
  };

  const drawStars = (
    tile: Tile,
    rect: DOMRect,
    lx: number,
    ly: number,
    dt: number,
    now: number,
  ) => {
    const context = tile.stars.getContext('2d');
    if (!context) return;
    const ratio = tile.stars.width / Math.max(1, rect.width);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, tile.stars.width, tile.stars.height);
    if (tile.starLevel < 0.004 || particles === 0) return;
    const reach = spotlight * 0.75;
    const [r, g, b] = starColor;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    for (const particle of seed(tile, rect)) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      if (particle.y < -4) {
        particle.y = rect.height + 4;
        particle.x = Math.random() * rect.width;
      }
      if (particle.x < -4) particle.x = rect.width + 4;
      if (particle.x > rect.width + 4) particle.x = -4;
      const distance = Math.hypot(particle.x - lx, particle.y - ly) / reach;
      if (distance >= 1) continue;
      const falloff = 1 - distance * distance * (3 - 2 * distance);
      const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * particle.rate + particle.phase);
      const alpha = STAR_ALPHA * tile.starLevel * falloff * twinkle;
      if (alpha < 0.01) continue;
      context.fillStyle = `rgb(${r} ${g} ${b} / ${alpha.toFixed(3)})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
  };

  const startWave = (x: number, y: number, duration: number) => {
    if (!bounds) return;
    wave.x = x;
    wave.y = y;
    wave.t = 0;
    wave.duration = duration;
    wave.reach =
      Math.max(
        Math.hypot(x - bounds.left, y - bounds.top),
        Math.hypot(x - bounds.right, y - bounds.top),
        Math.hypot(x - bounds.left, y - bounds.bottom),
        Math.hypot(x - bounds.right, y - bounds.bottom),
      ) + 140;
  };

  const frame = (now: number) => {
    raf = 0;
    // A frame's timestamp can precede the moment it was asked for: never step back.
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000) || 0);
    last = now;
    if (dirty) measure();
    let busy = false;

    const margin = spotlight * 0.5;
    const near =
      pointer.inside &&
      bounds &&
      pointer.x > bounds.left - margin &&
      pointer.x < bounds.right + margin &&
      pointer.y > bounds.top - margin &&
      pointer.y < bounds.bottom + margin
        ? 1
        : 0;
    if (!light.ready && near) {
      light.x = pointer.x;
      light.y = pointer.y;
      light.ready = true;
    }
    const follow = 1 - Math.exp(-dt / 0.05);
    light.x += (pointer.x - light.x) * follow;
    light.y += (pointer.y - light.y) * follow;
    const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
    light.near += (near - light.near) * fade;
    if (Math.abs(near - light.near) < 0.002) light.near = near;
    else busy = true;
    if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

    let waveRadius = 0;
    let waveAlpha = 0;
    if (wave.t >= 0) {
      wave.t += dt;
      const progress = Math.min(1, wave.t / wave.duration);
      waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
      waveAlpha = Math.pow(1 - progress, 1.3);
      if (progress >= 1) {
        wave.t = -1;
        waveAlpha = 0;
      } else busy = true;
    }

    tiles.forEach((tile, index) => {
      const rect = tile.rect;
      if (!rect) return;
      const lx = light.x - rect.left;
      const ly = light.y - rect.top;
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const inside = pointer.inside && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

      const hotTarget = inside ? 1 : 0;
      tile.hot +=
        (hotTarget - tile.hot) * (1 - Math.exp(-dt / (hotTarget > tile.hot ? 0.14 : 0.32)));
      if (Math.abs(hotTarget - tile.hot) < 0.002) tile.hot = hotTarget;
      else busy = true;

      // The press, on a spring.
      const pressTarget = pointer.down === index ? PRESSED : 1;
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      for (let step = 0; step < steps; step++) {
        tile.vpress += (420 * (pressTarget - tile.press) - 28 * tile.vpress) * h;
        tile.press += tile.vpress * h;
      }
      if (Math.abs(pressTarget - tile.press) < 0.0002 && Math.abs(tile.vpress) < 0.001) {
        tile.press = pressTarget;
        tile.vpress = 0;
      } else busy = true;

      write(tile, '--fx-tiles-x', `${lx.toFixed(1)}px`);
      write(tile, '--fx-tiles-y', `${ly.toFixed(1)}px`);
      write(tile, '--fx-tiles-near', light.near.toFixed(3));
      write(tile, '--fx-tiles-hot', tile.hot.toFixed(3));
      write(tile, '--fx-tiles-wx', `${(wave.x - rect.left).toFixed(1)}px`);
      write(tile, '--fx-tiles-wy', `${(wave.y - rect.top).toFixed(1)}px`);
      write(tile, '--fx-tiles-wr', `${waveRadius.toFixed(1)}px`);
      write(tile, '--fx-tiles-wa', waveAlpha.toFixed(3));
      // Scaled only while away from rest, so text at rest is never transformed.
      const scale = tile.press === 1 ? '' : `scale(${tile.press.toFixed(4)})`;
      if (tile.written.scale !== scale) {
        tile.written.scale = scale;
        for (const part of tile.parts) part.style.transform = scale;
      }

      const starTarget = inside && particles > 0 ? 1 : 0;
      tile.starLevel +=
        (starTarget - tile.starLevel) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
      if (tile.starLevel < 0.004 && !starTarget) tile.starLevel = 0;
      if (tile.starLevel > 0 || starTarget) {
        drawStars(tile, rect, lx, ly, dt, now);
        tile.drawn = true;
        busy = true;
      } else if (tile.drawn) {
        drawStars(tile, rect, lx, ly, dt, now);
        tile.drawn = false;
      }
    });

    if (busy && onScreen) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (raf || !onScreen) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const tileIndex = (target: EventTarget | null) =>
    target instanceof Node ? tiles.findIndex((tile) => tile.item.contains(target)) : -1;

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    },
    { passive: true },
  );
  window.addEventListener(
    'pointerdown',
    (event) => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.down = tileIndex(event.target);
      wake();
    },
    { passive: true },
  );
  const release = () => {
    if (pointer.down < 0) return;
    pointer.down = -1;
    wake();
  };
  window.addEventListener('pointerup', release, { passive: true });
  window.addEventListener('pointercancel', release, { passive: true });
  document.addEventListener('pointerout', (event) => {
    if (event.relatedTarget) return;
    pointer.inside = false;
    pointer.down = -1;
    wake();
  });
  host.addEventListener('click', (event) => {
    if (tileIndex(event.target) < 0) return;
    if (dirty) measure();
    startWave(event.clientX, event.clientY, 1.1);
    wake();
  });
  const moved = () => {
    dirty = true;
    wake();
  };
  window.addEventListener('scroll', moved, { passive: true, capture: true });
  window.addEventListener('resize', moved, { passive: true });
  new ResizeObserver(moved).observe(host);

  // Frames run only while the tiles are on screen; the first time they show,
  // the intro wave sweeps the rims from the top left, as in the original.
  new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (!onScreen) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      moved();
      if (!introPlayed && entries.some((entry) => entry.intersectionRatio >= 0.15)) {
        introPlayed = true;
        window.setTimeout(() => {
          measure();
          if (bounds) startWave(bounds.left, bounds.top, 1.7);
          wake();
        }, 260);
      }
    },
    { threshold: [0, 0.15] },
  ).observe(host);
};
