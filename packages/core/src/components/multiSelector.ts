import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { dropdownPopoverChrome, fieldChrome } from './fieldChrome';

export const multiSelector = typestyles.recipe(
  'multiSelector',
  (c) => {
    const v = c.vars({
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
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.triggerBorder.var,
        borderRadius: t.radius.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        backgroundColor: v.triggerBackground.var,
        color: v.triggerForeground.var,
        fontSize: t.fontSize.md.var,
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
      triggerValue: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
      item: {
        ...panel.item,
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
      },
      itemCheckbox: {
        width: '1rem',
        height: '1rem',
        borderRadius: t.radius.sm.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.itemCheckboxBorder.var,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        '&[data-selected]': {
          backgroundColor: v.itemSelectedColor.var,
        },
      },
      itemLabel: {
        flex: 1,
        minWidth: 0,
      },
    };
  },
  { layer: 'components' },
);
