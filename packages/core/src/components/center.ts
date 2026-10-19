import { variant, type RecipeVariants } from 'typestyles';
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
  {
    variants: {
      inline: variant.boolean({ default: false }),
    },
  },
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
  }),
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type CenterVariantProps = RecipeVariants<typeof center>;
