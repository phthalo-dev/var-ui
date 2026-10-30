import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { border } from '../internal/border';
import { designTokens as t } from '../tokens';

/**
 * Keyboard key cap for shortcut hints.
 *
 * ```tsx
 * <kbd className={kbd().className}>⌘K</kbd>
 * ```
 */
export const kbd = typestyles.recipe({
  name: 'kbd',
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
        display: 'inline-block',
        padding: `1px ${t.space[1].var}`,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.medium.var,
        lineHeight: t.lineHeight.normal.var,
        color: t.color.text.secondary.var,
        backgroundColor: vars.background.var,
        ...border(vars.border.var),
        borderBlockEndWidth: '2px',
        borderRadius: t.radius.sm.var,
        whiteSpace: 'nowrap',
      },
    };
  },
});
