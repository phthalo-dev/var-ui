import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Inline code snippet styling.
 *
 * ```tsx
 * <code className={inlineCode().className}>theme.className</code>
 * ```
 */
export const inlineCode = typestyles.recipe({
  name: 'inline-code',
  layer: 'components',
  vars: {
    background: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    border: {
      ...atProperty.color,
      value: t.color.border.subtle.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'inline',
        padding: `1px ${t.space[1].var}`,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
        backgroundColor: vars.background.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: vars.border.var,
        borderRadius: t.radius.sm.var,
      },
    };
  },
});
