/**
 * Brand options the site can wear: colour palettes, display / body fonts and
 * the logo (the Moléson M, from the brand kit). Pure data plus the functions
 * that turn a choice into CSS custom properties and `<html>` attributes.
 *
 * `BaseLayout` renders the shipped choice (`src/data/brand.ts`) server-side, so
 * production carries no JS for it. The dev-only Brand panel
 * (`islands/brand/panel.ts`) applies other choices live and can save them back.
 */

export interface Palette {
  label: string;
  scheme: 'dark' | 'light';
  /** Values for the `--color-*` tokens in `src/styles/global.css`. */
  colors: {
    paper: string;
    ink: string;
    muted: string;
    line: string;
    surface: string;
    accent: string;
    'accent-soft': string;
    'accent-ink': string;
    gilt: string;
  };
}

/** Brand kit red. The mark always wears it; palettes may lighten the text accent for contrast. */
export const BRAND_RED = '#d8232a';

export const palettes = {
  gilt: {
    label: 'Graphite & Gilt',
    scheme: 'dark',
    colors: {
      paper: '#16181b',
      ink: '#ece9e1',
      muted: '#9d9b91',
      line: '#32343b',
      surface: '#202226',
      accent: '#dd4753',
      'accent-soft': '#2c1e21',
      'accent-ink': '#fff5f4',
      gilt: '#c6a15b',
    },
  },
  // Brand kit ink + red. Text-sized red is lifted to #ec4a4f: kit red on ink is 3.5:1.
  moleson: {
    label: 'Moléson red',
    scheme: 'dark',
    colors: {
      paper: '#16191d',
      ink: '#eef0ed',
      muted: '#9aa1a8',
      line: '#2d3238',
      surface: '#1d2126',
      accent: '#ec4a4f',
      'accent-soft': '#2b1a1c',
      'accent-ink': '#ffffff',
      gilt: '#ec4a4f',
    },
  },
  // Same ground, red kept for the mark and links; labels and the primary action go white.
  molesonInk: {
    label: 'Moléson ink',
    scheme: 'dark',
    colors: {
      paper: '#16191d',
      ink: '#eef0ed',
      muted: '#9aa1a8',
      line: '#2d3238',
      surface: '#1d2126',
      accent: '#ec4a4f',
      'accent-soft': '#2b1a1c',
      'accent-ink': '#ffffff',
      gilt: '#eef0ed',
    },
  },
  // The kit's "color" scheme: white ground, ink text, red.
  molesonLight: {
    label: 'Moléson light',
    scheme: 'light',
    colors: {
      paper: '#f5f6f3',
      ink: '#16191d',
      muted: '#5d636b',
      line: '#dcdfdb',
      surface: '#ffffff',
      accent: BRAND_RED,
      'accent-soft': '#fbe8e8',
      'accent-ink': '#ffffff',
      gilt: BRAND_RED,
    },
  },
} satisfies Record<string, Palette>;

export type PaletteId = keyof typeof palettes;

const SANS_FALLBACK = 'ui-sans-serif, system-ui, sans-serif';

/** Self-hosted faces (imported in `src/styles/fonts.css`). */
export const fonts = {
  schibsted: {
    label: 'Schibsted',
    stack: `'Schibsted Grotesk Variable', 'Schibsted Grotesk', ${SANS_FALLBACK}`,
  },
  bricolage: { label: 'Bricolage', stack: `'Bricolage Grotesque Variable', ${SANS_FALLBACK}` },
  instrument: { label: 'Instrument', stack: `'Instrument Sans Variable', ${SANS_FALLBACK}` },
  space: { label: 'Space Grotesk', stack: `'Space Grotesk Variable', ${SANS_FALLBACK}` },
  mono: {
    label: 'DM Mono',
    stack: `'DM Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
  },
} satisfies Record<string, { label: string; stack: string }>;

export type FontId = keyof typeof fonts;

/** Fonts offered for headings / running text (the mono face stays the label voice). */
export const textFonts = [
  'schibsted',
  'bricolage',
  'instrument',
  'space',
] as const satisfies FontId[];
export type TextFontId = (typeof textFonts)[number];

export const lockups = {
  markName: { label: 'Mark + name' },
  markNameTagline: { label: '+ tagline' },
  peaksName: { label: 'Peaks + name' },
  mark: { label: 'Mark only' },
  name: { label: 'Name only' },
} satisfies Record<string, { label: string }>;

export type LockupId = keyof typeof lockups;

export interface RangeSpec {
  label: string;
  min: number;
  max: number;
  step: number;
}

/** Numeric logo settings. Brand kit: Bricolage Bold, tracking −0.03em. */
export const logoRanges = {
  weight: { label: 'Weight', min: 300, max: 800, step: 50 },
  tracking: { label: 'Tracking', min: -0.08, max: 0.06, step: 0.005 },
  size: { label: 'Mark px', min: 24, max: 56, step: 1 },
} satisfies Record<string, RangeSpec>;

export type LogoRangeKey = keyof typeof logoRanges;

export interface BrandConfig {
  palette: PaletteId;
  display: TextFontId;
  body: TextFontId;
  logo: {
    lockup: LockupId;
    font: FontId;
    weight: number;
    tracking: number;
    size: number;
  };
}

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

const clamp = (value: unknown, r: RangeSpec, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(r.max, Math.max(r.min, value))
    : fallback;

/** Validate untrusted input (URL, storage, POST) field by field, falling back to `base`. */
export function resolveBrand(input: unknown, base: BrandConfig): BrandConfig {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const logo = (raw.logo && typeof raw.logo === 'object' ? raw.logo : {}) as Record<
    string,
    unknown
  >;
  return {
    palette: pick(raw.palette, Object.keys(palettes) as PaletteId[], base.palette),
    display: pick(raw.display, textFonts, base.display),
    body: pick(raw.body, textFonts, base.body),
    logo: {
      lockup: pick(logo.lockup, Object.keys(lockups) as LockupId[], base.logo.lockup),
      font: pick(logo.font, Object.keys(fonts) as FontId[], base.logo.font),
      weight: clamp(logo.weight, logoRanges.weight, base.logo.weight),
      tracking: clamp(logo.tracking, logoRanges.tracking, base.logo.tracking),
      size: clamp(logo.size, logoRanges.size, base.logo.size),
    },
  };
}

/** CSS custom properties for a choice; set on `<html>` they override the `@theme` defaults. */
export function brandVars(config: BrandConfig): Record<string, string> {
  const { colors } = palettes[config.palette];
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) vars[`--color-${key}`] = value;
  vars['--color-brand'] = BRAND_RED;
  vars['--font-display'] = fonts[config.display].stack;
  vars['--font-sans'] = fonts[config.body].stack;
  vars['--logo-font'] = fonts[config.logo.font].stack;
  vars['--logo-weight'] = String(config.logo.weight);
  vars['--logo-tracking'] = `${config.logo.tracking}em`;
  vars['--logo-size'] = `${config.logo.size}px`;
  return vars;
}

/** `<html>` attributes the CSS keys off (lockup layout, Bricolage optical size, colour scheme). */
export function brandAttrs(config: BrandConfig): Record<string, string> {
  return {
    'data-palette': config.palette,
    'data-scheme': palettes[config.palette].scheme,
    'data-logo-lockup': config.logo.lockup,
    'data-logo-font': config.logo.font,
  };
}

export const brandStyle = (config: BrandConfig) =>
  Object.entries(brandVars(config))
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
