import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * A message row: avatar + name/content/metadata. `sender` drives horizontal
 * alignment — `user` reverses the row so the avatar (if any) sits on the
 * trailing edge and text aligns to the end.
 *
 * ```tsx
 * <div className={chatMessage({ sender: 'assistant' }).root}>…</div>
 * ```
 */
export const chatMessage = typestyles.recipe(
  'chat-message',
  () => ({
    slots: ['root', 'avatar', 'header', 'name', 'content', 'metadata'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: t.space[2].var,
      },
      avatar: {
        flexShrink: 0,
      },
      header: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
      },
      name: {
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        minWidth: 0,
      },
      metadata: {
        fontSize: t.fontSize.xs.var,
        color: t.color.text.secondary.var,
      },
    },
    variants: {
      sender: {
        user: {
          root: { flexDirection: 'row-reverse' },
          header: { alignItems: 'flex-end' },
          content: { alignItems: 'flex-end' },
          metadata: { alignSelf: 'flex-end' },
        },
        assistant: {
          root: { flexDirection: 'row' },
          header: { alignItems: 'flex-start' },
          content: { alignItems: 'flex-start' },
          metadata: { alignSelf: 'flex-start' },
        },
      },
    },
    defaultVariants: { sender: 'assistant' },
  }),
  { layer: 'components' },
);
