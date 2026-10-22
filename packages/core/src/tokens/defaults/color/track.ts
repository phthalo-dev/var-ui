import { mix } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const track = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 65, 'oklch'),
} satisfies ColorTokenPatch['track'];
