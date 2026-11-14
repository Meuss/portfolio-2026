// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const savedFile = fileURLToPath(
  new URL('./src/components/islands/fx/lab/saved.ts', import.meta.url),
);

/**
 * Dev-only endpoint behind the FX panel's "Save as default": validates the
 * posted choices against the experiment slots (`fx/lab/config.ts`) and
 * rewrites `fx/lab/saved.ts`.
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
            const { resolveConfig, shipped } = await server.ssrLoadModule(
              '/src/components/islands/fx/lab/config.ts',
            );
            const config = resolveConfig(JSON.parse(body), shipped);
            const prettier = await import('prettier');
            const source = [
              '// The choices saved from the dev FX panel ("Save as default"), which rewrites',
              '// this whole file. A slot listed here runs this variant instead of the default',
              '// its slot file declares; entries for a slot or a variant that no longer exists',
              '// are ignored. Not edited by hand, except to delete an entry.',
              "import type { FxLabConfig } from './spec';",
              '',
              `export const saved: FxLabConfig = ${JSON.stringify(config)};`,
            ].join('\n');
            const options = (await prettier.resolveConfig(savedFile)) ?? {};
            await writeFile(
              savedFile,
              await prettier.format(source, { ...options, filepath: savedFile }),
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
