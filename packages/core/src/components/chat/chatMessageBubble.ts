import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * The chat "bubble." Sender drives background/text color via `c.vars()` so
 * themes can override user vs. assistant independently.
 *
 * Grouped corners (`group`) tighten symmetrically (top and/or bottom
 * uniformly) for consecutive same-sender bubbles — a deliberate
 * simplification vs. a sender-aware compound grid, avoiding a
 * `sender × group` variant matrix. Revisit only if per-side corner
 * tightening becomes a real visual requirement.
 *
 * ```tsx
 * <div className={chatMessageBubble({ sender: 'user' }).root}>Hi!</div>
 * ```
 */
export const chatMessageBubble = typestyles.recipe(
  'chat-message-bubble',
  (c) => {
    const v = c.vars({
      senderBackground: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      senderText: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root'],
      base: {
        root: {
          display: 'inline-flex',
          flexDirection: 'column',
          maxWidth: 'min(80%, 480px)',
          padding: `${t.space[3].var} ${t.space[4].var}`,
          borderRadius: t.radius.lg.var,
          backgroundColor: v.senderBackground.var,
          color: v.senderText.var,
          fontSize: t.fontSize.md.var,
          lineHeight: 1.55,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        },
      },
      variants: {
        sender: {
          user: {
            root: {
              [v.senderBackground.name]: t.color.tone.accent.background.var,
              [v.senderText.name]: t.color.tone.accent.foregroundOnBackground.var,
            },
          },
          assistant: {
            root: {
              [v.senderBackground.name]: t.color.background.subtle.var,
              [v.senderText.name]: t.color.text.primary.var,
            },
          },
        },
        variant: {
          filled: { root: {} },
          ghost: {
            root: {
              backgroundColor: 'transparent',
              color: t.color.text.primary.var,
              padding: `${t.space[1].var} 0`,
            },
          },
        },
        group: {
          none: { root: {} },
          first: {
            root: {
              borderBottomLeftRadius: t.radius.sm.var,
              borderBottomRightRadius: t.radius.sm.var,
            },
          },
          middle: {
            root: {
              borderTopLeftRadius: t.radius.sm.var,
              borderTopRightRadius: t.radius.sm.var,
              borderBottomLeftRadius: t.radius.sm.var,
              borderBottomRightRadius: t.radius.sm.var,
            },
          },
          last: {
            root: {
              borderTopLeftRadius: t.radius.sm.var,
              borderTopRightRadius: t.radius.sm.var,
            },
          },
        },
      },
      defaultVariants: { sender: 'assistant', variant: 'filled', group: 'none' },
    };
  },
  { layer: 'components' },
);
