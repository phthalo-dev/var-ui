import { atProperty, type TokenSchema } from 'typestyles';

/** Shared face for every chromatic semantic tone. */
export const toneFaceTokenSchema = {
  /**
   * The background of the tone
   */
  background: atProperty.color,
  foreground: atProperty.color,
  subtleBackground: atProperty.color,
  border: atProperty.color,
  /** Auto-derived from `background` for filled surfaces; override only when needed. */
  foregroundOnBackground: atProperty.color,
} as const satisfies TokenSchema;

export const TONE_KEYS = ['accent', 'success', 'warning', 'danger', 'info'] as const;
export type ToneKey = (typeof TONE_KEYS)[number];

export const toneTokenSchema = {
  accent: toneFaceTokenSchema,
  success: toneFaceTokenSchema,
  warning: toneFaceTokenSchema,
  danger: toneFaceTokenSchema,
  info: toneFaceTokenSchema,
} as const satisfies TokenSchema;
