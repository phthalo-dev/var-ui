import { useCallback, useMemo, useState } from 'react';

export type UseTableSelectionOptions<T> = {
  data: T[];
  getRowId: (row: T) => string;
  /** Allow more than one selected row. Without it, selecting a row replaces the selection. @default false */
  multiple?: boolean;
  /** Initially selected row ids (uncontrolled). */
  defaultValue?: readonly string[];
  /** Selected row ids (controlled). */
  value?: readonly string[];
  /** Called with the new selected row ids, in both controlled and uncontrolled mode. */
  onValueChange?: (value: string[]) => void;
};

export type UseTableSelectionResult = {
  /** Selected row ids, in selection order. */
  value: string[];
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  selectAll: () => void;
  clear: () => void;
  /** Replace the selection. */
  setValue: (value: string[]) => void;
};

/**
 * Headless row-selection state for tables, named like `Select`: `multiple`, and
 * `value` / `defaultValue` / `onValueChange` as `string[]` of row ids. Uncontrolled by
 * default; controlled when `value` is passed. No DOM: row identity comes from `getRowId`.
 */
export function useTableSelection<T>(
  options: UseTableSelectionOptions<T>,
): UseTableSelectionResult {
  const { data, getRowId, multiple = false, defaultValue, value, onValueChange } = options;
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(() => [...(defaultValue ?? [])]);
  const resolvedValue = useMemo(
    () => (isControlled ? [...value] : internalValue),
    [isControlled, value, internalValue],
  );
  const selectedSet = useMemo(() => new Set(resolvedValue), [resolvedValue]);

  const setValue = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  const toggle = useCallback(
    (id: string) => {
      if (!multiple) {
        setValue(selectedSet.has(id) ? [] : [id]);
        return;
      }
      setValue(
        selectedSet.has(id) ? resolvedValue.filter((key) => key !== id) : [...resolvedValue, id],
      );
    },
    [multiple, resolvedValue, selectedSet, setValue],
  );

  const selectAll = useCallback(() => {
    if (!multiple) {
      const first = data[0];
      setValue(first ? [getRowId(first)] : []);
      return;
    }
    setValue(data.map(getRowId));
  }, [data, getRowId, multiple, setValue]);

  const clear = useCallback(() => setValue([]), [setValue]);

  return useMemo(
    () => ({ value: resolvedValue, isSelected, toggle, selectAll, clear, setValue }),
    [resolvedValue, isSelected, toggle, selectAll, clear, setValue],
  );
}
