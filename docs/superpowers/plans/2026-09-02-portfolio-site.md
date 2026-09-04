# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bold, bilingual (EN/FR) Astro portfolio site — homepage-led, credibility- and conversion-focused — deployable to Netlify.

**Architecture:** Astro static site (SSG). Presentational UI is zero-JS Astro components on a Tailwind design-token system; motion lives in small isolated islands hydrated only where needed. Content (projects, services, UI strings) is file-based via typed Astro content collections + data files, so both languages stay in sync and new work is added by editing files. Logic with real behavior (i18n path helpers, content schemas) is built test-first with Vitest; presentational components are verified by type-check/build plus explicit visual acceptance criteria and crafted with the frontend-design skill.

**Tech Stack:** Astro (latest 5.x), Tailwind CSS v4 (Vite plugin, CSS-first `@theme`), TypeScript (strict), Vitest, Netlify (static + serverless function for the contact form).

**Spec:** `docs/superpowers/specs/2026-09-02-portfolio-site-design.md`

## Global Constraints

- Framework: **Astro latest 5.x**, `output: 'static'`. No SSR adapter for pages.
- Styling: **Tailwind CSS v4** via `@tailwindcss/vite`; design tokens declared in CSS with `@theme`. No hand-rolled competing CSS framework.
- Language: **TypeScript strict mode** on; `astro check` must pass with zero errors.
- i18n: locales **`en` (default, no prefix stripping — see Task 2) and `fr`**; every page exists at both `/en/*` and `/fr/*`; language switch preserves the current page.
- Motion: **every animation gated behind `prefers-reduced-motion: reduce`** with a static fallback; hero must render meaningfully with **no JS**.
- Content: **file-based only** (content collections + data files). No CMS. Adding a project = adding one file, no code change.
- Assets: **placeholder images** in v1 (committed to the repo); real assets swap in later without code changes.
- Scope: **no per-project detail pages**, no blog (per spec non-goals).
- Deploy target: **Netlify**; the build must succeed via `netlify.toml` build command.
- Every UI string that appears to users must come from the i18n string files (Task 2), never be hard-coded in a component, so FR/EN stay in sync.

---

## File Structure

```
astro.config.mjs            # Astro config: i18n, integrations
tsconfig.json               # strict TS
vitest.config.ts            # unit test runner
netlify.toml                # build + form config
package.json

src/
  styles/
    global.css              # Tailwind import + @theme design tokens + base
  i18n/
    ui.ts                   # locales, default, UI string dictionaries (en/fr)
    utils.ts                # getLangFromUrl, useTranslations, localizedPath, switchLocalePath
    utils.test.ts           # Vitest unit tests for utils
  content/
    config.ts               # content collections schemas (projects) + data (services)
    projects/               # one .md/.mdx per project (placeholders in v1)
  data/
    services.ts             # 5 headline services + secondary capabilities (typed)
  layouts/
    BaseLayout.astro        # <html lang>, <head> meta/OG/hreflang, slots
  components/
    Header.astro            # nav + LanguageSwitcher
    Footer.astro
    LanguageSwitcher.astro
    Hero.astro              # static hero markup (island mounts into it)
    ServiceBlocks.astro     # 5 headline blocks
    CapabilitiesStrip.astro # secondary capabilities
    SelectedWork.astro      # featured projects teaser
    Approach.astro
    CTA.astro
    ProjectCard.astro       # used by SelectedWork + /work grid
    islands/
      reveal.ts             # IntersectionObserver scroll-reveal (reduced-motion aware)
      HeroMotion.ts         # signature hero motion (reduced-motion + no-JS safe)
  pages/
    index.astro             # redirect "/" -> "/en/"
    [lang]/
      index.astro           # homepage
      work.astro
      about.astro
      contact.astro
  assets/
    placeholders/           # committed placeholder images

public/
  favicon.svg
  robots.txt
```

---

### Task 1: Project scaffold (Astro + Tailwind v4 + TS + Vitest)

**Files:**

- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (temporary "hello" page, replaced in Task 2)

**Interfaces:**

