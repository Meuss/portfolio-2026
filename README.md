# Portfolio 2026

Thomas Miller's portfolio: a bilingual (EN/FR) static site built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com).

## Getting started

```bash
corepack enable
pnpm install
pnpm dev
```

## Commands

- `pnpm dev`: local dev server with hot reload.
- `pnpm build`: static build to `dist/`.
- `pnpm preview`: serve the built `dist/`.
- `pnpm check`: `astro check` (TypeScript and template diagnostics).
- `pnpm test`: unit tests (Vitest).
- `pnpm format` / `pnpm format:check`: Prettier, write or check.
- `pnpm check:links`: after a build, check that internal links in `dist/` resolve.

Before a PR, run `pnpm check && pnpm test && pnpm build`. CI runs the same checks, plus the format check and `pnpm check:links`.

## Deploying to Netlify

`netlify.toml` sets the build (`pnpm build`, publish `dist/`, Node 26). Connect the repo to a Netlify site and deploy. Netlify picks up the config on its own. Enable form detection (Forms) for the contact form.

## Tech stack

- [Astro](https://astro.build) with static output
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- TypeScript
- [pnpm](https://pnpm.io), version pinned via `packageManager`
- [Prettier](https://prettier.io) and [Vitest](https://vitest.dev)
- Astro `i18n` routing (`/en/`, `/fr/`)
- [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) for the contact form
- [GoatCounter](https://www.goatcounter.com) for visitor counts (no cookies)
