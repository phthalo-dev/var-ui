import { useCallback, useEffect, useRef } from 'react';
import type { OverlayRequestOptions, OverlayRoot } from './useOverlayRoot';

export type UseHoverIntentOptions = {
  /** Delay before opening, in ms. */
  openDelay: number;
  /** Delay before closing, in ms. */
  closeDelay: number;
};

export type HoverIntentRequest = {
  event?: Event | { nativeEvent?: Event } | null;
  reason?: 'hover' | 'focus';
};

/**
 * Delayed open/close for hover-triggered overlays that own their timing (HoverCard). Each schedule
 * cancels the pending opposite request, and timers are cleared on unmount. Tooltip does not use
 * this: react-aria's `TooltipTrigger` owns its delay and warm-up/cool-down grouping.
 */
export function useHoverIntent(
  root: Pick<OverlayRoot, 'setOpen'>,
  { openDelay, closeDelay }: UseHoverIntentOptions,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { setOpen } = root;

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
      timer.current = setTimeout(() => {
        timer.current = undefined;
        setOpen(next, options);
      }, delay);
    },
    [cancel, setOpen],
  );

  useEffect(() => cancel, [cancel]);

  return {
    scheduleOpen: useCallback(
      (request?: HoverIntentRequest) => schedule(true, openDelay, request),
      [schedule, openDelay],
    ),
    scheduleClose: useCallback(
      (request?: HoverIntentRequest) => schedule(false, closeDelay, request),
      [schedule, closeDelay],
    ),
    /** Cancels a pending open or close (e.g. pointer entered the popup). */
    cancel,
  };
}
