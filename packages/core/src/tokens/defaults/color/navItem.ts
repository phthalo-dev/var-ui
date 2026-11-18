import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const navItem = {
  foreground: tokens.color.text.secondary.var,
  background: 'transparent',
  hoverBackground: tokens.color.background.subtle.var,
  activeBackground: tokens.color.tone.accent.subtleBackground.var,
  selectedBackground: {
    light: tokens.color.tone.accent.subtleBackground.var,
    // A real accent tint on dark chrome (≈14%), not a half-transparent wash that disappears.
    dark: `color-mix(in oklab, ${tokens.color.tone.accent.foreground.var} 14%, transparent)`,
  },
  selectedForeground: tokens.color.tone.accent.foreground.var,
} satisfies ColorTokenPatch['navItem'];
