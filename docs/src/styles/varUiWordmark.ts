import { designTokens as t, typestyles } from '@var-ui/core';
import { variant } from 'typestyles';

const wordmarkSize = variant.enum(['hero', 'header', 'inline'], { default: 'hero' });

/** Shared Var UI wordmark with theme-aware CSS syntax colors. */
export const varUiWordmark = typestyles.recipe({
  name: 'wordmark',
  layer: 'components',
  slots: ['root', 'keyword', 'punctuation', 'customProperty'],
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
        fontFamily: t.fontFamily.mono.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: t.color.code.base.var,
        fontFeatureSettings: '"calt", "liga"',
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
            fontSize: t.fontSize.lg.var,
            letterSpacing: '-0.05em',
          },
        },
        inline: {
          root: {
            display: 'inline',
            fontSize: '0.92em',
            letterSpacing: '-0.06em',
          },
        },
      },
    },
  }),
});
