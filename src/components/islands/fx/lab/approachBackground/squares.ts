/**
 * Squares: a port of React Bits "Squares" (reactbits.dev/backgrounds/squares;
 * in the repo it became "Shape Grid", whose square shape this follows)
 * behind the approach section. A grid of square outlines in dark hairlines
 * drifts slowly on the diagonal (up and to the right), fading out toward the
 * section's edges. Squares near the pointer light up, filled, around a soft
 * spot that follows the pointer on a spring and leaves a short trail; a click
 * sends a ring of lit squares outward.
 *
 * Params: `size` the side of a square (px), `speed` the drift (px per frame
 * at 60fps, as in the original; 0 stops it), `intensity` how visible the
 * grid is, `accent` how far the lit colour goes from `muted` toward the kit
 * orange.
 */
import './squares.css';
import { canvasBackground, mix, palette, type Rgb } from './canvas';
import type { FxLabMount, FxParams } from '../../types';

// The original's defaults for what is not a param.
const DIRECTION = [Math.SQRT1_2, -Math.SQRT1_2]; // "diagonal"
const RADIUS = 1.5; // the spot's reach, in squares
const TRAIL_S = 0.6;
const FILL = 0.3;
const LEVELS = 24;
const OFFSET = 32768;

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};
const keyOf = (i: number, j: number) => (i + OFFSET) * 65536 + (j + OFFSET);

