import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { gap, orientation } from '../shared/variantAxes';

/**
 * Grouping container for related form controls, styled on the native `<fieldset>` + `<legend>`.
 * A `disabled` fieldset disables every descendant control natively; the root dims through
 * `:disabled` (and `[data-disabled]` for non-fieldset roots).
 *
 * Slots: `root` (`<fieldset>`), `legend`, `description`, `error`, `content` (the layout box that
 * holds the controls; `gap` and `orientation` apply here).
 *
 * ```tsx
 * const f = fieldset({ orientation: 'vertical' });
 * <fieldset className={f.root.className}>
 *   <legend className={f.legend.className}>Notifications</legend>
 *   <div className={f.content.className}>…controls…</div>
 * </fieldset>
 * ```
 */
export const fieldset = typestyles.recipe({
  name: 'fieldset',
  layer: 'components',
  slots: ['root', 'legend', 'description', 'error', 'content'],
  variants: {
    gap,
    orientation,
    legendHidden: variant.boolean({ default: false }),
  },
  vars: {
    legendColor: { ...atProperty.color, value: t.color.text.primary.var },
    descriptionColor: { ...atProperty.color, value: t.color.text.secondary.var },
    errorColor: { ...atProperty.color, value: t.color.tone.danger.foreground.var },
    gap: { ...atProperty.length, value: t.space.sm.var },
  },
  styles: ({ vars }) => ({
    base: {
      root: {
        display: 'grid',
        gap: t.space.xxs.var,
        minInlineSize: 0,
        margin: 0,
        padding: 0,
        border: 0,
        '&:disabled, &[data-disabled]': {
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
      },
      legend: {
        padding: 0,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        color: vars.legendColor.var,
      },
      description: {
        margin: 0,
        fontSize: t.fontSize.sm.var,
        color: vars.descriptionColor.var,
      },
      error: {
        margin: 0,
        fontSize: t.fontSize.sm.var,
        color: vars.errorColor.var,
      },
      content: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: vars.gap.var,
        minInlineSize: 0,
      },
    },
    variants: {
      gap: {
        none: { root: { [vars.gap.name]: '0rem' } },
        xs: { root: { [vars.gap.name]: t.space.xxs.var } },
        sm: { root: { [vars.gap.name]: t.space.xs.var } },
        md: { root: { [vars.gap.name]: t.space.sm.var } },
        lg: { root: { [vars.gap.name]: t.space.lg.var } },
        xl: { root: { [vars.gap.name]: t.space.xxxl.var } },
      },
      orientation: {
        horizontal: {},
        vertical: { content: { flexDirection: 'column', flexWrap: 'nowrap' } },
      },
      legendHidden: {
        true: {
          legend: {
            position: 'absolute',
            width: '0.0625rem',
            height: '0.0625rem',
            margin: '-0.0625rem',
            padding: 0,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
          },
        },
        false: {},
      },
    },
  }),
});

export type FieldsetVariantProps = RecipeVariants<typeof fieldset>;
