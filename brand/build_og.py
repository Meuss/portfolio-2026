"""Draw the site's link-preview images (Open Graph), 1200×630 PNG, one per page and language.

Usage (from brand/, with the kit's venv, see README.md):
    .venv/bin/python build_og.py            # writes ../public/og/<lang>-<page>.png
    .venv/bin/python build_og.py --preview /tmp/og  # also writes 300px-wide and centre-square previews there

Everything comes from the site itself, so the images follow it:
- the pages are `sharePages` in src/data/share.ts, and each one has a layout (LAYOUTS below):
  "headline" (the default: the logo, the page's headline, the domain), "logo" (home: the logo alone,
  large) or "portrait" (about: the logo over the portrait from src/assets/profile.jpeg);
- the headline of a "headline" page is `og.<page>.headline` in src/i18n/ui.ts (both locales), the small
  label is `brand.tagline`;
- the colours are the `--color-*` tokens in src/styles/global.css;
- the type is outlined from fonts/SchibstedGrotesk.ttf (800) and fonts/DMMono-Medium.ttf, the same
  fonts as the logo kit, so nothing depends on fonts installed on the machine.
The unit test src/data/share.test.ts checks that every image exists and shows the current text: the
headline, or the tagline on the pages without one (stored in an iTXt "Title" chunk).

Layout: everything that matters sits in the centre 630×630 square (some apps crop previews to a square),
with the headline (or the tagline, on the logo card) large enough to read when the image is shown 300px wide. The sides carry a still,
faint version of the hero's letter field, fading out before the centre square; on the work card they
carry screenshots of the first four projects on /work instead. Cards over MAX_BYTES (the work and
portrait cards) are quantised with pngquant.
"""
import base64, hashlib, io, math, os, random, re, shutil, struct, subprocess, sys, zlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
import resvg_py

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
UI_TS = os.path.join(ROOT, "src/i18n/ui.ts")
SHARE_TS = os.path.join(ROOT, "src/data/share.ts")
PORTRAIT = os.path.join(ROOT, "src/assets/profile.jpeg")
CSS = os.path.join(ROOT, "src/styles/global.css")
OUT = os.path.join(ROOT, "public/og")
PREVIEW = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None

W, H = 1200, 630
SQ = (W - H) / 2  # left edge of the centre square
DOMAIN = "thomasmiller.ch"
MAX_BYTES = 200 * 1024  # keep previews light: WhatsApp skips images over about 300 KB


# ---------- sources: strings and colours from the site ----------
def read_ui():
    """{lang: {key: value}} for the plain string entries of ui.ts (enough for the keys used here)."""
    src = open(UI_TS, encoding="utf-8").read()
    starts = [(m.start(), m.group(1)) for m in re.finditer(r"\n  (\w+): \{", src)]
    entry = re.compile(r"""'([\w.]+)':\s*(?:'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)")""")
    out = {}
    for i, (pos, lang) in enumerate(starts):
        end = starts[i + 1][0] if i + 1 < len(starts) else len(src)
        out[lang] = {m.group(1): (m.group(2) if m.group(2) is not None else m.group(3)) for m in entry.finditer(src, pos, end)}
    return out


def read_tokens():
    css = open(CSS, encoding="utf-8").read()
    return dict(re.findall(r"--color-([\w-]+):\s*(#[0-9a-fA-F]{6})", css))


def read_share_pages():
    src = open(SHARE_TS, encoding="utf-8").read()
    return re.findall(r"'(\w+)'", re.search(r"sharePages = \[([^\]]*)\]", src).group(1))


UI = read_ui()
PAGES = read_share_pages()
C = read_tokens()
PAPER, INK, MUTED, ACCENT = C["paper"], C["ink"], C["muted"], C["accent"]


def rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def mix(a, b, k):
    a, b = rgb(a), rgb(b)
    return "#" + "".join(f"{round(x + (y - x) * k):02x}" for x, y in zip(a, b))


# ---------- the mark (64×64 grid, as in build_kit.py) ----------
RING = "M43.74 11.93 A25 25 0 1 1 14.89 15.77"
PEAKS = "M17 45 L25.5 30 L31 38 L38.5 7 L47.5 45"


