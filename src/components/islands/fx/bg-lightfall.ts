/**
 * Lightfall: gilt streaks of light falling down a gently curved tunnel from a
 * vanishing point above the screenshot wall. Streaks bend away from the
 * cursor; holding the pointer down over the hero stretches them into warp
 * trails, easing back on release. A few streaks run ruby.
 *
 * Contract: shader via the shared runner (paused off-screen / hidden, still
 * frame under reduced motion). The left copy stays readable: streaks fade
 * toward the left edge and the floor. Warp never blocks clicks.
 */
import { runShader } from './gl';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const FRAG = `
uniform float uBend;
uniform float uRuby;
uniform float uWarp;

const float TAU = 6.2831853;

// One ring of streaks: angular bins, each with a head racing outward.
float streaks(float a, float r, float t, float bins, float seed, out float tint) {
  float cellA = a / TAU * bins;
  float id = floor(cellA);
  float fa = fract(cellA) - 0.5;
  float h = hash(vec2(id, seed));
  tint = hash(vec2(id, seed + 9.0));
  if (h < 0.42) return 0.0;
  float z = fract(h * 13.7 + t * (0.12 + 0.22 * h));
  float head = z * z * 1.7;
  float len = (0.05 + 0.3 * z) * (1.0 + uWarp * 5.0);
  float along = smoothstep(head - len, head, r) * step(r, head);
  float lat = abs(fa) * TAU / bins * r; // lateral distance, uv units
  float thick = (0.0012 + 0.0028 * z) * (1.0 + uWarp * 0.6);
  return smoothstep(thick, 0.0, lat) * along * (0.25 + z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime;

  // Push the field away from the pointer.
  vec2 pd = (uv - uPointer) * vec2(aspect, 1.0);
  float infl = exp(-dot(pd, pd) / 0.035) * uBend;
  vec2 q = uv + normalize(pd + 1e-4) / vec2(aspect, 1.0) * infl * 0.05;

  vec2 vp = vec2(0.72, 1.08);
  vec2 d = (q - vp) * vec2(aspect, 1.0);
  float r = length(d);
  float a = atan(d.x, -d.y) + r * 0.45; // the tunnel curves as it nears
  a = mod(a + TAU, TAU);

  float tintA, tintB;
  float s = streaks(a, r, t, 110.0, 1.0, tintA);
  float s2 = streaks(a + 0.013, r, t * 0.8, 170.0, 5.0, tintB) * 0.6;

  vec3 light = mix(GILT, RUBY, step(1.0 - uRuby * 0.45, tintA)) * s
             + mix(GILT, RUBY, step(1.0 - uRuby * 0.45, tintB)) * s2;
  // The mouth of the tunnel glows faintly.
  light += GILT * exp(-r * 4.0) * 0.06;

  float side = smoothstep(0.18, 0.7, uv.x);
  float floorFade = smoothstep(0.0, 0.3, uv.y);
  outColor = finish(light * 0.55 * side * floorFade);
}`;

export const mount: FxMount = (host, params) => {
  let current: FxParams = { ...params };
  let warp = 0;
  let target = 0;
  let raf = 0;
  const inst = runShader(host, { frag: FRAG, params: { ...current, warp } });
  const area = host.parentElement;
  const interactive =
    !prefersReducedMotion() && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const ease = () => {
    warp += (target - warp) * (target > warp ? 0.06 : 0.04);
    if (Math.abs(target - warp) < 0.002) warp = target;
    inst.update?.({ ...current, warp });
    raf = warp === target ? 0 : requestAnimationFrame(ease);
  };
  const set = (v: number) => {
    target = v;
    if (!raf) raf = requestAnimationFrame(ease);
  };
  const down = () => set(1);
  const up = () => set(0);

  if (interactive && area) {
    area.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  return {
    update(next) {
      current = { ...next };
      inst.update?.({ ...current, warp });
    },
    destroy() {
      cancelAnimationFrame(raf);
      area?.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      inst.destroy();
    },
  };
};
