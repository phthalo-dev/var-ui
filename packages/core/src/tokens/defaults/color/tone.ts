import { tokens } from '../../declare';
import { createToneFace } from '../../tone-face';

const onLight = tokens.color.palette['neutral-1'].var;
const onDark = tokens.color.palette['stone-10'].var;

export const tone = {
  accent: createToneFace({
    light: {
      foreground: tokens.color.palette['phthalo-7'].var,
      background: tokens.color.palette['phthalo-8'].var,
      foregroundOnBackground: onLight,
    },
    dark: {
      // Desaturated for text on dark surfaces: legible without glowing.
      foreground: 'oklch(0.8 0.1 175)',
      background: tokens.color.palette['phthalo-7'].var,
      foregroundOnBackground: onLight,
    },
  }),
  success: createToneFace({
    light: {
      foreground: tokens.color.palette['green-7'].var,
      background: tokens.color.palette['green-8'].var,
      foregroundOnBackground: onLight,
    },
    dark: {
      foreground: tokens.color.palette['green-4'].var,
      background: tokens.color.palette['green-7'].var,
      foregroundOnBackground: onLight,
    },
  }),
  warning: createToneFace({
    light: {
      foreground: tokens.color.palette['amber-7'].var,
      background: tokens.color.palette['amber-8'].var,
      foregroundOnBackground: onLight,
    },
    dark: {
      foreground: tokens.color.palette['amber-4'].var,
      background: tokens.color.palette['amber-4'].var,
      foregroundOnBackground: onDark,
    },
  }),
  danger: createToneFace({
    light: {
      foreground: tokens.color.palette['red-7'].var,
      background: tokens.color.palette['red-8'].var,
      foregroundOnBackground: onLight,
    },
    dark: {
      foreground: tokens.color.palette['red-4'].var,
      background: tokens.color.palette['red-7'].var,
      foregroundOnBackground: onLight,
    },
  }),
  info: createToneFace({
    light: {
      foreground: tokens.color.palette['blue-7'].var,
      background: tokens.color.palette['blue-8'].var,
      foregroundOnBackground: onLight,
    },
    dark: {
      foreground: tokens.color.palette['blue-4'].var,
      background: tokens.color.palette['blue-7'].var,
      foregroundOnBackground: onLight,
    },
  }),
};
