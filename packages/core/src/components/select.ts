import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { fieldChrome, dropdownPopoverChrome } from '../internal/fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

export const select = typestyles.recipe({
  name: 'select',
  layer: 'components',
  slots: [
    'root',
    'label',
    'trigger',
    'selectValue',
    'triggerIcon',
    'description',
    'error',
    'popover',
    'listbox',
    'item',
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
          minWidth: '240px',
        },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        trigger: {
          appearance: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[2].var,
          width: '100%',
          textAlign: 'start',
          boxSizing: 'border-box',
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
        selectValue: {
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: t.color.text.primary.var,
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
        item: panel.item,
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
export type SelectVariantProps = RecipeVariants<typeof select>;