- Consumes: nothing.
- Produces: a working Astro dev/build environment; `src/styles/global.css` importable by layouts; a passing Vitest runner other tasks add tests to.

- [ ] **Step 1: Scaffold Astro app (empty template, TS strict)**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston
npm install
```

If the directory is non-empty, scaffold into a temp dir and move files in, preserving `docs/` and `.git/`.

- [ ] **Step 2: Add Tailwind v4 + Vitest**

```bash
npm install -D tailwindcss @tailwindcss/vite vitest
```

- [ ] **Step 3: Wire Tailwind into `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Create `src/styles/global.css` with Tailwind import**

```css
@import 'tailwindcss';

/* Design tokens filled in Task 4 */
@theme {
  --font-sans: system-ui, sans-serif;
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['src/**/*.test.ts'] } });
```

- [ ] **Step 6: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 7: Minimal test page importing global.css**

```astro
---
// src/pages/index.astro
import '../styles/global.css';
---

<html lang="en">
  <head><meta charset="utf-8" /><title>Scaffold OK</title></head>
  <body class="bg-white text-black p-8"><h1 class="text-3xl font-bold">Scaffold OK</h1></body>
</html>
```

- [ ] **Step 8: Verify build + test runner**

Run: `npm run build && npm run test`
Expected: build succeeds (writes `dist/`), Vitest runs with "no test files found" (exit 0) — runner works. `npm run check` passes.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro + Tailwind v4 + Vitest"
```

---

### Task 2: i18n foundation (routing, string dictionaries, helpers — test-first)

**Files:**

- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`, `src/i18n/utils.test.ts`
- Modify: `astro.config.mjs` (add i18n config)
- Modify: `src/pages/index.astro` → root redirect to `/en/`

**Interfaces:**

- Consumes: nothing.
- Produces (exact signatures, relied on by every later task):
  - `ui.ts`: `export const languages = { en: 'English', fr: 'Français' } as const;`
    `export const defaultLang = 'en';`
    `export type Lang = keyof typeof languages;`
    `export const ui: Record<Lang, Record<string, string>>` (UI strings).
  - `utils.ts`:
    - `getLangFromUrl(url: URL): Lang`
    - `useTranslations(lang: Lang): (key: string) => string`
    - `localizedPath(lang: Lang, path: string): string` — e.g. `('fr','/work') → '/fr/work'`, `('en','/') → '/en/'`
    - `switchLocalePath(currentUrl: URL, target: Lang): string` — same page, other locale.

- [ ] **Step 1: Write failing tests**

```ts
// src/i18n/utils.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/i18n/utils.test.ts`
Expected: FAIL (module `./utils` not found).

- [ ] **Step 3: Implement `ui.ts` (seed with nav keys used by tests + header)**

```ts
export const languages = { en: 'English', fr: 'Français' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui: Record<Lang, Record<string, string>> = {
  en: { 'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact' },
  fr: { 'nav.work': 'Projets', 'nav.about': 'À propos', 'nav.contact': 'Contact' },
};
```

- [ ] **Step 4: Implement `utils.ts`**

```ts
import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  return seg === 'fr' || seg === 'en' ? seg : defaultLang;
}
export function useTranslations(lang: Lang) {
  return (key: string): string => ui[lang][key] ?? ui[defaultLang][key] ?? key;
}
export function localizedPath(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path.replace(/^\//, '/');
  return `/${lang}${clean === '' ? '/' : clean}`;
}
export function switchLocalePath(currentUrl: URL, target: Lang): string {
  const rest = currentUrl.pathname.replace(/^\/(en|fr)/, '') || '/';
  return localizedPath(target, rest);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/i18n/utils.test.ts`
Expected: PASS (all 4).

- [ ] **Step 6: Configure Astro i18n**

```js
// astro.config.mjs — add inside defineConfig({...})
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'fr'],
  routing: { prefixDefaultLocale: true }, // both /en and /fr are explicit
},
```

- [ ] **Step 7: Root redirect**

```astro
---
// src/pages/index.astro
return Astro.redirect('/en/');
---
```

