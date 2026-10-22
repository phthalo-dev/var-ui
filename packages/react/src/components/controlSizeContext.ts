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
