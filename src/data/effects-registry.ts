/**
 * The effect slots still being tuned in the dev FX panel: the variants each can
 * run and every variant's tunable params. Pure data: the runtime
 * (`islands/fx/runtime.ts`) maps the variant ids to modules, the panel builds its
 * controls from this, and `src/data/effects.ts` records the chosen configuration.
 *
 * Decided effects are not here: they run one module with constant params from
 * `islands/fx/fixed.ts`.
 */

export interface ParamSpec {
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface VariantSpec {
  label: string;
  params: Record<string, ParamSpec>;
}

export interface SlotSpec {
  label: string;
  /** Where the slot lives, shown in the dev panel when it isn't on the current page. */
  where: string;
  variants: Record<string, VariantSpec>;
}

const intensity: ParamSpec = { label: 'Intensity', min: 0, max: 2, step: 0.05, default: 1 };
const speed: ParamSpec = { label: 'Speed', min: 0, max: 3, step: 0.05, default: 1 };
const accent = (d: number): ParamSpec => ({
  label: 'Orange',
  min: 0,
  max: 1,
  step: 0.05,
  default: d,
});
const entrance: ParamSpec = { label: 'Speed', min: 0.4, max: 2.5, step: 0.05, default: 1 };
const toggle = (label: string, d: 0 | 1): ParamSpec => ({
  label,
  min: 0,
  max: 1,
  step: 1,
  default: d,
});

/**
 * Variants whose id maps to no module in `islands/fx/runtime.ts` keep the
 * component's own markup and behaviour (`off`, `drift`, `default`).
 */
export const fxRegistry = {
  heroBackground: {
    label: 'Hero background',
    where: 'Home hero',
    variants: {
      light: {
        label: 'Light shafts',
        params: {
          intensity,
          speed,
          accent: accent(0.35),
          dust: { label: 'Dust', min: 0, max: 2, step: 0.05, default: 1 },
        },
      },
      ascii: {
        label: 'ASCII field',
        params: {
          intensity,
          speed,
          cell: { label: 'Cell (px)', min: 8, max: 28, step: 1, default: 13 },
          accent: accent(0.2),
        },
      },
      lightfall: {
        label: 'Lightfall',
        params: {
          intensity,
          speed,
          bend: { label: 'Cursor bend', min: 0, max: 2, step: 0.05, default: 1 },
          accent: accent(0.25),
        },
      },
      glitch: {
        label: 'Letter glitch',
        params: {
          intensity,
          speed,
          cell: { label: 'Cell (px)', min: 10, max: 32, step: 1, default: 16 },
          accent: accent(0.2),
        },
      },
      off: { label: 'Off', params: {} },
    },
  },
  heroWall: {
    label: 'Hero wall',
    where: 'Home hero',
    variants: {
      drift: { label: 'Drift', params: {} },
      swap: {
        label: 'Card swap',
        // Defaults follow React Bits' "Calm" preset.
        params: {
          distance: { label: 'Card distance (px)', min: 0, max: 80, step: 1, default: 36 },
          vertical: { label: 'Vertical dist. (px)', min: 0, max: 80, step: 1, default: 30 },
          depth: { label: 'Depth (px)', min: 0, max: 200, step: 1, default: 70 },
          skew: { label: 'Skew (°)', min: -10, max: 10, step: 0.5, default: 1 },
          radius: { label: 'Card radius (px)', min: 0, max: 24, step: 1, default: 10 },
          delay: { label: 'Delay (ms)', min: 1000, max: 8000, step: 250, default: 3250 },
          speed: { label: 'Speed', min: 0.2, max: 2, step: 0.05, default: 0.6 },
          bounce: { label: 'Bounce', min: 0, max: 1, step: 0.05, default: 0 },
          parallax: { label: 'Parallax', min: 0, max: 1, step: 0.05, default: 0.6 },
          spread: { label: 'Hover spread', min: 0, max: 1, step: 0.05, default: 0 },
          dim: { label: 'Dim', min: 0, max: 1, step: 0.05, default: 0.7 },
          autoplay: toggle('Autoplay', 1),
          pause: toggle('Pause on hover', 1),
          drag: toggle('Draggable', 1),
        },
      },
    },
  },
  mobileMenu: {
    label: 'Mobile menu',
    where: 'Header below 768px',
    variants: {
      default: { label: 'Default', params: {} },
      staggered: { label: 'Staggered', params: { speed: entrance } },
    },
  },
  howTimeline: {
    label: 'Process timeline',
    where: 'Home, how it works',
    variants: {
      fill: {
        label: 'Scroll fill',
        // Start / end are fractions of the viewport height, measured from its top:
        // the fill begins when the timeline's top crosses `start` and is complete
        // when its bottom crosses `end`.
        params: {
          start: { label: 'Start (viewport)', min: 0.4, max: 1, step: 0.05, default: 0.75 },
          end: { label: 'End (viewport)', min: 0, max: 0.8, step: 0.05, default: 0.5 },
          smooth: { label: 'Smoothing', min: 0, max: 1, step: 0.05, default: 0.3 },
        },
      },
      off: { label: 'Off', params: {} },
    },
  },
  approachHeading: {
    label: 'Approach heading',
    where: 'Home, approach',
    variants: {
      reveal: {
        label: 'Scroll reveal',
        // Opacity, blur and rotation follow React Bits' Scroll Reveal controls
        // (blur 0 = blur off). Start / end are fractions of the viewport height,
        // measured from its top: the words start lighting up when the heading's
        // top crosses `start` and are all at full when its bottom crosses `end`.
        params: {
          opacity: { label: 'Base opacity', min: 0, max: 1, step: 0.05, default: 0.1 },
          blur: { label: 'Blur (px)', min: 0, max: 12, step: 0.5, default: 4 },
          rotation: { label: 'Rotation (°)', min: 0, max: 10, step: 0.25, default: 3 },
          start: { label: 'Start (viewport)', min: 0.5, max: 1, step: 0.05, default: 0.9 },
          end: { label: 'End (viewport)', min: 0.2, max: 1, step: 0.05, default: 0.55 },
        },
      },
      off: { label: 'Off', params: {} },
    },
  },
} satisfies Record<string, SlotSpec>;

export type FxSlot = keyof typeof fxRegistry;
export type FxVariant<S extends FxSlot> = keyof (typeof fxRegistry)[S]['variants'] & string;

export interface FxSlotConfig {
  variant: string;
  params: Record<string, number>;
}
export type FxConfig = Record<FxSlot, FxSlotConfig>;

export const fxSlots = Object.keys(fxRegistry) as FxSlot[];

export function variantSpec(slot: FxSlot, variant: string): VariantSpec | undefined {
  return (fxRegistry[slot].variants as Record<string, VariantSpec>)[variant];
}

/** Default params for a variant. */
export function defaultParams(slot: FxSlot, variant: string): Record<string, number> {
  const spec = variantSpec(slot, variant);
  return Object.fromEntries(Object.entries(spec?.params ?? {}).map(([k, p]) => [k, p.default]));
}

/**
 * Turn any partial or stale config (old localStorage, a hand-edited URL) into a
 * valid one: unknown variants fall back to `base`, params are filled from
 * defaults and clamped to their ranges, unknown params are dropped.
 */
export function resolveConfig(input: unknown, base: FxConfig): FxConfig {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const out = {} as FxConfig;
  for (const slot of fxSlots) {
    const given = (raw[slot] ?? {}) as Partial<FxSlotConfig>;
    const variant =
      typeof given.variant === 'string' && variantSpec(slot, given.variant)
        ? given.variant
        : base[slot].variant;
    const spec = variantSpec(slot, variant)!;
    const fallback = variant === base[slot].variant ? base[slot].params : {};
    const params: Record<string, number> = {};
    for (const [key, p] of Object.entries(spec.params)) {
      const value = given.params?.[key] ?? fallback[key] ?? p.default;
      params[key] =
        typeof value === 'number' && Number.isFinite(value)
          ? Math.min(p.max, Math.max(p.min, value))
          : p.default;
    }
    out[slot] = { variant, params };
  }
  return out;
}
