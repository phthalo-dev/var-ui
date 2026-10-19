import {
  createDesignTheme,
  groteskMono,
  tokenValues,
  type DesignThemeTokenValues,
} from '@var-ui/core';
import type { CreateTokenValues } from 'typestyles';

/**
 * Ensures the default theme surface CSS is extracted into `typestyles.css`.
 * Other showcase themes are extracted to `/themes/<id>.css` via `typestyles-themes/*`.
 */
export const defaultTheme = createDesignTheme({
  name: 'default',
  tokens: tokenValues as DesignThemeTokenValues as Record<string, CreateTokenValues>,
  fonts: groteskMono.fonts.filter((face) => face.family === 'JetBrains Mono'),
});
