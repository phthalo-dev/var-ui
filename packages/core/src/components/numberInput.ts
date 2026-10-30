import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import { fieldChrome } from '../internal/fieldChrome';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

export const numberInput = typestyles.recipe({
  name: 'number-input',
  layer: 'components',
  slots: ['root', 'label', 'group', 'input', 'stepper', 'description', 'error'],
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
    descriptionColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    errorColor: {
      ...atProperty.color,
      value: t.color.tone.danger.foreground.var,
    },
    stepperBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    stepperForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
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
        group: {
          display: 'flex',
          alignItems: 'stretch',
        },
        input: {
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          ...border(vars.inputBorder.var),
          borderStartStartRadius: t.radius.md.var,
          borderEndStartRadius: t.radius.md.var,
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          '&:focus': {
            ...focusRing,
            [vars.inputBorder.name]: t.color.border.focus.var,
          },
        },
        stepper: {
          display: 'flex',
          flexDirection: 'column',
          ...border(vars.inputBorder.var),
          borderInlineStart: 'none',
          borderStartStartRadius: 0,
          borderEndStartRadius: 0,
          borderStartEndRadius: t.radius.md.var,
          borderEndEndRadius: t.radius.md.var,
          '& button': {
            appearance: 'none',
            border: 'none',
            backgroundColor: vars.stepperBackground.var,
            color: vars.stepperForeground.var,
            padding: `${t.space[1].var} ${t.space[2].var}`,
            cursor: 'pointer',
            fontSize: t.fontSize.sm.var,
            lineHeight: 1,
            '&:first-child': {
              borderStartEndRadius: t.radius.md.var,
            },
            '&:last-child': {
              borderEndEndRadius: t.radius.md.var,
            },
            '&:hover': {
              backgroundColor: t.color.background.subtle.var,
            },
            '&:focus-visible': {
              ...focusRing,
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
});

/** Visual props derived from the schema. */
export type NumberInputVariantProps = RecipeVariants<typeof numberInput>;