- [ ] **Step 8: Verify build produces both locales**

Run: `npm run build`
Expected: build succeeds; `dist/en/index.html` exists and `/` redirects to `/en/` (verify via `npm run preview` then curl `-I localhost:4321/`).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(i18n): locale routing, string dictionaries, path helpers"
```

---

### Task 3: Content model — projects collection + services data (test-first schema)

**Files:**

- Create: `src/content/config.ts`
- Create: `src/content/projects/*.md` (3–4 placeholder projects, EN+FR fields)
- Create: `src/data/services.ts`, `src/data/services.test.ts`
- Create: `src/assets/placeholders/project-*.svg` (committed placeholder art)

**Interfaces:**

- Consumes: `Lang` from `src/i18n/ui.ts`.
- Produces:
  - `projects` collection with schema fields: `title: {en,fr}`, `role: {en,fr}`, `tech: string[]`, `description: {en,fr}`, `image: image()`, `link?: string`, `featured: boolean`, `nda: boolean`, `order: number`.
  - `src/data/services.ts`: `export const headlineServices: Service[]` (exactly 5) and `export const capabilities: Service[]`, where `Service = { id: string; title: Record<Lang,string>; blurb: Record<Lang,string> }`.

- [ ] **Step 1: Write failing test for services data invariants**

```ts
// src/data/services.test.ts
import { describe, it, expect } from 'vitest';
import { headlineServices, capabilities } from './services';

describe('services data', () => {
  it('has exactly 5 headline services, frontend craft second', () => {
    expect(headlineServices).toHaveLength(5);
    expect(headlineServices[1].id).toBe('frontend-craft');
  });
  it('every service has en + fr title and blurb', () => {
    for (const s of [...headlineServices, ...capabilities]) {
      for (const l of ['en', 'fr'] as const) {
        expect(s.title[l]?.length).toBeGreaterThan(0);
        expect(s.blurb[l]?.length).toBeGreaterThan(0);
      }
    }
  });
  it('lists the secondary capabilities', () => {
    const ids = capabilities.map((c) => c.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'api-integrations',
        'web-apps',
        'automation',
        'maintenance',
        'audits',
      ]),
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/data/services.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `src/data/services.ts`**

```ts
import type { Lang } from '../i18n/ui';
export type Service = { id: string; title: Record<Lang, string>; blurb: Record<Lang, string> };

export const headlineServices: Service[] = [
  {
    id: 'fullstack',
    title: { en: 'Full-stack web development', fr: 'Développement web full-stack' },
    blurb: { en: 'Frontend and backend, end to end.', fr: 'Frontend et backend, de bout en bout.' },
  },
  {
    id: 'frontend-craft',
    title: { en: 'Frontend craft & polish', fr: 'Excellence frontend' },
    blurb: {
      en: 'Pixel-perfect UI, motion, performance.',
      fr: 'Interfaces soignées, animation, performance.',
    },
  },
  {
    id: 'ecommerce-crm',
    title: { en: 'E-commerce & CRM', fr: 'E-commerce & CRM' },
    blurb: {
      en: 'Stores, integrations, business systems.',
      fr: 'Boutiques, intégrations, systèmes métier.',
    },
  },
  {
    id: 'ai',
    title: { en: 'AI integration', fr: 'Intégration IA' },
    blurb: {
      en: 'Chat, automation, smart features.',
      fr: 'Chat, automatisation, fonctions intelligentes.',
    },
  },
  {
    id: 'seo-perf',
    title: { en: 'SEO & performance', fr: 'SEO & performance' },
    blurb: { en: 'Get found, load fast.', fr: 'Soyez trouvé, chargez vite.' },
  },
];

export const capabilities: Service[] = [
  {
    id: 'api-integrations',
    title: { en: 'API & integrations', fr: 'API & intégrations' },
    blurb: {
      en: 'Stripe, shipping, third-party services.',
      fr: 'Stripe, livraison, services tiers.',
    },
  },
  {
    id: 'web-apps',
    title: { en: 'Web apps & dashboards', fr: 'Apps web & tableaux de bord' },
    blurb: { en: 'Internal tools and SaaS-style apps.', fr: 'Outils internes et apps SaaS.' },
  },
  {
    id: 'automation',
    title: { en: 'Automation', fr: 'Automatisation' },
    blurb: {
      en: 'Workflows that save manual work.',
      fr: 'Workflows qui éliminent le travail manuel.',
    },
  },
  {
    id: 'maintenance',
    title: { en: 'Maintenance & support', fr: 'Maintenance & support' },
    blurb: { en: 'Ongoing care and retainers.', fr: 'Suivi continu et forfaits.' },
  },
  {
    id: 'audits',
    title: { en: 'Technical audits', fr: 'Audits techniques' },
    blurb: { en: 'Code, performance, SEO reviews.', fr: 'Revues code, performance, SEO.' },
  },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/data/services.test.ts` → PASS.

- [ ] **Step 5: Define the projects collection schema**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
const loc = z.object({ en: z.string(), fr: z.string() });
const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: loc,
      role: loc,
      description: loc,
      tech: z.array(z.string()),
      image: image(),
      link: z.string().url().optional(),
      featured: z.boolean().default(false),
      nda: z.boolean().default(false),
      order: z.number().default(0),
    }),
});
export const collections = { projects };
```

- [ ] **Step 6: Add placeholder images + 3–4 project entries**

Create simple committed SVG placeholders in `src/assets/placeholders/`. Example entry:

```md
---
# src/content/projects/example-shop.md
title: { en: 'E-commerce platform', fr: 'Plateforme e-commerce' }
role: { en: 'Full-stack developer', fr: 'Développeur full-stack' }
description:
  {
    en: 'A fast, conversion-focused online store.',
    fr: 'Une boutique rapide et orientée conversion.',
  }
tech: ['Astro', 'Stripe', 'TypeScript']
image: '../../assets/placeholders/project-1.svg'
featured: true
nda: false
order: 1
---
```

Include at least one `featured: true` (≥3 total featured for the homepage teaser) and one `nda: true` example with vague framing.

- [ ] **Step 7: Verify content type-checks**

Run: `npm run check && npm run build`
Expected: content schema validates, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat(content): projects collection + services data + placeholders"
```

---

### Task 4: Design tokens & global styles

**Files:**

- Modify: `src/styles/global.css`

**Interfaces:**

- Consumes: nothing.
- Produces: Tailwind theme tokens (colors, type scale, fonts, spacing) usable as utility classes across all components; base element styles.

- [ ] **Step 1: Choose + declare tokens with the frontend-design skill**

Invoke `frontend-design:frontend-design` to choose a bold, non-templated type pairing and palette suited to an experimental Swiss-inflected portfolio. Encode the result as `@theme` tokens.

```css
/* src/styles/global.css */
@import 'tailwindcss';

