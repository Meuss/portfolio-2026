---
name: Thomas Miller — Portfolio 2026
description: The developer as watchmaker — a Swiss movement seen from the back.
colors:
  paper: '#16181b'
  ink: '#ece9e1'
  muted: '#9d9b91'
  line: '#32343b'
  surface: '#202226'
  plate: '#2b2e33'
  accent: '#dd4753'
  accent-soft: '#2c1e21'
  accent-ink: '#fff5f4'
  gilt: '#c6a15b'
  blued: '#4f6db0'
typography:
  display:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(3rem, 0.6rem + 10.5vw, 9rem)'
    fontWeight: 700
    lineHeight: 0.9
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
    backgroundColor: '{colors.gilt}'
    textColor: '{colors.paper}'
  button-secondary:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.small}'
    rounded: '{rounded.sm}'
    padding: '0.875rem 1.75rem'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    padding: '2rem'
  input:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '0.75rem 1rem'
---

# Design System: Thomas Miller — Portfolio 2026

## Overview

**Creative North Star: "The Movement"**

A Swiss watch movement seen from the back — the developer as watchmaker, a maker
of precise working mechanisms. The world is committed dark (`color-scheme: dark`):
a graphite ground with brushed-metal raised surfaces, blued-steel screw detail,
gilt engraving for labels and the primary action, and exactly one ruby jewel as
the single bold colour. It deliberately refuses two defaults: the generic
Swiss-Helvetica-grid it replaced, and the dark-mode-neon-startup look (there are
no glows, no saturated gradients, no candy accents).

The register is calm, precise, and instrument-like. Type is confident and tight
(Schibsted Grotesk at 700 for the name and headlines), while all machine data —
availability, roles, tech tags, section labels — speaks in DM Mono, as if
engraved onto a caliber. Depth comes from tonal layering (surface plates lifted a
step off the ground and framed by hairline rules), not from drop shadows. The one
place the material becomes literal is the hero's slowly-rotating brushed movement
plate with its set ruby jewel.

Density is generous and editorial: a single centered 6xl column, wide vertical
rhythm between sections, and hairline dividers doing the structural work. Nothing
shouts; the ruby's scarcity is what makes it register.

**Key Characteristics:**

- Graphite dark world, committed (`color-scheme: dark`), warm off-white ink.
- One ruby accent, used only as a jewel — never as a fill.
- Gilt for engraved labels and the primary button; blued steel for screw detail.
- Two voices: Schibsted Grotesk (display/body) + DM Mono (all data/labels).
- Depth by tonal plates + hairlines, not shadows.
- Sharp-by-default corners (2/5/10px), motion fully opt-out.

## Colors

A graphite ground carrying warm metal, with a single ruby jewel and gilt
engraving as the only chromatic events.

### Primary

