import { designTokens as t, typestyles } from '@var-ui/core';
import { variant } from 'typestyles';

/** Playground page frame under the shared docs header (`PlaygroundLayout`). */
export const playgroundLayout = typestyles.recipe({
  name: 'playground-layout',
  layer: 'components',
  slots: ['layout', 'content'],
  variants: { bleed: variant.boolean({ default: false }) },
  styles: () => ({
    base: {
      layout: {
        flex: '1 1 auto',
        minHeight: 0,
        minWidth: 0,
      },
      content: {
        height: '100%',
        minHeight: 0,
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
