import { typestyles } from '@var-ui/core';

export const playgroundShellStyles = typestyles.recipe({
  name: 'playground-shell',
  layer: 'components',
  slots: ['root', 'layout'],
  styles: () => ({
    base: {
      root: {
        height: '100%',
        minHeight: 0,
        minWidth: 0,
      },
      layout: {
        height: '100%',
        minHeight: 0,
        minWidth: 0,
      },
    },
  }),
});
