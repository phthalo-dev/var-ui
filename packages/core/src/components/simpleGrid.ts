import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Equal-column grid (Mantine `SimpleGrid` equivalent). Use `cols` for a fixed
 * number of tracks; unlike `grid`, there is no auto-fill minmax behavior.
 */
export const simpleGrid = typestyles.recipe(
  'simple-grid',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[4].var, syntax: '<length>' },
    });
    return {
      base: {
        display: 'grid',
        gap: v.gap.var,
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
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1].var },
          sm: { [v.gap.name]: t.space[2].var },
          md: { [v.gap.name]: t.space[4].var },
          lg: { [v.gap.name]: t.space[5].var },
          xl: { [v.gap.name]: t.space[8].var },
        },
      },
      defaultVariants: { cols: 'two', spacing: 'md' },
    };
  },
  { layer: 'components' },
);
