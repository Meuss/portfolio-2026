/**
 * Card swap: on desktop the hero's wall of work becomes a 3D deck of the same
 * screenshots (all of them), each offset right, up and back from the one in
 * front. Every `delay` ms the front card drops below the deck and slides in at
 * the back while the rest step forward. The deck tilts toward the pointer (`parallax`), can fan
 * out on hover (`spread`), dims cards with depth (`dim`), and the front card
 * can be flung to the back by dragging (`drag`).
 *
 * Nothing locks the deck while it moves: every card animates on its own and any
 * animation can be interrupted from wherever the card is right now. The front
 * card can be grabbed mid-step, and a card still dropping away can be caught,
 * which puts it back in front.
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
  let dragging = false;
  let hovered = false;
  let visible = true;
  /** Cards on their way to the back: `drop` can still be caught, `sink` can't. */
  const leaving = new Map<HTMLElement, 'drop' | 'sink'>();

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

  /** Depth order, dimming and the front flag. Cards on their way out keep their look. */
  const markDepths = () => {
    order.forEach((card, i) => {
      if (leaving.has(card)) return;
      card.style.zIndex = String(100 - i);
      card.classList.toggle('is-front', i === 0);
      card.style.setProperty('--fx-swap-dim', String(dimAt(i)));
    });
  };

  /** Stop the card where it is right now and return that transform. */
  const freeze = (card: HTMLElement) => {
    const now = getComputedStyle(card).transform;
    card.getAnimations().forEach((a) => a.cancel());
    card.style.transform = now;
    return now;
  };

  /** Animate from wherever the card is; resolves false if something interrupted it. */
  const glide = (card: HTMLElement, to: string, o: KeyframeAnimationOptions) => {
    const a = card.animate([{ transform: freeze(card) }, { transform: to }], {
      fill: 'both',
      ...o,
    });
    return a.finished.then(
      () => {
        card.style.transform = to;
        a.cancel();
        return true;
      },
      () => false,
    );
  };

  /** Jump every card in the deck to its slot (first build, panel changes). */
  const placeAll = () => {
    markDepths();
    order.forEach((card, i) => {
      if (leaving.has(card) || (dragging && i === 0)) return;
      card.getAnimations().forEach((a) => a.cancel());
      card.style.transform = slot(i);
    });
  };

  /** Move the cards still in the deck to their slots, the resting ones staggered. */
  const stepDeck = (stagger: boolean) => {
    markDepths();
    order.forEach((card, i) => {
      if (leaving.has(card) || (dragging && i === 0)) return;
      const moving = card.getAnimations().length > 0;
      void glide(card, slot(i), {
        duration: ms(850),
        delay: stagger && !moving ? ms(220 + i * 40) : 0,
        easing: stepEase(),
      });
    });
  };

  /**
   * The card's trip to the back, like React Bits' CardSwap: it leaves the deck
   * (dropping below it, or the way a drag threw it), travels back to the deepest
   * position while clear of the others, then slides into the last slot behind
   * them. `dir` is the unit direction it leaves in.
   */
  const leave = async (card: HTMLElement, dir: { x: number; y: number }) => {
    // Far enough to clear the deck in that direction.
    const r = card.getBoundingClientRect();
    // Lifted toward the viewer so it never z-fights the card stepping up behind it.
    const out = `translate3d(${dir.x * r.width * 1.1}px, ${dir.y * r.height * 1.15}px, 40px)`;
    const backSlot = () => Math.max(0, order.indexOf(card));

    leaving.set(card, 'drop');
    card.classList.remove('is-front');
    card.classList.add('is-leaving');
    const dropped = await glide(card, `${slot(0)} ${out}`, { duration: ms(600), easing: DROP });
    if (!dropped) return;

    // Out of the way: sink to the back of the deck, then slide in behind it.
    leaving.set(card, 'sink');
    card.classList.remove('is-leaving');
    card.style.zIndex = '0';
    card.style.setProperty('--fx-swap-dim', String(dimAt(backSlot())));
    const sunk = await glide(card, `${slot(backSlot())} ${out}`, {
      duration: ms(450),
      easing: 'ease-in-out',
    });
    if (!sunk) return;

    leaving.delete(card);
    await glide(card, slot(backSlot()), { duration: ms(750), easing: stepEase() });
  };

  /** Send the front card to the back; the rest step forward right away. */
  const swap = async (dir = { x: 0, y: 1 }) => {
    if (order.length < 2) return;
    const [front, ...rest] = order;
    order = [...rest, front];
    const trip = leave(front, dir);
    stepDeck(true);
    await trip;
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
  let start = { x: 0, y: 0, id: -1 };
  let delta = { x: 0, y: 0 };
  /** Where the card was when grabbed, so picking it up mid-flight doesn't jump. */
  let grabbedAt = '';
  const dragTransform = () =>
    `translate(${delta.x}px, ${delta.y}px) ${grabbedAt} rotate(${delta.x * 0.04}deg)`;

  const onDown = (e: PointerEvent) => {
    if (!(p.drag ?? 1)) return;
    const card = (e.target as Element).closest<HTMLElement>('.fx-swap-card');
    if (!card) return;
    const caught = leaving.get(card) === 'drop';
    if (card !== order[0] && !caught) return;
    grabbedAt = freeze(card);
    dragging = true;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    delta = { x: 0, y: 0 };
    if (caught) {
      // Caught on its way out: it's the front card again, the others make room.
      leaving.delete(card);
      card.classList.remove('is-leaving');
      order = [card, ...order.filter((c) => c !== card)];
      stepDeck(false);
    }
    card.setPointerCapture(e.pointerId);
    card.classList.add('is-dragging');
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
    front.classList.remove('is-dragging');
    const dist = Math.hypot(delta.x, delta.y);
    if (dist > 70) {
      // Keep travelling the way it was thrown.
      void swap({ x: delta.x / dist, y: delta.y / dist });
    } else {
      void glide(front, slot(0), { duration: ms(450), easing: stepEase() });
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
    order.forEach((card) => card.getAnimations().forEach((a) => a.cancel()));
    leaving.clear();
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
    // Without a spread hovering moves nothing, so it mustn't disturb a running step.
    if (p.spread) stepDeck(false);
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
      placeAll();
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
