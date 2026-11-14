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
pnpm dev
```

## TODO

- [ ] **Contact form notifications.** The form posts to Netlify Forms (see
      [Contact form](#contact-form)). Set up email notifications to `contact@thomasmiller.ch`
      in the Netlify dashboard (Forms → Notifications) so messages reach the inbox.

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
| `pnpm check:links`  | After `pnpm build`: check that every internal link in `dist/` resolves to a file.                            |

Before pushing or opening a PR, run `pnpm check && pnpm test && pnpm build`.
CI (`.github/workflows/ci.yml`) runs the same checks plus the format check and `pnpm check:links` on pull requests and pushes to `master`.

> pnpm settings (e.g. `onlyBuiltDependencies`) live in `pnpm-workspace.yaml`, not
> `package.json` — pnpm v11 moved them there.

## Environment variables

None. The contact form needs no key (Netlify Forms picks it up from the built HTML).

## Contact form

The form in `src/pages/[lang]/contact.astro` uses [Netlify Forms](https://docs.netlify.com/manage/forms/setup/):

- `data-netlify="true"`, `name="contact"` and a hidden `form-name` input. The `/en/` and
  `/fr/` pages render the same form name and fields, so they feed **one** Netlify form; a
  hidden `language` field (`en` / `fr`) says which page a message came from, and a hidden
  `subject` field sets the notification email's subject. The `email` field becomes the
  notification's Reply-To.
- Spam: the honeypot field (`netlify-honeypot="botcheck"`), plus Netlify's built-in Akismet
  filtering (flagged messages go to the form's Spam submissions list).
- One optional file (`attachment`), checked in the browser for type and size. Netlify caps
  the whole request at 8 MB.
- Without JS the browser POSTs to the success page (`/en/contact/thanks/`,
  `/fr/contact/thanks/`), which Netlify serves after storing the message. Netlify keeps one
  action per form (the page it detected last) and serves it whatever the posted URL, so an
  English visitor may get the French page: each success page says it in both languages,
  its own first. With JS the script POSTs the same multipart `FormData` to that path, treats
  any 2xx as sent and shows the result inline.
- Form detection must be on for the site (Netlify UI → Forms); submissions only work on a
  Netlify deploy, not in `pnpm dev` or `pnpm preview`.

## Content model

### Adding / editing a project

Projects live in `src/content/projects/` as one Markdown file per project, validated by
the schema in `src/content.config.ts`. To add a project, drop a new `.md` file in that
directory with frontmatter like:

```yaml
---
title: 'Client name' # proper noun, not translated
context: independent # independent | macmac | marvelous (shows the partner logo)
kind:
  en: 'Restaurant website'
  fr: 'Site de restaurant'
description:
  en: 'Short description.'
  fr: 'Description courte.'
tech: ['Astro', 'Netlify']
image: '../../assets/projects/<slug>.jpg' # 2000×1250 screenshot (optional)
imageMobile: '../../assets/projects/<slug>-mobile.jpg' # 600px-wide phone capture (optional)
link: 'https://example.com' # optional
status: live # live | soon
featured: false # true = shown in the homepage "selected work" section
nda: false # true = renders NDA framing instead of client details
order: 4 # display order (lower = earlier)
---
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
- Privacy & legal notice: `/en/privacy/` and `/fr/privacy/` (`src/pages/[lang]/privacy.astro`,
  strings in `src/i18n/ui.ts`), linked from every footer and from the contact form.
- Visitor counts: [GoatCounter](https://www.goatcounter.com), code set in
  `src/data/analytics.ts` (empty = off), script added to production builds only.
  To stop counting your own visits, open `https://thomasmiller.ch/#toggle-goatcounter` once
  per browser (it stores one flag in that browser's localStorage), or add your IP in
  GoatCounter's settings.
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
3. Enable form detection (Forms) and set up the form's email notifications (see TODO).
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
- Contact form: [Netlify Forms](https://docs.netlify.com/manage/forms/setup/)
- Visitor counts: [GoatCounter](https://www.goatcounter.com) (no cookies)
