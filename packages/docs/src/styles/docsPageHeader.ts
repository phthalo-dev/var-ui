import {
  atReducedMotion,
  codeBlock,
  designTokens as t,
  stage,
  tabs,
  typestyles,
} from '@var-ui/core';
import { docsMainContainer, docsPage, narrowMain, pageBarHeight } from './docsPage';
import { container } from 'typestyles';

const gutter = docsPage.vars.gutter.var;
/** Distance from the page frame's edge to the content area's edge (gutter + centring slack). */
const bleed = `calc((100cqw - 100%) / 2 + ${gutter})`;

const belowMd = typestyles.breakpoint('md', 'max');
const belowLg = typestyles.breakpoint('lg', 'max');
const belowXl = typestyles.breakpoint('xl', 'max');
/** Showcase slot height on pages with tabs (it overhangs the tab row; see `preview`). */
const heroSlot = '17.5rem';
/** Main areas narrower than this get the smaller showcase. */
const midMain = container(docsMainContainer, { maxWidth: '72rem' });

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
      // The hero sits on the plain page background: no band, tint or edge. Only the showcase
      // carries the dot texture (a core `stage` with `fade: 'radial'`), fading out on all sides.
      root: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        // Text hangs from the top, so the H1 lands at the same y on every page.
        alignItems: 'start',
        columnGap: t.space.xxl.var,
        // With a showcase the hero splits; on a narrow main area the showcase is dropped.
        '&[data-has-preview]': {
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          [narrowMain]: { gridTemplateColumns: 'minmax(0, 1fr)' },
        },
        // The page tabs follow the metadata row by a fixed 40px (16px here + the 24px margin).
        marginBlockEnd: t.space.lg.var,
        paddingBlock: `${t.space.lg.var} ${t.space.md.var}`,
        minWidth: 0,
        [belowMd]: {
          paddingBlock: `${t.space.sm.var} 0`,
        },
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.sm.var,
        minWidth: 0,
      },
      // The showcase scene sits directly on the page: no plate, border or surface; only the dot
      // field, fading out on all sides. It is top-aligned with the hero and sized to its scene;
      // its end edge is the frame's end edge (the page bar's and the rail's).
      //
      // `data-overhang` (pages with tabs): the scene gets a fixed slot that does not add to the
      // hero's height, so the tabs follow the text (no dead band under a short lead) and the
      // scene hangs past the tab row on the right, where the tabs never reach.
      preview: {
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'end',
        alignSelf: 'start',
        justifySelf: 'end',
        boxSizing: 'border-box',
        minWidth: '17rem',
        maxWidth: '26rem',
        [stage.vars.bleed.name]: t.space.lg.var,
        paddingBlock: t.space.md.var,
        paddingInlineStart: t.space.lg.var,
        overflow: 'visible',
        // Showcases render a touch larger than life where there is room.
        '& > *': { zoom: 1.15 },
        '[data-overhang] > &': {
          height: heroSlot,
          marginBlockEnd: `calc(-1 * ${heroSlot})`,
        },
        // A tighter main area (about 1200–1400px viewports): a smaller scene, not none.
        [midMain]: {
          maxWidth: '21rem',
          minWidth: '14rem',
          '& > *': { zoom: 0.95 },
          '[data-overhang] > &': { height: '15rem', marginBlockEnd: '-15rem' },
        },
        [narrowMain]: { display: 'none' },
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
        fontSize: t.fontSize.prose.lead.var,
        lineHeight: t.lineHeight.prose.lead.var,
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
        // Bar-tab jumps land the panel 24px under the collapsed page bar.
        scrollMarginTop: `calc(${pageBarHeight} + ${t.space.lg.var})`,
        '&[hidden]': { display: 'none' },
      },
    },
  }),
});

/**
 * Guide article under a `DocsPageHeader`: the MDX `# Title` is already the hero H1, so it is
 * hidden, and the paragraph after it reads as ordinary body text (the hero carries the lead).
 * `utilities` layer, so it overrides the heading rhythm of `docsProse` (in `base`).
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

const barHidden = {
  opacity: 0,
  transform: 'translateY(-0.25rem)',
  visibility: 'hidden',
  // Hide: fade, then drop visibility once the fade has finished.
  transition: `opacity ${t.duration.medium.var} ${t.easing.standard.var}, transform ${t.duration.medium.var} ${t.easing.standard.var}, visibility 0s linear ${t.duration.medium.var}`,
} as const;

const barShown = {
  opacity: 1,
  transform: 'translateY(0)',
  visibility: 'visible',
  // Show: visibility flips at once; opacity and the 4px settle run over 140ms.
  transition: `opacity ${t.duration.medium.var} ${t.easing.standard.var}, transform ${t.duration.medium.var} ${t.easing.standard.var}, visibility 0s`,
} as const;

/**
 * Collapsed page bar: once the hero scrolls away, a compact bar pins to the top of the content
 * area with the page name, the page tabs and the hero's links and copy action.
 *
 * Reveal is a discrete state, not a scroll-scrubbed fade: an IntersectionObserver sets
 * `data-stuck` once the page's real tab row (or the hero, on pages without tabs) has passed fully
 * under the bar, and a 140ms fade runs. So the bar's labels and the hero's never show at once,
 * and the two tab rows never stack. The bar is opaque and overlays (negative margin), so it
 * never shifts the layout.
 */
export const docsPageBar = typestyles.recipe({
  name: 'docs-page-bar',
  layer: 'components',
  slots: [
    'root',
    'identity',
    'eyebrow',
    'title',
    'tabs',
    'end',
    'link',
    'linkLabel',
    'icon',
    'copy',
  ],
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
        // Full-bleed sub-header: edge to edge across the content area, with its content inset back
        // onto the page frame so it lines up with the hero, tabs and columns below.
        marginInline: `calc(-1 * ${bleed})`,
        paddingInline: bleed,
        borderBlockEnd: `${t.borderWidth.default.var} solid ${t.color.border.default.var}`,
        // Opaque: nothing scrolling underneath may print through the bar.
        backgroundColor: t.color.background.surface.var,
        ...barHidden,
        '&[data-stuck]': barShown,
        // Reduced motion: no settle movement; the fade collapses with the duration tokens.
        ...atReducedMotion({ transform: 'none', '&[data-stuck]': { transform: 'none' } }),
        [belowMd]: {
          gap: t.space.sm.var,
        },
      },
      // The name never truncates: as space runs out the bar sheds, in order, the source links,
      // the Markdown label (icon stays), then the eyebrow.
      identity: {
        display: 'flex',
        alignItems: 'baseline',
        gap: t.space.sm.var,
        flexShrink: 0,
      },
      eyebrow: {
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        color: t.color.tone.accent.foreground.var,
        whiteSpace: 'nowrap',
        [belowLg]: { display: 'none' },
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
      },
      // The bar's tabs are the core underline tabs (`tabs({ appearance: 'underline' })` on this
      // row and its buttons): the indicator sits on the bar's bottom hairline, so the row drops
      // its own rail.
      tabs: {
        alignSelf: 'flex-end',
        minWidth: 0,
        flexShrink: 1,
        [tabs.vars.railColor.name]: 'transparent',
        '& > button': {
          minHeight: `calc(${pageBarHeight} - 0.1875rem)`,
          fontSize: t.fontSize.sm.var,
        },
        [belowMd]: { display: 'none' },
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
          [belowXl]: { display: 'none' },
        },
      },
      linkLabel: {
        [belowXl]: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
        },
      },
      icon: {
        display: 'inline-flex',
        color: t.color.text.secondary.var,
        '& svg': { width: '1rem', height: '1rem' },
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
