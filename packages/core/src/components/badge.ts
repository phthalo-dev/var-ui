import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  mapTone,
  subtleBackgroundColor,
  subtleBorderColor,
  surfaceAppearance,
  tone,
  toneChannelAssignments,
} from '../shared/semanticTone';

/**
 * Flat component: `tone` sets semantic channels; `appearance` applies shared resolver paint.
 */
export const badge = typestyles.recipe(
  'badge',
  {
    variants: {
      tone,
      appearance: surfaceAppearance,
    },
  },
  (c) => {
    const v = c.vars({
      semantic: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      solidBg: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      solidFg: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      borderColor: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      backgroundColor: {
        ...atProperty.color,
        value: t.color.background.subtle.var,
      },
      textColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
    });
    return {
      vars: v,
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: 1,
        padding: `${t.space[1].var} ${t.space[2].var}`,
        borderRadius: t.radius.full.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.borderColor.var,
        backgroundColor: v.backgroundColor.var,
        color: v.textColor.var,
      },
      variants: {
        tone: mapTone((key) => toneChannelAssignments(v, key)),
        appearance: {
          subtle: {
            [v.borderColor.name]: subtleBorderColor(v.semantic.var),
            [v.backgroundColor.name]: subtleBackgroundColor(v.semantic.var),
            [v.textColor.name]: v.semantic.var,
          },
          solid: {
            [v.borderColor.name]: v.solidBg.var,
            [v.backgroundColor.name]: v.solidBg.var,
            [v.textColor.name]: v.solidFg.var,
          },
          outline: {
            [v.borderColor.name]: v.semantic.var,
            [v.backgroundColor.name]: 'transparent',
            [v.textColor.name]: v.semantic.var,
          },
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type BadgeVariantProps = RecipeVariants<typeof badge>;
