import { atProperty, variant, type RecipeVariants, type VariantOptions } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border, borderSide } from '../internal/border';

const collapsibleVariant = variant.enum(['flush', 'bordered', 'accordion'], { default: 'flush' });

/**
 * Expand/collapse panel chrome for Disclosure-backed Collapsible.
 *
 * Slots: `root`, `heading`, `trigger`, `triggerIcon`, `panel`.
 * Chevron rotation targets RAC `data-expanded` on the root (and `aria-expanded` on the trigger).
 *
 * ```ts
 * const c = collapsible();
 * <div className={c.root}>
 *   <button className={c.trigger} aria-expanded>…</button>
 *   <div className={c.panel}>…</div>
 * </div>
 * ```
 */
export const collapsible = typestyles.recipe({
  name: 'collapsible',
  layer: 'components',
  slots: ['root', 'heading', 'trigger', 'triggerIcon', 'panel'],
  variants: {
    variant: collapsibleVariant,
  },
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    background: { ...atProperty.color, value: t.color.background.surface.var },
    triggerColor: { ...atProperty.color, value: t.color.text.primary.var },
    hoverBg: { ...atProperty.color, value: t.color.background.subtle.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          [vars.border.name]: t.color.border.default.var,
          [vars.background.name]: t.color.background.surface.var,
          [vars.triggerColor.name]: t.color.text.primary.var,
          [vars.hoverBg.name]: t.color.background.subtle.var,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          // RAC Disclosure sets `data-expanded` on the root when open.
          [`&[data-expanded] .var-ui-collapsible__triggerIcon`]: {
            transform: 'rotate(180deg)',
          },
          // Fallback when expanded state is only on the trigger button.
          [`&:has([aria-expanded="true"]) .var-ui-collapsible__triggerIcon`]: {
            transform: 'rotate(180deg)',
          },
        },
        heading: {
          margin: 0,
        },
        trigger: {
          appearance: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[2].var,
          width: '100%',
          margin: 0,
          padding: `${t.space[2].var} ${t.space[3].var}`,
          border: 'none',
          background: 'transparent',
          color: vars.triggerColor.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          fontFamily: 'inherit',
          textAlign: 'start',
          cursor: 'pointer',
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: vars.hoverBg.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
        triggerIcon: {
          display: 'inline-flex',
          flexShrink: 0,
          transition: t.transition.transform.var,
        },
        panel: {
          padding: `${t.space[2].var} ${t.space[3].var} ${t.space[3].var}`,
          minWidth: 0,
        },
      },
      variants: {
        variant: {
          flush: {},
          bordered: {
            root: {
              ...border(vars.border.var),
              borderRadius: t.radius.md.var,
              backgroundColor: vars.background.var,
            },
          },
          accordion: {
            root: {
              borderRadius: 0,
              borderWidth: 0,
              ...borderSide('block-end', vars.border.var),
              '&:last-child': {
                borderBlockEndWidth: 0,
              },
            },
            trigger: {
              padding: `${t.space[3].var} ${t.space[4].var}`,
            },
            panel: {
              paddingInline: t.space[4].var,
              paddingBlockEnd: t.space[4].var,
              paddingBlockStart: 0,
            },
          },
        },
      },
    };
  },
});

export type CollapsibleVariant = VariantOptions<typeof collapsibleVariant>;
export type CollapsibleVariantProps = RecipeVariants<typeof collapsible>;
