/**
 * Crystal ball: a glass sphere resting on the dark page, a thin neutral rim
 * crackling with electric arcs (the odd orange flicker), neutral dust swirling
 * inside, spun by the pointer's drift, and a soft shadow and reflection on the
 * floor beneath. Raw WebGL2 via the shared shader runner.
 *
 * Decorative: the host is `aria-hidden` and only sized while mounted; without
 * WebGL2 it stays an empty box. Reduced motion: one still frame.
 */
import './orb-crystal.css';
import { runShader } from './gl';
import type { FxMount } from './types';

const FRAG = `
uniform float uAccent;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  float unit = uRes.x;
  vec2 centre = vec2(0.5 * uRes.x, 0.6 * uRes.y);
  vec2 p = (gl_FragCoord.xy - centre) / unit;
  const float R = 0.38;
  float t = uTime;
  float d = length(p) / R;
  float ang = atan(p.y, p.x);
  vec3 light = vec3(0.0);

  // Pointer drift spins the dust and leans the light.
  vec2 lean = uPointer - 0.5;

  if (d < 1.0) {
    float z = sqrt(1.0 - d * d);
    vec2 n = p / R;
    // Glass body: darker heart, light gathered toward the lower rim as if refracted.
    float body = mix(-0.025, 0.0, d) + smoothstep(0.2, 1.0, -n.y * 0.8 + d * 0.5) * 0.05;
    light += LIGHT * max(body, 0.0) + vec3(min(body, 0.0));
    // Fresnel rim.
    light += LIGHT * pow(1.0 - z, 3.0) * 0.55;
    // Specular highlights, nudged by the pointer.
    light += INK * exp(-length(n - vec2(-0.38, 0.42) - lean * 0.15) * 9.0) * 0.35;
    light += INK * exp(-length(n - vec2(0.3, -0.55)) * 14.0) * 0.06;

    // Swirling dust, denser toward the core, depth-faded.
    vec2 q = rot(t * 0.22 + lean.x * 2.4) * n;
    q = rot(length(q) * 2.2 - t * 0.15) * q; // a vortex: inner layers turn faster
    float motes = dust(q * 1.4 + lean * 0.4, 9.0, t, 1.0) + dust(q * 1.4, 17.0, t * 1.3, 7.0) * 0.7;
    light += LIGHT * motes * (0.25 + 0.5 * z) * 0.75;
    // Faint nebula the dust sits in.
    light += LIGHT * fbm(q * 2.5 + t * 0.05) * z * 0.05;
  }

  // Electric rim: arcs crawl the edge and occasionally leap off it.
  float rimDist = d - 1.0;
  float arcs = 0.0;
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float wob = fbm(vec2(ang * 2.5 + fi * 11.0, t * 1.6 + fi * 3.0)) - 0.5;
    float leap = pow(max(fbm(vec2(ang * 1.2 - t * 0.4, fi * 5.0)) - 0.45, 0.0), 1.5) * 0.9;
    float off = wob * 0.07 + leap * 0.12;
    float line = exp(-abs(rimDist - off) * (120.0 - fi * 40.0));
    float flick = smoothstep(0.35, 0.75, noise2(vec2(ang * 3.0 + fi * 9.0, t * 6.0)));
    arcs += line * flick;
  }
  float accentHit = step(1.0 - uAccent * 0.45, noise2(vec2(ang * 4.0, floor(t * 10.0))));
  light += mix(LIGHT, ACCENT, accentHit) * arcs * 0.55;
  // Halo hugging the glass.
  light += LIGHT * exp(-max(rimDist, 0.0) * 18.0) * step(0.0, rimDist) * 0.05;

  // Floor: a contact shadow and a blurred reflection of the ball.
  float floorY = -R - 0.035;
  vec2 f = vec2(p.x / (R * 1.1), (p.y - floorY) / 0.035);
  float shadow = exp(-dot(f, f) * 1.2);
  light -= vec3(0.045) * shadow;
  vec2 mirror = vec2(p.x, 2.0 * floorY - p.y);
  float md = length(mirror) / R;
  float below = step(p.y, floorY);
  float refl = exp(-max(md - 1.0, 0.0) * 10.0) * pow(max(1.0 - md, 0.0) + 0.2, 1.0);
  light += LIGHT * refl * below * exp(-(floorY - p.y) * 18.0) * 0.07;

  outColor = finish(light);
}`;

export const mount: FxMount = (host, params) => {
  host.classList.add('fx-crystal-host');
  const shader = runShader(host, { frag: FRAG, params, scale: 'dpr', startTime: 12 });
  return {
    update: shader.update,
    destroy() {
      shader.destroy();
      host.classList.remove('fx-crystal-host');
    },
  };
};
