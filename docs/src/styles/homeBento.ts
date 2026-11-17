import { atReducedMotion, designTokens as t, typestyles } from '@var-ui/core';
import { atProperty, keyframes } from 'typestyles';

/** Tiles settle in as they scroll into view (scroll-driven; off under reduced motion). */
const tileEnter = keyframes.create('home-bento-tile-enter', {
  from: { opacity: '0', translate: '0 0.5rem' },
  to: { opacity: '1', translate: '0 0' },
});

const belowMd = typestyles.breakpoint('md', 'max');
const belowLg = typestyles.breakpoint('lg', 'max');

const mix = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;

/** Homepage showcase: theme picker, live token readout, and a bento of product UI. */
export const homeBento = typestyles.recipe({
  name: 'home-bento',
  layer: 'components',
  slots: [
    'picker',
    'switcher',
    'switcherOption',
    'switcherSwatches',
    'switcherSwatch',
    'switcherLabel',
    'switcherAa',
    'tokens',
    'tokenLine',
    'tokenName',
    'tokenValue',
    'showcase',
    'grid',
    'tile',
    'spanWide',
    'spanNarrow',
    'spanHalf',
    'spanFull',
    'tileRowSpan2',
    'tileWide',
    'bars',
    'bar',
    'calendarSplit',
    'agenda',
    'agendaItem',
    'quote',
    'faces',
    'tileHeader',
    'tileFooter',
    'figure',
    'chat',
  ],
  vars: {
    // Captured on the picker (page theme), so each option's selection state uses the page's
    // own accent and border even though the option itself wears another theme.
    pageAccent: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
      slots: ['picker'],
    },
    pageBorder: { ...atProperty.color, value: t.color.border.default.var, slots: ['picker'] },
    pageCanvas: { ...atProperty.color, value: t.color.background.app.var, slots: ['picker'] },
  },
  styles: ({ vars }) => ({
    base: {
      picker: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 22rem)',
        alignItems: 'stretch',
        gap: t.space.md.var,
        [belowLg]: { gridTemplateColumns: 'minmax(0, 1fr)' },
      },
      switcher: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: t.space.xs.var,
        [belowMd]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
      },
      switcherOption: {
        appearance: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.space.sm.var,
        padding: t.space.sm.var,
        position: 'relative',
        borderRadius: t.radius.lg.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        // The page border, not the option's theme border (some themes use loud borders).
        borderColor: vars.pageBorder.var,
        backgroundColor: t.color.background.surface.var,
        color: t.color.text.primary.var,
        fontFamily: t.fontFamily.body.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, background-color 160ms ease, color 160ms ease',
        transitionProperty: 'border-color, transform, box-shadow',
        '&:hover': {
          borderColor: mix(vars.pageAccent.var, 50),
          transform: 'translateY(-2px)',
          boxShadow: t.shadow.md.var,
        },
        '&:active': { transform: 'translateY(0)' },
        ...atReducedMotion({ transition: 'none', '&:hover': { transform: 'none' } }),
        '&:focus-visible': {
          outline: `0.125rem solid ${vars.pageAccent.var}`,
          outlineOffset: '0.125rem',
        },
        // Selected: a page-accent ring outside the card plus a check badge — unmistakable
        // whatever the option's own theme looks like.
        '&[aria-checked="true"]': {
          borderColor: vars.pageAccent.var,
          outline: `0.125rem solid ${vars.pageAccent.var}`,
          outlineOffset: '0.1875rem',
        },
        '&[aria-checked="true"]::after': {
          content: '"✓"',
          position: 'absolute',
          top: '-0.5rem',
          right: '-0.5rem',
          display: 'grid',
          placeItems: 'center',
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: t.radius.full.var,
          backgroundColor: vars.pageAccent.var,
          color: vars.pageCanvas.var,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.bold.var,
        },
      },
      switcherSwatches: {
        display: 'flex',
        width: '100%',
        height: '1.75rem',
        borderRadius: t.radius.md.var,
        overflow: 'hidden',
        boxShadow: `inset 0 0 0 1px ${mix(t.color.text.primary.var, 12)}`,
      },
      switcherSwatch: {
        flex: '1 1 0',
      },
      switcherAa: {
        fontFamily: t.fontFamily.display.var,
        fontSize: t.fontSize.lg.var,
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.tone.accent.foreground.var,
      },
      switcherLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      },
      tokens: {
        display: 'flex',
        // Phones: the themed picker cards say it; the readout is a desktop detail.
        [belowMd]: { display: 'none' },
        flexDirection: 'column',
        justifyContent: 'center',
        gap: t.space.xs.var,
        padding: t.space.md.var,
        borderRadius: t.radius.lg.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: t.color.background.subtle.var,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        lineHeight: t.lineHeight.relaxed.var,
        minWidth: 0,
      },
      tokenLine: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        minWidth: 0,
        whiteSpace: 'nowrap',
      },
      tokenName: {
        color: t.color.code.attr.var,
        flexShrink: 0,
      },
      tokenValue: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: t.color.code.string.var,
      },
      showcase: {
        // No frame of its own: the tiles sit on the page and repaint under the theme class.
        color: t.color.text.primary.var,
        fontFamily: t.fontFamily.body.var,
        textAlign: 'left',
      },
      grid: {
        display: 'grid',
        // Six columns so tiles can take uneven, editorial spans (4/2, 3/3, full).
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gridAutoFlow: 'dense',
        gap: t.space.md.var,
        [belowLg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
        [belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: t.space.xs.var },
      },
      tile: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
        minWidth: 0,
        borderRadius: t.radius.xl.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: t.color.background.surface.var,
        boxShadow: t.shadow.sm.var,
        padding: t.space.lg.var,
        transition:
          'background-color 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease',
        '&:hover': {
          borderColor: t.color.border.strong.var,
          boxShadow: t.shadow.md.var,
          // `transform`, not `translate`: the entrance animation owns `translate`.
          transform: 'translateY(-2px)',
        },
        '@supports (animation-timeline: view())': {
          animationName: tileEnter,
          animationTimingFunction: 'ease-out',
          animationFillMode: 'both',
          animationTimeline: 'view()',
          // Settled once a fifth of the tile is in view: never mid-fade while being read.
          animationRange: 'entry 0% entry 20%',
        },
        ...atReducedMotion({
          transition: 'none',
          animation: 'none',
          '&:hover': { transform: 'none' },
        }),
        [belowMd]: { padding: t.space.md.var },
      },
      // Spans on the 6-column grid; tablet (2 columns) and phones (1) collapse them.
      spanWide: {
        gridColumn: 'span 4',
        [belowLg]: { gridColumn: 'span 2' },
        [belowMd]: { gridColumn: 'auto' },
      },
      spanNarrow: {
        gridColumn: 'span 2',
        [belowLg]: { gridColumn: 'span 1' },
        [belowMd]: { gridColumn: 'auto' },
      },
      spanHalf: {
        gridColumn: 'span 3',
        [belowLg]: { gridColumn: 'span 1' },
        [belowMd]: { gridColumn: 'auto' },
      },
      spanFull: {
        gridColumn: '1 / -1',
      },
      tileRowSpan2: {
        gridRow: 'span 2',
        [belowMd]: { gridRow: 'auto' },
      },
      // Desktop-only tile: phones get the five most expressive tiles.
      tileWide: {
        [belowMd]: { display: 'none' },
      },
      bars: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.375rem',
        height: '4.5rem',
      },
      bar: {
        flex: '1 1 0',
        minHeight: '0.25rem',
        borderRadius: `${t.radius.sm.var} ${t.radius.sm.var} 0 0`,
        backgroundColor: t.color.tone.accent.subtleBackground.var,
        '&[data-current]': { backgroundColor: t.color.tone.accent.background.var },
      },
      calendarSplit: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 18rem) minmax(0, 1fr)',
        alignItems: 'start',
        gap: t.space.lg.var,
        [belowLg]: { gridTemplateColumns: 'minmax(0, 1fr)' },
      },
      agenda: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xs.var,
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      agendaItem: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'center',
        columnGap: t.space.sm.var,
        '& > :first-child': { gridColumn: '1 / -1' },
        '& > :nth-child(2)': {
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        padding: t.space.sm.var,
        borderRadius: t.radius.md.var,
        border: `1px solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.app.var,
      },
      quote: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: t.fontSize.xl.var,
        fontWeight: t.fontWeight.medium.var,
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        textWrap: 'balance',
      },
      faces: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space.sm.var,
      },
      tileHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: t.space.sm.var,
        minWidth: 0,
      },
      tileFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: t.space.xs.var,
        marginTop: 'auto',
        paddingTop: t.space.md.var,
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderColor: t.color.border.default.var,
      },
      figure: {
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: t.space.xs.var,
        fontFamily: t.fontFamily.display.var,
        fontSize: t.fontSize.xxxl.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
      },
      chat: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: '24rem',
        [belowMd]: { minHeight: '18rem' },
      },
    },
  }),
});
