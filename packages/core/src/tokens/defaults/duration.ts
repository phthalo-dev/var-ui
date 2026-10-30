import type { DesignTokens } from '../types';

/**
 * Motion durations. Every transition token and recipe `transition` should reference these so the
 * default theme's reduced-motion mode (`theme/reduced-motion.ts`) can zero them in one place.
 */
export const duration = {
  fast: '80ms',
  medium: '140ms',
  slow: '220ms',
} satisfies DesignTokens['duration'];
