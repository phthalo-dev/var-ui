import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/**
 * Checked state for a RAC checkbox/switch that also follows values written straight to the
 * native `<input>` (`input.checked = true`), which is what form libraries do for `defaultValues`,
 * `setValue()` and `reset()` (react-hook-form's `register()`), or a script does on a form.
 *
 * RAC keeps `isSelected` in state, so such a write would leave the visible state stale. The hook
 * owns the uncontrolled state and, while uncontrolled, listens to writes on the input's `checked`
 * property. A controlled `checked` always wins; React restores it on the next render.
 */
export function useNativeChecked(
  inputRef: RefObject<HTMLInputElement | null>,
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
  onCheckedChange: ((checked: boolean) => void) | undefined,
) {
  const controlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const controlledRef = useRef(controlled);
  controlledRef.current = controlled;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const own = Object.getOwnPropertyDescriptor(el, 'checked');
    const base = own ?? Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');
    if (!base?.get || !base.set) return;
    const descriptor = base;
    Object.defineProperty(el, 'checked', {
      configurable: true,
      enumerable: base.enumerable,
      get() {
        return descriptor.get?.call(this);
      },
      set(value: boolean) {
        descriptor.set?.call(this, value);
        if (!controlledRef.current) setInternal(Boolean(value));
      },
    });
    return () => {
      if (own) Object.defineProperty(el, 'checked', own);
      else delete (el as { checked?: boolean }).checked;
    };
  }, [inputRef]);

  const onChange = useCallback(
    (next: boolean) => {
      if (!controlledRef.current) setInternal(next);
      onCheckedChange?.(next);
    },
    [onCheckedChange],
  );

  return { isSelected: controlled ? checked : internal, onChange };
}
