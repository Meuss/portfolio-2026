"""Build the print files for the business card (layout K2 "Noir": black on both sides).

Usage: python build_cards.py [--bleed MM]
Writes print/business-card-{front,back}.pdf, print/business-card.pdf (both sides, two pages)
and print/preview-{front,back}.png.

The PDFs are vector and CMYK, with every letter outlined (no fonts embedded). The page is the card plus
the bleed on every side; TrimBox marks the cut. The default bleed, 1.5 mm, is Vistaprint's for the
85 × 55 mm card (88 × 58 mm file); most other printers want 3 mm (--bleed 3, 91 × 61 mm).
Layout and copy come from explorations/05-business-cards.html (K2); the logo is the kit's two-line
lockup from build_kit.py, drawn with the same geometry.
"""
import io, math, os, sys, zlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
import resvg_py

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "print")
BLEED = float(sys.argv[sys.argv.index("--bleed") + 1]) if "--bleed" in sys.argv else 1.5
W, H = 85.0, 55.0          # Swiss standard card, mm
PAD = 5.5                  # inner margin, mm (well inside any printer's safe zone)

# Colours: (screen RGB for the preview, CMYK 0–1 for print).
# Rich black for the large solid; orange is Pantone 1585 C's CMYK bridge; white is no ink (knockout).
INK = {
    "black":  ("#121212", (0.60, 0.40, 0.40, 1.00)),
    "orange": ("#ff6a13", (0.00, 0.61, 0.97, 0.00)),
    "white":  ("#ffffff", (0.00, 0.00, 0.00, 0.00)),
    "grey":   ("#a3a39e", (0.00, 0.00, 0.04, 0.42)),
}

# Copy (French, like the clients).
TAGLINE = "DÉVELOPPEUR WEB · BULLE"
ROLE = "DÉVELOPPEUR WEB FREELANCE"
DETAILS = [("SITE", "thomasmiller.ch"), ("E-MAIL", "contact@thomasmiller.ch"),
           ("TÉL.", "+41 79 560 20 71"), ("LIEU", "Bulle")]


# ---------- geometry: paths as lists of ops in mm, y down ----------
class Recorder(BasePen):
    def __init__(self, glyphset=None):
        super().__init__(glyphset); self.ops = []
    def _moveTo(self, p): self.ops.append(("M", *p))
    def _lineTo(self, p): self.ops.append(("L", *p))
    def _curveToOne(self, a, b, c): self.ops.append(("C", *a, *b, *c))
    def _closePath(self): self.ops.append(("Z",))
    _endPath = _closePath


def arc_ops(cx, cy, r, start_deg, sweep_deg, pieces=4):
    """Circular arc as cubic Béziers (PDF has no arc operator)."""
    step = math.radians(sweep_deg) / pieces
    k = 4 / 3 * math.tan(step / 4)
    a = math.radians(start_deg)
    ops = [("M", cx + r * math.cos(a), cy + r * math.sin(a))]
    for _ in range(pieces):
        b = a + step
        p0 = (cx + r * math.cos(a), cy + r * math.sin(a))
        p3 = (cx + r * math.cos(b), cy + r * math.sin(b))
        p1 = (p0[0] - k * r * math.sin(a), p0[1] + k * r * math.cos(a))
        p2 = (p3[0] + k * r * math.sin(b), p3[1] - k * r * math.cos(b))
        ops.append(("C", *p1, *p2, *p3)); a = b
    return ops


def mark(x, y, size, ring, peaks):
    """The kit symbol (64 grid): ring open at the top, the tall peak breaking out. Same numbers as build_kit.py."""
    k = size / 64
    t = lambda ops: [(o[0], *[v * k + (x if i % 2 == 0 else y) for i, v in enumerate(o[1:])]) for o in ops]
    ring_ops = t(arc_ops(32, 34, 25, -62, 288.8))
    pts = [(17, 45), (25.5, 30), (31, 38), (38.5, 7), (47.5, 45)]
    peak_ops = t([("M", *pts[0])] + [("L", *p) for p in pts[1:]])
    return [("stroke", ring, 6 * k, ring_ops), ("stroke", peaks, 5 * k, peak_ops)]


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
        self.cap = self.tt["OS/2"].sCapHeight / self.upm
        self.hb = hb.Font(hb.Face(hb.Blob(data)))

    def _shape(self, text, features):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.hb, buf, {"kern": True, "liga": True, **features})
        return buf

    def width(self, text, size, track=0.0, features={}):
        buf = self._shape(text, features)
        adv = sum(p.x_advance for p in buf.glyph_positions) + track * self.upm * (len(buf.glyph_infos) - 1)
        return adv * size / self.upm

    def draw(self, text, size, x, y, colour, track=0.0, features={}):
        """Outlined text with its baseline at (x, y), size in mm. Returns a fill item."""
        buf = self._shape(text, features)
        s, rec, pen_x = size / self.upm, Recorder(self.gs), 0.0
        n = len(buf.glyph_infos)
        for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
            tp = TransformPen(rec, (s, 0, 0, -s, x + (pen_x + pos.x_offset) * s, y - pos.y_offset * s))
            self.gs[self.order[info.codepoint]].draw(tp)
            pen_x += pos.x_advance + (track * self.upm if i < n - 1 else 0)
        return ("fill", colour, None, rec.ops)


