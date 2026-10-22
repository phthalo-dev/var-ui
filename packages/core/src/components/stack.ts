import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

const stackDirection = variant.enum(['column', 'row'], { default: 'column' });
const stackAlign = variant.enum(['start', 'center', 'end', 'stretch'], { default: 'stretch' });
const stackJustify = variant.enum(['start', 'center', 'end', 'between'], { default: 'start' });
const stackWrap = variant.enum(['wrap', 'nowrap'], { default: 'nowrap' });

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
    gap,
    align: stackAlign,
    justify: stackJustify,
    wrap: stackWrap,
  },
  vars: {
    gap: { ...atProperty.length, value: t.space[3].var },
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
        gap: {
          none: { [vars.gap.name]: '0px' },
          xs: { [vars.gap.name]: t.space[1].var },
          sm: { [vars.gap.name]: t.space[2].var },
          md: { [vars.gap.name]: t.space[3].var },
          lg: { [vars.gap.name]: t.space[5].var },
          xl: { [vars.gap.name]: t.space[8].var },
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
