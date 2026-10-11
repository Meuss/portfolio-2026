---
name: Thomas Miller — Portfolio 2026
description: Graphite & Gilt — a dark, precise working surface where the shipped work is the hero.
colors:
  paper: '#16181b'
  ink: '#ece9e1'
  muted: '#9d9b91'
  line: '#32343b'
  surface: '#202226'
  accent: '#dd4753'
  accent-ink: '#fff5f4'
  gilt: '#c6a15b'
typography:
  display:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(3.25rem, 1.2rem + 7vw, 6rem)'
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.25rem, 1.3rem + 4.2vw, 4.5rem)'
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: '-0.03em'
  title:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.5rem, 1.15rem + 1.6vw, 2.25rem)'
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: '-0.02em'
  lead:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.15rem, 1.02rem + 0.62vw, 1.5rem)'
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)'
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: '0.06em'
  caption:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: '0.78rem'
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: '0.08em'
rounded:
  sm: '2px'
  md: '5px'
  lg: '10px'
components:
  button-primary:
    backgroundColor: '{colors.gilt}'
    textColor: '{colors.paper}'
    typography: '{typography.small}'
    rounded: '{rounded.sm}'
    padding: '0.875rem 1.75rem'
  button-primary-hover:
    backgroundColor: '#d4b273'
    textColor: '{colors.paper}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.small}'
    rounded: '{rounded.sm}'
    padding: '0.875rem 1.75rem'
  button-secondary-hover:
    textColor: '{colors.gilt}'
  chip-filter:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.sm}'
    padding: '0.5rem 0.8rem'
  chip-filter-selected:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
  chip-capability:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.sm}'
    padding: '0.375rem 0.75rem'
  project-frame:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.md}'
  project-frame-phone:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.lg}'
    width: '22%'
  input:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '0.75rem 1rem'
  form-panel:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.lg}'
    padding: '2rem'
---

# Design System: Thomas Miller — Portfolio 2026

## Overview

**Creative North Star: "Graphite & Gilt"**

A dark, precise working surface where the shipped work is the hero. The world is
committed dark (`color-scheme: dark`): a graphite ground, warm off-white ink,
gilt for labels and the one primary action, and a single ruby mark as the only
bold colour. The interface steps back so real screenshots of live client sites
carry the page: they drift in the hero's wall of work, and they sit in hairline
frames on every project card. Nothing on the surface is illustration; the
imagery is the evidence.

The register is calm, exact, and workmanlike. Headings are Schibsted Grotesk,
tight and confident at 600–700; every piece of data (stacks, context
tags, hostnames, form labels, button labels) speaks in uppercase DM Mono. Depth
is tonal: one step from ground to surface, drawn with 1px hairlines. The single
exception is physical overlap: a phone capture laid over the lower-right corner
of a desktop screenshot casts one soft shadow, because it really sits on top.

Density is generous and editorial: a centered 72rem column, wide vertical
rhythm, sections divided by full-width hairlines, lists divided by hairlines
instead of boxed into cards. The world refuses the dark-mode-neon-startup look
(no glows, no saturated gradients, no candy accents) and the generic
Swiss-Helvetica grid it replaced.

**Key Characteristics:**

- Graphite dark world, committed (`color-scheme: dark`), warm off-white ink.
- Real screenshots of shipped sites are the imagery; no placeholders, no illustration.
- One ruby accent, used as a single mark: never a fill, never a wall.
- Gilt for mono labels, the one primary action, and the selected/hover state.
- Two voices: Schibsted Grotesk (display/body) + DM Mono (all data/labels).
- Depth by tonal step + hairlines; one soft shadow, only for the overlapping phone capture.
- Sharp-by-default corners (2/5/10px); one signature motion (the wall), fully opt-out.

## Colors

A graphite ground with warm neutral text, gilt as the working accent, and a
single ruby mark as the only bold event.

### Primary

- **Ruby Mark** (`accent`): The one bold colour. Used only as small marks and
  thin signals: the hero's short accent rule, the availability dot, the
  Freelance context dot, the wordmark square, nav and footer link hover, inline
  link text, focus rings, the caret, the NDA marker. Its companion **Ruby
  Foreground** (`accent-ink`) is the warm-white text on the ruby skip-link.

