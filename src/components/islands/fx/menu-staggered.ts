/**
 * Staggered menu (below 768px): opening the mobile nav sweeps two layered
 * panels in from the right (graphite surface, then a gilt-edged paper sheet),
 * the nav becomes a full-height overlay whose links rise in at display size one
 * after another, the language switcher fading in last; the hamburger folds
 * into an X. Closing sweeps the layers back out.
 *
 * It only dresses the header's own menu: `Header.astro` still owns open/close,
 * `aria-expanded`, Escape and focus; this observes `aria-expanded`.
 * Reduced motion: the overlay and the X, without sweeps or staggers.
 */
import './menu-staggered.css';
import { prefersReducedMotion, type FxMount } from './types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SHOWN = 'inset(0 0 0 0)';
const PARKED = 'inset(0 0 0 100%)';

export const mount: FxMount = (header, params) => {
  const toggle = header.querySelector<HTMLButtonElement>('#nav-toggle');
  const panel = header.querySelector<HTMLElement>('#primary-nav');
  if (!toggle || !panel) return { destroy() {} };

  const mobile = window.matchMedia('(max-width: 767px)');
  const reduce = prefersReducedMotion();
  let speed = params.speed ?? 1;
  const ms = (n: number) => (reduce ? 0 : n / speed);

  const layers = [1, 2].map((n) => {
    const layer = document.createElement('div');
    layer.className = `fx-menu-layer fx-menu-layer--${n}`;
    layer.setAttribute('aria-hidden', 'true');
    header.append(layer);
    return layer;
  });
  toggle.classList.add('fx-menu-toggle');

  const links = () => [...(panel.children[0]?.querySelectorAll<HTMLElement>('a') ?? [])];
  const switcher = () => panel.children[1] as HTMLElement | undefined;
  const running: Animation[] = [];
  const track = (a: Animation) => (running.push(a), a);
  const stopAll = () => running.splice(0).forEach((a) => a.cancel());

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const open = (animate: boolean) => {
    stopAll();
    // Take the panel out of flow first, so the header is measured at bar height.
    panel.classList.add('fx-menu-panel');
    header.style.setProperty('--fx-menu-top', `${header.getBoundingClientRect().bottom}px`);
    toggle.classList.add('is-x');
    document.documentElement.classList.add('fx-menu-lock');
    if (!animate || reduce) {
      layers.forEach((l) => (l.style.clipPath = SHOWN));
      return;
    }
    layers.forEach((layer, i) => {
      layer.style.clipPath = SHOWN;
      track(
        layer.animate([{ clipPath: PARKED }, { clipPath: SHOWN }], {
          duration: ms(420),
          delay: ms(i * 80),
          easing: EASE,
          fill: 'backwards',
        }),
      );
    });
    track(
      panel.animate([{ clipPath: PARKED }, { clipPath: SHOWN }], {
        duration: ms(460),
        delay: ms(160),
        easing: EASE,
        fill: 'backwards',
      }),
    );
    const items = links();
    items.forEach((a, i) =>
      track(
        a.animate(
          [
            { transform: 'translateY(0.8em)', opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: ms(520), delay: ms(300 + i * 70), easing: EASE, fill: 'backwards' },
        ),
      ),
    );
    const sw = switcher();
    if (sw) {
      track(
        sw.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: ms(400),
          delay: ms(300 + items.length * 70 + 80),
          easing: 'ease-out',
          fill: 'backwards',
        }),
      );
    }
  };

  const close = (animate: boolean) => {
    stopAll();
    panel.classList.remove('fx-menu-panel');
    toggle.classList.remove('is-x');
    document.documentElement.classList.remove('fx-menu-lock');
    layers.forEach((layer, i) => {
      layer.style.clipPath = PARKED;
      if (!animate || reduce) return;
      // The nav is already hidden by the header script; the sheets sweep away after it.
      track(
        layer.animate([{ clipPath: SHOWN }, { clipPath: PARKED }], {
          duration: ms(260),
          delay: ms((1 - i) * 50),
          easing: 'cubic-bezier(0.7, 0, 0.84, 0)',
          fill: 'backwards',
        }),
      );
    });
  };

  const sync = (animate: boolean) => {
    if (isOpen() && mobile.matches) open(animate);
    else close(animate && mobile.matches);
  };

  const observer = new MutationObserver(() => sync(true));
  observer.observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
  const onBreakpoint = () => sync(false);
  mobile.addEventListener('change', onBreakpoint);
  sync(false);

  return {
    update(next) {
      speed = next.speed ?? 1;
    },
    destroy() {
      observer.disconnect();
      mobile.removeEventListener('change', onBreakpoint);
      stopAll();
      layers.forEach((l) => l.remove());
      panel.classList.remove('fx-menu-panel');
      toggle.classList.remove('fx-menu-toggle', 'is-x');
      document.documentElement.classList.remove('fx-menu-lock');
      header.style.removeProperty('--fx-menu-top');
    },
  };
};
