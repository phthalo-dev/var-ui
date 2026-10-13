import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Responsive grid. `columns: 'auto'` packs `minmax(minColumnWidth, 1fr)`
 * tracks (override the min width by setting the exposed CSS variable);
 * numeric columns give fixed equal tracks.
 *
 * ```tsx
 * <div className={grid({ columns: 'auto', gap: 'lg' })}>{cards}</div>
 * ```
 */
export const grid = typestyles.recipe(
  'grid',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[4].var, syntax: '<length>' },
      minColumnWidth: { value: '240px', syntax: '<length>' },
    });
    return {
      base: {
        display: 'grid',
        gap: v.gap.var,
        gridTemplateColumns: `repeat(auto-fill, minmax(${v.minColumnWidth.var}, 1fr))`,
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
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1].var },
          sm: { [v.gap.name]: t.space[2].var },
          md: { [v.gap.name]: t.space[4].var },
          lg: { [v.gap.name]: t.space[5].var },
          xl: { [v.gap.name]: t.space[8].var },
        },
      },
      defaultVariants: { columns: 'auto', gap: 'md' },
    };
  },
  { layer: 'components' },
);
