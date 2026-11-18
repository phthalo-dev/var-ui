import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const border = {
  default: {
    light: tokens.color.palette['stone-3'].var,
    dark: 'oklch(0.31 0.009 60)',
  },
  strong: {
    light: tokens.color.palette['stone-4'].var,
    dark: 'oklch(0.39 0.011 60)',
  },
  focus: tokens.color.tone.accent.foreground.var,
  subtle: {
    light: tokens.color.palette['stone-2'].var,
    dark: 'oklch(0.265 0.008 60)',
  },
} satisfies ColorTokenPatch['border'];
