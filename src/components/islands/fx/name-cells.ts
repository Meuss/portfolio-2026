/**
 * Shared scaffolding for hero-name entrances.
 *
 * Splits an element's text into fixed-width cells (each sized by its final
 * glyph via an invisible ghost), keeps words unbreakable so the board wraps
 * like the real text, and hands back the plain text when asked.
 *
 * Accessibility: the element gets an `aria-label` with the real text and the
 * board is `aria-hidden`, so assistive tech reads the name once.
 */

export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWER = 'abcdefghijklmnopqrstuvwxyz';

export interface Cell {
  final: string;
  index: number;
  /** Same-case letters close in width to `final`, so stand-ins never spill out of the cell. */
  pool: string;
  el: HTMLElement;
  random(): string;
}

/** Same-case letters ordered by how close their width is to each final glyph. */
function makePool(el: HTMLElement) {
  const style = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d');
  const width = (c: string) => (ctx ? ctx.measureText(c).width : 0);
  if (ctx) ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return (ch: string) => {
    const set = UPPER.includes(ch) ? UPPER : LOWER.includes(ch) ? LOWER : '';
    if (!set || !ctx) return set;
    const w = width(ch);
    return [...set]
      .sort((a, b) => Math.abs(width(a) - w) - Math.abs(width(b) - w))
      .slice(0, 7)
      .join('');
  };
}

export function layer(className: string, ch = '') {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = ch;
  return el;
}

/** The element's original text, remembered across replays. */
export function originalText(el: HTMLElement) {
  el.dataset.fxText ??= el.textContent?.trim() ?? '';
  return el.dataset.fxText;
}

export function restore(el: HTMLElement) {
  el.replaceChildren(originalText(el));
}

export function buildBoard(el: HTMLElement, decorate: (cell: HTMLElement, final: string) => void) {
  const text = originalText(el);
  el.setAttribute('aria-label', text);
  const pool = makePool(el);
  const board = layer('fx-board');
  board.setAttribute('aria-hidden', 'true');
  const cells: Cell[] = [];

  for (const word of text.split(/(\s+)/)) {
    if (!word) continue;
    if (/^\s+$/.test(word)) {
      board.append(word);
      continue;
    }
    const wordEl = layer('fx-word');
    for (const ch of word) {
      const letters = pool(ch);
      if (!letters) {
        wordEl.append(ch);
        continue;
      }
      const cellEl = layer('fx-cell');
      cellEl.append(layer('fx-ghost', ch));
      decorate(cellEl, ch);
      wordEl.append(cellEl);
      cells.push({
        final: ch,
        index: cells.length,
        pool: letters,
        el: cellEl,
        random: () => letters[Math.floor(Math.random() * letters.length)],
      });
    }
    board.append(wordEl);
  }
  el.replaceChildren(board);
  return cells;
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
