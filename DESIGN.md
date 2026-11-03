---
name: Thomas Miller — Portfolio 2026
description: Kit Black & Orange — a dark, precise working surface where the shipped work is the hero.
colors:
  paper: '#121212'
  surface: '#1b1b1a'
  surface-2: '#242423'
  line: '#333331'
  ink: '#f3f2ee'
  muted: '#a3a39e'
  faint: '#82817a'
  accent: '#ff6a13'
  accent-hover: '#ff8a47'
  accent-ink: '#121212'
  error: '#ff6b78'
  success: '#4fd18f'
typography:
  display:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.75rem, 1.4rem + 5.6vw, 6rem)'
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2rem, 1.3rem + 3vw, 3.75rem)'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.35rem, 1.1rem + 1vw, 1.875rem)'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '-0.025em'
  lead:
    fontFamily: 'Instrument Sans Variable, Instrument Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.125rem, 1.02rem + 0.5vw, 1.375rem)'
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: 'Instrument Sans Variable, Instrument Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)'
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: 'Instrument Sans Variable, Instrument Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: '0.8rem'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '0.12em'
  caption:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: '0.78rem'
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: '0.12em'
rounded:
  sm: '2px'
  md: '4px'
  lg: '8px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-ink}'
    typography: '{typography.button}'
    rounded: '{rounded.sm}'
    padding: '0.9375rem 1.375rem'
  button-primary-hover:
    backgroundColor: '{colors.accent-hover}'
    textColor: '{colors.accent-ink}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    rounded: '{rounded.sm}'
    padding: '0.9375rem 1.375rem'
  button-secondary-hover:
    textColor: '{colors.ink}'
  chip-filter:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.sm}'
    padding: '0.5rem 0.8rem'
  chip-filter-selected:
    backgroundColor: '{colors.surface-2}'
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

**Creative North Star: "Kit Black & Orange"**

A dark, precise working surface where the shipped work is the hero, dressed in
the brand kit's colours. The world is dark only (`color-scheme: dark`): the kit's
black ground, warm off-white ink, neutral labels, and the kit's orange as the
only colour, with a job every time it appears. The interface steps back so real
screenshots of live client sites carry the page: they are dealt as a 3D deck in
the hero, and they sit in hairline frames on every project card. Nothing on the
surface is illustration; the imagery is the evidence, and the screenshots bring
the colour the interface withholds.

The register is calm, exact, and workmanlike. Headings are Schibsted Grotesk,
tight and heavy at 700–800; running text is Instrument Sans; every piece of data
(stacks, context tags, hostnames, form labels, button labels) speaks in uppercase
DM Mono. Depth is tonal: ground to surface to second surface, one step at a time,
drawn with 1px hairlines and no glow. The exception is physical layering: a phone
capture laid over a desktop screenshot, screenshots stacked in the hero deck, and
the portrait badge hanging on its strap each cast a soft shadow, because they
really sit on top of something.

Density is generous and editorial: a centered 72rem column, wide vertical
rhythm, sections divided by full-width hairlines, lists divided by hairlines
instead of boxed into cards. Effects stay alive against that restraint as a
stated exception: a field of neutral mono glyphs with a trace of orange flowing
behind the hero, a name that decodes itself under an orange caret, screenshots
dealt and re-shuffled as a deck, a crosshair that measures the contact page. Each
page gets its own effects rather than one global trick. Effects are welcome and
meant to show craft, but they are opt-out and always drawn from the palette. The
world still refuses rainbow neon, candy accents, and the generic Swiss-Helvetica
grid it replaced.

**Key Characteristics:**

- Kit black, dark only (`color-scheme: dark`), warm off-white ink.
- Real screenshots of shipped sites are the imagery; no placeholders, no illustration.
- One colour, the kit's orange, with a named list of jobs: never a section background, never under white text, never body text.
- Neutral labels: mono labels are muted, and status has its own green and red.
- Three voices: Schibsted Grotesk (headings), Instrument Sans (running text), DM Mono (all data/labels).
- Depth by tonal step + hairlines; no glows or coloured shadows on the interface; soft shadows only where something physically sits on something else.
- Sharp-by-default corners (2/4/8px).
- Expressive light and motion (shaders, glyph fields, type reveals, 3D decks) as an opt-out, palette-tinted exception, chosen per page.

## Colors

The kit's black ground with warm neutral text and one orange, plus two small
status colours that only ever report a state.

### Primary

