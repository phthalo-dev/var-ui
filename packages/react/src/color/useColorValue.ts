import { useCallback, useMemo, useState } from 'react';
import { hexToHsv, hsvToHex, normalizeHex, type Hsv } from './convert';

export type UseColorValueOptions = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  withAlpha?: boolean;
};

export function useColorValue({
  value,
  defaultValue = '#228be6',
  onChange,
  withAlpha = false,
}: UseColorValueOptions) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const color = isControlled ? value : uncontrolled;

  const hsv = useMemo(() => hexToHsv(color, defaultValue), [color, defaultValue]);

  const setColor = useCallback(
    (next: string) => {
      const normalized = normalizeHex(next);
      if (!isControlled) {
        setUncontrolled(normalized);
      }
      onChange?.(normalized);
    },
    [isControlled, onChange],
  );

  const setHsv = useCallback(
    (next: Hsv) => {
      setColor(hsvToHex(next, withAlpha));
    },
    [setColor, withAlpha],
  );

  return { color, hsv, setColor, setHsv };
}