### Secondary

- **Gilt** (`gilt`): The working accent. Mono labels (Approach terms, the
  capabilities heading), the primary button fill, project hostname links and
  "coming soon" lines, the hover and selected border of chips and secondary
  buttons, service-title hover, the wall's pause-control hover, the macmac
  context diamond, and `::selection`.

### Neutral

- **Graphite Ground** (`paper`): Page background, input fill, the phone-capture
  frame, and the dark text on gilt.
- **Warm Off-White Ink** (`ink`): Primary text (~13:1 on ground); also the
  Marvelous context ring.
- **Muted Sand** (`muted`): Secondary text, intros, captions, `dt` labels,
  placeholders (~6:1).
- **Graphite Surface** (`surface`): One tonal step up: screenshot frames, the
  contact form panel, the selected filter chip.
- **Hairline** (`line`): Every border, rule, divider, and the `/` separator in
  card meta lines.

### Named Rules

**The Single Mark Rule.** Ruby appears only as a mark: a dot, a short rule, a
link, a focus ring. It never fills a surface. The closing CTA is a graphite
panel with a gilt button, not a ruby band; if ruby covers an area larger than a
dot or a line, the rule is broken.

**The Gilt Job Rule.** Gilt has three jobs: mono labels, the single primary
action, and interactive state (hover/selected borders, hostname links). It is
never body text, never a heading, never a large fill.

**The Context Mark Rule.** How a project came about is shown by who it was
with, never a colour wash: Freelance is a 0.4rem ruby dot plus the word;
macmac and Marvelous Digital appear as their own wordmarks, monochrome in
`currentColor` (`ContextBadge.astro`, SVGs in `src/components/icons/`), with
the name as screen-reader text. Sizes: 0.62rem (macmac) / 0.92rem (Marvelous)
in caption lines and chips, ~1.4/1.9rem on the About page. Never recolour or
restyle the partner wordmarks.

## Typography

**Display / Body Font:** Schibsted Grotesk Variable (with system-ui fallback)
**Label / Mono Font:** DM Mono 400/500 (with ui-monospace fallback)

**Character:** A precise modern grotesque over a plain working monospace.
Headings run tight and mixed-case; all data runs uppercase mono with wide
tracking. Self-hosted via Fontsource; `font-synthesis: none`, kern/liga/calt on,
headings `text-wrap: balance`, paragraphs `text-wrap: pretty`.

### Hierarchy

- **Display** (700, `clamp(3.25rem → 6rem)`, lh 0.92, -0.04em): The hero name
  only.
- **Headline** (700, `clamp(2.25rem → 4.5rem)`, lh 1.02, -0.03em): Page and
  section H1/H2, the CTA heading.
- **Title** (600, `clamp(1.5rem → 2.25rem)`, lh 1.12, -0.02em): Project card
  titles, service rows, About "ways" rows, contact sub-heading.
- **Lead** (400, `clamp(1.15rem → 1.5rem)`, lh 1.5): Intros under headings,
  hero tagline, Approach statements.
- **Body** (400, `clamp(1rem → 1.0625rem)`, lh 1.6): Running text, card
  descriptions (`max-w-[60ch]`), nav links.
- **Small** (500 mono, 0.875rem, 0.06em, UPPERCASE): Button labels.
- **Caption** (400 mono, 0.78rem, 0.08em, UPPERCASE): The data voice — context
  tags and kind lines, stack lines, hostnames, chips, screenshot
  captions, form labels, availability line, language switcher.

### Named Rules

**The Two-Voice Rule.** Prose and headings are Schibsted Grotesk; anything that
reads as data (labels, stacks, tags, hostnames, buttons) is DM Mono,
uppercase, tracked. A voice never crosses into the other's job.

**The No-Eyebrow Rule.** Headings stand alone. No mono kicker or label sits
above a section heading; mono labels only name data next to it (a `dt` beside
its `dd`, a context tag above a card title that it describes).

## Layout

