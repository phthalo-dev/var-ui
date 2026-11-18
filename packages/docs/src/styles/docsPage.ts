import { atProperty, variant } from 'typestyles';
import { designTokens as t, sideNav, typestyles } from '@var-ui/core';

const belowXl = typestyles.breakpoint('xl', 'max');
const belowMd = typestyles.breakpoint('md', 'max');
const contentWidth = variant.enum(['default', 'full'], { default: 'default' });
const contentPlacement = variant.enum(['standalone', 'inPageBody'], { default: 'standalone' });

/** Reading measure of the main column (prose, demos, and page header share it). */
const mainColumn = '50rem';
/** Width of the on-this-page rail. */
const tocColumn = '13.5rem';
const columnGap = t.space.xxxl.var;

/** Page gutters: generous on desktop, 16px on phones. */
const gutters = {
  paddingInline: t.space.xxl.var,
  paddingBlockStart: t.space.xxl.var,
  paddingBlockEnd: t.space.xxxxl.var,
  [belowMd]: {
    paddingInline: t.space.md.var,
    paddingBlockStart: t.space.lg.var,
    paddingBlockEnd: t.space.xxxl.var,
  },
} as const;

/**
 * Full-height docs shell: side navigation, a centered content frame (main column + TOC rail that
 * share one top line), and the body overflow lock.
 */
export const docsPage = typestyles.recipe({
  name: 'docs-page',
  layer: 'components',
  slots: [
    'siteLayout',
    'sidebar',
    'drawerNav',
    'pageBody',
    'content',
    'toc',
    'tocActions',
    'tocAction',
  ],
  variants: { contentWidth, contentPlacement },
  vars: {
    headerHeight: {
      ...atProperty.length,
      value: t.size.nav.bar.var,
    },
  },
  styles: () => ({
    base: {
      siteLayout: {
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
      },
      sidebar: {
        [sideNav.vars.width.name]: '16.5rem',
        borderInlineEnd: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
      },
      drawerNav: {
        height: 'auto',
        minHeight: '100%',
      },
      pageBody: {
        ...gutters,
        display: 'grid',
        gridTemplateColumns: `minmax(0, ${mainColumn}) ${tocColumn}`,
        justifyContent: 'center',
        columnGap,
        alignItems: 'start',
        boxSizing: 'border-box',
        minHeight: '100%',
        [belowXl]: {
          gridTemplateColumns: `minmax(0, ${mainColumn})`,
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
        top: t.space.xxl.var,
        alignSelf: 'start',
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.xl.var,
        minWidth: 0,
        maxHeight: `calc(100dvh - ${t.size.nav.bar.var} - 2 * ${t.space.xxl.var})`,
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
            maxWidth: 'none',
            margin: 0,
            padding: 0,
            minWidth: 0,
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