@theme {
  --font-display: /* chosen display face */ , system-ui, sans-serif;
  --font-sans: /* chosen body face */ , system-ui, sans-serif;
  --color-ink: /* near-black */;
  --color-paper: /* near-white */;
  --color-accent: /* signature accent */;
  /* fluid type scale, spacing, radii as needed */
}

@layer base {
  html {
    color-scheme: light dark;
  }
  body {
    @apply bg-[--color-paper] text-[--color-ink] font-sans antialiased;
  }
  :where(h1, h2, h3) {
    font-family: var(--font-display);
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
}
```

- [ ] **Step 2: Verify tokens apply**

Temporarily use a token class on `index.astro` (or a scratch page), run `npm run dev`, and visually confirm the display font + accent render. Remove scratch usage after.

- [ ] **Step 3: Verify build**

Run: `npm run build` → succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(design): Tailwind design tokens and base styles"
```

---

### Task 5: Layout shell — BaseLayout, Header, Footer, LanguageSwitcher

**Files:**

- Create: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/LanguageSwitcher.astro`

**Interfaces:**

- Consumes: `getLangFromUrl`, `useTranslations`, `localizedPath`, `switchLocalePath` (Task 2); `languages` (Task 2); `global.css` (Task 4).
- Produces: `BaseLayout` with props `{ title: string; description: string; lang: Lang }`, a `<slot />`, correct `<html lang>`, SEO/OG meta, and `hreflang` alternates for en/fr; `Header`/`Footer` used on every page.

- [ ] **Step 1: BaseLayout with head/meta/hreflang**

Requirements (verified in Step 4):

- `<html lang={lang}>`; `<title>` and `<meta name="description">` from props.
- Open Graph + Twitter card tags.
- `<link rel="alternate" hreflang="en|fr|x-default">` built with `switchLocalePath(Astro.url, …)`.
- Imports `global.css`; renders `<Header lang={lang}/>`, `<slot/>`, `<Footer lang={lang}/>`.

- [ ] **Step 2: Header with nav + LanguageSwitcher**

- Nav links to `localizedPath(lang,'/work'|'/about'|'/contact')`, labels via `t('nav.*')`.
- Logo/name links to `localizedPath(lang,'/')`.
- Mobile: accessible menu toggle (button with `aria-expanded`); a tiny inline `<script>` island is acceptable, and it must work without motion.
- `LanguageSwitcher`: for each `Lang`, link to `switchLocalePath(Astro.url, l)`; mark current with `aria-current`.

- [ ] **Step 3: Footer**

- Email (`thomas.miller@marvelous.digital` or preferred), GitHub, LinkedIn, © line, language switcher duplicate. All labels via i18n keys (add keys to `ui.ts` as needed — keep en+fr in sync).

- [ ] **Step 4: Verify a11y + build**

Run: `npm run check && npm run build`.
Manual: `npm run dev`, confirm nav links resolve to correct `/en|/fr` paths, language switch keeps the same page, keyboard can open/close mobile menu.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(layout): BaseLayout, Header, Footer, LanguageSwitcher"
```

---

### Task 6: Homepage assembly (static, pre-motion)

**Files:**

- Create: `src/pages/[lang]/index.astro`
- Create: `src/components/Hero.astro`, `ServiceBlocks.astro`, `CapabilitiesStrip.astro`, `SelectedWork.astro`, `Approach.astro`, `CTA.astro`, `ProjectCard.astro`

**Interfaces:**

- Consumes: `BaseLayout` (Task 5); `headlineServices`, `capabilities` (Task 3); `getCollection('projects')`; i18n helpers.
- Produces: a fully static homepage at `/en/` and `/fr/`; `ProjectCard` with props `{ project, lang }` reused by Task 8.

- [ ] **Step 1: `getStaticPaths` for `[lang]`**

```astro
---
import { languages, type Lang } from '../../i18n/ui';
export function getStaticPaths() {
  return (Object.keys(languages) as Lang[]).map((lang) => ({ params: { lang } }));
}
const lang = Astro.params.lang as Lang;
---
```

- [ ] **Step 2: Build each section component**

Use `frontend-design:frontend-design` for the visual execution. Each component's contract:

- **Hero** — display-type name + positioning line (i18n keys `hero.name`, `hero.tagline`), primary CTA to contact. Contains a mount point (`id="hero-motion"`) for Task 7; must look finished with no JS.
- **ServiceBlocks** — renders the 5 `headlineServices` as bold blocks; frontend-craft (index 1) visually emphasized; each has a scroll-reveal hook `data-reveal` (Task 7).
- **CapabilitiesStrip** — the 5 `capabilities` as a lighter secondary row.
- **SelectedWork** — `getCollection('projects')` filtered to `featured`, sorted by `order`, first 3–4, rendered as large `ProjectCard` teasers; "See all work" → `localizedPath(lang,'/work')`.
- **Approach** — 3–4 short "why me" points (i18n keys).
- **CTA** — closing band → `localizedPath(lang,'/contact')`.
- **ProjectCard** — image (`<Image>`), title, role, tech tags, description, optional outbound link; `nda` projects show a subtle "Client work" badge instead of a link.

- [ ] **Step 3: Assemble homepage**

Compose the sections in order inside `BaseLayout` with `title`/`description` from i18n. Add all new user-facing strings to `ui.ts` (en+fr).

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build`.
Manual: both `/en/` and `/fr/` render all sections; featured projects appear; every visible string differs correctly between locales (no hard-coded English on `/fr/`).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(home): static homepage sections and ProjectCard"
```

---

### Task 7: Motion layer (scroll reveal + signature hero motion)

**Files:**

- Create: `src/components/islands/reveal.ts`, `src/components/islands/HeroMotion.ts`
- Modify: `Hero.astro` and section components to load the islands

**Interfaces:**

- Consumes: elements with `data-reveal` (Task 6); `#hero-motion` mount (Task 6).
- Produces: progressive-enhancement scripts; no change to server-rendered HTML output structure.

- [ ] **Step 1: Scroll-reveal script**

```ts
// src/components/islands/reveal.ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => io.observe(el));
}
```

Add CSS: `[data-reveal]{opacity:0;transform:translateY(1rem)} [data-reveal].is-visible{opacity:1;transform:none;transition:.6s}` inside a `@media (prefers-reduced-motion: no-preference)` guard so reduced-motion users see content immediately.

- [ ] **Step 2: Load reveal island**

In the homepage (and later pages), add `<script>import '../../components/islands/reveal.ts';</script>` (Astro bundles it; runs client-side only).

- [ ] **Step 3: Signature hero motion**

Implement `HeroMotion.ts` as the chosen technique (kinetic type or lightweight canvas/shader). Requirements:

- Guard: `if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;` — leave the static hero untouched.
- Mount into `#hero-motion`; never block first paint (import dynamically / defer); cheap on mobile (cap DPR / pause offscreen via `visibilitychange`).
- Prototype the technique first with `mattpocock-skills:prototype` if the visual direction is uncertain.

- [ ] **Step 4: Verify motion + fallbacks**

Manual:

- Normal: sections reveal on scroll; hero animates.
- DevTools → emulate `prefers-reduced-motion: reduce`: content visible immediately, hero static, no animation.
- Disable JS: page fully readable, hero shows static fallback.
  Run: `npm run build` → succeeds; Lighthouse performance ≥ 90 on the homepage (`npm run preview` + Lighthouse).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(motion): scroll reveal + hero signature motion with reduced-motion fallbacks"
```

---

### Task 8: /work page

**Files:**

- Create: `src/pages/[lang]/work.astro`

**Interfaces:**

- Consumes: `ProjectCard` (Task 6); `getCollection('projects')`; `BaseLayout`; i18n.
- Produces: a bilingual `/…/work` grid page.

- [ ] **Step 1: `getStaticPaths` per locale** (same pattern as Task 6 Step 1).

- [ ] **Step 2: Render the grid**

- All projects sorted by `order`; responsive grid of `ProjectCard`.
- Page intro heading + subhead via i18n keys.
- `nda` items shown with the "Client work" badge, no outbound link.

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build`.
Manual: `/en/work` and `/fr/work` list every project with correct localized fields.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(work): bilingual work grid"
```

---

### Task 9: /about page

**Files:**

- Create: `src/pages/[lang]/about.astro`
- Add: placeholder portrait in `src/assets/placeholders/`

**Interfaces:**

- Consumes: `BaseLayout`, i18n, `<Image>`.
- Produces: bilingual `/…/about`.

- [ ] **Step 1: `getStaticPaths` per locale.**

- [ ] **Step 2: Content**

- Short bio (who Thomas is, how he works, Marvelous/freelance context), portrait placeholder, a compact list of the secondary `capabilities` (reuse Task 3 data), links to contact. All copy via i18n keys (en+fr).

- [ ] **Step 3: Verify** — `npm run check && npm run build`; both locales render.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(about): bilingual about page"
```

---

### Task 10: /contact page + form

**Files:**

- Create: `src/pages/[lang]/contact.astro`

**Interfaces:**

- Consumes: `BaseLayout`, i18n.
- Produces: bilingual contact page with a working form via **Web3Forms** (static-friendly; no server needed). Access key stored as a build-time public env var `PUBLIC_WEB3FORMS_KEY`.

- [ ] **Step 1: `getStaticPaths` per locale.**

- [ ] **Step 2: Form markup**

- Fields: name, email, message; labels + placeholders + submit + success/error copy via i18n keys.
- POST to `https://api.web3forms.com/submit` with hidden `access_key = import.meta.env.PUBLIC_WEB3FORMS_KEY`, a honeypot field, and `redirect`/JS success handling.
- Email + GitHub + LinkedIn also shown as a fallback contact path.
- Progressive enhancement: native form submit works with no JS; a small script can show inline success without a full reload.

- [ ] **Step 3: Env wiring**

Add `PUBLIC_WEB3FORMS_KEY` to `.env` (gitignored) and document it in README (Task 11). Build must not fail if unset in CI preview (form still renders).

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build`.
Manual: both locales render; submitting with a real key delivers an email (or note as a deploy-time check).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(contact): bilingual contact page with Web3Forms"
```

---

### Task 11: Netlify config, SEO essentials, README, final polish

**Files:**

- Create: `netlify.toml`, `public/robots.txt`, `public/favicon.svg`, `README.md`
- Add: `@astrojs/sitemap` integration; `site` in `astro.config.mjs`

**Interfaces:**

- Consumes: whole site.
- Produces: deployable build + discoverability basics.

- [ ] **Step 1: Sitemap + site URL**

```bash
npx astro add sitemap --yes
```

Set `site: 'https://<final-domain>'` in `astro.config.mjs` (use a placeholder domain, noted in README).

- [ ] **Step 2: `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 3: robots.txt + favicon**

`public/robots.txt` allowing all + `Sitemap:` line; add an SVG favicon and reference it in `BaseLayout`.

- [ ] **Step 4: README**

Document: dev/build/test commands, required env var (`PUBLIC_WEB3FORMS_KEY`), how to add a project (add a file to `src/content/projects/`), how to edit strings (`src/i18n/ui.ts`), and Netlify deploy steps.

- [ ] **Step 5: Full verification pass**

Run: `npm run check && npm run test && npm run build`.
Manual: Lighthouse on `/en/` and `/fr/` — Performance/Accessibility/Best-Practices/SEO all ≥ 90; verify `hreflang` tags, sitemap output, reduced-motion, and no-JS rendering one more time.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore(deploy): Netlify config, sitemap, SEO, README"
```

---

## Self-Review

**Spec coverage:**

- Goal (credibility + conversion + impressive) → Tasks 6, 7 (homepage + motion), 8 (work), 10 (contact/CTA). ✔
- Astro SSG + Tailwind v4 + TS → Tasks 1, 4. ✔
- Bilingual EN/FR → Task 2 + every page task. ✔
- Homepage beats (hero, 5 services w/ frontend-craft 2nd, capabilities strip, selected work, approach, CTA) → Task 6 (structure) + Task 3 (data: 5 services, frontend-craft second — test-enforced). ✔
- Lightweight /work (cards, nda framing, no detail pages) → Tasks 3, 6, 8. ✔
- About + Contact → Tasks 9, 10. ✔
- Content model (projects w/ featured+nda, services, UI strings) → Tasks 2, 3. ✔
- Motion gated on prefers-reduced-motion + no-JS hero → Task 7 (+ base CSS Task 4). ✔
- Netlify deploy + placeholders + performance → Tasks 3 (placeholders), 11. ✔
- Non-goals (no blog, no per-project pages) respected — no such tasks. ✔

**Placeholder scan:** Presentational components intentionally defer exact visual styling to the frontend-design skill at execution, but every such task carries a concrete contract (props, content source, acceptance criteria) — not "TBD". Logic tasks (2, 3) have full code + tests. No forbidden placeholders remain.

**Type consistency:** `Lang`, `ui`, `defaultLang` (Task 2) reused consistently; `Service` shape (Task 3) matches its test and consumers (Tasks 6, 9); `ProjectCard` props `{ project, lang }` defined in Task 6, reused in Task 8; i18n helper signatures match their call sites. ✔
