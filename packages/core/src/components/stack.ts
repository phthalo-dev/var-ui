import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Flex stack — the workhorse layout primitive. Vertical by default; use
 * `direction: 'row'` (or the React `HStack`) for horizontal grouping.
 *
 * ```tsx
 * <div className={stack({ gap: 'lg' })}>…</div>
 * ```
 */
export const stack = typestyles.recipe(
  'stack',
  (c) => {
    const v = c.vars({
      gap: { value: t.space[3].var, syntax: '<length>' },
    });
    return {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: v.gap.var,
        minWidth: 0,
      },
      variants: {
        direction: {
          column: {},
          row: { flexDirection: 'row' },
        },
        gap: {
          none: { [v.gap.name]: '0px' },
          xs: { [v.gap.name]: t.space[1].var },
          sm: { [v.gap.name]: t.space[2].var },
          md: { [v.gap.name]: t.space[3].var },
          lg: { [v.gap.name]: t.space[5].var },
          xl: { [v.gap.name]: t.space[8].var },
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
      defaultVariants: {
        direction: 'column',
        gap: 'md',
        align: 'stretch',
        justify: 'start',
        wrap: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
