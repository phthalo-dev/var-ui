import { color } from 'typestyles/color';
import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const navItem = {
  foreground: tokens.color.text.secondary.var,
  background: 'transparent',
  hoverBackground: tokens.color.background.subtle.var,
  activeBackground: tokens.color.tone.accent.subtleBackground.var,
  selectedBackground: {
    light: tokens.color.tone.accent.subtleBackground.var,
    dark: color.alpha(tokens.color.tone.accent.subtleBackground.var, 0.5),
  },
  selectedForeground: tokens.color.tone.accent.foreground.var,
} satisfies ColorTokenPatch['navItem'];
