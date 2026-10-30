import { atProperty, type TokenSchema } from 'typestyles';

export const durationTokenSchema = {
  fast: atProperty.time,
  medium: atProperty.time,
  slow: atProperty.time,
} as const satisfies TokenSchema;
