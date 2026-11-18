import {
  atDarkMode,
  atReducedMotion,
  codeBlock,
  designTokens as t,
  typestyles,
} from '@var-ui/core';
import { keyframes } from 'typestyles';
import { pageBarHeight } from './docsPage';

const belowMd = typestyles.breakpoint('md', 'max');
const belowLg = typestyles.breakpoint('lg', 'max');

/**
 * Docs page hero band: a softly tinted accent panel with a fading dot field (the Var UI stage
 * motif), category eyebrow, display title, lead, a copyable import line, and one row of
 * metadata (source, package, markdown). The page's tabs follow 24px below.
 */
export const docsPageHeader = typestyles.recipe({
  name: 'docs-page-header',
  layer: 'components',
  slots: [
    'root',
    'content',
    'preview',
    'eyebrow',
    'title',
    'lead',
    'importRow',
    'importCode',
    'meta',
    'metaItem',
    'metaLabel',
    'metaValue',
    'metaIcon',
    'metaCode',
  ],
  styles: () => ({
    base: {
      root: {
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: t.space.xl.var,
        // With a live preview the band splits: copy on the left, the component on the right.
        '&[data-has-preview]': {
          gridTemplateColumns: 'minmax(0, 1.12fr) minmax(0, 1fr)',
          [belowLg]: { gridTemplateColumns: 'minmax(0, 1fr)' },
        },
        // The collapsed page bar animates on this element's scroll exit.
        viewTimelineName: '--docs-page-hero',
        viewTimelineAxis: 'block',
        marginBlockEnd: t.space.md.var,
        padding: `${t.space.xl.var} ${t.space.xl.var} ${t.space.lg.var}`,
        minWidth: 0,
        borderRadius: t.radius.xl.var,
        border: `${t.borderWidth.default.var} solid color-mix(in oklab, ${t.color.tone.accent.foreground.var} 16%, ${t.color.border.subtle.var})`,
        // Surface + accent dot field fading under the text come from core `stage`.
        [belowMd]: {
          padding: `${t.space.lg.var} ${t.space.md.var} ${t.space.md.var}`,
          borderRadius: t.radius.lg.var,
        },
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
        minWidth: 0,
      },
      // The hero showcase: the live component on a plate set into the band (same border
      // family, one surface step up, no floating shadow).
      preview: {
        display: 'grid',
        placeItems: 'center',
        alignSelf: 'stretch',
        boxSizing: 'border-box',
        minHeight: '15rem',
        maxHeight: '18rem',
        padding: t.space.lg.var,
        overflow: 'hidden',
        // Showcases render a touch larger than life inside the plate.
        '& > *': { zoom: 1.15 },
        borderRadius: t.radius.lg.var,
        border: `${t.borderWidth.default.var} solid color-mix(in oklab, ${t.color.tone.accent.foreground.var} 16%, ${t.color.border.subtle.var})`,
        backgroundColor: `color-mix(in oklab, ${t.color.background.surface.var} 72%, transparent)`,
        ...atDarkMode({
          backgroundColor: `color-mix(in oklab, ${t.color.background.surface.var} 60%, ${t.color.background.secondary.var})`,
          borderColor: 'oklch(1 0 0 / 9%)',
        }),
        [belowLg]: { display: 'none' },
      },
      eyebrow: {
        margin: 0,
        fontSize: t.fontSize.xs.var,
        lineHeight: '1rem',
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        color: t.color.tone.accent.foreground.var,
      },
      title: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: 'clamp(2rem, 1.4rem + 1.8vw, 2.75rem)',
        lineHeight: 1.08,
        fontWeight: t.fontWeight.bold.var,
        letterSpacing: '-0.02em',
        color: t.color.text.primary.var,
      },
      lead: {
        margin: 0,
        maxWidth: '40rem',
        fontSize: '1.1875rem',
        lineHeight: '1.75rem',
        color: t.color.text.secondary.var,
        [belowMd]: {
          fontSize: '1.0625rem',
          lineHeight: '1.625rem',
        },
      },
      // The import statement as a copyable pill (the most-copied line on the page).
      importRow: {
        // The copy button reuses the codeBlock recipe outside a code block root, so seed the
        // code-block vars it reads (recipe vars are only defined on the recipe's root class).
        [codeBlock.vars.copyButtonColor.name]: t.color.text.secondary.var,
        [codeBlock.vars.filenameColor.name]: t.color.text.primary.var,
        [codeBlock.vars.copyButtonHoverBackground.name]:
          `color-mix(in oklab, ${t.color.text.primary.var} 7%, transparent)`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xxs.var,
        alignSelf: 'flex-start',
        maxWidth: '100%',
        marginBlockStart: t.space.xs.var,
        paddingInlineStart: t.space.sm.var,
        paddingInlineEnd: t.space.xxs.var,
        height: '2.25rem',
        boxSizing: 'border-box',
        borderRadius: t.radius.md.var,
        border: `${t.borderWidth.default.var} solid ${t.color.border.default.var}`,
        backgroundColor: t.color.background.surface.var,
      },
      importCode: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.8125rem',
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.primary.var,
        backgroundColor: 'transparent',
        padding: 0,
      },
      meta: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: t.space.md.var,
        rowGap: t.space.xs.var,
        margin: 0,
        marginBlockStart: t.space.xxs.var,
        padding: 0,
        listStyle: 'none',
        fontSize: t.fontSize.sm.var,
        lineHeight: '1.25rem',
      },
      metaItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        minWidth: 0,
      },
      metaLabel: {
        color: t.color.text.secondary.var,
      },
      metaValue: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: t.space.sm.var,
        minWidth: 0,
        color: t.color.text.primary.var,
        // Plain text links that underline on hover: a calm row inside the hero band.
        '& a': {
          color: 'inherit',
          fontWeight: t.fontWeight.medium.var,
          textDecoration: 'none',
          textUnderlineOffset: '0.1875rem',
          '&:hover': {
            color: t.color.link.default.var,
            textDecoration: 'underline',
          },
        },
      },
      metaIcon: {
        display: 'inline-flex',
        flexShrink: 0,
        color: t.color.text.secondary.var,
        '& svg': { width: '0.875rem', height: '0.875rem' },
      },
      metaCode: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.primary.var,
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
  }),
});

