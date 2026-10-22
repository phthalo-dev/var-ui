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
  focus: {
    light: tokens.color.palette['blue-5'].var,
    dark: tokens.color.palette['blue-6'].var,
  },
  subtle: {
    light: tokens.color.palette['neutral-2'].var,
    dark: tokens.color.palette['slate-9'].var,
  },
} satisfies ColorTokenPatch['border'];
