import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { sender } from '../../shared/variantAxes';
import { forced } from '../../internal/forcedColors';
import { atForcedColors } from '../../theme/conditions';

const bubbleAppearance = variant.enum(['solid', 'subtle', 'ghost'], { default: 'solid' });
const bubbleGroup = variant.enum(['none', 'first', 'middle', 'last'], { default: 'none' });

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
export const chatMessageBubble = typestyles.recipe({
  name: 'chat-message-bubble',
  layer: 'components',
  slots: ['root'],
  variants: {
    sender,
    appearance: bubbleAppearance,
    group: bubbleGroup,
  },
  vars: {
    senderBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    senderText: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          // A block formatting context, not a flex column: inline markup in a message
          // (`<code>`, links, emphasis) flows with the text instead of becoming its own row,
          // and block children (paragraphs, lists) still stack.
          display: 'inline-block',
          maxWidth: '100%',
          padding: `${t.space.sm.var} ${t.space.md.var}`,
          borderRadius: t.radius.lg.var,
          backgroundColor: vars.senderBackground.var,
          color: vars.senderText.var,
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
              [vars.senderBackground.name]: t.color.tone.accent.background.var,
              [vars.senderText.name]: t.color.tone.accent.foregroundOnBackground.var,
            },
          },
          assistant: {
            root: {
              [vars.senderBackground.name]: t.color.background.subtle.var,
              [vars.senderText.name]: t.color.text.primary.var,
            },
          },
        },
        appearance: {
          solid: { root: { ...atForcedColors(forced.boundary) } },
          subtle: {
            root: {
              // User bubbles drop the solid accent fill for a subtle one so
              // arbitrary inline content (links, markdown spans) stays
              // readable; higher specificity than the sender var overrides.
              '&[data-sender="user"]': {
                [vars.senderBackground.name]: t.color.tone.accent.subtleBackground.var,
                [vars.senderText.name]: t.color.text.primary.var,
              },
            },
          },
          ghost: {
            root: {
              backgroundColor: 'transparent',
              color: t.color.text.primary.var,
              padding: `${t.space.xxs.var} 0`,
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
    };
  },
});

/** Visual props derived from the schema. */
export type ChatMessageBubbleVariantProps = RecipeVariants<typeof chatMessageBubble>;
