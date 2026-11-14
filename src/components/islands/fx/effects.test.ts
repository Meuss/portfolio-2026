import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { effects } from './effects';
import { declaredChoice, lab, labSlots, resolveChoice, resolveConfig, shipped } from './lab/config';
import type { FxLabSlot } from './lab/spec';

/** Every slot name the markup asks for: `data-fx-slot="a b"` attributes and `fxSlot="a"` props. */
function slotsInMarkup(dir: string, found = new Set<string>()) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) slotsInMarkup(path, found);
    else if (entry.name.endsWith('.astro')) {
      const source = readFileSync(path, 'utf8');
      for (const [, names] of source.matchAll(/(?:data-fx-slot|fxSlot)="([^"]+)"/g))
        names.split(/\s+/).forEach((name) => found.add(name));
    }
  }
  return found;
}

const inMarkup = slotsInMarkup(fileURLToPath(new URL('../../../', import.meta.url)));
const inTable = Object.keys(effects);

describe('effects table', () => {
  // A slot name that is neither a decided effect nor an experiment mounts nothing, silently.
  it('has an entry for every slot in the markup', () => {
    const known = [...inTable, ...labSlots];
    expect([...inMarkup].filter((slot) => !known.includes(slot))).toEqual([]);
  });

  // The cursor has no element of its own: the runtime mounts it on <body>.
  it('has no entry that the markup never uses', () => {
    expect(inTable.filter((slot) => slot !== 'cursor' && !inMarkup.has(slot))).toEqual([]);
  });
});

describe('experiment slots', () => {
  const labDir = fileURLToPath(new URL('./lab/', import.meta.url));
  const slotFile = (slot: string) => join(labDir, slot, 'slot.ts');

  it('lists every slot folder in lab/index.ts, under the name of its folder', () => {
    const folders = readdirSync(labDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(slotFile(entry.name)))
      .map((entry) => entry.name);
    expect([...labSlots].sort()).toEqual(folders.sort());
  });

  it('are in the markup', () => {
    expect(labSlots.filter((slot) => !inMarkup.has(slot))).toEqual([]);
  });

  // A name in both would mount two effects into the same elements.
  it('never reuse the name of a decided effect', () => {
    expect(labSlots.filter((slot) => inTable.includes(slot))).toEqual([]);
  });

  it.each(labSlots)('%s: the default is `off` or one of its variants', (slot) => {
    const { default: variant, variants } = lab[slot];
    expect(variant === 'off' || Object.hasOwn(variants, variant), variant).toBe(true);
  });

  // `off` is every slot's built-in "mount nothing": it cannot also be a module.
  it.each(labSlots)('%s: every variant is a module with number params', (slot) => {
    for (const [id, variant] of Object.entries(lab[slot].variants)) {
      expect(id).not.toBe('off');
      expect(variant.load, id).toBeTypeOf('function');
      for (const value of Object.values(variant.params)) expect(value, id).toBeTypeOf('number');
    }
  });

  it.each(labSlots)('%s: the panel has a label and a range for every variant and param', (slot) => {
    const { variants, panel } = lab[slot];
    if (!panel) throw new Error(`${slot}: no panel half`);
    expect(panel.label).not.toBe('');
    expect(panel.where).not.toBe('');
    expect(Object.keys(panel.variants).sort()).toEqual(Object.keys(variants).sort());
    for (const [id, variant] of Object.entries(variants)) {
      expect(panel.variants[id].label, id).not.toBe('');
      const ranges = panel.variants[id].params;
      expect(Object.keys(ranges).sort(), id).toEqual(Object.keys(variant.params).sort());
      for (const [key, range] of Object.entries(ranges)) {
        expect(range.label, `${id}.${key}`).not.toBe('');
        expect(range.min, `${id}.${key}`).toBeLessThan(range.max);
        expect(range.step, `${id}.${key}`).toBeGreaterThan(0);
        expect(variant.params[key], `${id}.${key}`).toBeGreaterThanOrEqual(range.min);
        expect(variant.params[key], `${id}.${key}`).toBeLessThanOrEqual(range.max);
      }
    }
  });

  // The panel half (labels, ranges) must not reach a production build: written
  // exactly like this, the bundler drops it.
  it.each(labSlots)('%s: the panel half is dev-only', (slot) => {
    expect(readFileSync(slotFile(slot), 'utf8')).toContain('panel: import.meta.env.DEV && {');
  });

  it('ship a valid choice each', () => {
    expect(Object.keys(shipped).sort()).toEqual([...labSlots].sort());
    for (const slot of labSlots) {
      const { variant, params } = shipped[slot];
      expect(variant === 'off' || Object.hasOwn(lab[slot].variants, variant), slot).toBe(true);
      const expected = variant === 'off' ? {} : lab[slot].variants[variant].params;
      expect(Object.keys(params).sort(), slot).toEqual(Object.keys(expected).sort());
    }
  });
});