NAME = Face(os.path.join(HERE, "fonts/SchibstedGrotesk.ttf"), {"wght": 800})
BODY = Face(os.path.join(HERE, "fonts/SchibstedGrotesk.ttf"), {"wght": 500})
MONO = Face(os.path.join(HERE, "fonts/DMMono-Medium.ttf"))
NAME_TRACK, MONO_TRACK = -0.04, 0.12


def by_cap(face, cap_mm):
    """Font size giving this cap height."""
    return cap_mm / face.cap


# ---------- the two sides (mm, origin at the top-left of the trimmed card) ----------
def front():
    """Recto: the kit's two-line lockup with tagline, centred. Proportions from build_kit.two_lines()."""
    sym = 20.0
    u = sym / 64                                   # kit px -> mm
    gap, lead, tag_gap = 15 * u, 7 * u, 7.5 * u
    name_size = by_cap(NAME, 25 * 0.686 * u)
    tag_size = 6.2 * u
    cap = NAME.cap * name_size
    tag_cap = MONO.cap * tag_size
    text_w = max(NAME.width("Thomas", name_size, NAME_TRACK), NAME.width("Miller", name_size, NAME_TRACK),
                 MONO.width(TAGLINE, tag_size, MONO_TRACK))
    lock_w = sym + gap + text_w
    x0, y0 = (W - lock_w) / 2, (H - sym) / 2
    block = cap + lead + cap + tag_gap + tag_cap
    b1 = y0 + (sym - block) / 2 + cap
    b2 = b1 + lead + cap
    tx = x0 + sym + gap
    return (mark(x0, y0, sym, "orange", "white") + [
        NAME.draw("Thomas", name_size, tx, b1, "white", NAME_TRACK),
        NAME.draw("Miller", name_size, tx, b2, "white", NAME_TRACK),
        MONO.draw(TAGLINE, tag_size, tx, b2 + tag_gap + tag_cap, "grey", MONO_TRACK),
    ])


def back():
    """Verso: name and role top left, symbol top right, contact details at the bottom."""
    items = []
    name_size, role_size = 4.8, 1.9
    b_name = PAD + NAME.cap * name_size
    items.append(NAME.draw("Thomas Miller", name_size, PAD, b_name, "white", NAME_TRACK))
    items.append(MONO.draw(ROLE, role_size, PAD, b_name + 2.4 + MONO.cap * role_size, "grey", MONO_TRACK))
    sym = 8.0
    # align the top of the peak's round cap (y 4.5 on the 64 grid) with the top of the name
    items += mark(W - PAD - sym, PAD - 4.5 / 64 * sym, sym, "orange", "white")

    label_size, value_size, pitch = 1.75, 2.45, 4.3
    label_w = max(MONO.width(l, label_size, 0.1) for l, _ in DETAILS)
    vx = PAD + label_w + 3.0
    last = H - PAD
    for i, (label, value) in enumerate(DETAILS):
        base = last - (len(DETAILS) - 1 - i) * pitch
        items.append(MONO.draw(label, label_size, PAD, base, "orange", 0.1))
        items.append(BODY.draw(value, value_size, vx, base, "white"))
    return items


# ---------- output ----------
def page_items(side_items):
    """Shift to the bleed origin and put the black ground under everything, out to the bleed edge."""
    mw, mh = W + 2 * BLEED, H + 2 * BLEED
    ground = ("fill", "black", None, [("M", 0, 0), ("L", mw, 0), ("L", mw, mh), ("L", 0, mh), ("Z",)])
    moved = []
    for kind, colour, width, ops in side_items:
        moved.append((kind, colour, width,
                      [(o[0], *[v + BLEED for v in o[1:]]) for o in ops]))
    return [ground] + moved