/** Page-level view tabs (Documentation / Playground / Props / Styles) under the page header. */
export const docsPageTabs = typestyles.recipe({
  name: 'docs-page-tabs',
  layer: 'components',
  slots: ['root', 'list', 'panel'],
  styles: () => ({
    base: {
      root: {
        gap: t.space.xl.var,
      },
      list: {
        display: 'flex',
        scrollMarginTop: `calc(${pageBarHeight} + ${t.space.sm.var})`,
      },
      panel: {
        minWidth: 0,
        padding: 0,
        '&[hidden]': { display: 'none' },
      },
    },
  }),
});

/**
 * Guide article under a `DocsPageHeader`: the MDX `# Title` is already the hero H1, so it is
 * hidden, and the paragraph after it reads as ordinary body text (the hero carries the lead).
 * `utilities` layer, alongside `proseContent`, whose heading rhythm it adjusts.
 */
export const docsGuideArticle = typestyles.recipe({
  name: 'docs-guide-article',
  layer: 'utilities',
  slots: ['root'],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        '& > h1:first-child': {
          display: 'none',
        },
        '& > h1:first-child + p': {
          fontSize: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          marginBottom: t.space.md.var,
        },
        '& > h1:first-child + h2': {
          marginTop: 0,
        },
      },
    },
  }),
});

const barReveal = keyframes.create('docs-page-bar-reveal', {
  from: { opacity: '0', transform: 'translateY(-0.5rem)', visibility: 'hidden' },
  '1%': { visibility: 'visible' },
  to: { opacity: '1', transform: 'translateY(0)', visibility: 'visible' },
});

/** Reduced motion: the same reveal without the slide. */
const barRevealFade = keyframes.create('docs-page-bar-reveal-fade', {
  from: { opacity: '0', visibility: 'hidden' },
  '1%': { visibility: 'visible' },
  to: { opacity: '1', visibility: 'visible' },
});

const barHidden = {
  opacity: 0,
  transform: 'translateY(-0.5rem)',
  visibility: 'hidden',
} as const;

const barShown = {
  opacity: 1,
  transform: 'translateY(0)',
  visibility: 'visible',
} as const;

/**
 * Collapsed page bar: once the hero scrolls away, a compact bar pins to the top of the content
 * area with the page name, the page tabs and the hero's links and copy action.
 *
 * Reveal is a CSS scroll-driven animation on the hero's view timeline (`--docs-page-hero`,
 * exit range) where supported; elsewhere a small IntersectionObserver sets `data-stuck` and a
 * transition runs. The bar overlays (negative margin), so it never shifts the layout.
 */
