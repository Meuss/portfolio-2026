import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { brand } from './brand';
import { brandVars, palettes, resolveBrand } from './brand-registry';

describe('brand config', () => {
  it('ships a valid choice', () => {
    expect(resolveBrand(brand, brand)).toEqual(brand);
  });

  it('every palette sets the same tokens', () => {
    const keys = Object.keys(palettes.gilt.colors).sort();
    for (const p of Object.values(palettes)) expect(Object.keys(p.colors).sort()).toEqual(keys);
  });

  it('the gilt palette mirrors the @theme defaults in global.css', () => {
    const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');
    for (const [key, value] of Object.entries(palettes.gilt.colors)) {
      expect(css, key).toMatch(new RegExp(`--color-${key}:\\s*${value};`));
    }
  });
});

describe('resolveBrand', () => {
  it('returns the base for garbage input', () => {
    expect(resolveBrand('nope', brand)).toEqual(brand);
    expect(resolveBrand(null, brand)).toEqual(brand);
  });

  it('keeps known choices, drops unknown ones and clamps numbers', () => {
    const out = resolveBrand(
      {
        palette: 'molesonLight',
        display: 'comic',
        logo: { lockup: 'mark', weight: 9000, tracking: 'x' },
      },
      brand,
    );
    expect(out.palette).toBe('molesonLight');
    expect(out.display).toBe(brand.display);
    expect(out.logo).toEqual({ ...brand.logo, lockup: 'mark', weight: 800 });
  });

  it('turns a choice into token overrides', () => {
    const vars = brandVars({ ...brand, palette: 'moleson', display: 'bricolage' });
    expect(vars['--color-paper']).toBe('#16191d');
    expect(vars['--font-display']).toMatch(/^'Bricolage Grotesque Variable'/);
  });
});
