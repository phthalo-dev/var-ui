import { useCallback, useEffect, useMemo, useRef, type FocusEvent, type PointerEvent } from 'react';
import { flushSync } from 'react-dom';
import type { OverlayRequestOptions, OverlayRoot } from './useOverlayRoot';

export type UseHoverIntentOptions = {
  /** Delay before opening, in ms. */
  openDelay: number;
  /** Delay before closing, in ms. */
  closeDelay: number;
  /**
   * Share a module-level warm-up window with every other `warmUp` overlay (tooltips): while one is
   * open, or one closed less than `HOVER_WARM_UP_WINDOW` ms ago, opening takes no delay.
   * @default false
   */
  warmUp?: boolean;
  /**
   * Close with reason `escape-key` when Escape is pressed while open (WCAG 1.4.13); the keydown
   * is `preventDefault()`ed so an enclosing dialog does not also close. Needs `root.open`.
   * @default true
   */
  escape?: boolean;
};

export type HoverIntentRequest = {
  event?: Event | { nativeEvent?: Event } | null;
  reason?: 'hover' | 'focus';
};

/** A tooltip that closed less than this many ms ago keeps the next one warm (open delay 0). */
export const HOVER_WARM_UP_WINDOW = 500;

const warm = { openCount: 0, closedAt: Number.NEGATIVE_INFINITY };

/** Test hook: forget the module-level warm-up state. */
export function resetHoverWarmUp(): void {
  warm.openCount = 0;
  warm.closedAt = Number.NEGATIVE_INFINITY;
}

const now = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

function focusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
}

function inside(element: Element | null, target: EventTarget | null): boolean {
  return element !== null && target instanceof Node && element.contains(target);
}

/**
 * Delayed open/close for hover-triggered overlays (Tooltip, HoverCard) on a `popover="hint"` or
 * `"manual"` element. Each schedule cancels the pending opposite request, and timers are cleared
 * on unmount.
 *
 * `triggerProps` / `popupProps` are ready-made React handlers for the two elements:
 * - trigger: pointer enter/leave (touch pointers are ignored), focus (only `:focus-visible`) and
 *   blur;
 * - popup: hoverable (pointer or focus inside cancels a pending close; leaving schedules one), so
 *   the pointer can travel from the trigger onto the popup and keep it open.
 *
 * With `warmUp` the open delay is skipped while another warm overlay is open or closed < 500ms
 * ago. With `escape` (default) Escape closes an open overlay with reason `escape-key`.
 */
export function useHoverIntent(
  root: Pick<OverlayRoot, 'setOpen'> &
    Partial<Pick<OverlayRoot, 'open' | 'triggerRef' | 'popupRef'>>,
  { openDelay, closeDelay, warmUp = false, escape = true }: UseHoverIntentOptions,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { setOpen, open, triggerRef, popupRef } = root;

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const schedule = useCallback(
    (next: boolean, delay: number, request?: HoverIntentRequest) => {
      cancel();
      const raw = request?.event;
      const event = raw instanceof Event ? raw : (raw?.nativeEvent ?? null);
      const options: OverlayRequestOptions = { reason: request?.reason ?? 'hover', event };
      const run = () => {
        timer.current = undefined;
        setOpen(next, options);
      };
      if (delay <= 0) run();
      else timer.current = setTimeout(run, delay);
    },
    [cancel, setOpen],
  );

  useEffect(() => cancel, [cancel]);

  // Warm-up bookkeeping: count open warm overlays, stamp the last close.
  useEffect(() => {
    if (!warmUp || !open) return undefined;
    warm.openCount += 1;
    return () => {
      warm.openCount -= 1;
      warm.closedAt = now();
    };
  }, [warmUp, open]);

  const scheduleOpen = useCallback(
    (request?: HoverIntentRequest) => {
      const isWarm = warmUp && (warm.openCount > 0 || now() - warm.closedAt < HOVER_WARM_UP_WINDOW);
      schedule(true, isWarm ? 0 : openDelay, request);
    },
    [schedule, openDelay, warmUp],
  );
  const scheduleClose = useCallback(
    (request?: HoverIntentRequest) => schedule(false, closeDelay, request),
    [schedule, closeDelay],
  );

  // Escape while open.
  useEffect(() => {
    if (!escape || !open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      cancel();
      let applied = false;
      flushSync(() => {
        applied = setOpen(false, { reason: 'escape-key', event });
      });
      if (applied) event.preventDefault();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [escape, open, cancel, setOpen]);

  const triggerProps = useMemo(
    () => ({
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === 'touch') return;
        scheduleOpen({ event: event.nativeEvent, reason: 'hover' });
      },
      onPointerLeave: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === 'touch') return;
        scheduleClose({ event: event.nativeEvent, reason: 'hover' });
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        if (!focusVisible(event.currentTarget)) return;
        scheduleOpen({ event: event.nativeEvent, reason: 'focus' });
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (inside(popupRef?.current ?? null, event.relatedTarget)) return;
        scheduleClose({ event: event.nativeEvent, reason: 'focus' });
      },
    }),
    [scheduleOpen, scheduleClose, popupRef],
  );

  const popupProps = useMemo(
    () => ({
      onPointerEnter: () => cancel(),
      onPointerLeave: (event: PointerEvent<HTMLElement>) =>
        scheduleClose({ event: event.nativeEvent, reason: 'hover' }),
      onFocus: () => cancel(),
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (
          inside(event.currentTarget, event.relatedTarget) ||
          inside(triggerRef?.current ?? null, event.relatedTarget)
        ) {
          return;
        }
        scheduleClose({ event: event.nativeEvent, reason: 'focus' });
      },
    }),
    [cancel, scheduleClose, triggerRef],
  );

  return {
    scheduleOpen,
    scheduleClose,
    /** Cancels a pending open or close (e.g. pointer entered the popup). */
    cancel,
    triggerProps,
    popupProps,
  };
}
