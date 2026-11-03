/**
 * ASCII field: a slow flowing noise field drawn as a grid of DM Mono glyphs,
 * densest in the upper right and swelling under the pointer, gilt with ruby
 * in the hottest cells.
 */
import { runShader } from './gl';
import type { FxMount } from './types';

const RAMP = ' .,:;-=+*%#@';
const TILE = 64;

const FRAG = `
uniform float uCell;
uniform float uRuby;
uniform float uScale;
uniform sampler2D uAtlas;

void main() {
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  float size = uCell * uScale;
  vec2 cell = floor(gl_FragCoord.xy / size);
  vec2 local = fract(gl_FragCoord.xy / size);
  vec2 c = (cell + 0.5) * size / uRes; // cell centre, 0..1

  vec2 q = c * vec2(aspect, 1.0) * 2.2;
  float v = fbm(q + vec2(t * 0.05, -t * 0.03) + fbm(q * 0.7 - t * 0.02) * 1.2);
  float glow = exp(-length((c - vec2(0.85, 0.9)) * vec2(aspect, 1.0)) * 0.95);
  vec2 dp = (c - uPointer) * vec2(aspect, 1.0);
  float lamp = exp(-dot(dp, dp) / 0.05) * 0.5;
  v = clamp(smoothstep(0.28, 0.72, v) * (glow * 1.25 + lamp), 0.0, 1.0);

  float n = ${RAMP.length.toFixed(1)};
  float idx = min(floor(v * n), n - 1.0);
  float glyph = texture(uAtlas, vec2((idx + local.x) / n, 1.0 - local.y)).r;

  vec3 tint = mix(GILT, RUBY, smoothstep(0.75, 1.0, v) * uRuby);
  float side = smoothstep(0.15, 0.6, c.x);
  outColor = finish(tint * glyph * (0.1 + v * 0.5) * side);
}`;

function atlas(gl: WebGL2RenderingContext, prog: WebGLProgram) {
  const cv = document.createElement('canvas');
  cv.width = TILE * RAMP.length;
  cv.height = TILE;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#fff';
  ctx.font = `500 ${TILE * 0.78}px 'DM Mono', ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  [...RAMP].forEach((ch, i) => ctx.fillText(ch, i * TILE + TILE / 2, TILE / 2 + 2));
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(prog, 'uAtlas'), 0);
}

export const mount: FxMount = (host, params) =>
  runShader(host, { frag: FRAG, params, scale: 'dpr', setup: atlas });
