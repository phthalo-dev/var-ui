import { typestyles } from '@var-ui/core';

const belowLg = typestyles.breakpoint('lg', 'max');

export const playgroundShellStyles = typestyles.recipe({
  name: 'playground-shell',
  layer: 'components',
  slots: ['root', 'layout', 'sidePanel', 'controlsButton', 'article'],
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
      // Below `lg` the theme controls move into a drawer (like the docs sidebar), so the preview
      // gets the full width; the toolbar's Controls button opens it.
      sidePanel: {
        [belowLg]: { display: 'none' },
      },
      controlsButton: {
        marginInlineEnd: 'auto',
        '&&': { display: 'none', [belowLg]: { display: 'inline-flex' } },
      },
      /** Wide reference article (color ramps); typography comes from `docsProse`. */
      article: {
        maxWidth: '72rem',
        marginInline: 'auto',
      },
    },
  }),
});
