import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlFocusStyles } from './controlFocus';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { dropdownPopoverChrome, fieldChrome } from './field';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

/**
 * Headless combobox primitive recipe. Shares field chrome with the other
 * field controls and adds an `empty` slot for listbox empty states.
 */
export const combobox = typestyles.recipe(
  'combobox',
  {
    slots: [
      'root',
      'label',
      'description',
      'error',
      'inputWrapper',
      'input',
      'clearButton',
      'popover',
      'listbox',
      'item',
      'empty',
    ],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
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
      inputBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      inputBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      placeholderColor: {
        value: t.color.text.secondary.var,
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
      base: {
        root: {
          ...chrome.root,
          minWidth: '240px',
        },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        inputWrapper: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          width: '100%',
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.inputBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.inputBackground.var,
          transition: 'border-color 140ms ease, box-shadow 140ms ease',
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          '&:focus-within': controlFocusStyles(),
        },
        input: {
          border: 'none',
          background: 'transparent',
          outline: 'none',
          flex: 1,
          minWidth: 0,
          fontSize: 'inherit',
          color: v.inputForeground.var,
          '&::placeholder': {
            color: v.placeholderColor.var,
          },
        },
        clearButton: {
          display: 'inline-flex',
          flexShrink: 0,
          color: t.color.text.secondary.var,
          cursor: 'pointer',
          borderRadius: t.radius.sm.var,
          padding: t.space[1].var,
          '&[data-hovered]': {
            backgroundColor: t.color.background.subtle.var,
          },
        },
        popover: panel.popover,
        listbox: panel.listbox,
        item: panel.item,
        empty: {
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
          padding: `${t.space[2].var} ${t.space[3].var}`,
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          inputWrapper: controlSurfaceSize(size, { inset: 'compact' }),
        })),
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ComboboxVariantProps = RecipeVariants<typeof combobox>;
