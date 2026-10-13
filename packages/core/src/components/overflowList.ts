import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

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
export const overflowList = typestyles.recipe(
  'overflow-list',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[3].var, syntax: '<length>' },
    });
    return {
      slots: ['root', 'item', 'overflow'],
      base: {
        root: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: v.gap.var,
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
      },
      variants: {
        gap: {
          none: { root: { [v.gap.name]: '0px' } },
          xs: { root: { [v.gap.name]: t.space[1].var } },
          sm: { root: { [v.gap.name]: t.space[2].var } },
          md: { root: { [v.gap.name]: t.space[3].var } },
          lg: { root: { [v.gap.name]: t.space[5].var } },
          xl: { root: { [v.gap.name]: t.space[8].var } },
        },
        fillParent: {
          true: { root: { width: '100%' } },
          false: {},
        },
      },
      defaultVariants: { gap: 'md', fillParent: false },
    };
  },
  { layer: 'components' },
);
