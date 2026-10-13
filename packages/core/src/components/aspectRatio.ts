import { typestyles } from '../runtime';

/**
 * Constrains children to a fixed aspect ratio (16/9 default). Override the
 * ratio with an inline `aspect-ratio` style (the React wrapper does this).
 *
 * ```tsx
 * <div className={aspectRatio()}><img src={cover} alt="" /></div>
 * ```
 */
export const aspectRatio = typestyles.recipe(
  'aspect-ratio',
  () => ({
    base: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      '& > *': {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
  }),
  { layer: 'components' },
);
