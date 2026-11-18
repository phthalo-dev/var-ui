import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

/**
 * Dark-mode surface ladder on the same warm neutral hue as the light ramp (stone, h≈55).
 * Three steps: canvas (page), chrome (side nav, cards), raised (code, wells, popovers).
 */
const darkSurface = {
  canvas: 'oklch(0.17 0.006 60)',
  chrome: 'oklch(0.2 0.007 60)',
  raised: 'oklch(0.235 0.008 60)',
  overlay: 'oklch(0.265 0.009 60)',
} as const;

/**
 * Code surfaces are a quiet warm neutral, so syntax color carries the meaning and the accent
 * stays reserved for interaction. The header shares the body color; a hairline separates them.
 */
export const codeSurfaceValues = {
  code: {
    light: tokens.color.palette['stone-1'].var,
    dark: darkSurface.raised,
  },
  codeHeader: {
    light: tokens.color.palette['stone-1'].var,
    dark: darkSurface.raised,
  },
};

export const background = {
  app: {
    light: tokens.color.palette['neutral-0'].var,
    dark: darkSurface.canvas,
  },
  surface: {
    light: tokens.color.palette['neutral-0'].var,
    dark: darkSurface.chrome,
  },
  subtle: {
    light: tokens.color.palette['stone-1'].var,
    dark: darkSurface.raised,
  },
  elevated: {
    light: tokens.color.palette['neutral-1'].var,
    dark: darkSurface.overlay,
  },
  popover: tokens.color.background.elevated.var,
  muted: tokens.color.background.subtle.var,
  secondary: {
    light: tokens.color.palette['stone-2'].var,
    dark: 'oklch(0.3 0.009 60)',
  },
  tertiary: {
    light: tokens.color.palette['stone-3'].var,
    dark: 'oklch(0.36 0.01 60)',
  },
  ...codeSurfaceValues,
} satisfies ColorTokenPatch['background'];
