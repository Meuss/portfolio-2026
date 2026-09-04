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

Node `>=26.0.0` is required (`engines`; `.nvmrc` pins Node 26, `netlify.toml` sets `NODE_VERSION = "26"`). The contact form needs `PUBLIC_WEB3FORMS_KEY` (copy `.env.example` → `.env`); the site builds and renders fine without it — only form delivery is disabled.

### pnpm & supply-chain (impeccable)

- pnpm settings live in **`pnpm-workspace.yaml`**, not a `pnpm` field in `package.json` (pnpm v11 moved them). Dependency build scripts are opt-in via `onlyBuiltDependencies` (currently just `esbuild`).
- `sharp` is a **direct** devDependency on purpose: Astro uses it for build-time image optimization but only declares it as an optional transitive dep, which pnpm's isolated `node_modules` doesn't expose to Astro. Without it, `pnpm build` fails with `MissingSharp`. Don't remove it.
- This repo has the `.impeccable` supply-chain hook enabled. It verifies `pnpm-lock.yaml` against policies on install and gates dependency build scripts via an `allowBuilds:` block in `pnpm-workspace.yaml`. If a new dependency needs a build script, impeccable appends `allowBuilds:\n  <pkg>: set this to true or false` — resolve it by setting the package to `true` (trusted) or `false`, then reinstall.

## Architecture

Astro (`output: 'static'`) + Tailwind CSS v4 (via `@tailwindcss/vite`, no JS config). Everything is prerendered — there is no server runtime.

### Bilingual routing (EN/FR) — the backbone

- `astro.config.mjs` sets `i18n` with `prefixDefaultLocale: true`, so **both** `/en/…` and `/fr/…` are explicit; there is no unprefixed route. `src/pages/index.astro` server-redirects `/` → `/en/`, and `netlify.toml` also 301s `/` → `/en/` for the deployed edge.
- Every page lives under `src/pages/[lang]/` and exports `getStaticPaths()` returning one entry per locale (`en`, `fr`). `lang` comes from `Astro.params.lang`.
- **All UI strings are in `src/i18n/ui.ts`**, keyed by locale then dot-namespaced key (e.g. `nav.work`, `home.title`). Add/edit a string in **both** `en` and `fr`. Pages get a translator via `const t = useTranslations(lang)` (`src/i18n/utils.ts`); `t(key)` falls back to the default locale then the raw key. `switchLocalePath`/`localizedPath` build cross-locale URLs (used by `LanguageSwitcher.astro`).

### Content (projects)

- Projects are one Markdown file each in `src/content/projects/`, loaded as an Astro content collection defined in `src/content.config.ts`. The schema uses a `localized = { en, fr }` object for `title`/`role`/`description`; other fields include `tech[]`, `image` (validated `image()`), optional `link`, `featured`, `nda`, `order`.
- `/work` lists **all** projects sorted by `order` (ascending); the homepage `SelectedWork` shows only `featured: true`. There are **no per-project detail pages by design** — don't add routes for them.
- `nda: true` renders NDA framing instead of client specifics.

### The five homepage services

Defined in `src/data/services.ts` (not i18n/ui). Edit that file to change service names, copy, or order. It has a structural test (`src/data/services.test.ts`) asserting ordering/invariants; `src/i18n/utils.test.ts` asserts locale-key parity. Run `pnpm test` after editing either.

### Page composition & client JS

- `src/layouts/BaseLayout.astro` is the single `<head>` authority: it derives canonical, Open Graph, and `hreflang` URLs from `Astro.site` (`site` in `astro.config.mjs` is the one place to change the production domain — mirror it in `public/robots.txt`).
- Pages compose Astro components from `src/components/`; every component takes `lang` as a prop and translates internally.
- Client JS is minimal and progressive-enhancement only, living in `src/components/islands/` and imported via inline `<script>` (Vite-bundled, not raw):
  - `reveal.ts` — scroll-reveal for `[data-reveal]` elements. If `prefers-reduced-motion` or no `IntersectionObserver`, everything is revealed immediately; the hidden base state is CSS-guarded so no-JS still shows all content.
  - `HeroMotion.ts` — decorative canvas behind the hero, dynamic-imported after first paint (`Hero.astro`). Reduced-motion users get nothing; the rAF loop pauses when hidden/off-screen.

### Design tokens

The visual system ("Swiss lab": porcelain paper, near-black ink, one ultramarine accent) is defined as Tailwind v4 `@theme` tokens at the top of `src/styles/global.css` — colors (`bg-paper`, `text-ink`, `text-muted`, `text-accent`, …), font families (`font-display`, `font-sans`, `font-mono`), and a fluid `clamp()` type scale (`text-headline`, `text-lead`, `text-caption`, …). Fonts are self-hosted via Fontsource (bundled, no runtime CDN). Use these token utilities rather than raw hex/px values.

## Deploy

Netlify builds via `netlify.toml` (`pnpm build` → publish `dist/`, Node 26). Set `PUBLIC_WEB3FORMS_KEY` in Netlify env for production form delivery.
