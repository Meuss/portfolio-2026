/**
 * Brand panel: dev-only (`pnpm dev`, bottom-right) controls for trying the
 * palette, the display / body fonts and the logo (lockup, font, weight,
 * tracking, size) live on the real pages.
 *
 * - A choice overrides the tokens inline on <html> (what BaseLayout does at
 *   build time for `src/data/brand.ts`) and re-mounts the effects, whose
 *   canvases read their colours at mount.
 * - Choices persist in localStorage (re-applied before paint by an inline
 *   script in BaseLayout, so navigating doesn't flash) and in `?brand=`, so a
 *   combination can be bookmarked or shared.
 * - "Save as default" POSTs to the dev server (`brandSavePlugin` in
 *   astro.config.mjs), which rewrites `src/data/brand.ts`.
 * - Alt+B shows / hides the panel.
 *
 * Never shipped: BaseLayout imports it behind `import.meta.env.DEV`.
 */
import { brand } from '../../../data/brand';
import {
  brandAttrs,
  brandVars,
  fonts,
  lockups,
  logoRanges,
  palettes,
  resolveBrand,
  textFonts,
  type BrandConfig,
  type FontId,
  type LogoRangeKey,
} from '../../../data/brand-registry';
import { remountAll } from '../fx/runtime';
import { el, PANEL_CSS } from '../fx/panel-ui';

const STORAGE_KEY = 'brand-config';
/** Resolved vars + attrs, read by BaseLayout's pre-paint inline script. */
const APPLIED_KEY = 'brand-applied';
const OPEN_KEY = 'brand-panel-open';
const URL_PARAM = 'brand';

const saved = resolveBrand(brand, brand);
const same = (a: BrandConfig, b: BrandConfig) => JSON.stringify(a) === JSON.stringify(b);

