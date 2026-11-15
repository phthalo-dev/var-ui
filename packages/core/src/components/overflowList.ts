import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gapValues } from '../shared/variantAxes';

// Default `sm` keeps the historical 0.75rem default now that gap names map 1:1
// to the space tokens.
const overflowListGap = variant.enum(gapValues, { default: 'sm' });

/**
 * Single-row flex chrome for a horizontally overflowing list of items. Pair with
 * the React `OverflowList` compound + `useOverflow`, which measure item widths
 * against the root's box and hide the tail behind a caller-supplied indicator.
 *
 * ```tsx
 * const s = overflowList({ gap: 'md' });
 * <div className={s.root.className}>
 *   <span className={s.item.className}>Alpha</span>
 *   <span className={s.overflow.className}>+2</span>
 * </div>
 * ```
 */
export const overflowList = typestyles.recipe({
  name: 'overflow-list',
  layer: 'components',
  slots: ['root', 'item', 'overflow', 'measure'],
  variants: {
    gap: overflowListGap,
    fillParent: variant.boolean({ default: false }),
  },
  vars: {
    gap: { ...atProperty.length, value: t.space.sm.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: vars.gap.var,
          minWidth: 0,
          overflow: 'hidden',
        },
        item: {
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          minWidth: 0,
        },
        overflow: {
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        },
        measure: {
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          height: 0,
          overflow: 'hidden',
          visibility: 'hidden',
          pointerEvents: 'none',
        },
      },
      variants: {
        // Step names map 1:1 to the space tokens (#133).
        gap: {
          none: { root: { [vars.gap.name]: t.space.none.var } },
          xxs: { root: { [vars.gap.name]: t.space.xxs.var } },
          xs: { root: { [vars.gap.name]: t.space.xs.var } },
          sm: { root: { [vars.gap.name]: t.space.sm.var } },
          md: { root: { [vars.gap.name]: t.space.md.var } },
          lg: { root: { [vars.gap.name]: t.space.lg.var } },
          xl: { root: { [vars.gap.name]: t.space.xl.var } },
          xxl: { root: { [vars.gap.name]: t.space.xxl.var } },
          xxxl: { root: { [vars.gap.name]: t.space.xxxl.var } },
          xxxxl: { root: { [vars.gap.name]: t.space.xxxxl.var } },
        },
        fillParent: {
          true: { root: { width: '100%' } },
          false: {},
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type OverflowListVariantProps = RecipeVariants<typeof overflowList>;
