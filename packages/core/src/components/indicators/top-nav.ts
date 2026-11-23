import { observeSlidingIndicator, positionSlidingIndicator } from './sliding';

/** CSS custom properties updated by `positionTopNavIndicator` on the TopNav `start` zone. */
export const topNavIndicatorCssVars = {
  x: '--var-ui-top-nav-indicatorx',
  width: '--var-ui-top-nav-indicatorwidth',
  opacity: '--var-ui-top-nav-indicatoropacity',
} as const;

/** The selected bar item (`data-selected`) inside a TopNav `start` zone. */
export function getActiveTopNavItem(start: HTMLElement): HTMLElement | null {
  return start.querySelector<HTMLElement>('[data-selected]');
}

/** Slide the selected pill under `item` (hidden when `null`). */
export function positionTopNavIndicator(start: HTMLElement, item: HTMLElement | null): void {
  positionSlidingIndicator(start, item, topNavIndicatorCssVars);
}

/** Find the selected item and move the pill under it. */
export function syncTopNavIndicator(start: HTMLElement): void {
  positionTopNavIndicator(start, getActiveTopNavItem(start));
}

/**
 * Scroll the `start` zone (which scrolls sideways when the bar is too narrow) just enough to show
 * `item`, without scrolling the page. Works in either direction since it uses visual offsets.
 */
export function revealTopNavItem(start: HTMLElement, item: HTMLElement | null): void {
  if (!item || start.scrollWidth <= start.clientWidth) return;
  const zone = start.getBoundingClientRect();
  const rect = item.getBoundingClientRect();
  if (rect.left < zone.left) start.scrollLeft -= zone.left - rect.left;
  else if (rect.right > zone.right) start.scrollLeft += rect.right - zone.right;
}

/**
 * Keep the TopNav selected pill under the `data-selected` item: it slides when the selection
 * moves (any script or render toggling `data-selected`) and follows layout and font changes. On a
 * narrow bar the selected item is also scrolled into view. Returns a cleanup function.
 */
export function observeTopNavIndicator(start: HTMLElement): () => void {
  const stopIndicator = observeSlidingIndicator(start, {
    cssVars: topNavIndicatorCssVars,
    getActive: getActiveTopNavItem,
    attributes: ['data-selected'],
  });
  const reveal = () => revealTopNavItem(start, getActiveTopNavItem(start));
  reveal();
  const observer = new MutationObserver(reveal);
  observer.observe(start, { attributes: true, attributeFilter: ['data-selected'], subtree: true });
  return () => {
    stopIndicator();
    observer.disconnect();
  };
}
