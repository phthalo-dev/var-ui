import { atProperty, variant } from 'typestyles';
import { designTokens as t, breakpoint, typestyles } from '@var-ui/core';

const belowLg = breakpoint('lg', 'max');
const contentWidth = variant.enum(['default', 'full'], { default: 'default' });
const contentPlacement = variant.enum(['standalone', 'inPageBody'], { default: 'standalone' });

/** Full-height docs shell: page grid, prose column, sticky TOC, and body overflow lock. */
export const docsPage = typestyles.recipe({
  name: 'docs-page',
  layer: 'components',
  slots: ['siteLayout', 'pageBody', 'content', 'toc'],
  variants: { contentWidth, contentPlacement },
  vars: {
    headerHeight: {
      ...atProperty.length,
      value: t.size.nav.bar.var,
    },
  },
  styles: ({ vars }) => ({
    base: {
      siteLayout: {
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
      },
      pageBody: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 13.75rem',
        gap: t.space[10].var,
        alignItems: 'start',
        paddingInline: t.space[10].var,
        paddingBlock: t.space[10].var,
        paddingBottom: t.space[8].var,
        boxSizing: 'border-box',
        minHeight: '100%',
        [belowLg]: {
          gridTemplateColumns: 'minmax(0, 1fr)',
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
        maxWidth: '60rem',
        margin: '0 auto',
        paddingBottom: t.space[8].var,
      },
      toc: {
        position: 'sticky',
        top: `calc(${vars.headerHeight.var} + 1.25rem)`,
        alignSelf: 'start',
        minWidth: 0,
        maxHeight: `calc(100dvh - ${vars.headerHeight.var} - 2rem)`,
        overflowY: 'auto',
        [belowLg]: {
          display: 'none',
        },
      },
    },
    variants: {
      contentWidth: {
        default: {},
        full: {
          content: {
            maxWidth: 'none',
            margin: 0,
            paddingInline: t.space[10].var,
            paddingBlock: t.space[10].var,
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
