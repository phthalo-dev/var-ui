import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const text = {
  primary: {
    light: '#14110D',
    dark: tokens.color.palette['slate-1'].var,
  },
  secondary: {
    light: tokens.color.palette['stone-8'].var,
    dark: tokens.color.palette['slate-3'].var,
  },
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
} satisfies ColorTokenPatch['text'];
