// Picks the locale the root URL `/` redirects to, from the request's
// Accept-Language header. The owner's rule: English preferred → `en`,
// anything else (French, other languages, no or malformed header) → `fr`.
//
// Pure and dependency-free: the Netlify edge function
// (netlify/edge-functions/root-language.ts) imports it, so it must run in Deno
// as well as in Node (Vitest). Don't import anything from the Astro side here.

export type RootLocale = 'en' | 'fr';

// RFC 9110 §12.4.2 qvalue: 0, 0.x… or 1, 1.0… (at most three decimals).
const QVALUE = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/;
// RFC 4647 language range without the `*` wildcard: alpha primary subtag, then subtags.
const LANGUAGE_RANGE = /^[a-z]{1,8}(?:-[a-z0-9]{1,8})*$/i;

/**
 * The highest-q language wins, ties go to the one listed first, `q=0` means
 * "not acceptable" and is skipped, `*` and malformed entries are ignored. Only
 * the primary subtag counts, case-insensitively (`EN-us` is English).
 */
export function pickRootLocale(acceptLanguage: string | null | undefined): RootLocale {
  let best: { lang: string; q: number } | undefined;

  for (const entry of (acceptLanguage ?? '').split(',')) {
    const [range = '', ...params] = entry.split(';').map((part) => part.trim());
    if (!LANGUAGE_RANGE.test(range)) continue;

    let q = 1;
    let valid = true;
    for (const param of params) {
      const [name = '', value = ''] = param.split('=').map((part) => part.trim());
      if (name.toLowerCase() !== 'q') continue;
      if (!QVALUE.test(value)) valid = false;
      else q = Number(value);
    }
    if (!valid || q === 0) continue;

    // Strictly greater: an equal q keeps the earlier entry.
    if (!best || q > best.q) best = { lang: range.split('-')[0]!.toLowerCase(), q };
  }

  return best?.lang === 'en' ? 'en' : 'fr';
}
