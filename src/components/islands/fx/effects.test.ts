import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { effects } from './effects';

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

describe('effects table', () => {
  const inMarkup = slotsInMarkup(fileURLToPath(new URL('../../../', import.meta.url)));
  const inTable = Object.keys(effects);

  // A slot name without an entry mounts nothing, silently.
  it('has an entry for every slot in the markup', () => {
    expect([...inMarkup].filter((slot) => !inTable.includes(slot))).toEqual([]);
  });

  // The cursor has no element of its own: the runtime mounts it on <body>.
  it('has no entry that the markup never uses', () => {
    expect(inTable.filter((slot) => slot !== 'cursor' && !inMarkup.has(slot))).toEqual([]);
  });
});
