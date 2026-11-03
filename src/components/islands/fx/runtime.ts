/**
 * Effects runtime: mounts the configured variant into every effect slot on the
 * page. Slots are `[data-fx-slot~="<slot>"]` elements (every match gets its own
 * instance); the cursor slot mounts on <body> everywhere.
 *
 * Variants are dynamic imports, so a page only downloads the variants it
 * actually runs. In dev, the FX panel can override the config (URL or
 * localStorage) and re-mount slots live; production uses `src/data/effects.ts`.
 */
import { effects } from '../../../data/effects';
import { fxSlots, resolveConfig, type FxConfig, type FxSlot } from '../../../data/effects-registry';
import type { FxInstance, FxMount } from './types';

type Loader = () => Promise<{ mount: FxMount }>;

// Shared by slots that offer the same variants in different places.
const cursorLoaders = {
  lamp: () => import('./cursor-lamp'),
  glow: () => import('./cursor-glow'),
  crosshair: () => import('./cursor-crosshair'),
  off: null,
};
const mediaLoaders = {
  off: null,
  tilt: () => import('./media-tilt'),
  pixel: () => import('./media-pixel'),
  refine: () => import('./media-refine'),
};
const techLoaders = { off: null, tech: () => import('./name-tech') };

const loaders: Record<FxSlot, Record<string, Loader | null>> = {
  heroBackground: {
    light: () => import('./bg-light'),
    ascii: () => import('./bg-ascii'),
    lightfall: () => import('./bg-lightfall'),
    glitch: () => import('./bg-glitch'),
    off: null,
  },
  heroWall: { drift: null, swap: () => import('./wall-swap') },
  heroName: {
    scramble: () => import('./name-scramble'),
    decode: () => import('./name-decode'),
    plain: null,
  },
  heroNameHover: techLoaders,
  logo: { off: null, electric: () => import('./logo-electric') },
  cursor: cursorLoaders,
  contactCursor: cursorLoaders,
  primaryButton: { off: null, star: () => import('./button-star') },
  featuredMedia: mediaLoaders,
  workMedia: mediaLoaders,
  ctaBackground: {
    off: null,
    laser: () => import('./cta-laser'),
    magnet: () => import('./cta-magnet'),
  },
  mobileMenu: { default: null, staggered: () => import('./menu-staggered') },
  aboutPortrait: { static: null, lanyard: () => import('./portrait-lanyard') },
  contactOrb: { off: null, crystal: () => import('./orb-crystal') },
  contactHeading: techLoaders,
  contactLead: { off: null, scrambled: () => import('./text-scrambled') },
  notFound: { plain: null, fuzzy: () => import('./text-fuzzy') },
};

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
const instances = new Map<FxSlot, { variant: string; instances: FxInstance[] }>();
// Bumped per mount, so a slow import never lands after a newer choice.
const generations = new Map<FxSlot, number>();

/** Elements a slot mounts into. One element may host several slots (`data-fx-slot="a b"`). */
export const hostsFor = (slot: FxSlot) =>
  slot === 'cursor'
    ? [document.body]
    : [...document.querySelectorAll<HTMLElement>(`[data-fx-slot~="${slot}"]`)];

/** Let slot content gated in CSS (`.fx-ready--<slot>`) show. */
const ready = (slot: FxSlot) => hostsFor(slot).forEach((h) => h.classList.add(`fx-ready--${slot}`));

function unmount(slot: FxSlot) {
  instances.get(slot)?.instances.forEach((i) => i.destroy());
  instances.delete(slot);
}

async function mountSlot(slot: FxSlot) {
  const token = (generations.get(slot) ?? 0) + 1;
  generations.set(slot, token);
  unmount(slot);
  const els = hostsFor(slot);
  const { variant, params } = config[slot];
  const load = loaders[slot][variant];
  if (!els.length || !load) return ready(slot);
  try {
    const { mount } = await load();
    if (token !== generations.get(slot)) return;
    instances.set(slot, {
      variant,
      instances: els.map((el) => mount(el, { ...params }, variant)),
    });
  } catch (err) {
    console.warn(`[fx] ${slot}/${variant} failed`, err);
  }
  ready(slot);
}

export function getConfig() {
  return config;
}

/** Apply a new config: re-mount slots whose variant changed, update params on the rest. */
export function applyConfig(next: FxConfig) {
  const prev = config;
  config = next;
  for (const slot of fxSlots) {
    const current = instances.get(slot);
    if (prev[slot].variant !== next[slot].variant || !current) void mountSlot(slot);
    else current.instances.forEach((i) => i.update?.({ ...next[slot].params }));
  }
}

export function replay(slot: FxSlot) {
  void mountSlot(slot);
}

/** Re-mount every slot, e.g. after a brand palette switch (canvas effects read colours at mount). */
export function remountAll() {
  fxSlots.forEach((slot) => void mountSlot(slot));
}

// Measure and draw with the real faces, not the fallbacks.
document.fonts.ready.then(() => fxSlots.forEach((slot) => void mountSlot(slot)));
