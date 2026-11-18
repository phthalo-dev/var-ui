import { atProperty, variant } from 'typestyles';
import { designTokens as t, typestyles } from '@var-ui/core';

const belowXl = typestyles.breakpoint('xl', 'max');
const belowMd = typestyles.breakpoint('md', 'max');
const belowLg = typestyles.breakpoint('lg', 'max');
const contentWidth = variant.enum(['default', 'full'], { default: 'default' });
const contentPlacement = variant.enum(['standalone', 'inPageBody'], { default: 'standalone' });

/** Reading measure of the main column (prose, demos, and page header share it). */
const mainColumn = '50rem';
/** Width of the on-this-page rail. */
const tocColumn = '13.5rem';
const columnGap = t.space.xxxl.var;
/** Height of the collapsed page bar that replaces the hero once it scrolls away. */
export const pageBarHeight = '3.5rem';

const phoneGutters = {
  paddingInline: t.space.md.var,
  paddingBlockStart: t.space.lg.var,
  paddingBlockEnd: t.space.xxxl.var,
} as const;

/** Page gutters: generous on desktop, 16px on phones. */
const gutters = {
  paddingInline: t.space.xxl.var,
  paddingBlockStart: t.space.xxl.var,
  paddingBlockEnd: t.space.xxxxl.var,
  [belowMd]: phoneGutters,
} as const;

/**
 * Full-height docs shell: side navigation, a centered content frame (main column + TOC rail that
 * share one top line), and the body overflow lock.
 */
