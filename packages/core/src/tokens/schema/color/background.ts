import { atProperty, type TokenSchema } from 'typestyles';

export const backgroundTokenSchema = {
  app: atProperty.color,
  surface: atProperty.color,
  subtle: atProperty.color,
  elevated: atProperty.color,
  popover: atProperty.color,
  muted: atProperty.color,
  secondary: atProperty.color,
  tertiary: atProperty.color,
  /** Code surfaces (code blocks, inspectors): the surface nudged toward the accent hue. */
  code: atProperty.color,
  /** Code block header strip, one step stronger than `code`. */
  codeHeader: atProperty.color,
} as const satisfies TokenSchema;
