import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Composer chrome: a bordered container around the message textarea and a
 * trailing actions slot (typically the send button).
 *
 * ```tsx
 * const c = chatComposer();
 * <div className={c.root}>
 *   <div className={c.inputRow}><textarea className={c.input} /></div>
 *   <div className={c.actions}>{sendButton}</div>
 * </div>
 * ```
 */
export const chatComposer = typestyles.recipe(
  'chat-composer',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
      background: { value: t.color.background.surface.var, syntax: '<color>' },
    });
    return {
      slots: ['root', 'inputRow', 'input', 'actions'],
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: t.space[2].var,
          padding: t.space[2].var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          borderRadius: t.radius.lg.var,
          backgroundColor: v.background.var,
        },
        inputRow: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
        },
        input: {
          flex: 1,
          minWidth: 0,
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'inherit',
          fontSize: t.fontSize.md.var,
          lineHeight: '22px',
          color: t.color.text.primary.var,
          padding: t.space[1].var,
          '&::placeholder': { color: t.color.text.secondary.var },
        },
        actions: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1].var,
          flexShrink: 0,
        },
      },
      variants: {
        appearance: {
          default: {},
        },
      },
      defaultVariants: { appearance: 'default' },
    };
  },
  { layer: 'components' },
);