def svg_doc(items, crop_to_trim=False):
    mw, mh = W + 2 * BLEED, H + 2 * BLEED
    vb = f"{BLEED} {BLEED} {W} {H}" if crop_to_trim else f"0 0 {mw} {mh}"
    vw, vh = (W, H) if crop_to_trim else (mw, mh)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{vw * 10:g}" height="{vh * 10:g}">']
    for kind, colour, width, ops in items:
        d = " ".join(o[0] + " ".join(f"{v:.3f}" for v in o[1:]) for o in ops)
        rgb = INK[colour][0]
        if kind == "fill":
            out.append(f'<path d="{d}" fill="{rgb}"/>')
        else:
            out.append(f'<path d="{d}" fill="none" stroke="{rgb}" stroke-width="{width:.3f}" '
                       f'stroke-linecap="round" stroke-linejoin="round"/>')
    out.append("</svg>")
    return "\n".join(out)


PT = 72 / 25.4


def pdf_stream(items):
    mh = H + 2 * BLEED
    f = lambda v: f"{v:.3f}".rstrip("0").rstrip(".")
    xy = lambda x, y: f"{f(x * PT)} {f((mh - y) * PT)}"
    out = ["1 J 1 j"]
    for kind, colour, width, ops in items:
        c, m, y, k = INK[colour][1]
        col = f"{f(c)} {f(m)} {f(y)} {f(k)}"
        out.append(f"{col} k" if kind == "fill" else f"{col} K {f(width * PT)} w")
        for o in ops:
            if o[0] == "M": out.append(xy(*o[1:]) + " m")
            elif o[0] == "L": out.append(xy(*o[1:]) + " l")
            elif o[0] == "C": out.append(" ".join(xy(o[i], o[i + 1]) for i in (1, 3, 5)) + " c")
            elif o[0] == "Z": out.append("h")
        out.append("f" if kind == "fill" else "S")
    return "\n".join(out).encode()


def write_pdf(path, pages):
    mw, mh = (W + 2 * BLEED) * PT, (H + 2 * BLEED) * PT
    trim = f"[{BLEED * PT:.3f} {BLEED * PT:.3f} {(W + BLEED) * PT:.3f} {(H + BLEED) * PT:.3f}]"
    objs = [None, None]  # 1 catalog, 2 pages
    kids = []
    for content in pages:
        data = zlib.compress(content, 9)
        objs.append(f"<< /Length {len(data)} /Filter /FlateDecode >>\nstream\n".encode() + data + b"\nendstream")
        cid = len(objs)
        objs.append(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {mw:.3f} {mh:.3f}] /BleedBox [0 0 {mw:.3f} {mh:.3f}] "
                    f"/TrimBox {trim} /Resources << >> /Contents {cid} 0 R >>".encode())
        kids.append(len(objs))
    objs[0] = b"<< /Type /Catalog /Pages 2 0 R >>"
    objs[1] = f"<< /Type /Pages /Kids [{' '.join(f'{k} 0 R' for k in kids)}] /Count {len(kids)} >>".encode()
    objs.append(b"<< /Title (Thomas Miller - carte de visite) /Producer (brand/build_cards.py) >>")
    info = len(objs)
    buf = io.BytesIO(); buf.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for i, o in enumerate(objs, 1):
        offsets.append(buf.tell()); buf.write(f"{i} 0 obj\n".encode() + o + b"\nendobj\n")
    xref = buf.tell()
    buf.write(f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode())
    for off in offsets:
        buf.write(f"{off:010d} 00000 n \n".encode())
    buf.write(f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R /Info {info} 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
    with open(path, "wb") as fh:
        fh.write(buf.getvalue())


os.makedirs(OUT, exist_ok=True)
sides = {"front": page_items(front()), "back": page_items(back())}
for name, items in sides.items():
    write_pdf(os.path.join(OUT, f"business-card-{name}.pdf"), [pdf_stream(items)])
    png = resvg_py.svg_to_bytes(svg_string=svg_doc(items, crop_to_trim=True), width=1700)
    with open(os.path.join(OUT, f"preview-{name}.png"), "wb") as fh:
        fh.write(bytes(png))
write_pdf(os.path.join(OUT, "business-card.pdf"), [pdf_stream(sides["front"]), pdf_stream(sides["back"])])
print(f"done: {W + 2 * BLEED:g} × {H + 2 * BLEED:g} mm pages (bleed {BLEED:g} mm) in {OUT}")
