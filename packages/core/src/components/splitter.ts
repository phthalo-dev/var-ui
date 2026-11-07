import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { resizeHandle } from './resizeHandle';
import { orientation } from '../shared/variantAxes';

/**
 * Resizable split panels (the APG window splitter pattern).
 *
 * DOM: `root` (flex container) > `panel` ... with a `handle` between each pair. The `handle`
 * slot is merged onto the `ResizeHandle` separator, which owns the divider look, the drag and
 * the keyboard logic; this recipe only adds the wider touch target.
 *
 * Sizes are a CSS custom property per panel (`size`, a unitless number set inline by the React
 * component). Panels use `flex: <size> 1 0%`, so the sizes are shares of the space left over by
 * the dividers and resizing only writes a custom property. `min-width`/`min-height: 0` plus
 * `overflow: auto` let panel content clip or scroll instead of forcing the panel open.
 */
export const splitter = typestyles.recipe({
  name: 'splitter',
  layer: 'components',
  slots: ['root', 'panel', 'handle'],
  variants: {
    orientation,
  },
  vars: {
    /** Share of the available space this panel takes (unitless; set per panel inline). */
    size: { ...atProperty.number, value: '1' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          minWidth: 0,
          minHeight: 0,
        },
        panel: {
          flex: `${vars.size.var} 1 0%`,
          minWidth: 0,
          minHeight: 0,
          overflow: 'auto',
          '&[data-collapsed]': { overflow: 'hidden' },
        },
        handle: {
          // Wider than the 1px line so a finger or coarse pointer can grab it. A var, not a
          // selector override, so cascade order and specificity don't matter.
          [resizeHandle.vars.hitOutset.name]: '0.5rem',
        },
      },
      variants: {
        orientation: {
          horizontal: { root: { flexDirection: 'row' } },
          vertical: { root: { flexDirection: 'column' } },
        },
      },
    };
  },
});

export type SplitterVariantProps = RecipeVariants<typeof splitter>;
