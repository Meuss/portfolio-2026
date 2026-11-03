// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Dev-only endpoint behind a panel's "Save as default": validates the posted
 * config with the registry's resolver and rewrites the data file.
 *
 * @param {{
 *   name: string,
 *   route: string,
 *   file: string,
 *   registry: string,
 *   resolve: string,
 *   exportName: string,
 *   type: string,
 *   header: string[],
 * }} o
 */
function configSavePlugin(o) {
  const file = fileURLToPath(new URL(`./src/data/${o.file}`, import.meta.url));
  return {
    name: o.name,
    apply: 'serve',
    /** @param {{ middlewares: { use: Function }, ssrLoadModule: (id: string) => Promise<any> }} server */
    configureServer(server) {
      server.middlewares.use(
        o.route,
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
            const registry = await server.ssrLoadModule(`/src/data/${o.registry}`);
            const current = await server.ssrLoadModule(`/src/data/${o.file}`);
            const config = registry[o.resolve](JSON.parse(body), current[o.exportName]);
            const prettier = await import('prettier');
            const source = [
              ...o.header.map((line) => `// ${line}`),
              `import type { ${o.type} } from './${o.registry.replace(/\.ts$/, '')}';`,
              '',
              `export const ${o.exportName}: ${o.type} = ${JSON.stringify(config)};`,
            ].join('\n');
            const options = (await prettier.resolveConfig(file)) ?? {};
            await writeFile(file, await prettier.format(source, { ...options, filepath: file }));
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

const fxSavePlugin = () =>
  configSavePlugin({
    name: 'fx-save',
    route: '/__fx/save',
    file: 'effects.ts',
    registry: 'effects-registry.ts',
    resolve: 'resolveConfig',
    exportName: 'effects',
    type: 'FxConfig',
    header: [
      'The effects the site ships with. Pick variants live with the dev-only FX',
      'panel (`pnpm dev`, bottom-left) and press "Save as default": it rewrites',
      'this file. Slots, variants and param ranges live in `effects-registry.ts`.',
    ],
  });

const brandSavePlugin = () =>
  configSavePlugin({
    name: 'brand-save',
    route: '/__brand/save',
    file: 'brand.ts',
    registry: 'brand-registry.ts',
    resolve: 'resolveBrand',
    exportName: 'brand',
    type: 'BrandConfig',
    header: [
      'The brand the site ships with. Try others live with the dev-only Brand panel',
      '(`pnpm dev`, bottom-right, Alt+B) and press "Save as default": it rewrites',
      'this file. Palettes, fonts and logo options live in `brand-registry.ts`.',
    ],
  });

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://thomasmiller.ch',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true }, // both /en and /fr are explicit
  },

  vite: { plugins: [tailwindcss(), fxSavePlugin(), brandSavePlugin()] },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: (page) => page !== 'https://thomasmiller.ch/' && !/\/404\/?$/.test(page),
    }),
  ],
});
