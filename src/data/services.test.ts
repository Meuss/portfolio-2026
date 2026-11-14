import { describe, it, expect } from 'vitest';
import { headlineServices, capabilities } from './services';

describe('services data', () => {
  it('has exactly 5 headline services, websites first and maintenance last', () => {
    expect(headlineServices).toHaveLength(5);
    expect(headlineServices[0].id).toBe('websites');
    expect(headlineServices[4].id).toBe('maintenance');
  });
  it('every service has en + fr title and blurb', () => {
    for (const s of [...headlineServices, ...capabilities]) {
      for (const l of ['en', 'fr'] as const) {
        expect(s.title[l]?.length).toBeGreaterThan(0);
        expect(s.blurb[l]?.length).toBeGreaterThan(0);
      }
    }
  });
  it('lists the secondary capabilities', () => {
    const ids = capabilities.map((c) => c.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'multilingual',
        'api-integrations',
        'analytics',
        'automation',
        'ai',
        'audits',
      ]),
    );
  });
});
