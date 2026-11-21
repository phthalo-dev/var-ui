import { defineFonts } from './define-fonts';
import { groteskMono } from './grotesk-mono';
import { fontFileUrl, LATIN_UNICODE_RANGE, type FontPresetOptions } from './preset';

/**
 * Three-voice pairing: Figtree (a warm geometric sans) for body and UI text, Space Grotesk
 * for display headlines, JetBrains Mono for code and token names. Figtree's open apertures
 * and round shapes sit comfortably under Grotesk's quirkier display forms.
 *
 * Var UI does not ship the font files. Self-host them under `baseUrl` (default `/fonts/`):
 * `figtree-latin.woff2`, `space-grotesk-latin.woff2` and `jetbrains-mono-latin.woff2`.
 */
export function figtreeGrotesk(options: FontPresetOptions = {}) {
  const grotesk = groteskMono(options).fonts;
  const face = (family: string) => grotesk.find((f) => f.family === family)!;
  return defineFonts({
    body: {
      face: {
        family: 'Figtree',
        src: fontFileUrl(options, 'figtree-latin.woff2'),
        fontWeight: '300 900',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        unicodeRange: LATIN_UNICODE_RANGE,
      },
      fallback: 'ui-sans-serif, system-ui, sans-serif',
    },
    display: { face: face('Space Grotesk'), fallback: 'ui-sans-serif, system-ui, sans-serif' },
    mono: { face: face('JetBrains Mono'), fallback: 'ui-monospace, monospace' },
  });
}
