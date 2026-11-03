/**
 * Shared look for the dev-only panels (FX, Brand): one stylesheet and a tiny
 * element helper. Never shipped: only the panels import it.
 */
export const PANEL_CSS = `
.fxp { position: fixed; left: 1rem; bottom: 1rem; z-index: 80; font-family: var(--font-mono);
  font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-ink); }
.fxp button { font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer; }
.fxp-toggle { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.8rem;
  background: var(--color-surface); color: var(--color-ink); border: 1px solid var(--color-line);
  border-radius: var(--radius-sm); }
.fxp-toggle::before { content: ''; width: 0.45rem; height: 0.45rem; border-radius: 50%; background: var(--color-gilt); }
.fxp-toggle.is-dirty::before { background: var(--color-accent); }
.fxp-body { width: 19rem; max-height: min(76vh, 46rem); overflow: auto; margin-bottom: 0.5rem;
  background: color-mix(in srgb, var(--color-paper) 94%, transparent); backdrop-filter: blur(10px);
  border: 1px solid var(--color-line); border-radius: var(--radius-md); }
.fxp-body[hidden] { display: none; }
.fxp-slot { padding: 0.9rem 1rem; border-bottom: 1px solid var(--color-line); }
.fxp-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; color: var(--color-gilt); }
.fxp-slot.is-absent .fxp-head { color: var(--color-muted); }
.fxp-where { color: var(--color-muted); text-transform: none; letter-spacing: 0.02em; }
.fxp-link { background: none; border: 0; padding: 0; color: var(--color-muted); }
.fxp-link:hover { color: var(--color-gilt); }
.fxp-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.fxp-chip { padding: 0.3rem 0.55rem; background: none; color: var(--color-muted);
  border: 1px solid var(--color-line); border-radius: var(--radius-sm); }
.fxp-chip:hover { color: var(--color-ink); border-color: var(--color-gilt); }
.fxp-chip[aria-pressed='true'] { color: var(--color-paper); background: var(--color-gilt); border-color: var(--color-gilt); }
.fxp-param { display: grid; grid-template-columns: 6.5rem 1fr 2.6rem; align-items: center; gap: 0.5rem; margin-top: 0.55rem; color: var(--color-muted); }
.fxp-param output { text-align: right; color: var(--color-ink); font-variant-numeric: tabular-nums; }
.fxp-param input { width: 100%; accent-color: var(--color-gilt); }
.fxp-foot { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.9rem 1rem; }
.fxp-foot .fxp-status { flex-basis: 100%; margin-bottom: 0.3rem; color: var(--color-muted); text-transform: none; letter-spacing: 0.02em; }
.fxp-action { padding: 0.4rem 0.6rem; background: none; color: var(--color-ink); border: 1px solid var(--color-line); border-radius: var(--radius-sm); }
.fxp-action:hover { border-color: var(--color-gilt); color: var(--color-gilt); }
.fxp-action--primary { background: var(--color-gilt); color: var(--color-paper); border-color: var(--color-gilt); }
.fxp-action--primary:hover { color: var(--color-paper); filter: brightness(1.08); }
.fxp-action:disabled { opacity: 0.4; cursor: default; }
.fxp--right { left: auto; right: 1rem; }
.fxp--right .fxp-toggle { margin-left: auto; width: fit-content; }
.fxp-sub { margin: 0.7rem 0 0.4rem; }
.fxp-swatch { display: inline-block; width: 0.6rem; height: 0.6rem; margin-right: 0.35rem; border-radius: 50%;
  vertical-align: -0.05em; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-ink) 30%, transparent); }
`;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & Record<string, unknown> = {},
  ...children: (Node | string)[]
) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  node.append(...children);
  return node;
}
