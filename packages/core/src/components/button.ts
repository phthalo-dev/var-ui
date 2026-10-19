import { atProperty, type RecipeVariants, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import { controlSize } from '../shared/variantAxes';
import {
  controlAppearancePaint,
  mapTone,
  tone,
  toneChannelAssignments,
} from '../shared/semanticTone';

const buttonAppearance = variant.enum(['filled', 'outline', 'subtle', 'ghost'], {
  default: 'subtle',
});
const buttonLayout = variant.enum(['default', 'icon'], { default: 'default' });

export const button = typestyles.recipe(
  'button',
  {
    variants: {
      tone,
      appearance: buttonAppearance,
      size: controlSize,
      layout: buttonLayout,
      elevated: variant.boolean({ default: false }),
    },
  },
  (c) => {
    const v = c.vars({
      semantic: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      solidBg: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      solidFg: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      border: {
        ...atProperty.color,
        value: t.color.border.default.var,
      },
      background: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      foreground: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
    });
    return {
      base: {
        appearance: 'none',
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        // background: `linear-gradient(to bottom, transparent, ${v.border.var}), ${v.background.var}`,
        // backgroundBlendMode: "screen",
        color: v.foreground.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        boxSizing: 'border-box',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition:
          'background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 80ms ease',
        '&:active': {
          transform: 'translateY(1px)',
        },
        '&:focus-visible': {
          outline: `2px solid ${t.color.border.focus.var}`,
          outlineOffset: '2px',
        },
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      variants: {
        tone: mapTone((key) => toneChannelAssignments(v, key)),
        appearance: {
          filled: controlAppearancePaint(v, 'filled'),
          outline: controlAppearancePaint(v, 'outline'),
          subtle: controlAppearancePaint(v, 'subtle'),
          ghost: controlAppearancePaint(v, 'ghost'),
        },
        size: controlSizeVariants((size) => controlSurfaceSize(size)),
        layout: {
          default: {},
          icon: {
            padding: 0,
            aspectRatio: '1',
            width: 'auto',
          },
        },
        elevated: {
          true: {
            boxShadow: t.shadow.md.var,
          },
          false: {},
        },
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ButtonVariantProps = RecipeVariants<typeof button>;
