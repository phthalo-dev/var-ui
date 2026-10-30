import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
import { focusRing } from '../internal/focusRing';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

export const textField = typestyles.recipe({
  name: 'text-field',
  layer: 'components',
  slots: ['root', 'label', 'input', 'description', 'error'],
  variants: { size: controlSize },
  vars: {
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
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
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
          ...border(vars.inputBorder.var),
          borderRadius: t.radius.md.var,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          boxSizing: 'border-box',
          '&:focus': {
            ...focusRing,
            [vars.inputBorder.name]: t.color.border.focus.var,
          },
          '&::placeholder': {
            color: vars.placeholderColor.var,
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
});

/** Visual props derived from the schema. */
export type TextFieldVariantProps = RecipeVariants<typeof textField>;
