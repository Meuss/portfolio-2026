/**
 * Laser flow: a thin gilt beam falls from the top of the closing CTA onto the
 * block of copy, splashes where it lands, and the light runs sideways along
 * the block's top edge and pours over its corners, with fog drifting around
 * the beam and a faint ruby fringe.
 *
 * Contract: shader via the shared runner (paused off-screen / hidden, still
 * frame under reduced motion). It outputs light only and is screen-blended,
 * so the CTA band keeps its own gradient. The content rect is re-measured on
 * resize and passed in as extra params (uBoxL/R/T/B, uBeamX, uv units, y up).
 */
import './cta-laser.css';
import { runShader } from './gl';
import type { FxMount, FxParams } from './types';

const FRAG = `
uniform float uRuby;
uniform float uBoxL;
uniform float uBoxR;
uniform float uBoxT;
uniform float uBeamX;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  vec2 px = uv * uRes;
  float reach = uRes.x * 0.38;

  // Beam: above the box only, slight flicker, fog-modulated halo.
  float above = smoothstep(uBoxT - 0.002, uBoxT + 0.01, uv.y);
  float dx = (uv.x - uBeamX) * uRes.x;
  float flick = 0.88 + 0.12 * noise1(t * 9.0);
  float fog = fbm(vec2(uv.x * 7.0, uv.y * 2.5 + t * 0.7));
  float core = exp(-dx * dx / 1.6) * above * flick;
  float halo = exp(-abs(dx) / 22.0) * above * (0.25 + 0.55 * fog);
  float fringe = exp(-(dx - 2.5) * (dx - 2.5) / 2.0) * above;

  // Splash where it lands.
  vec2 dh = px - vec2(uBeamX, uBoxT) * uRes;
  float splash = exp(-length(dh) / 34.0) * 0.9 + exp(-dot(dh, dh) / 60.0);

  // Light running along the top edge, flowing away from the beam.
  float dy = (uv.y - uBoxT) * uRes.y;
  float inX = smoothstep(uBoxL - 0.004, uBoxL, uv.x) * smoothstep(uBoxR + 0.004, uBoxR, uv.x);
  float fromBeam = abs(uv.x - uBeamX) * uRes.x;
  float flow = fbm(vec2(fromBeam * 0.018 - t * 1.4, sign(uv.x - uBeamX) * 4.0));
  float edge = exp(-dy * dy / 5.0) * inX * exp(-fromBeam / reach) * (0.35 + flow);
  float edgeGlow = exp(-abs(dy) / 14.0) * inX * exp(-fromBeam / reach) * 0.18;

  // Pouring over both corners and running down the sides.
  float down = (uBoxT - uv.y) * uRes.y;
  float drip = 0.6 + 0.4 * noise2(vec2(down * 0.03 - t * 2.0, 1.0));
  float fall = step(0.0, down) * exp(-down / 110.0) * drip;
  float dl = (uv.x - uBoxL) * uRes.x;
  float dr = (uv.x - uBoxR) * uRes.x;
  float amtL = exp(-abs(uBeamX - uBoxL) * uRes.x / reach);
  float amtR = exp(-abs(uBoxR - uBeamX) * uRes.x / reach);
  float pour = (exp(-dl * dl / 3.0) * amtL + exp(-dr * dr / 3.0) * amtR) * fall;

  vec3 light = GILT * (core * 1.1 + halo * 0.5 + splash * 0.7 + edge * 0.8 + edgeGlow + pour * 0.7)
             + RUBY * fringe * uRuby * 0.6
             + RUBY * edgeGlow * uRuby * 0.5;
  // Fade where the band meets the footer.
  light *= smoothstep(0.0, 0.18, uv.y);
  vec3 col = light * uIntensity;
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  outColor = vec4(max(col, 0.0), 1.0);
}`;

export const mount: FxMount = (host, params) => {
  let current: FxParams = { ...params };
  const content = host.nextElementSibling as HTMLElement | null;
  host.classList.add('fx-laser-host');

  /** The copy block's bounds (heading, lead, button), padded, in host uv (y up). */
  const measure = () => {
    const h = host.getBoundingClientRect();
    const parts = content ? [...content.children].map((c) => c.getBoundingClientRect()) : [];
    if (!parts.length || h.width === 0 || h.height === 0) {
      return { boxL: 0.1, boxR: 0.9, boxT: 0.7, beamX: 0.6 };
    }
    const pad = 18;
    const left = Math.min(...parts.map((r) => r.left)) - pad;
    const right = Math.max(...parts.map((r) => r.right)) + pad;
    const top = Math.min(...parts.map((r) => r.top)) - pad;
    const boxL = (left - h.left) / h.width;
    const boxR = (right - h.left) / h.width;
    return {
      boxL,
      boxR,
      boxT: 1 - (top - h.top) / h.height,
      beamX: boxL + (boxR - boxL) * 0.68,
    };
  };

  let box = measure();
  const inst = runShader(host, { frag: FRAG, params: { ...current, ...box } });
  const ro = new ResizeObserver(() => {
    box = measure();
    inst.update?.({ ...current, ...box });
  });
  ro.observe(host);
  // Fonts / reveal transforms can shift the copy after mount.
  const late = setTimeout(() => {
    box = measure();
    inst.update?.({ ...current, ...box });
  }, 900);

  return {
    update(next) {
      current = { ...next };
      inst.update?.({ ...current, ...box });
    },
    destroy() {
      clearTimeout(late);
      ro.disconnect();
      inst.destroy();
      host.classList.remove('fx-laser-host');
    },
  };
};
