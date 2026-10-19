import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { type RecipeVariants } from 'typestyles';
import {
  mapTone,
  semanticTone,
  subtleBackgroundColor,
  tone,
  type SemanticToneKey,
} from '../semanticTone';

function tonePaint(
  v: { color: { name: string }; background: { name: string } },
  key: SemanticToneKey,
) {
  const ch = semanticTone[key];
  return {
    root: {
      [v.color.name]: ch.foreground,
      [v.background.name]: subtleBackgroundColor(ch.foreground),
    },
  };
}

/**
 * Centered inline system message ("Alex joined", "Model switched to GPT-5").
 * Same tone vocabulary as every other component. Default is `neutral`.
 *
 * ```tsx
 * <div className={chatSystemMessage({ tone: 'info' }).root}>…</div>
 * ```
 */
export const chatSystemMessage = typestyles.recipe(
  'chat-system-message',
  {
    slots: ['root', 'icon', 'text'],
    variants: { tone },
  },
  (c) => {
    const v = c.vars({
      color: { value: t.color.text.secondary.var, syntax: '<color>' },
      background: { value: t.color.background.subtle.var, syntax: '<color>' },
    });
    return {
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[1].var,
          alignSelf: 'center',
          padding: `${t.space[1].var} ${t.space[3].var}`,
          borderRadius: t.radius.full.var,
          backgroundColor: v.background.var,
          color: v.color.var,
          fontSize: t.fontSize.sm.var,
        },
        icon: {
          display: 'inline-flex',
          flexShrink: 0,
        },
        text: {
          margin: 0,
        },
      },
      variants: {
        tone: mapTone((key) => (key === 'neutral' ? { root: {} } : tonePaint(v, key))),
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ChatSystemMessageVariantProps = RecipeVariants<typeof chatSystemMessage>;
