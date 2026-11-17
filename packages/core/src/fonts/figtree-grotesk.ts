import { defineFonts } from './define-fonts';
import { groteskMono } from './grotesk-mono';

const LATIN_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const spaceGrotesk = groteskMono.fonts.find((face) => face.family === 'Space Grotesk')!;
const jetBrainsMono = groteskMono.fonts.find((face) => face.family === 'JetBrains Mono')!;

/**
 * Three-voice pairing: Figtree (a warm geometric sans) for body and UI text, Space Grotesk
 * for display headlines, JetBrains Mono for code and token names. Figtree's open apertures
 * and round shapes sit comfortably under Grotesk's quirkier display forms.
 *
 * Expects the woff2 files at `/fonts/*` (the docs site ships them).
 */
export const figtreeGrotesk = defineFonts({
  body: {
    face: {
      family: 'Figtree',
      src: "url('/fonts/figtree-latin.woff2') format('woff2')",
      fontWeight: '300 900',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: LATIN_UNICODE_RANGE,
    },
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  display: { face: spaceGrotesk, fallback: 'ui-sans-serif, system-ui, sans-serif' },
  mono: { face: jetBrainsMono, fallback: 'ui-monospace, monospace' },
});
