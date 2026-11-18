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
        // A centered cap: one glyph is a square, longer labels grow with even side padding.
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.125rem',
        boxSizing: 'border-box',
        minWidth: '1.25rem',
        height: '1.25rem',
        paddingBlock: 0,
        paddingInline: '0.3125rem',
        fontFamily: t.fontFamily.mono.var,
        fontSize: '0.6875rem',
        fontWeight: t.fontWeight.medium.var,
        lineHeight: 1,
        verticalAlign: 'middle',
        color: t.color.text.secondary.var,
        backgroundColor: vars.background.var,
        ...border(vars.border.var),
        borderBlockEndWidth: '0.125rem',
        borderRadius: t.radius.sm.var,
        whiteSpace: 'nowrap',
      },
    };
  },
});
