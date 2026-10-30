import type { IconName, Tone } from '@var-ui/core';

/** Tone → registry glyph. Danger uses the `error` glyph; neutral and accent use `info`. */
export const toneIcon: Record<Tone, IconName> = {
  neutral: 'info',
  accent: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};
