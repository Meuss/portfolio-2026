// The only server-side code on the site: sends `/` to /en/ or /fr/ from the
// browser's preferred language (see src/i18n/root-locale.ts for the rule and
// its tests). Netlify's `Language` redirect condition can't do this: its 302
// gets cached by the CDN and answers at random.
//
// Not configured for caching, so Netlify invokes it on every request to `/`
// (before its cache and before redirect rules); `no-store` and
// `Vary: Accept-Language` keep browsers and any cache in front from reusing one
// language's answer for another. If it throws, `onError: 'bypass'` lets the
// request go on to the plain `/` → /fr/ redirect in netlify.toml.
//
// No dependencies and no `@netlify/edge-functions` types on purpose: the file
// is plain TypeScript, so `astro check` reads it without Deno types.

import { pickRootLocale } from '../../src/i18n/root-locale.ts';

export default function rootLanguage(request: Request): Response | undefined {
  const url = new URL(request.url);
  // Netlify's config cannot list HEAD as a method, so the method is checked here.
  if (url.pathname !== '/' || (request.method !== 'GET' && request.method !== 'HEAD')) return;

  const locale = pickRootLocale(request.headers.get('accept-language'));
  return new Response(null, {
    status: 302,
    headers: {
      // Relative, so it works on every host (custom domain, *.netlify.app,
      // deploy previews). The query string is kept (`/?utm_source=x` →
      // `/fr/?utm_source=x`); a #fragment never reaches the server and the
      // browser carries it over the redirect.
      Location: `/${locale}/${url.search}`,
      Vary: 'Accept-Language',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  path: '/',
  onError: 'bypass',
};