def mark(x, y, size):
    k = size / 64
    return (f'<g transform="translate({x:.2f} {y:.2f}) scale({k:.4f})" fill="none" '
            f'stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{RING}" stroke="{ACCENT}" stroke-width="6"/>'
            f'<path d="{PEAKS}" stroke="{INK}" stroke-width="5"/></g>')


# ---------- type (outlined with HarfBuzz shaping, as in build_kit.py) ----------
class Face:
    def __init__(self, path, axes=None):
        tt = TTFont(path)
        if axes:
            tt = instantiateVariableFont(tt, axes)
        buf = io.BytesIO(); tt.save(buf); data = buf.getvalue()
        self.tt = TTFont(io.BytesIO(data))
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upm = self.tt["head"].unitsPerEm
        self.cap = self.tt["OS/2"].sCapHeight
        self.hb = hb.Font(hb.Face(hb.Blob(data)))

    def run(self, text, size, tracking_em=0.0):
        """(path_d, width, cap_height) with the baseline at y=0."""
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.hb, buf, {"kern": True, "liga": True})
        s, track = size / self.upm, tracking_em * self.upm
        pen = SVGPathPen(self.gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        x, n = 0.0, len(buf.glyph_infos)
        for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
            tp = TransformPen(pen, (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s))
            self.gs[self.order[info.codepoint]].draw(tp)
            x += pos.x_advance + (track if i < n - 1 else 0)
        return pen.getCommands(), x * s, self.cap * s

    def width(self, text, size, tracking_em=0.0):
        return self.run(text, size, tracking_em)[1]


DISPLAY = Face(os.path.join(HERE, "fonts/SchibstedGrotesk.ttf"), {"wght": 800})
MONO = Face(os.path.join(HERE, "fonts/DMMono-Medium.ttf"))


def path(d, x, y, fill):
    return f'<path transform="translate({x:.2f} {y:.2f})" d="{d}" fill="{fill}"/>'


# ---------- headline: balanced lines, as large as fits ----------
HEAD_TRACK = -0.035   # --text-headline letter-spacing
HEAD_LEAD = 1.0       # --text-headline line-height
HEAD_MAX, HEAD_MIN = 92, 64
HEAD_W = 540          # inside the centre square, 45px from its sides
HEAD_H = 300          # vertical room for the block


def splits(words, k):
    """Every way to cut `words` into k non-empty lines."""
    if k == 1:
        yield [" ".join(words)]
        return
    for i in range(1, len(words) - k + 2):
        for rest in splits(words[i:], k - 1):
            yield [" ".join(words[:i])] + rest


def layout_headline(text):
    """Pick the line breaks that allow the largest size (capped), then the fewest lines, then the most even."""
    words = text.split(" ")  # breaks at plain spaces only: no-break spaces keep French punctuation attached
    best = None
    for k in range(1, min(4, len(words)) + 1):
        for lines in splits(words, k):
            widths = [DISPLAY.width(l, 100, HEAD_TRACK) / 100 for l in lines]
            size = min(HEAD_MAX, HEAD_W / max(widths), HEAD_H / (k * HEAD_LEAD))
            ragged = max(widths) - min(widths)
            key = (round(size), -k, -ragged)
            if best is None or key > best[0]:
                best = (key, lines, size)
    _, lines, size = best
    if size < HEAD_MIN:
        sys.exit(f"Headline too long for the card ({size:.0f}px < {HEAD_MIN}px): {text!r}")
    return lines, math.floor(size)


# ---------- the side texture: a still frame of the hero's letter field ----------
CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-/<=>?@[]"
CELL = 30


def letter_field(seed):
    rnd = random.Random(seed)
    size = round(CELL * 0.68)
    glyphs, defs, uses = {}, [], []
    cols, rows = W // CELL + 1, H // CELL + 1
    ox, oy = (W - (cols - 1) * CELL) / 2, (H - (rows - 1) * CELL) / 2
    for r in range(rows):
        for c in range(cols):
            cx, cy = ox + c * CELL, oy + r * CELL
            # 0 inside the centre square (plus a margin), rising to 1 at the image's left and right edges
            edge = (abs(cx - W / 2) - (H / 2 + 20)) / (W / 2 - H / 2 - 20)
            if edge <= 0:
                continue
            v = min(1.0, edge) ** 1.4
            ch = rnd.choice(CHARS)
            roll = rnd.random()
            if roll < 0.012 * v:
                fill = mix(PAPER, ACCENT, 0.55 * v)          # a rare orange trace
            elif roll < 0.05:
                fill = mix(PAPER, INK, 0.28 * v)             # a lit cell, as if caught mid-flash
            else:
                fill = mix(PAPER, MUTED, (0.07 + 0.13 * rnd.random()) * v)
            if ch not in glyphs:
                d, w, cap = MONO.run(ch, size)
                glyphs[ch] = f"g{len(glyphs)}"
                defs.append(f'<path id="{glyphs[ch]}" d="{d}"/>')
                glyphs[ch + "_w"], glyphs[ch + "_cap"] = w, cap
            x = cx - glyphs[ch + "_w"] / 2
            y = cy + glyphs[ch + "_cap"] / 2
            uses.append(f'<use href="#{glyphs[ch]}" x="{x:.1f}" y="{y:.1f}" fill="{fill}"/>')
    return f"<defs>{''.join(defs)}</defs>" + "".join(uses)


# ---------- the work card's sides: real screenshots of the latest projects ----------
PROJECTS = os.path.join(ROOT, "src/content/projects")
SHOTS = os.path.join(ROOT, "src/assets/projects")


def latest_projects(n):
    """Slugs of the first n projects on /work (lowest `order`, not hidden) that have a screenshot."""
    found = []
    for name in os.listdir(PROJECTS):
        if not name.endswith(".md"):
            continue
        fm = open(os.path.join(PROJECTS, name), encoding="utf-8").read().split("---")[1]
        if re.search(r"^hidden:\s*true", fm, re.M):
            continue
        order = re.search(r"^order:\s*(\d+)", fm, re.M)
        slug = name[:-3]
        if order and os.path.exists(os.path.join(SHOTS, f"{slug}.jpg")):
            found.append((int(order.group(1)), slug))
    return [slug for _, slug in sorted(found)[:n]]


def screenshots():
    """Four 16:10 desktop captures in hairline frames, two per side, bleeding off the outer edges and kept
    out of the centre square."""
    fw, fh, gap = 336, 210, 26
    y0 = (H - 2 * fh - gap) / 2 + 20
    slots = [(-96, y0), (-96, y0 + fh + gap), (W - fw + 96, y0), (W - fw + 96, y0 + fh + gap)]
    out = []
    for i, (slug, (x, y)) in enumerate(zip(latest_projects(4), slots)):
        data = base64.b64encode(open(os.path.join(SHOTS, f"{slug}.jpg"), "rb").read()).decode()
        out.append(f'<clipPath id="shot{i}"><rect x="{x}" y="{y:.1f}" width="{fw}" height="{fh}" rx="4"/></clipPath>'
                   f'<image href="data:image/jpeg;base64,{data}" x="{x}" y="{y:.1f}" width="{fw}" height="{fh}" '
                   f'preserveAspectRatio="xMidYMin slice" clip-path="url(#shot{i})"/>'
                   f'<rect x="{x + 0.5}" y="{y + 0.5:.1f}" width="{fw - 1}" height="{fh - 1}" rx="4" fill="none" '
                   f'stroke="{C["line"]}"/>')
    return "".join(out)


# ---------- the logo ----------
NAME = "Thomas Miller"
LOGO_S, LOGO_TOP = 92, 52   # symbol size and top edge of the lockup on the headline and portrait cards


def lockup(tagline, S, top):
    """The site header's lockup (Logo.astro), centred: symbol, then name over tagline, all in
    proportion to the symbol size S. Returns (svg, bottom edge)."""
    name_d, name_w, name_cap = DISPLAY.run(NAME, S * 0.5, -0.04)
    tag_d, tag_w, tag_cap = MONO.run(tagline, S * 0.2, 0.12)
    gap, text_w = S * 0.3, max(name_w, tag_w)
    lx = (W - (S + gap + text_w)) / 2
    block = name_cap + S * 0.12 * 2 + tag_cap   # name, gap, tagline (the CSS gap sits between line boxes)
    ty = top + (S - block) / 2
    return (mark(lx, top, S) + path(name_d, lx + S + gap, ty + name_cap, INK) +
            path(tag_d, lx + S + gap, ty + name_cap + S * 0.24 + tag_cap, MUTED)), top + S


# The logo card's stacked lockup: the symbol over the name on one line, over the tagline. The name and
# tagline keep the header's proportions to each other (0.5 : 0.2) and are as wide as the centre square
# allows, so the tagline stays readable at 300px wide.
STACK_W = 540          # widest line (name or tagline): 45px inside the centre square on each side
STACK_SYMBOL = 2.4     # symbol size, in name sizes
STACK_GAPS = (0.62, 0.36)   # symbol to name cap, name baseline to tagline cap, in name sizes


def stacked_lockup(tagline):
    probe_name, probe_tag = DISPLAY.width(NAME, 100, -0.04), MONO.width(tagline, 40, 0.12)
    n = 100 * STACK_W / max(probe_name, probe_tag)       # name size; the tagline is 0.4 of it
    name_d, name_w, name_cap = DISPLAY.run(NAME, n, -0.04)
    tag_d, tag_w, tag_cap = MONO.run(tagline, n * 0.4, 0.12)
    sym = n * STACK_SYMBOL
    g1, g2 = n * STACK_GAPS[0], n * STACK_GAPS[1]
    total = sym + g1 + name_cap + g2 + tag_cap
    top = (H - total) / 2
    name_base = top + sym + g1 + name_cap
    tag_base = name_base + g2 + tag_cap
    return (mark((W - sym) / 2, top, sym) + path(name_d, (W - name_w) / 2, name_base, INK) +
            path(tag_d, (W - tag_w) / 2, tag_base, MUTED))


# ---------- the about card's portrait, framed as on the About page ----------
PORTRAIT_SRC = 2048                     # profile.jpeg is 2048×2048
PORTRAIT_CROP = (630, 290, 880, 1100)  # head and shoulders, 4:5 like the About page (x, y, w, h in the source)
PORTRAIT_RADIUS = 6                     # rounded-md


def portrait(x, y, w, h):
    data = base64.b64encode(open(PORTRAIT, "rb").read()).decode()
    cx, cy, cw, ch = PORTRAIT_CROP
    return (f'<clipPath id="portrait"><rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'rx="{PORTRAIT_RADIUS}"/></clipPath>'
            f'<g clip-path="url(#portrait)"><svg x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'viewBox="{cx} {cy} {cw} {ch}" preserveAspectRatio="xMidYMid slice">'
            f'<image href="data:image/jpeg;base64,{data}" width="{PORTRAIT_SRC}" height="{PORTRAIT_SRC}"/></svg></g>'
            f'<rect x="{x + 0.5:.2f}" y="{y + 0.5:.2f}" width="{w - 1:.2f}" height="{h - 1:.2f}" '
            f'rx="{PORTRAIT_RADIUS}" fill="none" stroke="{C["line"]}"/>')


# ---------- the cards ----------
LAYOUTS = {"home": "logo", "about": "portrait"}   # every other share page: "headline"


def layout_of(page):
    return LAYOUTS.get(page, "headline")


def headline_of(lang, page):
    return UI[lang].get(f"og.{page}.headline")


def title_of(lang, page):
    """The text the test checks against ui.ts: the headline, or the tagline on cards without one."""
    return headline_of(lang, page) or UI[lang]["brand.tagline"]


def check_sources():
    for lang in UI:
        for page in PAGES:
            has = headline_of(lang, page) is not None
            if has != (layout_of(page) == "headline"):
                sys.exit(f"{lang}: og.{page}.headline should {'' if not has else 'not '}exist in ui.ts "
                         f"for the {layout_of(page)!r} layout")


def svg_doc(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {W} {H}" width="{W}" height="{H}">{"".join(body)}</svg>')


def card(lang, page):
    tagline = UI[lang]["brand.tagline"].upper()
    seed = int(hashlib.sha1(f"{lang}-{page}".encode()).hexdigest()[:8], 16)
    sides = screenshots() if page == "work" else letter_field(seed)
    body = [f'<rect width="{W}" height="{H}" fill="{PAPER}"/>', sides]
    layout = layout_of(page)

    if layout == "logo":
        body.append(stacked_lockup(tagline))
        return svg_doc(body), "logo"

    logo, logo_bottom = lockup(tagline, LOGO_S, LOGO_TOP)
    body.append(logo)

    if layout == "portrait":
        # The portrait card under the lockup, with the same margin at the bottom as at the top.
        top, bottom = logo_bottom + 36, H - LOGO_TOP
        ph = bottom - top
        pw = ph * PORTRAIT_CROP[2] / PORTRAIT_CROP[3]
        body.append(portrait((W - pw) / 2, top, pw, ph))
        return svg_doc(body), f"portrait {pw:.0f}×{ph:.0f}"

    # Headline, centred in the space between the lockup and the domain.
    headline = headline_of(lang, page)
    lines, size = layout_headline(headline)
    lead = size * HEAD_LEAD
    runs = [DISPLAY.run(l, size, HEAD_TRACK) for l in lines]
    cap = runs[0][2]
    top, bottom = logo_bottom + 26, 540
    block_h = cap + lead * (len(lines) - 1)
    y0 = top + (bottom - top - block_h) / 2 + cap
    for i, (d, w, _) in enumerate(runs):
        body.append(path(d, (W - w) / 2, y0 + i * lead, INK))

    # Domain, as the site's live hostname lines: DM Mono, uppercase, orange.
    dom_d, dom_w, dom_cap = MONO.run(DOMAIN.upper(), 22, 0.12)
    body.append(path(dom_d, (W - dom_w) / 2, 578, ACCENT))
    return svg_doc(body), f"{size}px  {' / '.join(lines)}"


def with_title(png, title):
    """Insert an iTXt "Title" chunk after IHDR, so the unit test can tell an image whose text changed."""
    data = b"Title\0\0\0\0\0" + title.encode("utf-8")
    chunk = struct.pack(">I", len(data)) + b"iTXt" + data + struct.pack(">I", zlib.crc32(b"iTXt" + data))
    end = 8 + 25  # signature + IHDR chunk
    return png[:end] + chunk + png[end:]


def main():
    check_sources()
    os.makedirs(OUT, exist_ok=True)
    for lang in UI:
        for page in sorted(PAGES):
            svg, what = card(lang, page)
            png = bytes(resvg_py.svg_to_bytes(svg_string=svg, width=W))
            dest = os.path.join(OUT, f"{lang}-{page}.png")
            with open(dest, "wb") as f:
                f.write(png)
            if len(png) > MAX_BYTES:  # photos (the work card's screenshots, the portrait) are heavy: quantise
                if not shutil.which("pngquant"):
                    sys.exit(f"{dest} is {len(png) // 1024} KB: install pngquant (brew install pngquant) to shrink it")
                subprocess.run(["pngquant", "--force", "--skip-if-larger", "--quality", "80-98",
                                "--output", dest, dest], check=True)
                png = open(dest, "rb").read()
            png = with_title(png, title_of(lang, page))
            with open(dest, "wb") as f:
                f.write(png)
            print(f"{os.path.relpath(dest, ROOT)}  {len(png) / 1024:.0f} KB  {what}")
            if PREVIEW:
                pdir = PREVIEW; os.makedirs(pdir, exist_ok=True)
                small = bytes(resvg_py.svg_to_bytes(svg_string=svg, width=300))
                open(os.path.join(pdir, f"{lang}-{page}-300.png"), "wb").write(small)
                sq = svg.replace(f'viewBox="0 0 {W} {H}" width="{W}" height="{H}"',
                                 f'viewBox="{SQ:.0f} 0 {H} {H}" width="{H}" height="{H}"')
                open(os.path.join(pdir, f"{lang}-{page}-square.png"), "wb").write(
                    bytes(resvg_py.svg_to_bytes(svg_string=sq, width=300)))


if __name__ == "__main__":
    main()
