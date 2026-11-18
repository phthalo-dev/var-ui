import { designTokens as t, registerFontFace, typestyles } from '@var-ui/core';
import { variant } from 'typestyles';

/**
 * Brand face for the wordmark only (code keeps the theme's mono): Geist Mono, crisp at hero
 * size. OFL, latin subset.
 */
registerFontFace({
  family: 'Geist Mono',
  src: "url('/fonts/geist-mono-latin.woff2') format('woff2')",
  fontWeight: '100 900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
});

const wordmarkSize = variant.enum(['hero', 'header', 'bar', 'mark', 'inline'], { default: 'hero' });

/** `min-width: md`: includes 768 (the `max` query does too, so it would hide the text there). */
const atMd = typestyles.breakpoint('md', 'min');

/** Shared Var UI wordmark with theme-aware CSS syntax colors. */
export const varUiWordmark = typestyles.recipe({
  name: 'wordmark',
  layer: 'components',
  slots: ['root', 'mark', 'text', 'keyword', 'punctuation', 'customProperty'],
  variants: {
    size: wordmarkSize,
  },
  styles: () => ({
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'baseline',
        maxWidth: '100%',
        margin: 0,
        fontFamily: `'Geist Mono', ${t.fontFamily.mono.var}`,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: t.color.code.base.var,
        fontFeatureSettings: '"calt", "liga"',
      },
      // Brand mark (`@var-ui/icons/brand`): an accent tile with `(-)`, the `var(--ui)` call in
      // miniature, set before the wordmark. The favicon draws the same glyph on the same tile.
      mark: {
        display: 'inline-flex',
        flexShrink: 0,
        alignSelf: 'center',
        width: '1.25rem',
        height: '1.25rem',
        marginInlineEnd: t.space.xs.var,
        // Same corner as the favicon tile (rx 6 on 24).
        borderRadius: '25%',
        backgroundColor: t.color.tone.accent.foreground.var,
        color: t.color.background.surface.var,
        '& svg': { display: 'block', width: '100%', height: '100%' },
      },
      // The `var(--ui)` text run, one box so `bar` can drop it on narrow screens.
      text: {
        display: 'inline-flex',
        alignItems: 'baseline',
      },
      keyword: {
        // Brand pairing: phthalo accent for `var`, amber for `--ui`.
        color: t.color.tone.accent.foreground.var,
      },
      punctuation: {
        color: t.color.code.base.var,
      },
      customProperty: {
        color: t.color.code.attr.var,
        fontWeight: t.fontWeight.medium.var,
      },
    },
    variants: {
      size: {
        hero: {
          root: {
            fontSize: 'clamp(3.5rem, 14vw, 9rem)',
            letterSpacing: '-0.08em',
            textShadow: `0 0 64px color-mix(in oklch, ${t.color.tone.accent.foreground.var} 35%, transparent)`,
          },
        },
        header: {
          root: {
            flexShrink: 0,
            // Centre the 1em text boxes on the 20px tile (baseline alignment sat them ~1.5px high).
            alignItems: 'center',
            fontSize: t.fontSize.lg.var,
            letterSpacing: '-0.05em',
          },
          text: { alignItems: 'center' },
        },
        // App bar: the tile + wordmark lockup from `md` (768px) up, the tile alone below (the narrow bar
        // keeps its room for search, appearance and the hamburger). The tile matches `mark`.
        bar: {
          root: {
            flexShrink: 0,
            alignItems: 'center',
            fontSize: t.fontSize.lg.var,
            letterSpacing: '-0.05em',
          },
          mark: {
            width: '1.5rem',
            height: '1.5rem',
            marginInlineEnd: 0,
            [atMd]: { marginInlineEnd: t.space.xs.var },
          },
          text: {
            display: 'none',
            alignItems: 'center',
            [atMd]: { display: 'inline-flex' },
          },
        },
        // Icon only (drawer header): the tile alone, a touch larger than in the lockup.
        mark: {
          root: { flexShrink: 0, alignItems: 'center' },
          mark: { width: '1.5rem', height: '1.5rem', marginInlineEnd: 0 },
        },
        inline: {
          root: {
            display: 'inline',
            fontSize: '0.92em',
            letterSpacing: '-0.06em',
          },
          text: { display: 'inline' },
        },
      },
    },
  }),
});
