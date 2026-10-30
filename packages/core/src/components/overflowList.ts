import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { gap } from '../shared/variantAxes';

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
    gap,
    fillParent: variant.boolean({ default: false }),
  },
  vars: {
    gap: { ...atProperty.length, value: t.space[3].var },
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
        gap: {
          none: { root: { [vars.gap.name]: '0px' } },
          xs: { root: { [vars.gap.name]: t.space[1].var } },
          sm: { root: { [vars.gap.name]: t.space[2].var } },
          md: { root: { [vars.gap.name]: t.space[3].var } },
          lg: { root: { [vars.gap.name]: t.space[5].var } },
          xl: { root: { [vars.gap.name]: t.space[8].var } },
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
