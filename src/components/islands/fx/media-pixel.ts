/**
 * Pixel transition: hovering (or focusing) a project card fills its desktop
 * screenshot with a grid of graphite pixels in random order, swaps in the
 * phone capture large on a graphite plate (or, without one, a mono caption
 * with the title and hostname), then dissolves the pixels to reveal it.
 * Reverses on leave.
 *
 * Overlay is aria-hidden; the real screenshot and its alt stay in place.
 * Reduced motion: instant swap without the pixel dissolve.
 */
import './media-pixel.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const shuffle = <T>(a: T[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const mount: FxMount = (host, params) => {
  const desktop = host.querySelector<HTMLElement>('.frame-desktop');
  if (!desktop) return { destroy() {} };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const card = (host.closest('article') as HTMLElement | null) ?? host;
  const reduce = prefersReducedMotion();
  let p: FxParams = { ...params };

  const prevPosition = desktop.style.position;
  desktop.style.position = 'relative';
  host.classList.add('fx-pixel-host');

  const layer = document.createElement('div');
  layer.className = 'fx-pixel-layer';
  layer.setAttribute('aria-hidden', 'true');
  const reveal = document.createElement('div');
  reveal.className = 'fx-pixel-reveal';
  const phoneImg = host.querySelector<HTMLImageElement>('.frame-mobile img');
  if (phoneImg) {
    const img = document.createElement('img');
    img.className = 'fx-pixel-phone';
    img.alt = '';
    img.src = phoneImg.currentSrc || phoneImg.src;
    if (phoneImg.srcset) img.srcset = phoneImg.srcset;
    img.sizes = '14rem';
    img.loading = 'lazy';
    reveal.append(img);
  } else {
    const title = card.querySelector('h3')?.textContent?.trim() ?? '';
    const href = card.querySelector<HTMLAnchorElement>('a[href^="http"]')?.href;
    const caption = document.createElement('div');
    caption.className = 'fx-pixel-caption';
    const strong = document.createElement('strong');
    strong.textContent = title;
    caption.append(strong);
    if (href) {
      const span = document.createElement('span');
      span.textContent = new URL(href).hostname.replace(/^www\./, '');
      caption.append(span);
    }
    reveal.append(caption);
  }
  const grid = document.createElement('div');
  grid.className = 'fx-pixel-grid';
  layer.append(reveal, grid);
  desktop.append(layer);

  let cells: HTMLElement[] = [];
  const buildGrid = () => {
    const cols = Math.round(p.grid ?? 14);
    const rows = Math.max(1, Math.round((cols * 10) / 16));
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.replaceChildren();
    cells = Array.from({ length: cols * rows }, () => {
      const c = document.createElement('span');
      c.className = 'fx-pixel-cell';
      if (Math.random() < 0.12) c.classList.add('is-gilt');
      grid.append(c);
      return c;
    });
  };
  buildGrid();

  let timers: number[] = [];
  let revealed = false;
  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const setRevealed = (on: boolean) => {
    layer.classList.toggle('is-revealed', on);
    host.classList.toggle('is-revealed', on);
  };

  // Fill pixels in random order, flip the content underneath, then dissolve.
  const run = (show: boolean) => {
    if (revealed === show) return;
    revealed = show;
    clear();
    if (reduce) return setRevealed(show);
    const half = ((p.duration ?? 0.5) * 1000) / 2;
    const order = shuffle([...cells]);
    order.forEach((c, i) => {
      timers.push(window.setTimeout(() => c.classList.add('is-on'), (i / order.length) * half));
    });
    timers.push(
      window.setTimeout(() => {
        setRevealed(show);
        shuffle(order).forEach((c, i) => {
          timers.push(
            window.setTimeout(() => c.classList.remove('is-on'), (i / order.length) * half),
          );
        });
      }, half + 30),
    );
  };

  const enter = () => run(true);
  const leave = () => run(false);
  const onFocusOut = (e: FocusEvent) => {
    if (!card.contains(e.relatedTarget as Node | null)) leave();
  };
  if (fine) {
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
  }
  card.addEventListener('focusin', enter);
  card.addEventListener('focusout', onFocusOut);

  return {
    update(next) {
      const gridChanged = next.grid !== p.grid;
      p = { ...next };
      if (gridChanged) {
        clear();
        buildGrid();
        revealed = false;
        setRevealed(false);
      }
    },
    destroy() {
      clear();
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointerleave', leave);
      card.removeEventListener('focusin', enter);
      card.removeEventListener('focusout', onFocusOut);
      layer.remove();
      host.classList.remove('fx-pixel-host', 'is-revealed');
      desktop.style.position = prevPosition;
    },
  };
};
