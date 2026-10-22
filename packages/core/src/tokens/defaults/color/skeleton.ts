import { mix } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const skeleton = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 80, 'oklch'),
} satisfies ColorTokenPatch['skeleton'];
