import type { DesignTokens } from '../types';

/**
 * Stacking tiers. `base`/`raised`/`lifted` are local lifts inside one component (a sticky header
 * cell, a resize handle over it); `sticky` is for page-level sticky chrome; the rest are layered
 * overlays (React `useLayer` stacks the live ones through `layerZIndex`).
 */
export const zIndex = {
  base: 0,
  raised: 1,
  lifted: 2,
  sticky: 10,
  dropdown: 100,
  overlay: 400,
  toast: 500,
  modal: 1000,
  max: 9999,
} satisfies DesignTokens['zIndex'];
