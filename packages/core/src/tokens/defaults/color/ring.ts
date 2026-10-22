import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const ring = {
  default: alpha(tokens.color.tone.accent.foreground.var, 0.45, 'oklch'),
} satisfies ColorTokenPatch['ring'];
