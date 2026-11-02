import { useCallback, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type UseControllableStateOptions<T> = {
  /** Controlled value. While it is not `undefined` the hook never stores state of its own. */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  /** Called with the next value whenever it differs from the current one, in both modes. */
  onChange?: (value: T) => void;
};

/**
 * The controlled/uncontrolled pattern behind every `value`/`defaultValue`/`onChange` trio.
 * Returns `[value, setValue]`. `setValue` has a stable identity, accepts a value or an updater
 * (`setValue((current) => ...)`), skips no-op changes, and always calls `onChange`; it only
 * stores the value itself when `value` is `undefined`.
 *
 * Values that are functions are not supported (they would be read as updaters).
 *
 * ```tsx
 * function Counter(props: { value?: number; defaultValue?: number; onChange?: (n: number) => void }) {
 *   const [value, setValue] = useControllableState({
 *     value: props.value,
 *     defaultValue: props.defaultValue ?? 0,
 *     onChange: props.onChange,
 *   });
 *   return <button onClick={() => setValue((n) => n + 1)}>{value}</button>;
 * }
 * ```
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): readonly [T, (next: T | ((current: T) => T)) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const latest = useRef({ current, controlled, onChange });
  useIsomorphicLayoutEffect(() => {
    latest.current = { current, controlled, onChange };
  });

  const setValue = useCallback((next: T | ((current: T) => T)) => {
    const state = latest.current;
    const resolved = typeof next === 'function' ? (next as (current: T) => T)(state.current) : next;
    if (Object.is(resolved, state.current)) return;
    if (!state.controlled) {
      // Updated eagerly so two calls in one event compound before the re-render.
      state.current = resolved;
      setInner(resolved);
    }
    state.onChange?.(resolved);
  }, []);

  return [current, setValue] as const;
}
