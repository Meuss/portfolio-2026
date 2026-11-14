# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This repo uses **pnpm** (pinned via `packageManager` in `package.json`; run `corepack enable` once so pnpm resolves to the pinned version). Do not use `npm`/`yarn` — there is no `package-lock.json`.

- `pnpm dev` — local dev server with hot reload.
- `pnpm build` — static production build to `dist/` (both `/en/` and `/fr/` trees + sitemap).
- `pnpm preview` — serve the built `dist/`.
- `pnpm check` — `astro check` (TypeScript + template diagnostics). The `build` script does **not** type-check, so `check` is the type gate.
- `pnpm test` — Vitest unit suite. Run a single test with `pnpm vitest run src/i18n/utils.test.ts` (or `pnpm vitest -t "name"`).
- `pnpm format` / `pnpm format:check` — Prettier write / check (config in `.prettierrc.json`, uses `prettier-plugin-astro`).
- `pnpm check:links` — after `pnpm build`, checks that every internal link in `dist/` (`href`/`src`/`srcset`, plus our own absolute canonical/hreflang/OG/sitemap URLs) resolves to a file. External URLs are never fetched. Script: `scripts/check-links.mjs`.

Before pushing or opening a PR, run `pnpm check && pnpm test && pnpm build`. CI (`.github/workflows/ci.yml`) runs the format check, type check, tests, build and `pnpm check:links` on pull requests and pushes to `master`, on Node 26 with pnpm via corepack; Dependabot opens grouped monthly PRs (`.github/dependabot.yml`, TypeScript majors ignored until `astro check` supports 7).

Node `>=26.0.0` is required (`engines`; `.nvmrc` pins Node 26, `netlify.toml` sets `NODE_VERSION = "26"`). The contact form uses **Netlify Forms** (see "Contact form" in README.md); it needs no key and only receives submissions on a Netlify deploy.

### pnpm & supply-chain (impeccable)

- pnpm settings live in **`pnpm-workspace.yaml`**, not a `pnpm` field in `package.json` (pnpm v11 moved them). Dependency build scripts are opt-in via `onlyBuiltDependencies` (currently just `esbuild`).
- `sharp` is a **direct** devDependency on purpose: Astro uses it for build-time image optimization but only declares it as an optional transitive dep, which pnpm's isolated `node_modules` doesn't expose to Astro. Without it, `pnpm build` fails with `MissingSharp`. Don't remove it.
- This repo has the `.impeccable` supply-chain hook enabled. It verifies `pnpm-lock.yaml` against policies on install and gates dependency build scripts via an `allowBuilds:` block in `pnpm-workspace.yaml`. If a new dependency needs a build script, impeccable appends `allowBuilds:\n  <pkg>: set this to true or false` — resolve it by setting the package to `true` (trusted) or `false`, then reinstall.

## Architecture

Astro (`output: 'static'`) + Tailwind CSS v4 (via `@tailwindcss/vite`, no JS config). Everything is prerendered — there is no server runtime.

### Bilingual routing (EN/FR) — the backbone

- `astro.config.mjs` sets `i18n` with `prefixDefaultLocale: true`, so **both** `/en/…` and `/fr/…` are explicit; there is no unprefixed route. `src/pages/index.astro` server-redirects `/` → `/en/`, and `netlify.toml` also 301s `/` → `/en/` for the deployed edge.
- Every page lives under `src/pages/[lang]/` and exports `getStaticPaths()` returning one entry per locale (`en`, `fr`). `lang` comes from `Astro.params.lang`.
- 404: `src/pages/[lang]/404.astro` builds `/en/404/` and `/fr/404/` (shared `NotFound.astro`, `noindex`, excluded from the sitemap); `netlify.toml` routes unknown `/fr/*` URLs to the French one and everything else to the English one. `src/pages/404.astro` is the fallback the dev server uses.
- Privacy & legal notice: `src/pages/[lang]/privacy.astro` (`/en/privacy/`, `/fr/privacy/`, in the sitemap), one page for who runs the site and what it does with personal data. Its strings are the `privacyPage.*` keys in `ui.ts`; `{email}`/`{fdpic}` placeholders become links via `splitSlots()` (`src/i18n/utils.ts`). It describes the contact form, Netlify hosting, GoatCounter and the absence of cookies/storage: **keep it true** when any of those change (e.g. a new form field, a cookie, another third-party service), and bump its "Last updated" date.
- **All UI strings are in `src/i18n/ui.ts`**, keyed by locale then dot-namespaced key (e.g. `nav.work`, `home.title`). Add/edit a string in **both** `en` and `fr`. Pages get a translator via `const t = useTranslations(lang)` (`src/i18n/utils.ts`); `t(key)` falls back to the default locale then the raw key. `switchLocalePath`/`localizedPath` build cross-locale URLs (used by `LanguageSwitcher.astro`).

