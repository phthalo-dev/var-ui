import { useEffect, useMemo, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type DebouncedCallback<Args extends unknown[]> = ((...args: Args) => void) & {
  /** Drops the pending call, if any. */
  cancel: () => void;
  /** Runs the pending call now, with the latest arguments. Does nothing if none is pending. */
  flush: () => void;
};

/**
 * Debounces `fn`: it runs `delayMs` after the last call, with the last arguments. The returned
 * function has a stable identity, always calls the latest `fn`, and drops its pending call on
 * unmount.
 *
 * ```tsx
 * const save = useDebouncedCallback((text: string) => api.save(text), 500);
 *
 * <textarea onChange={(e) => save(e.target.value)} onBlur={save.flush} />
 * ```
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): DebouncedCallback<Args> {
  const latest = useRef({ fn, delayMs });
  useIsomorphicLayoutEffect(() => {
    latest.current = { fn, delayMs };
  });

  const debounced = useMemo(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: Args | undefined;
    const cancel = () => {
      clearTimeout(timer);
      timer = undefined;
      pending = undefined;
    };
    const flush = () => {
      if (!pending) return;
      const args = pending;
      cancel();
      latest.current.fn(...args);
    };
    const call = (...args: Args) => {
      pending = args;
      clearTimeout(timer);
      timer = setTimeout(flush, latest.current.delayMs);
    };
    return Object.assign(call, { cancel, flush });
  }, []);

  useEffect(() => debounced.cancel, [debounced]);

  return debounced;
}
