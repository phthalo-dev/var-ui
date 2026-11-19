import { atProperty, type TokenSchema } from 'typestyles';
import { PALETTE_FAMILIES, type PaletteFamily } from './palette';

/**
 * Identity colors by name (`blue`, `red`, `sage`, …): one mode-aware color per base palette
 * family, readable as text on `background.surface` and `background.subtle` in both modes. For
 * roles, kinds and labels, not status (use `tone` for that).
 */
export const hueTokenSchema = Object.fromEntries(
  PALETTE_FAMILIES.map((family) => [family, atProperty.color]),
) as { readonly [F in PaletteFamily]: typeof atProperty.color };

/**
 * Chart series in order (`1` first). Each is a named hue, ordered so neighbours differ most;
 * themes can reorder or swap them.
 */
export const categoricalTokenSchema = {
  1: atProperty.color,
  2: atProperty.color,
  3: atProperty.color,
  4: atProperty.color,
  5: atProperty.color,
  6: atProperty.color,
  7: atProperty.color,
  8: atProperty.color,
} as const satisfies TokenSchema;

/** Chart chrome: axis labels and ticks, gridlines, and the plot area. */
export const chartTokenSchema = {
  axis: atProperty.color,
  gridline: atProperty.color,
  plot: atProperty.color,
} as const satisfies TokenSchema;
