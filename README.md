# Portfolio 2026

Thomas Miller's personal portfolio site — a bilingual (EN/FR), statically-generated
site built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com).

## Requirements

- Node.js `>=26.0.0` (see `engines` in `package.json`; `.nvmrc` pins Node 26 — run `nvm use`)
- [pnpm](https://pnpm.io) — the package manager for this repo. The exact version is pinned
  via `packageManager` in `package.json`; the easiest way to get it is Corepack (ships with
  Node): `corepack enable`, and pnpm auto-resolves to the pinned version.

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in PUBLIC_WEB3FORMS_KEY (see below)
pnpm dev
```

## Commands

| Command             | Purpose                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`          | Start the local dev server with hot reload.                                                                  |
| `pnpm build`        | Type-check-free production build to `dist/` (static output, both `/en/` and `/fr/` trees, sitemap included). |
| `pnpm preview`      | Serve the built `dist/` locally to sanity-check the production build.                                        |
| `pnpm check`        | Run `astro check` (TypeScript + template diagnostics).                                                       |
| `pnpm test`         | Run the unit test suite (Vitest).                                                                            |
| `pnpm format`       | Format the codebase with Prettier (writes changes).                                                          |
| `pnpm format:check` | Check formatting without writing (CI-friendly).                                                              |

Before pushing or opening a PR, run `pnpm check && pnpm test && pnpm build`.

> pnpm settings (e.g. `onlyBuiltDependencies`) live in `pnpm-workspace.yaml`, not
> `package.json` — pnpm v11 moved them there.

## Environment variables

| Variable               | Required                                             | Purpose                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_WEB3FORMS_KEY` | For the contact form to actually deliver submissions | Public access key for [Web3Forms](https://web3forms.com), used by `src/pages/[lang]/contact.astro`. It's a build-time `PUBLIC_` var so it ends up in the client bundle — that's expected for Web3Forms' model. The site builds and renders fine with this unset; the form UI just won't deliver submissions until a real key is set. |

Copy `.env.example` to `.env` and fill in real values for local development. `.env` is
gitignored — never commit real secrets. In Netlify, set `PUBLIC_WEB3FORMS_KEY` under
**Site settings → Environment variables**.

## Content model

### Adding / editing a project

Projects live in `src/content/projects/` as one Markdown file per project, validated by
the schema in `src/content.config.ts`. To add a project, drop a new `.md` file in that
directory with frontmatter like:

```yaml
---
title:
  en: 'Project title'
  fr: 'Titre du projet'
role:
  en: 'Your role'
  fr: 'Votre rôle'
description:
  en: 'Short description.'
  fr: 'Description courte.'
tech: ['Astro', 'Node.js']
image: '../../assets/placeholders/project-x.svg'
link: 'https://example.com' # optional
featured: false # true = shown on the homepage "selected work" strip
nda: true # true = renders NDA framing instead of client details
order: 4 # controls display order (lower = earlier)
---
Optional body content (currently unused by the templates but validated as Markdown).
```

The `/work` page lists all projects; the homepage shows only `featured: true` projects.
No per-project detail pages exist by design (see the project brief's non-goals).

### Editing copy / UI strings

- All bilingual UI strings (nav labels, headings, CTAs, form labels, etc.) live in
  `src/i18n/ui.ts`, keyed by locale (`en` / `fr`). Edit the string there for both
  locales to keep them in sync.
- The five services shown on the homepage (with "frontend craft" second) are defined in
  `src/data/services.ts`. Edit that file to change service names, descriptions, or order.

Both files have accompanying tests (`src/i18n/utils.test.ts`, `src/data/services.test.ts`)
that assert on structural invariants (e.g. locale keys present, service ordering) — run
`pnpm test` after editing.

## SEO

- `astro.config.mjs` declares `site: 'https://thomasmiller.ch'`, the canonical production
  domain. Update this (and `Sitemap:` in `public/robots.txt`) if the final domain changes.
- `@astrojs/sitemap` generates `sitemap-index.xml` / `sitemap-0.xml` at build time from
  every static route (both locales).
- `public/robots.txt` allows all crawlers and points to the sitemap.
- `src/layouts/BaseLayout.astro` derives canonical, Open Graph, and `hreflang` URLs from
  `Astro.site`, so changing `site` in `astro.config.mjs` is the single source of truth.
- Favicon: `public/favicon.svg` (with `public/favicon.ico` as a legacy fallback),
  referenced via `<link rel="icon">` in `BaseLayout.astro`.

## Deploying to Netlify

`netlify.toml` at the repo root configures the build:

```toml
[build]
  command = "pnpm build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "26"
```

To deploy:

1. Create a new Netlify site from this Git repository (or connect an existing one).
2. Netlify picks up `netlify.toml` automatically — build command and publish directory
   need no manual configuration.
3. Set the `PUBLIC_WEB3FORMS_KEY` environment variable in Netlify's site settings so the
   contact form works in production.
4. Point the site's custom domain at `thomasmiller.ch` (or update `site` in
   `astro.config.mjs` and `Sitemap:` in `public/robots.txt` if the final domain differs).
5. Trigger a deploy — Netlify runs `pnpm build` and publishes `dist/`.

## Tech stack

- [Astro](https://astro.build) (static output, `output: 'static'`)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- TypeScript
- [pnpm](https://pnpm.io) as the package manager (version pinned via `packageManager`)
- [Prettier](https://prettier.io) (with `prettier-plugin-astro`) for formatting
- [Vitest](https://vitest.dev) for unit tests
- Astro's built-in `i18n` routing (`/en/`, `/fr/`, `en` as default locale, explicitly
  prefixed) for bilingual content
- [Web3Forms](https://web3forms.com) for the contact form (no backend required)
