import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const link = {
  default: tokens.color.tone.accent.foreground.var,
  hover: {
    light: tokens.color.palette['phthalo-8'].var,
    dark: tokens.color.palette['phthalo-3'].var,
  },
} satisfies ColorTokenPatch['link'];
