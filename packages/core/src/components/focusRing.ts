import { designTokens as t } from '../tokens';

/** Shared focus ring. Spread under the selector that fits the control. */
export const focusRing = {
  outline: `2px solid ${t.color.border.focus.var}`,
  outlineOffset: '2px',
} as const;
