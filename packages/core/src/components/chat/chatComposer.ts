import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { focusRing } from '../focusRing';

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
export const chatComposer = typestyles.recipe({
  name: 'chat-composer',
  layer: 'components',
  slots: ['root', 'inputRow', 'input', 'actions'],
  vars: {
    border: { ...atProperty.color, value: t.color.border.default.var },
    background: { ...atProperty.color, value: t.color.background.surface.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: t.space[2].var,
          padding: t.space[2].var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          borderRadius: t.radius.lg.var,
          backgroundColor: vars.background.var,
          '&:focus-within': {
            ...focusRing,
            [vars.border.name]: t.color.border.focus.var,
          },
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
    };
  },
});

/** Visual props derived from the schema. */
export type ChatComposerVariantProps = RecipeVariants<typeof chatComposer>;
