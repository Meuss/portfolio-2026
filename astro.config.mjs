// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const effectsFile = fileURLToPath(new URL('./src/data/effects.ts', import.meta.url));

/**
 * Dev-only endpoint behind the FX panel's "Save as default": validates the
 * posted config with the registry's resolver and rewrites `src/data/effects.ts`.
 */
function fxSavePlugin() {
  return {
    name: 'fx-save',
    apply: 'serve',
    /** @param {{ middlewares: { use: Function }, ssrLoadModule: (id: string) => Promise<any> }} server */
    configureServer(server) {
      server.middlewares.use(
        '/__fx/save',
        /**
         * @param {import('node:http').IncomingMessage} req
         * @param {import('node:http').ServerResponse} res
         */
        async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end('POST only');
          }
          try {
            let body = '';
            for await (const chunk of req) body += chunk;
            const { resolveConfig } = await server.ssrLoadModule('/src/data/effects-registry.ts');
            const { effects } = await server.ssrLoadModule('/src/data/effects.ts');
            const config = resolveConfig(JSON.parse(body), effects);
            const prettier = await import('prettier');
            const source = [
              '// The effect slots still being tuned. Pick variants live with the dev-only FX',
              '// panel (`pnpm dev`, bottom-left) and press "Save as default": it rewrites',
              '// this file. Slots, variants and param ranges live in `effects-registry.ts`.',
              '// Decided effects are not here: see `src/components/islands/fx/fixed.ts`.',
              "import type { FxConfig } from './effects-registry';",
              '',
              `export const effects: FxConfig = ${JSON.stringify(config)};`,
            ].join('\n');
            const options = (await prettier.resolveConfig(effectsFile)) ?? {};
            await writeFile(
              effectsFile,
              await prettier.format(source, { ...options, filepath: effectsFile }),
            );
            res.end('ok');
          } catch (err) {
            res.statusCode = 400;
            res.end(String(err instanceof Error ? err.message : err));
          }
        },
      );
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://thomasmiller.ch',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true }, // both /en and /fr are explicit
  },

  vite: { plugins: [tailwindcss(), fxSavePlugin()] },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: (page) => page !== 'https://thomasmiller.ch/' && !/\/404\/?$/.test(page),
    }),
  ],
});
