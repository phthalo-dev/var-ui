import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { fieldChrome } from './field';
import { controlSize } from './variantAxes';
import { type RecipeVariants } from 'typestyles';

export const numberInput = typestyles.recipe(
  'number-input',
  {
    slots: ['root', 'label', 'group', 'input', 'stepper', 'description', 'error'],
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
      descriptionColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      errorColor: {
        value: t.color.tone.danger.foreground.var,
        syntax: '<color>',
      },
      stepperBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      stepperForeground: {
        value: t.color.text.primary.var,
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
        group: {
          display: 'flex',
          alignItems: 'stretch',
        },
        input: {
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.inputBorder.var,
          borderRadius: `${t.radius.md.var} 0 0 ${t.radius.md.var}`,
          backgroundColor: v.inputBackground.var,
          color: v.inputForeground.var,
          '&:focus': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
            [v.inputBorder.name]: t.color.border.focus.var,
          },
        },
        stepper: {
          display: 'flex',
          flexDirection: 'column',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.inputBorder.var,
          borderInlineStart: 'none',
          borderRadius: `0 ${t.radius.md.var} ${t.radius.md.var} 0`,
          overflow: 'hidden',
          '& button': {
            appearance: 'none',
            border: 'none',
            backgroundColor: v.stepperBackground.var,
            color: v.stepperForeground.var,
            padding: `${t.space[1].var} ${t.space[2].var}`,
            cursor: 'pointer',
            fontSize: t.fontSize.sm.var,
            lineHeight: 1,
            '&:hover': {
              backgroundColor: t.color.background.subtle.var,
            },
            '&:focus-visible': {
              outline: `2px solid ${t.color.border.focus.var}`,
              outlineOffset: '-2px',
            },
          },
        },
        description: chrome.description,
        error: chrome.error,
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
export type NumberInputVariantProps = RecipeVariants<typeof numberInput>;
