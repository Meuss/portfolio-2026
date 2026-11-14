/**
 * Effects runtime: mounts an effect into every slot on the page. A slot is
 * every `[data-fx-slot~="<slot>"]` element (each match gets its own instance;
 * one element can host several: `data-fx-slot="a b"`); the cursor mounts on
 * <body> on every page.
 *
 * Two kinds of slot share this one mounting path:
 * - decided effects (`effects.ts`) run one module with fixed params, mounted
 *   once for as long as the page lives;
 * - experiment slots (`lab/`) run the variant that ships (`lab/config.ts`),
 *   or nothing when it is `off`. In dev, the FX panel can change that choice
 *   and re-mounts those slots live.
 *
 * Modules are dynamic imports, so a page only downloads the effects it runs.
 */
import { effects } from './effects';
import { chosenFx, labSlots, shipped } from './lab/config';
import { initialConfig } from './lab/dev';
import type { FxLabConfig } from './lab/spec';
import type { FxInstance, FxParams } from './types';

/** What a slot runs. Only an experiment module returns an instance. */
interface Fx {
  load: () => Promise<{ mount: (host: HTMLElement, params: FxParams) => FxInstance | void }>;
  params: FxParams;
}

const fixed: Record<string, Fx> = effects;
const slots = [...Object.keys(fixed), ...labSlots];

// The experiment slots' choices. Dev only: the panel's unsaved ones come first.
let config = import.meta.env.DEV ? initialConfig() : shipped;
// The experiment instances on the page, to take them out again.
const instances = new Map<string, FxInstance[]>();
// Bumped per mount, so a slow import never lands after a newer choice.
const generations = new Map<string, number>();

const chosen = (slot: string): Fx | null => fixed[slot] ?? chosenFx(slot, config[slot]);

/** Elements a slot mounts into. */
export const hostsFor = (slot: string) =>
  slot === 'cursor'
    ? [document.body]
    : [...document.querySelectorAll<HTMLElement>(`[data-fx-slot~="${slot}"]`)];

async function mountSlot(slot: string) {
  const token = (generations.get(slot) ?? 0) + 1;
  generations.set(slot, token);
  instances.get(slot)?.forEach((instance) => instance.destroy());
  instances.delete(slot);
  const hosts = hostsFor(slot);
  const fx = chosen(slot);
  // `off`: nothing mounts, and nothing marks the slot.
  if (!fx) return hosts.forEach((host) => host.classList.remove(`fx-ready--${slot}`));
  if (hosts.length) {
    try {
      const { mount } = await fx.load();
      if (token !== generations.get(slot)) return;
      const mounted = hosts.map((host) => mount(host, fx.params));
      if (!(slot in fixed)) instances.set(slot, mounted as FxInstance[]);
    } catch (err) {
      console.warn(`[fx] ${slot} failed`, err);
    }
  }
  // Let slot content gated in CSS (`.fx-ready--<slot>`) show, mounted or not.
  hosts.forEach((host) => host.classList.add(`fx-ready--${slot}`));
}

/** Dev only (the FX panel): the experiment slots' current choices. */
export const getConfig = () => config;

/**
 * Dev only (the FX panel): apply new choices. A slot whose variant changed is
 * re-mounted; one whose params changed is updated in place, or re-mounted if
 * its module has no `update`.
 */
export function applyConfig(next: FxLabConfig) {
  const prev = config;
  config = next;
  for (const slot of labSlots) {
    if (JSON.stringify(prev[slot]) === JSON.stringify(next[slot])) continue;
    const current = instances.get(slot);
    const live = prev[slot].variant === next[slot].variant && current?.every((i) => i.update);
    if (live) current!.forEach((instance) => instance.update!(next[slot].params));
    else void mountSlot(slot);
  }
}

// After the fonts: effects measure and draw with the real faces, not the fallbacks.
document.fonts.ready.then(() => slots.forEach((slot) => void mountSlot(slot)));
