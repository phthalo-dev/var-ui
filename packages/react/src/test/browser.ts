/** Shared helpers for `*.browser.test.ts(x)` files (real Chromium). */

/** Resolves after two animation frames (layout + style + top-layer promotion settled). */
export const raf = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** Resolves once every running CSS animation/transition on `el` (and descendants) has finished. */
export async function settled(el: Element): Promise<void> {
  await raf();
  await Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})));
}

/** True when `el` is in the top layer (modal dialog, open popover, fullscreen). */
export const inTopLayer = (el: Element): boolean =>
  el.matches(':modal') || el.matches(':popover-open');

/**
 * Usable viewport edges for `position: fixed` elements. Fixed boxes sit inside the area that
 * excludes a classic scrollbar (15px on Linux/Windows, 0 with macOS overlay scrollbars), and
 * `scrollbar-gutter: stable` keeps that gutter reserved while a modal dialog locks scroll.
 */
export function viewport(): { left: number; right: number } {
  const doc = document.documentElement;
  const gutter = window.innerWidth - doc.clientWidth;
  return getComputedStyle(doc).direction === 'rtl'
    ? { left: gutter, right: window.innerWidth }
    : { left: 0, right: doc.clientWidth };
}
