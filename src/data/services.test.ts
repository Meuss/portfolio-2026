import { describe, it, expect } from 'vitest';
import { headlineServices, capabilities } from './services';

describe('services data', () => {
  it('has exactly 5 headline services, frontend craft second', () => {
    expect(headlineServices).toHaveLength(5);
    expect(headlineServices[1].id).toBe('frontend-craft');
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
    const ids = capabilities.map(c => c.id);
    expect(ids).toEqual(expect.arrayContaining([
      'api-integrations', 'web-apps', 'automation', 'maintenance', 'audits',
    ]));
  });
});
