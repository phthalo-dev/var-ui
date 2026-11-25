import { designTokens as t, typestyles } from '@var-ui/core';
import { variant } from 'typestyles';

/** Playground content inside `DocsMarketingPage fill` (`PlaygroundLayout`). */
export const playgroundLayout = typestyles.recipe({
  name: 'playground-layout',
  layer: 'components',
  slots: ['content'],
  variants: { bleed: variant.boolean({ default: false }) },
  styles: () => ({
    base: {
      content: {
        flex: '1 1 auto',
        minHeight: 0,
        // `fill` pages do not scroll; a padded playground page scrolls its own content.
        overflow: 'auto',
        padding: t.space.xl.var,
        boxSizing: 'border-box',
      },
    },
    variants: {
      bleed: {
        true: { content: { padding: 0 } },
        false: {},
      },
    },
  }),
});
