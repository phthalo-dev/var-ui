import { atProperty, type RecipeVariants, variant } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { pressNudge } from '../internal/press';
import { atForcedColors } from '../theme/conditions';
import { controlSizeVariants, controlSurfaceSize } from '../internal/controlSize';
import type { ControlSize } from '../shared/variantAxes';
import {
  controlAppearancePaint,
  controlToneAssignments,
  mapTone,
  subtleBackgroundColor,
  tone,
} from '../shared/semanticTone';

const buttonAppearance = variant.enum(['filled', 'outline', 'subtle', 'ghost'], {
  default: 'subtle',
});
const buttonLayout = variant.enum(['default', 'icon'], { default: 'default' });
/** Control sizes plus `xl`, a call-to-action size for heroes and marketing bands. */
const buttonSize = variant.enum(['sm', 'md', 'lg', 'xl'], { default: 'md' });

/** `xl` call-to-action metrics: one step above `lg` on every axis. */
const buttonXlSize = {
  boxSizing: 'border-box' as const,
  height: t.size.control.xl.var,
  minHeight: t.size.control.xl.var,
  fontSize: t.fontSize.lg.var,
  paddingInline: t.space.xl.var,
  paddingBlock: 0,
  gap: t.space.sm.var,
};

export const button = typestyles.recipe({
  name: 'button',
  layer: 'components',
  variants: {
    tone,
    appearance: buttonAppearance,
    size: buttonSize,
    layout: buttonLayout,
    elevated: variant.boolean({ default: false }),
    /** Fully rounded ends. */
    pill: variant.boolean({ default: false }),
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
    ghostHover: {
      ...atProperty.color,
      value: subtleBackgroundColor(t.color.text.primary.var),
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
        gap: t.space.xs.var,
        transition: `${t.transition.borderShadow.var}, ${transitionOf('background-color')}, ${transitionOf('transform', 'fast')}`,
        '&:active': pressNudge,
        '&:focus-visible': {
          ...focusRing,
        },
        '&[disabled]': {
          opacity: t.opacity.disabled.var,
          // Disabled reads as inert in every tone: drain the hue, not just the opacity.
          filter: 'grayscale(0.9)',
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
        // Link-rendered buttons (`href`) have no `disabled` attribute.
        '&[aria-disabled="true"]': {
          opacity: t.opacity.disabled.var,
          // Disabled reads as inert in every tone: drain the hue, not just the opacity.
          filter: 'grayscale(0.9)',
          cursor: 'not-allowed',
          ...atForcedColors(forced.disabled),
        },
      },
      variants: {
        tone: mapTone((key) => controlToneAssignments(vars, key)),
        appearance: {
          filled: controlAppearancePaint(vars, 'filled'),
          outline: controlAppearancePaint(vars, 'outline'),
          subtle: controlAppearancePaint(vars, 'subtle'),
          ghost: controlAppearancePaint(vars, 'ghost'),
        },
        size: {
          ...controlSizeVariants((size: ControlSize) => controlSurfaceSize(size)),
          xl: buttonXlSize,
        },
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
        pill: {
          true: {
            borderRadius: t.radius.full.var,
          },
          false: {},
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ButtonVariantProps = RecipeVariants<typeof button>;
