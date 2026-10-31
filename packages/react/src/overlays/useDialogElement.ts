import { useEffect, useLayoutEffect, useRef, type RefCallback } from 'react';
import { flushSync } from 'react-dom';
import type { OverlayOpenChangeReason } from './changeEvent';
import type { OverlayRoot } from './useOverlayRoot';
import { useMountedWhileAnimating } from './useMountedWhileAnimating';

export type UseDialogElementOptions = {
  /**
   * Whether a press on the backdrop (a `pointerdown` and a `click`, both landing on the `<dialog>`
   * itself) requests a close with reason `outside-press`. Escape is native and always reported.
   * @default true
   */
  dismissable?: boolean;
};

export type DialogElement = {
  /** Put on the `<dialog>` (merge with the consumer's ref via `useMergedRef`). Stable. */
  ref: RefCallback<HTMLDialogElement>;
  /** The attached `<dialog>`. */
  element: HTMLDialogElement | null;
  /**
   * Render the dialog's children only while this is `true`: open plus the CSS exit
   * (`useMountedWhileAnimating`).
   */
  mounted: boolean;
};

/** An Escape keydown more recent than this explains a `cancel` event (ms). */
const GESTURE_WINDOW = 500;

type Gesture = { event: Event; reason: OverlayOpenChangeReason };

/**
 * Drives a native modal `<dialog>` from an overlay root.
 *
 * - `root.open` -> `showModal()` / `close()` (layout effect; guarded, so StrictMode double effects
 *   and a dialog that is already open or closed are no-ops; nothing is closed on cleanup because
 *   an unmounted dialog leaves the top layer by itself).
 * - Native signals -> `root.setOpen(false, { reason, event })`, the reason read from the signal
 *   (never `'unknown'`):
 *   - `cancel` after an Escape keydown -> `escape-key`; `cancel` otherwise (`requestClose()`, a
 *     back gesture) -> `imperative`. We always `preventDefault()` the `cancel` and let `open` drive
 *     the close, so `details.cancel()` and a controlled `open={true}` simply keep the dialog open.
 *   - `pointerdown` then `click` both targeting the `<dialog>` (the backdrop; the recipe must not
 *     pad the `<dialog>` itself) -> `outside-press`, only when `dismissable`.
 *   - `close` without a request (`<form method="dialog">`, a non-cancelable Escape, `close()` called
 *     by someone else) -> `close-press` after a click inside the dialog, else `imperative`.
 *     If the consumer keeps `open` true, the dialog is re-shown with `showModal()`.
 *     `setOpen` is committed with `flushSync` before that `close` runs, so an accepted close
 *     (whose `open` is now false) is not re-shown on the stale pre-render value.
 * - Focus: native. `showModal()` moves focus to `[autofocus]`/the first focusable and `close()`
 *   returns it to the element that was focused before; nothing is written here.
 * - Reasons that start at the trigger (`trigger-press`) come from `root.triggerPress`; prop changes
 *   and `root.setOpen(...)` default to `imperative`.
 *
 * Veto limit: Chromium lets a page cancel Escape once per user activation. A second Escape with no
 * activation in between fires a non-cancelable `cancel` and the dialog closes natively; the root
 * still reports it (`details.cancel()` is honored) and re-shows the dialog if `open` stays true,
 * so the state is right, but a focus return and a `close` event happen in between. Backdrop,
 * close-button and imperative requests never go through the native close, so their veto is exact.
 */
export function useDialogElement(
  root: OverlayRoot,
  { dismissable = true }: UseDialogElementOptions = {},
): DialogElement {
  const { open, popupRef, setPopupEl } = root;
  const element = root.popupEl as HTMLDialogElement | null;

  const latest = useRef({ root, open, dismissable });
  useLayoutEffect(() => {
    latest.current = { root, open, dismissable };
  });

  // open -> native state.
  useLayoutEffect(() => {
    if (!element?.isConnected) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [element, open]);

  useEffect(() => {
    if (!element) return undefined;
    let escape: Gesture | null = null;
    let click: Gesture | null = null;
    let pressedBackdrop = false;
    // A non-cancelable `cancel` already reported its request; its `close` must not report again.
    let reported = false;

    const reshowIfStillOpen = () => {
      if (latest.current.open && element.isConnected && !element.open) element.showModal();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escape = { event, reason: 'escape-key' };
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (event.target instanceof Node && element.contains(event.target)) {
        click = { event, reason: 'close-press' };
      }
    };

    const onCancel = (event: Event) => {
      const stash =
        escape && event.timeStamp - escape.event.timeStamp < GESTURE_WINDOW ? escape : null;
      escape = null;
      // Keep the dialog open; `open` decides. (Ignored when the browser made it non-cancelable.)
      event.preventDefault();
      reported = !event.cancelable;
      // Commit before the browser's non-cancelable close. Otherwise `onClose` still sees the
      // pre-render `open` and calls `showModal()` on a close the consumer just accepted.
      flushSync(() => {
        latest.current.root.setOpen(false, {
          reason: stash?.reason ?? 'imperative',
          event: stash?.event ?? event,
        });
      });
    };

    const onClose = (event: Event) => {
      // Reopened in the meantime (StrictMode, veto re-show), or closed by our own `close()`.
      if (element.open) return;
      const wasReported = reported;
      reported = false;
      if (!latest.current.open) return;
      if (!wasReported) {
        const stash =
          click && event.timeStamp - click.event.timeStamp < GESTURE_WINDOW ? click : null;
        click = null;
        const applied = latest.current.root.setOpen(false, {
          reason: stash?.reason ?? 'imperative',
          event: stash?.event ?? event,
        });
        if (applied) return;
      }
      reshowIfStillOpen();
    };

    const onPointerDown = (event: PointerEvent) => {
      pressedBackdrop = event.target === element && !insideBox(element, event);
    };
    const onClick = (event: MouseEvent) => {
      const pressed = pressedBackdrop;
      pressedBackdrop = false;
      if (!pressed || event.target !== element || !latest.current.dismissable) return;
      latest.current.root.setOpen(false, { reason: 'outside-press', event });
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('click', onDocumentClick, true);
    element.addEventListener('cancel', onCancel);
    element.addEventListener('close', onClose);
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('click', onDocumentClick, true);
      element.removeEventListener('cancel', onCancel);
      element.removeEventListener('close', onClose);
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('click', onClick);
    };
  }, [element]);

  const mounted = useMountedWhileAnimating(popupRef, open);
  return { ref: setPopupEl, element, mounted };
}

/** A press inside the dialog's own box (for example its padding) is content, not the backdrop. */
function insideBox(element: HTMLElement, event: PointerEvent): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}
