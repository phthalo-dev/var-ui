import { atProperty, type RecipeVariants, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  appearanceSurface,
  mapTone,
  surfaceAppearance,
  toneChannelAssignments,
  toneWithDefault,
} from '../shared/semanticTone';

/**
 * Slot recipe. The schema definition is the source of the visual props:
 *
 * - **tone** assigns semantic colors on `root` (custom properties). `title` uses
 *   `color: var(semantic)` in base styles (the var inherits from `root`).
 * - **appearance** chooses how those tokens are applied (tinted surface vs solid fill).
 * - **contentGap** spaces the body under a title. React and Astro derive it from `title`.
 *
 * Tone channels and the shared appearance axis live in `shared/semanticTone.ts`.
 */
const alertTone = toneWithDefault('info');
const alertContentGap = variant.enum(['spaced', 'flush'], { default: 'spaced' });

export const alert = typestyles.recipe({
  name: 'alert',
  layer: 'components',
  slots: ['root', 'icon', 'body', 'title', 'content', 'action', 'actionLink'],
  variants: {
    tone: alertTone,
    appearance: surfaceAppearance,
    contentGap: alertContentGap,
  },
  vars: {
    semantic: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    solidBg: {
      ...atProperty.color,
      value: t.color.tone.accent.background.var,
    },
    solidFg: {
      ...atProperty.color,
      value: t.color.tone.accent.foregroundOnBackground.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space[3].var,
          padding: t.space[4].var,
          borderRadius: t.radius.md.var,
          lineHeight: 1.55,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          fontSize: t.fontSize.lg.var,
          lineHeight: 1,
        },
        body: {
          flex: 1,
          minWidth: 0,
        },
        title: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          margin: 0,
          color: vars.semantic.var,
        },
        content: {
          fontSize: t.fontSize.md.var,
          margin: 0,
          color: 'inherit',
        },
        action: {
          marginTop: t.space[2].var,
        },
        actionLink: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: 'inherit',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          '&:hover': {
            textDecoration: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
            borderRadius: t.radius.sm.var,
          },
        },
      },
      variants: {
        tone: mapTone((key) => ({ root: toneChannelAssignments(vars, key) })),
        appearance: {
          subtle: {
            root: appearanceSurface(vars, 'subtle'),
          },
          solid: {
            root: appearanceSurface(vars, 'solid'),
            title: { color: 'inherit' },
            icon: { color: 'inherit' },
          },
          outline: {
            root: appearanceSurface(vars, 'outline'),
          },
        },
        contentGap: {
          spaced: { content: { marginTop: t.space[1].var } },
          flush: { content: { marginTop: 0 } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type AlertVariantProps = RecipeVariants<typeof alert>;
