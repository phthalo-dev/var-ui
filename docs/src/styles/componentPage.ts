import { designTokens as t, typestyles } from '@var-ui/core';

const breakpointMdMax = typestyles.breakpoint('md', 'max');

/**
 * Component reference page body. The MDX source repeats the title, description, and a props
 * table that the page header and Props tab already show, so the Documentation article hides them.
 */
export const componentDocArticle = typestyles.recipe({
  name: 'docs-component-article',
  // Above `docsProse` (base layer), so these overrides of its heading rhythm apply.
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

/**
 * Index pages (components, guides): category sections of compact link cards. Overrides of the
 * core `card` sit under the grid (`& > a`) so they outrank the card recipe in the same layer.
 */
export const componentCatalog = typestyles.recipe({
  name: 'docs-component-catalog',
  layer: 'components',
  slots: ['root', 'section', 'header', 'heading', 'count', 'grid'],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xl.var,
        [breakpointMdMax]: { gap: t.space.lg.var },
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
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
      count: {
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.normal.var,
        fontVariantNumeric: 'tabular-nums',
        color: t.color.text.secondary.var,
      },
      // Compact cards: 15px/600 name over a two-line description, about 96px tall.
      // A plain CSS grid: the Astro `Grid` responsive `columns` map renders a runtime-hashed class
      // whose CSS never reaches the extracted stylesheet (see dx-friction #20).
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: t.space.sm.var,
        marginBlock: t.space.md.var,
        'section > &': { marginBlock: 0 },
        '& > a': {
          gap: t.space.xxs.var,
          padding: `${t.space.sm.var} ${t.space.md.var} ${t.space.md.var}`,
          minHeight: '6rem',
          boxSizing: 'border-box',
        },
        '& > a > span': {
          fontSize: '0.9375rem',
          lineHeight: '1.375rem',
          fontWeight: t.fontWeight.semibold.var,
          color: t.color.text.primary.var,
        },
        '& > a:hover > span': {
          color: t.color.link.default.var,
          textDecoration: 'none',
        },
        '& > a > p': {
          fontSize: t.fontSize.sm.var,
          lineHeight: '1.25rem',
          color: t.color.text.secondary.var,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        [breakpointMdMax]: {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: t.space.xs.var,
          marginBlockStart: 0,
          '& > a': {
            minHeight: 0,
            padding: `${t.space.sm.var} ${t.space.sm.var}`,
          },
          '& > a > span': { fontSize: t.fontSize.md.var },
          '& > a > p': { fontSize: t.fontSize.xs.var, lineHeight: '1rem' },
        },
      },
    },
  }),
});

/** Right-rail extras on component pages (prop and style jump-lists, playground actions). */
export const componentRail = typestyles.recipe({
  name: 'docs-component-rail',
  layer: 'components',
  slots: ['mono', 'actions', 'title', 'action'],
  styles: () => ({
    base: {
      // Jump-list entries are API names: set them in mono like the table they point into.
      mono: {
        '& a': {
          fontFamily: t.fontFamily.mono.var,
          fontSize: '0.75rem',
        },
      },
      // Laid out like the TOC: same label, a left rule, the same row rhythm.
      actions: {
        display: 'flex',
        flexDirection: 'column',
        '& > a': {
          position: 'relative',
          paddingInlineStart: t.space.sm.var,
          borderInlineStart: `${t.borderWidth.thick.var} solid ${t.color.border.subtle.var}`,
        },
        '& > a:hover': {
          borderInlineStartColor: t.color.border.strong.var,
        },
        '& > a:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
          borderRadius: t.radius.sm.var,
        },
      },
      title: {
        margin: `0 0 ${t.space.sm.var}`,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        color: t.color.text.primary.var,
      },
      action: {
        paddingBlock: '0.3125rem',
        lineHeight: '1.125rem',
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        textDecoration: 'none',
        '&:hover': { color: t.color.text.primary.var },
      },
    },
  }),
});
