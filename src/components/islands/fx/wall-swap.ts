/**
 * Card swap: on desktop the hero's wall of work becomes a 3D deck of the same
 * screenshots (all of them), each offset right, up and back from the one in
 * front. Every `delay` ms the front card drops below the deck and slides in at
 * the back while the rest step forward. The deck tilts toward the pointer (`parallax`), can fan
 * out on hover (`spread`), dims cards with depth (`dim`), and the front card
 * can be flung to the back by dragging (`drag`).
 *
 * Desktop (≥1024px) only; below that the drifting strip is untouched. Autoplay
 * pauses on hover (`pause`), off-screen and in hidden tabs. Reduced motion: a
 * still deck, no autoplay, no parallax. The deck is aria-hidden like the wall
 * it replaces; destroy() restores it.
 */
import './wall-swap.css';
import { prefersReducedMotion, type FxMount, type FxParams } from './types';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DROP = 'cubic-bezier(0.55, 0, 1, 0.45)';

export const mount: FxMount = (host, params) => {
  const wall = host.querySelector<HTMLElement>('.wall');
  if (!wall) return { destroy() {} };
  let p: FxParams = { ...params };
  const reduce = prefersReducedMotion();
  const desktop = window.matchMedia('(min-width: 1024px)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const toggle = host.querySelector<HTMLElement>('.wall-toggle');

  let stage: HTMLElement | null = null;
  let deck: HTMLElement | null = null;
  let order: HTMLElement[] = [];
  let timer = 0;
  let busy = false;
  let hovered = false;
  let visible = true;
  const anims = new Set<Animation>();

  const ms = (base: number) => base / Math.max(0.2, p.speed ?? 1);
  const stepEase = () =>
    (p.bounce ?? 0) > 0 ? `cubic-bezier(0.34, ${1 + (p.bounce ?? 0) * 0.9}, 0.64, 1)` : EASE;

  /** Transform for depth slot i (0 = front), with the hover spread applied. */
  const slot = (i: number) => {
    const k = 1 + (hovered ? (p.spread ?? 0) : 0);
    const x = i * (p.distance ?? 36) * k;
    const y = i * (p.vertical ?? 30) * k;
    const z = i * (p.depth ?? 70) * k;
    return `translate3d(${x}px, calc(-50% - ${y}px), ${-z}px) skewY(${p.skew ?? 1}deg)`;
  };
  const dimAt = (i: number) => Math.min(1, (p.dim ?? 0.7) * (i / Math.max(1, order.length - 1)));

  const place = (card: HTMLElement, i: number) => {
    card.style.transform = slot(i);
    card.style.zIndex = String(100 - i);
    card.classList.toggle('is-front', i === 0);
    card.style.setProperty('--fx-swap-dim', String(dimAt(i)));
  };
  const placeAll = () => order.forEach(place);

  /** Run a WAAPI animation, then commit its end state inline and drop it. */
  const animate = (el: HTMLElement, k: Keyframe[], o: KeyframeAnimationOptions) => {
    const a = el.animate(k, { fill: 'forwards', ...o });
    anims.add(a);
    return a.finished
      .then(() => {
        a.commitStyles();
        a.cancel();
      })
      .catch(() => {})
      .finally(() => anims.delete(a));
  };

  /**
   * Send the front card to the back of the stack, like React Bits' CardSwap:
   * it leaves the deck (dropping below it, or the way a drag threw it), travels
   * back to the deepest position while clear of the others, then slides into
   * the last slot behind them. `dir` is the unit direction it leaves in;
   * `from` is where a drag left it.
   */
  const swap = async (dir = { x: 0, y: 1 }, from?: string) => {
    if (busy || order.length < 2) return;
    busy = true;
    const [front, ...rest] = order;
    front.classList.remove('is-dragging');
    const last = order.length - 1;
    // Far enough to clear the deck in that direction.
    const r = front.getBoundingClientRect();
    // Lifted toward the viewer so it never z-fights the card stepping up behind it.
    const out = `translate3d(${dir.x * r.width * 1.1}px, ${dir.y * r.height * 1.15}px, 40px)`;

    const step = rest.map((card, i) => {
      card.style.setProperty('--fx-swap-dim', String(dimAt(i)));
      card.style.zIndex = String(100 - i);
      card.classList.toggle('is-front', i === 0);
      return animate(card, [{ transform: slot(i + 1) }, { transform: slot(i) }], {
        duration: ms(850),
        delay: ms(220 + i * 40),
        easing: stepEase(),
      });
    });
    await animate(front, [{ transform: from ?? slot(0) }, { transform: `${slot(0)} ${out}` }], {
      duration: ms(600),
      easing: DROP,
    });
    // Out of the way: sink to the back of the deck, then slide in behind it.
    front.style.zIndex = '0';
    front.style.setProperty('--fx-swap-dim', String(dimAt(last)));
    await animate(
      front,
      [{ transform: `${slot(0)} ${out}` }, { transform: `${slot(last)} ${out}` }],
      { duration: ms(450), easing: 'ease-in-out' },
    );
    await animate(front, [{ transform: `${slot(last)} ${out}` }, { transform: slot(last) }], {
      duration: ms(750),
      easing: stepEase(),
    });
    await Promise.all(step);
    order = [...rest, front];
    placeAll();
    busy = false;
  };

  const schedule = () => {
    clearTimeout(timer);
    if (reduce || !deck || !(p.autoplay ?? 1)) return;
    timer = window.setTimeout(async () => {
      const paused = (p.pause ?? 1) && hovered;
      if (!paused && visible && !document.hidden && !dragging) await swap();
      schedule();
    }, p.delay ?? 3250);
  };

  // --- Parallax: the whole deck tilts toward the pointer --------------------
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let tiltRaf = 0;
  const tiltTick = () => {
    tilt.x += (tilt.tx - tilt.x) * 0.08;
    tilt.y += (tilt.ty - tilt.y) * 0.08;
    const k = p.parallax ?? 0.6;
    if (deck)
      deck.style.transform = `rotateY(${tilt.x * k * 10}deg) rotateX(${-tilt.y * k * 7}deg)`;
    const settled = Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) < 0.001;
    tiltRaf = settled ? 0 : requestAnimationFrame(tiltTick);
  };
  const kickTilt = () => {
    if (!reduce && !tiltRaf) tiltRaf = requestAnimationFrame(tiltTick);
  };

  // --- Drag: fling the front card to the back -------------------------------
  let dragging = false;
  let start = { x: 0, y: 0, id: -1 };
  let delta = { x: 0, y: 0 };
  const dragTransform = () =>
    `${slot(0)} translate(${delta.x}px, ${delta.y}px) rotate(${delta.x * 0.04}deg)`;

  const onDown = (e: PointerEvent) => {
    const front = order[0];
    if (!(p.drag ?? 1) || busy || !front || !front.contains(e.target as Node)) return;
    dragging = true;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    delta = { x: 0, y: 0 };
    front.setPointerCapture(e.pointerId);
    front.classList.add('is-dragging');
  };
  const onDrag = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== start.id) return;
    delta = { x: e.clientX - start.x, y: e.clientY - start.y };
    order[0].style.transform = dragTransform();
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== start.id) return;
    dragging = false;
    const front = order[0];
    const from = dragTransform();
    const dist = Math.hypot(delta.x, delta.y);
    if (dist > 70) {
      // Keep travelling the way it was thrown.
      void swap({ x: delta.x / dist, y: delta.y / dist }, from);
    } else {
      front.classList.remove('is-dragging');
      void animate(front, [{ transform: from }, { transform: slot(0) }], {
        duration: ms(450),
        easing: stepEase(),
      });
    }
    schedule();
  };

  // --- Build / teardown -----------------------------------------------------
  const applyLook = () => {
    if (!stage) return;
    stage.style.setProperty('--fx-swap-radius', `${p.radius ?? 10}px`);
    const n = Math.max(1, order.length - 1);
    stage.style.setProperty(
      '--fx-swap-inset',
      `${n * (p.distance ?? 36) * (1 + (p.spread ?? 0))}px`,
    );
    stage.style.setProperty('--fx-swap-lift', `${(n * (p.vertical ?? 30)) / 2}px`);
    stage.classList.toggle('is-draggable', Boolean(p.drag ?? 1));
  };

  const build = () => {
    if (deck) return;
    const cols = [...wall.querySelectorAll<HTMLElement>('.wall-col')];
    const tracks = cols.map((c) => [
      ...(c.querySelector('.wall-track')?.querySelectorAll<HTMLElement>('.wall-shot') ?? []),
    ]);
    const shots: HTMLElement[] = [];
    for (let i = 0; i < Math.max(...tracks.map((t) => t.length), 0); i++) {
      for (const t of tracks) if (t[i]) shots.push(t[i]);
    }
    if (!shots.length) return;
    stage = document.createElement('div');
    stage.className = 'fx-swap-stage';
    stage.setAttribute('aria-hidden', 'true');
    deck = document.createElement('div');
    deck.className = 'fx-swap-deck';
    stage.append(deck);
    order = shots.map((s) => {
      const card = s.cloneNode(true) as HTMLElement;
      card.classList.add('fx-swap-card');
      card.querySelectorAll('img').forEach((img) => {
        img.loading = 'eager';
        img.draggable = false;
      });
      return card;
    });
    // Back cards first so the front one paints on top.
    [...order].reverse().forEach((c) => deck!.append(c));
    applyLook();
    placeAll();
    wall.style.visibility = 'hidden';
    if (toggle) toggle.style.visibility = 'hidden';
    host.append(stage);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onDrag);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    schedule();
  };

  const teardown = () => {
    clearTimeout(timer);
    cancelAnimationFrame(tiltRaf);
    tiltRaf = 0;
    anims.forEach((a) => a.cancel());
    anims.clear();
    busy = false;
    dragging = false;
    stage?.remove();
    stage = null;
    deck = null;
    order = [];
    wall.style.removeProperty('visibility');
    toggle?.style.removeProperty('visibility');
  };

  // --- Host listeners ---------------------------------------------------------
  const onMedia = () => (desktop.matches ? build() : teardown());
  const setHover = (on: boolean) => {
    hovered = on;
    applyLook();
    if (!busy && !dragging) placeAll();
  };
  const onEnter = () => setHover(true);
  const onLeave = () => {
    setHover(false);
    tilt.tx = tilt.ty = 0;
    kickTilt();
  };
  const onMove = (e: PointerEvent) => {
    if (!fine || !stage) return;
    const r = host.getBoundingClientRect();
    tilt.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    tilt.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    kickTilt();
  };
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);
  host.addEventListener('pointerenter', onEnter);
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('pointermove', onMove, { passive: true });
  desktop.addEventListener('change', onMedia);
  onMedia();

  return {
    update(next) {
      const replay = next.delay !== p.delay || next.autoplay !== p.autoplay;
      p = { ...next };
      applyLook();
      if (!busy && !dragging) placeAll();
      kickTilt();
      if (replay) schedule();
    },
    destroy() {
      teardown();
      io.disconnect();
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointermove', onMove);
      desktop.removeEventListener('change', onMedia);
    },
  };
};
