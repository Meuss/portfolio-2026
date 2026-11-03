/**
 * Every effect slot on the site, the variants it can run, and each variant's
 * tunable params. Pure data: the runtime (`islands/fx/runtime.ts`) maps the
 * variant ids to modules, the dev panel builds its controls from this, and
 * `src/data/effects.ts` records the chosen configuration.
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
  /** Whether "replay" makes sense (one-shot entrances). */
  replayable?: boolean;
  variants: Record<string, VariantSpec>;
}

const intensity: ParamSpec = { label: 'Intensity', min: 0, max: 2, step: 0.05, default: 1 };
const speed: ParamSpec = { label: 'Speed', min: 0, max: 3, step: 0.05, default: 1 };
const ruby = (d: number): ParamSpec => ({ label: 'Ruby', min: 0, max: 1, step: 0.05, default: d });
const entrance: ParamSpec = { label: 'Speed', min: 0.4, max: 2.5, step: 0.05, default: 1 };
const toggle = (label: string, d: 0 | 1): ParamSpec => ({
  label,
  min: 0,
  max: 1,
  step: 1,
  default: d,
});

const cursorVariants = {
  lamp: {
    label: 'Lamp',
    params: {
      size: { label: 'Size (rem)', min: 16, max: 72, step: 1, default: 44 },
      strength: { label: 'Strength', min: 0, max: 3, step: 0.05, default: 1 },
    },
  },
  glow: {
    label: 'Glow trail',
    params: {
      intensity,
      trail: { label: 'Trail', min: 0.2, max: 3, step: 0.05, default: 1 },
      ruby: ruby(0.35),
    },
  },
  crosshair: {
    label: 'Crosshair',
    params: {
      snap: toggle('Snap to links', 1),
      coords: toggle('Coordinates', 1),
      typing: { label: 'Fade while typing', min: 0, max: 1, step: 0.05, default: 0.8 },
    },
  },
  off: { label: 'Off', params: {} },
} satisfies Record<string, VariantSpec>;

const mediaVariants = {
  off: { label: 'Off', params: {} },
  tilt: {
    label: 'Tilted card',
    params: {
      angle: { label: 'Max angle', min: 2, max: 20, step: 0.5, default: 8 },
      glare: { label: 'Glare', min: 0, max: 1, step: 0.05, default: 0.5 },
    },
  },
  pixel: {
    label: 'Pixel transition',
    params: {
      grid: { label: 'Grid', min: 6, max: 30, step: 1, default: 14 },
      duration: { label: 'Duration (s)', min: 0.2, max: 1.5, step: 0.05, default: 0.5 },
    },
  },
  refine: {
    label: 'Refine',
    params: {
      stages: { label: 'Stages', min: 2, max: 6, step: 1, default: 4 },
      speed: entrance,
      stagger: { label: 'Stagger (ms)', min: 0, max: 600, step: 10, default: 150 },
    },
  },
} satisfies Record<string, VariantSpec>;

const techVariant: VariantSpec = {
  label: 'Tech text',
  params: {
    radius: { label: 'Reach (rem)', min: 2, max: 16, step: 0.5, default: 6 },
    dash: { label: 'Dash', min: 2, max: 14, step: 1, default: 6 },
  },
};

