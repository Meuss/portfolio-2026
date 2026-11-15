import { describe, it, expect } from 'vitest';
import { pickRootLocale } from './root-locale';

describe('pickRootLocale', () => {
  it.each([
    ['en-GB,en;q=0.9', 'en'],
    ['en', 'en'],
    ['EN-us', 'en'],
    ['en-US,en;q=0.9,fr;q=0.8', 'en'],
    ['en,fr', 'en'],
    ['fr;q=0.5,en;q=0.9', 'en'],
    ['*;q=1, en;q=0.5', 'en'],
    ['fr-CH,fr;q=0.9,en;q=0.8', 'fr'],
    ['fr,en;q=0.9', 'fr'],
    ['fr,en', 'fr'],
    ['de-CH,de;q=0.9,en;q=0.8', 'fr'],
    ['de,en;q=0.8', 'fr'],
    ['it', 'fr'],
    ['en;q=0,fr', 'fr'],
    ['en;q=0.000', 'fr'],
    ['*', 'fr'],
    ['en;q=abc,fr', 'fr'],
    ['en;q=2', 'fr'],
  ] as const)('%s → %s', (header, expected) => {
    expect(pickRootLocale(header)).toBe(expected);
  });

  it('falls back to fr for an empty, missing or garbage header', () => {
    expect(pickRootLocale('')).toBe('fr');
    expect(pickRootLocale('   ')).toBe('fr');
    expect(pickRootLocale(null)).toBe('fr');
    expect(pickRootLocale(undefined)).toBe('fr');
    expect(pickRootLocale(';;,,=;q=')).toBe('fr');
    expect(pickRootLocale('%%%garbage%%%')).toBe('fr');
    expect(pickRootLocale('english please')).toBe('fr');
  });
});
