import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

export const textField = typestyles.recipe(
  'text-field',
  {
    slots: ['root', 'label', 'input', 'description', 'error'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
      labelColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      inputBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      inputBorder: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      inputForeground: {
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
