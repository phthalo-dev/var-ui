import { useEffect, useRef, useState } from 'react';

export type UseDebouncedValueOptions = {
  /**
   * Also update immediately on the first change after a quiet period (the trailing update still
   * follows the last change).
   * @default false
   */
  leading?: boolean;
};

/**
 * A copy of `value` that only changes once it has stopped changing for `delayMs`. Pending updates
 * are cancelled on unmount.
 *
 * ```tsx
 * const [query, setQuery] = useState('');
 * const debounced = useDebouncedValue(query, 300);
 * useEffect(() => { search(debounced); }, [debounced]);
 * ```
 */
export function useDebouncedValue<T>(
  value: T,
  delayMs: number,
  { leading = false }: UseDebouncedValueOptions = {},
): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (leading && timer.current === undefined) {
      setDebounced(value);
      timer.current = setTimeout(() => {
        timer.current = undefined;
      }, delayMs);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = undefined;
      setDebounced(value);
    }, delayMs);
  }, [value, delayMs, leading]);

  // Reset on cleanup too so StrictMode's simulated unmount does not leave a stale "busy" flag.
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      timer.current = undefined;
    },
    [],
  );

  return debounced;
}
