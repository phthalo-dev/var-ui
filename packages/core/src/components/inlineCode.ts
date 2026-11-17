import { atProperty, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { border } from '../internal/border';
import { designTokens as t } from '../tokens';

/**
 * Inline code snippet styling.
 *
 * ```tsx
 * <code className={inlineCode().className}>theme.className</code>
 * <code className={inlineCode({ nowrap: true }).className}>@var-ui/react</code>
 * ```
 */
export const inlineCode = typestyles.recipe({
  name: 'inline-code',
  layer: 'components',
  variants: {
    /** Keeps the snippet on one line: package names and identifiers never split at `-` or `/`. */
    nowrap: variant.boolean({ default: false }),
  },
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
        padding: `0.0625rem ${t.space.xxs.var}`,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
        backgroundColor: vars.background.var,
        ...border(vars.border.var),
        borderRadius: t.radius.sm.var,
      },
      variants: {
        nowrap: {
          false: {},
          true: { whiteSpace: 'nowrap' },
        },
      },
    };
  },
});
