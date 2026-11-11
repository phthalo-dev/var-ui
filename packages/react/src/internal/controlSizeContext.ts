import { createContext, useContext } from 'react';
import type { ControlSize } from '@var-ui/core';

/**
 * Control size inherited by compound-control parts from their root
 * (`Combobox.Root`, `Select.Root`, `InputGroup`). `undefined` means the part
 * keeps the recipe's default size.
 */
export const ControlSizeContext = createContext<ControlSize | undefined>(undefined);

/** Reads the size provided by an ancestor control root, if any. */
export function useControlSize(): ControlSize | undefined {
  return useContext(ControlSizeContext);
}

/** The size a control renders at: its own `size`, else the surrounding control size, else `md`. */
export function useResolvedControlSize(size: ControlSize | undefined): ControlSize {
  const contextSize = useControlSize();
  return size ?? contextSize ?? 'md';
}
