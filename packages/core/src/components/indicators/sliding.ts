/**
 * Shared engine for "sliding" selection indicators: one pseudo-element on a container that moves
 * (via CSS custom properties) under whichever child is selected. Used by `SegmentedControl` (the
 * thumb) and `TopNav` (the selected pill).
 *
 * The container gets:
 * - `<x>`, `<width>` (px) and `<opacity>` (`0` | `1`) custom properties;
 * - `data-indicator` while an item is positioned (recipes hide the item's own selected fill);
 * - `data-indicator-ready` one frame after the first placement, so recipes only transition moves,
 *   never the first paint.
 */
export type SlidingIndicatorCssVars = {
  readonly x: string;
  readonly width: string;
  readonly opacity: string;
};

export const SLIDING_INDICATOR_ATTR = 'data-indicator';
export const SLIDING_INDICATOR_READY_ATTR = 'data-indicator-ready';

/**
 * Inline-start offset of `item` inside `root` (a positioned container), through any wrappers
 * (`display: contents`, …). Direct children use `offsetLeft`, which ignores transforms such as
 * a pressed nudge.
 */
function offsetWithin(root: HTMLElement, item: HTMLElement): number {
  if (item.offsetParent === root || item.parentElement === root) return item.offsetLeft;
  const rootRect = root.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  return itemRect.left - rootRect.left - root.clientLeft + root.scrollLeft;
}

/** Position the indicator under `active`, or hide it when there is none. */
export function positionSlidingIndicator(
  root: HTMLElement,
  active: HTMLElement | null,
  cssVars: SlidingIndicatorCssVars,
): void {
  if (!active || !root.contains(active) || active === root) {
    root.style.setProperty(cssVars.opacity, '0');
    root.removeAttribute(SLIDING_INDICATOR_ATTR);
    return;
  }

  const width = active.offsetWidth;
  // Not laid out yet (hidden zone, fonts pending): keep the last position.
  if (width === 0) return;

  root.style.setProperty(cssVars.opacity, '1');
  root.style.setProperty(cssVars.width, `${width}px`);
  root.style.setProperty(cssVars.x, `${offsetWithin(root, active)}px`);
  root.setAttribute(SLIDING_INDICATOR_ATTR, '');
}

type ObserveOptions = {
  cssVars: SlidingIndicatorCssVars;
  /** Finds the selected item inside `root`. */
  getActive: (root: HTMLElement) => HTMLElement | null;
  /** Attributes whose change (anywhere under `root`) moves the indicator. */
  attributes?: readonly string[];
};

type Observed = { resize?: ResizeObserver; mutation?: MutationObserver };

const observed = new WeakMap<HTMLElement, Observed>();

/**
 * Keep a sliding indicator under the selected item across selection, layout, font and content
 * changes. Returns a cleanup function that disconnects the observers.
 */
export function observeSlidingIndicator(root: HTMLElement, options: ObserveOptions): () => void {
  const { cssVars, getActive } = options;
  const attributes = options.attributes ?? ['data-selected', 'aria-pressed', 'aria-current'];
  const update = () => positionSlidingIndicator(root, getActive(root), cssVars);

  update();
  const raf =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (callback: FrameRequestCallback) => setTimeout(() => callback(0), 16);
  raf(() => {
    update();
    raf(() => {
      update();
      // Transitions start only after the first placement has painted.
      if (root.hasAttribute(SLIDING_INDICATOR_ATTR)) {
        root.setAttribute(SLIDING_INDICATOR_READY_ATTR, '');
      }
    });
  });

  const previous = observed.get(root);
  previous?.resize?.disconnect();
  previous?.mutation?.disconnect();
  const next: Observed = {};

  if (typeof ResizeObserver === 'function') {
    next.resize = new ResizeObserver(() => update());
    next.resize.observe(root);
    for (const child of root.children) {
      if (child instanceof HTMLElement) next.resize.observe(child);
    }
  }

  if (typeof MutationObserver === 'function') {
    next.mutation = new MutationObserver(() => {
      update();
      if (root.hasAttribute(SLIDING_INDICATOR_ATTR)) {
        root.setAttribute(SLIDING_INDICATOR_READY_ATTR, '');
      }
    });
    next.mutation.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [...attributes],
    });
  }

  observed.set(root, next);

  if (typeof document !== 'undefined' && 'fonts' in document) {
    void document.fonts.ready.then(update);
  }

  return () => {
    next.resize?.disconnect();
    next.mutation?.disconnect();
    if (observed.get(root) === next) observed.delete(root);
  };
}
