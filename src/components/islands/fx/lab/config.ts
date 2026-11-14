/**
 * What each experiment slot runs: the choice in `saved.ts`, else the default
 * its slot file declares. This is the part of the lab that ships; the dev
 * panel's unsaved choices are in `dev.ts`.
 */
import type { FxParams } from '../types';
import * as slots from './index';
import { saved } from './saved';
import type { FxLabChoice, FxLabConfig, FxLabSlot } from './spec';

export const lab: Record<string, FxLabSlot> = { ...slots };
export const labSlots = Object.keys(lab);

const OFF: FxLabChoice = { variant: 'off', params: {} };
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/** A variant's params at their default values; none for `off` or an unknown variant. */
export const defaultParams = (spec: FxLabSlot, variant: string): FxParams =>
  Object.hasOwn(spec.variants, variant) ? { ...spec.variants[variant].params } : {};

/** The choice a slot file declares: its default variant with its params' default values. */
export const declaredChoice = (spec: FxLabSlot): FxLabChoice =>
  Object.hasOwn(spec.variants, spec.default)
    ? { variant: spec.default, params: defaultParams(spec, spec.default) }
    : OFF;

/**
 * A valid choice for a slot out of anything (the saved file, an old
 * localStorage entry, a hand-edited URL): an unknown variant falls back to
 * `base`; missing params are filled from `base` (same variant) or the
 * defaults, unknown ones are dropped. In dev, values are also clamped to the
 * panel's ranges.
 */
export function resolveChoice(spec: FxLabSlot, input: unknown, base: FxLabChoice): FxLabChoice {
  const given = (input && typeof input === 'object' ? input : {}) as Partial<FxLabChoice>;
  const variant = given.variant;
  if (variant === 'off') return OFF;
  if (typeof variant !== 'string' || !Object.hasOwn(spec.variants, variant)) return base;
  const kept = base.variant === variant ? base.params : {};
  const params: FxParams = {};
  for (const [key, initial] of Object.entries(spec.variants[variant].params)) {
    let value = [given.params?.[key], kept[key]].find(isNumber) ?? initial;
    if (import.meta.env.DEV && spec.panel) {
      const range = spec.panel.variants[variant]?.params[key];
      if (range) value = Math.min(range.max, Math.max(range.min, value));
    }
    params[key] = value;
  }
  return { variant, params };
}

/** The same for every slot; slots the lab doesn't have are ignored. */
export function resolveConfig(input: unknown, base: FxLabConfig): FxLabConfig {
  const given = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  return Object.fromEntries(
    labSlots.map((slot) => [slot, resolveChoice(lab[slot], given[slot], base[slot])]),
  );
}

/** What ships: the saved choices over the declared defaults. */
export const shipped: FxLabConfig = resolveConfig(
  saved,
  Object.fromEntries(labSlots.map((slot) => [slot, declaredChoice(lab[slot])])),
);

/** The module and params behind a choice; `null` for `off`. */
export function chosenFx(slot: string, choice: FxLabChoice) {
  const { variants } = lab[slot];
  return Object.hasOwn(variants, choice.variant)
    ? { load: variants[choice.variant].load, params: choice.params }
    : null;
}
