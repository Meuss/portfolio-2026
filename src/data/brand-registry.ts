/**
 * Brand options the site can wear: colour palettes, display / body fonts and
 * the logo (the kit symbol, see `brand/`). Pure data plus the functions
 * that turn a choice into CSS custom properties and `<html>` attributes.
 *
 * `BaseLayout` renders the shipped choice (`src/data/brand.ts`) server-side, so
 * production carries no JS for it. The dev-only Brand panel
 * (`islands/brand/panel.ts`) applies other choices live and can save them back.
 */

export interface Palette {
  label: string;
  /** Values for the `--color-*` tokens in `src/styles/global.css`. */
  colors: {
    paper: string;
    surface: string;
    'surface-2': string;
    line: string;
    ink: string;
    muted: string;
    faint: string;
    accent: string;
    'accent-hover': string;
    'accent-ink': string;
    error: string;
    success: string;
  };
}

export const palettes = {
  // The website styleguide: kit black ground, kit orange as the only colour.
  kit: {
    label: 'Kit orange',
    colors: {
      paper: '#121212',
      surface: '#1b1b1a',
      'surface-2': '#242423',
      line: '#333331',
      ink: '#f3f2ee',
      muted: '#a3a39e',
      faint: '#82817a',
      accent: '#ff6a13',
      'accent-hover': '#ff8a47',
      'accent-ink': '#121212',
      error: '#ff6b78',
      success: '#4fd18f',
    },
  },
} satisfies Record<string, Palette>;

export type PaletteId = keyof typeof palettes;

const SANS_FALLBACK = 'ui-sans-serif, system-ui, sans-serif';

/** Self-hosted faces (imported in `src/styles/global.css`). */
export const fonts = {
  schibsted: {
    label: 'Schibsted',
    stack: `'Schibsted Grotesk Variable', 'Schibsted Grotesk', ${SANS_FALLBACK}`,
  },
  instrument: {
    label: 'Instrument',
    stack: `'Instrument Sans Variable', 'Instrument Sans', ${SANS_FALLBACK}`,
  },
  mono: {
    label: 'DM Mono',
    stack: `'DM Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
  },
} satisfies Record<string, { label: string; stack: string }>;

export type FontId = keyof typeof fonts;

/** Fonts offered for headings / running text (the mono face stays the label voice). */
export const textFonts = ['schibsted', 'instrument'] as const satisfies FontId[];
export type TextFontId = (typeof textFonts)[number];

export const lockups = {
  markName: { label: 'Symbol + name' },
  markNameTagline: { label: '+ tagline' },
  mark: { label: 'Symbol only' },
  name: { label: 'Name only' },
} satisfies Record<string, { label: string }>;

export type LockupId = keyof typeof lockups;

export interface RangeSpec {
  label: string;
  min: number;
  max: number;
  step: number;
}

/** Numeric logo settings. Brand kit: Schibsted Grotesk ExtraBold, tracking −0.04em. */
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
  vars['--font-display'] = fonts[config.display].stack;
  vars['--font-sans'] = fonts[config.body].stack;
  vars['--logo-font'] = fonts[config.logo.font].stack;
  vars['--logo-weight'] = String(config.logo.weight);
  vars['--logo-tracking'] = `${config.logo.tracking}em`;
  vars['--logo-size'] = `${config.logo.size}px`;
  return vars;
}

/** `<html>` attributes the CSS keys off (lockup layout). */
export function brandAttrs(config: BrandConfig): Record<string, string> {
  return {
    'data-palette': config.palette,
    'data-logo-lockup': config.logo.lockup,
  };
}

export const brandStyle = (config: BrandConfig) =>
  Object.entries(brandVars(config))
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
