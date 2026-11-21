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
import { size as sizeAxis, type ControlSize } from '../shared/variantAxes';
import {
  controlAppearancePaint,
  controlToneAssignments,
  neutralGhostHoverPaint,
  mapTone,
  tone,
} from '../shared/semanticTone';

const buttonAppearance = variant.enum(['solid', 'outline', 'subtle', 'ghost'], {
  default: 'subtle',
});
const buttonLayout = variant.enum(['default', 'icon'], { default: 'default' });
/**
 * Control sizes plus `xs`, for dense rows, tags and code-block headers, and `xl`, a
 * call-to-action size for heroes and marketing bands. Only the button family goes this small
 * or large: text-entry controls stop at the `sm`–`lg` control scale.
 */
const buttonSize = sizeAxis;

/** WCAG 2.2 target size (2.5.8): the minimum pointer target, in CSS px. */
const MIN_TARGET_SIZE = '24px';

/**
 * `xs` metrics: one step below `sm` on every axis. The visible box is 20px, so an invisible
 * `::after` grows the pointer target to 24px without changing layout. Keep a few px between
 * neighbouring `xs` buttons, or their targets overlap.
 */
const buttonXsSize = {
  boxSizing: 'border-box' as const,
  height: t.size.control.xs.var,
  minHeight: t.size.control.xs.var,
  fontSize: t.fontSize.xs.var,
  paddingInline: t.space.xs.var,
  paddingBlock: 0,
  gap: t.space.xxs.var,
  borderRadius: t.radius.sm.var,
  position: 'relative' as const,
  '&::after': {
    content: '""',
    position: 'absolute' as const,
    insetBlock: `min(0px, calc((100% - ${MIN_TARGET_SIZE}) / 2))`,
    insetInline: `min(0px, calc((100% - ${MIN_TARGET_SIZE}) / 2))`,
  },
};

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
          solid: controlAppearancePaint(vars, 'solid'),
          outline: controlAppearancePaint(vars, 'outline'),
          subtle: controlAppearancePaint(vars, 'subtle'),
          ghost: controlAppearancePaint(vars, 'ghost'),
        },
        size: {
          xs: buttonXsSize,
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
      compoundVariants: [
        {
          variants: { tone: 'neutral', appearance: 'ghost' },
          style: neutralGhostHoverPaint(vars),
        },
      ],
    };
  },
});

/** Visual props derived from the schema. */
export type ButtonVariantProps = RecipeVariants<typeof button>;
