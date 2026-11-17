import { tokens } from '../declare';
import type { DesignTokens } from '../types';

/**
 * Radius scale: `sm`/`md` for controls (inputs, buttons, chips), `lg`/`xl` for
 * surfaces (cards, panels, dialogs). Surfaces step up noticeably so nested
 * controls read as inset.
 */
export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.75rem',
  xl: '1rem',
  /**
   * Large enough to render any element as a pill (≈10k px at the default root
   * size). Docs themes use a smaller magnitude (measured against their own
   * design scale); any sufficiently large value is fine.
   */
  full: '624rem',
  navItem: tokens.radius.md.var,
} satisfies DesignTokens['radius'];
