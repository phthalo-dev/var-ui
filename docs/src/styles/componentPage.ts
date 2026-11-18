import { designTokens as t, typestyles } from '@var-ui/core';

/**
 * Component reference page body. The MDX source repeats the title, description, and a props
 * table that the page header and Props tab already show, so the Documentation article hides them.
 */
export const componentDocArticle = typestyles.recipe({
  name: 'docs-component-article',
  // Same layer as `proseContent` (utilities) so these overrides of its heading rhythm apply.
  layer: 'utilities',
  slots: ['root', 'panel'],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        '& > h1:first-of-type, & > h1:first-of-type + p': {
          display: 'none',
        },
        '& h2#props, & h2#props + *': {
          display: 'none',
        },
        // The first visible section starts flush with the tab divider.
        '& > h1:first-of-type + p + h2, & > h2:first-child': {
          marginTop: 0,
        },
      },
      panel: {
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.lg.var,
      },
    },
  }),
});

/** Components index: category sections of link cards. */
export const componentCatalog = typestyles.recipe({
  name: 'docs-component-catalog',
  layer: 'components',
  slots: [
    'root',
    'section',
    'header',
    'heading',
    'count',
    'card',
    'guideGrid',
    'thumb',
    'monogram',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xxl.var,
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
      },
      header: {
        display: 'flex',
        alignItems: 'baseline',
        gap: t.space.xs.var,
      },
      heading: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '-0.01em',
      },
      guideGrid: {
        marginBlock: t.space.lg.var,
      },
      // Equal-height cards: descriptions clamp to two lines.
      card: {
        height: '100%',
        boxSizing: 'border-box',
        '& p': {
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
      },
      // Thumbnail tile: a short accent stage carrying the component monogram.
      thumb: {
        display: 'grid',
        placeItems: 'center start',
        paddingInline: t.space.lg.var,
        height: '6.5rem',
        overflow: 'hidden',
      },
      monogram: {
        fontFamily: t.fontFamily.display.var,
        fontSize: '2.5rem',
        lineHeight: 1,
        fontWeight: t.fontWeight.bold.var,
        letterSpacing: '-0.03em',
        color: `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 70%, ${t.color.text.primary.var})`,
      },
      count: {
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.secondary.var,
      },
    },
  }),
});
