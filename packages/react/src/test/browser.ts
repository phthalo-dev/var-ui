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
