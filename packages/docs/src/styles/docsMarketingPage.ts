import { designTokens as t, typestyles } from '@var-ui/core';

/** Full-width marketing main: no sidebar, no TOC column, scrollable centered content. */
export const docsMarketingPage = typestyles.recipe({
  name: 'docs-marketing-page',
  layer: 'components',
  slots: ['siteLayout', 'main'],
  styles: () => ({
    base: {
      siteLayout: {
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
      },
      main: {
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 'none',
        margin: 0,
        paddingInline: t.space.xxl.var,
        paddingBlock: t.space.xxxl.var,
        paddingBottom: t.space.xxl.var,
        minHeight: '100%',
        minWidth: 0,
      },
    },
  }),
});
