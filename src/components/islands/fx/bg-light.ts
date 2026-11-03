/**
 * Light shafts: soft neutral light falling through an unseen window from the
 * upper right, with dust that only shows where the light catches it.
 */
import { runShader } from './gl';
import type { FxMount } from './types';

const FRAG = `
uniform float uAccent;
uniform float uDust;

// Shafts: banded noise across the angle from the light source.
float shafts(float ang, float t) {
  float n = 0.0;
  n += noise1(ang * 9.0 + t * 0.05) * 0.55;
  n += noise1(ang * 23.0 - t * 0.08 + 3.1) * 0.3;
  n += noise1(ang * 51.0 + t * 0.11 + 7.4) * 0.15;
  return smoothstep(0.38, 0.92, n);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime;

  // Source sits above the frame, upper right, nudged by the pointer.
  vec2 src = vec2(0.78 + (uPointer.x - 0.5) * 0.10, 1.35 + (uPointer.y - 0.5) * 0.05);
  vec2 d = vec2((uv.x - src.x) * aspect, uv.y - src.y);
  float ang = atan(d.x, -d.y);
  float dist = length(d);

  float cone = smoothstep(0.95, 0.15, abs(ang + 0.32));
  float fall = exp(-dist * 0.9);
  float s = shafts(ang, t) * cone * fall;
  float haze = cone * fall * 0.35;

  vec2 du = uv * vec2(aspect, 1.0);
  float motes = (dust(du, 14.0, t, 0.0) + dust(du, 26.0, t * 1.3, 11.0) * 0.6) * s * 1.8 * uDust;

  float accentBand = smoothstep(0.62, 0.9, noise1(ang * 6.0 - t * 0.03 + 2.0)) * uAccent;
  vec3 tint = mix(LIGHT, ACCENT, accentBand);
  float floorFade = smoothstep(0.0, 0.45, uv.y);

  outColor = finish(tint * (s * 0.2 + haze * 0.06 + motes * 0.5) * floorFade);
}`;

export const mount: FxMount = (host, params) => runShader(host, { frag: FRAG, params });
