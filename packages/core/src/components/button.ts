import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, controlSurfaceSize } from './controlSize';
import {
  controlAppearancePaint,
  neutralChannelAssignments,
  semanticChannelAssignments,
  type ButtonTone,
  type ToneAppearance,
} from './semanticTone';

export const button = typestyles.recipe(
  'button',
  (c) => {
    const v = c.vars({
      semantic: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      solidBg: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      solidFg: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
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
        tone: {
          neutral: neutralChannelAssignments(v),
          accent: semanticChannelAssignments(v, 'accent'),
          success: semanticChannelAssignments(v, 'success'),
          warning: semanticChannelAssignments(v, 'warning'),
          danger: semanticChannelAssignments(v, 'danger'),
          info: semanticChannelAssignments(v, 'info'),
        },
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
      defaultVariants: {
        tone: 'neutral',
        appearance: 'subtle',
        size: 'md',
        layout: 'default',
        elevated: 'false',
      },
    };
  },
  { layer: 'components' },
);

export type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

const INTENT_TO_VARIANTS: Record<ButtonIntent, { tone: ButtonTone; appearance: ToneAppearance }> = {
  primary: { tone: 'accent', appearance: 'filled' },
  secondary: { tone: 'neutral', appearance: 'subtle' },
  ghost: { tone: 'accent', appearance: 'ghost' },
  danger: { tone: 'danger', appearance: 'filled' },
  outline: { tone: 'accent', appearance: 'outline' },
};

export type ButtonRecipeProps = NonNullable<Parameters<typeof button>[0]>;

export type ButtonOptions = Omit<ButtonRecipeProps, 'elevated'> & {
  /** Shorthand for common `tone` + `appearance` pairs. */
  intent?: ButtonIntent;
  /** Applies a soft elevation shadow from the shadow design tokens. */
  elevated?: boolean;
};

/** Recipe variant props shared by React, Astro, and other Button wrappers. */
export type ButtonVariantProps = {
  /** Shorthand for common `tone` + `appearance` pairs. Ignored when `tone` is set. */
  intent?: ButtonIntent;
  /** Semantic color family. */
  tone?: ButtonTone;
  /** Surface treatment from the shared tone resolver. */
  appearance?: ToneAppearance;
  size?: ButtonRecipeProps['size'];
  layout?: ButtonRecipeProps['layout'];
  /** Applies a soft elevation shadow from the shadow design tokens. */
  elevated?: boolean;
};

/** Prop metadata for Astro/docs props tables when `Props extends ButtonVariantProps`. */
export const buttonVariantPropDocs = [
  { name: 'intent', type: 'ButtonIntent', required: false },
  { name: 'tone', type: 'ButtonTone', required: false },
  { name: 'appearance', type: 'ToneAppearance', required: false },
  { name: 'size', type: 'ControlSize', required: false },
  { name: 'layout', type: "'default' | 'icon'", required: false },
  { name: 'elevated', type: 'boolean', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof ButtonVariantProps;
  type: string;
  required: false;
}>;

/** Maps `intent` shorthand onto `tone` + `appearance` for `button(...)`. */
export function resolveButtonProps(props?: ButtonOptions): ButtonRecipeProps {
  const { intent, tone, appearance, elevated, ...rest } = props ?? {};
  const elevatedVariant: Pick<ButtonRecipeProps, 'elevated'> | Record<string, never> =
    elevated != null ? { elevated: elevated ? 'true' : 'false' } : {};
  if (intent) {
    const mapped = INTENT_TO_VARIANTS[intent];
    return {
      ...rest,
      ...elevatedVariant,
      tone: tone ?? mapped.tone,
      appearance: appearance ?? mapped.appearance,
    };
  }
  return {
    ...rest,
    ...elevatedVariant,
    ...(tone != null ? { tone } : {}),
    ...(appearance != null ? { appearance } : {}),
  };
}

export const linkButton = button;
