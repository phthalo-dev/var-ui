import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Expand/collapse panel chrome for Disclosure-backed Collapsible.
 *
 * Slots: `root`, `trigger`, `triggerIcon`, `panel`.
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
export const collapsible = typestyles.recipe(
  'collapsible',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
      background: { value: t.color.background.surface.var, syntax: '<color>' },
      triggerColor: { value: t.color.text.primary.var, syntax: '<color>' },
      hoverBg: { value: t.color.background.subtle.var, syntax: '<color>' },
    });
    return {
      slots: ['root', 'trigger', 'triggerIcon', 'panel'],
      base: {
        root: {
          [v.border.name]: t.color.border.default.var,
          [v.background.name]: t.color.background.surface.var,
          [v.triggerColor.name]: t.color.text.primary.var,
          [v.hoverBg.name]: t.color.background.subtle.var,
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
          color: v.triggerColor.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          fontFamily: 'inherit',
          textAlign: 'start',
          cursor: 'pointer',
          borderRadius: t.radius.sm.var,
          '&:hover': {
            backgroundColor: v.hoverBg.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
        },
        triggerIcon: {
          display: 'inline-flex',
          flexShrink: 0,
          transition: 'transform 0.15s ease',
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
              borderWidth: t.borderWidth.default.var,
              borderStyle: 'solid',
              borderColor: v.border.var,
              borderRadius: t.radius.md.var,
              backgroundColor: v.background.var,
            },
          },
          accordion: {
            root: {
              borderRadius: 0,
              borderWidth: 0,
              borderBottomWidth: t.borderWidth.default.var,
              borderBottomStyle: 'solid',
              borderBottomColor: v.border.var,
              '&:last-child': {
                borderBottomWidth: 0,
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
      defaultVariants: { variant: 'flush' },
    };
  },
  { layer: 'components' },
);

export type CollapsibleRecipeProps = NonNullable<Parameters<typeof collapsible>[0]>;
export type CollapsibleVariant = NonNullable<CollapsibleRecipeProps['variant']>;

export type CollapsibleVariantProps = {
  variant?: CollapsibleVariant;
};

export const collapsibleVariantPropDocs = [
  { name: 'variant', type: "'flush' | 'bordered' | 'accordion'", required: false },
] as const satisfies ReadonlyArray<{
  name: keyof CollapsibleVariantProps;
  type: string;
  required: false;
}>;
