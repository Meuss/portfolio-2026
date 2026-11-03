"""Build the Thomas Miller logo kit (R3 "Sommet qui perce", Schibsted Grotesk ExtraBold, black/white/orange).

Usage: python build_kit.py <output-dir>
Outputs outlined SVGs (no fonts needed) and PNGs.
"""
import io, math, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
import resvg_py

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]

ORANGE, BLACK, WHITE = "#ff6a13", "#121212", "#ffffff"
GREY, LIGHT_GREY, ON_ORANGE_SOFT = "#6b6b67", "#a3a39e", "#5f2e12"
NAME_LINES, TAGLINE = ("Thomas", "Miller"), "DÉVELOPPEUR WEB · BULLE"


# ---------- the mark (64×64 grid) ----------
def arc_path(cx, cy, r, start_deg, sweep_deg):
    a0, a1 = math.radians(start_deg), math.radians(start_deg + sweep_deg)
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    large = 1 if sweep_deg > 180 else 0
    return f"M{x0:.2f} {y0:.2f} A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}"

# Ring: open at the top, the gap centred just left of 12 o'clock. Peaks: the tall one breaks out through it.
RING = arc_path(32, 34, 25, -62, 288.8)
PEAKS = "M17 45 L25.5 30 L31 38 L38.5 7 L47.5 45"


def mark(x, y, size, ring, peaks, cls=""):
    k = size / 64
    c = f' class="{cls}"' if cls else ""
    return (f'<g transform="translate({x:.2f} {y:.2f}) scale({k:.4f})" fill="none" '
            f'stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{RING}" stroke="{ring}" stroke-width="6"/>'
            f'<path{c} d="{PEAKS}" stroke="{peaks}" stroke-width="5"/></g>')


# ---------- type ----------
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


NAME_FACE = Face(os.path.join(HERE, "fonts/SchibstedGrotesk.ttf"), {"wght": 800})
NAME_TRACK = -0.04
TAG_FACE = Face(os.path.join(HERE, "fonts/DMMono-Medium.ttf"))


def name_size(cap_px):
    """Font size that gives the name this cap height, so layouts keep their proportions."""
    return cap_px * NAME_FACE.upm / NAME_FACE.cap

# Cap heights of the original Archivo Expanded build (25px and 30px at cap 0.686 em).
NAME_CAP, STACK_CAP = 25 * 0.686, 30 * 0.686


def text(d, x, y, fill):
    return f'<path transform="translate({x:.2f} {y:.2f})" d="{d}" fill="{fill}"/>'


def svg(w, h, body, bg=None, title="Thomas Miller", style=""):
    bgr = f'<rect width="{w:.2f}" height="{h:.2f}" fill="{bg}"/>' if bg else ""
    st = f"<style>{style}</style>" if style else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{st}{bgr}{body}</svg>\n')


# Colour schemes: ring, peaks, name, tagline, background (backed PNGs / previews only)
SCHEMES = {
    "color":  dict(ring=ORANGE, peaks=BLACK, name=BLACK, tag=GREY, bg=WHITE),
    "dark":   dict(ring=ORANGE, peaks=WHITE, name=WHITE, tag=LIGHT_GREY, bg=BLACK),
    "orange": dict(ring=WHITE, peaks=BLACK, name=BLACK, tag=ON_ORANGE_SOFT, bg=ORANGE),
    "black":  dict(ring=BLACK, peaks=BLACK, name=BLACK, tag=BLACK, bg=WHITE),
    "white":  dict(ring=WHITE, peaks=WHITE, name=WHITE, tag=WHITE, bg=BLACK),
}

M, PAD = 64, 4
L1 = NAME_FACE.run(NAME_LINES[0], name_size(NAME_CAP), NAME_TRACK)
L2 = NAME_FACE.run(NAME_LINES[1], name_size(NAME_CAP), NAME_TRACK)
ONE = NAME_FACE.run(" ".join(NAME_LINES), name_size(NAME_CAP), NAME_TRACK)
TAG = TAG_FACE.run(TAGLINE, 6.2, 0.12)
CAP = L1[2]


def two_lines(c, tagline=True):
    """Primary logo: mark + Thomas / Miller (+ tagline)."""
    gap, lead, tag_gap = 15, 7, 7.5
    x0 = PAD + M + gap
    tag_cap = TAG[2] if tagline else 0
    block = CAP + lead + CAP + (tag_gap + tag_cap if tagline else 0)
    top = PAD + (M - block) / 2
    b1 = top + CAP
    b2 = b1 + lead + CAP
    body = mark(PAD, PAD, M, c["ring"], c["peaks"]) + text(L1[0], x0, b1, c["name"]) + text(L2[0], x0, b2, c["name"])
    w = x0 + max(L1[1], L2[1], TAG[1] if tagline else 0) + PAD
    if tagline:
        body += text(TAG[0], x0, b2 + tag_gap + TAG[2], c["tag"])
    return w, M + 2 * PAD, body


def one_line(c):
    """Compact header logo: mark + Thomas Miller on one line."""
    gap = 12
    x0 = PAD + M * 0.75 + gap
    h = M * 0.75
    body = mark(PAD, PAD, h, c["ring"], c["peaks"]) + text(ONE[0], x0, PAD + (h + CAP) / 2, c["name"])
    return x0 + ONE[1] + PAD, h + 2 * PAD, body