- **Kit Orange** (`accent`): The only colour, used for its named jobs: the logo
  ring, the main button, link underlines and link text on hover, focus rings,
  selection and the input caret, the "live" project hostname line, and at most
  one emphasised word in a headline (allowed; none ships today). The skip link
  shares the main button's orange fill with black text.
- **Lit Orange** (`accent-hover`): The hover state of orange fills.
- **Black on Orange** (`accent-ink`): Text on orange, including `::selection`
  (~6.5:1). Always black, never white.

### Tertiary

- **Status Green** (`success`): The availability dot and the "message sent"
  status. Nothing else.
- **Status Red** (`error`): Form errors. Nothing else.

### Neutral

- **Kit Black** (`paper`): Page background, input fill, the phone-capture frame.
- **Surface** (`surface`): One tonal step up: screenshot frames, the contact form
  panel, the closing CTA band, the footer.
- **Second Surface** (`surface-2`): Two steps up: the selected filter chip.
- **Warm Off-White Ink** (`ink`): Headings and body text (~16.7:1 on ground);
  hover border of secondary buttons, the selected chip's border, the hero's short
  rule, the wall's pause-control hover.
- **Muted Grey** (`muted`): Secondary text, intros, captions, and all mono labels:
  Approach terms, the capabilities heading, "coming soon", NDA (~7.4:1). Also the
  filter chips' hover border.
- **Faint Grey** (`faint`): Placeholders and disabled text only (~4.8:1 on ground).
- **Hairline** (`line`): Every border, rule, divider, and the `/` separator in
  card meta lines.

### Named Rules

**The Orange Job Rule.** Orange appears only for a job: the logo ring, the main
button (one per screen, black text), link underlines and link text on hover,
focus rings and selection, one emphasised word in a headline at most, the "live"
hostname line. It is never a section background, never under white text, never
body text, never beside error red as a second accent, and never decoration with
no job. If you cannot name the job, use a neutral.

**The Neutral Label Rule.** Mono labels are muted, not coloured. A hostname line is
the one label that is orange, because orange there means the site is live: "coming
soon" and NDA lines stay muted, so the colour carries information.

**The Context Mark Rule.** How a project came about is shown by who it was
with, never a colour wash: Freelance is a 0.4rem `currentColor` dot plus the word;
macmac and Marvelous Digital appear as their own wordmarks, monochrome in
`currentColor` (`ContextBadge.astro`, SVGs in `src/components/icons/`), with
the name as screen-reader text. Sizes: 0.62rem (macmac) / 0.92rem (Marvelous)
in caption lines and chips, ~1.4/1.9rem on the About page. Never recolour or
restyle the partner wordmarks.

## Typography

**Heading Font:** Schibsted Grotesk Variable (with system-ui fallback)
**Body Font:** Instrument Sans Variable (with system-ui fallback)
**Label / Mono Font:** DM Mono 500 (with ui-monospace fallback)

**Character:** A heavy, precise modern grotesque over a plain sans and a working
monospace, all three from the brand kit. Headings run tight and mixed-case; all
data runs uppercase mono with wide tracking. Self-hosted via Fontsource;
`font-synthesis: none`, kern/liga/calt on, headings `text-wrap: balance`,
paragraphs `text-wrap: pretty`.

### Hierarchy

- **Display** (800, `clamp(2.75rem → 6rem)`, lh 0.92, -0.04em): The hero name and
  the 404's first line.
- **Headline** (800, `clamp(2rem → 3.75rem)`, lh 1, -0.035em): Page and section
  H1/H2, the CTA heading, the 404's second line.
- **Title** (700, `clamp(1.35rem → 1.875rem)`, lh 1.15, -0.025em): Project card
  titles, service rows, About "ways" rows, contact sub-heading.
- **Lead** (400, `clamp(1.125rem → 1.375rem)`, lh 1.5): Intros under headings,
  hero tagline, Approach statements.
- **Body** (400, `clamp(1rem → 1.0625rem)`, lh 1.6): Running text, card
  descriptions (`max-w-[60ch]`), nav links.
- **Small** (400, 0.875rem, lh 1.5): The footer's fine print.
- **Button** (500 mono, 0.8rem, lh 1, +0.12em, UPPERCASE): Button labels.
- **Caption** (500 mono, 0.78rem, lh 1.35, +0.12em, UPPERCASE): The data voice:
  context tags and kind lines, stack lines, hostnames, chips, screenshot captions,
  form labels, availability line, language switcher.

