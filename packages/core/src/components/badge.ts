import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
  type SurfaceAppearance,
} from './semanticTone';

/**
 * Flat component: `tone` sets semantic channels; `appearance` applies shared resolver paint.
 */
export const badge = typestyles.recipe(
  'badge',
  (c) => {
    const v = c.vars({
      semantic: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      solidBg: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      solidFg: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      borderColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      backgroundColor: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      textColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
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
        tone: {
          neutral: {
            [v.semantic.name]: t.color.text.secondary.var,
            [v.solidBg.name]: t.color.text.primary.var,
            [v.solidFg.name]: t.color.background.surface.var,
          },
          accent: semanticChannelAssignments(v, 'accent'),
          success: semanticChannelAssignments(v, 'success'),
          warning: semanticChannelAssignments(v, 'warning'),
          danger: semanticChannelAssignments(v, 'danger'),
          tip: semanticChannelAssignments(v, 'info'),
        },
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
      defaultVariants: { tone: 'neutral', appearance: 'subtle' },
    };
  },
  { layer: 'components' },
);

export type BadgeRecipeProps = NonNullable<Parameters<typeof badge>[0]>;
export type BadgeTone = NonNullable<BadgeRecipeProps['tone']>;
export type BadgeVariantProps = {
  tone?: BadgeTone;
  appearance?: SurfaceAppearance;
};

export const badgeVariantPropDocs = [
  { name: 'tone', type: 'BadgeTone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof BadgeVariantProps;
  type: string;
  required: false;
}>;
