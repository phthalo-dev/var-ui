import { atProperty, variant, type RecipeVariants } from 'typestyles';
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
  variants: {
    size: controlSize,
    /** Grow with the content (`field-sizing: content`) between `minRows` and `maxRows`. */
    autosize: variant.boolean({ default: false }),
  },
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
    /** Autosize bounds, in lines of text. Without a cap the field sets `data-max-rows="none"`. */
    minRows: { ...atProperty.number, value: '2' },
    maxRows: { ...atProperty.number, value: '0' },
    /** The input's block padding (set per size), so row bounds include it. */
    paddingBlock: { ...atProperty.length, value: '0px' },
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
            [vars.paddingBlock.name]: controlPaddingBlock[size],
            minHeight: `calc(2.75 * ${controlSizeMetrics[size].height})`,
          },
        })),
        autosize: {
          true: {
            input: {
              // Platform autosize (Chromium today; elsewhere the field keeps its rows and
              // scrolls). Heights are lines of text plus the padding and border.
              fieldSizing: 'content',
              resize: 'none',
              minHeight: `calc(${vars.minRows.var} * 1lh + 2 * ${vars.paddingBlock.var} + 2 * ${t.borderWidth.default.var})`,
              maxHeight: `calc(${vars.maxRows.var} * 1lh + 2 * ${vars.paddingBlock.var} + 2 * ${t.borderWidth.default.var})`,
              '&[data-max-rows="none"]': { maxHeight: 'none' },
            },
          },
          false: {},
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type TextAreaFieldVariantProps = RecipeVariants<typeof textAreaField>;
