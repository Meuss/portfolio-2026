import { ui, type Lang } from '../i18n/ui';

/**
 * Link previews (Open Graph). Each page below has its own share image per
 * language, `public/og/<lang>-<page>.png` (1200×630), drawn by
 * `brand/build_og.py`. Most show the page's `og.<page>.headline` from `ui.ts`
 * under the logo; home shows the logo alone and about the logo with the
 * portrait, so those two have their own `og.<page>.imageAlt` instead of a
 * headline. Re-run the script after changing a headline or the tagline (see
 * brand/README.md). Pages without an image of their own (404, contact/thanks)
 * share the home image.
 */
export const sharePages = ['home', 'work', 'about', 'contact', 'privacy'] as const;
export type SharePage = (typeof sharePages)[number];

export const shareImage = { width: 1200, height: 630, type: 'image/png' } as const;

export const shareImagePath = (lang: Lang, page: SharePage) => `/og/${lang}-${page}.png`;

/** og:locale per site language: Swiss French, and British English for the English pages. */
export const ogLocale: Record<Lang, string> = { en: 'en_GB', fr: 'fr_CH' };

/** og:image:alt: the page's own alt text if its image has no headline, else the headline in og.imageAlt. */
export function shareImageAlt(lang: Lang, page: SharePage): string {
  const strings = ui[lang];
  return (
    strings[`og.${page}.imageAlt`] ??
    strings['og.imageAlt'].replace('{headline}', strings[`og.${page}.headline`])
  );
}
