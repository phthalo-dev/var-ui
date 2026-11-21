import { atProperty, type TokenSchema } from 'typestyles';

export const fontSizeTokenSchema = {
  xs: atProperty.lengthPercentage,
  sm: atProperty.lengthPercentage,
  md: atProperty.lengthPercentage,
  lg: atProperty.lengthPercentage,
  xl: atProperty.lengthPercentage,
  xxl: atProperty.lengthPercentage,
  xxxl: atProperty.lengthPercentage,
  /** Fluid marketing/display sizes (hero headlines, section titles). Values may use `clamp()`. */
  display: {
    sm: atProperty.lengthPercentage,
    md: atProperty.lengthPercentage,
    lg: atProperty.lengthPercentage,
  },
  /**
   * Long-form reading type (docs, articles), independent of the 14px control scale. Pair each
   * with `lineHeight.prose.*`.
   */
  prose: {
    body: atProperty.lengthPercentage,
    lead: atProperty.lengthPercentage,
    h1: atProperty.lengthPercentage,
    h2: atProperty.lengthPercentage,
    h3: atProperty.lengthPercentage,
  },
} as const satisfies TokenSchema;
