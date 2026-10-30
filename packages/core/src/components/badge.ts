import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { border } from '../internal/border';
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
export const badge = typestyles.recipe({
  name: 'badge',
  layer: 'components',
  variants: {
    tone,
    appearance: surfaceAppearance,
  },
  vars: {
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
  },
  styles: ({ vars }) => {
    return {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        lineHeight: 1,
        padding: `${t.space[1].var} ${t.space[2].var}`,
        borderRadius: t.radius.full.var,
        ...border(vars.borderColor.var),
        backgroundColor: vars.backgroundColor.var,
        color: vars.textColor.var,
      },
      variants: {
        tone: mapTone((key) => toneChannelAssignments(vars, key)),
        appearance: {
          subtle: {
            [vars.borderColor.name]: subtleBorderColor(vars.semantic.var),
            [vars.backgroundColor.name]: subtleBackgroundColor(vars.semantic.var),
            [vars.textColor.name]: vars.semantic.var,
          },
          solid: {
            [vars.borderColor.name]: vars.solidBg.var,
            [vars.backgroundColor.name]: vars.solidBg.var,
            [vars.textColor.name]: vars.solidFg.var,
          },
          outline: {
            [vars.borderColor.name]: vars.semantic.var,
            [vars.backgroundColor.name]: 'transparent',
            [vars.textColor.name]: vars.semantic.var,
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type BadgeVariantProps = RecipeVariants<typeof badge>;
