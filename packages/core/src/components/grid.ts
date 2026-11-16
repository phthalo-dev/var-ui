import { atProperty, variant, type CSSProperties, type RecipeVariants } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const gridColumns = variant.enum(
  ['auto', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'fixed'],
  { default: 'auto' },
);

/** Per-breakpoint column counts backing the responsive `columns` map. */
export type GridResponsiveColumns = Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', number>>;

const RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;

const fixedTracks = (count: number) => `repeat(${count}, minmax(0, 1fr))`;

/**
 * Media-query class backing the responsive `columns` map (`{ base: 2, lg: 7 }`)
 * on the React and Astro `Grid`. Values must be positive integers. Combine it
 * with the recipe called with `columns: 'fixed'` when `base` is set (the class
 * then owns the template at every width), or `columns: 'auto'` otherwise (the
 * auto-fill template holds until the first breakpoint). Returns undefined when
 * the map sets nothing.
 */
export function gridColumnsStyle(counts: GridResponsiveColumns): string | undefined {
  const styles: CSSProperties = {};
  if (counts.base != null) {
    styles.gridTemplateColumns = fixedTracks(counts.base);
  }
  for (const bp of RESPONSIVE_BREAKPOINTS) {
    const count = counts[bp];
    if (count != null) {
      styles[breakpoint(bp, 'min')] = { gridTemplateColumns: fixedTracks(count) };
    }
  }
  if (Object.keys(styles).length === 0) {
    return undefined;
  }
  return typestyles.hash(styles, { layer: 'components', label: 'grid-columns' });
}

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
          seven: { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
          eight: { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
          // Template owned by the `gridColumnsStyle` class (responsive maps).
          fixed: {},
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
