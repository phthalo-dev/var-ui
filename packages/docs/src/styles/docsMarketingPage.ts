import { designTokens as t, typestyles } from '@var-ui/core';

/** Full-width marketing main: no sidebar, no TOC column, scrollable centered content. */
export const docsMarketingPage = typestyles.recipe(
  'docs-marketing-page',
  () => ({
    slots: ['siteLayout', 'main'],
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
      paddingInline: t.space[10].var,
      paddingBlock: t.space[8].var,
      paddingBottom: t.space[10].var,
      minHeight: '100%',
      minWidth: 0,
    },
  }),
  { layer: 'components' },
);
