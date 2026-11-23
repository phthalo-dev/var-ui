import {
  createDesignTheme,
  alloGrotesk,
  tokenValues,
  type DesignThemeTokenValues,
} from '@var-ui/core';
import type { CreateTokenValues } from 'typestyles';

// Allo body, Space Grotesk display, JetBrains Mono code; the files are in `public/fonts/`.
const fonts = alloGrotesk();

/**
 * Ensures the default theme surface CSS is extracted into `typestyles.css`.
 * Other showcase themes are extracted to `/themes/<id>.css` via `typestyles-themes/*`.
 */
const docsDefaultTokens = {
  ...tokenValues,
  fontFamily: { ...tokenValues.fontFamily, ...fonts.tokens.fontFamily },
} satisfies DesignThemeTokenValues;

export const defaultTheme = createDesignTheme({
  name: 'default',
  tokens: docsDefaultTokens as DesignThemeTokenValues as Record<string, CreateTokenValues>,
  fonts: fonts.fonts,
});
