import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

export const textAreaField = typestyles.recipe({
  name: 'text-area-field',
  layer: 'components',
  slots: ['root', 'label', 'input', 'description', 'error'],
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
    return {
      base: {
        ...fieldChrome({
          label: vars.labelColor.var,
          description: vars.descriptionColor.var,
          error: vars.errorColor.var,
        }),
        input: {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.inputBorder.var,
          borderRadius: t.radius.md.var,
          padding: `${t.space[2].var} ${t.space[3].var}`,
          fontSize: t.fontSize.md.var,
          backgroundColor: vars.inputBackground.var,
          color: vars.inputForeground.var,
          minHeight: '88px',
          resize: 'vertical',
          '&:focus': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
            [vars.inputBorder.name]: t.color.border.focus.var,
          },
          '&::placeholder': {
            color: vars.placeholderColor.var,
          },
        },
      },
    };
  },
});
