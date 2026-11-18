/**
 * Shared pressed feedback for clickable chrome (buttons, bar items, icon triggers): a one-pixel
 * nudge. Pair with a `transform` transition (`transitionOf('transform', 'fast')`).
 */
export const pressNudge = {
  transform: 'translateY(0.0625rem)',
} as const;

/** `&:active` rule applying `pressNudge` (skipped while disabled). */
export const pressedState = {
  '&:active:not([disabled]):not([data-disabled]):not([aria-disabled="true"])': pressNudge,
} as const;
