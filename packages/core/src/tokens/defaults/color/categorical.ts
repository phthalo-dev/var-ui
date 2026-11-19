import { tokens } from '../../declare';
import { PALETTE_FAMILIES, type PaletteFamily } from '../../schema/color/palette';
import type { ColorTokenPatch } from '../../types';

const p = tokens.color.palette;

/**
 * Every palette family as a named hue: step 7 in light mode (≥ 5.5:1 on surface and subtle),
 * step 4 in dark mode (≥ 8:1), so the hue works as badge text, an outline and a solid fill.
 */
export const hue = Object.fromEntries(
  PALETTE_FAMILIES.map((family) => [
    family,
    { light: p[`${family}-7`].var, dark: p[`${family}-4`].var },
  ]),
) as Record<PaletteFamily, { light: string; dark: string }> satisfies ColorTokenPatch['hue'];

const h = tokens.color.hue;

/** Chart series order: blue, orange, teal, pink, grass, violet, amber, red. */
export const categorical = {
  1: h.blue.var,
  2: h.orange.var,
  3: h.teal.var,
  4: h.pink.var,
  5: h.grass.var,
  6: h.violet.var,
  7: h.amber.var,
  8: h.red.var,
} satisfies ColorTokenPatch['categorical'];

export const chart = {
  axis: tokens.color.text.secondary.var,
  gridline: tokens.color.border.subtle.var,
  plot: tokens.color.background.surface.var,
} satisfies ColorTokenPatch['chart'];
