/**
 * Scroll-reveal (progressive enhancement).
 *
 * Every `[data-reveal]` element rises in on load by CSS alone (global.css), so
 * the first screen never waits for this script. This script holds back the
 * ones that start below the first screen (`.is-pending`) and adds
 * `.is-visible` to each as it scrolls into view, then stops observing it (a
 * one-shot reveal — never re-hides on scroll up).
 *
 * Accessibility / resilience contract:
 * - `prefers-reduced-motion: reduce` OR no `IntersectionObserver` support →
 *   nothing is held back, so content is never gated on motion.
 * - The animated states live in CSS behind a
 *   `@media (prefers-reduced-motion: no-preference)` guard, so if this script
 *   never runs (no-JS, or an error) the content is fully visible anyway.
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    // Fire a touch before the element is fully in view for a natural feel.
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  // Anything already touching the viewport keeps its load-time rise; the rest
  // waits, hidden, until it scrolls in. Measure everything before changing
  // any class, so the reads don't force a layout per element.
  const below = [...els].filter((el) => {
    const { top, bottom } = el.getBoundingClientRect();
    return !(top < window.innerHeight && bottom > 0);
  });
  below.forEach((el) => {
    el.classList.add('is-pending');
    io.observe(el);
  });
}
