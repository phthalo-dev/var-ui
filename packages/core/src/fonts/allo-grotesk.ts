import { defineFonts } from './define-fonts';
import { groteskMono } from './grotesk-mono';
import type { FontFaceDefinition } from './types';

const LATIN_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2190-2193, U+2212, U+2215, U+FEFF, U+FFFD';

const spaceGrotesk = groteskMono.fonts.find((face) => face.family === 'Space Grotesk')!;
const jetBrainsMono = groteskMono.fonts.find((face) => face.family === 'JetBrains Mono')!;

/**
 * Allo (Josh Puckett, OFL-1.1; Inter 4 with redrawn, warmer glyphs) for body and UI text,
 * Space Grotesk for display headlines, JetBrains Mono for code. Allo's even texture carries
 * long prose and small labels; Grotesk keeps titles distinctive.
 *
 * Expects Latin subsets at `/fonts/*` (the docs site ships them): `allo-latin.woff2` is the
 * variable weight axis 100–900 (optical size pinned at 14), `allo-latin-italic.woff2` the
 * regular oblique.
 */
const allo = [
  {
    family: 'Allo',
    src: "url('/fonts/allo-latin.woff2') format('woff2')",
    fontWeight: '100 900',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    unicodeRange: LATIN_UNICODE_RANGE,
  },
  {
    family: 'Allo',
    src: "url('/fonts/allo-latin-italic.woff2') format('woff2')",
    fontWeight: '400',
    fontStyle: 'italic',
    fontDisplay: 'swap',
    unicodeRange: LATIN_UNICODE_RANGE,
  },
] as const satisfies readonly FontFaceDefinition[];

/**
 * Arial tuned to each webfont's average glyph width and vertical metrics (measured from the
 * font files), so text set in the fallback wraps like the webfont and doesn't jump on swap.
 */
const alloFallback = {
  family: 'Allo Fallback',
  src: "local('Arial'), local('ArialMT'), local('Liberation Sans')",
  sizeAdjust: '105.28%',
  ascentOverride: '92.02%',
  descentOverride: '22.91%',
  lineGapOverride: '0%',
} satisfies FontFaceDefinition;

const spaceGroteskFallback = {
  family: 'Space Grotesk Fallback',
  src: "local('Arial'), local('ArialMT'), local('Liberation Sans')",
  sizeAdjust: '110.81%',
  ascentOverride: '88.80%',
  descentOverride: '26.35%',
  lineGapOverride: '0%',
} satisfies FontFaceDefinition;

export const alloGrotesk = defineFonts({
  body: {
    face: allo,
    metricFallback: alloFallback,
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  display: {
    face: spaceGrotesk,
    metricFallback: spaceGroteskFallback,
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  mono: { face: jetBrainsMono, fallback: 'ui-monospace, monospace' },
});
