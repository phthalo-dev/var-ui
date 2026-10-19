import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

export const textAreaField = typestyles.recipe(
  'text-area-field',
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
    return {
      slots: ['root', 'label', 'input', 'description', 'error'],
      ...fieldChrome({
        label: v.labelColor.var,
        description: v.descriptionColor.var,
        error: v.errorColor.var,
      }),
      input: {
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.inputBorder.var,
        borderRadius: t.radius.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        fontSize: t.fontSize.md.var,
        backgroundColor: v.inputBackground.var,
        color: v.inputForeground.var,
        minHeight: '88px',
        resize: 'vertical',
        '&:focus': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '1px',
          [v.inputBorder.name]: t.color.border.focus.var,
        },
        '&::placeholder': {
          color: v.placeholderColor.var,
        },
      },
    };
  },
  { layer: 'components' },
);
