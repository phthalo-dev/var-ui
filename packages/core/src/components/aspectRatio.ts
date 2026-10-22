import { typestyles } from '../runtime';

/**
 * Constrains children to a fixed aspect ratio (16/9 default). Assign
 * `aspectRatio.vars.ratio` (`16 / 9`, `1`, …) to override it.
 *
 * ```tsx
 * <div className={aspectRatio().className}><img src={cover} alt="" /></div>
 * ```
 */
export const aspectRatio = typestyles.recipe({
  name: 'aspect-ratio',
  layer: 'components',
  vars: {
    ratio: { syntax: '*', value: '16 / 9' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        position: 'relative',
        width: '100%',
        aspectRatio: vars.ratio.var,
        overflow: 'hidden',
        '& > *': {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
      },
    };
  },
});