const encode = (c: BrandConfig) =>
  btoa(JSON.stringify(c)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const decode = (v: string): unknown => {
  try {
    return JSON.parse(atob(v.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: the URL still carries the state */
    }
  },
};

/** `?brand=` beats localStorage beats `brand.ts`. */
function initialConfig(): BrandConfig {
  const fromUrl = new URLSearchParams(location.search).get(URL_PARAM);
  if (fromUrl) return resolveBrand(decode(fromUrl), saved);
  const stored = store.get(STORAGE_KEY);
  if (stored) return resolveBrand(decode(stored), saved);
  return saved;
}

let config = initialConfig();

function apply(next: BrandConfig, remount: boolean) {
  const root = document.documentElement;
  const vars = brandVars(next);
  const attrs = brandAttrs(next);
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  for (const [k, v] of Object.entries(attrs)) root.setAttribute(k, v);
  config = next;

  const url = new URL(location.href);
  if (same(next, saved)) {
    store.set(STORAGE_KEY, null);
    store.set(APPLIED_KEY, null);
    url.searchParams.delete(URL_PARAM);
  } else {
    store.set(STORAGE_KEY, encode(next));
    store.set(APPLIED_KEY, JSON.stringify({ vars, attrs }));
    url.searchParams.set(URL_PARAM, encode(next));
  }
  history.replaceState(history.state, '', url);

  // Effects read colours and measure glyphs at mount: re-mount once new faces are in.
  if (remount) requestAnimationFrame(() => document.fonts.ready.then(remountAll));
}

function build() {
  document.head.append(el('style', { textContent: PANEL_CSS }));
  const root = el('div', { className: 'fxp fxp--right' });
  const body = el('div', { className: 'fxp-body' });
  const toggle = el('button', { type: 'button', className: 'fxp-toggle', textContent: 'Brand' });
  toggle.setAttribute('aria-expanded', 'false');
  const status = el('p', { className: 'fxp-status' });
  const saveBtn = el('button', {
    type: 'button',
    className: 'fxp-action fxp-action--primary',
    textContent: 'Save as default',
  });
  const resetBtn = el('button', { type: 'button', className: 'fxp-action', textContent: 'Reset' });
  const linkBtn = el('button', {
    type: 'button',
    className: 'fxp-action',
    textContent: 'Copy link',
  });

  const setOpen = (open: boolean) => {
    body.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    store.set(OPEN_KEY, open ? '1' : '0');
  };

  const showStatus = () => {
    const dirty = !same(config, saved);
    toggle.classList.toggle('is-dirty', dirty);
    status.textContent = dirty ? 'Unsaved: differs from brand.ts' : 'Matches brand.ts';
    saveBtn.disabled = resetBtn.disabled = !dirty;
  };

  const commit = (next: BrandConfig, { remount = false, rerender = true } = {}) => {
    apply(next, remount);
    showStatus();
    if (rerender) render();
  };

  const chips = <T extends string>(
    options: [T, string][],
    current: T,
    onPick: (id: T) => void,
    decorate?: (chip: HTMLButtonElement, id: T) => void,
  ) => {
    const wrap = el('div', { className: 'fxp-chips' });
    for (const [id, label] of options) {
      const chip = el('button', {
        type: 'button',
        className: 'fxp-chip',
        textContent: label,
        onclick: () => onPick(id),
      });
      chip.setAttribute('aria-pressed', String(id === current));
      decorate?.(chip, id);
      wrap.append(chip);
    }
    return wrap;
  };

  const section = (label: string, ...children: Node[]) =>
    el(
      'section',
      { className: 'fxp-slot' },
      el('div', { className: 'fxp-head' }, label),
      ...children,
    );

  // Font chips are set in their own face, so the choice previews itself.
  const inFont = (chip: HTMLButtonElement, id: FontId) => {
    chip.style.fontFamily = fonts[id].stack;
    chip.style.textTransform = 'none';
    chip.style.letterSpacing = '0';
    chip.style.fontSize = '0.8rem';
  };

  const fontChips = (ids: readonly FontId[], current: FontId, onPick: (id: FontId) => void) =>
    chips(
      ids.map((id) => [id, fonts[id].label]),
      current,
      onPick,
      inFont,
    );

  const render = () => {
    const c = config;
    body.replaceChildren();

    body.append(
      section(
        'Palette',
        chips(
          Object.entries(palettes).map(([id, p]) => [id as BrandConfig['palette'], p.label]),
          c.palette,
          (palette) => commit({ ...c, palette }, { remount: true }),
          (chip, id) => {
            const { paper, accent, gilt } = palettes[id].colors;
            // Prepended, so the dots read paper · accent · gilt.
            for (const colour of [gilt, accent, paper]) {
              const dot = el('span', { className: 'fxp-swatch' });
              dot.style.background = colour;
              dot.style.marginRight = '0.15rem';
              chip.prepend(dot);
            }
          },
        ),
      ),
      section(
        'Headings',
        fontChips(textFonts, c.display, (display) =>
          commit({ ...c, display: display as BrandConfig['display'] }, { remount: true }),
        ),
      ),
      section(
        'Body text',
        fontChips(textFonts, c.body, (body) =>
          commit({ ...c, body: body as BrandConfig['body'] }, { remount: true }),
        ),
      ),
    );

    const logo = section(
      'Logo',
      chips(
        Object.entries(lockups).map(([id, l]) => [id as BrandConfig['logo']['lockup'], l.label]),
        c.logo.lockup,
        (lockup) => commit({ ...c, logo: { ...c.logo, lockup } }, { remount: true }),
      ),
      el('div', { className: 'fxp-where fxp-sub', textContent: 'Font' }),
      fontChips(Object.keys(fonts) as FontId[], c.logo.font, (font) =>
        commit({ ...c, logo: { ...c.logo, font } }, { remount: true }),
      ),
    );
    for (const [key, r] of Object.entries(logoRanges) as [
      LogoRangeKey,
      (typeof logoRanges)[LogoRangeKey],
    ][]) {
      const out = el('output', { textContent: String(c.logo[key]) });
      const input = el('input', {
        type: 'range',
        min: String(r.min),
        max: String(r.max),
        step: String(r.step),
        value: String(c.logo[key]),
        oninput: () => {
          out.textContent = input.value;
          commit(
            { ...config, logo: { ...config.logo, [key]: Number(input.value) } },
            { rerender: false },
          );
        },
        // Settled: let the logo effect re-measure.
        onchange: () => remountAll(),
      });
      input.setAttribute('aria-label', `Logo ${r.label}`);
      logo.append(el('label', { className: 'fxp-param' }, r.label, input, out));
    }
    body.append(logo, el('div', { className: 'fxp-foot' }, status, saveBtn, resetBtn, linkBtn));
  };

  saveBtn.onclick = async () => {
    saveBtn.disabled = true;
    status.textContent = 'Saving…';
    try {
      const res = await fetch('/__brand/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(await res.text());
      // brand.ts now holds this choice; drop the overrides. Vite reloads the page.
      store.set(STORAGE_KEY, null);
      store.set(APPLIED_KEY, null);
      const url = new URL(location.href);
      url.searchParams.delete(URL_PARAM);
      history.replaceState(history.state, '', url);
      status.textContent = 'Saved to src/data/brand.ts';
    } catch (err) {
      status.textContent = `Save failed: ${(err as Error).message}`;
      saveBtn.disabled = false;
    }
  };
  resetBtn.onclick = () => commit(saved, { remount: true });
  linkBtn.onclick = async () => {
    await navigator.clipboard.writeText(location.href);
    linkBtn.textContent = 'Copied';
    setTimeout(() => (linkBtn.textContent = 'Copy link'), 1200);
  };
  toggle.onclick = () => setOpen(Boolean(body.hidden));
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyB') {
      e.preventDefault();
      setOpen(Boolean(body.hidden));
    }
  });

  root.append(body, toggle);
  document.body.append(root);
  setOpen(store.get(OPEN_KEY) === '1');
  render();
  showStatus();
}

// A `?brand=` link isn't covered by the pre-paint script: apply it now.
if (!same(config, saved)) apply(config, true);
build();
