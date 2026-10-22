import { designTokens as t, breakpoint, typestyles } from '@var-ui/core';

const belowMd = breakpoint('md', 'max');

/** Marketing homepage layout: centered hero, feature grid, showcase band, and explore cards. */
export const homePage = typestyles.recipe({
  name: 'home-page',
  layer: 'components',
  slots: [
    'root',
    'hero',
    'heroWordmark',
    'heroHeadline',
    'heroActions',
    'heroMeta',
    'install',
    'section',
    'sectionHeader',
    'sectionLead',
    'featuresGrid',
    'featureCard',
    'showcaseBand',
    'exploreGrid',
    'exploreCard',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space[12].var,
        width: '100%',
        maxWidth: '72rem',
        margin: '0 auto',
        paddingBlock: t.space[2].var,
        paddingBottom: t.space[10].var,
        textAlign: 'center',
      },
      hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space[5].var,
        width: '100%',
        paddingBlock: t.space[10].var,
        paddingInline: t.space[6].var,
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
          ellipse 85% 70% at 50% 100%,
          ${t.color.tone.accent.subtleBackground.var} 0%,
          transparent 72%
        )`,
          pointerEvents: 'none',
          zIndex: 0,
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
        [belowMd]: {
          paddingBlock: t.space[8].var,
          paddingInline: t.space[4].var,
        },
      },
      heroWordmark: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: 'clamp(2.75rem, 9vw, 4.5rem)',
        fontWeight: t.fontWeight.bold.var,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        color: t.color.tone.accent.foreground.var,
      },
      heroHeadline: {
        margin: 0,
        maxWidth: '38rem',
        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        fontWeight: t.fontWeight.medium.var,
        lineHeight: t.lineHeight.relaxed.var,
        color: t.color.text.primary.var,
      },
      heroActions: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: t.space[3].var,
        paddingTop: t.space[1].var,
      },
      heroMeta: {
        margin: 0,
        fontSize: t.fontSize.sm.var,
        lineHeight: t.lineHeight.normal.var,
        color: t.color.text.secondary.var,
        '& a': {
          color: t.color.text.secondary.var,
          textDecoration: 'underline',
          textUnderlineOffset: '0.15em',
          '&:hover': {
            color: t.color.text.primary.var,
          },
        },
      },
      install: {
        width: '100%',
        maxWidth: '40rem',
        minWidth: 0,
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space[6].var,
        width: '100%',
        minWidth: 0,
      },
      sectionHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space[2].var,
        maxWidth: '40rem',
      },
      sectionLead: {
        margin: 0,
        fontSize: t.fontSize.md.var,
        lineHeight: t.lineHeight.relaxed.var,
        color: t.color.text.secondary.var,
      },
      featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: t.space[4].var,
        width: '100%',
        textAlign: 'left',
        [belowMd]: {
          gridTemplateColumns: '1fr',
        },
      },
      featureCard: {
        height: '100%',
      },
      showcaseBand: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space[4].var,
        width: '100%',
        minWidth: 0,
      },
      exploreGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: t.space[4].var,
        width: '100%',
        textAlign: 'left',
        [belowMd]: {
          gridTemplateColumns: '1fr',
        },
      },
      exploreCard: {
        height: '100%',
      },
    },
  }),
});
