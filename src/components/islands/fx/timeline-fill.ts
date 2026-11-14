/**
 * Timeline fill: an orange line grows along the "how it works" track as the
 * visitor scrolls through the steps (left to right when the steps sit in a
 * row, top to bottom when they stack). The step numerals wait as outlines and
 * fill with ink as the line reaches them (see timeline-fill.css); orange stays
 * on the line. Scrubbed: the line follows the scroll position both ways.
 *
 * - The fill starts when the timeline's top crosses `start` (a fraction of the
 *   viewport height, measured from the top) and is complete when its bottom
 *   crosses `end`. `smooth` eases the line toward that position (0 = locked to
 *   the scroll position).
 * - One aria-hidden span inside the component's own track, and one inside its
 *   open-ended tail. Per frame: one layout read, then a transform write
 *   (scaleX / scaleY from a fixed origin) and, while the line is in the tail, a
 *   clip-path write. The passive scroll listener is attached only while the
 *   timeline is near the viewport.
 * - The outlined state only exists while the effect is mounted: the host gets
 *   its class with the first painted frame, so numerals never flash dimmed.
 * - Reduced motion: no-op; the plain track and ink numerals stay.
 */
import './timeline-fill.css';
import { prefersReducedMotion, type FxMount } from './types';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const mount: FxMount = (host, params) => {
  const track = host.querySelector<HTMLElement>('.timeline-track');
  if (!track || prefersReducedMotion()) return;

  const p = params;
  const markers = [...host.querySelectorAll<HTMLElement>('.timeline-marker')];
  const fill = document.createElement('span');
  fill.className = 'fx-timeline-fill';
  fill.setAttribute('aria-hidden', 'true');
  track.append(fill);
  // The open-ended tail after the last numeral draws its own stretch of the
  // line (solid, then dashes; see HowItWorks.astro), so it gets its own fill,
  // revealed by a clip instead of a scale: the dashes must keep their size.
  const tail = host.querySelector<HTMLElement>('.timeline-tail');
  const tailFill = document.createElement('span');
  tailFill.className = 'fx-timeline-tail-fill';
  tailFill.setAttribute('aria-hidden', 'true');
  tail?.append(tailFill);

  let horizontal = true;
  /** Where the line meets each numeral (its leading edge), as fractions of the track's length. */
  let stops: number[] = [];
  /** Where the tail takes over from the track, as a fraction of the track's length. */
  let tailStart = 1;
  let tailClip = '';
  let current = 0;
  let raf = 0;
  let last = 0;
  let listening = false;
  let painted = false;

  // Geometry that only changes with the layout: read on resize, not per frame.
  const layout = () => {
    const t = track.getBoundingClientRect();
    horizontal = t.width > t.height;
    const length = horizontal ? t.width : t.height;
    stops = markers.map((m) => {
      const r = m.getBoundingClientRect();
      return length ? (horizontal ? r.left - t.left : r.top - t.top) / length : 0;
    });
    const tr = tail?.getBoundingClientRect();
    tailStart = tr && length ? (horizontal ? tr.left - t.left : tr.top - t.top) / length : 1;
  };

  const frame = (now: number) => {
    // Read once…
    const r = host.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = p.start ?? 0.75;
    const end = Math.min(p.end ?? 0.5, start);
    const target = clamp01((start * vh - r.top) / (r.height + (start - end) * vh || 1));

    const tau = (p.smooth ?? 0) * 400; // ms
    const dt = Math.min(100, Math.max(0, now - last));
    last = now;
    // The first frame lands on the scroll position instead of easing up from empty.
    current =
      painted && tau > 0 ? current + (target - current) * (1 - Math.exp(-dt / tau)) : target;
    if (Math.abs(target - current) < 0.0005) current = target;

    // …then write.
    fill.style.transform = `${horizontal ? 'scaleX' : 'scaleY'}(${current.toFixed(4)})`;
    markers.forEach((m, i) => m.classList.toggle('is-reached', current > 0 && current >= stops[i]));
    // The tail shares the same progress: it fills over what is left of it after
    // `tailStart`, so the line still completes exactly when the fill reaches 1.
    const hidden =
      tailStart < 1 ? 100 * (1 - clamp01((current - tailStart) / (1 - tailStart))) : 100;
    const clip = `inset(0 ${horizontal ? hidden.toFixed(2) : 0}% ${horizontal ? 0 : hidden.toFixed(2)}% 0)`;
    if (clip !== tailClip) tailFill.style.clipPath = tailClip = clip;
    if (!painted) {
      painted = true;
      host.classList.add('fx-timeline');
    }
    raf = current === target ? 0 : requestAnimationFrame(frame);
  };
  const request = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) {
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request, { passive: true });
    } else {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    }
  };

  // Only follow the scroll while the timeline is within half a viewport of the
  // screen. One last frame on the way out settles the line at empty or full.
  const io = new IntersectionObserver(
    ([entry]) => {
      listen(entry.isIntersecting);
      request();
    },
    { rootMargin: '50% 0px' },
  );
  // The timeline resizing changes its geometry. The page resizing (a late font
  // swap, content opening above) moves it without a scroll event: re-measure
  // then too, if it is near the viewport.
  const ro = new ResizeObserver((entries) => {
    const own = entries.some((e) => e.target === host);
    if (own) layout();
    if (own || listening) request();
  });

  layout();
  io.observe(host);
  ro.observe(host);
  ro.observe(document.documentElement);
};