export const docsPage = typestyles.recipe({
  name: 'docs-page',
  layer: 'components',
  slots: ['siteLayout', 'sidebar', 'pageBody', 'content', 'toc', 'tocActions', 'tocAction'],
  variants: { contentWidth, contentPlacement },
  vars: {
    headerHeight: {
      ...atProperty.length,
      value: t.size.nav.bar.var,
    },
    /** Page side gutter; full-bleed children (the collapsed page bar) bleed back over it. */
    gutter: {
      ...atProperty.length,
      value: t.space.xxl.var,
    },
  },
  styles: ({ vars }) => ({
    base: {
      siteLayout: {
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
      },
      // The section sidebar moves into the mobile drawer (`DocsMobileMenu`) below `lg`: under
      // 1024px a 280px rail leaves the page too narrow for its hero and demos.
      sidebar: {
        [belowLg]: {
          display: 'none',
        },
      },
      /**
       * Page frame. The main column's wrapper is `display: contents`, so its children are grid
       * items here: a page hero (`data-docs-page-hero`), its collapsed bar (`data-docs-page-bar`)
       * and the page tab list span the full frame (main + rail); everything else flows into the
       * main column, and the rail starts on the row after the tabs and sticks below the bar.
       */
      pageBody: {
        ...gutters,
        [vars.gutter.name]: t.space.xxl.var,
        [belowMd]: {
          ...phoneGutters,
          [vars.gutter.name]: t.space.md.var,
        },
        // Container for `cqw`: full-bleed children size against the whole content area.
        containerType: 'inline-size',
        display: 'grid',
        gridTemplateColumns: `minmax(0, ${mainColumn}) ${tocColumn}`,
        justifyContent: 'center',
        columnGap,
        rowGap: 0,
        alignItems: 'start',
        boxSizing: 'border-box',
        minHeight: '100%',
        '& > [data-docs-content]': { display: 'contents' },
        '& > [data-docs-content] > *': { gridColumn: '1', minWidth: 0 },
        '& > [data-docs-content] > [data-docs-page-bar]': {
          gridColumn: '1 / -1',
          gridRow: '1',
        },
        '& > [data-docs-content] > [data-docs-page-hero]': {
          gridColumn: '1 / -1',
          gridRow: '2',
        },
        '& > [data-docs-content] > [data-docs-page-tabs]': { display: 'contents' },
        // 40px to the panel: a bar-tab jump lands the panel 24px under the bar with the tab row
        // already fully above the bar's reveal line, so the bar is shown on landing.
        '& [data-docs-page-tabs] > [role="tablist"]': {
          gridColumn: '1 / -1',
          gridRow: '3',
          marginBlockEnd: t.space.xxl.var,
        },
        '& [data-docs-page-tabs] > [role="tabpanel"]': { gridColumn: '1' },
        // The rail spans every row below the tabs (or the whole page without a hero).
        '& > aside': { gridColumn: '2', gridRow: '1 / span 60' },
        '&:has(> [data-docs-content] > [data-docs-page-hero]) > aside': {
          gridRow: '3 / span 60',
        },
        '&:has(> [data-docs-content] > [data-docs-page-tabs]) > aside': {
          gridRow: '4 / span 60',
        },
        [belowXl]: {
          gridTemplateColumns: `minmax(0, ${mainColumn})`,
        },
        [belowMd]: {
          paddingInline: t.space.md.var,
          paddingBlock: t.space.lg.var,
        },
        '& .docs-page-toc-nav': {
          position: 'static',
          top: 'auto',
          padding: 0,
          maxHeight: 'none',
          overflow: 'visible',
        },
      },
      content: {
        ...gutters,
        boxSizing: 'border-box',
        maxWidth: `calc(${mainColumn} + ${tocColumn} + ${columnGap} + 2 * ${t.space.xxl.var})`,
        marginInline: 'auto',
      },
      toc: {
        position: 'sticky',
        // Clear the collapsed page bar (when there is one) that sticks above it.
        top: `calc(${pageBarHeight} + ${t.space.lg.var})`,
        alignSelf: 'start',
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xl.var,
        minWidth: 0,
        maxHeight: `calc(100dvh - ${t.size.nav.bar.var} - ${pageBarHeight} - 2 * ${t.space.lg.var})`,
        overflowY: 'auto',
        // A tab without a TOC keeps the rail's column, so the frame never changes width.
        '&[hidden]': {
          display: 'flex',
          visibility: 'hidden',
          [belowXl]: { display: 'none' },
        },
        '& [data-var-ui-toc]': {
          position: 'static',
          padding: 0,
          maxHeight: 'none',
          overflow: 'visible',
        },
        [belowXl]: {
          display: 'none',
        },
      },
      tocActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xxs.var,
        paddingBlockStart: t.space.md.var,
        borderBlockStart: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        // No hairline when it would sit under nothing (the auto TOC found too few headings).
        '[data-var-ui-toc][hidden] + &, &:first-child': {
          borderBlockStart: 'none',
          paddingBlockStart: 0,
        },
      },
      tocAction: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space.xs.var,
        paddingBlock: '0.3125rem',
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.normal.var,
        color: t.color.text.secondary.var,
        textDecoration: 'none',
        '&:hover': { color: t.color.text.primary.var },
        '& svg': { width: '0.875rem', height: '0.875rem', flexShrink: 0 },
      },
    },
    variants: {
      contentWidth: {
        default: {},
        full: {
          content: {
            maxWidth: '80rem',
          },
        },
      },
      contentPlacement: {
        standalone: {},
        inPageBody: {
          content: {
            display: 'contents',
          },
        },
      },
    },
  }),
});

/** Lock the docs chrome to the viewport; targets AppShell main from @var-ui/astro. */
typestyles.global.rules({
  'html, body.docs-body': {
    height: '100%',
    margin: 0,
  },
  'body.docs-body': {
    overflow: 'hidden',
  },
  'body.docs-body #var-ui-app-shell-main': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0,
  },
});

export function docsPageContent(
  options: {
    width?: 'default' | 'full';
    placement?: 'standalone' | 'inPageBody';
  } = {},
) {
  return docsPage({
    contentWidth: options.width ?? 'default',
    contentPlacement: options.placement ?? 'standalone',
  }).content;
}
