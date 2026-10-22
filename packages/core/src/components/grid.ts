import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const gridColumns = variant.enum(['auto', 'one', 'two', 'three', 'four'], { default: 'auto' });

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
    gap: { ...atProperty.length, value: t.space[4].var },
    minColumnWidth: { ...atProperty.length, value: '240px' },
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
          one: { gridTemplateColumns: '1fr' },
          two: { gridTemplateColumns: 'repeat(2, 1fr)' },
          three: { gridTemplateColumns: 'repeat(3, 1fr)' },
          four: { gridTemplateColumns: 'repeat(4, 1fr)' },
        },
        gap: {
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
export type GridVariantProps = RecipeVariants<typeof grid>;
