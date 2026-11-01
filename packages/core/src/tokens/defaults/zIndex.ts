import type { DesignTokens } from '../types';

/**
 * Stacking tiers for in-flow content only. `base`/`raised`/`lifted` are local lifts inside one
 * component (a sticky header cell, a resize handle over it); `sticky` is for page-level sticky
 * chrome; `overlay` is the scrim of `LoadingOverlay` over its own region; `max` lifts a focused
 * skip link above sticky chrome. Dialogs, drawers, popovers, menus, tooltips and toasts live in the
 * browser top layer and set no `z-index`.
 */
export const zIndex = {
  base: 0,
  raised: 1,
  lifted: 2,
  sticky: 10,
  overlay: 400,
  max: 9999,
} satisfies DesignTokens['zIndex'];
