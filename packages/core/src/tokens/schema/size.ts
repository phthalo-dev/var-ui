import { atProperty, type TokenSchema } from 'typestyles';

export const sizeTokenSchema = {
  control: {
    xs: atProperty.length,
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
    xl: atProperty.length,
  },
  icon: {
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
  },
  /** Minimum widths for text-entry fields. */
  field: {
    minWidth: atProperty.length,
    minWidthCompact: atProperty.length,
  },
  /** Widths for popups, dialogs, drawers and other free-standing panels. */
  panel: {
    xs: atProperty.length,
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
    xl: atProperty.length,
    xxl: atProperty.length,
  },
  /**
   * Checkbox / radio / switch geometry per control size: `box` is the checkbox/radio square and the
   * switch thumb, `dot` the radio mark, `trackWidth`/`trackHeight` the switch track.
   */
  indicator: {
    box: { sm: atProperty.length, md: atProperty.length, lg: atProperty.length },
    dot: { sm: atProperty.length, md: atProperty.length, lg: atProperty.length },
    trackWidth: { sm: atProperty.length, md: atProperty.length, lg: atProperty.length },
    trackHeight: { sm: atProperty.length, md: atProperty.length, lg: atProperty.length },
  },
  /** Square media: thumbnails, empty-state artwork, large progress circles. */
  media: {
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
  },
  nav: {
    bar: atProperty.length,
  },
} as const satisfies TokenSchema;
