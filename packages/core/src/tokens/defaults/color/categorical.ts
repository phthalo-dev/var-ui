import { tokens } from '../../declare';
import type { ColorTokenPatch } from '../../types';

const p = tokens.color.palette;

/**
 * Light: step 6 (≥ 4.1:1 on white). Dark: step 5 (≥ 4.8:1 on the dark surface). Ordered so
 * neighbours differ most: blue, orange, teal, pink, grass, violet, amber, red.
 */
export const categorical = {
  1: { light: p['blue-6'].var, dark: p['blue-5'].var },
  2: { light: p['orange-6'].var, dark: p['orange-5'].var },
  3: { light: p['teal-6'].var, dark: p['teal-5'].var },
  4: { light: p['pink-6'].var, dark: p['pink-5'].var },
  5: { light: p['grass-6'].var, dark: p['grass-5'].var },
  6: { light: p['violet-6'].var, dark: p['violet-5'].var },
  7: { light: p['amber-6'].var, dark: p['amber-5'].var },
  8: { light: p['red-6'].var, dark: p['red-5'].var },
} satisfies ColorTokenPatch['categorical'];

export const chart = {
  axis: tokens.color.text.secondary.var,
  gridline: tokens.color.border.subtle.var,
  plot: tokens.color.background.surface.var,
} satisfies ColorTokenPatch['chart'];
