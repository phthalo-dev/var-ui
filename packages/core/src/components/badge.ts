import { type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  mapTone,
  subtleBackgroundColor,
  subtleBorderColor,
  surfaceAppearance,
  tone,
  toneChannelAssignments,
} from './semanticTone';

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

export const badgeVariantPropDocs = [
  { name: 'tone', type: 'Tone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof BadgeVariantProps;
  type: string;
  required: false;
}>;
