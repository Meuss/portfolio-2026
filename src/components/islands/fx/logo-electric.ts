/**
 * Electric logo: on hover / keyboard focus of the header wordmark, an orange
 * lightning outline crackles around it (and the logo mark), with short arcs
 * leaping off the edges, inside a faint orange glow.
 *
 * - An aria-hidden SVG overlay; the outline is distorted by an feTurbulence +
 *   feDisplacementMap whose seed jumps ~30 times a second while visible only.
 * - `always` keeps it lit; `intensity` scales glow, opacity and displacement.
 * - Reduced motion: a still outline on hover, no crackle, no arcs.
 */
import './logo-electric.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const NS = 'http://www.w3.org/2000/svg';
const PAD = 16; // px of overflow room around the link for arcs and glow
let uid = 0;

const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
};

/** Rounded-rect path. */
const rectPath = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;

export const mount: FxMount = (host, initial) => {
  const still = prefersReducedMotion();
  let params: FxParams = { ...initial };
  const id = `fx-electric-${++uid}`;

  const svg = svgEl('svg', { class: 'fx-electric', 'aria-hidden': 'true', focusable: 'false' });
  const filter = svgEl('filter', {
    id,
    x: '-20%',
    y: '-60%',
    width: '140%',
    height: '220%',
    filterUnits: 'objectBoundingBox',
  });
  const turb = svgEl('feTurbulence', {
    type: 'fractalNoise',
    baseFrequency: '0.06 0.09',
    numOctaves: 2,
    seed: 1,
    result: 'noise',
  });
  const disp = svgEl('feDisplacementMap', {
    in: 'SourceGraphic',
    in2: 'noise',
    scale: 6,
    xChannelSelector: 'R',
    yChannelSelector: 'G',
  });
  filter.append(turb, disp);
  const defs = svgEl('defs', {});
  defs.append(filter);
  const blur = svgEl('filter', {
    id: `${id}-blur`,
    x: '-50%',
    y: '-100%',
    width: '200%',
    height: '300%',
  });
  blur.append(svgEl('feGaussianBlur', { stdDeviation: 3 }));
  defs.append(blur);

  const glow = svgEl('g', { filter: `url(#${id}-blur)` });
  const bolt = svgEl('g', { filter: `url(#${id})` });
  const arcs = svgEl('g', { filter: `url(#${id})` });
  svg.append(defs, glow, bolt, arcs);
  host.append(svg);

  let outline = '';
  const measure = () => {
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    svg.setAttribute('width', String(w + PAD * 2));
    svg.setAttribute('height', String(h + PAD * 2));
    svg.setAttribute('viewBox', `0 0 ${w + PAD * 2} ${h + PAD * 2}`);
    svg.style.left = `${-PAD}px`;
    svg.style.top = `${-PAD}px`;
    outline = rectPath(PAD - 8, PAD - 6, w + 16, h + 12, 4);
    // Also trace the logo symbol, if it shows.
    const square = host.querySelector<SVGSVGElement>('.brand-mark');
    if (square && square.getBoundingClientRect().width) {
      const hr = host.getBoundingClientRect();
      const sr = square.getBoundingClientRect();
      outline +=
        ' ' +
        rectPath(
          PAD + sr.left - hr.left - 3,
          PAD + sr.top - hr.top - 3,
          sr.width + 6,
          sr.height + 6,
          sr.width / 2 + 3,
        );
    }
    glow.replaceChildren(
      svgEl('path', { d: outline, class: 'fx-electric-glow', 'stroke-width': 3, opacity: 0.55 }),
    );
    bolt.replaceChildren(
      svgEl('path', { d: outline, class: 'fx-electric-line', 'stroke-width': 1.4 }),
      svgEl('path', { d: outline, class: 'fx-electric-core', 'stroke-width': 0.6, opacity: 0.9 }),
    );
  };

  /** A jagged arc leaping outward from a random point on the outer outline. */
  const spawnArc = () => {
    const w = host.offsetWidth + 16;
    const h = host.offsetHeight + 12;
    const per = 2 * (w + h);
    let d = Math.random() * per;
    let x: number, y: number, nx: number, ny: number;
    if (d < w) [x, y, nx, ny] = [d, 0, 0, -1];
    else if ((d -= w) < h) [x, y, nx, ny] = [w, d, 1, 0];
    else if ((d -= h) < w) [x, y, nx, ny] = [w - d, h, 0, 1];
    else [x, y, nx, ny] = [0, h - (d - w), -1, 0];
    x += PAD - 8;
    y += PAD - 6;
    const len = 6 + Math.random() * 10;
    const pts = [`${x},${y}`];
    for (let i = 1; i <= 4; i++) {
      const t = (len * i) / 4;
      const j = (Math.random() - 0.5) * 6;
      pts.push(`${x + nx * t + ny * j},${y + ny * t + nx * j}`);
    }
    const arc = svgEl('polyline', {
      points: pts.join(' '),
      class: 'fx-electric-line',
      'stroke-width': 1,
    });
    arcs.append(arc);
    arc
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 160 + Math.random() * 120,
        easing: 'ease-out',
      })
      .finished.then(
        () => arc.remove(),
        () => arc.remove(),
      );
  };

  let on = false;
  let raf = 0;
  let lastJolt = 0;
  let nextArc = 0;
  const frame = (now: number) => {
    if (now - lastJolt > 33) {
      lastJolt = now;
      turb.setAttribute('seed', String(Math.floor(Math.random() * 1000)));
      const f = 0.05 + Math.random() * 0.03;
      turb.setAttribute('baseFrequency', `${f} ${f * 1.5}`);
    }
    if (now > nextArc) {
      spawnArc();
      nextArc = now + 120 + (Math.random() * 380) / Math.max(0.3, params.intensity ?? 1);
    }
    raf = requestAnimationFrame(frame);
  };

  const apply = () => {
    const k = params.intensity ?? 1;
    disp.setAttribute('scale', String(still ? 3 : 3 + 5 * k));
    svg.style.setProperty('--fx-electric-opacity', String(Math.min(1, 0.35 + 0.5 * k)));
    glow.setAttribute('opacity', String(Math.min(1, 0.3 + 0.5 * k)));
    const lit = on || params.always === 1;
    svg.classList.toggle('is-on', lit);
    if (lit && !still && !raf && !document.hidden) raf = requestAnimationFrame(frame);
    if ((!lit || document.hidden) && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const enter = () => {
    on = true;
    apply();
  };
  const leave = () => {
    on = host.matches(':focus-visible');
    apply();
  };
  const focusIn = () => {
    on = host.matches(':focus-visible') || host.matches(':hover');
    apply();
  };
  host.addEventListener('pointerenter', enter);
  host.addEventListener('pointerleave', leave);
  host.addEventListener('focusin', focusIn);
  host.addEventListener('focusout', leave);
  document.addEventListener('visibilitychange', apply);
  const ro = new ResizeObserver(measure);
  ro.observe(host);

  measure();
  apply();

  return {
    update(next) {
      params = { ...next };
      apply();
    },
    destroy() {
      cancelAnimationFrame(raf);
      host.removeEventListener('pointerenter', enter);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('focusin', focusIn);
      host.removeEventListener('focusout', leave);
      document.removeEventListener('visibilitychange', apply);
      ro.disconnect();
      svg.remove();
    },
  };
};
