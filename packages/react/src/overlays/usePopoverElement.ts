import { useEffect, useLayoutEffect, useMemo, useRef, type RefCallback } from 'react';
import { flushSync } from 'react-dom';
import type { OverlayOpenChangeReason } from './changeEvent';
import type { OverlayRoot } from './useOverlayRoot';
import { useMountedWhileAnimating } from './useMountedWhileAnimating';

/** The `popover` attribute value of the shell. */
export type PopoverMode = 'auto' | 'manual' | 'hint';

export type UsePopoverElementOptions = {
  /**
   * `auto`: native light dismiss (outside press, Escape, another auto popover opening); the trigger
   * must be a `popovertarget` invoker (see `OverlayTrigger relation="popovertarget"`).
   * `manual`: no native dismissal; the hook implements outside press and Escape itself (for
   * react-aria driven popups such as Menu and Select, which open on pointerdown).
   * `hint`: tooltips/hover cards; opened and closed by `useHoverIntent` (engines without
   * `popover="hint"` treat it as `manual`, which is why the hook never relies on native dismissal
   * for it).
   * @default 'auto'
   */
  mode?: PopoverMode;
  /**
   * `manual` only: handle Escape (document capture) and report `escape-key`. Turn off when the
   * content handles Escape itself (react-aria Select/ComboBox/Menu through `NativePopover`).
   * @default true
   */
  escape?: boolean;
};

export type PopoverElement = {
  /** Put on the shell element (merge with the consumer's ref via `useMergedRef`). Stable. */
  ref: RefCallback<HTMLElement>;
  /** The attached shell element. */
  element: HTMLElement | null;
  /**
   * Render the popup's children only while this is `true`: open plus the CSS exit
   * (`useMountedWhileAnimating`).
   */
  mounted: boolean;
  /**
   * Spread on the shell: the `popover` attribute and the root's `popupId` (the target of
   * `popovertarget`/`aria-describedby`). Do not override `id`.
   */
  props: { popover: PopoverMode; id: string };
};

/** A keydown/pointer gesture more recent than this explains a native toggle (ms). */
const GESTURE_WINDOW = 500;

type Gesture = { kind: 'escape' | 'pointer'; event: Event; at: number };

type ToggleLike = Event & { newState?: string; source?: Element | null };

/** `:popover-open`, with a `data-popover-open` fallback for the jsdom stub (no such selector). */
export function isPopoverShowing(el: Element): boolean {
  try {
    return el.matches(':popover-open');
  } catch {
    return el.hasAttribute('data-popover-open');
  }
}

/**
 * Drives a native `[popover]` shell from an overlay root.
 *
 * - `root.open` -> `showPopover()` / `hidePopover()` (layout effect; guarded, so StrictMode double
 *   effects and a popover that is already in the wanted state are no-ops; nothing is hidden on
 *   cleanup because an unmounted popover leaves the top layer by itself).
 * - Native `beforetoggle` -> `root.setOpen(newState === 'open', { reason, event })`. The root is
 *   committed synchronously (`flushSync`) inside the handler, so the verdict is known there:
 *   - open: `details.cancel()` or a controlled `open` that stays `false` -> `preventDefault()`
 *     (a real veto, the popover never appears).
 *   - close (not cancelable natively): the popover closes, and in `toggle` it is re-shown with
 *     `showPopover()` if `root.open` is still `true` (the exit transition restarts: a visible
 *     blink; unavoidable). Controlled `open` is the source of truth.
 * - Reasons come from the signal, never `'unknown'`: `event.source` (the `popovertarget`
 *   invoker) -> `trigger-press`, or `close-press` when the invoker is inside the popup;
 *   otherwise a document `keydown` Escape within 500ms -> `escape-key`; a `pointerdown`/`pointerup`
 *   within 500ms -> `outside-press`; none -> `imperative`.
 * - `manual`: no native dismissal exists, so while open a document capture `pointerdown` outside
 *   the popup, the trigger and any nested popup -> `outside-press`, and `Escape` (only when no
 *   nested popover/dialog inside the popup is open) -> `escape-key`; the Escape keydown is
 *   `preventDefault()`ed so an enclosing modal `<dialog>` does not also close. Both go through
 *   `flushSync(root.setOpen)`, so the native hide that follows is a no-op, not a second report.
 * - `hint`: dismissal belongs to `useHoverIntent` (including its Escape).
 *
 * Focus is native: opening does not move focus; `autofocus` descendants get it; hiding returns it.
 */
