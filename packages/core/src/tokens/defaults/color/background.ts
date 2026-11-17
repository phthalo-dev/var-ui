import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

/**
 * Code surfaces carry a trace of the accent so the largest mono panels feel part of the
 * theme instead of a neutral grey slab. Mode-aware: a lighter touch on light surfaces.
 */
export const codeSurfaceValues = {
  code: {
    light: `color-mix(in srgb, ${tokens.color.tone.accent.foreground.var} 4%, ${tokens.color.background.surface.var})`,
    dark: `color-mix(in srgb, ${tokens.color.tone.accent.foreground.var} 9%, ${tokens.color.background.surface.var})`,
  },
  codeHeader: {
    light: `color-mix(in srgb, ${tokens.color.tone.accent.foreground.var} 8%, ${tokens.color.background.surface.var})`,
    dark: `color-mix(in srgb, ${tokens.color.tone.accent.foreground.var} 14%, ${tokens.color.background.subtle.var})`,
  },
};

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
  ...codeSurfaceValues,
} satisfies ColorTokenPatch['background'];