### Named Rules

**The Three-Voice Rule.** Headings are Schibsted Grotesk; prose is Instrument Sans;
anything that reads as data (labels, stacks, tags, hostnames, buttons) is DM Mono,
uppercase, tracked. A voice never crosses into another's job.

**The No-Eyebrow Rule.** Headings stand alone. No mono kicker or label sits
above a section heading; mono labels only name data next to it (a `dt` beside
its `dd`, a context tag above a card title that it describes).

## Layout

A single centered column: `max-w-6xl` (72rem) with 1.5rem gutters opening to
2.5rem at `md`. Sections carry generous vertical rhythm (5rem rising to 7rem;
the CTA to 8rem) and are separated by a full-width hairline bottom border; the
only background change is the closing CTA band, one flat step up. Interior
sections pair a heading column with content: ratio grids such as
`minmax(0,20rem) 1fr` (services) or two equal columns (approach), with the heading
column `sticky` at `top: 7rem` on wide screens. The hero is a `1.1fr / 1fr` split
at `lg` (intro left, wall right), stacking below 1024px with the wall becoming a
full-bleed horizontal strip.

Project lists are equal cards with very open gaps: three columns for the
homepage selection, two columns on `/work` (2rem columns, 4rem rows).
Service, approach, and About lists are hairline-divided rows, never boxes.
The 404 page is a single column filling the viewport under the header,
vertically centred: the fuzzy code and line, then one primary button.
Spacing uses the Tailwind 4px scale; no custom spacing tokens. Breakpoints are
Tailwind defaults (`sm` 640, `md` 768, `lg` 1024).

## Elevation & Depth

