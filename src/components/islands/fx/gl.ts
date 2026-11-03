/**
 * Shared full-screen fragment-shader runner for the hero backgrounds.
 *
 * Contract for every shader background:
 * - Decorative: the canvas is created inside an `aria-hidden` host and fades in
 *   only once the first frame is drawn; without WebGL2 nothing appears.
 * - Rendered at a fraction of CSS resolution (soft effects) or capped DPR.
 * - Paused while off-screen or while the tab is hidden.
 * - Reduced motion: one still frame, no loop, no pointer response.
 *
 * Every shader gets `uRes`, `uTime` (already scaled by the `speed` param),
 * `uPointer` (0..1, eased) and `uIntensity`, plus one uniform per extra param
 * named `u` + Capitalized key (e.g. `ruby` → `uRuby`).
 *
 * PAPER / INK / GILT / RUBY are the palette tokens (read at mount, so a brand
 * palette switch re-colours them). On a light ground `finish` darkens towards
 * the light's hue instead of adding light.
 */
import { prefersReducedMotion, tokenRgb, type FxInstance, type FxParams } from './types';

export const GLSL_COMMON = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uIntensity;
out vec4 outColor;

uniform vec3 PAPER; // --color-paper
uniform vec3 INK;   // --color-ink
uniform vec3 GILT;  // --color-gilt
uniform vec3 RUBY;  // --color-accent
uniform float uLightGround;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise1(float x) {
  float i = floor(x), f = fract(x);
  return mix(hash(vec2(i, 1.7)), hash(vec2(i + 1.0, 1.7)), f * f * (3.0 - 2.0 * f));
}
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise2(p); p *= 2.03; a *= 0.5; }
  return v;
}
// Dust motes: one soft point per grid cell, drifting slowly.
float dust(vec2 uv, float scale, float t, float seed) {
  vec2 g = uv * scale + vec2(t * 0.03, t * 0.06 + seed);
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id + seed);
  if (h < 0.55) return 0.0;
  vec2 o = vec2(hash(id + 3.1 + seed), hash(id + 7.7 + seed)) - 0.5;
  o += 0.18 * vec2(sin(t * 0.4 + h * 30.0), cos(t * 0.3 + h * 20.0));
  float twinkle = 0.55 + 0.45 * sin(t * (0.6 + h) + h * 40.0);
  return smoothstep(0.075, 0.0, length(f - o * 0.7)) * twinkle;
}
// Paper + light, dithered against banding on the dark ground.
vec4 finish(vec3 light) {
  vec3 col = PAPER + light * uIntensity;
  if (uLightGround > 0.5) {
    vec3 l = light * uIntensity;
    float a = clamp(max(max(l.r, l.g), l.b) * 1.4, 0.0, 1.0);
    col = mix(PAPER, l / max(a, 1e-4) * 0.55, a);
  }
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  return vec4(col, 1.0);
}
`;

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

export interface ShaderOptions {
  /** Fragment shader body, appended to GLSL_COMMON. */
  frag: string;
  params: FxParams;
  /** Render scale relative to CSS pixels; 'dpr' for crisp output (capped at 1.5). */
  scale?: number | 'dpr';
  /** Extra GL setup after linking (textures, …). */
  setup?: (gl: WebGL2RenderingContext, prog: WebGLProgram) => void;
  /** Starting time, so the first (or only) frame already has character. */
  startTime?: number;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[fx] shader:', gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

const uniformName = (key: string) => 'u' + key[0].toUpperCase() + key.slice(1);

export function runShader(host: HTMLElement, opts: ShaderOptions): FxInstance {
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  host.append(canvas);
  const noop: FxInstance = { destroy: () => canvas.remove() };

  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) return noop;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, GLSL_COMMON + opts.frag);
  if (!vs || !fs) return noop;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return noop;
  gl.useProgram(prog);

  // One oversized triangle covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  opts.setup?.(gl, prog);

  const tokens = { PAPER: 'paper', INK: 'ink', GILT: 'gilt', RUBY: 'accent' };
  for (const [uniform, token] of Object.entries(tokens)) {
    const [r, g, b] = tokenRgb(token);
    gl.uniform3f(gl.getUniformLocation(prog, uniform), r / 255, g / 255, b / 255);
  }
  const lightGround = document.documentElement.dataset.scheme === 'light';
  gl.uniform1f(gl.getUniformLocation(prog, 'uLightGround'), lightGround ? 1 : 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uPointer = gl.getUniformLocation(prog, 'uPointer');

  let params = { ...opts.params };
  const still = prefersReducedMotion();
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let time = opts.startTime ?? 40;
  let scale = 1;

  const resize = () => {
    scale =
      opts.scale === 'dpr' ? Math.min(1.5, window.devicePixelRatio || 1) : (opts.scale ?? 0.6);
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const setParamUniforms = () => {
    for (const [key, value] of Object.entries(params)) {
      if (key === 'speed') continue;
      const u = gl.getUniformLocation(prog, uniformName(key));
      if (u) gl.uniform1f(u, value);
    }
    // Some shaders size things in device pixels.
    const uScale = gl.getUniformLocation(prog, 'uScale');
    if (uScale) gl.uniform1f(uScale, scale);
  };

  const draw = () => {
    resize();
    setParamUniforms();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt * (params.speed ?? 1);
    // Ease toward the pointer so the light drifts rather than snaps.
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (still || raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onVisibility = () => (document.hidden ? stop() : start());
  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    pointer.ty = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  const ro = new ResizeObserver(() => still && draw());

  draw();
  requestAnimationFrame(() => canvas.classList.add('is-lit'));
  if (still) {
    ro.observe(canvas);
  } else {
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', stop);
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }
    start();
  }

  return {
    update(next) {
      params = { ...next };
      if (still || !raf) draw();
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
