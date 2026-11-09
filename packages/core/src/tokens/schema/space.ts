import { atProperty, type TokenSchema } from 'typestyles';

export const spaceTokenSchema = {
  none: atProperty.length,
  xxs: atProperty.length,
  xs: atProperty.length,
  sm: atProperty.length,
  md: atProperty.length,
  lg: atProperty.length,
  xl: atProperty.length,
  xxl: atProperty.length,
  xxxl: atProperty.length,
  xxxxl: atProperty.length,
} as const satisfies TokenSchema;
