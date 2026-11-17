import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');
const belowSm = typestyles.breakpoint('sm', 'max');

const accent = t.color.tone.accent.foreground.var;
/** The wordmark's `--ui` amber: the second brand hue, used only as atmosphere. */
const amber = t.color.code.attr.var;

const mix = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;

/**
 * The page's own texture: a token grid. A 1.5rem dot lattice (the spacing scale made
 * visible) whose dots pick up the brand phthalo on one side and the wordmark amber on the
 * other, fading out toward the content. Replaces generic glow blobs.
 */
const tokenGrid = (color: string, mask: string) => ({
  content: '""',
  position: 'absolute' as const,
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none' as const,
  backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.6px)`,
  backgroundSize: '1.5rem 1.5rem',
  backgroundPosition: 'center top',
  maskImage: mask,
});

/** Marketing homepage: full-bleed hero, showcase, features, closing band and footer. */
export const homePage = typestyles.recipe({
  name: 'home-page',
  layer: 'components',
  slots: [
    'root',
    'container',
    'hero',
    'heroGrid',
    'heroInner',
    'announce',
    'announceText',
    'announceBadge',
    'announceLong',
    'announceShort',
    'tagline',
    'taglineStrong',
    'heroActions',
    'install',
    'installQuiet',
    'installPrompt',
    'installCode',
    'band',
    'section',
    'sectionHeader',
    'eyebrow',
    'sectionLead',
    'headingLines',
    'features',
    'feature',
    'featureWide',
    'featureCopy',
    'featureCopyWide',
    'closing',
    'closingInner',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        isolation: 'isolate',
      },
      container: {
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '76rem',
        marginInline: 'auto',
        paddingInline: t.space.xl.var,
        [belowMd]: { paddingInline: t.space.md.var },
      },

      // ── Hero ────────────────────────────────────────────────────────────
      hero: {
        position: 'relative',
        isolation: 'isolate',
        overflow: 'clip',
        paddingTop: t.space.xxxxl.var,
        paddingBottom: t.space.xxxl.var,
        '&::before': tokenGrid(
          mix(accent, 70),
          'radial-gradient(42% 55% at 14% 30%, black, transparent 75%)',
        ),
        '&::after': tokenGrid(
          mix(amber, 60),
          'radial-gradient(38% 50% at 88% 58%, black, transparent 75%), radial-gradient(60% 55% at 50% 30%, rgb(0 0 0 / 0.35), transparent 70%)',
        ),
        [belowMd]: {
          paddingTop: t.space.xxl.var,
          paddingBottom: t.space.xxxl.var,
        },
      },
      heroGrid: {
        position: 'relative',
      },
      heroInner: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space.lg.var,
        maxWidth: '54rem',
        marginInline: 'auto',
        textAlign: 'center',
      },
      announce: {
        display: 'inline-flex',
        maxWidth: '100%',
        boxSizing: 'border-box',
        alignItems: 'center',
        gap: t.space.xs.var,
        paddingBlock: t.space.xxs.var,
        paddingInlineStart: t.space.xxs.var,
        paddingInlineEnd: t.space.sm.var,
        borderRadius: t.radius.full.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: mix(t.color.background.surface.var, 70),
        backdropFilter: 'blur(8px)',
        color: t.color.text.secondary.var,
        fontSize: t.fontSize.sm.var,
        textDecoration: 'none',
        transition: 'border-color 160ms ease, color 160ms ease',
        '&:hover': {
          borderColor: t.color.tone.accent.border.var,
          color: t.color.text.primary.var,
        },
        '&:focus-visible': {
          outline: `0.125rem solid ${t.color.border.focus.var}`,
          outlineOffset: '0.125rem',
        },
      },
      announceLong: { [belowSm]: { display: 'none' } },
      announceShort: { display: 'none', [belowSm]: { display: 'inline' } },
      announceBadge: {
        paddingBlock: '0.125rem',
        paddingInline: t.space.xs.var,
        borderRadius: t.radius.full.var,
        backgroundColor: t.color.tone.accent.background.var,
        color: t.color.tone.accent.foregroundOnBackground.var,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
      },
      announceText: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        letterSpacing: '0.01em',
      },
      tagline: {
        color: t.color.text.primary.var,
        '& > span': { display: 'block' },
      },
      taglineStrong: {
        fontWeight: t.fontWeight.semibold.var,
      },
      heroActions: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: t.space.sm.var,
        paddingTop: t.space.xs.var,
        // Outline CTAs sit over the token grid: give them an opaque, blurred backdrop.
        '& [data-appearance="outline"]': {
          backgroundColor: mix(t.color.background.app.var, 85),
          backdropFilter: 'blur(6px)',
        },
        [belowSm]: {
          flexDirection: 'column',
          alignSelf: 'stretch',
          '& > *': { width: '100%' },
        },
      },

      install: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.sm.var,
        maxWidth: '100%',
        boxSizing: 'border-box',
        paddingBlock: t.space.xxs.var,
        paddingInlineStart: t.space.md.var,
        paddingInlineEnd: t.space.xxs.var,
        borderRadius: t.radius.full.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        backgroundColor: mix(t.color.background.surface.var, 80),
        backdropFilter: 'blur(8px)',
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        '& button': { borderRadius: t.radius.full.var, flexShrink: 0 },
      },
      installQuiet: {
        borderColor: 'transparent',
        backgroundColor: mix(t.color.background.app.var, 80),
        backdropFilter: 'blur(6px)',
        color: t.color.text.secondary.var,
        '& code': { color: t.color.text.secondary.var },
      },
      installPrompt: {
        color: t.color.tone.accent.foreground.var,
        userSelect: 'none',
      },
      installCode: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: t.color.text.primary.var,
      },

      // ── Sections ────────────────────────────────────────────────────────
      // A full-bleed tinted band: gives the hands-on section its own ground in both modes.
      band: {
        backgroundColor: `color-mix(in srgb, ${accent} 4%, ${t.color.background.app.var})`,
        borderBlock: `1px solid ${t.color.border.default.var}`,
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xl.var,
        paddingBlock: t.space.xxxl.var,
        [belowMd]: { paddingBlock: t.space.xxxxl.var },
      },
      sectionHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.space.md.var,
        maxWidth: '46rem',
      },
      eyebrow: {
        color: t.color.tone.accent.foreground.var,
        '&::before': { content: '"--"', opacity: 0.6 },
      },
      headingLines: {
        '& > span': { display: 'block' },
      },
      sectionLead: {
        maxWidth: '38rem',
        fontSize: t.fontSize.lg.var,
        lineHeight: t.lineHeight.relaxed.var,
        textWrap: 'pretty',
      },

      // ── Feature bento ───────────────────────────────────────────────────
      // "Why" rows: unboxed, alternating text/visual rows separated by hairlines. Only the
      // demos themselves carry panels.
      features: {
        display: 'flex',
        flexDirection: 'column',
        '& > * + *': {
          marginTop: t.space.xxl.var,
          paddingTop: t.space.xxl.var,
          borderTop: `1px solid ${t.color.border.default.var}`,
        },
      },
      feature: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xl.var,
        minWidth: 0,
        [belowMd]: { gap: t.space.lg.var },
      },
      featureWide: {},
      featureCopy: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
      },
      featureCopyWide: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        // Top-aligned so the eyebrow → heading gap is the same in every row.
        alignItems: 'start',
        columnGap: t.space.xxl.var,
        // Same eyebrow → heading gap as the section header.
        rowGap: t.space.md.var,
        '& > :first-child': { gridColumn: '1 / -1' },
        // Keep the intro paragraph to a comfortable measure; nudge it onto the heading's x-height.
        '& > :last-child': { maxWidth: '32rem', justifySelf: 'end', marginTop: t.space.xs.var },
        [belowMd]: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          '& > :last-child': { justifySelf: 'start' },
        },
      },

      // ── Closing band ────────────────────────────────────────────────────
      closing: {
        position: 'relative',
        isolation: 'isolate',
        overflow: 'clip',
        paddingTop: t.space.xxxl.var,
        paddingBottom: t.space.xxxl.var,
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderColor: t.color.border.default.var,
        [belowMd]: { paddingTop: t.space.xxxxl.var },
      },
      closingInner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.space.lg.var,
        textAlign: 'center',
      },
    },
  }),
});