- **Ruby Jewel** (`accent`, #dd4753): The one bold colour. Used as a jewel only —
  small set-stone markers, the "available" pulse dot, inline link text, focus
  rings, the hero plate's set stone, the tech-tag/NDA accent. Never a full-bleed
  fill. Its companions: **Deep Ruby Wash** (`accent-soft`, #2c1e21) backs the NDA
  badge; **Ruby Foreground** (`accent-ink`, #fff5f4) is the warm-white text on
  ruby surfaces.

### Secondary

- **Gilt Brass** (`gilt`, #c6a15b): Engraved-label voice and the primary action.
  Colours mono section labels (approach, capabilities, hero calibre line), the
  primary button fill, hover/border shifts on interactive plates, and `::selection`.
- **Blued Steel** (`blued`, #4f6db0): Screw-detail tone. Lives inside the hero
  movement plate's slotted screws; a decorative material colour, not a UI accent.

### Neutral

- **Graphite Ground** (`paper`, #16181b): Page background; also input fill and the
  dark text on gilt/gold surfaces.
- **Warm Off-White Ink** (`ink`, #ece9e1): Primary text (~13:1 on ground).
- **Muted Sand** (`muted`, #9d9b91): Secondary text, meta, placeholders (~6:1).
- **Raised Plate** (`surface`, #202226): Cards, panels, footer — one tonal step
  lifted off the ground.
- **Brushed Plate** (`plate`, #2b2e33): Brushed movement-plate tone (material
  reference for plate gradients).
- **Hairline** (`line`, #32343b): All borders, rules, and dividers.

### Named Rules

**The One Jewel Rule.** Ruby appears only as a jewel — markers, links, focus
rings, the set stone — never as a full-bleed fill or a wall. The closing CTA is a
graphite plate with a gilt button, not a ruby band; if ruby ever covers a whole
surface, the rule is broken.

**The Engraving Rule.** Gilt is reserved for two jobs: engraved mono labels and
the single primary action. It is never body text and never a large fill.

## Typography

**Display / Body Font:** Schibsted Grotesk Variable (with system-ui fallback)
**Data / Label Font:** DM Mono (with ui-monospace fallback)

**Character:** A precise modern grotesque paired with a mechanical monospace — the
watchmaker's confident engraving over the caliber's stamped data. Headings run
tight and mixed-case; all instrument data runs uppercase mono with wide tracking.
Self-hosted via Fontsource; `font-synthesis: none`, kern/liga/calt on.

### Hierarchy

- **Display** (700, `clamp(3rem, 9rem)`, lh 0.9, -0.04em): Reserved for the
  largest statements. The hero name is a scoped sibling at `clamp(3rem, 6rem)` /
  lh 0.94.
- **Headline** (700, `clamp(2.25rem, 4.5rem)`, lh 1.02, -0.03em): Page and
  section H1/H2 (services, work, approach, contact, CTA).
- **Title** (600, `clamp(1.5rem, 2.25rem)`, lh 1.12, -0.02em): Card and feature
  headings, footer tagline. (Bare `h1–h6` default to weight 600 / -0.02em.)
- **Lead** (400, `clamp(1.15rem, 1.5rem)`, lh 1.5): Intro and standfirst
  paragraphs under headings.
- **Body** (400, `clamp(1rem, 1.0625rem)`, lh 1.6): Default running text.
- **Small** (500 mono, 0.875rem): Button labels, capability titles.
- **Caption** (400 mono, 0.78rem, 0.08em, UPPERCASE): The engraved-data voice —
  calibre line, section labels, roles, tech tags, form labels.

### Named Rules

**The Two-Voice Rule.** Prose and headings are Schibsted Grotesk; anything that
reads as machine data — labels, roles, tags, availability, buttons — is DM Mono,
uppercase, tracked. A voice never crosses into the other's job.

## Layout

A single centered column: `max-w-6xl` (72rem) with `px-6` gutters, opening to
`px-10` at `md`. Sections carry generous vertical rhythm — `py-20` rising to
`py-28`/`py-32` (hero up to `py-40`) — and are separated by a full-width
`border-line` hairline rather than by background changes. Two-column editorial
splits appear on interior pages via `md:grid-cols-2` or ratio grids
(`[1fr_1.15fr]`, `[minmax(0,16rem)_1fr]`), often with a `md:sticky` header beside
a scrolling list. Card grids step 1 → 2 → 3 (`sm:grid-cols-2 lg:grid-cols-3`).
Spacing follows the default Tailwind 4px scale; there are no custom spacing
tokens. Breakpoints are Tailwind defaults (`sm` 640, `md` 768, `lg` 1024).

## Elevation & Depth

No drop shadows in the UI. Depth is **tonal layering**: the graphite ground
(#16181b) sits under raised plates (`surface` #202226), and every plate is drawn
with a 1px `line` hairline rather than a cast shadow. State is a border-colour
shift, not a lift. The only `box-shadow` in the system is _inset_, used inside the
hero movement plate to sculpt the brushed metal, the guilloché ring, the set
jewel, and the screws — material modeling, not elevation.

### Named Rules

**The Hairline Rule.** Surfaces are separated by a 1px `line` border, never by a
shadow. Depth is one tonal step (`paper` → `surface`) plus a hairline. Reserve
real shadows for literal three-dimensional metal (the movement plate) only.

## Shapes

Sharp by default with small, deliberate softening. Radii are restrained:
**2px** (`sm`) on buttons, tags, and small chips; **5px** (`md`) on cards, panels,
and inputs; **10px** (`lg`) on the largest containers (the contact form panel).
Borders are always the single `line` hairline. Recurring geometry: the rotated
gilt square ("regulator" diamond), the small round set-stone jewel, and the
circular movement plate — the world's silhouettes are the screw, the jewel, and
the plate.

## Components

### Buttons

- **Shape:** Sharp (2px radius, `sm`). Mono, uppercase, tracked; `text-small`
  weight 500.
- **Primary:** Gilt fill (#c6a15b) with graphite text (#16181b), padding
  ~`0.875rem 1.75rem`. Used for the single lead action (hero, contact submit) and,
  via `.cta-band a`, the closing CTA button.
- **Secondary:** Ghost — transparent on ground with a `line` border and ink text;
  hover shifts border and text to gilt.
- **Hover / Focus:** `translateY(-2px)` lift over 200ms; no colour change on the
  primary. Focus is the global `:focus-visible` ruby outline.
- **Disabled:** `opacity: 0.6`, pointer-events off (contact submit while sending).

### Cards / Containers

- **Corner Style:** 5px (`md`); the contact form panel uses 10px (`lg`).
- **Background:** Raised plate (`surface` #202226) on the graphite ground.
- **Shadow Strategy:** None — hairline border only (see Elevation).
- **Border:** 1px `line`; hover shifts to `accent` (project cards) or `gilt`
  (service blocks). The feature "main plate" block carries a top gilt hairline
  (`bg-gilt/70`).
- **Internal Padding:** `p-6` → `p-8`/`p-12` on larger plates.
- **Note:** Project-card images and the portrait are PLACEHOLDERS; the card frame
  is real, its content is not yet.

### Inputs / Fields

- **Style:** Graphite fill (`paper`), 1px `line` border, 5px radius, `body` text,
  `muted` placeholders. Label above in uppercase mono caption.
- **Focus:** 2px `accent` outline, 2px offset (`focus-visible`). No glow.
- **Status:** Inline `aria-live` status paragraph, success text turns ruby.

### Navigation

- **Header:** Sticky, `bg-paper/95` with `backdrop-blur`, hairline bottom border.
  Wordmark in Schibsted Grotesk semibold with a small ruby square mark; nav links
  are `body` ink, hover → ruby, `aria-current="page"` on the active route.
- **Mobile:** Hairline-bordered toggle button (three ink hairlines), panel toggled
  with `hidden`, Escape-to-close; fully labelled.

### Signature: The Movement Plate (hero)

A large brushed circular plate behind the hero, built entirely in CSS: layered
`repeating-conic-gradient` + `radial-gradient` for the brushed metal and
guilloché, four blued slotted screws, and a set ruby jewel with a specular
highlight and bezel. It rotates 360° over 120s (`movement-rotate`, linear,
infinite) and is disabled under reduced-motion. A graphite `hero-veil` gradient
fades across the text side to hold contrast. Decorative and `aria-hidden`.

## Do's and Don'ts

### Do:

- **Do** keep ruby as a jewel — small markers, links, focus rings, the set stone.
- **Do** use gilt only for engraved mono labels and the one primary action.
- **Do** separate surfaces with the `line` hairline and one tonal step, not shadow.
- **Do** put all machine data (roles, tags, labels, availability, buttons) in DM
  Mono, uppercase, `0.08em` tracked.
- **Do** center content in a `max-w-6xl` column with `px-6`/`px-10` gutters and
  `py-20`+ section rhythm.
- **Do** keep motion opt-out: gate decorative animation behind
  `prefers-reduced-motion: no-preference` and reveal-on-scroll behind `html.js`.
- **Do** ship every visitor-facing string in both EN and FR (binding product
  constraint).

### Don't:

- **Don't** fill a surface with ruby or build a ruby "wall" — the closing CTA is a
  graphite plate, not a ruby band.
- **Don't** add drop shadows for elevation; reserve inset shadows for literal metal.
- **Don't** introduce neon glows, saturated gradients, or a second accent colour.
- **Don't** set body or heading text in gilt, or run prose in the mono voice.
- **Don't** present the placeholder project images, portrait, or bios as real work.
- **Don't** add a second display typeface or a system font — the pairing is fixed.
