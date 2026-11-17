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
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
        paddingBlock: t.space.md.var,
        paddingInline: t.space.md.var,
        borderBlock: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
      },
      // Each list is one centred line on wide screens (tokens, then facts: about equal
      // length); narrower screens wrap it; phones turn it into name/value rows.
      list: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `${t.space.xs.var} ${t.space.lg.var}`,
        width: '100%',
        maxWidth: '80rem',
        marginInline: 'auto',
        marginBlock: 0,
        padding: 0,
        listStyle: 'none',
        // Phones: the long token declarations become name/value rows; the short facts wrap.
        '&[data-tokens]': {
          [belowMd]: { flexDirection: 'column', gap: 0, maxWidth: '30rem' },
        },
        [belowMd]: { columnGap: t.space.md.var },
      },
      item: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        [belowMd]: { fontSize: t.fontSize.xs.var },
        // Phones: a token name may wrap at its hyphens; its value stays on the same row.
        '[data-tokens] > &': {
          [belowMd]: {
            display: 'flex',
            alignItems: 'baseline',
            paddingBlock: '0.3125rem',
            borderBottom: `1px dashed ${t.color.border.default.var}`,
            whiteSpace: 'normal',
          },
        },
      },
      swatch: {
        flexShrink: 0,
        alignSelf: 'center',
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: t.radius.sm.var,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${t.color.text.primary.var} 20%, transparent)`,
      },
      prop: {
        color: t.color.code.attr.var,
        '[data-tokens] &': { [belowMd]: { flex: '1 1 auto', minWidth: 0 } },
      },
      value: {
        color: t.color.text.primary.var,
        fontWeight: t.fontWeight.semibold.var,
        whiteSpace: 'nowrap',
      },
    },
  }),
});
