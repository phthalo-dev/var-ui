import { designTokens as t } from '../tokens';

/** Shared focus ring. Spread under the selector that fits the control. */
export const focusRing = {
  outline: `0.125rem solid ${t.color.border.focus.var}`,
  outlineOffset: '0.125rem',
} as const;
