import { describe, it, expect } from 'vitest';
import { fixedFxSlots } from '../components/islands/fx/fixed';
import { effects } from './effects';
import { defaultParams, fxRegistry, fxSlots, resolveConfig, variantSpec } from './effects-registry';

describe('effects config', () => {
  it('configures every tunable slot with a known variant and in-range params', () => {
    expect(Object.keys(effects).sort()).toEqual([...fxSlots].sort());
    for (const slot of fxSlots) {
      const spec = variantSpec(slot, effects[slot].variant);
      expect(spec, `${slot}: ${effects[slot].variant}`).toBeDefined();
      expect(Object.keys(effects[slot].params).sort()).toEqual(Object.keys(spec!.params).sort());
      for (const [key, value] of Object.entries(effects[slot].params)) {
        const p = spec!.params[key];
        expect(value).toBeGreaterThanOrEqual(p.min);
        expect(value).toBeLessThanOrEqual(p.max);
      }
    }
  });

  it('every param default sits inside its range', () => {
    for (const slot of fxSlots) {
      for (const variant of Object.values(fxRegistry[slot].variants)) {
        for (const p of Object.values(
          variant.params as Record<string, { min: number; max: number; default: number }>,
        )) {
          expect(p.default).toBeGreaterThanOrEqual(p.min);
          expect(p.default).toBeLessThanOrEqual(p.max);
        }
      }
    }
  });
});

describe('resolveConfig', () => {
  it('returns the base config for garbage input', () => {
    expect(resolveConfig('nope', effects)).toEqual(effects);
    expect(resolveConfig(null, effects)).toEqual(effects);
  });

  it('falls back on unknown variants and fills defaults for a new variant', () => {
    const out = resolveConfig(
      { heroBackground: { variant: 'lightfall' }, mobileMenu: { variant: 'gone' } },
      effects,
    );
    expect(out.heroBackground).toEqual({
      variant: 'lightfall',
      params: defaultParams('heroBackground', 'lightfall'),
    });
    expect(out.mobileMenu).toEqual(effects.mobileMenu);
  });

  it('clamps params and drops unknown ones', () => {
    const out = resolveConfig(
      { heroBackground: { variant: 'light', params: { intensity: 999, speed: -4, bogus: 1 } } },
      effects,
    );
    expect(out.heroBackground.params).toEqual({ intensity: 2, speed: 0, accent: 0.35, dust: 1 });
  });

  // A config stored by an older panel (localStorage, a `?fx=` link) still names
  // slots that have since been decided: they must not come back.
  it('ignores slots that are no longer tunable', () => {
    const stale = {
      ...effects,
      heroName: { variant: 'decode', params: { speed: 2 } },
      cursor: { variant: 'lamp', params: { size: 60, strength: 2 } },
    };
    expect(resolveConfig(stale, effects)).toEqual(effects);
  });
});

describe('fixed effects', () => {
  // A name in both tables would mount two effects into the same elements.
  it('never reuse the name of a tunable slot', () => {
    expect(fixedFxSlots.filter((slot) => (fxSlots as string[]).includes(slot))).toEqual([]);
  });
});
