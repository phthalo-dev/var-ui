import { keyframes } from 'typestyles';
import { atReducedMotion, designTokens as t, typestyles } from '@var-ui/core';

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
    'tokenText',
    'tokenName',
    'tokenValue',
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
          gridTemplateColumns: 'minmax(0, 0.85fr) 2rem minmax(0, 2.2fr) 2rem minmax(0, 0.85fr)',
          gridTemplateRows: 'auto auto',
          alignItems: 'start',
        },
      },
      label: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        [fromLg]: { gridRow: '1' },
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
      step2: step(3),
      step3: step(5),
      token: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space.sm.var,
        paddingBlock: t.space.sm.var,
        paddingInline: t.space.md.var,
        borderRadius: t.radius.lg.var,
        border: `1px solid ${mix(t.color.tone.accent.foreground.var, 45)}`,
        backgroundColor: t.color.tone.accent.subtleBackground.var,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.primary.var,
      },
      tokenText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.125rem',
        minWidth: 0,
      },
      tokenName: {
        color: t.color.code.attr.var,
        overflowWrap: 'anywhere',
      },
      tokenValue: { color: t.color.text.primary.var, fontWeight: t.fontWeight.semibold.var },
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
        gap: t.space.md.var,
        padding: t.space.lg.var,
        borderRadius: t.radius.lg.var,
        border: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
        '& > .var-ui-progress-bar': { alignSelf: 'stretch' },
      },
      connector: {
        height: '2px',
        // Level with the first line of the cells.
        marginTop: '1.4rem',
        marginInline: t.space.xs.var,
        backgroundImage: `linear-gradient(90deg, ${t.color.tone.accent.foreground.var} 50%, transparent 50%)`,
        backgroundSize: '0.75rem 2px',
        animation: `${flow} 1.2s linear infinite`,
        ...atReducedMotion({ animation: 'none' }),
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
