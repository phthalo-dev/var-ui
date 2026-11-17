import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/** Live keyboard / focus demo for the homepage accessibility feature. */
export const homeKeyboard = typestyles.recipe({
  name: 'home-keyboard',
  layer: 'components',
  slots: [
    'root',
    'demo',
    'row',
    'log',
    'logHeader',
    'entry',
    'keys',
    'target',
    'hint',
    'phoneHidden',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        gap: t.space.md.var,
        minWidth: 0,
        [belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)' },
      },
      // Controls spread over the card's height, so it ends with the log instead of leaving a gap.
      demo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: t.space.lg.var,
        padding: t.space.lg.var,
        borderRadius: t.radius.lg.var,
        border: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.app.var,
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.space.md.var,
      },
      log: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: t.radius.lg.var,
        border: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.code.var,
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.8125rem',
        overflow: 'hidden',
      },
      logHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBlock: t.space.xs.var,
        paddingInline: t.space.md.var,
        borderBottom: `1px solid ${t.color.border.default.var}`,
        color: t.color.text.secondary.var,
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.sm.var,
      },
      entry: {
        display: 'grid',
        gridTemplateColumns: '4.5rem minmax(0, 1fr)',
        [belowMd]: { gridTemplateColumns: '3.5rem minmax(0, 1fr)' },
        alignItems: 'center',
        gap: t.space.sm.var,
        paddingBlock: t.space.xs.var,
        paddingInline: t.space.md.var,
        borderBottom: `1px dashed ${t.color.border.default.var}`,
        // The newest row (the header is the first child).
        '&:nth-child(2)': { backgroundColor: t.color.tone.accent.subtleBackground.var },
        // Leftover example rows under the visitor's own entries.
        '&[data-example]': { opacity: 0.5 },
        // Phones: the three most recent entries are enough.
        '&:nth-child(n + 5)': { [belowMd]: { display: 'none' } },
      },
      keys: {
        display: 'flex',
        whiteSpace: 'nowrap',
      },
      target: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: t.color.text.primary.var,
        // Phones: wrap rather than truncate, so the state (the point of the demo) stays visible.
        [belowMd]: { whiteSpace: 'normal', overflowWrap: 'anywhere' },
        '& b': { color: t.color.code.attr.var, fontWeight: t.fontWeight.normal.var },
      },
      // Phones keep the demo to its core controls.
      phoneHidden: { [belowMd]: { display: 'none' } },
      hint: {
        padding: t.space.md.var,
        color: t.color.text.secondary.var,
        fontFamily: t.fontFamily.body.var,
      },
    },
  }),
});
