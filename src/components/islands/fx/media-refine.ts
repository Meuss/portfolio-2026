/**
 * Refine: as a project screenshot scrolls into view it "develops" like an
 * image being generated: coarse pixels, finer pixels, a soft blur, then the
 * sharp screenshot. A gilt scan line sweeps each pass in from the top, and a
 * mono status chip counts "PASS 2/4" up to "RENDERED" before fading out.
 * Frames that come into view together (a row of cards) start `stagger` ms
 * apart, in the order they were seen; a frame seen alone starts at once.
 *
 * Fixed overlay inside the frame (no layout shift), aria-hidden; the real
 * <img> and its alt stay underneath. NDA blanks and reduced motion: no-op.
 */
import './media-refine.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Earliest time the next frame may start, shared by every instance. */
let nextStart = 0;

/** Pass list: pixel factors (fraction of full width), then a blur pass. */
function passes(stages: number) {
  const list: { factor: number; pixel: boolean }[] = [];
  const pixelPasses = Math.max(1, stages - 2);
  for (let i = 0; i < pixelPasses; i++) list.push({ factor: 1 / (48 / 2 ** i), pixel: true });
  if (stages >= 3) list.push({ factor: 1 / 6, pixel: false });
  return list; // the final pass, the sharp image, is the real <img>
}

export const mount: FxMount = (host, params) => {
  const desktop = host.querySelector<HTMLElement>('.frame-desktop');
  const img = desktop?.querySelector<HTMLImageElement>('img');
  if (!desktop || !img || prefersReducedMotion()) return { destroy() {} };

  let p: FxParams = { ...params };
  let destroyed = false;
  let started = false;
  const anims: Animation[] = [];
  const prevPosition = desktop.style.position;
  desktop.style.position = 'relative';

  const layer = document.createElement('div');
  layer.className = 'fx-refine-layer';
  layer.setAttribute('aria-hidden', 'true');
  const scan = document.createElement('span');
  scan.className = 'fx-refine-scan';
  const chip = document.createElement('span');
  chip.className = 'fx-refine-chip';

  const draw = (pass: { factor: number; pixel: boolean }) => {
    const c = document.createElement('canvas');
    const w = Math.max(2, Math.round(img.naturalWidth * pass.factor));
    const h = Math.max(2, Math.round(img.naturalHeight * pass.factor));
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = !pass.pixel;
      ctx.drawImage(img, 0, 0, w, h);
    }
    if (pass.pixel) c.classList.add('is-pixel');
    return c;
  };

  const anim = (el: Element, k: Keyframe[], o: KeyframeAnimationOptions) => {
    const a = el.animate(k, o);
    anims.push(a);
    return a.finished;
  };

  const sweep = async (incoming: HTMLElement | null, outgoing: HTMLElement, ms: number) => {
    const opts = { duration: ms, easing: EASE, fill: 'forwards' as const };
    scan.style.opacity = '1';
    await Promise.all([
      incoming
        ? anim(incoming, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], opts)
        : anim(
            outgoing,
            [{ clipPath: 'inset(0% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)' }],
            opts,
          ),
      anim(scan, [{ top: '0%' }, { top: '100%' }], opts),
    ]);
    scan.style.opacity = '0';
  };

  const run = async () => {
    const list = passes(Math.round(p.stages ?? 4));
    const total = list.length + 1;
    const ms = 500 / (p.speed ?? 1);
    let current = layer.querySelector('canvas') as HTMLCanvasElement;
    for (let i = 1; i < list.length && !destroyed; i++) {
      chip.textContent = `Pass ${i + 1}/${total}`;
      const next = draw(list[i]);
      layer.insertBefore(next, scan);
      await sweep(next, current, ms);
      current.remove();
      current = next;
    }
    if (destroyed) return;
    chip.textContent = `Pass ${total}/${total}`;
    await sweep(null, current, ms);
    if (destroyed) return;
    chip.textContent = 'Rendered';
    await new Promise((r) => setTimeout(r, 700));
    chip.style.opacity = '0';
    await new Promise((r) => setTimeout(r, 500));
    if (!destroyed) layer.remove();
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      io.disconnect();
      // Let it be seen coarse for a beat before refining, behind any frame just started.
      const now = performance.now();
      const at = Math.max(now, nextStart);
      nextStart = at + (p.stagger ?? 0);
      setTimeout(() => !destroyed && run().catch(() => layer.remove()), 250 + at - now);
    },
    { threshold: 0.35 },
  );

  // Paint the coarse first pass as soon as the image exists, then wait for view.
  const prepare = () => {
    if (destroyed || !img.naturalWidth) return;
    const list = passes(Math.round(p.stages ?? 4));
    chip.textContent = `Pass 1/${list.length + 1}`;
    layer.replaceChildren(draw(list[0]), scan, chip);
    desktop.append(layer);
    io.observe(host);
  };
  if (img.complete && img.naturalWidth) img.decode().then(prepare, prepare);
  else img.addEventListener('load', prepare, { once: true });

  return {
    update(next) {
      p = { ...next };
    },
    destroy() {
      destroyed = true;
      io.disconnect();
      img.removeEventListener('load', prepare);
      anims.forEach((a) => a.cancel());
      layer.remove();
      desktop.style.position = prevPosition;
    },
  };
};
