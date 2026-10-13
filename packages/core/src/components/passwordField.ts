import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlFocusStyles } from './controlFocus';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './field';

/**
 * Password text field with an inline visibility toggle. Shares field chrome
 * with `textField` but wraps the input in a bordered group for the toggle.
 */
export const passwordField = typestyles.recipe(
  'password-field',
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
      toggleColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      toggleHoverBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'inputWrapper', 'input', 'visibilityToggle', 'description', 'error'],
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
          borderColor: v.inputBorder.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.inputBackground.var,
          color: v.inputForeground.var,
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
          color: v.inputForeground.var,
          outline: 'none',
          '&::placeholder': {
            color: v.placeholderColor.var,
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
          color: v.toggleColor.var,
          cursor: 'pointer',
          lineHeight: 0,
          '&:hover': {
            backgroundColor: v.toggleHoverBackground.var,
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
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
