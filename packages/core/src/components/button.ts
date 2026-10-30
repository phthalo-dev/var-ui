import { atProperty, type RecipeVariants, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { atForcedColors } from '../theme/conditions';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
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

export const button = typestyles.recipe({
  name: 'button',
  layer: 'components',
  variants: {
    tone,
    appearance: buttonAppearance,
    size: controlSize,
    layout: buttonLayout,
    elevated: variant.boolean({ default: false }),
  },
  vars: {
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
  },
  styles: ({ vars }) => {
    return {
      base: {
        appearance: 'none',
        ...border(vars.border.var),
        borderRadius: t.radius.md.var,
        backgroundColor: vars.background.var,
        // background: `linear-gradient(to bottom, transparent, ${v.border.var}), ${v.background.var}`,
        // backgroundBlendMode: "screen",
        color: vars.foreground.var,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        boxSizing: 'border-box',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space[2].var,
        transition: `${t.transition.borderShadow.var}, ${transitionOf('background-color')}, ${transitionOf('transform', 'fast')}`,
        '&:active': {
          transform: 'translateY(1px)',
        },
        '&:focus-visible': {
          ...focusRing,
        },
        '&[disabled]': {
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
        // Link-rendered buttons (`href`) have no `disabled` attribute.
        '&[aria-disabled="true"]': {
          opacity: t.opacity.disabled.var,
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
      },
      variants: {
        tone: mapTone((key) => toneChannelAssignments(vars, key)),
        appearance: {
          filled: controlAppearancePaint(vars, 'filled'),
          outline: controlAppearancePaint(vars, 'outline'),
          subtle: controlAppearancePaint(vars, 'subtle'),
          ghost: controlAppearancePaint(vars, 'ghost'),
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
});

/** Visual props derived from the schema. */
export type ButtonVariantProps = RecipeVariants<typeof button>;
