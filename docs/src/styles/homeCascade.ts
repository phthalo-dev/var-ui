import { keyframes } from 'typestyles';
import { atReducedMotion, codeBlock, designTokens as t, typestyles } from '@var-ui/core';

const belowLg = typestyles.breakpoint('lg', 'max');
const fromLg = typestyles.breakpoint('lg', 'min');

const flow = keyframes.create('home-cascade-flow', {
  from: { backgroundPosition: '0 0' },
  to: { backgroundPosition: '1.5rem 0' },
});

const mix = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;

/** Desktop grid placement for one step: label on row 1, its content on row 2. */
const step = (column: number) => ({
  [fromLg]: { gridColumn: String(column) },
});

/**
 * Token → recipe → component diagram. Desktop: a 5-column grid (step, connector, step,
 * connector, step) with every label on one baseline row and every cell top-aligned on the
 * next. Narrow screens stack in DOM order; phones drop the recipe step.
 */
export const homeCascade = typestyles.recipe({
  name: 'home-cascade',
  layer: 'components',
  slots: [
    'root',
    'label',
    'cell',
    'step1',
    'step2',
    'step3',
    'token',
    'tokenSwatch',
    'tokenRow',
    'tokenName',
    'tokenValue',
    'caption',
    'components',
    'connector',
    'connector1',
    'connector2',
    'pickers',
    'picker',
    'pickerSwatch',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        rowGap: t.space.sm.var,
        [fromLg]: {
          gridTemplateColumns:
            'minmax(0, 1.15fr) 2.5rem minmax(0, 2.05fr) 2.5rem minmax(0, 0.85fr)',
          gridTemplateRows: 'auto auto',
          // Every step fills the row, so the three cards share a bottom edge.
          alignItems: 'stretch',
        },
      },
      label: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        [fromLg]: { gridRow: '1', alignSelf: 'end' },
        [belowLg]: { marginTop: t.space.md.var },
      },
      cell: {
        minWidth: 0,
        [fromLg]: { gridRow: '2' },
      },
      step1: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
        ...step(1),
      },
      step2: {
        ...step(3),
        display: 'flex',
        flexDirection: 'column',
        // Small code so each declaration fits on one line; the card fills the row.
        '& .var-ui-code-block': {
          [codeBlock.vars.fontSize.name]: t.fontSize.xs.var,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
        },
        '& .var-ui-code-block__body': { flex: '1 1 auto' },
      },
      step3: step(5),
      // Name on one line, swatch + value on the next.
      token: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
        paddingBlock: t.space.sm.var,
        paddingInline: t.space.sm.var,
        borderRadius: t.radius.lg.var,
        border: `1px solid ${mix(t.color.tone.accent.foreground.var, 45)}`,
        backgroundColor: t.color.tone.accent.subtleBackground.var,
        fontFamily: t.fontFamily.mono.var,
        color: t.color.text.primary.var,
      },
      tokenRow: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space.sm.var,
        fontSize: t.fontSize.sm.var,
      },
      tokenName: {
        fontSize: t.fontSize.xs.var,
        color: t.color.code.attr.var,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      tokenValue: {
        color: t.color.text.primary.var,
        fontWeight: t.fontWeight.semibold.var,
        whiteSpace: 'nowrap',
      },
      caption: {
        margin: 0,
        marginTop: 'auto',
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        [belowLg]: { display: 'none' },
      },
      tokenSwatch: {
        width: '1.25rem',
        height: '1.25rem',
        flexShrink: 0,
        borderRadius: t.radius.full.var,
        backgroundColor: t.color.tone.accent.background.var,
        boxShadow: `0 0 0 3px ${mix(t.color.tone.accent.background.var, 25)}`,
      },
      components: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: t.space.md.var,
        padding: t.space.lg.var,
        borderRadius: t.radius.lg.var,
        border: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
        '& > .var-ui-progress-bar': { alignSelf: 'stretch' },
      },
      // Flowing dashed line with an arrowhead, centred between the cards.
      connector: {
        position: 'relative',
        alignSelf: 'center',
        height: '2px',
        marginInlineStart: t.space.xs.var,
        marginInlineEnd: '0.75rem',
        backgroundImage: `linear-gradient(90deg, ${t.color.tone.accent.foreground.var} 50%, transparent 50%)`,
        backgroundSize: '0.75rem 2px',
        animation: `${flow} 1.2s linear infinite`,
        ...atReducedMotion({ animation: 'none' }),
        '&::after': {
          content: '""',
          position: 'absolute',
          insetInlineStart: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderBlock: '0.375rem solid transparent',
          borderInlineStart: `0.5rem solid ${t.color.tone.accent.foreground.var}`,
        },
        [fromLg]: { gridRow: '2' },
        [belowLg]: { display: 'none' },
      },
      connector1: step(2),
      connector2: step(4),
      pickers: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.space.sm.var,
      },
      // The button wears the page theme; only the inner swatch wears the target theme,
      // so every ring is drawn the same way in light and dark.
      picker: {
        appearance: 'none',
        display: 'grid',
        placeItems: 'center',
        width: '2rem',
        height: '2rem',
        padding: 0,
        borderRadius: t.radius.full.var,
        border: 'none',
        backgroundColor: 'transparent',
        boxShadow: `0 0 0 1px ${t.color.border.strong.var}`,
        cursor: 'pointer',
        '&[aria-pressed="true"]': {
          boxShadow: `0 0 0 2px ${t.color.text.primary.var}`,
        },
        '&:focus-visible': {
          outline: `0.125rem solid ${t.color.border.focus.var}`,
          outlineOffset: '0.1875rem',
        },
      },
      pickerSwatch: {
        width: '1.375rem',
        height: '1.375rem',
        borderRadius: t.radius.full.var,
        backgroundColor: t.color.tone.accent.background.var,
      },
    },
  }),
});
