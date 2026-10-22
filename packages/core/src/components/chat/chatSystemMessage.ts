import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { atProperty, type RecipeVariants } from 'typestyles';
import {
  mapTone,
  semanticTone,
  subtleBackgroundColor,
  tone,
  type SemanticToneKey,
} from '../../shared/semanticTone';

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
export const chatSystemMessage = typestyles.recipe({
  name: 'chat-system-message',
  layer: 'components',
  slots: ['root', 'icon', 'text'],
  variants: { tone },
  vars: {
    color: { ...atProperty.color, value: t.color.text.secondary.var },
    background: { ...atProperty.color, value: t.color.background.subtle.var },
  },
  styles: ({ vars }) => {
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
          backgroundColor: vars.background.var,
          color: vars.color.var,
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
        tone: mapTone((key) => (key === 'neutral' ? { root: {} } : tonePaint(vars, key))),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ChatSystemMessageVariantProps = RecipeVariants<typeof chatSystemMessage>;
