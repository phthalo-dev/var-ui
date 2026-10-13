import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Keyboard key cap for shortcut hints.
 *
 * ```tsx
 * <kbd className={kbd()}>⌘K</kbd>
 * ```
 */
export const kbd = typestyles.recipe(
  'kbd',
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
        display: 'inline-block',
        padding: `1px ${t.space[1].var}`,
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.medium.var,
        lineHeight: t.lineHeight.normal.var,
        color: t.color.text.secondary.var,
        backgroundColor: v.background.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderBottomWidth: '2px',
        borderRadius: t.radius.sm.var,
        whiteSpace: 'nowrap',
      },
    };
  },
  { layer: 'components' },
);
