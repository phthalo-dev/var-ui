import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const border = {
  default: {
    light: tokens.color.palette['neutral-3'].var,
    dark: tokens.color.palette['slate-8'].var,
  },
  strong: {
    light: tokens.color.palette['neutral-4'].var,
    dark: tokens.color.palette['slate-7'].var,
  },
  focus: tokens.color.tone.accent.foreground.var,
  subtle: {
    light: tokens.color.palette['neutral-2'].var,
    dark: tokens.color.palette['slate-9'].var,
  },
} satisfies ColorTokenPatch['border'];
