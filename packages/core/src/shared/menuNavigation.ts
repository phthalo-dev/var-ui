/**
 * Arrow-key model for menus that mix vertical lists with `layout: 'row'` sections (a horizontal
 * Light / Dark / System switch above a Theme list). Shared by the Astro `Menu` script and the
 * React `Menu.Popup` so both move focus the same way:
 *
 * - ArrowLeft / ArrowRight move within a row and wrap there (mirrored in RTL); outside a row they
 *   do nothing.
 * - ArrowUp / ArrowDown treat a row as one stop: they step to the previous / next stop (wrapping),
 *   entering a row on its checked item, else its first.
 *
 * Disabled items (`aria-disabled="true"`) are skipped.
 */

/** Element that lays a menu section out horizontally. */
export const MENU_ROW_SELECTOR = '[data-layout="row"]';

export type MenuArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export type MenuArrowTargetOptions = {
  /** Mirror ArrowLeft / ArrowRight. @default false */
  rtl?: boolean;
  /**
   * Only answer when a row is involved (the current item is in one, or ArrowUp / ArrowDown lands
   * on one); return `null` otherwise so a host with its own list navigation keeps it.
   * @default false
   */
  rowsOnly?: boolean;
};

export function isMenuArrowKey(key: string): key is MenuArrowKey {
  return key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';
}

const enabled = (item: HTMLElement) => item.getAttribute('aria-disabled') !== 'true';

/** Consecutive items of one row form one stop; every other item is a stop of its own. */
function menuStops(items: readonly HTMLElement[]): { row: Element | null; items: HTMLElement[] }[] {
  const stops: { row: Element | null; items: HTMLElement[] }[] = [];
  for (const item of items) {
    if (!enabled(item)) continue;
    const row = item.closest(MENU_ROW_SELECTOR);
    const last = stops[stops.length - 1];
    if (row && last?.row === row) last.items.push(item);
    else stops.push({ row, items: [item] });
  }
  return stops;
}

/**
 * The item `key` moves focus to from `current`, or `null` when the key does not move focus here
 * (see {@link MenuArrowTargetOptions.rowsOnly}). `items` are the menu's own items in DOM order.
 */
export function menuArrowTarget(
  items: readonly HTMLElement[],
  current: HTMLElement,
  key: MenuArrowKey,
  { rtl = false, rowsOnly = false }: MenuArrowTargetOptions = {},
): HTMLElement | null {
  const stops = menuStops(items);
  const index = stops.findIndex((stop) => stop.items.includes(current));
  if (index === -1) return null;
  const stop = stops[index]!;

  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    if (!stop.row) return null;
    const forward = (key === 'ArrowRight') !== rtl;
    const position = stop.items.indexOf(current);
    const count = stop.items.length;
    return stop.items[(position + (forward ? 1 : -1) + count) % count] ?? null;
  }

  const next = stops[(index + (key === 'ArrowDown' ? 1 : -1) + stops.length) % stops.length]!;
  if (rowsOnly && !stop.row && !next.row) return null;
  if (!next.row) return next.items[0] ?? null;
  return (
    next.items.find((item) => item.getAttribute('aria-checked') === 'true') ?? next.items[0] ?? null
  );
}
