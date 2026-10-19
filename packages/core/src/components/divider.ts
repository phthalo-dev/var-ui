import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { orientation } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

/**
 * Hairline separator; vertical orientation stretches to the parent's cross
 * size inside a flex row.
 *
 * ```tsx
 * <hr className={divider()} />
 * ```
 */
export const divider = typestyles.recipe(
  'divider',
  {
    variants: {
      orientation,
    },
  },
  (c) => {
    const v = c.vars({
      color: { value: t.color.border.default.var, syntax: '<color>' },
    });
    return {
      base: {
        border: 'none',
        margin: 0,
        backgroundColor: v.color.var,
        flexShrink: 0,
      },
      variants: {
        orientation: {
          horizontal: { width: '100%', height: '1px' },
          vertical: { width: '1px', height: 'auto', alignSelf: 'stretch' },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type DividerVariantProps = RecipeVariants<typeof divider>;
