import { typestyles } from '@var-ui/core';

export const playgroundShellStyles = typestyles.recipe(
  'playground-shell',
  () => ({
    slots: ['root', 'layout'],
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
  }),
  { layer: 'components' },
);
