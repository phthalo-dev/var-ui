import {
  createDesignTheme,
  figtreeGrotesk,
  tokenValues,
  type DesignThemeTokenValues,
} from '@var-ui/core';
import type { CreateTokenValues } from 'typestyles';

/**
 * Ensures the default theme surface CSS is extracted into `typestyles.css`.
 * Other showcase themes are extracted to `/themes/<id>.css` via `typestyles-themes/*`.
 */
const docsDefaultTokens = {
  ...tokenValues,
  // Figtree body, Space Grotesk display, JetBrains Mono code.
  fontFamily: { ...tokenValues.fontFamily, ...figtreeGrotesk().tokens.fontFamily },
} satisfies DesignThemeTokenValues;

export const defaultTheme = createDesignTheme({
  name: 'default',
  tokens: docsDefaultTokens as DesignThemeTokenValues as Record<string, CreateTokenValues>,
  fonts: figtreeGrotesk().fonts,
});
