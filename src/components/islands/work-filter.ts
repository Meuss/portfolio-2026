/**
 * Context filter for /work (progressive enhancement).
 * Without JS the filter stays `hidden` and every project is listed.
 */
const root = document.querySelector<HTMLElement>('[data-filter]');
const statusEl = document.querySelector<HTMLElement>('[data-filter-status]');
const items = Array.from(document.querySelectorAll<HTMLElement>('li[data-context]'));

if (root && items.length) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter-value]'));
  root.hidden = false;

  const apply = (value: string) => {
    let shown = 0;
    for (const item of items) {
      const match = value === 'all' || item.dataset.context === value;
      item.hidden = !match;
      if (match) {
        shown += 1;
        // Filtered-in items should never stay in the pre-reveal hidden state.
        item.classList.add('is-visible');
      }
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filterValue === value));
    }
    if (statusEl)
      statusEl.textContent = (statusEl.dataset.template ?? '{n}').replace('{n}', String(shown));
  };

  for (const button of buttons) {
    button.addEventListener('click', () => apply(button.dataset.filterValue ?? 'all'));
  }
}
