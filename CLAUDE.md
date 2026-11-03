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

Before pushing or opening a PR, run `pnpm check && pnpm test && pnpm build`.

Node `>=26.0.0` is required (`engines`; `.nvmrc` pins Node 26, `netlify.toml` sets `NODE_VERSION = "26"`). The contact form still has Web3Forms code but no key is set, on purpose: the plan is to move it to **Netlify Forms** once the site is on Netlify (see the TODO in README.md). Don't ask for or add a Web3Forms key.

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
- **All UI strings are in `src/i18n/ui.ts`**, keyed by locale then dot-namespaced key (e.g. `nav.work`, `home.title`). Add/edit a string in **both** `en` and `fr`. Pages get a translator via `const t = useTranslations(lang)` (`src/i18n/utils.ts`); `t(key)` falls back to the default locale then the raw key. `switchLocalePath`/`localizedPath` build cross-locale URLs (used by `LanguageSwitcher.astro`).

### Content (projects)

- Projects are one Markdown file each in `src/content/projects/`, loaded as an Astro content collection defined in `src/content.config.ts`. The schema: `title` (string), `context`, localized `kind`/`description`, `tech[]`, optional `image`/`imageMobile`, optional `link`, `status` (`live`/`soon`), `featured`, `nda`, `order`.
- `/work` lists **all** projects sorted by `order` (ascending), filterable by `context` (`independent` / `macmac` / `marvelous`); the homepage `SelectedWork` shows `featured: true` projects as equal cards in three columns. Images are real screenshots in `src/assets/projects/` (`<slug>.jpg` 2000×1250 + optional `<slug>-mobile.jpg`). There are **no per-project detail pages by design** — don't add routes for them.
- `nda: true` renders NDA framing instead of client specifics.

### The five homepage services

Defined in `src/data/services.ts` (not i18n/ui). Edit that file to change service names, copy, or order. It has a structural test (`src/data/services.test.ts`) asserting ordering/invariants; `src/i18n/utils.test.ts` asserts locale-key parity. Run `pnpm test` after editing either. Contact handles (email, GitHub, LinkedIn) live in `src/data/contact.ts`; GitHub/LinkedIn render as icon links via `SocialLinks.astro`. Partner logos (macmac, Marvelous) render via `ContextBadge.astro`.

### Page composition & client JS

- `src/layouts/BaseLayout.astro` is the single `<head>` authority: it derives canonical, Open Graph, and `hreflang` URLs from `Astro.site` (`site` in `astro.config.mjs` is the one place to change the production domain — mirror it in `public/robots.txt`).
- Pages compose Astro components from `src/components/`; every component takes `lang` as a prop and translates internally.
- Client JS is minimal and progressive-enhancement only, living in `src/components/islands/` and imported via inline `<script>` (Vite-bundled, not raw):
  - `reveal.ts` — scroll-reveal for `[data-reveal]` elements. If `prefers-reduced-motion` or no `IntersectionObserver`, everything is revealed immediately; the hidden base state is CSS-guarded so no-JS still shows all content.
  - `work-filter.ts` — context filter chips on `/work`; hidden without JS.
  - `Hero.astro` inline script — pause toggle for the drifting screenshot wall; CSS animation is reduced-motion-gated and pauses off-screen.
  - `fx/` — the effects system. `runtime.ts` (imported by `BaseLayout`) mounts the variant chosen in `src/data/effects.ts` into every `[data-fx-slot~="<slot>"]` element (one instance per element; an element can host several slots) plus the site-wide cursor on `<body>`; variants are dynamic imports, so pages only download what runs. Slots/variants/param ranges live in `src/data/effects-registry.ts` (tested by `src/data/effects.test.ts`). To add a variant: add it to the registry, write a module exporting `mount: FxMount` (its `destroy()` must fully undo it so the panel can hot-swap; CSS goes in a sibling `.css` imported by the module), register its loader in `runtime.ts`.
  - `fx/panel.ts` — **dev-only** FX panel (bottom-left, Alt+F) to switch variants and tune params live; "Save as default" POSTs to the `fxSavePlugin` dev middleware in `astro.config.mjs`, which rewrites `src/data/effects.ts`. It is imported behind `import.meta.env.DEV` and never reaches `dist/`.
  - Effects inspired by React Bits are **ported to vanilla TS** (Canvas2D / WebGL2 via `fx/gl.ts` / DOM+WAAPI), not added as React islands — no React, no animation libraries. New effects go in as additional variants of a slot so they can be compared in the panel before choosing; see DESIGN.md "Effects: Light & Motion" for the slot table and what was tried and dropped.

### Design tokens

The visual system ("Graphite & Gilt": graphite ground, warm ink, one ruby accent, gilt labels/primary action; see DESIGN.md) is defined as Tailwind v4 `@theme` tokens at the top of `src/styles/global.css` — colors (`bg-paper`, `text-ink`, `text-muted`, `text-accent`, …), font families (`font-display`, `font-sans`, `font-mono`), and a fluid `clamp()` type scale (`text-headline`, `text-lead`, `text-caption`, …). Fonts are self-hosted via Fontsource (bundled, no runtime CDN). Use these token utilities rather than raw hex/px values.

### Brand (logo, palette, fonts)

- The logo kit lives in **`brand/`** (copied from the old `my-logos` repo; edit it here). `brand/README.md` has colours, fonts, usage rules and how to rebuild with `brand/build_kit.py`; Astro ignores the folder. The kit's logo is the orange ring with the Moléson peak, with the name in Schibsted Grotesk ExtraBold. The site has not been switched to it yet: it still shows the earlier red **Moléson M** (no longer kept in `brand/`), drawn inline by `src/components/Logo.astro` in the header and, with tagline, the footer. Favicons, `site.webmanifest` and `og-image.png` in `public/` are still the old v1 files; the new ones are in `brand/favicon/` and `brand/social/`.
- `src/data/brand.ts` is the shipped choice (palette, heading/body font, logo lockup/font/weight/tracking/size); options live in `src/data/brand-registry.ts` (tested by `src/data/brand.test.ts`). `BaseLayout` renders it as inline token overrides + `data-*` attributes on `<html>`, so it costs no JS. The `@theme` defaults in `global.css` must keep matching the `gilt` palette (the test checks).
- `islands/brand/panel.ts` — **dev-only** Brand panel (bottom-right, Alt+B) to try palettes, fonts and logo settings live; "Save as default" POSTs to `brandSavePlugin` in `astro.config.mjs`, which rewrites `src/data/brand.ts`. To add a palette or font: add it to the registry (fonts also need their Fontsource `@import` in `global.css`).
- Effects take colours from the tokens (CSS `color-mix(var(--color-…))`, canvas/WebGL via `tokenRgb()` in `fx/types.ts`), never raw hex, so they follow the palette.

## Deploy

Netlify builds via `netlify.toml` (`pnpm build` → publish `dist/`, Node 26). Form delivery is planned on Netlify Forms (README TODO).
