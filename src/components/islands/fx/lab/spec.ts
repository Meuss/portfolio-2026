/**
 * The shape of an experiment slot file (`lab/<slot>/slot.ts`). Types only.
 *
 * A slot file has two halves:
 * - what runs, in production too: the module behind each variant with its
 *   params' default values (the same `{ load, params }` shape as an entry of
 *   `fx/effects.ts`), and the variant that ships until a choice is saved;
 * - `panel`: what only the dev FX panel needs (labels, slider ranges). It is
 *   written as `panel: import.meta.env.DEV && { … }`, so a production build
 *   drops it.
 *
 * Every slot also has the variant `off`, which is not a module: nothing mounts
 * and the component stays as its markup renders it. It needs no declaration.
 */
import type { FxLabLoader, FxParams } from '../types';

export interface FxLabVariant {
  /** The variant's module, imported on demand. */
  load: FxLabLoader;
  /** Every param the module reads, with its default value. `{}` if it has none. */
  params: FxParams;
}

/** A param's slider in the panel. Its default value is in the variant's `params`. */
export interface FxLabRange {
  label: string;
  min: number;
  max: number;
  step: number;
}

export interface FxLabPanel {
  /** The slot's name in the panel. */
  label: string;
  /** Where the slot lives, shown in the panel when it isn't on the current page. */
  where: string;
  /** Per variant: the chip's label and one range per param. */
  variants: Record<string, { label: string; params: Record<string, FxLabRange> }>;
}

export interface FxLabSlot {
  /** The variant that ships until a choice is saved: `'off'` or a key of `variants`. */
  default: string;
  variants: Record<string, FxLabVariant>;
  panel: false | FxLabPanel;
}

/** What a slot runs: a variant (or `off`) and the values of its params. */
export interface FxLabChoice {
  variant: string;
  params: FxParams;
}

export type FxLabConfig = Record<string, FxLabChoice>;
