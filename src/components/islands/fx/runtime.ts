/**
 * Effects runtime: mounts every effect of `effects.ts` into its slot. A slot is
 * every `[data-fx-slot~="<slot>"]` element (each match gets its own instance;
 * one element can host several: `data-fx-slot="a b"`); the cursor mounts on
 * <body> on every page.
 *
 * Modules are dynamic imports, so a page only downloads the effects it has a
 * slot for.
 */
import { effects, type FxSlot } from './effects';

const hostsFor = (slot: FxSlot) =>
  slot === 'cursor'
    ? [document.body]
    : [...document.querySelectorAll<HTMLElement>(`[data-fx-slot~="${slot}"]`)];

async function mountSlot(slot: FxSlot) {
  const hosts = hostsFor(slot);
  if (hosts.length) {
    const { load, params } = effects[slot];
    try {
      const { mount } = await load();
      hosts.forEach((host) => mount(host, params));
    } catch (err) {
      console.warn(`[fx] ${slot} failed`, err);
    }
  }
  // Let slot content gated in CSS (`.fx-ready--<slot>`) show, mounted or not.
  hosts.forEach((host) => host.classList.add(`fx-ready--${slot}`));
}

// After the fonts: effects measure and draw with the real faces, not the fallbacks.
document.fonts.ready.then(() =>
  (Object.keys(effects) as FxSlot[]).forEach((slot) => void mountSlot(slot)),
);
