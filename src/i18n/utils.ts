import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  return seg === 'fr' || seg === 'en' ? seg : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: string): string => ui[lang][key] ?? ui[defaultLang][key] ?? key;
}

/** The path of a page in `lang`, always with a trailing slash (`/fr/work/`),
    the form Netlify serves without a redirect and the one canonicals, hreflang
    and the sitemap use (`trailingSlash: 'always'` in astro.config.mjs). A
    `?query` or `#hash` is kept after the slash. */
export function localizedPath(lang: Lang, path: string): string {
  const [, pathname = '', suffix = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  return `/${lang}/${trimmed === '' ? '' : `${trimmed}/`}${suffix}`;
}

export function switchLocalePath(currentUrl: URL, target: Lang): string {
  const rest = currentUrl.pathname.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';
  return localizedPath(target, rest);
}

/** Splits a translated string around `{name}` placeholders, so a page can put
    an element (usually a link) where each one stands. Text parts come back as
    strings, placeholders as `{ slot: name }`. */
export function splitSlots(text: string): Array<string | { slot: string }> {
  return text
    .split(/(\{\w+\})/)
    .filter((part) => part !== '')
    .map((part) => {
      const name = part.match(/^\{(\w+)\}$/)?.[1];
      return name ? { slot: name } : part;
    });
}
