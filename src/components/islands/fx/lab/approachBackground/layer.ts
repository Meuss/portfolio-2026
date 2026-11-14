/**
 * The decorative layer behind the approach section's content, for the
 * variants that draw one (see `slot.ts`).
 */
import './layer.css';

/** Adds the layer to the section; `remove()` takes it out and restores the section. */
export function addLayer(host: HTMLElement) {
  const layer = document.createElement('div');
  layer.className = 'fx-approach-layer';
  layer.setAttribute('aria-hidden', 'true');
  host.classList.add('fx-approach-layered');
  host.prepend(layer);
  return {
    layer,
    remove() {
      layer.remove();
      host.classList.remove('fx-approach-layered');
    },
  };
}
