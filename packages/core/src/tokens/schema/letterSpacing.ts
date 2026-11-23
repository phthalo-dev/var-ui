import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

/**
 * Unregistered on purpose: tracking is authored in `em`, and a `<length>` `@property` would
 * compute `0.06em` once against the root font size where the token is declared, not the
 * text that uses it (a 12px label got 0.96px = 0.08em; a 44px title got root-sized
 * tracking). Unregistered custom properties substitute the raw value, so `em` resolves at
 * the use site.
 */
export const letterSpacingTokenSchema = {
  tight: customToken,
  normal: customToken,
  wide: customToken,
  caps: customToken,
  /** Tight tracking for large display type. */
  display: customToken,
} as const satisfies TokenSchema;
