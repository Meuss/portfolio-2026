/**
 * Timeline fill: an orange line grows along the "how it works" track as the
 * visitor scrolls through the steps (left to right when the steps sit in a
 * row, top to bottom when they stack), and each marker turns orange as the
 * line reaches it. Scrubbed: the line follows the scroll position both ways.
 *
 * - The fill starts when the timeline's top crosses `start` (a fraction of the
 *   viewport height, measured from the top) and is complete when its bottom
 *   crosses `end`. `smooth` eases the line toward that position (0 = locked to
 *   the scroll position).
 * - One aria-hidden span inside the component's own track. Per frame: one
 *   layout read, then one transform write (scaleX / scaleY from a fixed
 *   origin). The passive scroll listener is attached only while the timeline
 *   is near the viewport.
 * - Reduced motion: no-op; the plain track and neutral markers stay.
 */
import './timeline-fill.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const mount: FxMount = (host, params) => {
  const track = host.querySelector<HTMLElement>('.timeline-track');
  if (!track || prefersReducedMotion()) return { destroy() {} };

  let p: FxParams = { ...params };
  const markers = [...host.querySelectorAll<HTMLElement>('.timeline-marker')];
  const fill = document.createElement('span');
  fill.className = 'fx-timeline-fill';
  fill.setAttribute('aria-hidden', 'true');
  track.append(fill);
  host.classList.add('fx-timeline');

  let horizontal = true;
  /** Marker centres as fractions of the track's length. */
  let stops: number[] = [];
  let current = 0;
  let raf = 0;
  let last = 0;
  let listening = false;

  // Geometry that only changes with the layout: read on resize, not per frame.
  const layout = () => {
    const t = track.getBoundingClientRect();
    horizontal = t.width > t.height;
    const length = horizontal ? t.width : t.height;
    stops = markers.map((m) => {
      const r = m.getBoundingClientRect();
      const centre = horizontal ? r.left + r.width / 2 - t.left : r.top + r.height / 2 - t.top;
      return length ? centre / length : 0;
    });
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
    current = tau > 0 ? current + (target - current) * (1 - Math.exp(-dt / tau)) : target;
    if (Math.abs(target - current) < 0.0005) current = target;

    // …then write.
    fill.style.transform = `${horizontal ? 'scaleX' : 'scaleY'}(${current.toFixed(4)})`;
    markers.forEach((m, i) => m.classList.toggle('is-reached', current > 0 && current >= stops[i]));
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
  const ro = new ResizeObserver(() => {
    layout();
    request();
  });

  layout();
  io.observe(host);
  ro.observe(host);

  return {
    update(next) {
      p = { ...next };
      request();
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      listen(false);
      fill.remove();
      markers.forEach((m) => m.classList.remove('is-reached'));
      host.classList.remove('fx-timeline');
    },
  };
};
