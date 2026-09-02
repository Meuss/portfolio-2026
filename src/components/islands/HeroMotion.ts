/**
 * Hero signature motion — "measurement field".
 *
 * A quiet Swiss-lab kinetic moment mounted BEHIND the static hero content
 * (`#hero-motion`, z-0, aria-hidden, pointer-events-none). A precise grid of
 * fine dots sits on the porcelain ground; a soft diagonal wavefront sweeps
 * across it, briefly swelling dots and tinting them from faint ink toward the
 * single ultramarine accent — like a scanning/plotting instrument taking a
 * reading. Only the design palette is used (accent on paper/ink); nothing
 * competes with the foreground type for legibility.
 *
 * Performance & accessibility:
 * - Reduced-motion users get NOTHING here (guarded on the very first line) —
 *   the static hero is left untouched.
 * - Renders on a 2D canvas (no libraries, no CDN); device pixel ratio is capped
 *   at 1.5 and the dot grid is spaced generously, so per-frame work stays small.
 * - The rAF loop is paused when the tab is hidden (`visibilitychange`) and when
 *   the hero scrolls out of view (`IntersectionObserver`), so it costs nothing
 *   once the user reads on.
 * - Intended to be dynamic-imported after first paint (see Hero.astro), so it
 *   never blocks rendering of the real, finished hero.
 */

type RGB = readonly [number, number, number];

function hexToRgb(hex: string, fallback: RGB): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function initHeroMotion(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mount = document.getElementById('hero-motion');
  if (!mount) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  mount.appendChild(canvas);

  // Pull the palette straight from the design tokens so this can never drift.
  const styles = getComputedStyle(document.documentElement);
  const accent = hexToRgb(styles.getPropertyValue('--color-accent'), [42, 40, 240]);
  const ink = hexToRgb(styles.getPropertyValue('--color-ink'), [21, 19, 14]);

  let width = 0;
  let height = 0;
  let gap = 36;
  let cols = 0;
  let rows = 0;
  let diag = 1;

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = mount!.getBoundingClientRect();
    width = Math.max(rect.width, 1);
    height = Math.max(rect.height, 1);
    gap = width < 640 ? 28 : 38;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / gap) + 1;
    rows = Math.ceil(height / gap) + 1;
    diag = width + height || 1;
  }

  const TWO_PI = Math.PI * 2;
  const WAVELENGTH = 360; // px between wave crests along the diagonal
  const SPEED = 0.05; // wavefronts per second
  const BAND = 0.55; // crest sharpness (higher = tighter accent band)

  let start = 0;

  function frame(now: number): void {
    if (!running) return;
    if (start === 0) start = now;
    const t = (now - start) / 1000;

    ctx!.clearRect(0, 0, width, height);

    // Diagonal phase offset, normalised so the band travels corner-to-corner.
    const travel = t * SPEED * TWO_PI;

    for (let iy = 0; iy < rows; iy++) {
      const y = iy * gap;
      for (let ix = 0; ix < cols; ix++) {
        const x = ix * gap;
        // Projection onto the diagonal axis → a clean traveling wavefront.
        const proj = (x + y) / diag; // 0..~1
        const phase = proj * (diag / WAVELENGTH) * TWO_PI - travel;
        const s = (Math.sin(phase) + 1) * 0.5; // 0..1
        const crest = Math.pow(s, 1 / BAND); // sharpen toward the crest

        const radius = 0.55 + crest * 2.2;
        // Faint ink baseline dot → accent at the crest.
        const r = ink[0] + (accent[0] - ink[0]) * crest;
        const g = ink[1] + (accent[1] - ink[1]) * crest;
        const b = ink[2] + (accent[2] - ink[2]) * crest;
        const alpha = 0.05 + crest * 0.42;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
        ctx!.arc(x, y, radius, 0, TWO_PI);
        ctx!.fill();
      }
    }

    raf = requestAnimationFrame(frame);
  }

  let running = false;
  let raf = 0;

  function play(): void {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function pause(): void {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // --- Lifecycle: only animate while visible and on-screen -------------------
  let onScreen = true;

  function sync(): void {
    if (onScreen && document.visibilityState === 'visible') play();
    else pause();
  }

  document.addEventListener('visibilitychange', sync);

  window.addEventListener(
    'resize',
    () => {
      resize();
    },
    { passive: true },
  );

  if ('IntersectionObserver' in window) {
    const vis = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    vis.observe(mount);
  }

  resize();
  sync();
}
