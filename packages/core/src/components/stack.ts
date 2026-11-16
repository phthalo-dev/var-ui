import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gapValues } from '../shared/variantAxes';

const stackDirection = variant.enum(['column', 'row'], { default: 'column' });
const stackAlign = variant.enum(['start', 'center', 'end', 'stretch'], { default: 'stretch' });
const stackJustify = variant.enum(['start', 'center', 'end', 'between'], { default: 'start' });
const stackWrap = variant.enum(['wrap', 'nowrap'], { default: 'nowrap' });
// Default `sm` keeps the historical 0.75rem default now that gap names map 1:1
// to the space tokens.
const stackGap = variant.enum(gapValues, { default: 'sm' });

/**
 * Flex stack — the workhorse layout primitive. Vertical by default; use
 * `direction: 'row'` (or the React `HStack`) for horizontal grouping.
 *
 * ```tsx
 * <div className={stack({ gap: 'lg' })}>…</div>
 * ```
 */
export const stack = typestyles.recipe({
  name: 'stack',
  layer: 'components',
  variants: {
    direction: stackDirection,
    gap: stackGap,
    align: stackAlign,
    justify: stackJustify,
    wrap: stackWrap,
  },
  vars: {
    gap: { ...atProperty.length, value: t.space.sm.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: vars.gap.var,
        minWidth: 0,
      },
      variants: {
        direction: {
          column: {},
          row: { flexDirection: 'row' },
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
        align: {
          start: { alignItems: 'flex-start' },
          center: { alignItems: 'center' },
          end: { alignItems: 'flex-end' },
          stretch: { alignItems: 'stretch' },
        },
        justify: {
          start: { justifyContent: 'flex-start' },
          center: { justifyContent: 'center' },
          end: { justifyContent: 'flex-end' },
          between: { justifyContent: 'space-between' },
        },
        wrap: {
          wrap: { flexWrap: 'wrap' },
          nowrap: {},
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type StackVariantProps = RecipeVariants<typeof stack>;
