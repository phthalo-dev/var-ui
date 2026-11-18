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
 * Keep the TopNav selected pill under the `data-selected` item: it slides when the selection
 * moves (any script or render toggling `data-selected`) and follows layout and font changes.
 * Returns a cleanup function.
 */
export function observeTopNavIndicator(start: HTMLElement): () => void {
  return observeSlidingIndicator(start, {
    cssVars: topNavIndicatorCssVars,
    getActive: getActiveTopNavItem,
    attributes: ['data-selected'],
  });
}
