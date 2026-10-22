import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlFocusStyles } from './controlFocus';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Password text field with an inline visibility toggle. Shares field chrome
 * with `textField` but wraps the input in a bordered group for the toggle.
 */
export const passwordField = typestyles.recipe({
  name: 'password-field',
  layer: 'components',
  slots: ['root', 'label', 'inputWrapper', 'input', 'visibilityToggle', 'description', 'error'],
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
    toggleColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    toggleHoverBackground: {
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
          gap: t.space[1].var,
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.inputBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          transition: 'border-color 140ms ease, box-shadow 140ms ease',
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          '&:focus-within': controlFocusStyles(),
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        input: {
          flex: 1,
          minWidth: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          fontSize: 'inherit',
          fontFamily: t.fontFamily.body.var,
          color: vars.inputForeground.var,
          outline: 'none',
          '&::placeholder': {
            color: vars.placeholderColor.var,
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
        },
        visibilityToggle: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: 'none',
          margin: 0,
          padding: t.space[1].var,
          borderRadius: t.radius.sm.var,
          backgroundColor: 'transparent',
          color: vars.toggleColor.var,
          cursor: 'pointer',
          lineHeight: 0,
          '&:hover': {
            backgroundColor: vars.toggleHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => ({
          inputWrapper: controlSurfaceSize(size, { inset: 'compact' }),
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type PasswordFieldVariantProps = RecipeVariants<typeof passwordField>;
