import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const text = {
  primary: {
    light: '#14110D',
    dark: 'oklch(0.955 0.004 70)',
  },
  // Muted text sits clearly below body text (≈6:1 on white) so hierarchy reads without color.
  secondary: {
    light: tokens.color.palette['stone-7'].var,
    dark: 'oklch(0.74 0.012 65)',
  },
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
} satisfies ColorTokenPatch['text'];