### Content (projects)

- Projects are one Markdown file each in `src/content/projects/`, loaded as an Astro content collection defined in `src/content.config.ts`. The schema: `title` (string), `context`, localized `kind`/`description`, `tech[]`, optional `image`/`imageMobile`, optional `link`, `status` (`live`/`soon`), `featured`, `hidden`, `nda`, `order`. `hidden: true` keeps an entry in the repo but off the site entirely; load projects with `getVisibleProjects()` (`src/data/projects.ts`), not `getCollection('projects')`, so hidden ones never show.
- `/work` lists **all** projects sorted by `order` (ascending), filterable by `context` (`independent` / `macmac` / `marvelous`); the homepage `SelectedWork` shows `featured: true` projects as equal cards in three columns. Images are real screenshots in `src/assets/projects/` (`<slug>.jpg` 2000×1250 + optional `<slug>-mobile.jpg`). There are **no per-project detail pages by design** — don't add routes for them.
- `nda: true` renders NDA framing instead of client specifics.

### The five homepage services

Defined in `src/data/services.ts` (not i18n/ui). Edit that file to change service names, copy, or order. It has a structural test (`src/data/services.test.ts`) asserting ordering/invariants; `src/i18n/utils.test.ts` asserts locale-key parity. Run `pnpm test` after editing either. Contact handles (email, phone, GitHub, LinkedIn, WhatsApp) live in `src/data/contact.ts`; GitHub/LinkedIn/WhatsApp render as icon links via `SocialLinks.astro` (footer and contact page). The WhatsApp link is `wa.me/<phone digits>`: keep it in step with `phone`. Partner logos (macmac, Marvelous) render via `ContextBadge.astro`.

### Page composition & client JS

