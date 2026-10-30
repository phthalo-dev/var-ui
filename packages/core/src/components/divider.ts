import { typestyles } from '../runtime';
import { atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { orientation } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Hairline separator; vertical orientation stretches to the parent's cross
 * size inside a flex row.
 *
 * ```tsx
 * <hr className={divider().className} />
 * ```
 */
export const divider = typestyles.recipe({
  name: 'divider',
  layer: 'components',
  variants: {
    orientation,
  },
  vars: {
    color: { ...atProperty.color, value: t.color.border.default.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        border: 'none',
        margin: 0,
        backgroundColor: vars.color.var,
        flexShrink: 0,
        ...atForcedColors({ backgroundColor: 'CanvasText' }),
      },
      variants: {
        orientation: {
          horizontal: { width: '100%', height: '1px' },
          vertical: { width: '1px', height: 'auto', alignSelf: 'stretch' },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type DividerVariantProps = RecipeVariants<typeof divider>;
