import { atProperty, type TokenSchema } from 'typestyles';

export const lineHeightTokenSchema = {
  tight: atProperty.number,
  normal: atProperty.number,
  relaxed: atProperty.number,
  /** Fixed line heights for `fontSize.prose.*`, so reading text sits on a predictable rhythm. */
  prose: {
    body: atProperty.length,
    lead: atProperty.length,
    h1: atProperty.length,
    h2: atProperty.length,
    h3: atProperty.length,
  },
} as const satisfies TokenSchema;
