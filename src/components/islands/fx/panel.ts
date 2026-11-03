/**
 * FX panel: dev-only (`pnpm dev`) controls for picking effect variants live.
 *
 * - Chips switch a slot's variant (re-mounts it); sliders tune its params live.
 * - Choices persist in localStorage and in the `?fx=` URL param, so a combination
 *   can be bookmarked or shared with another dev session.
 * - "Save as default" POSTs the config to the dev server (see `fxSavePlugin` in
 *   astro.config.mjs), which rewrites `src/data/effects.ts`.
 * - Alt+F shows / hides the panel.
 *
 * Never shipped: BaseLayout imports it behind `import.meta.env.DEV`.
 */
import { effects } from '../../../data/effects';
import {
  defaultParams,
  fxRegistry,
  fxSlots,
  resolveConfig,
  variantSpec,
  type FxConfig,
  type FxSlot,
  type SlotSpec,
} from '../../../data/effects-registry';
import {
  applyConfig,
  encodeConfig,
  getConfig,
  hostsFor,
  replay,
  STORAGE_KEY,
  URL_PARAM,
} from './runtime';

import { el, PANEL_CSS } from './panel-ui';

const OPEN_KEY = 'fx-panel-open';
const saved = resolveConfig(effects, effects);
const same = (a: FxConfig, b: FxConfig) => JSON.stringify(a) === JSON.stringify(b);

function persist(config: FxConfig) {
  const url = new URL(location.href);
  try {
    if (same(config, saved)) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* storage unavailable: the URL still carries the state */
  }
  if (same(config, saved)) url.searchParams.delete(URL_PARAM);
  else url.searchParams.set(URL_PARAM, encodeConfig(config));
  history.replaceState(history.state, '', url);
}

function build() {
  document.head.append(el('style', { textContent: PANEL_CSS }));
  const root = el('div', { className: 'fxp' });
  const body = el('div', { className: 'fxp-body' });
  const toggle = el('button', { type: 'button', className: 'fxp-toggle', textContent: 'FX' });
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
    try {
      localStorage.setItem(OPEN_KEY, open ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const showStatus = (next: FxConfig) => {
    const dirty = !same(next, saved);
    toggle.classList.toggle('is-dirty', dirty);
    status.textContent = dirty ? 'Unsaved: differs from effects.ts' : 'Matches effects.ts';
    saveBtn.disabled = resetBtn.disabled = !dirty;
  };

  const commit = (next: FxConfig, rerender = false) => {
    applyConfig(next);
    persist(next);
    showStatus(next);
    if (rerender) render();
  };

  const render = () => {
    const config = getConfig();
    body.replaceChildren();
    // Slots on this page first; the rest stay pickable below.
    const here = (slot: FxSlot) => (hostsFor(slot).length > 0 ? 0 : 1);
    for (const slot of [...fxSlots].sort((x, y) => here(x) - here(y))) {
      body.append(renderSlot(slot, config));
    }
    body.append(el('div', { className: 'fxp-foot' }, status, saveBtn, resetBtn, linkBtn));
  };

  const renderSlot = (slot: FxSlot, config: FxConfig) => {
    const spec: SlotSpec = fxRegistry[slot];
    const current = config[slot];
    const here = hostsFor(slot).length > 0;
    const head = el('div', { className: 'fxp-head' }, spec.label);
    // Slots on other pages stay pickable (the choice persists) but show where they live.
    if (!here) head.append(el('span', { className: 'fxp-where', textContent: spec.where }));
    if (spec.replayable && here) {
      head.append(
        el('button', {
          type: 'button',
          className: 'fxp-link',
          textContent: 'Replay',
          onclick: () => replay(slot),
        }),
      );
    }
    const chips = el('div', { className: 'fxp-chips' });
    for (const [id, v] of Object.entries(spec.variants)) {
      const chip = el('button', {
        type: 'button',
        className: 'fxp-chip',
        textContent: v.label,
        onclick: () =>
          commit(
            { ...getConfig(), [slot]: { variant: id, params: defaultParams(slot, id) } },
            true,
          ),
      });
      chip.setAttribute('aria-pressed', String(id === current.variant));
      chips.append(chip);
    }
    const section = el(
      'section',
      { className: `fxp-slot${here ? '' : ' is-absent'}` },
      head,
      chips,
    );
    if (!here) return section;
    for (const [key, p] of Object.entries(variantSpec(slot, current.variant)?.params ?? {})) {
      const out = el('output', { textContent: String(current.params[key]) });
      const input = el('input', {
        type: 'range',
        min: String(p.min),
        max: String(p.max),
        step: String(p.step),
        value: String(current.params[key]),
        oninput: () => {
          out.textContent = input.value;
          const cfg = getConfig();
          commit({
            ...cfg,
            [slot]: { ...cfg[slot], params: { ...cfg[slot].params, [key]: Number(input.value) } },
          });
        },
      });
      input.setAttribute('aria-label', `${spec.label} ${p.label}`);
      section.append(el('label', { className: 'fxp-param' }, p.label, input, out));
    }
    return section;
  };

  saveBtn.onclick = async () => {
    const config = getConfig();
    saveBtn.disabled = true;
    status.textContent = 'Saving…';
    try {
      const res = await fetch('/__fx/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(await res.text());
      // effects.ts now holds this config; drop the overrides. Vite reloads the page.
      localStorage.removeItem(STORAGE_KEY);
      const url = new URL(location.href);
      url.searchParams.delete(URL_PARAM);
      history.replaceState(history.state, '', url);
      status.textContent = 'Saved to src/data/effects.ts';
    } catch (err) {
      status.textContent = `Save failed: ${(err as Error).message}`;
      saveBtn.disabled = false;
    }
  };
  resetBtn.onclick = () => commit(saved, true);
  linkBtn.onclick = async () => {
    await navigator.clipboard.writeText(location.href);
    linkBtn.textContent = 'Copied';
    setTimeout(() => (linkBtn.textContent = 'Copy link'), 1200);
  };
  toggle.onclick = () => setOpen(Boolean(body.hidden));
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyF') {
      e.preventDefault();
      setOpen(Boolean(body.hidden));
    }
  });

  root.append(body, toggle);
  document.body.append(root);
  let open = true;
  try {
    open = localStorage.getItem(OPEN_KEY) !== '0';
  } catch {
    /* ignore */
  }
  setOpen(open);
  render();
  showStatus(getConfig());
}

build();
