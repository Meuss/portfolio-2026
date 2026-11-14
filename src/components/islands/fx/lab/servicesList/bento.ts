/**
 * Magic Bento: a port of React Bits' `MagicBento` (plain JS + CSS flavour),
 * re-laying the five services out as bento tiles.
 *
 * Layout (`bento.css`, one class on the section): the heading and intro run
 * full width on top, like the approach and how-it-works sections, and the
 * tiles take the whole width under them. From 1024px the tiles sit on three
 * tracks by three rows: "showcase websites" two tracks wide and two rows
 * tall, "online shops" one track and two rows tall, the other three in a row
 * of regular tiles; from 640px, two tracks with the first tile across both;
 * below, a single stack. Each tile is a `surface` plate with a 1px `line`
 * rim and the 8px radius, a muted mono index ("01"–"05") at the top, and its
 * title and blurb at the bottom. The "also" list stays under the tiles.
 *
 * Light and motion, as in the original engine: a spotlight (a soft `ink`
 * light) inside the tile under the pointer; a 1px rim glow in `accent` that
 * lights the rims of every tile near the pointer, centred on it; small
 * `accent` particles drifting up in the hovered tile, drawn only near the
 * pointer; the tile tilting and drawn toward the pointer on springs; a slight
 * press while the button is down; on click, a wave of light that runs out
 * across every rim from the click point (also once, from the top left, when
 * the tiles first scroll into view).
 *
 * The rows themselves (`li.service`) are never moved by this module (their
 * opacity and movement belong to the scroll reveal): the tile's plate is a
 * decorative `aria-hidden` layer added inside each row, and the tilt is one
 * matrix applied to that plate and to the row's title, blurb and index, each
 * around the tile's centre, so they move as one card.
 *
 * Pointer-driven parts need a fine pointer that can hover; on touch screens
 * and under reduced motion the tiles stay as the layout, without light or
 * motion.
 *
 * Params:
 * - `spotlight`: radius of the spotlight in px (the rim glow's is 0.75 of
 *   it); original default 300.
 * - `glow`: strength of the orange rim glow and click wave, 0–1.
 * - `particles`: particles per tile; 0 turns them off (the original has them
 *   off by default, with 24 when on).
 * - `tilt`, `magnetism`, `ripple`: 1 on, 0 off (`ripple`: the click wave and
 *   the press).
 */
import './bento.css';
import { prefersReducedMotion, tokenRgb, type FxLabMount, type FxParams } from '../../types';

const ROOT = 'fx-svc-bento';
const TILT = 6;
const MAGNET = 6;
/** Peak opacity of a particle, so one drifting behind text never cuts its contrast much. */
const STAR_ALPHA = 0.85;
/** Transform vars this module may set on a row. */
const ROW_VARS = ['--fx-bento-t', '--fx-bento-o-index', '--fx-bento-o-title', '--fx-bento-o-blurb'];

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

interface Card {
  item: HTMLElement;
  face: HTMLElement;
  stars: HTMLCanvasElement;
  index: HTMLElement;
  title: HTMLElement | null;
  blurb: HTMLElement | null;
  hadStyle: boolean;
  rect: DOMRect | null;
  hot: number;
  rx: number;
  ry: number;
  tx: number;
  ty: number;
  vrx: number;
  vry: number;
  vtx: number;
  vty: number;
  press: number;
  vpress: number;
  starLevel: number;
  drawn: boolean;
  particles: Particle[] | null;
  active: boolean;
  written: Record<string, string>;
}

const make = (tag: string, className: string) => {
  const node = document.createElement(tag);
  node.className = className;
  return node;
};

