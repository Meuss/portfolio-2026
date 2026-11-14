// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://thomasmiller.ch',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true }, // both /en and /fr are explicit
  },

  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      // Not in the sitemap: the root redirect, the 404 pages and the contact
      // form's success pages (all noindex).
      filter: (page) =>
        page !== 'https://thomasmiller.ch/' && !/\/(404|contact\/thanks)\/?$/.test(page),
    }),
  ],
});
