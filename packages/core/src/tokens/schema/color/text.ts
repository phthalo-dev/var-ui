import { atProperty, type TokenSchema } from 'typestyles';

export const textTokenSchema = {
  primary: atProperty.color,
  secondary: atProperty.color,
  tertiary: atProperty.color,
  disabled: atProperty.color,
  placeholder: atProperty.color,
} as const satisfies TokenSchema;
