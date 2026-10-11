# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners and managers of **Swiss small-to-mid-sized businesses** evaluating whether to
hire a freelance web developer for a site, online store, or web app. They arrive to judge
credibility and fit before making contact, often need the result in both **French and English**,
and are the decision-maker (not a procurement team). Secondary visitors: past contacts and
referrers checking recent work.

The visitor's job on this site is to size up capability and trust quickly, then start a
conversation about their project.

## Product Purpose

Thomas Miller's personal marketing/portfolio site. It exists to win qualified freelance
web-development engagements: present who Thomas is and what he can build, show selected work,
and convert interest into a project inquiry. Success = a qualified visitor sends a project
message (or reaches out via a direct channel).

## Positioning

Thomas is **employed as a web developer at Marvelous Digital** (agency, Vevey) and takes on
**freelance work on the side** — directly for clients, and as the developer for **macmac**
(branding/interiors studio, Marly FR). The site says this
openly: agency experience is a credibility point, not something hidden. The pitch is
"agency standards, one person to talk to". Claims:

- **Direct, accountable delivery on freelance work** — the client talks to the person writing
  the code.
- **Native bilingual EN/FR delivery** — genuinely bilingual work and communication, not a
  machine-translated afterthought.
- **Performance & SEO as the core promise** — fast, findable sites are the baseline the site
  itself is built to demonstrate.

AI integration is offered as a service capability but is not a lead differentiator.

## Operating Context

- Fully **bilingual site (EN/FR)**: both `/en/` and `/fr/` trees are first-class and every
  visitor-facing string exists in both locales, kept in sync.
- Based in **Switzerland**; employer Marvelous Digital is in Vevey. Canonical domain
  `thomasmiller.ch`.
- Conversion path is a **contact form (Web3Forms)** with direct fallbacks (email, GitHub,
  LinkedIn) for visitors who prefer to reach out themselves.
- Availability is signalled on the site ("open to a few freelance projects"), limited because
  freelance is a side activity; a state that changes over time, not a permanent claim.

## Capabilities and Constraints

Services presented to clients:

- Full-stack web development (frontend + backend, end to end)
- Frontend craft & polish (UI, motion, performance)
- E-commerce & CRM (stores, integrations, business systems)
- AI integration (chat, automation, smart features)
- SEO & performance
- Supporting capabilities: API & integrations (e.g. Stripe, shipping, third-party services),
  web apps & dashboards, automation, maintenance & support (retainers), technical audits.

Durable constraints:

- **EN/FR parity is non-negotiable** — no visitor-facing surface ships in one language only.
- **No per-project detail pages** by design; projects are summarized on `/work`, with a
  featured subset on the homepage. An **NDA framing** exists for work whose client/scope cannot
  be disclosed.
- Static, no server runtime — the delivery model is a prerendered site.

## Brand Commitments

- Real identity: **Thomas Miller**, web developer at Marvelous Digital and freelancer,
  Switzerland; domain `thomasmiller.ch`; GitHub `Meuss`.
- **Bilingual EN/FR** is a binding identity constraint, not just a feature.
- Voice observed in existing copy: calm, precise, technical, plain-spoken — no hype or
  buzzword inflation. Future copy should preserve this register.

## Evidence on Hand

Real project entries live in `src/content/projects/`, each tagged with a `context`:
`independent` (direct freelance), `macmac` (built for the macmac studio) or `marvelous`
(team work at Marvelous Digital). Imagery is **real screenshots of the live sites**, captured
2026-10. One NDA entry covers unnamed international Marvelous clients.

- **No role / credit split.** Thomas did the development on essentially all of these; the site
  does not mention who designed what. Partner context is shown with the macmac / Marvelous logos.
- Tech stacks list only what was verified from the live sites' HTML/headers or the repo README.
- Citron Caviar is not yet launched (`status: soon`, no link).
- The About page uses Thomas's **real photo** (`src/assets/portrait.jpg`). There are **no
  testimonials, client logos, metrics or benchmarks**. Never fabricate them; never generate a
  portrait of Thomas.

## Product Principles

1. **Never manufacture proof.** Real clients, metrics, and testimonials go in only when Thomas
   provides them. Say honestly where work came from (freelance, macmac, Marvelous).
2. **Bilingual parity always.** Every visitor-facing string ships in EN and FR together.
3. **The site is the portfolio.** Performance, findability, and craft are promises, so the site
   must itself exemplify them.
4. **One accountable maker.** The experience should read as one person, open about working
   within an agency and with a studio partner, never as a faceless agency.
5. **Serve the Swiss SME decision-maker.** Lead with credibility and clarity over jargon, and
   make starting a project the obvious next step.

## Accessibility & Inclusion

No formal standard was mandated by the user, but the incumbent build already treats accessibility
as a capability to preserve: `prefers-reduced-motion` is honored (decorative motion is optional),
there is a skip-to-content link, `hreflang` alternates are emitted for both locales, and the color
tokens target AA contrast. Future work should keep this floor rather than regress it.