export const docsPageBar = typestyles.recipe({
  name: 'docs-page-bar',
  layer: 'components',
  slots: ['root', 'identity', 'eyebrow', 'title', 'tabs', 'tab', 'end', 'link', 'icon', 'copy'],
  styles: () => ({
    base: {
      root: {
        // Seed the code-block vars the reused copy button reads.
        [codeBlock.vars.copyButtonColor.name]: t.color.text.secondary.var,
        [codeBlock.vars.filenameColor.name]: t.color.text.primary.var,
        [codeBlock.vars.copyButtonHoverBackground.name]:
          `color-mix(in oklab, ${t.color.text.primary.var} 7%, transparent)`,
        position: 'sticky',
        top: 0,
        zIndex: t.zIndex.sticky.var,
        boxSizing: 'border-box',
        height: pageBarHeight,
        marginBlockEnd: `calc(-1 * ${pageBarHeight})`,
        display: 'flex',
        alignItems: 'center',
        gap: t.space.lg.var,
        paddingInline: t.space.md.var,
        borderEndStartRadius: t.radius.lg.var,
        borderEndEndRadius: t.radius.lg.var,
        border: `${t.borderWidth.default.var} solid color-mix(in oklab, ${t.color.tone.accent.foreground.var} 16%, ${t.color.border.subtle.var})`,
        borderBlockStart: 'none',
        backgroundColor: `color-mix(in oklab, color-mix(in oklab, ${t.color.tone.accent.foreground.var} 5%, ${t.color.background.surface.var}) 94%, transparent)`,
        backdropFilter: 'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
        boxShadow: t.shadow.sm.var,
        ...barHidden,
        transition: `opacity ${t.duration.slow.var} ${t.easing.standard.var}, transform ${t.duration.slow.var} ${t.easing.standard.var}, visibility ${t.duration.slow.var}`,
        '&[data-stuck]': barShown,
        '@supports (animation-timeline: view())': {
          transition: 'none',
          animationName: barReveal,
          animationDuration: '1ms',
          animationTimingFunction: 'linear',
          animationFillMode: 'both',
          animationTimeline: '--docs-page-hero',
          animationRange: 'exit 78% exit 96%',
        },
        // Reduced motion: the bar still fades (durations collapse) but never slides.
        ...atReducedMotion({ transform: 'none', animationName: barRevealFade }),
        [belowMd]: {
          gap: t.space.sm.var,
          paddingInline: t.space.sm.var,
          marginInline: `calc(-1 * ${t.space.md.var})`,
          borderRadius: 0,
          borderInline: 'none',
        },
      },
      identity: {
        display: 'flex',
        alignItems: 'baseline',
        gap: t.space.xs.var,
        minWidth: 0,
        flexShrink: 1,
      },
      eyebrow: {
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        color: t.color.tone.accent.foreground.var,
        whiteSpace: 'nowrap',
        [belowMd]: { display: 'none' },
      },
      title: {
        margin: 0,
        fontFamily: t.fontFamily.display.var,
        fontSize: '1.0625rem',
        lineHeight: '1.5rem',
        fontWeight: t.fontWeight.bold.var,
        letterSpacing: '-0.01em',
        color: t.color.text.primary.var,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      // Mini tab row: plain text items with an accent underline on the current tab.
      tabs: {
        display: 'flex',
        alignSelf: 'stretch',
        gap: t.space.xxs.var,
        minWidth: 0,
        [belowMd]: { display: 'none' },
      },
      tab: {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        paddingInline: t.space.xs.var,
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: 'inherit',
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
        cursor: 'pointer',
        boxShadow: 'inset 0 -2px 0 transparent',
        transition: t.transition.colorShift.var,
        '&:hover': {
          color: t.color.text.primary.var,
          boxShadow: `inset 0 -2px 0 ${t.color.border.strong.var}`,
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '-2px',
          borderRadius: t.radius.sm.var,
        },
        '&[aria-current="true"]': {
          color: t.color.text.primary.var,
          boxShadow: `inset 0 -2px 0 ${t.color.tone.accent.foreground.var}`,
        },
      },
      end: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space.sm.var,
        marginInlineStart: 'auto',
        flexShrink: 0,
      },
      link: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xxs.var,
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        '&:hover': { color: t.color.text.primary.var, textDecoration: 'underline' },
        '&[data-bar-secondary]': {
          [belowMd]: { display: 'none' },
        },
      },
      icon: {
        display: 'inline-flex',
        color: t.color.text.secondary.var,
        '& svg': { width: '0.875rem', height: '0.875rem' },
        [belowMd]: { display: 'none' },
      },
      copy: {
        display: 'inline-flex',
        alignItems: 'center',
        paddingInlineStart: t.space.sm.var,
        borderInlineStart: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
      },
    },
  }),
});
