import { designTokens as t, typestyles } from '@var-ui/core';

/** Visual token reference: spacing bars, radius tiles, and a type-scale specimen. */
export const tokenSpecimens = typestyles.recipe({
  name: 'docs-token-specimens',
  layer: 'components',
  slots: ['list', 'row', 'tokenName', 'tokenValue', 'bar', 'tiles', 'tile', 'tileShape', 'sample'],
  styles: () => ({
    base: {
      list: {
        display: 'flex',
        flexDirection: 'column',
        marginBlock: `${t.space.md.var} ${t.space.lg.var}`,
        borderBlockStart: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
      },
      row: {
        display: 'grid',
        gridTemplateColumns: '7rem 5.5rem minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: t.space.md.var,
        minHeight: '2.5rem',
        paddingBlock: t.space.xs.var,
        borderBlockEnd: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
      },
      tokenName: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.text.primary.var,
      },
      tokenValue: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
      },
      bar: {
        height: '0.75rem',
        borderRadius: t.radius.sm.var,
        backgroundColor: `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 70%, ${t.color.background.surface.var})`,
      },
      tiles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))',
        gap: t.space.sm.var,
        marginBlock: `${t.space.md.var} ${t.space.lg.var}`,
      },
      tile: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xxs.var,
      },
      tileShape: {
        height: '4.5rem',
        border: `${t.borderWidth.thick.var} solid color-mix(in oklab, ${t.color.tone.accent.foreground.var} 60%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 8%, ${t.color.background.surface.var})`,
      },
      sample: {
        minWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        color: t.color.text.primary.var,
        lineHeight: 1.2,
      },
    },
  }),
});
