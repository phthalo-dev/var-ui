import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome, dropdownPopoverChrome } from './field';

export const select = typestyles.recipe(
  'select',
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      triggerBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      triggerBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      triggerForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      placeholderColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
      popoverBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      popoverBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      itemSelectedColor: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      itemFocusedBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    const panel = dropdownPopoverChrome({
      popoverBorder: v.popoverBorder,
      popoverBackground: v.popoverBackground,
      itemFocusedBackground: v.itemFocusedBackground,
      itemSelectedColor: v.itemSelectedColor,
    });
    return {
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
          textAlign: 'left',
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.triggerBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.triggerBackground.var,
          color: v.triggerForeground.var,
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 140ms ease, box-shadow 140ms ease',
          '&:hover, &[data-hovered]': {
            borderColor: t.color.border.strong.var,
          },
          '&[data-focus-visible]:not([data-pressed])': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
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
            color: v.placeholderColor.var,
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
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
