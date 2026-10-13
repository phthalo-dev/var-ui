import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Blocks interaction over a relatively-positioned parent while async work
 * runs. Compose with `LoadingOverlay` in React or apply slots manually.
 */
export const loadingOverlay = typestyles.recipe(
  'loading-overlay',
  (c) => {
    const v = c.vars({
      backdrop: {
        value: t.color.overlay.backdrop.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'overlay', 'loader'],
      base: {
        root: {
          position: 'relative',
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          zIndex: t.zIndex.overlay.var,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: v.backdrop.var,
          borderRadius: 'inherit',
        },
        loader: {
          display: 'inline-flex',
        },
      },
    };
  },
  { layer: 'components' },
);
