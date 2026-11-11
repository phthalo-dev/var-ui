import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { dropdownPopoverChrome, fieldChrome } from '../internal/fieldChrome';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

export const multiSelector = typestyles.recipe({
  name: 'multiSelector',
  layer: 'components',
  slots: [
    'root',
    'label',
    'trigger',
    'triggerValue',
    'triggerIcon',
    'description',
    'error',
    'popover',
    'listbox',
    'item',
    'itemCheckbox',
    'itemLabel',
  ],
  variants: { size: controlSize },
  vars: {
    labelColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    triggerBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    triggerBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    triggerForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    placeholderColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    errorColor: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    popoverBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    popoverBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    itemSelectedColor: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    itemFocusedBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    itemCheckboxBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    const panel = dropdownPopoverChrome({
      popoverBorder: vars.popoverBorder,
      popoverBackground: vars.popoverBackground,
      itemFocusedBackground: vars.itemFocusedBackground,
      itemSelectedColor: vars.itemSelectedColor,
    });
    return {
      base: {
        root: {
          ...chrome.root,
          minWidth: t.size.field.minWidth.var,
        },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        trigger: {
          appearance: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          textAlign: 'start',
          ...border(vars.triggerBorder.var),
          borderRadius: t.radius.md.var,
          backgroundColor: vars.triggerBackground.var,
          color: vars.triggerForeground.var,
          cursor: 'pointer',
          outline: 'none',
          transition: t.transition.borderShadow.var,
          '&:hover, &[data-hovered]': {
            borderColor: t.color.border.strong.var,
          },
          '&[data-focus-visible]:not([data-pressed])': {
            ...focusRing,
          },
          '&[data-pressed]': {
            borderColor: t.color.border.focus.var,
          },
        },
        triggerValue: {
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          '&[data-placeholder]': {
            color: vars.placeholderColor.var,
          },
        },
        triggerIcon: {
          display: 'inline-flex',
          flexShrink: 0,
          color: t.color.text.secondary.var,
        },
        popover: panel.popover,
        listbox: panel.listbox,
        item: {
          ...panel.item,
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
        },
        itemCheckbox: {
          width: t.size.icon.md.var,
          height: t.size.icon.md.var,
          borderRadius: t.radius.sm.var,
          ...border(vars.itemCheckboxBorder.var),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '&[data-selected]': {
            backgroundColor: vars.itemSelectedColor.var,
            ...atForcedColors(forced.fill),
          },
        },
        itemLabel: {
          flex: 1,
          minWidth: 0,
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          trigger: controlSurfaceSize(size, { inset: 'compact' }),
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type MultiSelectorVariantProps = RecipeVariants<typeof multiSelector>;
