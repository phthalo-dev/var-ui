import { createContext, useContext } from 'react';
import type { OverlayRequestOptions } from './useOverlayRoot';

/** Requests a close of the nearest overlay. Provided by each `Popup`. */
export type OverlayClose = (options?: OverlayRequestOptions) => void;

export const OverlayCloseContext = createContext<OverlayClose | null>(null);

export function useOverlayClose(): OverlayClose {
  const close = useContext(OverlayCloseContext);

  if (close === null) {
    throw new Error('Close must be rendered inside a Popup');
  }

  return close;
}