def stacked(c):
    mk = 88
    n1 = NAME_FACE.run(NAME_LINES[0], name_size(STACK_CAP), NAME_TRACK)
    n2 = NAME_FACE.run(NAME_LINES[1], name_size(STACK_CAP), NAME_TRACK)
    tg = TAG_FACE.run(TAGLINE, 9, 0.12)
    w = max(n1[1], n2[1], tg[1], mk) + 2 * PAD
    b1 = PAD + mk + 16 + n1[2]
    b2 = b1 + 8 + n2[2]
    b3 = b2 + 10 + tg[2]
    body = (mark((w - mk) / 2, PAD, mk, c["ring"], c["peaks"]) +
            text(n1[0], (w - n1[1]) / 2, b1, c["name"]) + text(n2[0], (w - n2[1]) / 2, b2, c["name"]) +
            text(tg[0], (w - tg[1]) / 2, b3, c["tag"]))
    return w, b3 + PAD + 2, body


def write(rel, content):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as f: f.write(content)


def png(svg_src, rel, width):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "wb") as f: f.write(bytes(resvg_py.svg_to_bytes(svg_string=svg_src, width=width)))


# ---------- logos ----------
for scheme, c in SCHEMES.items():
    for kind, fn, px in [("logo", lambda c: two_lines(c, True), 1600),
                         ("logo-no-tagline", lambda c: two_lines(c, False), 1600),
                         ("logo-one-line", one_line, 1600),
                         ("logo-stacked", stacked, 1000)]:
        w, h, body = fn(c)
        s = svg(w, h, body)
        write(f"svg/{kind}-{scheme}.svg", s); png(s, f"png/{kind}-{scheme}.png", px)

# ---------- symbol alone (transparent) ----------
for scheme, c in SCHEMES.items():
    s = svg(64, 64, mark(0, 0, 64, c["ring"], c["peaks"]), title="Thomas Miller")
    write(f"svg/symbol-{scheme}.svg", s); png(s, f"png/symbol-{scheme}.png", 1024)

# ---------- app icons: symbol on a rounded square ----------
ICONS = {"black": (BLACK, ORANGE, WHITE), "orange": (ORANGE, WHITE, BLACK), "white": (WHITE, ORANGE, BLACK)}
for nm, (bg, ring, peaks) in ICONS.items():
    body = f'<rect width="64" height="64" rx="14" fill="{bg}"/>' + mark(9, 8, 46, ring, peaks)
    s = svg(64, 64, body, title="Thomas Miller")
    write(f"svg/icon-{nm}.svg", s); png(s, f"png/icon-{nm}.png", 1024)

# ---------- avatars: circle SVG + full-bleed square PNG ----------
for nm, (bg, ring, peaks) in ICONS.items():
    inner = mark(13, 12, 38, ring, peaks)
    circ = svg(64, 64, f'<circle cx="32" cy="32" r="32" fill="{bg}"/>' + inner, title="Thomas Miller")
    full = svg(64, 64, inner, bg=bg, title="Thomas Miller")
    write(f"avatar/avatar-{nm}-circle.svg", circ); png(circ, f"avatar/avatar-{nm}-circle.png", 1024)
    write(f"avatar/avatar-{nm}-square.svg", full); png(full, f"avatar/avatar-{nm}-square.png", 1024)

# ---------- favicons ----------
# SVG favicon adapts to the browser theme: black peaks on light tabs, white peaks on dark tabs.
fav = svg(64, 64, mark(0, 0, 64, ORANGE, BLACK, cls="p"), title="Thomas Miller",
          style="@media (prefers-color-scheme: dark){.p{stroke:#ffffff}}")
write("favicon/favicon.svg", fav)
small = svg(64, 64, f'<rect width="64" height="64" rx="12" fill="{BLACK}"/>' + mark(6, 5, 52, ORANGE, WHITE))
for sz in (16, 32, 48):
    png(small, f"favicon/favicon-{sz}.png", sz)
bleed = svg(64, 64, mark(11, 10, 42, ORANGE, WHITE), bg=BLACK)
png(bleed, "favicon/apple-touch-icon.png", 180)
png(bleed, "favicon/icon-192.png", 192)
png(bleed, "favicon/icon-512.png", 512)
png(svg(64, 64, mark(16, 15, 32, ORANGE, WHITE), bg=BLACK), "favicon/icon-maskable-512.png", 512)


# ---------- social ----------
def social(w, h, scheme, rel, scale):
    c = SCHEMES[scheme]
    lw, lh, body = two_lines(c, True)
    body = f'<g transform="translate({(w - lw * scale) / 2:.2f} {(h - lh * scale) / 2:.2f}) scale({scale})">{body}</g>'
    s = svg(w, h, body, bg=c["bg"]); write(rel.replace(".png", ".svg"), s); png(s, rel, w)

social(1200, 630, "color", "social/og-image-light.png", 3.4)
social(1200, 630, "dark", "social/og-image-dark.png", 3.4)
social(1200, 630, "orange", "social/og-image-orange.png", 3.4)
social(1584, 396, "dark", "social/linkedin-banner-dark.png", 2.7)

print("done")
