import { atProperty, type TokenSchema } from 'typestyles';

export const fontSizeTokenSchema = {
  xs: atProperty.lengthPercentage,
  sm: atProperty.lengthPercentage,
  md: atProperty.lengthPercentage,
  lg: atProperty.lengthPercentage,
  xl: atProperty.lengthPercentage,
  xxl: atProperty.lengthPercentage,
  xxxl: atProperty.lengthPercentage,
} as const satisfies TokenSchema;
