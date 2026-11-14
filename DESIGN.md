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
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.125rem, 1.02rem + 0.5vw, 1.375rem)'
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)'
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: 'Schibsted Grotesk Variable, Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace'
    fontSize: '0.8rem'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '0.12em'
  caption:
    fontFamily: 'DM Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace'
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
  service-tile:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.lg}'
    padding: '1.5rem'
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
tight and heavy at 700–800; running text is the same face at regular weight;
every piece of data
(stacks, context tags, hostnames, form labels, button labels) speaks in uppercase
DM Mono. Depth is tonal: ground to surface to second surface, one step at a time,
drawn with 1px hairlines and no glow. The exception is physical layering: a phone
capture laid over a desktop screenshot, screenshots stacked in the hero deck, and
the portrait badge hanging on its strap each cast a soft shadow, because they
really sit on top of something.

Density is generous and editorial: a centered 72rem column, wide vertical
rhythm, sections divided by full-width hairlines, lists divided by hairlines
instead of boxed into cards; the services alone are set as tiles on `surface`
plates. Effects stay alive against that restraint as a
stated exception: a field of neutral letters glitching behind the hero, a name
that scrambles into place through orange stand-ins, screenshots dealt and
re-shuffled as a deck, a badge that swings on its strap, a 404 that fuzzes under
the pointer. Each page gets its own effects rather than one global trick. Effects are welcome and
meant to show craft, but they are opt-out and always drawn from the palette. The
world still refuses rainbow neon, candy accents, and the generic Swiss-Helvetica
grid it replaced.

**Key Characteristics:**

- Kit black, dark only (`color-scheme: dark`), warm off-white ink.
- Real screenshots of shipped sites are the imagery; no placeholders, no illustration.
- One colour, the kit's orange, with a named list of jobs: never a section background, never under white text, never body text.
- Neutral labels: mono labels are muted, and status has its own green and red.
- Three voices from two faces: Schibsted Grotesk heavy (headings) and regular (running text), DM Mono (all data/labels).
- Depth by tonal step + hairlines; no glows or coloured shadows on the interface (the approach section's static top light is the one lit ground); soft shadows only where something physically sits on something else.
- Sharp-by-default corners (2/4/8px).
- Expressive light and motion (a glyph field, type reveals, 3D decks, a pixel card) as an opt-out, palette-tinted exception, chosen per page.

## Colors

The kit's black ground with warm neutral text and one orange, plus two small
status colours that only ever report a state.

### Primary

- **Kit Orange** (`accent`): The only colour, used for its named jobs: the logo
  ring, the main button, link underlines and link text on hover, focus rings,
  selection and the input caret, the "live" project hostname line, the progress
  fill of the how-it-works timeline (the line and its tail only, never the
  numerals), at most one emphasised word in a
  headline (allowed; none ships today), and a faint trace (2.1%) in the wash of
  the approach section's top light. The skip link shares the main button's
  orange fill with black text.
- **Lit Orange** (`accent-hover`): The hover state of orange fills.
- **Black on Orange** (`accent-ink`): Text on orange, including `::selection`
  (~6.5:1). Always black, never white.

### Tertiary

- **Status Green** (`success`): The availability dot and the "message sent"
  status. Nothing else.
- **Status Red** (`error`): Form errors. Nothing else.

### Neutral

- **Kit Black** (`paper`): Page background, input fill, the phone-capture frame.
- **Surface** (`surface`): One tonal step up: screenshot frames, the service
  tiles' plates, the contact form panel, the footer (which carries the closing
  call to action).
- **Second Surface** (`surface-2`): Two steps up: the selected filter chip, and
  the pool of the approach section's top light.
- **Warm Off-White Ink** (`ink`): Headings and body text (~16.7:1 on ground),
  including the how-it-works step numerals;
  hover border of secondary buttons, the selected chip's border, the hero's short
  rule, the wall's pause-control hover.
- **Muted Grey** (`muted`): Secondary text, intros, captions, and all mono labels:
  the capabilities and FAQ headings, "coming soon", NDA, the social icons at
  rest (~7.4:1). Also the filter chips' hover border.
