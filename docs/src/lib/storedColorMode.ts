import type { ColorMode } from '@var-ui/react';

const COLOR_MODES: readonly ColorMode[] = ['light', 'dark', 'system'];

/** Read a persisted color-mode preference. Invalid or missing values are ignored. */
export function readStoredColorMode(storageKey: string): ColorMode | undefined {
  if (typeof window === 'undefined') return undefined;
  const stored = window.localStorage.getItem(storageKey);
  return COLOR_MODES.includes(stored as ColorMode) ? (stored as ColorMode) : undefined;
}
