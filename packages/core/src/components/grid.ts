import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const gridColumns = variant.enum(['auto', 'one', 'two', 'three', 'four', 'five', 'six', 'eight'], {
  default: 'auto',
});

/**
 * Responsive grid. `columns: 'auto'` packs `minmax(minColumnWidth, 1fr)`
 * tracks (override the min width by setting the exposed CSS variable);
 * numeric columns give fixed equal tracks.
 *
 * ```tsx
 * <div className={grid({ columns: 'auto', gap: 'lg' })}>{cards}</div>
 * ```
 */
export const grid = typestyles.recipe({
  name: 'grid',
  layer: 'components',
  variants: {
    columns: gridColumns,
    gap,
  },
  vars: {
    gap: { ...atProperty.length, value: t.space.md.var },
    minColumnWidth: { ...atProperty.length, value: t.size.field.minWidth.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'grid',
        gap: vars.gap.var,
        gridTemplateColumns: `repeat(auto-fill, minmax(${vars.minColumnWidth.var}, 1fr))`,
      },
      variants: {
        columns: {
          auto: {},
          one: { gridTemplateColumns: 'minmax(0, 1fr)' },
          two: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          three: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
          four: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
          five: { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
          six: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
          eight: { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
        },
        // Step names map 1:1 to the space tokens (#133).
        gap: {
          none: { [vars.gap.name]: t.space.none.var },
          xxs: { [vars.gap.name]: t.space.xxs.var },
          xs: { [vars.gap.name]: t.space.xs.var },
          sm: { [vars.gap.name]: t.space.sm.var },
          md: { [vars.gap.name]: t.space.md.var },
          lg: { [vars.gap.name]: t.space.lg.var },
          xl: { [vars.gap.name]: t.space.xl.var },
          xxl: { [vars.gap.name]: t.space.xxl.var },
          xxxl: { [vars.gap.name]: t.space.xxxl.var },
          xxxxl: { [vars.gap.name]: t.space.xxxxl.var },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type GridVariantProps = RecipeVariants<typeof grid>;
