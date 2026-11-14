// Internal link check for the built site: every href/src/srcset/action (and
// the absolute canonical/hreflang/og:image/sitemap URLs on our own domain) must
// resolve to a file in dist/, and a link to a page must end with `/`
// (/fr/work/, not /fr/work, which Netlify answers with a 301 to the slash
// form). Files with an extension and fragment-only links are exempt. External
// URLs are never fetched.
// Usage: node scripts/check-links.mjs [distDir]   (run `pnpm build` first)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const config = readFileSync('astro.config.mjs', 'utf8');
const origin = config.match(/site:\s*['"]([^'"]+)['"]/)?.[1].replace(/\/$/, '');
if (!origin) throw new Error('Could not read `site` from astro.config.mjs');
if (!existsSync(dist)) throw new Error(`${dist} not found: run pnpm build first`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
// dist/404.html is the dev-server fallback: noindex, never served (Netlify uses
// /en/404/ and /fr/404/), and its og:url points at a /404/ that does not exist.
const files = walk(dist).filter(
  (f) => /\.(html|xml|webmanifest)$/.test(f) && f !== join(dist, '404.html'),
);

// Resolve a URL pathname to a file in dist (Netlify-style: /x, /x/, /x.html).
const resolveFile = (pathname) => {
  const p = join(dist, decodeURIComponent(pathname));
  return [p, join(p, 'index.html'), `${p}.html`].find((c) => existsSync(c) && statSync(c).isFile());
};
const ids = new Map();
const hasId = (file, id) => {
  if (!ids.has(file)) ids.set(file, readFileSync(file, 'utf8'));
  return new RegExp(`\\sid=["']?${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\\s>]`).test(
    ids.get(file),
  );
};

const broken = [];
const noSlash = [];
let checked = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const page = '/' + file.slice(dist.length + 1);
  const refs = new Set();
  if (file.endsWith('.xml')) {
    for (const m of text.matchAll(/<loc>([^<]+)<\/loc>/g)) refs.add(m[1]);
  } else if (file.endsWith('.html')) {
    for (const m of text.matchAll(/\s(?:href|src|action)=(?:"([^"]*)"|'([^']*)')/g))
      refs.add(m[1] ?? m[2]);
    // og:image, og:url, ...: `content` is only a link when it is our own absolute URL.
    for (const m of text.matchAll(/\scontent=["'](https?:\/\/[^"']+)["']/g)) refs.add(m[1]);
    for (const m of text.matchAll(/\ssrcset=(?:"([^"]*)"|'([^']*)')/g))
      for (const part of (m[1] ?? m[2]).split(',')) refs.add(part.trim().split(/\s+/)[0]);
  }
  for (const ref of refs) {
    let url;
    try {
      url = new URL(ref, `${origin}${page}`);
    } catch {
      continue; // not a URL (meta content text)
    }
    if (url.origin !== origin) continue; // external, mailto:, tel:, ...
    checked++;
    // A page link without its trailing slash: the last segment has no file
    // extension (fragment-only refs resolve to the page's own index.html).
    const last = url.pathname.split('/').pop();
    if (last !== '' && !last.includes('.')) {
      noSlash.push(`${page}: ${ref} (use ${url.pathname}/${url.search}${url.hash})`);
      continue;
    }
    const target = resolveFile(url.pathname);
    if (!target) broken.push(`${page}: ${ref} (no file for ${url.pathname})`);
    else if (url.hash.length > 1 && target.endsWith('.html') && !hasId(target, url.hash.slice(1)))
      broken.push(`${page}: ${ref} (no element with id "${url.hash.slice(1)}")`);
  }
}

console.log(`Checked ${checked} internal links in ${files.length} files.`);
if (noSlash.length)
  console.error(
    `\n${noSlash.length} link(s) to a page without the trailing slash (Netlify would 301 them; build them with localizedPath()):\n` +
      noSlash.map((b) => `  - ${b}`).join('\n'),
  );
if (broken.length)
  console.error(`\n${broken.length} broken link(s):\n` + broken.map((b) => `  - ${b}`).join('\n'));
if (noSlash.length || broken.length) process.exit(1);
console.log('No broken links, every page link ends with a slash.');
