import { typestyles } from '../runtime';
import type { ThemeModeDefinition } from '../tokens/types';

/**
 * Token mode that zeroes every `duration` token under `prefers-reduced-motion: reduce`.
 * `transition` tokens and recipe `transition` strings are built from `var(--var-ui-duration-*)`,
 * so they collapse with no per-component handling. Keyframe `animation`s still need
 * `atReducedMotion` because they are not driven by these tokens.
 *
 * `0ms` (not `1ms`) so nothing animates; no component waits on `transitionend`.
 * Installed by {@link createDesignTheme} on every theme.
 */
export const REDUCED_MOTION_MODE_ID = 'reduced-motion';

export const reducedMotionMode: ThemeModeDefinition = {
  id: REDUCED_MOTION_MODE_ID,
  when: typestyles.tokens.when.media('(prefers-reduced-motion: reduce)'),
  overrides: {
    duration: { fast: '0ms', medium: '0ms', slow: '0ms' },
  },
};
