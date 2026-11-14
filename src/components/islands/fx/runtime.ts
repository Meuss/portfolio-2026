/**
 * Effects runtime: mounts an effect into every slot on the page. Slots are
 * `[data-fx-slot~="<slot>"]` elements (every match gets its own instance); the
 * cursor slot mounts on <body> everywhere.
 *
 * Two kinds of slot share this one mounting path:
 * - decided slots (`fixed.ts`) run one module with constant params;
 * - tunable slots (`src/data/effects-registry.ts`) run the variant chosen in
 *   `src/data/effects.ts`. In dev, the FX panel can override that config (URL or
 *   localStorage) and re-mount those slots live.
 *
 * Modules are dynamic imports, so a page only downloads the effects it runs.
 */
import { effects } from '../../../data/effects';
import {
  fxSlots,
  resolveConfig,
  type FxConfig,
  type FxSlot,
  type FxVariant,
} from '../../../data/effects-registry';
import { fixedFx, fixedFxSlots, type FixedFxSlot } from './fixed';
import type { FxInstance, FxLoader, FxParams } from './types';

/** Tunable slots: a module per variant; `null` keeps the component's own markup and behaviour. */
const loaders: { [S in FxSlot]: Record<FxVariant<S>, FxLoader | null> } = {
  heroBackground: {
    light: () => import('./bg-light'),
    ascii: () => import('./bg-ascii'),
    lightfall: () => import('./bg-lightfall'),
    glitch: () => import('./bg-glitch'),
    off: null,
  },
  heroWall: { drift: null, swap: () => import('./wall-swap') },
  mobileMenu: { default: null, staggered: () => import('./menu-staggered') },
  howTimeline: { fill: () => import('./timeline-fill'), off: null },
  approachHeading: { reveal: () => import('./text-scroll-reveal'), off: null },
};

type Slot = FxSlot | FixedFxSlot;
const slots: Slot[] = [...fxSlots, ...fixedFxSlots];
const isFixed = (slot: Slot): slot is FixedFxSlot => slot in fixedFx;

export const STORAGE_KEY = 'fx-config';
export const URL_PARAM = 'fx';

export function encodeConfig(config: FxConfig) {
  return btoa(JSON.stringify(config)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeConfig(value: string): unknown {
  try {
    return JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** Dev-only overrides: `?fx=` beats localStorage beats `effects.ts`. */
function initialConfig(): FxConfig {
  if (!import.meta.env.DEV) return effects;
  const fromUrl = new URLSearchParams(location.search).get(URL_PARAM);
  if (fromUrl) return resolveConfig(decodeConfig(fromUrl), effects);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return resolveConfig(JSON.parse(stored), effects);
  } catch {
    /* storage unavailable: fall through to the shipped config */
  }
  return effects;
}

let config = initialConfig();
const instances = new Map<Slot, FxInstance[]>();
// Bumped per mount, so a slow import never lands after a newer choice.
const generations = new Map<Slot, number>();

/** The module and params a slot runs now. */
function chosen(slot: Slot): { load: FxLoader | null; params: FxParams } {
  if (isFixed(slot)) return fixedFx[slot];
  const { variant, params } = config[slot];
  return { load: (loaders[slot] as Record<string, FxLoader | null>)[variant] ?? null, params };
}

/** Elements a slot mounts into. One element may host several slots (`data-fx-slot="a b"`). */
export const hostsFor = (slot: Slot) =>
  slot === 'cursor'
    ? [document.body]
    : [...document.querySelectorAll<HTMLElement>(`[data-fx-slot~="${slot}"]`)];

/** Let slot content gated in CSS (`.fx-ready--<slot>`) show. */
const ready = (slot: Slot) => hostsFor(slot).forEach((h) => h.classList.add(`fx-ready--${slot}`));

function unmount(slot: Slot) {
  instances.get(slot)?.forEach((i) => i.destroy());
  instances.delete(slot);
}

async function mountSlot(slot: Slot) {
  const token = (generations.get(slot) ?? 0) + 1;
  generations.set(slot, token);
  unmount(slot);
  const els = hostsFor(slot);
  const { load, params } = chosen(slot);
  if (!els.length || !load) return ready(slot);
  try {
    const { mount } = await load();
    if (token !== generations.get(slot)) return;
    instances.set(
      slot,
      els.map((el) => mount(el, { ...params })),
    );
  } catch (err) {
    console.warn(`[fx] ${slot} failed`, err);
  }
  ready(slot);
}

export function getConfig() {
  return config;
}

/** Apply a new config: re-mount tunable slots whose variant changed, update params on the rest. */
export function applyConfig(next: FxConfig) {
  const prev = config;
  config = next;
  for (const slot of fxSlots) {
    const current = instances.get(slot);
    if (prev[slot].variant !== next[slot].variant || !current) void mountSlot(slot);
    else current.forEach((i) => i.update?.({ ...next[slot].params }));
  }
}

// Measure and draw with the real faces, not the fallbacks.
document.fonts.ready.then(() => slots.forEach((slot) => void mountSlot(slot)));
