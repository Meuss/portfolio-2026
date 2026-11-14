/**
 * Waves: a port of React Bits "Waves" (reactbits.dev/backgrounds/waves) behind
 * the approach section. A field of thin, near-vertical dark lines, each point
 * displaced by slowly drifting gradient noise, so the field sways like fabric.
 * A moving pointer drags the lines it passes through and a click sends a
 * ripple out; the displacement lives on a grid of damped springs that carries
 * the lines back. Displaced stretches warm toward the active colour.
 *
 * Params: `spacing` between lines (px), `speed` of the drift (1 is the
 * original's), `intensity` how visible the lines are, `accent` how far the
 * displaced colour goes from `muted` toward the kit orange.
 */
import { canvasBackground, mix, palette, type Rgb } from './canvas';
import type { FxLabMount, FxParams } from '../../types';

// The original's defaults for what is not a param.
const AMPLITUDE = 32;
const SCALE = 1;
const TWIST = 1;
const MOUSE_RADIUS = 175;
const BOUNCE = 0.5;
const RETURN_S = 1.4;
const LIMIT = Math.max(12, MOUSE_RADIUS * 0.5);
const CELL = 12;
const STEP = 6; // px between samples along a line
const RIPPLE_SPEED = 640;
const RIPPLE_WIDTH = 64;
const RIPPLE_IMPULSE = (RIPPLE_WIDTH * Math.sqrt(Math.PI / 2)) / RIPPLE_SPEED;
const LEVELS = 16;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smootherstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const smoothstep = (edge: number, x: number) => {
  const t = clamp(x / edge, 0, 1);
  return t * t * (3 - 2 * t);
};

// Gradient noise (Perlin), as in the original's shader.
const GRADIENTS = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0, 1],
  [0, -1],
];
const gradient = (ix: number, iy: number) => {
  let h = Math.imul(ix + 65536, 0x27d4eb2d) ^ Math.imul(iy + 65536, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h ^= h >>> 12;
  return GRADIENTS[(h >>> 16) % 12];
};
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const perlin = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const g00 = gradient(ix, iy);
  const g10 = gradient(ix + 1, iy);
  const g01 = gradient(ix, iy + 1);
  const g11 = gradient(ix + 1, iy + 1);
  const n00 = g00[0] * fx + g00[1] * fy;
  const n10 = g10[0] * (fx - 1) + g10[1] * fy;
  const n01 = g01[0] * fx + g01[1] * (fy - 1);
  const n11 = g11[0] * (fx - 1) + g11[1] * (fy - 1);
  const ux = ease(fx);
  const uy = ease(fy);
  return n00 + (n10 - n00) * ux + (n01 - n00 + (n11 - n10 - n01 + n00) * ux) * uy;
};

