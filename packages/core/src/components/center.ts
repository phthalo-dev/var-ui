import { typestyles } from '../runtime';

/**
 * Centers children on both axes. `inline` variant for inline-grid contexts.
 *
 * ```tsx
 * <div className={center()} style={{ minHeight: '200px' }}>{spinner}</div>
 * ```
 */
export const center = typestyles.recipe(
  'center',
  () => ({
    base: {
      display: 'grid',
      placeItems: 'center',
    },
    variants: {
      inline: {
        true: { display: 'inline-grid' },
        false: {},
      },
    },
    defaultVariants: { inline: 'false' },
  }),
  { layer: 'components' },
);
