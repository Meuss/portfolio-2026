# Portfolio Site — Design Spec

**Date:** 2026-09-02
**Owner:** Thomas Miller (thomasmiller.ch)
**Status:** Approved design → ready for implementation planning

## Goal

Replace the current minimal personal site with a bold, high-craft portfolio
whose job is to **(1) prove credibility with real work** and **(2) convert
prospects into freelance leads**. The homepage is the centerpiece and carries
most of the persuasion. The site must itself be a demonstration of Thomas's
front-end skill — it has to _look_ impressive.

## Audience & positioning

Freelance clients, both local (French-speaking Switzerland / Romandie) and
international. Thomas is a full-stack web developer (currently at Marvelous
Digital) offering websites, apps, e-commerce, AI, and SEO. Positioning leads
with **front-end craft** as the differentiator.

## Non-goals (v1 / YAGNI)

- No blog.
- No deep per-project case-study essays. Work is shown as a curated, mostly
  visual showcase. (A flagship project could get a dedicated page later.)
- No CMS/admin — content is file-based via Astro content collections.
- The unrelated `spie` folder in the session's working directories is out of
  scope and will not be touched.

## Tech stack

- **Framework:** Astro, static output (SSG). Every page pre-rendered for speed
  and SEO.
- **Interactivity:** Astro islands, hydrated only where motion/interaction
  lives. Everything else ships zero JS.
- **Styling:** Tailwind CSS, with a small design-token layer (color, type
  scale, spacing) for a bold, deliberate visual system on a strict grid.
- **i18n:** Astro's built-in i18n routing — `/en/*` and `/fr/*`, English
  default, with a language switch that preserves the current page.
- **Content:** Astro content collections with typed schemas (see Content
  model).
- **Contact form:** static-friendly backend (Web3Forms/Formspree, or a Netlify
  serverless function).
- **Deploy:** Netlify (static site + serverless function for the form).
- **Assets:** placeholders in v1; content model designed for real images to be
  dropped in later without code changes.

## Site structure (IA)

Homepage-weighted, minimal. All pages mirrored bilingually (`/en/…`, `/fr/…`).

- **`/` Home** — the centerpiece; does most of the persuasion (see Homepage).
- **`/work`** — curated visual grid of selected projects. Cards, not essays:
  thumbnail, name, role, tech tags, 1–2 line description, outbound link where
  allowed. Older/NDA items get a light-touch card with vague framing and no
  dedicated page.
- **`/about`** — short: who Thomas is, how he works, Marvelous/freelance
  context, a photo. Trust reinforcement, not a novel.
- **`/contact`** — the conversion point: "let's discuss your project", email +
  simple form, GitHub/LinkedIn.

## Homepage (the star)

A bold, scroll-driven single flow, top to bottom:

1. **Experimental hero** — large expressive typography: name + positioning line
   ("Web developer in Switzerland — websites, apps, e-commerce, AI"). One
   signature motion moment (WebGL/shader canvas or kinetic type) as an isolated
   island. Static, elegant fallback for reduced-motion / no-JS / mobile.
2. **What I do** — 5 headline service blocks, revealed on scroll, front-end
   craft placed second so the differentiator hits early:
   1. Full-stack web development (frontend + backend, end-to-end)
   2. Frontend craft & polish (pixel-perfect UI, motion, performance) —
      signature block
   3. E-commerce & CRM (stores, integrations, business systems)
   4. AI integration (chat, automation, smart features)
   5. SEO & performance (get found, load fast)
3. **More capabilities** — a lower, lighter strip of secondary offerings: API &
   third-party integrations, web apps & dashboards, automation, maintenance &
   support, technical audits.
4. **Selected work** — 3–4 best projects as large scroll-animated teasers,
   linking into `/work`.
5. **Approach / why me** — a short, confident statement of how Thomas works
   (a few points). Credibility without a wall of text.
6. **CTA band** — strong closing "Let's talk about your project" → contact.

## Content model (Astro content collections, typed)

- **`projects`** — one entry per work item:
  `title`, `role`, `tech` (tags), `description`, `image`, `link` (optional),
  `featured` (bool → homepage "selected work"), `nda` (bool → light framing),
  `order`, `locale`. Adding a project = adding a file.
- **`services`** — the 5 headline blocks + the secondary capabilities strip, as
  structured data so both languages stay in sync.
- **Site copy / UI strings** — per-locale, structured, to keep FR/EN aligned.

## Motion & performance

- Scroll-driven reveals plus one signature hero moment; motion is purposeful,
  not decoration everywhere.
- All motion gated behind `prefers-reduced-motion` with static fallbacks; hero
  degrades gracefully with no JS.
- Performance budget kept tight: lazy-load the heavy hero island, optimize
  images via Astro `<Image>`, keep hydrated islands minimal. Target strong
  Lighthouse/Core Web Vitals scores.

## Accessibility

- Semantic HTML, keyboard navigable, sufficient contrast in the bold palette,
  reduced-motion respected, alt text on all imagery.

## Open items for build time (not blocking)

- Specific type pairing and color palette (proposed during build).
- Exact hero motion technique (kinetic type vs. shader) — prototype and choose.
- Contact-form backend choice (Web3Forms vs. Netlify function).
- Real project content and copy (EN + FR).

## Success criteria

- Homepage reads as genuinely impressive and distinctly not-templated.
- Clear, fast path from landing to "contact Thomas about a project".
- Fast (strong Core Web Vitals), accessible, and bilingual.
- Adding/editing projects and copy requires only content-file edits.