export const mount: FxLabMount = (host, initial) => {
  let p: FxParams = { ...initial };
  const colours = palette();
  let ramp: string[] = [];
  const buildRamp = () => {
    const base = mix(colours.paper, colours.faint, 0.05 + 0.2 * p.intensity);
    const hot: Rgb = mix(colours.muted, colours.accent, p.accent);
    ramp = Array.from({ length: LEVELS + 1 }, (_, i) => colours.cap(mix(base, hot, i / LEVELS)));
  };

  const view = { width: 0, height: 0 };
  const grid = {
    cols: 0,
    rows: 0,
    shift: new Float32Array(0),
    speed: new Float32Array(0),
    top: 0,
    bottom: -1,
    left: 0,
    right: -1,
  };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, inside: false };
  const ripples: { x: number; y: number; age: number; range: number }[] = [];
  let flow = 0;

  const rebuild = () => {
    grid.cols = Math.ceil(view.width / CELL) + 2;
    grid.rows = Math.ceil(view.height / CELL) + 2;
    grid.shift = new Float32Array(grid.cols * grid.rows * 2);
    grid.speed = new Float32Array(grid.cols * grid.rows * 2);
    grid.top = 0;
    grid.bottom = -1;
  };

  /** Widens the band of springs being simulated to cover a rectangle. */
  const include = (x0: number, y0: number, x1: number, y1: number) => {
    const c0 = clamp(Math.floor(x0 / CELL), 0, grid.cols - 1);
    const c1 = clamp(Math.ceil(x1 / CELL), 0, grid.cols - 1);
    const r0 = clamp(Math.floor(y0 / CELL), 0, grid.rows - 1);
    const r1 = clamp(Math.ceil(y1 / CELL), 0, grid.rows - 1);
    const empty = grid.bottom < grid.top;
    grid.top = empty ? r0 : Math.min(grid.top, r0);
    grid.bottom = empty ? r1 : Math.max(grid.bottom, r1);
    grid.left = empty ? c0 : Math.min(grid.left, c0);
    grid.right = empty ? c1 : Math.max(grid.right, c1);
  };

  /** Advances the springs; returns whether any of them is still moving. */
  const simulate = (dt: number) => {
    const follow = 1 - Math.exp(-dt / 0.045);
    const nx = pointer.sx + (pointer.x - pointer.sx) * follow;
    const ny = pointer.sy + (pointer.y - pointer.sy) * follow;
    const blend = 1 - Math.exp(-dt / 0.06);
    pointer.vx += ((nx - pointer.sx) / dt - pointer.vx) * blend;
    pointer.vy += ((ny - pointer.sy) / dt - pointer.vy) * blend;
    pointer.sx = nx;
    pointer.sy = ny;

    const zeta = 1 - 0.85 * BOUNCE;
    const omega = 4 / (zeta * RETURN_S);
    const speedNow = Math.hypot(pointer.vx, pointer.vy);
    const drive = pointer.inside ? 26000 * Math.tanh(speedNow / 1400) : 0;
    const r = MOUSE_RADIUS;
    if (drive > 1) include(pointer.sx - r, pointer.sy - r, pointer.sx + r, pointer.sy + r);

    const live: { x: number; y: number; front: number; power: number }[] = [];
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.age += dt;
      const front = ripple.age * RIPPLE_SPEED;
      const life = 1 - front / ripple.range;
      if (life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      const reach = front + RIPPLE_WIDTH * 3;
      include(ripple.x - reach, ripple.y - reach, ripple.x + reach, ripple.y + reach);
      live.push({
        x: ripple.x,
        y: ripple.y,
        front,
        power: (150 * omega * life * Math.sqrt(life)) / RIPPLE_IMPULSE,
      });
    }
    if (grid.bottom < grid.top) return false;

    const stiffness = omega * omega;
    const damping = 2 * zeta * omega;
    const steps = Math.min(16, Math.max(1, Math.ceil(dt / Math.min(1 / 120, 0.6 / omega))));
    const h = dt / steps;
    const dirX = speedNow > 0.001 ? pointer.vx / speedNow : 0;
    const dirY = speedNow > 0.001 ? pointer.vy / speedNow : 0;
    const { cols, shift, speed: velocity, left, right } = grid;
    let peak = 0;
    for (let row = grid.top; row <= grid.bottom; row++) {
      const y = row * CELL;
      for (let col = left; col <= right; col++) {
        const x = col * CELL;
        const index = (row * cols + col) * 2;
        let ax = 0;
        let ay = 0;
        if (drive > 1) {
          const distance = Math.hypot(x - pointer.sx, y - pointer.sy);
          if (distance < r) {
            const weight = smootherstep(1 - distance / r) * drive;
            ax += dirX * weight;
            ay += dirY * weight;
          }
        }
        for (const ripple of live) {
          const ex = x - ripple.x;
          const ey = y - ripple.y;
          const distance = Math.hypot(ex, ey);
          const offset = (distance - ripple.front) / RIPPLE_WIDTH;
          if (distance > 0.001 && Math.abs(offset) < 3) {
            const push =
              ripple.power * Math.exp(-offset * offset * 2) * smootherstep(distance / 56);
            ax += (ex / distance) * push;
            ay += (ey / distance) * push;
          }
        }
        let px = shift[index];
        let py = shift[index + 1];
        let vx = velocity[index];
        let vy = velocity[index + 1];
        for (let k = 0; k < steps; k++) {
          vx += (ax - stiffness * px - damping * vx) * h;
          vy += (ay - stiffness * py - damping * vy) * h;
          px += vx * h;
          py += vy * h;
        }
        shift[index] = px;
        shift[index + 1] = py;
        velocity[index] = vx;
        velocity[index + 1] = vy;
        peak = Math.max(peak, Math.abs(px) + Math.abs(py) + (Math.abs(vx) + Math.abs(vy)) * 0.05);
      }
    }
    if (peak < 0.02 && drive <= 1 && !live.length) {
      for (let row = grid.top; row <= grid.bottom; row++) {
        shift.fill(0, (row * cols + left) * 2, (row * cols + right + 1) * 2);
        velocity.fill(0, (row * cols + left) * 2, (row * cols + right + 1) * 2);
      }
      grid.top = 0;
      grid.bottom = -1;
    }
    return grid.bottom >= grid.top;
  };

  /** The springs' displacement at a point (bilinear), softly limited like the original's. */
  const field = (x: number, y: number, out: number[]) => {
    out[0] = 0;
    out[1] = 0;
    if (grid.bottom < grid.top) return;
    const tx = clamp(x / CELL, 0, grid.cols - 1.001);
    const ty = clamp(y / CELL, 0, grid.rows - 1.001);
    const c = Math.floor(tx);
    const r = Math.floor(ty);
    const fx = tx - c;
    const fy = ty - r;
    const { cols, shift } = grid;
    const a = (r * cols + c) * 2;
    const b = a + 2;
    const d = a + cols * 2;
    const e = d + 2;
    const sx =
      (shift[a] * (1 - fx) + shift[b] * fx) * (1 - fy) + (shift[d] * (1 - fx) + shift[e] * fx) * fy;
    const sy =
      (shift[a + 1] * (1 - fx) + shift[b + 1] * fx) * (1 - fy) +
      (shift[d + 1] * (1 - fx) + shift[e + 1] * fx) * fy;
    const size = Math.hypot(sx, sy);
    const k = size > 0.0001 ? (LIMIT * Math.tanh(size / LIMIT)) / size : 1;
    out[0] = sx * k;
    out[1] = sy * k;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const spacing = Math.max(4, p.spacing);
    const margin = AMPLITUDE * 1.1 + LIMIT + spacing * 2 + 8;
    const half = Math.ceil((view.width / 2 + margin) / spacing);
    const reachV = view.height / 2 + margin;
    const samples = Math.ceil((reachV * 2) / STEP) + 1;
    const fx = 0.002 / SCALE;
    const fy = 0.0015 / SCALE;
    const driftX = flow * 0.025;
    const driftY = flow * 0.0075;
    const cx = view.width / 2;
    const cy = view.height / 2;
    const shift = [0, 0];
    const hot = Array.from({ length: LEVELS + 1 }, () => new Path2D());
    let anyHot = false;

    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ramp[0];
    ctx.beginPath();
    for (let line = -half; line <= half; line++) {
      const u = line * spacing;
      let lx = 0;
      let ly = 0;
      let lastHeat = 0;
      for (let k = 0; k < samples; k++) {
        const v = -reachV + k * STEP;
        const turn = perlin(u * fx + driftX, v * fy + driftY) * 12 * TWIST;
        const x0 = cx + u + Math.cos(turn) * AMPLITUDE;
        const y0 = cy + v + Math.sin(turn) * 0.5 * AMPLITUDE;
        field(x0, y0, shift);
        const x = x0 + shift[0];
        const y = y0 + shift[1];
        const heat = smoothstep(LIMIT * 0.55, Math.hypot(shift[0], shift[1]));
        if (k === 0) ctx.moveTo(x, y);
        else {
          ctx.lineTo(x, y);
          const level = Math.round(Math.max(heat, lastHeat) * LEVELS);
          if (level > 0) {
            hot[level].moveTo(lx, ly);
            hot[level].lineTo(x, y);
            anyHot = true;
          }
        }
        lx = x;
        ly = y;
        lastHeat = heat;
      }
    }
    ctx.stroke();
    if (!anyHot) return;
    for (let level = 1; level <= LEVELS; level++) {
      ctx.strokeStyle = ramp[level];
      ctx.stroke(hot[level]);
    }
  };

  buildRamp();
  const bg = canvasBackground(host, {
    resize(width, height) {
      view.width = width;
      view.height = height;
      ripples.length = 0;
      rebuild();
    },
    step(dt) {
      flow += dt * p.speed;
      const moving = simulate(dt);
      return p.speed > 0 || moving || ripples.length > 0;
    },
    draw,
    move(x, y, inside) {
      if (inside && !pointer.inside) {
        pointer.sx = x;
        pointer.sy = y;
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.inside = inside;
      pointer.x = x;
      pointer.y = y;
    },
    down(x, y) {
      ripples.push({
        x,
        y,
        age: 0,
        range: Math.max(360, Math.hypot(view.width, view.height) * 0.55),
      });
      if (ripples.length > 6) ripples.shift();
    },
    leave() {
      pointer.inside = false;
    },
  });

  return {
    update(params) {
      p = { ...params };
      buildRamp();
      bg.refresh();
    },
    destroy: () => bg.destroy(),
  };
};
