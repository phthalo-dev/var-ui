import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/**
 * One quiet, static band of real custom properties: this page's live token values (read
 * from :root at runtime) and the project's numbers, written as declarations. It wraps
 * instead of scrolling, so every item is fully visible at any width.
 */
export const homeRibbons = typestyles.recipe({
  name: 'home-ribbons',
  layer: 'components',
  slots: ['root', 'list', 'item', 'swatch', 'prop', 'value'],
  styles: () => ({
    base: {
      root: {
        paddingBlock: t.space.md.var,
        paddingInline: t.space.md.var,
        borderBlock: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
      },
      list: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `${t.space.xs.var} ${t.space.xl.var}`,
        maxWidth: '80rem',
        marginInline: 'auto',
        marginBlock: 0,
        padding: 0,
        listStyle: 'none',
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        // Phones: a long name and its value break onto two lines instead of overflowing.
        [belowMd]: { flexWrap: 'wrap', justifyContent: 'center', fontSize: t.fontSize.xs.var },
      },
      swatch: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: t.radius.sm.var,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${t.color.text.primary.var} 20%, transparent)`,
      },
      prop: { color: t.color.code.attr.var },
      value: {
        color: t.color.text.primary.var,
        fontWeight: t.fontWeight.semibold.var,
      },
    },
  }),
});
