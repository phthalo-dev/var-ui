import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './field';

export const textAreaField = typestyles.recipe(
  'text-area-field',
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
