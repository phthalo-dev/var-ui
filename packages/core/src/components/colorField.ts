import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, variant, type RecipeVariants } from 'typestyles';

/**
 * Hex color input with a swatch trigger for a native color picker. Intended
 * for theme builders and settings forms — not a full HSV color picker.
 */
export const colorField = typestyles.recipe({
  name: 'color-field',
  layer: 'components',
  slots: [
    'root',
    'label',
    'inputWrapper',
    'swatchButton',
    'swatchPreview',
    'nativePicker',
    'input',
    'description',
    'error',
  ],
  variants: {
    size: controlSize,
    appearance: variant.enum(['field', 'swatch'], { default: 'field' }),
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
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    errorColor: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    swatchBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    swatchColor: {
      ...atProperty.color,
      value: 'transparent',
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
        inputWrapper: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.inputBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          transition: 'border-color 140ms ease',
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          '&:focus-within': focusRing,
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        swatchButton: {
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          borderRadius: t.radius.sm.var,
          lineHeight: 0,
          '&:focus-visible': {
            ...focusRing,
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
        },
        swatchPreview: {
          display: 'block',
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: t.radius.sm.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.swatchBorder.var,
          backgroundColor: vars.swatchColor.var,
          boxSizing: 'border-box',
        },
        nativePicker: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          border: 'none',
          padding: 0,
        },
        input: {
          flex: 1,
          minWidth: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          fontSize: 'inherit',
          fontFamily: t.fontFamily.mono.var,
          color: vars.inputForeground.var,
          outline: 'none',
          textTransform: 'uppercase',
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          inputWrapper: controlSurfaceSize(size, { inset: 'compact' }),
        })),
        appearance: {
          field: {},
          swatch: {
            root: {
              minWidth: 0,
              width: 'fit-content',
            },
            inputWrapper: {
              borderWidth: 0,
              borderStyle: 'none',
              backgroundColor: 'transparent',
              padding: 0,
              paddingInline: 0,
              paddingBlock: 0,
              gap: 0,
              height: 'auto',
              minHeight: 0,
              '&:hover': {
                borderColor: 'transparent',
              },
              '&:focus-within': {
                outline: 'none',
              },
            },
            swatchPreview: {
              width: '1.5rem',
              height: '1.5rem',
            },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ColorFieldVariantProps = RecipeVariants<typeof colorField>;
