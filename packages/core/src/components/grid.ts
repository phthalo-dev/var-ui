import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const gridColumns = variant.enum(
  ['auto', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'fixed'],
  { default: 'auto' },
);

/** Per-breakpoint column counts backing the responsive `columns` map. */
export type GridResponsiveColumns = Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', number>>;

type GridColumnStop = keyof GridResponsiveColumns;

const COLUMN_STOPS = ['base', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly GridColumnStop[];

/**
 * Custom properties holding the track list for each stop of a responsive `columns` map. They have
 * no default on purpose: an unset stop falls back to the previous one (and before the first set
 * stop, to the `auto` template), so they are plain names rather than registered recipe vars.
 */
export const gridColumnTracksVar = {
  base: '--var-ui-grid-columns-base',
  sm: '--var-ui-grid-columns-sm',
  md: '--var-ui-grid-columns-md',
  lg: '--var-ui-grid-columns-lg',
  xl: '--var-ui-grid-columns-xl',
} as const satisfies Record<GridColumnStop, `--${string}`>;

const fixedTracks = (count: number) => `repeat(${count}, minmax(0, 1fr))`;

/**
 * Inline custom properties for a responsive `columns` map (`{ base: 2, lg: 7 }`) on the React and
 * Astro `Grid`. Pair it with the recipe called with `columns: 'fixed'`, whose static CSS reads
 * them (so it works with extracted CSS and SSR, unlike a runtime-hashed class). Counts must be
 * positive integers. Returns undefined when the map sets nothing.
 */
export function gridColumnsVars(counts: GridResponsiveColumns): Record<string, string> | undefined {
  const vars: Record<string, string> = {};
  for (const stop of COLUMN_STOPS) {
    const count = counts[stop];
    if (count == null) continue;
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`[var-ui] Grid columns.${stop} must be a positive integer (got ${count}).`);
    }
    vars[gridColumnTracksVar[stop]] = fixedTracks(count);
  }
  return Object.keys(vars).length > 0 ? vars : undefined;
}

/** `var(--md, var(--sm, var(--base, <fallback>)))`: the nearest set stop at or below `stop`. */
const tracksAt = (stop: GridColumnStop, fallback: string) =>
  COLUMN_STOPS.slice(0, COLUMN_STOPS.indexOf(stop) + 1).reduce(
    (inner, s) => `var(${gridColumnTracksVar[s]}, ${inner})`,
    fallback,
  );

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
    const autoTracks = `repeat(auto-fill, minmax(${vars.minColumnWidth.var}, 1fr))`;
    return {
      base: {
        display: 'grid',
        gap: vars.gap.var,
        gridTemplateColumns: autoTracks,
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
          // Responsive maps and counts past `eight`: tracks from `gridColumnsVars`, mobile-first.
          fixed: {
            gridTemplateColumns: tracksAt('base', autoTracks),
            [breakpoint('sm', 'min')]: { gridTemplateColumns: tracksAt('sm', autoTracks) },
            [breakpoint('md', 'min')]: { gridTemplateColumns: tracksAt('md', autoTracks) },
            [breakpoint('lg', 'min')]: { gridTemplateColumns: tracksAt('lg', autoTracks) },
            [breakpoint('xl', 'min')]: { gridTemplateColumns: tracksAt('xl', autoTracks) },
          },
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
