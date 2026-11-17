import { atProperty, type TokenSchema } from 'typestyles';

export const overlayTokenSchema = {
  default: atProperty.color,
  backdrop: atProperty.color,
  panel: atProperty.color,
  hover: atProperty.color,
  pressed: atProperty.color,
  /** Shadow ink: a dark tint in both modes (never the light text color). */
  shadow: atProperty.color,
} as const satisfies TokenSchema;
