import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Inline code snippet styling.
 *
 * ```tsx
 * <code className={inlineCode()}>theme.className</code>
 * ```
 */
export const inlineCode = typestyles.recipe(
  'inline-code',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.subtle.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        display: 'inline',
        padding: `1px ${t.space[1].var}`,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
        backgroundColor: v.background.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.sm.var,
      },
    };
  },
  { layer: 'components' },
);
