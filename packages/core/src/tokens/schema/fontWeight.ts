import { atProperty, type TokenSchema } from 'typestyles';

export const fontWeightTokenSchema = {
  light: atProperty.number,
  normal: atProperty.number,
  medium: atProperty.number,
  semibold: atProperty.number,
  bold: atProperty.number,
} as const satisfies TokenSchema;
