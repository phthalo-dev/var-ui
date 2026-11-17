import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/** Marketing site footer: brand blurb plus link columns. */
export const siteFooter = typestyles.recipe({
  name: 'site-footer',
  layer: 'components',
  slots: [
    'root',
    'inner',
    'brand',
    'blurb',
    'columns',
    'column',
    'heading',
    'list',
    'link',
    'legal',
  ],
  styles: () => ({
    base: {
      root: {
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: t.color.background.surface.var,
      },
      inner: {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
        gap: t.space.xxl.var,
        width: '100%',
        maxWidth: '76rem',
        marginInline: 'auto',
        paddingInline: t.space.xl.var,
        paddingBlock: t.space.xxxl.var,
        [belowMd]: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          paddingInline: t.space.md.var,
          paddingBlock: t.space.xxl.var,
        },
      },
      brand: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.space.sm.var,
      },
      blurb: {
        maxWidth: '22rem',
      },
      columns: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: t.space.lg.var,
        [belowMd]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
      },
      heading: {
        margin: 0,
      },
      list: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      link: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        textDecoration: 'none',
        '&:hover': { color: t.color.text.primary.var },
        '&:focus-visible': {
          outline: `0.125rem solid ${t.color.border.focus.var}`,
          outlineOffset: '0.125rem',
          borderRadius: t.radius.sm.var,
        },
      },
      legal: {
        gridColumn: '1 / -1',
        paddingTop: t.space.lg.var,
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderColor: t.color.border.default.var,
      },
    },
  }),
});