A single centered column: `max-w-6xl` (72rem) with 1.5rem gutters opening to
2.5rem at `md`. Sections carry generous vertical rhythm (5rem rising to 7rem;
the CTA to 8rem) and are separated by a full-width hairline bottom border, not
by background changes. Interior sections pair a heading column with content:
ratio grids such as `minmax(0,20rem) 1fr` (services) or two equal columns
(approach), with the heading column `sticky` at `top: 7rem` on wide screens.
The hero is a `1.1fr / 1fr` split at `lg` (intro left, wall right), stacking
below 1024px with the wall becoming a full-bleed horizontal strip.

Project lists are equal cards with very open gaps: three columns for the
homepage selection, two columns on `/work` (2rem columns, 4rem rows).
Service, approach, and About lists are hairline-divided rows, never boxes.
Spacing uses the Tailwind 4px scale; no custom spacing tokens. Breakpoints are
Tailwind defaults (`sm` 640, `md` 768, `lg` 1024).

## Elevation & Depth

Flat by default, tonal by construction. The graphite ground sits under one
lifted step (`surface`), and every container is drawn with a 1px `line`
hairline rather than a cast shadow. State is a border-colour or text-colour
shift (to gilt), plus a 2px lift on buttons. The system has exactly one shadow:
the soft drop under the phone capture where it physically overlaps the desktop
screenshot. Depth elsewhere comes from the wall's masked fade, which dissolves
screenshots into the ground at the top and bottom (left and right on mobile).

### Shadow Vocabulary

- **Overlap** (`box-shadow: 0 18px 40px -12px rgb(0 0 0 / 0.7)`): Only on the
  phone capture laid over a desktop screenshot. It describes a real layer, not
  elevation for emphasis.

### Named Rules

**The Hairline Rule.** Surfaces are separated by a 1px `line` border and one
tonal step, never by a shadow. The only shadow marks a literal physical overlap
of one capture over another.

## Shapes

Sharp by default with small, deliberate softening: **2px** (`sm`) on buttons,
chips, the nav toggle, and focus rings; **5px** (`md`) on screenshot frames and
inputs; **10px** (`lg`) on the phone capture and the contact form panel.
Borders are always the single `line` hairline. Screenshots crop to fixed
aspect ratios (16:10 desktop, 390:844 phone), anchored to the top of the page.
The recurring small geometry is the 0.4rem freelance dot and the 0.5rem ruby
availability dot; partner context uses the partners' wordmarks. Icons are inline SVG, 1.5px square-capped
strokes sized to the text (`0.95em`): a right arrow for internal actions and an
up-right arrow for external links.

## Components

### Buttons

Mono, uppercase, sharp, and few: one gilt primary per view.

- **Shape:** 2px radius; DM Mono 500 at 0.875rem, 0.06em tracking, padding
  `0.875rem 1.75rem`, an SVG arrow trailing with a 0.65rem gap.
- **Primary:** Gilt fill, graphite text. Hero "start a project", the closing
  CTA, contact submit.
