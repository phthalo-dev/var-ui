import { atProperty, type TokenSchema } from 'typestyles';

export const breakpointTokenSchema = {
  sm: atProperty.length,
  md: atProperty.length,
  lg: atProperty.length,
  xl: atProperty.length,
  xxl: atProperty.length,
} as const satisfies TokenSchema;