- `src/layouts/BaseLayout.astro` is the single `<head>` authority: it derives canonical, Open Graph, and `hreflang` URLs from `Astro.site` (`site` in `astro.config.mjs` is the one place to change the production domain — mirror it in `public/robots.txt`).
- Pages compose Astro components from `src/components/`; every component takes `lang` as a prop and translates internally.
- The closing call to action ("Let's talk about your project" + button to the contact page) is part of `Footer.astro`, not a per-page component. A page picks the footer with the `footer` prop on `BaseLayout`: `'full'` (default: pitch + contact details + fine print), `'compact'` (404 pages: contact details + fine print) or `'fine-print'` (contact page, whose body already shows the contact details and which the button would link to: fine print only). `ContactDetails.astro` renders the email, phone and icon links for the footer. Every variant's fine print ends with "© year Thomas Miller · Privacy & legal notice", linking to the privacy page.
- Client JS is minimal and progressive-enhancement only, living in `src/components/islands/` and imported via inline `<script>` (Vite-bundled, not raw):
  - `reveal.ts` — scroll-reveal for `[data-reveal]` elements. If `prefers-reduced-motion` or no `IntersectionObserver`, everything is revealed immediately; the hidden base state is CSS-guarded so no-JS still shows all content.
  - `work-filter.ts` — context filter chips on `/work`; hidden without JS.
  - `Hero.astro` inline script — pause toggle for the drifting screenshot wall (desktop only: the wall is `display: none` below `lg`); CSS animation is reduced-motion-gated and pauses off-screen.
  - `fx/` — the effects. `fx/effects.ts` is the one table of what runs where: `slot: { load, params }`, the effect module (imported on demand) and its settings. `runtime.ts` (imported by `BaseLayout`) mounts each entry into every `[data-fx-slot~="<slot>"]` element (one instance per element; an element can host several slots) plus the site-wide cursor on `<body>`, once the fonts are ready; a page only downloads the modules it has a slot for. An effect mounts once and lives as long as the page: there are no variants to switch between, no teardown or live-update API, and nothing dev-only. Two entries only light up what the markup already draws: `servicesTiles` paints the pointer light into the homepage's service tiles (the tiles, plates and indexes are in `ServiceBlocks.astro`), and `approachLight` leans the approach section's top light (static gradient layers in `Approach.astro`) toward the pointer.
  - To change an effect's settings: edit its `params` in `fx/effects.ts` (the header comment of each module says what its params do). To add an effect: write a module exporting `mount: FxMount` (`(host, params) => void`; CSS goes in a sibling `.css` imported by the module; give reduced motion a still version and pause loops off-screen and in hidden tabs), add its `slot: { load, params }` entry to the table and put `data-fx-slot="<slot>"` on the element. Layout and styling belong in the component's markup, not in an effect: an effect is applied after the fonts load, which would shift the layout. To remove one: delete the entry, the attribute and the module. `fx/effects.test.ts` checks that the slot names in the markup and the entries in the table match.
  - Effects inspired by React Bits are **ported to vanilla TS** (Canvas2D / DOM+WAAPI), not added as React islands — no React, no animation libraries. See DESIGN.md "Effects: Light & Motion" for the table of shipped effects and what was tried and dropped (don't re-add those without asking).

### Design tokens

The visual system (kit black ground, warm ink, kit orange as the only colour, accent only; see DESIGN.md and the [styleguide](https://claude.ai/artifact/Sn8r8BG7e8FA6TNQPVU1iu)) is defined as Tailwind v4 `@theme` tokens at the top of `src/styles/global.css` — colors (`bg-paper`, `text-ink`, `text-muted`, `text-accent`, …), font families (`font-display` for headings and `font-sans` for body are both Schibsted Grotesk, `font-mono` is DM Mono), and a fluid `clamp()` type scale (`text-headline`, `text-lead`, `text-caption`, …). Fonts are self-hosted via Fontsource (bundled, no runtime CDN). Use these token utilities rather than raw hex/px values.

### Brand (logo, palette, fonts)

- The logo kit lives in **`brand/`** (copied from the old `my-logos` repo; edit it here). `brand/README.md` has colours, fonts, usage rules and how to rebuild with `brand/build_kit.py`; Astro ignores the folder. The logo is the orange ring with the Moléson peak, with the name in Schibsted Grotesk ExtraBold. `src/components/Logo.astro` draws the symbol inline beside the live-text name and tagline (header and footer). Favicons, `site.webmanifest` and `og-image.png` in `public/` are copies from `brand/favicon/` and `brand/social/` (`og-image-dark.png`): recopy them after rebuilding the kit.
- The brand values live in `src/styles/global.css` and nowhere else: the palette and the font families are the `@theme` tokens, and the logo's type (Schibsted Grotesk 800, -0.04em) and size (36px symbol, or the caller's `--logo-size`: the footer sets 2.5rem) are the "Logo" rules at the end of the file. The page ground is repeated by hand as `theme-color` in `BaseLayout` and in `public/site.webmanifest`: change `--color-paper` and those together.
- Effects take colours from the tokens (CSS `color-mix(var(--color-…))`, canvas via `tokenRgb()` in `fx/types.ts`), never raw hex, so they follow the palette.

## Deploy

Netlify builds via `netlify.toml` (`pnpm build` → publish `dist/`, Node 26). The contact form posts to Netlify Forms: one form named `contact` fed by both locales (same field names, a hidden `language` field), honeypot via `netlify-honeypot`, no-JS `action` = the success page `src/pages/[lang]/contact/thanks.astro` (`noindex`, out of the sitemap). Netlify keeps one action per form and serves it for every submission, so either locale's success page can be served: both carry both languages. Netlify only detects fields present in the built HTML, so a new field needs a redeploy before it is stored.

Visitor counting: GoatCounter (cookie-free, hosted). The site code is `goatcounterCode` in `src/data/analytics.ts` (empty string = off); `BaseLayout` renders the count script only in production builds (`import.meta.env.PROD`), never in `pnpm dev`. Pages report their canonical path (so `/en/…` and `/fr/…` count apart); `noindex` pages (404, form success) report their own built path, so every unknown URL counts as `/en/404/` or `/fr/404/`. The site itself sets no cookies and uses no localStorage/sessionStorage: the privacy page says so, so don't add any without updating it.