export const mount: FxLabMount = (host, params) => {
  const list = host.querySelector<HTMLElement>('ol');
  const items = list ? [...list.querySelectorAll<HTMLElement>(':scope > li.service')] : [];
  if (!list || !items.length) return { destroy() {} };

  const settings = { spotlight: 300, glow: 0.7, particles: 12, tilt: 1, magnetism: 1, ripple: 1 };
  const apply = (next: FxParams) => {
    for (const key of Object.keys(settings) as (keyof typeof settings)[]) {
      if (typeof next[key] === 'number') settings[key] = next[key];
    }
    settings.spotlight = Math.max(40, settings.spotlight);
    settings.particles = clamp(Math.round(settings.particles), 0, 120);
  };
  apply(params);

  // One class toggle lays the section out as tiles; the plates go in with it.
  const cards: Card[] = items.map((item, i) => {
    const face = make('div', 'fx-bento-face');
    face.setAttribute('aria-hidden', 'true');
    const stars = make('canvas', 'fx-bento-stars') as HTMLCanvasElement;
    face.append(
      make('span', 'fx-bento-light'),
      stars,
      make('span', 'fx-bento-glow'),
      make('span', 'fx-bento-wave'),
    );
    const index = make('span', 'fx-bento-index');
    index.setAttribute('aria-hidden', 'true');
    index.textContent = String(i + 1).padStart(2, '0');
    item.prepend(face, index);
    return {
      item,
      face,
      stars,
      index,
      title: item.querySelector<HTMLElement>(':scope > h3'),
      blurb: item.querySelector<HTMLElement>(':scope > p'),
      hadStyle: item.hasAttribute('style'),
      rect: null,
      hot: 0,
      rx: 0,
      ry: 0,
      tx: 0,
      ty: 0,
      vrx: 0,
      vry: 0,
      vtx: 0,
      vty: 0,
      press: 1,
      vpress: 0,
      starLevel: 0,
      drawn: false,
      particles: null,
      active: false,
      written: {},
    };
  });
  host.classList.add(ROOT);

  const removeNodes = () => {
    for (const card of cards) {
      for (const name of ROW_VARS) card.item.style.removeProperty(name);
      if (!card.hadStyle && !card.item.getAttribute('style')) card.item.removeAttribute('style');
      card.face.remove();
      card.index.remove();
    }
    host.classList.remove(ROOT);
  };

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || prefersReducedMotion()) return { destroy: removeNodes };

  const writeFace = (card: Card, name: string, value: string) => {
    if (card.written[name] === value) return;
    card.written[name] = value;
    card.face.style.setProperty(name, value);
  };
  const writeRow = (card: Card, name: string, value: string | null) => {
    const key = `row${name}`;
    if (card.written[key] === (value ?? '')) return;
    card.written[key] = value ?? '';
    if (value === null) card.item.style.removeProperty(name);
    else card.item.style.setProperty(name, value);
  };
  const sizes = () => {
    for (const card of cards) {
      writeFace(card, '--fx-bento-spot', `${settings.spotlight}px`);
      writeFace(card, '--fx-bento-ring', `${Math.round(settings.spotlight * 0.75)}px`);
      writeFace(card, '--fx-bento-glow', String(clamp(settings.glow, 0, 1)));
    }
  };
  sizes();

  const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
  const light = { x: -1e5, y: -1e5, near: 0, ready: false };
  const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
  let bounds: DOMRect | null = null;
  let dirty = true;
  let raf = 0;
  let last = 0;
  let onScreen = false;
  let introPlayed = false;
  let introTimer = 0;
  let starColor = tokenRgb('accent');

  const measure = () => {
    dirty = false;
    bounds = list.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    for (const card of cards) {
      const rect = card.item.getBoundingClientRect();
      card.rect = rect;
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (card.stars.width !== width || card.stars.height !== height) {
        card.stars.width = width;
        card.stars.height = height;
      }
      // Each moving child turns around the tile's centre, so the tile moves as one card.
      const cx = card.item.clientWidth / 2;
      const cy = card.item.clientHeight / 2;
      const origin = (node: HTMLElement | null) =>
        node
          ? `${(cx - node.offsetLeft).toFixed(1)}px ${(cy - node.offsetTop).toFixed(1)}px`
          : null;
      writeRow(card, '--fx-bento-o-index', origin(card.index));
      writeRow(card, '--fx-bento-o-title', origin(card.title));
      writeRow(card, '--fx-bento-o-blurb', origin(card.blurb));
    }
  };

  const seed = (card: Card, rect: DOMRect) => {
    const count = settings.particles;
    if (card.particles && card.particles.length === count) return card.particles;
    card.particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 6,
      vy: -4 - Math.random() * 10,
      size: 0.6 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      rate: 1.2 + Math.random() * 2.4,
    }));
    return card.particles;
  };

  const drawStars = (
    card: Card,
    rect: DOMRect,
    lx: number,
    ly: number,
    dt: number,
    now: number,
  ) => {
    const context = card.stars.getContext('2d');
    if (!context) return;
    const ratio = card.stars.width / Math.max(1, rect.width);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, card.stars.width, card.stars.height);
    if (card.starLevel < 0.004 || settings.particles === 0) return;
    const reach = settings.spotlight * 0.75;
    const [r, g, b] = starColor;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    for (const particle of seed(card, rect)) {
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
      const alpha = STAR_ALPHA * card.starLevel * falloff * twinkle;
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
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (dirty) measure();
    let busy = false;

    const margin = settings.spotlight * 0.5;
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

    cards.forEach((card, index) => {
      const rect = card.rect;
      if (!rect) return;
      const lx = light.x - rect.left;
      const ly = light.y - rect.top;
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const inside = pointer.inside && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;
      card.active = inside;

      const hotTarget = inside ? 1 : 0;
      card.hot +=
        (hotTarget - card.hot) * (1 - Math.exp(-dt / (hotTarget > card.hot ? 0.14 : 0.32)));
      if (Math.abs(hotTarget - card.hot) < 0.002) card.hot = hotTarget;
      else busy = true;

      const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
      const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
      const tilt = inside && settings.tilt >= 0.5;
      const magnet = inside && settings.magnetism >= 0.5;
      const targets = [
        tilt ? -v * 2 * TILT : 0,
        tilt ? u * 2 * TILT : 0,
        magnet ? u * 2 * MAGNET : 0,
        magnet ? v * 2 * MAGNET : 0,
      ];
      const keys = [
        ['rx', 'vrx'],
        ['ry', 'vry'],
        ['tx', 'vtx'],
        ['ty', 'vty'],
      ] as const;
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      keys.forEach(([key, velocity], k) => {
        for (let step = 0; step < steps; step++) {
          card[velocity] += (170 * (targets[k] - card[key]) - 20 * card[velocity]) * h;
          card[key] += card[velocity] * h;
        }
        if (Math.abs(targets[k] - card[key]) < 0.002 && Math.abs(card[velocity]) < 0.01) {
          card[key] = targets[k];
          card[velocity] = 0;
        } else busy = true;
      });
      const pressTarget = pointer.down === index && settings.ripple >= 0.5 ? 0.985 : 1;
      for (let step = 0; step < steps; step++) {
        card.vpress += (420 * (pressTarget - card.press) - 28 * card.vpress) * h;
        card.press += card.vpress * h;
      }
      if (Math.abs(pressTarget - card.press) < 0.0002 && Math.abs(card.vpress) < 0.001) {
        card.press = pressTarget;
        card.vpress = 0;
      } else busy = true;

      writeFace(card, '--fx-bento-x', `${lx.toFixed(1)}px`);
      writeFace(card, '--fx-bento-y', `${ly.toFixed(1)}px`);
      writeFace(card, '--fx-bento-near', light.near.toFixed(3));
      writeFace(card, '--fx-bento-hot', card.hot.toFixed(3));
      writeFace(card, '--fx-bento-wx', `${(wave.x - rect.left).toFixed(1)}px`);
      writeFace(card, '--fx-bento-wy', `${(wave.y - rect.top).toFixed(1)}px`);
      writeFace(card, '--fx-bento-wr', `${waveRadius.toFixed(1)}px`);
      writeFace(card, '--fx-bento-wa', waveAlpha.toFixed(3));
      // The card's matrix, only while it is away from rest, so text at rest is never on a 3D layer.
      const still =
        card.rx === 0 && card.ry === 0 && card.tx === 0 && card.ty === 0 && card.press === 1;
      writeRow(
        card,
        '--fx-bento-t',
        still
          ? null
          : `perspective(900px) translate3d(${card.tx.toFixed(2)}px, ${card.ty.toFixed(2)}px, 0) rotateX(${card.rx.toFixed(3)}deg) rotateY(${card.ry.toFixed(3)}deg) scale(${card.press.toFixed(4)})`,
      );

      const starTarget = inside && settings.particles > 0 ? 1 : 0;
      card.starLevel +=
        (starTarget - card.starLevel) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
      if (card.starLevel < 0.004 && !starTarget) card.starLevel = 0;
      if (card.starLevel > 0 || starTarget) {
        drawStars(card, rect, lx, ly, dt, now);
        card.drawn = true;
        busy = true;
      } else if (card.drawn) {
        drawStars(card, rect, lx, ly, dt, now);
        card.drawn = false;
      }
    });

    if (busy && onScreen) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (raf || !onScreen) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const cardIndex = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return -1;
    const item = target.closest('li.service');
    return cards.findIndex((card) => card.item === item);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;
    wake();
  };
  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget) return;
    pointer.inside = false;
    pointer.down = -1;
    wake();
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;
    pointer.down = cardIndex(event.target);
    wake();
  };
  const onRelease = () => {
    if (pointer.down < 0) return;
    pointer.down = -1;
    wake();
  };
  const onClick = (event: MouseEvent) => {
    if (cardIndex(event.target) < 0 || settings.ripple < 0.5) return;
    if (dirty) measure();
    startWave(event.clientX, event.clientY, 1.1);
    wake();
  };
  const onScroll = () => {
    dirty = true;
    wake();
  };

  const resize = new ResizeObserver(() => {
    dirty = true;
    wake();
  });
  resize.observe(list);

  // Runs the loop only while the grid is on screen; the first time it shows,
  // the intro wave sweeps the rims from the top left, as in the original.
  const visibility = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (!onScreen) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      dirty = true;
      wake();
      if (!introPlayed && entries.some((entry) => entry.intersectionRatio >= 0.15)) {
        introPlayed = true;
        introTimer = window.setTimeout(() => {
          if (settings.ripple < 0.5) return;
          measure();
          if (bounds) startWave(bounds.left, bounds.top, 1.7);
          wake();
        }, 260);
      }
    },
    { threshold: [0, 0.15] },
  );
  visibility.observe(list);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onRelease, { passive: true });
  window.addEventListener('pointercancel', onRelease, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('pointerout', onPointerOut);
  list.addEventListener('click', onClick);

  return {
    update(next) {
      apply(next);
      sizes();
      starColor = tokenRgb('accent');
      dirty = true;
      wake();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(introTimer);
      resize.disconnect();
      visibility.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointerout', onPointerOut);
      list.removeEventListener('click', onClick);
      removeNodes();
    },
  };
};
