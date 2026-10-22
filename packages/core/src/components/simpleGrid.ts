import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const simpleGridCols = variant.enum(['one', 'two', 'three', 'four', 'five', 'six', 'eight'], {
  default: 'two',
});

/**
 * Equal-column grid (Mantine `SimpleGrid` equivalent). Use `cols` for a fixed
 * number of tracks; unlike `grid`, there is no auto-fill minmax behavior.
 */
export const simpleGrid = typestyles.recipe({
  name: 'simple-grid',
  layer: 'components',
  variants: {
    cols: simpleGridCols,
    spacing: gap,
  },
  vars: {
    gap: { ...atProperty.length, value: t.space[4].var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'grid',
        gap: vars.gap.var,
      },
      variants: {
        cols: {
          one: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
          two: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          three: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
          four: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
          five: { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
          six: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
          eight: { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
        },
        spacing: {
          none: { [vars.gap.name]: '0px' },
          xs: { [vars.gap.name]: t.space[1].var },
          sm: { [vars.gap.name]: t.space[2].var },
          md: { [vars.gap.name]: t.space[4].var },
          lg: { [vars.gap.name]: t.space[5].var },
          xl: { [vars.gap.name]: t.space[8].var },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SimpleGridVariantProps = RecipeVariants<typeof simpleGrid>;
