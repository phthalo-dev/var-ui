import { keyframes } from 'typestyles';
import { atReducedMotion, designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

const slide = keyframes.create('home-ribbon-slide', {
  from: { transform: 'translate3d(0, 0, 0)' },
  to: { transform: 'translate3d(-50%, 0, 0)' },
});

/**
 * The page's motif: two crossing ribbons of real custom properties. The phthalo ribbon
 * prints this page's live token values (read from :root at runtime); the amber ribbon
 * prints the project's numbers as declarations. Marquees run in opposite directions and
 * stop under reduced motion.
 */
export const homeRibbons = typestyles.recipe({
  name: 'home-ribbons',
  layer: 'components',
  slots: [
    'root',
    'ribbon',
    'ribbonTokens',
    'ribbonFacts',
    'track',
    'list',
    'item',
    'swatch',
    'prop',
    'value',
  ],
  styles: () => ({
    base: {
      root: {
        position: 'relative',
        overflow: 'hidden',
        height: '10.5rem',
        [belowMd]: { height: '9rem' },
      },
      ribbon: {
        position: 'absolute',
        left: '-10%',
        width: '120%',
        overflow: 'hidden',
        paddingBlock: t.space.md.var,
        boxShadow: t.shadow.lg.var,
        [belowMd]: { paddingBlock: t.space.sm.var },
      },
      ribbonTokens: {
        top: '1.25rem',
        rotate: '-3deg',
        backgroundColor: t.color.tone.accent.background.var,
        color: t.color.tone.accent.foregroundOnBackground.var,
        zIndex: 1,
        [belowMd]: { top: '1.25rem' },
      },
      ribbonFacts: {
        top: '5.75rem',
        rotate: '2deg',
        // Lighter amber step + near-black ink: strong contrast for small rotated mono text.
        backgroundColor: t.color.palette['amber-3'].var,
        color: t.color.palette['stone-10'].var,
        [belowMd]: { top: '5rem' },
        '& [data-ribbon-track]': { animationDirection: 'reverse' },
      },
      track: {
        display: 'flex',
        width: 'max-content',
        animation: `${slide} 60s linear infinite`,
        '&:hover': { animationPlayState: 'paused' },
        ...atReducedMotion({ animation: 'none' }),
      },
      list: {
        display: 'flex',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        paddingInline: t.space.lg.var,
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.lg.var,
        fontWeight: t.fontWeight.medium.var,
        [belowMd]: { fontSize: t.fontSize.md.var },
        '&::after': {
          content: '";"',
          opacity: 0.55,
          marginInlineStart: '-0.25rem',
        },
      },
      swatch: {
        width: '0.875rem',
        height: '0.875rem',
        borderRadius: t.radius.sm.var,
        boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.6), 0 0 0 1px rgb(0 0 0 / 0.15)',
      },
      prop: { opacity: 0.85 },
      value: {
        fontFamily: t.fontFamily.display.var,
        fontWeight: t.fontWeight.bold.var,
        fontSize: t.fontSize.xl.var,
        [belowMd]: { fontSize: t.fontSize.lg.var },
      },
    },
  }),
});