describe('resolving a choice', () => {
  const load = async () => ({ mount: () => ({ destroy() {} }) });
  const spec: FxLabSlot = {
    default: 'grain',
    variants: {
      grain: { load, params: { density: 0.4, speed: 1 } },
      flat: { load, params: {} },
    },
    panel: {
      label: 'Fixture',
      where: 'Nowhere',
      variants: {
        grain: {
          label: 'Grain',
          params: {
            density: { label: 'Density', min: 0, max: 1, step: 0.05 },
            speed: { label: 'Speed', min: 0, max: 3, step: 0.05 },
          },
        },
        flat: { label: 'Flat', params: {} },
      },
    },
  };
  const base = declaredChoice(spec);

  it('declares the default variant with its default params', () => {
    expect(base).toEqual({ variant: 'grain', params: { density: 0.4, speed: 1 } });
    expect(declaredChoice({ ...spec, default: 'off' })).toEqual({ variant: 'off', params: {} });
  });

  it('keeps the base for garbage or an unknown variant', () => {
    expect(resolveChoice(spec, 'nope', base)).toEqual(base);
    expect(resolveChoice(spec, null, base)).toEqual(base);
    expect(resolveChoice(spec, { variant: 'gone', params: { density: 1 } }, base)).toEqual(base);
    expect(resolveChoice(spec, { variant: 'toString' }, base)).toEqual(base);
  });

  it('accepts `off` and any declared variant', () => {
    expect(resolveChoice(spec, { variant: 'off', params: { density: 1 } }, base)).toEqual({
      variant: 'off',
      params: {},
    });
    expect(resolveChoice(spec, { variant: 'flat' }, base)).toEqual({ variant: 'flat', params: {} });
  });

  it('fills missing params, clamps to the ranges and drops unknown params', () => {
    expect(
      resolveChoice(spec, { variant: 'grain', params: { density: 9, bogus: 1 } }, base).params,
    ).toEqual({ density: 1, speed: 1 });
    expect(
      resolveChoice(spec, { variant: 'grain', params: { density: 'x', speed: -4 } }, base).params,
    ).toEqual({ density: 0.4, speed: 0 });
  });

  // Coming back to the base's variant keeps the base's values, not the defaults.
  it('fills from the base when the variant is the same', () => {
    const tuned = { variant: 'grain', params: { density: 0.9, speed: 2 } };
    expect(resolveChoice(spec, { variant: 'grain', params: { speed: 3 } }, tuned).params).toEqual({
      density: 0.9,
      speed: 3,
    });
    expect(
      resolveChoice(spec, { variant: 'grain' }, { variant: 'off', params: {} }).params,
    ).toEqual({
      density: 0.4,
      speed: 1,
    });
  });

  // A config stored by an older panel (localStorage, a `?fx=` link) can still
  // name slots that were decided or deleted since: they must not come back.
  it('ignores slots the lab does not have', () => {
    const stale = { ...shipped, heroBackground: { variant: 'glitch', params: { speed: 2 } } };
    expect(resolveConfig(stale, shipped)).toEqual(shipped);
    expect(resolveConfig('nope', shipped)).toEqual(shipped);
  });
});
