import { describe, it, expect } from 'vitest';
import { getLangFromUrl, localizedPath, switchLocalePath, useTranslations } from './utils';

describe('i18n utils', () => {
  it('reads lang from url, defaulting to en', () => {
    expect(getLangFromUrl(new URL('https://x.co/fr/work'))).toBe('fr');
    expect(getLangFromUrl(new URL('https://x.co/en/'))).toBe('en');
    expect(getLangFromUrl(new URL('https://x.co/'))).toBe('en');
  });
  it('builds localized paths with leading slash', () => {
    expect(localizedPath('fr', '/work')).toBe('/fr/work');
    expect(localizedPath('en', '/')).toBe('/en/');
  });
  it('switches locale for the same page', () => {
    expect(switchLocalePath(new URL('https://x.co/en/work'), 'fr')).toBe('/fr/work');
    expect(switchLocalePath(new URL('https://x.co/fr/'), 'en')).toBe('/en/');
  });
  it('translates keys and falls back to the key', () => {
    const t = useTranslations('en');
    expect(t('nav.work')).toBe('Work');
    expect(t('does.not.exist')).toBe('does.not.exist');
  });
});
