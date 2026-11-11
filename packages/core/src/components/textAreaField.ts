import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
import { focusRing } from '../internal/focusRing';
import { fieldChrome } from '../internal/fieldChrome';
import {
  compactPaddingInline,
  controlPaddingBlock,
  controlSizeMetrics,
  controlSizeVariants,
} from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

export const textAreaField = typestyles.recipe({
  name: 'text-area-field',
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
        root: chrome.root,
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        input: {
          ...border(vars.inputBorder.var),
          borderRadius: t.radius.md.var,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          resize: 'vertical',
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
        // Same inline inset and type as text-field; the minimum height is about three lines.
        size: controlSizeVariants((size) => ({
          input: {
            fontSize: controlSizeMetrics[size].fontSize,
            paddingInline: compactPaddingInline[size],
            paddingBlock: controlPaddingBlock[size],
            minHeight: `calc(2.75 * ${controlSizeMetrics[size].height})`,
          },
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type TextAreaFieldVariantProps = RecipeVariants<typeof textAreaField>;
