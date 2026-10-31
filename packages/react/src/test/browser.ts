import { userEvent } from 'vite-plus/test/browser';

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
 * Usable viewport edges for `position: fixed` elements, measured, not computed: an invisible
 * `position: fixed; inset: 0` probe shares the containing block of a docked dialog, so "flush
 * with the edge" means "flush with the probe" whatever the scrollbar setup is (classic
 * scrollbars reserve a gutter on Linux/Windows, macOS overlay scrollbars reserve none, and
 * `scrollbar-gutter: stable` keeps it while a modal locks scroll).
 */
export function viewport(): { left: number; right: number } {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;inset:0;visibility:hidden;pointer-events:none;margin:0;padding:0;border:0;';
  document.body.append(probe);
  const { left, right } = probe.getBoundingClientRect();
  probe.remove();
  return { left, right };
}

/** Diagnostic payload for docking assertions (shown in the failure message, handy on CI). */
export function edgeInfo(el: Element): string {
  const doc = document.documentElement;
  const cs = getComputedStyle(doc);
  return JSON.stringify({
    innerWidth: window.innerWidth,
    clientWidth: doc.clientWidth,
    direction: cs.direction,
    overflow: cs.overflow,
    scrollbarGutter: cs.scrollbarGutter,
    probe: viewport(),
    rect: el.getBoundingClientRect().toJSON(),
  });
}

/**
 * Click the backdrop of a modal `<dialog>`: waits for its enter animation to settle, then clicks
 * the middle of the largest free side of the box (always on-screen and outside the dialog).
 */
export async function clickBackdrop(dialog: HTMLElement): Promise<void> {
  await settled(dialog);
  const rect = dialog.getBoundingClientRect();
  const view = viewport();
  const free = {
    left: rect.left - view.left,
    right: view.right - rect.right,
    top: rect.top,
    bottom: window.innerHeight - rect.bottom,
  };
  const side = (Object.keys(free) as Array<keyof typeof free>).sort(
    (a, b) => free[b] - free[a],
  )[0]!;
  const position = {
    left: { x: -free.left / 2, y: Math.min(40, rect.height / 2) },
    right: { x: rect.width + free.right / 2, y: Math.min(40, rect.height / 2) },
    top: { x: Math.min(40, rect.width / 2), y: -free.top / 2 },
    bottom: { x: Math.min(40, rect.width / 2), y: rect.height + free.bottom / 2 },
  }[side];
  await userEvent.click(dialog, { position, force: true });
}