export const mount: FxLabMount = (host, initial) => {
  let p: FxParams = { ...initial };
  const colours = palette();
  let lineColour = '';
  let strokeRamp: string[] = [];
  let fillRamp: string[] = [];
  const buildColours = () => {
    const line = mix(colours.paper, colours.faint, 0.06 + 0.2 * p.intensity);
    const active: Rgb = mix(colours.muted, colours.accent, p.accent);
    lineColour = colours.cap(line);
    strokeRamp = Array.from({ length: LEVELS + 1 }, (_, i) =>
      colours.cap(mix(line, active, (i / LEVELS) * 0.85)),
    );
    fillRamp = Array.from({ length: LEVELS + 1 }, (_, i) =>
      colours.cap(mix(colours.paper, active, (i / LEVELS) * FILL)),
    );
  };

  const s = {
    width: 0,
    height: 0,
    time: 0,
    offsetX: 0,
    offsetY: 0,
    inside: false,
    pointerX: 0,
    pointerY: 0,
    spotX: 0,
    spotY: 0,
    spotVX: 0,
    spotVY: 0,
    spotPower: 0,
  };
  const lit = new Map<number, number>();
  let cascades: { x: number; y: number; time: number; reach: number }[] = [];
  const size = () => Math.max(8, p.size);

  const illuminate = (dt: number) => {
    const decay = Math.exp(-dt / TRAIL_S);
    for (const [key, value] of lit) {
      const next = value * decay;
      if (next < 0.004) lit.delete(key);
      else lit.set(key, next);
    }
    if (s.spotPower < 0.01) return;
    const cell = size();
    const wx = s.spotX + s.offsetX;
    const wy = s.spotY + s.offsetY;
    const reach = RADIUS * cell;
    const hi = Math.floor(wx / cell);
    const hj = Math.floor(wy / cell);
    const span = Math.ceil(RADIUS) + 2;
    for (let i = hi - span; i <= hi + span; i++) {
      for (let j = hj - span; j <= hj + span; j++) {
        const distance = Math.hypot((i + 0.5) * cell - wx, (j + 0.5) * cell - wy);
        let value = smoothstep(reach, reach * 0.15, distance);
        if (i === hi && j === hj) value = 1;
        value *= s.spotPower;
        if (value <= 0.004) continue;
        const key = keyOf(i, j);
        if (value > (lit.get(key) ?? 0)) lit.set(key, value);
      }
    }
  };

  const cascadeAt = (x: number, y: number) => {
    let value = 0;
    for (const c of cascades) {
      const ring = Math.round(Math.hypot(x - c.x, y - c.y) / size());
      const local = s.time - c.time - ring * 0.055;
      if (local < 0) continue;
      value = Math.max(value, Math.exp(-((local / 0.085) ** 2)) * Math.max(0, 1 - ring / c.reach));
    }
    return value;
  };

  const step = (dt: number) => {
    s.time += dt;
    s.offsetX -= DIRECTION[0] * p.speed * 60 * dt;
    s.offsetY -= DIRECTION[1] * p.speed * 60 * dt;
    // Keep the offsets small; the pattern repeats every square.
    const cell = size();
    if (Math.abs(s.offsetX) > cell * 1000 || Math.abs(s.offsetY) > cell * 1000) {
      const sx = Math.round(s.offsetX / cell) * cell;
      const sy = Math.round(s.offsetY / cell) * cell;
      s.offsetX -= sx;
      s.offsetY -= sy;
      lit.clear();
      cascades = [];
    }
    const want = s.inside ? 1 : 0;
    s.spotPower += (want - s.spotPower) * (1 - Math.exp(-(want ? 10 : 5) * dt));
    const stiffness = 220;
    const damping = 2 * Math.sqrt(stiffness) * 0.85;
    s.spotVX += (stiffness * (s.pointerX - s.spotX) - damping * s.spotVX) * dt;
    s.spotVY += (stiffness * (s.pointerY - s.spotY) - damping * s.spotVY) * dt;
    s.spotX += s.spotVX * dt;
    s.spotY += s.spotVY * dt;
    illuminate(dt);
    cascades = cascades.filter((c) => s.time - c.time < c.reach * 0.055 + 0.4);
    return (
      p.speed > 0 || lit.size > 0 || cascades.length > 0 || Math.abs(want - s.spotPower) > 0.005
    );
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const cell = size();
    const i0 = Math.floor(s.offsetX / cell) - 1;
    const i1 = Math.ceil((s.offsetX + s.width) / cell) + 1;
    const j0 = Math.floor(s.offsetY / cell) - 1;
    const j1 = Math.ceil((s.offsetY + s.height) / cell) + 1;

    // Lit squares: fill first, then the grid, then their brighter outlines.
    const cells: [number, number, number][] = [];
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        let value = lit.get(keyOf(i, j)) ?? 0;
        if (cascades.length) value = Math.max(value, cascadeAt((i + 0.5) * cell, (j + 0.5) * cell));
        if (value > 0.01) cells.push([i, j, Math.min(1, value)]);
      }
    }
    for (const [i, j, value] of cells) {
      ctx.fillStyle = fillRamp[Math.round(value * LEVELS)];
      ctx.fillRect(i * cell - s.offsetX, j * cell - s.offsetY, cell, cell);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColour;
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) {
      const x = i * cell - s.offsetX;
      ctx.moveTo(x, -cell);
      ctx.lineTo(x, s.height + cell);
    }
    for (let j = j0; j <= j1; j++) {
      const y = j * cell - s.offsetY;
      ctx.moveTo(-cell, y);
      ctx.lineTo(s.width + cell, y);
    }
    ctx.stroke();

    for (const [i, j, value] of cells) {
      ctx.strokeStyle = strokeRamp[Math.round(value * LEVELS)];
      ctx.strokeRect(i * cell - s.offsetX, j * cell - s.offsetY, cell, cell);
    }
  };

  buildColours();
  const bg = canvasBackground(
    host,
    {
      resize(width, height) {
        s.width = width;
        s.height = height;
      },
      step,
      draw,
      move(x, y, inside) {
        // Entering: the spot starts under the pointer instead of flying in.
        if (inside && !s.inside && s.spotPower < 0.02) {
          s.spotX = x;
          s.spotY = y;
          s.spotVX = 0;
          s.spotVY = 0;
        }
        s.inside = inside;
        s.pointerX = x;
        s.pointerY = y;
      },
      down(x, y) {
        cascades.push({
          x: x + s.offsetX,
          y: y + s.offsetY,
          time: s.time,
          reach: Math.hypot(s.width, s.height) / size(),
        });
        if (cascades.length > 6) cascades.shift();
      },
      leave() {
        s.inside = false;
      },
    },
    'fx-approach-squares',
  );

  return {
    update(params) {
      p = { ...params };
      buildColours();
      bg.refresh();
    },
    destroy: () => bg.destroy(),
  };
};
