import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './field';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

export const textField = typestyles.recipe(
  'text-field',
  {
    slots: ['root', 'label', 'input', 'description', 'error'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      labelColor: {
        value: t.color.text.primary.var,
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
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
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
        input: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.inputBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.inputBackground.var,
          color: v.inputForeground.var,
          boxSizing: 'border-box',
          '&:focus': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
            [v.inputBorder.name]: t.color.border.focus.var,
          },
          '&::placeholder': {
            color: v.placeholderColor.var,
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          input: controlSurfaceSize(size, { inset: 'compact' }),
        })),
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type TextFieldVariantProps = RecipeVariants<typeof textField>;
