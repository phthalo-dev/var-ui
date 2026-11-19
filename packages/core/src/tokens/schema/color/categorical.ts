import { atProperty, type TokenSchema } from 'typestyles';

/**
 * Identity colors (agent roles, event kinds, chart series), not status. Eight hues spread around
 * the wheel, mode-aware, each at least 4:1 against `background.surface`.
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