- **Faint Grey** (`faint`): Placeholders and disabled text (~4.8:1 on ground),
  the 1px outline of a timeline numeral the scroll fill has not reached yet, and
  the light and grain of the approach section's top light. Nothing else.
- **Hairline** (`line`): Every border, rule, divider, the timeline's track and
  its dashed tail, and the `/` separator in card meta lines.

### Named Rules

**The Orange Job Rule.** Orange appears only for a job: the logo ring, the main
button (one per screen, black text), link underlines and link text on hover,
focus rings and selection, one emphasised word in a headline at most, the "live"
hostname line, the timeline's progress fill, a faint trace in the approach's
top light. It is never a section background, never under white text, never
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
**Body Font:** Schibsted Grotesk Variable, regular (with system-ui fallback)
**Label / Mono Font:** DM Mono 500 (with ui-monospace fallback)

**Character:** A precise modern grotesque, heavy for headings and regular for
prose, over a working monospace, both from the brand kit. Headings run tight and
mixed-case; all data runs uppercase mono with wide tracking. Self-hosted via Fontsource;
`font-synthesis: none`, kern/liga/calt on, headings `text-wrap: balance`,
paragraphs `text-wrap: pretty`.

### Hierarchy

- **Display** (800, `clamp(2.75rem → 6rem)`, lh 0.92, -0.04em): The hero name and
  the 404's first line.
- **Headline** (800, `clamp(2rem → 3.75rem)`, lh 1, -0.035em): Page and section
  H1/H2, the footer's call-to-action heading, the 404's second line.
- **Step numeral** (800, `clamp(1.75rem, 1.2rem + 2.4vw, 3.125rem)`, lh 1,
  normal tracking, tabular figures): The how-it-works ordinals "01"–"04", sized
  between Title and Headline. Local to that component, not a scale token.
- **Title** (700, `clamp(1.35rem → 1.875rem)`, lh 1.15, -0.025em): Project card
  titles, service tiles, Approach claims (each with a muted Body sentence under
  it), How-it-works steps, About "ways" rows, the contact and footer
  sub-headings.
- **Lead** (400, `clamp(1.125rem → 1.375rem)`, lh 1.5): Intros under headings,
  hero tagline, FAQ questions, About "ways" statements.
- **Body** (400, `clamp(1rem → 1.0625rem)`, lh 1.6): Running text, card
  descriptions (`max-w-[60ch]`), nav links.
- **Small** (400, 0.875rem, lh 1.5): The footer's fine print, capability
  blurbs.
- **Button** (500 mono, 0.8rem, lh 1, +0.12em, UPPERCASE): Button labels.
- **Caption** (500 mono, 0.78rem, lh 1.35, +0.12em, UPPERCASE): The data voice:
  context tags and kind lines, stack lines, hostnames, chips, screenshot captions,
  form labels, availability line, language switcher, the capabilities and FAQ
  headings, the service tiles' indexes.

### Named Rules

**The Three-Voice Rule.** Headings are Schibsted Grotesk at 700–800; prose is
Schibsted Grotesk at 400; anything that reads as data (labels, stacks, tags,
hostnames, buttons) is DM Mono,
uppercase, tracked. A voice never crosses into another's job. Step ordinals
("01"–"04") are headings in the display face, not data, so they are not mono;
the service tiles' indexes ("01"–"05") are small decorative labels, so they are.

**The No-Eyebrow Rule.** Headings stand alone. No mono kicker or label sits
above a section heading; mono labels only name data next to it (a `dt` beside
its `dd`, a context tag above a card title that it describes).

## Layout

