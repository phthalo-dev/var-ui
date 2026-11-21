import { defineFonts } from './define-fonts';
import { fontFileUrl, LATIN_UNICODE_RANGE, type FontPresetOptions } from './preset';

/**
 * Space Grotesk for body and UI text, JetBrains Mono for code.
 *
 * Var UI does not ship the font files. Self-host them under `baseUrl` (default `/fonts/`):
 * `space-grotesk-latin.woff2` and `jetbrains-mono-latin.woff2`, the latin variable subsets from
 * Google Fonts or Fontsource (`@fontsource-variable/space-grotesk`, `…/jetbrains-mono`).
 *
 * ```ts
 * const fonts = groteskMono({ baseUrl: '/assets/fonts/' });
 * createDesignTheme({ name: 'app', fonts: fonts.fonts, tokens: { fontFamily: fonts.tokens.fontFamily } });
 * ```
 */
export function groteskMono(options: FontPresetOptions = {}) {
  return defineFonts({
    body: {
      face: {
        family: 'Space Grotesk',
        src: fontFileUrl(options, 'space-grotesk-latin.woff2'),
        fontWeight: '300 700',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        unicodeRange: LATIN_UNICODE_RANGE,
      },
      fallback: 'ui-sans-serif, system-ui, sans-serif',
    },
    mono: {
      face: {
        family: 'JetBrains Mono',
        src: fontFileUrl(options, 'jetbrains-mono-latin.woff2'),
        fontWeight: '100 800',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        unicodeRange: LATIN_UNICODE_RANGE,
      },
      fallback: 'ui-monospace, monospace',
    },
  });
}