Flat by default, tonal by construction. The kit black ground sits under `surface`,
which sits under `surface-2`, one step at a time, and every container is drawn with
a 1px `line` hairline rather than a cast shadow. The interface itself has no glows
and no coloured shadows; the closing CTA band is flat `surface`. State is a
border-colour or text-colour shift, plus a 2px lift on the primary button. Shadows
exist only where one thing physically rests on another: the phone capture over its
desktop screenshot, each card of the hero deck over the one behind it, the portrait
badge hanging in front of the page. Depth elsewhere is spatial: the deck's real
3D perspective, a ground-coloured veil that darkens cards with distance, and the
mobile strip's masked fade into the ground. Effects' light (scan lines, the star
border's comet) is light, not elevation.

### Shadow Vocabulary

- **Overlap** (`box-shadow: 0 18px 40px -12px rgb(0 0 0 / 0.7)`): The phone
  capture laid over a desktop screenshot, and the hanging portrait badge. It
  describes a real layer, not elevation for emphasis.
- **Deck** (`box-shadow: 0 24px 50px -24px rgb(0 0 0 / 0.8)`): Each card of the
  hero deck, falling on the card behind it.

### Named Rules

**The Hairline Rule.** Surfaces are separated by a 1px `line` border and one
tonal step, never by a shadow. A shadow only ever marks a literal physical
overlap: something resting on, or hanging in front of, something else.

**The Screenshots Carry The Colour Rule.** The interface has no glows and no
coloured shadows. Colour and richness come from the screenshots; if a surface needs
more presence, give the work more room rather than the chrome more light.

**The Effects Exception Rule.** Effects keep expressive light and motion, including
glow, as a stated exception to the no-glow rule, because they are opt-out,
palette-tinted moments. The exception covers `src/components/islands/fx/` only;
static interface elements never inherit it.

## Shapes

Sharp by default with small, deliberate softening: **2px** (`sm`) on buttons,
chips, the nav toggle, and focus rings; **4px** (`md`) on screenshot frames and
inputs; **8px** (`lg`) on the phone capture and the contact form panel. The hero
deck's cards take their 10px corner from the `heroWall` effect's `radius` param,
outside this scale.
Borders are always the single `line` hairline. Screenshots crop to fixed
aspect ratios (16:10 desktop, 390:844 phone), anchored to the top of the page.
The recurring small geometry is the 0.4rem freelance dot and the 0.5rem green
availability dot; partner context uses the partners' wordmarks. Icons are inline SVG, 1.5px square-capped
strokes sized to the text (`0.95em`): a right arrow for internal actions and an
up-right arrow for external links.

## Components

### Buttons

Mono, uppercase, sharp, and few: one orange primary per screen, always black text.

- **Shape:** 2px radius; DM Mono 500 at 0.8rem, +0.12em tracking, padding
  `0.9375rem 1.375rem`, an SVG arrow trailing with a 0.65rem gap.
- **Primary:** Orange fill, black text. Hero "start a project", the closing
  CTA, contact submit, the 404's way home.
- **Hover / Focus:** Primary lightens to `accent-hover` and lifts 2px
  over 200ms (`cubic-bezier(0.22, 1, 0.36, 1)`); the arrow nudges 2px right.
  A comet of orange light orbits the button's edge while hovered or focused
  (the star border, one lap per 3.5s). Focus is the global 2px orange outline,
  2px offset.
- **Secondary:** Transparent with a `line` hairline and ink text; hover shifts
  the border to ink, with no fill, no lift and no orange. Used for "view work" /
  "view all".
- **Disabled:** `opacity: 0.6`, pointer-events off (contact submit while sending).

### Chips

- **Filter chips (/work):** Transparent, `line` hairline, 2px radius, caption
  mono in ink, padding `0.5rem 0.8rem`; each carries its context mark and a
  muted count. Hover shifts the border to muted; the selected chip
  (`aria-pressed="true"`) fills with `surface-2` and takes an ink border.
- **Capability chips (services):** Static, `line` hairline, 2px radius, caption
  mono in ink; the full blurb lives in `title`.

### Project Card

The shipped site is the card. There is no card box: an open composition of
frame and text.

- **Frame:** The real desktop screenshot in a 4px, hairline-bordered `surface`
  frame (16:10); on hover the image scales to 1.02 over 700ms. When a phone
  capture exists it overlaps the lower-right corner (22% wide, 8px radius,
  `paper` backing, 1.25rem below the frame) with the Overlap shadow. NDA work
  shows a blank frame with a faint diagonal hatch and a mono caption.
- **Meta line:** Context badge (`currentColor` dot + "Freelance", or the macmac /
  Marvelous wordmark) in ink, a `line`-coloured `/`,
  then the kind in muted caption mono.
- **Title:** Title, ink; the whole article is the hover
  target and draws a 1px underline left-to-right over 400ms.
- **Description:** Muted body, max 60ch.
- **Stack:** One muted caption-mono line, joined with `·` (no role line — the
  site does not split credit between design and development).
- **Motion:** On the homepage the featured screenshots refine into focus as
  they scroll in (coarse pixels → finer → soft blur → sharp, swept by an orange
  scan line, with a mono "PASS n/N" chip; a row entering together cascades
  ~150ms apart). On /work frames tilt in 3D toward
  the pointer with a soft glare, the phone capture lifting off its desktop
  screenshot.
- **Link line:** The hostname in orange caption mono, the live tag, with an
  up-right SVG arrow that shifts 2px diagonally on hover; "coming soon" in muted;
  NDA as a small `currentColor` dot plus label, also muted.

### Inputs / Fields

- **Style:** Kit black fill (`paper`), 1px `line` border, 4px radius, body text,
  faint placeholders; uppercase caption-mono label above in muted. Fields sit
  on an 8px `surface` panel with hairline border.
- **Focus:** 2px orange outline, 2px offset. No glow. Caret is orange.
- **Status:** Inline `aria-live` status paragraph below the submit, in `success`
  or `error`.

### Logo

The kit symbol, "Sommet qui perce": an orange ring, open at the top, with ink
peaks inside and the tall peak breaking out through the gap. It is drawn inline
(`Logo.astro`, geometry in `brand/README.md`) beside the name, which stays live
text in Schibsted Grotesk 800 at -0.04em; the shipped choice lives in
`src/data/brand.ts` and is tunable in the dev Brand panel. Four lockups:
`markName` (shipped, in the header), `markNameTagline`, `mark`, `name`. The footer
always shows symbol, name and the muted mono tagline. Never recolour the ring and
peaks, and leave clear space of at least half the symbol's height.

### Navigation

- **Header:** Sticky, 95% kit black with backdrop blur, hairline bottom border.
  The logo link does not change colour on hover; nav links in body ink, hover to
  orange, `aria-current="page"` on the active route; the EN/FR switcher in caption
  mono, muted, hover to orange.
- **Mobile:** A 2.5rem hairline-bordered toggle with three ink hairlines opens
  the menu; labelled, Escape closes and returns focus. Opening sweeps in a
  surface layer and an orange-edged paper layer, then the links rise in at display
  size, staggered, over a full-height paper overlay, the current link in orange; the
  hairlines fold into an X.

### Service List

Five services as hairline-divided rows (no cards): title in Title weight on the
left, muted blurb on the right from `sm`; rows have no hover colour.
Capability chips follow under a muted caption-mono heading.

### Signature: The Deck of Work (hero)

On desktop the hero's screenshots are dealt as a 3D deck: every real desktop
screenshot (NDA work excluded) in a hairline frame with a 10px radius, each
card 36px right, 30px up and 70px back from the one in front, skewed 1°, and
darkened by a ground-coloured veil that thickens toward the back. Every 3.25s the
front card drops below the deck, travels back, and slides into the last slot
behind the others while the rest step forward (slow, `speed` 0.6, no bounce).
The deck tilts toward the pointer, pauses on hover, and the front card can be
flung to the back by dragging. Below 1024px, and as the deck's fallback, the
original Wall of Work runs instead.

### The Wall of Work (hero, mobile and fallback)

The original signature motion. Up to ten real desktop screenshots of shipped sites
(NDA work excluded) in two columns that drift vertically in opposite
directions: up over 70s, down over 80s, linear and seamless (each track is
rendered twice). The second column is offset 9rem up so rows never align. Each
shot is a 4px hairline `surface` frame with a caption-mono title bar. A mask
fades the column ends into the ground (transparent → solid at 14% / 86%).

Below 1024px it becomes one full-bleed horizontal strip drifting left over 60s,
masked at 8% / 92%. Animation runs only under
`prefers-reduced-motion: no-preference`; it pauses on hover, when the wall is
off-screen (IntersectionObserver), and via a mono "pause / play" text button
(`aria-pressed`, hover ink) that appears only when motion is on. Under reduced
motion the wall is a static grid. The wall is decorative (`aria-hidden`); the
same work is reachable through the project list.

### Portrait Badge (About)

Thomas's real photo becomes an ID badge: a `surface` plate with a punched slot
and a steel clip (`muted`), the photo inside its hairline frame, and a decorative
caption-mono strip ("Thomas Miller · Web developer", localized). It hangs from
a short surface-toned strap with orange stitching, swings gently on load, follows a
drag and settles. The photo keeps its alt text; the strip and strap are
`aria-hidden`.

### Not Found (404)

The code and line ("Error 404 / Not found", "Erreur 404 / Page introuvable") in
Display and Headline, each line drawn as fuzzy text: pixel rows jitter
sideways a little at rest and more under the pointer. One primary button with a
light line home ("Get me out of here" / "Sortez-moi d’ici"). No body copy.

### Effects: Light & Motion

Effects are slots with interchangeable variants, each a small dependency-free
TS module in `src/components/islands/fx/`. Slots, variants and param ranges are
declared in `src/data/effects-registry.ts`; the shipped choice is
`src/data/effects.ts`. Under `pnpm dev` an FX panel (bottom-left, Alt+F)
switches variants and tunes params live; "Save as default" rewrites
`effects.ts`. Each variant is decorative, palette-tinted, and opt-out, and is the
stated exception to the interface's no-glow rule.

Tinting follows two tiers. Small interaction moments are orange: the decode caret
and glitch, the button comet, the refine scan line, the crosshair, tech text,
scrambled text, the staggered menu's edge, the tilt glare. Shader backgrounds use a
neutral `LIGHT` uniform (`--color-muted`) with an `ACCENT` uniform
(`--color-accent`) as a trace, controlled by the `accent` param (labelled Orange in
the FX panel). The lanyard is a steel (`muted`) clip with orange stitching.

Slots (an element can host several: `data-fx-slot="heroName heroNameHover"`;
every matching element gets its own instance):

| Slot             | Where                        | Variants                                                                 |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------ |
| `heroBackground` | Home hero                    | Light shafts · ASCII field · Lightfall · Letter glitch · Off             |
| `heroWall`       | Home hero                    | Drift (the wall) · Card swap (desktop)                                   |
| `heroName`       | Home hero                    | Scramble · Decode · Plain                                                |
| `heroNameHover`  | Home hero                    | Off · Tech text (dashed outlines under the cursor)                       |
| `logo`           | Header                       | Off · Electric                                                           |
| `cursor`         | Every page                   | Lamp · Glow trail · Crosshair · Off                                      |
| `contactCursor`  | /contact (adds to `cursor`)  | Same as `cursor`; the crosshair fades while a field is focused           |
| `primaryButton`  | Hero, CTA, contact form, 404 | Off · Star border                                                        |
| `featuredMedia`  | Home selected work           | Off · Tilted card · Pixel transition · Refine                            |
| `workMedia`      | /work                        | Off · Tilted card · Pixel transition · Refine                            |
| `ctaBackground`  | Home closing CTA             | Off · Laser flow · Magnet lines                                          |
| `mobileMenu`     | Header < 768px               | Default · Staggered                                                      |
| `aboutPortrait`  | /about                       | Static · Lanyard                                                         |
| `contactOrb`     | /contact                     | Off · Crystal ball                                                       |
| `contactHeading` | /contact h1                  | Off · Tech text                                                          |
| `contactLead`    | /contact lead paragraph      | Off · Scrambled text (letters near the cursor flicker to orange `.` `:`) |
| `notFound`       | 404 pages, each heading line | Plain · Fuzzy text (rows jitter sideways, swelling on hover)             |

Most effects are palette-tinted re-implementations of [React Bits](https://reactbits.dev)
components, written as vanilla islands: the site does not use React, and an
effect is ported rather than pulled in as a React island.

Tried and dropped (don't re-add without asking): hero background _Blinds_
and _Fibers_, the _Split-flap_ hero name, the cursor _Lamp + grid_ and the
hero dot grid it lit. The shipped choices (which variant runs where) live
only in `src/data/effects.ts`.

Rules every variant follows: decorative layers are `aria-hidden`; the hero
name keeps its real text with an `aria-label` and a 2.5s CSS failsafe;
shaders render below CSS resolution or at capped DPR; loops pause off-screen
and when the tab is hidden; reduced motion gets a still or static version;
cursor-driven behaviour is fine-pointer only.

## Do's and Don'ts

### Do:

- **Do** let real screenshots of shipped sites be the imagery; crop them to
  16:10 (desktop) or 390:844 (phone), top-anchored, inside a hairline frame.
- **Do** give orange a job: the logo ring, the main button (one per screen, black text), link underlines and link text on hover, focus rings and selection, one emphasised word in a headline at most, the "live" hostname line.
- **Do** keep mono labels muted, and report state with `success` and `error`, not orange.
- **Do** show project context with the ContextBadge (freelance dot or partner wordmark) wherever context appears.
- **Do** step depth one tone at a time (ground, `surface`, `surface-2`), separate surfaces with the `line` hairline, and divide
  lists with hairlines instead of boxing them into cards.
- **Do** put all data (stacks, tags, hostnames, labels, buttons) in DM
  Mono, uppercase, tracked.
- **Do** draw icons as inline SVG strokes (1.5px, square caps) sized in `em`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`
  with an intentional still alternative, give long-running content motion a
  pause control, and stop loops and shaders when off-screen or the tab is hidden.
- **Do** tint every effect from the palette through tokens: orange for small interaction moments; neutral `LIGHT` with `ACCENT` as a trace (the `accent` param) for shader backgrounds.
- **Do** keep content in the HTML and visible without JS; effects decorate it
  (`aria-hidden` layers, a CSS failsafe for anything hidden before it animates).
- **Do** ship every visitor-facing string in both EN and FR (binding product
  constraint).

### Don't:

- **Don't** use orange as a section background, under white text, as body text, beside error red as a second accent, or as decoration with no job; the closing CTA is a flat `surface` band with an orange button.
- **Don't** add glows or coloured shadows to the interface; only opt-out effects may carry light.
- **Don't** add drop shadows for elevation; shadows only mark physical
  layering (the phone capture, the hero deck, the hanging badge).
- **Don't** use placeholder imagery or stock illustration in place of real work.
  The only portrait is Thomas's real photo (`src/assets/portrait.jpg`, About page).
- **Don't** put a mono eyebrow or kicker above a heading.
- **Don't** use unicode glyph arrows (→ ↗) or emoji as icons.
- **Don't** use off-palette glows, rainbow or saturated neon gradients, or a
  second bold accent.
- **Don't** add a light theme; the world is dark only.
- **Don't** recolour the logo's ring and peaks.
- **Don't** run prose in the mono voice, or data in the prose voice.
- **Don't** let an effect cut text contrast below AA, tint the screenshots
  themselves, or add heavy runtime dependencies when a small hand-written
  island does the job.
- **Don't** add a further typeface or a system font; the three faces are fixed.