A single centered column: `max-w-6xl` (72rem) with 1.5rem gutters opening to
2.5rem at `md`. Sections carry generous vertical rhythm (5rem rising to 7rem,
the footer's call to action included) and are separated by a full-width hairline bottom border; the
only background changes are the footer, one flat step up, and the approach
section's static top light. No homepage section pairs a heading column with
content (the About page keeps a sticky column, for its portrait): services,
Approach and How it works run their heading full width, the services heading
and intro (max 48rem) over the five tiles, the approach statement (max
56rem) over its three reasons, in three columns from `lg`; the how-it-works
heading and intro above a timeline of the four steps (a row from `xl`, a
vertical rail below), with the FAQ under it in two columns from `lg`. The hero is a `1.1fr / 1fr` split
at `lg` (intro left, wall right); below 1024px the wall is not rendered and the hero is the
intro alone.

Project lists are equal cards with very open gaps: three columns for the
homepage selection (2rem columns, 4rem rows), two columns on `/work` (2.5rem
columns, 5rem rows rising to 6rem). The services are tiles on `surface` plates,
0.75rem apart: one column, two tracks from `sm` with the first tile across
both, three from `lg` with the first tile two wide beside the second. FAQ and
About lists are hairline-divided rows, never boxes; the approach's reasons are such rows below
`lg` and columns split by vertical hairline rules from `lg`; the how-it-works
steps hang from one hairline track instead.
The 404 page is a single column filling the viewport under the header,
vertically centred: the fuzzy code and line, then one primary button.
Spacing uses the Tailwind 4px scale; no custom spacing tokens. Breakpoints are
Tailwind defaults (`sm` 640, `md` 768, `lg` 1024; `xl` 1280 only for the
timeline's row of four).

## Elevation & Depth

Flat by default, tonal by construction. The kit black ground sits under `surface`,
which sits under `surface-2`, one step at a time, and every container is drawn with
a 1px `line` hairline rather than a cast shadow. The interface itself has no glows
and no coloured shadows; the footer is flat `surface`, and the service tiles are
flat `surface` plates with a hairline rim. State is a
border-colour or text-colour shift, plus a 2px lift on the primary button. Shadows
exist only where one thing physically rests on another: the phone capture over its
desktop screenshot, each card of the hero deck over the one behind it, the portrait
badge hanging in front of the page. Depth elsewhere is spatial: the deck's real
3D perspective, a ground-coloured veil that darkens cards with distance, and the
mobile strip's masked fade into the ground. Effects' light (the cursor's glow trail, the
star border's comet) is light, not elevation.

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
coloured shadows. The one lit ground is the approach section's top light: a
static, neutral pool of light with orange only as a faint trace. Colour and richness come from the screenshots; if a surface needs
more presence, give the work more room rather than the chrome more light.

**The Effects Exception Rule.** Effects keep expressive light and motion, including
glow, as a stated exception to the no-glow rule, because they are opt-out,
palette-tinted moments. The exception covers `src/components/islands/fx/` only;
static interface elements never inherit it (the approach's static top light is
named in the rule above, not covered by this one).

## Shapes

Sharp by default with small, deliberate softening: **2px** (`sm`) on buttons,
chips, the nav toggle, and focus rings; **4px** (`md`) on screenshot frames,
inputs and the About portrait; **8px** (`lg`) on the phone capture, the service tiles and the contact form panel. The hero
deck's cards take their 10px corner from the `heroWall` effect's `radius` param,
outside this scale.
Borders are always the single `line` hairline. Screenshots crop to fixed
aspect ratios (16:10 desktop, 390:844 phone), anchored to the top of the page.
The recurring small geometry is the 0.4rem freelance dot and the 0.5rem green
availability dot; partner context uses the partners' wordmarks. Icons are inline SVG, 1.5px square-capped
strokes sized to the text (`0.95em`): a right arrow for internal actions, an
up-right arrow for external links, a box with an arrow leaving its corner
for "opens in a new tab", and the FAQ's plus (1rem) that turns into an ×.

## Components

### Buttons

Mono, uppercase, sharp, and few: one orange primary per screen, always black text.

- **Shape:** 2px radius; DM Mono 500 at 0.8rem, +0.12em tracking, padding
  `0.9375rem 1.375rem`, an SVG arrow trailing with a 0.65rem gap (the contact
  submit carries none).
- **Primary:** Orange fill, black text. Hero "start a project", the footer's
  call to action, contact submit, the 404's way home.
- **Hover / Focus:** Primary lightens to `accent-hover` and lifts 2px
  over 200ms (`cubic-bezier(0.22, 1, 0.36, 1)`); the arrow nudges 2px right.
  A comet of orange light orbits the button's edge while hovered or focused
  (the star border, one lap per 3s). Focus is the global 2px orange outline,
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

### Project Card

The shipped site is the card. There is no card box: an open composition of
frame and text.

- **Frame:** The real desktop screenshot in a 4px, hairline-bordered `surface`
  frame (16:10); on hover the image scales to 1.02 over 700ms. When a phone
  capture exists it overlaps the lower-right corner (22% wide, 8px radius,
  `paper` backing, 1.25rem below the frame) with the Overlap shadow. NDA work
  and the `/work` teaser ("Your project?", linking to contact, fifth in the
  grid after the first four projects) show a blank frame with a faint diagonal
  hatch and a mono caption; the teaser's frame fills with the pixel card when
  the card scrolls into view, and its pixels swell near the pointer (see
  Effects).
- **Meta line:** Context badge (`currentColor` dot + "Freelance", or the macmac /
  Marvelous wordmark) in ink, a `line`-coloured `/`,
  then the kind in muted caption mono.
- **Title:** Title, ink; the whole article is the hover
  target and draws a 1px underline left-to-right over 400ms. The title is the
  card's one real link (new tab); on hover or keyboard focus a small muted
  new-tab mark fades in beside it, its space always reserved so nothing shifts.
- **Description:** Muted body, max 60ch.
- **Stack:** One muted caption-mono line, joined with `·` (no role line — the
  site does not split credit between design and development).
- **Motion:** On the homepage and /work, frames tilt in 3D toward the pointer
  with a soft glare, the phone capture lifting off its desktop screenshot.
- **Link line:** The hostname in orange caption mono, the live tag, with an
  up-right SVG arrow that shifts 2px diagonally on hover. Like the screenshot,
  it links to the site but is `aria-hidden` and out of the tab order; "coming soon" in muted;
  NDA as a small `currentColor` dot plus label, also muted.

### Inputs / Fields

- **Style:** Kit black fill (`paper`), 1px `line` border, 4px radius, body text,
  faint placeholders; uppercase caption-mono label above in muted. Fields sit
  on an 8px `surface` panel with hairline border, padded 1.5rem on small
  screens and at the `form-panel` padding from `md`.
- **Focus:** 2px orange outline, 2px offset. No glow. Caret is orange.
- **Status:** Inline `aria-live` status paragraph below the submit, in `success`
  or `error`.

### Logo

The kit symbol, "Sommet qui perce": an orange ring, open at the top, with ink
peaks inside and the tall peak breaking out through the gap. It is drawn inline
(`Logo.astro`, geometry in `brand/README.md`) beside the name, which stays live
text in Schibsted Grotesk 800 at -0.04em, over the muted mono tagline. One
lockup, in the header and the footer: symbol, name and tagline. The symbol is
36px in the header and 40px in the footer (`--logo-size`) and the text scales
with it; the styles are under "Logo" in `src/styles/global.css`. Never recolour
the ring and peaks, and leave clear space of at least half the symbol's height.

### Navigation

- **Header:** Sticky, 95% kit black with backdrop blur, hairline bottom border.
  The logo link does not change colour on hover; nav links (About, Work,
  Contact) in body ink, hover to orange, `aria-current="page"` on the active route; the EN/FR switcher in caption
  mono, muted, hover to orange.
- **Mobile (below 768px):** A borderless 44px toggle with two strokes, a long
  ink one over a short orange one set flush right, opens the menu; labelled
  ("Open menu" / "Close menu"), Escape closes and returns focus, the page behind
  is inert and does not scroll. The menu is a full-height paper sheet under the
  bar: the links at display size between hairlines, the current one in orange,
  and at the bottom a "Language" row of two large choices (English, Français),
  the current one filled `surface-2` with an ink border and a check. Opening is
  one motion: the sheet fades in while its content settles 0.75rem down, and the
  two strokes turn into an X, all over 280ms on `cubic-bezier(0.22, 1, 0.36, 1)`
  (200ms on close). Under reduced motion it appears and disappears at once.
  Without JS the toggle is dropped and the menu shows in the page flow.

### Footer (closing block)

One block closes every page (`Footer.astro`, mounted by `BaseLayout`): a flat
`surface` band under a hairline. There is no separate call-to-action band. A page
picks one of three variants with the `footer` prop on `BaseLayout`.

- **Full** (default, `footer="full"`: home, About, Work): the Headline
  "Let's talk about your project", a muted Lead line with the reply promise and
  the primary button to the contact page on the left; on the right, bottom-aligned
  with the button, the Title "Me joindre directement" / "Reach me directly" over the
  stacked email, phone and icon links (WhatsApp, GitHub, LinkedIn; 44px targets).
  Below `md` the two stack, divided by a hairline.
- **Compact** (`footer="compact"`: the error pages, whose one job is the way
  home): no call to action. The Title sits left and the contact details run in
  one row on the right.
- **Fine print only** (`footer="fine-print"`: the contact page): no call to
  action, since the button would link to the page itself and the page already
  opens with the same heading, and no contact details, since the page body shows
  the same email, phone and icon links just above. Only the fine print remains,
  directly under the footer's own hairline (no second rule), with equal top and
  bottom padding.
- **Fine print**, closing every variant (under its own hairline in Full and
  Compact): the logo with tagline, the copyright line in Small, and the EN/FR
  switcher.

### Service Tiles

The Headline and its muted Lead intro run full width on top (max 48rem); under
them the five services are tiles, 0.75rem apart: one column on phones; from
`sm`, two tracks with the first tile across both; from `lg`, three tracks with
the first tile two wide beside the second, then the other three in a row. Each
tile is an `aria-hidden` plate (`surface`, a 1px `line` inset rim, 8px radius)
padded 1.5rem (1.75rem from `lg`), with its muted caption-mono index ("01"–"05",
`aria-hidden`) at the top and the Title over a muted Body blurb (max 42ch) at the
bottom. No shadow and no hover colour: the tiles respond only with the
`servicesTiles` light (see Effects). They keep the `<ol>` order and scroll-reveal
with a short stagger; without JS they are the same tiles, unlit.
Capabilities follow under a muted caption-mono heading as a list, two columns
from `sm`: each an ink Body name over a muted Small blurb.

### Approach and How It Works

Approach is a statement over its reasons. The Headline runs full width (max
56rem); under it, three reasons, each a Title claim over a muted Body sentence
(max 52ch). From `lg` they are three columns separated by vertical 1px `line`
rules, on a shared subgrid so the claims and the sentences start on common
lines, with claims capped at 10em so all three break alike; below `lg` they
stack as hairline-divided rows. The reasons scroll-reveal with a short stagger.
The `approachHeading` effect lights the Headline's words up with the scroll,
from dim and blurred to sharp while a slight tilt straightens (neutral: ink
opacity and blur, no orange); every word is at full while the heading is still
well inside the viewport. The heading itself carries no `data-reveal`. Without
JS or under reduced motion, it is a plain Headline.

Behind the whole section hangs the top light, static markup and CSS in
`Approach.astro`: over the section's ground and under its content, clipped to
the section, `aria-hidden`, with no pointer events. A soft pool of `faint`
light over `surface-2` (intensity 0.7) falls from just above the top centre,
over a wash with a trace of orange (2.1% `accent`) under the top edge; a
vignette and a bottom falloff darken toward `paper` before the bottom hairline,
and a fine film grain (`faint`, 3.5%) covers it, fading at the top and bottom
edges. Ink text on it keeps at least 13:1 and muted at least 6:1. The
`approachLight` effect leans the pool slightly toward the pointer.

How it works is a sequence, so it is drawn as a timeline. The Headline and Lead
intro run full width; under them one 1px `line` track joins the four steps, and
the step numerals "01"–"04" interrupt it like stations on a route (each sits on
a `paper` ground that hides the track behind it). From `xl` the steps are four
equal columns read left to right, the track running through the middle of the
numerals and each step's Title and muted Body sentence under its numeral; below
`xl` the rail runs down the left through the numerals and the steps stack
beside it, each Title on its numeral's baseline. There is no 2×2 arrangement:
four narrower columns break the French titles over three lines, and a grid is
not a sequence. After 04 the line is open-ended: solid for half its length,
then 8px dashes with 6px gaps that fade out; in the stack it runs 2.5rem past
the last step's text. The `howTimeline` effect lays a 2px orange fill over the
track as the visitor scrolls through the steps, both ways, and the fill takes
the tail's shape. While it runs, each numeral waits as a 1px `faint` outline
and turns solid ink when the fill reaches it. Orange stays on the line and its
tail: no orange markers, and the numerals and text never turn orange. Without
JS or under reduced motion, the plain track and tail stay and every numeral is
solid ink. Track, tail, fill and numerals are `aria-hidden`; the `<ol>` carries
the order.

The FAQ follows under a caption-mono heading: hairline-divided disclosure rows
whose question is Lead in ink, orange on hover, with a 1.5px square-capped plus
that turns 45° into an × when open; the answer is muted Body. One column below
`lg`; from `lg`, two independent stacks read down the first and then the second,
so an opened answer only moves the rows of its own column.

### Signature: The Deck of Work (hero)

On desktop the hero's screenshots are dealt as a 3D deck: every real desktop
screenshot (NDA work excluded) in a hairline frame with a 10px radius, each
card 48px right, 19px up and 157px back from the one in front, unskewed, and
darkened by a ground-coloured veil that thickens toward the back. Every 2.75s the
front card drops below the deck, travels back, and slides into the last slot
behind the others while the rest step forward (`speed` 1.05, no bounce).
The deck tilts toward the pointer, pauses on hover, and the front card can be
flung to the back by dragging. Nothing locks while it moves: the front card can be
grabbed mid-step, and a card still dropping away can be caught back to the front. Below 1024px the wall is not shown at all; as the deck's fallback the
original Wall of Work runs instead.

### The Wall of Work (hero, fallback)

The original signature motion. Up to ten real desktop screenshots of shipped sites
(NDA work excluded) in two columns that drift vertically in opposite
directions: up over 70s, down over 80s, linear and seamless (each track is
rendered twice). The second column is offset 9rem up so rows never align. Each
shot is a 4px hairline `surface` frame with a caption-mono title bar. A mask
fades the column ends into the ground (transparent → solid at 14% / 86%).

Below 1024px it is `display: none` (no strip, no toggle; its images are lazy, so
phones don't fetch them). Animation runs only under
`prefers-reduced-motion: no-preference`; it pauses on hover, when the wall is
off-screen (IntersectionObserver), and via a mono "pause / play" text button
(`aria-pressed`, hover ink) that appears only when motion is on. Under reduced
motion the wall is a static grid. The wall is decorative (`aria-hidden`); the
same work is reachable through the project list.

### Portrait Badge (About)

Thomas's real photo becomes an ID badge: a `surface` plate with a punched slot
and a steel clip (`muted`), the photo inside its hairline frame, and a decorative
caption-mono strip ("Thomas Miller · Web developer", localized). It hangs from
a short surface-toned strap with orange stitching and swings gently on load. Its
weight sits at the centre of the photo, so it moves like something heavy on a short
strap: held anywhere, it pivots around the grip; pulled past the strap's reach, the
strap stretches a little and springs back. The photo keeps its alt text; the strip
and strap are `aria-hidden`.

### Not Found (404)

The code and line ("Error 404 / Not found", "Erreur 404 / Page introuvable") in
Display and Headline, each line drawn as fuzzy text: pixel rows jitter
sideways a little at rest and more under the pointer. One primary button with a
light line home ("Get me out of here" / "Sortez-moi d’ici"). No body copy.

### Effects: Light & Motion

Effects are small dependency-free TS modules in `src/components/islands/fx/`,
mounted into slots: every `[data-fx-slot~="<slot>"]` element gets its own
instance (an element can host several: `data-fx-slot="a b"`), and the cursor
mounts on `<body>`. Each effect is decorative, palette-tinted, and opt-out, and
is the stated exception to the interface's no-glow rule.

Every slot runs one effect with fixed settings. Which module runs where, and
with what settings, is listed in one table, `src/components/islands/fx/effects.ts`;
it is the only place they are set.

| Slot              | Where                           | Effect                                                                                                                                                                                                                                                             | Settings                                                                                                                                                                         |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heroBackground`  | Home hero                       | Letter glitch (a grid of mono characters in dark tones, a few re-rolling with a brief ink flash)                                                                                                                                                                   | intensity 0.5, speed 0.05, cell 31px, orange 0                                                                                                                                   |
| `heroName`        | Home hero                       | Scramble (letters flicker through orange stand-ins, then lock)                                                                                                                                                                                                     | speed 1                                                                                                                                                                          |
| `heroWall`        | Home hero, from 1024px          | Card swap (the wall of screenshots becomes a 3D deck whose front card drops to the back); not shown below 1024px                                                                                                                                                   | card offset 48px right, 19px up, 157px back; radius 10px; a swap every 2750ms at speed 1.05; parallax 0.6; dim 0.7; autoplay, pause on hover, draggable; no skew, bounce, spread |
| `cursor`          | Every page                      | Glow trail                                                                                                                                                                                                                                                         | intensity 0.25, trail 0.4, orange 0.1                                                                                                                                            |
| `primaryButton`   | Hero, footer, contact form, 404 | Star border, lit on hover and keyboard focus only                                                                                                                                                                                                                  | orbit 3s, intensity 0.7                                                                                                                                                          |
| `approachHeading` | Home, approach                  | Scroll reveal (words go from dim and blurred to full with the scroll, the line straightens)                                                                                                                                                                        | base opacity 0.1, blur 4px, rotation 3°, scrubbed from 0.9 to 0.7 of the viewport height                                                                                         |
| `servicesTiles`   | Home, services                  | Magic bento light (a soft ink spotlight in the hovered tile, an orange glow on the rims near the pointer, orange particles drifting up near it, a slight press, and a wave of orange light along the rims on click and once when the tiles first scroll into view) | spotlight 300px (rim glow 225px), glow 0.7, 24 particles per tile; no tilt or magnetism                                                                                          |
| `approachLight`   | Home, approach                  | Top light lean (the static top light drifts toward the pointer)                                                                                                                                                                                                    | up to 2% of the light's box sideways and 1.5% up or down, eased over 1.6s                                                                                                        |
| `howTimeline`     | Home, how it works              | Scroll fill (the track and its tail fill in orange with the scroll; numerals wait as outlines until reached)                                                                                                                                                       | scrubbed from 0.7 to 0.5 of the viewport height, smoothing 0.3                                                                                                                   |
| `featuredMedia`   | Home selected work              | Tilted card                                                                                                                                                                                                                                                        | max angle 8°, glare 0.5                                                                                                                                                          |
| `workMedia`       | /work                           | Tilted card                                                                                                                                                                                                                                                        | max angle 8°, glare 0.5                                                                                                                                                          |
| `workTeaser`      | /work, "Your project?" teaser   | Pixel card (when the card scrolls into view, the blank frame fills with small pixels rippling out from the centre; they shimmer while it stays in view and swell near the pointer)                                                                                 | gap 5px, speed 35, orange 0.15, spotlight 0.5                                                                                                                                    |
| `aboutPortrait`   | /about                          | Lanyard                                                                                                                                                                                                                                                            | swing 0.4, strap 4rem                                                                                                                                                            |
| `notFound`        | 404 pages, each heading line    | Fuzzy text (rows jitter sideways, swelling on hover)                                                                                                                                                                                                               | resting 0.18, hover 0.5, range 30px                                                                                                                                              |

Tinting follows two tiers. Small interaction moments are orange: the name's
scramble stand-ins, the cursor's glow trail, the button comet, the tilt glare, the timeline's scroll fill (orange as progress),
the service tiles' rim glow, particles and click wave; their spotlight is
neutral (an `ink` light at 8% at most). The approach light's lean only moves
the static top light, neutral with a trace of orange.
The hero background stays neutral: characters in dark tones between the ground
and `muted`, with ink flashes; its orange setting (the share of flashes that
turn orange) is 0. The lanyard is a steel (`muted`) clip with orange stitching.
The teaser's pixel card is neutral too (`line`, `faint` and `muted` pixels) with
orange as a 15% minority; it ripples out from the centre when the card
scrolls into view (on every device, and again each time the card returns
after leaving the screen), shimmers while it stays in view and swells near the
pointer, and a calm zone keeps every pixel off the caption.
Text effects on reading copy stay neutral: the approach heading's scroll reveal
only changes the ink's opacity and blur, and ends with every word at full.

Most effects are palette-tinted re-implementations of [React Bits](https://reactbits.dev)
components, written as vanilla islands: the site does not use React, and an
effect is ported rather than pulled in as a React island.

Tried and dropped (don't re-add without asking). None of these is in the code
any more. The ones marked \* can be recovered from git history (commit
`3a7bd7f` still has them), the ones marked † from commit `ed92b43`:

- Hero background: _Blinds_, _Fibers_; _Light shafts_†, _ASCII field_† and
  _Lightfall_† (three WebGL shader grounds tinted from `muted` with a trace of
  orange, and the small WebGL helper they shared).
- Hero name: _Split-flap_; _Decode_\* (an orange caret block ran through the
  name and each letter glitched in behind it).
- Cursor: _Lamp + grid_ and the hero dot grid it lit; _Lamp_\* (a soft pool of
  orange light trailing the pointer); _Crosshair_\* (two hairlines with a mono
  coordinate readout, snapping orange corner ticks around links and buttons).
- Project screenshots (home and /work): _Pixel transition_\* (on hover a grid
  of dark pixels swapped the screenshot for the phone capture); _Refine_\* (the
  screenshot "developed" from coarse pixels under an orange scan line, with a
  mono "PASS 2/4" chip).
- Mobile menu: _Staggered_ (a surface sheet and an orange-edged paper sheet
  swept in from the right, then the links rose in one by one; it read as
  separate layers). The menu is now plain markup in `Header.astro` with one fade
  (see Navigation), not an effect; the module is in git history (`aff717d`).
- Contact lead paragraph: _Scrambled text_\* (letters near the cursor flickered
  to orange `.` and `:`). The paragraph has no effect and is not a slot.

Rules every effect follows: decorative layers are `aria-hidden`; the hero
name keeps its real text with an `aria-label` and a 2.5s CSS failsafe;
canvases draw at a capped DPR; loops pause off-screen and when the tab is
hidden; reduced motion gets a still or static version; cursor-driven behaviour
is fine-pointer only.

## Do's and Don'ts

### Do:

- **Do** let real screenshots of shipped sites be the imagery; crop them to
  16:10 (desktop) or 390:844 (phone), top-anchored, inside a hairline frame.
- **Do** give orange a job: the logo ring, the main button (one per screen, black text), link underlines and link text on hover, focus rings and selection, one emphasised word in a headline at most, the "live" hostname line, the timeline's progress fill, a faint trace in the approach's top light.
- **Do** keep mono labels muted, and report state with `success` and `error`, not orange.
- **Do** show project context with the ContextBadge (freelance dot or partner wordmark) wherever context appears.
- **Do** step depth one tone at a time (ground, `surface`, `surface-2`), separate surfaces with the `line` hairline, and divide
  lists with hairlines instead of boxing them into cards; the services are the one exception, tiles on `surface` plates, still without shadows.
- **Do** put all data (stacks, tags, hostnames, labels, buttons) in DM
  Mono, uppercase, tracked.
- **Do** draw icons as inline SVG strokes (1.5px, square caps) sized in `em`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`
  with an intentional still alternative, give long-running content motion a
  pause control, and stop loops when off-screen or the tab is hidden.
- **Do** tint every effect from the palette through tokens: orange for small interaction moments; neutral tones, with orange as a trace or a small minority at most, for the hero background and the teaser's pixel card.
- **Do** keep content in the HTML and visible without JS; effects decorate it
  (`aria-hidden` layers, a CSS failsafe for anything hidden before it animates).
- **Do** ship every visitor-facing string in both EN and FR (binding product
  constraint).

### Don't:

- **Don't** use orange as a section background, under white text, as body text, beside error red as a second accent, or as decoration with no job; the footer is a flat `surface` band whose call to action has an orange button.
- **Don't** add glows or coloured shadows to the interface; only opt-out effects, and the approach section's static top light, may carry light.
- **Don't** add drop shadows for elevation; shadows only mark physical
  layering (the phone capture, the hero deck, the hanging badge).
- **Don't** use placeholder imagery or stock illustration in place of real work.
  The only portrait is Thomas's real photo (`src/assets/profile.jpeg`, About page).
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
- **Don't** add a further typeface or a system font; the two faces are fixed.
