import { designTokens as t, typestyles } from '@var-ui/core';
import { variant } from 'typestyles';

/** Full-width marketing main: no sidebar, no TOC column, scrollable centered content. */
export const docsMarketingPage = typestyles.recipe({
  name: 'docs-marketing-page',
  layer: 'components',
  slots: ['siteLayout', 'main'],
  variants: {
    /** Edge-to-edge main: no inline/block padding; the page owns its gutters. */
    bleed: variant.boolean({ default: false }),
    /**
     * Full-height tool page (editor + preview): the main fills the area under the top bar with
     * no padding, and does not scroll; the page scrolls its own panes.
     */
    fill: variant.boolean({ default: false }),
  },
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
    variants: {
      bleed: {
        true: {
          main: {
            paddingInline: 0,
            paddingBlock: 0,
            paddingBottom: 0,
            minHeight: 'auto',
          },
        },
        false: {},
      },
      fill: {
        true: {
          main: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            paddingInline: 0,
            paddingBlock: 0,
            paddingBottom: 0,
            overflow: 'hidden',
          },
        },
        false: {},
      },
    },
  }),
});
