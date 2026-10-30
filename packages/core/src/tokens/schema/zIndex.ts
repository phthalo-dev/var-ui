import { atProperty, type TokenSchema } from 'typestyles';

export const zIndexTokenSchema = {
  base: atProperty.integer,
  raised: atProperty.integer,
  lifted: atProperty.integer,
  sticky: atProperty.integer,
  dropdown: atProperty.integer,
  overlay: atProperty.integer,
  toast: atProperty.integer,
  modal: atProperty.integer,
  max: atProperty.integer,
} as const satisfies TokenSchema;
