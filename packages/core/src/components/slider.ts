import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from '../internal/fieldChrome';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { controlSizeVariants } from '../internal/controlSize';
import { controlSize, type ControlSize } from '../shared/variantAxes';

/** Track thickness, thumb diameter and the control row height (thumb plus a small halo) per size. */
const sliderSize: Record<ControlSize, { track: string; thumb: string }> = {
  sm: { track: `calc(${t.space.xxs.var} / 2)`, thumb: t.size.icon.sm.var },
  md: { track: t.space.xxs.var, thumb: t.size.icon.md.var },
  lg: { track: `calc(${t.space.xxs.var} * 1.5)`, thumb: t.size.icon.lg.var },
};

const sliderVarDefinitions = {
  labelColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  trackBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  fillBackground: {
    ...atProperty.color,
    value: t.color.tone.accent.foreground.var,
  },
  thumbBackground: {
    ...atProperty.color,
    value: t.color.background.surface.var,
  },
  thumbBorder: {
    ...atProperty.color,
    value: t.color.tone.accent.foreground.var,
  },
  outputColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  descriptionColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  errorColor: {
    ...atProperty.color,
    value: t.color.tone.danger.foreground.var,
  },
  trackHeight: {
    ...atProperty.length,
    value: t.space.xxs.var,
  },
  thumbSize: {
    ...atProperty.length,
    value: t.size.icon.md.var,
  },
  controlHeight: {
    ...atProperty.length,
    value: t.size.icon.lg.var,
  },
  thumbBorderWidth: {
    ...atProperty.length,
    value: t.borderWidth.thick.var,
  },
  fillWidth: {
    ...atProperty.percentage,
    value: '0%',
  },
} as const;

export const slider = typestyles.recipe({
  name: 'slider',
  layer: 'components',
  slots: ['root', 'label', 'description', 'error', 'control', 'track', 'fill', 'thumb', 'output'],
  variants: { size: controlSize },
  vars: sliderVarDefinitions,
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    return {
      base: {
        root: {
          ...chrome.root,
          minWidth: `calc(15 * ${t.space.md.var})`,
        },
        label: {
          ...chrome.label,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
        },
        description: chrome.description,
        error: chrome.error,
        control: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: vars.controlHeight.var,
        },
        track: {
          position: 'relative',
          width: '100%',
          height: vars.trackHeight.var,
          borderRadius: t.radius.full.var,
          backgroundColor: vars.trackBackground.var,
          overflow: 'hidden',
          pointerEvents: 'none',
          ...atForcedColors(forced.track),
        },
        fill: {
          height: '100%',
          width: vars.fillWidth.var,
          borderRadius: 'inherit',
          backgroundColor: vars.fillBackground.var,
          pointerEvents: 'none',
          ...atForcedColors(forced.fill),
        },
        thumb: {
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: vars.thumbSize.var,
          height: vars.thumbSize.var,
          boxSizing: 'border-box',
          borderRadius: t.radius.full.var,
          borderWidth: vars.thumbBorderWidth.var,
          borderStyle: 'solid',
          borderColor: vars.thumbBorder.var,
          backgroundColor: vars.thumbBackground.var,
          boxShadow: t.shadow.sm.var,
          '&:focus-visible': {
            ...focusRing,
          },
        },
        output: {
          fontSize: t.fontSize.sm.var,
          color: vars.outputColor.var,
        },
      },
      variants: {
        // Set on `control` (not `root`): React styles the RAC root through `className` only, so
        // the root carries no `data-size`. Track, fill and thumb all sit inside `control`.
        size: controlSizeVariants((size) => ({
          control: {
            [vars.trackHeight.name]: sliderSize[size].track,
            [vars.thumbSize.name]: sliderSize[size].thumb,
            [vars.controlHeight.name]: `calc(${sliderSize[size].thumb} + ${t.space.xxs.var})`,
          },
        })),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SliderVariantProps = RecipeVariants<typeof slider>;
