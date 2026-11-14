/**
 * Dot grid: a port of React Bits "Dot Grid" (reactbits.dev/backgrounds/dot-grid)
 * behind the approach section. A regular grid of small dark dots, still at
 * rest. Dots near the pointer warm toward the active colour by proximity; a
 * fast pointer drags the dots it passes through and a click sends a shock
 * ring out; every dot is on a spring to its place and to its neighbours, so
 * the grid ripples and settles back like cloth (the original's GSAP inertia,
 * written as a small spring simulation). Moving dots swell and stretch along
 * their motion. The loop sleeps once the grid is at rest.
 *
 * Params: `gap` the spacing between dot centres (px), `proximity` the radius
 * of the pointer's reach (px), `intensity` how visible the resting dots are,
 * `accent` how far the active colour goes from `muted` toward the kit orange.
 */
import { canvasBackground, mix, palette, type Rgb } from './canvas';
import type { FxLabMount, FxParams } from '../../types';

// The original's defaults for what is not a param.
const BOUNCE = 0.6;
const TENSION = 0.4;
const RETURN_S = 0.8;
const SHOCK_RADIUS = 320;
const SHOCK_STRENGTH = 5;
const SHOCK_SPEED = 650;
const SWELL = 0.8;
const STRETCH = 0.5;
const LEVELS = 24;

const smootherstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export const mount: FxLabMount = (host, initial) => {
  let p: FxParams = { ...initial };
  const colours = palette();
  let ramp: string[] = [];
  const buildRamp = () => {
    const base = mix(colours.paper, colours.faint, 0.1 + 0.3 * p.intensity);
    const active: Rgb = mix(colours.muted, colours.accent, p.accent);
    ramp = Array.from({ length: LEVELS + 1 }, (_, i) => colours.cap(mix(base, active, i / LEVELS)));
  };

  const view = { width: 0, height: 0 };
  const grid = { count: 0, cols: 0, rows: 0, cell: 1, size: 1 };
  let rest = new Float32Array(0);
  let offset = new Float32Array(0);
  let velocity = new Float32Array(0);
  let force = new Float32Array(0);
  let next = new Float32Array(0);
  let wave = new Float32Array(0);
  let energy = new Float32Array(0);
  const pointer = { x: 0, y: 0, vx: 0, vy: 0, time: 0, inside: false, presence: 0 };
  const shocks: { x: number; y: number; age: number }[] = [];

  const rebuild = () => {
    const cell = Math.max(6, p.gap);
    const size = Math.min(4, Math.max(1.6, cell * 0.11));
    const cols = Math.max(1, Math.floor(view.width / cell));
    const rows = Math.max(1, Math.floor(view.height / cell));
    const startX = (view.width - (cols - 1) * cell) / 2;
    const startY = (view.height - (rows - 1) * cell) / 2;
    const count = cols * rows;
    rest = new Float32Array(count * 2);
    offset = new Float32Array(count * 2);
    velocity = new Float32Array(count * 2);
    force = new Float32Array(count * 2);
    next = new Float32Array(count * 2);
    wave = new Float32Array(count * 4);
    energy = new Float32Array(count);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 2;
        rest[i] = startX + col * cell;
        rest[i + 1] = startY + row * cell;
      }
    }
    Object.assign(grid, { count, cols, rows, cell, size });
  };

  const step = (dt: number) => {
    const zeta = 1 - 0.85 * BOUNCE;
    const omega = 4 / (zeta * RETURN_S);
    const stiffness = omega * omega;
    const damping = 2 * zeta * omega;
    const radius = Math.max(1, p.proximity);
    const speed = Math.hypot(pointer.vx, pointer.vy);
    const drive = pointer.inside ? 6500 * Math.tanh(speed / 900) : 0;
    const dirX = speed > 0.001 ? pointer.vx / speed : 0;
    const dirY = speed > 0.001 ? pointer.vy / speed : 0;
    const band = grid.cell * 1.4;
    for (const shock of shocks) shock.age += dt;
    const active = shocks.map((shock) => {
      const front = shock.age * SHOCK_SPEED;
      const power = smootherstep(1 - front / SHOCK_RADIUS);
      return { ...shock, front, amplitude: power * SHOCK_STRENGTH * grid.cell * 0.24 };
    });
    const coupling = (TENSION * 900) ** 2 / (grid.cell * grid.cell);
    const viscosity = Math.sqrt(coupling) * 0.06;
    const limit = Math.sqrt(stiffness + 8 * coupling) + damping + 8 * viscosity;
    const steps = Math.min(24, Math.max(1, Math.ceil(dt / Math.min(1 / 120, 1.2 / limit))));
    const h = dt / steps;

    for (let i = 0; i < grid.count; i++) {
      const index = i * 2;
      const rx = rest[index];
      const ry = rest[index + 1];
      let ax = 0;
      let ay = 0;
      if (drive > 0) {
        const ex = rx + offset[index] - pointer.x;
        const ey = ry + offset[index + 1] - pointer.y;
        const distance = Math.hypot(ex, ey);
        if (distance < radius) {
          const weight = smootherstep(1 - distance / radius) * drive;
          const nx = distance > 0.001 ? ex / distance : 0;
          const ny = distance > 0.001 ? ey / distance : 0;
          ax += weight * (dirX + nx * 0.6);
          ay += weight * (dirY + ny * 0.6);
        }
      }
      let wx = 0;
      let wy = 0;
      let wvx = 0;
      let wvy = 0;
      for (const shock of active) {
        if (shock.amplitude <= 0) continue;
        const ex = rx - shock.x;
        const ey = ry - shock.y;
        const distance = Math.hypot(ex, ey);
        const u = (distance - shock.front) / band;
        if (Math.abs(u) < 3 && distance > 0.001) {
          const nx = ex / distance;
          const ny = ey / distance;
          const profile = Math.exp(-u * u);
          const push = shock.amplitude * profile;
          const rate = ((shock.amplitude * 2 * u * profile) / band) * SHOCK_SPEED;
          wx += nx * push;
          wy += ny * push;
          wvx += nx * rate;
          wvy += ny * rate;
          ax += nx * push * stiffness * 0.35;
          ay += ny * push * stiffness * 0.35;
        }
      }
      force[index] = ax;
      force[index + 1] = ay;
      const w = i * 4;
      wave[w] = wx;
      wave[w + 1] = wy;
      wave[w + 2] = wvx;
      wave[w + 3] = wvy;
    }

    const { cols, rows } = grid;
    const stride = cols * 2;
    for (let n = 0; n < steps; n++) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols + col) * 2;
          let ax = force[index] - stiffness * offset[index] - damping * velocity[index];
          let ay = force[index + 1] - stiffness * offset[index + 1] - damping * velocity[index + 1];
          // Neighbours pull on each other: the grid moves like a sheet.
          let lx = -4 * offset[index];
          let ly = -4 * offset[index + 1];
          let mx = -4 * velocity[index];
          let my = -4 * velocity[index + 1];
          if (col > 0) {
            lx += offset[index - 2];
            ly += offset[index - 1];
            mx += velocity[index - 2];
            my += velocity[index - 1];
          }
          if (col < cols - 1) {
            lx += offset[index + 2];
            ly += offset[index + 3];
            mx += velocity[index + 2];
            my += velocity[index + 3];
          }
          if (row > 0) {
            lx += offset[index - stride];
            ly += offset[index - stride + 1];
            mx += velocity[index - stride];
            my += velocity[index - stride + 1];
          }
          if (row < rows - 1) {
            lx += offset[index + stride];
            ly += offset[index + stride + 1];
            mx += velocity[index + stride];
            my += velocity[index + stride + 1];
          }
          ax += coupling * lx + viscosity * mx;
          ay += coupling * ly + viscosity * my;
          next[index] = velocity[index] + ax * h;
          next[index + 1] = velocity[index + 1] + ay * h;
        }
      }
      for (let i = 0; i < offset.length; i++) {
        velocity[i] = next[i];
        offset[i] += velocity[i] * h;
      }
    }

    for (let i = 0; i < grid.count; i++) {
      const index = i * 2;
      const w = i * 4;
      energy[i] = Math.min(
        1,
        (Math.hypot(velocity[index] + wave[w + 2], velocity[index + 1] + wave[w + 3]) / 380) *
          0.85 +
          (Math.hypot(offset[index] + wave[w], offset[index + 1] + wave[w + 1]) /
            (grid.cell * 2.2)) *
            0.35,
      );
    }
    for (let i = shocks.length - 1; i >= 0; i--) {
      if (active[i].front > SHOCK_RADIUS + band * 3) shocks.splice(i, 1);
    }
    const decay = 1 - Math.exp(-dt / 0.08);
    pointer.vx -= pointer.vx * decay;
    pointer.vy -= pointer.vy * decay;
    const target = pointer.inside ? 1 : 0;
    pointer.presence += (target - pointer.presence) * (1 - Math.exp(-dt / 0.2));

    // Still moving?
    if (shocks.length || Math.abs(pointer.vx) + Math.abs(pointer.vy) > 1) return true;
    if (Math.abs(target - pointer.presence) > 0.002) return true;
    for (let i = 0; i < offset.length; i++) {
      if (Math.abs(offset[i]) > 0.02 || Math.abs(velocity[i]) > 0.5) return true;
    }
    return false;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const radius = Math.max(1, p.proximity);
    const r0 = grid.size / 2;
    // Dots at rest, one path; the others one by one, on top. A dot near the
    // pointer also swells by proximity, so the response reads even though
    // its colour is held dark enough for the text on top.
    const lit: number[] = [];
    ctx.fillStyle = ramp[0];
    ctx.beginPath();
    for (let i = 0; i < grid.count; i++) {
      const index = i * 2;
      const w = i * 4;
      const x = rest[index] + offset[index] + wave[w];
      const y = rest[index + 1] + offset[index + 1] + wave[w + 1];
      let glow = energy[i];
      if (pointer.presence > 0.001) {
        const distance = Math.hypot(x - pointer.x, y - pointer.y);
        if (distance < radius)
          glow = Math.max(glow, smootherstep(1 - distance / radius) * 0.75 * pointer.presence);
      }
      if (glow > 0.02 || energy[i] > 0.005) {
        lit.push(i, glow);
        continue;
      }
      ctx.moveTo(x + r0, y);
      ctx.arc(x, y, r0, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.lineCap = 'round';
    for (let k = 0; k < lit.length; k += 2) {
      const i = lit[k];
      const glow = lit[k + 1];
      const index = i * 2;
      const w = i * 4;
      const x = rest[index] + offset[index] + wave[w];
      const y = rest[index + 1] + offset[index + 1] + wave[w + 1];
      const r = r0 * (1 + SWELL * Math.max(energy[i], glow));
      const vx = velocity[index] + wave[w + 2];
      const vy = velocity[index + 1] + wave[w + 3];
      const speed = Math.hypot(vx, vy);
      const half = Math.min(grid.size * 2, speed * STRETCH * 0.02);
      const colour = ramp[Math.round(Math.min(1, glow * 1.2) * LEVELS)];
      // The original's halo: a soft disc in the same colour, never brighter than it.
      if (glow > 0.05) {
        ctx.globalAlpha = 0.22 * glow;
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(x, y, r * (1 + 2.5 * glow), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (half > 0.3) {
        const dx = (vx / speed) * half;
        const dy = (vy / speed) * half;
        ctx.strokeStyle = colour;
        ctx.lineWidth = r * 2;
        ctx.beginPath();
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
      } else {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  buildRamp();
  const bg = canvasBackground(host, {
    resize(width, height) {
      view.width = width;
      view.height = height;
      shocks.length = 0;
      rebuild();
    },
    step,
    draw,
    move(x, y, inside, time) {
      if (inside && pointer.inside && pointer.time) {
        const elapsed = Math.max(4, time - pointer.time) / 1000;
        pointer.vx += ((x - pointer.x) / elapsed - pointer.vx) * 0.6;
        pointer.vy += ((y - pointer.y) / elapsed - pointer.vy) * 0.6;
      } else {
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.time = inside ? time : 0;
      pointer.inside = inside;
    },
    down(x, y) {
      shocks.push({ x, y, age: 0 });
      if (shocks.length > 6) shocks.shift();
    },
    leave() {
      pointer.inside = false;
      pointer.time = 0;
    },
  });

  return {
    update(params) {
      const regrid = params.gap !== p.gap;
      p = { ...params };
      buildRamp();
      if (regrid && view.width) rebuild();
      bg.refresh();
    },
    destroy: () => bg.destroy(),
  };
};