/**
 * Variants whose id maps to no module in `islands/fx/runtime.ts` keep the
 * component's own markup and behaviour (`off`, `plain`, `drift`, `default`, `static`).
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
          ruby: ruby(0.35),
          dust: { label: 'Dust', min: 0, max: 2, step: 0.05, default: 1 },
        },
      },
      ascii: {
        label: 'ASCII field',
        params: {
          intensity,
          speed,
          cell: { label: 'Cell (px)', min: 8, max: 28, step: 1, default: 13 },
          ruby: ruby(0.2),
        },
      },
      lightfall: {
        label: 'Lightfall',
        params: {
          intensity,
          speed,
          bend: { label: 'Cursor bend', min: 0, max: 2, step: 0.05, default: 1 },
          ruby: ruby(0.25),
        },
      },
      glitch: {
        label: 'Letter glitch',
        params: {
          intensity,
          speed,
          cell: { label: 'Cell (px)', min: 10, max: 32, step: 1, default: 16 },
          ruby: ruby(0.2),
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
  heroName: {
    label: 'Hero name',
    where: 'Home hero',
    replayable: true,
    variants: {
      scramble: { label: 'Scramble', params: { speed: entrance } },
      decode: { label: 'Decode', params: { speed: entrance } },
      plain: { label: 'Plain', params: {} },
    },
  },
  heroNameHover: {
    label: 'Hero name hover',
    where: 'Home hero',
    variants: {
      off: { label: 'Off', params: {} },
      tech: techVariant,
    },
  },
  logo: {
    label: 'Logo',
    where: 'Header, every page',
    variants: {
      off: { label: 'Off', params: {} },
      electric: { label: 'Electric', params: { intensity, always: toggle('Always on', 0) } },
    },
  },
  cursor: { label: 'Cursor', where: 'Every page', variants: cursorVariants },
  contactCursor: {
    label: 'Contact cursor',
    where: '/contact (on top of the site-wide cursor)',
    variants: cursorVariants,
  },
  primaryButton: {
    label: 'Primary buttons',
    where: 'Hero, CTA, contact form',
    variants: {
      off: { label: 'Off', params: {} },
      star: {
        label: 'Star border',
        params: {
          orbit: { label: 'Orbit (s)', min: 1.5, max: 10, step: 0.5, default: 5 },
          intensity,
          hover: toggle('Hover only', 0),
        },
      },
    },
  },
  featuredMedia: {
    label: 'Featured screenshots',
    where: 'Home selected work',
    variants: mediaVariants,
  },
  workMedia: {
    label: 'Work screenshots',
    where: '/work',
    variants: mediaVariants,
  },
  ctaBackground: {
    label: 'CTA background',
    where: 'Home closing CTA',
    variants: {
      off: { label: 'Off', params: {} },
      laser: { label: 'Laser flow', params: { intensity, speed, ruby: ruby(0.3) } },
      magnet: {
        label: 'Magnet lines',
        params: {
          spacing: { label: 'Spacing (px)', min: 16, max: 56, step: 1, default: 30 },
          length: { label: 'Length (px)', min: 6, max: 30, step: 1, default: 14 },
          intensity,
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
  aboutPortrait: {
    label: 'Portrait',
    where: '/about',
    variants: {
      static: { label: 'Static', params: {} },
      lanyard: {
        label: 'Lanyard',
        params: {
          swing: { label: 'Swing', min: 0.2, max: 2, step: 0.05, default: 1 },
          // The gap above the portrait is ~4rem; longer straps cross the heading.
          length: { label: 'Strap (rem)', min: 1.5, max: 12, step: 0.5, default: 3.5 },
        },
      },
    },
  },
  contactOrb: {
    label: 'Contact accent',
    where: '/contact',
    variants: {
      off: { label: 'Off', params: {} },
      crystal: { label: 'Crystal ball', params: { intensity, speed, ruby: ruby(0.3) } },
    },
  },
  contactLead: {
    label: 'Contact lead text',
    where: '/contact',
    variants: {
      off: { label: 'Off', params: {} },
      scrambled: {
        label: 'Scrambled text',
        params: {
          radius: { label: 'Radius (px)', min: 30, max: 260, step: 5, default: 100 },
          duration: { label: 'Duration (s)', min: 0.2, max: 3, step: 0.1, default: 1.2 },
          speed: { label: 'Speed', min: 0.1, max: 2, step: 0.05, default: 0.5 },
        },
      },
    },
  },
  notFound: {
    label: '404 heading',
    where: '404 page (any unknown URL)',
    variants: {
      plain: { label: 'Plain', params: {} },
      fuzzy: {
        label: 'Fuzzy text',
        params: {
          intensity: { label: 'Resting fuzz', min: 0, max: 1, step: 0.01, default: 0.18 },
          hover: { label: 'Hover fuzz', min: 0, max: 1, step: 0.01, default: 0.5 },
          range: { label: 'Range (px)', min: 4, max: 60, step: 1, default: 30 },
        },
      },
    },
  },
  contactHeading: {
    label: 'Contact heading',
    where: '/contact',
    variants: { off: { label: 'Off', params: {} }, tech: techVariant },
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
