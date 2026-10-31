import { atProperty, type TokenSchema } from 'typestyles';

export const zIndexTokenSchema = {
  base: atProperty.integer,
  raised: atProperty.integer,
  lifted: atProperty.integer,
  sticky: atProperty.integer,
  overlay: atProperty.integer,
  max: atProperty.integer,
} as const satisfies TokenSchema;
