import { observeSlidingIndicator, positionSlidingIndicator } from './sliding';

/** CSS custom properties updated by `positionSegmentedControlIndicator` on the root element. */
export const segmentedControlIndicatorCssVars = {
  x: '--var-ui-segmented-control-indicatorx',
  width: '--var-ui-segmented-control-indicatorwidth',
  opacity: '--var-ui-segmented-control-indicatoropacity',
} as const;

/** Active segment inside a segmented-control root. */
export function getActiveSegmentedControlSegment(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector<HTMLElement>(':scope > [data-selected]') ??
    root.querySelector<HTMLElement>(':scope > [aria-pressed="true"]')
  );
}

/** Position the shared segmented-control indicator to match the active segment. */
export function positionSegmentedControlIndicator(
  root: HTMLElement,
  activeSegment: HTMLElement | null,
): void {
  positionSlidingIndicator(
    root,
    activeSegment && activeSegment.parentElement === root ? activeSegment : null,
    segmentedControlIndicatorCssVars,
  );
}

/** Find the active segment and position the indicator. */
export function syncSegmentedControlIndicator(root: HTMLElement): void {
  positionSegmentedControlIndicator(root, getActiveSegmentedControlSegment(root));
}

/**
 * Keep the segmented-control indicator aligned after selection, layout, font, and content
 * changes. Returns a cleanup function that disconnects the observers.
 */
export function observeSegmentedControlIndicator(root: HTMLElement): () => void {
  return observeSlidingIndicator(root, {
    cssVars: segmentedControlIndicatorCssVars,
    getActive: getActiveSegmentedControlSegment,
    attributes: ['data-selected', 'aria-pressed'],
  });
}
