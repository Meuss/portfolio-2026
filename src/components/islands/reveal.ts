/**
 * Scroll-reveal (progressive enhancement).
 *
 * Adds `.is-visible` to every `[data-reveal]` element as it scrolls into view,
 * then stops observing it (a one-shot reveal — never re-hides on scroll up).
 *
 * Accessibility / resilience contract:
 * - `prefers-reduced-motion: reduce` OR no `IntersectionObserver` support →
 *   every element is revealed immediately, so content is never gated on motion.
 * - The hidden/animated base state lives in CSS behind a
 *   `@media (prefers-reduced-motion: no-preference)` guard, so if this script
 *   never runs (no-JS, or an error) the content is fully visible anyway.
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-visible'));
} else {
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

  els.forEach((el) => io.observe(el));
}
