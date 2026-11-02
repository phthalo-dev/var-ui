import { useLayoutEffect, type FocusEvent, type KeyboardEvent, type RefObject } from 'react';

/**
 * Roving focus (the APG "roving tabindex" model) for a row or column of controls: one Tab stop,
 * arrow keys / Home / End move focus, disabled items are skipped.
 *
 * The tab stop lives in the DOM (`tabIndex` set in a layout effect and on focus, plus a
 * `data-roving-stop` marker), not in React state, so server markup is plain: every item is
 * tabbable until hydration, and no render is needed when focus moves.
 */
export type RovingFocusOptions = {
  /** CSS selector of the items (matched with `querySelectorAll` inside the root). */
  itemSelector: string;
  /**
   * CSS selector of the element that owns the items. Items whose closest match is not the root
   * (items of a nested group) are ignored. Defaults to the root itself (no scoping).
   */
  scopeSelector?: string;
  /** Arrow axis. `horizontal` uses Left/Right (mirrored in RTL), `vertical` Up/Down. @default horizontal */
  orientation?: 'horizontal' | 'vertical';
  /** Wrap from the last item to the first and back (APG menubar) instead of stopping. @default false */
  wrap?: boolean;
  /** Picks the item that is the Tab stop when none was focused yet. @default first enabled item */
  initialStop?: (items: HTMLElement[]) => HTMLElement | undefined;
  /**
   * Called before focus moves to `target`; return `true` to take over (focus is then not moved
   * and the Tab stop is left alone), e.g. to also switch an open menu.
   */
  onNavigate?: (target: HTMLElement, event: KeyboardEvent<HTMLElement>) => boolean | void;
};

/** Direction of the element, from the computed style (the `dir` attribute as a fallback). */
export function isRtl(el: HTMLElement): boolean {
  const computed = getComputedStyle(el).direction;
  if (computed) return computed === 'rtl';
  return el.closest('[dir]')?.getAttribute('dir') === 'rtl';
}

function isDisabled(el: HTMLElement): boolean {
  return (el as HTMLButtonElement).disabled === true || el.getAttribute('aria-disabled') === 'true';
}

/** The enabled items that belong to `root`, in DOM order. */
export function getRovingItems(
  root: HTMLElement,
  itemSelector: string,
  scopeSelector?: string,
): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(itemSelector)).filter(
    (el) => !isDisabled(el) && (!scopeSelector || el.closest(scopeSelector) === root),
  );
}

/** Makes `target` the single Tab stop; every other enabled item gets `tabindex="-1"`. */
export function setRovingStop(items: HTMLElement[], target: HTMLElement | undefined): void {
  for (const el of items) {
    el.tabIndex = el === target ? 0 : -1;
    if (el === target) el.dataset.rovingStop = '';
    else delete el.dataset.rovingStop;
  }
}

/** The item `delta` steps from `current` (wrapping or stopping at the ends), or `undefined`. */
export function stepRovingItem(
  items: HTMLElement[],
  current: HTMLElement,
  delta: 1 | -1,
  wrap: boolean,
): HTMLElement | undefined {
  const index = items.indexOf(current);
  if (index < 0) return undefined;
  const next = index + delta;
  if (wrap) return items[(next + items.length) % items.length];
  return items[next];
}

/** Which way an arrow key moves along the axis: `1` forward, `-1` back, `0` not an arrow of it. */
export function arrowDelta(
  key: string,
  orientation: 'horizontal' | 'vertical',
  rtl: boolean,
): 1 | -1 | 0 {
  if (orientation === 'vertical') return key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  return key === forward ? 1 : key === back ? -1 : 0;
}

/**
 * Wires roving focus onto `rootRef`. Spread the returned `onKeyDown` / `onFocus` onto the root
 * (call your own handlers first, as they may `preventDefault`).
 */
export function useRovingFocus(
  rootRef: RefObject<HTMLElement | null>,
  options: RovingFocusOptions,
): {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
} {
  const { itemSelector, scopeSelector, orientation = 'horizontal', wrap = false } = options;

  // Runs after every render: new items get their `tabindex`, and an item that became disabled
  // gives up the stop.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = getRovingItems(root, itemSelector, scopeSelector);
    setRovingStop(
      items,
      items.find((el) => el.dataset.rovingStop !== undefined) ??
        options.initialStop?.(items) ??
        items[0],
    );
  });

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const root = event.currentTarget;
    const current = (event.target as HTMLElement).closest<HTMLElement>(itemSelector);
    if (!current || (scopeSelector && current.closest(scopeSelector) !== root)) return;
    const items = getRovingItems(root, itemSelector, scopeSelector);
    if (!items.includes(current)) return;
    const delta = arrowDelta(event.key, orientation, isRtl(root));
    let target: HTMLElement | undefined;
    if (delta !== 0) target = stepRovingItem(items, current, delta, wrap);
    else if (event.key === 'Home') target = items[0];
    else if (event.key === 'End') target = items[items.length - 1];
    else return;
    event.preventDefault();
    if (!target || target === current) return;
    if (options.onNavigate?.(target, event) === true) return;
    setRovingStop(items, target);
    target.focus();
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const root = event.currentTarget;
    const target = (event.target as HTMLElement).closest<HTMLElement>(itemSelector);
    if (!target || isDisabled(target)) return;
    if (scopeSelector && target.closest(scopeSelector) !== root) return;
    setRovingStop(getRovingItems(root, itemSelector, scopeSelector), target);
  };

  return { onKeyDown, onFocus };
}
