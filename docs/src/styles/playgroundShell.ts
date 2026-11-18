import { typestyles } from '@var-ui/core';

export const playgroundShellStyles = typestyles.recipe({
  name: 'playground-shell',
  layer: 'components',
  slots: ['root', 'layout', 'article'],
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
      /** Wide reference article (color ramps); typography comes from `proseContent`. */
      article: {
        maxWidth: '72rem',
        marginInline: 'auto',
      },
    },
  }),
});