export function usePopoverElement(
  root: OverlayRoot,
  { mode = 'auto', escape = true }: UsePopoverElementOptions = {},
): PopoverElement {
  const { open, popupRef, setPopupEl, popupId } = root;
  const element = root.popupEl;

  const latest = useRef({ root, open, mode });
  useLayoutEffect(() => {
    latest.current = { root, open, mode };
  });
  // `true` while a native toggle is being reported: the layout effect must not drive the element
  // (the browser finishes the transition itself).
  const reporting = useRef(false);

  // open -> native state.
  useLayoutEffect(() => {
    if (!element?.isConnected || reporting.current) return;
    const showing = isPopoverShowing(element);
    if (open && !showing) element.showPopover();
    else if (!open && showing) element.hidePopover();
  }, [element, open]);

  // The latest gesture, for reasons (Escape, pointer) of native light dismiss.
  const gesture = useRef<Gesture | null>(null);
  useEffect(() => {
    if (!element || !open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        gesture.current = { kind: 'escape', event, at: event.timeStamp };
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      gesture.current = { kind: 'pointer', event, at: event.timeStamp };
    };
    const onPointerUp = (event: PointerEvent) => {
      // Native light dismiss completes on pointerup: keep the pointerdown event, refresh the time.
      if (gesture.current?.kind === 'pointer') gesture.current.at = event.timeStamp;
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointerup', onPointerUp, true);
    };
  }, [element, open]);

  // Native toggle -> root.
  useEffect(() => {
    if (!element) return undefined;

    const reasonOf = (event: ToggleLike): { reason: OverlayOpenChangeReason; event: Event } => {
      const source = event.source;
      if (source instanceof Element) {
        return {
          reason: element.contains(source) ? 'close-press' : 'trigger-press',
          event,
        };
      }
      const g = gesture.current;
      if (g && event.timeStamp - g.at < GESTURE_WINDOW) {
        return { reason: g.kind === 'escape' ? 'escape-key' : 'outside-press', event: g.event };
      }
      return { reason: 'imperative', event };
    };

    const onBeforeToggle = (event: Event) => {
      const toggle = event as ToggleLike;
      const wantOpen = toggle.newState === 'open';
      if (wantOpen === latest.current.open) return; // our own show/hide, or already requested
      const { reason, event: cause } = reasonOf(toggle);
      reporting.current = true;
      try {
        let applied = false;
        flushSync(() => {
          applied = latest.current.root.setOpen(wantOpen, { reason, event: cause });
        });
        gesture.current = null;
        // Opening can be refused for real: by `details.cancel()`, or by a controlled parent that
        // did not follow.
        if (wantOpen && (!applied || !latest.current.open) && event.cancelable) {
          event.preventDefault();
        }
      } finally {
        reporting.current = false;
      }
    };

    const onToggle = (event: Event) => {
      const toggle = event as ToggleLike;
      // A close that the consumer refused or did not follow (`open` is still true): show again.
      if (toggle.newState === 'closed' && latest.current.open && element.isConnected) {
        if (!isPopoverShowing(element)) element.showPopover();
      }
    };

    element.addEventListener('beforetoggle', onBeforeToggle);
    element.addEventListener('toggle', onToggle);
    return () => {
      element.removeEventListener('beforetoggle', onBeforeToggle);
      element.removeEventListener('toggle', onToggle);
    };
  }, [element]);

  // `manual`: implement outside press and Escape ourselves.
  useEffect(() => {
    if (!element || !open || mode !== 'manual') return undefined;
    const trigger = () => latest.current.root.triggerRef.current;
    const request = (reason: OverlayOpenChangeReason, event: Event): boolean => {
      let applied = false;
      flushSync(() => {
        applied = latest.current.root.setOpen(false, { reason, event });
      });
      return applied;
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (element.contains(target) || trigger()?.contains(target)) return;
      // Overlays render in place, so a nested popover/dialog is inside `element` (contained above).
      request('outside-press', event);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!escape || event.key !== 'Escape' || event.defaultPrevented) return;
      if (hasOpenNested(element)) return; // the nested one handles it
      if (request('escape-key', event)) event.preventDefault();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [element, open, mode, escape]);

  const mounted = useMountedWhileAnimating(popupRef, open);
  const props = useMemo(() => ({ popover: mode, id: popupId }), [mode, popupId]);
  return { ref: setPopupEl, element, mounted, props };
}

/** An open popover/dialog rendered inside `element` (a nested overlay). */
function hasOpenNested(element: HTMLElement): boolean {
  try {
    return element.querySelector('[popover]:popover-open, dialog[open]') !== null;
  } catch {
    return false;
  }
}