- **Hover / Focus:** Primary lightens to a paler gilt (#d4b273) and lifts 2px
  over 200ms (`cubic-bezier(0.22, 1, 0.36, 1)`); the arrow nudges 2px right.
  Focus is the global 2px ruby outline, 2px offset.
- **Secondary:** Transparent with a `line` hairline and ink text; hover shifts
  border and text to gilt. Used for "view work" / "view all".
- **Disabled:** `opacity: 0.6`, pointer-events off (contact submit while sending).

### Chips

- **Filter chips (/work):** Transparent, `line` hairline, 2px radius, caption
  mono in ink, padding `0.5rem 0.8rem`; each carries its context mark and a
  muted count. Hover shifts the border to gilt; the selected chip
  (`aria-pressed="true"`) fills with `surface` and keeps the gilt border.
- **Capability chips (services):** Static, `line` hairline, 2px radius, caption
  mono in ink; the full blurb lives in `title`.

### Project Card

The shipped site is the card. There is no card box: an open composition of
frame and text.

- **Frame:** The real desktop screenshot in a 5px, hairline-bordered `surface`
  frame (16:10); on hover the image scales to 1.02 over 700ms. When a phone
  capture exists it overlaps the lower-right corner (22% wide, 10px radius,
  `paper` backing, 1.25rem below the frame) with the Overlap shadow. NDA work
  shows a blank frame with a faint diagonal hatch and a mono caption.
- **Meta line:** Context badge (ruby dot + "Freelance", or the macmac /
  Marvelous wordmark) in ink, a `line`-coloured `/`,
  then the kind in muted caption mono.
- **Title:** Title, ink; the whole article is the hover
  target and draws a 1px underline left-to-right over 400ms.
- **Description:** Muted body, max 60ch.
- **Stack:** One muted caption-mono line, joined with `·` (no role line — the
  site does not split credit between design and development).
- **Link line:** The hostname in gilt caption mono with an up-right SVG arrow
  that shifts 2px diagonally on hover; "coming soon" in gilt; NDA as a small
  ruby dot plus label.

### Inputs / Fields

- **Style:** Graphite fill (`paper`), 1px `line` border, 5px radius, body text,
  muted placeholders; uppercase caption-mono label above in muted. Fields sit
  on a 10px `surface` panel with hairline border.
- **Focus:** 2px ruby outline, 2px offset. No glow. Caret is ruby.
- **Status:** Inline `aria-live` status paragraph below the submit.

### Navigation

- **Header:** Sticky, 95% graphite with backdrop blur, hairline bottom border.
  Wordmark in Schibsted Grotesk semibold beside a small 2px-radius ruby square;
  nav links in body ink, hover to ruby, `aria-current="page"` on the active
  route; the EN/FR switcher in caption mono.
- **Mobile:** A 2.5rem hairline-bordered toggle with three ink hairlines opens
  a stacked panel; labelled, Escape closes and returns focus.

### Service List

Five services as hairline-divided rows (no cards): title in Title weight on the
left, muted blurb on the right from `sm`; the title turns gilt on row hover.
Capability chips follow under a gilt caption-mono heading.

### Signature: The Wall of Work (hero)

The one signature motion. Up to ten real desktop screenshots of shipped sites
(NDA work excluded) in two columns that drift vertically in opposite
directions: up over 70s, down over 80s, linear and seamless (each track is
rendered twice). The second column is offset 9rem up so rows never align. Each
shot is a 5px hairline `surface` frame with a caption-mono title bar. A mask
fades the column ends into the ground (transparent → solid at 14% / 86%).

Below 1024px it becomes one full-bleed horizontal strip drifting left over 60s,
masked at 8% / 92%. Animation runs only under
`prefers-reduced-motion: no-preference`; it pauses on hover, when the wall is
off-screen (IntersectionObserver), and via a mono "pause / play" text button
(`aria-pressed`, hover gilt) that appears only when motion is on. Under reduced
motion the wall is a static grid. The wall is decorative (`aria-hidden`); the
same work is reachable through the project list.

## Do's and Don'ts

### Do:

- **Do** let real screenshots of shipped sites be the imagery; crop them to
  16:10 (desktop) or 390:844 (phone), top-anchored, inside a hairline frame.
- **Do** keep ruby as a single mark: dots, a short rule, links, focus rings.
- **Do** use gilt for mono labels, the one primary action, and hover/selected state.
- **Do** show project context with the ContextBadge (freelance dot or partner wordmark) wherever context appears.
- **Do** separate surfaces with the `line` hairline and one tonal step; divide
  lists with hairlines instead of boxing them into cards.
- **Do** put all data (stacks, tags, hostnames, labels, buttons) in DM
  Mono, uppercase, tracked.
- **Do** draw icons as inline SVG strokes (1.5px, square caps) sized in `em`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`,
  give continuous motion a pause control, and stop it when off-screen.
- **Do** ship every visitor-facing string in both EN and FR (binding product
  constraint).

### Don't:

- **Don't** fill a surface with ruby or build a ruby band; the closing CTA is a
  graphite panel with a gilt button.
- **Don't** add drop shadows for elevation; the only shadow is the phone
  capture's physical overlap.
- **Don't** use placeholder imagery or stock illustration in place of real work.
  The only portrait is Thomas's real photo (`src/assets/portrait.jpg`, About page).
- **Don't** put a mono eyebrow or kicker above a heading.
- **Don't** use unicode glyph arrows (→ ↗) or emoji as icons.
- **Don't** introduce neon glows, saturated gradients, or a second bold accent.
- **Don't** set body or heading text in gilt, or run prose in the mono voice.
- **Don't** add a second continuous animation; the wall of work is the one
  signature motion.
- **Don't** add a second display typeface or a system font; the pairing is fixed.
