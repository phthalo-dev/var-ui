import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

export const background = {
  app: {
    light: tokens.color.palette['neutral-0'].var,
    dark: tokens.color.palette['slate-10'].var,
  },
  surface: {
    light: tokens.color.palette['neutral-0'].var,
    dark: tokens.color.palette['slate-10'].var,
  },
  subtle: {
    light: tokens.color.palette['neutral-1'].var,
    dark: tokens.color.palette['slate-9'].var,
  },
  elevated: {
    light: tokens.color.palette['neutral-1'].var,
    dark: tokens.color.palette['slate-9'].var,
  },
  popover: tokens.color.background.elevated.var,
  muted: tokens.color.background.subtle.var,
  secondary: {
    light: tokens.color.palette['neutral-2'].var,
    dark: tokens.color.palette['neutral-8'].var,
  },
  tertiary: {
    light: tokens.color.palette['neutral-3'].var,
    dark: tokens.color.palette['neutral-7'].var,
  },
} satisfies ColorTokenPatch['background'];
